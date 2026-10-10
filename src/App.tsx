import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FreeLessons } from "./components/FreeLessons";
import { RegistrationView } from "./components/RegistrationView";
import { RegistrationModal } from "./components/RegistrationModal";
import { ExamSubjectSelect } from "./components/ExamSubjectSelect";
import { ExamEngine } from "./components/ExamEngine";
import { ExamResultView } from "./components/ExamResultView";
import { AdminModal } from "./components/AdminModal";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { FlashAIModal } from "./components/FlashAIModal";
import { AddTestModal } from "./components/AddTestModal";
import { TeachersSection } from "./components/TeachersSection";
import { TeachersDirectoryView } from "./components/TeachersDirectoryView";
import { TeacherDetailPage } from "./components/TeacherDetailPage";
import { TeacherProfileModal } from "./components/TeacherProfileModal";
import { AddTeacherModal } from "./components/AddTeacherModal";
import { EnglishSpeakingSection } from "./components/EnglishSpeakingSection";
import { Footer } from "./components/Footer";
import { getCurrentUser, getRegistrations, getAllQuestionsForSubject } from "./data/storage";
import {
  createExamResultOnServer,
  getSavedAdminSession,
  fetchAdminAccount,
  logoutAdminServer,
  AdminAccountInfo,
} from "./data/apiClient";
import { Subject, RegistrationRecord, ExamQuestion, Teacher } from "./types";
import { SUBJECTS, EXAM_QUESTIONS } from "./data/courses";
import { evaluateExam } from "./data/evaluation";
import { Sparkles, LogOut, KeyRound, ShieldCheck } from "lucide-react";

type ActiveView = "landing" | "register" | "subject-select" | "exam" | "result" | "teachers" | "teacher-detail" | "speaking";

export function App() {
  const [currentView, setCurrentView] = useState<ActiveView>("landing");
  const [currentUser, setLocalCurrentUser] = useState<RegistrationRecord | null>(getCurrentUser());
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminAccount, setAdminAccount] = useState<AdminAccountInfo | null>(null);
  const [isFlashAIOpen, setIsFlashAIOpen] = useState(false);
  const [flashAIPrompt, setFlashAIPrompt] = useState("");
  const [flashAISubject, setFlashAISubject] = useState("matematika");
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [addTestSubject, setAddTestSubject] = useState("matematika");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [registrationCount, setRegistrationCount] = useState(0);

  // Restore/verify admin session on start
  useEffect(() => {
    const saved = getSavedAdminSession();
    if (saved?.account) {
      setAdminAccount(saved.account);
      fetchAdminAccount().then((acc) => {
        if (acc) {
          setAdminAccount(acc);
        }
      }).catch(() => {
        // keep local
      });
    }
  }, []);

  const handleOpenAdmin = () => {
    if (adminAccount) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (account: AdminAccountInfo) => {
    setAdminAccount(account);
    setIsAdminLoginOpen(false);
    setIsAdminOpen(true);
  };

  const handleAdminLogout = () => {
    logoutAdminServer();
    setAdminAccount(null);
    setIsAdminOpen(false);
  };

  // Discreet Admin Access via Keyboard Shortcut (Ctrl+Shift+A) & URL hash (#admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        handleOpenAdmin();
      }
    };

    const handleHashCheck = () => {
      if (window.location.hash === "#admin") {
        handleOpenAdmin();
        // Clear hash so it doesn't re-trigger unexpectedly
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("hashchange", handleHashCheck);
    handleHashCheck();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hashchange", handleHashCheck);
    };
  }, [adminAccount]);

  // Teacher states
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedTeacherModal, setSelectedTeacherModal] = useState<Teacher | null>(null);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [teachersUpdateKey, setTeachersUpdateKey] = useState(0);

  const handleOpenAddTest = (subjectId?: string) => {
    if (subjectId) {
      setAddTestSubject(subjectId);
    } else if (selectedSubject) {
      setAddTestSubject(selectedSubject.id);
    }
    setIsAddTestOpen(true);
  };

  // Exam session state
  const [userExamAnswers, setUserExamAnswers] = useState<Record<number, number>>({});
  const [activeQuestions, setActiveQuestions] = useState<ExamQuestion[]>([]);

  useEffect(() => {
    setRegistrationCount(getRegistrations().length);
  }, [isRegModalOpen, isAdminOpen, currentView]);

  // Handle CTA "IMTIHON TOPSHIRISH" click
  const handleStartExamFlow = () => {
    if (currentUser) {
      setCurrentView("subject-select");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentView("register");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // When registration is submitted: saves to database and IMMEDIATELY switches to subject categories
  const handleRegistrationSuccess = (user: RegistrationRecord) => {
    setLocalCurrentUser(user);
    setRegistrationCount(getRegistrations().length);
    setIsRegModalOpen(false);
    setCurrentView("subject-select");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Direct exam from subject inside FreeLessons
  const handleStartExamForSubject = (subjectId: string) => {
    const found = SUBJECTS.find((s) => s.id === subjectId);
    if (!found) return;

    setSelectedSubject(found);
    if (!currentUser) {
      setCurrentView("register");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentView("exam");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Select subject from ExamSubjectSelect -> Immediately starts the exam
  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentView("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Finish exam from ExamEngine
  const handleFinishExam = (
    answers: Record<number, number>,
    questions: ExamQuestion[]
  ) => {
    if (!selectedSubject) return;

    const studentRecord = currentUser || {
      id: "guest_" + Date.now(),
      fullName: "Nomzod",
      phone: "+998 90 000 00 00",
      createdAt: new Date().toISOString(),
    };

    setUserExamAnswers(answers);
    setActiveQuestions(questions);

    // Calculate score using Rasch model & BBA criteria
    const evalResult = evaluateExam(answers, questions, selectedSubject.certType);

    // Save to admin database (Server & LocalStorage)
    createExamResultOnServer({
      studentName: studentRecord.fullName,
      phone: studentRecord.phone,
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      scorePercent: evalResult.percent,
      raschScore: evalResult.raschScore,
      maxScore: evalResult.maxScore,
      correctAnswers: evalResult.correctCount,
      totalQuestions: evalResult.totalCount,
      gradeLabel: evalResult.gradeLabel,
      otmBenefit: evalResult.otmBenefit,
      certType: selectedSubject.certType,
    });

    setCurrentView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetake = () => {
    setUserExamAnswers({});
    setCurrentView("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectOtherSubject = () => {
    setUserExamAnswers({});
    setCurrentView("subject-select");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    setCurrentView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoLessons = () => {
    setCurrentView("landing");
    setTimeout(() => {
      const el = document.getElementById("bepul-darslar");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleGoTeachers = () => {
    setCurrentView("teachers");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoSpeaking = () => {
    setCurrentView("speaking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenTeacherPage = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setCurrentView("teacher-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackFromTeacherPage = () => {
    setCurrentView("teachers");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAskTeacherAI = (subjectId: string, teacherName: string) => {
    setFlashAISubject(subjectId);
    setFlashAIPrompt(`Hurmatli ustoz ${teacherName}, ushbu fandan imtihonga tayyorgarlik va qiyin masalalarni yechish bo'yicha maslahat bersangiz: `);
    setIsFlashAIOpen(true);
  };

  const activeUser = currentUser || {
    id: "guest",
    fullName: "Hurmatli Nomzod",
    phone: "+998",
    createdAt: new Date().toISOString(),
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 transition-colors ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        registrationCount={registrationCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onOpenAdmin={handleOpenAdmin}
        onOpenFlashAI={() => {
          setFlashAIPrompt("");
          setIsFlashAIOpen(true);
        }}
        onOpenAddTest={() => handleOpenAddTest()}
        onStartExam={handleStartExamFlow}
        onGoHome={handleGoHome}
        onGoLessons={handleGoLessons}
        onGoTeachers={handleGoTeachers}
        onGoSpeaking={handleGoSpeaking}
        adminAccount={adminAccount}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {currentView === "landing" && (
          <>
            <Hero
              onStartExam={handleStartExamFlow}
              onExploreLessons={handleGoLessons}
            />
            <FreeLessons
              onStartExamForSubject={handleStartExamForSubject}
              onOpenSpeaking={handleGoSpeaking}
            />
          </>
        )}

        {currentView === "speaking" && (
          <EnglishSpeakingSection
            onBackToLessons={handleGoLessons}
            onStartWrittenExam={() => handleStartExamForSubject("ingliz-tili")}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {currentView === "teachers" && (
          <TeachersDirectoryView
            key={teachersUpdateKey}
            onSelectTeacher={handleOpenTeacherPage}
            onOpenAddTeacher={() => setIsAddTeacherOpen(true)}
            onViewLessons={(subjectId) => {
              handleGoLessons();
            }}
            onStartExam={handleStartExamForSubject}
            onAskTeacherAI={handleAskTeacherAI}
            onGoHome={handleGoHome}
          />
        )}

        {currentView === "teacher-detail" && selectedTeacher && (
          <TeacherDetailPage
            teacher={selectedTeacher}
            onBack={handleBackFromTeacherPage}
            onSelectTeacher={handleOpenTeacherPage}
            onStartExam={handleStartExamForSubject}
            onViewLessons={(subjectId) => {
              handleGoLessons();
            }}
            onAskTeacherAI={handleAskTeacherAI}
          />
        )}

        {currentView === "register" && (
          <RegistrationView
            initialName={currentUser?.fullName || ""}
            initialPhone={currentUser?.phone || ""}
            onSuccess={handleRegistrationSuccess}
            onBack={handleGoHome}
          />
        )}

        {currentView === "subject-select" && (
          <ExamSubjectSelect
            currentUser={activeUser}
            onSelectSubject={handleSelectSubject}
            onBack={handleGoHome}
            onChangeUser={() => setCurrentView("register")}
          />
        )}

        {currentView === "exam" && selectedSubject && (
          <ExamEngine
            subject={selectedSubject}
            currentUser={activeUser}
            onFinishExam={handleFinishExam}
            onCancel={() => setCurrentView("subject-select")}
          />
        )}

        {currentView === "result" && selectedSubject && (
          <ExamResultView
            subject={selectedSubject}
            currentUser={activeUser}
            userAnswers={userExamAnswers}
            questions={
              activeQuestions.length > 0
                ? activeQuestions
                : getAllQuestionsForSubject(selectedSubject.id)
            }
            onRetake={handleRetake}
            onSelectOtherSubject={handleSelectOtherSubject}
            onGoLessons={handleGoLessons}
          />
        )}
      </main>

      {/* Floating Flash AI / Rash Model Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-flash-ai-btn"
          onClick={() => setIsFlashAIOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white font-bold shadow-2xl hover:shadow-emerald-600/40 border-2 border-emerald-400/60 transition-all transform hover:scale-105 cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-wide">
            Flash AI Modeli
          </span>
          <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.5 rounded uppercase">
            Rash
          </span>
        </button>
      </div>

      {/* Logged in Administrator Floating Indicator (Only visible if admin is authenticated) */}
      {adminAccount && (
        <div className="fixed bottom-6 left-6 z-40 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-emerald-950/95 backdrop-blur-md text-white border border-emerald-700/80 shadow-2xl rounded-2xl px-3.5 py-2 flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="leading-tight">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Admin</span>
                <span className="font-mono font-bold text-white">@{adminAccount.username}</span>
              </div>
            </div>
            <div className="h-5 w-px bg-emerald-800" />
            <button
              onClick={handleOpenAdmin}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Paneli Ochish
            </button>
            <button
              onClick={handleAdminLogout}
              title="Admin sessiyasidan chiqish"
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Flash AI / Rash Model Modal (multimodal text + image/rasm) */}
      <FlashAIModal
        isOpen={isFlashAIOpen}
        defaultSubjectId={flashAISubject || selectedSubject?.id || "matematika"}
        initialPrompt={flashAIPrompt}
        onClose={() => setIsFlashAIOpen(false)}
      />

      {/* Teacher Detailed Profile Modal ("Har bitta ustozga bo'lim") */}
      <TeacherProfileModal
        teacher={selectedTeacherModal}
        isOpen={Boolean(selectedTeacherModal)}
        onClose={() => setSelectedTeacherModal(null)}
        onStartExam={(subId) => handleStartExamForSubject(subId)}
        onViewLessons={() => handleGoLessons()}
        onAskTeacherAI={handleAskTeacherAI}
      />

      {/* Add New Teacher Modal */}
      <AddTeacherModal
        isOpen={isAddTeacherOpen}
        onClose={() => setIsAddTeacherOpen(false)}
        onTeacherSaved={() => setTeachersUpdateKey((k) => k + 1)}
      />

      {/* Optional Quick Modal if invoked from navbar or actions */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        initialName={currentUser?.fullName || ""}
        initialPhone={currentUser?.phone || ""}
        onClose={() => setIsRegModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenAddTest={() => handleOpenAddTest()}
        onOpenAddTeacher={() => setIsAddTeacherOpen(true)}
        adminAccount={adminAccount}
        onLogout={handleAdminLogout}
        onAccountUpdated={(acc) => setAdminAccount(acc)}
      />

      {/* Add & Manage Tests Modal */}
      <AddTestModal
        isOpen={isAddTestOpen}
        defaultSubjectId={addTestSubject}
        onClose={() => setIsAddTestOpen(false)}
      />

      {/* Footer */}
      <Footer
        onGoHome={handleGoHome}
        onGoLessons={handleGoLessons}
        onStartExam={handleStartExamFlow}
        onGoSpeaking={handleGoSpeaking}
        onGoTeachers={handleGoTeachers}
        onOpenAdmin={handleOpenAdmin}
        adminAccount={adminAccount}
      />
    </div>
  );
}
export default App;
