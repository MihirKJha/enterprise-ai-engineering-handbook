# 07. Query Fusion Retriever

> **Category:** LlamaIndex Retrievers
> **Module:** Advanced Retrieval Engineering
> **Prerequisites:** Vector Index Retriever, BM25 Retriever, Hybrid Search, Query Expansion
> **Difficulty:** Advanced

> **Note:** The Query Fusion Retriever is an advanced retrieval strategy in LlamaIndex that improves retrieval recall by generating multiple variations of a user's query, retrieving documents for each variation, and intelligently combining the results into a unified ranking. Instead of relying on a single query interpretation, it explores multiple semantic perspectives, making retrieval more robust for ambiguous, complex, and enterprise-scale search scenarios.

---

# Overview

A single user query rarely captures the complete information need.

For example, consider the query:

```
How can I secure Kubernetes applications?
```

This question may relate to:

- Kubernetes Security
- RBAC
- Network Policies
- Authentication
- Secrets Management
- Pod Security
- Service Mesh
- Container Security

A traditional retriever searches using only the original query.

The **Query Fusion Retriever** expands the search by automatically generating multiple semantically related queries.

Each generated query retrieves its own set of documents.

The retriever then fuses all retrieved results into a single ranked list before passing the context to the LLM.

This significantly improves retrieval recall while maintaining high relevance.

---

# Why Query Fusion Retriever?

Traditional Retrieval

```text
                 User Query
                      │
                      ▼
             Single Retrieval
                      │
                      ▼
                Top-K Results
                      │
                      ▼
                     LLM
```

Problems

- Limited query interpretation
- Lower recall
- Misses related terminology
- Sensitive to query wording
- Weak for ambiguous questions

---

Query Fusion Retrieval

```text
                 User Query
                      │
                      ▼
            Generate Query Variations
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 Query 1         Query 2          Query 3
      │               │                │
      ▼               ▼                ▼
Retrieve        Retrieve         Retrieve
      │               │                │
      └───────────────┼────────────────┘
                      ▼
              Fuse Ranked Results
                      │
                      ▼
                     LLM
```

Benefits

- Higher recall
- Better semantic coverage
- Reduced query bias
- Improved document discovery
- Better enterprise search quality

---

# High-Level Architecture

```text
                    User Query
                         │
                         ▼
              Query Generation LLM
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
  Query A            Query B           Query C
      │                  │                  │
      ▼                  ▼                  ▼
Vector Search      Vector Search     Vector Search
      │                  │                  │
      └──────────────────┼──────────────────┘
                         ▼
                 Result Fusion Engine
                         │
                         ▼
                  Ranked Documents
                         │
                         ▼
                   Query Engine
                         │
                         ▼
                         LLM
```

---

# Retrieval Pipeline

```text
User Query
      │
      ▼
Generate Query Variations
      │
      ▼
Parallel Retrieval
      │
      ▼
Merge Results
      │
      ▼
Remove Duplicates
      │
      ▼
Final Ranking
      │
      ▼
LLM
```

---

# How Query Fusion Retriever Works

## Step 1 – Receive User Query

Example

```
How can I optimize database performance?
```

---

## Step 2 – Generate Query Variations

The LLM creates multiple semantically equivalent or complementary queries.

Example

```text
How to optimize SQL queries?

How to improve database indexing?

Database performance tuning techniques

Reducing database latency
```

Each variation explores a different aspect of the original question.

---

## Step 3 – Execute Parallel Retrieval

Each generated query performs an independent retrieval.

```text
Query A

↓

Top-K Documents

Query B

↓

Top-K Documents

Query C

↓

Top-K Documents
```

Parallel retrieval increases document diversity.

---

## Step 4 – Merge Results

All retrieved documents are combined into a single candidate set.

```text
Result A

+

Result B

+

Result C

↓

Combined Results
```

---

## Step 5 – Remove Duplicate Documents

Duplicate nodes retrieved by multiple queries are removed.

```text
Node 1

Node 3

Node 5

Node 3

↓

Node 1

Node 3

Node 5
```

---

## Step 6 – Fuse Rankings

The remaining documents are reordered using a fusion algorithm.

Common techniques include:

- Reciprocal Rank Fusion (RRF)
- Score Averaging
- Weighted Fusion
- Custom Ranking Strategies

---

## Step 7 – Generate Final Response

The highest-ranked documents are provided to the Query Engine.

```text
Ranked Documents

↓

Prompt Construction

↓

LLM
```

---

# Query Fusion Example

Knowledge Base

```text
Cloud Security

Kubernetes Guide

RBAC Documentation

Network Policies

Secrets Management

Istio Service Mesh
```

User Query

```
Secure Kubernetes Cluster
```

Generated Queries

```text
Kubernetes Security

RBAC Configuration

Pod Security Standards

Secrets Management

Network Policies
```

Retrieved documents from all searches are merged and ranked, producing broader and more relevant context than a single search.

---

# Fusion Strategies

## Reciprocal Rank Fusion (RRF)

Ranks documents based on their positions across multiple retrieval results.

Advantages

- Robust ranking
- Less sensitive to score differences
- Widely used in enterprise search

---

## Score Fusion

Combines similarity scores from multiple retrievals.

Advantages

- Simple implementation
- Effective when scores are comparable

---

## Weighted Fusion

Assigns different weights to different query variations.

Example

```text
Original Query = 60%

Generated Query 1 = 20%

Generated Query 2 = 20%
```

Useful when the original query should have higher influence.

---

## Reranker-Based Fusion

Uses a reranker model after merging results.

Example

```text
Merged Results

↓

Cross Encoder

↓

Final Ranking
```

Provides the highest retrieval precision.

---

# LangChain Comparison

LlamaIndex

```text
Query Fusion Retriever

↓

Query Engine

↓

LLM
```

Closest LangChain equivalent

```text
Multi Query Retriever

↓

Merge Results

↓

Reranker

↓

LLM
```

Both frameworks improve recall through query expansion, but LlamaIndex provides Query Fusion Retriever as a dedicated retrieval strategy with built-in result fusion.

---

# Enterprise Use Cases

### Enterprise Knowledge Search

Retrieve documents using multiple business terminologies.

---

### Technical Documentation

Search APIs, configuration guides, and architecture documents using multiple technical phrases.

---

### Legal Research

Expand legal terminology to retrieve relevant regulations and precedents.

---

### Healthcare Systems

Search using medical synonyms, abbreviations, and clinical terminology.

---

### Customer Support

Retrieve documentation despite different customer wording.

---

### Research Platforms

Improve literature search by exploring multiple semantic interpretations.

---

# Advantages

- Higher retrieval recall
- Better semantic coverage
- Handles ambiguous queries
- Improves document diversity
- Reduces vocabulary mismatch
- Easy integration with vector retrieval
- Works well with rerankers

---

# Limitations

- Multiple retrieval operations increase latency.
- Higher computational cost.
- Additional LLM calls for query generation.
- More complex ranking process.
- May retrieve more redundant documents before fusion.

---

# Production Best Practices

- Limit the number of generated queries to control latency.
- Use Reciprocal Rank Fusion for robust ranking.
- Apply rerankers after fusion.
- Cache generated query variations for common searches.
- Monitor retrieval quality and duplicate rates.
- Combine with metadata filtering to narrow search space.
- Evaluate recall improvements using benchmark datasets.

---

# Common Mistakes

- Generating too many query variations.
- Treating all generated queries as equally important.
- Skipping duplicate removal.
- Ignoring reranking after fusion.
- Using Query Fusion for simple keyword lookups where BM25 is sufficient.

---

# Interview Questions

### What is the Query Fusion Retriever?

### How does it differ from the Vector Index Retriever?

### Why does Query Fusion improve retrieval recall?

### What is Reciprocal Rank Fusion?

### How is Query Fusion different from Multi Query Retrieval?

### When should Query Fusion Retriever be used?

---

# Quick Revision

```text
User Query
      │
Generate Query Variations
      │
Parallel Retrieval
      │
Merge Results
      │
Remove Duplicates
      │
Fuse Rankings
      │
Query Engine
      │
LLM
```

---

# Key Takeaways

- Query Fusion Retriever improves retrieval by generating multiple semantic variations of a user's query.
- Each query retrieves documents independently, and the results are intelligently merged into a single ranked list.
- Fusion techniques such as Reciprocal Rank Fusion (RRF) increase recall while maintaining relevance.
- Query Fusion is particularly effective for ambiguous, complex, or domain-specific queries where a single query may miss relevant information.
- In enterprise RAG systems, Query Fusion Retriever is commonly combined with rerankers, metadata filters, and hybrid search to deliver high-quality retrieval performance.

---

# References

- LlamaIndex Documentation — Query Fusion Retriever
- LlamaIndex Documentation — Query Transformations
- LlamaIndex Documentation — Fusion Retrieval
- Cormack, Clarke & Büttcher — Reciprocal Rank Fusion (RRF)
- Enterprise Retrieval-Augmented Generation (RAG) Best Practices

---

## Next Note

**08-auto-merging-retriever.md** — Learn how the Auto Merging Retriever reconstructs larger contextual sections by automatically merging related child nodes into their parent nodes, preserving document coherence while maintaining the precision of fine-grained retrieval.