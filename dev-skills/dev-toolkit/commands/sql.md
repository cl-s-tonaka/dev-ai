---
name: sql
version: 1.0.0
description: Build and optimize SQL queries
argument-hint: "[query requirements]"
arguments:
  - name: requirements
    description: What data to retrieve or operation to perform
    required: true
  - name: database
    description: Database type (PostgreSQL, MySQL, SQLite, etc.)
    required: false
examples:
  - "/sql Find all users who made purchases in the last 30 days"
  - "/sql Get monthly revenue with year-over-year comparison"
  - "/sql Update all expired subscriptions to inactive status"
---

# /sql

Build and optimize SQL queries based on requirements.

## Metadata

| Property | Value |
|----------|-------|
| Command | /sql |
| Skill | [sql-query-builder](../skills/sql-query-builder/SKILL.md) |
| Category | Development |

## Instructions

When the user invokes `/sql`, analyze the data requirements and generate an efficient, readable SQL query. Include:

1. **Query** - The SQL statement
2. **Explanation** - What each part does
3. **Optimization Notes** - Performance considerations
4. **Index Recommendations** - Suggested indexes

### Query Capabilities

| Type | Examples |
|------|----------|
| SELECT | Simple queries, joins, aggregations, CTEs |
| INSERT | Single row, bulk insert, insert from select |
| UPDATE | Conditional updates, joins in updates |
| DELETE | Safe deletes, cascading considerations |
| Analytics | Window functions, rankings, running totals |
| Reporting | Pivots, grouping sets, rollups |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| requirements | string | Yes | Data requirements or operation |
| database | string | No | Database type for syntax specifics |
| tables | string | No | Available tables and structure |

## Output Format

```markdown
## SQL Query

```sql
[generated query]
```

## Explanation

| Clause | Purpose |
|--------|---------|
| SELECT | ... |
| FROM | ... |
| WHERE | ... |

## Optimization Notes
- [Performance consideration 1]
- [Performance consideration 2]

## Recommended Indexes
```sql
CREATE INDEX ...
```

## Alternative Approaches
[If applicable, show alternative query approaches]
```

## Examples

### Input
```
/sql Find all users who made purchases in the last 30 days with their total spend
```

### Output
```markdown
## SQL Query

```sql
SELECT
    u.id,
    u.name,
    u.email,
    COUNT(o.id) AS order_count,
    SUM(o.total_amount) AS total_spend,
    MAX(o.created_at) AS last_order_date
FROM
    users AS u
    INNER JOIN orders AS o ON u.id = o.user_id
WHERE
    o.created_at >= CURRENT_DATE - INTERVAL '30 days'
    AND o.status = 'completed'
GROUP BY
    u.id, u.name, u.email
ORDER BY
    total_spend DESC;
```

## Explanation

| Clause | Purpose |
|--------|---------|
| SELECT | Retrieves user info and calculates order metrics |
| INNER JOIN | Connects users to their orders (excludes users without orders) |
| WHERE | Filters to completed orders in the last 30 days |
| GROUP BY | Aggregates data per user |
| ORDER BY | Sorts by highest spenders first |

## Optimization Notes
- INNER JOIN ensures only users with orders are returned
- Date filter uses index-friendly comparison (no function on column)
- Consider adding LIMIT if you only need top N users

## Recommended Indexes
```sql
-- Composite index for the WHERE clause and JOIN
CREATE INDEX idx_orders_user_created_status
ON orders (user_id, created_at, status);

-- Covering index for better performance
CREATE INDEX idx_orders_user_analytics
ON orders (user_id, created_at, status)
INCLUDE (total_amount);
```

## Alternative Approaches

### Using CTE for readability
```sql
WITH recent_orders AS (
    SELECT
        user_id,
        COUNT(*) AS order_count,
        SUM(total_amount) AS total_spend,
        MAX(created_at) AS last_order_date
    FROM orders
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      AND status = 'completed'
    GROUP BY user_id
)
SELECT
    u.id,
    u.name,
    u.email,
    ro.order_count,
    ro.total_spend,
    ro.last_order_date
FROM users u
JOIN recent_orders ro ON u.id = ro.user_id
ORDER BY ro.total_spend DESC;
```
```

---

### Input
```
/sql Get monthly revenue with month-over-month and year-over-year comparison
```

### Output
```markdown
## SQL Query

```sql
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', o.created_at) AS month,
        SUM(o.total_amount) AS revenue
    FROM
        orders AS o
    WHERE
        o.status = 'completed'
        AND o.created_at >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year'
    GROUP BY
        DATE_TRUNC('month', o.created_at)
)
SELECT
    TO_CHAR(mr.month, 'YYYY-MM') AS month,
    mr.revenue AS current_revenue,

    -- Month over Month
    LAG(mr.revenue, 1) OVER (ORDER BY mr.month) AS prev_month_revenue,
    mr.revenue - LAG(mr.revenue, 1) OVER (ORDER BY mr.month) AS mom_change,
    ROUND(
        (mr.revenue - LAG(mr.revenue, 1) OVER (ORDER BY mr.month)) * 100.0 /
        NULLIF(LAG(mr.revenue, 1) OVER (ORDER BY mr.month), 0),
        2
    ) AS mom_change_pct,

    -- Year over Year
    LAG(mr.revenue, 12) OVER (ORDER BY mr.month) AS prev_year_revenue,
    mr.revenue - LAG(mr.revenue, 12) OVER (ORDER BY mr.month) AS yoy_change,
    ROUND(
        (mr.revenue - LAG(mr.revenue, 12) OVER (ORDER BY mr.month)) * 100.0 /
        NULLIF(LAG(mr.revenue, 12) OVER (ORDER BY mr.month), 0),
        2
    ) AS yoy_change_pct
FROM
    monthly_revenue AS mr
ORDER BY
    mr.month DESC;
```

## Explanation

| Clause | Purpose |
|--------|---------|
| CTE (monthly_revenue) | Pre-aggregates revenue by month |
| LAG(..., 1) | Gets previous month's value for MoM |
| LAG(..., 12) | Gets same month last year for YoY |
| NULLIF | Prevents division by zero errors |
| DATE_TRUNC | Groups dates into months |

## Optimization Notes
- CTE pre-aggregates to reduce window function complexity
- NULLIF handles edge cases where comparison month has no data
- Consider materializing monthly aggregates for large datasets

## Recommended Indexes
```sql
-- Index for date range and status filtering
CREATE INDEX idx_orders_created_status
ON orders (created_at, status)
WHERE status = 'completed';

-- Partial index for completed orders only
CREATE INDEX idx_orders_completed_monthly
ON orders (DATE_TRUNC('month', created_at), total_amount)
WHERE status = 'completed';
```

## Sample Output
| month | current_revenue | prev_month_revenue | mom_change | mom_change_pct | prev_year_revenue | yoy_change | yoy_change_pct |
|-------|----------------|-------------------|------------|----------------|------------------|------------|----------------|
| 2024-03 | 125000 | 118000 | 7000 | 5.93 | 98000 | 27000 | 27.55 |
| 2024-02 | 118000 | 105000 | 13000 | 12.38 | 95000 | 23000 | 24.21 |
```

---

### Input
```
/sql Rank products by sales within each category
```

### Output
```markdown
## SQL Query

```sql
SELECT
    p.category_id,
    c.name AS category_name,
    p.id AS product_id,
    p.name AS product_name,
    SUM(oi.quantity) AS total_units_sold,
    SUM(oi.quantity * oi.unit_price) AS total_revenue,
    RANK() OVER (
        PARTITION BY p.category_id
        ORDER BY SUM(oi.quantity * oi.unit_price) DESC
    ) AS revenue_rank,
    DENSE_RANK() OVER (
        PARTITION BY p.category_id
        ORDER BY SUM(oi.quantity) DESC
    ) AS units_rank
FROM
    products AS p
    INNER JOIN categories AS c ON p.category_id = c.id
    INNER JOIN order_items AS oi ON p.id = oi.product_id
    INNER JOIN orders AS o ON oi.order_id = o.id
WHERE
    o.status = 'completed'
    AND o.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY
    p.category_id,
    c.name,
    p.id,
    p.name
ORDER BY
    c.name,
    revenue_rank;
```

## Explanation

| Clause | Purpose |
|--------|---------|
| PARTITION BY category_id | Restarts ranking for each category |
| RANK() | Assigns rank with gaps for ties |
| DENSE_RANK() | Assigns rank without gaps |
| Multiple Joins | Connects products to their sales data |

## Optimization Notes
- RANK() leaves gaps (1,2,2,4) while DENSE_RANK() doesn't (1,2,2,3)
- Use DENSE_RANK for "top N" queries to ensure N results
- Consider ROW_NUMBER() if you need unique positions

## Recommended Indexes
```sql
CREATE INDEX idx_order_items_product
ON order_items (product_id)
INCLUDE (quantity, unit_price, order_id);

CREATE INDEX idx_orders_status_date
ON orders (status, created_at)
WHERE status = 'completed';
```

## Top 3 Per Category Variant
```sql
WITH ranked_products AS (
    SELECT
        p.category_id,
        c.name AS category_name,
        p.id AS product_id,
        p.name AS product_name,
        SUM(oi.quantity * oi.unit_price) AS total_revenue,
        DENSE_RANK() OVER (
            PARTITION BY p.category_id
            ORDER BY SUM(oi.quantity * oi.unit_price) DESC
        ) AS rank
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'completed'
    GROUP BY p.category_id, c.name, p.id, p.name
)
SELECT * FROM ranked_products WHERE rank <= 3;
```
```

## Notes

- Always use parameterized queries in application code to prevent SQL injection
- Test queries with EXPLAIN ANALYZE before production use
- Consider database-specific syntax (PostgreSQL vs MySQL vs SQLite)
- Add appropriate indexes based on query patterns
- Use CTEs for complex queries to improve readability
- Include LIMIT for queries that may return large result sets
