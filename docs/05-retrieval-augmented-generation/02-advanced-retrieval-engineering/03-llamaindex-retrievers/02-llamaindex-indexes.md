# 02. LlamaIndex Indexes

> **Category:** LlamaIndex Retrievers
> **Module:** Advanced Retrieval Engineering
> **Prerequisites:** Embeddings, Vector Databases, RAG Fundamentals, LlamaIndex Retrieval Overview
> **Difficulty:** Intermediate

> **Note:** Indexes are one of the core building blocks of LlamaIndex. They determine how documents are organized, stored, traversed, and retrieved before being passed to a retriever or query engine. Choosing the appropriate index significantly impacts retrieval quality, latency, scalability, and overall RAG performance. This chapter introduces the major index types available in LlamaIndex and explains when each should be used in enterprise AI systems.

---

# Overview

In every Retrieval-Augmented Generation (RAG) system, documents must be organized into a searchable structure before retrieval can occur.

In LlamaIndex, this searchable structure is called an **Index**.

Unlike traditional databases that simply store data, LlamaIndex indexes organize document nodes to optimize different retrieval strategies.

Different indexes are designed for different workloads.

For example:

- Semantic search
- Keyword search
- Long document summarization
- Hierarchical document traversal
- Graph-based knowledge retrieval

Selecting the correct index is often more important than selecting the retriever because the retriever operates on the data organization provided by the index.

---

# Why Indexes?

Without an Index

```text
             Documents
                 │
                 ▼
          Sequential Search
                 │
                 ▼
          Retrieved Results
```

Problems

- Slow retrieval
- Poor scalability
- No semantic organization
- Difficult to search millions of documents

---

With an Index

```text
             Documents
                  │
                  ▼
            Node Parsing
                  │
                  ▼
                Index
                  │
                  ▼
             Retriever
                  │
                  ▼
           Relevant Nodes
```

Benefits

- Faster retrieval
- Better scalability
- Organized document structure
- Improved retrieval quality
- Multiple retrieval strategies

---

# Index Architecture

```text
                 Documents
                      │
                      ▼
               Document Loader
                      │
                      ▼
                 Node Parser
                      │
                      ▼
                   Nodes
                      │
                      ▼
                    Index
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Retriever     Query Engine   Postprocessor
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                      LLM
```

---

# Index Creation Pipeline

```text
Raw Documents
      │
      ▼
Document Loader
      │
      ▼
Node Parser
      │
      ▼
Create Nodes
      │
      ▼
Generate Embeddings
      │
      ▼
Build Index
      │
      ▼
Ready for Retrieval
```

---

# Core Index Types

LlamaIndex provides several index implementations optimized for different retrieval patterns.

---

# 1. Vector Store Index

The **Vector Store Index** is the most commonly used index in modern RAG systems.

Each node is converted into an embedding and stored in a vector database.

Retrieval is performed using semantic similarity.

Architecture

```text
Documents
      │
      ▼
Nodes
      │
      ▼
Embeddings
      │
      ▼
Vector Store
      │
      ▼
Similarity Search
```

Best For

- Semantic Search
- Enterprise RAG
- AI Assistants
- Knowledge Bases

Advantages

- Fast semantic retrieval
- Excellent scalability
- Works with external vector databases

Limitations

- Requires embeddings
- Keyword matching may be weaker than lexical search

---

# 2. Summary Index

The Summary Index stores document summaries instead of retrieving every document chunk directly.

Rather than searching every node, retrieval begins with summarized content before drilling into detailed sections.

Architecture

```text
Documents
      │
      ▼
Generate Summaries
      │
      ▼
Summary Index
      │
      ▼
Relevant Document
      │
      ▼
Detailed Retrieval
```

Best For

- Long reports
- Research papers
- Legal contracts
- Enterprise documentation

Advantages

- Faster document discovery
- Reduced search space
- Better handling of lengthy documents

Limitations

- Additional summarization step
- Summary quality affects retrieval

---

# 3. Tree Index

Tree Index organizes nodes into a hierarchical tree.

Parent nodes summarize child nodes, enabling recursive navigation through large documents.

Architecture

```text
          Root
         /    \
      Parent Parent
      /  \     /  \
    Node Node Node Node
```

Best For

- Books
- Manuals
- Hierarchical documentation
- Technical specifications

Advantages

- Hierarchical navigation
- Efficient recursive retrieval
- Good for structured documents

Limitations

- More expensive index construction
- Additional traversal logic

---

# 4. Keyword Table Index

The Keyword Table Index creates mappings between keywords and document nodes.

Retrieval is based on lexical matching rather than semantic similarity.

Architecture

```text
Keywords
     │
     ▼
Keyword Table
     │
     ▼
Matching Nodes
```

Best For

- Product IDs
- Error codes
- API names
- Configuration values
- Technical documentation

Advantages

- Exact keyword retrieval
- Fast lookups
- No embedding model required

Limitations

- Limited semantic understanding
- Synonyms may not match

---

# 5. Knowledge Graph Index

The Knowledge Graph Index extracts entities and relationships from documents to build a graph structure.

Instead of retrieving isolated chunks, it retrieves connected knowledge.

Architecture

```text
Documents
      │
      ▼
Entity Extraction
      │
      ▼
Knowledge Graph
      │
      ▼
Graph Traversal
```

Example

```text
Customer

↓

Order

↓

Payment

↓

Invoice
```

Best For

- Enterprise knowledge graphs
- Healthcare
- Finance
- Legal systems
- Relationship-based retrieval

Advantages

- Captures entity relationships
- Supports reasoning across documents
- Rich contextual retrieval

Limitations

- Complex index construction
- Higher storage requirements

---

# Choosing the Right Index

| Index | Retrieval Type | Best For |
|--------|----------------|----------|
| Vector Store Index | Semantic | Enterprise RAG |
| Summary Index | Summary-first | Long Documents |
| Tree Index | Hierarchical | Books & Manuals |
| Keyword Table Index | Lexical | Exact Search |
| Knowledge Graph Index | Relationship-based | Connected Knowledge |

---

# Index Selection Flow

```text
Need Semantic Search?
        │
       Yes
        │
        ▼
Vector Store Index

Need Long Document Search?

        ▼
Summary Index

Need Hierarchical Navigation?

        ▼
Tree Index

Need Exact Keywords?

        ▼
Keyword Table Index

Need Entity Relationships?

        ▼
Knowledge Graph Index
```

---

# Enterprise Use Cases

### Enterprise Knowledge Assistant

Use **Vector Store Index** for semantic retrieval across internal documentation.

---

### Research Platforms

Use **Summary Index** to identify relevant reports before exploring detailed sections.

---

### Product Documentation

Use **Tree Index** for navigating manuals and technical guides.

---

### Software Development

Use **Keyword Table Index** to retrieve API names, configuration keys, and error codes.

---

### Fraud Detection

Use **Knowledge Graph Index** to analyze relationships between customers, accounts, and transactions.

---

# LangChain Comparison

| LlamaIndex | Closest LangChain Equivalent |
|------------|------------------------------|
| Vector Store Index | Vector Store |
| Summary Index | Document Summaries + Retriever |
| Tree Index | Parent Document Retrieval |
| Keyword Table Index | BM25 / Keyword Retriever |
| Knowledge Graph Index | Graph Retriever / Knowledge Graph Integration |

LlamaIndex provides richer built-in indexing abstractions, whereas LangChain focuses more on composing retrieval pipelines.

---

# Best Practices

- Use **Vector Store Index** as the default for most RAG systems.
- Use **Summary Index** for large documents exceeding LLM context windows.
- Combine **Keyword Table Index** with semantic retrieval for hybrid search.
- Use **Knowledge Graph Index** when relationships between entities are critical.
- Design indexes based on data characteristics rather than using a single index for every workload.
- Rebuild or refresh indexes as source documents evolve.

---

# Common Mistakes

- Confusing indexes with retrievers.
- Using only one index type for every application.
- Ignoring document structure during indexing.
- Creating excessively large nodes.
- Forgetting to update indexes after document changes.

---

# Interview Questions

### What is an Index in LlamaIndex?

### How does an Index differ from a Retriever?

### When should you use a Summary Index instead of a Vector Store Index?

### What problem does the Tree Index solve?

### Why is the Knowledge Graph Index useful for enterprise AI?

### Can multiple indexes be used in the same RAG system?

---

# Quick Revision

```text
Documents
      │
Node Parser
      │
Nodes
      │
Indexes
      │
├── Vector Store
├── Summary
├── Tree
├── Keyword
└── Knowledge Graph
      │
Retriever
      │
Query Engine
      │
LLM
```

---

# Key Takeaways

- Indexes determine how information is organized before retrieval.
- Different index types are optimized for semantic search, summaries, hierarchical navigation, keyword matching, or relationship-based retrieval.
- The choice of index directly affects retrieval speed, scalability, and answer quality.
- LlamaIndex separates indexing from retrieval, enabling flexible combinations of indexes, retrievers, and query engines.
- Selecting the right index is a foundational design decision when building enterprise RAG systems.

---

# References

- LlamaIndex Documentation — Indexes
- LlamaIndex Documentation — VectorStoreIndex
- LlamaIndex Documentation — Summary Index
- LlamaIndex Documentation — Tree Index
- LlamaIndex Documentation — Keyword Table Index
- LlamaIndex Documentation — Knowledge Graph Index

---

## Next Note

**03-vector-index-retriever.md** — Learn how the Vector Index Retriever performs semantic similarity search over embeddings, making it the default retrieval strategy for most production Retrieval-Augmented Generation (RAG) systems.