# Technical Assessment

An interactive 55-question technical assessment built with AstroJS, React, and Tailwind CSS to evaluate candidates for IC4 Software Engineer - Back End position.

## Structure

The assessment is divided into two phases:

### Phase 1: DSA & Design Patterns (Q1-45)

- **Section A**: Time & Space Complexity (Q1-10)
- **Section B**: Data Structures (Q11-20)
- **Section C**: Algorithms (Q21-30)
- **Section D**: Design Patterns (Q31-45)

### Phase 2: Platform (Q46-55)

- **Section E**: System Design & Architecture (Q46-55)

## Features

- **55 Multiple Choice Questions** across 5 sections in 2 phases
- **Instant Feedback**: Correct/incorrect indication with detailed explanations
- **Question Navigator**: Jump to any question, see progress at a glance
- **Code Blocks**: Questions with code snippets are properly formatted
- **Results Summary**: Overall score, phase breakdown, and section-level scores

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
│   └── questions.ts      # All 55 questions with answers & phase definitions
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

## Scoring Guide

| Score | Level |
|-------|-------|
| 45-55 (82%+) | Strong candidate |
| 35-44 (64-81%) | Meets expectations with some gaps |
| Below 35 (<64%) | Does not meet expectations |
