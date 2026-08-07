# Word Embeddings

> A practical engineering guide to **Word Embeddings**, covering distributed word representations, Word2Vec, CBOW, Skip-Gram, pretrained embeddings, and their role in modern Large Language Models (LLMs).

---

# 1. Overview

Word Embeddings are **dense numerical vector representations of words** that capture their semantic and syntactic relationships.

Unlike traditional text representation techniques such as **One-Hot Encoding** and **Bag-of-Words**, word embeddings allow AI models to understand that similar words have similar meanings.

Word Embeddings became one of the biggest breakthroughs in Natural Language Processing and laid the foundation for modern Transformer-based Large Language Models.

---

# 2. Why Word Embeddings?

Traditional NLP techniques have several limitations.

### One-Hot Encoding

- Very sparse vectors
- Large vocabulary
- No semantic meaning
- Similar words appear unrelated

Example:

```text
King

↓

[1 0 0 0 0]

Queen

↓

[0 1 0 0 0]
```

Although **King** and **Queen** are related, their vectors are completely independent.

---

### Bag-of-Words

Represents text using word frequencies.

Limitations:

- Ignores word order
- Ignores context
- No semantic relationships

---

Word Embeddings solve these problems by learning meaningful vector representations.

---

# 3. Evolution of Text Representation

```text
One-Hot Encoding
        │
        ▼
Bag-of-Words
        │
        ▼
TF-IDF
        │
        ▼
Word Embeddings
        │
        ▼
Contextual Embeddings
        │
        ▼
Foundation Models
        │
        ▼
Large Language Models
```

---

# 4. What is a Word Embedding?

Each word is represented by a dense vector.

Example:

```
King

↓

[0.32, -0.71, 1.28, ...]
```

Words with similar meanings are located close together in vector space.

Example:

```text
King  ───── Queen

Man   ───── Woman

Paris ───── France

Tokyo ───── Japan
```

This enables machines to understand semantic similarity.

---

# 5. Distributed Representation

Instead of assigning one feature to one word,

each dimension of the embedding contributes partially to meaning.

Example:

```text
King

↓

[Leadership,
Royalty,
Human,
Male,
...]
```

Meaning is distributed across many dimensions rather than stored explicitly.

---

# 6. Word2Vec

Word2Vec is one of the first successful algorithms for learning word embeddings.

Developed by Google (Mikolov et al., 2013).

Rather than manually defining vectors, Word2Vec learns them automatically from large text corpora.

Two training strategies are used:

- Continuous Bag of Words (CBOW)
- Skip-Gram

---

# 7. Continuous Bag of Words (CBOW)

CBOW predicts the **target word** from its surrounding context.

Example:

```text
The cat ____ on the mat.

↓

sat
```

Workflow:

```text
Context Words

↓

Embedding Layer

↓

Neural Network

↓

Target Word
```

Advantages:

- Faster training
- Performs well on frequent words
- Computationally efficient

---

# 8. Skip-Gram

Skip-Gram works in the opposite direction.

It predicts surrounding context words from the target word.

Example:

```text
Target Word

↓

cat

↓

Predict

↓

The

sat

on

the
```

Advantages:

- Better for rare words
- Learns richer semantic relationships
- Higher accuracy on large corpora

---

# 9. CBOW vs Skip-Gram

| CBOW | Skip-Gram |
|------|-----------|
| Predict target word | Predict context words |
| Faster | Slower |
| Better for common words | Better for rare words |
| Less computational cost | More computational cost |

---

# 10. Embedding Space

One of the most fascinating properties of embeddings is vector arithmetic.

Example:

```text
King

− Man

+ Woman

↓

Queen
```

Similarly:

```text
Paris

− France

+ Japan

↓

Tokyo
```

These relationships emerge automatically during training.

---

# 11. Embedding Dimensions

Each word is represented using a fixed-size vector.

Typical sizes:

- 50
- 100
- 200
- 300
- 768 (BERT)
- 1024+
- 4096+

Larger embeddings capture more information but require more computation.

---

# 12. Pretrained Embeddings

Training embeddings from scratch requires enormous datasets.

Instead, many projects use pretrained embeddings.

Examples:

- Word2Vec
- GloVe
- FastText

Benefits:

- Faster development
- Better accuracy
- Less training data
- Better semantic understanding

---

# 13. Contextual Embeddings

Traditional embeddings assign **one vector per word**.

Example:

```
bank
```

Same embedding regardless of context.

Modern LLMs generate **context-aware embeddings**.

Example:

```
River bank

↓

Different embedding

Bank account

↓

Different embedding
```

Examples:

- BERT
- GPT
- RoBERTa
- T5

---

# 14. Applications

Word embeddings are used in:

- Search
- Recommendation Systems
- Chatbots
- Machine Translation
- Document Classification
- Question Answering
- Text Summarization
- Large Language Models

---

# 15. Production Perspective

Typical NLP embedding pipeline:

```text
Raw Text
      │
      ▼
Tokenization
      │
      ▼
Vocabulary Lookup
      │
      ▼
Embedding Layer
      │
      ▼
Neural Network
      │
      ▼
Prediction
```

Modern LLM pipeline:

```text
Prompt
      │
      ▼
Tokenizer
      │
      ▼
Embedding Layer
      │
      ▼
Transformer
      │
      ▼
Generated Text
```

---

# 16. Best Practices

- Use pretrained embeddings whenever possible.
- Fine-tune embeddings for domain-specific tasks.
- Normalize text consistently.
- Match the tokenizer with the embedding model.
- Monitor embedding quality during training.
- Use contextual embeddings for modern NLP applications.

---

# 17. Common Challenges

- Out-of-vocabulary words
- Polysemy (multiple meanings)
- Domain-specific vocabulary
- Large memory requirements
- Embedding drift
- Poor training data quality

---

# 18. Interview Questions

### Beginner

- What is a word embedding?
- Why are embeddings better than One-Hot Encoding?
- What is Word2Vec?
- What is CBOW?

---

### Intermediate

- CBOW vs Skip-Gram?
- Why do embeddings capture semantic meaning?
- Why are pretrained embeddings useful?
- Static vs Contextual embeddings?

---

### Advanced

- How are embeddings learned?
- Why do modern LLMs use contextual embeddings?
- Word2Vec vs BERT embeddings?
- What challenges exist when training embeddings?

---

# 19. 🚀 Quick Revision Sheet

## Evolution

```text
One-Hot

↓

Bag-of-Words

↓

TF-IDF

↓

Word2Vec

↓

Contextual Embeddings

↓

LLMs
```

---

## Word2Vec

Two training methods:

- CBOW
- Skip-Gram

---

## Modern Embeddings

Static

↓

Contextual

↓

Transformer Embeddings

---

## Applications

- Search
- Chatbots
- Translation
- Classification
- Recommendation
- LLMs

---

## Remember

> **Word Embeddings transform words into dense semantic vectors, enabling AI systems to understand relationships between words and forming the foundation of modern Natural Language Processing and Large Language Models.**

---

# 20. Key Takeaways

- Word Embeddings replaced sparse text representations with dense semantic vectors.
- Word2Vec introduced automatic learning of meaningful word representations using CBOW and Skip-Gram.
- Similar words occupy nearby positions in embedding space, enabling semantic reasoning.
- Pretrained embeddings significantly improve NLP performance and reduce training effort.
- Modern Transformer models generate contextual embeddings, where a word's representation depends on its surrounding context.
- Word Embeddings remain a fundamental building block of modern Foundation Models and Large Language Models.

---

# References

- IBM AI Engineering Professional Certificate (Coursera)
- Efficient Estimation of Word Representations in Vector Space (Mikolov et al., 2013)
- Speech and Language Processing – Jurafsky & Martin
- PyTorch Documentation
- Hugging Face Documentation
- Hands-on Labs from this repository