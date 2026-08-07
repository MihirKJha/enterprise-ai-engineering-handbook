# 13. Retriever Comparison

> **Category:** Advanced Retrieval Engineering  
> **Module:** Advanced RAG with Vector Databases and Retrievers  
> **Prerequisites:** VectorStore Retriever, Multi-Query Retriever, Self-Query Retriever, Parent Document Retriever  
> **Difficulty:** Intermediate

---

# Overview

LangChain provides several retrievers designed to solve different retrieval challenges. Choosing the right retriever depends on your application's requirements, such as retrieval accuracy, context preservation, metadata filtering, latency, and cost.

This chapter compares the four primary retrievers covered in the IBM course:

- VectorStore Retriever
- Multi-Query Retriever
- Self-Query Retriever
- Parent Document Retriever

The IBM course introduces each retriever as addressing a different retrieval problem rather than replacing one another. :contentReference[oaicite:0]{index=0}

---

# Retriever Evolution

```text
                    Increasing Intelligence

VectorStore
      │
      ▼
Multi-Query
      │
      ▼
Self-Query
      │
      ▼
Parent Document
```

Each retriever builds on a different capability:

- Better semantic retrieval
- Better recall
- Metadata-aware retrieval
- Better context preservation

---

# Comparison Matrix

| Feature | VectorStore | Multi-Query | Self-Query | Parent Document |
|----------|-------------|-------------|------------|-----------------|
| Semantic Search | ✅ | ✅ | ✅ | ✅ |
| Uses LLM | ❌ | ✅ | ✅ | ❌* |
| Query Expansion | ❌ | ✅ | ❌ | ❌ |
| Metadata Filtering | ❌ | ✅ | ❌ |
| Context Preservation | ❌ | ❌ | ❌ | ✅ |
| Retrieval Recall | Medium | High | High | High |
| Precision | Medium | High | Very High | High |
| Latency | Low | Medium | Medium | Medium |
| Implementation Complexity | Low | Medium | Medium | High |

> *The Parent Document Retriever itself does not require an LLM for retrieval, though it is typically used within an LLM-powered RAG pipeline.

---

# 1. VectorStore Retriever

### How it works

```text
User Query
      │
      ▼
Embedding
      │
      ▼
Vector Database
      │
      ▼
Top-K Chunks
```

### Best For

- Basic semantic search
- Small knowledge bases
- Fast retrieval
- Low-cost RAG

### Limitations

- No metadata filtering
- No query expansion
- Limited context preservation

---

# 2. Multi-Query Retriever

### How it works

```text
User Query
      │
      ▼
LLM
      │
Multiple Queries
      │
Multiple Searches
      │
Merge Results
```

### Best For

- Ambiguous user questions
- Large document collections
- Improving retrieval recall

### Limitations

- Higher latency
- Additional LLM cost
- More retrieved documents to process

---

# 3. Self-Query Retriever

### How it works

```text
User Query
      │
      ▼
LLM
      │
Semantic Query
+
Metadata Filter
      │
      ▼
Filtered Search
```

### Best For

- Enterprise search
- Legal documents
- HR systems
- Compliance platforms

### Limitations

- Requires structured metadata
- Metadata quality directly impacts retrieval

---

# 4. Parent Document Retriever

### How it works

```text
Large Documents
      │
Parent Splitter
      │
Child Splitter
      │
Vector Search
      │
Lookup Parent
      │
Return Parent Context
```

### Best For

- Technical documentation
- Books
- Research papers
- Long enterprise documents

### Limitations

- Additional storage requirements
- More complex ingestion pipeline

---

# Choosing the Right Retriever

| Scenario | Recommended Retriever |
|----------|-----------------------|
| Basic semantic search | VectorStore Retriever |
| Ambiguous user questions | Multi-Query Retriever |
| Metadata-aware search | Self-Query Retriever |
| Long documents | Parent Document Retriever |
| Product manuals | Parent Document Retriever |
| HR document search | Self-Query Retriever |
| Research assistant | Multi-Query Retriever |
| FAQ chatbot | VectorStore Retriever |

---

# Enterprise Examples

### Customer Support Chatbot

```
VectorStore Retriever
```

Fast and simple semantic search across FAQs.

---

### Enterprise Knowledge Portal

```
Self-Query Retriever
```

Users search by:

- Department
- Region
- Author
- Date
- Version

---

### Research Assistant

```
Multi-Query Retriever
```

Improves recall by generating multiple semantic variations of the same question.

---

### Documentation Platform

```
Parent Document Retriever
```

Returns complete documentation sections instead of isolated paragraphs.

---

# Performance Comparison

| Metric | VectorStore | Multi-Query | Self-Query | Parent Document |
|--------|-------------|-------------|------------|-----------------|
| Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Recall | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Precision | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Context | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Cost | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

# Production Recommendations

### Choose a VectorStore Retriever when

- Low latency is important.
- The dataset is relatively small.
- Semantic similarity alone is sufficient.

---

### Choose a Multi-Query Retriever when

- Queries are ambiguous.
- High recall is required.
- Additional LLM cost is acceptable.

---

### Choose a Self-Query Retriever when

- Documents contain rich metadata.
- Users frequently search using structured criteria.
- Precision is more important than speed.

---

### Choose a Parent Document Retriever when

- Documents are long.
- Context preservation is essential.
- Chunk-level retrieval loses important information.

---

# Common Mistakes

❌ Using Multi-Query Retriever for every application

❌ Ignoring metadata during document ingestion

❌ Returning tiny chunks from large technical documents

❌ Optimizing only the LLM instead of the retrieval strategy

❌ Choosing a retriever without evaluating latency and recall

---

# Interview Questions

### Which retriever is the simplest?

VectorStore Retriever.

---

### Which retriever improves retrieval recall?

Multi-Query Retriever by generating multiple semantic query variations. :contentReference[oaicite:1]{index=1}

---

### Which retriever supports metadata filtering?

Self-Query Retriever by converting the user query into a semantic query and a metadata filter. :contentReference[oaicite:2]{index=2}

---

### Which retriever preserves document context?

Parent Document Retriever by retrieving child chunks first and then returning the associated parent document. :contentReference[oaicite:3]{index=3}

---

### Can these retrievers be combined?

The IBM course presents them as different retrieval strategies for different use cases. It does not discuss combining them into hybrid retrieval pipelines. :contentReference[oaicite:4]{index=4}

---

# Quick Revision

```text
VectorStore
│
├── Simple semantic search
├── Fast
└── Low cost

Multi-Query
│
├── Multiple LLM-generated queries
├── Better recall
└── Higher latency

Self-Query
│
├── Semantic search
├── Metadata filters
└── High precision

Parent Document
│
├── Child chunk retrieval
├── Parent document returned
└── Best context preservation
```

---

# Key Takeaways

- **VectorStore Retriever** provides the foundation for semantic retrieval.
- **Multi-Query Retriever** increases recall by generating multiple semantic query variations.
- **Self-Query Retriever** combines semantic search with metadata filtering.
- **Parent Document Retriever** preserves context by retrieving parent documents instead of isolated chunks.
- Each retriever addresses a different retrieval challenge, making the choice dependent on application requirements rather than a single "best" option. :contentReference[oaicite:5]{index=5}

---

# References

- IBM — *Advanced RAG with Vector Databases and Retrievers* :contentReference[oaicite:6]{index=6}
- LangChain Documentation

---

## Next Note

**14-llamaindex-indexes.md** — Explore the core LlamaIndex index types, including **VectorStoreIndex**, **DocumentSummaryIndex**, and **KeywordTableIndex**, and learn when to use each in enterprise RAG applications.