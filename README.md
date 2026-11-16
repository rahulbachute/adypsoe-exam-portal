# ADYPSOE Examination Portal

Official examination information portal for Ajeenkya D Y Patil School of Engineering.

## Technology
- Static HTML, CSS and JavaScript
- GitHub Pages hosting
- Notice data stored in `data/notices.json`
- Responsive layout for desktop, tablet and mobile

## Pages
Home · Notices & Circulars · Examination Timetable · Student Corner · Faculty Corner · Autonomous Examination · Downloads · Contact Us

## Publish with GitHub Pages
1. Open repository **Settings → Pages**.
2. Under Build and deployment, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`.
4. Save and wait for the Pages deployment to complete.

Published URL: https://rahulbachute.github.io/adypsoe-exam-portal/

## Updating notices
Edit `data/notices.json`. Only entries with `"status": "published"` appear publicly. Use ISO date format `YYYY-MM-DD`. For each notice, provide a title, category, applicability, scheme, date and a public PDF link.

Example:
```json
{
  "id": "exam-2026-001",
  "title": "Semester Examination Timetable",
  "category": "Timetable",
  "applicability": "TE Mechanical Engineering",
  "scheme": "SPPU",
  "date": "2026-11-20",
  "status": "published",
  "link": "https://example.edu/notice.pdf"
}
```

## Security and governance
This is a public static website. Do not store confidential question papers, answer keys, student marks, personal records, credentials, API keys or private committee documents in this repository or public data files. Use institution-approved access-controlled systems for restricted information.

## Before official launch
- Replace the temporary ADY mark with the approved institute logo.
- Confirm official examination-section contact details.
- Add only approved notices, timetables, rules and downloadable documents.
- Verify applicability for SPPU-affiliated and autonomous batches.
- Test all links and PDFs on desktop and mobile.
- Enable GitHub Pages in repository settings.
