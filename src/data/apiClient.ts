import { RegistrationRecord, ExamResultRecord, TeacherConsultationInquiry, Teacher, VideoShort } from "../types";
import { getRegistrations, getExamResults, saveRegistration, saveExamResult } from "./storage";
import { getConsultationInquiries, saveConsultationInquiry } from "./teachers";

export interface ServerStatusResponse {
  status: "online" | "offline";
  schoolName: string;
  serverRole: string;
  port: number;
  nodeVersion: string;
  uptimeSeconds: number;
  counts: {
    registrations: number;
    examResults: number;
    consultations: number;
    teachers: number;
    logs: number;
  };
  timestamp: string;
}

export interface AdminStatsResponse {
  totalRegistrations: number;
  totalExams: number;
  totalConsultations: number;
  pendingConsultations: number;
  avgRasch: string;
  successRate: number;
  totalTeachers: number;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip?: string;
}

// Check server online status
export async function checkServerStatus(): Promise<{ online: boolean; data?: ServerStatusResponse; pingMs?: number }> {
  const start = performance.now();
  try {
    const res = await fetch("/api/admin/status", { cache: "no-store" });
    const duration = Math.round(performance.now() - start);
    if (res.ok) {
      const data: ServerStatusResponse = await res.json();
      return { online: true, data, pingMs: duration };
    }
    return { online: false, pingMs: duration };
  } catch (err) {
    return { online: false };
  }
}

// Fetch Admin Stats
export async function getAdminStats(): Promise<AdminStatsResponse | null> {
  try {
    const res = await fetch("/api/admin/stats");
    if (res.ok) return await res.json();
    return null;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// Registrations
// -------------------------------------------------------------
export async function fetchRegistrations(): Promise<RegistrationRecord[]> {
  try {
    const res = await fetch("/api/admin/registrations");
    if (res.ok) {
      const serverData: RegistrationRecord[] = await res.json();
      return serverData;
    }
  } catch (e) {
    console.warn("Could not fetch registrations from server, using local cache", e);
  }
  return getRegistrations();
}

export async function createRegistrationOnServer(fullName: string, phone: string): Promise<RegistrationRecord> {
  const localRecord = saveRegistration(fullName, phone);
  try {
    const res = await fetch("/api/admin/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone }),
    });
    if (res.ok) {
      const serverRecord = await res.json();
      return serverRecord;
    }
  } catch (e) {
    console.warn("Could not post registration to server, stored locally", e);
  }
  return localRecord;
}

export async function deleteRegistrationOnServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Exam Results
// -------------------------------------------------------------
export async function fetchExamResults(): Promise<ExamResultRecord[]> {
  try {
    const res = await fetch("/api/admin/exam-results");
    if (res.ok) {
      const serverData: ExamResultRecord[] = await res.json();
      return serverData;
    }
  } catch (e) {
    console.warn("Could not fetch exam results from server, using local cache", e);
  }
  return getExamResults();
}

export async function createExamResultOnServer(result: Omit<ExamResultRecord, "id" | "completedAt">): Promise<ExamResultRecord> {
  const localRecord = saveExamResult(result);
  try {
    const res = await fetch("/api/admin/exam-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localRecord),
    });
    if (res.ok) {
      const serverRecord = await res.json();
      return serverRecord;
    }
  } catch (e) {
    console.warn("Could not post exam result to server, stored locally", e);
  }
  return localRecord;
}

export async function deleteExamResultOnServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/exam-results/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Consultations
// -------------------------------------------------------------
export async function fetchConsultations(): Promise<(TeacherConsultationInquiry & { status?: "yangi" | "boglanildi" | "yakunlandi" })[]> {
  try {
    const res = await fetch("/api/admin/consultations");
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Could not fetch consultations from server, using local cache", e);
  }
  return getConsultationInquiries();
}

export async function createConsultationOnServer(inquiry: Omit<TeacherConsultationInquiry, "id" | "createdAt">): Promise<TeacherConsultationInquiry> {
  const localRecord = saveConsultationInquiry(inquiry);
  try {
    const res = await fetch("/api/admin/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Could not post consultation to server, stored locally", e);
  }
  return localRecord;
}

export async function updateConsultationStatus(id: string, status: "yangi" | "boglanildi" | "yakunlandi"): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/consultations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteConsultationOnServer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/consultations/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Teachers & Logs
// -------------------------------------------------------------
export async function fetchServerTeachers(): Promise<Teacher[]> {
  try {
    const res = await fetch("/api/admin/teachers");
    if (res.ok) return await res.json();
  } catch {}
  return [];
}

export async function saveServerTeacher(teacher: Partial<Teacher>): Promise<Teacher | null> {
  try {
    const res = await fetch("/api/admin/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacher),
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function deleteServerTeacher(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/teachers/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAdminLogs(): Promise<AdminActivityLog[]> {
  try {
    const res = await fetch("/api/admin/logs");
    if (res.ok) return await res.json();
  } catch {}
  return [];
}

// -------------------------------------------------------------
// Videos & Shorts Management
// -------------------------------------------------------------
export async function fetchVideos(): Promise<VideoShort[]> {
  try {
    const res = await fetch("/api/videos");
    if (res.ok) return await res.json();
  } catch {}
  return [];
}

export async function saveVideoShort(video: {
  title: string;
  videoUrl: string;
  subjectId?: string;
  subjectName?: string;
  description?: string;
  authorName?: string;
  durationSeconds?: number;
}): Promise<VideoShort | null> {
  try {
    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(video),
    });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function deleteVideoShort(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Admin Account & Authentication
// -------------------------------------------------------------
export interface AdminAccountInfo {
  username: string;
  fullName: string;
  role: string;
  email: string;
  updatedAt?: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  account?: AdminAccountInfo;
  error?: string;
}

export function getSavedAdminSession(): { token: string; account: AdminAccountInfo } | null {
  try {
    const raw = localStorage.getItem("al_xorazmiy_admin_session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAdminSession(token: string, account: AdminAccountInfo) {
  try {
    localStorage.setItem("al_xorazmiy_admin_session", JSON.stringify({ token, account }));
  } catch {}
}

export function clearAdminSession() {
  try {
    localStorage.removeItem("al_xorazmiy_admin_session");
  } catch {}
}

export async function loginAdminServer(username: string, password: string): Promise<AdminLoginResponse> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success && data.token && data.account) {
      saveAdminSession(data.token, data.account);
    }
    return data;
  } catch (err: any) {
    // Offline demo fallback
    if (username.trim().toLowerCase() === "admin" && password.trim() === "admin123") {
      const fallbackAccount: AdminAccountInfo = {
        username: "admin",
        fullName: "Al-Xorazmiy Bosh Administratori",
        role: "Maktab Rahbariyati",
        email: "roboticsmaktab@gmail.com",
      };
      saveAdminSession("adm_local_fallback", fallbackAccount);
      return { success: true, token: "adm_local_fallback", account: fallbackAccount };
    }
    return { success: false, error: "Serverga ulanib bo'lmadi yoki login/parol noto'g'ri" };
  }
}

export async function logoutAdminServer(): Promise<boolean> {
  try {
    const session = getSavedAdminSession();
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: session?.account.username }),
    });
  } catch {}
  clearAdminSession();
  return true;
}

export async function fetchAdminAccount(): Promise<AdminAccountInfo | null> {
  try {
    const res = await fetch("/api/admin/account");
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.account) return data.account;
    }
  } catch {}
  return getSavedAdminSession()?.account || null;
}

export async function updateAdminAccountServer(params: {
  currentPassword?: string;
  newUsername?: string;
  newPassword?: string;
  newFullName?: string;
  newEmail?: string;
}): Promise<{ success: boolean; error?: string; account?: AdminAccountInfo }> {
  try {
    const res = await fetch("/api/admin/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (data.success && data.account) {
      const session = getSavedAdminSession();
      if (session) {
        saveAdminSession(session.token, data.account);
      }
    }
    return data;
  } catch {
    return { success: false, error: "Serverga ulanishda xatolik yuz berdi" };
  }
}

// -------------------------------------------------------------
// TELEGRAM INTEGRATION CLIENT API
// -------------------------------------------------------------
export interface TelegramConfig {
  botToken: string;
  channelUsername: string;
  chatId?: string;
  notificationsEnabled: boolean;
  notifyOnExamSubmission?: boolean;
  notifyOnRegistration?: boolean;
  notifyOnConsultation?: boolean;
  isConfigured: boolean;
  maskedToken?: string;
  updatedAt?: string;
}

export async function fetchTelegramSettings(): Promise<TelegramConfig | null> {
  try {
    const res = await fetch("/api/admin/telegram");
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function saveTelegramSettings(settings: {
  botToken?: string;
  channelUsername?: string;
  chatId?: string;
  notificationsEnabled?: boolean;
  notifyOnExamSubmission?: boolean;
  notifyOnRegistration?: boolean;
  notifyOnConsultation?: boolean;
}): Promise<{ success: boolean; message?: string; settings?: TelegramConfig; error?: string }> {
  try {
    const res = await fetch("/api/admin/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || "Serverga ulanish xatosi" };
  }
}

export async function sendTelegramTestMessage(params: {
  botToken?: string;
  chatId?: string;
  message?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch("/api/admin/telegram/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || "Telegramga ulanish xatosi" };
  }
}

// -------------------------------------------------------------
// ENGLISH SPEAKING AI EXAMINER API
// -------------------------------------------------------------
export interface SpeakingEvaluationCriteria {
  fluencyAndCoherence: { score: string; feedback: string };
  lexicalResource: { score: string; feedback: string };
  grammaticalRange: { score: string; feedback: string };
  pronunciation: { score: string; feedback: string };
}

export interface SpeakingEvaluationResponse {
  bandScore: string;
  overallScore: number;
  cefrLevel?: "B1" | "B2" | "C1" | "C2";
  criteria: SpeakingEvaluationCriteria;
  strengths: string[];
  areasForImprovement: string[];
  improvedSampleAnswer: string;
  examinerNote: string;
}

export async function evaluateSpeakingResponse(data: {
  question: string;
  speechTranscript: string;
  part: number;
  topic: string;
  studentAudioSeconds?: number;
}): Promise<SpeakingEvaluationResponse> {
  const res = await fetch("/api/speaking/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || "Speaking baholashda xatolik yuz berdi");
  }

  return await res.json();
}


