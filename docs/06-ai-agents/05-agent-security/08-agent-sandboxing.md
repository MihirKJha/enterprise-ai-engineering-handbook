# Agent Sandboxing

> Agent sandboxing isolates AI Agent execution from critical enterprise systems, resources, credentials, and the host environment, limiting the impact of incorrect, malicious, or unintended agent actions.

---

## 📖 Overview

AI Agents can do more than generate text.

They may:

- Execute code
- Read files
- Write files
- Access databases
- Invoke APIs
- Run shell commands
- Install packages
- Interact with cloud services
- Modify application state
- Process untrusted content

This creates a fundamental security problem:

> **What happens if the agent makes a wrong decision or executes an unsafe action?**

A production architecture should assume that agent actions can fail.

Therefore, the agent should operate inside controlled execution boundaries.

```text
                         AI Agent
                            │
                            ▼
                       Action Request
                            │
                            ▼
                      Policy / Guardrail
                            │
                            ▼
                         Sandbox
                            │
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
           Files          Code          Network
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                       Controlled Result
                            │
                            ▼
                          Agent
```

The fundamental principle is:

> **An agent should never receive more execution capability than is required for the task.**

---

# 🎯 Learning Objectives

After completing this chapter, you will understand:

- Why AI Agents require sandboxing
- Agent execution boundaries
- Process isolation
- Container isolation
- Virtual machines
- MicroVMs
- Code execution sandboxes
- File-system isolation
- Network isolation
- Resource limits
- CPU and memory controls
- Execution timeouts
- System-call restrictions
- Read-only environments
- Ephemeral environments
- Workspace isolation
- Dependency isolation
- Tool isolation
- Cloud execution boundaries
- Sandbox lifecycle
- Sandbox cleanup
- Multi-tenant sandboxing
- Untrusted code execution
- Prompt injection containment
- Defense in depth
- Sandbox observability
- Sandbox failure handling
- Enterprise sandbox architecture

---

# 1. Why AI Agents Need Sandboxing

Traditional applications generally execute predetermined operations.

```text
Application
 ↓
Known Code
 ↓
Known Operations
```

Agents can dynamically decide what to execute.

```text
User
 ↓
Agent
 ↓
Reasoning
 ↓
Action Selection
 ↓
Tool / Code
 ↓
Execution
```

The agent may make mistakes.

For example:

```text
User:
"Analyze this dataset."

Agent:
 ↓
Generate Python Code
 ↓
Execute Code
```

If the generated code has unrestricted access:

```text
Generated Code
 ↓
File System
 ↓
Network
 ↓
Environment Variables
 ↓
Cloud Credentials
```

the potential impact becomes much larger.

Sandboxing limits this blast radius.

---

# 2. The Agent Execution Boundary

A useful architecture separates:

```text
Agent Decision
```

from:

```text
Agent Execution
```

Conceptually:

```text
                   Agent
                     │
                     ▼
               Proposed Action
                     │
                     ▼
              Security Boundary
                     │
                     ▼
                  Sandbox
                     │
                     ▼
                Execution
```

The agent proposes an action.

The sandbox determines where and under what constraints that action executes.

This distinction is important because:

> **The LLM should not be the final security boundary.**

---

# 3. What Should Be Sandboxed?

Potentially untrusted operations include:

```text
Code Execution
Shell Commands
File Manipulation
Browser Automation
Plugin Execution
Third-Party Tools
Scripts
Data Processing
Package Installation
External Programs
```

A production system should evaluate each capability independently.

```text
Agent
 │
 ├── Search
 ├── Database
 ├── Code Execution
 ├── Browser
 ├── File System
 └── Cloud API
```

Not every capability requires the same sandbox.

---

# 4. Tool Execution vs Sandbox

A tool may be safe or unsafe depending on what it can access.

For example:

```text
get_order_status()
```

may expose only a controlled API.

But:

```text
execute_shell_command()
```

can potentially access:

```text
Files
Processes
Network
Environment
Operating System
```

Therefore:

```text
Tool Risk
    ↓
Required Isolation
```

should be evaluated for each capability.

---

# 5. Principle of Least Privilege

Sandboxing follows the same principle as authorization:

> **Give the agent only what it needs.**

For example:

```text
Task:
Analyze CSV

Required:
✓ Read input CSV
✓ Write result file
✓ Execute Python

Not Required:
✗ Access SSH
✗ Access Production Database
✗ Modify Host Files
✗ Access Cloud Credentials
```

A sandbox should enforce these boundaries.

---

# 6. Sandbox Isolation Levels

Different workloads require different isolation strengths.

A simplified hierarchy is:

```text
Application Isolation
       ↓
Process Isolation
       ↓
Container Isolation
       ↓
MicroVM Isolation
       ↓
Virtual Machine Isolation
       ↓
Dedicated Environment
```

The appropriate choice depends on:

```text
Threat Model
Workload
Performance Requirements
Isolation Requirements
Cost
Execution Duration
```

---

# 7. Process Isolation

A lightweight approach is to execute agent tasks in isolated processes.

```text
Agent Runtime
 ├── Process A
 ├── Process B
 └── Process C
```

Controls may include:

```text
CPU Limits
Memory Limits
Timeouts
File Permissions
System Calls
```

Process isolation can be efficient but may provide weaker isolation than stronger virtualization approaches.

It should therefore be selected according to the threat model.

---

# 8. Container Sandboxing

Containers provide a common execution boundary.

```text
                 Agent
                   │
                   ▼
              Sandbox Runtime
                   │
                   ▼
               Container
          ┌────────┼────────┐
          ↓        ↓        ↓
        Code     Files    Network
```

Containers can provide:

- Filesystem isolation
- Process isolation
- Resource limits
- Network controls
- Dependency isolation
- Reproducible environments

However:

> **A container is not automatically a complete security boundary.**

The configuration and underlying runtime matter.

---

# 9. Containers With Restricted Privileges

A sandbox container should generally avoid unnecessary privileges.

For example:

```text
Container
 ├── Non-root user
 ├── Limited capabilities
 ├── Read-only filesystem
 ├── Restricted network
 ├── Limited CPU
 └── Limited memory
```

Avoid giving agent workloads:

```text
Privileged Mode
Host Network
Host Filesystem
Host PID Namespace
Unrestricted Capabilities
```

unless there is a specific, justified requirement.

---

# 10. Virtual Machines

A VM provides stronger isolation through virtualization.

```text
Host
 │
 ├── VM A
 │    └── Agent Sandbox
 │
 └── VM B
      └── Agent Sandbox
```

VM isolation can be useful for:

- Untrusted code
- Strong tenant isolation
- High-risk workloads
- Security-sensitive execution

The trade-off is generally higher resource overhead and startup cost compared with lightweight process isolation.

---

# 11. MicroVMs

MicroVMs aim to provide stronger isolation with lower overhead than traditional VMs.

Conceptually:

```text
Agent
 ↓
MicroVM
 ↓
Sandboxed Runtime
 ↓
Code Execution
```

They can be useful for workloads requiring:

```text
Strong Isolation
Fast Startup
Ephemeral Execution
High Workload Density
```

MicroVM-based architectures are particularly interesting for large-scale agent code execution.

---

# 12. Ephemeral Sandboxes

An ephemeral sandbox exists only for a specific task.

```text
Task Starts
    ↓
Create Sandbox
    ↓
Execute
    ↓
Collect Result
    ↓
Destroy Sandbox
```

Example:

```text
User Request
 ↓
Create Sandbox
 ↓
Install Temporary Dependencies
 ↓
Execute Code
 ↓
Generate Result
 ↓
Destroy Sandbox
```

This reduces persistent state and limits the lifetime of potentially compromised environments.

---

# 13. Why Ephemeral Execution Matters

A compromised environment becomes less useful when it disappears after execution.

Without ephemeral execution:

```text
Task 1
 ↓
Sandbox
 ↓
Files Remain
 ↓
Task 2
 ↓
Previous Data Accessible
```

With ephemeral execution:

```text
Task 1
 ↓
Sandbox
 ↓
Destroy
 ↓
Task 2
 ↓
Fresh Sandbox
```

This reduces cross-task contamination.

---

# 14. Workspace Isolation

Agents may need temporary files.

A sandbox can provide:

```text
/workspace
```

with controlled access.

Example:

```text
Sandbox
 ├── /input
 ├── /workspace
 └── /output
```

Permissions can be:

```text
/input
→ Read Only

/workspace
→ Read / Write

/output
→ Controlled Export
```

The agent should not automatically access:

```text
/etc
/home
/root
/var
Host Filesystem
```

---

# 15. Read-Only Filesystems

If the task does not require system-level writes:

```text
Read-Only Root Filesystem
```

can reduce attack surface.

For example:

```text
Container
 ├── Root FS → Read Only
 ├── /tmp → Temporary Writable
 └── /workspace → Controlled Writable
```

This limits persistent modifications.

---

# 16. Temporary Storage

Agent tasks often require temporary files.

A secure design can provide:

```text
Ephemeral Storage
      ↓
Task
      ↓
Cleanup
```

For example:

```text
/input
/workspace
/output
```

with the sandbox destroying temporary data when execution ends.

---

# 17. Network Isolation

Network access is one of the most important sandbox controls.

An unrestricted agent could potentially:

```text
Access Internal APIs
Scan Networks
Download Malware
Upload Data
Call Unauthorized Services
Exfiltrate Sensitive Information
```

Therefore:

```text
Sandbox
 ↓
Network Policy
 ↓
Allowed Destinations
```

should be explicit.

---

# 18. Network Deny-by-Default

A secure starting point is:

```text
Network
 ↓
DENY
```

and then explicitly allow required destinations.

Example:

```text
Allowed:
api.example.com
storage.example.com

Denied:
Internal Admin Network
Database Network
Unknown Internet Destinations
```

This reduces unexpected network access.

---

# 19. Egress Control

Egress controls restrict where sandbox workloads can send data.

```text
Sandbox
    │
    ├── API A → ALLOW
    ├── Storage → ALLOW
    ├── Internal DB → DENY
    └── Unknown Internet → DENY
```

Egress control is particularly important for preventing data exfiltration.

---

# 20. Ingress Control

Ingress controls determine what can reach the sandbox.

```text
External Request
      ↓
Ingress Policy
      ↓
Sandbox
```

Only approved input channels should be exposed.

For example:

```text
Agent Runtime
 ↓
Sandbox API
```

rather than:

```text
Internet
 ↓
Direct Sandbox Access
```

---

# 21. DNS Restrictions

Network isolation should also consider DNS.

An agent may attempt:

```text
Resolve Internal Host
Resolve Malicious Domain
Resolve Metadata Endpoint
```

Therefore DNS access can be restricted through:

```text
DNS Policy
Allowlist
Internal Resolver Controls
```

This is an important defense-in-depth measure.

---

# 22. Cloud Metadata Protection

Cloud environments may expose metadata endpoints that can provide credentials or instance information.

A sandbox should not have unrestricted access to:

```text
Cloud Metadata Service
```

unless explicitly required.

The architecture should ensure:

```text
Sandbox
 ↓
Metadata Endpoint
 ↓
DENY
```

or tightly control access through workload identity and network policy.

---

# 23. Credential Isolation

Sandboxing should work together with secrets management.

Avoid:

```text
Sandbox
 ↓
All Environment Variables
 ↓
Cloud Credentials
```

Prefer:

```text
Sandbox
 ↓
Specific Capability
 ↓
Credential Provider
 ↓
Scoped Credential
```

Secrets should not be exposed simply because code is running inside the sandbox.

---

# 24. Environment Variable Filtering

A sandbox should carefully control which environment variables are exposed.

Avoid passing:

```text
ALL_ENVIRONMENT_VARIABLES
```

Prefer:

```text
TASK_ID
WORKSPACE
SAFE_CONFIGURATION
```

and only explicitly required credentials or configuration.

Environment filtering reduces accidental credential exposure.

---

# 25. CPU Limits

An agent-generated workload may accidentally or intentionally consume excessive CPU.

Example:

```python
while True:
    pass
```

Without limits:

```text
CPU
 ↓
100%
 ↓
Host / Cluster Impact
```

A sandbox should enforce CPU limits:

```text
Sandbox
 ↓
CPU Quota
 ↓
Execution
```

---

# 26. Memory Limits

Memory exhaustion can similarly affect infrastructure.

```text
Agent Code
 ↓
Allocate Huge Memory
 ↓
Memory Exhaustion
```

The sandbox should enforce:

```text
Memory Limit
```

For example:

```text
Sandbox Memory:
512 MB
```

If the workload exceeds the limit:

```text
Execution
 ↓
Memory Limit
 ↓
Terminate
```

---

# 27. Execution Timeouts

Every agent execution should have a defined maximum runtime where appropriate.

```text
Task
 ↓
Sandbox
 ↓
Timeout
 ↓
Terminate
```

For example:

```text
Maximum Runtime = 30 seconds
```

A timeout protects against:

```text
Infinite Loops
Hung Processes
Deadlocks
Unexpectedly Long Computation
Resource Abuse
```

---

# 28. Process Limits

A malicious or poorly generated program may create many processes.

```text
Agent Code
 ↓
Fork
 ↓
Fork
 ↓
Fork
 ↓
Resource Exhaustion
```

Sandbox policies can restrict:

```text
Maximum Processes
Maximum Threads
Maximum File Descriptors
Maximum Connections
```

---

# 29. System Call Restrictions

Low-level sandboxing may restrict operating-system system calls.

Conceptually:

```text
Agent Code
 ↓
System Call
 ↓
Security Policy
 ↓
ALLOW / DENY
```

Only required operations should be permitted.

This can reduce the attack surface available to untrusted code.

---

# 30. Capability Restrictions

Operating systems and container runtimes may provide capabilities that grant additional privileges.

A sandbox should drop unnecessary capabilities.

Conceptually:

```text
Default Capabilities
        ↓
Remove Unneeded Capabilities
        ↓
Minimal Capability Set
```

The objective is:

```text
Required Capability
       ≠
Full Host Capability
```

---

# 31. Privileged Containers

Privileged containers substantially weaken isolation.

Avoid:

```text
Agent
 ↓
Privileged Container
 ↓
Host-Level Access
```

unless there is a carefully reviewed and justified requirement.

For general agent code execution:

```text
Unprivileged Container
```

is a much safer starting point.

---

# 32. Dependency Isolation

Agent-generated code may require packages.

Example:

```text
pip install pandas
```

Installing dependencies directly onto the host is unsafe.

Prefer:

```text
Task
 ↓
Ephemeral Sandbox
 ↓
Dependency Installation
 ↓
Execution
 ↓
Destroy
```

This prevents agent-generated dependencies from contaminating the host environment.

---

# 33. Package Installation Policy

Package installation can introduce risks.

Potential problems:

```text
Malicious Package
Compromised Package
Typosquatting
Untrusted Repository
Dependency Vulnerability
```

A production sandbox may therefore use:

```text
Approved Package Registry
Package Allowlist
Dependency Scanning
Network Restrictions
Version Pinning
```

---

# 34. Code Execution Sandboxing

A code-execution agent should follow:

```text
User Request
 ↓
Agent
 ↓
Generate Code
 ↓
Security Validation
 ↓
Sandbox
 ↓
Execute
 ↓
Collect Output
 ↓
Destroy
```

The generated code should never execute directly on the production host.

---

# 35. Code Validation Before Execution

A validation layer can inspect generated code before execution.

Possible checks include:

```text
Dangerous Imports
Shell Commands
File Access
Network Access
Credential Access
Process Creation
Privilege Escalation
```

However:

> **Static code analysis should complement sandboxing, not replace it.**

Generated code can behave unexpectedly at runtime.

---

# 36. Sandbox as the Primary Boundary

The security model should therefore be:

```text
Code Validation
      +
Sandbox
      +
Network Policy
      +
Resource Limits
      +
Authorization
```

rather than:

```text
Prompt:
"Do not access files."
```

Natural-language restrictions alone are not a reliable security boundary.

---

# 37. Browser Agent Sandboxing

Browser agents may interact with untrusted websites.

```text
Agent
 ↓
Browser
 ↓
Untrusted Website
```

The browser environment should be isolated from:

```text
Host Filesystem
Enterprise Network
Credentials
Browser Profile
Sensitive Cookies
```

A dedicated browser sandbox can provide:

```text
Ephemeral Browser
Restricted Network
Isolated Storage
Temporary Session
```

---

# 38. File Access Controls

If an agent needs file access:

```text
Agent
 ↓
File Tool
 ↓
Sandbox Workspace
```

Do not provide unrestricted:

```text
/
```

filesystem access.

Instead:

```text
Allowed Paths
 ↓
/workspace
/input
/output
```

Path traversal should also be prevented.

---

# 39. Path Traversal Protection

An agent may generate:

```text
../../etc/passwd
```

or similar paths.

The file-access layer should validate:

```text
Requested Path
 ↓
Canonical Path
 ↓
Allowed Workspace?
 ↓
ALLOW / DENY
```

This control should exist outside the LLM.

---

# 40. Database Isolation

If code execution needs database access, avoid giving direct production database credentials.

Prefer:

```text
Agent
 ↓
Database Capability
 ↓
Read-Only API / Query Service
 ↓
Controlled Database
```

If direct access is unavoidable:

```text
Sandbox
 ↓
Read-Only Credential
 ↓
Restricted Database
```

and ideally:

```text
Production Write Access
 ↓
DENY
```

---

# 41. Production Environment Isolation

Agent-generated code should not run inside the same environment as critical application services.

Avoid:

```text
Production Application
        +
Agent Code Execution
```

Prefer:

```text
Production Application
        │
        ▼
Sandbox Service
        │
        ▼
Isolated Execution Environment
```

This prevents agent execution failures from directly affecting the core application.

---

# 42. Multi-Tenant Sandboxing

In multi-tenant environments:

```text
Tenant A
 ↓
Sandbox A

Tenant B
 ↓
Sandbox B
```

Avoid sharing writable state between tenants.

Each sandbox should have isolated:

```text
Filesystem
Memory
Network
Credentials
Process Space
Temporary Data
```

---

# 43. Cross-Tenant Sandbox Leakage

A dangerous architecture is:

```text
Tenant A
 ↓
Shared Sandbox
 ↓
Tenant B Data
```

Instead:

```text
Tenant A Request
 ↓
Tenant A Sandbox
 ↓
Tenant A Workspace
```

and:

```text
Tenant B Request
 ↓
Tenant B Sandbox
 ↓
Tenant B Workspace
```

Tenant isolation should be enforced by infrastructure.

---

# 44. Sandbox Lifecycle

A production sandbox should have an explicit lifecycle.

```text
Create
  ↓
Initialize
  ↓
Inject Approved Inputs
  ↓
Execute
  ↓
Collect Output
  ↓
Sanitize
  ↓
Audit
  ↓
Destroy
```

The lifecycle should not leave uncontrolled resources behind.

---

# 45. Sandbox Cleanup

Cleanup should include:

```text
Temporary Files
Processes
Network Connections
Memory
Credentials
Logs
Mounted Volumes
Temporary Tokens
```

The goal is:

```text
Task Complete
      ↓
No Persistent Sensitive State
```

---

# 46. Snapshot and Reuse

Reusable sandbox images can improve performance.

```text
Golden Image
     ↓
Create Sandbox
     ↓
Task
     ↓
Destroy
```

However, reusable environments should not contain:

```text
Credentials
User Data
Previous Task Data
Persistent Sessions
Sensitive Files
```

Immutable base images are generally preferable.

---

# 47. Immutable Sandbox Images

A strong model is:

```text
Immutable Base Image
        +
Ephemeral Workspace
        +
Runtime Configuration
```

The base image contains:

```text
Approved Runtime
Approved Libraries
Security Configuration
```

while task-specific data remains ephemeral.

---

# 48. Sandbox Resource Quotas

Enterprise systems should enforce quotas.

Example:

```text
CPU:
2 cores

Memory:
1 GB

Runtime:
60 seconds

Storage:
500 MB

Processes:
20

Network:
Allowlisted destinations only
```

The values should be determined according to the workload.

---

# 49. Sandbox Admission Policy

Before starting a sandbox:

```text
Task
 ↓
Risk Classification
 ↓
Required Capabilities
 ↓
Resource Requirements
 ↓
Sandbox Policy
 ↓
Create / Reject
```

For example:

```text
Simple Data Analysis
 ↓
Standard Sandbox
```

while:

```text
Untrusted Code + Internet
 ↓
High-Isolation Sandbox
```

---

# 50. Risk-Based Sandboxing

Not every task requires the same isolation.

```text
LOW RISK
Read-only API call
       ↓
Standard Tool Boundary

MEDIUM RISK
File Processing
       ↓
Container Sandbox

HIGH RISK
Untrusted Code + Network
       ↓
Strong Isolation / MicroVM
```

This provides a balance between:

```text
Security
Performance
Cost
```

---

# 51. Sandbox Policy

A sandbox policy can describe:

```json
{
  "filesystem": {
    "read": ["/input"],
    "write": ["/workspace", "/output"]
  },
  "network": {
    "mode": "allowlist"
  },
  "resources": {
    "cpu": 2,
    "memory_mb": 1024,
    "timeout_seconds": 60
  }
}
```

The exact policy format depends on the execution platform.

The important concept is that execution constraints are explicit and machine-enforced.

---

# 52. Sandbox and Authorization

Sandboxing does not replace authorization.

They solve different problems.

### Authorization

```text
Can the agent perform this action?
```

### Sandboxing

```text
If the action executes, what can it affect?
```

Together:

```text
Agent Action
     ↓
Authorization
     ↓
Sandbox
     ↓
Controlled Execution
```

---

# 53. Sandbox and Secrets Management

Secrets management answers:

```text
Which credential can the workload access?
```

Sandboxing answers:

```text
What can the workload do with the environment it receives?
```

Together:

```text
Authorization
      ↓
Secret Access
      ↓
Sandbox
      ↓
Tool Execution
```

A sandbox should not receive credentials that the task does not require.

---

# 54. Sandbox and Data Privacy

Sandboxing also supports privacy.

```text
User Data
 ↓
Sandbox
 ↓
Task
 ↓
Destroy
```

Ephemeral environments can reduce persistent copies of sensitive data.

However, sandboxing alone does not guarantee privacy.

Privacy controls must still address:

```text
LLM
Memory
Logs
Traces
Caches
Storage
```

---

# 55. Sandbox and Prompt Injection

Prompt injection may attempt to cause an agent to execute dangerous actions.

For example:

```text
Malicious Content
 ↓
Agent
 ↓
"Run this command"
 ↓
Sandbox
```

If the command executes inside a properly restricted sandbox:

```text
Restricted Filesystem
Restricted Network
Restricted Credentials
Restricted Resources
```

the potential impact is reduced.

Therefore:

> **Sandboxing is an important containment layer against agent-induced actions resulting from prompt injection.**

It does not replace input validation, authorization, or other security controls.

---

# 56. Sandbox and Tool Poisoning

A malicious or compromised tool may attempt to perform unsafe operations.

```text
Agent
 ↓
Tool
 ↓
Unexpected Action
 ↓
Sandbox
```

The sandbox provides an additional containment boundary.

The tool should still be:

```text
Authenticated
Authorized
Validated
Monitored
```

Sandboxing is defense in depth.

---

# 57. Sandbox Observability

Sandbox execution should produce operational telemetry.

Useful metrics include:

```text
Sandbox Creation Count
Sandbox Failure Rate
Execution Duration
CPU Usage
Memory Usage
Network Requests
Filesystem Operations
Timeouts
Terminations
Resource Limit Violations
```

Sensitive payloads should still be redacted.

---

# 58. Sandbox Audit Events

An audit record may contain:

```json
{
  "task_id": "task-123",
  "tenant": "tenant-a",
  "sandbox_id": "sandbox-456",
  "runtime": "python",
  "duration_ms": 3200,
  "exit_code": 0,
  "network_access": "restricted",
  "status": "completed"
}
```

Avoid recording:

```text
Credentials
Sensitive Input
Private Files
Secret Tokens
```

unless explicitly required and appropriately protected.

---

# 59. Sandbox Failure Handling

Possible failures include:

```text
Timeout
Memory Limit
CPU Limit
Process Limit
Network Denied
Permission Denied
Runtime Crash
Dependency Failure
Sandbox Startup Failure
```

The architecture should distinguish:

```text
Task Failure
```

from:

```text
Sandbox Security Violation
```

For example:

```text
Memory Limit Exceeded
 ↓
Terminate Sandbox
 ↓
Record Security / Resource Event
 ↓
Return Controlled Failure
```

---

# 60. Sandbox Termination

Termination should be deterministic.

```text
Timeout
 ↓
Terminate Process
 ↓
Terminate Child Processes
 ↓
Close Connections
 ↓
Destroy Sandbox
 ↓
Cleanup Workspace
```

A timeout should not leave child processes running in the background.

---

# 61. Sandbox Escape

A sandbox escape occurs when code breaks out of its intended isolation boundary.

Conceptually:

```text
Sandbox
   X
Host
```

Sandbox escape is a serious security event.

Defenses include:

```text
Strong Isolation
Minimal Privileges
Patched Runtime
Restricted System Calls
Network Isolation
Non-Root Execution
Ephemeral Environments
Security Monitoring
```

High-risk workloads should use stronger isolation boundaries where appropriate.

---

# 62. Defense in Depth

No single sandbox control should be considered sufficient.

A strong architecture combines:

```text
Authentication
      ↓
Authorization
      ↓
Input Validation
      ↓
Tool Policy
      ↓
Sandbox
      ↓
Network Isolation
      ↓
Resource Limits
      ↓
Credential Isolation
      ↓
Monitoring
```

If one control fails, additional controls remain.

---

# 63. Sandbox Security Layers

A useful model is:

```text
                 Agent
                   │
                   ▼
            Policy / AuthZ
                   │
                   ▼
            Execution Sandbox
                   │
       ┌───────────┼───────────┐
       ↓           ↓           ↓
   Filesystem   Network     Resources
       │           │           │
       └───────────┼───────────┘
                   ↓
             External APIs
```

Each layer should have an explicit policy.

---

# 64. Sandbox Architecture for Code Agents

A production code agent might use:

```text
                         User
                           │
                           ▼
                        AI Agent
                           │
                           ▼
                     Code Proposal
                           │
                           ▼
                  Code Validation
                           │
                           ▼
                  Sandbox Scheduler
                           │
                           ▼
                 ┌─────────────────┐
                 │ Ephemeral       │
                 │ Sandbox         │
                 │                 │
                 │ Runtime         │
                 │ Workspace       │
                 │ Network Policy  │
                 │ Resource Limits │
                 └────────┬────────┘
                          │
                          ▼
                     Execute Code
                          │
                          ▼
                    Collect Output
                          │
                          ▼
                     Sanitize
                          │
                          ▼
                         Agent
```

---

# 65. Sandbox Architecture for Enterprise Tools

Not every tool requires code execution.

For API-based tools:

```text
Agent
 ↓
Tool Interface
 ↓
Authorization
 ↓
Tool Adapter
 ↓
Credential Provider
 ↓
Enterprise API
```

For high-risk tools:

```text
Agent
 ↓
Tool Interface
 ↓
Authorization
 ↓
Sandbox
 ↓
Tool Adapter
 ↓
Enterprise API
```

The architecture should be risk-based.

---

# 66. Sandbox Architecture for Browser Agents

A browser-based agent can use:

```text
                         Agent
                           │
                           ▼
                    Browser Controller
                           │
                           ▼
                    Browser Sandbox
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
          Browser       Storage        Network
          Process       Profile        Policy
             │             │             │
             └─────────────┼─────────────┘
                           ↓
                     Target Website
```

The browser session should ideally be ephemeral for sensitive workloads.

---

# 67. Sandbox Architecture for Data Agents

For data analysis:

```text
User Dataset
      ↓
Input Volume
      ↓
Sandbox
      ↓
Python / SQL Runtime
      ↓
Result
      ↓
Output Validation
      ↓
User
```

The sandbox should not automatically receive:

```text
Production Database Credentials
Other Customer Data
Host Files
Cloud Credentials
```

---

# 68. Sandbox and Production Databases

Avoid:

```text
Agent
 ↓
Shell
 ↓
Production Database Credentials
 ↓
Database
```

Prefer:

```text
Agent
 ↓
Approved Data Capability
 ↓
Read-Only Query Service
 ↓
Database
```

If code execution is necessary:

```text
Sandbox
 ↓
Controlled Data Interface
 ↓
Approved Dataset
```

This significantly reduces blast radius.

---

# 69. Sandbox and Cloud APIs

Cloud APIs can have broad permissions.

Avoid:

```text
Agent Sandbox
 ↓
Administrator Cloud Credential
```

Prefer:

```text
Sandbox
 ↓
Scoped Workload Identity
 ↓
Specific Cloud API
 ↓
Specific Resource
```

For example:

```text
Read Object
```

rather than:

```text
Administrator
```

---

# 70. Sandbox Lifecycle Management

A sandbox platform should manage:

```text
Provisioning
Scheduling
Initialization
Execution
Monitoring
Termination
Cleanup
Audit
```

Conceptually:

```text
Task Queue
    ↓
Sandbox Scheduler
    ↓
Sandbox
    ↓
Execution
    ↓
Result
    ↓
Destroy
```

This becomes an infrastructure capability in larger agent platforms.

---

# 71. Sandbox Pools

For latency-sensitive systems, sandbox pools can reduce startup overhead.

```text
Sandbox Pool
 ├── Ready Sandbox
 ├── Ready Sandbox
 └── Ready Sandbox
```

A task receives an isolated environment:

```text
Task
 ↓
Sandbox
 ↓
Reset
 ↓
Return to Pool
```

However, reset must be strong enough to prevent data leakage between tasks.

For high-security workloads:

```text
Destroy
```

may be preferable to:

```text
Reuse
```

---

# 72. Warm vs Ephemeral Sandboxes

### Warm Sandbox

```text
Faster
Lower Startup Cost
Higher State-Reuse Risk
```

### Ephemeral Sandbox

```text
Stronger Isolation
Cleaner State
Higher Startup Cost
```

The appropriate model depends on:

```text
Risk
Latency
Cost
Workload
Data Sensitivity
```

---

# 73. Sandbox Policy by Risk

An enterprise platform can define standard profiles.

### Profile A — Low Risk

```text
Container
Read-Only Filesystem
No Internet
Low Resource Limits
```

### Profile B — Medium Risk

```text
Container
Restricted Network
Ephemeral Workspace
Tight Resource Limits
```

### Profile C — High Risk

```text
Strong VM / MicroVM Isolation
Restricted Network
Ephemeral Environment
Scoped Credentials
Strict Resource Controls
Full Audit
```

This creates standardized execution policies.

---

# 74. Sandbox Security Checklist

Before enabling agent code or tool execution, verify:

### Isolation

- [ ] Agent execution is isolated from the host
- [ ] Containers are unprivileged
- [ ] High-risk workloads use stronger isolation
- [ ] Tenant isolation is enforced

### Filesystem

- [ ] Root filesystem is read-only where possible
- [ ] Workspace is explicitly scoped
- [ ] Path traversal is prevented
- [ ] Temporary files are cleaned up

### Network

- [ ] Network access is restricted
- [ ] Egress is controlled
- [ ] Internal networks are protected
- [ ] Metadata endpoints are restricted
- [ ] DNS access is controlled where required

### Resources

- [ ] CPU limits exist
- [ ] Memory limits exist
- [ ] Execution timeout exists
- [ ] Process limits exist
- [ ] Storage limits exist

### Credentials

- [ ] Secrets are not automatically inherited
- [ ] Environment variables are filtered
- [ ] Credentials are scoped
- [ ] Workload identity is used where appropriate

### Runtime

- [ ] Dependencies are isolated
- [ ] Packages are controlled
- [ ] Runtime versions are managed
- [ ] Sandbox images are patched

### Lifecycle

- [ ] Sandboxes are ephemeral where appropriate
- [ ] Cleanup is deterministic
- [ ] Child processes are terminated
- [ ] Temporary state is removed

### Monitoring

- [ ] Sandbox events are logged
- [ ] Resource violations are monitored
- [ ] Network activity is monitored where required
- [ ] Security events are auditable

---

# 75. Common Sandboxing Mistakes

## Mistake 1 — Running Agent Code on the Host

```text
Agent
 ↓
Host OS
 ↓
Production Environment
```

### Better

```text
Agent
 ↓
Sandbox
 ↓
Execution
```

---

## Mistake 2 — Giving the Sandbox Full Network Access

```text
Sandbox
 ↓
Internet + Internal Network
```

### Better

```text
Sandbox
 ↓
Explicit Network Allowlist
```

---

## Mistake 3 — Passing All Credentials

```text
Sandbox
 ↓
All Environment Variables
```

### Better

```text
Sandbox
 ↓
Task-Specific Credentials
```

---

## Mistake 4 — Reusing State Between Tenants

```text
Tenant A
 ↓
Sandbox
 ↓
Tenant B
```

### Better

```text
Tenant A → Isolated Sandbox
Tenant B → Isolated Sandbox
```

---

## Mistake 5 — Treating Containers as an Absolute Security Boundary

```text
Container
 ↓
"Everything Is Safe"
```

### Better

```text
Container
 +
Least Privilege
 +
Network Isolation
 +
Resource Limits
 +
Strong Isolation Where Required
```

---

## Mistake 6 — Relying on Prompts for Security

```text
System Prompt:
"Do not access /etc."
```

This is not a security boundary.

### Better

```text
Filesystem Policy
 ↓
DENY /etc
```

---

## Mistake 7 — Failing to Clean Up

```text
Task Complete
 ↓
Sandbox Remains
 ↓
Sensitive Data Remains
```

### Better

```text
Task Complete
 ↓
Cleanup
 ↓
Destroy
```

---

# 76. Key Engineering Principles

### 1. Sandbox Untrusted Execution

Never assume generated code is safe.

### 2. Separate Decision From Execution

The LLM proposes actions; infrastructure enforces execution boundaries.

### 3. Use Least Privilege

Limit files, network, credentials, and resources.

### 4. Prefer Ephemeral Environments

Destroy task-specific environments when practical.

### 5. Deny by Default

Especially for network, filesystem, and privileged capabilities.

### 6. Apply Defense in Depth

Combine authorization, validation, sandboxing, network controls, and monitoring.

### 7. Isolate Tenants

Never rely on the model to maintain tenant boundaries.

### 8. Protect Credentials

Sandboxing and secrets management must work together.

### 9. Limit Resources

Prevent infinite loops and resource exhaustion.

### 10. Treat the Sandbox as a Security Boundary

The sandbox should reduce the impact of incorrect or malicious agent behavior.

---

# 77. Enterprise Agent Sandboxing Architecture

The complete model can be summarized as:

```text
                         User
                           │
                           ▼
                      AI Agent
                           │
                           ▼
                    Proposed Action
                           │
                           ▼
                ┌────────────────────┐
                │ Authorization      │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │ Policy Validation  │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │ Sandbox Scheduler  │
                └─────────┬──────────┘
                          ↓
              ┌────────────────────────┐
              │   Ephemeral Sandbox    │
              │                        │
              │  Filesystem            │
              │  Network               │
              │  CPU / Memory          │
              │  Processes             │
              │  Dependencies          │
              │  Credentials           │
              └───────────┬────────────┘
                          ↓
                       Execute
                          ↓
                    Collect Result
                          ↓
                       Sanitize
                          ↓
                        Agent
```

Cross-cutting controls:

```text
Authorization
Secrets Management
Data Privacy
Observability
Audit
Resource Governance
```

---

# 78. Part VI Security Boundary

Sandboxing fits naturally within the security architecture of Part VI:

```text
Authentication
      ↓
Authorization
      ↓
Secrets Management
      ↓
Data Privacy
      ↓
Sandboxing
      ↓
Controlled Tool Execution
      ↓
Observability
      ↓
Evaluation
```

Each layer addresses a different risk.

```text
Authorization
→ What can the agent do?

Secrets Management
→ Which credentials can it use?

Data Privacy
→ Which data can it process?

Sandboxing
→ What can its execution environment affect?

Observability
→ What happened?

Evaluation
→ Was the behavior acceptable?
```

---

# 79. Part VI → Part VII Boundary

Sandboxing belongs to **Part VI — AI Agents** because individual agents need controlled execution boundaries before they can safely participate in larger autonomous systems.

```text
Part VI — AI Agents

Agent
 ↓
Authorized Capability
 ↓
Sandbox
 ↓
Controlled Execution
```

Part VII can extend these concepts to autonomous and multi-agent environments:

```text
Part VII — Agentic AI & Multi-Agent Systems

Agent A
   ↓
Agent B
   ↓
Delegated Capability
   ↓
Sandbox
   ↓
Tool / Agent Execution
```

Topics such as:

- Multi-agent sandbox orchestration
- Cross-agent execution isolation
- Autonomous workload isolation
- Agent-to-agent trust boundaries
- Sandboxed agent swarms

belong in the **Agentic AI & Multi-Agent Systems** module rather than being duplicated here.

---

# 📌 Key Takeaways

- AI Agents may execute code, access files, invoke APIs, and interact with external systems.
- Sandboxing limits the impact of incorrect, malicious, or unintended agent actions.
- The LLM should never be treated as the final security boundary.
- Agent decisions should be separated from actual execution.
- Code execution should occur in isolated environments rather than directly on production hosts.
- Containers, microVMs, and VMs provide different levels of isolation and should be selected according to the threat model.
- Ephemeral sandboxes reduce persistent state and cross-task contamination.
- Filesystem access should be explicitly scoped.
- Network access should generally be deny-by-default and controlled through allowlists or appropriate network policies.
- Cloud metadata endpoints and internal networks require particular attention.
- CPU, memory, storage, process, and execution-time limits reduce resource-abuse risks.
- Credentials should never be automatically inherited by sandbox workloads.
- Sandbox security should work together with authorization, secrets management, and data privacy.
- Generated code should be validated where useful, but validation should complement rather than replace sandboxing.
- Multi-tenant environments require isolated workspaces, credentials, networks, and execution environments.
- Sandbox lifecycle management should include creation, execution, monitoring, cleanup, and destruction.
- Strong isolation should be used for high-risk or untrusted workloads.
- Prompt instructions such as "do not access the filesystem" are not security controls; machine-enforced boundaries are required.
- Sandboxing is a defense-in-depth mechanism for reducing agent execution blast radius.
- The goal is **controlled agent autonomy inside explicitly defined execution boundaries**.

---

# 🔗 Related Topics

### Previous

**[07. Data Privacy](07-data-privacy.md)**

### Next

**[09. Agent Guardrails](09-agent-guardrails.md)**

### Related

- [04. Agent Security & Guardrails](04-agent-security-and-guardrails.md)
- [05. Agent Authorization](05-agent-authorization.md)
- [06. Secrets Management](06-secrets-management.md)
- [Agent Architecture](02-ai-agent-architecture.md)
- [Tool Calling & Function Calling](02-tool-calling-and-function-calling.md)
- [Agent Evaluation](10-agent-evaluation.md)
- [Agent Observability](07-agent-observability.md)
- [Agent Deployment](../06-agent-deployment/01-agent-deployment-overview.md)

---

> **Enterprise AI Engineering Handbook**  
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*