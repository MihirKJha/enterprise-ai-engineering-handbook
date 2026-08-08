# 27. Caching Strategies

> **Category:** Production RAG Patterns  
> **Series:** Enterprise AI Engineering Handbook  
> **Prerequisites:** Observability & Monitoring, Hybrid Search Patterns, Production Retrieval Architecture  
> **Difficulty:** Advanced

> **Note:** This chapter is **not part of the IBM AI Engineering course**. It focuses on caching techniques used in enterprise Retrieval-Augmented Generation (RAG) systems to reduce latency, lower infrastructure costs, improve scalability, and increase overall system throughput.

---

# Overview

Large Language Models are expensive.

Embedding models consume compute resources.

Vector searches require database lookups.

Rerankers increase latency.

Without caching, every user request executes the entire RAG pipeline, even if similar requests have already been processed.

Caching allows enterprise AI systems to **reuse previously computed results** instead of recomputing them.

Benefits include:

- Lower latency
- Reduced LLM cost
- Lower embedding cost
- Reduced vector database load
- Higher throughput
- Better user experience

---

# Why Caching Matters

Consider this query:

> "Explain Kubernetes Horizontal Pod Autoscaler."

Without caching:

```text
User Query
      │
Embedding Generation
      │
Vector Search
      │
Reranking
      │
Prompt Construction
      │
LLM
      │
Response
```

Every identical request repeats the entire workflow.

With caching:

```text
User Query
      │
Cache Lookup
      │
 ┌────┴────┐
 │         │
Hit       Miss
 │         │
 │     Execute Pipeline
 │         │
 └────┬────┘
      ▼
Return Response
```

---

# Caching Architecture

```text
                    User Query
                         │
                  Cache Lookup
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
      Cache Hit                    Cache Miss
          │                             │
          │                     Embedding Model
          │                             │
          │                     Vector Search
          │                             │
          │                        Reranker
          │                             │
          │                     Prompt Builder
          │                             │
          │                           LLM
          │                             │
          └────────────Store────────────┘
                         │
                         ▼
                   Return Response
```

---

# Layers of Caching

Enterprise RAG systems typically cache at multiple layers.

```text
User Request

      │

Response Cache

      │

Prompt Cache

      │

Retrieval Cache

      │

Embedding Cache

      │

Vector Database
```

Each layer reduces work for the layers below.

---

# 1. Embedding Cache

Generating embeddings is computationally expensive.

Repeated documents or repeated queries should reuse existing embeddings.

```text
Query

↓

Embedding Cache

↓

Hit

↓

Reuse Existing Vector
```

Cache Key

```
SHA256(Query Text)
```

Benefits

- Lower GPU utilization
- Faster query processing
- Lower embedding costs

---

# 2. Retrieval Cache

Instead of performing vector search repeatedly, cache retrieved documents.

Example

```text
Query

↓

Vector Search

↓

Top 10 Documents

↓

Store Results
```

Next identical query:

```text
Query

↓

Retrieval Cache

↓

Top 10 Documents
```

Useful for:

- Documentation portals
- Internal knowledge bases
- Frequently asked questions

---

# 3. Prompt Cache

Prompt construction may involve:

- Retrieved context
- Templates
- Conversation history
- System prompts

Instead of rebuilding prompts:

```text
Prompt Components

↓

Cache

↓

Reuse Prompt
```

Useful when prompt templates are stable.

---

# 4. Response Cache

The highest-level cache stores the final generated response.

```text
User Query

↓

LLM Response

↓

Store

↓

Future Queries

↓

Return Cached Answer
```

Best suited for:

- FAQ systems
- Documentation assistants
- Internal support bots

Avoid response caching for highly personalized or frequently changing content.

---

# 5. Semantic Cache

Traditional caches require identical queries.

Semantic caching supports similar queries.

Example

```
Query A

"What is Kubernetes?"

Query B

"Explain Kubernetes."

```

Although the text differs, the meaning is nearly identical.

Workflow

```text
Query

↓

Embedding

↓

Similarity Search

↓

Existing Cached Query?

↓

Reuse Response
```

Semantic caching increases cache hit rates for natural language interactions.

---

# Cache Invalidation

One of the hardest challenges is deciding **when cached data is no longer valid**.

Common invalidation triggers:

- Document updates
- Knowledge base changes
- Prompt template updates
- Embedding model upgrades
- LLM version changes
- Security policy changes

Example

```text
Document Updated

↓

Invalidate Retrieval Cache

↓

Recompute

↓

Store New Results
```

---

# Cache Expiration (TTL)

Most enterprise systems assign a Time-To-Live (TTL).

Example

| Data Type | Suggested TTL |
|-----------|---------------|
| Embeddings | Weeks to Months |
| Retrieval Results | Hours |
| Prompt Cache | Hours |
| LLM Responses | Minutes to Hours |
| Session Cache | Session Lifetime |

TTL values depend on how frequently the underlying knowledge changes.

---

# Distributed Caching

Large-scale systems deploy shared caches.

```text
              Users
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
 Application  Application  Application
      │          │          │
      └──────────┼──────────┘
                 ▼
            Redis Cluster
                 │
                 ▼
            Shared Cache
```

Advantages:

- Consistent cache across instances
- Horizontal scalability
- Reduced duplicate computation

---

# Popular Caching Technologies

| Technology | Typical Use |
|------------|-------------|
| Redis | Distributed in-memory cache |
| Memcached | High-speed key-value cache |
| Hazelcast | Distributed caching and computing |
| Apache Ignite | Large-scale in-memory data grid |
| Local Memory Cache | Single-instance applications |

---

# Cache Key Design

A good cache key prevents collisions and stale responses.

Example

```text
Hash(
Query +
Prompt Version +
Embedding Model +
LLM Version +
Knowledge Base Version
)
```

Including version information ensures that cached responses remain valid after upgrades.

---

# Enterprise Cache Workflow

```text
                  User Query
                       │
                       ▼
               Response Cache
                  │      │
               Hit      Miss
                  │       │
                  ▼       ▼
             Return   Retrieval Cache
                        │      │
                     Hit      Miss
                        │       │
                        ▼       ▼
                  Embedding Cache
                        │      │
                     Hit      Miss
                        │       │
                        ▼       ▼
                 Vector Search
                        │
                    Reranker
                        │
                  Prompt Builder
                        │
                        ▼
                        LLM
                        │
          Update All Cache Layers
                        │
                        ▼
                 Return Response
```

---

# Enterprise Use Cases

### Documentation Chatbot

Cache frequently accessed documentation responses to reduce repeated LLM calls.

---

### Customer Support Assistant

Cache retrieval results for common troubleshooting queries while allowing personalized responses to bypass the response cache.

---

### Enterprise Search

Reuse embeddings and retrieval results for popular search terms across teams.

---

### AI Coding Assistant

Cache embeddings for source code files and frequently referenced documentation to speed up context retrieval.

---

### Multi-Tenant Knowledge Platform

Maintain tenant-specific caches to isolate customer data while maximizing cache efficiency.

---

# Production Best Practices

- Cache at multiple layers rather than relying only on response caching.
- Use semantic caching for natural language queries with similar meaning.
- Include model, prompt, and knowledge-base versions in cache keys.
- Configure TTL values based on data volatility.
- Invalidate caches automatically after document updates.
- Monitor cache hit ratio, eviction rate, and memory usage.
- Separate caches for different tenants in multi-tenant environments.
- Avoid caching sensitive or personalized responses unless properly isolated and encrypted.

---

# Common Mistakes

❌ Caching only final LLM responses

❌ Using identical cache keys after changing embedding models

❌ Never invalidating stale cache entries

❌ Caching sensitive user information without access controls

❌ Setting TTL values too long for frequently updated knowledge bases

❌ Ignoring cache performance metrics

---

# Interview Questions

### Why is caching important in RAG systems?

Caching reduces repeated computation, lowers latency, decreases infrastructure costs, and improves scalability.

---

### What is semantic caching?

Semantic caching stores responses based on meaning rather than exact text, allowing similar queries to reuse previously computed results.

---

### Why should cache keys include model versions?

Changes to embedding models, prompt templates, or LLM versions can invalidate previous outputs. Including version information prevents stale or inconsistent responses.

---

### Which cache layer provides the greatest latency reduction?

Response caching provides the greatest latency reduction because it bypasses the entire RAG pipeline. However, it is only suitable when responses are reusable.

---

### Why is cache invalidation difficult?

Because cached data must remain consistent with evolving documents, models, prompts, and security policies without unnecessarily reducing cache efficiency.

---

# Quick Revision

```text
Caching Layers

User Query
     │
     ▼
Response Cache
     │
Prompt Cache
     │
Retrieval Cache
     │
Embedding Cache
     │
Vector Database

Cache Types
│
├── Embedding
├── Retrieval
├── Prompt
├── Response
└── Semantic

Key Concepts
│
├── TTL
├── Cache Invalidation
├── Distributed Cache
├── Cache Keys
└── Cache Hit Ratio
```

---

# Key Takeaways

- Caching is a critical optimization technique for production RAG systems, reducing latency, infrastructure costs, and redundant computation.
- Enterprise AI platforms typically implement multiple cache layers, including embedding, retrieval, prompt, response, and semantic caches.
- Effective cache invalidation and version-aware cache keys are essential to prevent stale or inconsistent results.
- Distributed caches such as Redis enable scalable caching across multiple application instances.
- Monitoring cache metrics, choosing appropriate TTL values, and isolating tenant-specific data are key practices for building reliable enterprise AI systems.

---

# References

- Redis Documentation
- Memcached Documentation
- Hazelcast Documentation
- Apache Ignite Documentation
- LangChain Documentation (LLM Cache)
- LangChain Documentation (Semantic Cache)
- Microsoft Azure Cache for Redis Documentation
- Google Cloud Memorystore Documentation

---

## Next Note

**28-security-and-governance.md** — Learn how enterprise RAG systems implement authentication, authorization, data privacy, RBAC, encryption, audit logging, compliance, and AI governance to build secure and trustworthy AI applications.