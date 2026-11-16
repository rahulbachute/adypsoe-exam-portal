# Publishing notices on the ADYPSOE Examination Portal

Repository: `rahulbachute/adypsoe-exam-portal`  
Public register: https://rahulbachute.github.io/adypsoe-exam-portal/notices.html  
Data file: `data/notices.json`

## Publishing workflow

1. Obtain the final, approved notice or circular from the issuing authority.
2. Confirm its notice number, issue date, category, examination scheme, academic year and exact applicability.
3. Upload the approved PDF to a suitable repository folder (recommended: `documents/notices/`) or use an approved institutional public document URL.
4. Add a record to the `notices` array in `data/notices.json`.
5. Set `status` to `published` only after the notice and attachment have been checked and approved for public release. Use `draft` for records not ready for publication.
6. Commit the change and verify the notice and attachment on the live website.

## Notice record format

```json
{
  "id": "exam-2026-001",
  "notice_number": "ADYPSOE/Exam/2026/001",
  "title": "Title exactly as approved",
  "category": "Examination",
  "applicability": "B.Tech, First Year, AY 2026–27 admission batch",
  "scheme": "Autonomous",
  "academic_year": "2026–27",
  "date": "2026-11-16",
  "summary": "Short factual description of the action or information in the notice.",
  "link": "documents/notices/exam-2026-001.pdf",
  "attachments": [
    {
      "label": "Annexure",
      "url": "documents/notices/exam-2026-001-annexure.pdf"
    }
  ],
  "status": "published"
}
```

## Allowed categories

Use one of these exact category labels so that the website filters work:

- `Examination`
- `Timetable`
- `Results`
- `Student Instructions`
- `Faculty`
- `General`

## Field conventions

| Field | Requirement |
|---|---|
| `id` | Unique, stable identifier; do not reuse an existing ID |
| `notice_number` | Official number as printed on the approved notice |
| `title` | Exact or faithful short title; do not alter the meaning |
| `category` | One of the six allowed categories |
| `applicability` | Specify programme, semester, batch and other limits stated in the notice |
| `scheme` | Use `Autonomous`, `SPPU`, or a precise combined description only if the notice genuinely applies to both |
| `academic_year` | For example, `2026–27`; use the year stated in the notice |
| `date` | Issue date in `YYYY-MM-DD` format |
| `summary` | Concise factual summary; retain the full approved notice as the authority |
| `link` | Relative repository path or public HTTP(S) URL to the approved notice |
| `attachments` | Optional array of labelled, approved supporting documents |
| `status` | `draft` or `published`; only published records appear publicly |

## Public information and security

- Publish only documents approved for public access.
- Never upload question papers before the examination, answer keys under restricted access, student marksheets, personal data, confidential committee records, login credentials or internal investigation records.
- Do not publish a document merely because it is available internally. Confirm public-release authorization.
- Do not modify the substance of an approved notice when writing its title or summary.
- When a corrigendum or replacement is issued, publish the new approved communication and clearly identify the earlier notice as superseded where appropriate. Do not silently change historical notice content.
- Static GitHub Pages content is public. It does not provide access control for individual files.

## Pre-publication checklist

- [ ] Approval/public-release authorization confirmed
- [ ] Notice number and issue date checked
- [ ] Programme, semester, batch and scheme verified
- [ ] Academic year and category selected
- [ ] PDF opens and is legible
- [ ] Links and attachments tested
- [ ] JSON syntax validated
- [ ] Live notice checked after deployment

## Important operational limitation

The portal currently uses a static JSON file. Publishing or correcting a notice requires a GitHub repository update. It does not provide a secure administrative login or a web-based notice-entry form. Do not place credentials or private information in the repository.
