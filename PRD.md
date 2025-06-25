# 🐾 PRD: AI Pet Portrait Generator Web App  
**Working Title:** Haikoo
**Owner:** Ashish Lingamneni
**Version:** 1.0  
**Last Updated:** 25 June 2025  

---

## 1. Objective

Build a web-based application that allows users to log in, upload images of their pets, and generate Gen-AI styled portraits using OpenAI's GPT-based image generation model. Users can view previous generations, delete them, and are limited to a free tier with 3 generations and 30-day image retention.

---

## 2. Key User Flows

### 🧍 Unauthenticated Flow
- User lands on a public landing page
- Sees demo or sample gallery
- Clicks "Sign In" to begin

### 👤 Authenticated Flow
- User logs in via Supabase (email or social auth)
- Redirected to a dashboard/home
  - View previous generations
  - Upload image and generate new portrait
  - Delete images
  - Logout

---

## 3. Core Features

### ✅ Front-End
- Landing page with demo and sample gallery
- Login/signup modal via Supabase Auth
- Signed-in home page with:
  - "Generate New Portrait" interface
  - "Past Generations" gallery
  - Delete button per image
  - Logout button

### ✅ Back-End
- Image generation API (calls OpenAI GPT image model)
- Supabase database for tracking users and image metadata
- Supabase storage for hosting actual images

---

## 4. Tech Stack

### ✅ Front-End

| Component           | Tool/Library                     | Why                                      |
|--------------------|----------------------------------|------------------------------------------|
| Framework           | Next.js (App Router)            | Modern routing, server components        |
| UI Components       | shadcn/ui                       | Accessible, customizable components      |
| Styling             | TailwindCSS + CSS Modules       | Utility-first + modular styling          |
| Auth & DB Access    | `@supabase/supabase-js`         | Official client for Supabase APIs       |
| Hosting             | Vercel                          | Fast, seamless Next.js deployment        |

### ✅ Back-End

| Component              | Tool/Library                | Why                                      |
|------------------------|-----------------------------|------------------------------------------|
| Authentication         | Supabase Auth               | Secure, prebuilt, with OAuth support     |
| Database               | Supabase Postgres           | Managed Postgres with RLS                |
| Storage                | Supabase Storage            | Easy integration with Supabase DB/Auth   |
| Image Generation API   | OpenAI GPT Image Model      | High-quality, easy-to-integrate model    |
| Serverless Execution   | Supabase Edge or Vercel     | Cost-effective, scalable generation logic |

---

## 5. Data Model (Supabase)

### Table: `generations`

| Field        | Type       | Description                          |
|--------------|------------|--------------------------------------|
| id           | UUID       | Primary key                          |
| user_id      | UUID       | Linked to Supabase Auth user         |
| prompt       | TEXT       | Style prompt used for generation     |
| image_url    | TEXT       | Link to image in Supabase Storage    |
| created_at   | TIMESTAMP  | Auto-generated                       |
| deleted      | BOOLEAN    | Soft delete flag (optional)          |

### Supabase Storage
- Bucket: `generated-images`
- Path: `user_id/filename.png`

---

## 6. Non-Functional Requirements

| Requirement         | Details                                                                 |
|---------------------|-------------------------------------------------------------------------|
| Security            | RLS enabled in Supabase, scoped storage paths                          |
| Performance         | Images lazy-loaded, serverless APIs for generation                     |
| Rate Limiting       | 3 generations per user (for beta phase)                                |
| Image Retention     | 30-day auto-deletion for free users                                    |
| Error Handling      | Graceful fallbacks for auth/generation failures                        |
| Monitoring          | Console logs; Sentry or analytics optional for v1.2                    |

---

## 7. Architecture Overview

- **Client:** Next.js + Supabase SDK  
- **API Gateway (Serverless Function):**
  - Receives request with user input + photo
  - Uses OpenAI GPT image model to generate output
  - Uploads result to Supabase Storage
  - Inserts metadata into `generations` table

- **Supabase Storage:** Stores all user image assets  
- **Supabase DB:** Tracks generation metadata per user  
- **Supabase Auth:** Manages login/session

---

## 8. Clarified Design Decisions & Open Questions

### ✅ Gen-AI Model
We will use **OpenAI's GPT-based image generation model** (`gpt-image-1`).

**Example Code:**
```ts
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt: "A cartoon portrait of a golden retriever in superhero costume"
});

const image_base64 = result.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");
fs.writeFileSync("output.png", image_bytes);
