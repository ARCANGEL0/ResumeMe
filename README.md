<div align="center">

# ✨📝 ResumeMe 

### A simple, modern CV builder that makes writing your resume easy.

[![Stars](https://img.shields.io/github/stars/ARCANGEL0/ResumeMe?style=for-the-badge&color=353535)](https://github.com/ARCANGEL0/ResumeMe)
[![Watchers](https://img.shields.io/github/watchers/ARCANGEL0/ResumeMe?style=for-the-badge&color=353535)](https://github.com/ARCANGEL0/ResumeMe)
[![Forks](https://img.shields.io/github/forks/ARCANGEL0/ResumeMe?style=for-the-badge&color=353535)](https://github.com/ARCANGEL0/ResumeMe/fork)
[![Repo Views](https://komarev.com/ghpvc/?username=ResumeMe&color=353535&style=for-the-badge&label=REPO%20VIEWS)](https://github.com/ARCANGEL0/ResumeMe)
[![License](https://img.shields.io/badge/License-MIT-223355.svg?style=for-the-badge)](LICENSE)
[![](https://img.shields.io/badge/Live%20Demo-brightgreen?style=for-the-badge)](https://cv.arcangelo.net)
[![GitHub issues](https://img.shields.io/github/issues/ARCANGEL0/ResumeMe?style=for-the-badge&color=3f3972)](https://github.com/ARCANGEL0/ResumeMe/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/ARCANGEL0/ResumeMe?style=for-the-badge&color=3f3972)](https://github.com/ARCANGEL0/ResumeMe/pulls)
[![GitHub last commit](https://img.shields.io/github/last-commit/ARCANGEL0/ResumeMe?style=for-the-badge&color=3f3972)](https://github.com/ARCANGEL0/ResumeMe/commits/main)

</div>

---

## ⌞ About ResumeMe ⌝

ResumeMe is a small, web app that helps you build a clean resume fast and easily, with some features such as:

- 🌍 **48+ Languages** — Multilingual provider that allows you to swap multiple languages for your resume.
- 🎨 **15+ Premium Templates** — Modern, Classic, Minimal, Creative, Professional, Executive, and more. All print-ready A4 format (More to be added futurely).
- ⚡ **Live Preview** — Type on the left, see your CV update in real-time on the right. No refresh needed.
- 🧩 **Smart Sections** — Add, remove, and reorder sections with drag-and-drop. Customize every part of your CV.
- 📄 **One-Click PDF Export** — Download a print-ready A4 PDF in seconds. No watermarks, no paywalls, it generates HTML to PDF directly.
- 💾 **Auto-Save** — Your CV is saved automatically in your browser. Never lose your work.
- 🎯 **Zero Backend** — No signup, no database, no tracking. Your data stays on your device.

---

## 🚀 Quick Start

> Prerequisites: [Node.js 18+](https://nodejs.org) installed on your machine.

```bash
# Clone the repository
git clone https://github.com/ARCANGEL0/ResumeMe.git
cd ResumeMe

# Install dependencies
npm install

# Start the development server 
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to start building your CV ✨

---

## ⏾ Project structure

Built with a modular, maintainable codebase designed for easy scaling and contribution:

```
ResumeMe/
├── public/                    # Static assets
│   └── vite.svg
│
├── src/
│   ├── components/
│   │   ├── editor/            # Editing experience
│   │   │   ├── EditorPanel.tsx
│   │   │   ├── PersonalInfoEditor.tsx
│   │   │   └── SectionEditor.tsx
│   │   │
│   │   ├── preview/           # Handlers for CV preview
│   │   │   ├── PreviewPanel.tsx
│   │   │   └── getTemplate.tsx
│   │   │
│   │   ├── templates/         # 🎨 Templates
│   │   │   ├── TemplateDocument.tsx
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── templateComponents.tsx
│   │   │   ├── templateCatalog.ts
│   │   │   ├── templateLayout.ts
│   │   │   ├── templateUtils.ts
│   │   │   ├── Atlas.tsx
│   │   │   ├── Classic.tsx
│   │   │   ├── Creative.tsx
│   │   │   ├── Dossier.tsx
│   │   │   ├── Editorial.tsx
│   │   │   ├── Executive.tsx
│   │   │   ├── Ivory.tsx
│   │   │   ├── Minimal.tsx
│   │   │   ├── Modern.tsx
│   │   │   ├── North.tsx
│   │   │   ├── Professional.tsx
│   │   │   ├── Slate.tsx
│   │   │   ├── Studio.tsx
│   │   │   ├── Summit.tsx
│   │   │   └── Zenith.tsx
│   │   │
│   │   ├── landing/           # 🚀 Landing page 
│   │   │   └── LandingPage.tsx
│   │   │
│   │   └── ui/                # ✶ Some reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── LanguageSelector.tsx
│   │
│   ├── store/                 #   State management (Currently I'm using zustand)
│   │   └── cvStore.ts
│   │
│   ├── types/                 # ✦ TypeScript defs
│   │   └── cv.ts
│   │
│   ├── utils/                 # 🛠️  Utilities for html2pdf 
│   │   └── pdfExport.ts
│   │
│   ├── locale/                # 🌍 Translations using i18n.ts
│   │   ├── en/
│   │   │   └── locale.json
│   │   ├── pt/
│   │   │   └── locale.json
│   │   ├── es/
│   │   │   └── locale.json
│   │   └── ... (48 languages)
│   │
│   ├── App.tsx                # 🏠 Main app
│   ├── main.tsx               
│   ├── i18n.ts                 
│   └── index.css              # 🎨 styles
│
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js

```

---

## ⊹ ࣪ ˖ Tech Stack

[![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.3+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand%20-%23EC407A?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![html2pdf.js](https://img.shields.io/badge/html2pdf.js%20-blue?style=for-the-badge)](https://github.com/eKoopmans/html2pdf.js)

---


## ⭐ Star This Repo

If you find ResumeMe useful, please consider starring the repo! :)

[![Star Repo](https://img.shields.io/badge/⭐%20Star%20on%20GitHub-grey?style=flat-square)](https://github.com/ARCANGEL0/ResumeMe/stargazers)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##

<br> 

 
<div align="center">

[⬆ Back to top](#resumeme--build-cvs-that-get-you-hired)

## ❤️ Support

 ### if you enjoy the project and want to support future development:

[![Star on GitHub](https://img.shields.io/github/stars/ARCANGEL0/ResumeMe?style=social)](https://github.com/ARCANGEL0/EVA)
[![Follow on GitHub](https://img.shields.io/github/followers/ARCANGEL0?style=social)](https://github.com/ARCANGEL0)
<br>

<a href='https://ko-fi.com/J3J7WTYV7' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
<br>
<strong>Hack the world. Byte by Byte.</strong> ⛛ <br>
𝝺𝗿𝗰𝗮𝗻𝗴𝗲𝗹𝗼 @ 2026


</div>
 
 
