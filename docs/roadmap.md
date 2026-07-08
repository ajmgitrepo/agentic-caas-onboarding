# Roadmap

## Phase 1: Front-end prototype

- Build developer intake experience
- Generate mock onboarding plan
- Display readiness score and risk level
- Preview Kubernetes YAML, Terraform placeholders, and Jira stories

## Phase 2: Structured backend

- Add API route for planning
- Define onboarding request and plan schemas
- Validate all generated output
- Add export buttons for generated artifacts

## Phase 3: AI-assisted planning

- Replace mock planner with LLM-backed planning
- Add prompt templates and system guardrails
- Return structured JSON only
- Add missing-question generation

## Phase 4: Governance and policy

- Add policy validation engine
- Add approval matrix by environment and risk level
- Add audit trail
- Add role-based access patterns

## Phase 5: Enterprise workflow integration

- Create pull requests instead of direct execution
- Create Jira or ServiceNow work items
- Integrate with GitOps workflows
- Integrate with Vault, observability, and deployment systems

## Phase 6: Controlled execution

- Submit approved changes to CI/CD
- Validate deployment health
- Produce handoff summary
- Capture post-deployment telemetry
