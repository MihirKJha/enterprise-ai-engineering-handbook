---
title: "Agent Communication Overview: Communication Patterns for Multi-Agent AI Systems"
description: "Learn how AI agents communicate in multi-agent systems using router agents, direct communication, message passing, event-driven architecture, shared memory, message queues, publish-subscribe, and enterprise communication infrastructure."
keywords:
  - Agent Communication
  - Multi-Agent Systems
  - AI Agent Communication
  - Router Agents
  - Agent Message Passing
  - Multi-Agent Architecture
  - Event-Driven AI
  - Shared Memory
  - Message Queues
  - Enterprise AI Architecture
  - Kafka AI Agents
  - Distributed AI Systems
---

# 01. Agent Communication Overview

> **Category:** Agent Communication  
> **Module:** AI Agents  
> **Prerequisites:** AI Agent Fundamentals, Agent Memory  
> **Difficulty:** Intermediate

> **Note:** Modern AI systems rarely consist of a single intelligent agent. Instead, multiple specialized agents collaborate to solve complex problems by exchanging tasks, information, decisions, and results. Agent Communication defines how AI agents interact with each other, external tools, APIs, humans, and enterprise systems in a reliable, scalable, and production-ready manner.

---

# Overview

Imagine building an AI Software Engineering Assistant.

Instead of one large agent doing everything, you create specialized agents.

```text
Software Engineer

↓

AI Supervisor

↓

Planner Agent

↓

Code Agent

↓

Testing Agent

↓

Documentation Agent
```

Each agent has a specific responsibility.

However, specialization alone is not enough.

The agents must communicate efficiently.

For example:

```text
Planner Agent

↓

Generate Implementation Plan

↓

Code Agent

↓

Write Source Code

↓

Testing Agent

↓

Execute Tests

↓

Documentation Agent

↓

Generate README
```

Without communication, every agent works independently and cannot collaborate.

> **Agent Communication enables multiple AI agents to exchange information, coordinate tasks, and achieve a common objective.**

---

# 🎯 Learning Objectives

After completing this note, you will understand:

- What Agent Communication is.
- Why communication is important in multi-agent systems.
- How router agents select agents, tools, and workflows.
- The major communication participants in enterprise AI systems.
- Direct, message-based, event-driven, and shared memory communication.
- Common communication patterns and when to use them.
- How agent communication is implemented using Python, LangGraph, and Kafka.
- Production architecture considerations for distributed AI systems.
- Communication best practices and common mistakes.
- How major AI agent frameworks support communication and coordination.

---

# 1. Why Agent Communication Matters

Without communication:

```text
Agent A

Agent B

Agent C

(No Interaction)
```

Problems include:

- Duplicate work
- No coordination
- Inconsistent decisions
- Workflow failures
- Poor scalability

## With Communication

```text
             Supervisor Agent
                    │

     ┌──────────────┼──────────────┐
     ▼              ▼              ▼

  Planner       Developer        Tester
     │              │              │
     └──────────────┼──────────────┘
                    ▼
            Shared Information
```

Benefits include:

- Better collaboration
- Parallel execution
- Task delegation
- Faster workflows
- Scalable AI systems

Agent Communication allows specialized agents to operate as part of a coordinated system rather than as isolated components.

---

# 2. Communication Participants

AI agents communicate with multiple systems.

```text
                AI Agent
                    │

    ┌───────────────┼─────────────────┐
    ▼               ▼                 ▼

Other Agents      Humans         External APIs
    │                                     │
    ▼                                     ▼

Message Queue                    Enterprise Systems
```

Communication is not limited to agent-to-agent interactions.

Agents frequently communicate with:

- Other AI agents
- Human users
- APIs
- Databases
- Enterprise applications
- Workflow engines
- Messaging infrastructure

This means Agent Communication is broader than simply:

```text
Agent A

↓

Agent B
```

It represents the coordination layer connecting AI reasoning with enterprise systems and workflows.

---

# 3. High-Level Agent Communication Architecture

A multi-agent system may use the following architecture:

```text
                                User
                                  │
                                  ▼
                         Supervisor Agent
                                  │

      ┌───────────────────────────┼────────────────────────────┐
      ▼                           ▼                            ▼

Planner Agent               Coding Agent                Testing Agent
      │                           │                            │

      └──────────────┬────────────┴──────────────┬─────────────┘
                     ▼                           ▼

              Communication Layer
                     │

      ┌──────────────┼───────────────┐
      ▼              ▼               ▼

 Message Bus     Event Queue     Shared Memory
                     │
                     ▼
             External Services
```

The Communication Layer enables agents to exchange information without requiring every agent to maintain direct knowledge of every other agent.

This supports:

- Loose coupling
- Independent deployment
- Better scalability
- Easier orchestration

---

# 4. Communication Lifecycle

Agent communication generally follows a structured lifecycle.

```text
Create Message

↓

Send Message

↓

Receive Message

↓

Process Message

↓

Generate Response

↓

Continue Workflow
```

Each communication step should be:

- Reliable
- Traceable
- Fault tolerant
- Observable

In production systems, communication often also includes:

```text
Create Message

↓

Validate

↓

Serialize

↓

Route

↓

Deliver

↓

Process

↓

Acknowledge

↓

Continue Workflow
```

The communication mechanism depends on the architecture and delivery requirements.

---

# 5. 🔀 Router Agents

A router agent is responsible for deciding which specialized agent, tool, workflow, or system should handle a request.

```text
User Request

      ↓

Router Agent

      │

┌─────┼─────────────┐

▼     ▼             ▼

RAG   SQL        Support
Agent Agent       Agent

      │

      └──────┬──────┘
             ↓
       Final Response
```

The router analyzes the request and selects the most appropriate execution path.

For example:

```text
User Request:

"Why did customer revenue drop last quarter?"

          ↓

      Router Agent

          │

     ┌────┴─────┐
     ▼          ▼

Database     Knowledge
Agent         Agent

     │          │
     └────┬─────┘
          ↓
       Response
```

## Router Responsibilities

A router agent may decide:

- Which specialized agent to invoke
- Which tool to use
- Which data source to query
- Whether multiple agents are required
- Which workflow should handle the request

## Router vs Specialized Agent

```text
Router Agent

=

Decides WHERE to send the task


Specialized Agent

=

Decides HOW to solve the task
```

This separation helps prevent routing logic from becoming mixed with domain-specific execution logic.

## 💼 Backend Architecture Parallel

A router agent is similar to a request-routing layer in distributed systems.

```text
Client Request

      ↓

API Gateway / Router

      ↓

Select Service

      ↓

Execute Request
```

Similarly:

```text
User Request

      ↓

Router Agent

      ↓

Select Agent / Tool

      ↓

Execute Task
```

### Key Principle

> **A router agent should focus on selecting the right execution path rather than solving every task itself.**

This enables specialized agents to handle specific responsibilities while keeping the overall system modular and easier to scale.

---

# 6. Communication Models

Enterprise AI systems commonly use several communication models.

## 6.1 Direct Communication

One agent directly invokes another.

```text
Planner

↓

Developer
```

### Characteristics

- Simple
- Low latency
- Tight coupling

### Typical Uses

- Small agent systems
- Local workflows
- Simple orchestration

Direct communication is easy to implement but becomes harder to manage as the number of agents grows.

---

## 6.2 Message-Based Communication

Messages are exchanged through a broker.

```text
Agent

↓

Message Queue

↓

Agent
```

### Characteristics

- Loose coupling
- Reliable delivery
- Scalable

### Typical Uses

- Enterprise AI platforms
- Distributed agents
- Independent services

The sender does not need to directly know the implementation details of the receiving agent.

---

## 6.3 Event-Driven Communication

Agents react to events.

```text
Order Created

↓

Event Bus

↓

Inventory Agent

↓

Shipping Agent

↓

Billing Agent
```

### Characteristics

- Asynchronous
- Highly scalable
- Decoupled

### Typical Uses

- Business workflows
- Enterprise automation
- Long-running processes

Event-driven communication is useful when systems react to business events rather than directly invoking each other.

---

## 6.4 Shared Memory Communication

Agents exchange information through a common memory or state store.

```text
Agent A

↓

Shared Memory

↓

Agent B
```

### Characteristics

- Shared context
- Easy collaboration
- Simple coordination

### Typical Uses

- Multi-agent reasoning
- Shared planning
- Workflow state

Shared memory allows agents to collaborate through common context rather than sending every piece of information directly between agents.

---

# 7. Communication Patterns

Different workflows require different communication strategies.

| Pattern | Typical Use Case |
|---|---|
| Direct Calls | Small workflows |
| Message Queue | Distributed systems |
| Publish-Subscribe | Event processing |
| Shared Memory | Collaborative reasoning |
| Request-Response | Tool invocation |
| Broadcast | Multi-agent notifications |

---

# 8. Choosing the Right Communication Pattern

| Scenario | Recommended Pattern |
|---|---|
| Single workflow | Direct Communication |
| Multi-agent collaboration | Shared Memory |
| Enterprise automation | Event-Driven |
| Distributed AI platform | Message Queue |
| External APIs | Request-Response |
| Notifications | Publish-Subscribe |

There is no universal communication model.

The correct choice depends on:

- Workflow complexity
- Number of agents
- Latency requirements
- Scalability requirements
- Failure handling requirements
- Deployment architecture

---

# 9. Implementation

## Example 1 — Core Python

A simple direct communication example.

```python
class PlannerAgent:

    def create_task(self):

        return "Generate project documentation"


class DocumentationAgent:

    def execute(self, task):

        print(f"Executing: {task}")


planner = PlannerAgent()

documentation = DocumentationAgent()

task = planner.create_task()

documentation.execute(task)
```

Output:

```text
Executing: Generate project documentation
```

This demonstrates synchronous communication between two agents.

---

## Example 2 — LangGraph

LangGraph enables communication through shared workflow state.

```python
from typing import TypedDict

from langgraph.graph import StateGraph


class AgentState(TypedDict):

    task: str
    result: str


workflow = StateGraph(AgentState)

workflow.add_node("planner", planner_node)

workflow.add_node("developer", developer_node)

workflow.add_node("tester", tester_node)
```

Each node communicates by reading from and writing to the shared workflow state rather than directly invoking other agents.

Conceptually:

```text
Planner Node

↓

Shared State

↓

Developer Node

↓

Shared State

↓

Tester Node
```

This approach is particularly useful for structured multi-step workflows.

---

## Example 3 — Production Example: Kafka

Enterprise AI systems commonly use Kafka for asynchronous communication.

```python
from kafka import KafkaProducer

import json


producer = KafkaProducer(

    bootstrap_servers="localhost:9092",

    value_serializer=lambda v: json.dumps(v).encode("utf-8")

)


producer.send(

    "agent-tasks",

    {

        "agent": "documentation",

        "task": "Generate API documentation"

    }

)


producer.flush()
```

Instead of directly invoking another agent, the task is published to a Kafka topic.

An authorized agent subscribed to the topic can consume and process the message.

Architecture:

```text
Planner Agent

↓

Kafka Topic

↓

Documentation Agent

↓

Process Task
```

This enables:

- Loose coupling
- Asynchronous processing
- Independent scaling
- Distributed deployment

---

# 10. Enterprise Use Cases

## Software Development Assistant

Multiple specialized agents collaborate to complete software development tasks.

Examples:

- Requirement Analysis Agent
- Architecture Agent
- Code Generation Agent
- Testing Agent
- Documentation Agent

```text
Developer

↓

Supervisor Agent

↓

Planner

↓

Code Generator

↓

Tester

↓

Documentation Agent

↓

Final Solution
```

Each agent communicates its output to the next stage of the workflow.

---

## Customer Support Platform

Customer support systems commonly consist of several specialized agents.

Examples:

- Intent Detection Agent
- Knowledge Retrieval Agent
- Ticket Management Agent
- Escalation Agent
- Feedback Agent

Instead of a single agent handling everything, each agent performs one specialized task and communicates the results.

---

## Financial Services

Enterprise banking systems may orchestrate multiple AI agents.

Examples:

- Fraud Detection Agent
- Risk Assessment Agent
- Compliance Agent
- Recommendation Agent
- Customer Notification Agent

Each agent exchanges structured messages while maintaining auditability.

---

## Healthcare Assistant

Healthcare AI systems may require collaboration among multiple specialized agents.

Examples:

- Patient Intake Agent
- Diagnosis Assistant
- Medical Knowledge Agent
- Treatment Recommendation Agent
- Appointment Scheduling Agent

Communication enables each agent to contribute to the overall workflow without unnecessarily duplicating responsibilities.

---

## Enterprise Workflow Automation

Large organizations automate business workflows using communicating agents.

```text
Invoice Received

↓

Validation Agent

↓

Approval Agent

↓

Payment Agent

↓

Notification Agent

↓

ERP System
```

Each agent performs a specific business operation and communicates completion before the workflow proceeds.

---

# 11. Production Communication Architecture

Enterprise AI agents often communicate through messaging infrastructure rather than relying exclusively on direct method calls.

```text
                 Supervisor Agent
                        │
                        ▼
                Communication Layer
                        │

      ┌─────────────────┼──────────────────┐
      ▼                 ▼                  ▼

    Kafka           RabbitMQ         Redis Streams

      │                 │                  │
      ▼                 ▼                  ▼

Planner Agent      Coding Agent      Testing Agent
```

This architecture can provide:

- Loose coupling
- Independent deployment
- Horizontal scalability
- Fault tolerance
- Reliable message delivery

A key architectural principle is:

> **Separate business logic from communication infrastructure.**

Agents should focus on their business capability while messaging infrastructure handles:

- Routing
- Delivery
- Queuing
- Retry mechanisms
- Event distribution

---

# 12. Architecture Decision Guide

| Scenario | Recommended Communication Pattern |
|---|---|
| Single application | Direct Communication |
| Microservices | Message Queue |
| Event-driven workflows | Publish-Subscribe |
| Shared planning | Shared Memory |
| External API integration | Request-Response |
| Long-running workflows | Event Bus |
| Enterprise AI Platform | Kafka + Workflow Engine |
| Multi-Agent Systems | Message Queue + Shared Memory |

---

# 13. Advantages

Agent Communication:

- Enables collaboration between specialized agents
- Supports distributed AI architectures
- Improves scalability
- Enables asynchronous execution
- Reduces coupling between agents
- Improves fault tolerance
- Simplifies workflow orchestration

---

# 14. Limitations

Distributed communication also introduces challenges.

Examples:

- Additional infrastructure requirements
- Increased architectural complexity
- Message ordering challenges
- Network latency
- More complex error handling
- Distributed debugging difficulties

As the system becomes more distributed, observability and communication design become increasingly important.

---

# 15. Best Practices

- Keep messages small and self-contained.
- Use structured message formats such as JSON, Protobuf, or Avro.
- Design communication to be asynchronous whenever possible.
- Avoid unnecessary direct dependencies between specialized agents.
- Implement retry strategies.
- Use dead-letter queues where appropriate.
- Use correlation IDs for request tracing.
- Version message schemas.
- Monitor communication latency and failures.
- Separate business logic from messaging logic.
- Define clear ownership for messages and workflows.

---

# 16. Common Mistakes

❌ Creating tightly coupled agents

❌ Using synchronous communication everywhere

❌ Sending large payloads between agents

❌ Ignoring message versioning

❌ No retry strategy

❌ Missing correlation IDs

❌ No communication monitoring

❌ Mixing business logic with messaging logic

These problems become significantly more difficult to manage as the number of agents and distributed services increases.

---

# 17. Framework Comparison

| Framework | Communication Model |
|---|---|
| **LangChain** | Chains, Tool Calling, Runnable Pipelines |
| **LangGraph** | Shared Graph State, Directed Workflow Edges |
| **CrewAI** | Agent-to-Agent Collaboration |
| **AutoGen** | Conversational Multi-Agent Messaging |
| **OpenAI Agents SDK** | Tool Invocation & Session Context |
| **Google ADK** | Workflow & Agent Coordination |

Different frameworks provide different abstractions, but the underlying architectural concerns remain similar:

- Information exchange
- Task delegation
- State management
- Coordination
- Workflow control

---

# 18. 💼 Backend Architecture Parallel

Agent Communication closely resembles communication patterns used in distributed backend systems.

Traditional distributed architecture:

```text
Service A

↓

REST / gRPC / Message Queue

↓

Service B
```

Multi-agent architecture:

```text
Agent A

↓

Communication Layer

↓

Agent B
```

The same distributed systems concepts apply:

- Synchronous vs asynchronous communication
- Loose coupling
- Message schemas
- Retry strategies
- Dead-letter queues
- Correlation IDs
- Event-driven architecture
- Observability
- Independent deployment

A useful mental model is:

```text
Microservices

↓

Service Communication


Multi-Agent Systems

↓

Agent Communication
```

The major difference is that agents may make probabilistic decisions about:

- Which agent to contact
- Which workflow to execute
- Which tool to invoke
- What information should be shared

---

# 19. Interview Questions

### What is Agent Communication?

### Why is communication important in multi-agent systems?

### What is the difference between direct communication and message-based communication?

### When should event-driven communication be preferred?

### Why are message queues commonly used in enterprise AI systems?

### What is shared memory communication?

### What is the responsibility of a router agent?

### How does asynchronous communication improve scalability?

### What challenges arise in distributed agent communication?

### How would you design communication for a large enterprise multi-agent system?

---

# 20. 🚀 Quick Revision

```text
                 AI Agents
                     │
                     ▼
           Communication Layer
                     │

      ┌──────────────┼──────────────┐
      ▼              ▼              ▼

 Direct Call    Message Queue    Event Bus

      │              │              │
      ▼              ▼              ▼

Shared Memory  Request-Response Publish-Subscribe

                     │
                     ▼

             External Systems
```

## Router Agent

```text
User Request

↓

Router Agent

↓

Select Agent / Tool / Workflow

↓

Execute Task
```

## Router vs Specialized Agent

```text
Router Agent

↓

WHERE should the task go?


Specialized Agent

↓

HOW should the task be solved?
```

## Communication Lifecycle

```text
Create Message

↓

Send Message

↓

Receive Message

↓

Process Message

↓

Generate Response

↓

Continue Workflow
```

## Production Principle

```text
Business Logic

≠

Communication Infrastructure
```

Keep them separated.

---

# 21. Key Takeaways

- Agent Communication enables AI agents to collaborate, coordinate tasks, and exchange information efficiently.
- Multi-agent systems require communication to avoid isolated execution, duplicate work, and inconsistent workflows.
- Router agents determine the appropriate execution path by selecting agents, tools, workflows, or data sources.
- Enterprise AI platforms use multiple communication models, including direct communication, message queues, event-driven communication, publish-subscribe, and shared memory.
- Modern production systems often use messaging infrastructure such as Kafka, RabbitMQ, or Redis Streams to improve scalability, reliability, and loose coupling.
- Choosing the appropriate communication pattern depends on workflow complexity, latency requirements, scalability goals, reliability requirements, and deployment architecture.
- Distributed agent communication introduces familiar backend engineering concerns such as retries, message versioning, correlation IDs, dead-letter queues, and observability.
- Effective communication is a foundation for multi-agent systems, distributed AI platforms, and enterprise workflow automation.

---

# 22. References

- LangGraph Documentation — Multi-Agent Workflows
- CrewAI Documentation — Agent Collaboration
- AutoGen Documentation — Multi-Agent Conversations
- Apache Kafka Documentation
- RabbitMQ Documentation
- Redis Streams Documentation

---

# 23. Next Note

**02-message-passing.md**

In the next note, we'll explore **Message Passing**, the most fundamental communication mechanism in multi-agent systems.

You will learn:

- Synchronous vs asynchronous messaging
- Message structure
- Delivery guarantees
- Serialization formats
- Routing strategies
- Acknowledgments
- Retries
- Production implementations using Kafka, RabbitMQ, Redis Streams, and cloud messaging services

---

> **Enterprise AI Engineering Handbook**

> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*