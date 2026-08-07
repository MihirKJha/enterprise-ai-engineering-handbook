# 07. Agent Evaluation Metrics

> **Category:** Agent Observability
> **Module:** AI Agents
> **Prerequisites:** Agent Observability Overview, Agent Logging, Agent Tracing, Agent Monitoring, Agent Metrics, Agent Debugging
> **Difficulty:** Intermediate

> **Note:** Agent Evaluation Metrics measure how well an AI agent performs its intended tasks. Unlike monitoring metrics that focus on operational health, evaluation metrics measure **quality, correctness, accuracy, usefulness, reliability, and business value**. Enterprise AI platforms continuously evaluate agents before deployment (offline) and during production (online) to ensure high-quality AI systems.

---

# Overview

Imagine two AI Customer Support Agents.

Both respond in **2 seconds**.

Both consume **1,200 tokens**.

Both have **99.9% availability**.

Operationally they look identical.

But one consistently provides better answers.

```text
Agent A

↓

Accurate Response

↓

Customer Happy
```

```text
Agent B

↓

Hallucinated Response

↓

Customer Dissatisfied
```

Traditional monitoring cannot identify this difference.

Evaluation Metrics measure **answer quality**, not just system performance.

---

# Why Agent Evaluation Matters

Without Evaluation

```text
AI Agent

↓

Fast Response

↓

Unknown Quality
```

Problems

- Hallucinations go unnoticed
- Wrong answers reach customers
- Poor retrieval quality
- No benchmark comparisons
- Difficult model selection

---

With Evaluation

```text
AI Agent

↓

Evaluation

↓

Quality Score

↓

Continuous Improvement
```

Benefits

- Better AI quality
- Reduced hallucinations
- Objective benchmarking
- Safer production deployments
- Continuous optimization

---

# Monitoring vs Evaluation

These concepts complement each other.

| Monitoring | Evaluation |
|------------|------------|
| Measures operational health | Measures answer quality |
| Latency | Accuracy |
| Availability | Relevance |
| Error Rate | Faithfulness |
| CPU Usage | Correctness |
| Token Usage | Helpfulness |

Example

Monitoring says

```text
Response Time

↓

1.3 sec
```

Evaluation says

```text
Answer Quality

↓

9.4 / 10
```

Both are necessary for enterprise AI systems.

---

# High-Level Architecture

```text
                    User Request
                          │
                          ▼
                      AI Agent
                          │
      ┌───────────────────┼──────────────────┐
      ▼                   ▼                  ▼
    Retriever            LLM             Tool Calls
      │                   │                  │
      └───────────────────┼──────────────────┘
                          ▼
                 Evaluation Engine
                          │
      ┌───────────────────┼──────────────────┐
      ▼                   ▼                  ▼
 Offline Tests     Online Evaluation    Human Review
                          │
                          ▼
                   Quality Dashboard
```

Evaluation continuously measures the quality of AI responses.

---

# Evaluation Lifecycle

Enterprise AI teams typically follow this process.

```text
Collect Responses

↓

Evaluate

↓

Generate Scores

↓

Compare

↓

Identify Problems

↓

Improve Agent

↓

Deploy

↓

Repeat
```

Evaluation is an ongoing process rather than a one-time activity.

---

# Offline vs Online Evaluation

Enterprise AI systems perform evaluation in two phases.

---

## Offline Evaluation

Evaluation before deployment.

```text
Dataset

↓

AI Agent

↓

Compare With Expected Answers

↓

Quality Score
```

Characteristics

- Safe
- Repeatable
- Benchmark driven

Typical Uses

- Model comparison
- Prompt testing
- Regression testing
- Benchmark evaluation

---

## Online Evaluation

Evaluation during production.

```text
User

↓

AI Agent

↓

Production Response

↓

Evaluate
```

Characteristics

- Real user data
- Continuous feedback
- Detects production drift

Typical Uses

- Production monitoring
- A/B testing
- Continuous improvement

---

# Human vs Automated Evaluation

Enterprise AI combines both approaches.

---

## Human Evaluation

Humans review responses.

```text
AI Response

↓

Human Reviewer

↓

Quality Score
```

Typical Criteria

- Correctness
- Helpfulness
- Clarity
- Safety
- Completeness

Advantages

- High accuracy
- Context awareness

Limitations

- Slow
- Expensive
- Difficult to scale

---

## Automated Evaluation

AI systems evaluate responses automatically.

```text
AI Response

↓

Evaluation Framework

↓

Score
```

Typical Metrics

- Similarity
- Faithfulness
- Relevance
- Precision
- Recall

Advantages

- Fast
- Repeatable
- Scalable

Limitations

- May miss nuanced human judgment

---

# LLM-as-a-Judge

Modern AI systems increasingly use another LLM to evaluate generated responses.

```text
User Question

↓

AI Agent

↓

Response

↓

Judge LLM

↓

Quality Score
```

The Judge LLM evaluates:

- Correctness
- Helpfulness
- Completeness
- Safety
- Reasoning quality

This approach significantly reduces manual evaluation effort while providing consistent scoring.

---

# Common Evaluation Metrics

Enterprise AI platforms evaluate several quality dimensions.

```text
Evaluation

│

├── Accuracy

├── Correctness

├── Relevance

├── Faithfulness

├── Helpfulness

├── Completeness

├── Safety

├── Consistency

├── Hallucination Rate

└── Task Success Rate
```

These metrics provide a comprehensive view of AI quality.

---

# What Should Be Evaluated?

Production AI platforms evaluate multiple components.

```text
Evaluation

│

├── Prompt Quality

├── Retrieval Quality

├── Memory Quality

├── Tool Usage

├── LLM Response

├── Agent Decision

├── Workflow Success

├── Final Answer

└── User Satisfaction
```

Evaluation extends beyond the LLM to the entire AI workflow.

---

# Implementation

## Example 1 – Core Python

Simple accuracy calculation.

```python
expected = "Paris"

predicted = "Paris"

accuracy = int(expected == predicted)

print(f"Accuracy: {accuracy}")
```

Output

```text
Accuracy: 1
```

This illustrates the basic concept of comparing expected and predicted outputs.

---

## Example 2 – LangSmith Evaluation

LangSmith can evaluate application responses against predefined datasets.

```python
from langsmith import evaluate

results = evaluate(
    target=my_agent,
    data="qa_dataset"
)
```

LangSmith automatically executes the dataset, collects responses, computes evaluation scores, and generates quality reports for the AI application.

---

## Example 3 – Production Example (Ragas)

Evaluate a RAG pipeline using Ragas.

```python
from ragas import evaluate

results = evaluate(
    dataset=my_dataset,
    metrics=[
        "faithfulness",
        "answer_relevancy"
    ]
)

print(results)
```

Ragas measures whether the generated answer is supported by the retrieved context (**Faithfulness**) and whether it appropriately answers the user's question (**Answer Relevancy**). These metrics are essential for evaluating enterprise RAG systems.

---

# Enterprise Use Cases

## Enterprise RAG Assistant

Production RAG systems require continuous quality evaluation.

```text
User Question

↓

Retriever

↓

Vector Database

↓

Reranker

↓

LLM

↓

Final Answer
```

Typical evaluation metrics

- Context Precision
- Context Recall
- Faithfulness
- Answer Relevancy
- Hallucination Rate
- Retrieval Success Rate

These metrics help engineers determine whether failures originate from retrieval or generation.

---

## Customer Support AI

Customer support agents are evaluated on response quality rather than speed alone.

```text
Customer

↓

Support Agent

↓

Knowledge Base

↓

LLM

↓

Response
```

Typical evaluation metrics

- Correctness
- Helpfulness
- Resolution Rate
- Customer Satisfaction (CSAT)
- Escalation Rate
- Safety

These metrics directly influence customer experience.

---

## Multi-Agent AI Platform

Enterprise AI workflows involve several collaborating agents.

```text
Planner

↓

Developer

↓

Testing

↓

Documentation

↓

Deployment
```

Typical evaluation metrics

- Task Success Rate
- Workflow Completion Rate
- Retry Rate
- Decision Accuracy
- Agent Collaboration Score
- Workflow Quality

These metrics evaluate the effectiveness of the overall workflow rather than individual agents.

---

## AI Software Engineering Assistant

Software engineering assistants generate production code.

```text
Developer Request

↓

Planning

↓

Code Generation

↓

Testing

↓

Deployment
```

Typical evaluation metrics

- Code correctness
- Test pass rate
- Build success rate
- Security issues
- Code quality
- Review acceptance rate

Evaluation ensures generated code meets engineering standards.

---

## Financial Services

Enterprise financial systems require strict quality evaluation.

```text
Transaction

↓

Fraud Detection

↓

Risk Analysis

↓

Compliance

↓

Decision
```

Typical evaluation metrics

- Fraud detection accuracy
- False Positive Rate
- False Negative Rate
- Decision consistency
- Regulatory compliance
- Explainability score

Evaluation helps maintain trust and regulatory compliance.

---

# Production Insight

Enterprise AI teams evaluate the **entire AI pipeline**, not just the final LLM response.

```text
User Query

↓

Prompt

↓

Retriever

↓

Memory

↓

LLM

↓

Tool Calls

↓

Final Answer

↓

Evaluation
```

Every stage contributes to response quality.

For example

Poor Answer

↓

Was it caused by

- Bad Prompt?
- Wrong Retrieval?
- Missing Memory?
- Tool Failure?
- Model Hallucination?

Evaluation helps isolate quality problems before they reach production.

---

# Enterprise Evaluation Pipeline

```text
                Benchmark Dataset
                       │
                       ▼
                  AI Application
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
 Prompt Eval     RAG Evaluation    Workflow Eval
       │               │                │
       └───────────────┼────────────────┘
                       ▼
              Evaluation Framework
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
     Ragas        DeepEval       TruLens
                       │
                       ▼
              Quality Dashboard
```

Evaluation frameworks automatically score responses and generate reports for continuous improvement.

---

# Popular Evaluation Frameworks

| Framework | Best For |
|-----------|----------|
| **LangSmith** | Agent & workflow evaluation |
| **Ragas** | RAG evaluation |
| **DeepEval** | LLM testing & benchmarking |
| **TruLens** | LLM observability & evaluation |
| **Arize Phoenix** | Production evaluation |
| **Promptfoo** | Prompt testing & regression |
| **OpenAI Evals** | Model benchmarking |

Each framework focuses on different aspects of AI quality.

---

# Architecture Decision

| Requirement | Recommended Tool |
|-------------|------------------|
| Prompt Evaluation | Promptfoo |
| RAG Evaluation | Ragas |
| Agent Workflow Evaluation | LangSmith |
| Production LLM Evaluation | Arize Phoenix |
| LLM Benchmarking | OpenAI Evals |
| Automated Regression Testing | DeepEval |
| Enterprise AI Platform | LangSmith + Ragas + DeepEval |

---

# Advantages

- Objective quality measurement
- Reduced hallucinations
- Continuous improvement
- Safer production deployment
- Better model comparison
- Prompt optimization
- Higher customer satisfaction
- Supports A/B testing

---

# Limitations

- High-quality benchmark datasets are required
- Human evaluation remains necessary for subjective tasks
- LLM-as-a-Judge may introduce bias
- Different frameworks measure different aspects of quality
- Evaluation can increase infrastructure cost and execution time

---

# Best Practices

- Evaluate before every production deployment.
- Use representative benchmark datasets.
- Combine automated and human evaluation.
- Continuously evaluate production responses.
- Track hallucination rate separately.
- Version prompts and benchmark datasets.
- Compare models using identical datasets.
- Integrate evaluation into CI/CD pipelines.

---

# Common Mistakes

❌ Measuring only latency and availability

❌ Evaluating only the final response

❌ Ignoring retrieval quality

❌ Using tiny benchmark datasets

❌ No regression testing after prompt updates

❌ Relying entirely on human evaluation

❌ Ignoring hallucination tracking

❌ No continuous production evaluation

---

# Framework Comparison

| Framework | Evaluation Capability |
|-----------|-----------------------|
| **LangSmith** | Agent workflow evaluation |
| **Ragas** | Faithfulness, Context Precision, Context Recall, Answer Relevancy |
| **DeepEval** | LLM testing & regression |
| **TruLens** | LLM quality & observability |
| **Arize Phoenix** | Production AI evaluation |
| **Promptfoo** | Prompt benchmarking |
| **OpenAI Evals** | Foundation model benchmarking |

---

# Interview Questions

### What is Agent Evaluation?

### How is evaluation different from monitoring?

### What is the difference between offline and online evaluation?

### When should human evaluation be preferred?

### What is LLM-as-a-Judge?

### Which metrics are commonly used to evaluate RAG systems?

### Why should hallucination rate be measured?

### Why should evaluation be integrated into CI/CD?

### What is the role of benchmark datasets?

### Which evaluation frameworks are commonly used in enterprise AI?

---

# Quick Revision

```text
                 AI Application
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
 Prompt Eval     RAG Evaluation   Workflow Eval
      │                │                │
      └────────────────┼────────────────┘
                       ▼
            Evaluation Framework
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
   Ragas         DeepEval       LangSmith
                       │
                       ▼
               Quality Dashboard
```

---

# Key Takeaways

- Agent Evaluation measures **AI quality**, including correctness, relevance, faithfulness, helpfulness, safety, and business value, rather than operational health.
- Enterprise AI platforms combine **offline evaluation** (before deployment) and **online evaluation** (during production) to continuously improve agent performance.
- Modern evaluation frameworks such as **Ragas**, **DeepEval**, **LangSmith**, **TruLens**, **Arize Phoenix**, **Promptfoo**, and **OpenAI Evals** automate quality assessment and regression testing.
- RAG systems should evaluate retrieval quality separately from generation quality using metrics like **Context Precision**, **Context Recall**, **Faithfulness**, and **Answer Relevancy**.
- Integrating evaluation into CI/CD pipelines ensures prompt changes, model upgrades, and workflow modifications maintain or improve production quality before deployment.

---

# References

- LangSmith Documentation
- Ragas Documentation
- DeepEval Documentation
- TruLens Documentation
- Arize Phoenix Documentation
- Promptfoo Documentation
- OpenAI Evals Documentation
- LangGraph Documentation
- OpenAI Agents SDK Documentation

---

## Next Note

**08-agent-cost-monitoring.md**

In the next note, we'll explore **Agent Cost Monitoring**, including token accounting, model pricing, inference cost, embedding cost, vector database cost, tool/API cost, cloud infrastructure cost, cost attribution, FinOps dashboards, budget alerts, and enterprise cost optimization strategies for operating AI agents at scale.