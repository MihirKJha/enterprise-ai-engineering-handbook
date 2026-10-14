---
description: |
  Learn the foundational Azure AI architecture concepts needed to plan
  AI solutions, understand Microsoft Foundry resources and projects,
  select AI capabilities, and incorporate responsible AI principles into
  solution design.
keywords:
- Azure AI
- AI-103
- Microsoft Foundry
- Azure AI Foundry
- generative AI
- AI agents
- Foundry Tools
- responsible AI
- Azure AI architecture
- AI solution planning
- model deployment
- AI development
title: "Azure AI Foundations: Planning and Preparing AI Solutions"
---

# Azure AI Foundations: Planning and Preparing AI Solutions

## Overview

Planning an Azure AI solution starts by identifying the problem to
solve, the AI capabilities required, the data and tools involved, and
the operational and responsible-AI requirements. Azure provides both
generative AI capabilities and specialized AI services; an effective
architecture chooses the right capability for each part of the solution
instead of treating every problem as a large-language-model problem.

This chapter introduces the foundational concepts for planning AI
development on Azure. It is a concept-first handbook note, not a
complete AI-103 exam guide.

## 1. Identify the AI capabilities required

Common AI solution capabilities include:

  -----------------------------------------------------------------------
  Capability                          Typical use
  ----------------------------------- -----------------------------------
  Generative AI                       Generate or transform text, code,
                                      and other content; summarize and
                                      answer questions

  AI agents                           Combine a model with instructions,
                                      tools, and knowledge to perform
                                      multi-step tasks

  Natural language processing         Analyze text, detect language,
                                      extract entities, classify content,
                                      or work with speech

  Computer vision                     Analyze images and video, recognize
                                      visual content, and extract
                                      information

  Information extraction              Extract structured fields and
                                      insights from documents, forms, and
                                      other content
  -----------------------------------------------------------------------

Choose based on the user problem, required quality, latency, data
sensitivity, cost, and operational constraints. A solution can combine
several capabilities---for example, document extraction followed by a
language model that explains the extracted results.

## 2. Understand Microsoft Foundry's organizing concepts

Microsoft Foundry provides an environment for working with models,
agents, tools, and connected knowledge. Understand the distinction
between the main building blocks before implementing an application.

``` mermaid
flowchart TD
    A["Microsoft Foundry resource"] --> B["Foundry project"]
    B --> C["Models and deployments"]
    B --> D["Agents"]
    B --> E["Tools and connections"]
    B --> F["Knowledge and data"]
    D --> C
    D --> E
    D --> F
    G["Application"] --> D
    G --> C
```

-   **Resource:** The Azure-level resource boundary used to manage and
    access Foundry capabilities.
-   **Project:** A workspace for organizing assets used to build AI
    applications.
-   **Model:** The underlying model selected for a task. A model may
    need to be deployed or otherwise made available before an
    application can use it.
-   **Agent:** An application component that uses a model, instructions,
    and potentially tools or knowledge to carry out a task.
-   **Tools:** Functions or services an agent can invoke to retrieve
    information or take actions.
-   **Knowledge:** Information made available to an application or
    agent, such as indexed enterprise content.

The exact capabilities and terminology can evolve as Microsoft Foundry
develops. Use the current portal and documentation when following a lab,
rather than relying on older names shown in videos.

## 3. Example: a customer-support assistant

A support assistant might answer questions using approved documentation
and use tools to look up order status. The language model generates a
response, the knowledge source grounds answers in company content, and
the order tool retrieves live transactional data.

``` mermaid
flowchart LR
    U["Customer"] --> A["Support application"]
    A --> AG["AI agent"]
    AG --> M["Language model"]
    AG --> K["Searchable support knowledge"]
    AG --> T["Order-status tool"]
    K --> D["Approved support documents"]
    T --> O["Order system"]
    M --> AG
    AG --> A
    A --> U
```

This design separates responsibilities:

-   Use **knowledge retrieval** for answers grounded in documentation.
-   Use **tools** for current data or actions that require a system of
    record.
-   Use the **model** for language understanding, reasoning, and
    response generation.
-   Keep authorization and business rules in the appropriate application
    or service layer; do not rely on model instructions alone as a
    security boundary.

## 4. Specialized Azure AI services and tools

Generative models are not the best or only option for every task.
Specialized services can provide focused capabilities such as speech
processing, language analysis, vision, or document information
extraction.

A practical design may use a specialized service for a well-defined task
and a generative model to combine results, explain them, or provide a
conversational interface. Evaluate each component against accuracy,
latency, cost, data requirements, and operational needs.

## 5. Developer tools and integration choices

Depending on the solution and the current Microsoft tooling, developers
may work with:

-   The Microsoft Foundry portal for exploring resources, models, and
    application assets.
-   Foundry SDKs and service-specific SDKs for application integration.
-   REST APIs, including supported OpenAI-compatible interfaces where
    applicable.
-   Development tools and extensions for building and testing from an
    IDE.
-   Azure identity and deployment tools for operationalizing an
    application.

Keep business logic independent of provider-specific SDK details where
practical. This improves testability and makes it easier to change the
underlying model or integration.

### Example: isolate a model-client dependency

The following Python example illustrates an application-level boundary.
It is **not** a complete Azure SDK integration; a concrete adapter would
implement the protocol using the SDK or API selected for the
application.

``` python
from typing import Protocol


class TextGenerator(Protocol):
    def generate(self, prompt: str) -> str:
        """Generate text from a prompt."""


class SupportService:
    def __init__(self, generator: TextGenerator) -> None:
        self._generator = generator

    def answer(self, question: str) -> str:
        prompt = (
            "Answer using approved support information. "
            "If the information is insufficient, say so.\n"
            f"Customer question: {question}"
        )
        return self._generator.generate(prompt)
```

This separation allows the application service to be tested with a fake
implementation and keeps model-provider details outside the business
workflow. In production, also implement authentication, timeouts,
retries, telemetry, error handling, and input/output controls in the
appropriate layers.

## 6. Apply responsible AI principles

Responsible AI should be part of planning and design---not a final
checklist added after implementation.

Microsoft's responsible AI principles include:

1.  **Fairness:** Reduce unjustified differences in how people are
    treated by an AI system.
2.  **Reliability and safety:** Design, test, and operate the system so
    it behaves reliably and avoids unacceptable harm.
3.  **Privacy and security:** Protect personal and sensitive data and
    secure the system and its access paths.
4.  **Inclusiveness:** Design for people with different needs,
    abilities, and circumstances.
5.  **Transparency:** Help users understand what the system can do, its
    limitations, and when AI is being used.
6.  **Accountability:** Ensure people and organizations remain
    responsible for the system and its outcomes.

Practical design controls may include access control, data minimization,
safety filters, evaluation, human review, audit logs, and monitoring.
The appropriate controls depend on the use case and risk.

## 7. A practical planning lifecycle

Use a repeatable process to move from a business problem to an operable
AI solution.

``` mermaid
flowchart TD
    A["Define the problem and success criteria"] --> B["Identify required AI capabilities"]
    B --> C["Assess data, tools, and integrations"]
    C --> D["Choose models and Azure services"]
    D --> E["Design security and responsible-AI controls"]
    E --> F["Build a small prototype"]
    F --> G["Evaluate quality, latency, and cost"]
    G --> H["Deploy, monitor, and improve"]
    G -->|Does not meet criteria| D
```

Before implementation, clarify:

-   What outcome must improve, and how will success be measured?
-   Which data sources are authoritative, and who is allowed to access
    them?
-   Does the solution need a model, retrieval, specialized AI services,
    tools, or a combination?
-   What are the requirements for privacy, safety, latency,
    availability, and cost?
-   How will the application be evaluated, monitored, and updated?

## Key takeaways

-   Start with the business problem and required capability, not with a
    model.
-   Distinguish Foundry resources and projects from models, agents,
    tools, and knowledge.
-   Combine generative AI with specialized services when that gives a
    better solution.
-   Keep business logic and security boundaries outside model prompts.
-   Plan for responsible AI, evaluation, observability, and operations
    from the beginning.
-   Treat this chapter as foundational preparation. The wider AI-103
    scope also includes implementation, deployment, evaluation,
    security, scaling, monitoring, agents, vision, language, and
    information extraction.

## Official references

-   [Prepare to develop AI solutions on Azure --- Microsoft
    Learn](https://learn.microsoft.com/en-us/training/modules/prepare-azure-ai-development/)
-   [AI-103: Develop AI solutions in Azure --- Study
    guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
-   [AI-103T00: Develop AI solutions in
    Azure](https://learn.microsoft.com/en-us/training/courses/ai-103t00/)
-   [Microsoft Foundry training and
    documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/)

> **Enterprise AI Engineering Handbook**
>
> *Building Production-Grade Enterprise AI Systems --- One Chapter at a
> Time.*
