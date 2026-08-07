# 18. FAISS Indexes

> **Category:** Advanced Retrieval Engineering  
> **Module:** Advanced RAG with Vector Databases and Retrievers  
> **Prerequisites:** FAISS Fundamentals, Vector Embeddings, Similarity Search  
> **Difficulty:** Intermediate

> **Note:** The IBM course introduces FAISS as supporting multiple indexing techniques to balance retrieval speed, memory usage, and search accuracy. However, the uploaded course material available to me does not contain detailed descriptions of individual FAISS index types (such as IndexFlat, IVF, HNSW, or Product Quantization). Therefore, the explanations below are based on the official FAISS concepts rather than IBM course text.

---

# Overview

A **FAISS Index** is the internal data structure that organizes vector embeddings for efficient nearest-neighbor search.

Different index types make different trade-offs between:

- Search speed
- Search accuracy
- Memory consumption
- Index build time

There is **no universally best index**. The appropriate choice depends on the size of the vector database, latency requirements, available hardware, and acceptable accuracy.

---

# Why Multiple Index Types?

Searching every vector individually guarantees perfect accuracy but becomes increasingly expensive as datasets grow.

For example:

```
1,000 vectors
│
Sequential search → Fast enough
```

```
100 Million vectors
│
Sequential search → Too slow
```

FAISS provides multiple indexing strategies that dramatically reduce search time while maintaining high retrieval quality.

---

# FAISS Index Architecture

```text
                    Dense Vectors
                         │
                         ▼
                 Select FAISS Index
                         │
      ┌──────────┬──────────┬──────────┐
      ▼          ▼          ▼          ▼
 IndexFlat     IVF        HNSW        PQ
      │          │          │          │
      └──────────┼──────────┼──────────┘
                 ▼
        Approximate Search
                 │
                 ▼
         Top-K Similar Vectors
```

---

# Index Selection

| Dataset Size | Recommended Index |
|--------------|------------------|
| < 100K vectors | IndexFlat |
| 100K–10M vectors | IVF |
| Millions of vectors with low latency | HNSW |
| Very large datasets with memory constraints | Product Quantization |

---

# 1. IndexFlat

## Overview

**IndexFlat** performs an exhaustive search by comparing the query vector against every stored vector.

It provides **exact nearest-neighbor search**, making it the most accurate FAISS index.

---

## Architecture

```text
Query
  │
Compare with
Every Vector
  │
Sort Distances
  │
Top-K Results
```

---

## Implementation

```python
import faiss

dimension = 768

index = faiss.IndexFlatL2(dimension)
```

---

## Advantages

- Exact search
- Highest accuracy
- Simple implementation
- No training required

---

## Limitations

- Slow for large datasets
- High computational cost

---

## Best Use Cases

- Small vector databases
- Benchmarking
- Evaluation pipelines
- Development environments

---

# 2. IVF (Inverted File Index)

## Overview

Instead of searching every vector, **IVF** partitions vectors into clusters.

During retrieval, FAISS searches only the most relevant clusters, greatly reducing search time.

---

## Architecture

```text
Vectors
   │
Cluster Training
   │
───────────────
Cluster A

Cluster B

Cluster C
───────────────
      │
Query
      │
Find Closest Cluster
      │
Search Inside Cluster
```

---

## Implementation

```python
quantizer = faiss.IndexFlatL2(dimension)

index = faiss.IndexIVFFlat(
    quantizer,
    dimension,
    100
)

index.train(embeddings)
index.add(embeddings)
```

---

## Advantages

- Much faster than IndexFlat
- Scales to millions of vectors
- Configurable search accuracy

---

## Limitations

- Requires training
- Approximate results
- Parameter tuning required

---

## Best Use Cases

- Production RAG
- Enterprise search
- Large knowledge bases

---

# 3. HNSW (Hierarchical Navigable Small World)

## Overview

HNSW organizes vectors into a multi-layer graph.

Instead of checking clusters, it navigates the graph to efficiently locate nearby vectors.

---

## Architecture

```text
Layer 3
    ●

Layer 2
 ●────●

Layer 1
●──●──●──●

Bottom Layer
Dense Graph
```

---

## Implementation

```python
index = faiss.IndexHNSWFlat(
    dimension,
    32
)
```

---

## Advantages

- Very low latency
- Excellent recall
- No clustering step
- Fast query performance

---

## Limitations

- Larger memory usage
- Slower index construction

---

## Best Use Cases

- Real-time AI applications
- Interactive chatbots
- Recommendation engines
- Production semantic search

---

# 4. Product Quantization (PQ)

## Overview

Product Quantization compresses vectors into compact representations.

Rather than storing every floating-point value, FAISS stores compressed codes, significantly reducing memory usage.

---

## Architecture

```text
Original Vector
      │
Compression
      │
Compact Codes
      │
Similarity Search
```

---

## Implementation

```python
index = faiss.IndexPQ(
    dimension,
    16,
    8
)
```

---

## Advantages

- Extremely memory efficient
- Supports billion-scale datasets
- Faster storage and transfer

---

## Limitations

- Lower search accuracy
- Compression introduces approximation

---

## Best Use Cases

- Billion-vector datasets
- Memory-constrained environments
- Large-scale recommendation systems

---

# Index Comparison

| Feature | IndexFlat | IVF | HNSW | PQ |
|---------|-----------|-----|------|----|
| Exact Search | ✅ | ❌ | ❌ | ❌ |
| Approximate Search | ❌ | ✅ | ✅ | ✅ |
| Training Required | ❌ | ✅ | ❌ | ✅ |
| Memory Usage | High | Medium | High | Low |
| Query Speed | Slow | Fast | Very Fast | Fast |
| Accuracy | Highest | High | Very High | Medium |
| Best Dataset Size | Small | Large | Large | Very Large |

---

# Choosing the Right Index

```text
Need Exact Results?
        │
      Yes
        │
   IndexFlat
        │
      No
        │
Large Dataset?
        │
      Yes
        │
Need Low Memory?
      │        │
     Yes      No
      │        │
      PQ     Low Latency?
                │
           Yes      No
            │        │
          HNSW      IVF
```

---

# Enterprise Use Cases

### Development & Testing

**IndexFlat**

Evaluate embedding quality with exact search.

---

### Enterprise Knowledge Base

**IVF**

Balance speed and retrieval quality for millions of documents.

---

### AI Chatbots

**HNSW**

Provide low-latency semantic retrieval.

---

### Large Recommendation Systems

**PQ**

Compress billions of embeddings while maintaining acceptable search quality.

---

# Production Best Practices

- Start with **IndexFlat** during development to establish a quality baseline.
- Use **IVF** for medium-to-large production datasets.
- Choose **HNSW** for latency-sensitive applications.
- Use **Product Quantization** when memory becomes the primary constraint.
- Benchmark recall, latency, memory usage, and index build time before selecting an index.

---

# Common Mistakes

❌ Using IndexFlat for hundreds of millions of vectors

❌ Forgetting to train IVF or PQ indexes before adding vectors

❌ Choosing PQ when maximum retrieval accuracy is required

❌ Ignoring memory requirements when selecting HNSW

❌ Evaluating only query speed without measuring recall

---

# Interview Questions

### What is an IndexFlat index?

It performs an exhaustive nearest-neighbor search by comparing the query against every stored vector.

---

### Why does IVF scale better than IndexFlat?

Because IVF searches only a subset of clustered vectors rather than the entire dataset.

---

### What is the main advantage of HNSW?

Very low-latency approximate nearest-neighbor search with high recall.

---

### Why use Product Quantization?

To significantly reduce memory consumption while supporting similarity search on very large datasets.

---

### Which FAISS index is best?

There is no universal best index. The appropriate choice depends on the required balance between accuracy, latency, memory usage, and dataset size.

---

# Quick Revision

```text
IndexFlat
│
├── Exact Search
├── Small datasets
└── Highest accuracy

IVF
│
├── Cluster-based search
├── Large datasets
└── Fast retrieval

HNSW
│
├── Graph-based search
├── Very low latency
└── High recall

Product Quantization
│
├── Compressed vectors
├── Low memory
└── Billion-scale search
```

---

# Key Takeaways

- FAISS offers multiple index types to optimize similarity search for different workloads.
- **IndexFlat** provides exact search and serves as a strong baseline.
- **IVF** improves scalability by searching clustered subsets of vectors.
- **HNSW** delivers high recall with very low query latency through graph-based navigation.
- **Product Quantization (PQ)** compresses vectors to enable memory-efficient search on massive datasets.
- Selecting the right index requires evaluating trade-offs among search accuracy, latency, memory usage, and scalability.

---

# References

- FAISS Documentation
- Meta AI Research — FAISS
- IBM — *Advanced RAG with Vector Databases and Retrievers* (Introduces FAISS indexing concepts but does not detail individual index types in the available course material.)

---

## Next Note

**19-lsh-and-hnsw.md** — Learn how **Locality Sensitive Hashing (LSH)** and **Hierarchical Navigable Small World (HNSW)** enable efficient Approximate Nearest Neighbor (ANN) search and why they are widely used in modern vector search systems.