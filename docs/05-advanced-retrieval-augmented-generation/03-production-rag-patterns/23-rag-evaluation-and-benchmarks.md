# 23. RAG Evaluation and Benchmarks

> **Category:** Production RAG Patterns  
> **Series:** Enterprise AI Engineering Handbook  
> **Prerequisites:** Enterprise Retrieval Best Practices, Production Retrieval Architecture  
> **Difficulty:** Advanced

> **Note:** This chapter is **not part of the IBM AI Engineering course**. It focuses on evaluating Retrieval-Augmented Generation (RAG) systems using industry-standard metrics, benchmark datasets, automated evaluation frameworks, and human assessment to continuously improve production AI systems.

---

# Overview

Building a RAG system is only the beginning. Without systematic evaluation, it is impossible to know whether changes improve or degrade retrieval and generation quality.

Enterprise evaluation answers questions such as:

- Is the retriever finding the right documents?
- Does the LLM generate factually correct answers?
- Are users satisfied with the responses?
- Has a model update improved performance?
- Has retrieval quality degraded after new documents were indexed?

A production RAG system should continuously evaluate **both retrieval and generation**, since improvements in one component do not necessarily improve the other.

---

# Why RAG Evaluation Matters

```text
            User Question
                  │
                  ▼
          Retrieval Layer
                  │
        Is context relevant?
                  │
                  ▼
         Generation Layer
                  │
       Is answer correct?
                  │
                  ▼
         Evaluation Pipeline
                  │
      Continuous Improvement
```

Without evaluation:

- Hallucinations remain undetected.
- Retrieval failures go unnoticed.
- Model upgrades become risky.
- Quality gradually degrades.

---

# Evaluation Dimensions

A production RAG system should evaluate four dimensions:

| Dimension | Purpose |
|-----------|----------|
| Retrieval Quality | Are relevant documents retrieved? |
| Generation Quality | Is the answer correct and complete? |
| System Performance | Is the system fast and scalable? |
| User Experience | Are users satisfied? |

---

# Retrieval Evaluation

Retrieval evaluation focuses only on the search layer.

```text
User Query
      │
Retriever
      │
Retrieved Documents
      │
Evaluation
```

It does **not** evaluate the LLM.

---

# Common Retrieval Metrics

## Recall@K

Measures whether relevant documents appear within the top K retrieved results.

```
Recall@K

=
Relevant Retrieved
------------------------
Total Relevant Documents
```

Example

```
Relevant Documents = 10

Top 5 retrieved contains 8

Recall@5 = 80%
```

Higher Recall indicates fewer missing documents.

---

## Precision@K

Measures how many retrieved documents are actually relevant.

```
Precision@K

=
Relevant Retrieved
----------------------
Retrieved Documents
```

Example

```
Retrieved = 10

Relevant = 7

Precision = 70%
```

---

## Mean Reciprocal Rank (MRR)

Evaluates how early the first relevant document appears.

Example

```
Relevant document found at Rank 2

MRR = 1 / 2 = 0.5
```

Higher values are better.

---

## Normalized Discounted Cumulative Gain (NDCG)

Evaluates ranking quality when multiple relevant documents exist.

It rewards:

- Highly relevant documents
- Earlier ranking positions

Widely used in search engines and enterprise retrieval.

---

# Generation Evaluation

Generation evaluation focuses on the LLM output.

Typical questions:

- Is the answer correct?
- Is it complete?
- Is it grounded in retrieved documents?
- Is it hallucinating?
- Is the explanation useful?

---

# Common Generation Metrics

| Metric | Purpose |
|---------|----------|
| Faithfulness | Grounded in retrieved context |
| Answer Relevance | Answers the user's question |
| Context Precision | Uses relevant retrieved context |
| Context Recall | Uses all important retrieved context |
| Correctness | Factually accurate |
| Completeness | Covers important information |
| Hallucination Rate | Unsupported statements |

---

# End-to-End Evaluation Pipeline

```text
User Question
       │
       ▼
Retriever
       │
Retrieved Documents
       │
Generation
       │
Generated Answer
       │
Evaluation Engine
       │
Metrics Dashboard
```

---

# Automated Evaluation Frameworks

Several frameworks automate RAG evaluation.

| Framework | Purpose |
|-----------|----------|
| Ragas | End-to-end RAG evaluation |
| DeepEval | LLM evaluation framework |
| TruLens | RAG observability and evaluation |
| LangSmith | Prompt tracing and evaluation |
| Phoenix (Arize) | LLM observability |
| OpenAI Evals | Model benchmarking |

---

# Example with Ragas

```python
from ragas import evaluate

results = evaluate(
    dataset,
    metrics=[
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall
    ]
)
```

---

# Human Evaluation

Automated metrics cannot measure every aspect of answer quality.

Human reviewers often score responses based on:

- Accuracy
- Completeness
- Readability
- Helpfulness
- Safety
- Tone

Example rubric

| Score | Meaning |
|-------|----------|
| 5 | Excellent |
| 4 | Good |
| 3 | Acceptable |
| 2 | Poor |
| 1 | Incorrect |

---

# Benchmark Datasets

Benchmark datasets allow comparison between different retrieval pipelines.

Common datasets include:

| Dataset | Domain |
|----------|--------|
| BEIR | Information Retrieval |
| MS MARCO | Search |
| Natural Questions | Question Answering |
| HotpotQA | Multi-hop Reasoning |
| TriviaQA | Open-domain QA |
| SQuAD | Reading Comprehension |

Organizations should also create **domain-specific evaluation datasets**.

---

# Online Evaluation

Production systems can evaluate using real user interactions.

Examples

- User ratings
- Thumbs up/down
- Click-through rate
- Follow-up questions
- Search abandonment
- Manual corrections

These signals reveal issues that offline benchmarks may miss.

---

# A/B Testing

When introducing a new retriever or embedding model:

```text
Users
 │
 ├──────────────┐
 ▼              ▼
System A     System B
 │              │
Metrics Comparison
 │
Choose Better System
```

Compare:

- Recall
- Precision
- Latency
- User satisfaction
- Cost

---

# Monitoring Dashboard

Track retrieval and generation metrics continuously.

Suggested dashboard

| Category | Metrics |
|-----------|----------|
| Retrieval | Recall@K, Precision@K, MRR, NDCG |
| Generation | Faithfulness, Correctness, Hallucination Rate |
| Performance | Latency, Throughput, Token Usage |
| Infrastructure | CPU, GPU, Memory, Errors |
| Business | User Satisfaction, Resolution Rate |

---

# Evaluation Workflow

```text
Collect Queries
       │
Ground Truth
       │
Retriever Evaluation
       │
Generation Evaluation
       │
Human Review
       │
Dashboard
       │
Model Improvement
```

---

# Production Best Practices

- Evaluate retrieval and generation independently.
- Maintain a versioned benchmark dataset.
- Include both automated and human evaluation.
- Run regression tests before deploying new embedding models or retrievers.
- Continuously monitor production metrics and user feedback.
- Use A/B testing for major architectural changes.
- Track evaluation results over time to identify quality regressions.

---

# Common Mistakes

❌ Evaluating only the final LLM response

❌ Ignoring retrieval metrics

❌ Using only benchmark datasets without domain-specific tests

❌ Measuring accuracy without latency

❌ Deploying new embedding models without regression testing

❌ Assuming higher Recall always leads to better answers

---

# Interview Questions

### Why should retrieval and generation be evaluated separately?

Retrieval determines whether relevant evidence is found, while generation determines how effectively that evidence is used to produce an answer.

---

### What is Recall@K?

Recall@K measures the percentage of relevant documents retrieved within the top K search results.

---

### What does Faithfulness measure?

Faithfulness evaluates whether the generated answer is supported by the retrieved context rather than containing unsupported or hallucinated information.

---

### Why are benchmark datasets useful?

They provide standardized test cases for comparing retrieval pipelines, embedding models, and system improvements.

---

### Why is human evaluation still necessary?

Human reviewers can assess qualities such as usefulness, readability, and nuanced correctness that automated metrics may not fully capture.

---

# Quick Revision

```text
RAG Evaluation

Retrieval
│
├── Recall@K
├── Precision@K
├── MRR
└── NDCG

Generation
│
├── Faithfulness
├── Correctness
├── Completeness
└── Hallucination

Production
│
├── Benchmarks
├── Human Review
├── Monitoring
└── A/B Testing
```

---

# Key Takeaways

- Effective RAG systems require continuous evaluation, not just successful deployment.
- Retrieval and generation should be measured independently using specialized metrics.
- Automated frameworks such as Ragas, DeepEval, TruLens, and LangSmith simplify large-scale evaluation.
- Human assessment remains essential for measuring answer quality and user experience.
- Continuous benchmarking, monitoring, and A/B testing enable safe, data-driven improvements to production RAG systems.

---

# References

- Ragas Documentation
- DeepEval Documentation
- LangSmith Documentation
- TruLens Documentation
- Arize Phoenix Documentation
- BEIR Benchmark
- MS MARCO Dataset
- Natural Questions Dataset

---

## Next Note

**24-reranking-strategies.md** — Learn how cross-encoders, bi-encoders, late interaction models, and hybrid reranking techniques improve retrieval precision and reduce hallucinations in production RAG systems.