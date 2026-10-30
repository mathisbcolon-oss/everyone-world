# EVERYONE starter

A first browser prototype for EVERYONE, built with Vite and Three.js.

## Run locally
1. Install Node.js (LTS) from https://nodejs.org/
2. In this folder run `npm install`
3. Run `npm run dev`
4. Open the local URL Vite prints.

## Deploy with GitHub + Render
1. Create a new GitHub repository named `everyone-world`.
2. Upload the contents of this folder to the repository (the files inside this folder, not the folder itself).
3. In Render choose **New + → Static Site** and connect the repository.
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Click **Create Static Site**.

This is an early front-end prototype. Builds and move counts are currently stored in the browser only. They are not shared between players yet. The next milestone is Supabase accounts and shared world persistence.
