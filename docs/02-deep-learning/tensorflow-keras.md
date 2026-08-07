# TensorFlow & Keras

> A practical engineering guide to building, training, optimizing, and deploying Deep Learning models using TensorFlow and Keras.

---

# 1. Overview

TensorFlow is Google's open-source Deep Learning framework used to build, train, and deploy Machine Learning and Deep Learning models at scale.

Keras is TensorFlow's high-level API that simplifies model development while providing flexibility for both beginners and advanced AI engineers.

Together, TensorFlow and Keras power many production AI systems across Computer Vision, NLP, Recommendation Systems, and Generative AI.

---

# 2. Why TensorFlow & Keras?

TensorFlow provides:

- High-performance tensor computations
- Automatic differentiation
- GPU / TPU acceleration
- Distributed training
- Production deployment
- TensorFlow Serving
- TensorFlow Lite
- TensorFlow.js

Keras provides:

- Simple API
- Rapid prototyping
- Modular model development
- Production-ready workflows
- Built-in training loops

---

# 3. TensorFlow Ecosystem

```text
TensorFlow
     │
     ├── Keras
     ├── tf.data
     ├── TensorBoard
     ├── TensorFlow Lite
     ├── TensorFlow Serving
     ├── TensorFlow Hub
     └── TensorFlow Extended (TFX)
```

---

# 4. Core Concepts

## Tensor

The fundamental data structure in TensorFlow.

Examples:

- Scalar (0D)
- Vector (1D)
- Matrix (2D)
- Higher-dimensional Tensor (3D+)

---

## Layer

A layer performs a transformation on input data.

Examples:

- Dense
- Conv2D
- LSTM
- Embedding
- Dropout

---

## Model

A model is a collection of layers connected together.

```
Input

↓

Hidden Layers

↓

Output
```

---

# 5. Keras APIs

## Sequential API

Best for simple linear models.

```python
Sequential([
    Dense(),
    Dense(),
    Dense()
])
```

Use when:

- Layers are stacked sequentially.
- Single input and output.

---

## Functional API

Supports complex architectures.

Examples:

- Multiple inputs
- Multiple outputs
- Residual Networks
- Siamese Networks

```
Input A

↓

Dense

↓

Concatenate

↑

Dense

↓

Input B
```

---

## Model Subclassing

Maximum flexibility.

Used for:

- Research
- Custom architectures
- Complex workflows

---

# 6. Building a Model

Typical workflow:

```text
Prepare Data

↓

Build Model

↓

Compile

↓

Train

↓

Evaluate

↓

Predict

↓

Save Model

↓

Deploy
```

---

# 7. Model Compilation

Before training:

```python
model.compile(
    optimizer=...,
    loss=...,
    metrics=[...]
)
```

Components:

Optimizer

Loss Function

Evaluation Metrics

---

# 8. Model Training

```python
model.fit()
```

Important parameters:

- epochs
- batch_size
- validation_data
- callbacks

---

# 9. Model Evaluation

```python
model.evaluate()
```

Common metrics:

Classification

- Accuracy
- Precision
- Recall
- F1

Regression

- MAE
- MSE
- RMSE

---

# 10. Model Prediction

```python
model.predict()
```

Used for inference.

---

# 11. Custom Layers

Why?

When built-in layers aren't sufficient.

Applications:

- Research
- Attention mechanisms
- Specialized architectures

---

# 12. Custom Models

Subclass `tf.keras.Model`.

Useful for:

- GANs
- Reinforcement Learning
- Diffusion Models
- Research

---

# 13. Custom Training Loops

Default:

```
model.fit()
```

Advanced:

```
GradientTape
```

Used when:

- Multiple losses
- GANs
- RL
- Custom optimization

---

# 14. Callbacks

Callbacks automate training tasks.

Common callbacks:

- EarlyStopping
- ModelCheckpoint
- ReduceLROnPlateau
- TensorBoard

Benefits:

- Prevent overfitting
- Save best model
- Monitor training
- Reduce manual work

---

# 15. Hyperparameter Tuning

Common parameters:

- Learning Rate
- Batch Size
- Epochs
- Optimizer
- Number of Layers
- Activation Functions

Tools:

- KerasTuner
- Grid Search
- Random Search
- Bayesian Optimization

---

# 16. Transfer Learning

Workflow

```text
Pretrained Model

↓

Freeze Layers

↓

Replace Classifier

↓

Fine Tune

↓

Deploy
```

Popular models:

- ResNet
- MobileNet
- EfficientNet
- Inception

---

# 17. Production Perspective

```text
Raw Data

↓

tf.data Pipeline

↓

Training

↓

TensorBoard

↓

Model Registry

↓

TensorFlow Serving

↓

REST API

↓

Monitoring
```

Production considerations:

- GPU utilization
- Mixed precision
- Distributed training
- Versioning
- Monitoring
- Model drift

---

# 18. Best Practices

- Start with transfer learning.
- Use callbacks.
- Monitor validation loss.
- Save checkpoints.
- Normalize inputs.
- Use tf.data pipelines.
- Profile training performance.
- Version models.

---

# 19. Common Mistakes

- Training from scratch unnecessarily.
- Ignoring validation loss.
- Large learning rates.
- Not using callbacks.
- Overfitting.
- Poor data preprocessing.
- Ignoring deployment requirements.

---

# 20. Interview Questions

### Beginner

- What is TensorFlow?
- What is Keras?
- Sequential vs Functional API?
- What is a Tensor?

---

### Intermediate

- Why use Functional API?
- What are callbacks?
- Explain Transfer Learning.
- Why use custom layers?

---

### Advanced

- Explain GradientTape.
- TensorFlow vs PyTorch.
- How would you deploy a TensorFlow model?
- Explain distributed training.

---

# 21. 🚀 Quick Revision Sheet

## TensorFlow Ecosystem

TensorFlow

↓

Keras

↓

Model

↓

Training

↓

Deployment

---

## APIs

✔ Sequential

✔ Functional

✔ Subclassing

---

## Training Flow

```
Build

↓

Compile

↓

Fit

↓

Evaluate

↓

Predict

↓

Deploy
```

---

## Important Methods

- compile()
- fit()
- evaluate()
- predict()
- save()

---

## Callbacks

- EarlyStopping

- ModelCheckpoint

- TensorBoard

---

## Advanced Topics

- Custom Layers

- Custom Models

- GradientTape

- Transfer Learning

- Hyperparameter Tuning

---

## Remember

> **TensorFlow provides the engine, while Keras provides the developer-friendly interface for building scalable Deep Learning applications.**

---

# 22. Key Takeaways

- TensorFlow is a scalable Deep Learning framework for research and production.
- Keras simplifies model development while retaining TensorFlow's flexibility.
- The Functional API enables complex model architectures beyond simple sequential stacks.
- Transfer learning significantly reduces training time and data requirements.
- Custom layers, custom training loops, and callbacks enable advanced Deep Learning workflows.
- Production AI systems require efficient data pipelines, monitoring, versioning, and scalable deployment.

---

# References

- IBM AI Engineering Professional Certificate (Coursera)
- TensorFlow Documentation
- Keras Documentation