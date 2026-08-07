# 30. Cost Optimization

> **Category:** Production RAG Patterns  
> **Series:** Enterprise AI Engineering Handbook  
> **Prerequisites:** Multi-Tenant RAG, Caching Strategies, Observability & Monitoring  
> **Difficulty:** Advanced

> **Note:** This chapter is **not part of the IBM AI Engineering course**. It focuses on designing cost-efficient Retrieval-Augmented Generation (RAG) platforms by optimizing infrastructure, token usage, retrieval pipelines, embeddings, vector databases, caching, and LLM inference while maintaining production-quality performance.

---

# Overview

Large Language Models (LLMs) provide remarkable capabilities, but they also introduce significant operational costs.

Unlike traditional applications, enterprise RAG systems incur costs at multiple stages:

- Document ingestion
- Embedding generation
- Vector database storage
- Retrieval
- Reranking
- Prompt construction
- LLM inference
- Monitoring
- Infrastructure

As enterprise AI usage grows, even small inefficiencies can multiply into substantial monthly expenses.

Cost optimization is therefore not about making systems "cheap"; it is about **maximizing business value per dollar spent** while maintaining acceptable quality, latency, and reliability.

---

# Where Does the Money Go?

```text
                Enterprise RAG Cost

                    User Query
                         │
                         ▼
               Embedding Generation
                  GPU / API Cost
                         │
                         ▼
                 Vector Database
               Storage + Retrieval
                         │
                         ▼
                   Reranking Model
                  Compute Cost
                         │
                         ▼
                 Prompt Construction
                  Token Expansion
                         │
                         ▼
                        LLM
          Prompt Tokens + Completion Tokens
                         │
                         ▼
              Monitoring & Infrastructure
```

---

# Major Cost Components

| Component | Primary Cost Driver |
|------------|--------------------|
| Embeddings | API calls / GPU inference |
| Vector Database | Storage, indexing, queries |
| LLM Inference | Prompt & completion tokens |
| Rerankers | GPU / CPU inference |
| Infrastructure | Compute, memory, networking |
| Monitoring | Storage and telemetry |
| Caching | Memory resources |

---

# Cost Optimization Strategy

Enterprise optimization should balance four objectives.

```text
             Cost Optimization

      ┌────────────┬────────────┐
      ▼            ▼
 Lower Cost   Better Performance
      │            │
      └──────┬─────┘
             ▼
     Business Value
             ▲
      ┌──────┴──────┐
      ▼             ▼
 Higher Quality  Scalability
```

---

# 1. Optimize Token Usage

The largest recurring expense in many RAG systems is token consumption.

Every request typically includes:

- System prompt
- User prompt
- Retrieved documents
- Conversation history
- Generated response

Example

```text
System Prompt          300 tokens

Retrieved Context     2,500 tokens

User Question            50 tokens

Completion              500 tokens

Total                 3,350 tokens
```

Reducing prompt size directly lowers inference cost.

---

## Best Practices

- Remove irrelevant context.
- Limit retrieved documents.
- Compress prompts.
- Eliminate duplicate information.
- Summarize long conversations.
- Use structured prompts.

---

# 2. Optimize Retrieval

Retrieving too many documents increases token usage.

Instead of:

```
Top 20 Documents
```

Use:

```
Top 5 Documents

↓

Cross Encoder

↓

Top 3 Context Chunks
```

Smaller but higher-quality context often improves both cost and answer quality.

---

# 3. Select the Right Model

Not every request requires the largest available model.

```text
Simple FAQ

↓

Small LLM

-----------------------

Document Search

↓

Medium LLM

-----------------------

Complex Analysis

↓

Large LLM
```

This strategy is known as **model routing**.

---

# Model Routing

```text
Incoming Request
        │
        ▼
 Complexity Classifier
        │
 ┌──────┼──────────┐
 ▼      ▼          ▼
Small Medium      Large
Model  Model      Model
```

Benefits

- Lower inference cost
- Faster responses
- Better resource utilization

---

# 4. Optimize Embedding Generation

Embedding costs grow rapidly with large document collections.

Best practices

- Generate embeddings once.
- Use incremental indexing.
- Avoid duplicate embeddings.
- Batch embedding requests.
- Cache query embeddings.

```text
New Documents

↓

Batch Processing

↓

Embedding Model

↓

Vector Database
```

---

# 5. Optimize Vector Database Costs

Vector databases incur storage and query costs.

Optimization strategies

- Delete obsolete vectors.
- Compress indexes where appropriate.
- Archive inactive knowledge.
- Separate hot and cold data.
- Tune ANN index parameters.

---

# Hot vs Cold Storage

```text
Knowledge Base

       │

 ┌─────┴─────┐

 ▼           ▼

Hot Data   Cold Data

 SSD        Object Storage
```

Frequently accessed knowledge remains in high-performance storage, while archival content moves to lower-cost storage.

---

# 6. Cache Aggressively

Multiple cache layers significantly reduce operational costs.

```text
Response Cache

↓

Prompt Cache

↓

Retrieval Cache

↓

Embedding Cache
```

High cache hit ratios reduce:

- LLM calls
- Retrieval operations
- Embedding generation

---

# 7. Optimize Reranking

Cross-Encoder reranking is computationally expensive.

Instead of reranking:

```
Top 100 Documents
```

Rerank only:

```
Top 20 Documents
```

Reducing candidate size lowers latency and GPU utilization.

---

# 8. Batch Processing

Batch workloads improve hardware utilization.

Instead of

```
100

Individual Requests
```

Use

```
Batch

↓

100 Documents

↓

Single GPU Job
```

Useful for:

- Embeddings
- Document ingestion
- Evaluation
- Index updates

---

# 9. Autoscaling

Static infrastructure wastes money during low traffic.

```text
Low Traffic

↓

2 Pods

------------------

Peak Traffic

↓

20 Pods
```

Use:

- Kubernetes HPA
- Cluster Autoscaler
- Serverless inference
- Managed vector databases

---

# 10. Monitor AI Costs

Every production AI platform should expose cost dashboards.

Track

| Metric | Purpose |
|----------|----------|
| Cost per Query | User cost |
| Cost per Tenant | Customer billing |
| Cost per Model | Model comparison |
| Token Usage | LLM efficiency |
| Embedding Cost | Indexing cost |
| GPU Utilization | Hardware efficiency |
| Cache Hit Ratio | Cost savings |

---

# Enterprise Cost Dashboard

```text
AI Cost Dashboard

Daily Cost

Monthly Cost

Token Usage

Embedding Requests

LLM Requests

GPU Hours

Storage Usage

Cache Hit Rate
```

---

# Cost Allocation

Multi-tenant platforms should attribute costs per customer.

```text
Tenant A

↓

Queries

↓

LLM Tokens

↓

Infrastructure

↓

Monthly Invoice
```

This enables:

- Internal chargeback
- Customer billing
- Budget forecasting

---

# Cost vs Performance Trade-off

```text
                  High Quality
                       ▲
                       │
        Large Models   │
                       │
                       │
Cost ◄─────────────────┼────────────────► Performance
                       │
                       │
        Small Models   │
                       ▼
                 Lower Cost
```

Enterprise AI architects continuously balance:

- Cost
- Accuracy
- Latency
- Scalability

There is rarely a single optimal solution for every workload.

---

# Enterprise Cost Optimization Architecture

```text
                 User Request
                      │
             Complexity Router
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
   Small Model              Large Model
         │                         │
         └────────────┬────────────┘
                      ▼
               Retrieval Cache
                      │
              Embedding Cache
                      │
             Vector Database
                      │
                 Reranker
                      │
                Prompt Builder
                      │
                     LLM
                      │
               Cost Monitoring
                      │
             Dashboards & Alerts
```

---

# Enterprise Use Cases

### Customer Support AI

Route simple FAQs to lightweight models while escalating complex troubleshooting to larger LLMs.

---

### Internal Knowledge Assistant

Cache frequently requested policies and engineering documentation to reduce repeated inference costs.

---

### Legal Research Assistant

Retrieve only the most relevant statutes and contracts to minimize prompt size without sacrificing answer quality.

---

### Healthcare Knowledge System

Batch document ingestion and incremental indexing to reduce embedding costs as medical literature grows.

---

### Multi-Tenant SaaS Platform

Track AI consumption per tenant for billing, budgeting, and capacity planning.

---

# Production Best Practices

- Measure **cost per successful answer**, not just infrastructure cost.
- Route requests to the smallest model capable of meeting quality requirements.
- Limit retrieved context to the minimum required for accurate responses.
- Cache embeddings, retrieval results, prompts, and responses where appropriate.
- Batch embedding and ingestion workloads.
- Continuously monitor token usage and GPU utilization.
- Archive rarely accessed vectors into lower-cost storage tiers.
- Regularly evaluate whether model upgrades justify additional operational cost.

---

# Common Mistakes

❌ Using the largest LLM for every request

❌ Retrieving excessive context

❌ Ignoring token consumption

❌ Recomputing embeddings unnecessarily

❌ Never deleting obsolete vectors

❌ Running GPU resources continuously during low traffic

❌ Failing to monitor AI costs per tenant or workload

---

# Interview Questions

### Why are LLM tokens often the largest cost component in a RAG system?

Because every request consumes prompt and completion tokens, and these costs accumulate with usage volume.

---

### What is model routing?

Model routing selects different LLMs based on request complexity, allowing simple queries to use smaller, less expensive models while reserving larger models for complex tasks.

---

### How does caching reduce AI costs?

Caching avoids repeated embedding generation, retrieval operations, prompt construction, and LLM inference for similar requests.

---

### Why should retrieval be optimized before increasing model size?

Higher-quality retrieval often improves answer accuracy while reducing prompt size, leading to lower costs and better overall performance.

---

### Which metrics should engineers monitor for AI cost optimization?

Cost per query, token usage, embedding cost, GPU utilization, cache hit ratio, storage consumption, and cost per tenant.

---

# Quick Revision

```text
Cost Optimization

Optimize
│
├── Tokens
├── Retrieval
├── Embeddings
├── Vector DB
├── Reranking
├── Caching
├── Autoscaling
└── Model Routing

Monitor
│
├── Cost / Query
├── Cost / Tenant
├── Token Usage
├── GPU Hours
├── Cache Hit Ratio
└── Storage

Goal
│
├── Lower Cost
├── High Quality
├── Low Latency
└── Scalability
```

---

# Key Takeaways

- Cost optimization is a continuous engineering practice that balances quality, latency, scalability, and operational expense.
- Token usage is often the largest recurring cost, making prompt optimization and retrieval efficiency critical.
- Model routing, batching, caching, and autoscaling significantly reduce infrastructure and inference costs.
- Vector databases and embedding pipelines should be optimized through incremental indexing, tiered storage, and efficient retrieval.
- Production AI teams should monitor cost metrics alongside quality metrics to maximize business value while controlling operational expenses.

---

# References

- LangChain Documentation
- LlamaIndex Documentation
- OpenAI API Pricing Guide
- Anthropic API Documentation
- Pinecone Cost Optimization Guide
- Milvus Documentation
- Kubernetes Horizontal Pod Autoscaler (HPA)
- Google Cloud Architecture Framework
- Microsoft Azure Well-Architected Framework for AI

---

## Next Note

**31-scaling-rag-systems.md** — Learn how enterprise RAG platforms scale across ingestion, embeddings, vector databases, retrieval services, LLM gateways, and Kubernetes infrastructure to support millions of users with high availability and low latency.