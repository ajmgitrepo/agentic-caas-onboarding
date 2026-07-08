# Sample Prompts

## Non-prod API onboarding

```text
I need to onboard a payments API with 8 services in non-prod. It needs external ingress, Postgres, secrets, autoscaling, monitoring, and promotion readiness for prod.
```

## Internal service onboarding

```text
Create an onboarding plan for an internal claims-processing service with 4 services. It does not need external ingress, but it needs Redis, Vault secrets, health checks, and dashboards.
```

## Production readiness check

```text
Review whether my app is ready for production onboarding. It has 12 services, external ingress, Postgres, Vault secrets, autoscaling, observability, and PCI compliance requirements.
```

## Missing-information scenario

```text
I want to onboard a customer profile app with 6 services and monitoring.
```

Expected behavior: the assistant should identify missing environment, owner group, app ID, ingress details, container registry, traffic profile, and security requirements.
