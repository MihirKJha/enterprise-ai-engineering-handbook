---
description: Explore Model Context Protocol architecture through a practical enterprise scenario, from host-client-server interactions to lifecycle, primitives, transports and security boundaries.
keywords:
- Model Context Protocol
- MCP architecture
- MCP host client server
- JSON-RPC 2.0
- MCP lifecycle
- MCP tools resources prompts
- MCP STDIO
- MCP Streamable HTTP
- MCP security
title: Model Context Protocol — Architecture & Concepts
---

# 13. Model Context Protocol (MCP) — Architecture & Concepts

## 1. Why MCP? The Integration Problem

Imagine an enterprise AI assistant that needs to answer a simple question:

*“Summarize the latest activity for customer 4821 and tell me whether there are any unresolved support cases.”*

To answer, the assistant may need customer records from a CRM, support tickets from a service platform and perhaps account information from an internal database. The model can reason over information, but it does not automatically have access to those systems.

Traditionally, developers connect each application to each external service using its own API contract, authentication mechanism, request format and response handling. As integrations grow, so does the amount of custom glue code. The same CRM connection may be implemented differently by several AI applications.

The **Model Context Protocol (MCP)** addresses this integration problem. It is an open protocol that standardizes how AI applications connect to external context and capabilities.

Two needs sit at the centre of MCP:

- **Context:** Information the model can use, such as documents, database records and API responses.
- **Capabilities:** Actions an agent can request, such as searching, querying a database, sending a message or creating a file.

MCP provides a common way to expose and discover these capabilities. Its benefits include interoperability across models and frameworks, reusable integrations, consistent interaction patterns and easier extension as new tools and data sources are introduced.

A useful mental model is a universal connector for AI applications: the application does not need a completely different integration pattern for every system. The systems behind the connector still do their own work; MCP standardizes how the AI application reaches them.

**MCP is an integration protocol—not the model, an agent reasoning engine or a workflow orchestrator.**

## 2. MCP vs Traditional API Integration

MCP does not replace REST APIs, databases or enterprise services. It introduces a standardized protocol interface between an AI application and the capabilities exposed by an MCP server.

| Traditional API integration | MCP-based integration |
|---|---|
| The application integrates with each API contract | The application communicates through a common MCP interface |
| Developers build service-specific adapters | Compatible clients can reuse MCP servers |
| Tool discovery and metadata are often application-specific | Servers can advertise available capabilities |
| Request and response handling varies by integration | MCP messages follow a common JSON-RPC-based structure |

For example, the CRM may continue to expose its existing REST API. An MCP server sits in front of it, translates an MCP tool request into the required API call, and returns the result through MCP.

The distinction is important: **MCP standardizes the AI-facing integration, not the internal implementation of every backend system.**

## 3. MCP Architecture: Three Components, Clear Responsibilities

MCP uses a client-server architecture built around three components.

- **Host:** The AI application where the user interacts with the model. It coordinates one or more MCP clients and manages the overall application experience.
- **Client:** Runs inside the host. It maintains a connection to an MCP server, exchanges protocol messages, handles responses and manages the connection lifecycle.
- **Server:** Exposes tools, resources and prompts to the client. It connects those capabilities to systems such as databases, APIs, files, developer platforms or internal services.

Think of the responsibilities this way:

- The host decides what the AI application needs to do.
- The client handles protocol communication with a server.
- The server exposes the approved capability and connects it to the underlying system.

A host can connect to several MCP servers. In a typical arrangement, it creates a separate client for each server connection. Each client manages its own session and capability negotiation. The host can then make the capabilities available to the model and route a requested operation to the appropriate client.

### Following one request through the architecture

Return to the customer-support question. The host receives the user's request and the model identifies that it needs CRM and support-ticket information. The host uses its MCP clients to communicate with the relevant servers. Those servers retrieve information from their backend systems and return it to the clients. The host makes the results available to the model, which prepares the final summary.

The model does not need to know the CRM's internal API details. It works with the capabilities exposed through MCP.

## 4. MCP Protocol Layers

MCP separates the structure of an interaction from the mechanism used to carry it.

**Data layer — what is communicated**

The data layer defines the JSON-RPC-based client-server protocol. It covers message exchange, lifecycle management, capability negotiation and core primitives: tools, resources and prompts.

**Transport layer — how it is communicated**

The transport layer establishes the communication channel between client and server. It handles connection establishment, message framing and transport-level communication and security. It carries the JSON-RPC messages over supported transports.

This separation makes the protocol easier to reason about: the data layer defines the interaction, while the transport layer moves it between the participants.

## 5. JSON-RPC 2.0: The Message Foundation

MCP uses **JSON-RPC 2.0** as its message format. It provides a lightweight structure for clients and servers to exchange requests, results and notifications.

There are three message types:

- **Request:** Calls a method and includes an identifier. The sender expects a response.
- **Response:** Returns either a result or an error associated with a request.
- **Notification:** Sends a message without an identifier. The sender does not expect a response.

This supports communication in both directions. A client can ask a server to list available tools or call a tool. A server can send notifications and, where supported, requests to the client.

JSON-RPC defines the message envelope. MCP defines the methods and protocol behaviour that give those messages meaning.

## 6. Lifecycle and Capability Negotiation

An MCP connection is not simply opened and used without agreement. It follows a lifecycle with three main phases.

<list connector="solid" marker="number" gap={2}>
  <list-item>
    **Initialization — agree before communicating**

    The client sends an `initialize` request containing its supported protocol version and client capabilities. The server responds with its protocol version and capabilities. The client then sends an `initialized` notification to complete the handshake.
  </list-item>
  <list-item>
    **Operation — discover and use capabilities**

    The client and server exchange messages. The client can discover available tools, resources and prompts, then invoke or retrieve them as needed. Servers can also send notifications and supported requests to clients.
  </list-item>
  <list-item>
    **Shutdown — close cleanly**

    The client initiates the shutdown sequence and the connection is closed cleanly.
  </list-item>
</list>

The initialization handshake includes **capability negotiation**. Both participants advertise the features they support, so the other side can determine which operations are available.

For example, a client should not assume that every server exposes tools. It checks the server's advertised capabilities before attempting tool-related operations. This helps clients and servers work together even when they support different optional features.

## 7. MCP Primitives: Tools, Resources and Prompts

The three primitives describe what an MCP server can make available to an AI application.

<box border radius="lg" gap={3} padding={3}>
  <box gap={1}>
    <row align="center" gap={2}>
      <icon name="wrench" color="secondary" size="lg"/>
      **Tools — do something**
    </row>
    Tools are functions that an AI application can invoke. Examples include querying a database, sending a message, searching the web or calling an API. A tool can trigger an action in an external system.
  </box>
  <divider color="subtle"/>
  <box gap={1}>
    <row align="center" gap={2}>
      <icon name="database" color="secondary" size="lg"/>
      **Resources — read something**
    </row>
    Resources provide contextual data, such as file contents, database records or API responses. They return information rather than performing an action.
  </box>
  <divider color="subtle"/>
  <box gap={1}>
    <row align="center" gap={2}>
      <icon name="file-text" color="secondary" size="lg"/>
      **Prompts — guide an interaction**
    </row>
    Prompts are reusable templates that structure interactions with the model. A server can define templates with arguments and message structures for common tasks.
  </box>
</box>

In the customer-support example, a tool might retrieve unresolved cases, a resource might expose a customer record, and a prompt might provide a reusable structure for preparing a support summary.

A simple way to remember the distinction is: **tools act, resources inform, prompts guide.**

## 8. Transports: STDIO and Streamable HTTP

Once the client and server agree on the protocol, they still need a way to exchange messages. MCP defines transport mechanisms for carrying JSON-RPC messages.

### STDIO — local process communication

Standard Input/Output (STDIO) is commonly used when the client launches a local MCP server process. The client sends messages through standard input and receives responses through standard output. Diagnostic output can be written to standard error.

STDIO is lightweight and useful for local integrations, such as file-system, Git or database tools. Because communication occurs through a local process rather than a network endpoint, it is often a straightforward choice for local development and tools.

### Streamable HTTP — remote communication

Streamable HTTP supports communication with remote MCP servers over HTTP. Clients send messages using HTTP POST, with optional Server-Sent Events (SSE) support for streaming server-to-client messages.

It is suited to remotely hosted services and can use HTTP-based authentication mechanisms.

| Consideration | STDIO | Streamable HTTP |
|---|---|---|
| Typical deployment | Local process | Remote server |
| Communication channel | Standard input/output | HTTP |
| Common scenario | Local tools and resources | Shared or remotely hosted services |

The choice depends on where the server runs, how clients connect and which operational and security requirements apply.

## 9. Security and Trust Boundaries

An MCP server can expose access to customer records, internal documents or tools that change business data. That makes the connection a security boundary—not just a technical integration point.

The course material highlights authentication, token-based access and OAuth authorization. For remote communication, HTTP authentication mechanisms can be used, and transport security such as TLS protects data in transit.

In an enterprise design, these controls should be part of a broader security model:

- **Identity:** Establish which user, client or service is connecting.
- **Authorization:** Restrict access to the specific tools, resources and operations that identity is allowed to use.
- **Least privilege:** Give each server integration only the permissions it needs.
- **Input and action validation:** Validate tool arguments and enforce business rules before sensitive operations execute.
- **Untrusted content:** Treat retrieved documents and external content as data, not as instructions that can override application policy.
- **Auditability:** Record sensitive tool invocations and relevant outcomes.

MCP standardizes communication; it does not automatically make an exposed tool safe. The MCP server and the backend systems it calls must enforce the appropriate permissions.

## 10. MCP in Enterprise Agent Architectures

MCP becomes especially useful when an enterprise AI application needs access to several systems without embedding every integration directly into the host.

A host might connect to separate MCP servers for CRM, support, document management and internal data platforms. Each server exposes a controlled set of capabilities. The host discovers those capabilities and routes requests through the corresponding clients.

This creates a useful separation of responsibilities:

- **Host:** Manages the AI interaction and coordinates clients.
- **MCP client:** Manages protocol communication and server sessions.
- **MCP server:** Exposes approved tools, resources and prompts.
- **Backend systems:** Remain authoritative for data, business rules and access enforcement.

For an enterprise architect, the important design question is not simply *“Can this system expose an MCP server?”* It is:

*“Which capabilities should be exposed to an AI application, under whose identity, with what permissions, and with what audit controls?”*

That question connects MCP architecture to the wider concerns of enterprise identity, governance, observability and workflow orchestration.

## 11. Key Takeaways

- MCP standardizes how AI applications connect to external context and capabilities; it does not replace backend APIs.
- The host manages the application experience, the client manages protocol communication, and the server exposes capabilities.
- The data layer defines protocol interactions; the transport layer carries them.
- JSON-RPC 2.0 provides requests, responses and notifications.
- Initialization, operation and shutdown define the connection lifecycle; initialization includes capability negotiation.
- Tools act, resources inform, and prompts guide.
- STDIO supports local process communication; Streamable HTTP supports remote connections.
- Enterprise security still depends on identity, authorization, least privilege and backend enforcement.

## What's Next?

This chapter established how MCP is structured and how its participants communicate. The next step is to put those concepts into practice: building MCP clients and servers, connecting transports, exposing capabilities and integrating MCP into agent applications. Those implementation details are covered in Part VIII.

## Further Reading

This chapter establishes the architectural foundations of the Model Context Protocol (MCP), including its architecture, communication flow, lifecycle, primitives, transports and security considerations.

For hands-on implementation, SDK usage, server and client development, and practical integration patterns, continue to **Part VIII — MCP Development & Implementation**.


**Enterprise AI Engineering Handbook**  
*Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*
