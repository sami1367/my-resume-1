# Bilingual resume website

Run `npm install` once, then:

```bash
npm run start:dev
```

Open **http://localhost:4000**. Use the **English / فارسی** links at the top to switch languages. Both pages run together: `/en/` reads `resumes/resume.en.json`, and `/fa/` reads `resumes/resume.fa.json`. Refresh after saving JSON changes. Stop an existing preview on port 4000 first, or use `PORT=4001 npm run start:dev`.

To generate both languages together as a static website, run `npm run build:site`. The output is in `dist/`, ready to serve with any static web server. The JSON editor remains available separately with `npm run editor` on port 3000.

## Fonts for the website and PDFs

Both languages use the bundled **Vazirmatn** font (Persian and Latin characters), with regular (400), semibold (600), and bold (700) weights. Font data is embedded in the website HTML and local PDF themes, so font loading needs no internet connection. The website keeps the Even layout for English; English PDFs keep Modern Classic. Persian keeps its RTL layout.

Use the local PDF theme paths in the commands below to retain embedded fonts. After a font change, restart the website, rebuild static pages with `npm run build:site`, and regenerate PDFs. Existing PDFs do not update automatically. Font files and the OFL license are in `themes/modern-classic-fa/fonts/`; shared embedding code is in `themes/fonts.js`.

# Local resume editor

Run `npm install` once, then start the editor:

```bash
npm run editor
```

Open **http://localhost:3000**. No login is required; the server listens only on your computer.

- Select any JSON file in `resumes/`.
- Use **Form editor** to edit fields, add optional fields and list items, or remove entries. Fields support Persian and English text.
- Switch to **JSON** for direct editing, custom fields, or rearranging entries.
- Click **Save changes** (or press Cmd/Ctrl+S) to validate against `schema.json` and save to the original file.
- **Reload from disk** discards edits after confirmation. If a file changes in your IDE, saving reports a conflict so you can copy your pending edits before reloading.

Files remain independent. Saving does not regenerate PDFs or synchronize language variants; use the commands below afterward. Newly added JSON files appear after refreshing the page. Set `PORT=3001 npm run editor` to use another port.

Run `node editor/check.cjs` for the editor's local API checks (port 3000 must be free).

---

# راهنمای ساخت PDF رزومه

دو نوع سند، هرکدام به فارسی و انگلیسی، نگهداری می‌شود:

| نوع | انگلیسی | فارسی |
| --- | --- | --- |
| CV کامل: سوابق، پروژه‌ها، دوره‌ها و علایق | [resumes/cv.en.json](resumes/cv.en.json) | [resumes/cv.fa.json](resumes/cv.fa.json) |
| رزومه کوتاه: معرفی، سوابق منتخب، تحصیلات، مهارت‌ها و زبان‌ها | [resumes/resume.en.json](resumes/resume.en.json) | [resumes/resume.fa.json](resumes/resume.fa.json) |

فایل [resumes/resume.json](resumes/resume.json) کپی انگلیسی رزومه کوتاه است. هنگام اجرای CLI از ریشهٔ پروژه، مسیر ورودی را با `--resume` مشخص کنید.

فایل‌های JSON در پوشهٔ `resumes/` و خروجی‌های PDF در پوشهٔ `pdfs/` نگهداری می‌شوند.

## نصب ابزارها (یک‌بار)

قالب PDF انتخاب‌شده **Modern Classic** است؛ دستورها از نسخه‌های محلی `themes/modern-classic-en` و `themes/modern-classic-fa` استفاده می‌کنند.

در ترمینال، از پوشهٔ پروژه اجرا کنید:

```bash
npm install --save-dev resume-cli jsonresume-theme-modern-classic
```

برای خروجی PDF، مرورگر موردنیاز Puppeteer را هم یک‌بار نصب کنید (یا اگر خطای «Could not find Chrome» دریافت کردید):

```bash
npx puppeteer browsers install chrome
```

## ساخت PDF بعد از هر تغییر

پس از ویرایش و ذخیرهٔ فایل‌های JSON در پوشهٔ `resumes/`، دستور موردنظر را از ریشهٔ پروژه (پوشهٔ حاوی `package.json`) اجرا کنید. پوشه‌های `resumes/` و `pdfs/` در Git نگهداری می‌شوند.

نام فایل‌های خروجی شامل نام صاحب رزومه، نوع سند و نام کامل زبان است تا هنگام ارسال هم مشخص باشند:

| سند | زبان | فایل PDF |
| --- | --- | --- |
| رزومه کوتاه | انگلیسی | [Sajad-Rahimi-Resume-English.pdf](pdfs/Sajad-Rahimi-Resume-English.pdf) |
| رزومه کوتاه | فارسی | [Sajad-Rahimi-Resume-Persian.pdf](pdfs/Sajad-Rahimi-Resume-Persian.pdf) |
| CV کامل | انگلیسی | [Sajad-Rahimi-Full-CV-English.pdf](pdfs/Sajad-Rahimi-Full-CV-English.pdf) |
| CV کامل | فارسی | [Sajad-Rahimi-Full-CV-Persian.pdf](pdfs/Sajad-Rahimi-Full-CV-Persian.pdf) |

دستورهای زیر در هر بار تولید از همین نام‌ها استفاده می‌کنند و فایل قبلی همان نسخه را جایگزین می‌کنند.

برای ساخت هر نسخه به‌صورت جداگانه:

رزومه کوتاه انگلیسی:

```bash
npx resume export pdfs/Sajad-Rahimi-Resume-English.pdf --resume resumes/resume.en.json --theme ./themes/modern-classic-en
```

رزومه کوتاه فارسی:

```bash
npx resume export pdfs/Sajad-Rahimi-Resume-Persian.pdf --resume resumes/resume.fa.json --theme ./themes/modern-classic-fa
```

CV کامل انگلیسی:

```bash
npx resume export pdfs/Sajad-Rahimi-Full-CV-English.pdf --resume resumes/cv.en.json --theme ./themes/modern-classic-en
```

CV کامل فارسی:

```bash
npx resume export pdfs/Sajad-Rahimi-Full-CV-Persian.pdf --resume resumes/cv.fa.json --theme ./themes/modern-classic-fa
```

برای ساخت همهٔ چهار PDF با یک دستور:

```bash
npx resume export pdfs/Sajad-Rahimi-Resume-English.pdf --resume resumes/resume.en.json --theme ./themes/modern-classic-en && npx resume export pdfs/Sajad-Rahimi-Resume-Persian.pdf --resume resumes/resume.fa.json --theme ./themes/modern-classic-fa && npx resume export pdfs/Sajad-Rahimi-Full-CV-English.pdf --resume resumes/cv.en.json --theme ./themes/modern-classic-en && npx resume export pdfs/Sajad-Rahimi-Full-CV-Persian.pdf --resume resumes/cv.fa.json --theme ./themes/modern-classic-fa
```

فایل‌های `pdfs/Sajad-Rahimi-Resume-English.pdf`، `pdfs/Sajad-Rahimi-Resume-Persian.pdf`، `pdfs/Sajad-Rahimi-Full-CV-English.pdf` و `pdfs/Sajad-Rahimi-Full-CV-Persian.pdf` در پوشهٔ `pdfs/` ساخته می‌شوند و با اجرای مجدد دستورها جایگزین خواهند شد. این دستورها را باید بعد از هر تغییر اجرا کنید؛ خروجی PDF خودکار به‌روز نمی‌شود.

هر چهار فایل مستقل هستند؛ تغییر یکی به‌صورت خودکار در دیگری اعمال نمی‌شود. برای ویرایش، فایل نوع سند و زبان موردنظر را انتخاب کنید. پس از تغییر `resumes/resume.en.json`، کپی آن را با دستور زیر هماهنگ کنید:

```bash
cp resumes/resume.en.json resumes/resume.json
```

CVها اطلاعات کامل قبلی را حفظ کرده‌اند. رزومه‌های کوتاه بر اساس متن جدید تهیه شده‌اند؛ در متن جدید، شاخص پاسخ زیر یک ثانیه از ۹۰٪ به ۹۵٪ و مخاطب اپلیکیشن دوم تلامالا از مدیران به فروشگاه‌ها تغییر کرده است. پیش از ارسال، این تفاوت‌ها را بررسی کنید. تعداد صفحات PDF به قالب و صفحه‌بندی بستگی دارد.

نسخه‌های فارسی از قالب محلی `themes/modern-classic-fa` با چیدمان راست‌به‌چپ، عنوان‌های فارسی و فونت وزیرمتن استفاده می‌کنند. نسخه‌های انگلیسی از قالب محلی `themes/modern-classic-en` با چیدمان Modern Classic و فونت تعبیه‌شدهٔ وزیرمتن استفاده می‌کنند.

برای تغییر ظاهر فارسی، فایل `themes/modern-classic-fa/style.css` و برای تغییر عنوان‌ها و ساختار، فایل `themes/modern-classic-fa/index.js` را ویرایش کنید. فونت داخل پوشهٔ `fonts` قرار دارد و در خروجی تعبیه می‌شود؛ تولید و نمایش PDF فارسی به دانلود فونت از اینترنت نیاز ندارد. تاریخ‌ها با نام ماه فارسی و تقویم میلادی نمایش داده می‌شوند.

مرجع: [مستندات رسمی resume-cli](https://github.com/jsonresume/resume-cli).

---

# JSON Resume Schema — MOVED

> **This repository has moved.** The JSON Resume schema specification and all
> ongoing development now live in the JSON Resume monorepo at
> **[jsonresume/jsonresume.org](https://github.com/jsonresume/jsonresume.org)**,
> under [`packages/schema`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/schema).
> This repository is archived and read-only.

## What is JSON Resume?

JSON Resume is an open-source, community-driven standard for representing a
résumé as a single structured JSON document. The schema defines the canonical
shape of a `resume.json` file — sections such as `basics`, `work`, `education`,
`skills`, `projects`, and more — so that a person's career data can be authored
once and rendered, validated, hosted, and themed by any compatible tool.

## Where things went

- **Schema spec + development:** https://github.com/jsonresume/jsonresume.org (`packages/schema`)
- **npm package:** [`@jsonresume/schema`](https://www.npmjs.com/package/@jsonresume/schema) — **unchanged**, still the package to install. It is now published from the monorepo via changesets.
- **Issues:** Please open new issues in the [monorepo](https://github.com/jsonresume/jsonresume.org/issues). Existing open issues from this repo were transferred there.
- **Homepage, registry, tooling, and themes:** also in the [monorepo](https://github.com/jsonresume/jsonresume.org).

The migration of the schema source into the monorepo landed in
[jsonresume.org#283](https://github.com/jsonresume/jsonresume.org/pull/283).
See the org consolidation tracking issue
[#275](https://github.com/jsonresume/jsonresume.org/issues/275) for background.

## Installation (unchanged)

```
npm install --save @jsonresume/schema
```
