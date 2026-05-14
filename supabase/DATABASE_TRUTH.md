# 1SPA DATABASE TRUTH (VERSION 1.0 - LIVE SYNC)

> **IMPORTANT:** This document is the SINGLE SOURCE OF TRUTH for the 1SPA database schema. ALL AI agents and developers MUST reference this before writing any SQL, Types, or API logic.

## 1. Authentication & Roles (CRITICAL)
- **Table:** `profiles`
- **Enum `user_role`:** `Admin`, `Business` (**MUST USE TITLE CASE**)
- **Comparison Logic:** Always use `.toLowerCase() === 'admin'` or similar to avoid casing bugs.

## 2. Business Categories
- **Enum `business_category`:** `Spa`, `Beauty`, `Dental`. (**STRICT PILLARS**)
- **Constraint:** Any attempt to use `Clinic`, `Medical`, `Salon`, etc., will be normalized to the closest pillar above.

## 3. Landing Page States
- **Column `status`:** `Draft`, `Published`.
- **Column `draft_json`:** Used for auto-save and editing without affecting the live site.
- **Column `content_json`:** Used for the LIVE rendered version.

## 4. Master Schema Reference (JSON)
The full metadata and column definitions are stored in:
`supabase/MASTER_DATABASE_SCHEMA.json`

## 5. View: `active_landing_pages`
Use this view for public fetching! It pre-joins:
- `landing_pages`
- `business_profiles`
- `profiles` (for subscription status)

## 6. Prohibited Practices
- DO NOT use hardcoded IDs for categories.
- DO NOT use lowercase `admin` or `business` in direct DB filters (e.g. `.eq('role', 'admin')` will return ZERO results).
- DO NOT ignore the `Draft` state when updating business content.

---
*Last Updated: 2026-05-12*
