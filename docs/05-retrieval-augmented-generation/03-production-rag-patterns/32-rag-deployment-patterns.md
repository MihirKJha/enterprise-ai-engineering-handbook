# 32. RAG Deployment Patterns

> **Category:** Production RAG Patterns  
> **Series:** Enterprise AI Engineering Handbook  
> **Prerequisites:** Scaling RAG Systems, Security & Governance, Observability & Monitoring  
> **Difficulty:** Advanced

> **Note:** This chapter is **not part of the IBM AI Engineering course**. It focuses on deployment architectures, DevOps practices, CI/CD pipelines, Kubernetes, GitOps, and cloud-native deployment strategies used to operate enterprise Retrieval-Augmented Generation (RAG) platforms.

---

# Overview

Building a production-ready RAG application is only half the challenge.

The other half is deploying it safely, reliably, and repeatedly across development, testing, staging, and production environments.

Unlike traditional applications, RAG systems include multiple AI-specific services:

- APIs
- Retrieval Services
- Embedding Services
- Vector Databases
- Rerankers
- LLM Gateways
- Prompt Templates
- Evaluation Pipelines

Each component has its own deployment lifecycle.

Enterprise deployment strategies ensure:

- High availability
- Zero downtime
- Rollback capability
- Automated testing
- Secure releases
- Continuous delivery

---

# Enterprise Deployment Architecture

```text
                  Developers
                       │
                Git Repository
                       │
                 CI/CD Pipeline
                       │
         Build • Test • Security Scan
                       │
               Container Registry
                       │
              Kubernetes Cluster
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
 API Service     Retriever Service   Embedding Service
      │                │                │
      └────────────────┼────────────────┘
                       ▼
               Vector Database
                       │
                 Reranker Service
                       │
                  LLM Gateway
                       │
                  Monitoring Stack
```

---

# Deployment Environments

Enterprise systems typically use multiple environments.

```text
Developer Laptop

↓

Development

↓

Integration

↓

Testing

↓

Staging

↓

Production
```

Each environment validates changes before production deployment.

---

# Containerized Deployment

Containers package applications together with all dependencies.

```text
Application

↓

Dependencies

↓

Docker Image

↓

Container
```

Benefits

- Consistent deployments
- Portable across cloud providers
- Easy rollback
- Faster provisioning

Example Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "main.py"]
```

---

# Kubernetes Deployment

Kubernetes is the preferred orchestration platform for enterprise AI systems.

```text
                Kubernetes Cluster

         ┌────────────┬────────────┐
         ▼            ▼            ▼
      API Pods   Retriever Pods  LLM Gateway Pods
         │            │            │
         └────────────┼────────────┘
                      ▼
             Vector Database
```

Typical Kubernetes resources

- Deployment
- Service
- Ingress
- ConfigMap
- Secret
- HorizontalPodAutoscaler

---

# Microservice Deployment

Each major RAG component should be independently deployable.

```text
API

↓

Retriever

↓

Prompt Builder

↓

LLM Gateway

↓

Evaluation Service
```

Advantages

- Independent scaling
- Independent releases
- Easier maintenance
- Fault isolation

---

# CI/CD Pipeline

Continuous Integration (CI)

Automatically:

- Build
- Run unit tests
- Static code analysis
- Security scanning
- Package containers

Continuous Delivery (CD)

Automatically:

- Deploy
- Validate
- Monitor
- Roll back if necessary

---

# Enterprise CI/CD Workflow

```text
Developer Commit
        │
        ▼
Git Repository
        │
        ▼
Build Pipeline
        │
        ▼
Unit Tests
        │
        ▼
Integration Tests
        │
        ▼
Security Scan
        │
        ▼
Container Build
        │
        ▼
Container Registry
        │
        ▼
Deployment
```

---

# GitOps

GitOps treats Git as the single source of truth for deployments.

```text
Git Repository

↓

Deployment Manifest

↓

GitOps Controller

↓

Kubernetes Cluster
```

Benefits

- Version control
- Auditability
- Easy rollback
- Declarative infrastructure

Popular GitOps tools

- Argo CD
- Flux CD

---

# Deployment Strategies

## Rolling Deployment

Pods are replaced gradually.

```text
Version 1

↓

Version 1 + Version 2

↓

Version 2
```

Advantages

- No downtime
- Simple rollout

---

## Blue-Green Deployment

Two production environments exist simultaneously.

```text
Production

↓

Blue

Green

↓

Traffic Switch
```

Advantages

- Instant rollback
- Zero downtime

Limitations

- Double infrastructure cost

---

## Canary Deployment

Release to a small percentage of users.

```text
5%

↓

20%

↓

50%

↓

100%
```

Benefits

- Detect issues early
- Lower deployment risk

---

## Shadow Deployment

Production traffic is copied to a new version without affecting users.

```text
Users

↓

Production

↓

Shadow System

(No User Impact)
```

Useful for validating:

- New prompts
- New retrievers
- New LLMs

---

# Infrastructure as Code (IaC)

Infrastructure should be deployed automatically.

Popular tools

| Tool | Purpose |
|------|----------|
| Terraform | Multi-cloud infrastructure |
| Pulumi | Infrastructure using programming languages |
| AWS CloudFormation | AWS infrastructure |
| Azure Bicep | Azure infrastructure |

Infrastructure becomes:

- Repeatable
- Version controlled
- Auditable

---

# Configuration Management

Separate configuration from application code.

Examples

```text
Environment Variables

↓

ConfigMap

↓

Secret Manager
```

Store

- API endpoints
- Feature flags
- Prompt versions
- Model names
- Database URLs

Never hard-code configuration.

---

# Secrets Management

Secrets include:

- API keys
- Database passwords
- JWT signing keys
- TLS certificates
- LLM credentials

Store them using:

- Kubernetes Secrets
- Azure Key Vault
- AWS Secrets Manager
- Google Secret Manager
- HashiCorp Vault

---

# Model Deployment

LLMs may be:

```text
Cloud APIs

↓

Azure OpenAI

↓

OpenAI

↓

Anthropic

↓

Local Models

↓

Ollama

↓

vLLM

↓

TensorRT-LLM
```

Deploy models independently from application services.

---

# Prompt Deployment

Treat prompts as versioned artifacts.

```text
Prompt v1

↓

Prompt v2

↓

Prompt v3
```

Deploy prompts independently.

Benefits

- Rollback
- A/B Testing
- Auditability

---

# Deployment Validation

Every deployment should verify:

- API availability
- Retrieval accuracy
- Prompt correctness
- Latency
- Security
- Cost impact

Validation pipeline

```text
Deployment

↓

Smoke Tests

↓

Integration Tests

↓

RAG Evaluation

↓

Monitoring

↓

Production
```

---

# Rollback Strategy

Rollback should be automatic whenever deployments fail.

Triggers

- Increased latency
- Increased error rate
- Failed health checks
- Retrieval degradation
- Cost spikes

```text
Deploy v2

↓

Health Check

↓

Failure

↓

Rollback to v1
```

---

# Monitoring After Deployment

Immediately monitor:

- Response latency
- API failures
- Retrieval metrics
- Token usage
- Cost
- Hallucination rate
- User feedback

Deployment is complete only after production health is verified.

---

# Enterprise Reference Architecture

```text
                     Git Repository
                           │
                     CI Pipeline
                           │
                 Security & QA Tests
                           │
                 Container Registry
                           │
                    GitOps Controller
                           │
                 Kubernetes Cluster
                           │
        ┌───────────┼────────────┬────────────┐
        ▼           ▼            ▼            ▼
     API Pods   Retriever   Embeddings   LLM Gateway
                    │            │            │
                    └────────────┼────────────┘
                                 ▼
                        Vector Database
                                 │
                           Monitoring
                                 │
                    Prometheus • Grafana
```

---

# Enterprise Use Cases

### Enterprise Knowledge Assistant

Deploy retriever services independently while upgrading the LLM gateway without affecting document ingestion.

---

### SaaS AI Platform

Use Canary deployments to gradually release new retrieval algorithms across thousands of customer tenants.

---

### Banking AI

Deploy using Blue-Green strategy to guarantee zero downtime for customer-facing services.

---

### Healthcare AI

Validate updated prompt templates in a Shadow deployment before enabling them for clinicians.

---

### Global AI Platform

Use GitOps with Kubernetes across multiple cloud regions to ensure consistent deployments and disaster recovery.

---

# Production Best Practices

- Containerize every service for consistent deployments.
- Deploy components as independently scalable microservices.
- Automate CI/CD with comprehensive testing and security scanning.
- Use GitOps to manage Kubernetes deployments declaratively.
- Version prompts, embedding models, and retrieval pipelines independently.
- Prefer Canary or Blue-Green deployments for production releases.
- Store configuration and secrets outside application code.
- Continuously monitor deployments and automate rollback when health checks fail.
- Validate retrieval quality after every production deployment, not just API availability.

---

# Common Mistakes

❌ Deploying the entire RAG platform as a single monolithic service

❌ Hard-coding API keys or model configurations

❌ Updating prompts directly in production without version control

❌ Skipping retrieval evaluation after deployment

❌ Deploying new embedding models without rebuilding indexes

❌ Ignoring rollback planning

❌ Treating AI deployments the same as traditional web applications

---

# Interview Questions

### Why are microservices preferred for enterprise RAG deployment?

They allow independent deployment, scaling, fault isolation, and maintenance of individual AI components such as retrieval, embeddings, reranking, and LLM gateways.

---

### What is the advantage of GitOps?

GitOps uses Git as the single source of truth, enabling declarative deployments, version control, auditing, and simplified rollback.

---

### When should Canary deployments be used?

Canary deployments are ideal for gradually releasing new models, prompts, or retrieval strategies while limiting risk by exposing only a small percentage of users initially.

---

### Why should prompts be versioned?

Prompt changes can significantly impact AI behavior. Versioning enables controlled releases, experimentation, auditing, and rapid rollback.

---

### Why is deployment validation more complex for RAG systems?

Because successful deployment requires verifying not only infrastructure health but also retrieval quality, prompt behavior, model performance, latency, and AI-specific evaluation metrics.

---

# Quick Revision

```text
RAG Deployment

Deployment
│
├── Containers
├── Kubernetes
├── Microservices
└── GitOps

CI/CD
│
├── Build
├── Test
├── Security Scan
├── Deploy
└── Validate

Deployment Strategies
│
├── Rolling
├── Blue-Green
├── Canary
└── Shadow

Operations
│
├── IaC
├── Secrets
├── Monitoring
└── Rollback
```

---

# Key Takeaways

- Enterprise RAG deployments require far more than deploying an API; every AI component has its own lifecycle and operational requirements.
- Containers, Kubernetes, GitOps, and Infrastructure as Code provide repeatable, scalable, and reliable deployment processes.
- Deployment strategies such as Rolling, Blue-Green, Canary, and Shadow releases reduce operational risk while supporting continuous delivery.
- Prompts, embedding models, retrievers, and LLMs should be versioned and deployed independently.
- Production deployments should always include automated validation, continuous monitoring, and rollback mechanisms to maintain service reliability and AI quality.

---

# References

- Kubernetes Documentation
- Docker Documentation
- Argo CD Documentation
- Flux CD Documentation
- Terraform Documentation
- LangChain Documentation
- LlamaIndex Documentation
- OpenTelemetry Documentation
- Microsoft Azure Well-Architected Framework
- Google Cloud Architecture Framework
- AWS Well-Architected Framework

---

## Next Note

**33-rag-testing-framework.md** — Learn how enterprise AI teams test RAG systems using unit testing, integration testing, retrieval evaluation, prompt testing, regression testing, LLM evaluation, and end-to-end validation to ensure reliable production AI applications.