# Data Preparation for Machine Learning

> A practical engineering guide to preparing data for Machine Learning, covering data cleaning, preprocessing, feature engineering, validation, and production best practices.

---

# 1. Overview

Data Preparation is the process of transforming raw data into a clean, consistent, and structured format suitable for Machine Learning models.

It includes:

- Data Collection
- Data Cleaning
- Data Transformation
- Feature Engineering
- Feature Selection
- Data Splitting

> **Well-prepared data often has a greater impact on model performance than choosing a more complex algorithm.**

---

# 2. Why It Matters

Data preparation is one of the most critical stages in the Machine Learning lifecycle.

In real-world projects, **60–80% of the effort** is spent preparing data rather than training models.

Proper data preparation helps:

- Improve model accuracy
- Reduce training time
- Prevent overfitting
- Reduce bias
- Improve model interpretability
- Build reliable production systems

---

# 3. Core Concepts

## Raw Data

Original data collected from various sources.

Examples:

- Databases
- CSV Files
- APIs
- Sensors
- Logs

---

## Data Quality

Good data should be:

- Complete
- Accurate
- Consistent
- Valid
- Unique
- Timely

---

## Features

Input variables used by Machine Learning models.

Example:

```
Age

Income

Salary

Location

Occupation
```

---

## Target Variable

The value the model tries to predict.

Examples:

- House Price
- Loan Approval
- Customer Churn
- Fraud Detection

---

# 4. Data Preparation Workflow

```text
Business Problem
        │
        ▼
Data Collection
        │
        ▼
Data Understanding (EDA)
        │
        ▼
Data Cleaning
        │
        ▼
Missing Value Handling
        │
        ▼
Outlier Detection
        │
        ▼
Feature Engineering
        │
        ▼
Encoding
        │
        ▼
Feature Scaling
        │
        ▼
Feature Selection
        │
        ▼
Train / Validation / Test Split
        │
        ▼
Ready for Model Training
```

---

# 5. Data Preparation Techniques

## Data Cleaning

Remove or fix:

- Duplicate rows
- Incorrect values
- Invalid formats
- Missing values
- Inconsistent labels

---

## Handling Missing Values

| Method | When to Use |
|----------|-------------|
| Drop Rows | Very few missing values |
| Drop Columns | Column has excessive missing data |
| Mean | Normally distributed numerical data |
| Median | Skewed numerical data |
| Mode | Categorical data |
| KNN Imputation | Complex datasets |

---

## Outlier Handling

### Detection Methods

- Box Plot
- IQR Method
- Z-Score
- Isolation Forest

### Possible Actions

- Remove
- Cap
- Transform
- Keep (if meaningful)

---

## Feature Engineering

Create new features from existing data.

Examples:

- Age from Date of Birth
- Total Purchase Amount
- Purchase Frequency
- Customer Lifetime Value
- Time Since Last Login

Good feature engineering often improves model performance more than changing algorithms.

---

## Encoding Categorical Variables

### Label Encoding

Suitable for ordinal data.

Example:

```
Small → 0
Medium → 1
Large → 2
```

---

### One-Hot Encoding

Suitable for nominal data.

Example:

```
Color

Red
Blue
Green

↓

Red Blue Green

1    0     0

0    1     0

0    0     1
```

---

## Feature Scaling

Required for distance-based algorithms.

### StandardScaler

Mean = 0

Standard Deviation = 1

---

### MinMaxScaler

Scales values between:

0 → 1

---

### RobustScaler

Recommended when outliers exist.

---

## Feature Selection

Removes unnecessary features to improve performance.

Methods:

- Correlation Analysis
- Recursive Feature Elimination (RFE)
- Tree-Based Feature Importance
- Lasso Regression

Benefits:

- Faster training
- Better accuracy
- Reduced overfitting
- Improved explainability

---

# 6. Data Splitting

A common split strategy:

```text
Dataset

│

├── Training (70%)

├── Validation (15%)

└── Testing (15%)
```

Purpose:

- **Training:** Learn patterns
- **Validation:** Tune hyperparameters
- **Testing:** Final evaluation

Never use the test set during model training.

---

# 7. Production Perspective

Enterprise data pipelines typically look like:

```text
Data Sources
      │
      ▼
ETL / ELT Pipeline
      │
      ▼
Data Validation
      │
      ▼
Feature Store
      │
      ▼
Preprocessing Pipeline
      │
      ▼
Training Pipeline
      │
      ▼
Model Deployment
      │
      ▼
Prediction Service
```

Key production principles:

- Automate preprocessing
- Version datasets
- Version preprocessing pipelines
- Keep training and inference preprocessing identical
- Monitor data quality continuously

---

# 8. Best Practices

- Understand the business problem first.
- Perform Exploratory Data Analysis (EDA).
- Handle missing values carefully.
- Investigate outliers before removing them.
- Encode categorical variables correctly.
- Scale features when required.
- Split data before preprocessing.
- Prevent data leakage.
- Automate preprocessing pipelines.
- Document every transformation.

---

# 9. Common Mistakes

- Ignoring missing values
- Removing outliers without investigation
- Scaling before train/test split
- Encoding the full dataset before splitting
- Using irrelevant features
- Ignoring feature importance
- Data leakage
- Inconsistent preprocessing between training and inference

---

# 10. Interview Questions

### Beginner

- What is data preprocessing?
- Why is data preparation important?
- Difference between data cleaning and preprocessing?
- What is feature engineering?

---

### Intermediate

- Label Encoding vs One-Hot Encoding?
- StandardScaler vs MinMaxScaler?
- What is feature selection?
- What is data leakage?
- Why split data into train, validation, and test?

---

### Advanced

- How do you preprocess streaming data?
- How do you build reusable preprocessing pipelines?
- What is a Feature Store?
- How do you ensure training and inference consistency?

---

# 11. 🚀 Quick Revision Sheet

## Data Preparation Steps

```
Collect

↓

Understand (EDA)

↓

Clean

↓

Handle Missing Values

↓

Handle Outliers

↓

Engineer Features

↓

Encode

↓

Scale

↓

Select Features

↓

Split Data

↓

Train Model
```

---

## Missing Values

- Drop
- Mean
- Median
- Mode
- KNN

---

## Encoding

- Label Encoding
- One-Hot Encoding

---

## Scaling

- StandardScaler
- MinMaxScaler
- RobustScaler

---

## Feature Selection

- Correlation
- RFE
- Feature Importance
- Lasso

---

## Common Problems

- Missing Data
- Outliers
- Data Leakage
- Imbalanced Dataset
- Duplicate Records

---

## Golden Rules

✔ Understand data before modeling

✔ Split before preprocessing

✔ Prevent data leakage

✔ Automate preprocessing

✔ Keep preprocessing consistent in production

---

# 12. Key Takeaways

- High-quality data is the foundation of successful Machine Learning.
- Data preparation often contributes more to model performance than algorithm selection.
- Feature engineering is one of the highest-impact activities in ML.
- Preventing data leakage is critical for trustworthy evaluation.
- Production systems require reproducible and automated preprocessing pipelines.

---

# References

- IBM AI Engineering Professional Certificate (Coursera)
- Scikit-learn Documentation
- Hands-on Labs from this repository