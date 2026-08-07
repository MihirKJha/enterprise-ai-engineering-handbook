# 03. Shared Memory

> **Category:** Agent Communication
> **Module:** AI Agents
> **Prerequisites:** Agent Communication Overview, Message Passing
> **Difficulty:** Intermediate

> **Note:** Shared Memory enables multiple AI agents to collaborate by reading and writing to a common memory space. Instead of exchanging messages for every interaction, agents share state, context, intermediate results, and decisions through a centralized or distributed memory system. Shared Memory is widely used in multi-agent workflows, collaborative reasoning, workflow orchestration, and production AI platforms.

---

# Overview

Imagine a team of AI agents building a software application.

Instead of constantly sending messages to each other, every agent updates a shared workspace.

```text
Planner Agent

↓

Shared Memory

↓

Developer Agent

↓

Shared Memory

↓

Testing Agent

↓

Shared Memory

↓

Documentation Agent
```

Every agent can see the latest workflow state.

For example,

```
Planner Agent

↓

Task:
Build Authentication Module

↓

Shared Memory

↓

Developer Agent

↓

Code Completed

↓

Shared Memory

↓

Testing Agent

↓

Tests Passed
```

Instead of repeatedly asking other agents for updates, each agent simply reads the latest information from Shared Memory.

This greatly simplifies collaboration.

---

# Why Shared Memory Matters

Without Shared Memory

```text
Planner

↓

Message

↓

Developer

↓

Message

↓

Tester

↓

Message

↓

Documentation
```

Problems

- Numerous messages
- Duplicate communication
- Complex coordination
- Higher latency
- Difficult workflow tracking

---

With Shared Memory

```text
              Shared Memory
                    ▲
       ┌────────────┼────────────┐
       │            │            │
 Planner       Developer      Tester
       │            │            │
       └────────────┼────────────┘
                    ▼
             Documentation
```

Benefits

- Shared context
- Simplified collaboration
- Reduced communication overhead
- Better workflow visibility
- Easier coordination

---

# High-Level Architecture

```text
                      User
                        │
                        ▼
                 Supervisor Agent
                        │
                        ▼
                 Shared Memory
                        │
      ┌─────────────────┼──────────────────┐
      ▼                 ▼                  ▼
 Planner Agent    Coding Agent      Testing Agent
      │                 │                  │
      └─────────────────┼──────────────────┘
                        ▼
                Documentation Agent
```

The Shared Memory acts as the central collaboration layer.

---

# Shared Memory Lifecycle

```text
Create State

↓

Write to Memory

↓

Read by Other Agents

↓

Update State

↓

Repeat

↓

Complete Workflow
```

Every agent continuously reads and updates the shared state until the workflow finishes.

---

# Shared Memory vs Message Passing

These two communication mechanisms solve different problems.

| Shared Memory | Message Passing |
|---------------|-----------------|
| Shared state | Individual messages |
| Collaborative workflows | Task delegation |
| Common context | Point-to-point communication |
| Easy state sharing | Better service decoupling |
| Best for coordinated reasoning | Best for distributed messaging |

Example

Shared Memory

```text
Current Task

↓

Authentication Module

↓

Status

↓

Testing
```

Every agent can immediately access the latest status.

---

Message Passing

```text
Planner

↓

Message

↓

Developer

↓

Response

↓

Tester
```

Each update requires sending another message.

---

# Shared Memory Models

Enterprise AI systems commonly implement several shared memory models.

---

## 1. Centralized Memory

All agents use a single shared memory store.

```text
Planner

↓

Redis

↓

Developer

↓

Tester
```

Characteristics

- Simple architecture
- Easy coordination
- Single source of truth

Typical Uses

- Small AI systems
- Workflow orchestration
- LangGraph

---

## 2. Distributed Shared Memory

Multiple memory nodes share synchronized state.

```text
Planner

↓

Redis Cluster

↓

Developer

↓

Redis Replica
```

Characteristics

- Highly scalable
- Fault tolerant
- Distributed

Typical Uses

- Enterprise AI platforms
- Cloud-native deployments

---

## 3. Workflow State

Workflow engines maintain shared execution state.

```text
Planner

↓

Workflow State

↓

Developer

↓

Tester
```

Characteristics

- Structured execution
- Workflow recovery
- Versioned state

Typical Uses

- LangGraph
- Temporal
- Durable Workflows

---

## 4. Knowledge Workspace

Agents collaborate through shared documents.

```text
Planner

↓

Shared Knowledge

↓

Developer

↓

Tester
```

Characteristics

- Shared documents
- Collaborative reasoning
- Persistent workspace

Typical Uses

- Research agents
- Multi-agent planning
- Enterprise assistants

---

# Choosing the Right Shared Memory Model

| Scenario | Recommended Model |
|----------|-------------------|
| Workflow execution | Workflow State |
| Small agent systems | Centralized Memory |
| Distributed AI platform | Distributed Shared Memory |
| Collaborative planning | Shared Knowledge Workspace |
| Multi-agent reasoning | Shared State + Vector Memory |

---

# Shared State Structure

A production shared memory usually contains structured information.

```text
Shared State

│

├── Workflow ID

├── Current Task

├── Completed Tasks

├── Active Agent

├── Tool Results

├── Shared Variables

├── Errors

└── Execution Status
```

Maintaining a structured state simplifies debugging, monitoring, and recovery.

---

# Implementation

## Example 1 – Core Python

A simple shared memory implementation.

```python
class SharedMemory:

    def __init__(self):
        self.state = {}

    def write(self, key, value):
        self.state[key] = value

    def read(self, key):
        return self.state.get(key)


memory = SharedMemory()

memory.write("task", "Generate API Documentation")

print(memory.read("task"))
```

Output

```text
Generate API Documentation
```

Every agent can read and update the same shared state.

---

## Example 2 – LangGraph

LangGraph naturally implements Shared Memory using graph state.

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class AgentState(TypedDict):
    task: str
    implementation: str
    test_result: str

workflow = StateGraph(AgentState)

workflow.add_node("planner", planner_node)
workflow.add_node("developer", developer_node)
workflow.add_node("tester", tester_node)
```

Each node contributes to the shared state, allowing downstream nodes to access the latest workflow information without explicit message passing.

---

## Example 3 – Production Example (Redis)

Redis is commonly used as a centralized shared memory store.

```python
import redis
import json

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

workflow_state = {
    "workflowId": "WF-101",
    "currentTask": "Generate API Documentation",
    "status": "IN_PROGRESS"
}

redis_client.set(
    "workflow:101",
    json.dumps(workflow_state)
)

print(
    redis_client.get("workflow:101")
)
```

Multiple AI agents can retrieve and update the same workflow state in Redis, enabling real-time collaboration across distributed services while maintaining a single source of truth.

---

# Enterprise Use Cases

## Software Development Assistant

Multiple AI agents collaborate using a shared workspace instead of constantly exchanging messages.

Examples

- Architecture planning
- Code generation
- Unit testing
- Documentation generation
- Deployment planning

```text
Developer

↓

Supervisor Agent

↓

Shared Memory

↓

Planner Agent

↓

Developer Agent

↓

Testing Agent

↓

Documentation Agent
```

Every agent contributes to the same workflow state, allowing all participants to access the latest project information.

---

## Customer Support Platform

Customer support agents collaborate using shared customer context.

Examples

- Customer profile
- Current issue
- Troubleshooting history
- Previous recommendations
- Ticket status

```text
Customer

↓

Shared Session

↓

Intent Agent

↓

Knowledge Agent

↓

Support Agent

↓

Escalation Agent
```

Each agent immediately sees the latest customer information without requesting it from other agents.

---

## Enterprise Workflow Automation

Business workflows often require multiple departments.

Examples

- Purchase Approval
- Invoice Processing
- Employee Onboarding
- Claims Processing

```text
Workflow

↓

Shared State

↓

Validation Agent

↓

Approval Agent

↓

Finance Agent

↓

Notification Agent
```

Every workflow stage updates the shared state, ensuring consistent execution.

---

## Multi-Agent Research Assistant

Research agents collaborate using a common knowledge workspace.

Examples

- Web Search Agent
- Document Analysis Agent
- Fact Verification Agent
- Report Generation Agent

Each agent enriches the shared knowledge base until the final report is produced.

---

## DevOps Automation

Deployment workflows rely on shared execution state.

```text
Code Commit

↓

Build Agent

↓

Shared Deployment State

↓

Test Agent

↓

Deployment Agent

↓

Monitoring Agent
```

Every deployment stage updates the workflow status, enabling seamless coordination.

---

# Production Insight

Shared Memory is **not a replacement for Message Passing**.

Instead, enterprise AI systems typically combine both communication patterns.

```text
                   AI Agents
                        │
        ┌───────────────┼────────────────┐
        ▼                                ▼
 Message Passing                 Shared Memory
        │                                │
        ▼                                ▼
 Task Assignment               Workflow Context
 Notifications                 Shared Variables
 Events                        Execution State
```

General guideline:

- **Message Passing** → Send work to another agent
- **Shared Memory** → Share context between agents

Modern AI platforms often use **messages for coordination** and **shared memory for collaboration**.

---

# Architecture Decision

| Scenario | Recommended Shared Memory |
|----------|---------------------------|
| LangGraph workflows | Graph State |
| Small AI applications | In-Memory Objects |
| Distributed AI platform | Redis |
| Persistent workflow state | PostgreSQL |
| Long-running workflows | Temporal Workflow State |
| Multi-agent reasoning | Redis + Vector Database |
| Enterprise orchestration | Redis Cluster |

---

# Advantages

- Shared context across agents
- Simplifies collaboration
- Reduces message traffic
- Improves workflow visibility
- Supports collaborative reasoning
- Easy access to workflow state
- Enables real-time coordination

---

# Limitations

- Shared state can become a bottleneck
- Requires synchronization
- Risk of concurrent updates
- Distributed consistency challenges
- More difficult to scale than message queues
- Requires careful access control

---

# Best Practices

- Keep shared state well structured.
- Define ownership for every state field.
- Minimize concurrent writes.
- Use optimistic or distributed locking where appropriate.
- Version shared state.
- Separate temporary workflow state from persistent business data.
- Remove completed workflow state.
- Monitor state size and update frequency.

---

# Common Mistakes

❌ Allowing every agent to modify every field

❌ Storing permanent business data in shared workflow memory

❌ No synchronization strategy

❌ Shared state growing indefinitely

❌ Mixing workflow state with conversation history

❌ Ignoring concurrent update conflicts

❌ No recovery mechanism after failures

❌ Using shared memory when simple message passing is sufficient

---

# Framework Comparison

| Framework | Shared Memory Support |
|-----------|-----------------------|
| **LangGraph** | Shared Graph State, Checkpointers |
| **CrewAI** | Shared Agent Memory |
| **AutoGen** | Shared Conversation Context |
| **OpenAI Agents SDK** | Session Context & Shared State |
| **Google ADK** | Workflow Context |
| **Temporal** | Durable Workflow State |

---

# Interview Questions

### What is Shared Memory in AI Agents?

### How does Shared Memory differ from Message Passing?

### When should Shared Memory be preferred?

### What information typically belongs in Shared Memory?

### Why is Redis commonly used for Shared Memory?

### How does LangGraph implement Shared Memory?

### What challenges arise when multiple agents update the same state?

### How can shared workflow state be recovered after failures?

### Why should workflow state and business data remain separate?

### Can Message Passing and Shared Memory be used together?

---

# Quick Revision

```text
                 Supervisor Agent
                        │
                        ▼
                 Shared Memory
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
    Planner        Developer        Tester
        │               │                │
        └───────────────┼────────────────┘
                        ▼
               Documentation Agent
                        │
                        ▼
                Final Workflow State
```

---

# Key Takeaways

- Shared Memory enables multiple AI agents to collaborate through a common state rather than exchanging individual messages for every interaction.
- It is particularly effective for workflow orchestration, collaborative reasoning, and multi-step task execution.
- Enterprise AI systems commonly implement Shared Memory using LangGraph state, Redis, distributed caches, workflow engines, or persistent databases.
- Shared Memory should contain workflow context, execution state, shared variables, and intermediate results—not permanent business data.
- The most scalable enterprise architectures combine **Message Passing for coordination** with **Shared Memory for collaboration**, providing both loose coupling and efficient context sharing.

---

# References

- LangGraph Documentation – StateGraph & Checkpointers
- CrewAI Documentation – Shared Memory
- AutoGen Documentation – Multi-Agent Conversations
- Redis Documentation
- Temporal Documentation
- OpenAI Agents SDK Documentation

---

## Next Note

**04-event-driven-agents.md**

In the next note, we'll explore **Event-Driven Agents**, where AI agents react to business events rather than direct requests. You'll learn about event producers, event consumers, event buses, event sourcing, asynchronous workflows, and production implementations using Kafka, RabbitMQ, Redis Streams, AWS EventBridge, and Google Pub/Sub.