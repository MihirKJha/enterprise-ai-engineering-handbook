# 04. Agent Monitoring

> **Category:** Agent Observability
> **Module:** AI Agents
> **Prerequisites:** Agent Observability Overview, Agent Logging, Agent Tracing
> **Difficulty:** Intermediate

> **Note:** Agent Monitoring is the continuous observation of AI agents and their supporting infrastructure to ensure they remain healthy, performant, reliable, and available in production. Monitoring focuses on **real-time system health**, enabling engineers to detect problems, measure service quality, and proactively respond before users are affected.

---

# Overview

Imagine deploying an enterprise AI Customer Support Agent.

Initially everything works perfectly.

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

After a few days, users start reporting problems.

Examples

- Slow responses
- High API latency
- Tool failures
- Rising token costs
- Increased hallucinations
- Frequent workflow failures

Without monitoring, engineers only discover issues after customers complain.

Instead, production AI systems continuously monitor their health.

```text
AI Agent

↓

Metrics

↓

Dashboard

↓

Alerts

↓

Engineer
```

This enables proactive maintenance instead of reactive troubleshooting.

---

# Why Agent Monitoring Matters

Without Monitoring

```text
AI Agent

↓

Production Failure

↓

Customer Complaint
```

Problems

- Unknown outages
- Poor user experience
- SLA violations
- Expensive incidents
- Slow recovery

---

With Monitoring

```text
AI Agent

↓

Monitoring Platform

↓

Dashboard

↓

Alert

↓

Engineer
```

Benefits

- Early issue detection
- Better availability
- Faster recovery
- SLA compliance
- Performance optimization
- Improved reliability

---

# Monitoring vs Logging vs Tracing

These observability pillars serve different purposes.

| Capability | Primary Question | Example |
|------------|------------------|---------|
| **Logging** | What happened? | Tool timeout |
| **Tracing** | Where did it happen? | LLM span took 2.3 seconds |
| **Monitoring** | Is the system healthy right now? | Error rate increased to 12% |

Monitoring provides a real-time operational view, while logs and traces support investigation.

---

# High-Level Architecture

```text
                  User Requests
                        │
                        ▼
                  AI Agent Platform
                        │
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
   Memory             LLM Calls        Tool Calls
      │                 │                 │
      └─────────────────┼─────────────────┘
                        ▼
               Monitoring Collector
                        │
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
   Metrics         Health Checks      Alerts
                        │
                        ▼
             Prometheus / CloudWatch
                        │
                        ▼
                   Grafana Dashboard
```

Monitoring continuously collects operational metrics from every component of the AI platform.

---

# Monitoring Lifecycle

Production monitoring follows a continuous feedback loop.

```text
Collect Metrics

↓

Evaluate Health

↓

Detect Problems

↓

Generate Alerts

↓

Engineer Response

↓

System Recovery

↓

Continue Monitoring
```

Monitoring never stops while the application is running.

---

# What Should Be Monitored?

Enterprise AI systems monitor far more than server health.

```text
Monitoring

│

├── Agent Health

├── Workflow Status

├── LLM Performance

├── Memory Retrieval

├── Tool Calls

├── API Latency

├── Token Usage

├── Infrastructure

├── Errors

├── Cost

└── User Experience
```

Each component contributes to overall service quality.

---

# Agent Health Monitoring

Every AI agent should expose a health status.

```text
Planner Agent

↓

Healthy
```

```text
Retriever Agent

↓

Healthy
```

```text
LLM Gateway

↓

Warning
```

```text
Vector Database

↓

Healthy
```

Monitoring dashboards aggregate these individual health states into an overall platform status.

---

# Workflow Monitoring

Monitoring should also track workflow execution.

```text
Workflow Started

↓

Planner

↓

Retriever

↓

LLM

↓

Tool

↓

Completed
```

Typical workflow metrics

- Active workflows
- Completed workflows
- Failed workflows
- Average execution time
- Retry count
- Queue length

---

# LLM Monitoring

Enterprise AI applications depend heavily on LLM performance.

Typical metrics

```text
LLM

│

├── Response Time

├── Requests/sec

├── Token Usage

├── Token Cost

├── Error Rate

├── Timeout Rate

└── Model Availability
```

LLM monitoring helps identify degraded model performance before it impacts users.

---

# Tool Monitoring

External tools are frequent sources of production failures.

```text
Search API

↓

Healthy

──────────────

CRM API

↓

Timeout

──────────────

Database

↓

Healthy
```

Typical metrics

- Success rate
- Failure rate
- Latency
- Retry count
- Timeout rate

---

# RAG Monitoring

Enterprise Retrieval-Augmented Generation systems require specialized monitoring.

```text
User Query

↓

Retriever

↓

Vector Database

↓

Reranker

↓

LLM
```

Monitor

- Retrieval latency
- Retrieved document count
- Retrieval success rate
- Reranking latency
- Context size
- Empty retrievals

These metrics directly affect answer quality.

---

# Health Checks

Health checks determine whether components are operational.

Examples

```text
Planner Agent

↓

Healthy
```

```text
Vector Database

↓

Healthy
```

```text
Redis

↓

Healthy
```

```text
OpenAI API

↓

Unavailable
```

Health checks can be

- Liveness Checks
- Readiness Checks
- Dependency Checks

---

# SLIs, SLOs and SLAs

Production monitoring relies on service quality objectives.

---

## Service Level Indicator (SLI)

A measurable metric.

Examples

- Response latency
- Availability
- Error rate
- Success rate

Example

```text
Average Response Time

↓

1.3 sec
```

---

## Service Level Objective (SLO)

The desired target for an SLI.

Example

```text
95%

↓

Requests

↓

< 2 Seconds
```

---

## Service Level Agreement (SLA)

A contractual commitment.

Example

```text
Availability

↓

99.9%
```

Violating an SLA may trigger customer compensation or contractual penalties.

---

# Implementation

## Example 1 – Core Python

Simple health check.

```python
class AgentHealth:

    def check(self):

        return {
            "status": "UP",
            "agent": "PlannerAgent"
        }


health = AgentHealth()

print(health.check())
```

Output

```text
{
    'status': 'UP',
    'agent': 'PlannerAgent'
}
```

---

## Example 2 – LangGraph

Monitor workflow progress using graph state.

```python
from typing import TypedDict
from langgraph.graph import StateGraph

class WorkflowState(TypedDict):
    status: str
    current_agent: str

workflow = StateGraph(WorkflowState)

workflow.add_node("planner", planner_node)
workflow.add_node("developer", developer_node)
workflow.add_node("tester", tester_node)
```

The workflow state can be continuously monitored to determine which agent is currently executing and whether the workflow has completed successfully.

---

## Example 3 – Production Example (Prometheus)

Expose AI agent metrics for Prometheus.

```python
from prometheus_client import Counter, start_http_server

requests = Counter(
    "agent_requests_total",
    "Total AI Agent Requests"
)

start_http_server(8000)

requests.inc()
```

Prometheus periodically scrapes this endpoint, stores the metrics, and enables Grafana dashboards and alerting based on request volume, error rates, or abnormal behavior.

---

# Enterprise Use Cases

## Customer Support AI

Enterprise AI customer support platforms require continuous monitoring to maintain service quality.

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

Typical monitoring metrics

- Request volume
- Response latency
- Tool failures
- LLM latency
- Customer wait time
- Success rate
- Escalation rate

Monitoring dashboards immediately reveal performance degradation before it impacts customers.

---

## Enterprise RAG Assistant

Production RAG systems contain several components that must be monitored independently.

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

Response
```

Typical monitoring metrics

- Retrieval latency
- Empty retrieval rate
- Retrieved chunk count
- Vector database availability
- Reranker latency
- LLM response time
- End-to-end response time

These metrics help engineers identify bottlenecks across the retrieval pipeline.

---

## Multi-Agent AI Platform

Enterprise AI platforms coordinate multiple agents.

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

Monitor

- Active agents
- Agent health
- Workflow completion rate
- Queue length
- Retry count
- Failed workflows
- Average execution time

This enables operations teams to quickly identify unhealthy agents.

---

## Financial Services

Financial AI applications require continuous operational monitoring.

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

Typical monitoring metrics

- Transaction throughput
- Fraud detection latency
- Decision latency
- Error rate
- API availability
- Compliance workflow failures

These metrics ensure regulatory SLAs are maintained.

---

## AI Software Engineering Platform

AI coding assistants execute multiple workflows.

```text
Developer Request

↓

Planning Agent

↓

Coding Agent

↓

Testing Agent

↓

Deployment Agent
```

Monitor

- Workflow duration
- Test success rate
- Deployment success
- Build failures
- Agent availability
- Token usage

Monitoring ensures development pipelines remain reliable.

---

# Production Insight

Monitoring should extend beyond infrastructure.

Traditional monitoring focuses on

```text
CPU

Memory

Disk

Network
```

Enterprise AI monitoring includes

```text
Infrastructure

+

Prompt Health

+

Retriever Health

+

Memory Health

+

Tool Health

+

LLM Health

+

Workflow Health

+

Business Metrics
```

Modern AI platforms combine infrastructure monitoring with AI-specific operational metrics.

---

# Enterprise Monitoring Architecture

```text
                  AI Platform
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
  AI Agents       LLM Gateway      Tool APIs
      │                │                │
      └────────────────┼────────────────┘
                       ▼
             OpenTelemetry Collector
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
 Prometheus      Cloud Monitoring    Logs
      │                │                │
      └────────────────┼────────────────┘
                       ▼
                  Grafana
                       │
                       ▼
                 Alert Manager
```

The monitoring platform continuously collects telemetry and raises alerts when predefined thresholds are exceeded.

---

# Monitoring Dashboard

A production AI dashboard typically displays

```text
AI Dashboard

│

├── Active Requests

├── Active Agents

├── Request Rate

├── Average Latency

├── Error Rate

├── Token Usage

├── LLM Availability

├── Tool Health

├── Workflow Success

├── Cost

└── Alerts
```

Operations teams use these dashboards to assess overall platform health.

---

# Architecture Decision

| Requirement | Recommended Solution |
|-------------|----------------------|
| Metrics Collection | Prometheus |
| Dashboard | Grafana |
| AWS Monitoring | CloudWatch |
| Azure Monitoring | Azure Monitor |
| Google Cloud Monitoring | Cloud Monitoring |
| AI Workflow Monitoring | LangSmith / LangFuse |
| Enterprise AI Platform | OpenTelemetry + Prometheus + Grafana |

---

# Advantages

- Continuous health monitoring
- Early issue detection
- Better SLA compliance
- Reduced downtime
- Improved user experience
- Faster incident response
- Performance optimization
- Cost visibility

---

# Limitations

- Additional infrastructure
- Monitoring overhead
- Large metric volumes
- Dashboard maintenance
- Alert tuning required
- Increased operational complexity

---

# Best Practices

- Monitor every production AI component.
- Define meaningful SLIs and SLOs.
- Monitor business metrics alongside technical metrics.
- Track LLM latency separately from workflow latency.
- Continuously monitor external tool health.
- Build dashboards for engineering and business teams.
- Configure proactive alerts before SLA violations occur.
- Regularly review monitoring thresholds.

---

# Common Mistakes

❌ Monitoring only CPU and memory

❌ Ignoring LLM latency

❌ No monitoring for external tools

❌ Not monitoring retrieval quality

❌ Alerting on every minor event

❌ No business-level dashboards

❌ Missing workflow health monitoring

❌ No historical trend analysis

---

# Framework Comparison

| Framework | Monitoring Support |
|-----------|--------------------|
| **Prometheus** | Metrics collection |
| **Grafana** | Dashboards & visualization |
| **OpenTelemetry** | Metrics instrumentation |
| **CloudWatch** | AWS monitoring |
| **Azure Monitor** | Azure monitoring |
| **Google Cloud Monitoring** | GCP monitoring |
| **LangSmith** | LLM workflow monitoring |
| **LangFuse** | AI observability & monitoring |
| **Arize Phoenix** | AI performance monitoring |

---

# Interview Questions

### What is Agent Monitoring?

### How is monitoring different from logging and tracing?

### What components should be monitored in an AI platform?

### What is the difference between SLI, SLO, and SLA?

### Why is monitoring LLM latency important?

### Which metrics are important for RAG monitoring?

### Why should workflow health be monitored?

### How does Prometheus collect metrics?

### Why is Grafana commonly used with Prometheus?

### Why are AI-specific dashboards necessary?

---

# Quick Revision

```text
                  AI Platform
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
   AI Agents       LLM Gateway      Tool APIs
      │                │                │
      └────────────────┼────────────────┘
                       ▼
             Monitoring Platform
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
   Metrics       Health Checks      Alerts
      │                │                │
      ▼                ▼                ▼
 Prometheus      CloudWatch      AlertManager
                       │
                       ▼
                    Grafana
```

---

# Key Takeaways

- Agent Monitoring continuously evaluates the health, availability, performance, and reliability of AI agents and their supporting infrastructure.
- Unlike logging and tracing, monitoring provides a real-time operational view through metrics, dashboards, health checks, and alerts.
- Enterprise AI monitoring extends beyond infrastructure to include LLM performance, RAG pipelines, memory retrieval, tool health, workflow execution, token usage, and operational costs.
- Production monitoring platforms commonly use **Prometheus**, **Grafana**, **OpenTelemetry**, **CloudWatch**, **Azure Monitor**, and **Google Cloud Monitoring**, often supplemented with AI-native platforms like **LangSmith** and **LangFuse**.
- Effective monitoring enables proactive issue detection, SLA compliance, faster incident response, improved user experience, and reliable production AI operations.

---

# References

- Prometheus Documentation
- Grafana Documentation
- OpenTelemetry Documentation
- AWS CloudWatch Documentation
- Azure Monitor Documentation
- Google Cloud Monitoring Documentation
- LangSmith Documentation
- LangFuse Documentation
- Arize Phoenix Documentation

---

## Next Note

**05-agent-metrics.md**

In the next note, we'll dive deep into **Agent Metrics**, including system metrics, business metrics, AI-specific metrics, LLM metrics, RAG metrics, workflow KPIs, token metrics, latency metrics, success rates, custom Prometheus metrics, and how to design production dashboards that measure both technical performance and business value.