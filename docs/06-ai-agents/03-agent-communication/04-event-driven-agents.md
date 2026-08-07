# 04. Event-Driven Agents

> **Category:** Agent Communication
> **Module:** AI Agents
> **Prerequisites:** Agent Communication Overview, Message Passing, Shared Memory
> **Difficulty:** Intermediate

> **Note:** Event-Driven Agents communicate by reacting to events rather than direct requests. Instead of waiting for another agent to invoke them, they continuously monitor an event stream and execute actions whenever relevant events occur. Event-driven architectures enable scalable, loosely coupled, asynchronous, and highly resilient enterprise AI systems.

---

# Overview

Imagine an e-commerce platform.

When a customer places an order, several AI agents automatically begin working.

```text
Customer Places Order

↓

Order Created Event

↓

Inventory Agent

↓

Payment Agent

↓

Fraud Detection Agent

↓

Shipping Agent

↓

Notification Agent
```

No agent directly calls another.

Instead, every agent reacts independently to the same event.

This is the foundation of **Event-Driven Architecture (EDA)**.

Instead of asking,

```
Please process this order.
```

Agents simply wait for the event.

```
Order Created

↓

React

↓

Execute Task
```

This makes AI systems significantly more scalable than traditional request-response architectures.

---

# Why Event-Driven Agents Matter

Without Events

```text
Supervisor

↓

Call Agent A

↓

Wait

↓

Call Agent B

↓

Wait

↓

Call Agent C
```

Problems

- Sequential execution
- High latency
- Tight coupling
- Difficult scaling
- Single point of failure

---

With Events

```text
Order Created Event

↓

Event Bus

↓

Inventory Agent

↓

Payment Agent

↓

Shipping Agent

↓

Notification Agent
```

Benefits

- Parallel execution
- Loose coupling
- Independent deployment
- Fault tolerance
- Horizontal scalability

---

# High-Level Architecture

```text
                    Business Event
                           │
                           ▼
                     Event Producer
                           │
                           ▼
                      Event Broker
                           │
        ┌──────────────────┼───────────────────┐
        ▼                  ▼                   ▼
 Inventory Agent     Payment Agent     Shipping Agent
        │                  │                   │
        └──────────────────┼───────────────────┘
                           ▼
                  Notification Agent
```

The Event Broker distributes events to all interested agents.

---

# Event Lifecycle

Every event passes through several stages.

```text
Business Action

↓

Generate Event

↓

Publish Event

↓

Event Broker

↓

Consume Event

↓

Process Event

↓

Generate New Event
```

One event often triggers several new events.

---

# Event Producers

An Event Producer creates events.

Examples

```text
Order Service

↓

Order Created
```

```text
Payment Service

↓

Payment Successful
```

```text
Deployment Agent

↓

Deployment Completed
```

Typical Producers

- AI Agents
- APIs
- Databases
- Microservices
- Workflow Engines
- IoT Devices

---

# Event Consumers

Consumers subscribe to specific events.

```text
Order Created

↓

Inventory Agent

↓

Reserve Stock
```

```text
Payment Completed

↓

Shipping Agent

↓

Ship Product
```

Consumers remain idle until relevant events arrive.

---

# Event Types

Enterprise AI platforms use different event categories.

---

## 1. Business Events

Represent business activities.

```text
Order Created

Payment Completed

Invoice Generated

User Registered
```

Typical Uses

- Enterprise workflows
- Business automation
- Customer lifecycle

---

## 2. System Events

Represent infrastructure changes.

```text
Server Started

Cache Cleared

Deployment Completed

Database Backup Finished
```

Typical Uses

- DevOps
- Monitoring
- Infrastructure automation

---

## 3. AI Events

Represent AI workflow progress.

```text
Planning Finished

Tool Executed

Reasoning Completed

Task Assigned

Memory Updated
```

Typical Uses

- Multi-agent workflows
- AI orchestration
- Workflow monitoring

---

## 4. Error Events

Represent failures.

```text
API Timeout

Tool Failed

Validation Failed

Deployment Failed
```

Typical Uses

- Retry workflows
- Alerting
- Incident response

---

# Event-Driven vs Request-Response

| Event-Driven | Request-Response |
|--------------|-----------------|
| Asynchronous | Synchronous |
| Loosely coupled | Tightly coupled |
| Event Broker | Direct invocation |
| Parallel execution | Sequential execution |
| Highly scalable | Limited scalability |

Example

Request-Response

```text
Agent A

↓

Call

↓

Agent B

↓

Wait

↓

Response
```

---

Event-Driven

```text
Agent A

↓

Publish Event

↓

Broker

↓

Agent B

↓

Process
```

No waiting is required.

---

# Event Flow

Enterprise event-driven systems usually follow this flow.

```text
Business Action

↓

Create Event

↓

Publish

↓

Event Broker

↓

Subscribers

↓

Execute Task

↓

Publish New Event
```

This creates autonomous workflows where agents continuously react to new information.

---

# Implementation

## Example 1 – Core Python

A simple event publisher.

```python
class Event:

    def __init__(self, event_type, payload):
        self.event_type = event_type
        self.payload = payload


event = Event(
    event_type="OrderCreated",
    payload={
        "order_id": 101
    }
)

print(event.event_type)
```

Output

```text
OrderCreated
```

This demonstrates a basic event object that can be consumed by AI agents.

---

## Example 2 – LangGraph

LangGraph workflows naturally produce events as workflow state changes.

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class WorkflowState(TypedDict):
    task: str
    status: str

workflow = StateGraph(WorkflowState)

workflow.add_node("planner", planner_node)
workflow.add_node("developer", developer_node)
workflow.add_node("tester", tester_node)
```

Each state transition can be treated as an event that triggers downstream workflow execution.

---

## Example 3 – Production Example (Kafka)

Publishing an event to Kafka.

```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda value: json.dumps(value).encode("utf-8")
)

producer.send(
    "business.events",
    {
        "eventType": "OrderCreated",
        "orderId": 101,
        "customerId": 5001
    }
)

producer.flush()
```

Every subscribed AI agent receives the **OrderCreated** event independently and executes its own business logic without requiring direct coordination with other agents.

---

# Enterprise Use Cases

## E-Commerce Order Processing

When a customer places an order, multiple AI agents automatically react.

Examples

- Inventory Reservation
- Payment Processing
- Fraud Detection
- Shipping
- Customer Notification

```text
Customer Order

↓

Order Created Event

↓

Event Broker

↓

Inventory Agent

↓

Payment Agent

↓

Fraud Detection Agent

↓

Shipping Agent

↓

Notification Agent
```

Each agent independently consumes the same event and performs its own responsibility.

---

## Customer Support Automation

Customer interactions generate business events.

Examples

- Ticket Created
- Ticket Escalated
- Sentiment Changed
- SLA Breached
- Ticket Closed

```text
Customer Message

↓

Ticket Created

↓

Event Bus

↓

Intent Agent

↓

Knowledge Agent

↓

Escalation Agent

↓

Notification Agent
```

New AI capabilities can be added simply by subscribing to existing events.

---

## Financial Services

Financial institutions rely heavily on event-driven architectures.

Examples

- Transaction Initiated
- Fraud Detected
- Payment Approved
- KYC Completed
- Risk Score Updated

Every event is independently processed by specialized AI agents while maintaining complete auditability.

---

## DevOps Automation

Modern CI/CD pipelines generate continuous infrastructure events.

Examples

- Build Completed
- Deployment Started
- Deployment Failed
- Service Restarted
- Incident Created

```text
Code Commit

↓

CI Pipeline

↓

Build Completed Event

↓

Testing Agent

↓

Security Agent

↓

Deployment Agent

↓

Monitoring Agent
```

Each deployment stage reacts automatically to previous events.

---

## Enterprise AI Platform

Large AI platforms orchestrate workflows using event streams.

```text
                   AI Workflow
                        │
                        ▼
                  Event Broker
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
 Planning Agent   Coding Agent   Testing Agent
       │                │                │
       └────────────────┼────────────────┘
                        ▼
               Documentation Agent
                        │
                        ▼
               Deployment Agent
```

This architecture enables independent scaling and deployment of every AI agent.

---

# Production Insight

Enterprise AI systems should **avoid direct orchestration whenever possible**.

Instead, every important business action should generate an event.

```text
Business Action

↓

Business Event

↓

Event Broker

↓

Interested Agents

↓

Processing

↓

New Business Event
```

This approach provides:

- Loose coupling
- Independent deployments
- Better resiliency
- Parallel processing
- Easier system evolution

A new AI capability can often be introduced simply by subscribing to an existing event without modifying any existing agents.

---

# Event Broker Comparison

| Broker | Best For |
|---------|----------|
| **Apache Kafka** | High-throughput event streaming |
| **RabbitMQ** | Reliable task queues |
| **Redis Streams** | Lightweight event processing |
| **AWS EventBridge** | AWS cloud-native event routing |
| **Google Pub/Sub** | GCP event-driven applications |
| **Azure Event Grid** | Azure event distribution |

Choose the broker based on throughput, durability, latency, and cloud ecosystem.

---

# Architecture Decision

| Scenario | Recommended Event Platform |
|----------|----------------------------|
| Enterprise Event Streaming | Apache Kafka |
| Workflow Automation | RabbitMQ |
| Lightweight AI Agents | Redis Streams |
| AWS Applications | EventBridge + SNS/SQS |
| Azure Applications | Event Grid + Service Bus |
| GCP Applications | Google Pub/Sub |
| Large Multi-Agent Platform | Kafka + Workflow Engine |

---

# Advantages

- Loose coupling between agents
- Parallel task execution
- Independent deployment
- Horizontal scalability
- High fault tolerance
- Easy system extensibility
- Better resiliency
- Supports real-time workflows

---

# Limitations

- Additional messaging infrastructure
- Event ordering challenges
- Duplicate event handling
- Distributed debugging complexity
- Event schema management
- Eventual consistency
- Monitoring complexity

---

# Best Practices

- Design immutable events.
- Keep event payloads lightweight.
- Use globally unique event IDs.
- Include timestamps and correlation IDs.
- Version event schemas.
- Make consumers idempotent.
- Use retry mechanisms and Dead Letter Queues (DLQs).
- Monitor event lag and consumer health.
- Separate business events from infrastructure events.

---

# Common Mistakes

❌ Using events for every internal method call

❌ Creating oversized event payloads

❌ Ignoring duplicate event processing

❌ No schema versioning

❌ Tight coupling between producers and consumers

❌ Missing retry strategies

❌ No event monitoring

❌ Treating event logs as long-term business storage

---

# Framework Comparison

| Framework | Event Support |
|-----------|---------------|
| **LangGraph** | Workflow State Transitions |
| **CrewAI** | Task Lifecycle Events |
| **AutoGen** | Conversational Event Flow |
| **OpenAI Agents SDK** | Tool Execution Events |
| **Apache Kafka** | Distributed Event Streaming |
| **RabbitMQ** | Queue-Based Event Processing |
| **Temporal** | Workflow Events & Durable Execution |

---

# Interview Questions

### What is an Event-Driven Agent?

### How does Event-Driven Architecture differ from Request-Response?

### What is the role of an Event Broker?

### What is the difference between an Event Producer and an Event Consumer?

### Why are Event-Driven systems highly scalable?

### Why should event consumers be idempotent?

### What challenges exist in Event-Driven AI systems?

### When should Kafka be preferred over RabbitMQ?

### Why are correlation IDs important in event processing?

### How do Event-Driven architectures improve enterprise AI platforms?

---

# Quick Revision

```text
               Business Action
                      │
                      ▼
               Event Producer
                      │
                      ▼
                Event Broker
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 Inventory      Payment Agent    Shipping Agent
   Agent              │                │
      ▼               ▼                ▼
 Notification    Monitoring      Analytics
      │
      ▼
 New Business Events
```

---

# Key Takeaways

- Event-Driven Agents react to business and system events rather than direct requests.
- Enterprise AI systems use event brokers such as Kafka, RabbitMQ, Redis Streams, AWS EventBridge, and Google Pub/Sub to distribute events to interested agents.
- Event-Driven Architecture enables loose coupling, parallel execution, horizontal scalability, and fault tolerance.
- Business events, system events, AI events, and error events allow different agents to collaborate asynchronously without direct dependencies.
- Production event-driven platforms require immutable event schemas, idempotent consumers, correlation IDs, retries, dead-letter queues, and comprehensive monitoring to ensure reliability.

---

# References

- Apache Kafka Documentation
- RabbitMQ Documentation
- Redis Streams Documentation
- AWS EventBridge Documentation
- Google Pub/Sub Documentation
- Azure Event Grid Documentation
- LangGraph Documentation – Workflow State
- Temporal Documentation – Durable Workflows

---

## Next Note

**05-publish-subscribe-pattern.md**

In the next note, we'll explore the **Publish–Subscribe (Pub/Sub) Pattern**, one of the most widely used communication patterns in enterprise AI systems. You'll learn about publishers, subscribers, topics, subscriptions, fan-out messaging, event routing, message filtering, durable subscriptions, and production implementations using Kafka Topics, RabbitMQ Exchanges, Redis Pub/Sub, AWS SNS, Azure Service Bus Topics, and Google Pub/Sub.