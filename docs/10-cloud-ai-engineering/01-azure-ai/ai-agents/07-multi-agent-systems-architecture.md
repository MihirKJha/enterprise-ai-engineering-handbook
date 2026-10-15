---
title: "Multi-Agent Systems Architecture"
description: |
  Understand when multi-agent systems are justified and how to select an
  orchestration pattern. Compare sequential and concurrent execution,
  explore handoff, group chat, and Magentic coordination, and build a
  customer-feedback pipeline with Microsoft Agent Framework.
keywords:
- multi-agent systems
- multi-agent architecture
- Microsoft Agent Framework
- agent roles
- agent delegation
- agent coordination
- multi-agent design patterns
- sequential orchestration
- concurrent orchestration
- handoff orchestration
- group chat orchestration
- Magentic orchestration
- SequentialBuilder
- ConcurrentBuilder
- Azure AI agents
- Microsoft Foundry
- enterprise AI architecture
title: 07. Multi-Agent Systems
---

# 07. Multi-Agent Systems

*Orchestrating Multiple Agents with Microsoft Agent Framework*

## 1. When is a multi-agent system justified?

A multi-agent system is not automatically better than a single agent.
Introduce multiple agents when the problem benefits from **distinct
responsibilities, independent work, dynamic specialist routing, or
iterative review**---and when those benefits outweigh the extra model
calls, coordination, latency, and operational complexity.

Start with the simplest design that satisfies the requirements:

-   **One agent** when one role can complete the task reliably with a
    clear prompt and suitable tools.
-   **Sequential orchestration** when steps have known order and later
    steps depend on earlier outputs.
-   **Concurrent orchestration** when multiple analyses can run
    independently.
-   **Handoff** when the next specialist depends on the request or
    information discovered during processing.
-   **Group chat** when iterative discussion, critique, or consensus is
    genuinely useful.
-   **Magentic orchestration** when the task is open-ended and the plan
    must evolve as work progresses.

The Microsoft Learn source for this chapter demonstrates a sequential
customer-feedback pipeline and explains five orchestration patterns.
This chapter uses that exercise as its main implementation and adds
architecture guidance for choosing among patterns. SDK APIs evolve;
verify imports and signatures against the version installed in your
environment.

## 2. Agent roles, delegation, and coordination

A useful agent role is more than a name. It should define a bounded
responsibility, the information the agent receives, the output it must
produce, and the tools or permissions it is allowed to use.

For example, a customer-feedback pipeline can separate:

1.  **Summarizer** — turns long feedback into a concise, neutral
    summary.
2.  **Classifier** — assigns a category such as Positive, Negative, or
    Feature request.
3.  **Action recommender** — suggests a follow-up based on the summary
    and category.

These roles have a meaningful dependency: the later stages benefit from
earlier outputs. This is a stronger reason to split work than simply
creating three agents with different personas.

Delegation means deciding which agent should handle a piece of work.
Coordination defines how that work is ordered, run in parallel, routed,
discussed, and collected. The orchestration pattern should encode those
requirements explicitly.

``` mermaid
flowchart TD
    A[Incoming task] --> B{What does the task require?}
    B -->|One bounded responsibility| S[Single agent]
    B -->|Ordered dependent stages| Q[Sequential]
    B -->|Independent analyses| C[Concurrent]
    B -->|Route to a specialist| H[Handoff]
    B -->|Iterative discussion or review| G[Group chat]
    B -->|Open-ended planning and delegation| M[Magentic]
    S --> V[Validate result]
    Q --> V
    C --> V
    H --> V
    G --> V
    M --> V
```

## 3. Sequential versus concurrent: the key comparison

These patterns solve different dependency problems. Sequential
orchestration encodes a pipeline; concurrent orchestration encodes
independent work that can happen at the same time.

  -----------------------------------------------------------------------
  Dimension               Sequential              Concurrent
  ----------------------- ----------------------- -----------------------
  Execution               Agents run in a defined Multiple agents run
                          order.                  independently at the
                                                  same time.

  Data dependency         A later stage can use   Agents work from the
                          an earlier stage's      task/input
                          output.                 independently; they do
                                                  not automatically see
                                                  each other's results.

  Example                 Summarize feedback →    Review a proposed
                          classify it → recommend feature independently
                          an action.              from technical,
                                                  business, and
                                                  customer-experience
                                                  perspectives.

  Latency                 Stage durations         Wall-clock time can be
                          accumulate.             lower if tasks truly
                                                  run in parallel.

  Cost                    Cost of each stage in   Often higher total cost
                          the pipeline.           because several agents
                                                  are invoked.

  Main risk               Early-stage errors      Outputs can conflict
                          propagate downstream.   and need
                                                  reconciliation.

  Choose it when          Order and dependencies  Work is independent and
                          are important.          parallel results add
                                                  value.
  -----------------------------------------------------------------------

**Decision rule:** if stage B needs stage A's result, use sequential
execution for that dependency. If A, B, and C can answer independently
from the same input, concurrent execution may fit. If the work is
independent only in part, use a hybrid design: parallelize the
independent analyses, then pass their validated results to a synthesis
stage.

Do not assume concurrent execution is automatically faster in an
end-to-end system. Model-service limits, rate limits, queueing, and
result aggregation can reduce or eliminate the latency benefit. Measure
both total cost and end-to-end latency.

## 4. Main orchestration patterns

The Microsoft Agent Framework source introduces these five patterns:

  ------------------------------------------------------------------------
  Pattern           Coordination      Good fit           Main trade-off
                    model                                
  ----------------- ----------------- ------------------ -----------------
  **Sequential**    Fixed sequence;   Multi-stage        Predictable, but
                    output flows from processing and     latency
                    one agent to the  progressive        accumulates and
                    next.             refinement.        errors can
                                                         propagate.

  **Concurrent**    Broadcast the     Parallel reviews,  Can reduce
                    task to           independent        wall-clock
                    independent       subtasks,          latency, but
                    agents and        alternative        costs more and
                    collect results.  approaches.        needs result
                                                         reconciliation.

  **Handoff**       Transfer control  Support triage,    Flexible, but
                    to a specialist   expert routing,    misrouting and
                    based on context  escalation,        repeated handoffs
                    or routing.       fallback.          need limits.

  **Group chat**    A manager selects Maker-checker      Iteration adds
                    the next speaker  loops,             latency and
                    and manages a     collaborative      requires a clear
                    shared            problem-solving,   termination
                    conversation.     consensus.         condition.

  **Magentic**      A manager plans,  Open-ended tasks   Powerful, but
                    delegates, tracks with no fixed      planning and
                    progress, and     solution path.     repeated
                    adapts the plan.                     execution can be
                                                         costly or stall.
  ------------------------------------------------------------------------

### When not to add more agents

Prefer a simpler design when: - A single agent already meets quality and
reliability targets. - The proposed roles substantially duplicate one
another. - Agents need extensive back-and-forth just to resolve
ambiguous responsibilities. - The task is latency-sensitive and the
expected quality gain is small. - The workflow is deterministic and
ordinary application code or a fixed workflow can control it more
reliably.

## 5. Hands-on example: sequential customer-feedback processing

The source exercise builds three agents using `FoundryChatClient` and
`chat_client.as_agent(...)`, then composes them with
`SequentialBuilder`. The input is feedback about a dashboard that works
well overall but needs a dark mode option because the screen is harsh at
night.

The intended pipeline is:

``` mermaid
flowchart LR
    I[Customer feedback] --> S[Summarizer]
    S --> C[Classifier]
    C --> R[Recommended action]
    S -. collected output .-> O[Inspect all agent outputs]
    C -. collected output .-> O
    R -. collected output .-> O
```

### Code based on the Learn exercise

This is a focused excerpt of the exercise, not a standalone application.
It assumes the starter project has already configured `chat_client`, the
agent instruction strings, environment variables, and authentication.
The exact SDK version should be checked before running.

``` python
from typing import cast

from agent_framework import Message
from agent_framework.orchestrations import SequentialBuilder

# Define focused agent roles.
summarizer_agent = chat_client.as_agent(
    name="summarizer",
    instructions=summarizer_instructions,
)

classifier_agent = chat_client.as_agent(
    name="classifier",
    instructions=classifier_instructions,
)

action_agent = chat_client.as_agent(
    name="action",
    instructions=action_instructions,
)

feedback = """
I use the dashboard every day to monitor metrics, and it works well overall.
But when I'm working late at night, the bright screen is harsh on my eyes.
A dark mode option would make the experience more comfortable.
"""

# Compose the agents in dependency order.
workflow = SequentialBuilder(
    participants=[summarizer_agent, classifier_agent, action_agent],
    output_from="all",
).build()

# Run and collect the outputs from all participating agents.
result = await workflow.run(f"Customer feedback: {feedback}")
outputs = result.get_outputs()

# Preserve the author information when displaying the messages.
index = 1
for response in outputs:
    for message in cast(list[Message], response.messages):
        author = message.author_name or (
            "assistant" if message.role == "assistant" else "user"
        )
        print(f"{'-' * 60}\n{index:02d} [{author}]\n{message.text}")
        index += 1
```

The key framework details from the source are:

-   `chat_client.as_agent(...)` creates agents with named roles and
    instructions.
-   `SequentialBuilder(participants=[...], output_from="all").build()`
    creates the ordered pipeline and requests outputs from all
    participants.
-   `await workflow.run(...)` runs the workflow.
-   `result.get_outputs()` returns collected outputs; the sample prints
    each message and its author.

The code is intentionally close to the transcript. It has **not** been
independently executed against a pinned package version, so validate the
environment and API surface before treating it as production-ready.

### Why sequential is the right fit here

The classification and recommended action are intended to build on the
preceding processing. The order is known in advance, and the source
exercise does not require agents to debate or choose their own next
steps. A sequential pipeline is therefore sufficient; implementing
handoff or group chat would add complexity without a demonstrated need.

## 6. What would make concurrent execution a better choice?

Consider a separate scenario: a product team wants independent
assessments of a proposed dark mode feature.

-   A **technical reviewer** estimates implementation complexity.
-   A **business reviewer** assesses potential product value.
-   A **customer-experience reviewer** assesses user impact.

These reviews can start from the same feature description and do not
need each other's conclusions. Concurrent orchestration is a natural
candidate. A later synthesis step can compare the three outputs and
identify agreement or disagreement.

Conceptually:

``` mermaid
flowchart TD
    I[Feature proposal] --> T[Technical review]
    I --> B[Business review]
    I --> X[Customer-experience review]
    T --> R[Validate and reconcile]
    B --> R
    X --> R
    R --> D[Combined assessment]
```

This diagram describes the architecture decision, not a second code
implementation from the source lab. Concurrent execution should be
implemented with the framework's corresponding builder only when the
parallel work is genuinely independent and the combined assessment is
valuable.

Before adopting it, define the output schema for each reviewer, decide
how conflicting conclusions will be reconciled, and compare its latency
and cost against a simpler single-agent baseline.

## 7. Handoff, group chat, and Magentic: use only when justified

### Handoff — route to a specialist

Use handoff when the right specialist depends on the incoming request or
on information discovered during processing. For example, a support
request might need billing, account-access, or technical support.

The source also describes a control-workflow approach where a
classification result is transformed into a routing value, conditional
branches choose a handler, and a default branch handles unexpected
categories.

Production guidance: - Validate routing values against an allowlist. -
Define a fallback for unknown categories. - Bound the number of
transfers and detect loops. - Do not let free-form agent text alone
authorize a sensitive action.

### Group chat — iterative collaboration

Group chat uses a manager to decide who speaks next and when to stop.
The source describes uses such as brainstorming, cross-disciplinary
problem-solving, human participation, and maker-checker review.

Choose it when a reviewer needs to critique a proposal and the creator
can meaningfully revise it. Do not use it for a fixed three-stage
pipeline.

Production guidance: - Set a maximum number of turns or review rounds. -
Define what counts as an acceptable final result. - Track disagreements
and preserve attribution. - Add human review when the decision warrants
it.

### Magentic — dynamic planning and delegation

Magentic orchestration is designed for open-ended work where the
solution path is not fully known. A manager develops and updates a plan,
delegates work to specialist agents, tracks progress in a task ledger,
and adapts the plan as results arrive.

Choose it when the dynamic plan is itself useful and the task is complex
enough to justify planning overhead. Avoid it for fixed, simple, or
latency-sensitive pipelines.

Production guidance: - Bound execution time, iterations, and resource
use. - Make the evolving plan and task progress observable. - Define how
stalled or failed subtasks are handled. - Validate outputs and
permissions before tools affect external systems.

## 8. Production design checklist

### Roles and contracts

-   [ ] Each agent has a distinct responsibility and explicit
    instructions.
-   [ ] Inputs and outputs have documented contracts.
-   [ ] Outputs are validated before being passed to another agent or
    used by the application.
-   [ ] A single-agent baseline exists for comparison.

### Reliability and observability

-   [ ] Configure appropriate timeouts, retries, and execution limits.
-   [ ] Decide whether partial results are acceptable after one agent
    fails.
-   [ ] Trace the overall workflow and individual agent runs with
    correlation identifiers.
-   [ ] Record agent name, duration, status, and usage/cost metadata.
-   [ ] Avoid logging sensitive prompts or data unnecessarily.

### Security and side effects

-   [ ] Give each agent only the tools and permissions it needs.
-   [ ] Treat user input, retrieved content, and other agent outputs as
    untrusted.
-   [ ] Keep irreversible actions behind application-level authorization
    and, where appropriate, human approval.
-   [ ] Make external writes idempotent and separate them from
    speculative analysis.
-   [ ] Set limits on parallel calls, total cost, and execution
    duration.

## 9. Testing strategy

  -----------------------------------------------------------------------
  Test                                What to verify
  ----------------------------------- -----------------------------------
  Happy path                          Agents run in the intended order or
                                      coordination pattern.

  Role boundaries                     Each agent returns the information
                                      expected from its role.

  Feedback variation                  Positive, negative,
                                      feature-request, and ambiguous
                                      examples are handled appropriately.

  Invalid output                      Malformed or unsupported output is
                                      rejected or safely handled.

  Agent failure                       Timeouts and failures follow the
                                      defined retry or partial-result
                                      policy.

  Concurrent disagreement             Conflicting independent assessments
                                      are surfaced and reconciled.

  Handoff loop                        Repeated transfers terminate within
                                      configured limits.

  Group-chat termination              The manager stops within the
                                      configured number of turns.

  Cost and latency                    Additional agents create measurable
                                      value relative to the baseline.

  Regression                          Model or instruction changes do not
                                      silently degrade representative
                                      cases.
  -----------------------------------------------------------------------

For the Learn exercise, first run the sequential feedback example and
inspect the summary, classification, and recommended action. Then vary
the input to test whether the stages remain useful across different
feedback categories.

## 10. Relationship to Chapter 05: Microsoft Foundry Workflows

Chapter 05 focused on orchestrating agent-driven workflows through
Microsoft Foundry Workflows. This chapter focuses on coordinating
specialized agents through Microsoft Agent Framework patterns.

  -----------------------------------------------------------------------
  Dimension               Foundry Workflows       Agent Framework
                          (Chapter 05)            (Chapter 07)
  ----------------------- ----------------------- -----------------------
  Primary question        What process steps,     How should specialized
                          branches, and           agents execute or
                          transitions must run?   collaborate?

  Common structure        Explicit workflow       Sequential or
                          steps, executors,       concurrent agent teams,
                          conditions, and         handoff, group chat, or
                          routing.                manager-driven
                                                  planning.

  Useful when             Process control and     Agent specialization
                          defined transitions are and the relationship
                          central.                among agents are
                                                  central.
  -----------------------------------------------------------------------

They are complementary rather than mutually exclusive. Deterministic
application or workflow logic can surround agent collaboration where the
solution requires both process control and specialized reasoning.

## 11. Source alignment and limitations

This chapter is based on
**`Orchestrate a multi-agent solution using the Microsoft Agent Framework.txt`**.
The source exercise creates three agents---a summarizer, classifier, and
action recommender---and runs them in a sequential pipeline to process
customer feedback. The broader module explains concurrent, sequential,
handoff, group chat, and Magentic orchestration.

The main code example follows the source's `FoundryChatClient`,
`chat_client.as_agent(...)`, `SequentialBuilder`, `workflow.run(...)`,
and `result.get_outputs()` structure. The transcript also describes
streaming and event-based handling in its broader instructional
material; the hands-on excerpt here follows the exercise's final-output
collection example.

The concurrent feature-review scenario and production checklists are
**architecture guidance added to clarify the trade-offs**; they are not
presented as additional implementations from the source lab. Framework
APIs can change, and the code has not been independently tested against
a pinned SDK release.

------------------------------------------------------------------------

> **Enterprise AI Engineering Handbook**
>
> *Building Production-Grade Enterprise AI Systems — One Chapter at a Time.*
