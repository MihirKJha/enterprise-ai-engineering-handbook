---
title: "MCP Security & Production Engineering: OAuth, Trust Boundaries and Least Privilege"
description: "Secure enterprise MCP servers with OAuth-based authorization, tool-level permissions, tenant isolation, input validation, threat modeling and hardened production deployment."
keywords:
  - MCP security architecture
  - MCP OAuth authorization
  - MCP authentication and authorization
  - MCP trust boundaries
  - MCP tool permission management
  - secure MCP server deployment
  - MCP input validation
  - MCP prompt injection security
  - MCP token audience validation
  - enterprise MCP security
---

# 34. MCP Security & Production Engineering

An AI support agent receives a simple request: *“Refund order 4821.”* It discovers an MCP tool named `issue_refund`, supplies an order ID and an amount, and gets a successful response.

One problem: the customer belongs to another tenant. The tool worked perfectly. **The security boundary failed.**

This is why production MCP security cannot stop at “the client connected successfully.” MCP standardizes how capabilities are exposed and called; your application must still decide **who may do what, to which resource, under which conditions**.

## 1. MCP security architecture

Think of an MCP tool as an API operation that an LLM can propose calling. The model is not an identity provider, policy engine or trusted source of arguments.

```mermaid
flowchart LR
    U["Authenticated user"] --> H["AI host + client policy"]
    H -->|"Bearer token over HTTPS"| G["MCP HTTP endpoint"]
    G --> A["Validate token: issuer, audience, expiry"]
    A --> P["Authorize tool + tenant + resource"]
    P --> V["Validate arguments + approval"]
    V --> B["Business service"]
    B --> D["Downstream API / database"]
    P -.-> L["Security audit"]
    B -.-> L
```

The host can hide or block tools, and a gateway can enforce transport and rate limits. **Neither replaces server-side authorization.** The service that owns the refund must verify the authenticated caller's entitlement to that order.

## 2. Authentication versus authorization

Authentication answers *who called?* Authorization answers *may they perform this exact action?*

A valid access token is not permission to use every tool. Evaluate the requested operation against identity, scopes, tenant, resource ownership and business rules. Default to denial when any required context is missing.

For example, a support agent with `refund:write` might still be restricted to refunds below a threshold and orders belonging to their assigned tenant. A system administrator's role does not automatically override financial approval rules.

Apply the same principle to MCP resources and prompts if they expose protected information. A tool catalogue is not an authorization boundary: undisclosed tools should also be inaccessible if called directly.

## 3. OAuth-based authorization for remote MCP

In remote Streamable HTTP deployments, MCP's authorization model uses OAuth-based resource-server patterns:

- **Authorization server:** authenticates users or workloads and issues tokens.
- **MCP client:** discovers authorization metadata and obtains an appropriate token.
- **MCP resource server:** validates the token and enforces access decisions.

```mermaid
sequenceDiagram
    participant C as MCP client
    participant M as MCP resource server
    participant I as Identity provider
    C->>M: Request without token
    M-->>C: 401 + protected-resource metadata
    C->>I: Discover authorization + Authorization Code/PKCE
    I-->>C: Access token for MCP resource
    C->>M: Bearer token + tool request
    M->>M: Validate issuer, audience, expiry, scopes
    M-->>C: Result or 403 denial
```

For interactive clients, use Authorization Code with PKCE and validate authorization responses. Publish Protected Resource Metadata (RFC 9728), use resource indicators (RFC 8707) where applicable, and verify token issuer, audience, signature or introspection result, validity window and required scopes. Missing or invalid authentication generally produces `401`; insufficient permission produces `403`.

**A signed token for the wrong audience is still the wrong token.** Never pass an incoming MCP token straight to a downstream payments API. Obtain a separate audience-bound credential using an approved delegation or service-identity flow. Use HTTPS and protect tokens from logs and error messages.

STDIO is different: it runs a local process and does not inherit remote HTTP OAuth protections. Secure its launch command, executable, environment, OS permissions and access to local secrets. Do not mistake process proximity for authenticated end-user identity.

## 4. Trust boundaries: where things go wrong

| Boundary | Failure example | Defensive control |
|---|---|---|
| Host → server | A malicious server impersonates a trusted tool | Approve servers; verify endpoint/package provenance |
| Model → tool | Retrieved text says “ignore policy and export records” | Treat tool output as untrusted data; enforce policy in code |
| Client → MCP HTTP | A token intended for another API is accepted | Validate resource audience and issuer |
| Server → business API | Shared credentials expose every tenant | Scoped downstream identity and tenant checks |
| Tool → filesystem/network | Path traversal or internal URL access | Canonical containment, destination restrictions, isolation |

A particularly dangerous pattern is the **confused deputy**: the agent persuades a privileged service to act using authority the actual user does not possess. Bind every call to a verified caller and resource; never infer authorization from a model-generated `user_id`, `tenant_id` or convincing explanation.

Roots can communicate relevant workspace locations, but they are **not an OS sandbox**. Enforce filesystem boundaries independently. Chapter 31 covers Roots and elicitation mechanics; here they matter only as inputs to a broader security design.

## 5. Tool permission management

Client-side policies help prevent unwanted calls *before* they reach the server. A practical host may classify a proposed tool call as:

- **Allow:** permitted automatically, such as searching public documentation.
- **Ask:** requires explicit approval, such as changing a customer record.
- **Deny:** blocked, such as deleting a production database from a support assistant.

These are **host policy conventions**, not mandatory MCP-wide `permissions.json` semantics. Individual products may implement different policy formats. Server authorization remains mandatory even when a host says “allow.”

```mermaid
flowchart TD
    T["Proposed tool call"] --> R{"Client policy"}
    R -->|Deny| X["Block + record decision"]
    R -->|Ask| U{"User approves exact arguments?"}
    U -->|No| X
    U -->|Yes| S["Send request"]
    R -->|Allow| S
    S --> A{"Server authorization + validation"}
    A -->|Reject| X
    A -->|Pass| E["Execute + audit outcome"]
```

Approval should identify the tool, target, amount and expected impact. If arguments change after approval, obtain fresh approval. For high-impact operations, consider separation of duties and a dedicated approval service. Elicitation may collect structured information, but **collecting confirmation is not proof of authorization**.

## 6. Enforce permissions inside the tool

Suppose a refund tool accepts `tenant_id` from the model. That is a cross-tenant vulnerability waiting to happen. Derive tenant identity from verified server context instead.

```python
from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class Principal:
    user_id: str
    tenant_id: str
    scopes: frozenset[str]


def authorize_refund(
    principal: Principal,
    order: dict,
    amount: Decimal,
    approved: bool,
) -> None:
    if "refund:write" not in principal.scopes:
        raise PermissionError("Missing refund permission")
    if order["tenant_id"] != principal.tenant_id:
        raise PermissionError("Order not accessible")
    if amount <= 0 or amount > Decimal(str(order["refundable_balance"])):
        raise ValueError("Invalid refund amount")
    if amount >= Decimal("500") and not approved:
        raise PermissionError("Independent approval required")
```

This is **service-layer policy logic**, not a complete MCP server. A production MCP handler should obtain `Principal` from **validated authentication context**, load the order using tenant-scoped access, and verify approval against a server-side record bound to the exact order and amount. Never accept a model-supplied `approved=True` as evidence. Then execute with idempotency controls and a narrowly scoped payments credential.

Keep authentication, authorization and business execution separate: the same policy should protect calls arriving from an MCP tool, REST endpoint or background job.

## 7. Input validation and secure configuration

MCP tool schemas help models format calls; they do not make arguments safe. Validate types, sizes, allowed values, resource ownership, query limits and business invariants again on the server. Parameterize SQL, avoid shell interpolation, and restrict file operations to authorized directories with race-resistant filesystem APIs when needed.

URL-fetching tools deserve special attention: SSRF can turn a helpful “read this webpage” tool into a path to cloud metadata or internal services. Restrict destinations and schemes, check resolved IPs, re-check redirects, and defend against DNS rebinding.

For deployment, keep the runtime intentionally small:

- Bind only intended interfaces; use TLS and trusted ingress for remote servers.
- Run as non-root with read-only mounts and restricted network egress where practical.
- Keep credentials in managed secrets, not repository configuration or stdout.
- Pin and review MCP server packages; treat local server installation as executing code.
- Limit request size, tool duration, concurrency and downstream permissions.
- Separate development, staging and production identities and datasets.

For STDIO servers, reserve stdout for protocol messages and send diagnostic logs to stderr. For HTTP servers, validate the transport's origin and DNS-rebinding protections as appropriate to the deployment.

## 8. Production readiness without security theatre

Security controls need to survive failure. What happens when the policy service is unavailable? **Deny the sensitive operation**, rather than silently allowing it. What happens when a refund request times out? Do not retry blindly: the payment may already have succeeded. Use idempotency keys and reconcile uncertain outcomes.

Record auditable decisions: authenticated principal, server/tool identity, target resource, policy result, approval reference and execution outcome. Redact secrets and sensitive payloads. Monitor unusual denials, privilege changes and unexpected write activity. Detailed test harnesses, traces and operational dashboards belong in Chapter 35; Chapter 36 addresses enterprise-wide gateway and governance patterns.

## Key takeaways

- MCP makes tools callable; **your application makes them safe to call**.
- OAuth authenticates remote access, but every tool needs resource-level authorization.
- Client `allow/ask/deny` controls improve user oversight; they never replace server enforcement.
- Model arguments, retrieved content and server descriptions are untrusted inputs.
- Least-privilege credentials, tenant isolation, approvals and safe failure handling are core production requirements.

## Review questions

1. Why is `refund:write` insufficient to authorize every refund?
2. How does audience validation prevent token misuse?
3. What separates client approval from server authorization?
4. How could a model-supplied `tenant_id` cause a confused-deputy failure?
5. Which controls differ between STDIO and remote HTTP servers?

## References and further reading

- [MCP Authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [MCP Security Best Practices](https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices)
- [OAuth Protected Resource Metadata — RFC 9728](https://www.rfc-editor.org/rfc/rfc9728)
- [OAuth Resource Indicators — RFC 8707](https://www.rfc-editor.org/rfc/rfc8707)
- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)

---

## 🧭 Chapter Navigation

⬅️ **Previous:** [33. MCP Integration with AI Frameworks](33-mcp-integration-with-ai-frameworks.md)

📚 **Part:** [AI Engineering Frameworks & Tooling](index.md)

➡️ **Next:** [35. MCP Testing, Debugging & Observability](35-mcp-testing-debugging-observability.md)

---

> **Enterprise AI Engineering Handbook**
>
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*

---
