export type Environment = 'non-prod' | 'prod' | 'sandbox';
export type IngressType = 'none' | 'internal' | 'external';
export type DatabaseNeed = 'none' | 'postgres' | 'mysql' | 'mongodb' | 'redis';

export interface IntakeState {
  naturalLanguagePrompt: string;
  appName: string;
  ownerGroup: string;
  applicationId: string;
  environment: Environment;
  serviceCount: number;
  ingressType: IngressType;
  dnsHostname: string;
  databaseNeed: DatabaseNeed;
  secretsRequired: boolean;
  autoscalingRequired: boolean;
  observabilityRequired: boolean;
  complianceNotes: string;
  expectedTraffic: string;
  containerRegistry: string;
}

export interface GeneratedPlan {
  interpretedRequirements: string[];
  missingInputs: string[];
  guardrails: string[];
  onboardingSteps: string[];
  readinessScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  yaml: string;
  terraform: string;
  jiraStories: string;
}
