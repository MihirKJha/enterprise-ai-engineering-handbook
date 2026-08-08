# 12. Parent Document Retriever

> **Category:** Advanced Retrieval Engineering  
> **Module:** Advanced RAG with Vector Databases and Retrievers  
> **Prerequisites:** VectorStore Retriever, Multi-Query Retriever, Self-Query Retriever, Text Chunking  
> **Difficulty:** Intermediate

---

# Overview

A **Parent Document Retriever** solves one of the biggest challenges in Retrieval-Augmented Generation (RAG): balancing **retrieval accuracy** with **context preservation**.

Instead of indexing large documents directly, it:

- Splits documents into **small child chunks** for embedding.
- Maintains references to their **larger parent documents**.
- Retrieves the matching child chunks first.
- Returns the complete parent document (or larger section) to the LLM.

According to the IBM course, the Parent Document Retriever uses **two text splitters**:

- A **parent splitter** for creating large chunks.
- A **child splitter** for generating smaller chunks used for embeddings.

During retrieval, it first finds the child chunks, looks up their parent IDs, and returns the corresponding parent document. :contentReference[oaicite:0]{index=0}

---

# Why Use a Parent Document Retriever?

Small chunks improve semantic retrieval because they are more focused.

However, small chunks often lose surrounding context.

Example

Original document

```
Chapter 5
├── Kubernetes Networking
├── Services
├── Ingress
├── Load Balancing
├── Security
└── Best Practices
```

A standard retriever may return only:

```
Ingress handles external traffic...
```

The Parent Document Retriever instead returns the larger section containing that chunk.

```
Kubernetes Networking

Services

Ingress

Load Balancing

Security
```

The LLM receives much richer context.

---

# Architecture

```text
               Large Document
                     │
        Parent Splitter (2000 chars)
                     │
      ┌──────────────┴──────────────┐
      ▼                             ▼
 Parent Chunk A               Parent Chunk B
      │                             │
      ▼                             ▼
 Child Splitter (400 chars)
      │
 ┌────┼────┬────┐
 ▼    ▼    ▼    ▼
C1   C2   C3   C4
 │    │    │    │
 └────┴────┴────┘
      │
Store Parent IDs
      │
      ▼
Vector Database
```

---

# How It Works

### Step 1 — Split into parent chunks

Example

```
200-page manual

↓

20 Parent Chunks
```

---

### Step 2 — Split parent chunks again

Each parent chunk is divided into smaller child chunks.

```
Parent Chunk

↓

Child 1

Child 2

Child 3
```

---

### Step 3 — Store child embeddings

Only the child chunks are embedded and stored in the vector database.

Each child stores:

- Embedding
- Parent ID

---

### Step 4 — Perform retrieval

User query

```
Explain Kubernetes Ingress.
```

Semantic search retrieves:

```
Child Chunk #42
```

---

### Step 5 — Retrieve parent document

Instead of returning Child Chunk #42, the retriever looks up its Parent ID and returns the complete parent section.

---

# Retrieval Flow

```text
User Query
      │
      ▼
Embedding Model
      │
      ▼
Vector Search
      │
      ▼
Child Chunks
      │
Lookup Parent IDs
      │
      ▼
Parent Documents
      │
      ▼
Prompt Builder
      │
      ▼
LLM
```

---

# LangChain Implementation

## Create Splitters

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

parent_splitter = RecursiveCharacterTextSplitter(
    chunk_size=2000
)

child_splitter = RecursiveCharacterTextSplitter(
    chunk_size=400
)
```

---

## Create Parent Document Retriever

```python
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore

store = InMemoryStore()

retriever = ParentDocumentRetriever(
    vectorstore=vectorstore,
    docstore=store,
    parent_splitter=parent_splitter,
    child_splitter=child_splitter,
)
```

---

## Add Documents

```python
retriever.add_documents(documents)
```

---

## Retrieve Documents

```python
results = retriever.invoke(
    "Explain Kubernetes networking."
)

for doc in results:
    print(doc.page_content)
```

---

# Comparison with Other Retrievers

| Feature | VectorStore | Multi-Query | Self-Query | Parent Document |
|----------|-------------|-------------|------------|-----------------|
| Semantic Search | ✅ | ✅ | ✅ | ✅ |
| Metadata Filtering | ❌ | ❌ | ✅ | ❌ |
| Query Expansion | ❌ | ✅ | ❌ | ❌ |
| Context Preservation | ❌ | ❌ | ❌ | ✅ |

---

# Enterprise Use Cases

### Technical Documentation

Retrieve entire chapters instead of isolated paragraphs.

---

### Legal Documents

Return complete contract clauses.

---

### Healthcare

Retrieve complete clinical guidelines rather than fragmented sentences.

---

### Research Papers

Return full sections surrounding relevant findings.

---

### Enterprise Knowledge Bases

Preserve document structure during retrieval.

---

# Production Best Practices

- Keep parent chunks between **1,500–3,000 tokens** depending on the model context window.
- Keep child chunks small (200–500 tokens) for accurate embeddings.
- Use overlapping child chunks when necessary.
- Store parent IDs efficiently.
- Combine with rerankers for improved precision.

---

# Common Mistakes

❌ Embedding entire documents

❌ Using identical sizes for parent and child chunks

❌ Returning child chunks directly

❌ Losing parent-child relationships

❌ Creating excessively large parent chunks

---

# Interview Questions

### Why is a Parent Document Retriever needed?

Small chunks improve retrieval accuracy but lose context. Parent Document Retrievers restore that missing context.

---

### Why are two text splitters required?

One creates large parent chunks for context, while the other creates smaller child chunks for semantic retrieval. :contentReference[oaicite:1]{index=1}

---

### What is stored in the vector database?

Only child chunk embeddings along with references to their parent documents.

---

### What happens during retrieval?

The retriever finds the most relevant child chunks, retrieves their parent IDs, and returns the corresponding parent documents. :contentReference[oaicite:2]{index=2}

---

### When should you use a Parent Document Retriever?

When preserving document context is critical, such as legal, technical, healthcare, or research documents.

---

# Quick Revision

```text
Large Document
      │
      ▼
Parent Splitter
      │
      ▼
Large Chunks
      │
      ▼
Child Splitter
      │
      ▼
Small Chunks
      │
      ▼
Vector Database
      │
      ▼
Semantic Search
      │
      ▼
Lookup Parent IDs
      │
      ▼
Parent Documents
      │
      ▼
LLM
```

---

# Key Takeaways

- Parent Document Retrievers balance retrieval accuracy with context preservation.
- Large parent chunks provide context, while small child chunks improve embedding quality.
- Only child chunks are embedded, but parent documents are returned to the LLM.
- This approach is ideal for long-form documents where context is essential.
- IBM describes the Parent Document Retriever as using **parent and child splitters**, retrieving child chunks first and then returning the associated parent document. :contentReference[oaicite:3]{index=3}

---

# References

- IBM — *Advanced RAG with Vector Databases and Retrievers* :contentReference[oaicite:4]{index=4}
- LangChain Documentation

---

## Next Note

**13-retriever-comparison.md** — Compare VectorStore, Multi-Query, Self-Query, and Parent Document Retrievers to understand their strengths, limitations, and ideal enterprise use cases.