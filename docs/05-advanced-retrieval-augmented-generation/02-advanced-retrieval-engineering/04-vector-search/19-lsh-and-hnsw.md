# 19. LSH and HNSW

> **Category:** Advanced Retrieval Engineering  
> **Module:** Advanced RAG with Vector Databases and Retrievers  
> **Prerequisites:** FAISS Fundamentals, FAISS Indexes, Similarity Search  
> **Difficulty:** Intermediate

> **Note:** The IBM course introduces **LSH (Locality Sensitive Hashing)** and **HNSW (Hierarchical Navigable Small World)** as Approximate Nearest Neighbor (ANN) techniques for efficient similarity search. The available course material does not provide an in-depth explanation of their internal algorithms. Therefore, the detailed explanations below are based on the official FAISS literature and standard ANN concepts.

---

# Overview

Modern Retrieval-Augmented Generation (RAG) systems often need to search through **millions or billions of vector embeddings**.

Performing an exhaustive nearest-neighbor search becomes computationally expensive.

To solve this problem, Approximate Nearest Neighbor (ANN) algorithms sacrifice a small amount of accuracy in exchange for **significantly faster retrieval**.

Two well-known ANN approaches are:

- **Locality Sensitive Hashing (LSH)**
- **Hierarchical Navigable Small World (HNSW)**

Both aim to quickly identify vectors that are likely to be similar without comparing the query against every stored vector.

---

# Exact Search vs Approximate Search

```text
Exact Search

Query
 │
 ▼
Compare with Every Vector
 │
 ▼
Exact Result
 │
Slow
```

```text
Approximate Search

Query
 │
 ▼
Search Selected Candidates
 │
 ▼
Nearly Exact Result
 │
Much Faster
```

---

# What is Approximate Nearest Neighbor (ANN)?

Approximate Nearest Neighbor algorithms reduce computation by searching only a subset of vectors.

Instead of guaranteeing the mathematically closest vector, ANN algorithms aim to find vectors that are **close enough** for practical applications.

For RAG systems, this trade-off is often worthwhile because retrieval latency is more important than finding the absolute nearest neighbor.

---

# Locality Sensitive Hashing (LSH)

## Overview

**Locality Sensitive Hashing (LSH)** groups similar vectors into the same hash buckets.

The key idea is simple:

> Similar vectors are more likely to generate the same hash value.

Instead of searching the entire vector database, only vectors in the matching bucket are examined.

---

# LSH Architecture

```text
            Dense Vectors
                  │
                  ▼
         Locality Hash Function
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
     Bucket A  Bucket B  Bucket C
                  │
                  ▼
             User Query
                  │
             Same Hash
                  │
                  ▼
        Search Only Bucket B
```

---

# How LSH Works

### Step 1

Generate embeddings.

---

### Step 2

Apply one or more locality-sensitive hash functions.

---

### Step 3

Store vectors inside hash buckets.

---

### Step 4

Hash the query vector.

---

### Step 5

Search only the matching bucket.

---

# Advantages of LSH

- Very fast retrieval
- Simple implementation
- Suitable for large datasets
- Reduces search space dramatically

---

# Limitations

- Lower recall than graph-based methods
- Performance depends heavily on hash function quality
- May require multiple hash tables

---

# Best Use Cases

- Large-scale document retrieval
- Image retrieval
- Duplicate detection
- Recommendation systems

---

# HNSW (Hierarchical Navigable Small World)

## Overview

**Hierarchical Navigable Small World (HNSW)** is one of the most popular ANN algorithms used in modern vector databases.

Instead of organizing vectors into clusters or buckets, HNSW constructs a **multi-layer graph** where each vector is connected to nearby vectors.

Searching the graph efficiently navigates toward the nearest neighbors.

---

# HNSW Architecture

```text
          Layer 3
             ●

          Layer 2
        ●──────●

          Layer 1
     ●──●──●──●──●

       Bottom Layer
Dense Neighbor Graph
```

Each upper layer contains fewer nodes, enabling long-distance navigation.

The lower layers contain more nodes, enabling precise local search.

---

# How HNSW Works

### Step 1

Insert vectors into the graph.

---

### Step 2

Create connections to nearby vectors.

---

### Step 3

Begin searching from the top layer.

---

### Step 4

Move closer to the query at each layer.

---

### Step 5

Reach the bottom layer and return the nearest neighbors.

---

# HNSW Search Workflow

```text
User Query
      │
      ▼
Top Layer
      │
Find Better Node
      │
Move Down
      │
Move Down
      │
Bottom Layer
      │
Nearest Neighbors
```

---

# Advantages of HNSW

- Extremely fast retrieval
- Excellent recall
- Very low query latency
- No clustering required
- Widely adopted by production vector databases

---

# Limitations

- Higher memory consumption
- More complex index construction
- Slower insertion compared to flat indexes

---

# LSH vs HNSW

| Feature | LSH | HNSW |
|----------|-----|-------|
| Search Strategy | Hash Buckets | Graph Navigation |
| Search Type | Approximate | Approximate |
| Search Speed | Fast | Very Fast |
| Recall | Medium | Very High |
| Memory Usage | Low | Higher |
| Index Construction | Simple | Complex |
| Scalability | High | Very High |
| Best For | Large datasets | Production RAG |

---

# Enterprise Use Cases

### Semantic Search

**HNSW**

Provides high recall with low latency.

---

### Enterprise Chatbots

**HNSW**

Fast document retrieval for conversational AI.

---

### Recommendation Systems

**LSH**

Quickly identify similar users or products.

---

### Image Search

**LSH**

Efficient similarity matching across image embeddings.

---

### Knowledge Management

**HNSW**

Navigate millions of document embeddings efficiently.

---

# LSH vs IVF vs HNSW

| Feature | LSH | IVF | HNSW |
|----------|-----|-----|------|
| Core Idea | Hashing | Clustering | Graph Search |
| Training Required | No | Yes | No |
| Query Speed | Fast | Fast | Very Fast |
| Recall | Medium | High | Very High |
| Memory Usage | Low | Medium | High |
| Build Complexity | Low | Medium | High |
| Best For | Hash-based retrieval | Large datasets | Real-time AI systems |

---

# FAISS Support

FAISS provides implementations for multiple ANN techniques, including:

- Flat Index
- IVF
- HNSW
- Product Quantization
- LSH

Example:

```python
import faiss

dimension = 768

index = faiss.IndexHNSWFlat(
    dimension,
    32
)
```

Example:

```python
index = faiss.IndexLSH(
    dimension,
    1024
)
```

---

# Choosing Between LSH and HNSW

```text
Need Very High Recall?
        │
      Yes
        │
      HNSW
        │
      No
        │
Need Low Memory?
      │
    Yes
      │
     LSH
```

---

# Production Best Practices

- Prefer **HNSW** for modern RAG systems requiring low latency and high recall.
- Consider **LSH** when memory efficiency and simple indexing are priorities.
- Benchmark recall, latency, and memory usage on your own dataset before selecting an ANN algorithm.
- Tune algorithm-specific parameters (such as graph connectivity for HNSW or hash-table configuration for LSH) to match production requirements.
- Rebuild indexes periodically if embeddings change significantly.

---

# Common Mistakes

❌ Assuming approximate search always returns the exact nearest neighbor

❌ Choosing LSH solely because it is simpler

❌ Ignoring memory requirements for HNSW

❌ Evaluating only query speed without measuring recall

❌ Using default ANN parameters for production workloads

---

# Interview Questions

### What problem do LSH and HNSW solve?

They accelerate similarity search by using Approximate Nearest Neighbor (ANN) algorithms instead of exhaustive search.

---

### How does LSH work?

It hashes similar vectors into the same buckets so that only matching buckets need to be searched.

---

### How does HNSW work?

It organizes vectors into a multi-layer graph and navigates through neighboring nodes to efficiently locate similar vectors.

---

### Which algorithm generally provides higher recall?

HNSW typically achieves higher recall than LSH while maintaining very low latency.

---

### Which algorithm uses more memory?

HNSW generally requires more memory because it stores graph connections between vectors.

---

# Quick Revision

```text
Approximate Nearest Neighbor

LSH
│
├── Hash Buckets
├── Low Memory
└── Fast Search

HNSW
│
├── Graph Search
├── High Recall
├── Low Latency
└── Production RAG
```

---

# Key Takeaways

- Approximate Nearest Neighbor (ANN) algorithms enable scalable similarity search for modern AI systems.
- **LSH** groups similar vectors into hash buckets, reducing the search space.
- **HNSW** builds a hierarchical graph that provides excellent recall with extremely low query latency.
- HNSW has become one of the most widely adopted ANN algorithms in production vector search systems.
- Selecting between LSH and HNSW depends on the application's latency, memory, and retrieval-quality requirements.

---

# References

- FAISS Documentation
- Meta AI Research — FAISS
- Malkov & Yashunin, *Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs* (2018)
- IBM — *Advanced RAG with Vector Databases and Retrievers* (Introduces ANN indexing concepts but does not provide detailed algorithm descriptions in the available course material.)

---

## Next Note

**20-faiss-vs-chromadb-vs-milvus.md** — Compare **FAISS**, **ChromaDB**, and **Milvus**, including their architectures, capabilities, scalability, metadata support, persistence, and when to choose each for production RAG systems.