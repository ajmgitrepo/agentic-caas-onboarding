import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle2, ClipboardList, Code2, Download, FileText, GitPullRequest, Gauge, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { generatePlan } from './mockPlanner';
import type { GeneratedPlan, IntakeState } from './types';
import './styles.css';

const defaultIntake: IntakeState = {
  naturalLanguagePrompt: 'I need to onboard a payments API with 8 services in non-prod. It needs external ingress, Postgres, secrets, autoscaling, monitoring, and promotion readiness for prod.',
  appName: 'payments-api',
  ownerGroup: 'payments-platform-team',
  applicationId: 'CAMR-12345',
  environment: 'non-prod',
  serviceCount: 8,
  ingressType: 'external',
  dnsHostname: 'payments-api.npe.example.com',
  databaseNeed: 'postgres',
  secretsRequired: true,
  autoscalingRequired: true,
  observabilityRequired: true,
  complianceNotes: 'PCI-aware workload. Secrets must route through Vault.',
  expectedTraffic: 'Medium traffic, bursty during business hours',
  containerRegistry: 'registry.example.com/payments-api:1.0.0'
};

const sampleScenarios = {
  paymentsApi: {
    naturalLanguagePrompt: 'Onboard payments API with 8 microservices. Needs external ingress for customers, Postgres database, encrypted secrets via Vault, and auto-scaling for variable load.',
    appName: 'payments-api',
    ownerGroup: 'payments-platform-team',
    applicationId: 'CAMR-12345',
    environment: 'non-prod' as const,
    serviceCount: 8,
    ingressType: 'external' as const,
    dnsHostname: 'payments-api.npe.example.com',
    databaseNeed: 'postgres' as const,
    secretsRequired: true,
    autoscalingRequired: true,
    observabilityRequired: true,
    complianceNotes: 'PCI-aware workload. Secrets must route through Vault.',
    expectedTraffic: 'Medium traffic, bursty during business hours',
    containerRegistry: 'registry.example.com/payments-api:1.0.0'
  } as IntakeState,
  batchProcessing: {
    naturalLanguagePrompt: 'Deploy internal batch processing service. Internal traffic only, lightweight observability. Runs on fixed schedule, no autoscaling needed.',
    appName: 'batch-processor',
    ownerGroup: 'data-engineering-team',
    applicationId: 'CAMR-67890',
    environment: 'non-prod' as const,
    serviceCount: 3,
    ingressType: 'none' as const,
    dnsHostname: '',
    databaseNeed: 'none' as const,
    secretsRequired: false,
    autoscalingRequired: false,
    observabilityRequired: false,
    complianceNotes: 'Internal use only. No sensitive data.',
    expectedTraffic: 'Scheduled batch runs, low concurrent load',
    containerRegistry: 'registry.example.com/batch-processor:2.1.0'
  } as IntakeState,
  customerApi: {
    naturalLanguagePrompt: 'Public customer-facing API with 5 services. External ingress for partners, needs MongoDB, internal secrets, autoscaling for unpredictable demand, full observability for SLA tracking.',
    appName: 'customer-api',
    ownerGroup: 'integration-services-team',
    applicationId: 'CAMR-45678',
    environment: 'prod' as const,
    serviceCount: 5,
    ingressType: 'external' as const,
    dnsHostname: 'api.customers.example.com',
    databaseNeed: 'mongodb' as const,
    secretsRequired: true,
    autoscalingRequired: true,
    observabilityRequired: true,
    complianceNotes: 'GDPR compliant. Customer data requires encryption at rest and in transit.',
    expectedTraffic: 'High variable load, 24/7 availability required',
    containerRegistry: 'registry.example.com/customer-api:3.0.0'
  } as IntakeState,
  prodSecured: {
    naturalLanguagePrompt: 'Production app with 12 services. Requires external ingress, Postgres with backup strategy, Vault secrets management, aggressive autoscaling, comprehensive monitoring.',
    appName: 'core-platform',
    ownerGroup: 'platform-core-team',
    applicationId: 'CAMR-11111',
    environment: 'prod' as const,
    serviceCount: 12,
    ingressType: 'external' as const,
    dnsHostname: 'platform.example.com',
    databaseNeed: 'postgres' as const,
    secretsRequired: true,
    autoscalingRequired: true,
    observabilityRequired: true,
    complianceNotes: 'Production critical. SOC2 compliant. Daily backups, disaster recovery plan required.',
    expectedTraffic: 'High sustained load with peak spikes. Multi-region failover capability needed.',
    containerRegistry: 'registry.example.com/core-platform:5.2.1'
  } as IntakeState
};

function generateMarkdownExport(intake: IntakeState, plan: GeneratedPlan): string {
  const timestamp = new Date().toISOString().split('T')[0];
  
  return `# CaaS Onboarding Package

**Application:** ${intake.appName}  
**Owner Group:** ${intake.ownerGroup}  
**Application ID:** ${intake.applicationId}  
**Environment:** ${intake.environment.toUpperCase()}  
**Generated:** ${timestamp}  
**Readiness Score:** ${plan.readinessScore}%  
**Risk Level:** ${plan.riskLevel.toUpperCase()}

---

## Executive Summary

This document contains the complete onboarding plan for **${intake.appName}** including intake validation, infrastructure requirements, identified risks, and approval-ready artifacts.

**Status:** ${plan.missingInputs.length === 0 && plan.guardrails.length === 0 ? '✅ Ready for Approval' : plan.missingInputs.length > 0 ? '⚠️ Incomplete - Missing Fields' : '⚠️ Review Required - Guardrails Present'}

---

## Interpreted Requirements

${plan.interpretedRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

---

## Intake Details

| Field | Value |
|-------|-------|
| **Application Name** | ${intake.appName} |
| **Owner Group** | ${intake.ownerGroup} |
| **Application ID** | ${intake.applicationId} |
| **Environment** | ${intake.environment} |
| **Service Count** | ${intake.serviceCount} |
| **Ingress Type** | ${intake.ingressType} |
| **DNS Hostname** | ${intake.dnsHostname || 'N/A'} |
| **Database Need** | ${intake.databaseNeed} |
| **Secrets Required** | ${intake.secretsRequired ? 'Yes' : 'No'} |
| **Autoscaling Required** | ${intake.autoscalingRequired ? 'Yes' : 'No'} |
| **Observability Required** | ${intake.observabilityRequired ? 'Yes' : 'No'} |
| **Container Registry** | ${intake.containerRegistry} |
| **Expected Traffic** | ${intake.expectedTraffic} |
| **Compliance Notes** | ${intake.complianceNotes} |

---

## Readiness Assessment

**Overall Readiness Score:** ${plan.readinessScore}%

**Risk Level:** ${plan.riskLevel.toUpperCase()}

${plan.readinessScore >= 80 ? '✅ This onboarding request is ready for governance review and approval.' : '⚠️ This request requires attention before approval. See sections below.'}

---

## Missing Inputs

${plan.missingInputs.length > 0 
  ? plan.missingInputs.map((item, i) => `${i + 1}. ${item}`).join('\n')
  : '✅ All required intake fields have been provided.'}

---

## Guardrails & Compliance Checks

${plan.guardrails.length > 0 
  ? plan.guardrails.map((item, i) => `${i + 1}. **⚠️ ${item}**`).join('\n\n')
  : '✅ No blocking guardrails detected.'}

---

## Onboarding Implementation Steps

${plan.onboardingSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

## Generated Artifacts

### Kubernetes YAML

\`\`\`yaml
${plan.yaml}
\`\`\`

### Terraform Variables

\`\`\`hcl
${plan.terraform}
\`\`\`

### Jira Stories

\`\`\`
${plan.jiraStories}
\`\`\`

---

## Approval Checklist

- [ ] All required intake fields completed
- [ ] All guardrails reviewed and resolved
- [ ] Infrastructure artifacts reviewed and approved
- [ ] Jira stories created and linked
- [ ] Compliance and security sign-off obtained
- [ ] Ready to proceed with onboarding

---

*This package was generated by the CaaS Onboarding Agent.*`;
}

function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function App() {
  const [intake, setIntake] = useState<IntakeState>(defaultIntake);
  const [plan, setPlan] = useState<GeneratedPlan>(() => generatePlan(defaultIntake));
  const [activePreview, setActivePreview] = useState<'yaml' | 'terraform' | 'jira'>('yaml');

  const preview = useMemo(() => {
    if (activePreview === 'terraform') return plan.terraform;
    if (activePreview === 'jira') return plan.jiraStories;
    return plan.yaml;
  }, [activePreview, plan]);

  const update = <K extends keyof IntakeState>(key: K, value: IntakeState[K]) => {
    setIntake((current) => ({ ...current, [key]: value }));
  };

  const handleGenerate = () => {
    setPlan(generatePlan(intake));
  };

  const loadSample = (sample: IntakeState) => {
    setIntake(sample);
    setPlan(generatePlan(sample));
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <div className="eyebrow"><Sparkles size={16} /> Agentic CaaS Prototype</div>
          <h1>CaaS Onboarding Agent</h1>
          <p>
            Convert natural-language app onboarding requests into structured infrastructure plans,
            readiness checks, generated artifacts, and approval-ready work items.
          </p>
        </div>
        <div className="hero-stats">
          <Metric label="Readiness" value={`${plan.readinessScore}%`} icon={<Gauge size={18} />} />
          <Metric label="Risk" value={plan.riskLevel.toUpperCase()} icon={<ShieldCheck size={18} />} />
          <Metric label="Services" value={`${intake.serviceCount}`} icon={<Layers3 size={18} />} />
        </div>
      </section>

      <section className="grid-layout">
        <div className="panel intake-panel">
          <div className="panel-header">
            <div>
              <h2>Developer Intake</h2>
              <p>Start with a plain-English ask, then refine the required platform fields.</p>
            </div>
          </div>

          <div className="samples-section">
            <div className="samples-label">Quick Start with Sample Scenarios:</div>
            <div className="samples-grid">
              <button className="sample-button" onClick={() => loadSample(sampleScenarios.paymentsApi)} title="Payments API with 8 services">
                Payments API (8 services)
              </button>
              <button className="sample-button" onClick={() => loadSample(sampleScenarios.batchProcessing)} title="Internal batch processing">
                Batch Processor (Internal)
              </button>
              <button className="sample-button" onClick={() => loadSample(sampleScenarios.customerApi)} title="Customer-facing API">
                Customer API (External)
              </button>
              <button className="sample-button" onClick={() => loadSample(sampleScenarios.prodSecured)} title="Production secured app">
                Production App (Secured)
              </button>
            </div>
          </div>

          <label className="field wide">
            <span>Prompt</span>
            <textarea
              value={intake.naturalLanguagePrompt}
              onChange={(event) => update('naturalLanguagePrompt', event.target.value)}
              rows={5}
            />
          </label>

          <div className="form-grid">
            <TextField label="Application Name" value={intake.appName} onChange={(value) => update('appName', value)} />
            <TextField label="Owner Group" value={intake.ownerGroup} onChange={(value) => update('ownerGroup', value)} />
            <TextField label="Application ID / CAMR" value={intake.applicationId} onChange={(value) => update('applicationId', value)} />
            <NumberField label="Number of Services" value={intake.serviceCount} onChange={(value) => update('serviceCount', value)} />

            <label className="field">
              <span>Environment</span>
              <select value={intake.environment} onChange={(event) => update('environment', event.target.value as IntakeState['environment'])}>
                <option value="sandbox">Sandbox</option>
                <option value="non-prod">Non-Prod</option>
                <option value="prod">Prod</option>
              </select>
            </label>

            <label className="field">
              <span>Ingress</span>
              <select value={intake.ingressType} onChange={(event) => update('ingressType', event.target.value as IntakeState['ingressType'])}>
                <option value="none">None</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
            </label>

            <TextField label="DNS Hostname" value={intake.dnsHostname} onChange={(value) => update('dnsHostname', value)} />

            <label className="field">
              <span>Database</span>
              <select value={intake.databaseNeed} onChange={(event) => update('databaseNeed', event.target.value as IntakeState['databaseNeed'])}>
                <option value="none">None</option>
                <option value="postgres">Postgres</option>
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
                <option value="redis">Redis</option>
              </select>
            </label>

            <TextField label="Container Registry" value={intake.containerRegistry} onChange={(value) => update('containerRegistry', value)} />
            <TextField label="Expected Traffic" value={intake.expectedTraffic} onChange={(value) => update('expectedTraffic', value)} />
          </div>

          <div className="toggle-row">
            <Toggle label="Secrets" checked={intake.secretsRequired} onChange={(value) => update('secretsRequired', value)} />
            <Toggle label="Autoscaling" checked={intake.autoscalingRequired} onChange={(value) => update('autoscalingRequired', value)} />
            <Toggle label="Observability" checked={intake.observabilityRequired} onChange={(value) => update('observabilityRequired', value)} />
          </div>

          <label className="field wide">
            <span>Compliance / Security Notes</span>
            <textarea value={intake.complianceNotes} onChange={(event) => update('complianceNotes', event.target.value)} rows={3} />
          </label>

          <button className="primary-button" onClick={handleGenerate}>
            <Sparkles size={18} /> Generate onboarding plan
          </button>
        </div>

        <div className="results-column">
          <div className="dashboard-header">
            <div className="readiness-gauge">
              <div className="score-ring">{plan.readinessScore}%</div>
              <div className="gauge-label">Readiness</div>
            </div>
            <div className="header-content">
              <h2>Onboarding Plan Status</h2>
              <p>
                {plan.missingInputs.length === 0 && plan.guardrails.length === 0
                  ? '✓ This request is structurally ready for review and approval.'
                  : `⚠ ${plan.missingInputs.length > 0 ? `${plan.missingInputs.length} missing field${plan.missingInputs.length > 1 ? 's' : ''} and ` : ''}${plan.guardrails.length > 0 ? `${plan.guardrails.length} guardrail${plan.guardrails.length > 1 ? 's' : ''}` : 'issue detected'} require attention.`}
              </p>
              <div className="status-indicators">
                <div className={`status-badge risk-${plan.riskLevel}`}>
                  <ShieldCheck size={16} />
                  <span>{plan.riskLevel.toUpperCase()} RISK</span>
                </div>
                <div className={`status-badge ${plan.missingInputs.length === 0 ? 'complete' : 'incomplete'}`}>
                  <span>{plan.missingInputs.length === 0 ? '✓' : '!'} REQUIRED FIELDS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <CardList title="Interpreted Requirements" icon={<ClipboardList size={18} />} items={plan.interpretedRequirements} variant="normal" />
            <CardList title="Missing Inputs" icon={<AlertTriangle size={18} />} items={plan.missingInputs} emptyText="✓ All required fields detected." variant={plan.missingInputs.length > 0 ? 'warning' : 'success'} />
            <CardList title="Guardrails & Compliance" icon={<ShieldCheck size={18} />} items={plan.guardrails} emptyText="✓ No blocking guardrails." variant={plan.guardrails.length > 0 ? 'warning' : 'success'} />
            <CardList title="Onboarding Steps" icon={<CheckCircle2 size={18} />} items={plan.onboardingSteps} variant="normal" />
          </div>

          <div className="actions-panel">
            <div className="panel-header">
              <h3>Next-Best Actions</h3>
              <p>Recommended workflow to move forward</p>
            </div>
            <ol className="actions-list">
              {plan.missingInputs.length > 0 && (
                <li className="action-item critical">
                  <span className="action-number">1</span>
                  <div>
                    <strong>Complete Required Fields</strong>
                    <p>Fill in {plan.missingInputs.length} missing field{plan.missingInputs.length > 1 ? 's' : ''} to enable approval.</p>
                  </div>
                </li>
              )}
              {plan.guardrails.length > 0 && (
                <li className="action-item warning">
                  <span className="action-number">{plan.missingInputs.length > 0 ? '2' : '1'}</span>
                  <div>
                    <strong>Review Platform Guardrails</strong>
                    <p>Address {plan.guardrails.length} guardrail warning{plan.guardrails.length > 1 ? 's' : ''} with platform team.</p>
                  </div>
                </li>
              )}
              <li className="action-item">
                <span className="action-number">{plan.missingInputs.length + (plan.guardrails.length > 0 ? 1 : 0) + 1}</span>
                <div>
                  <strong>Review Generated Artifacts</strong>
                  <p>Examine Kubernetes YAML, Terraform variables, and Jira stories below.</p>
                </div>
              </li>
              <li className="action-item">
                <span className="action-number">{plan.missingInputs.length + (plan.guardrails.length > 0 ? 1 : 0) + 2}</span>
                <div>
                  <strong>Submit for Approval</strong>
                  <p>{plan.readinessScore >= 80 ? 'Plan is ready for governance review.' : 'Plan will be ready once guardrails are addressed.'}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="panel artifact-panel">
        <div className="panel-header artifact-header">
          <div>
            <h2>Generated Artifacts</h2>
            <p>Safe, reviewable outputs only. Execution should come after approval gates.</p>
          </div>
          <div className="artifact-controls">
            <div className="tab-row">
              <TabButton active={activePreview === 'yaml'} onClick={() => setActivePreview('yaml')} icon={<Code2 size={16} />} label="Kubernetes YAML" />
              <TabButton active={activePreview === 'terraform'} onClick={() => setActivePreview('terraform')} icon={<FileText size={16} />} label="Terraform Vars" />
              <TabButton active={activePreview === 'jira'} onClick={() => setActivePreview('jira')} icon={<GitPullRequest size={16} />} label="Jira Stories" />
            </div>
            <button 
              className="download-button" 
              onClick={() => {
                const markdown = generateMarkdownExport(intake, plan);
                downloadMarkdown(markdown, `${intake.appName.toLowerCase().replace(/\s+/g, '-')}-onboarding-package.md`);
              }}
              title="Download complete onboarding package as Markdown"
            >
              <Download size={18} />
              <span>Download Package</span>
            </button>
          </div>
        </div>
        <pre className="code-preview"><code>{preview}</code></pre>
      </section>
    </main>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" min={1} max={99} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button className={`toggle ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)} type="button">
      <span className="toggle-dot" /> {label}
    </button>
  );
}

function CardList({ title, icon, items, emptyText, variant }: { title: string; icon: React.ReactNode; items: string[]; emptyText?: string; variant: 'normal' | 'warning' | 'success' }) {
  return (
    <div className={`panel mini-panel ${variant}`}>
      <h3>{icon} {title}</h3>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : (
        <p className="empty-text">{emptyText}</p>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button className={`tab-button ${active ? 'active' : ''}`} onClick={onClick}>
      {icon} {label}
    </button>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
