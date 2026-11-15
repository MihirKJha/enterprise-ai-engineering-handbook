---
description: Understand LangGraph through state, nodes, edges,
  conditional routing and looping workflows, with a hands-on Python
  example based on the LangGraph 101 exercise.
keywords:
- LangGraph fundamentals
- LangGraph StateGraph
- LangGraph nodes and edges
- LangGraph state management
- LangGraph conditional routing
- LangGraph loops
- Stateful AI workflows
- LangGraph 101
title: LangGraph Fundamentals --- From State to Stateful Workflows
---

# 17 - LangGraph Fundamentals

A language model can write a response. An agentic application often
needs to do considerably more: decide what to do, take an action,
inspect the result, and decide what happens next.

That difference sounds small until you try to build it.

Imagine a customer asking a banking assistant why a card payment failed.
The assistant may need to identify the request, retrieve transaction
details, check whether the result is conclusive, and either respond or
escalate the case. A fixed sequence of model calls is not always enough.
The next step may depend on what the previous step discovered.

This is the problem LangGraph helps solve. It gives developers an
explicit way to model an AI workflow as connected steps, with shared
state and controlled execution paths.

## 1. From Generating Answers to Taking Actions

Traditional generative AI is usually reactive: a user provides a prompt
and the model generates content. An agentic system uses a model's
reasoning and tool capabilities to pursue a goal through multiple steps.

A typical agentic cycle looks like this:

``` mermaid
flowchart LR
    A[Understand the goal] --> B[Choose an action]
    B --> C[Execute the action]
    C --> D[Inspect the result]
    D --> E{Goal achieved?}
    E -->|No| B
    E -->|Yes| F[Return result]
```

The loop is the important part. An agent does not necessarily know the
complete path before it starts. It may need to react to tool results,
new information, or a failed attempt.

LangGraph provides the orchestration model for building these stateful
workflows. It is especially useful when an application needs branching,
iteration, persistent execution, or coordination between multiple steps.

## 2. What Is LangGraph?

LangGraph is a graph-based framework for building stateful AI workflows
and agents. It represents an application as a collection of nodes
connected by edges.

There are three core building blocks:

-   **State** holds the information the workflow needs as it runs.
-   **Nodes** perform work using the current state and return updates.
-   **Edges** define where execution moves next. Conditional edges
    choose a destination based on the current state.

A simple graph may be linear. A more capable graph can branch, revisit
earlier nodes, or stop when a condition is satisfied.

``` mermaid
flowchart TD
    S([START]) --> A[Node A]
    A --> B[Node B]
    B --> C{Decision}
    C -->|Path 1| D[Node C]
    C -->|Path 2| E[Node D]
    D --> F([END])
    E --> F
```

This is more than a visual representation. The graph is the execution
plan: it makes the application's control flow explicit.

## 3. State: The Information That Travels

State is the shared working context of a graph. It can hold the original
input, intermediate values, model outputs, tool results, and other
information needed by later steps.

A common way to define state is with Python's `TypedDict`:

``` python
from typing import TypedDict

class CounterState(TypedDict):
    n: int
    letter: str
```

Here, the workflow carries a number and a letter. It is deliberately
simple; the aim is to understand how state moves, not to build a useful
counter application.

State does not have to be a flat dictionary. Depending on the workflow,
it can contain nested structures, lists, or message sequences. A
Pydantic model can also be used where validation and richer data
modelling are useful.

One important detail: nodes generally return **state updates**, not
necessarily a brand-new copy of the entire state. In a `StateGraph`,
returned keys update the corresponding state fields. The exact update
and merge behaviour depends on the graph type and its state
configuration, so do not assume every graph treats missing fields or
concurrent updates in the same way.

## 4. Nodes: Small Units of Work

A node is a function registered with the graph. It receives the current
state and performs one task.

``` python
import random
import string

def add_step(state: CounterState) -> dict:
    return {
        "n": state["n"] + 1,
        "letter": random.choice(string.ascii_lowercase),
    }
```

This node increments the counter and generates a new letter. Notice that
it returns only the fields it changes. It does not need to rebuild the
whole state object.

Nodes can do more than update data. Some may call an LLM, query a
service, invoke a tool, or perform a side effect such as logging.
Keeping each node focused makes the workflow easier to test and
understand.

The node's registered name is an identifier in the graph; it does not
have to match the Python function name.

## 5. Edges: Defining the Route

A normal edge connects two nodes when the transition is always the same:

``` python
builder.add_edge("add", "display")
```

A conditional edge delegates the next-step decision to a routing
function. For example:

``` python
def should_continue(state: CounterState) -> str:
    return "stop" if state["n"] >= 13 else "continue"
```

The routing function examines the latest state and returns a route. The
graph maps that route to a destination node.

This is how a graph moves beyond a fixed pipeline. It can make a
decision after each step and choose what to execute next.

## 6. Build a Looping Workflow: LangGraph 101

The LangGraph 101 exercise in the course uses a counter that starts at
1, increments its value, generates a random letter, displays the state,
and repeats until the counter reaches 13.

It may look like a toy example, but it teaches a production-relevant
pattern: **execute a step, inspect the updated state, and route either
back into the workflow or to completion.**

``` python
from typing import TypedDict
import random
import string

from langgraph.graph import StateGraph, START, END


class CounterState(TypedDict):
    n: int
    letter: str


def add_step(state: CounterState) -> dict:
    return {
        "n": state["n"] + 1,
        "letter": random.choice(string.ascii_lowercase),
    }


def display_step(state: CounterState) -> dict:
    print(f"Counter: {state['n']} | Letter: {state['letter']}")
    return {}


def should_continue(state: CounterState) -> str:
    if state["n"] >= 13:
        return "stop"
    return "continue"


builder = StateGraph(CounterState)

builder.add_node("add", add_step)
builder.add_node("display", display_step)

builder.add_edge(START, "add")
builder.add_edge("add", "display")

builder.add_conditional_edges(
    "display",
    should_continue,
    {
        "continue": "add",
        "stop": END,
    },
)

app = builder.compile()

result = app.invoke({
    "n": 1,
    "letter": "",
})

print("Final state:", result)
```

The execution path is:

``` mermaid
flowchart TD
    S([START]) --> A[Increment counter and generate letter]
    A --> B[Display current state]
    B --> C{Counter >= 13?}
    C -->|No| A
    C -->|Yes| E([END])
```

Follow one iteration:

1.  The graph starts with `n = 1`.
2.  The `add` node increments the number and generates a letter.
3.  The `display` node prints the updated values.
4.  The routing function checks the counter.
5.  If the counter is below 13, execution returns to `add`. Otherwise,
    the graph ends.

That is the central LangGraph idea in action: the graph controls the
flow, while state carries the information between steps.

## 7. Compile, Invoke, and Visualise

Defining a graph and running it are separate activities.

-   `StateGraph(...)` creates the graph builder using the state schema.
-   `add_node()` registers work.
-   `add_edge()` and `add_conditional_edges()` connect the workflow.
-   `compile()` prepares the graph for execution.
-   `invoke()` runs it with an initial state and returns the final
    state.

You can visualise the compiled graph too:

``` python
from IPython.display import Image, display

display(Image(app.get_graph().draw_mermaid_png()))
```

Visualisation is especially useful once a workflow has several branches
or loops. It gives developers and reviewers a shared picture of the
execution path instead of making them reconstruct it from scattered
function calls.

## 8. LangChain or LangGraph?

The two frameworks are related, but they solve different orchestration
problems.

| Consideration | LangChain | LangGraph |
|---|---|---|
| **Typical flow** | Primarily sequential pipelines | Stateful graphs with branches and loops |
| **State** | Often passed through components | Explicit shared graph state |
| **Best fit** | Straightforward LLM and RAG workflows | Adaptive, multi-step workflows |
| **Complexity** | Faster to start for simple tasks | More setup and explicit control |

A document summarisation pipeline may not need a graph. An assistant
that retrieves information, evaluates the result, retries retrieval when
needed, and escalates unresolved cases is a much stronger candidate.

LangGraph also brings trade-offs. Developers must define state and
control flow more explicitly, which adds learning and implementation
overhead. That overhead is worthwhile when the workflow genuinely needs
it---not simply because an application uses an LLM.

## 9. When Does LangGraph Make Sense?

Consider LangGraph when your application needs one or more of the
following:

-   Conditional paths based on model or tool results.
-   Loops for iterative refinement, retries, or goal checking.
-   Shared state across multiple processing steps or agents.
-   Long-running workflows that may need to pause and resume.
-   Human review or approval as part of execution.

For a simple prompt followed by a model response, keep the design
simple. A graph is an orchestration tool, not a badge of architectural
sophistication.

## Key Takeaways

LangGraph makes the execution of an AI workflow explicit:

-   **State** carries inputs and intermediate results.
-   **Nodes** perform the work.
-   **Edges** define the route.
-   **Conditional edges** make decisions about what runs next.
-   **Loops** let a workflow revisit steps until a condition is met.
-   **Compile and invoke** turn the graph definition into an executable
    workflow.

The counter exercise is intentionally small, but the pattern scales:
replace the increment node with a retrieval step, the display node with
an evaluator, and the stop condition with a quality or business rule.
You now have the skeleton of an iterative RAG or agent workflow.

The next chapters build on this foundation: graph architecture, state
and checkpointing, routing, human approval, tool execution, agent
workflows, memory, and production patterns. Each deserves its own space;
none needs to be crammed into this introduction.

---

## 🧭 Chapter Navigation

⬅️ **Previous:** [16. LlamaIndex Limitations and Trade-offs](16-llamaindex-limitations-and-tradeoffs.md)

📚 **Part VIII Index:** [AI Engineering Frameworks & Tooling](index.md)

➡️ **Next:** [18. Graph Based Agent Architecture](18-graph-based-agent-architecture.md)

---

> **Enterprise AI Engineering Handbook**
>
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*
