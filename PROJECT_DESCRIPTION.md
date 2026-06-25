# Project Description: Lumina — AI Proactive Productivity & Study Companion

> **Instructions for Google Doc Submission:** Copy and paste the contents below directly into your Google Doc submission.

---

## 1. Problem Statement Selected

**Cognitive Overload, Passive Task Avoidance, and Inefficient Study Habits Among Students and Knowledge Workers.**

Modern students and professionals face an epidemic of digital distraction and executive dysfunction. Standard to-do list applications rely on **passive user management**—requiring individuals who are already overwhelmed to manually organize, estimate, prioritize, and initiate their work. This leads to three critical friction points:
1. **The Procrastination Spiral:** When faced with large, intimidating deadlines (e.g., "Draft Research Proposal" or "Midterm Exam"), users experience anxiety and actively avoid starting.
2. **Ineffective Learning Techniques:** Students frequently resort to passive reading or last-minute cramming rather than scientifically proven **Active Recall** and **Spaced Repetition** methodologies.
3. **Disconnected Productivity Silos:** Users juggle separate apps for timers, flashcards, scratchpads, and task managers, leading to context-switching fatigue and fragmented focus.

---

## 2. Solution Overview

**Lumina** is a full-stack, AI-powered productivity companion built to transform task management from a *passive archive* into an *active, empathetic coaching experience*. 

Instead of waiting for the user to figure out what to do next, Lumina continuously synthesizes the user's pending deadlines, quick notepad scratchpad thoughts, daily focus minutes, and study retention data. Powered by **Google Gemini 2.5 Flash**, Lumina proactively calculates urgency, detects retention decay, and nudges the user with actionable bite-sized sprints right when executive function dips.

### Core Philosophy:
* **Proactive Nudging over Passive Tracking:** AI analyzes impending deadlines and study habits to present the single most important action item right now.
* **Frictionless Action Initiation:** Any overwhelming task can be instantly carved into manageable 25-minute Pomodoro sprints with a single click using structured AI reasoning.
* **Unified Flow Architecture:** Seamlessly integrates smart notepad capture, AI study flashcard generation, and deep-focus Pomodoro timing inside a cohesive, zero-distraction modern "Bento Grid" interface.

---

## 3. System Architecture & Workflows Diagram

```mermaid
graph TD
    %% User Interaction Layer
    subgraph Client [React + Tailwind Client Dashboard]
        UI_Header[Header Bar & Mode Switcher]
        UI_Bento[Bento Grid Main View]
        Card_Prio[Proactive Priorities Card]
        Card_Pomo[Pomodoro Focus Timer]
        Card_Note[Quick Scratchpad Notepad]
        Card_Flash[Study Hub & Flashcards]
    end

    %% Express Server & Middleware
    subgraph Server [Node.js / Express Backend - port 3000]
        API_Prio[/api/proactive-companion]
        API_Flash[/api/generate-flashcards]
        API_Break[/api/breakdown-task]
    end

    %% Google Cloud & AI Infrastructure
    subgraph Cloud [Google Cloud & AI Infrastructure]
        Gemini[Google Gemini 2.5 Flash API]
        CloudRun[Google Cloud Run Hosting]
    end

    %% Data Flow Connections
    UI_Bento --> Card_Prio & Card_Pomo & Card_Note & Card_Flash
    Card_Prio <-->|Sync State & Nudges| API_Prio
    Card_Note -->|Convert Notes to Decks| API_Flash
    Card_Prio -->|One-Click Subtask Carving| API_Break

    API_Prio & API_Flash & API_Break <-->|JSON Structured Prompts| Gemini
    Server --- CloudRun
```

### Core User Workflows:

1. **Proactive Triage Workflow:**
   * **Input:** User opens dashboard with mixed tasks, deadlines, and raw notes.
   * **Processing:** Frontend sends workspace payload to `/api/proactive-companion`.
   * **AI Execution:** Gemini evaluates deadlines and memory curves, returning empathetic nudges (e.g., *"Low retention detected on calculus rules. Practice now before 4 PM deadline."*).
   * **Output:** Dashboard dynamically color-codes critical items with visual warning indicators.

2. **Overwhelm Breakdown Workflow:**
   * **Input:** User clicks the **"Split"** icon on a daunting task (e.g., *"Draft Research Proposal"*).
   * **Processing:** Request dispatched to `/api/breakdown-task`.
   * **AI Execution:** Gemini parses goal complexity and decomposes it into 3–5 bite-sized sprints paired with exact Pomodoro block estimates.
   * **Output:** Subtasks are attached directly to the parent item, letting the user click **"Focus"** to immediately boot the 25-minute timer.

3. **Active Recall Study Workflow:**
   * **Input:** Student types messy lecture thoughts into the **Quick Scratchpad Notepad**.
   * **Processing:** User clicks **"✨ Flashcards"**. Backend routes raw text to `/api/generate-flashcards`.
   * **AI Execution:** Gemini extracts key concepts and synthesizes concise Question/Answer study pairs.
   * **Output:** Interactive 3D flip-cards are generated in the **Study Hub**, allowing retention mastery tracking.

---

## 4. Key Features

* **🧠 Proactive AI Coach (Lumina Nudges):** Continuous contextual analysis that surfaces motivational advice and dynamic priority re-ordering based on deadlines and focus scores.
* **⏱️ Integrated Pomodoro Focus Engine:** Interactive SVG circular timer supporting Focus (25m), Short Break (5m), and Long Break (15m) intervals with real-time session tracking and celebration confetti upon completion.
* **📝 AI Smart Scratchpad:** Frictionless auto-saving notepad that captures ambient thoughts and directly transforms them into structured study decks.
* **📚 Active Recall Flashcard Hub:** Built-in study deck previewer and modal organizer supporting instant Q&A flipping and mastery tagging.
* **📐 Modern Bento Grid UI/UX:** Crafted with high-contrast typography (*Inter*, *Space Grotesk*, and *JetBrains Mono*), purposeful negative space, and intuitive micro-interactions.

---

## 5. Technologies Used

### Frontend & UI:
* **React 19 & TypeScript:** Strongly typed component architecture ensuring zero runtime exceptions.
* **Vite:** High-speed bundling and optimized asset serving.
* **Tailwind CSS v4:** Modern utility-first styling engine powering responsive bento layouts and custom scrollbars.
* **Lucide React:** Crisp, scalable vector iconography.
* **Canvas Confetti:** Gamified visual feedback celebrating completed focus blocks.

### Backend & Runtime:
* **Node.js & Express v4:** Custom full-stack REST API gateway handling async proxy requests and static asset delivery.
* **TSX & Esbuild:** Native TypeScript dev runtime and production self-contained CommonJS server bundling (`dist/server.cjs`).
* **Dotenv:** Secure environment credentials management.

---

## 6. Google Technologies Utilized

1. **Google Gemini 2.5 Flash API (`@google/genai` SDK):**
   * **Structured JSON Generation:** Utilizes strict `responseMimeType: "application/json"` schemas to reliably generate frontend-ready data structures without regex parsing.
   * **Contextual Reasoning:** Leverages deep prompt engineering to simulate an empathetic academic productivity coach.
2. **Google Cloud Run:**
   * Fully managed containerized hosting environment serving both the Express backend API and client SPA through a unified reverse proxy on Port 3000.
3. **Google AI Studio Build:**
   * Cloud-native sandboxed development workspace and automated runtime secret injection (`GEMINI_API_KEY`).
4. **Google Fonts API:**
   * High-performance web typography delivery (*Inter*, *Space Grotesk*, *JetBrains Mono*).
