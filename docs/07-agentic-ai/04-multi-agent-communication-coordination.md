---
title: "Multi-Agent Communication & Coordination | Enterprise AI Engineering"
description: "An architecture-focused guide to agent communication models, message contracts, shared state, coordination, conflict resolution, and reliable multi-agent execution."
tags:
  - Multi-Agent Communication
  - Agent Coordination
  - Message Passing
  - Shared State
  - Conflict Resolution
  - Enterprise AI Architecture
---

# 04 — Multi-Agent Communication & Coordination

> Multi-agent systems depend not only on what each agent can do, but on how reliably they exchange information and coordinate their work.

## Introduction

Chapter 02 introduced multi-agent architecture and collaboration models. Chapter 03 explained workflow patterns that determine how tasks are executed. This chapter looks at the information flow between agents and the controls that keep their work consistent.

Consider a payment incident. A transaction agent investigates failed payments, an infrastructure agent checks service health, and a dependency agent examines downstream providers. Their work may run in parallel, but the final diagnosis depends on clear handoffs, shared context, and a way to reconcile conflicting findings.

**Communication** moves information between participants. **Coordination** controls task ownership, execution order, dependencies, and decisions when outcomes compete.

## 1. Agent Communication Models

The course material highlights three practical interaction patterns:

- **Sequential handoff:** agents work in sequence and pass outputs downstream, such as research → analysis → writing → review.
- **Parallel communication with aggregation:** independent agents work concurrently and a synthesizer combines their outputs.
- **Interactive dialogue:** agents exchange messages to clarify requirements or refine a result. For example, a requirements agent asks a data agent for information, which requests clarification from a filter agent.

These describe interaction patterns. At the implementation level, information is commonly exchanged through direct messages, shared state, or events.

### Direct messages

A sender addresses a request or result to a particular recipient. This is useful for explicit task assignment, clarification, and request-response exchanges.

### Shared state

Agents read and update a common task context. LangGraph uses this model: nodes receive workflow state and return updates, while graph edges control execution.

### Event-driven communication

An agent publishes an event—such as `task.completed` or `risk.detected`—and interested components react. Publish-subscribe is one implementation: publishers send events to a topic, and subscribers receive relevant events without a direct sender-to-recipient call.

| Mechanism | Information flow | Useful when | Main concern |
|---|---|---|---|
| Direct message | Sender → recipient | Explicit requests and handoffs | Correlation, delivery and response handling |
| Shared state | Multiple agents read or update task context | Agents need a common task view | Concurrent writes and access control |
| Event / publish-subscribe | Publisher → interested subscribers | Components react independently | Duplicate, delayed or out-of-order events |

These mechanisms can be combined. A coordinator sends task messages, workers publish completion events, and the workflow stores validated findings in shared state. Event-driven and publish-subscribe designs are useful enterprise extensions; they are not developed as implementation topics in the core course examples.

## 2. Message Passing

A message should be more than unstructured natural language. Downstream agents and application code need to know what the message means, which task it belongs to, and who should handle it.

A practical message contract includes:

- **Message ID:** supports tracing and duplicate detection.
- **Task ID:** correlates messages belonging to one workflow.
- **Sender and recipient:** identifies ownership and destination.
- **Type:** task request, clarification, progress, result, or failure.
- **Payload:** structured task details or findings.
- **Timestamp and status:** supports lifecycle tracking and stale-message checks.

The following framework-independent example uses Pydantic to validate a message before dispatch:

```python
from typing import Literal
from pydantic import BaseModel

class AgentMessage(BaseModel):
    message_id: str
    task_id: str
    sender: str
    recipient: str
    message_type: Literal[
        "task_request", "clarification",
        "task_result", "task_error"
    ]
    payload: dict

message = AgentMessage(
    message_id="msg-1042",
    task_id="incident-782",
    sender="coordinator",
    recipient="transaction_agent",
    message_type="task_request",
    payload={"operation": "find_failure_patterns"}
)

dispatch(message.model_dump())
```

The example validates the envelope; production systems should also validate payloads against task-specific schemas. A message generated by an LLM is data, not an instruction that bypasses application authorization.

Interactive dialogue is useful when a task is underspecified. However, set turn limits, deadlines, and a completion condition. Otherwise agents can repeatedly request clarification without advancing the task.

## 3. Shared State and Context

Shared state gives agents a common view of task progress without repeating the entire conversation in every message. In the course's LangGraph examples, a typed state carries the original request, intermediate results, errors, and routing information. Worker state can hold task-specific details while selected fields remain shared.

A simplified state contract might look like this:

```python
from typing import TypedDict

class IncidentState(TypedDict):
    task_id: str
    request: str
    transaction_findings: dict
    infrastructure_findings: dict
    errors: list[str]
```

Agents should return focused updates rather than rewriting the whole state. For example:

```python
def transaction_agent(state: IncidentState) -> dict:
    findings = investigate_transactions(state["request"])
    return {"transaction_findings": findings}
```

The workflow engine merges the update into the current state. In parallel workflows, define how concurrent updates are combined; two agents should not silently overwrite the same field.

Good state design separates:

- **Shared task context:** objective, constraints, status, and findings needed by multiple agents.
- **Agent-local context:** task-specific working information that other agents do not need.

Define field ownership, access permissions, persistence, and update rules. Share only relevant context: excessive context increases token consumption and can dilute an agent's focus.

## 4. Coordination Strategies

Communication carries information; coordination decides how work is assigned and controlled.

**Centralized coordination** places a coordinator or supervisor in charge of task assignment, progress, dependencies, and aggregation. It provides visibility and clear ownership, but can become a bottleneck or failure point.

**Decentralized coordination** allows agents to communicate and negotiate directly. This supports flexible peer collaboration but makes authority, task ownership, and debugging harder.

**Hybrid coordination** combines central workflow control with local agent-to-agent interaction. A supervisor may assign a task to a specialist group while those specialists exchange clarification messages directly.

| Strategy | Control model | Strength | Trade-off |
|---|---|---|---|
| Centralized | Coordinator manages assignments and progress | Clear ownership and visibility | Bottleneck risk |
| Decentralized | Agents coordinate directly | Flexible collaboration | Harder to govern and debug |
| Hybrid | Central workflow control with local collaboration | Balances control and flexibility | More design complexity |

The course illustrates these approaches through different framework styles: LangGraph provides explicit graph state and routing; AutoGen supports turn-based group conversations managed by a group-chat manager; CrewAI structures collaboration around roles, tasks, and expected outputs; and the course presents BeeAI with IBM ACP for agent communication. These are different implementation approaches, not interchangeable communication protocols.

For enterprise workflows, a coordinator often remains responsible for deadlines, permissions, escalation, and final aggregation—even when specialists collaborate directly.

## 5. Conflict Resolution

Conflict resolution is an important enterprise extension of the communication material. The course transcripts discuss coordination complexity and error handling, but do not develop a full conflict-resolution architecture. The strategies below apply established distributed-systems practices to multi-agent workflows.

Conflicts commonly involve:

- **Task ownership:** two agents claim the same task, or neither accepts it.
- **Decision:** agents produce incompatible conclusions.
- **Resource:** agents attempt to modify or reserve the same resource.
- **State:** concurrent updates overwrite or invalidate one another.
- **Priority:** several tasks compete for limited capacity.

A security agent and a backend agent, for example, may both propose changes to the authentication module. The system should detect the conflict, apply an explicit rule, validate the result, and only then continue.

Common strategies include:

- **Arbitration:** a coordinator selects an outcome using ownership, priority, policy, or evidence.
- **Voting:** agents select among proposals using an agreed decision rule. A majority is not automatically proof of correctness.
- **Consensus:** participants negotiate toward an agreed result; this can be expensive and should have a deadline.
- **Optimistic concurrency:** updates carry a version. A stale update is rejected and must be retried against the latest state.
- **Distributed locking:** a lock temporarily protects a shared resource from concurrent modification. Expiry and recovery rules are essential.

A simple optimistic-concurrency example:

```python
class VersionedState:
    def __init__(self, value):
        self.value = value
        self.version = 0

    def update(self, expected_version, new_value):
        if expected_version != self.version:
            raise RuntimeError("Stale state; reload and retry")

        self.value = new_value
        self.version += 1

state = VersionedState({"status": "investigating"})
state.update(0, {"status": "resolved"})
```

This in-memory example illustrates version checking; production concurrency control must be atomic and enforced by the database or shared-state store. Choose the strategy according to the conflict: arbitration for competing workflow decisions, version checks for concurrent state updates, and locks only when a resource truly requires exclusive access. Escalate consequential unresolved decisions to a human.

## 6. Communication Overhead and Failure Handling

Every exchange adds some combination of latency, token use, model calls, serialization, storage, and monitoring work. Multi-agent collaboration is worthwhile only when its benefits justify this cost.

Common failure scenarios include delayed or duplicate messages, agent timeouts, invalid payloads, stale state updates, repeated dialogue, and coordinator failure.

| Failure | Handling approach |
|---|---|
| Agent timeout | Bounded retry, fallback, or escalation |
| Duplicate message | Message ID and idempotent processing |
| Late or out-of-order result | Check task status and state version |
| Invalid payload | Schema validation and rejection |
| Repeated dialogue | Turn limit, deadline, and progress check |
| Partial worker failure | Explicit partial-result or wait policy |
| Coordinator failure | Persist state and define recovery or reassignment |

A production design should:

1. Set timeouts and bounded retries; never retry indefinitely.
2. Make side-effecting operations idempotent where possible.
3. Correlate requests, responses, and errors using task and message IDs.
4. Validate payloads and state versions before applying updates.
5. Define whether partial results are acceptable or require escalation.
6. Limit message volume and context to what the next agent needs.

Record sender, recipient, task ID, timing, state changes, and retry or escalation reasons. This makes it possible to reconstruct an interaction rather than seeing only the final answer.

## 💼 Backend Architecture Parallel

| Backend engineering concept | Multi-agent equivalent |
|---|---|
| REST / RPC request-response | Direct agent message and handoff |
| Shared database or workflow DTO | Shared task state |
| Event bus and pub-sub | Event-driven agent communication |
| Workflow orchestrator | Coordinator or supervisor |
| Optimistic locking / version check | Shared-state conflict control |
| Idempotency key | Message ID and duplicate protection |
| Timeout, retry, dead-letter handling | Agent communication failure handling |
| Distributed tracing / correlation ID | End-to-end agent interaction trace |

Agent autonomy does not remove distributed-systems problems. It makes explicit contracts, ownership, concurrency control, bounded retries, and observability even more important.

## Key Takeaways

- Communication moves information; coordination controls how agents work together.
- Direct messages, shared state, and events serve different needs and can be combined.
- Structured message contracts and validated payloads make handoffs traceable.
- Shared state requires field ownership, context boundaries, and concurrency rules.
- Centralized, decentralized, and hybrid coordination involve different control trade-offs.
- Conflicts need explicit resolution policies; consequential disagreements may require human review.
- Timeouts, idempotency, bounded retries, partial-result policies, and observability support reliable execution.

## What's Next?

This chapter explored how agents exchange information and coordinate their work. The next chapter examines the control layer that manages agent execution.

**Chapter 05 — Agent Orchestration & Supervisor Patterns**

## References

- [LangGraph documentation](https://docs.langchain.com/oss/python/langgraph/overview)
- [Pydantic documentation](https://docs.pydantic.dev/)

> **Enterprise AI Engineering Handbook**
>
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*
