---
name: sql-query-builder
version: 1.0.0
description: Construct and optimize SQL queries for data retrieval and manipulation
tags:
  - sql
  - database
  - query
  - optimization
  - performance
---

# SQL Query Builder

## Metadata

| Property | Value |
|----------|-------|
| Name | sql-query-builder |
| Version | 1.0.0 |
| Category | Development |
| Complexity | Medium-High |

## Instructions

Construct efficient, readable SQL queries for data retrieval and manipulation. Apply optimization techniques, follow best practices, and consider database-specific features when applicable.

### Query Types

| Type | Purpose | Keywords |
|------|---------|----------|
| SELECT | Retrieve data | SELECT, FROM, WHERE, JOIN |
| INSERT | Add records | INSERT INTO, VALUES |
| UPDATE | Modify records | UPDATE, SET, WHERE |
| DELETE | Remove records | DELETE FROM, WHERE |
| DDL | Schema changes | CREATE, ALTER, DROP |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| requirement | string | Yes | What data to retrieve/modify |
| tables | string[] | No | Available tables |
| schema | object | No | Table schemas with columns |
| database | string | No | Database type (PostgreSQL, MySQL, etc.) |
| optimization | boolean | No | Whether to optimize for performance |

## Output Process

### Step 1: Understand Data Needs

- [ ] Identify required data/columns
- [ ] Identify source tables
- [ ] Determine relationships between tables
- [ ] Identify filtering criteria
- [ ] Determine ordering and grouping needs
- [ ] Identify aggregation requirements

### Step 2: Design Query Structure

**Query Building Order:**
1. SELECT - Define output columns
2. FROM - Identify primary table
3. JOIN - Add related tables
4. WHERE - Filter rows
5. GROUP BY - Aggregate data
6. HAVING - Filter groups
7. ORDER BY - Sort results
8. LIMIT/OFFSET - Paginate

### Step 3: Write Query

**Best Practices:**
- [ ] Use meaningful table aliases
- [ ] Qualify column names with table aliases
- [ ] Use explicit JOIN syntax (not implicit)
- [ ] Place each clause on its own line
- [ ] Indent subqueries and conditions
- [ ] Use uppercase for SQL keywords

### Step 4: Optimize Query

**Optimization Checklist:**
- [ ] Select only needed columns (avoid SELECT *)
- [ ] Use appropriate indexes
- [ ] Avoid functions on indexed columns in WHERE
- [ ] Use EXISTS instead of IN for subqueries
- [ ] Consider query execution plan
- [ ] Use appropriate join types
- [ ] Limit result sets when possible

### Step 5: Add Comments

```sql
-- Purpose: [what this query does]
-- Author: [name]
-- Date: [date]
-- Notes: [any important context]
```

## Output Format

### Query Template

```sql
-- [Description of what this query does]
SELECT
    t1.column1,
    t1.column2,
    t2.column3,
    AGGREGATE_FUNCTION(t1.column4) AS alias
FROM
    table1 AS t1
    INNER JOIN table2 AS t2 ON t1.id = t2.foreign_id
    LEFT JOIN table3 AS t3 ON t1.id = t3.foreign_id
WHERE
    t1.condition1 = 'value'
    AND t2.condition2 > 100
    AND t3.condition3 IS NOT NULL
GROUP BY
    t1.column1,
    t1.column2,
    t2.column3
HAVING
    AGGREGATE_FUNCTION(t1.column4) > threshold
ORDER BY
    t1.column1 ASC,
    t2.column3 DESC
LIMIT 100
OFFSET 0;
```

## Common Query Patterns

### Basic CRUD

**Select with Filtering:**
```sql
SELECT
    u.id,
    u.name,
    u.email,
    u.created_at
FROM
    users AS u
WHERE
    u.status = 'active'
    AND u.created_at >= '2024-01-01'
ORDER BY
    u.created_at DESC
LIMIT 50;
```

**Insert with Returning:**
```sql
INSERT INTO users (name, email, status)
VALUES ('John Doe', 'john@example.com', 'active')
RETURNING id, created_at;
```

**Update with Conditions:**
```sql
UPDATE orders AS o
SET
    status = 'shipped',
    shipped_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE
    o.status = 'processing'
    AND o.created_at < CURRENT_DATE - INTERVAL '7 days'
RETURNING o.id;
```

**Safe Delete:**
```sql
-- Soft delete (preferred)
UPDATE users
SET
    deleted_at = CURRENT_TIMESTAMP,
    status = 'deleted'
WHERE
    id = 123
    AND deleted_at IS NULL;

-- Hard delete (use with caution)
DELETE FROM users
WHERE id = 123;
```

### Joins

**Multiple Joins:**
```sql
SELECT
    o.id AS order_id,
    o.order_date,
    c.name AS customer_name,
    p.name AS product_name,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS line_total
FROM
    orders AS o
    INNER JOIN customers AS c ON o.customer_id = c.id
    INNER JOIN order_items AS oi ON o.id = oi.order_id
    INNER JOIN products AS p ON oi.product_id = p.id
WHERE
    o.order_date BETWEEN '2024-01-01' AND '2024-12-31'
ORDER BY
    o.order_date DESC,
    o.id;
```

**Left Join with Coalesce:**
```sql
SELECT
    u.id,
    u.name,
    COALESCE(COUNT(o.id), 0) AS order_count,
    COALESCE(SUM(o.total), 0) AS total_spent
FROM
    users AS u
    LEFT JOIN orders AS o ON u.id = o.user_id
GROUP BY
    u.id, u.name
ORDER BY
    total_spent DESC;
```

### Aggregations

**Group By with Having:**
```sql
SELECT
    DATE_TRUNC('month', o.order_date) AS month,
    COUNT(*) AS total_orders,
    SUM(o.total) AS revenue,
    AVG(o.total) AS avg_order_value,
    COUNT(DISTINCT o.customer_id) AS unique_customers
FROM
    orders AS o
WHERE
    o.status = 'completed'
GROUP BY
    DATE_TRUNC('month', o.order_date)
HAVING
    SUM(o.total) > 10000
ORDER BY
    month DESC;
```

**Window Functions:**
```sql
SELECT
    p.category,
    p.name,
    p.price,
    RANK() OVER (PARTITION BY p.category ORDER BY p.price DESC) AS price_rank,
    AVG(p.price) OVER (PARTITION BY p.category) AS category_avg_price,
    p.price - AVG(p.price) OVER (PARTITION BY p.category) AS diff_from_avg
FROM
    products AS p
WHERE
    p.status = 'active';
```

### Subqueries and CTEs

**Common Table Expression (CTE):**
```sql
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        SUM(total) AS revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE_TRUNC('month', order_date)
),
sales_growth AS (
    SELECT
        month,
        revenue,
        LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
        revenue - LAG(revenue) OVER (ORDER BY month) AS growth
    FROM monthly_sales
)
SELECT
    month,
    revenue,
    prev_month_revenue,
    growth,
    ROUND(growth * 100.0 / NULLIF(prev_month_revenue, 0), 2) AS growth_percent
FROM sales_growth
ORDER BY month DESC;
```

**Correlated Subquery:**
```sql
SELECT
    c.id,
    c.name,
    (
        SELECT MAX(o.order_date)
        FROM orders AS o
        WHERE o.customer_id = c.id
    ) AS last_order_date,
    (
        SELECT COUNT(*)
        FROM orders AS o
        WHERE o.customer_id = c.id
    ) AS order_count
FROM
    customers AS c
WHERE
    c.status = 'active';
```

### Performance Optimization

**Using Indexes Effectively:**
```sql
-- Good: Index on user_id will be used
SELECT * FROM orders WHERE user_id = 123;

-- Bad: Function prevents index use
SELECT * FROM orders WHERE YEAR(created_at) = 2024;

-- Good: Range query uses index
SELECT * FROM orders WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

**Pagination with Keyset:**
```sql
-- Keyset pagination (more efficient than OFFSET for large datasets)
SELECT
    id,
    name,
    created_at
FROM users
WHERE created_at < '2024-06-15 10:30:00'
ORDER BY created_at DESC
LIMIT 20;
```

**EXISTS vs IN:**
```sql
-- Use EXISTS for better performance with subqueries
SELECT c.id, c.name
FROM customers AS c
WHERE EXISTS (
    SELECT 1
    FROM orders AS o
    WHERE o.customer_id = c.id
    AND o.order_date >= CURRENT_DATE - INTERVAL '30 days'
);
```

## Notes

- Always use parameterized queries to prevent SQL injection
- Test queries with EXPLAIN ANALYZE before production
- Consider database-specific optimizations (PostgreSQL, MySQL, etc.)
- Index columns used in WHERE, JOIN, and ORDER BY clauses
- Avoid SELECT * in production code
- Use transactions for multiple related operations
- Consider query caching for frequently accessed data
- Monitor slow query logs for optimization opportunities
- Use appropriate data types for columns
- Normalize data to reduce redundancy, denormalize for read performance
