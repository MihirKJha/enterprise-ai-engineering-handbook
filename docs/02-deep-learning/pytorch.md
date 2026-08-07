# PyTorch

> A practical engineering guide to building, training, debugging, and deploying Deep Learning models using PyTorch.

---

# 1. Overview

PyTorch is an open-source Deep Learning framework developed by **Meta AI**. It provides a Python-first, flexible, and dynamic environment for building neural networks and training AI models.

PyTorch is widely used in:

- Deep Learning
- Computer Vision
- Natural Language Processing
- Large Language Models (LLMs)
- Reinforcement Learning
- Generative AI
- AI Research

Unlike TensorFlow, PyTorch emphasizes flexibility, making it the preferred framework for research while also supporting production deployment.

---

# 2. Why PyTorch?

PyTorch provides:

- Dynamic Computation Graph
- Automatic Differentiation
- GPU Acceleration
- Easy Debugging
- Pythonic API
- Rich Model Zoo
- Production Deployment Support

Advantages:

- Easy to learn
- Excellent debugging experience
- Flexible model development
- Strong research ecosystem
- Growing enterprise adoption

---

# 3. PyTorch Ecosystem

```text
                     PyTorch
                         │
 ┌──────────────┬───────────────┬───────────────┐
 │              │               │               │
torch      torchvision     torchaudio      torchtext
 │
 ├── Autograd
 ├── nn
 ├── optim
 ├── utils.data
 ├── cuda
 ├── jit
 └── distributed
```

---

# 4. Core Concepts

## Tensor

A Tensor is the fundamental data structure in PyTorch.

Examples:

- Scalar (0D)
- Vector (1D)
- Matrix (2D)
- Multi-dimensional Tensor (3D+)

Example:

```python
x = torch.tensor([1,2,3])
```

---

## Autograd

PyTorch automatically computes gradients.

It powers:

- Backpropagation
- Gradient Descent
- Model Optimization

Core API

```python
loss.backward()
```

---

## Computational Graph

During the forward pass, PyTorch dynamically builds a computation graph.

```text
Input

↓

Operations

↓

Loss

↓

Backward()

↓

Gradients
```

The graph is destroyed after each iteration, enabling flexible model structures.

---

# 5. Dataset & DataLoader

PyTorch separates data management from model logic.

## Dataset

Responsible for:

- Reading data
- Returning samples
- Applying preprocessing

Custom Dataset implements:

```python
__len__()

__getitem__()
```

---

## DataLoader

Provides:

- Mini-batches
- Shuffling
- Parallel loading
- Efficient iteration

Example:

```python
DataLoader(
    dataset,
    batch_size=32,
    shuffle=True
)
```

---

# 6. Building Neural Networks

All models inherit from:

```python
torch.nn.Module
```

Example workflow:

```text
Dataset

↓

DataLoader

↓

Model (nn.Module)

↓

Loss Function

↓

Optimizer

↓

Training

↓

Evaluation

↓

Deployment
```

---

# 7. Important Components

## Layers

Examples:

- Linear
- Conv2D
- LSTM
- Embedding
- BatchNorm
- Dropout

---

## Loss Functions

Regression

- MSELoss
- L1Loss

Classification

- CrossEntropyLoss
- BCELoss
- BCEWithLogitsLoss

---

## Optimizers

Responsible for updating weights.

Popular optimizers:

- SGD
- Adam
- AdamW
- RMSProp

---

# 8. Model Training Workflow

```text
Load Data

↓

Forward Pass

↓

Compute Loss

↓

Backward Pass

↓

Update Parameters

↓

Repeat
```

Typical training loop:

```python
optimizer.zero_grad()

output = model(x)

loss = criterion(output, y)

loss.backward()

optimizer.step()
```

---

# 9. Gradient Descent Variants

### Batch Gradient Descent

Uses the complete dataset.

Pros:

- Stable

Cons:

- Slow

---

### Stochastic Gradient Descent (SGD)

Updates after every sample.

Pros:

- Faster

Cons:

- Noisy updates

---

### Mini-Batch Gradient Descent

Uses small batches.

Pros:

- Faster
- Stable
- Most commonly used

---

# 10. Training & Validation

Recommended workflow:

```text
Dataset

↓

Train

↓

Validation

↓

Test
```

Purpose:

Train → Learn

Validation → Hyperparameter tuning

Test → Final evaluation

---

# 11. Model Evaluation

Common metrics

Classification

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

Regression

- MAE
- MSE
- RMSE
- R²

---

# 12. Model Parameters

PyTorch stores model weights using:

```python
state_dict()
```

Benefits:

- Save checkpoints
- Resume training
- Fine-tuning
- Deployment

---

# 13. GPU Training

Move model to GPU:

```python
device = "cuda"

model.to(device)
```

Benefits:

- Faster training
- Larger models
- Better throughput

---

# 14. Production Perspective

```text
Raw Data

↓

Dataset

↓

DataLoader

↓

Training

↓

Checkpoint

↓

TorchScript

↓

TorchServe

↓

REST API

↓

Monitoring
```

Production considerations:

- GPU utilization
- Mixed precision
- Checkpointing
- Model versioning
- Monitoring
- Distributed training

---

# 15. TensorFlow vs PyTorch

| TensorFlow | PyTorch |
|------------|----------|
| Google | Meta |
| Keras API | nn.Module |
| Production-first | Research-first |
| TensorFlow Serving | TorchServe |
| Static + Dynamic Graph | Dynamic Graph |

---

# 16. Best Practices

- Normalize data.
- Use DataLoader.
- Monitor validation metrics.
- Save checkpoints regularly.
- Use GPU whenever possible.
- Start with transfer learning.
- Keep training reproducible.

---

# 17. Common Mistakes

- Forgetting `model.train()`
- Forgetting `model.eval()`
- Not calling `optimizer.zero_grad()`
- Ignoring validation loss
- Training without GPU
- Poor learning rate selection
- Overfitting

---

# 18. Interview Questions

### Beginner

- What is PyTorch?
- What is a Tensor?
- What is Autograd?
- What is a Computational Graph?

---

### Intermediate

- Dataset vs DataLoader?
- Explain nn.Module.
- What is state_dict()?
- Why use CrossEntropyLoss?

---

### Advanced

- TensorFlow vs PyTorch?
- TorchScript vs TorchServe?
- How does Autograd work?
- Explain the PyTorch training loop.
- How do you deploy a PyTorch model?

---

# 19. 🚀 Quick Revision Sheet

## Core Components

```
Tensor

↓

Autograd

↓

Dataset

↓

DataLoader

↓

nn.Module

↓

Optimizer

↓

Training

↓

Deployment
```

---

## Training Loop

```
Forward

↓

Loss

↓

Backward

↓

Optimizer Step

↓

Repeat
```

---

## Common Loss Functions

Regression

- MSELoss
- L1Loss

Classification

- CrossEntropyLoss
- BCEWithLogitsLoss

---

## Popular Optimizers

- SGD
- Adam
- AdamW

---

## Production Stack

- TorchScript
- TorchServe
- CUDA
- Distributed Training

---

## Remember

> **PyTorch combines dynamic computation graphs, automatic differentiation, and a Pythonic API to make Deep Learning development flexible, efficient, and production-ready.**

---

# 20. Key Takeaways

- PyTorch is a Python-first Deep Learning framework designed for flexibility and scalability.
- Tensors and Autograd form the foundation of all PyTorch computations.
- Dataset and DataLoader simplify efficient data handling.
- nn.Module provides a reusable structure for building neural networks.
- Training consists of forward propagation, loss computation, backpropagation, and optimizer updates.
- Model parameters are stored using `state_dict()`, making checkpointing and deployment straightforward.
- PyTorch supports GPU acceleration, distributed training, and production deployment through TorchScript and TorchServe.

---

# References

- IBM AI Engineering Professional Certificate (Coursera)
- PyTorch Documentation
- Torchvision Documentation
- TorchServe Documentation