# Reflection & Self-Correction in AI Agents

> Reflection enables an AI Agent to evaluate its own actions and outcomes, identify errors or weaknesses, and determine whether corrective action, re-planning, or escalation is required.

---

## 📖 Overview

Planning determines **what the agent intends to do**.

Reasoning determines **what action the agent should take**.

Reflection determines:

> **Did the action produce the expected result, and what should the agent do next?**

A production AI Agent therefore operates through a feedback loop:

```text
Goal
 ↓
Plan
 ↓
Reason
 ↓
Act
 ↓
Observe
 ↓
Reflect
 ↓
Evaluate
 ↓
 ┌───────────────┐
 │               │
Success        Problem
 │               │
 ↓               ↓
Continue      Correct
                 ↓
              Re-plan
                 ↓
              Re-execute
```

Reflection and self-correction are important because real-world agent execution is rarely perfectly predictable.

Tools can fail.

Data can be incomplete.

Plans can become invalid.

Actions can produce unexpected results.

A production agent therefore needs mechanisms to detect these situations and recover safely.

---

# 🎯 Learning Objectives

After completing this chapter, you will understand:

- What reflection means in AI Agents
- What self-correction means
- Why agents need feedback loops
- Reflection vs reasoning
- Reflection vs re-planning
- Reflection vs retry
- Outcome evaluation
- Error detection
- Critique-based reflection
- Self-correction patterns
- Tool-result validation
- Plan validation after execution
- Iterative improvement
- Reflection loops
- Guarding against infinite correction loops
- Cost and latency implications
- Production reflection architecture
- Observability of reflection
- Safe enterprise self-correction

---

# 1. What Is Reflection?

Reflection is the process through which an agent evaluates an action, intermediate result, or final result against the intended objective.

A simplified model is:

```text
Action
 ↓
Result
 ↓
Evaluate
 ↓
Compare with Goal
 ↓
Identify Issues
 ↓
Determine Next Step
```

For example:

```text
Goal:
Generate a customer report

Agent Action:
Retrieve customer data

Result:
Only 30% of expected records returned

Reflection:
Result may be incomplete

Next Decision:
Investigate data source
```

Reflection therefore introduces a feedback mechanism into agent execution.

---

# 2. What Is Self-Correction?

Self-correction is the ability of an agent to modify its behavior after detecting a problem.

Conceptually:

```text
Attempt
 ↓
Evaluate
 ↓
Failure Detected
 ↓
Identify Cause
 ↓
Correct Strategy
 ↓
Retry / Re-plan
 ↓
Evaluate Again
```

For example:

```text
Initial Approach
 ↓
Database Query
 ↓
No Results
 ↓
Self-Correction
 ↓
Check Query Parameters
 ↓
Correct Query
 ↓
Execute Again
```

The important distinction is:

> **Retry repeats an action; self-correction changes the approach when necessary.**

---

# 3. Why Do Agents Need Reflection?

Without reflection, an agent may assume that every action succeeded.

```text
Plan
 ↓
Execute
 ↓
Assume Success
 ↓
Continue
```

This can cause cascading failures.

A reflective agent instead uses:

```text
Plan
 ↓
Execute
 ↓
Observe
 ↓
Validate
 ↓
Reflect
 ↓
Continue / Correct
```

Reflection can help detect:

- Incorrect tool results
- Incomplete information
- Invalid assumptions
- Failed actions
- Incorrect task completion
- Poor-quality intermediate results
- Policy violations
- Unexpected environment changes

---

# 4. Reflection in the Agent Loop

A complete execution loop can be represented as:

```text
┌───────────────┐
│     Goal      │
└───────┬───────┘
        ↓
┌───────────────┐
│     Plan      │
└───────┬───────┘
        ↓
┌───────────────┐
│    Reason     │
└───────┬───────┘
        ↓
┌───────────────┐
│     Act       │
└───────┬───────┘
        ↓
┌───────────────┐
│    Observe    │
└───────┬───────┘
        ↓
┌───────────────┐
│   Reflect     │
└───────┬───────┘
        ↓
   ┌────┴───────┐
   ↓            ↓
Success       Problem
   ↓            ↓
Continue      Correct
                ↓
             Re-plan
                ↓
             Execute
```

Reflection therefore creates a **closed-loop agent architecture**.

---

# 5. Reflection vs Reasoning

These concepts are related but different.

### Reasoning

Reasoning asks:

> **What should I do?**

```text
Current State
 ↓
Evaluate Options
 ↓
Select Action
```

### Reflection

Reflection asks:

> **Did what I just did work?**

```text
Action
 ↓
Result
 ↓
Evaluate Outcome
```

Together:

```text
Reason
 ↓
Act
 ↓
Observe
 ↓
Reflect
 ↓
Reason Again
```

A useful mental model is:

```text
Reasoning → Decision

Reflection → Evaluation
```

---

# 6. Reflection vs Planning

Planning determines the intended execution sequence.

```text
Goal
 ↓
Plan
 ↓
Task A
 ↓
Task B
 ↓
Task C
```

Reflection evaluates whether that plan is still valid.

```text
Plan
 ↓
Execute
 ↓
Observe
 ↓
Reflect
 ↓
Plan still valid?
```

If yes:

```text
Continue
```

If no:

```text
Re-plan
```

Therefore:

```text
Planning
   ↓
Execution
   ↓
Reflection
   ↓
Re-planning
```

Reflection provides the feedback necessary for dynamic planning.

---

# 7. Reflection vs Retry

Retry and self-correction should not be treated as the same mechanism.

### Retry

Repeats the same operation.

```text
Tool Call
 ↓
Failure
 ↓
Retry Same Tool
```

### Self-Correction

Changes the strategy.

```text
Tool Call
 ↓
Failure
 ↓
Evaluate Cause
 ↓
Change Strategy
 ↓
Alternative Action
```

For example:

```text
Retry:

Database Query
      ↓
Failure
      ↓
Database Query Again
```

Self-correction:

```text
Database Query
      ↓
Failure
      ↓
Check Query
      ↓
Correct Parameters
      ↓
Execute Again
```

Or:

```text
Database Query
      ↓
Database Unavailable
      ↓
Alternative Approved Source
```

---

# 8. Reflection vs Error Handling

Traditional software systems typically handle known errors using deterministic logic.

```text
try
 ↓
operation
 ↓
catch
 ↓
fallback
```

Agent reflection adds a more adaptive layer:

```text
Action
 ↓
Result
 ↓
Evaluate
 ↓
Determine What Went Wrong
 ↓
Choose Recovery Strategy
```

The two approaches can coexist.

```text
Deterministic Error Handling
            +
Agent Reflection
            ↓
Controlled Recovery
```

Deterministic mechanisms should remain responsible for predictable infrastructure failures.

Agent reflection is more appropriate when interpretation or strategy needs to change.

---

# 9. What Can an Agent Reflect On?

Reflection can occur at several levels.

## Action-Level Reflection

```text
Did this action succeed?
```

## Tool-Level Reflection

```text
Did the tool return a valid result?
```

## Task-Level Reflection

```text
Was the task completed successfully?
```

## Plan-Level Reflection

```text
Is the current plan still valid?
```

## Goal-Level Reflection

```text
Has the overall objective been achieved?
```

This creates a hierarchy:

```text
Goal
 ↓
Plan
 ↓
Task
 ↓
Action
 ↓
Tool
```

Reflection can be applied at each level.

---

# 10. Outcome Validation

Reflection requires some mechanism for determining whether an outcome is acceptable.

For example:

```text
Expected:
100 customer records

Actual:
32 records

Validation:
FAIL
```

Or:

```text
Expected:
HTTP 200

Actual:
HTTP 500

Validation:
FAIL
```

Or:

```text
Expected:
Payment completed

Actual:
Payment pending

Validation:
INCOMPLETE
```

The agent can therefore use:

```text
Expected Outcome
      ↓
Actual Outcome
      ↓
Validation
      ↓
Reflection
```

---

# 11. Reflection Criteria

A production agent should define what constitutes success.

Possible criteria include:

```text
Task Completion
Correctness
Completeness
Accuracy
Policy Compliance
Data Validation
Business Rules
Tool Result Status
User Requirements
```

For example:

```text
Task:
Generate financial report

Success Criteria:
✓ All required data retrieved
✓ Calculations completed
✓ Validation passed
✓ Required sections generated
✓ Policy requirements satisfied
```

Reflection can evaluate the result against these criteria.

---

# 12. Critique-Based Reflection

One common pattern is to generate a result and then evaluate it using a critique step.

```text
Generate Result
      ↓
Critic / Evaluator
      ↓
Identify Problems
      ↓
Correct
      ↓
Generate Improved Result
```

Conceptually:

```text
Agent
 ↓
Draft
 ↓
Critique
 ↓
Improve
 ↓
Validate
```

The critic may evaluate:

- Correctness
- Completeness
- Relevance
- Consistency
- Policy compliance

---

# 13. Critique → Correction Loop

A more complete pattern is:

```text
              ┌──────────────┐
              │   Generate   │
              └──────┬───────┘
                     ↓
              ┌──────────────┐
              │    Critique  │
              └──────┬───────┘
                     ↓
              ┌──────────────┐
              │   Evaluate   │
              └──────┬───────┘
                     ↓
                ┌────┴────┐
                ↓         ↓
              Pass       Fail
                ↓         ↓
             Complete   Correct
                          ↓
                       Generate
```

This can be useful when the output has clearly defined evaluation criteria.

---

# 14. Self-Correction Through Re-Planning

Self-correction does not always require modifying the immediate action.

Sometimes the agent needs to revise the entire plan.

```text
Initial Plan
     ↓
Execute Task A
     ↓
Unexpected Result
     ↓
Reflect
     ↓
Current Plan Invalid
     ↓
Generate New Plan
     ↓
Execute Alternative
```

For example:

```text
Plan:
Retrieve database data
 ↓
Analyze data
 ↓
Generate report

Problem:
Database unavailable

Reflection:
Original data source cannot be used

Correction:
Use approved replica
 ↓
Continue
```

This connects reflection directly to planning.

---

# 15. Reflection with Tool Results

Tool results should be validated before the agent uses them for subsequent decisions.

```text
Tool
 ↓
Result
 ↓
Validate
 ↓
Reflect
 ↓
Use Result
```

Example:

```text
Search API
 ↓
Empty Result
 ↓
Reflection
 ↓
Was query too restrictive?
 ↓
Modify Query
 ↓
Search Again
```

This is safer than assuming:

```text
No Result = No Data
```

because an empty result may indicate:

- Wrong query
- Wrong parameters
- Temporary failure
- Incorrect filters
- Missing permissions
- Actual absence of data

---

# 16. Reflection with Structured Outputs

Structured results make reflection easier.

For example:

```json
{
  "status": "partial",
  "records_found": 32,
  "records_expected": 100,
  "complete": false
}
```

The reflection layer can evaluate:

```text
complete = false
```

and trigger:

```text
Investigation
```

Structured outputs improve:

- Validation
- Automation
- Testing
- Observability
- Recovery

---

# 17. Reflection with Memory

Reflection can produce information that should be stored for future execution.

For example:

```text
Attempt
 ↓
Failure
 ↓
Reflection
 ↓
Cause Identified
 ↓
Correction
 ↓
Memory
```

The memory may store:

```text
Previous Strategy
Failure
Successful Alternative
```

Future executions can then avoid repeating the same mistake.

Conceptually:

```text
Past Experience
      ↓
Memory
      ↓
Future Agent
      ↓
Better Decision
```

However, not every reflection should become long-term memory.

Memory should be selectively managed based on:

- Relevance
- Durability
- Confidence
- Privacy
- Storage cost

---

# 18. Reflection and Agent State

Reflection should update the agent's state.

Example:

```text
Task Status:
RUNNING
```

After successful reflection:

```text
Task Status:
COMPLETED
```

After detecting a problem:

```text
Task Status:
NEEDS_CORRECTION
```

Possible state transitions:

```text
PENDING
  ↓
RUNNING
  ↓
OBSERVING
  ↓
REFLECTING
  ↓
 ┌──────────────┬──────────────┐
 ↓              ↓              ↓
COMPLETED   NEEDS_CORRECTION  FAILED
                ↓
             RE-PLANNING
                ↓
             RUNNING
```

This provides a structured execution model.

---

# 19. Reflection Granularity

Reflection can happen at different frequencies.

## Per Action

```text
Action
 ↓
Reflect
```

Provides strong control but may be expensive.

## Per Task

```text
Several Actions
 ↓
Task Result
 ↓
Reflect
```

Balances control and cost.

## Per Plan

```text
Plan Execution
 ↓
Reflect
```

Cheaper but may detect errors later.

## Final Outcome

```text
Complete Run
 ↓
Evaluate
```

Useful for overall evaluation but insufficient for early error recovery.

A production system should choose the appropriate granularity based on risk and task complexity.

---

# 20. Adaptive Reflection

Not every action requires the same amount of reflection.

A low-risk operation may use:

```text
Execute
 ↓
Basic Validation
```

A high-risk operation may use:

```text
Execute
 ↓
Validate
 ↓
Critique
 ↓
Policy Check
 ↓
Human Approval
```

This creates **risk-based reflection**.

```text
Risk
 │
 │          High
 │           │
 │        Extensive
 │        Reflection
 │           │
 │     Medium
 │       Reflection
 │
 │ Low
 │  Basic Validation
 └────────────────────→
```

The goal is to avoid unnecessary overhead while maintaining appropriate safety.

---

# 21. Reflection and Guardrails

Reflection should not replace security guardrails.

Consider:

```text
Agent Decision
      ↓
Reflection
      ↓
Policy Validation
      ↓
Execution
```

Reflection asks:

> "Is this a good action?"

Policy asks:

> "Is this action allowed?"

These are different concerns.

A better architecture is:

```text
Decision
 ↓
Reflection / Evaluation
 ↓
Policy
 ↓
Authorization
 ↓
Execution
```

The security controls remain authoritative.

---

# 22. Reflection and Human Escalation

Self-correction should have an escalation boundary.

```text
Agent
 ↓
Attempt
 ↓
Reflect
 ↓
Problem
 ↓
Correct
 ↓
Retry
 ↓
Reflect Again
```

If repeated correction fails:

```text
Maximum Attempts Reached
          ↓
       Escalate
          ↓
     Human Review
```

This prevents an agent from endlessly attempting increasingly risky actions.

---

# 23. Correction Strategies

When reflection detects a problem, several strategies are possible.

### Retry

```text
Repeat same operation
```

### Modify Input

```text
Correct arguments
```

### Use Alternative Tool

```text
Tool A
 ↓
Failure
 ↓
Tool B
```

### Retrieve More Information

```text
Missing Context
 ↓
Retrieve Additional Data
```

### Re-plan

```text
Current Plan
 ↓
Invalid
 ↓
New Plan
```

### Ask User

```text
Required Information Missing
 ↓
Clarification
```

### Escalate

```text
High Risk / Unresolved
 ↓
Human
```

A production agent should select the appropriate correction strategy rather than blindly retrying.

---

# 24. Self-Correction Decision Tree

```text
                 Problem Detected
                        │
                        ▼
                 Is it transient?
                   /        \
                 Yes         No
                 /            \
              Retry        Diagnose
                             │
                             ▼
                     Can strategy change?
                        /          \
                      Yes          No
                      /              \
                  Re-plan          Escalate
                    │
                    ▼
                 Execute
                    │
                    ▼
                 Reflect
```

This creates controlled recovery.

---

# 25. Reflection Loops

A reflection loop can be represented as:

```text
Generate
   ↓
Evaluate
   ↓
Improve
   ↓
Evaluate
   ↓
Improve
   ↓
...
```

Without a termination condition, this can become problematic.

Production systems should define:

```text
Maximum Reflection Iterations
Maximum Runtime
Maximum Token Budget
Maximum Cost
Minimum Improvement Threshold
```

Example:

```text
Reflection Limit = 3
```

If the result does not improve after three attempts:

```text
Stop
 ↓
Return Best Valid Result
      OR
Escalate
```

---

# 26. Avoiding Infinite Self-Correction

A common failure pattern is:

```text
Attempt
 ↓
Failure
 ↓
Correct
 ↓
Failure
 ↓
Correct
 ↓
Failure
 ↓
Correct
 ↓
...
```

This creates:

- Token waste
- Increased latency
- Increased cost
- Unpredictable behavior

Controls should include:

```text
Attempt Limit
Iteration Limit
Time Limit
Cost Limit
Progress Detection
Repeated-Action Detection
```

---

# 27. Progress Detection

The agent should determine whether correction is actually improving the situation.

Example:

```text
Attempt 1
Score = 40%

Attempt 2
Score = 55%

Attempt 3
Score = 70%

Attempt 4
Score = 71%
```

At some point, additional reflection may provide little value.

A production system can define:

```text
Minimum Improvement Threshold
```

If improvement is below the threshold:

```text
Stop
 ↓
Return / Escalate
```

---

# 28. Reflection Cost

Reflection usually requires additional computation.

A basic execution might be:

```text
Task
 ↓
LLM
 ↓
Tool
 ↓
Result
```

A reflective execution may become:

```text
Task
 ↓
LLM
 ↓
Tool
 ↓
Result
 ↓
LLM Reflection
 ↓
LLM Correction
 ↓
Tool
 ↓
Result
```

This can increase:

- Token usage
- LLM calls
- Latency
- Infrastructure cost

Therefore:

> **Reflection should be introduced where its reliability benefit justifies its operational cost.**

---

# 29. Reflection vs Deterministic Validation

Some outcomes can be validated deterministically.

For example:

```text
Expected:
HTTP 200

Actual:
HTTP 500
```

No LLM reflection is required to identify the failure.

Similarly:

```text
Expected records = 100
Actual records = 100
```

can be validated through code.

A better architecture is:

```text
Deterministic Validation
        ↓
If Ambiguous
        ↓
Agent Reflection
```

This avoids unnecessary LLM calls.

---

# 30. Hybrid Self-Correction Architecture

A production system can combine deterministic validation with model-based reflection.

```text
                       Agent Action
                            │
                            ▼
                       Tool Result
                            │
                            ▼
                  Deterministic Validator
                            │
                    ┌───────┴───────┐
                    ↓               ↓
                  Valid           Invalid /
                    │             Ambiguous
                    │               │
                    │               ▼
                    │          Agent Reflection
                    │               │
                    │          ┌────┴────┐
                    │          ↓         ↓
                    │       Correct    Escalate
                    │          │
                    └──────────┴──────→ Continue
```

This is generally more predictable than relying exclusively on model-based reflection.

---

# 31. Reflection Observability

Reflection should be visible in agent telemetry.

Useful events include:

```text
Reflection Started
Reflection Result
Issue Detected
Correction Selected
Re-plan Triggered
Retry Triggered
Escalation Triggered
Reflection Completed
```

A trace might look like:

```text
Agent Run
 │
 ├── Task Started
 ├── Tool Call
 ├── Tool Result
 ├── Validation Failed
 ├── Reflection
 ├── Correction
 ├── Tool Call
 ├── Tool Result
 ├── Validation Passed
 └── Task Completed
```

This allows engineers to understand why the agent changed its behavior.

---

# 32. Reflection Metrics

Useful metrics include:

```text
Reflection Rate
Correction Rate
Successful Correction Rate
Re-plan Rate
Retry Rate
Escalation Rate
Average Reflection Iterations
Average Recovery Time
Reflection Token Usage
Reflection Cost
```

For example:

```text
Correction Success Rate
=
Successful Corrections
÷
Total Correction Attempts
```

These metrics help determine whether reflection is actually improving reliability.

---

# 33. Reflection Evaluation

Reflection itself should be evaluated.

Questions include:

```text
Did the agent detect the actual problem?
Did it identify the correct cause?
Did it select an appropriate correction?
Did the correction improve the outcome?
Did it introduce a new problem?
Did it respect policy?
Did it stop when further correction was ineffective?
```

This means:

```text
Agent
 ↓
Reflection
 ↓
Correction
 ↓
Outcome
 ↓
Evaluation
```

Reflection should therefore be treated as an engineering capability that requires testing.

---

# 34. Practical Example — Customer Support Agent

Consider:

> "My payment failed. Please fix it."

The agent executes:

```text
Retrieve Payment
      ↓
Payment Status = FAILED
      ↓
Reflect
      ↓
Retrieve Failure Reason
      ↓
Error = Temporary Processor Failure
      ↓
Reflect
      ↓
Determine Retry Is Allowed
      ↓
Retry Payment
      ↓
Payment = SUCCESS
      ↓
Validate
      ↓
Respond
```

If the retry fails:

```text
Retry
 ↓
Failure
 ↓
Reflect
 ↓
Second Retry Not Allowed
 ↓
Escalate
```

The agent therefore performs controlled recovery rather than unlimited retries.

---

# 35. Practical Example — Software Engineering Agent

Consider:

> "Fix the failing unit test."

The agent may execute:

```text
Run Tests
   ↓
Failure Detected
   ↓
Reflect
   ↓
Inspect Stack Trace
   ↓
Identify Likely Cause
   ↓
Modify Code
   ↓
Run Tests
```

Suppose:

```text
Tests Still Fail
```

The agent reflects again:

```text
Previous Hypothesis Incorrect
        ↓
Inspect Additional Code
        ↓
Update Hypothesis
        ↓
Modify Fix
        ↓
Run Tests
```

If tests pass:

```text
Validate
 ↓
Complete
```

If the agent cannot make progress:

```text
Escalate
```

---

# 36. Practical Example — RAG Agent

Consider:

> "Summarize the company's refund policy."

The agent retrieves documents.

```text
Query
 ↓
Retrieve Documents
 ↓
Generate Answer
 ↓
Reflect
```

Reflection may check:

```text
Are all claims supported?
Are citations present?
Are there contradictions?
Is the answer complete?
```

If unsupported claims are detected:

```text
Reflection
 ↓
Identify Unsupported Claim
 ↓
Retrieve Additional Context
 ↓
Regenerate
 ↓
Validate
```

This demonstrates how reflection can complement RAG.

---

# 37. Reflection and Agent Memory

Reflection can produce valuable information, but memory should not blindly store every correction.

A useful architecture is:

```text
Reflection
     ↓
Candidate Memory
     ↓
Memory Validation
     ↓
Relevance / Confidence Check
     ↓
Memory Store
```

Potential memory:

```text
Successful Strategy
Known Failure
User Preference
Verified Fact
```

Sensitive or temporary execution details may not belong in long-term memory.

---

# 38. Reflection and Security

Self-correction must not bypass security controls.

Consider:

```text
Agent
 ↓
Action Rejected
 ↓
Reflection
 ↓
Alternative Action
```

The alternative action must still pass:

```text
Authorization
Policy
Guardrails
Tool Security
Data Access Controls
```

Therefore:

```text
Reflection
    ↓
Cannot Override
    ↓
Security Boundary
```

This is essential for enterprise agents.

---

# 39. Reflection and Human-in-the-Loop

For high-risk situations:

```text
Agent
 ↓
Reflection
 ↓
Unresolved / High Risk
 ↓
Human Review
 ↓
Approve / Reject
```

The human should receive useful context:

```text
Original Goal
Current State
Actions Taken
Failure
Correction Attempts
Proposed Next Action
Risk
```

This makes escalation actionable rather than simply reporting:

> "Agent failed."

---

# 40. Enterprise Reflection Architecture

A production-oriented architecture can separate execution, validation, reflection, and policy.

```text
                         Agent
                           │
                           ▼
                      Plan / Reason
                           │
                           ▼
                         Action
                           │
                           ▼
                     Tool / Service
                           │
                           ▼
                         Result
                           │
                           ▼
                Deterministic Validator
                           │
                    ┌──────┴──────┐
                    ↓             ↓
                  Valid       Invalid /
                    │          Ambiguous
                    │             │
                    │             ▼
                    │         Reflection
                    │             │
                    │       ┌─────┼─────┐
                    │       ↓     ↓     ↓
                    │     Retry Re-plan Escalate
                    │       │     │
                    │       └─────┼─────┘
                    │             ↓
                    │        Policy Check
                    │             │
                    └─────────────┴──────→ Continue
```

This provides:

```text
Execution
 +
Validation
 +
Reflection
 +
Correction
 +
Policy
```

as separate architectural concerns.

---

# 41. Reflection Lifecycle

The complete reflection lifecycle can be represented as:

```text
                  Execute
                     │
                     ▼
                  Observe
                     │
                     ▼
                  Validate
                     │
                     ▼
                 Reflect
                     │
             ┌───────┴────────┐
             ↓                ↓
          Success           Problem
             │                │
             ↓                ▼
         Continue          Diagnose
                              │
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
                  Retry     Re-plan   Escalate
                    │         │
                    └────┬────┘
                         ↓
                      Execute
                         │
                         ▼
                      Reflect
```

---

# 42. Production Guardrails

Reflection should operate within explicit limits.

Recommended controls include:

```text
Maximum Reflection Iterations
Maximum Correction Attempts
Maximum Tool Calls
Maximum Runtime
Maximum Token Budget
Maximum Cost
Maximum Re-plan Count
Maximum Escalation Delay
```

Also detect:

```text
Repeated Action
Repeated Failure
No Progress
Conflicting Corrections
Policy Violation
Unsafe Escalation
```

When limits are reached:

```text
Stop
 ↓
Return Safe Result
      OR
Escalate
```

---

# 43. Key Engineering Principles

### 1. Reflection Must Have a Purpose

Do not introduce reflection simply because an agent can reflect.

Use it where it improves reliability or task quality.

### 2. Validate Before Reflecting

Use deterministic validation whenever possible.

### 3. Separate Retry from Correction

Retry repeats.

Correction changes the approach.

### 4. Re-Plan When the Strategy Is Invalid

Do not keep executing an obsolete plan.

### 5. Use Risk-Based Reflection

High-risk operations require stronger validation and recovery controls.

### 6. Bound Reflection Loops

Always define iteration, time, token, and cost limits.

### 7. Measure Improvement

Correction should produce measurable progress.

### 8. Preserve Security Boundaries

Reflection must never bypass authorization or policy controls.

### 9. Observe Recovery

Reflection and correction events should be part of the agent trace.

### 10. Escalate When Necessary

A reliable agent knows when it cannot safely recover.

---

# 44. Reflection Architecture Pattern

The core pattern can be summarized as:

```text
                ┌──────────────┐
                │     Goal     │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │     Plan     │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │    Reason    │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │     Act      │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │   Observe    │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │  Validate    │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │   Reflect    │
                └──────┬───────┘
                       ↓
              ┌────────┴────────┐
              ↓                 ↓
           Success            Problem
              ↓                 ↓
          Continue          Correct
                                ↓
                             Re-plan
                                ↓
                             Execute
```

This feedback loop is one of the most important foundations for reliable AI Agent execution.

---

# 45. Part VI → Part VII Boundary

Reflection and self-correction belong to **Part VI — AI Agents** because they are fundamental capabilities of an individual agent.

```text
Part VI
Individual Agent
      │
      ├── Planning
      ├── Reasoning
      ├── Reflection
      ├── Self-Correction
      ├── Memory
      ├── Tools
      └── Execution
```

Part VII will extend these capabilities into autonomous systems:

```text
Part VII
Agentic AI
      │
      ├── Multiple Agents
      ├── Delegation
      ├── Supervision
      ├── Collaboration
      ├── Autonomous Workflows
      ├── Long-Running Agents
      ├── Agentic RAG
      └── Enterprise Agent Platforms
```

Protocols such as **A2A and other agent communication protocols** remain part of Part VII.

---

# 📌 Key Takeaways

- Reflection evaluates whether an agent's action or outcome achieved the intended objective.
- Self-correction allows the agent to modify its behavior after detecting a problem.
- Reflection closes the loop between execution and future decisions.
- Reflection is different from reasoning, planning, retry, and deterministic error handling.
- Reflection can occur at action, task, plan, or goal level.
- Deterministic validation should be preferred where possible.
- Model-based reflection is useful when evaluation requires interpretation or adaptive judgment.
- Self-correction can involve retry, modified inputs, alternative tools, additional retrieval, re-planning, clarification, or escalation.
- Reflection should measure whether corrective actions actually improve the outcome.
- Reflection loops must be bounded to prevent infinite execution.
- Risk-based reflection allows stronger controls for high-impact operations.
- Reflection must never bypass enterprise security and authorization boundaries.
- Reflection events should be observable and measurable.
- Human escalation provides a safe boundary when autonomous recovery is unsuccessful.
- The goal is not maximum self-correction.
- The goal is **reliable, controlled, and measurable recovery**.

---

# 🔗 Related Topics

### Previous

**[09. Agent Reasoning](09-agent-reasoning.md)**

### Next

**[02. Agent Memory](../02-agent-memory/01-agent-memory-overview.md)**

### Related

- [08. Planning & Task Decomposition](08-planning-and-task-decomposition.md)
- [AI Agent Fundamentals](01-ai-agent-fundamentals.md)
- [Tool Calling & Function Calling](02-tool-calling-and-function-calling.md)
- [Agent Memory](../02-agent-memory/01-agent-memory-overview.md)
- [Agent Observability](../04-agent-observability/01-agent-observability-overview.md)
- [Agent Security](../05-agent-security/01-agent-security-overview.md)
- [Agent Deployment](../06-agent-deployment/01-agent-deployment-overview.md)

---

> **Enterprise AI Engineering Handbook**  
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*