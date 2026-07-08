# CaaS Onboarding Agent

A front-end prototype for an agentic Container-as-a-Service onboarding assistant.

The concept: a developer describes the application they want to onboard, and the assistant turns that request into a structured infrastructure onboarding package: interpreted requirements, missing inputs, guardrail warnings, Kubernetes YAML, Terraform placeholders, Jira-ready stories, and an approval checklist.

This is intentionally a **front-end and mock-planner prototype**. It does not connect to a real Kubernetes cluster, Terraform backend, Jira instance, DNS service, or production approval workflow.

## Why this exists

Platform teams often need to collect the same onboarding information repeatedly before an application can be deployed safely: app ownership, environment, service count, ingress pattern, DNS, secrets, scaling, observability, compliance needs, and approval requirements.

This prototype demonstrates how a governed AI-assisted workflow could reduce onboarding friction while keeping infrastructure changes reviewable and controlled.

## Product Walkthrough

### The User Problem

Deploying applications to Kubernetes requires extensive platform knowledge: selecting the right ingress model, choosing database types, configuring secrets management, setting up observability, accounting for compliance constraints, and more. Developers must fill out lengthy forms, track down multiple stakeholders, and wait days or weeks for approval. Platform teams repeat the same intake process for every request, with no standardization.

Result: **Long onboarding cycles, repeated questions, and inconsistent platform adoption.**

### Target Personas

| Persona | Problem | Goal |
|---------|---------|------|
| **Developer** | Wants to deploy a microservice but doesn't know the right infrastructure pattern. Complex forms and approval workflows slow down delivery. | Ship quickly with confidence that the platform will support the application safely. |
| **Platform Engineer** | Manually reviews dozens of onboarding requests, asks the same questions repeatedly, and can't enforce consistency or catch risky patterns early. | Automate intake validation, detect risks automatically, and generate approved artifacts ready for deployment. |
| **Approver / Security Lead** | Doesn't have time to review verbose onboarding packages. Needs a quick summary of requirements, risks, and artifacts before approving. | See a structured, pre-validated summary with clear risk indicators and next steps. |

### User Workflow

**Step 1: Start with Natural Language**
- Developer describes their application in plain English: "I need to onboard a payments API with 8 services, external ingress, Postgres, and secrets."
- Or: Click a sample scenario to quickly populate the form (Payments API, Batch Processor, Customer API, Production App).

**Step 2: Refine with Structured Intake**
- Auto-populated form fields include app name, owner group, environment, service count, database choice, compliance notes, and more.
- Developer can edit any field; the plan regenerates in real-time.

**Step 3: Review Readiness Assessment**
- **Readiness Score** (0-100%) shows structural completeness.
- **Risk Level** (Low/Medium/High) indicates governance concerns.
- **Missing Inputs** highlights required fields.
- **Guardrails** show policy violations that need attention (e.g., "Prod external ingress requires DNS readiness").

**Step 4: Interpret Requirements & Plan**
- See what the system understood: 7-8 plain-English statements of intent.
- Review recommended onboarding steps: 10-step checklist for platform engineers.
- Understand compliance checks and next actions.

**Step 5: Review Generated Artifacts**
- **Kubernetes YAML** — Ready-to-review Deployment, Service, and optional HPA.
- **Terraform Variables** — All infrastructure parameters in one place.
- **Jira Stories** — 5 pre-written user stories for the epic (validation, artifact generation, dependencies, policy checks, approval).

**Step 6: Download & Approve**
- Export the complete onboarding package as Markdown (includes all requirements, risks, steps, and artifacts).
- Share with approvers for governance review.
- Ready for execution only after approval gates.

### What This Prototype Demonstrates

| Capability | How It Works |
|-----------|-------------|
| **Natural-Language Understanding** | Free-form prompt + structured form fields work together. Developers can describe messy requirements; the system extracts structured data. |
| **Real-Time Validation** | Missing fields and guardrails are computed instantly as users edit the form. No waiting, no hidden surprises. |
| **Risk Assessment** | Readiness score and risk level dynamically adjust based on completeness and policy violations. |
| **Policy Enforcement** | Guardrails catch risky patterns (e.g., prod external ingress without DNS, manual secrets handling, large service counts). |
| **Artifact Generation** | From a single intake form, generate Kubernetes YAML, Terraform configs, and Jira stories—all coherent and ready to review. |
| **Approval-Ready Summary** | Dashboard layout prioritizes what matters: score, risks, required actions, next steps. Exportable as Markdown for offline review. |
| **Sample Scenarios** | Quick-start buttons demonstrate common patterns (payments API, batch processor, customer API, production secured app). |
| **Enterprise UI** | Professional dashboard-style interface with status badges, progress indicators, and clear visual hierarchy. |

### How It Reduces Onboarding Friction

✅ **For Developers**: No more guessing or filling out vague forms. Use natural language or pick a sample that matches your use case. Instant feedback on what's missing.

✅ **For Platform Teams**: Automate intake validation, guardrail checks, and artifact generation. No more repetitive manual work. Focus on actual infrastructure decisions.

✅ **For Approvers**: Get a pre-structured summary with risk levels, missing fields, and pre-generated artifacts. One-page overview instead of hunting through emails.

✅ **For Governance**: Every onboarding request follows the same workflow. Risks are surfaced early. Artifacts are consistent. Approval gates are non-negotiable.

## Demo flow

1. Enter a natural-language onboarding request.
2. Refine structured platform intake fields.
3. Generate a mock onboarding plan.
4. Review readiness score, missing inputs, risks, and guardrails.
5. Preview generated Kubernetes YAML, Terraform variables, and Jira stories.

## Prototype capabilities

- Natural-language onboarding prompt
- Structured developer intake form
- Mock agent planner
- Readiness score
- Risk level assessment
- Missing input detection
- Guardrail warnings
- Onboarding step generation
- Kubernetes YAML preview
- Terraform placeholder preview
- Jira story preview
- Enterprise SaaS-style UI

## Tech stack

- React
- TypeScript
- Vite
- CSS
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal.

## Build

```bash
npm run build
```

## Repository structure

```text
caas-onboarding-agent/
├── docs/
│   ├── architecture.md
│   ├── product-brief.md
│   ├── roadmap.md
│   └── sample-prompts.md
├── src/
│   ├── main.tsx
│   ├── mockPlanner.ts
│   ├── styles.css
│   ├── types.ts
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

## Product framing

This prototype is best positioned as an internal platform product concept:

> A governed CaaS onboarding planner that converts natural-language app onboarding requests into structured infrastructure requirements, generated deployment artifacts, policy warnings, and approval-ready work items.

## What makes it agentic

The current prototype uses mock logic, but the intended product pattern is agentic because the future system would:

- Interpret developer intent
- Identify missing requirements
- Generate an onboarding plan
- Apply platform guardrails
- Produce reviewable artifacts
- Route work through approval gates
- Stop before high-risk actions
- Hand off execution through controlled workflows

## Current limitations

This version does not:

- Call a real LLM
- Create Kubernetes resources
- Run Terraform
- Open pull requests
- Create Jira tickets
- Modify DNS, ingress, firewall, or certificate settings
- Perform production changes

## Suggested next iteration

Replace the mock planner with a backend API that returns validated JSON using a strict schema. From there, add policy validation, export actions, PR creation, and integration with enterprise approval workflows.
