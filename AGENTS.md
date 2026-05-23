# AGENTS.md - Change Tracking Protocol

## How to Track Changes

Every time a route, component, or configuration is modified, update the following files:

### 1. `CHANGELOG.md`
This is the master change log. Add new entries at the top under the current date section. Use the format below for each change.

**Format for each change:**
```markdown
### [Date] - [Brief Description]
- **File:** `path/to/file.ts`
- **Change:** What was changed and why
- **Old:** Previous value/path
- **New:** New value/path
```

### 2. Git Commits
Always write descriptive commit messages that include:
- The phase or feature being worked on
- The specific routes or files changed
- Example: `Phase A: Rename /login to /logga-in and update all references`

## Current Route Map

| Route | Path | Type |
|-------|------|------|
| Home | `/` | Static |
| Login | `/logga-in` | Static |
| Sign Up | `/skapa-konto` | Static |
| Forgot Password | `/glomt-losenord` | Static |
| Profile | `/min-profil` | Static |
| Change Password | `/change-password` | Static |
| Checklists | `/checklistor` | Static |
| Finalized Checklists | `/checklistor/finalized` | Static |
| Forum | `/forum` | Static |
| Forum Thread | `/forum/[id]` | Dynamic |
| My Threads | `/forum/mina-amnen` | Static |
| Name Tinder | `/barnnamn/swajp` | Static |
| Matched Names | `/barnnamn/swajp/matchade` | Static |
| Shared Names | `/barnnamn/swajp/delad/[token]` | Dynamic |
| Weekly Hub | `/gravid/vecka/[week]` | Dynamic |
| Weekly Article: Barn | `/gravid/vecka/[week]/barn/[slug]` | Dynamic (planned) |
| Weekly Article: Mamma | `/gravid/vecka/[week]/mamma/[slug]` | Dynamic (planned) |
| Weekly Article: Partner | `/gravid/vecka/[week]/partner/[slug]` | Dynamic (planned) |
| Search | `/sok` | Dynamic |
| Category | `/[category]` | SSG (graviditet, frlossning, mat-och-kostrd, efter-frlossning) |
| Article | `/[category]/[slug]` | Dynamic |
| Weekly Question | `/weekly-question/[id]` | Dynamic |
| Verify Account | `/verifiera-konto` | Static |
| Account Created | `/konto-skapat` | Static |
| Contact Us | `/contact-us` | Static |
| Resend Verify Email | `/resend-verify-email` | Static |
| Auth Reset Password | `/auth/reset-password` | Static |
| Auth Verify Email | `/auth/verify-email` | Redirects to `/konto-skapat` |
| API Auth | `/api/auth/[...nextauth]` | API |

## Key Files to Check When Modifying Routes

1. **`src/middleware.ts`** — Auth guards and route matching
2. **`next.config.ts`** — Redirects and image config
3. **`src/components/layout/Header.tsx`** — Primary navigation links
4. **`src/components/layout/Footer.tsx`** — Footer links
5. **`src/components/layout/NavBar.tsx`** — Category navigation
6. **`src/utlis/authOptions.ts`** — NextAuth page configuration
7. **`src/lib/axios.ts`** — 401 redirect behavior

## Build Verification

After any route change, run:
```bash
npm run build
```
Ensure zero errors before considering the change complete.
