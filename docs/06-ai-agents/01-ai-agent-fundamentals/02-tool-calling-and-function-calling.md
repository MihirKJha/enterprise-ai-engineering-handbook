# Tool Calling and Function Calling

> A comprehensive guide to **Tool Calling** and **Function Calling**, two of the most important capabilities that transform Large Language Models (LLMs) into intelligent AI Agents. This note explains how AI Agents discover, select, invoke, and orchestrate external tools to perform real-world tasks. It also covers tool schemas, execution workflows, enterprise integrations, security considerations, and production best practices.

---

# 1. Overview

Large Language Models (LLMs) have revolutionized natural language understanding and generation. They can answer questions, summarize documents, generate code, and assist with countless language-based tasks.

However, despite these impressive capabilities, standalone LLMs have an important limitation:

> **They can reason about tasks, but they cannot directly perform actions in the real world.**

For example, consider the following user request:

```text
What's the weather in Bangalore today, and send the forecast to my email.
```

A standalone LLM can:

- Explain how weather forecasts work.
- Generate an example weather report.
- Draft an email.

But it **cannot**:

- Retrieve today's live weather.
- Access a weather service.
- Send an email.
- Verify whether the operation succeeded.

To bridge this gap, modern AI systems introduce **Tool Calling** and **Function Calling**.

Instead of relying solely on the model's internal knowledge, an AI Agent can intelligently decide when external capabilities are required, invoke the appropriate tool, receive the result, and continue reasoning before producing a final response.

This transforms an LLM from a text generator into an intelligent system capable of interacting with the outside world.

---

# 2. Why LLMs Need Tools

Although LLMs are excellent at reasoning and language understanding, they operate within several important constraints.

### Limited Knowledge

LLMs only know what they learned during training.

They do not automatically know:

- Today's weather
- Current stock prices
- Recent news
- Enterprise data
- Customer information

Example:

```text
User

↓

What is today's USD to INR exchange rate?
```

The LLM cannot reliably answer unless connected to a live financial service.

---

### No Access to Enterprise Systems

Most business information exists inside:

- CRM systems
- ERP platforms
- HR applications
- Databases
- Internal APIs

A standalone LLM cannot directly access these systems.

Example:

```text
User

↓

Show my pending leave requests.
```

Without a connection to the HR system, the LLM has no way to retrieve this information.

---

### Cannot Perform Actions

LLMs generate responses but do not execute operations.

Examples include:

- Sending emails
- Booking meetings
- Creating tickets
- Updating databases
- Processing payments

These tasks require external applications.

---

### No Mathematical Precision

Although LLMs can often solve arithmetic problems, they may occasionally produce incorrect calculations.

Example:

```text
Calculate

847523 × 98421
```

Instead of relying on probabilistic reasoning, an AI Agent can invoke a calculator tool to obtain an exact result.

---

### No Access to External Files

Without tools, LLMs cannot independently access:

- PDF files
- Excel spreadsheets
- Images
- Word documents
- Enterprise knowledge bases

Specialized tools are required to retrieve and process this information.

---

### Bridging the Gap

Tool Calling extends the capabilities of LLMs.

Instead of:

```text
User

↓

LLM

↓

Answer
```

the workflow becomes:

```text
User

↓

LLM

↓

Tool

↓

Result

↓

LLM

↓

Final Response
```

The combination of reasoning and external execution enables AI Agents to solve real-world problems.

---

# 3. What is Tool Calling?

**Tool Calling** is the mechanism that enables an AI Agent to invoke external capabilities while solving a task.

Rather than generating every answer internally, the LLM determines whether another system is better suited for part of the problem.

A tool may represent:

- REST API
- Database
- Calculator
- Search engine
- Python interpreter
- Vector database
- Email service
- Calendar
- Business application

Example:

User asks:

```text
Schedule a meeting with the engineering team tomorrow at 2 PM.
```

Reasoning:

```text
Scheduling requires access
to a calendar application.
```

The AI Agent selects the calendar tool, invokes it, receives confirmation, and responds:

```text
Meeting successfully scheduled.
```

The complete workflow is:

```text
User Request
      │
      ▼
Large Language Model
      │
      ▼
Determine Required Tool
      │
      ▼
Execute Tool
      │
      ▼
Receive Output
      │
      ▼
Generate Final Response
```

Tool Calling enables AI Agents to interact with the external world instead of only generating text.

---

# 4. What is Function Calling?

Function Calling is a specialized form of Tool Calling in which the Large Language Model generates a structured request to invoke a predefined function within an application.

Unlike free-form text generation, the model produces structured arguments that conform to the function's interface.

Example function:

```text
send_email(
    recipient,
    subject,
    body
)
```

When the user says:

```text
Email today's report to my manager.
```

The LLM generates something conceptually similar to:

```json
{
  "recipient": "manager@company.com",
  "subject": "Today's Report",
  "body": "..."
}
```

The application—not the LLM—executes the function.

Workflow:

```text
User Request

↓

LLM

↓

Function Selection

↓

Generate JSON Arguments

↓

Application Executes Function

↓

Result

↓

LLM Response
```

This structured interaction ensures predictable and reliable communication between AI models and application code.

---

# 5. Tool Calling vs Function Calling

Although the terms are often used interchangeably, they represent different levels of abstraction.

| Tool Calling | Function Calling |
|--------------|------------------|
| Broad concept | Specific implementation |
| Represents any external capability | Calls a predefined software function |
| Can invoke APIs, databases, search engines, Python, or business services | Invokes a local or remote function using structured arguments |
| Often framework-specific | Supported by many LLM providers through structured outputs |
| May involve multiple execution layers | Typically maps directly to application code |

Think of the relationship as:

```text
Tool Calling

├── Function Calling

├── API Calling

├── Database Queries

├── Search

├── Python Execution

└── Enterprise Systems
```

In other words:

> **Every Function Call is a Tool Call, but not every Tool Call is simply a Function Call.**

---

# 6. How Tool Calling Works

The Tool Calling process consists of several coordinated steps.

```text
User Request
      │
      ▼
Understand Intent
      │
      ▼
Reason About Task
      │
      ▼
Select Tool
      │
      ▼
Generate Arguments
      │
      ▼
Execute Tool
      │
      ▼
Receive Result
      │
      ▼
Generate Final Response
```

For example:

User asks:

```text
What is the weather in Delhi?
```

The agent performs:

1. Understand the request.
2. Determine that weather information is required.
3. Select the Weather API.
4. Generate the API request.
5. Execute the request.
6. Receive the forecast.
7. Produce a natural-language response.

The LLM focuses on reasoning, while external systems perform the actual operations.

---

# 7. Tool Discovery

Before an AI Agent can use a tool, it must know which tools are available.

This process is known as **Tool Discovery**.

Developers expose tools by providing:

- Tool name
- Description
- Parameters
- Expected output
- Usage instructions

Example:

```text
Available Tools

Calculator

Weather API

Email Service

SQL Database

Python Interpreter
```

The LLM analyzes these descriptions to determine which tool is most appropriate for a user's request.

Clear, descriptive tool metadata significantly improves tool selection accuracy.

---

# 8. Tool Selection

Once the available tools are known, the AI Agent decides which one should be used.

Example:

```text
User

↓

Calculate annual loan EMI.
```

Possible tools:

```text
Calculator

Python

Weather API

Database
```

The agent selects:

```text
Calculator
```

Selection depends on:

- User intent
- Tool description
- Required parameters
- Expected output
- Previous reasoning

Modern AI Agents may also choose **multiple tools** when solving complex tasks.

---

# 9. Tool Execution Workflow

After selecting a tool, the application executes it.

Execution typically follows this workflow:

```text
User Request
      │
      ▼
LLM
      │
      ▼
Tool Selection
      │
      ▼
Application
      │
      ▼
Execute Tool
      │
      ▼
Tool Output
      │
      ▼
LLM
      │
      ▼
Final Response
```

Notice that the LLM does **not** execute the tool itself.

Instead:

- The LLM decides *what* should happen.
- The application performs the action.
- The result is returned to the LLM for further reasoning.

This separation improves reliability, security, and maintainability.

---

# 10. Tool Input and Output

Every tool receives structured inputs and produces structured outputs.

Example:

```text
Weather Tool

Input

City = Bangalore

↓

Output

Temperature = 28°C

Condition = Sunny
```

Similarly:

```text
Calculator

Input

157 × 489

↓

Output

76773
```

Well-designed tools provide:

- Clear input parameters
- Predictable outputs
- Consistent data formats
- Error information when needed

This consistency enables AI Agents to integrate multiple tools into larger workflows.

---

# 11. Common Types of AI Tools

AI Agents can work with many categories of tools.

### Information Retrieval

- Web Search
- Enterprise Search
- RAG Systems
- Vector Databases

---

### Data Access

- SQL Databases
- NoSQL Databases
- Data Warehouses

---

### Computation

- Calculator
- Python Interpreter
- Statistical Libraries

---

### Communication

- Email
- Messaging Platforms
- Calendar Systems

---

### Enterprise Systems

- CRM
- ERP
- HR Platforms
- Ticketing Systems

---

### AI Services

- Image Generation
- Speech Recognition
- Translation
- OCR

These tools allow AI Agents to extend their capabilities beyond language generation.

---

# 12. Enterprise Use Cases

Tool Calling enables a wide range of enterprise AI applications.

### Customer Support

Retrieve customer information, search knowledge bases, and create support tickets.

---

### Business Analytics

Query databases, generate reports, and create dashboards using natural language.

---

### Software Engineering

Analyze code, execute tests, search repositories, and automate development workflows.

---

### IT Operations

Investigate logs, monitor infrastructure, restart services, and generate incident summaries.

---

### Human Resources

Manage leave requests, retrieve employee policies, schedule interviews, and automate onboarding.

---

### Financial Services

Calculate risk metrics, retrieve market data, generate compliance reports, and automate approval workflows.

---

### Enterprise Knowledge Assistants

Combine **RAG**, **Vector Databases**, **APIs**, and **Tool Calling** to provide grounded, context-aware responses using organizational knowledge.

As enterprise AI systems continue to evolve, Tool Calling has become the essential mechanism that transforms Large Language Models into capable AI Agents, enabling them to reason, interact with external systems, automate business processes, and solve real-world problems with accuracy, efficiency, and reliability.

---

# 13. Tool Schema

Before an AI Agent can use a tool, it must understand:

- What the tool does
- When it should be used
- What inputs it requires
- What output it returns

This information is defined through a **Tool Schema**.

A Tool Schema acts as a contract between the Large Language Model and the application.

It describes the capabilities of a tool in a structured manner so the LLM can make intelligent decisions.

A typical schema includes:

- Tool name
- Description
- Parameters
- Input types
- Output type
- Required fields

Conceptually:

```text
Tool

↓

Name

↓

Description

↓

Parameters

↓

Expected Output
```

Example:

```text
Weather Tool

Name:
get_weather

Description:
Returns the current weather for a city.

Input:
city

Output:
temperature, humidity, condition
```

A well-designed schema enables the LLM to determine whether the tool is appropriate for the user's request.

---

# 14. JSON Inputs and Outputs

Modern AI platforms use **JSON** as the standard format for tool invocation.

Instead of generating plain text, the LLM produces structured arguments.

Example:

User asks:

```text
What's the weather in London?
```

Generated arguments:

```json
{
  "city": "London"
}
```

Application:

```text
Weather API

↓

JSON Input

↓

API Execution

↓

JSON Output
```

Returned result:

```json
{
  "temperature": 24,
  "condition": "Sunny"
}
```

The LLM then transforms this structured response into natural language.

Advantages of JSON:

- Machine-readable
- Consistent
- Easy to validate
- Framework independent
- API friendly

JSON has become the standard communication format between AI models and external systems.

---

# 15. Tool Registration

Before a tool can be used, it must be **registered** with the AI Agent.

Registration makes the tool available to the language model during reasoning.

Conceptually:

```text
Custom Function

↓

Register Tool

↓

Agent

↓

Available During Reasoning
```

Examples of registered tools:

```text
Calculator

Weather API

SQL Database

Python Interpreter

Email Sender

Calendar

CRM Search
```

During execution, the LLM only considers tools that have been registered.

Well-organized tool registration improves:

- Performance
- Accuracy
- Security

---

# 16. Multiple Tool Selection

Real-world problems rarely require only one tool.

AI Agents often combine several tools within a single workflow.

Example:

```text
Find flights to Berlin,
book the cheapest hotel,
and email the itinerary.
```

Required tools:

```text
Flight Search

↓

Hotel Booking

↓

Email Service
```

Workflow:

```text
User Request
       │
       ▼
Reason
       │
       ▼
Tool A
       │
       ▼
Tool B
       │
       ▼
Tool C
       │
       ▼
Final Response
```

Selecting multiple tools enables AI Agents to automate complex business processes.

---

# 17. Tool Chaining

Tool Chaining refers to executing tools sequentially, where the output of one tool becomes the input for the next.

Example:

```text
User

↓

Search Product

↓

Retrieve Product ID

↓

Query Inventory

↓

Calculate Shipping

↓

Send Response
```

Another example:

```text
Search Customer

↓

Retrieve Orders

↓

Generate Summary

↓

Email Customer
```

Benefits include:

- Workflow automation
- Modular design
- Reusability
- Better maintainability

Tool Chaining is one of the core capabilities that distinguish AI Agents from traditional chatbots.

---

# 18. APIs as Tools

Most enterprise AI Agents interact with external systems through **APIs**.

Examples include:

- Weather API
- Maps API
- Banking API
- Payment Gateway
- CRM API
- ERP API
- HR API
- Calendar API

Architecture:

```text
User

↓

LLM

↓

API Tool

↓

External Service

↓

Result

↓

LLM
```

API-based tools allow AI Agents to access live information and perform real-world actions.

Examples:

- Booking appointments
- Creating invoices
- Processing payments
- Sending notifications
- Managing customer records

---

# 19. Database Tools

Enterprise AI Agents frequently need access to organizational data stored in databases.

Examples include:

- Customer information
- Sales reports
- Employee records
- Product catalogs
- Financial transactions

Workflow:

```text
User Question

↓

SQL Tool

↓

Database

↓

Query Result

↓

LLM

↓

Answer
```

Example:

```text
Show total sales for June.
```

Instead of estimating an answer, the AI Agent retrieves the actual value from the database.

Database tools improve:

- Accuracy
- Reliability
- Trustworthiness

---

# 20. Python Execution Tools

Some problems require computation rather than information retrieval.

Python execution tools enable AI Agents to perform tasks such as:

- Mathematical calculations
- Data analysis
- Machine Learning inference
- Visualization
- File processing

Workflow:

```text
User Request

↓

LLM

↓

Python Tool

↓

Python Execution

↓

Result

↓

LLM
```

Examples:

- Calculate financial metrics
- Analyze CSV files
- Generate charts
- Train simple ML models
- Perform statistical analysis

Python tools greatly expand the analytical capabilities of AI Agents.

---

# 21. Error Handling

External tools are not always successful.

Failures may occur because of:

- Invalid inputs
- API outages
- Database failures
- Network interruptions
- Authentication issues
- Rate limits

Example:

```text
User

↓

Weather Tool

↓

API Timeout
```

Instead of failing completely, the AI Agent should:

```text
Retry

↓

Alternative Tool

↓

Graceful Error

↓

User Notification
```

Good error handling improves:

- Reliability
- User experience
- System resilience

Production AI systems always anticipate failures.

---

# 22. Best Practices

Designing reliable Tool Calling systems requires thoughtful engineering.

### Create Focused Tools

Each tool should perform one well-defined task.

---

### Write Clear Descriptions

Tool descriptions should explain:

- Purpose
- Inputs
- Outputs
- Appropriate usage

---

### Validate Inputs

Never assume generated arguments are valid.

Validate:

- Required fields
- Data types
- Ranges
- Formats

---

### Return Structured Outputs

Prefer predictable JSON responses over unstructured text.

---

### Handle Errors Gracefully

Return meaningful error messages rather than exposing internal exceptions.

---

### Limit Tool Access

Only expose the tools required for the current application.

This reduces:

- Security risks
- Incorrect tool selection
- Complexity

---

### Monitor Tool Usage

Track:

- Success rate
- Response time
- Failure rate
- Cost
- Token usage

---

### Secure Enterprise Integrations

Protect enterprise systems through:

- Authentication
- Authorization
- Encryption
- Audit logging
- Role-based access control

Well-designed Tool Calling systems combine clear schemas, structured inputs, reliable execution, robust validation, and secure integrations to enable AI Agents to interact safely and effectively with real-world systems. These practices form the foundation for building scalable, production-ready AI applications and prepare the way for advanced topics such as Tool Orchestration, LangChain Agents, LCEL, and Enterprise AI Agent Architecture.

---

# 23. Common Mistakes

Tool Calling is one of the most powerful capabilities of modern AI Agents, but poor implementation can lead to unreliable, insecure, and expensive applications.

Many production failures are caused by poor tool design rather than limitations of the Large Language Model.

Below are some of the most common mistakes.

---

### Treating Every Task as a Tool Call

Not every user request requires an external tool.

Example:

```text
Explain the concept of Machine Learning.
```

The LLM already possesses the required knowledge.

Invoking a search tool unnecessarily:

- Increases latency
- Increases cost
- Adds unnecessary complexity

**Best Practice**

Only call a tool when external information or action is required.

---

### Poor Tool Descriptions

The LLM decides which tool to use based largely on its description.

Poor description:

```text
Weather Tool
```

Better description:

```text
Returns the current weather conditions
for a given city including
temperature, humidity,
wind speed, and forecast.
```

Clear descriptions improve:

- Tool selection accuracy
- Reasoning quality
- Reliability

---

### Designing Large Monolithic Tools

Avoid building tools that perform many unrelated tasks.

Bad example:

```text
BusinessTool()

• Send Email
• Query Database
• Generate Invoice
• Schedule Meeting
• Weather Lookup
```

Instead:

```text
SendEmail()

QueryCustomer()

CreateInvoice()

ScheduleMeeting()

GetWeather()
```

Smaller tools are:

- Easier to maintain
- Easier for LLMs to understand
- More reusable

---

### Skipping Input Validation

Never trust generated tool arguments without validation.

Example:

```json
{
  "age": -20
}
```

or

```json
{
  "email":"invalid"
}
```

Applications should validate:

- Required fields
- Data types
- Allowed values
- Formats

before executing any tool.

---

### Ignoring Tool Failures

External systems can fail because of:

- Network issues
- Authentication errors
- Timeouts
- Service outages
- Invalid requests

Applications should:

```text
Retry

↓

Fallback

↓

Notify User

↓

Continue Workflow
```

instead of crashing.

---

### Returning Unstructured Outputs

Tools should return predictable outputs.

Poor:

```text
The weather is probably warm.
```

Better:

```json
{
  "temperature":28,
  "humidity":65,
  "condition":"Sunny"
}
```

Structured outputs simplify:

- Parsing
- Validation
- Automation

---

### Giving Agents Unlimited Tool Access

Exposing every enterprise system to an AI Agent increases security risks.

Example:

```text
AI Agent

↓

Entire ERP

Entire CRM

Entire Database
```

Instead, expose only the required tools.

Apply:

- Authentication
- Authorization
- Least privilege access

---

### Ignoring Logging and Monitoring

Production AI systems should monitor:

- Tool calls
- Latency
- Errors
- Token usage
- API costs
- User satisfaction

Without monitoring, diagnosing production issues becomes difficult.

---

# 24. Interview Questions

## Beginner

- What is Tool Calling?
- What is Function Calling?
- Why do LLMs need external tools?
- What is the difference between Tool Calling and Function Calling?
- What is a Tool Schema?
- What types of tools can AI Agents use?

---

## Intermediate

- Explain the Tool Calling workflow.
- How does an AI Agent select the appropriate tool?
- Why is JSON commonly used in Function Calling?
- What is Tool Chaining?
- How do APIs integrate with AI Agents?
- Why is input validation important?

---

## Advanced

- Design an enterprise Tool Calling architecture.
- How would you secure Tool Calling in production?
- How would you handle tool failures?
- How would you monitor Tool Calling performance?
- Compare Tool Calling with traditional API integration.
- How would you optimize Tool Calling latency and cost?

---

# 25. 🚀 Quick Revision Sheet

## Tool Calling Workflow

```text
User Request

↓

Large Language Model

↓

Tool Selection

↓

Tool Execution

↓

Tool Result

↓

Final Response
```

---

## Function Calling

```text
User Request

↓

LLM

↓

Generate JSON Arguments

↓

Application

↓

Function Execution

↓

Result

↓

LLM Response
```

---

## Tool Lifecycle

```text
Discover Tool

↓

Select Tool

↓

Generate Parameters

↓

Execute

↓

Receive Output

↓

Respond
```

---

## Common Tool Types

- Calculator
- Python Interpreter
- Weather API
- Search Engine
- SQL Database
- Vector Database
- Email Service
- Calendar
- CRM
- ERP
- File Processing
- Machine Learning Models

---

## Enterprise Architecture

```text
User

↓

AI Agent

↓

Tool Layer

↓

Business Systems

↓

Enterprise Response
```

---

## Tool Design Principles

- One responsibility per tool
- Clear descriptions
- Structured inputs
- Structured outputs
- Strong validation
- Proper error handling
- Secure execution

---

## Best Practices

- Only call tools when necessary.
- Register only relevant tools.
- Write descriptive tool metadata.
- Validate every generated argument.
- Return structured JSON responses.
- Log every tool invocation.
- Monitor latency and cost.
- Apply authentication and authorization.

---

## Remember

> **Tool Calling enables AI Agents to extend the capabilities of Large Language Models by interacting with external systems such as APIs, databases, Python interpreters, search engines, and enterprise applications. Function Calling is a structured implementation of Tool Calling in which the LLM generates validated arguments that an application executes. Together, these capabilities transform LLMs from passive text generators into intelligent systems capable of reasoning, acting, and automating real-world workflows.**

---

# 26. Key Takeaways

- **Tool Calling** is the mechanism that enables AI Agents to interact with external systems, allowing them to perform actions beyond text generation.
- **Function Calling** is a structured form of Tool Calling where the LLM generates JSON-based arguments for predefined application functions.
- AI Agents use **tool schemas, descriptions, and parameter definitions** to determine when and how to invoke external tools.
- Common enterprise tools include **REST APIs, SQL databases, Python interpreters, vector databases, search engines, CRM systems, ERP platforms, email services, and calendar applications**.
- Production-ready Tool Calling requires **clear tool definitions, structured inputs and outputs, validation, secure execution, robust error handling, and comprehensive monitoring**.
- Advanced workflows often combine **multiple tools through Tool Chaining**, enabling AI Agents to automate complex business processes across several systems.
- Tool Calling forms the operational foundation for **LangChain Agents, LCEL workflows, ReAct agents, and enterprise AI orchestration**, enabling intelligent systems to reason, execute, observe, and adapt in real-world environments.

---

# 27. References

### Course

- IBM RAG & Agentic AI Professional Certificate
- Module: **Fundamentals of Building AI Agents**

### Documentation

- LangChain Tool Calling Documentation
- LangChain Tools Documentation
- OpenAI Function Calling Documentation
- Anthropic Tool Use Documentation
- IBM watsonx.ai Documentation
- Python Documentation

### Hands-on Resources

- **01-AI-Math-Assistant-With-Langchain-Tool-Calling**
- **02-AI-Powered-Data-Analysis-With-LCEL**
- **03-Build-Interactive-LLM-Agents-With-Tools**

---

## Repository Placement

```text
Repository
└── ibm-rag-and-agentic-ai-journey
    └── notes
        └── ai-agents
            ├── 01-ai-agent-fundamentals.md
            ├── 02-tool-calling-and-function-calling.md
            ├── 03-building-and-orchestrating-tools.md
            ├── 04-lcel-and-manual-tool-calling.md
            ├── 05-langchain-built-in-agents.md
            ├── 06-ai-agent-design-best-practices.md
            └── 07-enterprise-ai-agent-architecture.md
```

---

# 🎯 Foundation for Tool-Oriented AI Agents

This note explains the capability that enables AI Agents to move beyond simple conversation and interact with the real world.

The learning progression continues as follows:

1. **AI Agent Fundamentals** — Understand AI Agent architecture, reasoning, and lifecycle.
2. **Tool Calling and Function Calling** *(this note)* — Learn how agents discover, select, and invoke external tools.
3. **Building and Orchestrating Tools** — Create reusable tools and coordinate multi-tool workflows.
4. **LCEL and Manual Tool Calling** — Build modular, composable AI pipelines with LangChain Expression Language.
5. **LangChain Built-in Agents** — Explore DataFrame Agents, SQL Agents, and ready-to-use agent implementations.
6. **AI Agent Design Best Practices** — Apply production engineering principles for secure, reliable, and scalable AI agents.
7. **Enterprise AI Agent Architecture** — Integrate LLMs, tools, memory, RAG, governance, and monitoring into enterprise-grade AI systems.

Together, these notes provide a complete roadmap from understanding how AI Agents use external tools to designing sophisticated, production-ready AI applications capable of automating complex enterprise workflows.

---

# Diagrams to Include

## Tool Calling Workflow

```text
User Request
      │
      ▼
Large Language Model
      │
      ▼
Select Tool
      │
      ▼
Execute Tool
      │
      ▼
Receive Result
      │
      ▼
Generate Final Response
```

---

## Function Calling

```text
User Request
      │
      ▼
LLM
      │
      ▼
Function Selection
      │
      ▼
JSON Arguments
      │
      ▼
Application Code
      │
      ▼
Function Execution
      │
      ▼
Result
      │
      ▼
LLM Response
```

---

## Tool Calling Architecture

```text
                User
                  │
                  ▼
          Large Language Model
                  │
     ┌────────────┼────────────┐
     ▼            ▼            ▼
 Calculator     Database      Search
     │            │            │
     └────────────┼────────────┘
                  ▼
           Tool Results
                  │
                  ▼
           Final Response
```

---

## Enterprise AI Agent

```text
                AI Agent
                    │
     ┌──────────────┼───────────────┐
     ▼              ▼               ▼
 Weather API     CRM System     SQL Database
     ▼              ▼               ▼
 Email API      Calendar API    Vector DB
                    │
                    ▼
             Enterprise Response
```

---

# Repository Placement

```text
notes/

generative-ai/

rag/

ai-agents/
├── 01-ai-agent-fundamentals.md
├── 02-tool-calling-and-function-calling.md
├── 03-building-and-orchestrating-tools.md
├── 04-lcel-and-manual-tool-calling.md
├── 05-langchain-built-in-agents.md
├── 06-ai-agent-design-best-practices.md
└── 07-enterprise-ai-agent-architecture.md

agentic-ai/
```

---

# Relationship with Previous Notes

| Previous Learning | This Note Builds Upon |
|-------------------|-----------------------|
| AI Agent Fundamentals | How agents perform real-world actions |
| Prompt Engineering | Better tool selection through clear prompts |
| LangChain | Tool abstractions and integrations |
| RAG | Vector databases as retrieval tools |
| Python | Executing custom business logic |
| APIs | External system communication |

---

# Purpose of This Note

The previous note introduced **AI Agents** and explained how they differ from standalone Large Language Models.

This note focuses on the capability that makes AI Agents truly useful in real-world applications:

**Tool Calling.**

Instead of only generating text, modern AI Agents can:

- Call external APIs
- Query databases
- Perform mathematical calculations
- Execute Python code
- Search enterprise knowledge
- Send emails
- Schedule meetings
- Interact with business applications

You'll learn how AI Agents decide which tool to use, how functions are described using schemas, how arguments are generated, and how tool outputs are incorporated into the final response.

This knowledge forms the foundation for the next notes covering **Tool Orchestration**, **LCEL**, **LangChain Agents**, and **Enterprise AI Agent Architecture**.

---

# Learning Outcomes

After completing this note, you will be able to:

- Explain the purpose of Tool Calling and Function Calling.
- Differentiate between Tool Calling and Function Calling.
- Understand how AI Agents discover and select tools.
- Design effective tool schemas and function interfaces.
- Integrate APIs, databases, and Python functions into AI workflows.
- Apply best practices for secure, reliable, and production-ready tool execution.
- Build a strong conceptual foundation for advanced topics such as LangChain Toolkits, LCEL, and enterprise AI agent orchestration.

---