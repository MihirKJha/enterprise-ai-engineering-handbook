# RAG Pipeline Components

> A visual guide to the core components of a Retrieval-Augmented Generation (RAG) pipeline and how they work together to build document-based AI applications.

---

# 1. Overview

A Retrieval-Augmented Generation (RAG) pipeline combines document retrieval with a Large Language Model (LLM) to generate responses grounded in external knowledge.

Unlike a standalone LLM, a RAG pipeline retrieves relevant information before generating an answer.

High-level workflow:

```text
User Question
      │
      ▼
Retrieve Relevant Documents
      │
      ▼
Provide Context
      │
      ▼
Large Language Model
      │
      ▼
Generate Answer
```

Each component performs a specific role in this workflow.

---

# 2. Complete RAG Pipeline

```text
                 Documents
                     │
                     ▼
             Document Loader
                     │
                     ▼
              Text Splitter
                     │
                     ▼
            Embedding Model
                     │
                     ▼
             Vector Database
                     │
                     ▼
                Retriever
                     ▲
                     │
               User Question
                     │
                     ▼
             Prompt Template
                     │
                     ▼
          Large Language Model
                     │
                     ▼
             Output Parser
                     │
                     ▼
              Final Response
```

---

# 3. Component Overview

| Component | Purpose |
|-----------|---------|
| Document Loader | Loads documents into the application |
| Text Splitter | Splits large documents into chunks |
| Embedding Model | Converts text into vector representations |
| Vector Database | Stores document embeddings |
| Retriever | Retrieves relevant document chunks |
| Prompt Template | Combines retrieved context with the user's question |
| Large Language Model | Generates the response |
| Output Parser | Formats the response for the application |

---

# 4. Document Processing

Before a user can ask questions, documents must be prepared.

```text
Documents

↓

Document Loader

↓

Text Splitter

↓

Embeddings

↓

Vector Database
```

This stage is performed only once when documents are added or updated.

---

# 5. Query Processing

When a user submits a question, the pipeline retrieves relevant information.

```text
User Question

↓

Embedding Model

↓

Retriever

↓

Relevant Chunks
```

The retrieved chunks become additional context for the LLM.

---

# 6. Response Generation

The retrieved documents and user question are combined into a prompt.

```text
Question

+

Retrieved Context

↓

Prompt Template

↓

LLM

↓

Answer
```

The LLM generates a response using both:

- User request
- Retrieved knowledge

---

# 7. Data Flow

```text
                 Offline Stage

Documents
      │
      ▼
Document Loader
      │
      ▼
Text Splitter
      │
      ▼
Embeddings
      │
      ▼
Vector Database


                 Online Stage

User Question
      │
      ▼
Retriever
      │
      ▼
Relevant Documents
      │
      ▼
Prompt Template
      │
      ▼
Large Language Model
      │
      ▼
Response
```

---

# 8. End-to-End Workflow

```text
User

↓

Question

↓

Retriever

↓

Relevant Documents

↓

Prompt Template

↓

LLM

↓

Answer
```

---

# 9. Quick Revision

## Offline Phase

- Load Documents
- Split Documents
- Generate Embeddings
- Store in Vector Database

---

## Online Phase

- Receive User Query
- Retrieve Relevant Documents
- Build Prompt
- Generate Response

---

## Remember

> **A RAG pipeline has two stages: an offline indexing stage that prepares documents for retrieval, and an online inference stage that retrieves relevant information and provides it to the LLM for response generation.**

---

# 10. RAG Pipeline Summary

A simple Retrieval-Augmented Generation (RAG) application consists of two major stages.

## Stage 1 — Indexing (Offline)

Documents are prepared before users interact with the application.

```text
Documents
      │
      ▼
Document Loader
      │
      ▼
Text Splitter
      │
      ▼
Embedding Model
      │
      ▼
Vector Database
```

This stage is performed once whenever documents are added or updated.

---

## Stage 2 — Retrieval & Generation (Online)

When a user submits a query, the application retrieves relevant information and generates a response.

```text
User Question
      │
      ▼
Retriever
      │
      ▼
Relevant Documents
      │
      ▼
Prompt Template
      │
      ▼
Large Language Model
      │
      ▼
Output Parser
      │
      ▼
Final Response
```

---

# 11. Complete Data Flow

The complete RAG workflow can be visualized as follows.

```text
                     OFFLINE

Documents
      │
      ▼
Document Loader
      │
      ▼
Text Splitter
      │
      ▼
Embedding Model
      │
      ▼
Vector Database



                     ONLINE

User Question
      │
      ▼
Retriever
      │
      ▼
Relevant Chunks
      │
      ▼
Prompt Template
      │
      ▼
Large Language Model
      │
      ▼
Output Parser
      │
      ▼
Final Answer
```

The offline stage prepares the knowledge base, while the online stage retrieves relevant information and generates responses.

---

# 12. Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| Document Loader | Loads external documents |
| Text Splitter | Breaks large documents into smaller chunks |
| Embedding Model | Converts text into vector representations |
| Vector Database | Stores embeddings for semantic search |
| Retriever | Finds the most relevant document chunks |
| Prompt Template | Combines the question with retrieved context |
| Large Language Model | Generates the answer |
| Output Parser | Formats the response for the application |

---

# 13. Pipeline at a Glance

```text
Prepare Knowledge

Documents
      │
      ▼
Loader
      │
      ▼
Splitter
      │
      ▼
Embeddings
      │
      ▼
Vector Database

──────────────────────────────────

Answer Questions

User Question
      │
      ▼
Retriever
      │
      ▼
Context
      │
      ▼
LLM
      │
      ▼
Answer
```

---

# 14. Key Concepts

A RAG pipeline combines two independent capabilities.

### Information Retrieval

Responsible for finding relevant information.

Components:

- Vector Database
- Retriever
- Embedding Model

---

### Language Generation

Responsible for producing natural language responses.

Components:

- Prompt Template
- Large Language Model
- Output Parser

Together, these capabilities enable AI applications to answer questions using external knowledge rather than relying solely on pretrained model knowledge.

---

# 15. 🚀 Quick Revision

## Offline Pipeline

```text
Documents
      │
      ▼
Loader
      │
      ▼
Splitter
      │
      ▼
Embeddings
      │
      ▼
Vector Database
```

---

## Online Pipeline

```text
Question
      │
      ▼
Retriever
      │
      ▼
Context
      │
      ▼
LLM
      │
      ▼
Answer
```

---

## Core Components

- Document Loader
- Text Splitter
- Embedding Model
- Vector Database
- Retriever
- Prompt Template
- Large Language Model
- Output Parser

---

## Remember

> **A RAG pipeline consists of two phases:**
>
> **Offline (Indexing):** Prepare documents by loading, splitting, embedding, and storing them in a vector database.
>
> **Online (Retrieval & Generation):** Retrieve relevant document chunks for a user query and provide them to the LLM to generate an accurate, context-aware response.

---

# References

- IBM AI Engineering Professional Certificate
- LangChain Documentation
- Chroma Documentation
- Hugging Face Documentation