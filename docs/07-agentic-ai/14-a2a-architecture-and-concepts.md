---
description: Explore Agent2Agent (A2A) Protocol architecture through a practical enterprise scenario, covering agent discovery, Agent Cards, messages, tasks, artifacts, task lifecycle, communication patterns and security boundaries, and how A2A complements MCP.
keywords:
- Agent2Agent Protocol
- A2A Protocol
- A2A architecture
- A2A Agent Cards
- A2A task lifecycle
- A2A messages and artifacts
- A2A agent communication
- A2A streaming
- A2A protocol bindings
- A2A security
- A2A vs MCP
- Enterprise multi-agent systems
title: Agent2Agent (A2A) Protocol — Architecture & Concepts
---

# Agent2Agent (A2A) Protocol: Architecture & Concepts

## 1. Why Do Independent Agents Need A2A?

Picture a customer asking an enterprise assistant: *“Why was my payment delayed, and are there any unresolved support cases?”*

The assistant may need a payment specialist, a fraud-analysis agent and a customer-support agent. Each could be owned by a different team, built with a different framework and deployed independently. The challenge is not creating these agents. It is getting them to collaborate without hard-wiring every possible agent pairing.

Custom REST endpoints can connect them, but teams must agree on request formats, task tracking, status updates, errors and authentication each time. The integration layer quickly becomes a collection of one-off contracts.

The **Agent2Agent (A2A) Protocol** provides a common interaction model for independent agents to discover capabilities, exchange messages, delegate work and return results. An agent does not need access to another agent's private prompts, memory or internal reasoning. It needs a well-defined way to request work and receive its outcome.

That separation is the point: agents can remain independently implemented while collaborating through a shared protocol.

## 2. A2A Is More Than an API Call

A conventional API is often designed around a known operation: submit a payment, retrieve an invoice or check an account balance. The caller sends a request and expects a response.

Agent work is less predictable. A specialist may need to investigate several systems, ask for missing information, wait for approval or produce a report. The work may continue long after the initial request.

A2A builds an agent-oriented interaction model on familiar network technologies:

| Traditional API | A2A |
|---|---|
| Caller invokes a known operation | Client discovers an agent and its advertised skills |
| Usually request and response | Immediate message or tracked task |
| Contract describes endpoints and data | Agent Card describes identity, capabilities and interfaces |
| Often short-lived operation | Supports long-running work and progress updates |

A2A does not replace business APIs. A remote agent may call REST services internally. A2A standardizes the boundary where the participant is another independent agent.

## 3. The Architecture: Client, Remote Agent and Agent Card

An A2A interaction has two primary participants:

- **A2A Client:** The application or agent initiating the request.
- **A2A Server:** The remote agent exposing an A2A-compatible endpoint.

The client does not need to know whether the remote agent uses Java, Python, LangGraph or a proprietary orchestration engine. It needs to know what the agent can do and how to communicate with it.

That information is published in an **Agent Card**: a JSON document describing the agent's identity, skills, supported interfaces, capabilities and security requirements. Clients can discover cards through a well-known URL, a registry or direct configuration.

A simplified illustrative card:

```json
{
  "name": "Payment Investigation Agent",
  "description": "Investigates delayed or failed payments",
  "version": "1.0.0",
  "supportedInterfaces": [
    {
      "url": "https://payments.example.com/a2a",
      "protocolBinding": "HTTP+JSON",
      "protocolVersion": "1.0"
    }
  ],
  "capabilities": {
    "streaming": true,
    "pushNotifications": false
  },
  "skills": [
    {
      "id": "payment-investigation",
      "name": "Investigate payment",
      "description": "Finds the cause of a delayed or failed payment"
    }
  ]
}
```

The card helps a client decide *which* agent may be suitable and *how* to reach it. It is a capability description, not a guarantee of quality or trustworthiness. Enterprises still need to validate the card's source and enforce access policies.

## 4. Messages, Tasks and Artifacts: Three Concepts to Remember

A2A separates the conversation from the work and its output:

- **Message** carries a communication turn: an instruction, clarification or update.
- **Task** represents stateful work that can continue after the initial request.
- **Artifact** carries the output produced by a task, such as a report, document or structured result.

A message contains one or more **Parts**. A Part can carry text, file content or structured data. This lets agents exchange more than plain text.

A useful mental model:

<box border radius="lg" padding={3} gap={2}>
  <box background="surface-secondary" radius="md" padding={3} gap={1}>
    **Message**

    “Investigate transaction TX-4821 and identify the reason for the delay.”
  </box>
  <box align="center">
    <icon name="arrow-down" color="secondary" size="lg"/>
  </box>
  <box background="surface-secondary" radius="md" padding={3} gap={1}>
    **Task**

    Payment agent retrieves records, checks processing events and analyses the result.
    <badge color="info">Working</badge>
  </box>
  <box align="center">
    <icon name="arrow-down" color="secondary" size="lg"/>
  </box>
  <box background="surface-secondary" radius="md" padding={3} gap={1}>
    **Artifact**

    Investigation summary, transaction evidence and recommended next action.
    <badge color="success">Completed</badge>
  </box>
</box>

Not every interaction needs a Task. A simple request can receive an immediate Message. When work needs tracking, the agent returns a Task with an identifier and status.

## 5. What a Real A2A Exchange Looks Like

With the HTTP+JSON binding, a client can send a message to the remote agent's `POST /message:send` endpoint. This compact example follows the A2A 1.0 message shape:

```python
import requests
from uuid import uuid4

agent_url = "https://payments.example.com"
token = obtain_access_token()  # Application-specific

payload = {
    "message": {
        "messageId": str(uuid4()),
        "role": "ROLE_USER",
        "parts": [
            {
                "text": (
                    "Investigate transaction TX-4821. "
                    "Explain why it is delayed."
                )
            }
        ]
    }
}

response = requests.post(
    f"{agent_url}/message:send",
    json=payload,
    headers={
        "Authorization": f"Bearer {token}",
        "A2A-Version": "1.0"
    },
    timeout=30
)
response.raise_for_status()
result = response.json()
```

The response may contain an immediate Message or a Task. For a tracked task, the client stores its ID and checks the status:

```python
task = result.get("task")

if task:
    task_id = task["id"]
    print("Task state:", task["status"]["state"])

    status_response = requests.get(
        f"{agent_url}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}",
                         "A2A-Version": "1.0"},
        timeout=15
    )
    status_response.raise_for_status()
    task = status_response.json()

    for artifact in task.get("artifacts", []):
        for part in artifact.get("parts", []):
            if "text" in part:
                print(part["text"])
```

This is an illustrative HTTP client, not a complete production integration. A real client must handle authentication refresh, retries, timeouts, task states and the remote agent's advertised capabilities. The important idea is that the initial message starts the interaction; the Task gives the client something stable to track.

## 6. Long-Running Work: Polling, Streaming and Push

How should the client follow a task that takes minutes rather than seconds? A2A supports three update patterns:

- **Polling:** The client periodically calls `GET /tasks/{id}`. Simple, but can create unnecessary requests and delay updates.
- **Streaming:** The client uses `POST /message:stream` or subscribes to a task. With the HTTP binding, updates can arrive as Server-Sent Events (SSE).
- **Push notifications:** The agent sends task updates to a client-registered webhook. Useful when the client does not keep a connection open.

These are not interchangeable in every deployment. The client should check the Agent Card for streaming or push-notification support before relying on either capability.

A task can move through states such as working, input required, authentication required, completed, failed or canceled. If the agent needs more information, the client can send another message associated with the existing `taskId`. A `contextId` groups related messages and tasks into a broader interaction.

## 7. Protocol Bindings and Security Boundaries

A2A defines the interaction model separately from the network binding. The v1.0 specification includes **JSON-RPC, gRPC and HTTP+JSON/REST** bindings. The Agent Card declares supported interfaces so a client can select one it understands.

This distinction keeps the meaning of a Task or Message consistent even when deployments use different transports.

A2A also does not make remote agents automatically trustworthy. Treat every remote agent as an independently operated service:

- Authenticate the client and verify the remote endpoint.
- Authorize which identities may invoke each skill.
- Send only the data needed for the delegated task.
- Validate returned artifacts before using them in downstream workflows.
- Audit delegation decisions, task IDs and outcomes.
- Apply timeouts, quotas and cancellation policies.

A protocol-compliant response can still be incorrect, incomplete or malicious. The calling system remains responsible for validating results before using them in sensitive business decisions.

## 8. A2A and MCP: Different Boundaries, One Architecture

Return to the delayed-payment investigation. The customer-support agent delegates the work to the payment agent using **A2A**. The payment agent then accesses transaction records and payment operations through **MCP**.

| Interaction | Protocol | Responsibility |
|---|---|---|
| Support agent → Payment agent | A2A | Delegate investigation |
| Payment agent → Transaction tools | MCP | Access approved tools and data |
| Payment agent → Support agent | A2A | Return status and findings |

The distinction is straightforward: **A2A connects agents; MCP connects an agent to tools and data.** One does not replace the other. Together, they allow an enterprise to separate agent collaboration from access to operational systems.


## 9. Designing Reliable Agent Delegation

A handoff requires more than sending a message. The caller must decide what work to delegate, what context the specialist needs and how to handle delays.

For example, the support agent should not send an entire customer history to the payment agent if the transaction ID and a limited set of details are sufficient. A focused request reduces unnecessary data exposure and makes the specialist's responsibility clearer.

The caller should also define its expectations before delegation:

- **Scope:** What question must the remote agent answer, and what is outside its responsibility?
- **Completion criteria:** What evidence or output will allow the caller to continue?
- **Time budget:** How long should the caller wait before escalating, retrying or informing the user?
- **Failure behavior:** Should the workflow stop, use an alternative agent or continue with a partial result?

Retries need particular care. If a network timeout occurs after a task was accepted, blindly resending the same request could create duplicate work. The client should first determine whether the original task exists, using the task or context information available to it. For business actions that can change external state, the remote agent should also apply appropriate idempotency controls.

A2A provides the interaction model; it does not make these workflow decisions automatically. They belong in the orchestration and governance design around the protocol.

## 10. Where A2A Fits in a Multi-Agent System

A2A standardizes communication between agents, but it does not prescribe how an enterprise must orchestrate them. A central coordinator may select specialists and delegate tasks. Alternatively, agents may collaborate through more distributed patterns, provided each participant follows the agreed interaction and security contracts.

The coordinator remains responsible for the overall request: combining results, resolving conflicts and deciding whether the answer is complete. A specialist owns the task it accepted, not the entire business outcome.

The payment agent may report a settlement delay while the fraud agent finds no suspicious activity. Neither result alone answers the customer's full question. The support agent must correlate both findings and check for unresolved cases.

## Further Reading

This chapter establishes the architectural foundations of A2A: agent discovery, messages, tasks, artifacts, task updates, protocol bindings and trust boundaries.

For hands-on implementation, SDK usage, client and server development, and practical integration patterns, continue to **Part VIII — MCP & Agent Protocol Development**.

## References

- [A2A Protocol — v1.0.0 Specification](https://a2a-protocol.org/v1.0.0/specification/)
- [A2A Protocol — Official Documentation](https://a2a-protocol.org/v1.0.0/)
- [A2A Protocol — GitHub Repository](https://github.com/a2aproject/A2A)

---

**Enterprise AI Engineering Handbook**  
*Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*
