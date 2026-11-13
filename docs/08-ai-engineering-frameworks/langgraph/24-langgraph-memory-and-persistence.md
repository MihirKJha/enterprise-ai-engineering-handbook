---
title: "LangGraph Memory and Persistence — Threads, Checkpointers and Stores"
description: "Learn how LangGraph uses thread-scoped checkpointers for conversation continuity and cross-thread stores for long-term memory. Explore thread IDs, namespaces, runtime context and practical patterns for building memory-aware agents." 
keywords:
  - LangGraph Memory
  - LangGraph Persistence
  - LangGraph Checkpointer
  - LangGraph Thread ID
  - LangGraph Store
  - LangGraph Long-Term Memory
  - LangGraph Short-Term Memory
  - InMemorySaver
  - InMemoryStore
  - LangGraph Runtime Context
  - Enterprise Agent Memory
  - Stateful AI Applications
---

# 24 — LangGraph Memory and Persistence

> A useful agent should remember the conversation it is having, retain only the facts worth keeping, and know which information belongs to which customer.

## Overview

Imagine a customer tells a support agent, “Please send updates by email.” Ten minutes later, the customer asks, “What is happening with my case?” The agent needs the current conversation. Next week, in a new conversation, the customer asks for another update. The email preference may still be useful.

Those are two different memory problems:

- **Conversation continuity:** retain the state of this thread.
- **Long-term memory:** make selected information available across threads.

LangGraph addresses them with two complementary mechanisms: **checkpointers** and **stores**. This chapter focuses on those LangGraph APIs and how they fit together. It does not re-teach graph state design, workflow routing, tool execution or human-approval mechanics covered elsewhere in this part.

## 1. Two kinds of persistence, two different jobs

| Mechanism | What it keeps | Scope | Typical use |
|---|---|---|---|
| Checkpointer | Graph state snapshots | One thread | Conversation continuity and execution recovery |
| Store | Application-defined records | Across threads, by namespace/key | User preferences and selected durable facts |

A checkpointer saves the graph’s state at super-step boundaries. A store holds data that the application chooses to retain independently of a particular graph execution.

<CodeBlock language="mermaid" editable>
flowchart TB
    U[Customer] --> G[LangGraph graph]
    G --> S[Thread state]
    S --> CP[(Checkpointer)]
    CP -->|same thread_id| R[Load thread state]
    G -->|read or write selected facts| MS[(Long-term store)]
    MS -->|namespace + key| G
    G --> O[Response]
</CodeBlock>

Think of the checkpointer as the conversation’s saved working state. Think of the store as a separate notebook of selected information. Neither is a replacement for a system of record such as a CRM, payments database or policy repository.

## 2. Short-term memory: threads and checkpointers

A **thread** is the identifier LangGraph uses to group a sequence of graph runs and their checkpoints. When a graph is compiled with a checkpointer, pass a `thread_id` in the configurable part of the invocation:

```python
config = {
    "configurable": {
        "thread_id": "support-thread-101"
    }
}
```

Use the same ID when a new message belongs to the same conversation. Use a different ID for a separate conversation or execution history.

<CodeBlock language="mermaid" editable>
flowchart LR
    U1[Customer conversation A] --> T1[thread-101]
    U2[Customer conversation B] --> T2[thread-202]
    T1 --> C1[(Checkpoints A)]
    T2 --> C2[(Checkpoints B)]
</CodeBlock>

Here is a small, complete example using `MessagesState`, which already provides message-aware state handling:

```python
from langchain_core.messages import AIMessage
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import MessagesState, StateGraph, START, END


def acknowledge(state: MessagesState):
    latest = state["messages"][-1]
    return {
        "messages": [
            AIMessage(content=f"I have received your message: {latest.content}")
        ]
    }

builder = StateGraph(MessagesState)
builder.add_node("acknowledge", acknowledge)
builder.add_edge(START, "acknowledge")
builder.add_edge("acknowledge", END)

checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "support-thread-101"}}

graph.invoke(
    {"messages": [{"role": "user", "content": "I was charged twice."}]},
    config,
)

graph.invoke(
    {"messages": [{"role": "user", "content": "Please check the status."}]},
    config,
)
```

The second invocation loads the saved thread state and adds the new message to that conversation. The example uses a deterministic acknowledgement so the persistence behavior is easy to see; replace it with your configured chat model in an actual agent.

**A thread ID is not a magic resume button.** A new input with an existing ID starts another run using that thread’s saved state. Resuming an interrupted run is a different operation; the exact interrupt/resume mechanics belong in Chapter 21. Checkpointing also supports inspecting prior state, but those debugging and time-travel details are outside this chapter’s scope.

`InMemorySaver` is useful for local experiments and tests. It stores data in process memory, so a process restart loses the checkpoints. Use a supported durable checkpointer for production deployments.

## 3. Long-term memory: stores, namespaces and keys

A customer preference should not have to live forever inside one conversation’s message history. LangGraph **stores** provide a separate key-value mechanism for information that can be reused across threads.

A store organizes records using:

- **Namespace:** a tuple that groups related records, often by tenant, user or application area.
- **Key:** the identifier of one record inside that namespace.
- **Value:** the structured data the application wants to retain.

For example, an application might keep a confirmed contact preference like this:

```python
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()

namespace = ("tenants", "tenant-7", "users", "user-42", "preferences")

store.put(
    namespace,
    "contact-channel",
    {
        "value": "email",
        "source": "user-confirmed",
    },
)

item = store.get(namespace, "contact-channel")
print(item.value["value"] if item else "not set")
```

`InMemoryStore` is suitable for examples and tests, not durable production storage. A store can also support search, but semantic/vector search is not automatically enabled by every configuration; it requires an index and embedding setup supported by the selected store.

One important security point: **a namespace is an organization mechanism, not an authorization mechanism.** The application must derive tenant and user identity from authenticated context and enforce access before reading or writing. Never let an LLM choose arbitrary tenant IDs or memory namespaces.

## 4. Bring both paths into one graph

The following pattern shows how a node can retrieve a preference from the store while the checkpointer independently maintains the conversation. The `model` variable represents a chat model configured by the application.

```python
from dataclasses import dataclass
from langchain_core.messages import SystemMessage
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import MessagesState, StateGraph, START, END
from langgraph.runtime import Runtime
from langgraph.store.memory import InMemoryStore


@dataclass
class RequestContext:
    tenant_id: str
    user_id: str


def answer(state: MessagesState, runtime: Runtime[RequestContext]):
    namespace = (
        "tenants", runtime.context.tenant_id,
        "users", runtime.context.user_id,
        "preferences",
    )

    item = runtime.store.get(namespace, "contact-channel")
    preference = item.value["value"] if item else "not specified"

    system_message = SystemMessage(
        content=f"Confirmed contact preference: {preference}. "
                "Use this as context, not as authorization."
    )
    response = model.invoke([system_message, *state["messages"]])
    return {"messages": [response]}


builder = StateGraph(MessagesState, context_schema=RequestContext)
builder.add_node("answer", answer)
builder.add_edge(START, "answer")
builder.add_edge("answer", END)

# Demo setup: seed a confirmed preference in the store.
store = InMemoryStore()
namespace = ("tenants", "tenant-7", "users", "user-42", "preferences")
store.put(namespace, "contact-channel", {
    "value": "email",
    "source": "user-confirmed",
})

# The in-memory backends keep this example self-contained.
graph = builder.compile(
    checkpointer=InMemorySaver(),
    store=store,
)

result = graph.invoke(
    {"messages": [{"role": "user", "content": "How should you contact me?"}]},
    {"configurable": {"thread_id": "support-thread-101"}},
    context=RequestContext(
        tenant_id="tenant-7",  # Demo values; use authenticated identity in production.
        user_id="user-42",
    ),
)
```

The important separation is visible in the invocation:

- `thread_id` selects the conversation state managed by the checkpointer.
- `context` carries trusted, run-specific identity used to scope memory access.
- `runtime.store` gives the node access to the configured store.

The example seeds a preference so the lookup has a visible result. Its tenant and user values are demonstration data; production values must come from the application’s authentication layer, not from the user’s prompt or model output. Treat retrieved memory as data, never as instructions that can override system policy. The example uses in-memory backends to keep the code compact; swap in supported durable implementations for deployment.

<CodeBlock language="mermaid" editable>
sequenceDiagram
    participant U as Customer
    participant G as LangGraph
    participant C as Checkpointer
    participant S as Store
    U->>G: New message + thread_id
    G->>C: Load thread state
    C-->>G: Conversation messages
    G->>S: Get preference using trusted identity
    S-->>G: Stored preference (if authorized)
    G->>G: Build bounded model context
    G->>C: Save updated graph state
    G-->>U: Response
</CodeBlock>

## 5. Memory should be selected, not accumulated blindly

A store can grow indefinitely. That does not mean every conversation detail deserves a permanent record or belongs in every prompt.

A sensible memory path is:

```text
Candidate fact
    ↓
Validate source and usefulness
    ↓
Apply write policy
    ↓
Store with scope and provenance
    ↓
Retrieve only when relevant
    ↓
Authorize and filter
    ↓
Add a small amount to model context
```

For a simple preference, a key-value lookup may be enough. For a larger collection of memories, a store search can retrieve relevant records. Keep the result set bounded and verify that the selected records are still appropriate to use.

Conversation history has a different problem: it grows with every turn. Trim older messages or summarize them when necessary, while keeping recent turns available. Summaries are lossy; do not silently turn an uncertain inference into a confirmed customer fact. Store provenance and allow corrections where the application supports persistent memory.

This chapter does not cover general memory taxonomies, embedding design or RAG retrieval architecture. Those belong in the broader memory and RAG material elsewhere in the handbook.

## 6. Production choices without turning this into a storage chapter

A production design needs a few deliberate decisions:

- **Backend:** use a durable, supported checkpointer and store for shared deployments. LangGraph integrations include PostgreSQL and other database-backed options; select the implementation for the workload and version in use.
- **Isolation:** bind thread access to an authenticated owner. Enforce tenant/user authorization in the application or memory service; opaque IDs and namespaces alone do not secure data.
- **State size:** keep checkpointed state serializable and reasonably small. Store references to large documents or API payloads rather than copying them into every checkpoint.
- **Lifecycle:** define separate retention, correction and deletion policies for thread checkpoints and long-term memory.
- **Schema changes:** track state and memory schema versions. Old checkpoints may need compatibility handling before a newer graph can consume them.
- **Recovery:** a checkpoint restores graph state; it does not roll back an external payment, email or CRM operation. Use idempotency and reconciliation around side effects, as covered in Chapter 22.

High availability, disaster recovery, detailed observability and broader operational patterns are intentionally left to Chapter 25.

## 7. Common mistakes

| Mistake | Better design |
|---|---|
| Treating the checkpointer as the long-term user profile | Keep thread state and cross-thread memory separate |
| Assuming a reused `thread_id` resumes an interrupted node | Distinguish a new message from an explicit resume operation |
| Using `InMemorySaver` or `InMemoryStore` as durable production storage | Select supported persistent backends |
| Treating namespace as access control | Authorize every read and write using trusted identity |
| Saving every model inference as a fact | Validate the source and persistence policy first |
| Loading the entire memory store into every prompt | Retrieve only relevant, authorized records |

## Key takeaways

- **Checkpointers** persist graph state within a thread.
- **Threads** group runs under a `thread_id`; they are not an authorization boundary.
- **Stores** hold selected application data that can be reused across threads.
- **Namespaces and keys** organize stored records; application logic enforces access.
- **Runtime context** is a clean way to pass trusted identity and dependencies into nodes.
- **Memory quality matters more than memory volume.** Persist selectively and retrieve deliberately.

A reliable LangGraph application does not try to remember everything. It keeps the current conversation recoverable and makes carefully selected information available when it is genuinely useful.

## References & further reading

- [LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangGraph Memory](https://docs.langchain.com/oss/python/langgraph/add-memory)
- [LangGraph Checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers)
- [LangGraph Stores](https://docs.langchain.com/oss/python/langgraph/persistence#memory-store)

> LangGraph APIs and integrations evolve. Verify imports, backend setup and runtime behavior against the documentation for the exact version used by your application.

---

---

## 🧭 Chapter Navigation

⬅️ **Previous:** [23. LangGraph Agent Workflows](23-langgraph-agent-workflows.md)

📚 **Part VIII Index:** [AI Engineering Frameworks & Tooling](index.md)

➡️ **Next:** [25. LangGraph Production Patterns ](25-langgraph-production-patterns.md)

---

> **Enterprise AI Engineering Handbook**
>
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*