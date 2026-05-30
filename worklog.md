---
Task ID: 1
Agent: Main Agent
Task: Move admin panel to /admin route with password protection, fix hero section, remove allergens, fix broken images, and polish the website

Work Log:
- Created `/src/app/admin/page.tsx` with password-protected admin login screen
- Created `/src/app/api/admin/auth/route.ts` API endpoint for password verification
- Updated `admin-layout.tsx` to use sign-out (redirect to /) instead of client-side state toggle
- Cleaned up `page.tsx` to be menu-only, removed AdminFab, added subtle admin link in TopBar
- Redesigned `hero-section.tsx` to overlay text ON the hero image with white text and stronger gradient for proper contrast
- Removed allergens from `product-modal.tsx`, replaced with "Preparation Details" feature
- Added popular/chef's pick badge overlays on product modal and card
- Fixed all broken Unsplash image URLs in `seed.ts` with working replacements
- Updated `seed/route.ts` to support `?force=true` for reseed capability
- Added image error fallback handling in `product-card.tsx`
- Enhanced `product-grid.tsx` with bilingual empty states
- Created `footer.tsx` component with branding
- Added `footer.tsx` to main page layout
- Updated admin products manager label from "Allergens" to "Prep Details"
- Set `images.unoptimized: true` in next.config.ts for reliable image serving
- Reseeded database with fixed image URLs
- Fixed all lint errors (0 errors, 3 expected React Hook Form warnings)

Stage Summary:
- Admin panel is now at `/admin` with password protection (password: "admin")
- Hero section now has text overlay on image with white text for proper readability
- Allergens section replaced with "Preparation Details" - cooking/prep info
- All images now loading without 404 errors
- Professional footer added to main menu page
- Product cards have image error fallback and popular badge indicators
- Zero lint errors
