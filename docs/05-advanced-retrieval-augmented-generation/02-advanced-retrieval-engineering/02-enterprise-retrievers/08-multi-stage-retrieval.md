# 08. Multi-stage Retrieval

> **Category:** Enterprise Retrievers
> **Module:** Advanced Retrieval Engineering
> **Prerequisites:** VectorStore Retriever, Hybrid Search, Reranking, Contextual Compression Retriever
> **Difficulty:** Advanced

> **Note:** Multi-stage Retrieval is an advanced retrieval architecture that improves retrieval quality by dividing the retrieval process into multiple sequential stages. Instead of relying on a single retrieval operation, the system progressively narrows, filters, reranks, and optimizes retrieved documents before passing them to the Large Language Model (LLM). This architecture is widely adopted in enterprise Retrieval-Augmented Generation (RAG) systems where high precision, scalability, and response quality are critical.

---

# Overview

A single retrieval step is often insufficient for enterprise search applications. While vector similarity can retrieve semantically relevant documents, the initial results frequently contain noisy, partially relevant, or redundant information.

Enterprise AI systems therefore employ **Multi-stage Retrieval**, where retrieval is broken into several specialized stages. Each stage refines the results produced by the previous stage, gradually improving document quality before they reach the LLM.

Instead of attempting to retrieve the perfect documents in one step, Multi-stage Retrieval treats retrieval as a progressive refinement process.

This architecture enables enterprise RAG systems to balance retrieval speed, recall, precision, and inference cost while supporting large-scale knowledge bases.

---

# Why Multi-stage Retrieval?

Traditional Retrieval

```text
                 User Query
                      │
                      ▼
             Vector Retriever
                      │
                      ▼
              Top-K Documents
                      │
                      ▼
                     LLM
```

Problems

- Low precision
- Irrelevant documents
- Duplicate results
- Large prompt size
- Higher hallucination risk

---

Multi-stage Retrieval

```text
                 User Query
                      │
                      ▼
             Candidate Retrieval
                      │
                      ▼
               Metadata Filter
                      │
                      ▼
                 Reranking
                      │
                      ▼
         Contextual Compression
                      │
                      ▼
             Optimized Context
                      │
                      ▼
                     LLM
```

Benefits

- Higher retrieval precision
- Better document quality
- Reduced token usage
- Lower hallucination rate
- Improved response quality

---

# High-Level Architecture

```text
                     User Query
                          │
                          ▼
                Candidate Retriever
                          │
                   Top-100 Results
                          │
                          ▼
                  Metadata Filtering
                          │
                    Top-40 Results
                          │
                          ▼
                     Reranker
                          │
                    Top-10 Results
                          │
                          ▼
             Context Compression
                          │
                     Top-5 Results
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
Knowledge Base
      │
      ▼
Candidate Retrieval
      │
      ▼
Filtering
      │
      ▼
Reranking
      │
      ▼
Compression
      │
      ▼
Prompt Construction
      │
      ▼
LLM
```

---

# How Multi-stage Retrieval Works

1. Retrieve a broad set of candidate documents.
2. Filter irrelevant documents using metadata or business rules.
3. Rerank the remaining documents using a cross-encoder or reranker model.
4. Compress document content to remove unnecessary information.
5. Build the final prompt using the optimized context.
6. Generate the response using the LLM.

Each stage progressively improves the relevance of the retrieved context.

---

# Retrieval Stages

## Stage 1 – Candidate Generation

Retrieve a relatively large number of potentially relevant documents.

Typical techniques

- Vector Search
- Hybrid Search
- BM25 Search

Goal

Maximize recall.

---

## Stage 2 – Metadata Filtering

Remove documents that do not satisfy business constraints.

Examples

- Department
- Product
- Language
- Security Level
- Version

Goal

Reduce irrelevant candidates.

---

## Stage 3 – Reranking

Use a more accurate ranking model to reorder retrieved documents.

Common rerankers

- Cross Encoder
- Cohere Rerank
- BAAI BGE Reranker
- Jina Reranker

Goal

Improve precision.

---

## Stage 4 – Context Compression

Remove unnecessary paragraphs or sentences before constructing the prompt.

Techniques

- LLMChainExtractor
- EmbeddingsFilter
- Contextual Compression Retriever

Goal

Reduce token usage while preserving relevant information.

---

## Stage 5 – Prompt Construction

Assemble the final prompt using the highest-quality retrieved context.

Goal

Provide the LLM with concise, relevant, and accurate information.

---

# Common Multi-stage Retrieval Pipelines

## Pipeline 1

```text
Vector Search
      │
      ▼
Reranker
      │
      ▼
LLM
```

---

## Pipeline 2

```text
Hybrid Search
      │
      ▼
Metadata Filter
      │
      ▼
Cross Encoder
      │
      ▼
LLM
```

---

## Pipeline 3

```text
Hybrid Search
      │
      ▼
Router Retriever
      │
      ▼
Reranker
      │
      ▼
Context Compression
      │
      ▼
LLM
```

---

# LangChain Architecture

```text
User Query
      │
      ▼
Retriever
      │
      ▼
Document Filter
      │
      ▼
Reranker
      │
      ▼
Context Compression
      │
      ▼
LLM
```

LangChain supports multi-stage retrieval by composing retrievers, document transformers, rerankers, and compressors using LCEL or Runnable pipelines.

---

# LangChain Implementation

Typical workflow

```text
Vector Retriever

↓

Metadata Filter

↓

Reranker

↓

Compression

↓

LLM
```

---

# LlamaIndex Alternatives

LlamaIndex enables multi-stage retrieval using:

- Query Pipelines
- Router Query Engine
- Recursive Retriever
- Node Postprocessors
- Rerankers
- Metadata Filters

These components can be combined into custom retrieval workflows.

---

# Comparison with Other Retrievers

| Retriever | Primary Goal |
|------------|--------------|
| VectorStore Retriever | Retrieve semantically similar documents |
| Hybrid Search Retriever | Combine lexical and semantic retrieval |
| Router Retriever | Select the appropriate retrieval pipeline |
| Contextual Compression Retriever | Reduce prompt size |
| Multi-stage Retrieval | Optimize retrieval through multiple refinement stages |

---

# Enterprise Use Cases

### Enterprise Knowledge Assistants

Improve answer quality using filtering, reranking, and compression.

---

### Customer Support Platforms

Retrieve, rerank, and compress troubleshooting documents before response generation.

---

### Legal Document Search

Retrieve relevant cases, rerank legal precedents, and compress lengthy judgments.

---

### Healthcare Systems

Filter medical guidelines, rerank evidence, and compress clinical documents.

---

### Financial Research

Retrieve reports, filter outdated versions, rerank by relevance, and summarize supporting information.

---

# Advantages

- Higher precision
- Better recall
- Lower hallucination rate
- Smaller prompts
- Improved response quality
- Scalable retrieval architecture
- Better enterprise search performance

---

# Limitations

- Higher architectural complexity
- Increased retrieval latency
- More infrastructure components
- Additional tuning required
- Higher operational cost

---

# Production Best Practices

- Separate retrieval stages into independent services.
- Retrieve broadly before refining results.
- Use metadata filtering before reranking.
- Apply context compression after reranking.
- Continuously evaluate retrieval quality.
- Monitor latency at each stage.
- Cache intermediate retrieval results where appropriate.

---

# Common Mistakes

- Using only a single retrieval stage.
- Reranking too many documents.
- Compressing documents before reranking.
- Skipping metadata filtering.
- Retrieving too few candidate documents.
- Ignoring retrieval latency.

---

# Interview Questions

### What is Multi-stage Retrieval?

### Why is candidate generation separated from reranking?

### Why should context compression occur after reranking?

### What are the typical stages in an enterprise retrieval pipeline?

### What are the advantages of Multi-stage Retrieval over a single retrieval step?

---

# Quick Revision

```text
User Query
      │
Candidate Retrieval
      │
Metadata Filter
      │
Reranker
      │
Context Compression
      │
Prompt Builder
      │
LLM
```

---

# Key Takeaways

- Multi-stage Retrieval improves retrieval quality through progressive refinement.
- Different retrieval stages optimize recall, precision, ranking, and prompt quality.
- Metadata filtering, reranking, and contextual compression each play distinct roles in the retrieval pipeline.
- Enterprise RAG systems commonly use multi-stage retrieval to balance speed, accuracy, and cost.
- Separating retrieval into multiple stages produces more reliable and scalable AI systems.

---

# References

- LangChain Documentation — Retrieval Pipelines
- LangChain Documentation — Contextual Compression Retriever
- LlamaIndex Documentation — Query Pipelines
- Cohere Documentation — Rerank API
- Retrieval-Augmented Generation (RAG) Best Practices

---

## Next Note

**09-agentic-retrieval.md** — Learn how Agentic Retrieval enables AI agents to dynamically plan, execute, and refine retrieval strategies using reasoning, tool selection, and iterative search to solve complex enterprise tasks.