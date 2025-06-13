# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Starting the Application
```bash
cd pug-app
npm install  # Install dependencies (only needed once)
npm start    # Start the server on http://localhost:3000
```

## Architecture Overview

This is a Node.js portfolio website built with Express.js and Pug templating engine. The application follows a standard Express MVC structure:

### Key Components

1. **Express Application** (`pug-app/app.js`): Main application setup with middleware configuration, view engine setup (Pug), and error handling.

2. **Routing** (`pug-app/routes/index.js`): Defines all page routes:
   - `/` - Home page
   - `/about` - About page
   - `/projects` - Projects showcase
   - `/contact` - Contact form (with POST handler)

3. **Views** (`pug-app/views/`): Pug templates for each page
   - `layout.pug` - Base template with navigation and common structure
   - Individual page templates extend the layout

4. **Styling** (`pug-app/public/stylesheets/style.css`): Contains all custom CSS including responsive design, gradient hero sections, and card layouts.

### Project Structure

The main application code is in the `pug-app/` directory. When working on features:
- Route handlers are in `routes/index.js`
- Page content is in `views/*.pug` files
- Styles are in `public/stylesheets/style.css`
- Static assets go in `public/`

### Key Technologies
- **Express.js 4.16.1**: Web framework
- **Pug 2.0.0-beta11**: Template engine
- **Node.js**: Runtime environment