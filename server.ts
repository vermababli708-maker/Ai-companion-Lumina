import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily or check key
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Proactive Prioritization & Recommendations Endpoint
app.post("/api/proactive-companion", async (req, res) => {
  try {
    const { tasks, notepad, flashcardSets, focusMinutesToday } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Fallback response if API key is not yet configured in UI
      return res.json({
        companionMessage: "Proactive mode active. Connect your Gemini API Key in AI Studio Secrets for live AI proactive nudges!",
        priorities: [
          {
            id: "p1",
            title: "Midterm Flashcard Set: Calculus II",
            urgency: "CRITICAL",
            reason: 'Lumina: "Low retention detected on integration rules. Practice before 4 PM deadline."',
            actionType: "FLASHCARDS",
            targetId: "calc-set"
          },
          {
            id: "p2",
            title: "Draft Research Proposal",
            urgency: "HIGH",
            reason: "Deadline: Today 11:59 PM • 45% Complete",
            actionType: "TASK",
            progress: 45
          },
          {
            id: "p3",
            title: "Anatomy Lab Notes Review",
            urgency: "MEDIUM",
            reason: "Estimated effort: 20 mins • Recommended for next Pomodoro session",
            actionType: "POMODORO"
          }
        ],
        insights: {
          focusScore: Math.min(98, 70 + Math.round(focusMinutesToday / 5)),
          tasksCompleted: tasks?.filter((t: any) => t.completed)?.length || 0,
          savedHours: 2.4
        }
      });
    }

    const prompt = `You are Lumina, an AI productivity and study companion.
Analyze the user's current status and generate proactive, motivational prioritization advice.
Current Tasks: ${JSON.stringify(tasks || [])}
Notepad Scratchpad: "${notepad || ""}"
Flashcard Sets: ${JSON.stringify(flashcardSets?.map((f: any) => ({ title: f.title, count: f.cards.length })) || [])}
Focus Minutes Today: ${focusMinutesToday || 0}

Respond strictly in JSON format matching this schema:
{
  "companionMessage": "A brief encouraging proactive message (max 2 sentences)",
  "priorities": [
    {
      "id": "unique_string",
      "title": "Task or Study item title",
      "urgency": "CRITICAL" | "HIGH" | "MEDIUM",
      "reason": "Lumina's explanation of why to do this now (e.g., upcoming deadline, memory curve decay, etc.)",
      "actionType": "FLASHCARDS" | "TASK" | "POMODORO",
      "progress": number between 0 and 100 (optional)
    }
  ],
  "insights": {
    "focusScore": number between 1 and 100,
    "tasksAvoided": number,
    "savedHours": number
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("AI Recommendation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI advice" });
  }
});

// Flashcard Generator Endpoint
app.post("/api/generate-flashcards", async (req, res) => {
  try {
    const { topic, sourceText } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        title: topic || "Generated Flashcards",
        cards: [
          { front: "What is the Second Law of Thermodynamics?", back: "Total entropy of an isolated system can never decrease over time." },
          { front: "What is Active Recall?", back: "A principle of efficient learning where you stimulate your memory during the learning process." },
          { front: "How does the Pomodoro Technique work?", back: "Breaking work into intervals, traditionally 25 minutes in length, separated by short breaks." }
        ]
      });
    }

    const prompt = `Generate a high-quality study flashcard deck based on the following topic or scratchpad notes.
Topic: ${topic || "General Study"}
Source Notes: "${sourceText || ""}"

Create 6 clear, concise question & answer flashcards optimized for active recall learning.
Respond strictly in JSON matching this format:
{
  "title": "Deck Title",
  "cards": [
    { "front": "Question prompt", "back": "Clear concise answer" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Flashcard generation error:", error);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

// Task Breakdown Endpoint
app.post("/api/breakdown-task", async (req, res) => {
  try {
    const { taskTitle, deadline } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        subtasks: [
          { title: `Research & outline key points for ${taskTitle}`, pomodoros: 1 },
          { title: "Draft core section", pomodoros: 2 },
          { title: "Review, edit, and finalize before deadline", pomodoros: 1 }
        ]
      });
    }

    const prompt = `Break down this complex task into 3 to 5 bite-sized actionable steps with estimated Pomodoro (25-min) blocks.
Task: "${taskTitle}"
Deadline: "${deadline || "Soon"}"

Respond strictly in JSON matching this schema:
{
  "subtasks": [
    { "title": "Clear action step", "pomodoros": number (1 to 3) }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Task breakdown error:", error);
    res.status(500).json({ error: "Failed to break down task" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lumina Companion server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
