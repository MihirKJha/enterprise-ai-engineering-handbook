# 02. Message Passing

> **Category:** Agent Communication
> **Module:** AI Agents
> **Prerequisites:** Agent Communication Overview
> **Difficulty:** Intermediate

> **Note:** Message Passing is the fundamental communication mechanism used by AI agents to exchange tasks, requests, responses, events, and execution results. Instead of directly calling one another, agents communicate by sending structured messages, enabling loosely coupled, scalable, and fault-tolerant enterprise AI systems.

---

# Overview

Imagine an AI Software Development Team.

The Planner Agent creates an implementation plan.

Instead of directly executing the work, it sends a task to the Coding Agent.

```text
Planner Agent

↓

"Implement User Authentication"

↓

Coding Agent

↓

Generate Source Code

↓

Testing Agent

↓

Execute Tests
```

Every interaction is performed through **messages**.

A message contains:

- What needs to be done
- Who should perform it
- Required context
- Current status
- Metadata

Without Message Passing, every agent would need to know how every other agent works internally.

---

# Why Message Passing Matters

Without Message Passing

```text
Planner

↓

Direct Method Call

↓

Developer

↓

Direct Method Call

↓

Tester
```

Problems

- Tight coupling
- Difficult maintenance
- Poor scalability
- Hard to replace agents
- No asynchronous execution

---

With Message Passing

```text
Planner

↓

Message

↓

Message Queue

↓

Developer

↓

Message

↓

Tester
```

Benefits

- Loose coupling
- Independent deployment
- Scalable workflows
- Reliable communication
- Better fault tolerance

---

# High-Level Architecture

```text
                     User
                       │
                       ▼
               Supervisor Agent
                       │
                       ▼
                Message Broker
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
 Planner Agent   Coding Agent    Testing Agent
      │                │                │
      └────────────────┼────────────────┘
                       ▼
               External Systems
```

The Message Broker acts as the communication hub between agents.

---

# Message Structure

A production message contains much more than the task itself.

```text
Message

│

├── Message ID

├── Sender

├── Receiver

├── Timestamp

├── Task

├── Payload

├── Priority

├── Status

└── Correlation ID
```

Example

```json
{
  "messageId": "MSG-1001",
  "sender": "PlannerAgent",
  "receiver": "CodingAgent",
  "task": "Generate REST API",
  "priority": "HIGH",
  "status": "NEW"
}
```

Structured messages improve traceability and debugging.

---

# Message Passing Lifecycle

```text
Create Message

↓

Serialize

↓

Send

↓

Queue

↓

Receive

↓

Deserialize

↓

Process

↓

Respond
```

Each stage may involve validation, authentication, logging, and monitoring.

---

# Types of Messages

Enterprise AI systems exchange different message types.

---

## 1. Task Message

Assigns work to another agent.

```text
Planner

↓

Generate API Documentation

↓

Documentation Agent
```

Typical Uses

- Task delegation
- Workflow execution
- Agent collaboration

---

## 2. Request Message

Requests information.

```text
Developer Agent

↓

Retrieve API Specification

↓

Knowledge Agent
```

Typical Uses

- Information retrieval
- Tool invocation
- API calls

---

## 3. Response Message

Returns the result of a previous request.

```text
Knowledge Agent

↓

API Documentation

↓

Developer Agent
```

Typical Uses

- Task completion
- Query responses
- Tool outputs

---

## 4. Event Message

Notifies other agents that something occurred.

```text
Deployment Completed

↓

Event Bus

↓

Monitoring Agent

↓

Notification Agent
```

Typical Uses

- Workflow automation
- Notifications
- Event-driven systems

---

## 5. Error Message

Reports failures.

```text
Testing Agent

↓

Test Failed

↓

Developer Agent
```

Typical Uses

- Retry workflows
- Incident handling
- Debugging

---

# Synchronous vs Asynchronous Messaging

## Synchronous

```text
Agent A

↓

Request

↓

Agent B

↓

Response
```

Characteristics

- Immediate response
- Simple
- Blocking

Typical Uses

- Tool invocation
- API requests
- Small workflows

---

## Asynchronous

```text
Agent A

↓

Queue

↓

Agent B

↓

Process Later
```

Characteristics

- Non-blocking
- Highly scalable
- Better fault tolerance

Typical Uses

- Enterprise workflows
- Long-running tasks
- Multi-agent collaboration

---

# Message Routing

Messages can be delivered using different routing strategies.

| Strategy | Description |
|----------|-------------|
| Point-to-Point | One sender → One receiver |
| Broadcast | One sender → Multiple receivers |
| Publish-Subscribe | Subscribers receive matching events |
| Topic-Based | Route based on topic |
| Content-Based | Route based on message content |

Choosing the appropriate routing strategy depends on workflow complexity and scalability requirements.

---

# Implementation

## Example 1 – Core Python

A simple message passing implementation.

```python
class Message:

    def __init__(self, sender, receiver, payload):
        self.sender = sender
        self.receiver = receiver
        self.payload = payload


message = Message(
    sender="PlannerAgent",
    receiver="CodingAgent",
    payload="Generate REST API"
)

print(message.payload)
```

Output

```text
Generate REST API
```

This demonstrates a basic message exchanged between two agents.

---

## Example 2 – LangGraph

LangGraph passes information between nodes using shared workflow state.

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class AgentState(TypedDict):
    task: str
    code: str
    test_result: str

workflow = StateGraph(AgentState)

workflow.add_node("planner", planner_node)
workflow.add_node("developer", developer_node)
workflow.add_node("tester", tester_node)
```

Instead of directly calling each other, nodes communicate by updating the shared state.

---

## Example 3 – Production Example (Kafka)

Publish a task to a Kafka topic.

```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

producer.send(
    "agent.tasks",
    {
        "messageId": "MSG-101",
        "sender": "PlannerAgent",
        "receiver": "CodingAgent",
        "task": "Generate Authentication Service"
    }
)

producer.flush()
```

The Coding Agent subscribes to the `agent.tasks` topic and processes the task asynchronously. This enables multiple agent instances to consume messages independently while maintaining scalability and loose coupling.

---

# Enterprise Use Cases

## Software Development Assistant

AI agents collaborate by exchanging structured task messages.

Examples

- Feature implementation
- Code generation
- Test execution
- Code review
- Documentation generation

```text
Developer

↓

Supervisor Agent

↓

Planner Agent

↓

Task Message

↓

Coding Agent

↓

Result Message

↓

Testing Agent

↓

Documentation Agent
```

Each agent performs its task independently and communicates the result through messages.

---

## Customer Support Platform

Customer support workflows rely on message passing between specialized agents.

Examples

- Intent Detection
- Knowledge Retrieval
- Ticket Creation
- Escalation
- Customer Notification

```text
Customer Query

↓

Intent Agent

↓

Knowledge Agent

↓

Ticket Agent

↓

Notification Agent
```

Each stage communicates using structured request and response messages.

---

## Enterprise Workflow Automation

Business workflows consist of multiple collaborating agents.

Examples

- Invoice Processing
- Employee Onboarding
- Purchase Approval
- Claims Processing

```text
Invoice Received

↓

Validation Agent

↓

Approval Agent

↓

Finance Agent

↓

ERP System
```

Messages coordinate workflow execution across departments.

---

## Financial Services

Banking AI systems exchange messages continuously.

Examples

- Fraud Detection
- Credit Scoring
- Risk Analysis
- Compliance Validation

Each component processes incoming messages independently while maintaining complete auditability.

---

## DevOps Automation

Deployment pipelines are message-driven.

```text
Code Commit

↓

CI Agent

↓

Build Agent

↓

Test Agent

↓

Deployment Agent

↓

Monitoring Agent
```

Every stage publishes completion events before the next stage begins.

---

# Production Insight

Enterprise AI agents should **never communicate through hardcoded dependencies**.

Instead, every communication should occur through a messaging layer.

```text
                AI Agents
                     │
                     ▼
          Communication Layer
                     │
     ┌───────────────┼────────────────┐
     ▼               ▼                ▼
   Kafka         RabbitMQ      Redis Streams
                     │
                     ▼
              Agent Consumers
```

Advantages of a messaging layer

- Loose coupling
- Independent deployment
- Message persistence
- Retry support
- Horizontal scalability
- Fault isolation

This architecture allows agents to evolve independently without breaking other components.

---

# Message Delivery Guarantees

Different enterprise systems require different delivery guarantees.

| Delivery Type | Description | Typical Use Case |
|---------------|-------------|------------------|
| **At Most Once** | Message may be lost but never duplicated | Logging |
| **At Least Once** | Message is guaranteed but may be duplicated | Workflow Processing |
| **Exactly Once** | Delivered exactly once | Financial Transactions |

Choosing the correct delivery guarantee is an important architectural decision.

---

# Architecture Decision

| Scenario | Recommended Messaging Technology |
|----------|----------------------------------|
| Simple workflow | Direct Communication |
| Distributed microservices | RabbitMQ |
| High-throughput event streaming | Kafka |
| Real-time notifications | Redis Streams |
| Cloud-native messaging | AWS SQS / SNS |
| Event-driven enterprise systems | Kafka + Event Bus |
| Multi-agent AI platform | Kafka + Workflow Engine |

---

# Advantages

- Loose coupling between agents
- Independent deployment
- Asynchronous execution
- High scalability
- Reliable message delivery
- Easier fault recovery
- Better workflow orchestration

---

# Limitations

- Additional infrastructure
- Message serialization overhead
- Network latency
- Message ordering challenges
- Distributed debugging complexity
- Retry management

---

# Best Practices

- Use structured message schemas.
- Include unique message IDs.
- Generate correlation IDs for tracing.
- Keep messages immutable.
- Make message handlers idempotent.
- Implement retry and dead-letter queues.
- Version message contracts.
- Monitor queue depth and processing latency.

---

# Common Mistakes

❌ Sending large payloads

❌ Tight coupling between agents

❌ No retry strategy

❌ Missing message validation

❌ Ignoring duplicate message handling

❌ No correlation IDs

❌ No dead-letter queue

❌ Mixing business logic with messaging infrastructure

---

# Framework Comparison

| Framework | Message Passing Support |
|-----------|-------------------------|
| **LangChain** | Runnable Pipelines, Tool Calling |
| **LangGraph** | Shared State, Graph Edges |
| **CrewAI** | Task Delegation Between Agents |
| **AutoGen** | Conversational Agent Messaging |
| **OpenAI Agents SDK** | Tool Invocation & Session Coordination |
| **Google ADK** | Agent Workflow Communication |

---

# Interview Questions

### What is Message Passing?

### Why is Message Passing preferred over direct method calls?

### What information should every production message contain?

### What is the difference between synchronous and asynchronous messaging?

### What is the purpose of a Message Broker?

### What is a Correlation ID?

### What are the different message delivery guarantees?

### Why should message handlers be idempotent?

### When should Kafka be preferred over RabbitMQ?

### What is a Dead Letter Queue (DLQ)?

---

# Quick Revision

```text
                  AI Agent
                      │
                      ▼
               Create Message
                      │
                      ▼
                 Serialize
                      │
                      ▼
               Message Broker
                      │
          ┌───────────┼────────────┐
          ▼           ▼            ▼
     Queue/Topic   Subscribers   DLQ
          │
          ▼
      Destination Agent
          │
          ▼
      Process Message
          │
          ▼
      Response/Event
```

---

# Key Takeaways

- Message Passing is the fundamental communication mechanism for distributed AI agents.
- Structured messages enable loose coupling, scalability, and fault tolerance.
- Enterprise AI systems commonly use message brokers such as Kafka, RabbitMQ, Redis Streams, AWS SQS, and Google Pub/Sub to exchange tasks and events.
- Reliable messaging requires message validation, acknowledgments, retries, correlation IDs, idempotent processing, and dead-letter queues.
- Well-designed message passing forms the foundation for scalable multi-agent systems, workflow orchestration, and enterprise AI platforms.

---

# References

- Apache Kafka Documentation
- RabbitMQ Documentation
- Redis Streams Documentation
- LangGraph Documentation – Multi-Agent Workflows
- CrewAI Documentation
- AutoGen Documentation
- OpenAI Agents SDK Documentation

---

## Next Note

**03-shared-memory.md**

In the next note, we'll explore **Shared Memory**, a communication pattern where multiple AI agents collaborate through a common memory space instead of exchanging direct messages. You'll learn how shared state enables collaborative reasoning, planning, context sharing, workflow coordination, and production implementations using LangGraph State, Redis, distributed caches, and workflow engines.


