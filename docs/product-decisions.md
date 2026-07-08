# Product Decisions: Why Artifacts, Not Execution

**Document:** Product Design Rationale  
**Date:** 2026-07-08  
**Decision:** The MVP generates reviewable artifacts (YAML, Terraform, Jira) instead of directly provisioning infrastructure.

---

## The Decision

**The CaaS Onboarding Agent does not execute infrastructure changes. It generates reviewable, approval-ready artifacts.**

The system produces:
- Kubernetes YAML (Deployment, Service, HPA)
- Terraform variable templates
- Jira story tickets

But it does not:
- Call Kubernetes APIs
- Create resources in production
- Trigger actual Terraform deployments
- Provision databases or networking

---

## Why This Design?

### 1. **Governance & Approval Gates** (Enterprise Critical)

**The Core Principle:** No infrastructure change should happen without explicit human approval.

In enterprise environments, deploying to production requires:
- Security review
- Compliance validation
- Budget approval
- Operational readiness checks
- Disaster recovery sign-off

An agentic system that provisions directly violates this principle. Even with high confidence, the system could:
- Misinterpret requirements
- Apply rules incorrectly
- Create cascading failures across dependent systems
- Breach compliance (SOC2, HIPAA, PCI-DSS)

**The Artifact Approach:** Artifacts are a stopping point. Humans review, edit, and approve before anything is deployed. This maintains governance while automating the tedious parts (intake, validation, baseline generation).

### 2. **Audit Trail & Accountability**

**The Problem:** If the system provisions directly, who is accountable when something goes wrong?

Was it:
- A bug in the system logic?
- A misinterpretation of the intake?
- A misaligned policy rule?
- A user error?

**The Solution:** Artifacts create a clear audit trail:
1. Developer submits intake
2. System generates plan + artifacts
3. Platform engineer reviews YAML
4. Security team reviews policies
5. Approver sign-off
6. **Artifact is committed to git**
7. Terraform/kubectl deploys from version-controlled source

Every step is logged, reviewable, and attributable. This is non-negotiable in regulated industries.

### 3. **Reversibility & Undo**

**Direct execution is hard to undo.** If the system deployed a broken Kubernetes manifest, rollback requires:
- Immediate incident response
- Investigation
- Manual cleanup
- Postmortem

**Artifacts are easy to undo.** If the generated YAML is wrong:
- Platform engineer edits the YAML before deployment
- Change is logged in git
- CI/CD tests the updated artifact
- Safe deployment happens with modifications

The cost of a mistake is dramatically lower.

### 4. **Customization & Flexibility**

**Generated artifacts are not gospel.** They're starting points.

Platform engineers regularly need to:
- Add custom labels or annotations
- Integrate with platform-specific tooling (service mesh, monitoring, policy engines)
- Apply non-standard database configurations
- Implement org-specific security constraints

**Direct execution prevents this.** Artifacts enable it. Engineers can:
- Review the generated YAML
- Edit and enhance it
- Add platform-specific integrations
- Maintain consistency across their fleet

This is crucial for mature platforms with nuanced requirements.

### 5. **System Evolution & Refinement**

**Policy changes happen frequently.**

Example: "All production workloads must have Redis cache sidecars." The platform team discovers this requirement after the MVP is deployed.

- **Direct execution:** Must update system logic, redeploy, and re-run onboarding for all existing apps.
- **Artifacts approach:** Policy is encoded in code review. Applied to all new onboarding requests. Existing artifacts get reviewed in a batch process.

Artifacts decouple the system from the infrastructure deployment timeline, enabling rapid policy refinement.

### 6. **Heterogeneous Infrastructure**

**Real platforms aren't homogeneous.**

Some teams use:
- Custom Helm charts
- ArgoCD for GitOps
- Kyverno for policy enforcement
- Istio service meshes
- Custom admission controllers

**Direct execution requires:** The system understand all these patterns. Impossible.

**Artifacts require:** The system generate a reasonable baseline that humans can customize. Much more feasible.

---

## What This Means for Users

### For Developers
"I don't have to guess anymore. I submit my intake, see the plan, and review the generated YAML before it goes to approvers. If I see something wrong, I can flag it now instead of discovering it in production."

### For Platform Engineers
"I get a baseline from the system, but I maintain control. I can edit the YAML to add custom networking, monitoring sidecars, or platform-specific integrations. The system saves me from writing boilerplate, but doesn't constrain my flexibility."

### For Approvers
"I get an approval-ready package: intake summary, readiness score, guardrails, and the actual artifacts that will be deployed. No surprises, no executor I don't understand, clear risk assessment."

### For Compliance & Security
"Every change is version-controlled, reviewed, and logged. We have a complete audit trail. We can enforce approval gates, segregate duties, and maintain compliance."

---

## The Approval Workflow

The intended workflow is:

```
1. Developer submits intake
         ↓
2. System generates plan + artifacts
         ↓
3. Developer reviews & comments
         ↓
4. Platform engineer reviews & edits artifacts
         ↓
5. Security/compliance reviews
         ↓
6. Approval gate (Slack, email, governance tool)
         ↓
7. Artifacts merged to version control
         ↓
8. CI/CD deploys via kubectl/terraform
         ↓
9. Monitoring & feedback loop
```

**Each step is a stopping point.** Progress requires explicit approval.

---

## Future Evolution: From Artifacts to (Semi-)Automation

Over time, the system could evolve toward more automation while maintaining governance:

### **Phase 1 (Today):** Review & Manual Deploy
- System generates artifacts
- Humans review
- Humans approve
- Manual deployment (or GitOps push)

### **Phase 2:** Conditional Auto-Deployment
- Guardrails + risk score gates execution
- Low-risk, low-change deployments auto-approve
- High-risk or breaking changes require manual sign-off
- Example: "If readiness score >= 85% AND no guardrails, auto-approve to non-prod"

### **Phase 3:** Predictive Rollback
- System monitors deployed applications
- If metrics diverge from baseline, system can suggest/trigger rollback
- Adds observability loop

### **Phase 4:** Full Agentic Loop (Far Future)
- System understands org policies deeply
- Can make nuanced decisions about trade-offs
- Provisions directly with multi-stage safety gates
- Requires significantly more trust & maturity

**The artifact-based approach is the safe, defensible path to Phase 2-3.** It doesn't lock the system into a review-only posture forever, but it prevents jumping straight to risky automation.

---

## Competitive Implications

Most "agentic infrastructure" systems today either:

1. **Provision directly** (risky, enterprise-hostile, audit nightmare)
2. **Generate code in pull requests** (better, but still no approval gates)

**This design goes further:** It produces approval-ready artifacts + enforces governance. This is a differentiated approach that's more likely to be adopted in regulated industries where most IT spend lives.

---

## When Artifacts-Only Is Insufficient

This design works best for:
- ✅ Kubernetes deployments (well-understood, declarative)
- ✅ Terraform state management (clear approval workflows)
- ✅ Regulated industries (compliance-heavy)
- ✅ Mature platforms (complex, customized)

It might be insufficient for:
- ❌ Rapid experimentation in startups (where speed > governance)
- ❌ Single-person infrastructure (where approval = self-approval)
- ❌ Systems requiring real-time adaptation (where latency matters)

But the prototype is positioned for enterprise adoption, where governance is the default.

---

## Open Questions for Product Iteration

1. **Can we pre-approve certain patterns?** E.g., "All non-prod apps with low risk auto-approve to a staging cluster for testing."

2. **Should the system suggest edits?** E.g., "I notice you didn't configure a resource quota. Would you like me to add one?"

3. **Can we detect conflicting policies?** E.g., "Your compliance notes mention GDPR, but you chose a database without encryption at rest. Guardrail?"

4. **Should approval workflows be pluggable?** E.g., different teams use Slack vs. email vs. custom systems.

5. **How do we handle emergency deployments?** In a crisis, can we expedite approval? Are there fast-track paths?

These are product decisions for Phase 2+, after the MVP validates the core workflow.

---

## Summary: Why Artifacts, Not Execution

| Dimension | Artifacts-Based | Direct Execution |
|-----------|-----------------|------------------|
| **Governance** | Maintains approval gates ✅ | Bypasses governance ❌ |
| **Audit Trail** | Complete, version-controlled ✅ | Implicit, hard to trace ❌ |
| **Reversibility** | Easy to undo ✅ | Hard to rollback ❌ |
| **Customization** | Engineers can edit ✅ | Takes what it gives ❌ |
| **Flexibility** | Supports heterogeneous platforms ✅ | Requires system to know everything ❌ |
| **Compliance** | Enterprise-friendly ✅ | Risky in regulated industries ❌ |
| **Speed** | Slower (requires approval) ❌ | Faster (immediate) ✅ |
| **Trust Required** | Lower (humans in loop) ✅ | Higher (system alone) ❌ |

**For an MVP entering enterprise markets: artifacts win.**

The trade-off is acceptance: slower deployments for stronger governance. As the system proves itself over time, approval gates can relax for predictable, low-risk scenarios. But starting with maximum governance is the right default.
