# Technical Assessment

An interactive 65-question technical assessment built with AstroJS, React, and Tailwind CSS to evaluate candidates for IC4 Software Engineer - Back End position.

## Structure

The assessment is divided into two phases:

### Phase 1: DSA & Design Patterns (Q1-55)

- **Section A**: Time & Space Complexity (Q1-10)
- **Section B**: Data Structures (Q11-25)
- **Section C**: Algorithms (Q26-40)
- **Section D**: Design Patterns (Q41-55)

### Phase 2: Platform (Q56-65)

- **Section E**: System Design & Architecture (Q56-65)

## Features

- **65 Multiple Choice Questions** across 5 sections in 2 phases
- **Instant Feedback**: Correct/incorrect indication with detailed explanations
- **Question Navigator**: Jump to any question, see progress at a glance
- **Code Blocks**: Questions with code snippets are properly formatted
- **Results Summary**: Overall score, phase breakdown, and section-level scores
- **IC Level Assessment**: Assessed IC level (IC1–IC4) based on overall score

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── Quiz.tsx          # Main quiz component
├── data/
│   └── questions.ts      # All 65 questions with answers & phase definitions
├── layouts/
│   └── Layout.astro      # Base HTML layout
├── lib/
│   └── utils.ts          # Utility functions (cn helper)
├── pages/
│   └── index.astro       # Main page
└── styles/
    └── globals.css       # Global styles with CSS variables
```

## Tech Stack

- **Framework**: [Astro](https://astro.build/) with React integration
- **UI**: React with Tailwind CSS
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Tailwind CSS with CSS custom properties

## IC Level Assessment

| IC Level | Score Range | Title |
|----------|------------|-------|
| IC1 | 0–22 / 65 (0–34%) | Junior Engineer |
| IC2 | 23–41 / 65 (35–64%) | Mid-Level Engineer |
| IC3 | 42–54 / 65 (65–84%) | Senior Engineer |
| IC4 | 55–65 / 65 (85–100%) | Staff Engineer |
