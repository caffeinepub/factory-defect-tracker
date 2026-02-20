# Specification

## Summary
**Goal:** Create a manufacturing defect reporting application where employees can submit and view defect reports across five production departments.

**Planned changes:**
- Build backend data model for defect reports with fields: unique ID, product name, department, description, optional photo reference, employee identifier, and timestamp
- Implement backend endpoints to create, retrieve, and filter defect reports by department or product
- Create frontend form for submitting defect reports with product name input, department dropdown (cutting/machining/assembly/painting/embossing), description text area, and optional photo upload
- Display list view of all defect reports showing product name, department, description, timestamp, and photo thumbnails with department filter
- Handle photo uploads as static assets in frontend/public/assets/uploads
- Design clean, professional UI with manufacturing-appropriate color scheme (avoiding blue and purple), clear typography, and intuitive layout

**User-visible outcome:** Employees can quickly submit defect reports with text descriptions and optional photos, and view a filterable list of all submitted defects organized by department.
