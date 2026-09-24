export type PaperSlug = "biology-living-organisms";

export type Question = {
  number: number;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export type PublicQuestion = {
  number: number;
  prompt: string;
  options: [string, string, string, string];
};

export type PaperInfo = {
  id: number;
  slug: string;
  title: string;
  subject: string;
  topic: string;
  durationSeconds: number;
  questionCount: number;
};

export type AttemptStatus = "in_progress" | "submitted";

export type AttemptView = {
  id: number;
  status: AttemptStatus;
  answers: Record<string, number>;
  flagged: number[];
  currentIndex: number;
  startedAt: string;
  deadlineAt: string;
  remainingMs: number;
  submittedAt: string | null;
  score: number | null;
  correctCount: number | null;
};

export type ProfileView = {
  fullName: string;
  email: string;
  role: "student" | "tutor";
};

export type ExamLock = "none" | "account" | "device";

export type ResultReview = {
  number: number;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  chosenIndex: number | null;
};

export type BoardRow = {
  userId: string;
  fullName: string;
  email: string;
  status: AttemptStatus;
  score: number | null;
  correctCount: number | null;
  total: number;
  startedAt: string;
  submittedAt: string | null;
  remainingMs: number;
};
