# Production implementation notes

## USDT rate settings
Store rates as versioned records with asset, chain, buy_rate, sell_rate, fee/spread,
minimum/maximum order, effective_at, expires_at, changed_by and audit metadata. Use decimal-safe
numeric types or scaled integers, never JavaScript floating point for settlement calculations.
Lock a quoted rate to each order for its validity window. Restrict edits to authorized roles.

## Notifications and offer banners
Store notification title/body/type, audience criteria, optional object-storage image URL,
created_by, schedule time, delivery state and per-user delivery/read records. Upload images to
private or public object storage through a signed upload flow; validate MIME type, size and scan
files. Do not store arbitrary uploaded binary data in a database row. Log who sent what and to whom.

## Role-based access control
The browser permission matrix is only a visual demo. Enforce permissions server-side on every
endpoint and action. Only Owner/Head should have the grant/revoke permission for roles; prevent
self-escalation, prevent removal of the last active Owner, and audit every change. Use MFA,
short-lived sessions, invitation expiry and account suspension. Partner/Agent roles should be
scoped to their own partner, assigned users or portfolio.

## Receipt alerts
Queue an alert when a receipt is uploaded and order remains pending after the configured review
interval. Alert is not a payment verification. Reconcile with authorized provider records before
approval or ledger credit.
