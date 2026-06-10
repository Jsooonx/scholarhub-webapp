# ScholarHub

ScholarHub is a curated directory of global scholarships designed to help students discover and apply for opportunities to study abroad. The platform consolidates official scholarship information from various countries in one place, including detailed requirements, benefits, degree levels, and application deadlines.

---

## Key Features

- **Interactive Hero Slideshow**: Rotates through 6 featured global scholarships (DAAD, MEXT, Türkiye Burslari, Chevening, Australia Awards, and GKS) with smooth animated transitions powered by Framer Motion.
- **Advanced Filtering and Search**: Allows users to filter scholarships by provider, funding type (Fully/Partially Funded), degree level (Bachelor, Master, PhD, Associate Degree), and destination country.
- **Dynamic Deadline Status**: Automatically calculates and displays application status (Open, Closing Soon, Closed, or Rolling Intake) based on parsed real-time data.
- **Responsive Layout**: Premium, clean design optimized for both desktop and mobile viewports with custom responsive card sizing.
- **Static Site Generation (SSG)**: Built using the Next.js App Router for optimal page loading speeds and SEO performance.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router & Turbopack)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Scrolling**: Lenis (Smooth Scroll)
- **Icons**: Lucide React
- **Language**: TypeScript

---

## Project Directory Structure

```text
├── data/
│   └── scholarships.json   # Scholarship database source
├── public/
│   └── images/             # University and editorial images
└── src/
    ├── app/                # Next.js App Router pages and layouts
    ├── components/         # React components (Hero, Trending, Navbar, Footer, etc.)
    └── lib/                # Helper utilities for scholarship parsing and deadline states
```
