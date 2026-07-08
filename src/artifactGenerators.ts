import type { IntakeState } from './types';

const titleCase = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export function generateYaml(input: IntakeState, appSlug: string, serviceName: string): string {
  const registry = input.containerRegistry || '<registry>/<image>:<tag>';
  
  return `apiVersion: apps/v1
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
}

export function generateTerraform(input: IntakeState, appSlug: string): string {
  return `app_name        = "${appSlug}"
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
}

export function generateJiraStories(input: IntakeState): string {
  return `Epic: Onboard ${input.appName || 'application'} to CaaS

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
}
