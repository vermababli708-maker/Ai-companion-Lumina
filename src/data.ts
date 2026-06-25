import { FlashcardSet, Task } from "./types";

export const DEFAULT_TASKS: Task[] = [
  {
    id: "t1",
    title: "Midterm Flashcard Set: Calculus II",
    deadline: "Today, 4:00 PM",
    estimatedMinutes: 30,
    completed: false,
    progress: 25,
    category: "Study",
    urgency: "CRITICAL",
    subtasks: [
      { id: "st1", title: "Review Integration by Parts formula", completed: true },
      { id: "st2", title: "Practice Trigonometric Substitution", completed: false },
      { id: "st3", title: "Complete 10 sample problems", completed: false }
    ]
  },
  {
    id: "t2",
    title: "Draft Research Proposal",
    deadline: "Today, 11:59 PM",
    estimatedMinutes: 120,
    completed: false,
    progress: 45,
    category: "Research",
    urgency: "HIGH",
    subtasks: [
      { id: "st4", title: "Cite 2019 MIT cognitive retention study", completed: true },
      { id: "st5", title: "Outline methodology section", completed: false },
      { id: "st6", title: "Format references in APA format", completed: false }
    ]
  },
  {
    id: "t3",
    title: "Anatomy Lab Notes Review",
    deadline: "Tomorrow, 9:00 AM",
    estimatedMinutes: 20,
    completed: false,
    progress: 0,
    category: "Study",
    urgency: "MEDIUM"
  },
  {
    id: "t4",
    title: "Submit Ethics Committee Form",
    deadline: "Friday, 5:00 PM",
    estimatedMinutes: 15,
    completed: true,
    progress: 100,
    category: "Admin",
    urgency: "LOW"
  }
];

export const DEFAULT_FLASHCARDS: FlashcardSet[] = [
  {
    id: "calc-set",
    title: "Calculus II Midterm Review",
    subject: "Mathematics",
    cards: [
      {
        id: "fc1",
        front: "What is the formula for Integration by Parts?",
        back: "∫ u dv = u v - ∫ v du",
        mastered: true
      },
      {
        id: "fc2",
        front: "When should you use Trigonometric Substitution x = a sin(θ)?",
        back: "When the integrand contains √(a² - x²).",
        mastered: false
      },
      {
        id: "fc3",
        front: "What is the integral of ln(x) dx?",
        back: "x ln(x) - x + C",
        mastered: false
      },
      {
        id: "fc4",
        front: "State the p-series test convergence condition.",
        back: "The series ∑ 1/n^p converges if and only if p > 1.",
        mastered: true
      },
      {
        id: "fc5",
        front: "What is Taylor's theorem remainder term R_n(x)?",
        back: "[f^(n+1)(c) / (n+1)!] * (x - a)^(n+1) for some c between a and x.",
        mastered: false
      }
    ]
  },
  {
    id: "physics-set",
    title: "Thermodynamics Core Concepts",
    subject: "Physics",
    cards: [
      {
        id: "fc6",
        front: "Explain the Second Law of Thermodynamics.",
        back: "The total entropy of an isolated system can never decrease over time; heat cannot spontaneously flow from colder to hotter bodies.",
        mastered: false
      },
      {
        id: "fc7",
        front: "What is Carnot efficiency formula?",
        back: "η = 1 - (T_cold / T_hot) where temperatures are in Kelvin.",
        mastered: true
      },
      {
        id: "fc8",
        front: "Define Enthalpy (H).",
        back: "H = U + PV (Internal energy plus pressure times volume).",
        mastered: false
      }
    ]
  }
];

export const DEFAULT_NOTEPAD = `Remember to cite the 2019 MIT study for the introduction section. Need to buy more index cards tomorrow.
- Calculus quiz room changed to Hall 3B.
- Pomodoro tip: Drink water during 5-minute break.`;
