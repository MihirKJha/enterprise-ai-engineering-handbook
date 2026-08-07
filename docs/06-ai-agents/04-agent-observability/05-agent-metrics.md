# 05. Agent Metrics

> **Category:** Agent Observability
> **Module:** AI Agents
> **Prerequisites:** Agent Observability Overview, Agent Logging, Agent Tracing, Agent Monitoring
> **Difficulty:** Intermediate

> **Note:** Agent Metrics are quantitative measurements that describe the health, performance, efficiency, reliability, and business impact of AI agents. Unlike logs and traces, metrics provide aggregated numerical data that helps engineers monitor trends, detect anomalies, measure SLAs, and optimize enterprise AI systems.

---

# Overview

Imagine your AI Customer Support Agent serves thousands of users daily.

```text
Customer

↓

AI Agent

↓

LLM

↓

Tools

↓

Response
```

The system appears healthy.

But management asks:

- How many requests are processed every minute?
- What's the average response time?
- Which agent is the slowest?
- How much are LLM calls costing?
- Are customers receiving successful responses?

Logs cannot easily answer these questions.

Instead, we measure them using **Metrics**.

```text
AI Agent

↓

Collect Metrics

↓

Dashboard

↓

Analyze

↓

Optimize
```

Metrics transform raw execution data into meaningful business and operational insights.

---

# Why Agent Metrics Matter

Without Metrics

```text
AI Agent

↓

Unknown Performance
```

Problems

- No performance visibility
- Unknown request volume
- Difficult capacity planning
- Hidden cost growth
- Poor SLA tracking

---

With Metrics

```text
AI Agent

↓

Metrics

↓

Dashboard

↓

Trend Analysis

↓

Optimization
```

Benefits

- Performance measurement
- Capacity planning
- Cost optimization
- SLA reporting
- Trend analysis
- Proactive scaling

---

# Metrics vs Logs vs Traces

Each observability pillar serves a unique purpose.

| Capability | Primary Question | Example |
|------------|------------------|---------|
| **Logs** | What happened? | Tool execution failed |
| **Traces** | Where did it happen? | LLM span took 2.5 seconds |
| **Metrics** | How well is the system performing? | Average latency = 1.8 sec |

Metrics summarize system behavior over time.

---

# High-Level Architecture

```text
                 AI Platform
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
  AI Agents      LLM Gateway      Tool APIs
      │               │                │
      └───────────────┼────────────────┘
                      ▼
              Metrics Collector
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 Counters        Gauges         Histograms
                      │
                      ▼
                 Prometheus
                      │
                      ▼
                   Grafana
```

Metrics are continuously collected and visualized for operational monitoring.

---

# Metrics Lifecycle

Metrics follow a continuous collection cycle.

```text
Collect Metric

↓

Store

↓

Aggregate

↓

Visualize

↓

Analyze

↓

Optimize
```

Unlike logs, metrics are aggregated over time.

---

# Types of Agent Metrics

Enterprise AI platforms collect multiple categories of metrics.

```text
Agent Metrics

│

├── System Metrics

├── Application Metrics

├── AI Metrics

├── Business Metrics

└── Cost Metrics
```

Each category provides a different perspective on system performance.

---

# 1. System Metrics

Measure infrastructure health.

Examples

```text
CPU Usage

Memory Usage

Disk Usage

Network Traffic

Container Health
```

Typical Uses

- Infrastructure monitoring
- Capacity planning
- Auto scaling

---

# 2. Application Metrics

Measure application performance.

Examples

```text
Requests/sec

Latency

Error Rate

Success Rate

Concurrent Requests
```

Typical Uses

- API monitoring
- Service performance
- Reliability analysis

---

# 3. AI Metrics

Measure AI-specific performance.

Examples

```text
Prompt Latency

LLM Latency

Tool Latency

Memory Retrieval Time

Workflow Duration
```

Typical Uses

- AI optimization
- Workflow analysis
- Model performance

---

# 4. Business Metrics

Measure business outcomes.

Examples

```text
Customer Satisfaction

Task Completion Rate

Automation Rate

Revenue Impact

Conversion Rate
```

Typical Uses

- Executive dashboards
- Business reporting
- ROI analysis

---

# 5. Cost Metrics

Measure AI operational costs.

Examples

```text
Token Cost

Model Cost

API Cost

GPU Cost

Infrastructure Cost
```

Typical Uses

- Cost optimization
- Budget tracking
- Resource planning

---

# RED Monitoring Model

The RED model is widely used for monitoring APIs and AI services.

```text
RED

│

├── Rate

├── Errors

└── Duration
```

### Rate

```text
Requests

↓

350/sec
```

Measures throughput.

---

### Errors

```text
Error Rate

↓

1.4%
```

Measures failed requests.

---

### Duration

```text
Average Latency

↓

1.8 sec
```

Measures response time.

The RED model is ideal for monitoring AI APIs and inference services.

---

# USE Monitoring Model

The USE model focuses on infrastructure resources.

```text
USE

│

├── Utilization

├── Saturation

└── Errors
```

### Utilization

Measures how busy a resource is.

Example

```text
CPU

↓

72%
```

---

### Saturation

Measures resource demand.

Example

```text
GPU Queue

↓

42 Waiting Jobs
```

---

### Errors

Measures infrastructure failures.

Example

```text
Disk Errors

↓

2/min
```

USE is commonly applied to GPUs, vector databases, Kubernetes clusters, and AI infrastructure.

---

# Choosing the Right Metrics

| Component | Recommended Metrics |
|-----------|---------------------|
| API Gateway | RED |
| LLM Gateway | RED + Token Metrics |
| GPU Cluster | USE |
| Vector Database | Latency + Throughput |
| AI Workflow | Success Rate + Duration |
| Tool APIs | Latency + Error Rate |
| Enterprise Dashboard | Business KPIs |

---

# Implementation

## Example 1 – Core Python

A simple request counter.

```python
request_count = 0

def process_request():

    global request_count

    request_count += 1

    print(f"Requests: {request_count}")

process_request()
process_request()
```

Output

```text
Requests: 1

Requests: 2
```

This demonstrates a basic counter that tracks processed requests.

---

## Example 2 – LangGraph Workflow Metrics

Track workflow execution metrics.

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class WorkflowState(TypedDict):
    completed_tasks: int
    workflow_status: str

workflow = StateGraph(WorkflowState)

workflow.add_node("planner", planner_node)
workflow.add_node("developer", developer_node)
workflow.add_node("tester", tester_node)
```

Workflow state can be used to calculate metrics such as task completion rate, workflow duration, and agent utilization.

---

## Example 3 – Production Example (Prometheus)

Expose request metrics for Prometheus.

```python
from prometheus_client import Counter, Histogram, start_http_server

request_counter = Counter(
    "agent_requests_total",
    "Total AI Agent Requests"
)

request_latency = Histogram(
    "agent_request_latency_seconds",
    "AI Agent Request Latency"
)

start_http_server(8000)

request_counter.inc()

with request_latency.time():

    print("Processing AI request...")
```

Prometheus scrapes these metrics periodically, while Grafana visualizes request volume and latency trends, helping engineers detect performance regressions and capacity issues.

---

# Enterprise Use Cases

## Customer Support AI

Enterprise customer support platforms rely on metrics to measure service quality.

```text
Customer

↓

Support Agent

↓

Retriever

↓

LLM

↓

CRM Tool

↓

Response
```

Typical metrics

- Requests per minute
- Average response time
- First response time
- Success rate
- Escalation rate
- Customer satisfaction score
- Tool failure rate

These metrics help engineering teams and business stakeholders evaluate both system performance and customer experience.

---

## Enterprise RAG Assistant

Production RAG systems expose AI-specific metrics.

```text
User Query

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

Final Answer
```

Typical metrics

- Retrieval latency
- Retrieved document count
- Retrieval success rate
- Empty retrieval rate
- Reranking latency
- Context size
- LLM latency
- End-to-end latency

These metrics identify bottlenecks in the retrieval pipeline.

---

## Multi-Agent AI Platform

Enterprise multi-agent systems generate workflow metrics.

```text
Planner Agent

↓

Developer Agent

↓

Testing Agent

↓

Deployment Agent
```

Typical metrics

- Active workflows
- Completed workflows
- Failed workflows
- Average workflow duration
- Retry count
- Agent utilization
- Queue length

These metrics help optimize agent scheduling and workload distribution.

---

## Financial Services

Financial AI platforms require business and operational metrics.

```text
Transaction

↓

Fraud Agent

↓

Risk Agent

↓

Compliance Agent

↓

Decision
```

Typical metrics

- Fraud detection accuracy
- Decision latency
- Transaction throughput
- False positive rate
- Approval rate
- Compliance violations

These metrics are critical for regulatory reporting and operational excellence.

---

## AI Software Engineering Platform

AI coding assistants monitor engineering productivity.

```text
Developer

↓

Planning Agent

↓

Coding Agent

↓

Testing Agent

↓

Deployment Agent
```

Typical metrics

- Tasks completed
- Code generation time
- Test success rate
- Deployment success rate
- Average workflow duration
- Token consumption

These metrics help improve development efficiency.

---

# Production Insight

Traditional software focuses mainly on infrastructure metrics.

```text
CPU

Memory

Disk

Network
```

Enterprise AI systems require **AI-native metrics**.

```text
Infrastructure Metrics

+

LLM Metrics

+

Prompt Metrics

+

RAG Metrics

+

Workflow Metrics

+

Business Metrics

+

Cost Metrics
```

Successful AI platforms combine all these metric categories into a unified monitoring strategy.

---

# Types of Prometheus Metrics

Prometheus provides four primary metric types.

---

## Counter

A value that only increases.

Examples

```text
Total Requests

Total Errors

Total Tokens
```

Typical Uses

- Request count
- API calls
- Workflow executions

---

## Gauge

A value that can increase or decrease.

Examples

```text
Active Agents

Queue Size

GPU Utilization
```

Typical Uses

- Resource monitoring
- Current system state

---

## Histogram

Measures value distribution.

Examples

```text
Request Latency

Tool Latency

LLM Inference Time
```

Typical Uses

- Latency analysis
- Percentile calculation

---

## Summary

Calculates statistical summaries.

Examples

```text
95th Percentile

99th Percentile
```

Typical Uses

- Response time analysis
- SLA reporting

---

# Enterprise AI Metrics Dashboard

A production dashboard typically displays

```text
AI Dashboard

│

├── Active Requests

├── Requests/sec

├── Success Rate

├── Error Rate

├── Workflow Duration

├── Agent Utilization

├── LLM Latency

├── Token Usage

├── Cost

├── GPU Utilization

└── Customer Satisfaction
```

Operations teams use these dashboards to monitor both technical health and business outcomes.

---

# Architecture Decision

| Requirement | Recommended Metric Type |
|-------------|-------------------------|
| Request Count | Counter |
| Active Agents | Gauge |
| Response Time | Histogram |
| SLA Reporting | Summary |
| Token Usage | Counter |
| Workflow Queue | Gauge |
| Cost Tracking | Counter + Gauge |
| Enterprise AI Dashboard | Mixed Metric Types |

---

# Advantages

- Quantifiable performance measurement
- Capacity planning
- SLA monitoring
- Trend analysis
- Cost optimization
- Auto-scaling support
- Executive reporting
- Performance benchmarking

---

# Limitations

- Metrics lose detailed context
- Large numbers of metrics increase storage requirements
- Poor metric design creates dashboard noise
- Historical aggregation may hide individual failures
- Requires meaningful thresholds and alerts

---

# Best Practices

- Measure business value, not just infrastructure.
- Define clear KPIs for every AI workflow.
- Track both average and percentile latency (P95, P99).
- Separate infrastructure, application, and AI metrics.
- Keep metric names consistent.
- Label metrics appropriately (agent, model, workflow).
- Continuously review unused metrics.
- Combine metrics with logs and traces for complete observability.

---

# Common Mistakes

❌ Measuring only CPU and memory

❌ Tracking hundreds of unused metrics

❌ Ignoring business KPIs

❌ Using inconsistent metric names

❌ Not monitoring token consumption

❌ No latency percentile tracking

❌ No workflow-level metrics

❌ Looking at averages without P95/P99 latency

---

# Framework Comparison

| Framework | Metrics Support |
|-----------|-----------------|
| **Prometheus** | Metrics collection |
| **Grafana** | Metrics visualization |
| **OpenTelemetry** | Metrics instrumentation |
| **Micrometer** | JVM & Spring Boot metrics |
| **LangSmith** | LLM workflow metrics |
| **LangFuse** | AI & prompt metrics |
| **Arize Phoenix** | LLM evaluation metrics |
| **CloudWatch** | AWS metrics |
| **Azure Monitor** | Azure metrics |
| **Google Cloud Monitoring** | GCP metrics |

---

# Interview Questions

### What are Agent Metrics?

### How are metrics different from logs and traces?

### What are the different categories of AI metrics?

### What is the RED monitoring model?

### What is the USE monitoring model?

### What is the difference between Counter, Gauge, Histogram, and Summary?

### Which AI-specific metrics should every enterprise platform monitor?

### Why is P95 latency more useful than average latency?

### Why should business metrics be monitored alongside technical metrics?

### How do Prometheus and Grafana work together?

---

# Quick Revision

```text
                 AI Platform
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 AI Agents      LLM Gateway      Tool APIs
      │               │                │
      └───────────────┼────────────────┘
                      ▼
             Metrics Collection
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
  Counters        Gauges        Histograms
                      │
                      ▼
                 Prometheus
                      │
                      ▼
                   Grafana
                      │
                      ▼
                 AI Dashboard
```

---

# Key Takeaways

- Agent Metrics provide quantitative insights into the health, performance, efficiency, reliability, cost, and business impact of AI systems.
- Enterprise AI platforms monitor **system metrics, application metrics, AI-specific metrics, business KPIs, and cost metrics** to gain a complete operational view.
- The **RED (Rate, Errors, Duration)** and **USE (Utilization, Saturation, Errors)** models are widely used to monitor AI services and supporting infrastructure.
- Prometheus metric types—**Counter**, **Gauge**, **Histogram**, and **Summary**—serve different monitoring purposes and should be selected based on the nature of the data being measured.
- Combining metrics with logs and traces enables comprehensive observability, supporting capacity planning, SLA compliance, performance optimization, and data-driven decision-making.

---

# References

- Prometheus Documentation
- Grafana Documentation
- OpenTelemetry Metrics Documentation
- Micrometer Documentation
- LangSmith Documentation
- LangFuse Documentation
- Arize Phoenix Documentation
- AWS CloudWatch Documentation
- Azure Monitor Documentation
- Google Cloud Monitoring Documentation

---

## Next Note

**06-agent-debugging.md**

In the next note, we'll explore **Agent Debugging**, where you'll learn systematic techniques for diagnosing AI agent failures. Topics include prompt debugging, tool debugging, workflow debugging, memory debugging, RAG debugging, hallucination analysis, reasoning inspection, breakpoint debugging, replay debugging, root cause analysis, and production debugging workflows using LangSmith, LangFuse, OpenTelemetry, and enterprise observability platforms.