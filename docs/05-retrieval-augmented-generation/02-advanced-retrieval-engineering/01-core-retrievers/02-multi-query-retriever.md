# 10. Multi-Query Retriever

> **Category:** Advanced Retrieval Engineering  
> **Module:** Advanced RAG with Vector Databases and Retrievers  
> **Prerequisites:** VectorStore Retriever, Embeddings, Similarity Search, Basic RAG  
> **Difficulty:** Intermediate

---

# Overview

A **Multi-Query Retriever** improves retrieval quality by generating **multiple semantically different versions of the user's query** using a Large Language Model (LLM). Each generated query is independently executed against the vector database, and the retrieved documents are merged before being passed to the LLM.

According to the IBM course, the Multi-Query Retriever extends the VectorStore Retriever by using an LLM to create different versions of the original query, resulting in a richer and more comprehensive set of retrieved documents. :contentReference[oaicite:0]{index=0}

---

# Why Use a Multi-Query Retriever?

Traditional semantic search relies on a **single embedding** of the user's question. If that embedding doesn't capture all possible meanings, relevant documents may be missed.

A Multi-Query Retriever solves this problem by exploring multiple semantic perspectives of the same question.

Instead of:

```
1 Query
↓

1 Search
```

It performs:

```
1 Query
↓

LLM

↓

Multiple Queries

↓

Multiple Searches

↓

Merged Results
```

This significantly improves **retrieval recall**.

---

# Architecture

```text
                User Query
                     │
                     ▼
            Multi-Query Retriever
                     │
                     ▼
              Large Language Model
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
   Query 1        Query 2        Query 3
      │              │              │
      ▼              ▼              ▼
 Vector DB      Vector DB      Vector DB
      │              │              │
      └──────────────┼──────────────┘
                     ▼
        Merge & Remove Duplicates
                     │
                     ▼
            Retrieved Documents
                     │
                     ▼
               Prompt Builder
                     │
                     ▼
                    LLM
                     │
                     ▼
              Final Response
```

---

# How It Works

### Step 1 — User submits a question

```
Explain HNSW indexing.
```

---

### Step 2 — LLM generates multiple query variations

Example

```
Explain HNSW indexing.

↓

How does HNSW work?

↓

Describe Hierarchical Navigable Small World.

↓

Explain graph-based ANN indexing.

↓

How is HNSW used in vector databases?
```

---

### Step 3 — Search the vector database

Each generated query is converted into an embedding and searched independently.

```
Query A → Search

Query B → Search

Query C → Search
```

---

### Step 4 — Merge retrieved documents

Duplicate documents are removed and unique results are combined.

---

### Step 5 — Generate the answer

The merged context is provided to the LLM for response generation.

---

# LangChain Implementation

## Create a Base Retriever

```python
from langchain_chroma import Chroma

vectorstore = Chroma(
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)

base_retriever = vectorstore.as_retriever()
```

---

## Create a Multi-Query Retriever

```python
from langchain.retrievers.multi_query import MultiQueryRetriever

retriever = MultiQueryRetriever.from_llm(
    retriever=base_retriever,
    llm=llm
)
```

---

## Retrieve Documents

```python
query = "Explain HNSW indexing."

documents = retriever.invoke(query)

for doc in documents:
    print(doc.page_content)
```

---

# Using the Retriever in a RAG Pipeline

```python
from langchain_core.runnables import RunnablePassthrough

rag_chain = (
    {
        "context": retriever,
        "question": RunnablePassthrough(),
    }
    | prompt
    | llm
)

response = rag_chain.invoke(
    "How does HNSW improve vector search?"
)
```

---

# Why It Improves Retrieval

Consider the question:

```
How does HNSW work?
```

The LLM may generate:

- Explain Hierarchical Navigable Small World.
- Describe graph-based vector indexing.
- Explain approximate nearest neighbor search.
- How is HNSW used in FAISS?

Each variation retrieves different but relevant documents.

This improves:

- Recall
- Context diversity
- Answer completeness

---

# VectorStore Retriever vs Multi-Query Retriever

| Feature | VectorStore Retriever | Multi-Query Retriever |
|----------|----------------------|-----------------------|
| Number of Searches | One | Multiple |
| Uses LLM | ❌ | ✅ |
| Recall | Medium | High |
| Diversity | Low | High |
| Latency | Low | Higher |
| Cost | Lower | Higher |

---

# Enterprise Use Cases

### Enterprise Knowledge Search

Different teams often describe the same concept using different terminology.

---

### Customer Support

Customers phrase similar problems in different ways.

---

### Research Assistants

Scientific literature contains multiple terms for the same concept.

---

### Legal Document Search

Legal clauses may use varying wording while referring to the same regulation.

---

### Technical Documentation

Developers search using abbreviations, acronyms, or alternative terminology.

---

# Production Best Practices

- Generate only **3–5 query variations**.
- Remove duplicate documents before prompting the LLM.
- Combine with reranking for higher precision.
- Monitor token usage since query generation requires an additional LLM call.
- Evaluate retrieval recall before increasing the number of generated queries.

---

# When to Use

Use a Multi-Query Retriever when:

- User questions are ambiguous.
- Documents contain inconsistent terminology.
- High recall is more important than low latency.
- Knowledge bases are large and heterogeneous.

Use a standard VectorStore Retriever when:

- Low latency is critical.
- The document collection is small.
- Cost optimization is a priority.

---

# Common Mistakes

❌ Generating too many query variations

❌ Ignoring duplicate retrieved documents

❌ Assuming more queries always improve quality

❌ Not measuring retrieval performance

❌ Using Multi-Query Retrieval for every application

---

# Interview Questions

### What problem does a Multi-Query Retriever solve?

It improves retrieval recall by generating multiple semantic variations of a user's query before searching the vector database. :contentReference[oaicite:1]{index=1}

---

### How does it differ from a VectorStore Retriever?

A VectorStore Retriever performs a single search, whereas a Multi-Query Retriever uses an LLM to generate multiple related queries and merges the retrieved results.

---

### Why does it improve recall?

Different query formulations retrieve different relevant documents, increasing the overall coverage of useful information.

---

### What is the trade-off?

Better retrieval quality comes at the cost of additional LLM inference, higher latency, and increased token usage.

---

### Can it replace reranking?

No. Multi-Query Retrieval improves recall, while rerankers improve precision. They are often used together in production RAG systems.

---

# Quick Revision

```text
User Query
      │
      ▼
Large Language Model
      │
      ▼
Multiple Query Variations
      │
      ▼
Multiple Vector Searches
      │
      ▼
Merge Results
      │
      ▼
Prompt Builder
      │
      ▼
LLM
      │
      ▼
Final Answer
```

---

# Key Takeaways

- Multi-Query Retriever extends the VectorStore Retriever using an LLM.
- Multiple query variations improve retrieval recall and context diversity.
- Retrieved documents are merged and deduplicated before prompt generation.
- It is particularly useful for ambiguous queries and large enterprise knowledge bases.
- Compared to a VectorStore Retriever, it delivers higher-quality retrieval at the cost of additional LLM inference and latency. :contentReference[oaicite:2]{index=2}

---

# References

- IBM — *Advanced RAG with Vector Databases and Retrievers* :contentReference[oaicite:3]{index=3}
- LangChain Documentation

---

## Next Note

**11-self-query-retriever.md** — Learn how Self-Query Retrievers combine semantic similarity with metadata filtering to retrieve more accurate and context-aware documents.