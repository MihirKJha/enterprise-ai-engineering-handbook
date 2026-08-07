# 03. Agent Tracing

> **Category:** Agent Observability
> **Module:** AI Agents
> **Prerequisites:** Agent Observability Overview, Agent Logging
> **Difficulty:** Intermediate

> **Note:** Agent Tracing follows an AI request throughout its entire execution lifecycle. Unlike logs, which record individual events, tracing connects all operations into a single execution path, allowing engineers to understand how requests flow through multiple agents, LLMs, tools, databases, retrievers, and external services. Distributed tracing is essential for debugging complex enterprise AI systems.

---

# Overview

Imagine an enterprise AI assistant answering a customer's question.

```text
User

↓

Planner Agent

↓

Retriever

↓

Vector Database

↓

LLM

↓

CRM Tool

↓

Response
```

The user reports:

> "The response took 18 seconds."

Where was the delay?

- Planner?
- Retriever?
- Vector DB?
- LLM?
- CRM API?

Logs show what happened, but not **how the request flowed**.

Tracing connects every operation into one execution timeline.

---

# Why Agent Tracing Matters

Without Tracing

```text
User

↓

AI Agent

↓

❌ Slow Response
```

Questions remain unanswered.

- Which component caused the delay?
- Which tool was slow?
- Which API timed out?
- Which agent retried?
- How long did every step take?

---

With Tracing

```text
User

↓

Planner

↓

Retriever

↓

LLM

↓

Tool

↓

Response

↓

Complete Trace
```

Benefits

- End-to-end visibility
- Performance optimization
- Root cause analysis
- Distributed debugging
- Dependency analysis
- Workflow visualization

---

# What is Agent Tracing?

Tracing follows a request across multiple components.

```text
User Request

↓

Planner

↓

Retriever

↓

Vector DB

↓

LLM

↓

Calculator Tool

↓

Response
```

Every operation belongs to one execution trace.

Unlike logging,

- Logs answer **What happened?**
- Traces answer **Where did it happen?**

---

# Logs vs Traces

| Logs | Traces |
|------|---------|
| Individual events | Complete request flow |
| Chronological records | Parent-child execution |
| Useful for debugging | Useful for performance analysis |
| Component focused | Request focused |
| Independent entries | Connected operations |

Example

Logs

```text
Planner Started

Retriever Started

Retriever Finished

LLM Started

LLM Finished
```

Trace

```text
User Request

↓

Planner

↓

Retriever

↓

LLM

↓

Response
```

Tracing connects every step into a single execution graph.

---

# High-Level Architecture

```text
                    User Request
                          │
                          ▼
                    Planner Agent
                          │
                          ▼
                    Retriever Agent
                          │
                          ▼
                    Vector Database
                          │
                          ▼
                         LLM
                          │
                          ▼
                     External Tool
                          │
                          ▼
                       Response
                          │
                          ▼
                 Distributed Trace
                          │
                          ▼
                 Jaeger / Tempo /
                   LangSmith UI
```

The distributed trace captures the complete request path.

---

# Core Concepts

Enterprise tracing relies on several key concepts.

```text
Tracing

│

├── Trace

├── Span

├── Parent Span

├── Child Span

├── Context Propagation

└── Trace ID
```

Understanding these concepts is fundamental to distributed observability.

---

# What is a Trace?

A **Trace** represents the complete lifecycle of a single request.

```text
User Request

↓

Planner

↓

Retriever

↓

LLM

↓

Tool

↓

Response
```

Everything belongs to one Trace.

Example

```text
Trace ID

TRACE-102938
```

Every component involved shares the same Trace ID.

---

# What is a Span?

A **Span** represents one operation inside a trace.

```text
Trace

│

├── Planner Span

├── Retriever Span

├── LLM Span

├── Tool Span
```

Each span records

- Start time
- End time
- Duration
- Status
- Metadata

---

# Parent and Child Spans

Spans are organized hierarchically.

```text
User Request
      │
      ▼
Planner Span
      │
 ┌────┴──────────────┐
 ▼                   ▼
Retriever Span   LLM Span
                      │
                      ▼
                Tool Span
```

This hierarchy makes complex workflows easy to understand.

---

# Trace Lifecycle

A production trace follows this lifecycle.

```text
Request Received

↓

Create Trace

↓

Create Parent Span

↓

Create Child Spans

↓

Collect Metadata

↓

Complete Trace

↓

Store Trace

↓

Visualize
```

The completed trace becomes available for debugging and performance analysis.

---

# Context Propagation

As a request moves across services, tracing information travels with it.

```text
Planner

↓

Trace Context

↓

Retriever

↓

Trace Context

↓

LLM

↓

Trace Context

↓

Tool
```

Without context propagation, the execution would appear as separate traces rather than one connected workflow.

---

# Distributed Tracing

Modern AI systems consist of multiple distributed components.

```text
              User Request
                    │
                    ▼
             API Gateway
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
 Planner      Retriever       LLM
        │           │            │
        ▼           ▼            ▼
 Vector DB     Cache      External API
```

Distributed tracing connects all these services into one execution timeline.

---

# What Should Be Traced?

Enterprise AI platforms typically trace the following.

```text
Tracing

│

├── User Requests

├── Agent Execution

├── Memory Retrieval

├── Vector Search

├── LLM Calls

├── Prompt Construction

├── Tool Execution

├── Database Queries

├── External APIs

├── Retry Attempts

├── Errors

└── Final Response
```

Tracing should capture every significant workflow step.

---

# Implementation

## Example 1 – Core Python

A simple trace implementation.

```python
import uuid

trace_id = str(uuid.uuid4())

print(f"Trace Started: {trace_id}")

print("Planner Span")

print("Retriever Span")

print("LLM Span")

print("Trace Completed")
```

Output

```text
Trace Started: 5b87...

Planner Span

Retriever Span

LLM Span

Trace Completed
```

This demonstrates the concept of grouping multiple operations under a single Trace ID.

---

## Example 2 – LangSmith Tracing

LangSmith automatically captures traces for LangChain and LangGraph applications.

```python
from langsmith import traceable

@traceable
def generate_response(question):

    return llm.invoke(question)
```

Every invocation is recorded as a trace, including prompts, model calls, execution time, tool usage, and intermediate steps, making workflow analysis much easier.

---

## Example 3 – Production Example (OpenTelemetry)

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("planner"):

    with tracer.start_as_current_span("retriever"):

        print("Searching documents...")

    with tracer.start_as_current_span("llm"):

        print("Calling LLM...")
```

Each `start_as_current_span()` creates a child span within the same distributed trace. Visualization tools such as **Jaeger**, **Tempo**, or **Grafana** display these parent-child relationships, helping engineers identify latency bottlenecks and failures across the entire AI workflow.

---

# Enterprise Use Cases

## Enterprise RAG Assistant

Tracing is essential for understanding how a user query flows through a Retrieval-Augmented Generation (RAG) pipeline.

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

A trace records:

- Query rewrite latency
- Retrieval latency
- Number of retrieved documents
- Reranking duration
- LLM inference time
- Overall response latency

This helps engineers quickly identify bottlenecks and optimize retrieval quality.

---

## Customer Support AI

Customer support agents often invoke multiple enterprise services.

```text
Customer

↓

Support Agent

↓

Knowledge Base

↓

CRM System

↓

LLM

↓

Response
```

Tracing captures:

- CRM API latency
- Knowledge retrieval time
- LLM execution duration
- Tool failures
- End-to-end response time

If a customer experiences delays, engineers can determine exactly where time was spent.

---

## Multi-Agent Workflow

Enterprise AI platforms coordinate multiple specialized agents.

```text
User

↓

Planner Agent

↓

Developer Agent

↓

Testing Agent

↓

Documentation Agent

↓

Deployment Agent
```

Tracing records:

- Agent execution order
- Agent latency
- Task routing
- Retry attempts
- Workflow completion time

This provides complete visibility into complex multi-agent executions.

---

## Enterprise Document Processing

Document processing workflows involve several AI components.

```text
PDF Upload

↓

OCR

↓

Classification

↓

Information Extraction

↓

Validation

↓

Storage
```

Tracing helps identify:

- OCR bottlenecks
- Slow extraction
- Validation failures
- Overall processing latency

---

## Financial Services

Financial AI systems require complete request traceability.

```text
Transaction

↓

Fraud Detection

↓

Risk Assessment

↓

Compliance Validation

↓

Decision
```

Tracing enables auditors and engineers to reconstruct every step involved in a financial decision.

---

# Production Insight

Enterprise AI tracing extends traditional distributed tracing by instrumenting AI-specific workflow stages.

```text
                   AI Request
                        │
                        ▼
                 API Gateway
                        │
      ┌─────────────────┼──────────────────┐
      ▼                 ▼                  ▼
   Retriever        Vector DB            LLM
      │                 │                  │
      ▼                 ▼                  ▼
 Tool Calling      Memory Store      External APIs
      │                 │                  │
      └─────────────────┼──────────────────┘
                        ▼
               OpenTelemetry Trace
                        │
                        ▼
              Jaeger / Tempo / Grafana
```

Unlike traditional applications, AI traces should include:

- Prompt generation
- Context retrieval
- Memory operations
- Tool execution
- Model inference
- Token generation
- Agent reasoning
- Final response

This provides complete visibility into AI workflows.

---

# Trace Visualization

Tracing platforms visualize execution as hierarchical spans.

```text
Trace ID: TRACE-501

Planner Span (180 ms)

├── Retriever Span (320 ms)

│      ├── Vector Search (150 ms)

│      └── Reranker (90 ms)

├── LLM Span (1800 ms)

│      ├── Prompt Build (50 ms)

│      └── Model Inference (1750 ms)

└── Tool Span (410 ms)
```

From this visualization, it is immediately clear that **LLM inference** is the primary contributor to response latency.

---

# Context Propagation

Every service involved in processing a request should propagate tracing information.

```text
User Request

↓

Trace ID

↓

Planner

↓

Retriever

↓

LLM

↓

Tool

↓

Database

↓

Response
```

Without context propagation, each component generates isolated traces, making end-to-end debugging impossible.

---

# Architecture Decision

| Requirement | Recommended Solution |
|-------------|----------------------|
| Local tracing | OpenTelemetry SDK |
| Distributed tracing | OpenTelemetry |
| Trace Visualization | Jaeger |
| Cloud-native tracing | Grafana Tempo |
| LangChain Applications | LangSmith |
| Multi-Agent AI | LangGraph + LangSmith |
| Enterprise AI Platform | OpenTelemetry + Jaeger + Grafana |

---

# Advantages

- End-to-end request visibility
- Faster root cause analysis
- Latency optimization
- Easier distributed debugging
- Better dependency analysis
- Workflow visualization
- Improved production reliability
- Enhanced observability

---

# Limitations

- Additional infrastructure
- Increased telemetry storage
- Context propagation complexity
- Trace sampling decisions
- Performance overhead
- More operational monitoring

---

# Best Practices

- Create one Trace ID per user request.
- Instrument every significant workflow step.
- Propagate Trace Context across services.
- Trace all LLM calls, tool executions, and memory operations.
- Add meaningful span names.
- Record latency, status, and metadata for each span.
- Sample traces intelligently in high-throughput systems.
- Integrate traces with logs and metrics for complete observability.

---

# Common Mistakes

❌ Tracing only API requests

❌ Missing Trace Context propagation

❌ Creating excessively large spans

❌ Ignoring external API calls

❌ Not tracing LLM inference

❌ No integration with logs

❌ Tracing every internal function call

❌ No sampling strategy for production workloads

---

# Framework Comparison

| Framework | Tracing Support |
|-----------|-----------------|
| **OpenTelemetry** | Standard distributed tracing |
| **Jaeger** | Trace storage & visualization |
| **Grafana Tempo** | Scalable distributed tracing |
| **LangSmith** | LangChain & LangGraph execution traces |
| **LangFuse** | Prompt, trace, and LLM observability |
| **Arize Phoenix** | AI workflow tracing & evaluation |
| **LangGraph** | Workflow state transitions |
| **OpenAI Agents SDK** | Agent execution events |

---

# Interview Questions

### What is Agent Tracing?

### How does tracing differ from logging?

### What is a Trace?

### What is a Span?

### What is the relationship between parent and child spans?

### Why is Context Propagation important?

### What information should be captured in AI traces?

### Why is distributed tracing essential for multi-agent systems?

### What is the role of OpenTelemetry?

### How do LangSmith and Jaeger differ?

---

# Quick Revision

```text
                 User Request
                      │
                      ▼
                 Trace Created
                      │
                      ▼
                Planner Span
                      │
          ┌───────────┼────────────┐
          ▼           ▼            ▼
 Retriever Span   LLM Span   Tool Span
          │           │            │
          ▼           ▼            ▼
    Vector DB    Prompt Build   External API
          │           │            │
          └───────────┼────────────┘
                      ▼
              Complete Trace
                      │
                      ▼
          OpenTelemetry Collector
                      │
                      ▼
           Jaeger / Tempo / Grafana
```

---

# Key Takeaways

- Agent Tracing provides end-to-end visibility into AI request execution across agents, retrievers, vector databases, LLMs, tools, APIs, and databases.
- A **Trace** represents the complete lifecycle of a request, while **Spans** represent individual operations within that request.
- Context propagation ensures that every distributed component participates in the same trace, enabling accurate workflow reconstruction.
- Enterprise AI platforms use OpenTelemetry, Jaeger, Grafana Tempo, LangSmith, and LangFuse to visualize distributed AI workflows and identify performance bottlenecks.
- Combining **traces**, **logs**, and **metrics** provides comprehensive observability, enabling faster debugging, improved performance, and reliable production AI operations.

---

# References

- OpenTelemetry Documentation
- Jaeger Documentation
- Grafana Tempo Documentation
- LangSmith Documentation
- LangFuse Documentation
- Arize Phoenix Documentation
- LangGraph Documentation
- OpenAI Agents SDK Documentation

---

## Next Note

**04-agent-monitoring.md**

In the next note, you'll explore **Agent Monitoring**, where you'll learn how to continuously monitor AI agents in production. Topics include health checks, service availability, latency monitoring, workflow monitoring, LLM health, tool monitoring, RAG monitoring, dashboards, SLIs, SLOs, and production monitoring architectures using Prometheus, Grafana, CloudWatch, Azure Monitor, Google Cloud Monitoring, and AI-native monitoring platforms.