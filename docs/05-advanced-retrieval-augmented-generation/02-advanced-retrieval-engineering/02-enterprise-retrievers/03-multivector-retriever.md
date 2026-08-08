# 03. MultiVector Retriever

> **Category:** Enterprise Retrievers
> **Module:** Advanced Retrieval Engineering
> **Prerequisites:** VectorStore Retriever, Parent Document Retriever, Embeddings, RAG Pipeline
> **Difficulty:** Advanced

> **Note:** MultiVector Retriever is an advanced retrieval technique that represents a single document using multiple vector embeddings instead of a single embedding. By indexing multiple semantic representations—such as summaries, parent-child chunks, titles, or hypothetical questions—it significantly improves retrieval accuracy while preserving access to the original source document. This technique is widely used in enterprise Retrieval-Augmented Generation (RAG) systems to improve semantic coverage and document recall.

---

# Overview

Traditional vector retrieval represents each document using a single embedding. While effective for many use cases, a single embedding often fails to capture all the important semantic aspects of complex documents.

For example, a technical document may contain:

- High-level concepts
- Detailed implementation steps
- API references
- Configuration examples
- Frequently asked questions

A single embedding cannot accurately represent every aspect of such content.

The **MultiVector Retriever** addresses this limitation by generating multiple embeddings for different representations of the same document. During retrieval, the system searches across all vectors but ultimately returns the original parent document or associated content.

Unlike traditional retrievers that maintain a one-to-one relationship between documents and embeddings, MultiVector Retriever supports a one-to-many relationship, allowing multiple semantic views of the same document.

This approach is particularly valuable for enterprise knowledge bases, technical documentation, legal documents, research papers, and large manuals where different users may search using different terminology.

---

# Why MultiVector Retrieval?

Traditional Retrieval

```text
                Document
                    │
                    ▼
             Single Embedding
                    │
                    ▼
             Vector Database
                    │
                    ▼
                Retrieval
```

Problems

- Limited semantic representation
- Difficult to match diverse queries
- Lower recall
- Missed contextual relationships

---

MultiVector Retrieval

```text
                   Document
                       │
      ┌────────────┬────────────┬────────────┐
      ▼            ▼            ▼            ▼
   Summary      Chunks      Questions      Title
      │            │            │            │
      ▼            ▼            ▼            ▼
 Multiple Vector Embeddings Stored Together
                    │
                    ▼
             Vector Database
                    │
                    ▼
               MultiVector Search
                    │
                    ▼
             Parent Document
                    │
                    ▼
                    LLM
```

Benefits

- Better semantic coverage
- Improved recall
- More accurate retrieval
- Multiple search perspectives
- Better enterprise search quality

---

# High-Level Architecture

```text
                  Enterprise Documents
                          │
                          ▼
               Multiple Representations
        ┌──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼
    Summary     Chunks    Questions    Metadata
        │          │          │          │
        └──────────┼──────────┼──────────┘
                   ▼
          Multiple Vector Embeddings
                   │
                   ▼
             Vector Database
                   │
                   ▼
           MultiVector Retriever
                   │
                   ▼
           Parent Document Store
                   │
                   ▼
                  LLM
```

---

# Retrieval Pipeline

```text
Document
      │
      ▼
Generate Multiple Embeddings
      │
      ▼
Vector Database
      │
      ▼
Similarity Search
      │
      ▼
Matching Vector
      │
      ▼
Retrieve Parent Document
      │
      ▼
Prompt Builder
      │
      ▼
LLM
```

---

# How MultiVector Retriever Works

1. Split or transform a document into multiple semantic representations.
2. Generate an embedding for each representation.
3. Store all embeddings with references to the same parent document.
4. Perform similarity search across every embedding.
5. Identify the highest-scoring representation.
6. Retrieve the corresponding parent document.
7. Pass the retrieved content to the LLM.

This architecture improves retrieval by allowing different semantic views of the same document to participate in the search process.

---

# Multiple Representation Strategies

## Summary Embeddings

Create concise summaries of long documents and generate embeddings from those summaries.

Best for

- Research papers
- Long reports
- Enterprise documentation

---

## Parent-Child Embeddings

Generate embeddings for smaller child chunks while returning the larger parent document.

Best for

- Technical documentation
- Product manuals
- Knowledge bases

---

## Hypothetical Questions

Generate likely user questions for each document and embed those questions.

Best for

- FAQ systems
- Customer support
- Internal search portals

---

## Metadata Embeddings

Create embeddings using document titles, tags, categories, and metadata.

Best for

- Enterprise search
- Catalog systems
- Knowledge management

---

# LangChain Architecture

```text
Document
      │
Generate Multiple Representations
      │
Multiple Embeddings
      │
Vector Store
      │
Document Store
      │
MultiVector Retriever
      │
LLM
```

The MultiVector Retriever coordinates between:

- Vector Store
- Document Store
- Multiple embedding representations

to retrieve the original source document.

---

# LangChain Implementation

Typical workflow

```
Document

↓

Summary Generator

↓

Question Generator

↓

Chunk Generator

↓

Multiple Embeddings

↓

MultiVector Retriever
```

---

# 💻 LangChain MultiVector Retriever Walkthrough

The following example demonstrates how a **MultiVector Retriever** represents a single document using multiple semantic representations. Instead of relying on a single embedding, summaries, document chunks, and hypothetical questions are embedded independently, allowing the retriever to search across multiple semantic views while returning the original parent document.

---

## Step 1 — Load the Parent Document

Load the original document that will serve as the source of truth during retrieval.

```python
from langchain_community.document_loaders import TextLoader

loader = TextLoader("enterprise_document.txt")
documents = loader.load()
```

---

## Step 2 — Generate Multiple Document Representations

Create different semantic representations of the same document.

```python
summary = "High-level summary of the enterprise document."

chunks = [
    "Section discussing authentication...",
    "Section describing API configuration...",
    "Section covering deployment..."
]

questions = [
    "How is authentication configured?",
    "How do I deploy the application?",
    "How are APIs secured?"
]
```

---

## Step 3 — Create Multiple Embeddings

Generate embeddings for every semantic representation.

```python
from langchain_huggingface import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

representations = [summary] + chunks + questions
```

---

## Step 4 — Build the MultiVector Index

Store every representation in the vector store while maintaining a reference to the original parent document.

```python
from langchain_chroma import Chroma

vector_store = Chroma(
    collection_name="enterprise_docs",
    embedding_function=embedding_model
)

# Each representation shares the same parent document ID
for text in representations:
    vector_store.add_texts(
        texts=[text],
        metadatas=[{"doc_id": "doc-001"}]
    )
```

---

## Step 5 — Create the MultiVector Retriever

Configure the retriever to search across all semantic representations and return the original parent document.

```python
from langchain.retrievers.multi_vector import MultiVectorRetriever
from langchain.storage import InMemoryStore

document_store = InMemoryStore()

document_store.mset([
    ("doc-001", documents[0])
])

retriever = MultiVectorRetriever(
    vectorstore=vector_store,
    docstore=document_store,
    id_key="doc_id"
)
```

---

## Step 6 — Retrieve the Parent Document

A user query is matched against every semantic representation, while the retriever returns the complete parent document.

```python
query = "How do I configure authentication?"

results = retriever.invoke(query)

for document in results:
    print(document.page_content)
```

---

## Step 7 — Pass Context to the LLM

Use the retrieved parent document to construct the final prompt for Retrieval-Augmented Generation (RAG).

```python
context = "\n\n".join(
    doc.page_content
    for doc in results
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
                 Enterprise Document
                          │
                          ▼
         Multiple Semantic Representations
      ┌──────────┬──────────┬─────────────┐
      ▼          ▼          ▼             ▼
   Summary     Chunks    Questions    Metadata
      │          │          │             │
      └──────────┼──────────┼─────────────┘
                 ▼
        Multiple Vector Embeddings
                 │
                 ▼
            Chroma Vector Store
                 │
                 ▼
        MultiVector Retriever
                 │
                 ▼
        Parent Document Store
                 │
                 ▼
        Original Source Document
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

This implementation demonstrates how the **MultiVector Retriever** improves retrieval quality by indexing multiple semantic representations of the same document. During retrieval, similarity search is performed across summaries, chunks, and hypothetical questions, while the retriever returns the original parent document. This approach increases semantic coverage, improves recall, and provides richer context for enterprise Retrieval-Augmented Generation (RAG) systems.

---

# LlamaIndex Alternatives

LlamaIndex does not provide a dedicated **MultiVector Retriever**.

Similar functionality can be achieved using:

- Summary Index
- Vector Store Index
- Recursive Retriever
- Composable Retrieval Pipelines
- Custom Node Relationships

---

# Comparison with Other Retrievers

| Retriever | Primary Goal |
|------------|--------------|
| VectorStore Retriever | Single embedding retrieval |
| Parent Document Retriever | Preserve larger document context |
| Multi Query Retriever | Generate multiple search queries |
| MultiVector Retriever | Multiple embeddings for one document |
| Ensemble Retriever | Combine multiple retrievers |

---

# Enterprise Use Cases

### Enterprise Knowledge Bases

Represent documents using summaries, sections, and FAQs.

---

### Technical Documentation

Support searches using implementation details, concepts, and API names.

---

### Legal Document Retrieval

Represent contracts through clauses, summaries, and legal terminology.

---

### Medical Knowledge Systems

Enable retrieval through symptoms, diagnoses, treatments, and summaries.

---

### Financial Research

Represent reports using executive summaries, risk analysis, and detailed sections.

---

# Advantages

- Higher retrieval recall
- Better semantic coverage
- Improved search flexibility
- Better handling of long documents
- Preserves original document context
- Improved user experience

---

# Limitations

- Increased storage requirements
- More embedding generation time
- Larger vector indexes
- More complex indexing pipeline
- Higher maintenance overhead

---

# Production Best Practices

- Store parent documents separately from vector embeddings.
- Use summaries for long documents.
- Combine with Parent Document Retriever.
- Maintain consistent document identifiers.
- Optimize embedding generation pipelines.
- Regularly evaluate retrieval performance.
- Monitor vector index growth and storage costs.

---

# Common Mistakes

- Generating redundant embeddings.
- Using too many representations for small documents.
- Failing to maintain parent-child mappings.
- Ignoring storage overhead.
- Mixing unrelated semantic representations.

---

# Interview Questions

### What problem does MultiVector Retriever solve?

### How does it differ from Parent Document Retriever?

### Why use multiple embeddings for the same document?

### What document representations are commonly embedded?

### What are the trade-offs of MultiVector Retrieval?

---

# Quick Revision

```text
Document
      │
Multiple Representations
      │
Multiple Embeddings
      │
Vector Database
      │
Similarity Search
      │
Parent Document
      │
LLM
```

---

# Key Takeaways

- MultiVector Retriever represents a document using multiple semantic embeddings.
- It improves recall by enabling multiple search perspectives for the same document.
- Retrieval is performed over multiple vectors while returning the original parent document.
- It is particularly effective for long, information-rich enterprise documents.
- MultiVector Retrieval is widely used in production RAG systems requiring high retrieval accuracy and semantic coverage.

---

# References

- LangChain Documentation — MultiVectorRetriever
- LangChain Documentation — ParentDocumentRetriever
- LangChain Documentation — MultiVector Retrieval
- Retrieval-Augmented Generation (RAG) Best Practices

---

## Next Note

**04-timeweighted-retriever.md** — Learn how TimeWeighted Retriever incorporates document recency into retrieval by balancing semantic relevance with time-based scoring, making it ideal for conversational memory, dynamic knowledge bases, and continuously evolving enterprise data.
