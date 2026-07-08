# CaaS Onboarding Agent

A front-end prototype for an agentic Container-as-a-Service onboarding assistant.

The concept: a developer describes the application they want to onboard, and the assistant turns that request into a structured infrastructure onboarding package: interpreted requirements, missing inputs, guardrail warnings, Kubernetes YAML, Terraform placeholders, Jira-ready stories, and an approval checklist.

This is intentionally a **front-end and mock-planner prototype**. It does not connect to a real Kubernetes cluster, Terraform backend, Jira instance, DNS service, or production approval workflow.

## Why this exists

Platform teams often need to collect the same onboarding information repeatedly before an application can be deployed safely: app ownership, environment, service count, ingress pattern, DNS, secrets, scaling, observability, compliance needs, and approval requirements.

This prototype demonstrates how a governed AI-assisted workflow could reduce onboarding friction while keeping infrastructure changes reviewable and controlled.

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
