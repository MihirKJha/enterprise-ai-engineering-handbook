# 17. FAISS Fundamentals

> **Category:** Advanced Retrieval Engineering  
> **Module:** Advanced RAG with Vector Databases and Retrievers  
> **Prerequisites:** Vector Embeddings, Vector Databases, Similarity Search  
> **Difficulty:** Intermediate

---

# Overview

**FAISS (Facebook AI Similarity Search)** is an open-source library developed by Meta AI for efficient similarity search and clustering of dense vectors.

Unlike traditional databases that perform exact searches, FAISS is optimized to search through **millions or even billions of high-dimensional vectors** with very low latency, making it one of the most widely used libraries for Retrieval-Augmented Generation (RAG), recommendation systems, semantic search, and image retrieval.

According to the IBM course, FAISS is designed for efficient similarity search over dense vector embeddings and provides multiple indexing techniques to balance search accuracy, memory usage, and retrieval speed. :contentReference[oaicite:0]{index=0}

---

# Why FAISS?

Modern AI applications generate vector embeddings for every document, image, or audio sample.

Searching every vector sequentially becomes computationally expensive.

Example

```
Knowledge Base

1,000 Documents
       ↓

1,000 Embeddings
```

Sequential comparison

```
Query
  │
Compare with 1,000 vectors
```

Large-scale production systems

```
Query
   │
Compare with 100 Million vectors
```

Without optimized indexing, retrieval becomes impractical.

FAISS addresses this challenge using specialized vector indexes.

---

# FAISS Architecture

```text
                 Documents
                      │
                      ▼
              Embedding Model
                      │
                      ▼
                 Dense Vectors
                      │
                      ▼
               FAISS Index
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
 Flat Index      IVF Index      HNSW Index
                      │
                      ▼
             Similarity Search
                      │
                      ▼
             Top-K Neighbors
                      │
                      ▼
                      LLM
```

---

# How FAISS Works

### Step 1 — Generate embeddings

Each document is converted into a dense vector.

```
Document

↓

Embedding

↓

768-dimensional vector
```

---

### Step 2 — Build an index

The vectors are organized into an optimized FAISS index.

```
Vectors

↓

Index
```

---

### Step 3 — Embed the query

```
User Query

↓

Embedding
```

---

### Step 4 — Perform nearest-neighbor search

Instead of comparing against every vector, FAISS efficiently searches the index.

---

### Step 5 — Return Top-K vectors

```
Top 5 Similar Documents
```

These are provided to the RAG pipeline.

---

# Similarity Search Workflow

```text
User Query
      │
      ▼
Embedding Model
      │
      ▼
Query Vector
      │
      ▼
FAISS Index
      │
Nearest Neighbor Search
      │
      ▼
Top-K Similar Vectors
      │
      ▼
Retrieved Documents
      │
      ▼
LLM
```

---

# Basic FAISS Implementation

## Install

```bash
pip install faiss-cpu
```

For GPU support:

```bash
pip install faiss-gpu
```

---

## Create a Flat Index

```python
import faiss
import numpy as np

dimension = 768

index = faiss.IndexFlatL2(dimension)
```

---

## Add Embeddings

```python
embeddings = np.random.random(
    (1000, dimension)
).astype("float32")

index.add(embeddings)
```

---

## Search

```python
query = np.random.random(
    (1, dimension)
).astype("float32")

distances, indices = index.search(
    query,
    k=5
)

print(indices)
```

---

# Distance Metrics

FAISS supports multiple distance metrics.

| Metric | Description | Common Use Case |
|----------|-------------|-----------------|
| L2 Distance | Euclidean distance | General similarity search |
| Inner Product | Dot product | Recommendation systems |
| Cosine Similarity* | Normalized inner product | Semantic search |

> *Cosine similarity is typically implemented by normalizing vectors and using an inner-product index.

---

# Advantages of FAISS

- Extremely fast vector search
- Scales to millions or billions of vectors
- Multiple indexing algorithms
- CPU and GPU support
- Memory-efficient search
- Widely integrated with LangChain and LlamaIndex

---

# Limitations

- Focused only on vector search (not a complete database)
- No built-in metadata storage
- No user authentication or access control
- Metadata filtering must be handled externally

---

# FAISS vs Traditional Database

| Feature | Traditional Database | FAISS |
|----------|----------------------|--------|
| Structured Data | ✅ | ❌ |
| SQL Queries | ✅ | ❌ |
| Vector Search | ❌ | ✅ |
| Approximate Nearest Neighbor Search | ❌ | ✅ |
| Metadata Management | ✅ | ❌ |
| Optimized for Embeddings | ❌ | ✅ |

---

# Enterprise Use Cases

### Retrieval-Augmented Generation (RAG)

Store document embeddings for semantic retrieval.

---

### Enterprise Search

Search internal documentation using semantic similarity.

---

### Recommendation Systems

Find products or content with similar embeddings.

---

### Image Search

Retrieve visually similar images.

---

### Anomaly Detection

Locate unusual vectors by comparing embedding distances.

---

# Production Best Practices

- Normalize embeddings consistently when using cosine similarity.
- Select an index type based on latency, memory, and accuracy requirements.
- Use GPU indexes for very large datasets when available.
- Persist indexes to disk for faster application startup.
- Benchmark retrieval quality and latency before production deployment.

---

# Common Mistakes

❌ Comparing embeddings with inconsistent dimensions

❌ Mixing different embedding models in the same index

❌ Forgetting to normalize vectors for cosine similarity

❌ Assuming FAISS stores metadata

❌ Using a Flat index for very large datasets without evaluating approximate indexes

---

# Interview Questions

### What is FAISS?

FAISS is an open-source library for efficient similarity search and clustering of dense vector embeddings. :contentReference[oaicite:1]{index=1}

---

### Why is FAISS widely used in RAG?

Because it performs fast nearest-neighbor search across large collections of vector embeddings.

---

### Does FAISS store metadata?

No. FAISS focuses on vector indexing and similarity search. Metadata is typically stored separately.

---

### What input does FAISS require?

Dense vector embeddings generated by an embedding model.

---

### Is FAISS a vector database?

No. FAISS is a **vector search library**, not a complete vector database. Production vector databases often use FAISS internally or provide similar indexing techniques.

---

# Quick Revision

```text
Documents
      │
      ▼
Embeddings
      │
      ▼
FAISS Index
      │
Nearest Neighbor Search
      │
      ▼
Top-K Results
      │
      ▼
LLM
```

---

# Key Takeaways

- FAISS is a high-performance library for similarity search over dense vector embeddings.
- It is widely used in RAG pipelines because it scales efficiently to millions of vectors.
- FAISS supports multiple indexing strategies to balance search speed, accuracy, and memory consumption.
- It focuses exclusively on vector indexing and retrieval, leaving metadata management to external systems.
- The IBM course introduces FAISS as a scalable similarity-search solution with multiple indexing techniques for production AI applications. :contentReference[oaicite:2]{index=2}

---

# References

- IBM — *Advanced RAG with Vector Databases and Retrievers* :contentReference[oaicite:3]{index=3}
- FAISS Documentation

---

## Next Note

**18-faiss-indexes.md** — Explore the major FAISS index types, including **IndexFlat**, **IVF (Inverted File Index)**, **HNSW**, and **Product Quantization (PQ)**, and learn how to choose the right index for enterprise-scale vector search.