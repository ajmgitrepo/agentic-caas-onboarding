# Architecture Notes

## Current prototype

```text
React UI
  ↓
Structured intake state
  ↓
Mock planner function
  ↓
Generated plan object
  ↓
UI panels for readiness, risks, steps, and artifacts
```

## Proposed production architecture

```text
Developer UI
  ↓
Onboarding API
  ↓
LLM planning service
  ↓
Schema validation
  ↓
Policy engine
  ↓
Artifact generator
  ↓
Approval workflow
  ↓
Pull request / ticket / execution handoff
```

## Key components

### UI

Captures natural-language intent and structured fields such as app name, owner group, environment, service count, ingress type, database needs, secrets, autoscaling, observability, and compliance notes.

### Planner

The current version uses deterministic mock logic. A production version could use an LLM to produce structured JSON, but the output should be validated before use.

### Schema validation

A real implementation should require generated plans to conform to a strict schema before they can be displayed, exported, or submitted.

### Policy validation

Policy checks should catch issues such as:

- Production deployment without an owner group
- External ingress without DNS details
- Secrets required without a Vault path
- Missing support contact
- Missing observability profile
- Missing application identifier

### Artifact generation

Generated artifacts should remain reviewable. Early versions should generate PR content, not directly execute infrastructure changes.

### Approval gates

High-risk actions should require human approval before execution, especially production changes, DNS, certificates, firewall allowlists, and policy overrides.
