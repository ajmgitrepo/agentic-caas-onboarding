import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle2, ClipboardList, Code2, FileText, GitPullRequest, Gauge, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
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
          <div className="panel score-panel">
            <div className="score-ring">{plan.readinessScore}%</div>
            <div>
              <h2>Readiness Assessment</h2>
              <p>
                {plan.missingInputs.length === 0 && plan.guardrails.length === 0
                  ? 'This request is structurally ready for review.'
                  : 'This request needs additional details or platform review before execution.'}
              </p>
              <div className={`risk-pill ${plan.riskLevel}`}>{plan.riskLevel} risk</div>
            </div>
          </div>

          <CardList title="Interpreted Requirements" icon={<ClipboardList size={18} />} items={plan.interpretedRequirements} variant="normal" />
          <CardList title="Missing Inputs" icon={<AlertTriangle size={18} />} items={plan.missingInputs} emptyText="No missing intake fields detected." variant="warning" />
          <CardList title="Guardrails" icon={<ShieldCheck size={18} />} items={plan.guardrails} emptyText="No blocking guardrails detected." variant="warning" />
          <CardList title="Onboarding Steps" icon={<CheckCircle2 size={18} />} items={plan.onboardingSteps} variant="normal" />
        </div>
      </section>

      <section className="panel artifact-panel">
        <div className="panel-header artifact-header">
          <div>
            <h2>Generated Artifacts</h2>
            <p>Safe, reviewable outputs only. Execution should come after approval gates.</p>
          </div>
          <div className="tab-row">
            <TabButton active={activePreview === 'yaml'} onClick={() => setActivePreview('yaml')} icon={<Code2 size={16} />} label="Kubernetes YAML" />
            <TabButton active={activePreview === 'terraform'} onClick={() => setActivePreview('terraform')} icon={<FileText size={16} />} label="Terraform Vars" />
            <TabButton active={activePreview === 'jira'} onClick={() => setActivePreview('jira')} icon={<GitPullRequest size={16} />} label="Jira Stories" />
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

function CardList({ title, icon, items, emptyText, variant }: { title: string; icon: React.ReactNode; items: string[]; emptyText?: string; variant: 'normal' | 'warning' }) {
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
