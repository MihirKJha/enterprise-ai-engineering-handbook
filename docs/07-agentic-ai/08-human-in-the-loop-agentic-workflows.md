---
title: "Human-in-the-Loop Agentic Workflows | Enterprise AI Engineering"
description: "Build human approval, review, escalation and intervention into reliable enterprise agentic workflows using AG2, BeeAI and graph-based orchestration."
tags:
  - Human-in-the-Loop
  - Agentic Workflows
  - AG2
  - BeeAI
  - AI Governance
  - Enterprise AI
keywords:
  - human in the loop agentic workflows
  - AG2 human input mode
  - BeeAI AskPermissionRequirement
  - agent approval gates
  - enterprise agent governance
---

# 08 — Human-in-the-Loop Agentic Workflows

> The agent has found a likely duplicate payment. It is ready to issue a refund. The evidence looks convincing—but should the agent be allowed to move the money?

## Introduction

Autonomy is useful until an agent reaches a decision that affects money, customer records, legal obligations or production systems. At that point, the important question is not whether the model is confident. It is whether the action is permitted, who can authorize it, and how the workflow behaves while it waits.

Consider a payment-support agent investigating a customer complaint. It finds two successful-looking payment records and prepares a refund proposal. A quick automated response would be risky: one record may be an authorization rather than a settled charge. The agent must gather evidence, explain uncertainty and ask an authorized person to decide.

That is the purpose of a human-in-the-loop (HITL) workflow. It is not a chatbot occasionally asking, “Should I continue?” It is a designed control point that pauses execution, presents the right context, records a human decision and resumes through a controlled path.

## 1. Human Approval and Intervention

Human involvement is not one operation. A person may:

| Interaction | What the person does | Payment example |
|---|---|---|
| Review | Checks an agent's findings | Verify whether both payments settled |
| Clarification | Supplies missing context | Confirm which customer account is affected |
| Correction | Fixes an intermediate result | Correct an extracted transaction reference |
| Approval | Authorizes a proposed action | Approve a specific refund |
| Intervention | Stops or redirects execution | Stop unexpected access to a payment tool |
| Escalation | Takes ownership of a difficult case | Send a disputed transaction to a specialist |

The critical boundary is between **recommendation and authorization**. An LLM can summarize evidence and propose a refund. Trusted application services must enforce policy, and an authorized person must approve the action when required.

Human intervention should be possible before a consequential tool call—not merely after the agent has completed its work. Automate evidence gathering and preparation more readily than irreversible side effects.

## 2. Review and Escalation

Imagine the agent finds two payment records. Its first explanation is plausible, but the settlement service shows that only one record is captured. A reviewer notices the mismatch and asks for the authorization history. The agent retrieves it, updates the case and submits a revised recommendation.

This is more useful than forwarding a long chat transcript. The reviewer needs a concise handoff: case and transaction identifiers, evidence references, actions already attempted, unresolved questions, risk indicators and the exact decision requested.

A simple routing policy might look like this:

```python
def route_case(case):
    if case.policy_violation or case.evidence_conflict:
        return "SPECIALIST_ESCALATION"

    if case.action_is_high_impact or not case.evidence_complete:
        return "HUMAN_REVIEW"

    return "CONTINUE_AUTOMATICALLY"
```

This is application-level illustrative logic, not a model-confidence threshold. A high-confidence recommendation can still require approval when its impact is high. Likewise, low confidence should not automatically trigger a human if the system can safely return a qualified, non-actionable answer.

## 3. Approval Gates

An approval gate separates preparing an action from executing it. The agent submits a structured proposal; the application validates it, selects an authorized reviewer and pauses. Only a valid decision for that exact proposal can release the action.

```python
from typing import Literal
from pydantic import BaseModel, Field

class RefundProposal(BaseModel):
    case_id: str
    proposal_id: str
    version: int = Field(ge=1)
    transaction_id: str
    amount_minor: int = Field(gt=0)
    currency: str
    reason: str
    evidence_refs: list[str]

class ApprovalDecision(BaseModel):
    proposal_id: str
    proposal_version: int
    decision: Literal["approve", "reject", "request_changes"]
    reviewer_id: str
    comment: str | None = None
```

The version matters. If the agent changes the refund amount after review, the old approval must not authorize the new proposal.

```python
def execute_refund(proposal, decision, policy, payment_api):
    policy.require_authorized_reviewer(decision.reviewer_id)
    policy.validate_scope(proposal, decision)  # ID, version, amount and authority

    if decision.decision != "approve":
        return {"status": "blocked", "reason": decision.decision}

    return payment_api.refund(
        transaction_id=proposal.transaction_id,
        amount_minor=proposal.amount_minor,
        idempotency_key=f"{proposal.case_id}:{proposal.proposal_id}",
    )
```

`policy` and `payment_api` represent trusted application services. They must validate the proposal identity and version, reviewer authority, business limits and approval freshness. The model must never decide that its own action is authorized.

## 4. Exception Handling

A human pause creates more than two outcomes. Approval, rejection, requested changes, timeout and reviewer unavailability must all have explicit paths.

| Outcome | Safe workflow behaviour |
|---|---|
| Approved | Revalidate policy and execute the approved version |
| Rejected | Keep the action blocked and record the reason |
| Changes requested | Revise the proposal and request approval again |
| No response | Keep the action blocked; remind, reassign or escalate |
| Reviewer unavailable | Route to an eligible backup reviewer |
| Evidence conflict | Pause and send the case for specialist investigation |

A timeout is never an approval. A retry must never skip the human gate. If the proposal changes, approval must be obtained again.

```python
def resolve_review(decision, current_version):
    if decision.proposal_version != current_version:
        return "REAPPROVAL_REQUIRED"

    return {
        "approve": "RECHECK_POLICY_THEN_EXECUTE",
        "reject": "CLOSE_WITH_REASON",
        "request_changes": "RETURN_TO_PREPARATION",
    }[decision.decision]
```

In a real workflow, expiry is usually a timer or workflow event—not a reviewer decision. Persist the pending proposal, reviewer assignment, deadline and decision history so a restart cannot lose the review or execute the action twice.

## 5. Human-Agent Collaboration

The course shows two useful framework-level approaches. They solve related but different problems.

### AG2: human input as part of the conversation

AG2 (formerly AutoGen) supports three human input modes. The course uses a bug-triage example: an assistant classifies issues and suggests whether to escalate or close them, while a human makes the final decision.

AG2 exposes human control at both the agent and conversation levels. The course distinguishes three `human_input_mode` settings:

- `ALWAYS` — request human input at each interaction.
- `NEVER` — allow the agent conversation to proceed without interactive human input.
- `TERMINATE` — request input when the conversation reaches a termination point.

A `UserProxyAgent` is the human-facing proxy in the course examples and defaults to human oversight. It can also participate in tool/code-execution workflows; that is different from treating an ordinary assistant agent as the human reviewer.

```python
from autogen import AssistantAgent, UserProxyAgent

triage_agent = AssistantAgent(
    name="bug_triage_assistant",
    system_message=(
        "Classify bugs and recommend escalation or closure. "
        "Do not make the final decision."
    ),
    llm_config=llm_config,
)

human = UserProxyAgent(
    name="human_reviewer",
    human_input_mode="ALWAYS",
    max_consecutive_auto_reply=0,
)

# Illustrative conversation boundary; configure the chat and
# execution settings for the AG2 version used by the application.
human.initiate_chat(triage_agent, message="Review bug BUG-1042.")
```

Human input is only one control. AG2 also needs explicit conversation stopping conditions. The course covers `max_turns` for a two-agent chat, `max_round` for group chat, `max_consecutive_auto_reply` to bound automatic replies, and termination messages (for example, `DONE!`) handled by `is_termination_msg`. A user can also type `exit` in `ALWAYS` or `TERMINATE` mode. These controls prevent runaway dialogue; they do not authorize a business action.

In group chat, `ManualPattern` lets a human choose the next speaker, while `AutoPattern` delegates speaker selection to the LLM and `RoundRobinPattern` follows a fixed sequence. Manual speaker selection is a conversation-control checkpoint, not a refund approval.


### BeeAI: permission before a tool call

BeeAI places controls around individual tool invocations through its requirements system:

- `ConditionalRequirement` controls tool order and frequency. The course limits `WikipediaTool` to one invocation and can constrain `ThinkTool` to a maximum number of uses. Its controls include `min_invocations`, `max_invocations`, `force_at_step`, `only_after` and `consecutive_allowed`.
- `AskPermissionRequirement` wraps a tool and asks the human for approval before that tool is called.
- `ControlTrajectoryMiddleware` tracks the execution trajectory for debugging and transparency. The course's ReAct example uses `GlobalTrajectoryMiddleware` to expose tool usage across the run.

A simplified, API-shaped illustration of the requirements is:

```python
requirements = [
    ConditionalRequirement(wikipedia_tool, max_invocations=1),
    ConditionalRequirement(think_tool, max_invocations=3),
    AskPermissionRequirement(wikipedia_tool),
]
```

The course also demonstrates a ReAct-style sequence: force thinking at the start, require thinking after tool use, prevent consecutive repeated thinking, and cap the number of thinking cycles. Exact imports and constructor details should be checked against the BeeAI version used; the snippet highlights the controls, not a complete runnable agent. <FileCite ref_id="turn87file3"/>

The course's protected tool is Wikipedia, not a payment API. Applying the same pattern to a sensitive business tool is an architectural extension. A tool-level permission prompt does not by itself establish reviewer identity, role-based authorization, durable approval records or separation of duties; those remain application responsibilities.

For graph-based workflows, the equivalent enterprise design is to pause at a dedicated review node and resume from persisted state after the decision. Store reviewer identity, decision, proposal version and outcome outside the model's conversational text.

## 6. Enterprise Governance

A human approval button is not governance by itself. Consider what could go wrong: the requester approves their own high-value refund, an unauthorized reviewer approves a proposal, or an agent changes the amount after approval. The system needs controls around the interaction.

| Governance area | Engineering control |
|---|---|
| Identity and access | Authenticate reviewers and enforce approval authority |
| Separation of duties | Prevent self-approval where policy requires |
| Least privilege | Limit agent tools and data to the task |
| Auditability | Record proposal version, evidence, reviewer, decision and execution |
| Policy enforcement | Validate limits and business rules outside the model |
| Data protection | Minimize sensitive data and apply retention controls |
| Operational control | Define deadlines, backup approvers and emergency stops |

The course directly demonstrates human oversight in AG2 and pre-tool permission in BeeAI. The governance controls above are additional enterprise engineering guidance; they should be implemented in trusted application services, not assumed to come automatically from either framework.

## 💼 Backend Architecture Parallel

| Backend engineering concept | HITL equivalent |
|---|---|
| Authorization middleware | Reviewer identity and approval permissions |
| Transaction boundary | Approval gate before a side effect |
| Durable workflow state | Persisted pending review |
| Retry / dead-letter handling | Reassignment or escalation of unresolved reviews |
| Audit log | Approval and execution history |
| Idempotency key | Prevent duplicate execution after retry or resume |
| Policy engine | Deterministic business and approval rules |

The familiar distributed-systems distinction applies: receiving a request is not the same as authorizing or committing it. A human decision is an input to the workflow; the application must still validate and enforce it at the point of execution.

## Key Takeaways

- Human involvement includes review, clarification, correction, approval, intervention and escalation.
- Keep recommendation, authorization and execution as separate responsibilities.
- AG2 provides human input modes, a human-facing `UserProxyAgent`, manual speaker selection and explicit conversation termination controls.
- BeeAI combines tool-level permission, conditional invocation requirements and execution-trajectory observability.
- Bind business approval to an exact proposal and version. A changed proposal requires fresh approval.
- Rejection, timeout, reviewer unavailability and evidence conflicts need explicit workflow paths.
- Framework mechanisms are building blocks—not a complete enterprise approval and governance platform.

## What's Next?

Chapter 09 — **Long-Running Agentic Workflows & Durable Execution** — explores how workflows preserve state, recover from interruptions, retry safely and resume long-running enterprise work.

## References

- [AG2 documentation](https://docs.ag2.ai/)
- [BeeAI documentation](https://docs.beeai.dev/)
- [LangGraph documentation](https://docs.langchain.com/oss/python/langgraph/overview)
- [Pydantic documentation](https://docs.pydantic.dev/)

> **Enterprise AI Engineering Handbook**
>
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*
