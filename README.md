# FBB Workout Generator App

A Next.js app that generates your daily FBB workout based on your 6-week training cycle.

## Features

- Automatically calculates which week and day you're in
- Date picker to view any date's workout
- Download workouts as text files
- Built with Next.js, React, and Tailwind CSS

## Local Development

### Prerequisites
- Node.js (v16 or higher) - [Install](https://nodejs.org/)
- Git - [Install](https://git-scm.com/)

### Setup

1. Clone this repository to your computer
2. Open terminal/command prompt in the project folder
3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Deploy to Vercel

### Option 1: Connect GitHub (Easiest)

1. **Create a GitHub account** (if you don't have one): https://github.com/signup

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it `fbb-workout-app`
   - Click "Create repository"

3. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/fbb-workout-app.git
   git push -u origin main
   ```
   (Replace `YOUR-USERNAME` with your actual GitHub username)

4. **Deploy to Vercel**:
   - Go to https://vercel.com/signup
   - Sign up with GitHub
   - Click "Import Project"
   - Select your `fbb-workout-app` repository
   - Click "Import"
   - Vercel will automatically deploy!

5. Your app will be live at a URL like: `https://fbb-workout-app.vercel.app`

### Option 2: Direct Upload to Vercel

1. Go to https://vercel.com/new
2. Drag and drop this project folder
3. Vercel will build and deploy automatically

## Updating Your App

After you deploy to Vercel:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update workouts"
   git push
   ```
3. Vercel will automatically redeploy!

## File Structure

```
├── pages/
│   ├── _app.js
│   └── index.js
├── styles/
│   └── globals.css
├── app.jsx              # Main component
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Customization

- **Workouts**: Edit the `workoutData` object in `app.jsx` to add more weeks
- **Colors/Styling**: Modify Tailwind classes in `app.jsx`
- **Cycle Start Date**: Change `new Date(2025, 9, 6)` in the `calculateCyclePosition` function to match your cycle start

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Tailwind Docs: https://tailwindcss.com/docs
