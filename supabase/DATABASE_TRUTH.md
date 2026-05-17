# 1SPA DATABASE TRUTH (VERSION 1.1 - LIVE SYNC)

> **IMPORTANT:** This document is the SINGLE SOURCE OF TRUTH for the 1SPA database schema. ALL AI agents and developers MUST reference this before writing any SQL, Types, or API logic.

## 1. Authentication & Roles (CRITICAL)
- **Table:** `profiles`
- **Column `role`:** Enforced by PostgreSQL CHECK constraint — values are **STRICTLY LOWERCASE**: `admin`, `business`, `user`
- **⚠️ NEVER use Title Case** (`Admin`, `Business`) — it will violate the CHECK constraint and cause runtime errors.
- **Comparison Logic:** Use `.eq('role', 'admin')` or `.eq('role', 'business')` directly — no `.toLowerCase()` needed since DB enforces lowercase.

### Correct usage examples:
```typescript
// ✅ CORRECT
{ role: 'business' }
{ role: 'admin' }
.eq('role', 'admin')

// ❌ WRONG — violates CHECK constraint
{ role: 'Business' }
{ role: 'Admin' }
```

## 2. Business Categories
- **Enum `business_category`:** `Spa`, `Beauty`, `Dental`. (**STRICT PILLARS — Title Case**)
- **Constraint:** Any attempt to use `Clinic`, `Medical`, `Salon`, etc., will be normalized to the closest pillar above.

## 3. Landing Page States
- **Column `status`:** `Draft`, `Published`.
- **Column `draft_json`:** Used for auto-save and editing without affecting the live site.
- **Column `content_json`:** Used for the LIVE rendered version.

## 4. Master Schema Reference (JSON)
The full metadata and column definitions are stored in:
`supabase/MASTER_DATABASE_SCHEMA.json`

## 5. View: `active_landing_pages`
Use this view for **all public fetching**! It pre-joins:
- `landing_pages`
- `business_profiles`
- `profiles` (for subscription status)

This view is safe to query with the **anon key** — no service role key needed.

## 6. Prohibited Practices
- DO NOT use hardcoded IDs for categories.
- DO NOT use Title Case for role values (`'Admin'`, `'Business'`) — **use lowercase only**.
- DO NOT query `active_landing_pages` with service role key — anon key is sufficient.
- DO NOT ignore the `Draft` state when updating business content.

---
*Last Updated: 2026-05-17 — Fixed critical role casing error (Title Case → lowercase)*
