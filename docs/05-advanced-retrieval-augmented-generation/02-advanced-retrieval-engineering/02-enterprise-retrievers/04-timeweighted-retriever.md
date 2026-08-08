# 04. TimeWeighted Retriever

> **Category:** Enterprise Retrievers
> **Module:** Advanced Retrieval Engineering
> **Prerequisites:** VectorStore Retriever, Embeddings, Conversational RAG, Memory Systems
> **Difficulty:** Advanced

> **Note:** TimeWeighted Retriever is an advanced retrieval technique that incorporates document recency into the retrieval process. Unlike traditional retrievers that rank documents solely by semantic similarity, it balances semantic relevance with temporal importance, ensuring that newer or recently accessed information is prioritized when appropriate. This approach is particularly valuable for conversational AI, memory-augmented agents, and enterprise systems where information evolves continuously.

---

# Overview

Traditional vector retrieval assumes that every document has equal importance regardless of when it was created or last accessed. However, many enterprise applications require recent information to be prioritized over older knowledge.

For example:

- Latest product documentation
- Recently updated policies
- Current support tickets
- Recent customer conversations
- Ongoing project documentation

A purely semantic search may retrieve highly similar but outdated information.

The **TimeWeighted Retriever** addresses this limitation by incorporating a time-based scoring mechanism into document ranking. Each document receives a relevance score based on both semantic similarity and temporal importance, enabling retrieval systems to surface information that is both relevant and up-to-date.

This technique is widely used in conversational AI, long-term memory systems, enterprise search platforms, and agentic AI applications where document freshness significantly impacts response quality.

---

# Why TimeWeighted Retrieval?

Traditional Retrieval

```text
                User Query
                     │
                     ▼
            Vector Retriever
                     │
                     ▼
          Documents Ranked Only
        By Semantic Similarity
                     │
                     ▼
                     LLM
```

Problems

- Older documents dominate results
- Ignores recent updates
- Stale information
- Poor conversational memory
- Reduced answer accuracy

---

TimeWeighted Retrieval

```text
                User Query
                     │
                     ▼
            Vector Retriever
                     │
                     ▼
        Semantic Similarity Score
                     │
                     ▼
          Time Decay Adjustment
                     │
                     ▼
         Final Weighted Ranking
                     │
                     ▼
                     LLM
```

Benefits

- Prioritizes recent knowledge
- Better conversational memory
- Improved dynamic search
- More relevant enterprise results
- Better user experience

---

# High-Level Architecture

```text
                    User Query
                         │
                         ▼
                  Vector Retriever
                         │
                         ▼
               Candidate Documents
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
Semantic Similarity               Time Weight
        │                                 │
        └────────────────┬────────────────┘
                         ▼
                Combined Ranking Score
                         │
                         ▼
                  Ranked Documents
                         │
                         ▼
                    Prompt Builder
                         │
                         ▼
                         LLM
```

---

# Retrieval Pipeline

```text
Documents
      │
      ▼
Embedding Generation
      │
      ▼
Vector Database
      │
      ▼
Similarity Search
      │
      ▼
Time-Based Scoring
      │
      ▼
Combined Ranking
      │
      ▼
Prompt Builder
      │
      ▼
LLM
```

---

# How TimeWeighted Retriever Works

1. Retrieve candidate documents using semantic similarity.
2. Retrieve timestamps or last-access metadata.
3. Calculate a time-based weight for each document.
4. Combine semantic similarity and time weight.
5. Re-rank the retrieved documents.
6. Return the highest-ranked documents to the LLM.

The retrieval score considers both **what** the document says and **when** it was created or accessed.

---

# Time Weighting Strategies

## Recency-Based Ranking

Documents become less important as they age.

Best for

- News
- Enterprise documentation
- Product knowledge

---

## Last Access Time

Frequently accessed documents receive higher priority.

Best for

- Conversational memory
- AI assistants
- User personalization

---

## Exponential Time Decay

Recent documents receive significantly higher scores while older documents gradually lose importance.

Example

```text
Today
 │
 ▼
Highest Score

↓

Last Week

↓

Last Month

↓

Last Year
```

Best for

- Dynamic enterprise systems
- Customer support
- Knowledge management

---

## Custom Business Rules

Organizations may define their own ranking rules.

Examples

- Prioritize documents from the last 90 days
- Boost recently approved policies
- Prefer latest software versions

---

# LangChain Architecture

```text
User Query
      │
      ▼
TimeWeighted Retriever
      │
Similarity Search
      │
Time Decay Scoring
      │
Combined Ranking
      │
LLM
```

The retriever maintains timestamp metadata alongside vector embeddings to compute the final ranking.

---

# LangChain Implementation

Typical workflow

```text
Documents

↓

Embeddings

↓

Vector Store

↓

TimeWeighted Retriever

↓

Recent + Relevant Documents

↓

LLM
```

---
# 💻 LangChain TimeWeighted Retriever Walkthrough

The following example demonstrates how a **TimeWeighted Retriever** combines semantic similarity with document recency. Instead of ranking documents solely by vector similarity, the retriever applies a configurable time decay function to prioritize more recent or recently accessed information before returning context to the LLM.

---

## Step 1 — Load Documents

Load enterprise documents that will be indexed for retrieval.

```python
from langchain_community.document_loaders import TextLoader

loader = TextLoader("knowledge_base.txt")
documents = loader.load()
```

---

## Step 2 — Generate Embeddings and Build the Vector Store

Create vector embeddings and store them in a vector database.

```python
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = Chroma.from_documents(
    documents=documents,
    embedding=embeddings
)
```

---

## Step 3 — Create the TimeWeighted Retriever

Configure the retriever to consider both semantic similarity and document recency during ranking.

```python
from langchain.retrievers import TimeWeightedVectorStoreRetriever

retriever = TimeWeightedVectorStoreRetriever(
    vectorstore=vector_store,
    decay_rate=0.01,
    k=4
)
```

---

## Step 4 — Retrieve Recent and Relevant Documents

The retriever performs semantic search, applies time decay, and returns the highest-ranked documents.

```python
query = "What are the latest authentication guidelines?"

retrieved_documents = retriever.invoke(query)

for document in retrieved_documents:
    print(document.page_content)
```

---

## Step 5 — Generate the Final Response

Pass the retrieved context to the Large Language Model for Retrieval-Augmented Generation (RAG).

```python
context = "\n\n".join(
    doc.page_content
    for doc in retrieved_documents
)

prompt = f"""
Use the following context to answer the user's question.

Context:
{context}

Question:
{query}
"""

response = llm.invoke(prompt)

print(response.content)
```

---

## End-to-End Retrieval Flow

```text
                    Enterprise Documents
                             │
                             ▼
                  Generate Embeddings
                             │
                             ▼
                     Chroma Vector Store
                             │
                             ▼
             TimeWeighted Retriever
              ┌─────────────┴─────────────┐
              ▼                           ▼
      Semantic Similarity         Time Decay Scoring
              │                           │
              └─────────────┬─────────────┘
                            ▼
                  Combined Ranking Score
                            │
                            ▼
              Recent & Relevant Documents
                            │
                            ▼
                 Prompt Construction (RAG)
                            │
                            ▼
                 Foundation Model (LLM)
                            │
                            ▼
                   AI Generated Response
```

This implementation demonstrates how the **TimeWeighted Retriever** enhances traditional vector retrieval by incorporating document recency into the ranking process. By balancing semantic similarity with temporal importance, it helps enterprise Retrieval-Augmented Generation (RAG) systems surface more current, relevant, and contextually accurate information for dynamic knowledge bases, conversational AI, and long-term memory applications.

---
# LlamaIndex Alternatives

LlamaIndex does not provide a dedicated **TimeWeighted Retriever**.

Similar behavior can be implemented using:

- Metadata Filters
- Custom Retriever
- Node Postprocessors
- Metadata-aware Ranking

---

# Comparison with Other Retrievers

| Retriever | Primary Goal |
|------------|--------------|
| VectorStore Retriever | Semantic similarity |
| MultiVector Retriever | Multiple semantic representations |
| Hybrid Search Retriever | Combine lexical and semantic search |
| TimeWeighted Retriever | Balance semantic relevance with document recency |
| Router Retriever | Select the most appropriate retriever |

---

# Enterprise Use Cases

### Conversational AI

Prioritize the latest user interactions during multi-turn conversations.

---

### Enterprise Knowledge Management

Prefer recently updated documentation over outdated manuals.

---

### Customer Support

Surface the latest troubleshooting guides and product updates.

---

### Project Management

Retrieve recent meeting notes, design documents, and project decisions.

---

### AI Memory Systems

Retrieve memories based on both relevance and recency.

---

# Advantages

- Improves retrieval freshness
- Better conversational memory
- Adapts to continuously changing data
- Reduces stale responses
- Improves user experience
- Supports long-term AI memory

---

# Limitations

- Requires timestamp metadata
- Older but important documents may receive lower rankings
- Additional scoring overhead
- Requires tuning of decay parameters

---

# Production Best Practices

- Store document timestamps as metadata.
- Use configurable decay functions.
- Combine with semantic similarity rather than replacing it.
- Monitor freshness metrics alongside retrieval quality.
- Periodically re-index updated documents.
- Tune time decay according to business requirements.

---

# Common Mistakes

- Ignoring semantic similarity.
- Applying aggressive decay to evergreen content.
- Missing timestamp metadata.
- Using fixed decay values for every domain.
- Forgetting to re-index updated documents.

---

# Interview Questions

### What problem does TimeWeighted Retriever solve?

### How does it differ from a VectorStore Retriever?

### Why is time decay important in enterprise retrieval?

### What types of applications benefit from TimeWeighted Retrieval?

### What are the trade-offs of prioritizing recent documents?

---

# Quick Revision

```text
User Query
      │
Vector Retriever
      │
Candidate Documents
      │
Time Decay
      │
Combined Ranking
      │
Top Documents
      │
LLM
```

---

# Key Takeaways

- TimeWeighted Retriever incorporates document recency into the retrieval process.
- It balances semantic similarity with temporal importance to improve retrieval quality.
- It is particularly useful for conversational AI, enterprise search, and memory-augmented systems.
- Timestamp metadata and configurable decay functions are essential components of the retrieval pipeline.
- Time-weighted retrieval helps enterprise RAG systems remain accurate as knowledge evolves over time.

---

# References

- LangChain Documentation — TimeWeightedVectorStoreRetriever
- LangChain Documentation — Memory
- Retrieval-Augmented Generation (RAG) Best Practices
- Enterprise AI Memory Systems

---

## Next Note

**05-hybrid-search-retriever.md** — Learn how Hybrid Search Retriever combines dense vector search and sparse keyword search to improve recall, precision, and robustness across diverse enterprise search scenarios.
