# 07. Agent Negotiation

> **Category:** Agent Communication
> **Module:** AI Agents
> **Prerequisites:** Agent Communication Overview, Message Passing, Shared Memory, Event-Driven Agents, Publish-Subscribe Pattern, Agent Coordination
> **Difficulty:** Intermediate

> **Note:** Agent Negotiation is the process through which multiple AI agents discuss, evaluate, and agree on how work should be performed. Instead of a coordinator assigning every task, agents negotiate responsibilities, priorities, resources, execution strategies, and ownership. Negotiation enables autonomous decision-making and is widely used in distributed multi-agent systems, autonomous AI, robotics, and enterprise workflow optimization.

---

# Overview

Imagine a Software Engineering AI Platform.

A new task arrives.

```
Build Authentication Service
```

Multiple agents are capable of handling it.

```text
Backend Agent

Frontend Agent

Security Agent

Architecture Agent
```

Instead of a supervisor assigning the task, the agents negotiate.

```text
Task

↓

Who should execute?

↓

Evaluate Skills

↓

Discuss

↓

Select Best Agent

↓

Execute
```

Negotiation allows the system to make intelligent decisions dynamically.

---

# Why Agent Negotiation Matters

Without Negotiation

```text
Task

↓

Random Agent

↓

Poor Resource Usage
```

Problems

- Uneven workload
- Duplicate work
- Resource conflicts
- Poor agent utilization
- Low scalability

---

With Negotiation

```text
Task

↓

Candidate Agents

↓

Negotiation

↓

Best Agent Selected

↓

Execute
```

Benefits

- Better resource utilization
- Autonomous decision making
- Improved scalability
- Balanced workload
- Better execution quality

---

# High-Level Architecture

```text
                     New Task
                         │
                         ▼
                 Negotiation Layer
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
 Backend Agent    Security Agent    Architecture Agent
      │                  │                  │
      └──────────────────┼──────────────────┘
                         ▼
                  Selected Agent
                         │
                         ▼
                     Execute Task
```

The Negotiation Layer evaluates proposals before assigning work.

---

# Negotiation Lifecycle

Enterprise AI systems typically follow this workflow.

```text
Receive Task

↓

Identify Candidates

↓

Evaluate Capability

↓

Exchange Proposals

↓

Select Best Agent

↓

Assign Task

↓

Execute

↓

Complete
```

Negotiation happens before execution begins.

---

# What Can Agents Negotiate?

Agents negotiate much more than task ownership.

```text
Negotiation

│

├── Task Ownership

├── Priority

├── Resource Allocation

├── Execution Strategy

├── Scheduling

├── Tool Selection

├── Deadline

└── Cost
```

Enterprise AI platforms often negotiate multiple parameters simultaneously.

---

# Negotiation Models

Different systems use different negotiation approaches.

---

## 1. Coordinator-Based Negotiation

A supervisor evaluates proposals.

```text
Task

↓

Supervisor

↓

Collect Proposals

↓

Select Best Agent
```

Characteristics

- Centralized
- Easy monitoring
- Simple implementation

Typical Uses

- Enterprise AI assistants
- Workflow orchestration

---

## 2. Peer-to-Peer Negotiation

Agents negotiate directly.

```text
Agent A

↔

Agent B

↔

Agent C
```

Characteristics

- Decentralized
- Autonomous
- Distributed

Typical Uses

- Swarm AI
- Robotics
- Autonomous systems

---

# Negotiation Strategies

Enterprise AI systems commonly use several strategies.

---

## 1. Capability-Based Selection

Choose the most qualified agent.

```text
Task

↓

Evaluate Skills

↓

Best Match

↓

Assign
```

Example

```text
Backend API

↓

Backend Agent
```

Typical Uses

- Software engineering
- Knowledge agents
- Tool selection

---

## 2. Cost-Based Negotiation

Agents estimate execution cost.

```text
Task

↓

Estimate Cost

↓

Lowest Cost Wins
```

Cost may include

- Compute
- Time
- Tokens
- API usage

Typical Uses

- Cloud AI platforms
- Resource optimization

---

## 3. Load-Based Negotiation

Agents negotiate based on current workload.

```text
Agent A

95% Busy

↓

Reject

──────────────

Agent B

20% Busy

↓

Accept
```

Typical Uses

- Enterprise AI platforms
- High-throughput systems

---

## 4. Priority-Based Negotiation

High-priority tasks receive preference.

```text
Critical Task

↓

Highest Priority

↓

Immediate Assignment
```

Typical Uses

- Incident response
- Financial systems
- Healthcare

---

## 5. Contract Net Protocol (CNP)

One of the most popular negotiation protocols in multi-agent systems.

```text
Manager Agent

↓

Announce Task

↓

Worker Agents Submit Bids

↓

Evaluate Bids

↓

Award Contract

↓

Execute
```

Characteristics

- Distributed
- Efficient
- Highly scalable

Typical Uses

- Robotics
- Distributed AI
- Autonomous agents
- Enterprise task allocation

---

# Choosing the Right Negotiation Strategy

| Scenario | Recommended Strategy |
|----------|----------------------|
| Software Engineering | Capability-Based |
| Cloud Resource Allocation | Cost-Based |
| Enterprise AI Platform | Load-Based |
| Critical Business Processes | Priority-Based |
| Autonomous Multi-Agent Systems | Contract Net Protocol |

---

# Implementation

## Example 1 – Core Python

A simple capability-based negotiation.

```python
class Agent:

    def __init__(self, name, skill):

        self.name = name
        self.skill = skill


agents = [
    Agent("BackendAgent", "backend"),
    Agent("FrontendAgent", "frontend"),
    Agent("SecurityAgent", "security")
]

task = "security"

selected = next(
    agent
    for agent in agents
    if agent.skill == task
)

print(selected.name)
```

Output

```text
SecurityAgent
```

The system selects the agent whose capability best matches the task.

---

## Example 2 – LangGraph

A supervisor node selects the next agent based on workflow state.

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class WorkflowState(TypedDict):
    task: str
    selected_agent: str

workflow = StateGraph(WorkflowState)

workflow.add_node("supervisor", supervisor_node)
workflow.add_node("backend", backend_node)
workflow.add_node("security", security_node)
workflow.add_node("tester", tester_node)
```

The supervisor evaluates the workflow state and routes execution to the most appropriate agent.

---

## Example 3 – Production Example (Kafka + Coordinator)

Enterprise AI platforms often negotiate using asynchronous messaging.

```python
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

producer.send(
    "agent.negotiation",
    {
        "task": "Perform Security Review",
        "requiredSkill": "security",
        "priority": "HIGH"
    }
)

producer.flush()
```

Multiple AI agents subscribe to the **agent.negotiation** topic, evaluate whether they can execute the task, and submit their proposals. A coordinator (or distributed protocol such as Contract Net) selects the winning proposal and assigns the task for execution.

---

# Enterprise Use Cases

## Software Development Assistant

Multiple AI agents negotiate task ownership based on expertise and availability.

Examples

- Backend Development
- Frontend Development
- Security Review
- Code Review
- Testing
- Documentation

```text
New Feature Request

↓

Negotiation Layer

↓

Backend Agent
   │
Frontend Agent
   │
Security Agent
   │
Testing Agent

↓

Best Proposal

↓

Selected Agent

↓

Execute Task
```

The negotiation process ensures that the most qualified agent performs the task rather than assigning work randomly.

---

## Customer Support Platform

Customer requests often require multiple specialized agents.

Examples

- Intent Detection
- Billing Support
- Technical Support
- Account Recovery
- Escalation

```text
Customer Request

↓

Negotiation Layer

↓

Billing Agent

Technical Agent

Account Agent

↓

Best Match

↓

Handle Request
```

Each agent evaluates whether it can resolve the customer's issue before accepting responsibility.

---

## Financial Services

Financial AI systems negotiate resource allocation.

Examples

- Fraud Detection
- Compliance Review
- Risk Analysis
- Investment Recommendation

```text
Transaction

↓

Negotiation

↓

Fraud Agent

Risk Agent

Compliance Agent

↓

Selected Workflow
```

Negotiation improves resource utilization while ensuring regulatory compliance.

---

## Cloud Resource Management

Cloud AI platforms negotiate resource allocation.

Examples

- GPU allocation
- CPU scheduling
- Model selection
- Cost optimization

```text
Training Request

↓

Negotiation

↓

GPU Cluster A

GPU Cluster B

GPU Cluster C

↓

Lowest Cost

↓

Execute
```

Negotiation minimizes infrastructure cost while maintaining performance.

---

## Autonomous Robotics

Robot teams continuously negotiate task ownership.

Examples

- Package Pickup
- Delivery
- Charging
- Navigation
- Inspection

Each robot evaluates:

- Current battery
- Distance
- Workload
- Available tools

before accepting a task.

---

# Production Insight

Enterprise negotiation is **not simply selecting the best agent**.

Production systems evaluate multiple decision factors simultaneously.

```text
                    New Task
                        │
                        ▼
               Negotiation Engine
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
 Capability      Current Load       Cost
        │               │                │
        ▼               ▼                ▼
 Availability    Priority Score    SLA
                        │
                        ▼
                Decision Engine
                        │
                        ▼
                 Selected Agent
```

A mature negotiation engine commonly evaluates:

- Skills
- Experience
- Current workload
- Estimated execution time
- Infrastructure cost
- Business priority
- SLA requirements
- Historical success rate

Negotiation therefore becomes a **multi-criteria decision-making process** rather than a simple capability check.

---

# Negotiation Protocol Comparison

| Protocol | Best For |
|-----------|----------|
| Capability-Based | Skill matching |
| Cost-Based | Cloud optimization |
| Load-Based | High-throughput platforms |
| Priority-Based | Critical business workflows |
| Contract Net Protocol | Distributed task allocation |
| Voting | Collaborative decisions |
| Consensus | Multi-agent reasoning |

---

# Architecture Decision

| Scenario | Recommended Negotiation Strategy |
|----------|----------------------------------|
| Software Engineering Agents | Capability-Based |
| Enterprise AI Platform | Load + Capability |
| Cloud Resource Allocation | Cost-Based |
| Financial Systems | Priority + Compliance |
| Autonomous Robots | Contract Net Protocol |
| Research Agents | Consensus |
| Swarm AI | Peer-to-Peer Negotiation |
| Enterprise Workflow | Coordinator-Based Negotiation |

---

# Advantages

- Better resource utilization
- Intelligent task allocation
- Balanced workload
- Reduced bottlenecks
- Improved scalability
- Autonomous decision making
- Higher workflow efficiency
- Better fault tolerance

---

# Limitations

- Additional negotiation overhead
- Increased decision latency
- More complex implementation
- Communication overhead
- Risk of negotiation deadlocks
- Requires conflict resolution mechanisms

---

# Best Practices

- Define clear agent capabilities.
- Establish objective negotiation criteria.
- Limit negotiation time using timeouts.
- Keep proposals lightweight.
- Prefer measurable evaluation metrics.
- Track negotiation history.
- Allow fallback assignment if negotiation fails.
- Continuously monitor negotiation performance.

---

# Common Mistakes

❌ Allowing every agent to bid for every task

❌ Ignoring current workload

❌ Negotiating trivial tasks

❌ No timeout strategy

❌ No fallback assignment

❌ Using subjective evaluation criteria

❌ Ignoring business priorities

❌ No monitoring of negotiation outcomes

---

# Framework Comparison

| Framework | Negotiation Support |
|-----------|---------------------|
| **LangGraph** | Supervisor-Based Routing & Conditional Edges |
| **CrewAI** | Role-Based Task Assignment |
| **AutoGen** | Conversational Negotiation Between Agents |
| **OpenAI Agents SDK** | Tool & Workflow Selection |
| **Google ADK** | Workflow Routing |
| **Semantic Kernel** | Planner-Based Agent Selection |

---

# Interview Questions

### What is Agent Negotiation?

### How does Agent Negotiation differ from Agent Coordination?

### What is the Contract Net Protocol?

### When should capability-based negotiation be used?

### What factors should a negotiation engine evaluate?

### What is the difference between centralized and peer-to-peer negotiation?

### Why are negotiation timeouts important?

### How does negotiation improve resource utilization?

### What happens if no agent accepts a task?

### Why is negotiation important in autonomous multi-agent systems?

---

# Quick Revision

```text
                  New Task
                      │
                      ▼
             Negotiation Engine
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 Capability      Load Check      Cost Estimate
      │               │                │
      └───────────────┼────────────────┘
                      ▼
              Proposal Evaluation
                      │
                      ▼
              Best Agent Selected
                      │
                      ▼
                Task Execution
```

---

# Key Takeaways

- Agent Negotiation enables multiple AI agents to determine the most suitable agent for a task through structured decision-making rather than fixed assignments.
- Enterprise negotiation considers multiple factors such as capability, workload, cost, priority, availability, and historical performance.
- Common negotiation strategies include capability-based selection, cost-based optimization, load balancing, priority-based assignment, consensus, voting, and the Contract Net Protocol.
- Production AI systems combine negotiation with coordination and communication frameworks to optimize resource utilization and improve scalability.
- Effective negotiation leads to better task allocation, higher system efficiency, improved fault tolerance, and more autonomous multi-agent behavior.

---

# References

- Contract Net Protocol (Smith, 1980)
- LangGraph Documentation – Conditional Routing
- CrewAI Documentation – Multi-Agent Collaboration
- AutoGen Documentation – Multi-Agent Conversations
- Semantic Kernel Documentation – Planning
- OpenAI Agents SDK Documentation

---

## Next Note

**08-conflict-resolution.md**

In the next note, we'll explore **Conflict Resolution**, where multiple AI agents resolve disagreements over task ownership, resource allocation, execution strategy, priorities, and shared state. You'll learn arbitration strategies, voting mechanisms, consensus algorithms, leader election, optimistic concurrency, distributed locking, and production conflict resolution patterns used in enterprise multi-agent systems.