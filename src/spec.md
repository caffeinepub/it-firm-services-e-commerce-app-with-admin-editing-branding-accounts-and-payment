# Specification

## Summary
**Goal:** Let users and admins copy a shareable link to the current app page for easy sharing.

**Planned changes:**
- Add a customer-facing "Copy link" UI control (e.g., in the top header) that copies the current window URL (including route/hash) to the clipboard.
- Show an English success toast (e.g., "Link copied") after copying, and an English error toast (e.g., "Could not copy link") if clipboard access fails without crashing.
- Add the same "Copy link" control in the Admin Dashboard area, with the same copy behavior and toast feedback.

**User-visible outcome:** Users and admins can click "Copy link" to copy the current app URL and get a confirmation (or error) notification.
