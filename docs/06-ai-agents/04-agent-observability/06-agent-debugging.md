# 06. Agent Debugging

> **Category:** Agent Observability
> **Module:** AI Agents
> **Prerequisites:** Agent Observability Overview, Agent Logging, Agent Tracing, Agent Monitoring, Agent Metrics
> **Difficulty:** Intermediate

> **Note:** Agent Debugging is the systematic process of identifying, analyzing, and resolving failures in AI agents. Unlike traditional software debugging, AI debugging involves investigating prompts, reasoning, memory retrieval, LLM behavior, tool execution, workflows, and external integrations. Enterprise AI platforms rely on structured debugging techniques to rapidly diagnose issues and improve reliability.

---

# Overview

Imagine a customer asks an AI assistant:

> **"Summarize the latest sales report."**

The workflow is

```text
User

↓

Planner

↓

Retriever

↓

Vector Database

↓

LLM

↓

Excel Tool

↓

Response
```

Instead of the correct answer, the AI replies:

> "I couldn't find any sales report."

Where is the problem?

- Bad prompt?
- Retriever failure?
- Empty Vector Database?
- Tool error?
- Wrong reasoning?
- LLM hallucination?

Without debugging, engineers can only guess.

Debugging provides a structured process to identify the exact failure.

---

# Why Agent Debugging Matters

Without Debugging

```text
User

↓

AI Agent

↓

Wrong Answer

↓

Guess the Cause ❌
```

Problems

- Slow incident resolution
- Repeated failures
- Poor customer experience
- Difficult root cause analysis
- Expensive production outages

---

With Debugging

```text
User

↓

AI Workflow

↓

Logs

↓

Traces

↓

Metrics

↓

Root Cause

↓

Fix
```

Benefits

- Faster issue resolution
- Better AI quality
- Easier troubleshooting
- Reduced downtime
- Continuous improvement

---

# Traditional Debugging vs AI Debugging

Traditional Software

```text
Application

↓

Exception

↓

Stack Trace

↓

Fix
```

AI Systems

```text
Prompt

↓

Retriever

↓

Memory

↓

LLM

↓

Tool

↓

Workflow

↓

Response
```

AI introduces several new failure points beyond application code.

---

# High-Level Architecture

```text
                    User Request
                          │
                          ▼
                    AI Workflow
                          │
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
   Memory            Tool Calling            LLM
      │                   │                   │
      └───────────────────┼───────────────────┘
                          ▼
                  Debugging Layer
                          │
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
    Logs              Traces             Metrics
                          │
                          ▼
                 Root Cause Analysis
                          │
                          ▼
                    Apply Fix
```

Debugging combines information from multiple observability sources.

---

# Debugging Lifecycle

Enterprise AI teams generally follow this process.

```text
Problem Reported

↓

Collect Evidence

↓

Analyze Logs

↓

Analyze Traces

↓

Identify Root Cause

↓

Fix Issue

↓

Validate Fix

↓

Deploy
```

A structured workflow minimizes debugging time.

---

# Common AI Agent Failures

Enterprise AI systems fail in many different ways.

```text
AI Failures

│

├── Prompt Failures

├── Retrieval Failures

├── Memory Failures

├── Tool Failures

├── Workflow Failures

├── LLM Failures

├── API Failures

└── Infrastructure Failures
```

Each category requires different debugging techniques.

---

# 1. Prompt Debugging

Prompt quality directly affects model output.

Example

```text
Prompt

↓

Ambiguous

↓

Poor Response
```

Typical Issues

- Missing context
- Ambiguous instructions
- Excessively long prompts
- Poor formatting
- Missing system prompts

Debugging focuses on improving prompt clarity and completeness.

---

# 2. Tool Debugging

Agents frequently invoke external tools.

```text
LLM

↓

Search Tool

↓

Timeout
```

Typical Issues

- Authentication failures
- API timeouts
- Invalid parameters
- Rate limiting
- Network failures

Debugging verifies tool execution and external dependencies.

---

# 3. Memory Debugging

Memory problems often cause inconsistent responses.

```text
Conversation

↓

Memory Store

↓

Missing Context

↓

Wrong Answer
```

Typical Issues

- Missing memories
- Duplicate memories
- Incorrect retrieval
- Context overflow
- Expired memories

Memory debugging validates storage and retrieval behavior.

---

# 4. Workflow Debugging

Multi-agent workflows introduce orchestration issues.

```text
Planner

↓

Developer

↓

Tester

↓

Deployment
```

Typical Issues

- Incorrect routing
- Failed dependencies
- Infinite loops
- Missing workflow state
- Retry failures

Workflow debugging verifies execution order and state transitions.

---

# 5. RAG Debugging

RAG pipelines require debugging across multiple stages.

```text
Question

↓

Retriever

↓

Vector Database

↓

Reranker

↓

LLM
```

Typical Issues

- Empty retrieval
- Low similarity scores
- Wrong documents
- Poor chunking
- Incorrect reranking

RAG debugging determines whether failures originate from retrieval or generation.

---

# Root Cause Analysis (RCA)

Rather than fixing symptoms, enterprise teams identify the underlying cause.

```text
Wrong Response

↓

Investigate

↓

Logs

↓

Traces

↓

Metrics

↓

Root Cause

↓

Permanent Fix
```

RCA reduces recurring incidents and improves long-term reliability.

---

# Debugging Checklist

A systematic checklist speeds up investigations.

```text
Debugging

│

├── Prompt

├── Retrieved Documents

├── Memory

├── Tool Calls

├── Workflow State

├── LLM Response

├── Logs

├── Traces

├── Metrics

└── Infrastructure
```

Following a consistent checklist prevents important steps from being overlooked.

---

# Implementation

## Example 1 – Core Python

Simple exception logging.

```python
import logging

logging.basicConfig(level=logging.INFO)

try:

    raise ValueError("Retriever failed")

except Exception as e:

    logging.error(f"Workflow Error: {e}")
```

Output

```text
ERROR Workflow Error: Retriever failed
```

---

## Example 2 – LangGraph

Monitor workflow state during execution.

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class WorkflowState(TypedDict):
    current_agent: str
    workflow_status: str

workflow = StateGraph(WorkflowState)

workflow.add_node("planner", planner_node)
workflow.add_node("developer", developer_node)
workflow.add_node("tester", tester_node)
```

Inspecting workflow state makes it easier to identify where execution stopped or failed.

---

## Example 3 – Production Example (OpenTelemetry + LangFuse)

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("retriever") as span:

    span.set_attribute("query", "sales report")

    span.set_attribute("documents_found", 0)

    print("Retriever executed")
```

The trace captures valuable debugging information, such as the search query, retrieved document count, execution time, and span status. Combined with platforms like **LangFuse** or **Jaeger**, engineers can quickly identify retrieval failures, latency issues, and incorrect workflow behavior.

---

# Enterprise Use Cases

## Enterprise RAG Assistant

Debugging Retrieval-Augmented Generation (RAG) systems requires visibility into every stage of the retrieval pipeline.

```text
User Question

↓

Query Rewriter

↓

Retriever

↓

Vector Database

↓

Reranker

↓

LLM

↓

Final Response
```

Typical debugging scenarios

- No documents retrieved
- Wrong documents retrieved
- Low similarity scores
- Poor chunking strategy
- Prompt exceeds context window
- Hallucinated response

Debugging focuses on identifying whether the failure originated in retrieval, reranking, or generation.

---

## Customer Support AI

Enterprise customer support agents interact with multiple systems.

```text
Customer

↓

Support Agent

↓

Knowledge Base

↓

CRM Tool

↓

LLM

↓

Response
```

Typical debugging scenarios

- CRM API timeout
- Missing customer data
- Incorrect prompt
- Tool authentication failure
- Hallucinated answer

Debugging combines logs, traces, and workflow state to isolate the failure.

---

## Multi-Agent AI Platform

Large AI platforms coordinate multiple specialized agents.

```text
Planner Agent

↓

Developer Agent

↓

Testing Agent

↓

Deployment Agent
```

Typical debugging scenarios

- Incorrect agent selection
- Workflow stuck
- Infinite execution loop
- Failed dependency
- Retry failure
- Shared state inconsistency

Workflow visualization helps engineers determine exactly where execution stopped.

---

## AI Software Engineering Assistant

AI coding assistants execute long-running workflows.

```text
Developer Request

↓

Planning

↓

Code Generation

↓

Testing

↓

Deployment
```

Typical debugging scenarios

- Generated incorrect code
- Test execution failure
- Tool invocation error
- Deployment failure

Debugging allows engineers to replay workflow execution and inspect every intermediate step.

---

## Financial Services

Financial AI systems require explainable debugging.

```text
Transaction

↓

Fraud Detection

↓

Risk Analysis

↓

Compliance

↓

Decision
```

Typical debugging scenarios

- False fraud detection
- Incorrect risk score
- Compliance rejection
- Missing customer history

Every decision must be traceable for auditing and regulatory compliance.

---

# Production Insight

Enterprise AI debugging extends beyond application code.

Traditional debugging

```text
Application

↓

Stack Trace

↓

Fix
```

Enterprise AI debugging

```text
Prompt

↓

Memory

↓

Retriever

↓

Vector Database

↓

LLM

↓

Tool Calls

↓

Workflow

↓

Infrastructure

↓

Root Cause
```

Production debugging requires combining information from

- Logs
- Traces
- Metrics
- Workflow state
- Prompt history
- Retrieved context
- Tool execution
- Infrastructure telemetry

This provides a complete picture of AI execution.

---

# Replay Debugging

One of the biggest advantages of AI systems is the ability to replay workflows.

```text
Production Request

↓

Recorded Trace

↓

Replay Workflow

↓

Inspect Every Step

↓

Identify Root Cause
```

Replay debugging enables engineers to reproduce production issues without impacting live users.

---

# Architecture Decision

| Debugging Requirement | Recommended Tool |
|-----------------------|------------------|
| Application Errors | Python Logging |
| Workflow Debugging | LangGraph |
| Prompt Debugging | LangSmith |
| LLM Execution | LangFuse |
| Distributed Debugging | OpenTelemetry |
| Trace Visualization | Jaeger / Grafana Tempo |
| AI Evaluation | Arize Phoenix |
| Enterprise AI Platform | LangSmith + OpenTelemetry + Grafana |

---

# Advantages

- Faster root cause analysis
- Better AI quality
- Reduced downtime
- Easier incident investigation
- Faster production recovery
- Better workflow visibility
- Improved customer experience
- Continuous AI improvement

---

# Limitations

- Complex distributed workflows
- Large telemetry volume
- Difficult prompt reproduction
- External dependency failures
- High observability infrastructure cost
- Requires comprehensive instrumentation

---

# Best Practices

- Debug the complete workflow, not just the LLM.
- Capture prompts, retrieved context, and model responses.
- Record workflow state transitions.
- Use correlation IDs across all services.
- Replay failed executions whenever possible.
- Perform Root Cause Analysis instead of fixing symptoms.
- Combine logs, traces, and metrics for investigations.
- Validate fixes with representative production scenarios.

---

# Common Mistakes

❌ Assuming every incorrect answer is an LLM problem

❌ Ignoring retrieval quality

❌ Not checking tool execution

❌ Debugging only application code

❌ Missing workflow state information

❌ No replay capability

❌ Ignoring infrastructure issues

❌ Fixing symptoms instead of root causes

---

# Framework Comparison

| Framework | Debugging Support |
|-----------|-------------------|
| **LangGraph** | Workflow state inspection |
| **LangSmith** | Prompt, trace, and execution replay |
| **LangFuse** | Prompt & LLM debugging |
| **OpenTelemetry** | Distributed debugging |
| **Jaeger** | Trace visualization |
| **Grafana Tempo** | Distributed tracing |
| **Arize Phoenix** | LLM evaluation & debugging |
| **CrewAI** | Multi-agent execution logs |
| **OpenAI Agents SDK** | Agent execution events |

---

# Interview Questions

### What is Agent Debugging?

### How is AI debugging different from traditional software debugging?

### What are the most common AI agent failures?

### How do you debug a Retrieval-Augmented Generation (RAG) pipeline?

### Why is workflow state important during debugging?

### What is Root Cause Analysis (RCA)?

### What is replay debugging?

### Which observability pillars are used during debugging?

### Why shouldn't engineers immediately blame the LLM?

### Which tools are commonly used for enterprise AI debugging?

---

# Quick Revision

```text
                 AI Workflow
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
   Prompt         Memory          Retriever
      │               │                │
      ▼               ▼                ▼
     LLM         Tool Calls      Workflow
      │               │                │
      └───────────────┼────────────────┘
                      ▼
             Debugging Layer
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
    Logs           Traces         Metrics
                      │
                      ▼
            Root Cause Analysis
                      │
                      ▼
                 Replay & Fix
```

---

# Key Takeaways

- Agent Debugging is the systematic process of diagnosing and resolving failures across prompts, memory, retrieval, LLMs, tools, workflows, and infrastructure.
- Unlike traditional debugging, AI debugging requires inspecting prompt construction, retrieved context, reasoning flow, tool execution, and workflow state in addition to application code.
- Enterprise AI teams combine **logs**, **traces**, **metrics**, workflow visualization, and replay debugging to identify root causes quickly.
- Root Cause Analysis (RCA) focuses on eliminating the underlying cause of failures instead of repeatedly fixing symptoms.
- Modern AI debugging platforms such as **LangSmith**, **LangFuse**, **OpenTelemetry**, **Jaeger**, and **Arize Phoenix** significantly improve troubleshooting and production reliability.

---

# References

- LangGraph Documentation
- LangSmith Documentation
- LangFuse Documentation
- OpenTelemetry Documentation
- Jaeger Documentation
- Grafana Tempo Documentation
- Arize Phoenix Documentation
- CrewAI Documentation
- OpenAI Agents SDK Documentation

---

## Next Note

**07-agent-evaluation-metrics.md**

In the next note, we'll explore **Agent Evaluation Metrics**, including offline evaluation, online evaluation, benchmark datasets, LLM evaluation metrics, RAG evaluation, agent success metrics, human evaluation, automated evaluation frameworks, LLM-as-a-Judge, and production evaluation platforms such as LangSmith, Ragas, DeepEval, Arize Phoenix, and TruLens.
