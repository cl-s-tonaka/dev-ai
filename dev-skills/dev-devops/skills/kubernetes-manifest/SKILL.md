---
name: kubernetes-manifest
version: 1.0.0
description: Design production-ready Kubernetes manifests with best practices for deployments, services, ingress, and resource management
tags:
  - kubernetes
  - k8s
  - containers
  - orchestration
  - devops
---

# Kubernetes Manifest Design

## Metadata

| Property | Value |
|----------|-------|
| Name | kubernetes-manifest |
| Version | 1.0.0 |
| Category | DevOps |
| Complexity | High |

## Instructions

Design production-ready Kubernetes manifests that implement best practices for reliability, security, scalability, and observability. Create configurations for deployments, services, ingress, config maps, secrets, and supporting resources.

### Resource Types Reference

| Resource | Purpose | When to Use |
|----------|---------|-------------|
| Deployment | Stateless applications | Web servers, APIs, workers |
| StatefulSet | Stateful applications | Databases, caches with persistence |
| DaemonSet | Per-node workloads | Log collectors, monitoring agents |
| Job/CronJob | Batch/scheduled tasks | Data processing, backups |
| Service | Network access | Expose pods internally/externally |
| Ingress | HTTP routing | External HTTP/HTTPS access |
| ConfigMap | Non-sensitive config | App configuration |
| Secret | Sensitive data | Credentials, tokens |
| HPA | Auto-scaling | Dynamic workloads |
| PDB | Availability | Production services |

### Production Checklist

| Category | Requirement | Priority |
|----------|-------------|----------|
| Resources | CPU/Memory requests and limits | Critical |
| Health | Liveness and readiness probes | Critical |
| Security | Non-root, read-only filesystem | High |
| Availability | PodDisruptionBudget | High |
| Scaling | HorizontalPodAutoscaler | Medium |
| Observability | Labels and annotations | High |
| Anti-affinity | Pod distribution | Medium |
| Secrets | External secrets management | High |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| app_name | string | Yes | Application name |
| image | string | Yes | Container image with tag |
| replicas | number | Yes | Number of replicas |
| port | number | Yes | Application port |
| resources | object | No | CPU/memory requirements |
| environment | string | No | Deployment environment (dev, staging, prod) |
| ingress_host | string | No | Hostname for ingress |
| persistent_storage | boolean | No | Whether storage is needed |

## Output Process

### Step 1: Define Core Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: production
  labels:
    app.kubernetes.io/name: myapp
    app.kubernetes.io/version: "1.0.0"
    app.kubernetes.io/component: backend
    app.kubernetes.io/part-of: myplatform
    app.kubernetes.io/managed-by: kubectl
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app.kubernetes.io/name: myapp
  template:
    metadata:
      labels:
        app.kubernetes.io/name: myapp
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: myapp
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
      containers:
        - name: myapp
          image: myapp:1.0.0
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 8080
              protocol: TCP
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 10
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3
          envFrom:
            - configMapRef:
                name: myapp-config
          env:
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: myapp-secrets
                  key: db-password
          volumeMounts:
            - name: tmp
              mountPath: /tmp
            - name: cache
              mountPath: /app/cache
      volumes:
        - name: tmp
          emptyDir: {}
        - name: cache
          emptyDir:
            sizeLimit: 100Mi
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app.kubernetes.io/name: myapp
                topologyKey: kubernetes.io/hostname
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: myapp
```

### Step 2: Configure Service and Ingress

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myapp
  namespace: production
  labels:
    app.kubernetes.io/name: myapp
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app.kubernetes.io/name: myapp
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
    - hosts:
        - myapp.example.com
      secretName: myapp-tls
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: myapp
                port:
                  number: 80
```

### Step 3: Add Scaling and Availability

```yaml
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: myapp
  namespace: production
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: myapp
```

### Step 4: Configure Supporting Resources

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
  namespace: production
data:
  LOG_LEVEL: "info"
  FEATURE_FLAGS: "new-ui,beta-api"
  CACHE_TTL: "3600"
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: myapp
  namespace: production
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: myapp
  namespace: production
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: myapp
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: database
      ports:
        - protocol: TCP
          port: 5432
    - to: # Allow DNS
        - namespaceSelector: {}
      ports:
        - protocol: UDP
          port: 53
```

## Output Format

```markdown
## Kubernetes Manifest Set: [App Name]

### Files Generated
| File | Description |
|------|-------------|
| `deployment.yaml` | Application deployment with probes, security, resources |
| `service.yaml` | ClusterIP service for internal access |
| `ingress.yaml` | Ingress with TLS and rate limiting |
| `hpa.yaml` | Horizontal Pod Autoscaler configuration |
| `pdb.yaml` | Pod Disruption Budget for availability |
| `configmap.yaml` | Non-sensitive configuration |
| `networkpolicy.yaml` | Network segmentation rules |
| `serviceaccount.yaml` | Service account with minimal permissions |

### Resource Estimates
| Resource | Request (per pod) | Limit (per pod) | Total (3 replicas) |
|----------|------------------|-----------------|-------------------|
| CPU | 100m | 500m | 300m-1500m |
| Memory | 128Mi | 512Mi | 384Mi-1536Mi |

### Deployment Commands
```bash
# Apply all manifests
kubectl apply -f k8s/

# Verify deployment
kubectl rollout status deployment/myapp -n production

# Check pods
kubectl get pods -l app.kubernetes.io/name=myapp -n production
```
```

## Notes

- Always use namespaces to isolate environments
- Set resource requests equal to typical usage, limits at 2-3x requests
- Use rolling update strategy with `maxUnavailable: 0` for zero-downtime
- Implement network policies to restrict pod-to-pod communication
- Use external secrets management (External Secrets, Sealed Secrets, Vault)
- Label everything with standard Kubernetes labels (`app.kubernetes.io/*`)
- Set appropriate QoS class: Guaranteed for critical, Burstable for most apps
- Consider using Kustomize or Helm for environment variations
- Run `kubectl diff` before applying changes to production
- Use admission controllers (OPA/Gatekeeper, Kyverno) for policy enforcement
