# CaaS Onboarding Agent — 3-Minute Demo Script

**Audience:** Hiring managers, product leaders, and engineering directors  
**Goal:** Demonstrate the prototype as a product management example of agentic platform engineering  
**Duration:** 3 minutes

---

## Opening: The Problem (30 seconds)

**Speak to:** "Imagine you're a developer with a great microservice idea. But getting it deployed takes weeks because you don't know how to configure Kubernetes, choose the right database, set up secrets, and navigate approval workflows. Meanwhile, the platform team is answering the same questions over and over, with no automation."

**Point:** "This prototype solves that problem using agentic design—automating intake, validation, risk assessment, and artifact generation in a single tool."

---

## Demo: The Workflow (90 seconds)

### Section 1: Natural Language Intake (20 seconds)

**Narrate:** "Start with the prototype homepage. Notice the hero section with a readiness score, risk level, and service count—the key metrics a stakeholder cares about."

**Scroll down.** "On the left, we have the developer intake form. Instead of a blank form, we offer sample scenarios..."

**Click:** One of the sample buttons—e.g., **"Payments API (8 services)"**.

**Narrate:** "In one click, the form populates with a realistic scenario: 8 services, external ingress, Postgres database, secrets, autoscaling, compliance notes. The developer can edit any field. No API calls, no waiting—real-time feedback."

### Section 2: Readiness Assessment (30 seconds)

**Scroll right to the results dashboard.** "This is where the magic happens. The system reads the form and instantly generates a **Readiness Assessment** at the top."

**Point to the dashboard header:**
- **Readiness score** (let's say 85%) with a visual gauge
- **Risk level** badge (Low/Medium/High)
- **Status indicators** for compliance and required fields

**Narrate:** "The score is dynamic—it drops if required fields are missing or if we hit a guardrail. Below that, we have four key panels:

1. **Interpreted Requirements**—what the system understood from the intake.
2. **Missing Inputs**—if any required fields are blank.
3. **Guardrails & Compliance**—policy checks. For example, 'Production external ingress requires DNS readiness.' This is where the agentic logic catches risky patterns before they become problems.
4. **Onboarding Steps**—a 10-step checklist for the platform team."

### Section 3: Next-Best Actions (20 seconds)

**Scroll down slightly.** "Notice the **Next-Best Actions** section. This tells the developer exactly what to do next:

1. Complete required fields (if any).
2. Review guardrails with the platform team.
3. Examine the generated artifacts.
4. Submit for approval.

It's context-aware—if there are no missing fields, step 1 doesn't appear. If there are no guardrails, step 2 is skipped."

**Point:** "This is product thinking: not just showing information, but guiding the user through the right workflow."

### Section 4: Generated Artifacts (15 seconds)

**Scroll down to the artifact section.** "The system generates three types of artifacts from a single intake form:

- **Kubernetes YAML** — Deployment, Service, and optional HPA if autoscaling is requested.
- **Terraform Variables** — All infrastructure parameters, ready to pass to IaC.
- **Jira Stories** — Five pre-written user stories for the onboarding epic: validation, artifact generation, dependencies, policy checks, approval.

**Click** one of the tabs to show the YAML or Terraform output."

**Narrate:** "Notice these are consistent, coherent, and ready for code review—no manual editing required."

### Section 5: Export & Approval (5 seconds)

**Point to the Download button.** "The developer can export the entire package as Markdown—requirements, risks, steps, and all artifacts. This becomes the approval-ready document that goes to the governance team."

---

## Closing: The Vision (30 seconds)

**Transition:** "So what makes this 'agentic' platform engineering?"

**Three key points:**

1. **Interpretation** — The system understands developer intent from natural language + structured form fields.

2. **Automation** — Intake validation, guardrail enforcement, artifact generation, and workflow routing all happen without manual intervention.

3. **Governance** — Every step is reviewable. Nothing executes without approval. Risks are surfaced early.

**Final statement:** "The prototype is mock logic, but the product pattern is real. A fully agentic version would integrate with actual Kubernetes, Terraform, Jira, and approval systems. This is the future of platform engineering: reducing friction, enforcing governance, and enabling developer velocity at scale."

**Close:** "Questions?"

---

## Talking Points for Q&A

### "How is this different from other onboarding tools?"

Most onboarding tools are forms with minimal logic. This one adds agentic reasoning: it interprets intent, validates against policy, detects risky patterns, and generates artifacts—all in one cohesive workflow. The key innovation is the **interpretation layer** (understanding what the developer really needs) and the **guardrail engine** (catching risky patterns before they become problems).

### "Is this production-ready?"

No. This is a product management prototype. It demonstrates the user experience and workflow, not the backend. A real implementation would need:
- Integration with Kubernetes APIs for actual cluster info
- Real Jira API calls to create tickets
- Terraform backend connectivity
- Approval workflow engine (e.g., Slack, email, or custom gates)
- Database to track requests and history

### "How does the guardrail logic work?"

It's rule-based (deterministic). For example:
- "Production + external ingress + no DNS = guardrail"
- "Manual secrets + secrets required = guardrail"
- "Service count > 20 = guardrail"

A real agentic version could use LLMs to detect more nuanced risks, but the prototype uses explicit rules for clarity and control.

### "What's the expected impact?"

**For developers:** 10x faster onboarding, self-service intake, instant feedback.

**For platform teams:** 50% reduction in intake-related toil, consistent validation, better risk detection.

**For approvers:** Single-page summary instead of reviewing email threads.

### "How does this fit into a larger platform strategy?"

This is one piece of a larger "governed agentic platform" vision:
1. **Intake & Planning** (this prototype)
2. **Policy Enforcement** (guardrails, checks)
3. **Artifact Generation** (YAML, Terraform, IaC)
4. **Approval Workflows** (governance gates)
5. **Execution & Monitoring** (deploy, observe, feedback loop)

Future phases could add:
- Multi-phase approval workflows
- Integration with existing infrastructure
- Historical analytics and cost tracking
- Self-healing and auto-remediation

---

## Demo Environment Setup

Before demo:
1. Open the app at `http://localhost:5173` (or deployed URL)
2. Start with the default "payments-api" scenario loaded
3. Have the README open in a browser tab for reference
4. Practice clicking between tabs and scrolling smoothly

Quick checks:
- ✅ Form loads without errors
- ✅ Sample buttons populate form instantly
- ✅ Generate button updates the plan
- ✅ Readiness score changes when you edit fields
- ✅ Download button works and saves the Markdown file
- ✅ Artifact tabs switch between YAML, Terraform, Jira

---

## Timing Breakdown

| Section | Time |
|---------|------|
| Opening: Problem & Value | 0:30 |
| Sample Scenario Load | 0:20 |
| Readiness Dashboard | 0:30 |
| Next-Best Actions | 0:20 |
| Generated Artifacts | 0:15 |
| Export & Approval | 0:05 |
| Vision & Closing | 0:30 |
| **Total** | **3:00** |

(Adjust based on Q&A depth and audience interest.)

---

## For Hiring Managers: Why This Matters

This prototype demonstrates:

1. **Product Thinking** — Not just building a form, but designing a workflow that reduces friction and guides users through the right steps.

2. **Systems Design** — Coordinating multiple concerns (intake, validation, generation, approval) into a coherent experience.

3. **User Empathy** — Understanding the pain points of three personas (developer, platform engineer, approver) and designing for all of them.

4. **Agentic Reasoning** — Using rule-based logic (and potentially LLMs) to automate decisions that would normally require human review.

5. **Enterprise Sensibility** — Governance, approval gates, risk assessment, and audit trails are built in—not afterthoughts.

**Hiring Signal:** A candidate who can build this shows they understand product strategy, backend systems, user experience design, and enterprise constraints. They're thinking like a platform PM, not just an engineer.
