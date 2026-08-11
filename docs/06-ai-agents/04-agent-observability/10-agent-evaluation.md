# Agent Evaluation

> Agent evaluation is the systematic measurement of an AI Agent's ability to complete tasks correctly, reliably, efficiently, safely, and consistently across realistic execution scenarios.

---

## 📖 Overview

Traditional LLM evaluation often focuses on the quality of a generated response.

AI Agent evaluation is broader.

An agent may:

```text
Receive Goal
    ↓
Understand Task
    ↓
Plan
    ↓
Reason
    ↓
Select Tools
    ↓
Execute Actions
    ↓
Observe Results
    ↓
Reflect
    ↓
Re-plan
    ↓
Complete Task
```

Therefore, evaluating only the final answer is insufficient.

A production agent should be evaluated across its **entire execution trajectory**.

```text
                 Agent Evaluation
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
   Task Outcome     Execution         Safety
        │               │                │
        ↓               ↓                ↓
    Correctness      Efficiency       Compliance
        │               │                │
        └───────────────┼────────────────┘
                        ↓
                  Overall Quality
```

The objective is not simply:

> "Did the LLM produce a good answer?"

Instead:

> **"Did the agent reliably achieve the intended objective using appropriate actions, tools, resources, and policies?"**

---

# 🎯 Learning Objectives

After completing this chapter, you will understand:

- Why AI Agent evaluation differs from traditional LLM evaluation
- Agent evaluation dimensions
- Task success evaluation
- Goal completion
- Tool selection evaluation
- Tool argument evaluation
- Tool execution evaluation
- Planning evaluation
- Trajectory evaluation
- Final response evaluation
- Groundedness and factuality
- Safety and policy evaluation
- Reliability evaluation
- Efficiency evaluation
- Latency evaluation
- Cost evaluation
- Agent evaluation datasets
- Golden test cases
- Synthetic evaluation data
- Human evaluation
- LLM-as-a-Judge
- Deterministic evaluation
- Online evaluation
- Offline evaluation
- Regression testing
- Production evaluation
- Evaluation pipelines
- Agent evaluation metrics
- Evaluation failure patterns
- Enterprise evaluation architecture

---

# 1. Why Agent Evaluation Is Different

A traditional LLM application can often be evaluated as:

```text
Input
  ↓
LLM
  ↓
Output
  ↓
Evaluate Output
```

An AI Agent is different:

```text
Input
  ↓
Agent
  ↓
Plan
  ↓
Tool
  ↓
Result
  ↓
Reason
  ↓
Tool
  ↓
Result
  ↓
Reflection
  ↓
Final Answer
```

There are therefore multiple opportunities for failure.

```text
Agent Evaluation
├── Goal Understanding
├── Planning
├── Reasoning
├── Tool Selection
├── Tool Arguments
├── Tool Execution
├── State Management
├── Memory Usage
├── Recovery
├── Final Answer
├── Safety
├── Latency
└── Cost
```

A final answer may appear correct even though the agent used an unsafe or inefficient execution path.

---

# 2. Final Answer vs Agent Trajectory

Consider:

```text
User:
"Find the current order status."
```

Agent A:

```text
Order Lookup
 ↓
Correct Result
 ↓
Answer
```

Agent B:

```text
Unrelated Tool
 ↓
Incorrect Search
 ↓
Retry
 ↓
Correct Tool
 ↓
Correct Result
 ↓
Answer
```

Both may produce the same final answer.

However:

```text
Agent A
✓ Correct
✓ Efficient

Agent B
✓ Correct
⚠ Inefficient
⚠ Unnecessary Tool Calls
```

Therefore:

> **Agent evaluation should consider both the final outcome and the execution trajectory.**

---

# 3. Agent Evaluation Dimensions

A comprehensive evaluation model can be represented as:

```text
                    Agent Quality
                         │
       ┌─────────────────┼─────────────────┐
       ↓                 ↓                 ↓
   Effectiveness      Efficiency         Safety
       │                 │                 │
       ↓                 ↓                 ↓
   Task Success        Latency          Compliance
   Correctness         Cost             Policy
   Completeness        Tool Usage       Security
   Groundedness        Token Usage      Risk
```

Additional dimensions include:

```text
Reliability
Robustness
Consistency
Recoverability
Observability
User Experience
```

---

# 4. Task Success

The most important agent metric is usually:

> **Did the agent accomplish the intended task?**

Example:

```text
Goal:
Cancel an eligible subscription

Agent:
Retrieve Subscription
 ↓
Validate Eligibility
 ↓
Cancel Subscription
 ↓
Verify Cancellation
```

Task success requires the final state to match the intended objective.

```text
Expected State
      ↓
Actual State
      ↓
Compare
      ↓
Success / Failure
```

A useful metric is:

```text
Task Success Rate
=
Successful Tasks
÷
Total Tasks
```

For example:

```text
Successful Tasks = 920
Total Tasks = 1,000

Task Success Rate = 92%
```

---

# 5. Goal Completion

Task success and goal completion are closely related.

An agent may complete individual subtasks but still fail the overall goal.

Example:

```text
Goal:
Prepare customer report

Task A → Retrieve Data ✓
Task B → Calculate Metrics ✓
Task C → Generate Report ✗
```

The overall goal is incomplete.

Therefore:

```text
Subtask Success
      ≠
Goal Success
```

Evaluation should track both.

---

# 6. Correctness

Correctness measures whether the agent's output or action is correct.

Examples:

```text
Correct Database Record
Correct Calculation
Correct Tool
Correct Business Decision
Correct Final Answer
```

For deterministic tasks:

```text
Expected = Actual
```

For more complex tasks:

```text
Expected Behavior
      ↓
Evaluate Agent Result
      ↓
Correct / Incorrect
```

---

# 7. Completeness

An agent may produce a partially correct result.

Example:

```text
User asks:
"Analyze sales by region and product."

Agent:
✓ Region analysis
✗ Product analysis
```

The answer is not fully correct.

Therefore evaluation should distinguish:

```text
Correctness
     +
Completeness
```

Possible categories:

```text
Complete
Partially Complete
Incomplete
```

---

# 8. Tool Selection Evaluation

Agents often have multiple tools available.

For example:

```text
Tools:
├── Customer Lookup
├── Order Lookup
├── Payment Lookup
├── Refund Tool
└── Email Tool
```

The evaluation should determine whether the correct tool was selected.

```text
Goal
 ↓
Expected Tool
 ↓
Actual Tool
 ↓
Compare
```

Possible outcomes:

```text
Correct Tool
Wrong Tool
Unnecessary Tool
Missing Tool
```

---

# 9. Tool Argument Evaluation

Selecting the correct tool is not enough.

The arguments must also be correct.

Example:

```text
Tool:
get_order(order_id)
```

Expected:

```json
{
  "order_id": "ORD-12345"
}
```

Actual:

```json
{
  "order_id": "ORD-12354"
}
```

The correct tool was selected, but the execution is still incorrect.

Therefore:

```text
Tool Evaluation
├── Tool Selection
└── Argument Correctness
```

---

# 10. Tool Execution Evaluation

Tool execution should also be evaluated.

Important questions include:

- Was the tool executed successfully?
- Were the required parameters supplied?
- Was the result interpreted correctly?
- Was the tool called unnecessarily?
- Was the tool called too many times?
- Was a safer alternative available?

Example:

```text
Tool Call
 ↓
Execution
 ↓
Result
 ↓
Validation
```

A tool call can therefore fail at multiple levels.

---

# 11. Planning Evaluation

Planning should be evaluated independently.

Questions include:

```text
Was the plan complete?
Were dependencies correct?
Was the ordering correct?
Were unnecessary tasks included?
Were required tools identified?
Did the plan respect constraints?
```

Example:

```text
Expected:

A → B → C

Agent:

A → C → B
```

The agent may eventually succeed, but the plan was inefficient or invalid.

---

# 12. Reasoning Evaluation

Reasoning evaluation should focus on **observable decisions and outcomes**, rather than requiring access to private chain-of-thought.

Useful evaluation signals include:

```text
Correct Action
Correct Tool
Correct Arguments
Correct Interpretation
Correct Next Step
Appropriate Recovery
Policy Compliance
```

For example:

```text
Tool Result:
Payment = FAILED

Expected Next Action:
Inspect failure reason

Agent Action:
Send success notification

Evaluation:
Incorrect Decision
```

This evaluates reasoning through observable behavior.

---

# 13. Trajectory Evaluation

An agent trajectory is the sequence of actions taken during an execution.

Example:

```text
Goal
 ↓
Plan
 ↓
Tool A
 ↓
Observation
 ↓
Tool B
 ↓
Observation
 ↓
Tool C
 ↓
Final Answer
```

Trajectory evaluation examines:

- Action sequence
- Tool sequence
- State transitions
- Errors
- Retries
- Re-planning
- Final outcome

A trajectory can be:

```text
Correct
Efficient
Safe
```

or:

```text
Correct
But unnecessarily expensive
```

---

# 14. Trajectory Quality

A useful conceptual model is:

```text
Trajectory Quality
├── Correctness
├── Efficiency
├── Safety
├── Completeness
├── Robustness
└── Recoverability
```

For example:

```text
Trajectory A

Tool A
 ↓
Tool B
 ↓
Answer

Trajectory B

Tool A
 ↓
Tool C
 ↓
Tool A
 ↓
Tool D
 ↓
Tool B
 ↓
Answer
```

Both may succeed, but Trajectory A is more efficient.

---

# 15. Groundedness

For agents using RAG or external knowledge sources, evaluation should determine whether claims are supported by retrieved information.

```text
Retrieved Context
       ↓
Agent Response
       ↓
Claim Validation
       ↓
Supported / Unsupported
```

Example:

```text
Source:
Refund available within 30 days.

Agent:
"Refunds are available within 30 days."

✓ Grounded
```

If the agent states:

```text
"Refunds are available within 90 days."
```

without supporting evidence:

```text
✗ Unsupported
```

---

# 16. Factuality

Factuality evaluates whether the agent's claims are factually correct.

This is related to groundedness but not identical.

```text
Groundedness
=
Is the claim supported by the provided source?

Factuality
=
Is the claim actually correct?
```

An agent can be:

```text
Grounded but incorrect
```

if the retrieved source itself is outdated or incorrect.

Therefore enterprise evaluation may require both.

---

# 17. Safety Evaluation

Agents can execute actions, making safety evaluation particularly important.

Evaluation should determine:

```text
Did the agent:
✓ Respect permissions?
✓ Follow policies?
✓ Avoid unsafe actions?
✓ Protect sensitive information?
✓ Refuse prohibited actions?
✓ Escalate high-risk situations?
```

For example:

```text
User requests unauthorized refund
       ↓
Agent
       ↓
Policy Check
       ↓
Reject
```

The correct behavior is refusal rather than task completion.

Therefore:

> **A successful agent evaluation does not always mean the agent completed the user's requested action.**

Sometimes success means:

> **The agent correctly refused or escalated the action.**

---

# 18. Policy Compliance

Enterprise agents should be evaluated against explicit policies.

Example:

```text
Policy:
Refund > $1,000 requires approval.
```

Agent:

```text
Refund = $2,000
 ↓
Human Approval
 ↓
Execute
```

Evaluation:

```text
✓ Policy Compliant
```

If the agent directly executes:

```text
Refund = $2,000
 ↓
Execute
```

then:

```text
✗ Policy Violation
```

---

# 19. Reliability

Reliability measures whether the agent consistently succeeds across repeated executions.

An agent that succeeds once but fails frequently is not production-ready.

```text
Run 1 → Success
Run 2 → Success
Run 3 → Failure
Run 4 → Success
Run 5 → Failure
```

Possible metric:

```text
Reliability Rate
=
Successful Runs
÷
Total Runs
```

Evaluation should therefore consider repeated executions rather than isolated examples.

---

# 20. Robustness

Robustness measures how well the agent handles variations and unexpected conditions.

Test variations may include:

```text
Normal Input
Ambiguous Input
Incomplete Input
Unexpected Input
Tool Failure
Network Failure
Missing Data
Conflicting Data
Long Context
```

A robust agent should degrade gracefully.

```text
Expected Condition
      ↓
Normal Execution
```

and:

```text
Unexpected Condition
      ↓
Detect
      ↓
Recover / Escalate
```

---

# 21. Recovery Evaluation

Since agents can encounter failures, recovery behavior should be evaluated.

Example:

```text
Tool Failure
 ↓
Agent Detects Failure
 ↓
Alternative Tool
 ↓
Success
```

Evaluation dimensions include:

```text
Failure Detection
Recovery Selection
Recovery Success
Number of Attempts
Time to Recovery
Cost of Recovery
```

---

# 22. Efficiency Evaluation

Two agents can achieve the same outcome while consuming very different resources.

```text
Agent A:
3 tool calls
10 seconds
$0.05

Agent B:
12 tool calls
45 seconds
$0.30
```

Both may succeed.

Agent A is more efficient.

Important efficiency dimensions include:

- Tool calls
- LLM calls
- Tokens
- Latency
- Cost
- Memory operations
- Retrieval operations

---

# 23. Latency Evaluation

Agent execution can involve multiple sequential operations.

```text
LLM
 ↓
Tool
 ↓
LLM
 ↓
Tool
 ↓
LLM
```

Each step adds latency.

Important metrics include:

```text
Total Latency
Planning Latency
LLM Latency
Tool Latency
Retrieval Latency
Reflection Latency
Queue Time
```

Production evaluation should examine both average and tail latency.

For example:

```text
p50
p95
p99
```

This is important for user-facing agent systems.

---

# 24. Cost Evaluation

Agent cost can accumulate across multiple calls.

```text
Planning LLM
    +
Reasoning LLM
    +
Tool Calls
    +
Retrieval
    +
Reflection
    +
Memory
```

A useful conceptual metric is:

```text
Cost per Successful Task
=
Total Execution Cost
÷
Successful Tasks
```

This can be more meaningful than:

```text
Cost per Request
```

because an unsuccessful agent execution may require retries or human intervention.

---

# 25. Token Efficiency

Token consumption can be evaluated across the complete trajectory.

```text
Input Tokens
      +
Output Tokens
      +
Tool Context
      +
Retrieved Context
      +
Memory Context
```

Important metrics include:

```text
Tokens per Run
Tokens per Successful Task
Tokens per Tool Call
Tokens Used by Reflection
Tokens Used by Planning
```

High token usage may indicate:

- Excessive context
- Repeated reasoning
- Poor planning
- Long tool results
- Unnecessary reflection

---

# 26. User Experience Evaluation

Technical metrics are not enough.

An agent may achieve the task but still provide a poor user experience.

Evaluate:

```text
Clarity
Relevance
Response Time
Completeness
Consistency
Action Transparency
Error Communication
```

For example:

```text
Task completed successfully

but:

"Done."

```

may be technically correct but poor from a user experience perspective.

---

# 27. Deterministic Evaluation

Some agent behaviors can be evaluated with deterministic rules.

Examples:

```text
HTTP Status
Tool Name
Tool Arguments
Database State
Transaction Status
Required Fields
Policy Rules
Schema Validation
```

Example:

```text
Expected Tool:
get_order

Actual Tool:
get_order

Result:
PASS
```

Deterministic evaluation is:

- Fast
- Repeatable
- Cheap
- Easy to automate

Use it wherever possible.

---

# 28. Programmatic Evaluation

Programmatic evaluators can calculate metrics directly.

For example:

```text
Expected:
5 records

Actual:
5 records

Evaluator:
PASS
```

Or:

```text
Expected:
Refund status = APPROVED

Actual:
Refund status = REJECTED

Evaluator:
FAIL
```

Programmatic evaluation is particularly useful for:

- APIs
- Structured outputs
- Tool calls
- Business rules
- State transitions
- Security policies

---

# 29. LLM-as-a-Judge

Some qualities are difficult to evaluate with deterministic rules.

Examples:

```text
Response Quality
Relevance
Helpfulness
Clarity
Completeness
Reasoning Quality
```

An LLM can act as an evaluator.

Conceptually:

```text
Agent Output
     ↓
Evaluator LLM
     ↓
Score / Judgment
```

Example:

```json
{
  "relevance": 4,
  "completeness": 5,
  "groundedness": 5,
  "overall": 4.7
}
```

LLM-as-a-Judge can be useful, but it should not be treated as infallible.

---

# 30. Risks of LLM-as-a-Judge

Evaluator models can introduce their own biases.

Potential problems include:

- Evaluator inconsistency
- Position bias
- Verbosity bias
- Model bias
- Poor calibration
- Agreement with incorrect outputs
- Sensitivity to prompt wording

Therefore:

```text
LLM Judge
    +
Deterministic Evaluators
    +
Human Evaluation
```

is often stronger than relying on a single evaluator.

---

# 31. Human Evaluation

Human evaluation remains useful for subjective or high-impact tasks.

Humans can assess:

```text
Helpfulness
Correctness
Clarity
Safety
User Satisfaction
Business Appropriateness
```

A human evaluation process may look like:

```text
Agent Run
 ↓
Sample
 ↓
Human Reviewer
 ↓
Score
 ↓
Feedback
 ↓
Evaluation Dataset
```

Human evaluation is expensive, so it is usually combined with automated evaluation.

---

# 32. Hybrid Evaluation

A mature evaluation architecture combines multiple evaluators.

```text
                    Agent Run
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
    Deterministic     LLM Judge     Human
      Evaluator        Evaluator    Review
          │             │             │
          └─────────────┼─────────────┘
                        ↓
                 Evaluation Result
```

This provides a stronger evaluation signal than any single approach.

---

# 33. Offline Evaluation

Offline evaluation occurs before or outside production traffic.

Typical process:

```text
Evaluation Dataset
       ↓
Run Agent
       ↓
Collect Trajectories
       ↓
Run Evaluators
       ↓
Calculate Metrics
       ↓
Compare Versions
```

Useful for:

- Development
- Regression testing
- Model comparison
- Prompt comparison
- Tool changes
- Agent architecture changes

---

# 34. Online Evaluation

Online evaluation happens using production or production-like traffic.

```text
Production Agent
      ↓
Sample Requests
      ↓
Evaluation
      ↓
Metrics
      ↓
Monitoring
      ↓
Alert
```

Online evaluation can detect issues that offline datasets may miss.

Examples:

```text
New User Behavior
New Tool Failures
Changing Data
Model Drift
Latency Changes
Cost Changes
```

---

# 35. Continuous Evaluation

Production AI systems should be continuously evaluated.

```text
Build
 ↓
Test
 ↓
Deploy
 ↓
Observe
 ↓
Evaluate
 ↓
Improve
 ↓
Re-test
 ↓
Deploy
```

This creates an evaluation feedback loop.

```text
Evaluation
     ↓
Identify Weakness
     ↓
Improve Agent
     ↓
Evaluate Again
```

---

# 36. Evaluation Dataset

A good evaluation system requires representative test cases.

A dataset may contain:

```text
Input
Expected Outcome
Expected Tools
Expected State
Expected Constraints
Evaluation Criteria
```

Example:

```json
{
  "input": "Cancel my eligible subscription",
  "expected_tool": "cancel_subscription",
  "expected_state": "CANCELLED",
  "requires_approval": false
}
```

---

# 37. Golden Test Cases

Golden test cases are curated examples representing expected agent behavior.

Examples:

```text
Golden Case 1:
Successful payment lookup

Golden Case 2:
Unauthorized refund

Golden Case 3:
Missing order ID

Golden Case 4:
Tool timeout

Golden Case 5:
Conflicting information
```

Golden cases are valuable for regression testing.

---

# 38. Edge Cases

Evaluation should not focus only on normal requests.

Include:

```text
Empty Input
Missing Parameters
Ambiguous Request
Invalid Data
Conflicting Data
Tool Failure
Timeout
Permission Denied
Large Input
Long Conversation
Adversarial Input
```

A production evaluation dataset should deliberately include difficult cases.

---

# 39. Synthetic Evaluation Data

Synthetic test cases can expand coverage.

```text
Base Scenario
     ↓
Generate Variations
     ↓
Validate Test Cases
     ↓
Evaluation Dataset
```

Variations can include:

- Different wording
- Different parameters
- Different user roles
- Different tool results
- Different failure conditions

Synthetic data should still be validated to avoid propagating unrealistic scenarios.

---

# 40. Evaluation by Agent Trajectory

A trajectory can be represented as:

```json
{
  "goal": "Resolve payment failure",
  "steps": [
    {
      "action": "get_payment",
      "status": "success"
    },
    {
      "action": "get_failure_reason",
      "status": "success"
    },
    {
      "action": "retry_payment",
      "status": "success"
    }
  ],
  "outcome": "success"
}
```

Evaluators can inspect:

```text
Goal
 ↓
Actions
 ↓
Tool Calls
 ↓
Results
 ↓
State Changes
 ↓
Outcome
```

This is much richer than evaluating only the final text response.

---

# 41. Agent Evaluation Scorecard

A production scorecard might contain:

| Dimension | Example Metric |
| --- | --- |
| Task Success | Success Rate |
| Correctness | Correct Outcome % |
| Completeness | Complete Task % |
| Tool Selection | Correct Tool % |
| Tool Arguments | Valid Argument % |
| Planning | Valid Plan % |
| Recovery | Successful Recovery % |
| Groundedness | Supported Claim % |
| Safety | Policy Compliance % |
| Reliability | Successful Run % |
| Latency | p50 / p95 / p99 |
| Cost | Cost / Successful Task |
| Efficiency | Tool Calls / Task |
| User Experience | Satisfaction Score |

No single metric should be treated as the complete representation of agent quality.

---

# 42. Evaluation Thresholds

Production systems should define acceptable thresholds.

Example:

```text
Task Success       ≥ 95%
Tool Accuracy      ≥ 98%
Policy Compliance  = 100%
p95 Latency        < 10 sec
Cost / Task        < $0.10
```

If a new version falls below the threshold:

```text
Evaluation
 ↓
Threshold Failure
 ↓
Deployment Blocked
```

This creates a quality gate.

---

# 43. Evaluation as a CI/CD Quality Gate

Agent evaluation can become part of the deployment pipeline.

```text
Code Change
     ↓
Unit Tests
     ↓
Agent Tests
     ↓
Evaluation Dataset
     ↓
Trajectory Evaluation
     ↓
Safety Tests
     ↓
Performance Tests
     ↓
Quality Gate
     ↓
Deploy
```

This prevents agent changes from being deployed solely because the application builds successfully.

---

# 44. Regression Testing

Agent behavior can change after:

- Model updates
- Prompt changes
- Tool changes
- Retrieval changes
- Memory changes
- Policy changes
- Framework updates

Therefore:

```text
Previous Version
      ↓
Golden Dataset
      ↓
New Version
      ↓
Compare
```

Example:

```text
Version 1:
Task Success = 95%

Version 2:
Task Success = 89%

Regression Detected
```

The deployment should then be reviewed.

---

# 45. Agent Version Comparison

Different agent configurations can be evaluated against the same dataset.

```text
Evaluation Dataset
        │
   ┌────┴────┐
   ↓         ↓
Agent V1   Agent V2
   │         │
   └────┬────┘
        ↓
     Compare
```

Compare:

```text
Success
Quality
Latency
Cost
Tool Usage
Safety
```

A newer version is not automatically better.

---

# 46. Evaluation and Observability

Evaluation and observability complement each other.

### Observability

Answers:

> **What happened?**

```text
Logs
Traces
Metrics
Events
```

### Evaluation

Answers:

> **Was what happened good or bad?**

```text
Quality
Correctness
Success
Safety
Efficiency
```

Together:

```text
Observability
     ↓
Execution Data
     ↓
Evaluation
     ↓
Quality Signal
```

---

# 47. Evaluation and Cost Monitoring

An agent can improve task success while becoming prohibitively expensive.

Example:

```text
Version A
Success = 90%
Cost = $0.05

Version B
Success = 94%
Cost = $0.80
```

The improvement may not justify the cost.

Therefore evaluation should consider:

```text
Quality
+
Cost
```

A useful enterprise metric is:

```text
Quality per Dollar
```

or:

```text
Successful Tasks per Dollar
```

---

# 48. Evaluation and Latency

Similarly:

```text
Agent A
Success = 95%
p95 = 5 sec

Agent B
Success = 97%
p95 = 45 sec
```

Depending on the use case, Agent B may not be acceptable.

Therefore evaluation should consider:

```text
Quality
+
Latency
+
Cost
```

---

# 49. Safety Evaluation as a Hard Constraint

Some evaluation dimensions should not be treated as trade-offs.

For example:

```text
Task Success = 99%
Policy Compliance = 90%
```

This is not necessarily better than:

```text
Task Success = 95%
Policy Compliance = 100%
```

For high-risk systems:

```text
Safety / Compliance
        ↓
Hard Constraint
```

rather than simply another optimization metric.

---

# 50. Production Evaluation Architecture

A production-oriented architecture can look like:

```text
                         Agent
                           │
                           ▼
                       Agent Run
                           │
                           ▼
                      Trace Store
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
       Deterministic    LLM Judge      Human
        Evaluators       Evaluator     Review
             │             │             │
             └─────────────┼─────────────┘
                           ↓
                    Evaluation Engine
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
          Quality        Safety        Cost
          Metrics        Metrics      Metrics
             │             │             │
             └─────────────┼─────────────┘
                           ↓
                    Quality Dashboard
                           │
                           ▼
                       Alert / Gate
```

---

# 51. Evaluation Pipeline

A mature evaluation pipeline can be:

```text
Evaluation Dataset
       ↓
Agent Execution
       ↓
Trajectory Capture
       ↓
Deterministic Checks
       ↓
LLM Evaluation
       ↓
Human Sampling
       ↓
Metric Aggregation
       ↓
Threshold Evaluation
       ↓
Report
```

This can run:

```text
On Every Change
Daily
Before Deployment
After Deployment
On Model Change
On Prompt Change
```

---

# 52. Enterprise Evaluation Strategy

A practical enterprise strategy can be divided into layers.

```text
Layer 1
Deterministic Validation
        ↓
Layer 2
Trajectory Evaluation
        ↓
Layer 3
LLM-Based Quality Evaluation
        ↓
Layer 4
Safety / Policy Evaluation
        ↓
Layer 5
Human Evaluation
        ↓
Layer 6
Production Monitoring
```

This creates defense in depth for agent quality.

---

# 53. Evaluation Frequency

Different evaluations can run at different frequencies.

### Development

```text
Every Change
```

### CI/CD

```text
Every Release Candidate
```

### Staging

```text
Before Production Deployment
```

### Production

```text
Continuous Sampling
```

### Major Model Change

```text
Full Evaluation Suite
```

---

# 54. Evaluation Sampling

Evaluating every production interaction with expensive evaluators may be impractical.

A sampling strategy can be used:

```text
100% Deterministic Metrics
       +
Sampled LLM Evaluation
       +
Sampled Human Evaluation
```

Higher-risk interactions may receive higher evaluation coverage.

```text
Low Risk
 ↓
Low Sampling

High Risk
 ↓
High Sampling
```

---

# 55. Agent Evaluation Failure Patterns

Evaluation systems themselves can fail.

## Measuring Only Final Answers

```text
Correct Answer
 ≠
Correct Agent Behavior
```

---

## Using Only LLM Judges

The evaluator may share the same weaknesses as the evaluated model.

---

## Ignoring Tool Calls

A final answer may hide unsafe or inefficient tool usage.

---

## Ignoring Cost

A high-quality but extremely expensive agent may not be production viable.

---

## Ignoring Safety

Task success should never override security and policy requirements.

---

## Overfitting to Golden Data

An agent may perform well on known examples but fail on unseen inputs.

---

# 56. Evaluation Coverage

A mature evaluation suite should cover:

```text
Normal Cases
     +
Edge Cases
     +
Failure Cases
     +
Security Cases
     +
Policy Cases
     +
Performance Cases
     +
Cost Cases
```

Example:

```text
Customer Support Agent

Normal:
"What is my order status?"

Edge:
"Order status for order?"

Failure:
Order API unavailable

Security:
Access another customer's order

Policy:
Request unauthorized refund

Performance:
100 concurrent requests
```

---

# 57. Evaluation Matrix

An enterprise evaluation matrix might look like:

| Scenario | Task | Tools | Safety | Recovery | Performance |
| --- | --- | --- | --- | --- | --- |
| Normal request | ✓ | ✓ | ✓ | | ✓ |
| Missing data | ✓ | ✓ | | ✓ | ✓ |
| Tool failure | ✓ | ✓ | | ✓ | ✓ |
| Unauthorized request | | ✓ | ✓ | | ✓ |
| High-risk action | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ambiguous request | ✓ | ✓ | ✓ | ✓ | ✓ |

This ensures evaluation is not concentrated on only one dimension.

---

# 58. Agent Evaluation Lifecycle

The complete evaluation lifecycle is:

```text
Define Goals
     ↓
Define Success Criteria
     ↓
Build Evaluation Dataset
     ↓
Run Agent
     ↓
Capture Trajectory
     ↓
Evaluate
     ↓
Calculate Metrics
     ↓
Compare Against Thresholds
     ↓
Identify Failures
     ↓
Improve Agent
     ↓
Re-evaluate
```

This creates a continuous quality loop.

---

# 59. Evaluation Feedback Loop

Evaluation should feed improvements back into engineering.

```text
Agent
 ↓
Production
 ↓
Evaluation
 ↓
Failure Analysis
 ↓
Identify Root Cause
 ↓
Improve
 ├── Prompt
 ├── Tool
 ├── Planner
 ├── Memory
 ├── Retrieval
 ├── Policy
 └── Model
 ↓
Evaluate Again
```

This turns evaluation into an engineering feedback mechanism rather than a one-time benchmark.

---

# 60. Practical Example — Payment Agent Evaluation

Consider:

> "Retry my failed payment."

Evaluation could check:

```text
1. Did agent identify the correct payment?
2. Did it verify payment status?
3. Did it check retry eligibility?
4. Did it select the correct tool?
5. Were tool arguments correct?
6. Did it follow authorization rules?
7. Did the payment retry succeed?
8. Did it verify the final state?
9. Did it communicate the correct result?
10. How many tool calls were required?
11. How long did execution take?
12. What did the operation cost?
```

This demonstrates why agent evaluation is broader than evaluating a generated response.

---

# 61. Practical Example — Software Engineering Agent

For:

> "Fix the failing test."

Evaluation can measure:

```text
Repository Understanding
        ↓
Correct Test Identified
        ↓
Correct Root Cause
        ↓
Appropriate Change
        ↓
Tests Pass
        ↓
No Regression
        ↓
Change Explained
```

Additional metrics:

```text
Files Modified
Tool Calls
Test Runs
Execution Time
Token Usage
Cost
```

---

# 62. Agent Evaluation Checklist

Before deploying an agent, verify:

### Task

- [ ] Task success is measurable
- [ ] Goal completion is defined
- [ ] Expected outcomes are known

### Planning

- [ ] Plans can be evaluated
- [ ] Dependencies are validated
- [ ] Unnecessary steps are detected

### Tools

- [ ] Tool selection is evaluated
- [ ] Arguments are validated
- [ ] Tool failures are tested

### Reasoning

- [ ] Observable decisions are evaluated
- [ ] Recovery behavior is tested
- [ ] Uncertainty handling is tested

### Safety

- [ ] Policy compliance is tested
- [ ] Unauthorized actions are tested
- [ ] High-risk actions are tested
- [ ] Escalation behavior is tested

### Performance

- [ ] Latency is measured
- [ ] Token usage is measured
- [ ] Cost is measured

### Reliability

- [ ] Failure cases are tested
- [ ] Recovery is tested
- [ ] Regression tests exist

### Production

- [ ] Evaluation metrics are monitored
- [ ] Quality thresholds are defined
- [ ] Evaluation is part of the release process

---

# 63. Key Engineering Principles

### 1. Evaluate the Agent, Not Just the Answer

The execution trajectory matters.

### 2. Measure Task Success

The primary objective is successful task completion.

### 3. Evaluate Tool Behavior

Tool selection and arguments are critical agent behaviors.

### 4. Evaluate Recovery

A production agent must handle failures gracefully.

### 5. Combine Evaluation Methods

Use deterministic checks, LLM evaluation, and human evaluation where appropriate.

### 6. Treat Safety Separately

Safety and policy violations should often be hard constraints.

### 7. Measure Efficiency

Quality without acceptable cost and latency may not be production viable.

### 8. Build Regression Datasets

Agent behavior changes as models, prompts, tools, and memory change.

### 9. Evaluate Continuously

Production agents require ongoing evaluation.

### 10. Turn Evaluation into Feedback

Evaluation should drive improvements to the agent architecture.

---

# 64. Enterprise Agent Evaluation Architecture

The complete architecture can be represented as:

```text
                         User Request
                              │
                              ▼
                           AI Agent
                              │
             ┌────────────────┼────────────────┐
             ↓                ↓                ↓
          Planning         Tools            Memory
             │                │                │
             └────────────────┼────────────────┘
                              ↓
                        Agent Execution
                              │
                              ▼
                           Outcome
                              │
                     ┌────────┴────────┐
                     ↓                 ↓
                Trajectory         Final Result
                     │                 │
                     └────────┬────────┘
                              ↓
                       Evaluation Engine
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
 Deterministic            LLM Judge             Human
 Evaluation               Evaluation            Review
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ↓
                       Evaluation Metrics
                              │
             ┌────────────────┼────────────────┐
             ↓                ↓                ↓
          Quality           Safety          Efficiency
             │                │                │
             └────────────────┼────────────────┘
                              ↓
                       Quality Gate / Alert
                              │
                              ▼
                         Agent Improvement
```

---

# 65. Part VI Evaluation Architecture

Agent evaluation connects the major engineering areas of Part VI.

```text
Planning
   ↓
Reasoning
   ↓
Tools
   ↓
Memory
   ↓
Communication
   ↓
Execution
   ↓
Reflection
   ↓
Evaluation
   ↓
Observability
   ↓
Security
   ↓
Deployment
```

Evaluation therefore acts as a cross-cutting capability across the entire agent lifecycle.

---

# 66. Part VI → Part VII Boundary

Agent evaluation belongs to **Part VI — AI Agents** because individual AI Agents must be evaluated before they become components of larger autonomous systems.

```text
Part VI
Individual Agent
      │
      ├── Planning
      ├── Reasoning
      ├── Tools
      ├── Memory
      ├── Reflection
      ├── Evaluation
      ├── Observability
      ├── Security
      └── Deployment
```

Part VII expands evaluation into:

```text
Part VII
Agentic AI & Multi-Agent Systems
      │
      ├── Multi-Agent Evaluation
      ├── Coordination Evaluation
      ├── Delegation Evaluation
      ├── Supervisor Evaluation
      ├── Agent Collaboration
      ├── Long-Running Agent Evaluation
      └── Autonomous System Evaluation
```

Those topics should be addressed in Part VII rather than duplicating them here.

Protocols such as **A2A and other agent communication protocols** also remain in Part VII.

---

# 📌 Key Takeaways

- Agent evaluation must go beyond final-response quality.
- Task success and goal completion are the primary outcome measures.
- Planning, reasoning, tool selection, tool arguments, and execution can all be evaluated.
- Agent trajectories provide valuable signals about how an outcome was achieved.
- Groundedness and factuality are important for knowledge-intensive agents.
- Safety and policy compliance are critical evaluation dimensions for enterprise agents.
- Reliability and robustness should be measured across repeated and difficult scenarios.
- Latency, token usage, tool usage, and cost are important production metrics.
- Deterministic evaluation should be used wherever possible.
- LLM-as-a-Judge can evaluate subjective qualities but should not be treated as the sole evaluator.
- Human evaluation remains valuable for subjective and high-impact use cases.
- Offline evaluation supports development and regression testing.
- Online evaluation supports production quality monitoring.
- Golden datasets and edge cases are essential for reliable evaluation.
- Evaluation should become part of CI/CD and production operations.
- Safety requirements may act as hard constraints rather than optimization targets.
- The best evaluation strategy combines **task outcome, trajectory, safety, quality, reliability, latency, and cost**.
- Evaluation should create a continuous feedback loop that improves the agent over time.

---

# 🔗 Related Topics

### Previous

**[09. Agent Reasoning](../01-ai-agent-fundamentals/09-agent-reasoning.md)**

### Related

- [08. Planning & Task Decomposition](../01-ai-agent-fundamentals/08-planning-and-task-decomposition.md)
- [10. Reflection & Self-Correction](../01-ai-agent-fundamentals/10-reflection-and-self-correction.md)
- [Agent Memory](../02-agent-memory/01-agent-memory-overview.md)
- [Agent Communication](../03-agent-communication/01-agent-communication-overview.md)
- [Agent Observability](01-agent-observability-overview.md)
- [Agent Security](../05-agent-security/01-agent-security-overview.md)
- [Agent Deployment](../06-agent-deployment/01-agent-deployment-overview.md)

---

> **Enterprise AI Engineering Handbook**  
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*