import type { GeneratedPlan, IntakeState } from './types';
import { generateYaml, generateTerraform, generateJiraStories } from './artifactGenerators';

const titleCase = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export function generatePlan(input: IntakeState): GeneratedPlan {
  const appSlug = input.appName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'sample-app';
  const serviceName = `${appSlug}-service-1`;
  const missingInputs: string[] = [];
  const guardrails: string[] = [];

  if (!input.appName.trim()) missingInputs.push('Application name');
  if (!input.ownerGroup.trim()) missingInputs.push('Owner group / support contact');
  if (!input.applicationId.trim()) missingInputs.push('Application ID / CAMR ID');
  if (!input.containerRegistry.trim()) missingInputs.push('Container image registry');
  if (input.ingressType !== 'none' && !input.dnsHostname.trim()) missingInputs.push('DNS hostname');
  if (!input.expectedTraffic.trim()) missingInputs.push('Expected traffic profile');

  if (input.environment === 'prod' && !input.ownerGroup.trim()) {
    guardrails.push('Production onboarding is blocked until an owning support group is provided.');
  }
  if (input.environment === 'prod' && input.ingressType === 'external' && !input.dnsHostname.trim()) {
    guardrails.push('External production ingress requires DNS and certificate readiness before implementation.');
  }
  if (input.secretsRequired && input.complianceNotes.toLowerCase().includes('manual')) {
    guardrails.push('Manual secret handling is not allowed. Route through approved secret management such as Vault.');
  }
  if (input.serviceCount > 20) {
    guardrails.push('Large service count detected. Recommend platform review for namespace strategy, quota limits, and rollout sequencing.');
  }
  if (input.databaseNeed !== 'none' && input.environment === 'prod') {
    guardrails.push('Production data dependency requires backup, restore, retention, and access-control validation.');
  }

  const interpretedRequirements = [
    `Onboard ${input.appName || 'the application'} into ${input.environment}.`,
    `Generate baseline Kubernetes artifacts for ${input.serviceCount} service${input.serviceCount === 1 ? '' : 's'}.`,
    `Ingress model: ${input.ingressType}.`,
    `Database dependency: ${input.databaseNeed}.`,
    input.secretsRequired ? 'Secrets management is required.' : 'No secret dependency declared.',
    input.autoscalingRequired ? 'Autoscaling is required.' : 'Autoscaling is not required in this request.',
    input.observabilityRequired ? 'Observability and health checks are required.' : 'Observability was not explicitly requested.'
  ];

  const onboardingSteps = [
    'Validate application ownership, environment, and support model.',
    'Create or map namespace and baseline RBAC.',
    'Register service count, image registry, and deployment topology.',
    input.ingressType === 'none' ? 'Skip ingress setup for this version.' : 'Create ingress and route/DNS implementation plan.',
    input.databaseNeed === 'none' ? 'Skip managed data dependency setup.' : `Prepare ${titleCase(input.databaseNeed)} dependency request.`,
    input.secretsRequired ? 'Configure approved secret store integration.' : 'Confirm no secrets are required.',
    input.autoscalingRequired ? 'Generate HPA/KEDA scaling profile.' : 'Use fixed replica baseline.',
    input.observabilityRequired ? 'Enable metrics, logs, traces, and health checks.' : 'Add observability recommendation for production readiness.',
    'Run policy checks for quotas, ingress, secrets, ownership, and compliance.',
    'Create approval-ready work items and pull request artifacts.'
  ];

  const readinessScore = Math.max(15, Math.min(100, 100 - missingInputs.length * 10 - guardrails.length * 12));
  const riskLevel = guardrails.length >= 3 || input.environment === 'prod' ? 'high' : guardrails.length > 0 ? 'medium' : 'low';

  const yaml = generateYaml(input, appSlug, serviceName);
  const terraform = generateTerraform(input, appSlug);
  const jiraStories = generateJiraStories(input);

  return {
    interpretedRequirements,
    missingInputs,
    guardrails,
    onboardingSteps,
    readinessScore,
    riskLevel,
    yaml,
    terraform,
    jiraStories
  };
}
