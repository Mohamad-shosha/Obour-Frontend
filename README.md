# 🧭 Obour Platform — Frontend

**Obour Platform Frontend** is a modern, premium web application that brings the platform's intelligent evaluation system to life.
It serves as the visual and interactive face of Obour — delivering a seamless, beautiful, and responsive experience for students, teachers, and administrators.

Built with **Angular 14**, the frontend communicates with the Obour Backend APIs to present psychological and academic evaluations, real-time results, and a rich administrative dashboard — all within a stunning, world-class UI.

---

## 🚀 Overview

The **Obour Frontend** is engineered to be more than just a web interface — it's an experience.
From animated backgrounds and glassmorphism cards to smooth GSAP-powered scroll animations, every detail is crafted to inspire confidence and comfort in users navigating through their evaluations.

It ensures:

- **Elegance:** Premium design with curated palettes, gradients, and micro-animations.
- **Performance:** Optimized production builds via Angular CLI for fast load times.
- **Accessibility:** RTL (Right-to-Left) layout support for Arabic-speaking users.
- **Reliability:** Clean route architecture with guard-based navigation and role awareness.
- **Scalability:** Modular component-driven structure ready for future feature expansion.

---

## ⚙️ Key Features

- 🎨 **Premium UI/UX:** Glassmorphism design, gradient meshes, animated floating shapes, and dynamic micro-animations.
- 🔐 **Authentication Pages:** Login and registration forms with clean validation and smooth transitions.
- 🧠 **Psychological Evaluation:** Guided multi-section questionnaire flow with live progress indicators.
- 📚 **Academic Evaluation:** Knowledge-based quiz sections with multiple-choice questions and instant feedback.
- 📊 **Results Dashboard:** Comprehensive evaluation results with animated progress circles and section breakdowns.
- 🗂️ **Quiz Selection:** Browse and launch available evaluation sections with a beautifully designed card layout.
- 🛡️ **Admin Dashboard:** Full-featured management panel for users, questions, sections, and platform statistics.
- 🌙 **Dark-themed Footer & Header:** Consistent and branded navigation across all public pages.
- 📱 **Fully Responsive:** Optimized for desktop, tablet, and mobile devices.
- 🎬 **GSAP Animations:** Scroll-triggered entrance animations powered by GreenSock for a polished feel.

---

## 🧩 Application Architecture

The frontend follows Angular's best practices for a clean, scalable structure:

- **Pages Layer:** Standalone page components (`Home`, `Auth`, `Evaluation`, `AdminDashboard`, `About`) each with dedicated HTML, SCSS, and TypeScript files.
- **Shared Components Layer:** Reusable UI components (`Header`, `Footer`, `StatCard`, `ProgressCircle`, `ProgressBar`, `ChartCard`, `BackgroundShapes`) used across multiple pages.
- **Routing Layer:** `AppRoutingModule` with route-level data (`hideHeader`, `hideFooter`) for intelligent layout control — no manual URL checking required.
- **Service Layer:** Angular services managing HTTP communication with the Spring Boot backend APIs.
- **Styles Layer:** Global `styles.scss` with design tokens (CSS variables), utility classes, and animation keyframes shared across the entire app.

---

## 🗂️ Pages & Screens

| Page | Route | Description |
|---|---|---|
| Home | `/home` | Landing page with hero, features, and CTA sections |
| About | `/about` | Platform overview and team information |
| Auth | `/auth` | Login and registration with JWT-based flow |
| Evaluation Categories | `/evaluation` | Browse psychological and academic evaluation sections |
| Quiz Selection | `/evaluation/sections/:id` | Select a sub-section to begin testing |
| Quiz Test | `/evaluation/test/:id` | Full-screen immersive test experience |
| Evaluation Results | `/evaluation/results` | Detailed score breakdown and readiness report |
| Evaluation About | `/evaluation/about` | Information about the evaluation process |
| Admin Dashboard | `/admin/dashboard` | Management panel for admins and teachers |

---

## 🧠 Technologies & Tools

Built on a modern Angular ecosystem with a focus on visual quality and development efficiency:

- **Framework:** Angular 14
- **Language:** TypeScript 4.7
- **Styling:** SCSS with CSS Custom Properties (Design Tokens)
- **Animations:** GSAP (GreenSock Animation Platform) with ScrollTrigger
- **UI Library:** Bootstrap 5.3 + Bootstrap Icons
- **HTTP Client:** Angular `HttpClientModule` for REST API integration
- **Routing:** Angular Router with lazy-aware route data
- **Icons:** Bootstrap Icons + Font Awesome 6
- **Additional Libraries:** AOS, Animate.css, CountUp.js, SweetAlert2
- **Build Tool:** Angular CLI 14
- **Web Server:** Nginx (production deployment)
- **Containerization:** Docker with multi-stage build (Node.js → Nginx)

---

## 🧩 Skills Demonstrated

The **Obour Platform Frontend** reflects a wide range of modern frontend engineering practices:

- Component-driven development with Angular's declarative template syntax
- Advanced SCSS architecture with design tokens and utility-first patterns
- GSAP scroll-triggered animations and timeline choreography
- RTL layout support and Arabic-first content design
- Angular routing best practices with route data for dynamic layout control
- Reactive programming with RxJS Observables for API communication
- Glassmorphism and premium UI design patterns
- Docker multi-stage builds for optimized production images
- Nginx configuration for Angular SPA client-side routing
- Responsive design with Bootstrap grid and custom breakpoints

---

## 🎯 Mission & Vision

The **Obour Frontend** was designed to ensure that every student, teacher, and administrator feels the platform is truly built for them.

Every screen respects the user's language (Arabic-first), their emotional state (calm, non-intimidating design), and their time (fast, focused interactions without unnecessary clutter).

The name *Obour* (meaning "crossing" or "transition") is reflected in the interface itself — every page transition, animation, and interaction is designed to feel like a smooth, confident step forward.

The frontend ensures:

- **Inclusivity:** RTL support and accessible design for Arabic-speaking users across the region.
- **Confidence:** Clean, professional aesthetics that make evaluations feel trustworthy and fair.
- **Engagement:** Interactive animations and micro-responses that keep users engaged without distraction.
- **Clarity:** Information-dense dashboards that remain simple and scannable.

---

## 💡 Long-Term Impact

As Obour Platform grows, the frontend is architected to evolve alongside it:

- New evaluation types (behavioral, emotional intelligence) can be added as new routes and modules.
- The shared component library can grow into a full internal design system.
- The admin dashboard is designed to accommodate deeper analytics visualizations.
- The routing and layout system supports adding protected routes and permission-based features with minimal refactoring.

The frontend is **not just a view layer** — it's the bridge between complex backend intelligence and the human beings who need it most.

---

## 🔮 Future Enhancements

The next evolution of the **Obour Frontend** will introduce:

- 📊 **Interactive Charts & Analytics:** Visual performance trends using Chart.js or D3.js.
- 🌐 **i18n Internationalization:** Full multi-language support beyond Arabic and English.
- 📱 **Progressive Web App (PWA):** Offline support and installable app experience.
- 🤖 **AI-driven Feedback UI:** Personalized insights and recommendations presented after each evaluation.
- ☁️ **CI/CD Pipeline:** Automated builds and deployments via GitHub Actions to cloud infrastructure.
- 🎨 **Theme Customization:** Light/Dark mode toggle with persisted user preference.

---

## 🐳 Running with Docker

To run the full platform (Frontend + Backend + Database) using Docker Compose:

```bash
# From the project root (Obour-Platform/)
docker-compose up -d --build
```

The frontend will be available at: **http://localhost:4200**

---

## 💻 Running Locally (Development)

```bash
# Navigate to the frontend directory
cd Obour-Frontend/Obour-Frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The development server will run at: **http://localhost:4200**

---

## 📖 Summary

The **Obour Platform Frontend** is where intelligence meets elegance.
It transforms complex backend data — scores, sections, user roles, evaluation results — into a clear, beautiful, and human-centered experience.

Built with Angular 14 and powered by GSAP animations, it delivers a world-class interface that respects the user's culture, language, and emotional journey.

By combining **technical precision** with **design empathy**, the Obour Frontend represents a new standard in educational technology for the Arab world —
**a platform that is as beautiful as it is powerful.**
