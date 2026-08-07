# 05. Publish-Subscribe Pattern

> **Category:** Agent Communication
> **Module:** AI Agents
> **Prerequisites:** Agent Communication Overview, Message Passing, Shared Memory, Event-Driven Agents
> **Difficulty:** Intermediate

> **Note:** The Publish-Subscribe (Pub/Sub) Pattern is a communication model where publishers send messages to a topic without knowing who will receive them, while subscribers receive messages by subscribing to topics of interest. This decouples producers from consumers and enables scalable, event-driven, and loosely coupled enterprise AI systems.

---

# Overview

Imagine an enterprise AI platform processing customer orders.

When a new order is created, multiple AI agents need to react.

Instead of notifying every agent individually,

```text
Order Service

↓

Inventory Agent

↓

Payment Agent

↓

Shipping Agent

↓

Notification Agent
```

the Order Service simply publishes an event.

```text
Order Created

↓

Topic

↓

Interested Agents
```

Every subscribed agent automatically receives the event.

The publisher does not know:

- How many agents exist
- Which agents are online
- Who will consume the event
- How the event will be processed

This loose coupling makes Pub/Sub one of the most widely used communication patterns in enterprise AI systems.

---

# Why Publish-Subscribe Matters

Without Pub/Sub

```text
Order Service

↓

Inventory Agent

↓

Payment Agent

↓

Shipping Agent

↓

Notification Agent
```

Problems

- Tight coupling
- Multiple integrations
- Difficult maintenance
- Hard to add new agents
- Reduced scalability

---

With Pub/Sub

```text
             Order Service
                   │
                   ▼
              Publish Event
                   │
                   ▼
                 Topic
        ┌──────────┼───────────┐
        ▼          ▼           ▼
 Inventory     Payment    Shipping
   Agent         Agent       Agent
        ▼                      ▼
 Notification           Analytics
```

Benefits

- Loose coupling
- Easy scalability
- Parallel processing
- Independent deployment
- Simple extensibility

---

# High-Level Architecture

```text
                  Publisher
                      │
                      ▼
                  Topic / Event
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
 Subscriber A   Subscriber B   Subscriber C
       │              │              │
       ▼              ▼              ▼
 AI Agent      AI Agent      AI Agent
```

The Topic distributes every published message to all interested subscribers.

---

# Core Components

## Publisher

The Publisher creates and sends messages.

```text
Order Service

↓

Publish

↓

Order Created
```

Responsibilities

- Create events
- Publish messages
- No knowledge of subscribers

---

## Topic

The Topic acts as a communication channel.

```text
Orders

Payments

Deployments

Notifications
```

Responsibilities

- Receive published events
- Distribute messages
- Support multiple subscribers

---

## Subscriber

Subscribers consume events.

```text
Inventory Agent

↓

Subscribe

↓

Orders Topic
```

Responsibilities

- Listen for events
- Process messages
- Generate new events if necessary

---

# Publish-Subscribe Lifecycle

```text
Business Action

↓

Create Event

↓

Publish

↓

Topic

↓

Subscribers

↓

Process Event

↓

Optional New Event
```

Publishers and subscribers remain completely independent.

---

# Fan-Out Communication

One published event can trigger multiple independent actions.

```text
          Order Created
                │
                ▼
             Orders Topic
                │
   ┌────────────┼─────────────┐
   ▼            ▼             ▼
Inventory   Payment     Notification
 Agent       Agent          Agent
```

This is called **Fan-Out Communication**.

Benefits

- Parallel execution
- Independent scaling
- Easy extensibility

---

# Publish-Subscribe vs Message Queue

Although both use messaging infrastructure, their behavior is different.

| Publish-Subscribe | Message Queue |
|-------------------|---------------|
| One publisher → Many subscribers | One producer → One consumer |
| Broadcast communication | Task distribution |
| Fan-out delivery | Load balancing |
| Every subscriber receives a copy | One consumer processes the message |
| Event notifications | Work delegation |

Example

### Pub/Sub

```text
Publisher

↓

Topic

↓

Agent A

↓

Agent B

↓

Agent C
```

Every subscriber receives the same event.

---

### Message Queue

```text
Producer

↓

Queue

↓

Worker A

Worker B

Worker C
```

Only one worker processes each message.

---

# Topic Organization

Enterprise systems organize communication into multiple topics.

```text
Topics

│

├── orders

├── payments

├── inventory

├── ai.tasks

├── deployments

├── monitoring

└── notifications
```

Keeping topics focused improves scalability and simplifies maintenance.

---

# Choosing the Right Communication Pattern

| Scenario | Recommended Pattern |
|----------|---------------------|
| Business notifications | Publish-Subscribe |
| Task delegation | Message Queue |
| Workflow execution | Shared Memory |
| Direct tool invocation | Request-Response |
| Enterprise event streaming | Publish-Subscribe |

---

# Implementation

## Example 1 – Core Python

A simple publisher and subscriber implementation.

```python
class Publisher:

    def __init__(self):
        self.subscribers = []

    def subscribe(self, subscriber):
        self.subscribers.append(subscriber)

    def publish(self, message):
        for subscriber in self.subscribers:
            subscriber.receive(message)


class Subscriber:

    def receive(self, message):
        print(f"Received: {message}")


publisher = Publisher()

inventory = Subscriber()
payment = Subscriber()

publisher.subscribe(inventory)
publisher.subscribe(payment)

publisher.publish("Order Created")
```

Output

```text
Received: Order Created
Received: Order Created
```

Each subscriber independently receives the same published message.

---

## Example 2 – LangGraph

In LangGraph, state updates can trigger multiple downstream nodes, similar to a publish-subscribe workflow.

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class WorkflowState(TypedDict):
    event: str

workflow = StateGraph(WorkflowState)

workflow.add_node("inventory", inventory_node)
workflow.add_node("payment", payment_node)
workflow.add_node("notification", notification_node)
```

A workflow state update acts as the published event, allowing multiple downstream nodes to react independently.

---

## Example 3 – Production Example (Kafka Topics)

Publish an event to a Kafka topic.

```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda value: json.dumps(value).encode("utf-8")
)

producer.send(
    "orders",
    {
        "eventType": "OrderCreated",
        "orderId": 101,
        "customerId": 5001
    }
)

producer.flush()
```

Any AI agent subscribed to the **orders** topic—such as Inventory, Payment, Notification, or Analytics—receives the same event independently, enabling scalable fan-out processing without direct communication between services.

---

# Enterprise Use Cases

## E-Commerce Platform

A single business event triggers multiple AI agents.

Examples

- Inventory Reservation
- Payment Processing
- Fraud Detection
- Shipping
- Customer Notification
- Analytics

```text
Order Service

↓

Publish OrderCreated

↓

Orders Topic

↓

Inventory Agent

↓

Payment Agent

↓

Shipping Agent

↓

Notification Agent

↓

Analytics Agent
```

Every subscriber independently processes the same event.

---

## Customer Support Platform

Customer-related events are distributed to multiple AI services.

Examples

- Ticket Created
- Customer Sentiment Updated
- SLA Breached
- Ticket Closed

```text
Support Portal

↓

Support Topic

↓

Intent Agent

↓

Knowledge Agent

↓

Escalation Agent

↓

Notification Agent

↓

Reporting Agent
```

Adding a new AI capability only requires subscribing to the existing topic.

---

## Financial Services

Banking systems rely heavily on publish-subscribe communication.

Examples

- Transaction Completed
- Fraud Detected
- Loan Approved
- KYC Completed
- Compliance Updated

Each AI service independently processes financial events without modifying upstream systems.

---

## DevOps Automation

Deployment events are broadcast across multiple AI agents.

```text
CI/CD Pipeline

↓

DeploymentCompleted

↓

Deployments Topic

↓

Monitoring Agent

↓

Security Agent

↓

Logging Agent

↓

Notification Agent
```

Every subscribed agent performs its own specialized action.

---

## Enterprise AI Platform

Large AI platforms publish workflow events continuously.

```text
                Supervisor Agent
                       │
                       ▼
                 Workflow Events
                       │
                 AI Workflow Topic
      ┌────────────────┼─────────────────┐
      ▼                ▼                 ▼
 Planning Agent   Coding Agent   Testing Agent
      ▼                ▼                 ▼
 Documentation   Monitoring     Deployment
```

Each agent remains independent while collaborating through shared event topics.

---

# Production Insight

Publish-Subscribe is one of the most scalable communication models because **publishers never know who consumes their events**.

```text
Publisher

↓

Topic

↓

Subscriber A

Subscriber B

Subscriber C

Subscriber D

Subscriber E
```

Tomorrow you can deploy **Subscriber F** without changing the publisher.

This provides:

- Zero code changes
- Independent deployments
- Easy scalability
- Loose coupling
- Simple feature expansion

This is why Pub/Sub is widely adopted in enterprise event-driven architectures.

---

# Topic Design Best Practices

Enterprise topics should represent **business domains**, not individual services.

Good

```text
orders

payments

customers

shipments

inventory

notifications
```

Poor

```text
inventory-service-topic

payment-service-topic

agent1-topic

agent2-topic
```

Business-oriented topics remain stable even when services evolve.

---

# Architecture Decision

| Scenario | Recommended Pub/Sub Technology |
|----------|--------------------------------|
| High-throughput streaming | Apache Kafka |
| Cloud-native AWS | SNS + SQS |
| Azure applications | Service Bus Topics |
| Google Cloud | Pub/Sub |
| Lightweight messaging | Redis Pub/Sub |
| Enterprise messaging | RabbitMQ Topic Exchange |
| Multi-agent AI platform | Kafka + Event Streaming |

---

# Advantages

- Loose coupling
- Horizontal scalability
- Parallel processing
- Easy extensibility
- Independent deployments
- Real-time event distribution
- Simplified integrations
- Supports event-driven architectures

---

# Limitations

- Duplicate message handling
- Event ordering challenges
- Subscriber management
- Monitoring complexity
- Event schema evolution
- Additional messaging infrastructure
- Eventual consistency

---

# Best Practices

- Design immutable events.
- Keep event payloads concise.
- Use business-oriented topic names.
- Version event schemas.
- Include event IDs and timestamps.
- Add correlation IDs for distributed tracing.
- Make subscribers idempotent.
- Implement retry and Dead Letter Queue (DLQ) strategies.
- Monitor topic lag and consumer health.

---

# Common Mistakes

❌ Creating one topic per service

❌ Publishing oversized payloads

❌ Tight coupling between publishers and subscribers

❌ Ignoring duplicate event processing

❌ No schema versioning

❌ Missing correlation IDs

❌ No monitoring for subscribers

❌ Treating Pub/Sub as a task queue

---

# Framework Comparison

| Framework | Publish-Subscribe Support |
|-----------|---------------------------|
| **Apache Kafka** | Topics, Partitions, Consumer Groups |
| **RabbitMQ** | Topic & Fanout Exchanges |
| **Redis Pub/Sub** | Lightweight Channel-Based Messaging |
| **AWS SNS** | Cloud-Native Publish-Subscribe |
| **Google Pub/Sub** | Managed Global Messaging |
| **Azure Service Bus Topics** | Enterprise Topic-Based Messaging |
| **LangGraph** | Workflow Event Propagation |
| **CrewAI** | Agent Task & Event Collaboration |

---

# Interview Questions

### What is the Publish-Subscribe Pattern?

### How does Publish-Subscribe differ from a Message Queue?

### What are the responsibilities of a Publisher?

### What is the purpose of a Topic?

### Why don't publishers know their subscribers?

### What is Fan-Out communication?

### Why is Pub/Sub highly scalable?

### How should enterprise topics be designed?

### When should Kafka be preferred over Redis Pub/Sub?

### Why should subscribers be idempotent?

---

# Quick Revision

```text
                 Publisher
                     │
                     ▼
               Publish Event
                     │
                     ▼
                  Topic
                     │
      ┌──────────────┼───────────────┐
      ▼              ▼               ▼
 Inventory      Payment Agent   Shipping Agent
   Agent              │               │
      ▼               ▼               ▼
 Notification     Analytics     Monitoring
      │
      ▼
 Independent Processing
```

---

# Key Takeaways

- The Publish-Subscribe pattern enables one publisher to broadcast events to multiple independent subscribers.
- Publishers remain completely unaware of who consumes their events, enabling loose coupling and easy extensibility.
- Enterprise AI systems commonly implement Pub/Sub using Kafka, RabbitMQ, Redis Pub/Sub, AWS SNS, Azure Service Bus Topics, and Google Pub/Sub.
- Business-oriented topics, immutable events, schema versioning, correlation IDs, and idempotent subscribers are essential for production-grade Pub/Sub systems.
- Publish-Subscribe is ideal for event notifications, fan-out processing, real-time analytics, workflow automation, and scalable multi-agent AI platforms.

---

# References

- Apache Kafka Documentation
- RabbitMQ Documentation – Topic & Fanout Exchanges
- Redis Pub/Sub Documentation
- AWS SNS Documentation
- Azure Service Bus Topics Documentation
- Google Pub/Sub Documentation
- LangGraph Documentation – Workflow Events
- CrewAI Documentation

---

## Next Note

**06-agent-coordination.md**

In the next note, we'll explore **Agent Coordination**, where multiple AI agents work together to achieve a shared objective. You'll learn about centralized vs. decentralized coordination, supervisor agents, task scheduling, dependency management, synchronization, workflow orchestration, and production coordination strategies used in enterprise multi-agent systems.