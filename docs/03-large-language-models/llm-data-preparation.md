# LLM Data Preparation


> A practical engineering guide to **Large Language Model (LLM) Data Preparation**, covering tokenization, text representation, embeddings, datasets, data loaders, batching, BERT input preparation, and preprocessing techniques required for training, fine-tuning, and deploying modern Large Language Models.

---

# 1. Overview

Large Language Models (LLMs) cannot directly understand human language.

Before text can be processed by a Transformer model, it must go through a series of preprocessing steps that convert raw language into structured numerical representations.

This entire workflow is known as **LLM Data Preparation**.

A modern LLM data preparation pipeline typically includes:

- Text Collection
- Text Cleaning
- Tokenization
- Vocabulary Mapping
- Special Tokens
- Token IDs
- Attention Masks
- Padding & Truncation
- Dataset Creation
- DataLoader
- Embedding Layer
- Batch Generation

These preprocessing steps prepare textual data for efficient training, fine-tuning, and inference.

---

# 2. Why Data Preparation?

Raw text is unstructured and cannot be processed directly by neural networks.

LLM preprocessing transforms natural language into standardized numerical inputs while preserving semantic meaning and contextual relationships.

Benefits include:

- Standardized model inputs
- Efficient GPU utilization
- Faster training
- Better model accuracy
- Consistent preprocessing
- Scalable NLP pipelines
- Reduced memory usage
- Better reproducibility

Without proper preprocessing, even the most powerful Transformer model cannot learn meaningful language representations.

---

# 3. Evolution of Text Representation

Modern Large Language Models are the result of decades of progress in Natural Language Processing.

Text representation has evolved from sparse statistical representations to rich contextual embeddings.

```text
Raw Text
     │
     ▼
One-Hot Encoding
     │
     ▼
Bag-of-Words (BoW)
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
Tokenization
     │
     ▼
Transformer Input
```

---

## One-Hot Encoding

Represents each word as a unique sparse vector.

Advantages:

- Simple representation
- Easy implementation

Limitations:

- Extremely sparse vectors
- No semantic relationships
- Large memory requirements

---

## Bag-of-Words (BoW)

Represents documents using word occurrence counts.

Advantages:

- Simple
- Effective baseline

Limitations:

- Ignores word order
- Ignores context
- Sparse representation

---

## TF-IDF

Improves Bag-of-Words by assigning greater importance to informative words.

Advantages:

- Better feature weighting
- Useful for information retrieval

Limitations:

- No semantic understanding
- Cannot capture contextual meaning

---

## Word Embeddings

Dense numerical vectors that capture semantic similarity between words.

Examples:

- Word2Vec
- GloVe
- FastText

Advantages:

- Dense representation
- Semantic similarity
- Better generalization

---

## Contextual Embeddings

Unlike traditional embeddings, contextual embeddings change depending on surrounding words.

Example:

```
bank
```

can represent:

- River bank
- Financial bank

depending on context.

Used by:

- BERT
- GPT
- Llama
- Gemma
- Mistral

---

## Tokenization

Modern LLMs tokenize text before generating embeddings.

Instead of processing complete words, Transformer models process tokens.

---

# 4. Modern LLM Data Pipeline

A modern Transformer-based language model follows the preprocessing workflow below.

```text
Raw Text
     │
     ▼
Cleaning
     │
     ▼
Tokenization
     │
     ▼
Vocabulary Mapping
     │
     ▼
Special Tokens
     │
     ▼
Token IDs
     │
     ▼
Attention Masks
     │
     ▼
Padding / Truncation
     │
     ▼
Dataset
     │
     ▼
DataLoader
     │
     ▼
Embedding Layer
     │
     ▼
Transformer Model
```

Each stage prepares the data for efficient neural computation.

---

# 5. Text Preprocessing

Before tokenization, text is cleaned and normalized.

Typical preprocessing operations include:

- Lowercasing (when appropriate)
- Unicode normalization
- Removing unwanted characters
- Handling whitespace
- Removing duplicate text
- Standardizing punctuation
- Basic text normalization

The exact preprocessing strategy depends on the tokenizer and pretrained model.

Modern pretrained models usually require minimal manual preprocessing because their tokenizers are trained on raw text.

---

# 6. Tokenization

Tokenization is the process of splitting text into smaller units called **tokens**.

Example:

```
Large Language Models are powerful.
```

↓

```
["Large", "Language", "Models", "are", "powerful"]
```

Tokenization is the first computational step before a Transformer processes language.

Modern LLMs never process raw text directly.

They process **token IDs**.

---

# 7. Tokenization vs Token IDs vs Embeddings

These three concepts are closely related but perform completely different roles.

| Component | Purpose |
|-----------|----------|
| Tokenizer | Splits text into tokens |
| Vocabulary | Maps each token to a numerical ID |
| Embedding Layer | Converts token IDs into dense vectors |

Workflow:

```text
Sentence

↓

Tokenizer

↓

Tokens

↓

Vocabulary

↓

Token IDs

↓

Embedding Layer

↓

Embedding Vectors

↓

Transformer
```

Think of it this way:

- **Tokenizer** breaks language into pieces.
- **Vocabulary** assigns each piece a unique ID.
- **Embedding Layer** converts IDs into meaningful numerical representations.

---

# 8. Types of Tokenization

Modern NLP systems use different tokenization strategies depending on the model.

---

## Word Tokenization

Splits text into complete words.

Example:

```
Machine Learning is amazing

↓

["Machine", "Learning", "is", "amazing"]
```

Advantages:

- Easy to understand
- Preserves complete words

Limitations:

- Large vocabulary
- Unknown words become problematic
- High memory usage

---

## Character Tokenization

Splits every character individually.

Example:

```
AI

↓

["A","I"]
```

Advantages:

- Very small vocabulary
- Handles unseen words
- Language independent

Limitations:

- Longer sequences
- Slower training
- Loses word-level semantics

---

## Subword Tokenization

Modern LLMs primarily use **subword tokenization**.

Frequently occurring words remain intact while rare words are split into meaningful subwords.

Example:

```
unbelievable

↓

["un","believ","able"]
```

Advantages:

- Smaller vocabulary
- Better handling of unknown words
- Better generalization
- Preserves semantic meaning
- Most efficient for modern Transformer models

---

# 9. Popular Subword Algorithms

Modern LLMs primarily rely on subword tokenization because it provides the best balance between vocabulary size and semantic understanding.

---

## WordPiece

Originally developed for **BERT**.

Example:

```
playing

↓

play ##ing
```

Used by:

- BERT
- DistilBERT

Advantages:

- Smaller vocabulary
- Good handling of unseen words
- Strong semantic representation

---

## SentencePiece

Treats text as a raw character stream without relying on whitespace.

Used by:

- T5
- ALBERT
- Llama

Advantages:

- Language independent
- Excellent multilingual support
- No language-specific preprocessing

---

## Unigram

Starts with a large vocabulary and removes less useful tokens based on probability.

Advantages:

- Flexible vocabulary
- Better compression
- Strong multilingual performance

---

# 10. Vocabulary

A vocabulary is the complete collection of tokens recognized by an LLM.

Every token is assigned a unique numerical identifier.

Workflow:

```text
Word

↓

Tokenizer

↓

Vocabulary

↓

Token ID
```

Example:

| Token | Token ID |
|--------|----------|
| AI | 1542 |
| Language | 3921 |
| Model | 872 |
| `<pad>` | 0 |

Modern Transformer models rely on subword vocabularies instead of storing every possible word.

---

# 11. Special Tokens

Special tokens provide structural information that helps Transformer models understand sequences and downstream tasks.

| Token | Purpose |
|--------|---------|
| `<bos>` | Beginning of sequence |
| `<eos>` | End of sequence |
| `<pad>` | Padding |
| `<unk>` | Unknown token |
| `<cls>` | Classification token |
| `<sep>` | Separator token |
| `<mask>` | Masked Language Modeling |

Example:

```text
<bos>

Hello world

<eos>
```

or

```text
Question

<sep>

Answer
```

Different Transformer architectures define different sets of special tokens.

---

# 12. BERT Input Representation

Unlike decoder-only models such as GPT, BERT prepares each input using additional information beyond token IDs.

A BERT input consists of:

- Token IDs
- Attention Masks
- Token Type IDs (Segment IDs)
- Special Tokens

Workflow:

```text
Raw Text
      │
      ▼
Tokenizer
      │
      ▼
Token IDs
      │
      ├──────────────┬──────────────┐
      ▼              ▼              ▼
Attention Mask   Segment IDs   Special Tokens
      │
      ▼
Transformer Encoder
```

These additional inputs help BERT understand sentence boundaries while ignoring padding tokens.

---

## Attention Masks

Attention Masks indicate which tokens contain actual text and which tokens are padding.

Example:

```text
Sentence

↓

Hello world <pad> <pad>

↓

Attention Mask

↓

1 1 0 0
```

Where:

- **1** → Real token
- **0** → Padding token

Benefits:

- Ignores padding tokens
- Improves computational efficiency
- Prevents attention on meaningless positions

---

## Token Type IDs (Segment IDs)

Token Type IDs distinguish multiple input sequences.

Example:

```text
Sentence A

<sep>

Sentence B
```

↓

```text
Token Type IDs

0 0 0 0 1 1 1
```

Primarily used during:

- Next Sentence Prediction (NSP)
- Sentence Pair Classification
- Question Answering

---

# 13. Padding and Truncation

Transformer models require inputs with consistent sequence lengths.

Two preprocessing techniques are commonly used.

---

## Padding

Shorter sequences are extended using padding tokens.

Example:

```text
Hello world

↓

Hello world <pad> <pad>
```

Benefits:

- Uniform tensor shapes
- Efficient batching
- Better GPU utilization
- Simpler tensor operations

---

## Truncation

Sequences longer than the model's maximum context window are shortened.

Example:

```text
Very Long Document

↓

Maximum Sequence Length
```

Benefits:

- Controls memory usage
- Prevents exceeding model limits
- Faster inference
- Stable batch sizes

---

# 14. Dynamic vs Static Padding

Modern NLP libraries support two padding strategies.

| Static Padding | Dynamic Padding |
|----------------|-----------------|
| Pads every sequence to a fixed maximum length | Pads only to the longest sequence within a batch |
| Simple implementation | Better memory efficiency |
| More wasted computation | Faster training |
| Common during deployment | Common during training |

Dynamic padding is generally preferred because it minimizes unnecessary computation and improves GPU utilization.

---

# 15. Dataset

A **Dataset** represents a collection of training samples.

Each sample typically contains:

- Token IDs
- Attention Masks
- Labels (if supervised)

Responsibilities:

- Loading raw data
- Applying preprocessing
- Returning individual samples
- Supporting training and inference

Workflow:

```text
Raw Documents

↓

Dataset

↓

Individual Samples
```

---

# 16. DataLoader

The **DataLoader** efficiently feeds batches of data into the Transformer during training.

Responsibilities:

- Mini-batching
- Shuffling
- Parallel loading
- Memory optimization

Workflow:

```text
Dataset

↓

DataLoader

↓

Mini-Batches

↓

Training Loop
```

Benefits:

- Faster training
- Better GPU utilization
- Parallel preprocessing
- Simplified training pipeline

---

# 17. Batching

Instead of processing one sample at a time, LLMs process groups of samples called **mini-batches**.

Example:

```text
Sentence 1

Sentence 2

Sentence 3

↓

Mini Batch
```

Advantages:

- Faster computation
- Better GPU efficiency
- Stable optimization
- Higher throughput

Typical batch sizes:

- 8
- 16
- 32
- 64
- 128+

The optimal batch size depends on:

- GPU memory
- Model size
- Sequence length

---

# 18. Popular NLP Libraries

Modern LLM development relies on several widely used libraries.

---

## Hugging Face

Provides:

- Tokenizers
- Transformers
- Pretrained Models
- Datasets
- Model Hub

Most popular ecosystem for modern LLM development.

---

## PyTorch

Provides:

- Dataset
- DataLoader
- Neural Networks
- Training Pipeline

Widely used in research and production.

---

## TensorFlow

Provides:

- tf.data pipelines
- Keras integration
- Distributed training
- Production deployment

---

## NLTK

Useful for:

- Word Tokenization
- Sentence Tokenization
- Text preprocessing
- Educational NLP

---

## spaCy

Useful for:

- Industrial NLP pipelines
- Named Entity Recognition
- Part-of-Speech Tagging
- Dependency Parsing
- Tokenization

---

# 19. Hugging Face Tokenization Pipeline

Modern LLM development commonly follows the Hugging Face preprocessing workflow.

```text
Raw Text
      │
      ▼
Tokenizer
      │
      ▼
Token IDs
      │
      ▼
Attention Masks
      │
      ▼
Batch Encoding
      │
      ▼
PyTorch Dataset
      │
      ▼
DataLoader
      │
      ▼
Transformer Model
```

This standardized workflow simplifies both training and inference across many pretrained Transformer models.

---

# 20. GPT vs BERT Data Preparation

Although GPT and BERT both use tokenization and embeddings, their preprocessing pipelines differ.

| GPT | BERT |
|------|------|
| Decoder-only | Encoder-only |
| Causal Language Modeling | Masked Language Modeling |
| Uses causal attention | Uses bidirectional attention |
| Predicts next token | Predicts masked tokens |
| Typically uses token IDs and attention masks | Uses token IDs, attention masks, and token type IDs |
| Optimized for text generation | Optimized for language understanding |

Understanding these differences is essential when selecting the appropriate preprocessing pipeline for a specific NLP task.

# Preparing Data for Fine-Tuning

Although Foundation Models are pretrained on massive, general-purpose datasets, enterprise AI systems typically require **task-specific datasets** for supervised fine-tuning.

Unlike pretraining, fine-tuning datasets are carefully curated to teach the model domain-specific behavior.

Typical examples include:

- Question–Answer pairs
- Instruction–Response datasets
- Chat conversations
- Summarization examples
- Classification datasets
- Domain-specific documents

Typical workflow:

```text
Raw Business Data
        │
        ▼
Cleaning
        │
        ▼
Formatting
        │
        ▼
Instruction / Response Pairs
        │
        ▼
Tokenization
        │
        ▼
Training Dataset
        │
        ▼
Supervised Fine-Tuning
```

The quality of fine-tuning data directly influences model accuracy, safety, and domain-specific performance.

---

## Tokenization for Hugging Face Workflows

Modern Transformer training pipelines commonly use the **Hugging Face Datasets** and **Transformers** libraries.

Before training, datasets must be converted into tokenized numerical representations using the tokenizer associated with the selected pretrained model.

Typical workflow:

```text
Dataset
      │
      ▼
Tokenizer
      │
      ▼
Token IDs
      │
      ▼
Attention Masks
      │
      ▼
(Optional)
Labels
      │
      ▼
Hugging Face Dataset
      │
      ▼
Trainer / PEFT / LoRA
```

During tokenization, common preprocessing steps include:

- Truncation
- Padding
- Maximum sequence length
- Special tokens
- Attention mask generation
- Label preparation

Proper tokenization ensures compatibility with Hugging Face training pipelines and efficient Transformer fine-tuning.


---

# 21. Production Perspective

Enterprise LLM preprocessing pipelines transform raw text into optimized model inputs before inference or training.

Typical enterprise workflow:

```text
Raw Data
      │
      ▼
Cleaning
      │
      ▼
Normalization
      │
      ▼
Dataset Preparation
      │
      ▼
Tokenization
      │
      ▼
Hugging Face Dataset
      │
      ▼
Supervised Fine-Tuning
      │
      ▼
PEFT / LoRA
      │
      ▼
Evaluation
      │
      ▼
Deployment
```

Modern production systems typically rely on pretrained tokenizers to ensure consistency between training and inference.

---

# 22. GPT vs BERT Preprocessing Pipeline

Although GPT and BERT share many preprocessing steps, their inputs differ slightly.

```text
                Raw Text
                    │
                    ▼
              Tokenization
                    │
                    ▼
             Vocabulary Mapping
                    │
        ┌───────────┴────────────┐
        ▼                        ▼
      GPT                      BERT
        │                        │
 Token IDs               Token IDs
 Attention Mask          Attention Mask
                          Token Type IDs
        │                        │
        ▼                        ▼
 Decoder Transformer      Encoder Transformer
```

The tokenizer and preprocessing pipeline should always match the pretrained model being used.

---

# 23. Production Considerations

When deploying Transformer models in production, preprocessing becomes just as important as the model itself.

Key considerations include:

### Performance

- Efficient batching
- Dynamic padding
- Parallel tokenization
- GPU utilization
- Memory optimization

---

### Scalability

- Reusable tokenizers
- Distributed preprocessing
- Streaming datasets
- Large document handling
- High-throughput inference

---

### Consistency

- Same tokenizer for training and inference
- Consistent preprocessing rules
- Version-controlled vocabularies
- Standardized sequence lengths

---

### Monitoring

Monitor:

- Average sequence length
- Token distribution
- Padding ratio
- Processing latency
- Tokenization errors
- GPU utilization

---

# 24. Best Practices

- Always use the tokenizer provided with the pretrained model.
- Keep preprocessing identical during training and inference.
- Prefer subword tokenization for modern LLMs.
- Use dynamic padding during training whenever possible.
- Use attention masks correctly.
- Reuse vocabularies rather than creating new ones.
- Batch inputs efficiently for maximum GPU utilization.
- Monitor sequence lengths to reduce unnecessary truncation.
- Cache tokenized datasets for repeated training.
- Validate preprocessing pipelines before model training.

---

# 25. Common Mistakes

- Mixing tokenizers from different models.
- Ignoring special tokens.
- Forgetting attention masks.
- Using incorrect token type IDs.
- Excessive truncation of long documents.
- Padding every sequence to the maximum model length unnecessarily.
- Inconsistent preprocessing between training and inference.
- Building custom vocabularies when pretrained ones already exist.
- Inefficient batching leading to wasted GPU resources.

---

# 26. Interview Questions

### Beginner

- What is tokenization?
- Why can't LLMs process raw text directly?
- What is a vocabulary?
- What is a Dataset?
- What is a DataLoader?
- Why are special tokens needed?

---

### Intermediate

- Word vs Character vs Subword tokenization?
- Why do modern LLMs prefer subword tokenization?
- Explain padding and truncation.
- What is an Attention Mask?
- What are Token Type IDs?
- Dynamic vs Static Padding?
- GPT vs BERT preprocessing?

---

### Advanced

- Why should pretrained tokenizers always be reused?
- How do DataLoaders improve training performance?
- How does sequence length affect Transformer efficiency?
- Why are Attention Masks required?
- How would you preprocess large enterprise document collections?
- What production challenges exist in LLM preprocessing pipelines?

---

# 27. 🚀 Quick Revision Sheet

## Modern LLM Data Pipeline

```text
Raw Text

↓

Cleaning

↓

Tokenization

↓

Vocabulary

↓

Special Tokens

↓

Token IDs

↓

Attention Masks

↓

Padding / Truncation

↓

Dataset

↓

DataLoader

↓

Embedding Layer

↓

Transformer
```

---

## Tokenization Types

- Word
- Character
- Subword

---

## Popular Subword Algorithms

- WordPiece
- SentencePiece
- Unigram

---

## BERT Input

- Token IDs
- Attention Masks
- Token Type IDs
- Special Tokens

---

## Special Tokens

- `<bos>`
- `<eos>`
- `<pad>`
- `<unk>`
- `<cls>`
- `<sep>`
- `<mask>`

---

## PyTorch Pipeline

```text
Dataset

↓

DataLoader

↓

Mini-Batches

↓

Transformer
```

---

## GPT vs BERT

| GPT | BERT |
|------|------|
| Decoder | Encoder |
| Next Token Prediction | Masked Token Prediction |
| Token IDs + Attention Mask | Token IDs + Attention Mask + Token Type IDs |

---

## Remember

> **Large Language Models do not understand raw text. They understand structured numerical representations created through tokenization, vocabulary mapping, embeddings, attention masks, and efficient data pipelines that prepare language for Transformer architectures.**

---

# 28. Key Takeaways

- Data preparation is the foundation of every Large Language Model pipeline.
- Modern LLM preprocessing converts raw text into structured numerical representations suitable for Transformer models.
- Tokenization, vocabulary mapping, embeddings, and attention masks work together to create meaningful model inputs.
- Modern LLMs primarily rely on subword tokenization algorithms such as WordPiece, SentencePiece, and Unigram.
- BERT extends preprocessing with Token Type IDs and Masked Language Modeling inputs, while GPT focuses on autoregressive next-token prediction.
- Datasets and DataLoaders enable scalable, efficient training and inference.
- Dynamic padding, efficient batching, and consistent preprocessing significantly improve training performance.
- Production LLM systems require reusable tokenizers, optimized preprocessing pipelines, and continuous monitoring for scalable deployment.

---

# References

- IBM AI Engineering Professional Certificate (Coursera)
- Hugging Face Transformers Documentation
- Hugging Face Tokenizers Documentation
- PyTorch Documentation
- TensorFlow Documentation
- NLTK Documentation
- spaCy Documentation
- BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding
- Attention Is All You Need (Vaswani et al., 2017)
- Hands-on Labs from this repository