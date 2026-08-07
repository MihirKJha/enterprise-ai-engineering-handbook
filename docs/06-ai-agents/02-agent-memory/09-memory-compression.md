# 09. Memory Compression

> **Category:** Agent Memory
> **Module:** AI Agents
> **Prerequisites:** Memory Storage Patterns, Memory Retrieval Patterns
> **Difficulty:** Intermediate

> **Note:** As conversations grow longer, AI agents accumulate large amounts of memory. Sending all stored information to the LLM quickly exceeds the context window, increases latency, and raises inference costs. Memory Compression techniques reduce the size of stored or retrieved memory while preserving the most important information required for reasoning and decision-making.

---

# Overview

Consider a customer support conversation that lasts several hours.

```
User

↓

Question 1

↓

Question 2

↓

Question 3

↓

...

↓

Question 250
```

Sending all 250 interactions to the LLM is inefficient.

Instead, the AI agent compresses the conversation into a concise summary.

```
Customer

↓

Conversation

↓

Memory Compression

↓

Summary

↓

LLM
```

Instead of processing thousands of tokens, the model only processes the important information.

Memory Compression is therefore essential for long-running AI agents.

---

# Why Memory Compression Matters

Without Compression

```text
Long Conversation

↓

Entire History

↓

Large Prompt

↓

High Cost

↓

Slow Response

↓

Context Window Limit
```

Problems

- High token usage
- Increased latency
- Expensive inference
- Context window overflow
- Lower reasoning quality

---

With Compression

```text
Long Conversation

↓

Compression

↓

Important Information

↓

Compact Context

↓

LLM
```

Benefits

- Lower token usage
- Faster responses
- Reduced cost
- Longer conversations
- Better scalability

---

# High-Level Architecture

```text
                    AI Agent
                        │
                        ▼
                 Memory Retriever
                        │
                        ▼
               Memory Compression
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
 Conversation     Semantic Filter    Summarizer
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                Compressed Context
                        │
                        ▼
                       LLM
```

Compression occurs after retrieval but before prompt construction.

---

# Compression Workflow

```text
Retrieve Memory
       │
       ▼
Remove Duplicate Information
       │
       ▼
Rank Importance
       │
       ▼
Summarize
       │
       ▼
Build Context
       │
       ▼
LLM
```

Only the most relevant information reaches the language model.

---

# Memory Compression Techniques

Enterprise AI systems often combine multiple compression strategies.

---

## 1. Conversation Summarization

Older conversations are summarized.

Before

```text
Message 1

Message 2

...

Message 120
```

After

```text
Customer previously reported
payment failures.

Troubleshooting completed.

Issue resolved.
```

Ideal for

- Chat history
- Customer support
- AI assistants

---

## 2. Context Pruning

Remove irrelevant memories.

Example

```
Current Task

↓

Payment Processing

↓

Remove

Weather Discussion

Sports Discussion
```

Only task-relevant information is retained.

---

## 3. Semantic Compression

Instead of preserving every message, retain only memories with high semantic importance.

```text
Messages

↓

Embedding Model

↓

Similarity Scoring

↓

Important Memories
```

Useful for

- Enterprise RAG
- Long conversations
- Knowledge assistants

---

## 4. Rolling Summary

Older conversations are continuously summarized while newer conversations remain intact.

```text
Conversation

↓

Summary

+

Recent Messages
```

This keeps prompts compact without losing historical context.

---

## 5. Hierarchical Memory

Organize memory into multiple levels.

```text
Current Session

↓

Conversation Summary

↓

Monthly Summary

↓

Long-Term Knowledge
```

Only the appropriate level is retrieved depending on the request.

---

# Choosing the Right Compression Strategy

| Scenario | Recommended Strategy |
|----------|----------------------|
| Chat conversations | Rolling Summary |
| Customer support | Conversation Summarization |
| Enterprise RAG | Semantic Compression |
| Large workflows | Hierarchical Memory |
| Multi-day conversations | Summary + Recent Messages |

---

# Implementation

## Example 1 – Core Python

Simple conversation compression.

```python
conversation = [
    "Customer reported payment failure.",
    "Payment gateway timeout.",
    "Gateway restarted.",
    "Payment successful."
]

summary = (
    "Customer experienced a payment "
    "gateway timeout that was resolved "
    "after restarting the gateway."
)

print(summary)
```

Instead of storing every message, the agent stores the summary.

---

## Example 2 – LangChain Conversation Summary Memory

Automatically summarize conversations.

```python
from langchain.memory import ConversationSummaryMemory
from langchain_openai import ChatOpenAI

llm = ChatOpenAI()

memory = ConversationSummaryMemory(
    llm=llm
)

memory.save_context(
    {"input": "Customer reported payment issues."},
    {"output": "Troubleshooting started."}
)

print(memory.load_memory_variables({}))
```

LangChain continuously updates the conversation summary as new interactions occur.

---

## Example 3 – Production Example (Hybrid Compression)

Compress conversation history before sending it to the LLM.

```python
class MemoryCompressor:

    def compress(
        self,
        summary,
        recent_messages
    ):

        return {
            "summary": summary,
            "recent_messages": recent_messages[-5:]
        }


compressor = MemoryCompressor()

context = compressor.compress(
    summary="Customer experienced repeated payment failures.",
    recent_messages=[
        "Gateway restarted",
        "Retry initiated",
        "Payment completed",
        "Invoice generated",
        "Confirmation sent",
        "Customer acknowledged"
    ]
)

print(context)
```

Instead of sending the complete conversation, the AI agent combines a concise summary with only the most recent messages, significantly reducing token usage while preserving conversational context.

---

# Enterprise Use Cases

## Customer Support Agent

Compresses long customer conversations while preserving important context.

Examples

- Issue summary
- Troubleshooting history
- Resolution status
- Customer preferences
- Recent conversation

```text
Customer

↓

Conversation History

↓

Memory Compression

↓

Conversation Summary

+

Recent Messages

↓

LLM
```

This enables support agents to continue long conversations without exceeding the model's context window.

---

## Enterprise Knowledge Assistant

Compresses retrieved enterprise documents before passing them to the LLM.

Examples

- HR Policies
- Engineering Standards
- API Documentation
- Architecture Guidelines

Instead of sending entire documents, only the most relevant sections are summarized.

---

## Software Engineering Assistant

Compresses development history.

Examples

- Previous code reviews
- Commit history
- Build logs
- Deployment history
- Architecture discussions

Only the latest implementation details and important design decisions are preserved.

---

## Financial Assistant

Compresses financial conversations.

Examples

- Portfolio discussions
- Investment recommendations
- Budget planning
- Previous financial advice

Historical details are summarized while keeping the latest portfolio information available.

---

## Enterprise AI Platform

Large AI platforms compress multiple memory sources.

```text
                  AI Agent
                      │
              Memory Retrieval
                      │
                      ▼
          Conversation History
                      │
                      ▼
         Semantic Compression
                      │
                      ▼
        Conversation Summarizer
                      │
                      ▼
          Context Compression
                      │
                      ▼
               Prompt Builder
                      │
                      ▼
                     LLM
```

Compression becomes an essential stage in the retrieval pipeline.

---

# Production Insight

Enterprise AI systems rarely rely on a **single compression technique**.

Instead, they combine multiple strategies.

```text
Conversation

↓

Duplicate Removal

↓

Metadata Filtering

↓

Semantic Compression

↓

Conversation Summary

↓

Recent Messages

↓

Prompt
```

A common production pipeline consists of:

- Remove duplicate messages
- Remove irrelevant context
- Apply metadata filtering
- Summarize older conversations
- Keep the most recent messages unchanged
- Build the final prompt

This significantly reduces token usage without sacrificing response quality.

---

# Architecture Decision

| Scenario | Recommended Compression Strategy |
|----------|----------------------------------|
| Chat conversations | Rolling Summary |
| Long customer support sessions | Summary + Recent Messages |
| Enterprise RAG | Semantic Compression |
| Multi-agent workflows | Hierarchical Memory |
| Large document retrieval | Context Compression |
| Large knowledge bases | Semantic Filtering + Reranking |

---

# Advantages

- Reduces token consumption
- Lowers LLM inference cost
- Improves response latency
- Supports longer conversations
- Prevents context window overflow
- Improves prompt quality
- Scales well for enterprise AI systems

---

# Limitations

- Important information may be lost during summarization
- Poor summarization affects response quality
- Compression introduces additional processing
- Summaries can become outdated
- Requires careful evaluation and tuning

---

# Best Practices

- Compress only older conversation history.
- Preserve recent messages without modification.
- Use semantic importance rather than message count.
- Continuously update rolling summaries.
- Validate summary quality regularly.
- Keep user preferences outside compressed conversations.
- Monitor token usage after compression.
- Combine compression with retrieval filtering.

---

# Common Mistakes

❌ Compressing the entire conversation

❌ Removing critical context

❌ Summarizing already summarized conversations

❌ Ignoring semantic importance

❌ Compressing user preferences

❌ Never refreshing conversation summaries

---

# Framework Comparison

| Framework | Memory Compression Support |
|-----------|----------------------------|
| **LangChain** | ConversationSummaryMemory, ConversationSummaryBufferMemory |
| **LangGraph** | State Compression using Checkpointers + Custom Summarization |
| **LlamaIndex** | Response Synthesizers, Context Compression, Node Postprocessors |
| **CrewAI** | Custom Memory Compression |
| **OpenAI Agents SDK** | Custom Conversation Management |

---

# Interview Questions

### What is Memory Compression?

### Why is Memory Compression important for AI agents?

### What is the difference between summarization and semantic compression?

### What is a Rolling Summary?

### Why shouldn't recent messages be compressed?

### How does Memory Compression reduce token costs?

### What challenges arise from aggressive compression?

### How is Memory Compression used in enterprise RAG systems?

---

# Quick Revision

```text
              Retrieved Memory
                     │
                     ▼
          Remove Duplicates
                     │
                     ▼
          Semantic Filtering
                     │
                     ▼
        Conversation Summary
                     │
                     ▼
      Recent Messages (Unchanged)
                     │
                     ▼
             Prompt Builder
                     │
                     ▼
                    LLM
```

---

# Key Takeaways

- Memory Compression reduces the amount of context passed to the LLM while preserving the most relevant information.
- Enterprise AI systems combine summarization, semantic compression, context pruning, and rolling summaries to optimize prompt size.
- Effective compression reduces token usage, improves latency, lowers inference cost, and enables long-running AI agent conversations.
- Compression should preserve important information while removing redundancy and irrelevant context.
- Memory Compression is a critical component of production AI systems, especially those using Retrieval-Augmented Generation (RAG) and multi-step agent workflows.

---

# References

- LangChain Documentation – Conversation Summary Memory
- LangGraph Documentation – Checkpointers & State Management
- LlamaIndex Documentation – Context Compression & Node Postprocessors
- OpenAI Agents SDK Documentation
- CrewAI Documentation

---

## Next Note

**10-memory-optimization.md**

In the next note, we'll explore **Memory Optimization** techniques used in production AI agents, including memory caching, TTL policies, selective persistence, deduplication, memory indexing, adaptive retrieval, storage optimization, and performance tuning strategies for building scalable and cost-efficient enterprise AI systems.
