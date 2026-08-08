# 02. Ensemble Retriever

> **Category:** Enterprise Retrievers
> **Module:** Advanced Retrieval Engineering
> **Prerequisites:** VectorStore Retriever, BM25 Retriever, Multi Query Retriever, RAG Pipeline
> **Difficulty:** Advanced

> **Note:** Ensemble Retriever is an advanced retrieval technique that combines multiple retrieval strategies to improve recall, precision, and robustness. Instead of depending on a single retriever, it aggregates results from multiple retrievers, such as semantic vector search and keyword-based search, to provide more comprehensive and accurate document retrieval. Ensemble retrieval is widely used in production Retrieval-Augmented Generation (RAG) systems to improve retrieval quality across diverse query types.

---

# Overview

Different retrieval techniques excel under different conditions. Dense vector retrieval captures semantic meaning, while keyword-based retrieval performs better for exact matches, identifiers, product names, error codes, and technical terminology.

Relying on a single retriever often leads to incomplete search results because each retrieval method has its own strengths and weaknesses.

The **Ensemble Retriever** addresses this challenge by combining the outputs of multiple retrievers into a unified ranked result set. By leveraging complementary retrieval strategies, it increases document recall, improves ranking quality, and delivers more reliable context to Large Language Models (LLMs).

Rather than replacing existing retrievers, the Ensemble Retriever orchestrates multiple retrievers to produce a better overall retrieval result.

---

# Why Ensemble Retrieval?

Single Retriever

```text
                User Query
                     │
                     ▼
            Vector Retriever
                     │
                     ▼
             Retrieved Documents
                     │
                     ▼
                     LLM
```

Problems

- Misses keyword-based matches
- Sensitive to embedding quality
- Lower recall
- Limited retrieval diversity

---

Ensemble Retrieval

```text
                User Query
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
Vector Retriever          BM25 Retriever
        │                         │
        └────────────┬────────────┘
                     ▼
            Ensemble Aggregator
                     │
             Ranked Documents
                     │
                     ▼
                    LLM
```

Benefits

- Higher recall
- Better ranking
- More diverse results
- Improved robustness
- Better handling of mixed query types

---

# High-Level Architecture

```text
                     User Query
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
 Vector Search      Keyword Search    Metadata Search
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
               Ensemble Ranking Layer
                          │
               Combined Ranked Results
                          │
                          ▼
                   Prompt Construction
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
Multiple Retrievers
      │
      ▼
Individual Results
      │
      ▼
Score Fusion
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

# How Ensemble Retriever Works

1. Receive the user query.
2. Execute multiple retrievers independently.
3. Collect retrieved documents from each retriever.
4. Merge and rank the combined results.
5. Remove duplicate documents.
6. Return the highest-ranked documents to the LLM.

The aggregation strategy determines how documents from different retrievers are combined and ranked.

---

# Ensemble Strategies

## Weighted Score Fusion

Assigns different weights to each retriever based on importance.

Example

```
Final Score

=

0.7 × Vector Score

+

0.3 × BM25 Score
```

Best for

- Production RAG
- Hybrid search
- Enterprise knowledge bases

---

## Reciprocal Rank Fusion (RRF)

Ranks documents based on their positions in multiple ranked lists rather than raw similarity scores.

Advantages

- Simple
- Robust
- Widely used in search systems

---

## Voting

Documents retrieved by multiple retrievers receive higher priority.

Best for

- Small retrieval pipelines
- High-confidence search

---

## Rank Aggregation

Combines rankings from different retrieval methods into a unified ranked list.

---

# LangChain Implementation

LangChain provides the **EnsembleRetriever**, allowing multiple retrievers to be combined with configurable weights.

Typical workflow

```
Vector Retriever

+

BM25 Retriever

↓

Ensemble Retriever

↓

LLM
```

---
# 💻 LangChain Implementation Walkthrough

The following example demonstrates how an **Ensemble Retriever** is built by combining a **VectorStore Retriever** (semantic search) and a **BM25 Retriever** (keyword search). Each component has a single responsibility, reflecting the layered architecture commonly used in enterprise Retrieval-Augmented Generation (RAG) systems.

---

## Step 1 — Load Documents

Load and prepare documents that will be indexed by different retrieval strategies.

```python
from langchain_community.document_loaders import TextLoader

loader = TextLoader("knowledge_base.txt")
documents = loader.load()
```

---

## Step 2 — Build the Vector Retriever

Create embeddings, index the documents in a vector database, and expose a semantic retriever.

```python
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = Chroma.from_documents(
    documents=documents,
    embedding=embeddings
)

vector_retriever = vector_store.as_retriever(
    search_kwargs={"k": 4}
)
```

---

## Step 3 — Build the BM25 Retriever

Create a keyword-based retriever for exact term matching.

```python
from langchain_community.retrievers import BM25Retriever

bm25_retriever = BM25Retriever.from_documents(documents)
bm25_retriever.k = 4
```

---

## Step 4 — Create the Ensemble Retriever

Combine multiple retrievers using configurable weights.

```python
from langchain.retrievers import EnsembleRetriever

ensemble_retriever = EnsembleRetriever(
    retrievers=[
        vector_retriever,
        bm25_retriever
    ],
    weights=[0.7, 0.3]
)
```

---

## Step 5 — Retrieve Relevant Documents

Execute both retrieval strategies and return a unified ranked result.

```python
query = "How do I configure authentication in the API?"

retrieved_documents = ensemble_retriever.invoke(query)

for document in retrieved_documents:
    print(document.page_content)
```

---

## Step 6 — Integrate with the LLM

Use the retrieved documents as context for Retrieval-Augmented Generation (RAG).

```python
from langchain_core.prompts import PromptTemplate

context = "\n\n".join(
    doc.page_content
    for doc in retrieved_documents
)

prompt = PromptTemplate.from_template("""
Answer the user's question using only the provided context.

Context:
{context}

Question:
{question}
""")

final_prompt = prompt.format(
    context=context,
    question=query
)

response = llm.invoke(final_prompt)

print(response.content)
```

---

## End-to-End Retrieval Flow

```text
                    User Query
                         │
                         ▼
              Ensemble Retriever
        ┌────────────────┴────────────────┐
        ▼                                 ▼
 VectorStore Retriever             BM25 Retriever
 (Semantic Search)                 (Keyword Search)
        │                                 │
        └────────────────┬────────────────┘
                         ▼
               Score Fusion & Ranking
                         │
                         ▼
             Top Retrieved Documents
                         │
                         ▼
               Prompt Construction
                         │
                         ▼
                  Foundation Model
                         │
                         ▼
                 AI Generated Answer
```

This workflow demonstrates how an Ensemble Retriever combines the strengths of semantic and keyword retrieval to improve document recall and ranking quality. By aggregating results from multiple retrieval strategies before passing them to the LLM, enterprise RAG systems can provide more accurate, robust, and contextually relevant responses across a wide variety of query types.

---

# LlamaIndex Alternatives

LlamaIndex does not expose a dedicated Ensemble Retriever class.

Similar functionality can be achieved using:

- Query Fusion Retriever
- Router Retriever
- Hybrid Retrieval
- Custom retrieval pipelines

---

# Comparison with Other Retrievers

| Retriever | Primary Goal |
|------------|--------------|
| VectorStore Retriever | Semantic retrieval |
| BM25 Retriever | Keyword retrieval |
| Multi Query Retriever | Query expansion |
| Ensemble Retriever | Combine multiple retrieval strategies |
| Router Retriever | Select the best retriever |
| Hybrid Search Retriever | Combine lexical and semantic search |

---

# Enterprise Use Cases

### Enterprise Knowledge Search

Combine semantic retrieval with keyword search.

---

### Technical Documentation

Retrieve API names, version numbers, and natural language explanations.

---

### Customer Support

Combine FAQ search with semantic documentation retrieval.

---

### Legal Search

Retrieve statutory references and semantically related clauses.

---

### Financial Systems

Search reports using both terminology and semantic meaning.

---

# Advantages

- Higher recall
- Better precision
- More robust retrieval
- Reduced dependency on a single retrieval method
- Better handling of heterogeneous data
- Improved enterprise search quality

---

# Limitations

- Increased retrieval latency
- Higher computational cost
- More complex ranking logic
- Requires tuning of fusion strategies
- Duplicate removal may be necessary

---

# Production Best Practices

- Combine dense and sparse retrieval.
- Use Reciprocal Rank Fusion for ranking.
- Assign weights based on evaluation metrics.
- Cache frequently requested results.
- Evaluate recall and precision continuously.
- Monitor retrieval latency.

---

# Common Mistakes

- Using equal weights without evaluation.
- Combining highly similar retrievers.
- Ignoring duplicate documents.
- Not normalizing retrieval scores.
- Overcomplicating the ensemble pipeline.

---

# Interview Questions

### What problem does Ensemble Retriever solve?

### How does it differ from Hybrid Search?

### What is Reciprocal Rank Fusion?

### Why combine BM25 with vector search?

### When should Ensemble Retriever be used?

---

# Quick Revision

```text
User Query
      │
      ▼
Multiple Retrievers
      │
      ▼
Result Aggregation
      │
      ▼
Rank Fusion
      │
      ▼
Top Documents
      │
      ▼
LLM
```

---

# Key Takeaways

- Ensemble Retriever combines multiple retrieval techniques to improve search quality.
- It increases recall, precision, and retrieval robustness.
- Common aggregation methods include weighted score fusion, Reciprocal Rank Fusion (RRF), and rank aggregation.
- Combining semantic and keyword retrieval is a common enterprise pattern.
- Ensemble retrieval is widely used in production RAG systems handling diverse document collections.

---

# References

- LangChain Documentation — EnsembleRetriever
- LangChain Documentation — BM25Retriever
- LangChain Documentation — VectorStoreRetriever
- Research Paper — Reciprocal Rank Fusion (RRF)

---

## Next Note

**03-multivector-retriever.md** — Learn how MultiVector Retriever represents a single document using multiple embeddings, enabling more accurate retrieval through summaries, parent-child relationships, and semantic representations.
