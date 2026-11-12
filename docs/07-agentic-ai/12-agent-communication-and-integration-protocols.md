---
description: Understand MCP, A2A, ACP, AG-UI, ANP, and AP2, their
  responsibilities, integration patterns, and enterprise protocol
  selection criteria.
keywords:
- Agent communication protocols
- Model Context Protocol
- MCP
- Agent2Agent
- A2A
- Agent Communication Protocol
- ACP
- AG-UI
- Agent Network Protocol
- ANP
- Agent Payments Protocol
- AP2
title: Agent Communication & Integration Protocols
---

# 12. Agent Communication & Integration Protocols

## 1. Introduction --- Why Agent Protocols Matter

Enterprise environments contain agents built with different frameworks,
hosted on different platforms, and operated by separate teams. Their
interfaces and message formats can make integration difficult.

**Agent protocols define common rules for communication**: message
structure, interaction patterns, roles, capability discovery, and
response conventions. They help otherwise independent agents and
applications discover one another and exchange information in a
predictable way.

Protocols standardize communication; workflow orchestration, execution,
and policy remain application responsibilities.

## 2. Protocol Landscape for Agentic Systems

The protocols address different communication boundaries:

  -----------------------------------------------------------------------
  Protocol                Primary boundary        Main responsibility
  ----------------------- ----------------------- -----------------------
  **MCP**                 Agent ↔ tools, data,    Standardized access to
                          and context             external capabilities
                                                  and context

  **A2A**                 Agent ↔ agent           Discovery, task
                                                  delegation, and
                                                  communication between
                                                  agents

  **ACP**                 Agent ↔ agent           Interoperable agent
                                                  communication,
                                                  including asynchronous
                                                  collaboration

  **AG-UI**               Agent ↔ user-facing     Event-based exchange of
                          application             agent state and user
                                                  interactions

  **ANP**                 Agent ↔ agent across    Discovery and
                          networks                interaction in an open
                                                  agent ecosystem

  **AP2**                 Agent ↔ payment         Secure, authorized
                          ecosystem               agent-initiated
                                                  payments
  -----------------------------------------------------------------------

The protocols are related, but they are not interchangeable. MCP
connects agents to tools and context; A2A supports agent-to-agent task
interaction; AG-UI connects agents to user interfaces; ANP targets
network-level discovery; and AP2 addresses payment authorization.
**ACP is included because it is part of the course landscape, but its
current status has changed:** IBM has announced that ACP is now part of
A2A under the Linux Foundation and that ACP development is winding down.
For new implementations, evaluate the current A2A specification and
migration guidance rather than treating ACP as a separate active choice.

## 3. Model Context Protocol (MCP)

The **Model Context Protocol (MCP)**, introduced by Anthropic,
standardizes how AI applications connect to external tools, data, and
context providers through MCP clients and servers.

### 3.1 MCP architecture

MCP has three components:

-   **Host:** The AI application, managing user interaction and one or
    more clients.
-   **Client:** Runs within the host, connects to a server, discovers
    capabilities, invokes them, and handles responses.
-   **Server:** Exposes capabilities backed by databases, APIs, files,
    or other services.

### 3.2 MCP primitives

MCP servers can expose three core primitives:

  -----------------------------------------------------------------------
  Primitive               Purpose                 Example
  ----------------------- ----------------------- -----------------------
  **Tools**               Perform actions or      Query a database, call
                          invoke operations       an API, run a
                                                  calculation

  **Resources**           Expose data for the     Document contents,
                          application or model to configuration, project
                          read                    files

  **Prompts**             Provide reusable prompt Summarize a document,
                          templates or            generate a report
                          interaction patterns    outline
  -----------------------------------------------------------------------

### 3.3 MCP communication

MCP encodes messages with JSON-RPC. Standard transports include:

-   **STDIO:** Local communication when a host launches a server process.
-   **Streamable HTTP:** Remote communication over HTTP, with optional
    streaming and HTTP-based authorization.

A typical interaction is:

``` text
User
 |
 v
MCP Host (AI application)
 |
 v
MCP Client
 |  discover / invoke
 v
MCP Server
 |
 v
Database / API / Files / Search
```

MCP standardizes the connection and capability interface. It does not
automatically make a discovered tool safe to use. The host application,
MCP server, and downstream service must still enforce authentication,
authorization, input validation, and data-access policies.

## 4. Agent2Agent (A2A)

The **Agent2Agent (A2A) Protocol**, initially launched by Google and now
managed under the Linux Foundation, provides a standard for
communication between independently developed agents.

A2A supports three broad stages:

1. **Discovery:** Identify a remote agent and inspect its advertised
   capabilities (Agent Card).
2. **Authentication and authorization:** Establish identity and access.
3. **Task interaction:** Submit work and receive status, results, or
   artifacts.

The current specification defines HTTP(S) transport and JSON-RPC 2.0
messages, with options for streaming updates and asynchronous task
notifications.

## 5. Agent Communication Protocol (ACP)

The **Agent Communication Protocol (ACP)** originated in IBM's BeeAI
initiative to enable communication between agents built with different
frameworks, languages, and runtimes. Its design emphasized a lightweight,
HTTP-native interface and asynchronous interaction, making it relevant
to long-running agent collaboration.

**Current status:** IBM's official project page now states that ACP has
become part of A2A under the Linux Foundation. The ACP team is winding
down separate development and contributing its technology and expertise
to A2A. ACP is therefore important historically and conceptually, but
should not be presented as a separate active protocol choice for a new
deployment. Refer to the [ACP migration guidance](https://research.ibm.com/projects/agent-communication-protocol)
and current [A2A specification](https://a2a-protocol.org/latest/).

## 6. Agent-User Interaction (AG-UI)

The **Agent-User Interaction (AG-UI) Protocol** is an event-based
protocol for communication between an AI agent and a user-facing
application. Its events represent agent lifecycle and state, streamed
text, tool calls, activity, and user interactions. A travel agent could
stream progress, request an itinerary choice, and present the result
through the same agent-to-UI boundary.

## 7. Agent Network Protocol (ANP)

The **Agent Network Protocol (ANP)** is an open-source framework for
agents that need to discover, identify, connect with, and interact with
other agents across the internet. Its network-oriented approach includes
agent descriptions and discovery mechanisms, with identity and
authentication specifications intended to support cross-platform
interaction.

**Specification status:** The ANP site publishes version 1.2
specifications, including a released Agent Discovery specification and
a released `did:wba` identity-method specification. The site's technical
white paper is informative, however, and individual specifications
have their own maturity states. ANP should therefore be described as an
evolving protocol suite—not assumed to be a universally adopted internet
standard. Check the [ANP specifications](https://agent-network-protocol.com/specs/)
for the status of each component.

ANP's responsibility is network-level agent discovery and interaction,
not MCP-style tool access or AG-UI-style UI events.

## 8. Agent Payments Protocol (AP2)

The **Agent Payments Protocol (AP2)**, announced by Google in 2025, is
designed to support secure transactions initiated by AI agents. It can
extend agent workflows that use protocols such as A2A and MCP.

AP2 uses cryptographically signed digital instructions called
**mandates** to prove what an agent is authorized to purchase and pay
for. The course's introductory reading describes an earlier model using
Intent and Cart Mandates. The current AP2 repository specification
(v0.2) instead defines two mandate types:

-   **Checkout Mandate:** Cryptographic proof that the agent is
    authorized to purchase a particular checkout.
-   **Payment Mandate:** Proof that the agent is authorized to pay for
    that checkout.

The current specification distinguishes **human-present** purchases,
where the user directly approves the closed checkout and payment
mandates, from **human-not-present** purchases, where previously
authorized constraints allow the agent to complete a qualifying
transaction. AP2 also defines receipts and verification responsibilities
for the merchant, credential provider, and payment processor.

For example, a user could authorize an agent to purchase an item within
a maximum budget. The agent gathers product information, coordinates
with the merchant, and prepares a checkout. AP2's mandates bind the
resulting transaction to the user's authorization. See the [current
AP2 specification](https://github.com/google-agentic-commerce/AP2/blob/main/docs/ap2/specification.md)
rather than relying on older Intent/Cart terminology.

## 9. How the Protocols Work Together

A single enterprise interaction may cross several protocol boundaries.
Consider an agent asked to purchase a product within a user-defined
budget:

``` text
User
 |
 v
Shopping Agent
 | \
 |  \ AG-UI: progress, choices, confirmation
 |   v
 |  User Interface
 |
 +---- MCP ----> Product data / Preferences / Inventory
 |
 +---- A2A ----> Retailer Agent / Payment Agent
 |
 +---- AP2 ----> Checkout & Payment Mandates
                  |
                  v
             Authorized Payment
```

The responsibilities are distinct:

1.  **AG-UI** carries agent state and user interactions to the front
    end.
2.  **MCP** provides access to product information, preferences,
    inventory, and other tools or context.
3.  **A2A** supports task communication with retailer and payment
    agents.
4.  **AP2** represents and verifies the user's checkout and payment
    authorization.

ANP may be relevant when agents must discover and interact across a
broader open network. ACP's interoperability work is now being
contributed to A2A; for new deployments, assess A2A rather than selecting
ACP as a separate protocol.

## 10. Protocol Responsibilities and Selection Criteria

Protocol selection should begin with the integration boundary---not with
the popularity of a protocol.

  Requirement                                                Protocol to evaluate
  ---------------------------------------------------------- ----------------------
  Connect an agent to tools, APIs, files, and context        MCP
  Delegate work to an independent remote agent               A2A
  Interoperable agent communication (historical ACP work)    A2A
  Stream agent state and interaction events to a UI          AG-UI
  Discover and interact with agents across an open network   ANP
  Represent authorization for agent-initiated payments       AP2

-   **Efficiency:** Evaluate latency, message overhead, and response
    time. Protocol capabilities should not introduce unnecessary
    communication cost.
-   **Reliability:** Test behavior under changing network conditions,
    timeouts, interruptions, and long-running tasks. Asynchronous
    communication and streaming may be important for different
    workloads.
-   **Scalability:** Evaluate how the protocol behaves as the number of
    agents, connections, and external services grows.
-   **Security:** Assess authentication, encryption, access control, and
    the ability to enforce trust boundaries between agents and services.

Because maturity and benchmarks vary, pilot representative workloads.
Assess specification stability, adoption, compatibility, operational
tooling, and adapter-maintenance cost.

## 11. Key Takeaways

-   Agent protocols standardize communication; they do not replace
    workflow orchestration.
-   MCP connects agents to tools, resources, and prompts through a
    host-client-server model.
-   A2A provides the current agent-to-agent protocol direction; ACP's
    work has been incorporated into A2A.
-   AG-UI standardizes event-based communication between agents and
    front-end applications.
-   ANP focuses on agent discovery and interaction across open networks.
-   AP2 uses Checkout and Payment Mandates in its current specification
    to authorize agent-initiated payments.
-   Select protocols based on the communication boundary, efficiency,
    reliability, scalability, security, and ecosystem maturity.

## What's Next?

With agent communication and integration boundaries established, the
next step is to examine how these protocols fit into enterprise agent
architectures, including identity, trust, governance, observability, and
operational control.

## Course Alignment

This chapter follows the supplied *Building AI Agents with MCP* material
and its Agentic AI Protocols reading. It covers the protocol landscape,
MCP host/client/server architecture and primitives, A2A discovery and
communication, ACP, AG-UI, ANP, AP2 mandates, a combined commercial
workflow, and the stated protocol-selection criteria.

**Publication status check (11 November 2026):** MCP's official site
publishes a 2026-07-28 specification revision; A2A's official site
identifies version 1.0.0 as the latest released version; ACP has merged
into A2A; AG-UI has active 1.0-series SDK releases; ANP publishes
version 1.2 component specifications with differing maturity labels;
and AP2's repository publishes the v0.2 specification. These statuses
are time-sensitive and should be rechecked immediately before publication
or implementation.

## References

-   [Model Context Protocol](https://modelcontextprotocol.io/)
-   [MCP specification](https://modelcontextprotocol.io/specification/)
-   [A2A specification](https://a2a-protocol.org/latest/)
-   [ACP project status and migration guidance](https://research.ibm.com/projects/agent-communication-protocol)
-   [AG-UI documentation](https://docs.ag-ui.com/introduction)
-   [ANP specifications](https://agent-network-protocol.com/specs/)
-   [AP2 current specification](https://github.com/google-agentic-commerce/AP2/blob/main/docs/ap2/specification.md)

------------------------------------------------------------------------

**Enterprise AI Engineering Handbook**\
*Building Production-Grade Enterprise AI Systems --- One Chapter at a
Time.*
