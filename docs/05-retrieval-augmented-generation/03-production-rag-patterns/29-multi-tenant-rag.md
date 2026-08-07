# 29. Multi-Tenant RAG

> **Category:** Production RAG Patterns  
> **Series:** Enterprise AI Engineering Handbook  
> **Prerequisites:** Security & Governance, Caching Strategies, Hybrid Search Patterns  
> **Difficulty:** Advanced

> **Note:** This chapter is **not part of the IBM AI Engineering course**. It focuses on designing enterprise Retrieval-Augmented Generation (RAG) platforms that securely serve multiple customers, departments, or organizations while maintaining complete tenant isolation, governance, scalability, and cost efficiency.

---

# Overview

Most enterprise AI platforms are **multi-tenant**.

Instead of deploying a separate RAG application for every customer, organizations build a **shared AI platform** capable of serving multiple tenants securely.

A tenant can represent:

- A customer
- A business unit
- A department
- A project
- A geographical region

The biggest challenge is ensuring **complete data isolation** while maximizing infrastructure utilization.

A successful Multi-Tenant RAG platform provides:

- Secure tenant isolation
- Independent knowledge bases
- Scalable infrastructure
- Centralized operations
- Cost-efficient resource sharing

---

# What is Multi-Tenancy?

A multi-tenant architecture allows multiple tenants to share the same application while keeping their data completely isolated.

```text
                 Enterprise AI Platform

        ┌────────────┬────────────┬────────────┐
        ▼            ▼            ▼
     Tenant A     Tenant B     Tenant C
        │            │            │
 Knowledge A   Knowledge B   Knowledge C
```

Although the application is shared, each tenant experiences an independent AI assistant.

---

# Why Multi-Tenant RAG?

Imagine building an AI assistant for:

- 500 enterprise customers
- 5,000 companies
- 200 departments
- Millions of users

Deploying one RAG system per customer is expensive and difficult to manage.

Instead:

```text
One Enterprise AI Platform

↓

Tenant Isolation

↓

Independent Knowledge Bases

↓

Shared Infrastructure
```

---

# Multi-Tenant Architecture

```text
                   Users
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    Tenant A      Tenant B      Tenant C
        │             │             │
        └─────────────┼─────────────┘
                      ▼
             API Gateway
                      │
            Authentication
                      │
             Tenant Resolver
                      │
              Authorization
                      │
             Retrieval Service
                      │
          Tenant-Aware Filtering
                      │
             Vector Database
                      │
                     LLM
```

---

# Tenant Identification

Every request must include tenant information.

Common approaches:

- JWT Claims
- OAuth Tokens
- API Keys
- HTTP Headers
- Session Context

Example

```json
{
  "user": "alice",
  "tenant_id": "tenant-001",
  "role": "Engineer"
}
```

The tenant identifier becomes part of every downstream operation.

---

# Tenant Isolation Models

## Model 1 — Shared Database, Shared Collection

```text
Vector Database

↓

Single Collection

↓

Tenant Metadata
```

Filtering

```
tenant_id = tenant_001
```

Advantages

- Lowest cost
- Simple management

Disadvantages

- Higher security risk
- Large indexes
- Strict metadata filtering required

---

## Model 2 — Shared Database, Separate Collections

```text
Vector Database

├── Tenant A Collection

├── Tenant B Collection

└── Tenant C Collection
```

Advantages

- Better isolation
- Easier maintenance
- Improved performance

Most common enterprise approach.

---

## Model 3 — Separate Databases

```text
Tenant A

↓

Vector DB A

Tenant B

↓

Vector DB B

Tenant C

↓

Vector DB C
```

Advantages

- Strong isolation
- Independent scaling
- Regulatory compliance

Disadvantages

- Higher infrastructure cost

---

## Model 4 — Dedicated Infrastructure

```text
Customer A

↓

Dedicated Kubernetes Cluster

↓

Dedicated Vector Database

↓

Dedicated LLM
```

Used for:

- Government
- Banking
- Healthcare
- Defense

---

# Tenant-Aware Retrieval

Retrieval must always enforce tenant boundaries.

```text
User Query
      │
Tenant Resolver
      │
Retriever
      │
Tenant Filter
      │
Authorized Documents
      │
LLM
```

Example metadata

```json
{
  "tenant_id": "tenant-001",
  "department": "Engineering",
  "document_type": "Architecture"
}
```

Example filter

```
tenant_id = tenant-001

AND

department = Engineering
```

---

# Namespace Partitioning

Many vector databases support namespaces.

```text
Vector Database

├── Namespace A

├── Namespace B

├── Namespace C

└── Namespace D
```

Benefits

- Logical isolation
- Faster search
- Easier backup
- Simplified administration

Supported by platforms such as:

- Pinecone
- Weaviate
- Qdrant
- Milvus (collections/partitions)

---

# Authentication & Authorization

Authentication verifies the user.

Authorization verifies:

```text
User

↓

Tenant

↓

Role

↓

Permissions

↓

Retriever
```

Example

| Role | Access |
|------|--------|
| Engineer | Engineering Docs |
| HR | HR Documents |
| Finance | Financial Records |
| Admin | Tenant Administration |

---

# Multi-Tenant Ingestion Pipeline

```text
Tenant Upload
      │
Document Validation
      │
Chunking
      │
Embedding Generation
      │
Metadata Enrichment
      │
Tenant Collection
      │
Index Update
```

Each document must be tagged with:

- Tenant ID
- Department
- Classification
- Owner
- Version

---

# Tenant-Aware Caching

Caches should never be shared across tenants without isolation.

Cache key example

```text
Hash(

Tenant ID +

Query +

Prompt Version +

Embedding Model +

LLM Version

)
```

This prevents accidental cross-tenant cache hits.

---

# Multi-Tenant Monitoring

Monitor both platform-wide and tenant-specific metrics.

Examples

| Platform Metrics | Tenant Metrics |
|------------------|----------------|
| CPU Usage | Query Volume |
| Memory Usage | Token Consumption |
| Request Rate | Retrieval Latency |
| Error Rate | Cache Hit Ratio |
| GPU Usage | User Satisfaction |

---

# Cost Management

Track AI costs per tenant.

Monitor:

- Token usage
- Embedding requests
- LLM requests
- Storage usage
- Vector searches
- GPU hours

Example

```text
Tenant A

↓

Monthly AI Cost

↓

$1,250
```

Cost allocation supports billing and optimization.

---

# Scaling Strategy

```text
                 Load Balancer
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
    API Server   API Server   API Server
         │            │            │
         └────────────┼────────────┘
                      ▼
             Retrieval Cluster
                      │
             Vector Database
                      │
              Shared LLM Gateway
```

Scale independently:

- API servers
- Retriever services
- Vector databases
- Embedding services
- LLM gateways

---

# Enterprise Use Cases

### SaaS Knowledge Platform

Each customer uploads private documentation while sharing the same AI platform.

---

### Internal Enterprise Assistant

Separate knowledge bases for HR, Finance, Engineering, Legal, and Sales.

---

### Managed AI Service

One cloud platform hosts hundreds of enterprise customers with isolated vector indexes.

---

### Healthcare AI

Hospitals share infrastructure while maintaining complete patient data isolation.

---

### Banking Platform

Each bank operates within isolated collections and independent security policies.

---

# Production Best Practices

- Resolve tenant identity before any retrieval operation.
- Enforce authorization before vector search.
- Prefer separate collections or namespaces over metadata-only isolation for production workloads.
- Include tenant identifiers in cache keys, logs, metrics, and audit records.
- Encrypt tenant data both at rest and in transit.
- Monitor resource usage and AI costs per tenant.
- Support independent backup and recovery for each tenant.
- Design infrastructure to scale tenants independently without affecting others.

---

# Common Mistakes

❌ Using shared caches without tenant-aware keys

❌ Performing retrieval before tenant validation

❌ Storing tenant data without metadata

❌ Logging cross-tenant information

❌ Sharing vector indexes without proper isolation

❌ Tracking only platform metrics instead of tenant-level metrics

---

# Interview Questions

### What is a multi-tenant RAG system?

A multi-tenant RAG system is a shared AI platform that serves multiple customers or organizations while keeping their data, retrieval, and access controls completely isolated.

---

### Why is tenant-aware retrieval important?

It ensures that retrieved documents belong only to the authenticated tenant, preventing cross-tenant data exposure.

---

### What are the common tenant isolation models?

- Shared database with shared collection
- Shared database with separate collections
- Separate databases
- Dedicated infrastructure

---

### Why should cache keys include the tenant ID?

Including the tenant ID prevents cached responses or retrieval results from being accidentally shared across different tenants.

---

### Which isolation model is commonly used in enterprise AI platforms?

A shared database with separate collections or namespaces offers a good balance between security, scalability, operational simplicity, and cost.

---

# Quick Revision

```text
Multi-Tenant RAG

Tenant Identification
│
├── JWT
├── OAuth
├── API Key
└── Session

Isolation Models
│
├── Shared Collection
├── Separate Collections
├── Separate Databases
└── Dedicated Infrastructure

Security
│
├── Authentication
├── Authorization
├── Tenant Filtering
└── Metadata

Operations
│
├── Tenant Cache
├── Monitoring
├── Cost Tracking
└── Independent Scaling
```

---

# Key Takeaways

- Multi-tenant RAG platforms enable multiple customers or business units to share the same AI infrastructure while maintaining strict data isolation.
- Tenant identity should be resolved before retrieval, and authorization must be enforced before accessing any documents.
- Collections, namespaces, or dedicated databases provide stronger isolation than metadata filtering alone.
- Tenant-aware caching, monitoring, logging, and cost allocation are essential for operating enterprise AI platforms at scale.
- A well-designed multi-tenant architecture balances security, performance, scalability, and operational efficiency.

---

# References

- Pinecone Documentation (Namespaces)
- Milvus Documentation (Collections & Partitions)
- Weaviate Documentation (Multi-Tenancy)
- Qdrant Documentation (Collections)
- Microsoft Azure AI Search Documentation
- Google Vertex AI Search Documentation
- NIST AI Risk Management Framework
- OWASP Top 10 for Large Language Model Applications

---

## Next Note

**30-cost-optimization.md** — Learn how enterprise AI teams optimize infrastructure, token usage, embeddings, vector databases, caching, and inference strategies to reduce operational costs while maintaining high-quality RAG performance.