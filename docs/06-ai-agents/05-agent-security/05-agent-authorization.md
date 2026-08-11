# Agent Authorization

> Agent authorization defines what an AI Agent is permitted to access, invoke, modify, or execute after authentication and identity verification.

---

## 📖 Overview

Authentication answers:

> **Who is making the request?**

Authorization answers:

> **What is this identity allowed to do?**

For AI Agents, authorization becomes more complex because an agent may act on behalf of a user, access enterprise data, invoke tools, call APIs, modify resources, and execute business operations.

A production agent therefore needs explicit authorization boundaries.

```text
User
 ↓
Authentication
 ↓
Identity
 ↓
Authorization
 ↓
Agent
 ↓
Tool / API
 ↓
Enterprise Resource
```

Authorization should not be treated as a single permission check.

An agent may need authorization at multiple levels:

```text
User
 ↓
Agent
 ↓
Capability
 ↓
Tool
 ↓
Action
 ↓
Resource
 ↓
Data
```

For example:

```text
User
 ↓
Customer Support Agent
 ↓
Customer Account Capability
 ↓
Order Tool
 ↓
View Order
 ↓
Customer's Order
```

The agent should not automatically inherit unrestricted access to every capability available to the underlying service.

---

# 🎯 Learning Objectives

After completing this chapter, you will understand:

- Authentication vs authorization
- Why AI Agents require explicit authorization
- User authorization
- Agent identity
- Service identity
- Capability-based authorization
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)
- Resource-level authorization
- Action-level authorization
- Tool authorization
- Delegated authorization
- User-context propagation
- Least privilege
- Permission boundaries
- Dynamic authorization
- Policy enforcement
- High-risk action authorization
- Human approval
- Multi-tenant authorization
- Authorization failures
- Authorization observability
- Enterprise authorization architecture

---

# 1. Authentication vs Authorization

Authentication establishes identity.

```text
Who are you?
```

Authorization determines permissions.

```text
What are you allowed to do?
```

The relationship is:

```text
Authentication
      ↓
Identity
      ↓
Authorization
      ↓
Allowed Actions
```

For example:

```text
User logs in
      ↓
Identity = mihir@example.com
      ↓
Authorization
      ↓
Can view customer orders
Can update own tickets
Cannot issue refunds
```

Authentication without authorization is insufficient for enterprise agents.

---

# 2. Why Agent Authorization Is Different

Traditional applications generally have predictable execution paths.

```text
User
 ↓
Application
 ↓
Known API
 ↓
Known Resource
```

Agents can dynamically select tools.

```text
User
 ↓
Agent
 ↓
Reasoning
 ↓
Tool Selection
 ↓
Tool
 ↓
Resource
```

The agent may have access to many tools:

```text
Customer Tool
Order Tool
Payment Tool
Refund Tool
Email Tool
Database Tool
```

The agent must not be allowed to invoke every available capability simply because the tool exists.

Therefore:

> **Tool availability must not be confused with authorization.**

---

# 3. Authorization Boundaries

A production agent should have explicit boundaries.

```text
                    Agent
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       Allowed      Allowed     Denied
        Tool A       Tool B      Tool C
          │           │
          ↓           ↓
       Resource     Resource
```

The authorization layer determines whether the proposed operation is permitted.

```text
Agent Decision
      ↓
Authorization Check
      ↓
 ┌────┴────┐
 ↓         ↓
Allow     Deny
 ↓         ↓
Execute   Stop
```

---

# 4. Agent Identity

An agent may operate using multiple identities.

For example:

```text
Human User
    ↓
Agent Identity
    ↓
Service Identity
    ↓
Enterprise Resource
```

These identities should not automatically be treated as interchangeable.

Possible identities include:

```text
User Identity
Agent Identity
Service Identity
Application Identity
Tenant Identity
Session Identity
```

A production architecture should clearly establish:

> **Who initiated the action, which agent performed it, and which service identity executed it.**

---

# 5. User-Delegated Authorization

An agent often acts on behalf of a user.

```text
User
 ↓
Agent
 ↓
API
 ↓
Resource
```

The API should be able to determine:

```text
User = X
Agent = Y
Action = Z
Resource = R
```

For example:

```text
User:
Customer A

Agent:
Customer Support Agent

Action:
View Order

Resource:
Order belonging to Customer A
```

The agent should not use the user's authorization context to access unrelated customer records.

---

# 6. Delegation

Delegation allows an agent to perform actions on behalf of an authorized identity.

Conceptually:

```text
User
 ↓
Delegates Allowed Capability
 ↓
Agent
 ↓
Execute
```

Delegation should be:

```text
Explicit
Scoped
Time-Bounded
Auditable
Revocable
```

For example:

```text
User grants:
"Read my calendar."

Agent receives:
Calendar Read Capability

Agent does NOT receive:
Delete Calendar
Modify Calendar
Access Other Users' Calendars
```

This follows the principle of least privilege.

---

# 7. Least Privilege

The agent should receive only the permissions required for the task.

```text
Required Capability
        ↓
Minimum Permission
        ↓
Agent
```

Avoid:

```text
Agent
 ↓
Full Database Access
```

Prefer:

```text
Agent
 ↓
Approved Customer API
 ↓
Allowed Operations
```

Least privilege reduces:

- Data exposure
- Unauthorized actions
- Security impact
- Blast radius
- Accidental modifications

---

# 8. Capability-Based Authorization

A useful model for agents is capability-based authorization.

Instead of granting broad access:

```text
Agent = Customer Service
```

grant specific capabilities:

```text
view_customer_profile
view_order
create_support_ticket
request_refund
```

Conceptually:

```text
Agent
 │
 ├── view_customer_profile
 ├── view_order
 └── create_support_ticket
```

while:

```text
delete_customer
issue_large_refund
modify_billing_account
```

remain unavailable.

This provides a more precise authorization boundary.

---

# 9. Role-Based Access Control

RBAC assigns permissions through roles.

Example:

```text
Role:
Customer Support Agent
```

Permissions:

```text
view_customer
view_order
create_ticket
```

Another role:

```text
Role:
Finance Agent
```

Permissions:

```text
view_payment
process_refund
view_invoice
```

Conceptually:

```text
User
 ↓
Role
 ↓
Permissions
 ↓
Agent
```

RBAC is useful when enterprise permissions are relatively stable.

---

# 10. Attribute-Based Access Control

ABAC evaluates attributes when making authorization decisions.

Example:

```text
User Department = Finance
Resource Department = Finance
Action = READ
Environment = Corporate Network
```

Policy:

```text
Allow if:
User.Department == Resource.Department
```

Agent authorization may therefore consider:

```text
User Attributes
Agent Attributes
Resource Attributes
Action
Tenant
Environment
Risk
Time
```

Conceptually:

```text
              Authorization Request
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      User          Resource        Action
   Attributes      Attributes
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                  Policy Engine
                       ↓
                  Allow / Deny
```

---

# 11. Resource-Level Authorization

Authorization should often happen at the resource level.

For example:

```text
User:
Customer A
```

Resources:

```text
Order A
Order B
Order C
```

The user may only access:

```text
Order A
```

Therefore:

```text
Authenticated User
        ↓
Authorized Resource
```

not simply:

```text
Authenticated User
        ↓
All Orders
```

Resource-level authorization is particularly important for multi-tenant enterprise systems.

---

# 12. Action-Level Authorization

Authorization should also consider the action.

For example:

```text
Resource:
Customer Account

Actions:
READ
UPDATE
DELETE
```

A user may have:

```text
READ = Allowed
UPDATE = Allowed
DELETE = Denied
```

Therefore:

```text
Authorization
=
Identity
+
Resource
+
Action
+
Context
```

---

# 13. Tool Authorization

An agent may have access to many tools.

```text
Agent
 │
 ├── Search Tool
 ├── Customer Tool
 ├── Payment Tool
 ├── Refund Tool
 └── Email Tool
```

Authorization should determine which tools may be invoked.

```text
User Request
 ↓
Agent
 ↓
Tool Selection
 ↓
Authorization
 ↓
Tool Execution
```

For example:

```text
Refund Tool
 ↓
Authorization
 ↓
Denied
```

The agent must not bypass this restriction by selecting the tool directly.

---

# 14. Tool Permission vs Tool Availability

These are different concepts.

### Tool Availability

```text
Tool exists
```

### Tool Authorization

```text
Agent is allowed to invoke it
```

Therefore:

```text
Tool Registry
      ↓
Available Tools

Authorization Policy
      ↓
Allowed Tools

Intersection
      ↓
Actually Executable Tools
```

This distinction is important in production agent runtimes.

---

# 15. Action Authorization Pipeline

A production tool call can follow:

```text
Agent Decision
      ↓
Action Validation
      ↓
Identity Resolution
      ↓
Authorization Check
      ↓
Policy Check
      ↓
Risk Check
      ↓
Tool Execution
```

Only after all required checks pass should the tool be executed.

---

# 16. User Context Propagation

When an agent calls another service, the original user context may need to be propagated.

Conceptually:

```text
User
 ↓
Agent
 ↓
Service A
 ↓
Service B
 ↓
Database
```

The downstream service may need to know:

```text
Original User
Agent Identity
Tenant
Requested Action
Authorization Context
```

Without proper propagation:

```text
Agent
 ↓
Privileged Service Account
 ↓
Unrestricted Data
```

can create a major security risk.

---

# 17. Avoiding Privilege Escalation

A common danger is:

```text
Low-Privilege User
        ↓
Agent
        ↓
High-Privilege Service Account
        ↓
Sensitive Resource
```

The agent must not become an indirect privilege escalation mechanism.

A safer model is:

```text
User Permissions
      ↓
Delegated Scope
      ↓
Agent
      ↓
Service
      ↓
Resource
```

The service should enforce the appropriate authorization independently.

---

# 18. Authorization and Service Accounts

Enterprise agents often run using service identities.

For example:

```text
Agent Runtime
      ↓
Service Account
      ↓
Enterprise API
```

The service account should have:

```text
Minimum Required Permissions
```

rather than:

```text
Administrator
```

A strong design separates:

```text
Human Identity
Agent Identity
Service Identity
```

and records their relationships.

---

# 19. Authorization Context

A useful authorization request can contain:

```json
{
  "subject": "user-123",
  "agent": "customer-support-agent",
  "tenant": "tenant-a",
  "action": "view_order",
  "resource": "order-456",
  "context": {
    "channel": "support",
    "risk": "low"
  }
}
```

The authorization engine can evaluate the complete context.

Conceptually:

```text
Subject
   +
Agent
   +
Tenant
   +
Action
   +
Resource
   +
Context
        ↓
Authorization Decision
```

---

# 20. Dynamic Authorization

Authorization may depend on runtime context.

Example:

```text
User Role = Finance Manager
Action = Refund
Amount = $500
```

Policy:

```text
≤ $1,000 → Allowed
> $1,000 → Approval Required
```

The same user may therefore receive different decisions for different requests.

```text
Refund $500
 ↓
ALLOW

Refund $5,000
 ↓
REQUIRE APPROVAL
```

This is more flexible than static role permissions alone.

---

# 21. Risk-Based Authorization

Agent actions can be categorized by risk.

```text
Risk Level

LOW
Read Documentation
View Order

MEDIUM
Create Ticket
Modify Profile

HIGH
Issue Refund
Delete Resource
Execute Financial Transaction
```

Authorization can then incorporate risk:

```text
Low Risk
 ↓
Automatic

Medium Risk
 ↓
Policy Check

High Risk
 ↓
Approval
```

This allows enterprises to provide greater autonomy for low-risk operations while controlling high-risk actions.

---

# 22. Step-Up Authorization

Some operations may require additional authorization before execution.

```text
Agent
 ↓
Request Action
 ↓
Risk Evaluation
 ↓
High Risk
 ↓
Additional Authorization
 ↓
Execute
```

Examples include:

- Financial transactions
- Sensitive data access
- Production infrastructure changes
- Administrative operations

This provides a security boundary around high-impact agent actions.

---

# 23. Human Approval

Authorization and human approval can work together.

```text
Agent
 ↓
Authorization
 ↓
High-Risk Action
 ↓
Human Approval
 ↓
Execute
```

The approval request should include:

```text
Requested Action
Resource
User
Reason
Risk
Relevant Context
Proposed Parameters
```

The human should approve a specific action rather than granting unrestricted future access.

---

# 24. Temporary Permissions

Some agent capabilities should exist only for the duration of a task.

```text
Task Start
 ↓
Grant Temporary Capability
 ↓
Execute
 ↓
Task Complete
 ↓
Revoke Capability
```

For example:

```text
Agent receives:
"Read customer account for this task."

After completion:
Permission expires.
```

Temporary authorization can reduce long-lived privilege exposure.

---

# 25. Scoped Authorization

Permissions should be scoped as narrowly as practical.

Instead of:

```text
Can access all customer records
```

prefer:

```text
Can access customer's active order
```

Instead of:

```text
Can modify all infrastructure
```

prefer:

```text
Can restart this approved service
```

Authorization scope can include:

```text
Tenant
Resource
Action
Time
Environment
Tool
Data Classification
```

---

# 26. Multi-Tenant Agent Authorization

Enterprise agents often serve multiple tenants.

```text
Tenant A
   ↓
Agent
   ↓
Tenant A Data

Tenant B
   ↓
Agent
   ↓
Tenant B Data
```

A critical requirement is:

> **An agent operating for Tenant A must never access Tenant B resources unless explicitly authorized.**

Authorization should therefore include tenant context.

```text
User
 +
Tenant
 +
Agent
 +
Action
 +
Resource
```

---

# 27. Tenant Isolation

A strong architecture enforces tenant isolation at multiple layers.

```text
Request
 ↓
Tenant Identification
 ↓
Authorization
 ↓
Agent Context
 ↓
Tool
 ↓
Data Access Layer
 ↓
Tenant-Scoped Data
```

Tenant filtering should not rely solely on the LLM.

The data and service layers should enforce isolation deterministically.

---

# 28. Data-Level Authorization

An agent may have access to a system but not every piece of data.

Example:

```text
Database
 ├── Public Data
 ├── Internal Data
 ├── Confidential Data
 └── Restricted Data
```

Authorization can determine which classifications are accessible.

```text
Agent
 ↓
Data Classification
 ↓
Policy
 ↓
Allowed Data
```

This is particularly important when agents use:

- Enterprise search
- RAG
- Databases
- File systems
- CRM systems
- HR systems

---

# 29. Authorization in RAG Systems

RAG introduces an important authorization problem.

Suppose:

```text
Knowledge Base
 ├── Public Documents
 ├── Finance Documents
 ├── HR Documents
 └── Legal Documents
```

An agent should retrieve only documents the user is authorized to access.

Correct flow:

```text
User
 ↓
Authorization Context
 ↓
Retriever
 ↓
Permission-Aware Retrieval
 ↓
Authorized Documents
 ↓
LLM
```

Incorrect flow:

```text
Retriever
 ↓
All Documents
 ↓
LLM
 ↓
Filter Answer
```

Filtering only after retrieval can expose sensitive information to the model.

Therefore:

> **Authorization should be enforced as early as possible in the retrieval pipeline.**

---

# 30. Authorization-Aware Tool Routing

Tool selection can incorporate authorization.

```text
User Request
      ↓
Available Capabilities
      ↓
Authorization Filter
      ↓
Authorized Tools
      ↓
Agent Selection
```

For example:

```text
Available:
Search
Refund
Delete Customer
Email

Authorized:
Search
Email

Agent Tool Set:
Search
Email
```

This reduces the chance of unauthorized tool selection.

However, the final authorization check should still happen at execution time.

---

# 31. Defense in Depth

Authorization should not depend on a single check.

A stronger architecture uses multiple layers:

```text
User Authentication
        ↓
Agent Authorization
        ↓
Tool Authorization
        ↓
Service Authorization
        ↓
Resource Authorization
        ↓
Data Authorization
```

Each layer provides an independent control.

This reduces the impact of authorization bugs in any single component.

---

# 32. Authorization and Policy Engines

Enterprise systems may use a dedicated policy decision point.

```text
Agent
 ↓
Authorization Request
 ↓
Policy Engine
 ↓
ALLOW / DENY / APPROVAL
```

The policy engine can evaluate:

```text
Identity
Role
Attributes
Tenant
Resource
Action
Risk
Environment
```

This separates authorization policy from application logic.

---

# 33. Policy Enforcement Point

A useful architectural distinction is:

```text
Policy Decision Point
        ↓
Makes Authorization Decision

Policy Enforcement Point
        ↓
Enforces Decision
```

For example:

```text
Agent
 ↓
API Gateway
 ↓
Policy Decision
 ↓
Allow
 ↓
Service
```

The agent itself should not be the ultimate authority for authorization.

---

# 34. Authorization Decision Types

Authorization does not always need to be binary.

Possible outcomes include:

```text
ALLOW
DENY
REQUIRE_APPROVAL
REQUIRE_STEP_UP
LIMIT_SCOPE
```

For example:

```text
Refund $500
 ↓
ALLOW

Refund $5,000
 ↓
REQUIRE_APPROVAL

Delete Production Database
 ↓
DENY
```

This provides more expressive enterprise control.

---

# 35. Authorization Failure Handling

When authorization fails:

```text
Agent Action
 ↓
Authorization
 ↓
DENY
```

The agent should not:

```text
Retry Indefinitely
Try Another Identity
Bypass Policy
Search for an Alternative Privileged Tool
```

Instead:

```text
DENY
 ↓
Explain Appropriate Limitation
      OR
Request Required Approval
      OR
Escalate
```

---

# 36. Authorization Failure vs Tool Failure

These failures should be distinguished.

### Tool Failure

```text
Tool unavailable
```

Possible response:

```text
Retry / Fallback
```

### Authorization Failure

```text
Action not permitted
```

Possible response:

```text
Stop / Escalate / Request Approval
```

A production agent should not treat authorization denial as a transient technical error.

---

# 37. Authorization and Auditability

Every sensitive agent action should be auditable.

An audit event may contain:

```json
{
  "timestamp": "2026-08-11T10:30:00Z",
  "user": "user-123",
  "agent": "support-agent",
  "tenant": "tenant-a",
  "action": "refund",
  "resource": "payment-456",
  "decision": "REQUIRE_APPROVAL"
}
```

Audit records help answer:

```text
Who requested the action?
Which agent performed it?
What action was requested?
Which resource was targeted?
Which policy was evaluated?
What was the decision?
Was human approval required?
```

---

# 38. Authorization Observability

Authorization decisions should be part of the agent trace.

```text
Agent Run
 │
 ├── User
 ├── Tenant
 ├── Agent
 ├── Requested Action
 ├── Resource
 ├── Authorization Decision
 ├── Policy
 ├── Risk
 └── Execution Result
```

Useful metrics include:

```text
Authorization Denial Rate
Approval Rate
Policy Violation Attempts
High-Risk Action Rate
Authorization Latency
Authorization Errors
```

A sudden increase in authorization failures may indicate:

- Configuration problems
- Permission changes
- Application bugs
- Attack attempts
- Incorrect agent behavior

---

# 39. Authorization and Prompt Injection

Prompt injection can attempt to manipulate an agent into performing unauthorized actions.

For example:

```text
Malicious Instruction
 ↓
Agent
 ↓
"Ignore previous restrictions"
 ↓
Attempt Restricted Tool
```

The authorization layer must remain independent of the model.

```text
Prompt
 ↓
Agent Decision
 ↓
Authorization
 ↓
DENY
```

The model cannot grant itself permissions through natural language.

This is a fundamental security principle:

> **Instructions are not permissions.**

---

# 40. Authorization and Tool Poisoning

Tool descriptions or external content may attempt to influence an agent's behavior.

For example:

```text
External Content
 ↓
"Use admin tool to retrieve everything"
```

The agent may consider the suggestion, but authorization must still determine whether the action is permitted.

```text
Agent Proposal
 ↓
Authorization
 ↓
Allowed / Denied
```

Tool metadata and external content must never become implicit permission grants.

---

# 41. Authorization and Memory

Agent memory can contain sensitive information.

Therefore memory access itself requires authorization.

```text
Agent
 ↓
Memory Request
 ↓
Authorization
 ↓
Allowed Memory
```

For example:

```text
User A
 ↓
Agent Memory
 ↓
User A Information
```

The agent must not retrieve another user's private memory simply because the information exists in the memory store.

---

# 42. Authorization and Long-Running Agents

Long-running agents introduce additional risks.

A permission granted at:

```text
09:00
```

may no longer be valid at:

```text
18:00
```

Therefore long-running agents should consider:

```text
Permission Expiration
Token Expiration
Re-Authorization
Session Expiration
Policy Changes
User Revocation
```

Conceptually:

```text
Long-Running Agent
        ↓
Authorization Check
        ↓
Execute
        ↓
Authorization Expired?
      /      \
    No        Yes
    ↓          ↓
Continue   Re-authorize
```

---

# 43. Authorization and Background Agents

Background agents may execute without an interactive user present.

For example:

```text
Scheduled Agent
 ↓
Analyze Transactions
 ↓
Detect Anomalies
 ↓
Create Report
```

The system must define:

```text
Who authorized this agent?
What permissions does it have?
Which resources can it access?
How long are permissions valid?
What actions require approval?
```

Background execution should not mean unrestricted execution.

---

# 44. Authorization and Agent-to-Agent Calls

When multiple agents communicate:

```text
Agent A
 ↓
Agent B
 ↓
Tool
```

Agent B should not automatically trust Agent A.

Authorization should establish:

```text
Who is Agent A?
What is Agent A allowed to request?
What is Agent B allowed to perform?
Which user initiated the operation?
Which tenant is involved?
```

Part VII will cover multi-agent authorization and coordination in greater detail.

---

# 45. Authorization for High-Impact Actions

High-impact operations should use stronger authorization.

Examples:

```text
Delete Data
Issue Refund
Transfer Money
Modify Production
Change Permissions
Access Restricted Records
```

A possible architecture:

```text
Agent
 ↓
Action Classification
 ↓
High Risk
 ↓
Authorization
 ↓
Human Approval
 ↓
Execution
```

This supports controlled autonomy.

---

# 46. Authorization Architecture

A production enterprise architecture may look like:

```text
                         User
                           │
                           ▼
                    Authentication
                           │
                           ▼
                    Identity Context
                           │
                           ▼
                       AI Agent
                           │
                           ▼
                    Proposed Action
                           │
                           ▼
                 Authorization Layer
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
       Identity          Policy           Risk
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                ┌────────────────────┐
                │ Authorization      │
                │ Decision           │
                └─────────┬──────────┘
                          │
             ┌────────────┼────────────┐
             ↓            ↓            ↓
          ALLOW         APPROVAL      DENY
             │            │
             ↓            ↓
        Tool / API     Human Review
             │            │
             └──────┬─────┘
                    ↓
                Execution
                    │
                    ▼
                Audit Trail
```

---

# 47. Recommended Authorization Flow

A practical production flow is:

```text
1. Authenticate User
        ↓
2. Establish Identity
        ↓
3. Establish Tenant
        ↓
4. Establish Agent Identity
        ↓
5. Determine Requested Action
        ↓
6. Determine Target Resource
        ↓
7. Evaluate Authorization
        ↓
8. Evaluate Risk
        ↓
9. Require Approval if Necessary
        ↓
10. Execute
        ↓
11. Audit
```

---

# 48. Authorization Checklist

Before deploying an enterprise AI Agent, verify:

### Identity

- [ ] User identity is established
- [ ] Agent identity is established
- [ ] Service identity is controlled
- [ ] Tenant identity is propagated

### Permissions

- [ ] Least privilege is applied
- [ ] Tools have explicit permissions
- [ ] Actions have explicit permissions
- [ ] Resources are authorization-aware
- [ ] Data access is controlled

### Delegation

- [ ] Delegation is explicit
- [ ] Scope is limited
- [ ] Permissions can expire
- [ ] Permissions can be revoked

### Risk

- [ ] High-risk actions are identified
- [ ] Step-up authorization is supported
- [ ] Human approval is supported
- [ ] Sensitive actions are audited

### Security

- [ ] Prompt instructions cannot grant permissions
- [ ] Tool descriptions cannot grant permissions
- [ ] Memory access is authorized
- [ ] Multi-tenant isolation is enforced
- [ ] Privilege escalation is prevented

### Operations

- [ ] Authorization decisions are logged
- [ ] Denials are observable
- [ ] Approval events are auditable
- [ ] Authorization failures are monitored

---

# 49. Key Engineering Principles

### 1. Authentication Is Not Authorization

Knowing who the user is does not determine what they can do.

### 2. Tool Availability Is Not Permission

A tool being registered does not mean every agent or user may invoke it.

### 3. Never Let the LLM Grant Itself Permissions

Authorization must be enforced outside the model.

### 4. Use Least Privilege

Grant only the capabilities required for the task.

### 5. Propagate User Context

Downstream services should understand the identity and authorization context behind agent actions.

### 6. Enforce Authorization at the Resource Boundary

Do not rely only on the agent to protect data.

### 7. Use Risk-Based Authorization

Higher-risk actions require stronger controls.

### 8. Make Delegation Explicit

Agents acting on behalf of users should have clearly scoped delegated permissions.

### 9. Use Defense in Depth

Authorization should be enforced across agent, tool, service, resource, and data layers.

### 10. Audit Sensitive Actions

Every important authorization decision should be traceable.

---

# 50. Part VI → Part VII Boundary

Authorization belongs to **Part VI — AI Agents** because every individual enterprise agent needs clear identity, permission, and execution boundaries.

```text
Part VI — AI Agents

Identity
   ↓
Authorization
   ↓
Tools
   ↓
Actions
   ↓
Resources
   ↓
Controlled Execution
```

Part VII extends authorization into multi-agent environments:

```text
Part VII — Agentic AI & Multi-Agent Systems

Agent A
   ↓
Agent B
   ↓
Agent C
   ↓
Delegation
   ↓
Coordination
   ↓
Cross-Agent Authorization
```

Topics such as:

- Agent-to-agent authorization
- Delegated agent capabilities
- Multi-agent trust
- Agent identity federation
- A2A authorization

belong in **Part VII** rather than being duplicated here.

---

# 📌 Key Takeaways

- Authorization determines what an AI Agent is allowed to do.
- Agent authorization is more complex because agents dynamically select tools and execute actions.
- User identity, agent identity, service identity, tenant identity, and resource identity should be distinguishable.
- Tool availability does not imply authorization.
- Least privilege should be applied to agent capabilities and service identities.
- Capability-based authorization provides fine-grained control over agent actions.
- RBAC works well for stable enterprise roles, while ABAC enables context-aware decisions.
- Authorization should consider the user, agent, tenant, action, resource, and runtime context.
- Agents acting on behalf of users should use explicit and scoped delegation.
- High-risk actions may require step-up authorization or human approval.
- Multi-tenant systems must enforce tenant isolation at the service and data layers.
- RAG systems should enforce authorization before unauthorized information reaches the model.
- Authorization must be enforced outside the LLM and cannot be overridden through prompts.
- Reflection and reasoning cannot bypass authorization boundaries.
- Long-running and background agents require explicit permission lifecycle management.
- Authorization decisions should be observable and auditable.
- Defense in depth should protect agent, tool, service, resource, and data boundaries.
- The objective is **controlled agent autonomy with explicit authorization boundaries**.

---

# 🔗 Related Topics

### Previous

**[04. Agent Security & Guardrails](04-agent-security-and-guardrails.md)**

### Next

**[06. Agent Observability](06-agent-observability.md)**

### Related

- [Agent Fundamentals](01-ai-agent-fundamentals.md)
- [Agent Architecture](02-ai-agent-architecture.md)
- [Planning & Task Decomposition](08-planning-and-task-decomposition.md)
- [Agent Reasoning](09-agent-reasoning.md)
- [Reflection & Self-Correction](10-reflection-and-self-correction.md)
- [Agent Evaluation](10-agent-evaluation.md)
- [Agent Memory](../02-agent-memory/01-agent-memory-overview.md)
- [Agent Deployment](../06-agent-deployment/01-agent-deployment-overview.md)

---

> **Enterprise AI Engineering Handbook**  
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*