# 25. Hybrid Search Patterns

> **Category:** Production RAG Patterns  
> **Series:** Enterprise AI Engineering Handbook  
> **Prerequisites:** Enterprise Retrieval Best Practices, Reranking Strategies, Production Retrieval Architecture  
> **Difficulty:** Advanced

> **Note:** This chapter is **not part of the IBM AI Engineering course**. It covers hybrid search architectures used by enterprise AI systems to combine lexical, semantic, metadata, and reranking techniques for highly accurate information retrieval.

---

# Overview

No single search technique works well for every query.

Vector search excels at understanding **semantic meaning**, while keyword search is better at finding **exact terms**, product names, error codes, IDs, and version numbers.

Enterprise Retrieval-Augmented Generation (RAG) systems therefore combine multiple retrieval techniques into a **Hybrid Search** pipeline.

Instead of depending on one retrieval algorithm, Hybrid Search leverages the strengths of each technique to improve both **Recall** and **Precision**.

---

# Why Hybrid Search?

Consider the query:

> **"How do I fix Kubernetes Error 0x80070005?"**

### Vector Search

May understand:

- Kubernetes
- Permission issue
- Access denied

But may miss the exact error code.

---

### Keyword Search (BM25)

Finds:

- "0x80070005"
- Kubernetes
- Access denied

But cannot understand semantic similarity.

---

### Hybrid Search

Combines both:

```
Semantic Understanding
        +
Exact Keyword Matching
        =
Best Retrieval Quality
```

---

# Hybrid Search Architecture

```text
                    User Query
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
      Dense Retrieval          Sparse Retrieval
   (Vector Similarity)             (BM25)
            │                         │
            └────────────┬────────────┘
                         ▼
                 Result Fusion
                         │
                  Metadata Filter
                         │
                    Reranker
                         │
                    Top Documents
                         │
                         ▼
                         LLM
```

---

# Dense Retrieval

Dense retrieval converts text into embeddings.

```
Query

↓

Embedding Model

↓

Dense Vector

↓

Similarity Search

↓

Top Documents
```

Advantages

- Semantic understanding
- Handles paraphrases
- Understands synonyms
- Works well for natural language

Limitations

- Misses exact keywords
- May ignore product IDs
- May miss version numbers

---

# Sparse Retrieval

Sparse retrieval relies on keyword matching.

The most common algorithm is **BM25**.

```
Query

↓

Keyword Matching

↓

Document Ranking

↓

Top Documents
```

Advantages

- Exact matching
- Excellent for IDs
- Error codes
- Product names
- Technical documentation

Limitations

- Cannot understand semantics
- Cannot recognize synonyms
- Sensitive to wording

---

# Metadata Filtering

Metadata filtering narrows the search space before reranking.

Example

```
Department = Engineering

AND

Language = English

AND

Version >= 3.0
```

Metadata dramatically improves enterprise retrieval quality.

---

# Result Fusion

After dense and sparse retrieval complete, their results must be merged.

```text
Vector Results

Doc A

Doc C

Doc D

        +

BM25 Results

Doc B

Doc C

Doc E

        ↓

Merged Candidate List
```

Fusion removes duplicates and combines rankings.

---

# Fusion Strategies

## 1. Score Fusion

Merge retrieval scores.

```
Final Score

=

Dense Score

+

Sparse Score
```

Simple but requires score normalization.

---

## 2. Reciprocal Rank Fusion (RRF)

Ranks documents based on position rather than raw scores.

```
Score

=

1 / (k + Rank)
```

Advantages

- Robust
- No score normalization
- Widely used
- Excellent production performance

---

## 3. Weighted Fusion

Assign different weights.

```
Final Score

=

0.7 × Dense

+

0.3 × Sparse
```

Useful when semantic search is more important than keyword search.

---

# Complete Hybrid Search Pipeline

```text
                 User Query
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
 Vector Search                 BM25 Search
         │                         │
         └────────────┬────────────┘
                      ▼
             Reciprocal Rank Fusion
                      │
             Metadata Filtering
                      │
                Cross Encoder
                      │
                  Top 5 Results
                      │
                      ▼
                      LLM
```

---

# LangChain Example

```python
from langchain.retrievers import EnsembleRetriever

hybrid = EnsembleRetriever(
    retrievers=[bm25, vector_retriever],
    weights=[0.4, 0.6]
)

docs = hybrid.invoke(
    "Explain Kubernetes deployment"
)
```

---

# LlamaIndex Example

```python
from llama_index.core.retrievers import QueryFusionRetriever

retriever = QueryFusionRetriever(
    retrievers=[
        vector_retriever,
        keyword_retriever
    ]
)
```

---

# Enterprise Hybrid Patterns

## Pattern 1

Dense + BM25

Best for:

- Enterprise Search
- Documentation

---

## Pattern 2

Dense + Metadata

Best for:

- Internal Knowledge Bases

---

## Pattern 3

Dense + BM25 + Reranker

Best for:

- Customer Support AI

---

## Pattern 4

Dense + Sparse + Metadata + Reranker

Best for:

- Enterprise AI Platforms

---

## Pattern 5

Multi-Query + Hybrid Search

Best for:

- Research Assistants
- Legal AI
- Scientific Search

---

# Comparison

| Technique | Semantic Search | Keyword Search | Metadata | Accuracy |
|------------|-----------------|----------------|----------|----------|
| BM25 | ❌ | ✅ | Limited | Medium |
| Dense Retrieval | ✅ | ❌ | Limited | High |
| Hybrid Search | ✅ | ✅ | ✅ | Very High |

---

# Enterprise Use Cases

### Technical Documentation

Retrieve API documentation using semantic search while matching exact endpoint names and version numbers.

---

### Customer Support

Combine semantic understanding with exact error-code matching.

---

### Legal Search

Use semantic retrieval with metadata filters for jurisdiction, document type, and publication date.

---

### Healthcare

Retrieve research papers using semantic similarity while filtering by specialty, publication year, and evidence level.

---

### Financial Services

Search regulations using legal terminology, document version, and jurisdiction filters.

---

# Production Best Practices

- Combine dense and sparse retrieval rather than replacing one with the other.
- Use **Reciprocal Rank Fusion (RRF)** as a robust default fusion strategy.
- Apply metadata filtering before reranking whenever possible.
- Retrieve a larger candidate set (Top-20 to Top-50) before reranking.
- Continuously evaluate hybrid retrieval using Recall@K, Precision@K, and NDCG.
- Tune fusion weights using benchmark datasets rather than intuition.
- Cache frequently executed hybrid queries to reduce latency.

---

# Common Mistakes

❌ Assuming vector search eliminates the need for keyword search

❌ Ignoring metadata filtering

❌ Combining scores without normalization

❌ Reranking too few candidate documents

❌ Optimizing only for Recall while ignoring Precision

---

# Interview Questions

### Why is Hybrid Search superior to pure vector search?

Hybrid Search combines semantic similarity with exact keyword matching, improving retrieval across diverse query types.

---

### What problem does BM25 solve?

BM25 retrieves documents containing exact keywords, identifiers, product names, and error codes that semantic search may miss.

---

### What is Reciprocal Rank Fusion (RRF)?

RRF combines rankings from multiple retrieval systems using document positions instead of raw scores, making it robust and easy to deploy.

---

### Why should metadata filtering be applied?

Metadata filtering narrows the candidate set, improves relevance, reduces latency, and enforces business constraints such as department or document version.

---

### What is the recommended production retrieval pipeline?

Dense Retrieval → Sparse Retrieval → Fusion → Metadata Filtering → Reranking → LLM.

---

# Quick Revision

```text
Hybrid Search

User Query
     │
     ├─────────────┐
     ▼             ▼
Dense Search   BM25 Search
     │             │
     └──────┬──────┘
            ▼
    Result Fusion
            │
 Metadata Filter
            │
    Cross Encoder
            │
           LLM
```

---

# Key Takeaways

- Hybrid Search combines semantic retrieval and keyword search to improve overall retrieval quality.
- Dense retrieval captures meaning, while BM25 excels at exact lexical matching.
- Fusion techniques such as Reciprocal Rank Fusion (RRF) combine results from multiple retrievers into a unified ranking.
- Metadata filtering and reranking further improve precision before documents are sent to the LLM.
- Hybrid Search is considered the default retrieval architecture for many modern enterprise RAG systems.

---

# References

- LangChain Documentation
- LlamaIndex Documentation
- Elastic Search Documentation (BM25)
- Vespa Search Documentation
- Pinecone Learning Center
- Microsoft Azure AI Search Documentation
- Google Vertex AI Search Documentation

---

## Next Note

**26-observability-and-monitoring.md** — Learn how to monitor production RAG systems using tracing, metrics, logging, evaluation pipelines, LLM observability platforms, and distributed monitoring to ensure reliability and continuous improvement.