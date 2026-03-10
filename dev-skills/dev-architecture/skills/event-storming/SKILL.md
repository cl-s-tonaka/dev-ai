---
name: event-storming
description: "Facilitate event storming sessions to discover domain events, commands, aggregates, and bounded contexts for domain-driven design. Use when exploring complex domains, designing new systems, or refactoring existing monoliths."
---

# Event Storming

## Metadata
- **Name**: event-storming
- **Description**: Facilitate event storming to discover domain events, commands, aggregates, and bounded contexts.
- **Triggers**: event storming, domain discovery, DDD, bounded context, domain events

## Instructions

You are a domain-driven design facilitator conducting an event storming session for $ARGUMENTS.

Your task is to discover the domain model through collaborative exploration of events, commands, aggregates, and bounded contexts.

## Input Requirements
- Domain description and business context
- Key business processes to model
- Stakeholders and domain experts
- Known pain points or complexity areas
- Existing system documentation (if any)

## Event Storming Overview

**What is Event Storming?**
A collaborative workshop technique to explore complex business domains by focusing on domain events - things that happen in the system that business people care about.

**Session Types**
| Type | Duration | Goal | Output |
|------|----------|------|--------|
| Big Picture | 2-4 hours | Understand entire domain | High-level event flow |
| Process Modeling | 4-8 hours | Detail specific processes | Detailed event/command flow |
| Design Level | 1-2 days | Design aggregates | DDD tactical patterns |

## Sticky Note Colors (Convention)

| Color | Represents | Example |
|-------|------------|---------|
| Orange | Domain Event | OrderPlaced, PaymentReceived |
| Blue | Command | PlaceOrder, ProcessPayment |
| Yellow | Aggregate | Order, Customer, Product |
| Pink/Red | Hot Spot / Problem | Unclear process, conflict |
| Purple | Policy / Process Manager | When X then Y |
| Green | Read Model / View | OrderSummary, Dashboard |
| Small Yellow | Actor / User | Customer, Admin |
| Lilac | External System | PaymentGateway, EmailService |

## Event Storming Process

### Phase 1: Chaotic Exploration (20-30 min)

**Goal**: Generate all domain events without structure.

**Instructions**:
1. Ask: "What events happen in this domain?"
2. Write events in past tense (OrderPlaced, not PlaceOrder)
3. One event per sticky note
4. No discussion yet - just generate
5. Place events on the timeline (left to right = time)

**Event Naming Rules**
```
Pattern: [Subject][Past Tense Verb]

Good Examples:
- OrderPlaced
- PaymentProcessed
- InventoryReserved
- ShipmentDispatched
- CustomerRegistered

Bad Examples:
- PlaceOrder (command, not event)
- Order (noun, not event)
- Processing (not past tense)
```

### Phase 2: Timeline Ordering (15-20 min)

**Goal**: Arrange events chronologically.

```
Timeline:
←── Past                                                    Future ──→

[CustomerRegistered] → [ProductAddedToCart] → [OrderPlaced] → [PaymentProcessed] → [OrderShipped]
```

**Look for**:
- Parallel paths (events that can happen concurrently)
- Loops (repeating processes)
- Branches (alternative paths)

### Phase 3: Hot Spots (10-15 min)

**Goal**: Identify problems, conflicts, and unknowns.

**Hot Spot Types**:
| Type | Description | Action |
|------|-------------|--------|
| Conflict | Disagreement on process | Resolve with domain expert |
| Unknown | Missing knowledge | Research or defer |
| Complex | Complicated logic | Break down further |
| Technical Debt | Known issues | Document for backlog |

Mark hot spots with pink/red stickies.

### Phase 4: Commands and Actors (20-30 min)

**Goal**: Discover what triggers events.

```
[Actor]          [Command]           [Event]
Customer    →    PlaceOrder      →   OrderPlaced
Admin       →    ApproveRefund   →   RefundApproved
System      →    ProcessPayment  →   PaymentProcessed
```

**Command Patterns**:
- User-initiated: Customer clicks "Place Order"
- Time-triggered: Daily batch process
- Event-triggered: Policy reacts to event
- External: Webhook from payment provider

### Phase 5: Aggregates (20-30 min)

**Goal**: Group commands and events by consistency boundary.

**Aggregate Identification**:
```
┌─────────────────────────────────────┐
│           Order Aggregate           │
│                                     │
│  Commands:                          │
│  - CreateOrder                      │
│  - AddItem                          │
│  - RemoveItem                       │
│  - SubmitOrder                      │
│  - CancelOrder                      │
│                                     │
│  Events:                            │
│  - OrderCreated                     │
│  - ItemAdded                        │
│  - ItemRemoved                      │
│  - OrderSubmitted                   │
│  - OrderCancelled                   │
│                                     │
│  Invariants:                        │
│  - Order total must equal sum of    │
│    items                            │
│  - Cannot submit empty order        │
└─────────────────────────────────────┘
```

### Phase 6: Bounded Contexts (20-30 min)

**Goal**: Identify context boundaries and relationships.

**Context Identification Signals**:
- Different ubiquitous language
- Different teams/ownership
- Different data lifecycle
- Different scaling requirements
- Natural process boundaries

**Bounded Context Map**:
```
┌─────────────────┐     ┌─────────────────┐
│    Ordering     │     │    Inventory    │
│    Context      │────→│    Context      │
│                 │     │                 │
│ - Order         │     │ - Product       │
│ - OrderItem     │     │ - Stock         │
│ - Cart          │     │ - Warehouse     │
└─────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│    Payment      │     │    Shipping     │
│    Context      │     │    Context      │
│                 │     │                 │
│ - Payment       │     │ - Shipment      │
│ - Refund        │     │ - Tracking      │
│ - Transaction   │     │ - Carrier       │
└─────────────────┘     └─────────────────┘
```

### Phase 7: Policies (15-20 min)

**Goal**: Document reactive logic between events.

**Policy Pattern**:
```
When [Event] then [Command]

Examples:
- When OrderPlaced then ReserveInventory
- When PaymentFailed then CancelOrder
- When ShipmentDelivered then SendSurvey
```

**Policy Notation**:
```
[OrderPlaced] ─── Policy: "Reserve Stock" ───→ [ReserveInventory]
                                                      │
                                                      ▼
                                              [InventoryReserved]
                                                   or
                                              [StockUnavailable]
```

## Output Format

### Domain Event Catalog

```markdown
## Domain Events

### Ordering Context

| Event | Description | Triggered By | Data |
|-------|-------------|--------------|------|
| OrderCreated | New order initialized | CreateOrder command | orderId, customerId, timestamp |
| ItemAdded | Item added to order | AddItem command | orderId, productId, quantity, price |
| OrderSubmitted | Order submitted for processing | SubmitOrder command | orderId, totalAmount |
| OrderCancelled | Order cancelled | CancelOrder command | orderId, reason |

### Inventory Context

| Event | Description | Triggered By | Data |
|-------|-------------|--------------|------|
| StockReserved | Inventory reserved for order | OrderSubmitted event | orderId, items[] |
| StockReleased | Reserved inventory released | OrderCancelled event | orderId, items[] |
```

### Aggregate Definitions

```markdown
## Aggregates

### Order Aggregate

**Root Entity**: Order
**Bounded Context**: Ordering

**Commands**:
- CreateOrder(customerId)
- AddItem(productId, quantity)
- RemoveItem(itemId)
- SubmitOrder()
- CancelOrder(reason)

**Events**:
- OrderCreated
- ItemAdded
- ItemRemoved
- OrderSubmitted
- OrderCancelled

**Invariants**:
1. Order must have at least one item to submit
2. Total must equal sum of item prices
3. Submitted orders cannot be modified
4. Only pending orders can be cancelled

**State Transitions**:
Draft → Submitted → Paid → Shipped → Delivered
  │        │
  └→ Cancelled ←┘
```

### Context Map

```markdown
## Context Map

### Relationships

| Upstream | Downstream | Relationship | Integration |
|----------|------------|--------------|-------------|
| Ordering | Inventory | Customer-Supplier | Domain Events |
| Ordering | Payment | Customer-Supplier | Sync API |
| Payment | Ordering | Published Language | Webhook Events |
| Inventory | Shipping | Conformist | Shared Kernel |

### Integration Events

| Event | Publisher | Subscribers | Purpose |
|-------|-----------|-------------|---------|
| OrderSubmitted | Ordering | Inventory, Payment | Start fulfillment |
| PaymentCompleted | Payment | Ordering, Shipping | Confirm payment |
| StockReserved | Inventory | Ordering | Confirm availability |
```

## Facilitation Tips

**Before the Session**
- Prepare the domain overview
- Invite domain experts (essential)
- Set up collaboration space (physical or virtual)
- Explain the sticky note conventions

**During the Session**
- Start with "What events happen?" not "What entities exist?"
- Encourage disagreement (hot spots are valuable)
- Avoid technical implementation details
- Keep energy high; take breaks

**After the Session**
- Digitize the results immediately
- Share with participants for validation
- Create follow-up tasks for hot spots
- Use output to inform system design

## Common Patterns Discovered

| Pattern | Example | Implementation |
|---------|---------|----------------|
| Saga | Order → Payment → Fulfillment | Choreography or Orchestration |
| Event Notification | OrderPlaced → SendConfirmation | Pub/Sub |
| Event Sourcing | Store all events as source of truth | Append-only event store |
| CQRS | Separate read/write models | Read replicas, projections |

## Output Process
1. Conduct chaotic exploration of events
2. Arrange events on timeline
3. Mark hot spots and unknowns
4. Add commands and actors
5. Identify aggregates
6. Define bounded contexts
7. Document policies
8. Create domain event catalog
9. Build context map
10. Plan follow-up sessions for hot spots

## Notes
- Domain experts are essential; this is not a developer-only exercise
- Events should be named in business language, not technical terms
- Disagreement reveals complexity; don't rush to resolve
- Multiple sessions are often needed for complex domains
- Use output to drive system design, not vice versa
- Revisit event storming when domain understanding evolves
