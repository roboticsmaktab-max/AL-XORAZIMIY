import fs from "fs";
import path from "path";
import { RegistrationRecord, ExamResultRecord, TeacherConsultationInquiry, Teacher, VideoShort } from "../src/types";
import { INITIAL_TEACHERS } from "../src/data/teachers";

export interface AdminActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface AdminAccount {
  username: string;
  passwordHash: string;
  fullName: string;
  role: string;
  email: string;
  updatedAt: string;
}

export interface TelegramSettings {
  botToken: string;
  channelUsername: string; // e.g. @alxorazmiyntm
  chatId?: string; // target group or admin chat ID for exam/registration alerts
  notificationsEnabled: boolean;
  notifyOnExamSubmission?: boolean;
  notifyOnRegistration?: boolean;
  notifyOnConsultation?: boolean;
  updatedAt: string;
}

export interface DatabaseSchema {
  adminAccount: AdminAccount;
  telegramSettings?: TelegramSettings;
  registrations: RegistrationRecord[];
  examResults: ExamResultRecord[];
  consultations: (TeacherConsultationInquiry & { status?: "yangi" | "boglanildi" | "yakunlandi" })[];
  teachers: Teacher[];
  videos: VideoShort[];
  logs: AdminActivityLog[];
  serverInfo: {
    initializedAt: string;
    lastBackupAt?: string;
    schoolName: string;
  };
}

const isVercel = !!process.env.VERCEL;
const DATA_DIR = isVercel
  ? "/tmp"
  : path.join(process.cwd(), "server_data");
const DB_FILE = isVercel
  ? path.join("/tmp", "admin_database.json")
  : path.join(DATA_DIR, "admin_database.json");
const SEED_FILE = path.join(process.cwd(), "server_data", "admin_database.json");

// In-memory cache to guarantee persistence during the server lifecycle
let inMemoryDb: DatabaseSchema | null = null;

// Default initial data
function getDefaultDatabase(): DatabaseSchema {
  return {
    adminAccount: {
      username: "admin",
      passwordHash: "admin123",
      fullName: "Al-Xorazmiy Bosh Administratori",
      role: "Maktab Rahbariyati",
      email: "roboticsmaktab@gmail.com",
      updatedAt: new Date().toISOString(),
    },
    telegramSettings: {
      botToken: "",
      channelUsername: "@alxorazmiyntm",
      chatId: "",
      notificationsEnabled: true,
      updatedAt: new Date().toISOString(),
    },
    registrations: [
      {
        id: "reg_demo_1",
        fullName: "Sardorbek Rahimov",
        phone: "+998 90 123 45 67",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: "reg_demo_2",
        fullName: "Madinabonu Karimova",
        phone: "+998 93 987 65 43",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "reg_demo_3",
        fullName: "Jasur Oripov",
        phone: "+998 97 555 44 33",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    ],
    examResults: [
      {
        id: "res_demo_1",
        studentName: "Sardorbek Rahimov",
        phone: "+998 90 123 45 67",
        subjectId: "matematika",
        subjectName: "Matematika (Milliy Sertifikat)",
        correctAnswers: 32,
        totalQuestions: 35,
        scorePercent: 91,
        maxScore: 75.0,
        raschScore: 71.4,
        gradeLabel: "A+ Daraja (Eng yuqori)",
        otmBenefit: "OTMga kirishda mutaxassislik fani uchun 100% maksimal ball beriladi",
        certType: "milliy",
        completedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      },
      {
        id: "res_demo_2",
        studentName: "Madinabonu Karimova",
        phone: "+998 93 987 65 43",
        subjectId: "ingliz-tili",
        subjectName: "Ingliz tili (BBA C1)",
        correctAnswers: 29,
        totalQuestions: 35,
        scorePercent: 83,
        maxScore: 75.0,
        raschScore: 66.8,
        gradeLabel: "A Daraja (Sertifikat kafolatlangan)",
        otmBenefit: "OTMga kirishda mutaxassislik fani uchun 100% maksimal ball beriladi",
        certType: "til",
        completedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ],
    consultations: [
      {
        id: "inq_demo_1",
        teacherId: "teacher-matematika-1",
        teacherName: "Bobur Alimov",
        subjectName: "Matematika",
        studentName: "Sardorbek Rahimov",
        phone: "+998 90 123 45 67",
        preferredTime: "14:00 - 16:00 (Dushanba)",
        message: "Milliy sertifikat 3-darajali ochiq testlar bo'yicha konsultatsiya kerak.",
        status: "yangi",
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        id: "inq_demo_2",
        teacherId: "teacher-kimyo-1",
        teacherName: "Farida Shukurova",
        subjectName: "Kimyo",
        studentName: "Jasur Oripov",
        phone: "+998 97 555 44 33",
        preferredTime: "10:00 - 12:00 (Shanba)",
        message: "Olimpiada va sertifikat masalalari bo'yicha yozilmoqchiman.",
        status: "boglanildi",
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ],
    teachers: [...INITIAL_TEACHERS],
    videos: [
      {
        id: "vid_short_1",
        title: "Matematika: 5 soniyada kvadratga ko'tarish sirli usuli! 🔥 #shorts",
        videoUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        subjectId: "matematika",
        subjectName: "Matematika",
        description: "5 bilan tugaydigan sonlarni oson kvadratga oshirish qoidasi. Sertifikat imtihonlarida vaqt tejash!",
        authorName: "Al-Xorazmiy Maktabi",
        durationSeconds: 45,
        viewsCount: 1420,
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      },
      {
        id: "vid_short_2",
        title: "Ingliz tili: Eng ko'p xato qilinadigan 3 ta so'z birikmasi ⚡ #shorts",
        videoUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        subjectId: "ingliz-tili",
        subjectName: "Ingliz tili",
        description: "CEFR va Multi-level imtihonlarida listening va reading bo'yicha tezkor eslatma.",
        authorName: "Al-Xorazmiy Maktabi",
        durationSeconds: 58,
        viewsCount: 980,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ],
    logs: [
      {
        id: "log_init",
        action: "SERVER_STARTED",
        details: "Al-Xorazmiy Admin serveri muvaffaqiyatli ishga tushirildi.",
        timestamp: new Date().toISOString(),
      },
    ],
    serverInfo: {
      initializedAt: new Date().toISOString(),
      schoolName: "Al-Xorazmiy Xalqaro Xususiy Maktabi",
    },
  };
}

// Ensure data folder and file exists
export function initAdminDatabase(): DatabaseSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  try {
    // 1. Try reading from DB_FILE (either /tmp on Vercel or server_data locally)
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      inMemoryDb = JSON.parse(raw);
    } else if (fs.existsSync(SEED_FILE)) {
      // 2. Fall back to read-only seed file
      const rawSeed = fs.readFileSync(SEED_FILE, "utf-8");
      inMemoryDb = JSON.parse(rawSeed);
      // Try copying seed to writable DB_FILE
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2), "utf-8");
      } catch (writeErr) {
        // Read-only filesystem is tolerated
        console.warn("Could not write initial seed copy (read-only filesystem tolerated):", writeErr);
      }
    } else {
      inMemoryDb = getDefaultDatabase();
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2), "utf-8");
      } catch (writeErr) {
        console.warn("Could not write default db (read-only filesystem tolerated):", writeErr);
      }
    }

    if (!inMemoryDb) {
      inMemoryDb = getDefaultDatabase();
    }

    // Migration if missing properties
    let modified = false;
    if (!inMemoryDb.adminAccount) {
      inMemoryDb.adminAccount = getDefaultDatabase().adminAccount;
      modified = true;
    }
    if (!inMemoryDb.videos) {
      inMemoryDb.videos = getDefaultDatabase().videos;
      modified = true;
    }
    if (!inMemoryDb.telegramSettings) {
      inMemoryDb.telegramSettings = getDefaultDatabase().telegramSettings;
      modified = true;
    }
    if (modified) {
      saveAdminDatabase(inMemoryDb);
    }

    return inMemoryDb;
  } catch (err) {
    console.error("Error reading admin database:", err);
    inMemoryDb = getDefaultDatabase();
    return inMemoryDb;
  }
}

export function getAdminDatabase(): DatabaseSchema {
  return inMemoryDb || initAdminDatabase();
}

export function saveAdminDatabase(data: DatabaseSchema): boolean {
  inMemoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    // If saving to primary failed and we're not yet using /tmp, try /tmp
    try {
      const fallbackFile = path.join("/tmp", "admin_database.json");
      fs.writeFileSync(fallbackFile, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (tmpErr) {
      console.warn("Notice: Saved database to in-memory state (filesystem is read-only):", err);
      return true; // Still true because inMemoryDb is updated and active!
    }
  }
}

export function logAdminAction(action: string, details: string, ip?: string) {
  try {
    const db = getAdminDatabase();
    const newLog: AdminActivityLog = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      action,
      details,
      timestamp: new Date().toISOString(),
      ip,
    };
    db.logs = [newLog, ...(db.logs || []).slice(0, 99)]; // Keep last 100 logs
    saveAdminDatabase(db);
  } catch (e) {
    console.error("Failed to log admin action", e);
  }
}

export function getAdminAccountSafe() {
  const db = getAdminDatabase();
  const acc = db.adminAccount || getDefaultDatabase().adminAccount;
  return {
    username: acc.username,
    fullName: acc.fullName,
    role: acc.role,
    email: acc.email,
    updatedAt: acc.updatedAt,
  };
}

export function verifyAdminCredentials(username: string, password: string): { valid: boolean; account?: ReturnType<typeof getAdminAccountSafe> } {
  const db = getAdminDatabase();
  const acc = db.adminAccount || getDefaultDatabase().adminAccount;
  const cleanUser = (username || "").trim().toLowerCase();
  const cleanPass = (password || "").trim();

  const isUserMatch =
    cleanUser === acc.username.toLowerCase() ||
    (acc.email && cleanUser === acc.email.toLowerCase());

  if (isUserMatch && cleanPass === acc.passwordHash) {
    return {
      valid: true,
      account: getAdminAccountSafe(),
    };
  }

  return { valid: false };
}

export function updateAdminAccount(updates: {
  currentPassword?: string;
  newUsername?: string;
  newPassword?: string;
  newFullName?: string;
  newEmail?: string;
}): { success: boolean; error?: string; account?: ReturnType<typeof getAdminAccountSafe> } {
  const db = getAdminDatabase();
  const acc = db.adminAccount || getDefaultDatabase().adminAccount;

  // If changing password or username, verify currentPassword if provided
  if (updates.currentPassword && updates.currentPassword !== acc.passwordHash) {
    return { success: false, error: "Joriy parol noto'g'ri kiritildi" };
  }

  if (updates.newUsername && updates.newUsername.trim().length >= 3) {
    acc.username = updates.newUsername.trim();
  }

  if (updates.newPassword && updates.newPassword.trim().length >= 4) {
    acc.passwordHash = updates.newPassword.trim();
  }

  if (updates.newFullName && updates.newFullName.trim()) {
    acc.fullName = updates.newFullName.trim();
  }

  if (updates.newEmail && updates.newEmail.trim()) {
    acc.email = updates.newEmail.trim();
  }

  acc.updatedAt = new Date().toISOString();
  db.adminAccount = acc;
  saveAdminDatabase(db);
  logAdminAction("ADMIN_ACCOUNT_UPDATED", `Admin akkaunti ma'lumotlari yangilandi (${acc.username})`);

  return { success: true, account: getAdminAccountSafe() };
}

export function getTelegramSettingsSafe(): TelegramSettings {
  const db = getAdminDatabase();
  return (
    db.telegramSettings || {
      botToken: "",
      channelUsername: "@alxorazmiyntm",
      chatId: "",
      notificationsEnabled: true,
      notifyOnExamSubmission: true,
      notifyOnRegistration: true,
      notifyOnConsultation: true,
      updatedAt: new Date().toISOString(),
    }
  );
}

export function updateTelegramSettings(updates: Partial<TelegramSettings>): TelegramSettings {
  const db = getAdminDatabase();
  const current = getTelegramSettingsSafe();

  const updated: TelegramSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.telegramSettings = updated;
  saveAdminDatabase(db);
  logAdminAction(
    "TELEGRAM_SETTINGS_UPDATED",
    `Telegram sozlamalari yangilandi: Kanal: ${updated.channelUsername}, Bot: ${
      updated.botToken ? "Mavjud (Sozlangan)" : "Yo'q"
    }`
  );

  return updated;
}

