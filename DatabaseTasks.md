# Database & Dashboard V2 Tasks

## 0. Scaffolding & Navigation
- [x] Create shared dashboard layout with navigation (Generate, My Library, Inspiration).
- [x] Create placeholder pages for new sections.

## 1. Your Library (Past Generations Gallery)
- [ ] **New User Journey:**
  - [ ] Implement conditional rendering to handle the empty state when a user has no past generations.
  - [ ] Display a message and a call-to-action to generate their first image.
- [ ] **Gallery Layout:**
  - [ ] Design a responsive tiled gallery layout (e.g., 3x2 on desktop).
  - [ ] Ensure the layout adapts gracefully to different screen sizes.
  - [ ] Implement pagination or infinite scroll for navigating through many generated images.

## 2. Generate Images Flow
- [ ] **Image Selection:**
  - [x] Fetch and display previously uploaded pet images for the user.
  - [ ] Implement a mechanism to auto-select the most recently used image(s).
  - [x] Add functionality for the user to upload new images.
  - [x] When a new image is uploaded, it should become the selected image for generation.
  - [ ] **Future Improvement:** Implement image hashing to de-duplicate uploads.
- [x] **Quota Management:**
  - [x] Prominently display the number of free generations remaining for the user.
  - [x] Fetch this count from the user's profile/data in Supabase.
  - [x] Disable the "Generate" button and related UI elements when the user's quota is zero.
  - [x] Show a message explaining why the feature is disabled (e.g., "You've used all your free generations").

## 3. Inspo Gallery
- [ ] **Backend Setup:**
  - [x] Create a new table in Supabase for `inspo_images` (id, image_url, description, tags, etc.).
  - [x] Set up RLS policies for the `inspo_images` table (public read-only access).
  - [x] Set up a new Supabase Storage bucket for inspiration images.
  - [x] Manually upload initial set of inspiration images to storage and populate the table.
- [ ] **Frontend Implementation:**
  - [x] Create a new component for the Inspo Gallery.
  - [x] Fetch and display images from the `inspo_images` table.
  - [] Integrate the Inspo Gallery into the dashboard.
- [ ] **Landing Page Integration:**
  - [ ] Reuse the Inspo Gallery component on the main landing page to showcase sample outputs. 