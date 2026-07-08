import type { GeneratedPlan, IntakeState } from './types';

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

  const registry = input.containerRegistry || '<registry>/<image>:<tag>';
  const yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${serviceName}
  namespace: ${appSlug}-${input.environment}
  labels:
    app: ${serviceName}
spec:
  replicas: ${input.autoscalingRequired ? 2 : 1}
  selector:
    matchLabels:
      app: ${serviceName}
  template:
    metadata:
      labels:
        app: ${serviceName}
    spec:
      containers:
        - name: ${serviceName}
          image: ${registry}
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8080
          livenessProbe:
            httpGet:
              path: /health/live
              port: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: ${serviceName}
  namespace: ${appSlug}-${input.environment}
spec:
  selector:
    app: ${serviceName}
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
${input.autoscalingRequired ? `---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${serviceName}-hpa
  namespace: ${appSlug}-${input.environment}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${serviceName}
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70` : ''}`;

  const terraform = `app_name        = "${appSlug}"
environment     = "${input.environment}"
owner_group     = "${input.ownerGroup || '<owner-group>'}"
application_id  = "${input.applicationId || '<application-id>'}"
service_count   = ${input.serviceCount}
ingress_type    = "${input.ingressType}"
dns_hostname    = "${input.dnsHostname || '<dns-hostname>'}"
database_need   = "${input.databaseNeed}"
secrets_enabled = ${input.secretsRequired}
autoscaling     = ${input.autoscalingRequired}
observability   = ${input.observabilityRequired}`;

  const jiraStories = `Epic: Onboard ${input.appName || 'application'} to CaaS

Story 1: Validate onboarding intake
As a platform engineer, I need ownership, environment, traffic, and dependency details so that the onboarding request can be evaluated safely.

Story 2: Generate deployment foundation
As a developer, I need namespace, service, and deployment artifacts so that my application can be deployed consistently.

Story 3: Configure platform dependencies
As a developer, I need ingress, secrets, database, and observability dependencies configured so that my services are production-ready.

Story 4: Run policy and readiness validation
As a platform owner, I need guardrail checks before execution so that risky or incomplete changes are not promoted.

Story 5: Prepare approval package
As an approver, I need a summarized plan, generated artifacts, and known risks so that I can approve or reject the request.`;

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
