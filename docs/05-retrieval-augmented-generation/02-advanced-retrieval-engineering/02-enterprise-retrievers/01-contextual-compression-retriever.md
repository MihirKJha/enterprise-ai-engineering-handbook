# 01. Contextual Compression Retriever

> **Category:** Enterprise Retrievers  
> **Module:** Advanced Retrieval Engineering  
> **Prerequisites:** VectorStore Retriever, Parent Document Retriever, Embeddings, RAG Pipeline  
> **Difficulty:** Advanced

> **Note:** Contextual Compression Retriever is an advanced retrieval technique provided by frameworks such as LangChain. Unlike traditional retrievers that focus on retrieving the most relevant documents, it focuses on removing irrelevant content from retrieved documents before they are passed to the Large Language Model (LLM). This reduces token usage, lowers inference costs, and improves response quality, making it a valuable optimization technique for production Retrieval-Augmented Generation (RAG) systems.

---

# Overview

Retrieval-Augmented Generation (RAG) systems often retrieve documents that are semantically relevant but contain significant amounts of irrelevant information. Passing entire documents to a Large Language Model (LLM) increases prompt size, inference latency, operational costs, and may reduce answer quality due to unnecessary context.

The **Contextual Compression Retriever** addresses this challenge by introducing an additional processing stage after document retrieval. Instead of forwarding complete documents, it extracts or filters only the information relevant to the user's query.

Unlike conventional retrievers that optimize **which documents are retrieved**, Contextual Compression Retriever optimizes **what content within those documents is sent to the LLM**.

This technique is particularly valuable in enterprise AI systems where documents such as policy manuals, legal contracts, technical documentation, research papers, and knowledge bases are often lengthy and exceed the context window of modern LLMs.

---

# Why Contextual Compression?

Traditional RAG Pipeline

```text
User Query
      │
      ▼
Retriever
      │
Top-K Documents
      │
      ▼
Entire Documents
      │
      ▼
LLM
```

Problems

- Large prompts
- Higher token consumption
- Increased latency
- Higher inference costs
- More irrelevant context
- Lower answer precision

---

Contextual Compression Pipeline

```text
User Query
      │
      ▼
Retriever
      │
Top-K Documents
      │
      ▼
Contextual Compression
      │
Relevant Content Only
      │
      ▼
LLM
```

Benefits

- Smaller prompts
- Lower token usage
- Reduced latency
- Lower operational costs
- Better grounding
- Improved answer quality

---

# High-Level Architecture

```text
                    User Query
                         │
                         ▼
                 Vector Retriever
                         │
              Top-K Retrieved Documents
                         │
                         ▼
          Contextual Compression Layer
         ┌──────────────┬──────────────┐
         ▼              ▼              ▼
   LLM Extractor   Embedding Filter  LLM Filter
         └──────────────┼──────────────┘
                        ▼
              Compressed Context
                        │
                        ▼
                 Prompt Construction
                        │
                        ▼
                   Large Language Model
                        │
                        ▼
                  Generated Response
```

---

# Retrieval Pipeline

```text
Documents
      │
      ▼
Vector Database
      │
      ▼
Retriever
      │
Top-K Documents
      │
      ▼
Contextual Compression
      │
Compressed Context
      │
      ▼
Prompt Builder
      │
      ▼
LLM
      │
      ▼
Answer
```

---

# How Contextual Compression Works

1. Retrieve the most relevant documents using a standard retriever.
2. Analyze each retrieved document against the user query.
3. Remove irrelevant sections or extract only the relevant passages.
4. Combine the compressed context.
5. Send the optimized context to the LLM for response generation.

The compression step can be implemented using embedding similarity, LLM-based extraction, or document filtering techniques depending on latency, cost, and quality requirements.

---

# Compression Techniques

## LLMChainExtractor

Extracts only the passages relevant to the query.

**Best for**

- High-quality enterprise RAG
- Legal documents
- Medical knowledge
- Technical manuals

---

## LLMChainFilter

Determines whether an entire document should be included or discarded.

**Best for**

- Filtering noisy retrieval results
- Low document counts
- Moderate latency requirements

---

## EmbeddingsFilter

Uses embedding similarity to remove irrelevant chunks without invoking an LLM.

**Best for**

- Low latency
- High throughput
- Cost-sensitive applications

---

## Cross-Encoder Compression

Uses a reranking model to retain only the highest-quality passages.

**Best for**

- Search applications
- Enterprise knowledge assistants
- High-precision retrieval

---

# LangChain Architecture

```text
User Query
      │
      ▼
Base Retriever
      │
Retrieved Documents
      │
      ▼
Base Compressor
      │
Compressed Documents
      │
      ▼
LLM
```

Supported compressors include:

- LLMChainExtractor
- LLMChainFilter
- EmbeddingsFilter

---

# LangChain Implementation

*(Code examples can be added here in your standard format.)*

---

# LlamaIndex Alternatives

Although LlamaIndex does not provide a dedicated **Contextual Compression Retriever**, similar functionality can be achieved using:

- Node Postprocessors
- Metadata Filters
- Sentence Optimizer
- Rerankers

---

# Comparison with Other Retrievers

| Retriever | Primary Goal |
|------------|--------------|
| VectorStore Retriever | Retrieve relevant documents |
| Multi Query Retriever | Improve recall using multiple queries |
| Parent Document Retriever | Preserve document context |
| **Contextual Compression Retriever** | Reduce irrelevant context |
| Reranker | Improve document ordering |

---

# Enterprise Use Cases

- Enterprise Knowledge Bases
- Customer Support Assistants
- Legal Document Search
- Healthcare Knowledge Systems
- Financial Research Platforms
- Internal Developer Portals

---

# Advantages

- Reduces token consumption
- Improves response quality
- Lowers inference costs
- Reduces hallucinations
- Improves context utilization
- Enables larger document collections

---

# Limitations

- Additional processing stage
- LLM-based compression increases latency
- Over-compression may remove important context
- Requires tuning and evaluation

---

# Production Best Practices

- Apply compression after retrieval.
- Use embedding filters for low-latency applications.
- Combine compression with reranking for better precision.
- Cache compressed results for frequently asked questions.
- Monitor token reduction and answer quality.
- Benchmark retrieval performance using RAG evaluation metrics.

---

# Common Mistakes

- Compressing documents before retrieval
- Removing too much contextual information
- Using expensive LLM compressors unnecessarily
- Ignoring evaluation metrics
- Compressing already small document chunks

---

# Interview Questions

### What problem does Contextual Compression Retriever solve?

### How is it different from a VectorStore Retriever?

### When should Contextual Compression Retriever be used?

### What compression techniques are supported in LangChain?

### What are the trade-offs between LLM-based and embedding-based compression?

---

# Quick Revision

```text
User Query
      │
Retriever
      │
Retrieved Documents
      │
Contextual Compression
      │
Compressed Context
      │
LLM
      │
Answer
```

---

# Key Takeaways

- Contextual Compression Retriever optimizes prompt content rather than document retrieval.
- It removes irrelevant information before LLM inference.
- It reduces token usage, latency, and operational costs.
- LangChain provides native support through multiple compression strategies.
- It is a valuable optimization technique for enterprise RAG systems handling large documents.

---

# References

- LangChain Documentation — ContextualCompressionRetriever
- LangChain Documentation — LLMChainExtractor
- LangChain Documentation — LLMChainFilter
- LangChain Documentation — EmbeddingsFilter

---

## Next Note

**02-ensemble-retriever.md** — Learn how Ensemble Retriever combines multiple retrieval strategies, such as vector search and keyword search, to improve recall, robustness, and overall retrieval quality in enterprise RAG systems.