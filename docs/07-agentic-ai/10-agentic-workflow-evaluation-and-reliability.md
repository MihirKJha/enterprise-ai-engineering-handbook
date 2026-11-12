---
title: "Agentic Workflow Evaluation & Reliability"
description: "Evaluate agentic workflows through outcome scoring, LangGraph reflection loops, tracing, failure detection, and production release gates."
tags: [Agentic AI, Workflow Evaluation, Multi-Agent Systems, Observability, Reliability Engineering]
keywords: [agentic workflow evaluation, evaluator optimizer, LangGraph evaluation, LangSmith tracing, multi-agent reliability, production evaluation]
---

# 10. Agentic Workflow Evaluation & Reliability

A workflow can finish successfully and still make the wrong decision.

Consider a financial operations assistant investigating a disputed card transaction. The investigator retrieves transaction data, a policy agent checks the rules, and a reviewer prepares a recommendation. Every agent returns an answer and the graph reaches its final node—but the policy agent used an outdated rule and the reviewer missed a mandatory approval.

The orchestration engine reports completion. The business sees failure. Reliable agentic systems must evaluate decisions, inspect execution, detect unsafe behaviour, and recover deliberately.

## 1. Evaluate the workflow, not just the answer

A convincing final response can hide a wrong tool choice, incomplete evidence, or a failed handoff. Evaluate at five levels:

| Level | Evaluation question |
|---|---|
| Component | Did the model, tool, retriever, or agent behave correctly? |
| Step | Was this decision or action valid? |
| Trajectory | Did plans, tool calls, observations, and state changes make sense? |
| Workflow | Were all acceptance criteria satisfied? |
| Business outcome | Was the result safe and valid for the real process? |

Define acceptance criteria first: correct transaction, sufficient evidence, current policy, permitted recommendation, and escalation when evidence is incomplete. Reaching `END` is not success. Turn each criterion into a testable condition.

## 2. Evaluate agents and their collaboration

Good specialists do not automatically make a good team. An investigator may pass incomplete evidence to the policy agent, causing a reviewer to make a poor decision despite doing its own task correctly.

Assess agent accuracy, handoff completeness, tool selection and arguments, coordination, permissions, and end-to-end outcome. The course's **evaluator-optimizer** pattern provides a practical feedback loop: a generator creates an output, an evaluator grades it, and feedback sends rejected work back for revision. LangGraph models this with generator/evaluator nodes, shared state, and conditional routing. CrewAI demonstrates role-based agents and sequential tasks.

The course's investment-advisor example grades a generated plan against a target risk level. Warren Buffett-style evaluation returns a grade and feedback; the generator revises the plan until the grade matches or an iteration limit is reached. Preserve this discipline in business workflows: require a decision, reason, and actionable feedback—not merely “good” or “bad.”

### End-to-end LangGraph evaluator-optimizer

The following compact example uses the same pattern for a transaction recommendation. It shows explicit state, focused nodes, structured evaluation, conditional routing, and a bounded loop.

```python
from typing import TypedDict
from pydantic import BaseModel
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4.1-mini")

class Review(BaseModel):
    accepted: bool
    feedback: str

class CaseState(TypedDict):
    case: str
    draft: str
    feedback: str
    attempts: int
    accepted: bool

def generate(state: CaseState):
    prompt = (
        f"Prepare a transaction recommendation for: {state['case']}. "
        f"Address this evaluator feedback: {state['feedback']}"
    )
    draft = llm.invoke(prompt).content
    return {"draft": draft, "attempts": state["attempts"] + 1}

def evaluate(state: CaseState):
    reviewer = llm.with_structured_output(Review)
    result = reviewer.invoke(
        f"Check this recommendation for evidence, policy compliance "
        f"and missing approvals. Case: {state['case']} "
        f"Recommendation: {state['draft']}"
    )
    return {
        "accepted": result.accepted,
        "feedback": result.feedback
    }

def route(state: CaseState):
    if state["accepted"]:
        return "finish"
    if state["attempts"] >= 3:
        return "escalate"
    return "revise"

def escalate(state: CaseState):
    return {"draft": "Human review required: " + state["feedback"]}

graph = StateGraph(CaseState)
graph.add_node("generate", generate)
graph.add_node("evaluate", evaluate)
graph.add_node("escalate", escalate)
graph.add_edge(START, "generate")
graph.add_edge("generate", "evaluate")
graph.add_conditional_edges("evaluate", route, {
    "revise": "generate", "finish": END, "escalate": "escalate"
})
graph.add_edge("escalate", END)
app = graph.compile()

result = app.invoke({
    "case": "Disputed card transaction; evidence and policy record attached.",
    "draft": "", "feedback": "No prior feedback",
    "attempts": 0, "accepted": False
})
```

This is an illustrative model-backed workflow, not a substitute for deterministic policy validation. In production, ground the evaluator in authoritative policy data, validate required evidence outside the LLM, and send unresolved or high-impact decisions to a human.

## 3. Measure task completion

Measure business results, not agent activity.

| Metric | What it measures |
|---|---|
| Task success | All acceptance criteria satisfied |
| Workflow completion | Runs reaching a defined terminal state |
| Step / tool accuracy | Correct actions and valid arguments |
| Handoff validity | Complete, usable downstream context |
| Recovery success / retry rate | Successful recovery and additional attempts |
| P50 / P95 latency | Typical and tail execution time |
| Cost per successful task | Total cost divided by accepted tasks |

Keep **success**, **safe escalation**, **failure**, and **incomplete** separate. An agent that escalates a case with missing evidence has behaved safely, but has not completed the business task.

```python
def classify(state):
    if state["accepted"] and state["business_checks_passed"]:
        return "SUCCESS"
    if state["escalated"] and state.get("reason"):
        return "SAFE_ESCALATION"
    if state.get("failed"):
        return "FAILURE"
    return "INCOMPLETE"
```

For 100 investigations, report 72 accepted decisions, 18 safe escalations, 7 failures, and 3 incomplete runs—not “90% successful.” Test normal and difficult cases: ambiguity, conflicting evidence, unavailable tools, invalid outputs, and missing approvals. Version datasets and record model, prompt, tool, and workflow versions. The course's LangGraph testing node uses known input/output examples as a starting point for regression tests.

## 4. Trace the execution: a LangSmith investigation

A graph describes possible paths; a trace records the path one run actually took. Traces group spans for planning, agent calls, retrieval, tool execution, handoffs, retries, and validation.

**Practical investigation:** an accepted dispute recommendation contains an obsolete policy reference.

1. Open the failed or suspicious run in LangSmith and locate its trace/run ID.
2. Follow the parent-child spans from the workflow to the policy agent and retrieval/tool call.
3. Compare each span's inputs and outputs: did retrieval return the current policy version, and did the reviewer receive it?
4. Inspect timing, errors, retries, model/prompt versions, and token usage to distinguish stale evidence from a reasoning or handoff problem.
5. Correct the source, prompt, or state mapping; replay the case, then add it to the versioned regression dataset.

Capture trace ID, node/agent, parent-child relationship, timing, status, error category, tool, dependency latency, retry count, routing decision, model version, token usage, and acceptance result. Redact sensitive data, restrict access, and define retention. The course covers LangGraph workflow visualization and state/execution-path inspection, with LangSmith visibility for debugging. BeeAI's emitters, telemetry, and logging provide another way to track and investigate workflow behaviour.

## 5. Detect failures and recover safely

An exception is only one failure mode. A workflow can run without throwing an error and still violate a business rule.

| Failure signal | Response |
|---|---|
| Tool error or timeout | Classify; retry only if safe, otherwise fallback/escalate |
| Invalid or incomplete output | Validate and request targeted correction |
| No progress in a loop | Stop and escalate |
| Iteration, time, or cost limit reached | Terminate with explicit status |
| Missing approval or policy violation | Block completion, even if tools succeeded |

LangGraph demonstrates centralized error handling: route errors to a common handler and use state to continue, handle, or terminate. Keep nodes small and independently testable; use explicit, understandable state; isolate costly computations; and anticipate integration timeouts with fallbacks.

Classify failures before retrying:
- **Transient:** network errors, rate limits, or temporary unavailability—bounded retries with exponential backoff and jitter.
- **Permanent:** invalid credentials, malformed requests, or forbidden operations—fail fast.
- **Quality failure:** weak evidence or invalid output—revise or route to review, not an identical retry.
- **Unknown side-effect outcome:** reconcile with the target system before resubmitting.

```python
def recovery(error, attempt, limit):
    if error in {"invalid_request", "unauthorized", "forbidden"}:
        return "FAIL"
    if error == "unknown_side_effect_status":
        return "RECONCILE"
    if error in {"timeout", "rate_limited"}:
        return "RETRY" if attempt < limit else "ESCALATE"
    return "REVISE_OR_ESCALATE"
```

Use idempotency keys for payments, refunds, and other side effects. A repeated read-only lookup is safer than repeating a refund after a lost response. Chapter 09 addressed durable execution and reconciliation; here the focus is the retry decision and measuring recovery.

## 6. Choose the framework for the workflow

The course compares frameworks by collaboration model and operational focus. This is a selection guide, not a universal ranking.

| Framework | Primary strength | Best fit / trade-off |
|---|---|---|
| LangGraph | Nodes, edges, shared state, conditional routing | Controlled, stateful workflows; more explicit setup |
| CrewAI | Role-based agents and task-oriented crews | Fast team-style workflows and sequential pipelines |
| AutoGen | Agent-to-agent and agent-to-human conversations | Conversational collaboration; control flow is dialogue-centric |
| BeeAI | Tool integration, memory, state persistence, emitters and telemetry | Enterprise deployment and operational visibility |

## 7. Move evaluation from testing to deployment

Use a release checklist, not a single “the demo worked” decision:

- [ ] **Unit:** test nodes, tools, schemas, and known input/output examples independently.
- [ ] **Workflow:** test normal, boundary, ambiguous, conflicting, and failure paths.
- [ ] **Quality:** score outputs and trajectories against versioned evaluation cases.
- [ ] **Business safety:** verify evidence, policy, permissions, approvals, and escalation rules deterministically where possible.
- [ ] **Resilience:** test timeouts, bounded retries, error routing, idempotency, and recovery.
- [ ] **Release gate:** require minimum quality/success thresholds and maximum latency/cost; compare against the previous version.
- [ ] **Canary and monitor:** release gradually; monitor outcome classes, errors, P95 latency, cost, and recovery.
- [ ] **Feedback loop:** inspect production traces; convert confirmed incidents into regression cases before the next release.

Define SLOs from business needs and measured baselines. Break latency into model calls, retrieval, external tools, serial handoffs, and revisions. Parallelize only independent work; concurrency can increase provider load, cost, and coordination complexity.

### 💼 Backend Architecture Parallel

| Backend engineering | Agentic workflow equivalent |
|---|---|
| Unit/integration tests | Node, tool, and workflow evaluation |
| Distributed tracing | Agent and tool execution traces |
| Circuit breaker / retry | Stop unhealthy calls; bounded classified retries |
| Dead-letter queue | Failed work awaiting investigation |
| Release regression gate | Evaluation thresholds before deployment |
| Incident review | Trace analysis and regression test creation |

## Key Takeaways

Evaluate business outcomes and execution trajectories—not just final responses. Measure handoffs and recovery, separate safe escalation from success, trace the actual execution, classify failures before retrying, and make production incidents part of the next regression suite.

## What's Next?

Chapter 11 — **Agentic RAG** — brings retrieval and agent reasoning together: agents plan retrieval, select tools and sources, evaluate evidence, and adapt retrieval strategies within a controlled workflow.

## Source Coverage & Engineering Extensions

**Direct transcript coverage:** evaluator-optimizer pattern; generator/evaluator roles; grading, feedback, conditional routing, and iteration limits in the investment-advisor example; CrewAI role/task sequencing; LangGraph state, nodes, edges, workflow visualization, known-input/output testing, and centralized error handling; framework characteristics of LangGraph, CrewAI, AutoGen, and BeeAI; BeeAI emitters, telemetry, and logging; LangSmith visibility for debugging.

**Enterprise engineering extensions:** business acceptance criteria, metric taxonomy and outcome classes, trace metadata/privacy, failure classification, bounded backoff, idempotency, SLOs, release gates, canary monitoring, and production-to-regression feedback. These are applied recommendations, not claims that the course implements a complete production evaluation platform.

## References

- IBM course transcript: *Agentic AI with LangChain and LangGraph* — state, graph execution, testing, error handling, and LangSmith debugging.
- IBM course transcript: *Agentic AI with LangGraph, CrewAI, AutoGen and BeeAI* — evaluator-optimizer, investment-advisor workflow, framework comparison, telemetry, and logging.
- [LangSmith documentation](https://docs.smith.langchain.com/)
- [LangGraph documentation](https://docs.langchain.com/oss/python/langgraph/overview)

> **Enterprise AI Engineering Handbook**
>
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*
