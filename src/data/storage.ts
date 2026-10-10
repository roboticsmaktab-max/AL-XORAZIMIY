import { RegistrationRecord, ExamResultRecord, ExamQuestion } from "../types";
import { EXAM_QUESTIONS } from "./courses";

const REGISTRATIONS_KEY = "al_xorazmiy_registrations";
const EXAM_RESULTS_KEY = "al_xorazmiy_exam_results";
const CURRENT_USER_KEY = "al_xorazmiy_current_user";
const CUSTOM_QUESTIONS_KEY = "al_xorazmiy_custom_questions";

export function saveRegistration(fullName: string, phone: string): RegistrationRecord {
  const records = getRegistrations();
  const newRecord: RegistrationRecord = {
    id: "reg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    fullName: fullName.trim(),
    phone: phone.trim(),
    createdAt: new Date().toISOString(),
  };
  records.unshift(newRecord);
  try {
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(records));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newRecord));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
  return newRecord;
}

export function getCurrentUser(): RegistrationRecord | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: RegistrationRecord | null) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error(e);
  }
}

export function getRegistrations(): RegistrationRecord[] {
  try {
    const raw = localStorage.getItem(REGISTRATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExamResult(result: Omit<ExamResultRecord, "id" | "completedAt">): ExamResultRecord {
  const results = getExamResults();
  const newRecord: ExamResultRecord = {
    ...result,
    id: "res_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    completedAt: new Date().toISOString(),
  };
  results.unshift(newRecord);
  try {
    localStorage.setItem(EXAM_RESULTS_KEY, JSON.stringify(results));
  } catch (e) {
    console.error(e);
  }
  return newRecord;
}

export function getExamResults(): ExamResultRecord[] {
  try {
    const raw = localStorage.getItem(EXAM_RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// -------------------------------------------------------------
// Testlarni Boshqarish (Custom Test Questions Management)
// -------------------------------------------------------------

export function getCustomQuestions(): Record<string, ExamQuestion[]> {
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomQuestion(
  subjectId: string,
  questionData: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }
): ExamQuestion {
  const custom = getCustomQuestions();
  if (!custom[subjectId]) {
    custom[subjectId] = [];
  }

  const newQ: ExamQuestion = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    question: questionData.question.trim(),
    options: questionData.options.map((opt) => opt.trim()),
    correctIndex: questionData.correctIndex,
    explanation: questionData.explanation?.trim() || "To'g'ri javob asoslangan tushuntirish berildi.",
  };

  custom[subjectId].push(newQ);
  try {
    localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error("Failed to save custom question", e);
  }
  return newQ;
}

export function deleteCustomQuestion(subjectId: string, questionId: number) {
  const custom = getCustomQuestions();
  if (custom[subjectId]) {
    custom[subjectId] = custom[subjectId].filter((q) => q.id !== questionId);
    try {
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(custom));
    } catch (e) {
      console.error("Failed to delete custom question", e);
    }
  }
}

export function getAllQuestionsForSubject(subjectId: string): ExamQuestion[] {
  const base = EXAM_QUESTIONS[subjectId] || [];
  const custom = getCustomQuestions()[subjectId] || [];
  return [...base, ...custom];
}
