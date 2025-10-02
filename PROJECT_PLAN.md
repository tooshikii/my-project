# Vinyl Collection 3D Planet - Project Todos

A resume project featuring 3D visualization of your record collection on an interactive sphere.

---

## Project Setup & Planning
- [ ] Choose your tech stack (React + Three.js for 3D, or vanilla JS)
- [ ] Set up project structure and development environment
- [ ] Choose backend approach (Firebase, Supabase, or custom backend)
- [ ] Create basic wireframes/sketches of the UI

## Phase 1: Authentication System
- [ ] Set up user registration form (email, password, validation)
- [ ] Implement login functionality
- [ ] Add password hashing/security measures
- [ ] Create protected routes (redirect non-logged-in users)
- [ ] Add logout functionality
- [ ] Implement "remember me" or session persistence
- [ ] Add basic error handling for auth (wrong password, user exists, etc.)

## Phase 2: Basic Data Management
- [ ] Design database schema (users, records collections)
- [ ] Create API endpoints or database queries for CRUD operations
- [ ] Build form to add new record to collection (manual entry for now)
- [ ] Implement delete record functionality
- [ ] Add edit/update record capability
- [ ] Store records with basic info (title, artist, image URL, year, etc.)

## Phase 3: 3D Planet Visualization (Core Feature)
- [ ] Set up Three.js scene with camera and lighting
- [ ] Create sphere geometry for the "planet"
- [ ] Map record cover images as textures onto sphere surface
- [ ] Implement camera orbit controls (touch/mouse)
- [ ] Add pinch-to-zoom functionality (mobile + desktop)
- [ ] Make records clickable (raycasting for 3D object selection)
- [ ] Add smooth camera transitions when selecting records
- [ ] Optimize performance (texture loading, geometry complexity)

## Phase 4: Record Detail View
- [ ] Create modal/overlay for record details
- [ ] Display full record information (tracks, release date, label, etc.)
- [ ] Add close button to return to planet view
- [ ] Implement smooth transition animations
- [ ] Make detail view responsive (mobile-friendly)

## Phase 5: Discogs API Integration (Good-to-have)
- [ ] Register for Discogs API key
- [ ] Study API documentation and rate limits
- [ ] Create search functionality to find records
- [ ] Auto-populate record details from API
- [ ] Handle API errors and rate limiting gracefully
- [ ] Add loading states during AP