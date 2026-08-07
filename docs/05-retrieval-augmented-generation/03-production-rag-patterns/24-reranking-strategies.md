# 24. Reranking Strategies

> **Category:** Production RAG Patterns  
> **Series:** Enterprise AI Engineering Handbook  
> **Prerequisites:** Enterprise Retrieval Best Practices, RAG Evaluation & Benchmarks, Production Retrieval Architecture  
> **Difficulty:** Advanced

> **Note:** This chapter is **not part of the IBM AI Engineering course**. It focuses on reranking techniques used in production Retrieval-Augmented Generation (RAG) systems to improve retrieval precision before passing context to a Large Language Model (LLM).

---

# Overview

In most Retrieval-Augmented Generation (RAG) systems, the initial retriever is optimized for **speed**, not perfect ranking.

A vector search may quickly return the **Top-20** documents, but the most relevant document is not always ranked first.

A **reranker** acts as a second-stage ranking model that examines the retrieved candidates and reorders them based on semantic relevance.

Instead of replacing the retriever, reranking **refines** its output.

Benefits include:

- Higher retrieval precision
- Better context selection
- Fewer hallucinations
- Improved answer quality

---

# Why Reranking?

A retriever uses approximate similarity.

A reranker performs a deeper semantic comparison.

```text
User Query
      │
      ▼
Retriever
(Fast Candidate Search)
      │
Top 20 Documents
      │
      ▼
Reranker
(Deep Semantic Ranking)
      │
Top 5 Documents
      │
      ▼
Prompt Builder
      │
      ▼
LLM
```

---

# Two-Stage Retrieval Architecture

```text
                 User Question
                       │
                       ▼
              Embedding Generation
                       │
                       ▼
              Vector Similarity Search
                       │
                 Top 20 Candidates
                       │
                       ▼
                Reranking Model
                       │
                  Top 5 Results
                       │
                       ▼
                  Prompt Builder
                       │
                       ▼
                        LLM
```

This architecture is used by many enterprise search and RAG systems because it balances **latency** and **accuracy**.

---

# Why Not Use a Reranker for Every Document?

Suppose a knowledge base contains **5 million documents**.

Comparing every document against the query using a cross-encoder would be computationally impractical.

Instead:

```
5,000,000 Documents

↓

Retriever

↓

Top 20 Documents

↓

Reranker

↓

Top 5 Documents
```

The retriever narrows the search space, and the reranker performs detailed analysis only on the candidate documents.

---

# Types of Rerankers

| Type | Speed | Accuracy | Typical Use |
|------|-------|----------|-------------|
| Cross Encoder | Slow | Excellent | Production RAG |
| Bi-Encoder | Fast | Good | Initial Retrieval |
| Late Interaction | Medium | Very High | Large Retrieval Systems |
| LLM Reranker | Slow | Excellent | High-value workflows |

---

# Cross-Encoder Reranking

## Overview

A Cross-Encoder receives **both the query and the document together**.

Instead of comparing embeddings, it directly predicts how relevant the document is.

---

## Architecture

```text
Query
      │
      ├─────────────┐
      ▼             ▼
     Query      Document
          │
          ▼
   Cross Encoder
          │
 Relevance Score
```

Example:

```
Query:
"What is Kubernetes?"

Document A → 0.95

Document B → 0.81

Document C → 0.42
```

Documents are reordered using these scores.

---

## Advantages

- Highest ranking quality
- Strong semantic understanding
- Excellent for production RAG

---

## Limitations

- Computationally expensive
- Higher latency
- Not suitable for searching millions of documents directly

---

# Bi-Encoder

Bi-Encoders encode the query and documents independently.

```text
Query
 │
 ▼
Embedding

Document
 │
 ▼
Embedding

↓

Cosine Similarity
```

Advantages:

- Fast
- Scalable
- Suitable for first-stage retrieval

Limitations:

- Lower ranking quality than Cross-Encoders

---

# Late Interaction Models

Late interaction combines the strengths of bi-encoders and cross-encoders.

Instead of producing a single embedding for the entire document, these models compare token-level representations.

Popular example:

- ColBERT

Advantages:

- Better ranking quality than bi-encoders
- Lower cost than cross-encoders
- Suitable for large search systems

---

# LLM-Based Reranking

Some enterprise systems use an LLM to rank retrieved documents.

Example prompt:

```text
Query:
"What causes Kubernetes pod failures?"

Rank these documents from most relevant to least relevant.
```

Advantages:

- Excellent reasoning
- Handles complex semantic relationships

Limitations:

- Expensive
- Higher latency
- Increased token consumption

Typically reserved for:

- Legal search
- Medical AI
- Research assistants
- Executive knowledge systems

---

# Comparison of Reranking Techniques

| Feature | Bi-Encoder | Cross Encoder | Late Interaction | LLM Reranker |
|----------|------------|---------------|------------------|--------------|
| Speed | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| Accuracy | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Scalability | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| Cost | Low | Medium | Medium | High |
| Production RAG | Initial Retrieval | Preferred | Large Search Systems | Specialized Workloads |

---

# Reranking Workflow

```text
User Query
      │
      ▼
Retriever
      │
Top 20 Documents
      │
      ▼
Cross Encoder
      │
Relevance Scores
      │
      ▼
Top 5 Documents
      │
      ▼
LLM
```

---

# LangChain Example

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker

reranker = CrossEncoderReranker(model="BAAI/bge-reranker-base")

compression_retriever = ContextualCompressionRetriever(
    base_retriever=retriever,
    base_compressor=reranker
)
```

---

# LlamaIndex Example

```python
from llama_index.core.postprocessor import SentenceTransformerRerank

reranker = SentenceTransformerRerank(
    top_n=5,
    model="BAAI/bge-reranker-base"
)

query_engine = index.as_query_engine(
    node_postprocessors=[reranker]
)
```

---

# Popular Reranking Models

| Model | Organization | Notes |
|--------|--------------|------|
| BAAI BGE Reranker | BAAI | Popular open-source reranker |
| Cohere Rerank | Cohere | Hosted API service |
| Jina AI Reranker | Jina AI | Strong multilingual support |
| MonoT5 | Google Research | T5-based reranking |
| ColBERT | Stanford | Late interaction retrieval |

---

# Enterprise Use Cases

### Enterprise Knowledge Search

Cross-Encoder reranks policy documents before they reach the chatbot.

---

### Legal Document Search

LLM reranks contracts based on legal relevance.

---

### Medical AI

Cross-Encoder prioritizes clinically relevant research papers.

---

### E-Commerce Search

Late interaction reranks product descriptions and reviews.

---

### Customer Support

Reranking improves the selection of troubleshooting articles.

---

# Production Best Practices

- Retrieve a larger candidate set (Top-20 or Top-50) before reranking.
- Use Cross-Encoders for high-quality semantic ranking.
- Reserve LLM rerankers for high-value or low-volume workflows.
- Benchmark reranking impact using Recall@K, Precision@K, MRR, and NDCG.
- Cache reranking results for repeated queries.
- Monitor reranking latency separately from retrieval latency.
- Continuously evaluate reranking models as document collections evolve.

---

# Common Mistakes

❌ Using rerankers on the full document collection

❌ Returning too few candidates to the reranker

❌ Measuring only latency instead of ranking quality

❌ Assuming reranking can compensate for poor chunking

❌ Ignoring infrastructure costs of large reranking models

---

# Interview Questions

### Why are rerankers used in RAG systems?

Rerankers improve the ordering of retrieved documents so that the most relevant context is provided to the LLM.

---

### Why isn't a Cross-Encoder used for the initial search?

Cross-Encoders compare each query-document pair individually, making them too computationally expensive for searching millions of documents.

---

### What is the difference between a Bi-Encoder and a Cross-Encoder?

A Bi-Encoder encodes queries and documents independently and compares embeddings, while a Cross-Encoder jointly processes the query and document to produce a relevance score.

---

### What is a Late Interaction model?

Late Interaction models compare token-level representations rather than a single document embedding, offering a balance between efficiency and ranking quality.

---

### When is an LLM reranker appropriate?

LLM rerankers are best suited for specialized, high-value applications where maximum ranking quality justifies additional latency and cost.

---

# Quick Revision

```text
Reranking

Retriever
│
├── Fast
├── Candidate Selection
└── Top 20 Documents

Reranker
│
├── Deep Semantic Analysis
├── Relevance Scoring
└── Top 5 Documents

Types
│
├── Bi-Encoder
├── Cross Encoder
├── Late Interaction
└── LLM Reranker
```

---

# Key Takeaways

- Reranking is a second-stage retrieval process that improves document ordering before generation.
- Cross-Encoders are the preferred reranking approach for many production RAG systems due to their high semantic accuracy.
- Late Interaction models provide a compromise between retrieval speed and ranking quality.
- LLM-based reranking offers powerful reasoning but incurs higher latency and cost.
- Effective reranking enhances answer quality, reduces hallucinations, and improves overall retrieval performance.

---

# References

- LangChain Documentation
- LlamaIndex Documentation
- BAAI BGE Reranker Documentation
- Cohere Rerank Documentation
- ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT
- Jina AI Reranker Documentation

---

## Next Note

**25-hybrid-search-patterns.md** — Learn how enterprise search systems combine dense vector search, sparse keyword search (BM25), metadata filtering, and reranking to maximize retrieval quality across diverse document collections.