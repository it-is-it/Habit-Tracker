# Habit Tracker & Daily Planner Web App

A modern, fast, and responsive Habit Tracker web application built with **React** and **Vite**, styled using **Tailwind CSS**.  
Track your daily habits, set goals, and improve your productivity effortlessly.

---

## Demo

Check the live app here: [Habit Tracker & Daily Planner Web App](https://it-is-it.github.io/Habit-Tracker/)

---

## Features

- Create, update, and delete habits
- Mark habits as completed for each day
- View your progress over time
- Responsive design for desktop and mobile
- Built with Vite for lightning-fast development and builds
- Tailwind CSS for clean and customizable styling

---

## Tech Stack

- React
- Vite
- Tailwind CSS
- TypeScript
- GitHub Pages for deployment

---

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Clone the repo

```bash
git clone https://github.com/it-is-it/Habit-Tracker.git
cd Habit-Tracker
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser to view the app

---

## Build and Deployment

### Build the app

```bash
npm run build
```

### Deploy to GitHub Pages

Make sure you have `gh-pages` installed and configured in your `package.json`:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Then run:

```bash
npm run deploy
```

---

## Configuration

Make sure the `base` property in `vite.config.js` is set correctly:

```js
export default defineConfig({
  base: "/Habit-Tracker/",
  plugins: [react(), tailwindcss()],
});
```

This ensures correct routing and asset loading on GitHub Pages.
