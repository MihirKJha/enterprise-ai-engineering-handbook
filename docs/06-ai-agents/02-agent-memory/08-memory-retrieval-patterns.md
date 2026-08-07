# 08. Memory Retrieval Patterns

> **Category:** Agent Memory
> **Module:** AI Agents
> **Prerequisites:** Memory Storage Patterns
> **Difficulty:** Intermediate

> **Note:** Storing memory is only half of the problem. An AI agent must also retrieve the **right memory at the right time**. Memory Retrieval Patterns define how an agent searches, ranks, filters, and selects relevant memories from multiple storage systems. Effective retrieval improves reasoning accuracy, reduces hallucinations, minimizes token usage, and enables scalable enterprise AI systems.

---

# Overview

Imagine asking an AI assistant:

```
Generate the same architecture
you suggested last month
for my payment system.
```

The AI agent must determine:

- Which previous project?
- Which architecture?
- Which month?
- Which version?
- Is there a newer recommendation?

Finding the correct memory is far more important than simply storing large amounts of information.

Memory retrieval is therefore one of the core responsibilities of an AI agent.

---

# Why Memory Retrieval Matters

Without Retrieval

```text
User Request

↓

Search Everything

↓

Large Context

↓

Slow Response

↓

Poor Accuracy
```

Problems

- Slow responses
- Irrelevant context
- Higher token usage
- Increased hallucinations
- Poor scalability

---

With Intelligent Retrieval

```text
User Request

↓

Memory Retrieval

↓

Relevant Memories

↓

LLM

↓

Accurate Response
```

Benefits

- Faster responses
- Higher accuracy
- Lower token usage
- Better reasoning
- Personalized answers

---

# High-Level Retrieval Architecture

```text
                     User
                       │
                       ▼
                  AI Agent
                       │
                       ▼
              Memory Retriever
                       │
      ┌────────────────┼─────────────────┐
      ▼                ▼                 ▼
 Conversation     User Profile     Knowledge
    Memory           Memory          Memory
      │                │                │
      ▼                ▼                ▼
    Redis        PostgreSQL      Vector Database
                       │
                       ▼
                 Ranked Context
                       │
                       ▼
                      LLM
```

The retriever decides **which memories** should be included in the prompt.

---

# Memory Retrieval Workflow

```text
User Request
      │
      ▼
Analyze Intent
      │
      ▼
Select Memory Sources
      │
      ▼
Retrieve Candidates
      │
      ▼
Rank Results
      │
      ▼
Build Context
      │
      ▼
LLM
```

Only the most relevant memories are passed to the model.

---

# Memory Retrieval Strategies

Enterprise AI agents typically combine multiple retrieval techniques.

---

## 1. Exact Lookup

Retrieves information using a known identifier.

```text
User ID

↓

Database Lookup

↓

User Profile
```

Typical Uses

- User profile
- Configuration
- Session data

Advantages

- Extremely fast
- High accuracy

---

## 2. Semantic Retrieval

Searches using meaning rather than exact keywords.

```text
Question

↓

Embedding

↓

Vector Search

↓

Similar Memories
```

Typical Uses

- Enterprise knowledge
- Semantic Memory
- RAG

Advantages

- Finds similar concepts
- Handles different wording

---

## 3. Metadata Filtering

Limits retrieval using structured filters.

Example

```
Department = HR

Language = English

Year = 2026
```

Only matching memories are searched.

Typical Uses

- Multi-tenant systems
- Compliance
- Enterprise search

---

## 4. Recency-Based Retrieval

Recent memories receive higher priority.

```text
Today

↓

Yesterday

↓

Last Week

↓

Last Month
```

Typical Uses

- Conversation history
- Session memory
- Active workflows

---

## 5. Hybrid Retrieval

Combines multiple retrieval methods.

```text
Keyword Search

+

Semantic Search

+

Metadata Filters
```

Typical Uses

- Enterprise RAG
- AI Assistants
- Knowledge Search

Hybrid retrieval generally provides better accuracy than using a single strategy.

---

# Choosing the Right Retrieval Strategy

| Memory Type | Retrieval Strategy |
|-------------|-------------------|
| Working Memory | Direct State Lookup |
| Short-Term Memory | Session Retrieval |
| Long-Term Memory | Primary Key Lookup |
| Episodic Memory | Semantic + Metadata |
| Semantic Memory | Vector Search |
| Enterprise Knowledge | Hybrid Retrieval |

---

# Retrieval Pipeline

Enterprise systems typically perform retrieval in multiple stages.

```text
User Question
      │
      ▼
Intent Detection
      │
      ▼
Source Selection
      │
      ▼
Retrieve Candidates
      │
      ▼
Metadata Filtering
      │
      ▼
Ranking
      │
      ▼
Context Builder
      │
      ▼
LLM
```

This prevents unnecessary information from reaching the model.

---

# Implementation

## Example 1 – Core Python

Simple retrieval from a memory store.

```python
class MemoryStore:

    def __init__(self):
        self.memory = {
            "preferred_cloud": "AWS",
            "preferred_language": "Java"
        }

    def retrieve(self, key):
        return self.memory.get(key)


store = MemoryStore()

print(store.retrieve("preferred_cloud"))
```

Output

```text
AWS
```

---

## Example 2 – LlamaIndex Semantic Retrieval

Retrieve memories using semantic similarity.

```python
from llama_index.core import VectorStoreIndex
from llama_index.core import Document

documents = [
    Document(
        text="Customer prefers AWS for cloud deployments."
    ),
    Document(
        text="Spring Boot is used for backend development."
    )
]

index = VectorStoreIndex.from_documents(documents)

retriever = index.as_retriever()

results = retriever.retrieve(
    "Which cloud platform does the customer prefer?"
)

print(results)
```

The retriever returns memories based on semantic similarity instead of exact keyword matching.

---

## Example 3 – Production Example (Hybrid Retrieval)

Enterprise AI agents commonly retrieve memories from multiple sources.

```python
class MemoryRetriever:

    def __init__(
        self,
        redis_client,
        postgres_client,
        vector_store,
    ):
        self.redis = redis_client
        self.postgres = postgres_client
        self.vector_store = vector_store

    def retrieve_context(
        self,
        session_id,
        user_id,
        query,
    ):

        session = self.redis.get(session_id)

        profile = self.postgres.get_user(user_id)

        knowledge = self.vector_store.search(query)

        return {
            "session": session,
            "profile": profile,
            "knowledge": knowledge
        }
```

Instead of querying a single database, enterprise AI agents retrieve relevant context from multiple memory systems and combine the results before invoking the LLM.

---

# Enterprise Use Cases

## Customer Support Agent

Retrieves memories from multiple sources before responding.

Examples

- Active conversation → Redis
- Customer profile → PostgreSQL
- Previous support tickets → MongoDB
- Product documentation → Vector Database

```text
Customer

↓

Support Agent

↓

Memory Retriever

↓

Redis
PostgreSQL
MongoDB
Vector DB

↓

Context Builder

↓

LLM

↓

Response
```

The agent combines multiple memories into a single context before generating the response.

---

## Enterprise Knowledge Assistant

Retrieves enterprise knowledge using semantic search.

Examples

- HR Policies
- Architecture Documents
- Coding Standards
- Internal Wiki
- SOPs

Instead of retrieving entire documents, only the most relevant sections are returned.

---

## Software Engineering Assistant

Retrieves different memories depending on the request.

Examples

| Request | Retrieval Strategy |
|----------|--------------------|
| Previous coding session | Redis |
| Developer preferences | PostgreSQL |
| Similar bug fixes | Vector Search |
| Previous deployments | MongoDB |
| API documentation | Hybrid Search |

This reduces unnecessary context while improving response quality.

---

## Financial Assistant

Uses multiple retrieval strategies simultaneously.

Examples

- User profile
- Investment history
- Market knowledge
- Regulatory documents
- Portfolio information

The retrieved information is ranked before reaching the LLM.

---

## Enterprise AI Platform

Large AI platforms retrieve information from many independent systems.

```text
                     AI Agent
                         │
                 Memory Retriever
                         │
      ┌──────────────────┼───────────────────┐
      ▼                  ▼                   ▼
   Redis           PostgreSQL         MongoDB
      │                  │                   │
      ▼                  ▼                   ▼
 Session          User Profile         Experiences
                         │
                         ▼
                 Vector Database
                         │
                         ▼
                  Knowledge Base
                         │
                         ▼
                  Ranked Context
                         │
                         ▼
                        LLM
```

This architecture enables scalable enterprise retrieval.

---

# Production Insight

One of the biggest mistakes in enterprise AI is retrieving **too much context**.

Bad retrieval

```text
Question

↓

Retrieve 100 documents

↓

Send everything to LLM

↓

High Cost

Slow Response

Hallucinations
```

Good retrieval

```text
Question

↓

Retrieve 20 Documents

↓

Metadata Filtering

↓

Reranking

↓

Top 5 Results

↓

LLM
```

Production systems almost always perform:

- Candidate Retrieval
- Metadata Filtering
- Reranking
- Context Compression
- Prompt Construction

This improves both quality and cost.

---

# Architecture Decision

| Requirement | Recommended Retrieval Strategy |
|-------------|--------------------------------|
| User Profile | Primary Key Lookup |
| Conversation History | Session Retrieval |
| Semantic Knowledge | Vector Search |
| Enterprise Documents | Hybrid Retrieval |
| Historical Events | Metadata + Semantic Search |
| Compliance Documents | Metadata Filtering |
| Large Knowledge Bases | Multi-Stage Retrieval |
| Production RAG | Hybrid Search + Reranker |

---

# Advantages

- Retrieves only relevant information
- Reduces token usage
- Improves response accuracy
- Reduces hallucinations
- Faster responses
- Better personalization
- Supports scalable enterprise AI

---

# Limitations

- Retrieval quality depends on indexing strategy
- Poor metadata affects search accuracy
- Semantic search requires embedding generation
- Multiple retrieval stages increase architectural complexity
- Ranking algorithms require tuning
- Large indexes require additional infrastructure

---

# Best Practices

- Retrieve only the information required for the current task.
- Combine semantic search with metadata filtering.
- Use rerankers to improve retrieval quality.
- Limit the number of retrieved documents.
- Monitor retrieval precision and recall.
- Refresh indexes regularly.
- Remove outdated memories.
- Log retrieval results for evaluation.

---

# Common Mistakes

❌ Retrieving every stored memory

❌ Ignoring metadata filters

❌ Using semantic search for structured lookups

❌ Skipping reranking

❌ Retrieving duplicate memories

❌ Sending large contexts directly to the LLM

---

# Framework Comparison

| Framework | Retrieval Support |
|-----------|-------------------|
| **LangChain** | Retrievers, Hybrid Retrieval, Self Query Retriever |
| **LangGraph** | Retrieval integrated into workflow state |
| **LlamaIndex** | Advanced Retrievers, Query Engines, Router Retrieval |
| **CrewAI** | External Knowledge Retrieval |
| **OpenAI Agents SDK** | Tool-based Retrieval Integration |

---

# Interview Questions

### What is Memory Retrieval in an AI Agent?

### Why is memory retrieval more important than memory storage?

### What is the difference between exact lookup and semantic retrieval?

### Why is hybrid retrieval commonly used in enterprise AI?

### What role does metadata filtering play?

### Why is reranking important?

### How can poor retrieval increase hallucinations?

### What is a multi-stage retrieval pipeline?

---

# Quick Revision

```text
                  User Request
                        │
                        ▼
                 Intent Detection
                        │
                        ▼
              Select Memory Source
                        │
                        ▼
               Retrieve Candidates
                        │
                        ▼
              Metadata Filtering
                        │
                        ▼
                  Reranking
                        │
                        ▼
                Context Builder
                        │
                        ▼
                       LLM
                        │
                        ▼
                 Final Response
```

---

# Key Takeaways

- Memory retrieval determines which memories are provided to the LLM during reasoning.
- Enterprise AI agents combine multiple retrieval strategies, including exact lookup, semantic retrieval, metadata filtering, recency-based retrieval, and hybrid retrieval.
- Production systems retrieve candidate memories, apply filters, rerank results, and construct optimized prompts instead of sending all available data to the LLM.
- Well-designed retrieval pipelines improve accuracy, reduce hallucinations, lower token costs, and enable scalable AI applications.
- Retrieval quality has a greater impact on AI performance than simply storing more information.

---

# References

- LangChain Documentation – Retrievers
- LlamaIndex Documentation – Query Engines & Retrievers
- LangGraph Documentation – Retrieval Workflows
- ChromaDB Documentation
- Pinecone Documentation
- Weaviate Documentation

---

## Next Note

**09-memory-compression.md**

In the next note, we'll explore **Memory Compression**, including conversation summarization, semantic compression, context pruning, hierarchical memory, rolling summaries, and production techniques for reducing token usage while preserving important information in long-running AI agent conversations.