# 04. Working Memory

> **Category:** Agent Memory
> **Module:** AI Agents
> **Prerequisites:** Agent Memory Overview, Short-Term Memory, Long-Term Memory
> **Difficulty:** Intermediate

> **Note:** Working Memory is the temporary workspace where an AI agent actively processes information while reasoning, planning, calling tools, and making decisions. Unlike Short-Term Memory, which stores conversation history, Working Memory holds only the information required for the current reasoning step and is discarded once the task is completed.

---

# Overview

Imagine solving a math problem.

You don't memorize every intermediate calculation permanently.

Instead, you temporarily hold numbers in your mind, perform calculations, and then forget them after reaching the answer.

Humans call this **Working Memory**.

AI agents work in a similar way.

Consider the following request.

```
User

↓

Book me the cheapest flight from
Delhi to Berlin next Friday.
```

The AI agent temporarily stores:

- Source city
- Destination city
- Travel date
- Available airlines
- Flight prices
- Cheapest option

After the booking is completed, these temporary values are discarded.

They do **not** belong in Long-Term Memory.

Working Memory exists only while solving the current task.

---

# Why Working Memory Matters

Without Working Memory

```text
User Request

↓

Reasoning

↓

Forget Intermediate Results

↓

Incorrect Response
```

Problems

- Cannot perform multi-step reasoning
- Cannot combine tool outputs
- Cannot track execution progress
- Poor planning
- Frequent reasoning failures

---

With Working Memory

```text
             User
               │
               ▼
          AI Agent
               │
      ┌────────┼────────┐
      ▼                 ▼
 Working Memory       LLM
      │
      ▼
 Intermediate State
```

Benefits

- Multi-step reasoning
- Tool chaining
- Planning support
- Temporary calculations
- Better decision making

---

# Working Memory vs Short-Term Memory

Many people confuse these concepts.

| Working Memory | Short-Term Memory |
|----------------|------------------|
| Active reasoning workspace | Conversation history |
| Temporary calculations | Previous messages |
| Current task only | Current session |
| Continuously updated | Appended over time |
| Deleted after reasoning | Deleted after session |

Example

Conversation

```
User:
My name is Mihir.
```

↓

Stored in

**Short-Term Memory**

---

Reasoning

```
Need weather

↓

Call API

↓

Parse response

↓

Compare temperature

↓

Generate answer
```

↓

Stored in

**Working Memory**

---

# High-Level Architecture

```text
                       User
                         │
                         ▼
                    AI Agent
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
 Working Memory    Short-Term Memory   Long-Term Memory
      │                  │                  │
      ▼                  ▼                  ▼
Task State      Conversation      User Knowledge
                         │
                         ▼
                        LLM
```

Working Memory interacts with every component during task execution.

---

# What is Stored?

Working Memory typically stores:

### Current Goal

```text
Generate Monthly Report
```

---

### Execution Plan

```text
Collect Data

↓

Analyze

↓

Create Charts

↓

Generate PDF
```

---

### Tool Results

```text
CRM API

↓

Customer List
```

---

### Intermediate Calculations

```text
Revenue

↓

Expenses

↓

Profit
```

---

### Temporary Variables

```text
Current File

Current User

Current Agent

Current Step
```

These values exist only while executing the workflow.

---

# Working Memory Lifecycle

```text
Receive Task
      │
      ▼
Create Working Memory
      │
      ▼
Reason
      │
      ▼
Call Tools
      │
      ▼
Update State
      │
      ▼
Generate Response
      │
      ▼
Discard Working Memory
```

Unlike Long-Term Memory, nothing is permanently stored.

---

# How Working Memory Works

```text
User Request
      │
      ▼
Planner
      │
      ▼
Working Memory
      │
      ▼
Reason
      │
      ▼
Tool Calling
      │
      ▼
Update State
      │
      ▼
LLM
      │
      ▼
Final Response
```

Every reasoning step updates Working Memory until the task finishes.

---

# Implementation

## Example 1 – Core Python

A simple Working Memory implementation using a dictionary.

```python
class WorkingMemory:

    def __init__(self):
        self.state = {}

    def set(self, key, value):
        self.state[key] = value

    def get(self, key):
        return self.state.get(key)

    def clear(self):
        self.state.clear()


memory = WorkingMemory()

memory.set("destination", "Berlin")
memory.set("travel_date", "2026-08-14")
memory.set("flight_price", 520)

print(memory.get("flight_price"))

memory.clear()
```

Output

```text
520
```

The memory is cleared once the task is complete.

---

## Example 2 – LangGraph

LangGraph naturally models Working Memory using **State**.

```python
from typing import TypedDict

from langgraph.graph import StateGraph

class AgentState(TypedDict):
    user_query: str
    search_results: list
    final_answer: str

workflow = StateGraph(AgentState)

workflow.add_node("planner", planner)
workflow.add_node("search", search_tool)
workflow.add_node("answer", generate_answer)
```

Each node reads from and writes to the shared state, which acts as the agent's Working Memory throughout the workflow.

---

## Example 3 – Production Example

Enterprise AI agents often maintain Working Memory within a workflow engine while keeping session state in Redis.

```python
from dataclasses import dataclass

@dataclass
class WorkflowState:

    task_id: str
    current_step: str
    tool_result: dict
    completed: bool = False


state = WorkflowState(
    task_id="TASK-101",
    current_step="Search Knowledge Base",
    tool_result={}
)

print(state)
```

In production systems, this state is frequently persisted by workflow engines such as LangGraph Checkpointers or Temporal so that long-running workflows can resume after failures without losing execution progress.

---
# Enterprise Use Cases

## Customer Support Agent

Working Memory maintains the current support workflow.

Example:

- Current customer issue
- Verification status
- Troubleshooting steps
- API responses
- Current ticket state

```text
Customer

↓

Support Agent

↓

Working Memory

↓

CRM API

↓

Knowledge Base

↓

Response
```

Once the issue is resolved, the Working Memory is cleared.

---

## Software Engineering Assistant

Stores temporary information while generating code.

Examples

- Active repository
- Current file
- Function being modified
- Compilation errors
- Test execution results

This information is only needed while solving the current programming task.

---

## Financial Assistant

Maintains temporary calculation data.

Examples

- Current investment portfolio
- Calculated returns
- Risk score
- Recommended allocation

These values are recalculated whenever the user starts a new financial analysis.

---

## Enterprise Workflow Agent

Stores execution state during multi-step workflows.

Example

```text
Receive Order

↓

Validate Customer

↓

Check Inventory

↓

Calculate Shipping

↓

Generate Invoice

↓

Notify Customer
```

Working Memory tracks the progress of each workflow step.

---

## Research Agent

Maintains intermediate reasoning while collecting information.

Example

```text
Search Web

↓

Retrieve Documents

↓

Extract Facts

↓

Rank Results

↓

Generate Summary
```

Retrieved information exists only while preparing the final answer.

---

# Production Insight

Working Memory is often confused with conversation memory.

They serve different purposes.

```text
                     AI Agent
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Working Memory   Short-Term Memory  Long-Term Memory
        │                │                │
        ▼                ▼                ▼
 Workflow State   Conversation      User Profile
 Intermediate     Chat History      Preferences
 Calculations
```

A common production architecture is:

| Memory Type | Recommended Technology |
|-------------|------------------------|
| Working Memory | LangGraph State / In-Memory Objects |
| Short-Term Memory | Redis |
| Long-Term Memory | PostgreSQL / MongoDB |
| Semantic Memory | Vector Database |

A good AI agent separates these responsibilities instead of storing everything in a single memory system.

---

# Architecture Decision

| Scenario | Recommended Working Memory |
|----------|-----------------------------|
| Multi-step reasoning | LangGraph State |
| Tool execution | Workflow State Object |
| API orchestration | In-Memory Dictionary |
| Long-running workflows | LangGraph Checkpointer |
| Distributed workflows | Temporal / Durable Workflow Engine |

---

# Advantages

- Supports multi-step reasoning
- Maintains workflow state
- Enables tool chaining
- Improves planning accuracy
- Simplifies complex task execution
- Enables autonomous decision making
- Easily recreated when needed

---

# Limitations

- Temporary by design
- Lost if the workflow fails without persistence
- Consumes memory during execution
- Can become inconsistent if not synchronized
- Not suitable for storing user knowledge

---

# Best Practices

- Keep Working Memory task-specific.
- Store only temporary execution state.
- Clear Working Memory after task completion.
- Persist workflow state for long-running tasks.
- Avoid storing user preferences in Working Memory.
- Minimize unnecessary state updates.
- Monitor memory usage in complex workflows.
- Design workflows to recover gracefully after failures.

---

# Common Mistakes

❌ Using Working Memory to store user profiles

❌ Saving conversation history in Working Memory

❌ Never clearing temporary state

❌ Persisting intermediate calculations permanently

❌ Mixing Working Memory with Long-Term Memory

❌ Ignoring recovery for interrupted workflows

---

# Framework Comparison

| Framework | Working Memory Implementation |
|-----------|-------------------------------|
| **LangChain** | Chain Inputs & Intermediate Variables |
| **LangGraph** | Shared Graph State + Checkpointers |
| **LlamaIndex** | Workflow Context & Execution State |
| **CrewAI** | Task Context |
| **OpenAI Agents SDK** | Run Context & Execution State |

---

# Interview Questions

### What is Working Memory in an AI Agent?

### How does Working Memory differ from Short-Term Memory?

### Why is Working Memory required for tool calling?

### What information belongs in Working Memory?

### Why shouldn't user preferences be stored in Working Memory?

### How does LangGraph implement Working Memory?

### What happens to Working Memory after task completion?

### How can long-running workflows recover Working Memory after failures?

---

# Quick Revision

```text
                    User
                      │
                      ▼
                  AI Agent
                      │
          ┌───────────┼────────────┐
          ▼           ▼            ▼
      Planner     Working Memory   Tools
                      │
                      ▼
               Intermediate State
                      │
                      ▼
                     LLM
                      │
                      ▼
               Final Response
                      │
                      ▼
              Clear Working Memory
```

---

# Key Takeaways

- Working Memory is the AI agent's temporary workspace for reasoning, planning, and task execution.
- It stores intermediate results, execution state, and tool outputs only for the duration of the current task.
- Unlike Short-Term Memory, it does not maintain conversation history, and unlike Long-Term Memory, it does not persist across sessions.
- Frameworks such as LangGraph implement Working Memory through shared workflow state, enabling reliable multi-step execution and recovery.
- Separating Working Memory from other memory types leads to more scalable, maintainable, and production-ready AI agent architectures.

---

# References

- LangGraph Documentation – StateGraph & Checkpointers
- LangChain Documentation – Chains & Memory
- LlamaIndex Documentation – Workflows
- OpenAI Agents SDK Documentation
- CrewAI Documentation

---

## Next Note

**05-episodic-memory.md**

In the next note, we'll explore **Episodic Memory**, which enables AI agents to remember previous experiences, completed tasks, successes, failures, and historical interactions. You'll learn how experience-based memory helps agents improve decision-making and supports adaptive behavior in enterprise AI systems.