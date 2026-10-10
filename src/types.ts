export type CertType = "milliy" | "til";

export interface Subject {
  id: string;
  name: string;
  iconName: string;
  certType: CertType;
  description: string;
  durationMinutes: number;
  questionCount: number;
  maxScore: number;
  passingScore: number;
}

export interface VideoShort {
  id: string;
  title: string;
  videoUrl: string; // YouTube, Shorts, MP4 or direct video url
  subjectId?: string;
  subjectName?: string;
  description?: string;
  authorName?: string;
  durationSeconds?: number;
  viewsCount?: number;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  available: boolean;
  videoPlaceholderUrl?: string;
  topics: string[];
}

export type QuestionDifficulty = "boshlangich" | "orta" | "yuqori";

export interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: QuestionDifficulty;
  weight?: number;
  topic?: string;
}

export interface RegistrationRecord {
  id: string;
  fullName: string;
  phone: string;
  createdAt: string;
}

export interface ExamResultRecord {
  id: string;
  studentName: string;
  phone: string;
  subjectId: string;
  subjectName: string;
  scorePercent: number;
  raschScore: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
  gradeLabel: string;
  otmBenefit: string;
  certType: CertType;
  completedAt: string;
}

export interface TeacherReview {
  id: string;
  studentName: string;
  scoreOrCert: string;
  comment: string;
  date: string;
  rating: number;
}

export interface TeacherConsultationInquiry {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectName: string;
  studentName: string;
  phone: string;
  preferredTime: string;
  message?: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  subjectId: string;
  subjectName: string;
  role: string;
  experienceYears: number;
  bio: string;
  avatarUrl: string;
  degree: string;
  rating: number;
  studentsCount: number;
  badges: string[];
  contactPhone?: string;
  telegramHandle?: string;
  lessonsTopics: string[];
  education?: string[];
  methodology?: string[];
  achievements?: string[];
  consultationSchedule?: string;
  reviews?: TeacherReview[];
}
