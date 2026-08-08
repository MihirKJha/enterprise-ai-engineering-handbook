# 11. Self-Query Retriever

> **Category:** Advanced Retrieval Engineering  
> **Module:** Advanced RAG with Vector Databases and Retrievers  
> **Prerequisites:** VectorStore Retriever, Multi-Query Retriever, Metadata Filtering, Vector Databases  
> **Difficulty:** Intermediate

---

# Overview

A **Self-Query Retriever** enhances semantic search by allowing an LLM to understand **both the semantic meaning of a query and its metadata constraints**.

Instead of performing only vector similarity search, the retriever automatically separates the user's request into:

- A semantic search query
- A metadata filter

According to the IBM course, the Self-Query Retriever converts a user query into **a string for semantic lookup and a metadata filter** that accompanies the search. :contentReference[oaicite:0]{index=0}

---

# Why Use a Self-Query Retriever?

Traditional VectorStore Retrievers answer questions like:

> "Explain Kubernetes."

However, enterprise users often ask more complex questions:

- "Show Kubernetes documents published after 2024."
- "Find AI papers written by Microsoft."
- "Retrieve HR policies for Germany."
- "Find engineering documents tagged as Security."

These queries require:

- Semantic understanding
- Metadata filtering

A Self-Query Retriever performs both automatically.

---

# Architecture

```text
               User Query
                    │
                    ▼
          Self-Query Retriever
                    │
                    ▼
          Large Language Model
          ┌─────────────────────┐
          │ Semantic Query      │
          │ Metadata Filters    │
          └─────────────────────┘
               │           │
               ▼           ▼
        Similarity Search  Metadata Filter
               │           │
               └─────┬─────┘
                     ▼
             Vector Database
                     │
                     ▼
          Filtered Documents
                     │
                     ▼
                    LLM
                     │
                     ▼
               Final Response
```

---

# How It Works

### Step 1 — User asks a question

```
Find AI papers published after 2024
by IBM researchers.
```

---

### Step 2 — LLM analyzes the query

The retriever separates the request into:

**Semantic Query**

```
AI papers
```

**Metadata Filter**

```text
author = IBM

year > 2024
```

---

### Step 3 — Execute the search

The vector database performs:

- Semantic similarity search
- Metadata filtering

---

### Step 4 — Return matching documents

Only documents satisfying **both** conditions are returned.

---

# Query Decomposition Example

| User Query | Semantic Query | Metadata Filter |
|------------|----------------|-----------------|
| Find Python books after 2023 | Python books | year > 2023 |
| HR policies for Germany | HR policies | country = Germany |
| AI papers by Microsoft | AI papers | author = Microsoft |
| Kubernetes docs tagged Security | Kubernetes | tag = Security |

---

# LangChain Implementation

## Define Metadata Fields

```python
from langchain.chains.query_constructor.base import AttributeInfo

metadata_field_info = [
    AttributeInfo(
        name="author",
        description="Document author",
        type="string",
    ),
    AttributeInfo(
        name="year",
        description="Publication year",
        type="integer",
    ),
]
```

---

## Create the Retriever

```python
from langchain.retrievers.self_query.base import SelfQueryRetriever

retriever = SelfQueryRetriever.from_llm(
    llm=llm,
    vectorstore=vectorstore,
    document_contents="Technical documentation",
    metadata_field_info=metadata_field_info,
)
```

---

## Retrieve Documents

```python
documents = retriever.invoke(
    "Find AI papers published after 2024 by IBM."
)

for doc in documents:
    print(doc.page_content)
```

---

# Metadata Filtering Example

Suppose your vector database stores:

| Title | Author | Year | Department |
|------|--------|------|------------|
| AI Guide | IBM | 2025 | Research |
| Kubernetes Handbook | Google | 2024 | Cloud |
| HR Policy | Company | 2023 | HR |

User query:

```
Find AI papers by IBM after 2024.
```

Generated filter:

```python
{
    "author": "IBM",
    "year": {
        "$gt": 2024
    }
}
```

Only matching documents are retrieved.

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
    "Find cloud architecture documents created after 2023."
)
```

---

# VectorStore Retriever vs Self-Query Retriever

| Feature | VectorStore | Self-Query |
|----------|-------------|------------|
| Semantic Search | ✅ | ✅ |
| Metadata Filtering | ❌ | ✅ |
| Uses LLM | ❌ | ✅ |
| Query Understanding | Basic | Advanced |
| Enterprise Search | Limited | Excellent |

---

# Enterprise Use Cases

### Enterprise Document Search

Find security documents created after a specific date.

---

### HR Systems

Retrieve employee policies by region or department.

---

### Legal Search

Search contracts by client, date, or jurisdiction.

---

### Research Portals

Find publications by author, organization, or year.

---

### Product Documentation

Retrieve manuals for a specific product version.

---

# Production Best Practices

- Store rich metadata during document ingestion.
- Keep metadata fields consistent across documents.
- Define clear metadata descriptions for the LLM.
- Combine metadata filtering with similarity search.
- Evaluate both retrieval accuracy and filter correctness.

---

# Common Mistakes

❌ Missing metadata during document ingestion

❌ Inconsistent metadata names

❌ Using free-text values instead of structured metadata

❌ Expecting semantic search to replace metadata filtering

❌ Defining unclear metadata descriptions

---

# Interview Questions

### What problem does a Self-Query Retriever solve?

It combines semantic similarity search with metadata filtering by converting a user query into a semantic search string and a metadata filter. :contentReference[oaicite:1]{index=1}

---

### How does it differ from a VectorStore Retriever?

A VectorStore Retriever performs only semantic similarity search, while a Self-Query Retriever also extracts structured metadata filters.

---

### Why is metadata important?

Metadata enables precise filtering based on attributes such as author, date, department, version, or location.

---

### What type of applications benefit most?

Enterprise knowledge bases, legal search, HR systems, research repositories, and document management systems.

---

### Does it replace semantic search?

No. It enhances semantic search by combining it with structured filtering.

---

# Quick Revision

```text
User Query
      │
      ▼
Large Language Model
      │
 ┌───────────────┐
 │ Semantic Text │
 │ Metadata      │
 └───────────────┘
      │
      ▼
Vector Database
      │
Semantic Search
+
Metadata Filter
      │
      ▼
Relevant Documents
      │
      ▼
LLM
      │
      ▼
Final Answer
```

---

# Key Takeaways

- A Self-Query Retriever extends semantic search with metadata-aware retrieval.
- It automatically converts user queries into a semantic query and metadata filters.
- It is ideal for enterprise document search where structured metadata exists.
- Compared to a VectorStore Retriever, it provides much more precise retrieval for complex business queries.
- IBM describes the Self-Query Retriever as splitting a query into **a semantic lookup string and an accompanying metadata filter**. :contentReference[oaicite:2]{index=2}

---

# References

- IBM — *Advanced RAG with Vector Databases and Retrievers* :contentReference[oaicite:3]{index=3}
- LangChain Documentation

---

## Next Note

**12-parent-document-retriever.md** — Learn how Parent Document Retrievers preserve document context by retrieving large parent documents while indexing smaller child chunks.