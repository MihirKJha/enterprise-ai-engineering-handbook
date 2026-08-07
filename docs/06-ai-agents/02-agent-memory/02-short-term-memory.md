# 02. Short-Term Memory

> **Category:** Agent Memory
> **Module:** AI Agents
> **Prerequisites:** Agent Memory Overview
> **Difficulty:** Intermediate

> **Note:** Short-Term Memory (STM) stores information that an AI agent needs during a conversation or workflow. It enables the agent to remember recent interactions, maintain context, and produce coherent responses. Unlike Long-Term Memory, Short-Term Memory is temporary and typically expires when the session ends.

---

# Overview

Imagine talking to a customer support representative.

```
You:
My laptop won't start.

↓

Support Engineer:
What model is it?

↓

You:
Dell XPS 15

↓

Support Engineer:
What operating system are you using?
```

The support engineer remembers the previous conversation while helping you.

An AI agent behaves in the same way using **Short-Term Memory**.

Instead of treating every prompt independently, the agent remembers recent interactions and uses them to answer follow-up questions correctly.

Without Short-Term Memory,

```
User:
My name is Mihir.

↓

Agent

↓

Hello Mihir!

---------------------

User:
What is my name?

↓

Agent

↓

I don't know.
```

With Short-Term Memory,

```
User:
My name is Mihir.

↓

Agent

↓

Hello Mihir!

---------------------

User:
What is my name?

↓

Agent

↓

Your name is Mihir.
```

This ability makes conversations feel natural and intelligent.

---

# Why Short-Term Memory Matters

Without Short-Term Memory

```text
User Request

↓

LLM

↓

Response

(New request starts from scratch)
```

Problems

- No conversation continuity
- Repeated questions
- Poor user experience
- Lost workflow context
- Cannot perform multi-step tasks

---

With Short-Term Memory

```text
             User
               │
               ▼
          AI Agent
               │
      ┌────────┼─────────┐
      ▼                  ▼
 Short-Term Memory      LLM
      │
      ▼
Conversation History
```

Benefits

- Maintains conversation context
- Supports follow-up questions
- Enables multi-turn conversations
- Improves reasoning
- Better personalization

---

# High-Level Architecture

```text
                    User
                      │
                      ▼
                 AI Agent
                      │
         ┌────────────┼────────────┐
         ▼                         ▼
 Short-Term Memory              LLM
         │
         ▼
 Conversation Buffer
         │
         ▼
    Current Session
```

Short-Term Memory stores only the information required during the current interaction.

---

# Characteristics of Short-Term Memory

| Feature | Description |
|----------|-------------|
| Lifetime | Current session |
| Storage | Temporary |
| Size | Limited |
| Speed | Very Fast |
| Purpose | Maintain conversation context |

Unlike Long-Term Memory, it is **not intended for permanent storage**.

---

# Typical Information Stored

Short-Term Memory commonly stores:

### Recent Conversation

```text
User:
Generate a sales report.

↓

Agent:
Report generated.
```

---

### Current Goal

```text
Current Task

↓

Book Flight
```

---

### Tool Results

```text
Weather API

↓

25°C

↓

Stored temporarily
```

---

### Intermediate Reasoning

```text
Planning

↓

Searching

↓

Summarizing
```

The information exists only while the task is active.

---

# Memory Lifecycle

```text
User Input
      │
      ▼
Store in STM
      │
      ▼
Use During Reasoning
      │
      ▼
Update
      │
      ▼
Expire
```

When the session ends, Short-Term Memory is usually discarded.

---

# How Short-Term Memory Works

```text
User

↓

Receive Request

↓

Retrieve Session Memory

↓

Reason

↓

Call Tools

↓

Generate Response

↓

Update Memory
```

Every new interaction updates the conversation history.

---

# Implementation

## Example 1 – Core Python

A simple implementation using a conversation buffer.

```python
class ShortTermMemory:

    def __init__(self):
        self.messages = []

    def add(self, role, content):
        self.messages.append({
            "role": role,
            "content": content
        })

    def get_history(self):
        return self.messages


memory = ShortTermMemory()

memory.add("user", "My preferred cloud is AWS.")
memory.add("assistant", "I'll remember that during this conversation.")

print(memory.get_history())
```

Output

```python
[
    {
        "role": "user",
        "content": "My preferred cloud is AWS."
    },
    {
        "role": "assistant",
        "content": "I'll remember that during this conversation."
    }
]
```

Although simple, this demonstrates how conversation history is maintained during a session.

---

## Example 2 – LangChain

LangChain provides built-in conversation memory.

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    return_messages=True
)

memory.save_context(
    {"input": "My favorite IDE is IntelliJ"},
    {"output": "I'll remember that during our conversation."}
)

print(memory.load_memory_variables({}))
```

The conversation history is automatically appended to future prompts.

---

## Example 3 – Production Example (Redis)

Enterprise applications typically store Short-Term Memory in Redis.

```python
from langchain_community.chat_message_histories import RedisChatMessageHistory

history = RedisChatMessageHistory(
    session_id="customer-101",
    url="redis://localhost:6379"
)

history.add_user_message(
    "Generate this month's revenue report."
)

history.add_ai_message(
    "Sure, generating the report."
)

print(history.messages)
```

Redis allows multiple application instances to share the same session memory while providing extremely fast read/write performance.

---

# Enterprise Use Cases

## Customer Support Agent

Maintains the conversation context throughout a support session.

Example:

- Customer name
- Product details
- Current issue
- Troubleshooting steps
- Ticket status

```text
Customer

↓

Support Agent

↓

Redis Session Memory

↓

LLM

↓

Resolution
```

---

## Enterprise Knowledge Assistant

Remembers the current search context while answering follow-up questions.

Example

```
User:
Summarize the HR Policy.

↓

User:
Now explain the leave policy.
```

The agent understands that the second question refers to the previously retrieved HR document.

---

## Software Engineering Assistant

Maintains coding context during development.

Example

- Current repository
- Programming language
- Selected framework
- Active file
- Recent code changes

This enables the agent to provide context-aware coding assistance.

---

## Financial Assistant

Stores the current financial planning session.

Examples

- Budget planning
- Investment comparison
- Loan calculations
- Current portfolio discussion

The session expires after the conversation ends.

---

## Healthcare Assistant

Maintains consultation context during a patient interaction.

Examples

- Symptoms
- Current medications
- Follow-up questions
- Test results

Persistent medical records belong to Long-Term Memory, while the ongoing consultation remains in Short-Term Memory.

---

# Production Insight

Short-Term Memory should **never become Long-Term Memory**.

Many beginner implementations continuously append conversation history until the prompt exceeds the LLM context window.

Instead, enterprise systems usually implement a layered architecture.

```text
                     AI Agent
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
 Session Memory     Conversation Summary   Long-Term Memory
        │                │                 │
      Redis          Summarizer LLM    PostgreSQL / Vector DB
```

A common production strategy is:

- **Redis** → Current conversation
- **LLM Summarization** → Compress older conversations
- **Long-Term Memory** → Store only important facts

This keeps prompts small while preserving essential information.

---

# Architecture Decision

| Scenario | Recommended Storage |
|----------|---------------------|
| Current chat session | Redis |
| Multi-step workflow | LangGraph Checkpointer |
| Temporary tool output | In-Memory Cache |
| User profile | PostgreSQL / MongoDB |
| Enterprise knowledge | Vector Database |

---

# Advantages

- Maintains conversation continuity
- Enables natural multi-turn interactions
- Supports follow-up questions
- Improves reasoning quality
- Reduces repeated user input
- Very fast retrieval
- Easy to implement

---

# Limitations

- Information is temporary
- Lost after session expiration
- Limited by context window
- Memory size grows during long conversations
- Poor management increases token costs
- Not suitable for permanent knowledge

---

# Best Practices

- Store only relevant conversation history.
- Remove duplicate or unnecessary messages.
- Use conversation summarization for long sessions.
- Define session expiration policies.
- Store Short-Term Memory in Redis or a similar in-memory database.
- Separate Short-Term and Long-Term Memory.
- Monitor prompt size and token usage.
- Automatically clear inactive sessions.

---

# Common Mistakes

❌ Keeping every conversation forever

❌ Using Short-Term Memory as a database

❌ Ignoring token limits

❌ Mixing user profile data with conversation history

❌ Retrieving unnecessary messages

❌ Not expiring inactive sessions

---

# Framework Comparison

| Framework | Short-Term Memory Support |
|-----------|---------------------------|
| **LangChain** | ConversationBufferMemory, ConversationSummaryMemory, ConversationTokenBufferMemory |
| **LangGraph** | Checkpointers, Graph State |
| **LlamaIndex** | Chat Memory Buffer |
| **CrewAI** | Agent Session Memory |
| **OpenAI Agents SDK** | Session Context |

---

# Interview Questions

### What is Short-Term Memory in an AI Agent?

### How is Short-Term Memory different from Long-Term Memory?

### Why is Redis commonly used for Short-Term Memory?

### What problems occur if Short-Term Memory grows indefinitely?

### How can conversation summarization reduce token usage?

### When should Short-Term Memory expire?

### How does LangGraph manage Short-Term Memory?

### Why shouldn't user profile information be stored in Short-Term Memory?

---

# Quick Revision

```text
                    User
                      │
                      ▼
                 AI Agent
                      │
                      ▼
            Short-Term Memory
                      │
          Conversation History
                      │
                      ▼
                     LLM
                      │
                      ▼
              Update Memory
```

---

# Key Takeaways

- Short-Term Memory stores temporary information required during the current conversation or workflow.
- It enables AI agents to maintain conversational context, answer follow-up questions, and perform multi-step reasoning.
- Enterprise AI systems commonly use Redis or workflow state managers such as LangGraph Checkpointers for Short-Term Memory.
- To control prompt size and token costs, production systems summarize or expire older conversations instead of storing them indefinitely.
- Short-Term Memory complements Long-Term Memory by providing fast, session-specific context without permanently persisting data.

---

# References

- LangChain Documentation – Memory
- LangGraph Documentation – Checkpointers
- LlamaIndex Documentation – Chat Memory
- OpenAI Agents SDK Documentation
- CrewAI Documentation

---

## Next Note

**03-long-term-memory.md**

In the next note, you'll learn how AI agents persist knowledge across multiple sessions using **Long-Term Memory**, including user profiles, preferences, historical interactions, semantic knowledge, storage architectures, and production implementations with relational databases, vector databases, and cloud storage.