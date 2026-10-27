# PantryPal 食光

A responsive Chinese pantry-to-recipe discovery MVP, with curated example recipes, ingredient matching, shopping list, cross-platform recipe search links and optional Supabase authentication/sync.

## Setup
Static HTML: open index.html, or deploy project root to Vercel. Supabase project jiitmcmsrflfxvitepja has a user_pantry table and owner-only RLS. Only the publishable key is included; never commit service-role keys.

## Notes
Recipes are illustrative curated examples; external search buttons redirect rather than scrape platforms. TheMealDB and broader search aggregation are not present in this deployment build. Register/login requires Supabase Auth settings and email confirmation configuration. Source uses CDN for supabase-js.
