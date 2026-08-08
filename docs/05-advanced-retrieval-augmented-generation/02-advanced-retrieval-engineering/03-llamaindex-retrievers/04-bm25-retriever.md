# 04. BM25 Retriever

> **Category:** LlamaIndex Retrievers
> **Module:** Advanced Retrieval Engineering
> **Prerequisites:** Information Retrieval Fundamentals, LlamaIndex Indexes, Vector Index Retriever
> **Difficulty:** Intermediate

> **Note:** The BM25 Retriever is a lexical retrieval mechanism that ranks documents based on keyword relevance rather than semantic similarity. Unlike vector retrieval, BM25 does not require embeddings and excels at finding exact matches for keywords, identifiers, product names, error codes, and technical terminology. Although semantic retrieval dominates modern RAG systems, BM25 remains an essential component of enterprise search and is commonly combined with vector retrieval to build Hybrid Search systems.

---

# Overview

Before embeddings and Large Language Models became popular, most search engines relied on keyword-based ranking algorithms.

One of the most successful algorithms is **BM25 (Best Matching 25)**.

Instead of understanding semantic meaning, BM25 calculates a relevance score using:

- Query terms
- Document term frequency
- Document length
- Inverse document frequency (IDF)

This makes BM25 particularly effective for retrieving documents containing **specific words or phrases**, especially when exact terminology matters.

Unlike Vector Index Retriever, BM25 does **not** require an embedding model or a vector database.

It operates directly on document text.

---

# Why BM25 Retriever?

Traditional Keyword Search

```text
User Query
      │
      ▼
Exact String Matching
      │
      ▼
Matching Documents
```

Problems

- No ranking
- Weak relevance scoring
- Poor handling of document length
- Cannot prioritize important terms

---

BM25 Retrieval

```text
User Query
      │
      ▼
Tokenization
      │
      ▼
BM25 Ranking
      │
      ▼
Top-K Documents
```

Benefits

- Intelligent keyword ranking
- No embedding model required
- Fast retrieval
- Excellent exact-match performance
- Low computational cost

---

# High-Level Architecture

```text
                 Documents
                      │
                      ▼
                 Tokenization
                      │
                      ▼
               Inverted Index
                      │
────────────────────────────────────
                  User Query
                      │
                      ▼
                 Query Tokens
                      │
                      ▼
                BM25 Retriever
                      │
                      ▼
                Relevance Ranking
                      │
                      ▼
                 Top-K Documents
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
Tokenization
      │
      ▼
Keyword Matching
      │
      ▼
BM25 Ranking
      │
      ▼
Top-K Documents
      │
      ▼
LLM
```

---

# How BM25 Retriever Works

## Step 1 – Parse Documents

Documents are divided into nodes.

```text
Document

↓

Node 1

Node 2

Node 3
```

---

## Step 2 – Build an Inverted Index

Instead of generating embeddings, BM25 creates an inverted index.

Example

```text
"vacation"

↓

Node 2

Node 7

Node 15
```

The inverted index maps every word to the documents that contain it.

---

## Step 3 – User Query

Example

```
Vacation Policy
```

---

## Step 4 – Tokenization

The query is split into tokens.

```text
Vacation

Policy
```

---

## Step 5 – Score Documents

BM25 calculates a relevance score for every matching document.

Factors include:

- Keyword frequency
- Rare terms
- Document length
- Number of matching terms

Documents with higher scores appear first.

---

## Step 6 – Return Top-K Results

```text
BM25 Scores

↓

Rank Documents

↓

Top-K

↓

LLM
```

---

# BM25 Scoring Factors

BM25 ranks documents using several important factors.

### Term Frequency (TF)

Documents containing a keyword multiple times receive a higher score.

Example

```text
Vacation

Vacation

Vacation
```

Higher frequency generally increases relevance.

---

### Inverse Document Frequency (IDF)

Rare words are considered more informative than common words.

Example

```text
"Kubernetes"

↓

Higher Weight
```

Compared to

```text
"System"

↓

Lower Weight
```

---

### Document Length

Very long documents receive normalization to avoid unfairly favoring documents simply because they contain more words.

---

### Combined Relevance Score

BM25 combines TF, IDF, and document length normalization to produce a final ranking score.

---

# Keyword Search Example

Knowledge Base

```text
Document A
Employee Vacation Policy

Document B
Benefits Overview

Document C
Travel Expense Policy
```

Query

```
Vacation Policy
```

Results

```text
Document A
Score = High

Document C
Score = Medium

Document B
Score = Low
```

---

# BM25 vs Vector Retrieval

| Feature | BM25 Retriever | Vector Index Retriever |
|----------|----------------|-------------------------|
| Search Type | Keyword | Semantic |
| Embeddings Required | No | Yes |
| Understands Meaning | No | Yes |
| Exact Keyword Match | Excellent | Moderate |
| Synonym Support | No | Excellent |
| Infrastructure | Inverted Index | Vector Database |
| Best For | Exact Search | Semantic Search |

---

# Hybrid Search

Enterprise RAG systems often combine BM25 and Vector Retrieval.

Architecture

```text
                    User Query
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
BM25 Retriever                Vector Retriever
        │                                 │
        └──────────────┬──────────────────┘
                       ▼
               Merge Results
                       │
                       ▼
                  Reranker
                       │
                       ▼
                      LLM
```

Benefits

- Exact keyword matching
- Semantic understanding
- Higher recall
- Better precision

Hybrid Search is considered the production standard for many enterprise AI systems.

---

# LangChain Comparison

```text
LlamaIndex

BM25 Retriever

↓

Query Engine

↓

LLM
```

Equivalent LangChain architecture

```text
BM25Retriever

↓

Retrieval Chain

↓

LLM
```

Both frameworks support combining BM25 with vector retrieval to build hybrid search pipelines.

---

# Enterprise Use Cases

### API Documentation

Retrieve endpoints, classes, methods, and parameter names.

---

### Software Engineering

Search error codes, stack traces, log messages, and configuration keys.

---

### Product Catalogs

Retrieve products using model numbers or SKUs.

---

### Legal Search

Find contracts containing exact legal clauses or statutory references.

---

### Healthcare

Search drug names, diagnosis codes, and medical terminology.

---

# Advantages

- No embeddings required
- Fast retrieval
- Low operational cost
- Excellent keyword precision
- Mature and well-understood algorithm
- Works well with technical terminology

---

# Limitations

- Cannot understand semantic meaning
- No synonym recognition
- Misses conceptually similar documents
- Sensitive to vocabulary mismatch
- Lower recall for natural language questions

---

# Production Best Practices

- Use BM25 for exact keyword retrieval.
- Combine BM25 with Vector Retriever for Hybrid Search.
- Apply metadata filters before ranking.
- Use rerankers to improve final document ordering.
- Tune Top-K values based on evaluation metrics.
- Monitor retrieval quality for domain-specific terminology.

---

# Common Mistakes

- Using BM25 alone for conversational AI.
- Expecting BM25 to understand semantic intent.
- Ignoring vocabulary differences.
- Retrieving too many documents.
- Not combining BM25 with semantic search in enterprise RAG systems.

---

# Interview Questions

### What is BM25?

### How does BM25 differ from Vector Retrieval?

### Why doesn't BM25 require embeddings?

### When should BM25 be preferred over semantic search?

### Why is BM25 still important in modern RAG systems?

### What is Hybrid Search?

---

# Quick Revision

```text
Documents
      │
Tokenization
      │
Inverted Index
      │
────────────────────────
User Query
      │
Tokenization
      │
BM25 Retriever
      │
Keyword Ranking
      │
Top-K Documents
      │
LLM
```

---

# Key Takeaways

- BM25 Retriever performs lexical retrieval based on keyword relevance rather than semantic similarity.
- It relies on an inverted index and ranks documents using term frequency, inverse document frequency, and document length normalization.
- BM25 excels at retrieving exact keywords, identifiers, product names, API endpoints, and technical terminology.
- Modern enterprise RAG systems commonly combine BM25 with Vector Index Retriever to implement Hybrid Search.
- BM25 remains an essential retrieval strategy because exact keyword matching complements semantic search.

---

# References

- LlamaIndex Documentation — BM25 Retriever
- Okapi BM25 Research Paper
- Apache Lucene Documentation
- Elasticsearch Documentation
- Information Retrieval: *Introduction to Information Retrieval* (Manning, Raghavan & Schütze)

---

## Next Note

**05-document-summary-retriever.md** — Learn how the Document Summary Retriever improves retrieval for large documents by retrieving high-level summaries before drilling into detailed content, enabling efficient search across lengthy reports, manuals, and research papers.