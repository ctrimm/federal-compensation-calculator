## 2025-05-14 - [Accessible Tooltips in Tables]
**Learning:** Tooltips in data tables are often only triggered by mouse hover, making them inaccessible to keyboard and screen reader users. Adding `tabIndex={0}`, `role="button"`, and `onFocus`/`onBlur` handlers to the trigger element (e.g., `td`) provides a robust way for keyboard users to discover and read supplemental information.
**Action:** Always check if supplemental information (tooltips, popovers) can be reached via keyboard in data-heavy components.
