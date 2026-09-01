# Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove repository-exposed secrets, refresh vulnerable runtime dependencies, and make repository checks target maintainable source instead of generated deployment output.

**Architecture:** Cloudflare deployment configuration will contain only public configuration and binding metadata; sensitive values will be supplied through Cloudflare Secrets or ignored local environment files. Dependency remediation will update the declared Next.js version and lockfile, while ESLint will explicitly ignore generated artifacts.

**Tech Stack:** Next.js 16, TypeScript, Cloudflare Workers/Wrangler, npm, ESLint 9.

## Global Constraints

- Never write secret values into tracked files, command output, or documentation.
- Preserve all existing user changes in the dirty working tree.
- Do not run destructive Git commands or automatically rotate external credentials without confirmed Cloudflare/Resend access.
- Verify with `npm audit --omit=dev`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`.

---

### Task 1: Remove secrets from tracked deployment configuration

**Files:**
- Modify: `wrangler.json`
- Modify: `docs/CLOUDFLARE_DEPLOYMENT.md`
- Create: `.dev.vars.example`

**Interfaces:**
- Produces Cloudflare secret names `NOTIFY_SECRET` and `RESEND_API_KEY` for deployment setup.

- [ ] **Step 1: Remove `NOTIFY_SECRET` from `wrangler.json` vars while retaining public vars and D1 metadata.**
- [ ] **Step 2: Replace secret value examples in deployment documentation with secret-store commands and placeholders that contain no credential material.**
- [ ] **Step 3: Add `.dev.vars.example` containing only empty variable-name declarations for local Wrangler development.**
- [ ] **Step 4: Confirm tracked configuration has no secret values and local env files remain ignored.**

### Task 2: Remediate vulnerable dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Keeps existing application scripts and dependency choices except for security-compatible version updates.

- [ ] **Step 1: Update Next.js to `16.3.3`, the first audit-reported fixed version in the current dependency line.**
- [ ] **Step 2: Refresh transitive vulnerable packages through npm’s audit remediation without force-changing unrelated top-level packages.**
- [ ] **Step 3: Run runtime-only and full dependency audits and record any remaining advisories for manual review.**

### Task 3: Make repository checks deterministic

**Files:**
- Modify: `eslint.config.mjs`
- Modify: `package.json`
- Modify: `src/components/Navbar.tsx`

**Interfaces:**
- `npm run lint` checks `src`, `proxy.ts`, and `next.config.ts`; generated `.next`, `.open-next`, `dist`, and Wrangler output are excluded.

- [ ] **Step 1: Add generated deployment directories to ESLint global ignores.**
- [ ] **Step 2: Change the lint script to lint application/config source explicitly rather than generated artifacts.**
- [ ] **Step 3: Remove the existing trailing whitespace reported by `git diff --check`.**

### Task 4: Verify the hardened repository

**Files:**
- No source changes expected.

- [ ] **Step 1: Run `npm audit --omit=dev --audit-level=high`.**
- [ ] **Step 2: Run `npm run lint`.**
- [ ] **Step 3: Run `npx tsc --noEmit`.**
- [ ] **Step 4: Run `npm run build`.**
- [ ] **Step 5: Inspect `git diff --check`, status, and the final diff for accidental secret exposure.**
