# 06. Recursive Retriever

> **Category:** LlamaIndex Retrievers
> **Module:** Advanced Retrieval Engineering
> **Prerequisites:** LlamaIndex Indexes, Vector Index Retriever, Document Summary Retriever, Graph-Based Retrieval
> **Difficulty:** Advanced

> **Note:** The Recursive Retriever is one of the most powerful retrieval mechanisms in LlamaIndex. Instead of retrieving isolated document chunks, it recursively traverses relationships between nodes, indexes, retrievers, and query engines to discover additional relevant information. This enables hierarchical, multi-hop, and compositional retrieval, making it particularly valuable for enterprise AI systems that manage interconnected knowledge across multiple documents and data sources.

---

# Overview

Traditional retrieval systems retrieve documents in a single step.

```
Query

↓

Retriever

↓

Documents
```

This approach works well when the answer exists within a single document or a few independent chunks.

However, enterprise knowledge is rarely organized this way.

Information is often distributed across:

- Product documentation
- Technical architecture
- API references
- Knowledge bases
- Wikis
- Research papers
- SQL databases
- Knowledge graphs

Finding the correct answer may require traversing relationships between these resources.

The **Recursive Retriever** addresses this challenge by repeatedly following references from one node to another until sufficient context has been gathered.

Instead of treating nodes as isolated pieces of text, Recursive Retriever treats them as connected objects within a knowledge network.

---

# Why Recursive Retriever?

Traditional Retrieval

```text
                 User Query
                      │
                      ▼
                Retriever
                      │
                      ▼
               Retrieved Node
                      │
                      ▼
                     LLM
```

Problems

- Retrieves isolated chunks
- Limited context
- No relationship traversal
- Cannot perform multi-hop retrieval

---

Recursive Retrieval

```text
                 User Query
                      │
                      ▼
            Recursive Retriever
                      │
                      ▼
              Initial Node
                      │
                      ▼
          Follow Relationships
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
 Parent Node     Child Node     Linked Index
      │               │                │
      └───────────────┼────────────────┘
                      ▼
              Complete Context
                      │
                      ▼
                     LLM
```

Benefits

- Multi-hop retrieval
- Rich contextual understanding
- Hierarchical navigation
- Cross-document retrieval
- Better answer quality

---

# High-Level Architecture

```text
                    User Query
                         │
                         ▼
                Recursive Retriever
                         │
                  Initial Retrieval
                         │
                         ▼
                  Retrieved Node
                         │
         ┌───────────────┼─────────────────┐
         ▼               ▼                 ▼
   Parent Node     Child Nodes     Linked Retriever
         │               │                 │
         └───────────────┼─────────────────┘
                         ▼
                 Aggregated Context
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
Initial Retrieval
      │
      ▼
Retrieve Node
      │
      ▼
Follow Relationships
      │
      ▼
Retrieve Related Nodes
      │
      ▼
Merge Context
      │
      ▼
LLM
```

---

# How Recursive Retriever Works

## Step 1 – Retrieve Initial Node

The process begins with a standard retrieval.

```text
User Query

↓

Vector Retriever

↓

Node A
```

---

## Step 2 – Inspect Relationships

The retrieved node may reference:

- Parent nodes
- Child nodes
- Other documents
- Other indexes
- Another retriever
- A query engine

Example

```text
Node A

↓

Related Nodes

↓

Node B

Node C

Node D
```

---

## Step 3 – Recursive Retrieval

The retriever follows these references.

```text
Node A

↓

Node B

↓

Node C

↓

Node D
```

This process continues until:

- Maximum recursion depth is reached
- No more relationships exist
- Enough context has been collected

---

## Step 4 – Aggregate Context

All retrieved nodes are merged.

```text
Node A

+

Node B

+

Node C

+

Node D

↓

Context
```

---

## Step 5 – Response Generation

The complete context is sent to the LLM.

```text
Merged Context

↓

Query Engine

↓

LLM
```

---

# Example Workflow

Imagine an enterprise software platform.

```
Cloud Architecture Guide
      │
      ├── API Gateway
      │
      ├── Authentication
      │
      ├── Monitoring
      │
      └── Kubernetes Deployment
```

User Query

```
How does authentication work in the API Gateway?
```

Recursive Retrieval

```text
Authentication

↓

API Gateway

↓

Security Policy

↓

OAuth Documentation

↓

Identity Provider

↓

Final Context
```

Instead of returning only one document chunk, the retriever builds a comprehensive view from multiple connected resources.

---

# Relationship Types

Recursive Retriever can traverse different kinds of relationships.

### Parent → Child

```text
Chapter

↓

Section

↓

Paragraph
```

---

### Child → Parent

```text
Paragraph

↓

Section

↓

Document
```

---

### Node → Node

```text
Authentication

↓

Authorization

↓

Identity
```

---

### Index → Index

```text
Engineering Index

↓

Security Index

↓

Operations Index
```

---

### Retriever → Retriever

```text
Vector Retriever

↓

BM25 Retriever

↓

Knowledge Graph Retriever
```

---

### Query Engine → Query Engine

```text
Finance Query Engine

↓

Legal Query Engine

↓

Compliance Query Engine
```

---

# Recursive Retrieval Example

```text
User Query
      │
      ▼
Vector Retriever
      │
      ▼
Authentication Node
      │
      ▼
Parent Document
      │
      ▼
Security Architecture
      │
      ▼
OAuth Guide
      │
      ▼
Identity Provider
      │
      ▼
Final Context
```

---

# LangChain Comparison

LlamaIndex

```text
Recursive Retriever

↓

Query Engine

↓

LLM
```

Closest LangChain equivalent

```text
Parent Document Retriever

+

Multi Retriever

+

Router

+

Graph Traversal

↓

LLM
```

LangChain provides similar capabilities by composing multiple components, while LlamaIndex offers Recursive Retriever as a dedicated retrieval abstraction.

---

# Enterprise Use Cases

### Enterprise Knowledge Graphs

Traverse relationships between departments, projects, and documentation.

---

### Technical Documentation

Navigate from API references to architecture diagrams and deployment guides.

---

### Legal Research

Follow citations across contracts, regulations, and legal precedents.

---

### Healthcare Systems

Retrieve interconnected clinical guidelines, diagnoses, treatments, and drug information.

---

### Software Engineering Assistants

Navigate source code documentation, architecture documents, design decisions, and operational runbooks.

---

### Financial Services

Link compliance rules, audit reports, policies, and transaction records.

---

# Advantages

- Multi-hop retrieval
- Rich contextual understanding
- Hierarchical navigation
- Cross-document reasoning
- Supports multiple indexes
- Supports multiple retrievers
- Excellent for enterprise knowledge graphs

---

# Limitations

- Higher retrieval latency
- More complex architecture
- Increased token consumption
- Requires well-defined relationships
- More difficult to debug than simple retrieval

---

# Production Best Practices

- Define explicit relationships between nodes during indexing.
- Limit recursion depth to avoid excessive retrieval.
- Cache frequently traversed paths.
- Combine Recursive Retriever with rerankers.
- Monitor retrieval latency and recursion depth.
- Log traversal paths for debugging.
- Apply metadata filters before recursive expansion.

---

# Common Mistakes

- Creating cyclic relationships without safeguards.
- Allowing unlimited recursion depth.
- Retrieving every linked node regardless of relevance.
- Ignoring metadata during traversal.
- Building relationships that are too coarse or too fine.

---

# Interview Questions

### What is the Recursive Retriever?

### How does it differ from the Vector Index Retriever?

### What problem does recursive retrieval solve?

### What types of relationships can Recursive Retriever traverse?

### Why is recursion depth important?

### When should Recursive Retriever be used instead of standard vector retrieval?

---

# Quick Revision

```text
User Query
      │
Vector Retriever
      │
Initial Node
      │
Follow Relationships
      │
Parent
Child
Linked Nodes
Linked Indexes
      │
Merged Context
      │
Query Engine
      │
LLM
```

---

# Key Takeaways

- Recursive Retriever extends traditional retrieval by traversing relationships between nodes, indexes, retrievers, and query engines.
- It enables multi-hop and hierarchical retrieval, making it ideal for interconnected enterprise knowledge bases.
- Recursive retrieval builds richer context by following references rather than relying on isolated document chunks.
- Proper relationship modeling and recursion limits are essential for scalable production systems.
- Recursive Retriever is particularly valuable for enterprise documentation, knowledge graphs, legal research, healthcare, and software engineering assistants.

---

# References

- LlamaIndex Documentation — Recursive Retriever
- LlamaIndex Documentation — Query Engine
- LlamaIndex Documentation — Node Relationships
- LlamaIndex Documentation — Composable Retrieval
- Enterprise RAG Architecture Best Practices

---

## Next Note

**07-query-fusion-retriever.md** — Learn how the Query Fusion Retriever improves recall by generating multiple query variations, retrieving results for each variation, and intelligently fusing them into a single ranked result set for more robust enterprise RAG systems.