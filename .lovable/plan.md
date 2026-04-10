

## UI Enhancement Plan

### Overview
Polish the existing UI across all pages to feel more premium and refined. Focus on micro-details: better stat cards with trend indicators, richer sidebar, improved auth page, and enhanced visual hierarchy.

### Changes

**1. Sidebar — Add polish and personality**
- File: `src/components/layout/AppLayout.tsx`
- Add a subtle gradient overlay to the sidebar background
- Add notification dot indicators on nav items (visual only)
- Add a "Pro" badge next to admin role
- Improve the user card with an online status indicator and better spacing
- Add a subtle separator line between nav sections
- Add hover animation (scale + bg transition) on nav items

**2. Dashboard — Richer stat cards and welcome banner**
- File: `src/pages/DashboardPage.tsx`
- Add percentage change indicators (e.g., "+12%") on stat cards with colored arrows
- Add a subtle animated pattern/mesh background to the welcome banner
- Add a "Quick Actions" row below stats (Book Vehicle, View Fleet, My Bookings) with icon buttons
- Improve chart cards with better headers showing summary values
- Add a "Recent Activity" timeline section below charts

**3. Auth Page — More visual appeal**
- File: `src/pages/AuthPage.tsx`
- Add floating animated shapes/orbs on the left gradient panel
- Add a testimonial quote on the left panel
- Add social proof numbers ("10K+ users", "500+ vehicles")
- Add password strength indicator on signup
- Improve input focus states with animated borders

**4. Vehicles Page — Better cards and interactions**
- File: `src/pages/VehiclesPage.tsx`
- Add a search input with icon at the top
- Add vehicle rating stars (static/decorative)
- Add a "Popular" badge on first vehicle
- Improve the empty state with an illustration
- Add animated filter count badge

**5. Global CSS improvements**
- File: `src/index.css`
- Add animated gradient border utility class
- Add a subtle noise texture overlay option
- Improve scrollbar for dark sidebar
- Add focus-visible ring styles for accessibility

**6. Bookings and Profile pages — Minor polish**
- Files: `src/pages/BookingsPage.tsx`, `src/pages/ProfilePage.tsx`
- Add booking card status timeline dots
- Improve profile page with avatar upload placeholder and stats summary

### Technical approach
- All changes use existing dependencies (Framer Motion, Tailwind, Lucide icons)
- No new packages needed
- Maintains current OOAD architecture — only presentation layer changes

