# 26. Observability and Monitoring

> **Category:** Production RAG Patterns  
> **Series:** Enterprise AI Engineering Handbook  
> **Prerequisites:** Production Retrieval Architecture, RAG Evaluation & Benchmarks, Hybrid Search Patterns  
> **Difficulty:** Advanced

> **Note:** This chapter is **not part of the IBM AI Engineering course**. It focuses on observability, monitoring, tracing, logging, and operational best practices for production Retrieval-Augmented Generation (RAG) systems.

---

# Overview

Traditional software monitoring focuses on infrastructure metrics such as CPU utilization, memory usage, and API latency.

RAG systems introduce additional challenges because they combine:

- Document ingestion
- Embedding models
- Vector databases
- Retrieval pipelines
- Large Language Models (LLMs)
- Prompt engineering

A production RAG platform must monitor not only **system health**, but also **AI quality**.

Observability enables engineers to answer questions like:

- Why did the chatbot hallucinate?
- Which documents were retrieved?
- Why did retrieval latency increase?
- Which prompt generated the response?
- Which embedding model was used?
- Which LLM version produced the answer?

---

# What is Observability?

Observability is the ability to understand the internal state of a system using telemetry data.

Three foundational pillars support observability:

```text
                  Observability

        ┌────────────┬────────────┬────────────┐
        ▼            ▼            ▼
      Metrics      Logs        Traces
```

Together, they provide complete visibility into the behavior of a production RAG system.

---

# RAG Observability Architecture

```text
                  User Query
                       │
                       ▼
                 API Gateway
                       │
                       ▼
               Retrieval Service
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
 Vector Search   Metadata Filter   Reranker
      │                │                │
      └────────────────┼────────────────┘
                       ▼
                 Prompt Builder
                       │
                       ▼
                       LLM
                       │
                       ▼
                Generated Response
                       │
                       ▼
          Logging • Metrics • Tracing
                       │
                       ▼
           Monitoring & Alerting
```

---

# Pillar 1 — Metrics

Metrics provide quantitative measurements about system behavior.

Common infrastructure metrics:

- CPU utilization
- Memory usage
- Network traffic
- Disk I/O

AI-specific metrics:

| Metric | Purpose |
|---------|----------|
| Retrieval Latency | Time spent retrieving documents |
| LLM Latency | Model inference time |
| End-to-End Latency | Total response time |
| Token Usage | Prompt and completion tokens |
| Cache Hit Rate | Retrieval cache efficiency |
| Hallucination Rate | Unsupported responses |
| Recall@K | Retrieval quality |
| Error Rate | Failed requests |

---

# Pillar 2 — Logging

Logs capture detailed information about every request.

Typical log fields:

```json
{
  "request_id": "...",
  "user_id": "...",
  "query": "...",
  "retrieved_documents": 8,
  "embedding_model": "bge-large",
  "vector_database": "Milvus",
  "llm": "GPT-4.1",
  "latency_ms": 920,
  "tokens": 1450
}
```

Log important events such as:

- User query
- Prompt version
- Retrieved document IDs
- Embedding model
- LLM version
- Errors
- Timeouts

Avoid logging sensitive or personally identifiable information unless required and appropriately protected.

---

# Pillar 3 — Distributed Tracing

Tracing follows a request as it moves through multiple services.

```text
User Query
     │
     ▼
API Gateway
     │
     ▼
Retriever
     │
     ▼
Vector Database
     │
     ▼
Reranker
     │
     ▼
Prompt Builder
     │
     ▼
LLM
```

Tracing helps identify:

- Slow services
- Failed requests
- Bottlenecks
- Dependency failures

---

# Key Monitoring Areas

## 1. Retrieval Monitoring

Monitor:

- Search latency
- Number of retrieved documents
- Recall@K
- Precision@K
- Empty search results
- Metadata filter failures

---

## 2. Prompt Monitoring

Track:

- Prompt template version
- Prompt size
- Prompt tokens
- Context length
- Truncation events

Prompt versioning simplifies debugging after template changes.

---

## 3. LLM Monitoring

Monitor:

- Model version
- Response latency
- Completion tokens
- Prompt tokens
- Cost per request
- Timeout rate

---

## 4. Vector Database Monitoring

Track:

- Search latency
- Index size
- Collection size
- Memory usage
- Query throughput
- Index rebuild duration

---

## 5. Embedding Monitoring

Track:

- Embedding latency
- Model version
- Vector dimensions
- Embedding failures
- Throughput

---

# End-to-End Trace

```text
User Query
      │
      ▼
API Gateway (12 ms)
      │
      ▼
Retriever (45 ms)
      │
      ▼
Milvus Search (38 ms)
      │
      ▼
Cross Encoder (70 ms)
      │
      ▼
Prompt Builder (15 ms)
      │
      ▼
LLM (680 ms)
      │
      ▼
Response (860 ms)
```

Tracing quickly reveals which stage contributes most to overall latency.

---

# Dashboards

A production dashboard should include multiple categories of metrics.

| Category | Example Metrics |
|-----------|-----------------|
| Infrastructure | CPU, Memory, Network |
| Retrieval | Recall@K, Precision@K, Latency |
| LLM | Token Usage, Cost, Response Time |
| Database | Query Rate, Index Size |
| Business | User Satisfaction, Resolution Rate |
| Reliability | Errors, Timeouts, Availability |

---

# Alerting

Alerts should notify engineers when key thresholds are exceeded.

Examples:

- Retrieval latency > 200 ms
- LLM latency > 2 seconds
- Cache hit rate < 60%
- Error rate > 5%
- Empty search rate increases
- GPU utilization exceeds threshold
- Vector database unavailable

Alerts should focus on actionable issues rather than generating excessive noise.

---

# Observability Tools

| Tool | Primary Purpose |
|------|-----------------|
| LangSmith | Prompt tracing, debugging, evaluation |
| Langfuse | LLM observability and analytics |
| Phoenix (Arize) | LLM monitoring and evaluation |
| TruLens | RAG evaluation and observability |
| OpenTelemetry | Distributed tracing |
| Prometheus | Metrics collection |
| Grafana | Dashboards and visualization |
| Jaeger | Distributed tracing |
| Elasticsearch + Kibana | Log aggregation and search |

---

# Logging Best Practices

Log:

- Request ID
- Correlation ID
- Query
- Retrieved document IDs
- Retriever used
- Prompt version
- LLM version
- Latency
- Token usage

Avoid logging:

- Secrets
- API keys
- Personally identifiable information (unless governed appropriately)
- Sensitive prompts without proper controls

---

# Enterprise Architecture

```text
                 Users
                   │
                   ▼
             API Gateway
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
 Retrieval Service      Monitoring Agent
        │                     │
        ▼                     ▼
 Prompt Builder        Metrics Collector
        │                     │
        ▼                     ▼
      LLM            Grafana / Prometheus
        │                     │
        └──────────┬──────────┘
                   ▼
          Centralized Logs
                   │
                   ▼
      Alerting & Incident Response
```

---

# Production Best Practices

- Instrument every stage of the RAG pipeline with metrics, logs, and traces.
- Use correlation IDs to follow requests across distributed services.
- Version prompts, embedding models, and retrieval pipelines.
- Monitor retrieval quality alongside infrastructure metrics.
- Build dashboards for engineering, operations, and business stakeholders.
- Automate alerts for latency, failures, and quality degradation.
- Retain observability data according to governance and compliance requirements.

---

# Common Mistakes

❌ Monitoring only CPU and memory

❌ Ignoring retrieval quality metrics

❌ Logging prompts without version information

❌ Not correlating logs across services

❌ Failing to monitor token usage and cost

❌ Treating observability as an afterthought instead of a core architectural concern

---

# Interview Questions

### Why is observability more challenging in RAG systems than in traditional applications?

Because RAG systems combine multiple AI components—including retrieval, vector databases, prompt construction, and LLM inference—that each contribute to response quality and latency.

---

### What are the three pillars of observability?

Metrics, logs, and distributed traces.

---

### Why are correlation IDs important?

They allow engineers to trace a single request across multiple distributed services for debugging and performance analysis.

---

### Which AI-specific metrics should be monitored?

Examples include Recall@K, retrieval latency, hallucination rate, token usage, LLM latency, cache hit rate, and cost per request.

---

### Why should prompt versions be logged?

Prompt changes can significantly affect model behavior. Versioning makes it easier to compare results and diagnose regressions.

---

# Quick Revision

```text
Observability

Metrics
│
├── Latency
├── Recall@K
├── Token Usage
└── Cost

Logs
│
├── Query
├── Prompt Version
├── LLM Version
└── Retrieved Documents

Tracing
│
├── API
├── Retriever
├── Vector DB
├── Reranker
└── LLM

Tools
│
├── LangSmith
├── Langfuse
├── TruLens
├── Phoenix
├── Prometheus
└── Grafana
```

---

# Key Takeaways

- Observability provides visibility into both the operational health and AI quality of production RAG systems.
- Metrics, logs, and traces together enable effective debugging, performance optimization, and incident response.
- AI-specific telemetry—including retrieval quality, token usage, and hallucination rate—is as important as traditional infrastructure metrics.
- Centralized dashboards, correlation IDs, and automated alerting help maintain reliable enterprise AI services.
- Observability should be designed into the architecture from the beginning rather than added after deployment.

---

# References

- OpenTelemetry Documentation
- Prometheus Documentation
- Grafana Documentation
- LangSmith Documentation
- Langfuse Documentation
- Arize Phoenix Documentation
- TruLens Documentation
- OpenAI Cookbook – Monitoring LLM Applications

---

## Next Note

**27-caching-strategies.md** — Learn how caching at the embedding, retrieval, prompt, and response layers reduces latency, lowers LLM costs, and improves scalability in enterprise RAG systems.