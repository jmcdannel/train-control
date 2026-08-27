> [!IMPORTANT]
> **This project has moved.** Active development of DEJA.js and the Track & Trestle model
> railroad platform now happens in private repositories under
> [**Track and Trestle Technology, LLC**](https://github.com/trackandtrestle).
> This repository stays public as a historical snapshot and is no longer maintained.
>
> **Current product, docs, and downloads → [dejajs.com](https://dejajs.com)**

# 🚂 Train Control (2020)

**React web throttle for DCC model railroads — the first app in this line of work.**

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" />
  <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" />
  <img src="https://img.shields.io/badge/Arduino-00878F?style=for-the-badge&logo=arduino&logoColor=white" />
</p>

A single-page React app for running trains, thrown turnouts, and layout effects from a
phone or tablet — talking to [JMRI](https://www.jmri.org/) and a DCC++ command station
through a small Node API, with Arduino sketches handling servos and accessory wiring.

## ✨ Features

- 🎚️ **Multi-loco throttle** with speed, direction, and function buttons
- 🗺️ **Conductor view** — a pan/zoom track diagram (`react-zoom-pan-pinch`,
  `react-map-interaction`) with draggable turnout controls placed on the plan
- 🔀 **Turnout control** persisted to a `turnouts.json` layout definition
- ⚡ **Power district** monitoring

## 📂 Repository layout

| Path | Contents |
|------|----------|
| `src/` | React app — throttle, conductor view, settings |
| `api/` | Node endpoint the browser posts commands to |
| `arduino/` | Sketches for turnout servos and accessory outputs |
| `jmri/` | JMRI configuration and roster files |

## ⚙️ Tech stack

React 16 · Material-UI 4 · React Router 5 · Sass · Create React App · GitHub Pages

## 🧑‍💻 Running it

```bash
npm install
npm start        # http://localhost:3000
npm run deploy   # publish to GitHub Pages
```

## 📌 Status

Complete as a 2020 proof of concept, and the direct ancestor of everything that followed.
Its two hardest lessons — that layout state belongs in a real datastore rather than a JSON
file, and that the browser should never poll the command station directly — shaped the
architecture of every project after it.

## 🧭 Where this fits

This repo is one step in a long-running line of model railroad control software:

| Era | Project | What changed |
|-----|---------|--------------|
| 2020 | [`train-control`](https://github.com/jmcdannel/train-control) | First React throttle, JMRI + Arduino over HTTP |
| 2021 | [`dctc`](https://github.com/jmcdannel/dctc) | Standalone Arduino DC controller (no computer required) |
| 2022–23 | [`layout-conductor-*`](https://github.com/jmcdannel?tab=repositories&q=layout-conductor) | Split into app + API; Python, Node, and Deno backends explored |
| 2024 | [`Track-and-Trestle-Technology-Suite`](https://github.com/jmcdannel/Track-and-Trestle-Technology-Suite) | MQTT-based monorepo: dispatcher, throttle, dashboard, action API |
| 2024–25 | [`DEJA.js`](https://github.com/jmcdannel/DEJA.js) | TypeScript/Turborepo rewrite, Firebase realtime backbone |
| 2025– | **[dejajs.com](https://dejajs.com)** (private) | Commercial cloud platform for DCC-EX |

---

<sub>Built by [Josh McDannel](https://github.com/jmcdannel) · [dejajs.com](https://dejajs.com) · [LinkedIn](https://www.linkedin.com/in/jmcdannel)</sub>
