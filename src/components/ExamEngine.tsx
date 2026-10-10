import React, { useState, useEffect } from "react";
import { EXAM_QUESTIONS } from "../data/courses";
import { Subject, RegistrationRecord, ExamQuestion } from "../types";
import { getAllQuestionsForSubject } from "../data/storage";
import { LOGO_SRC } from "../data/logo";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
} from "lucide-react";

interface ExamEngineProps {
  subject: Subject;
  currentUser: RegistrationRecord;
  onFinishExam: (userAnswers: Record<number, number>, questions: ExamQuestion[]) => void;
  onCancel: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  subject,
  currentUser,
  onFinishExam,
  onCancel,
}) => {
  const questions: ExamQuestion[] = getAllQuestionsForSubject(subject.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(subject.durationMinutes * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleComplete = () => {
    onFinishExam(answers, questions);
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isTimeLow = timeLeft < 120; // less than 2 minutes

  if (!currentQuestion) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-slate-700">
        <p>Ushbu fan bo'yicha savollar yuklanmadi.</p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl"
        >
          Ortga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Bar */}
      <div className="bg-emerald-950 text-white rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden">
            <img
              src={LOGO_SRC}
              alt="Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              {subject.name} — Rasmiy Sertifikat Imtihoni (BBA Mezonlari)
            </h2>
            <p className="text-xs text-emerald-300">
              Nomzod: <span className="font-semibold text-white">{currentUser.fullName}</span> | Jami: 35 ta test (Rasch 75.0 ball)
            </p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base font-bold shadow-inner ${
            isTimeLow
              ? "bg-red-500/20 text-red-300 border border-red-500 animate-pulse"
              : "bg-emerald-900 border border-emerald-700 text-emerald-300"
          }`}
        >
          <Clock className={`w-5 h-5 ${isTimeLow ? "text-red-400" : "text-emerald-400"}`} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main Examination Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Questions Navigation Grid */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between order-2 lg:order-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Savollar ({answeredCount}/{questions.length})
              </h3>
              <span className="text-xs text-emerald-700 font-semibold">
                {Math.round((answeredCount / questions.length) * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    id={`question-nav-${idx + 1}`}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-1 shadow"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-emerald-600" />
                <span>Hozirgi savol</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300" />
                <span>Belgilangan javob</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded bg-slate-100" />
                <span>Belgilanmagan</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Imtihonni yakunlash</span>
            </button>
          </div>
        </div>

        {/* Right: Question Body & Answers */}
        <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between order-1 lg:order-2 min-h-[460px]">
          <div>
            {/* Question header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                  Topshiriq #{currentIndex + 1} / {questions.length}
                </span>
                {currentQuestion.difficulty && (
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                      currentQuestion.difficulty === "yuqori"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : currentQuestion.difficulty === "orta"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {currentQuestion.difficulty === "yuqori"
                      ? "Yuqori daraja (2.7 ball)"
                      : currentQuestion.difficulty === "orta"
                      ? "O'rta daraja (2.1 ball)"
                      : "Boshlang'ich (1.6 ball)"}
                  </span>
                )}
              </div>
              {currentQuestion.topic && (
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {currentQuestion.topic}
                </span>
              )}
            </div>

            {/* Question Text */}
            <div className="my-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3 mt-6">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = answers[currentQuestion.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <button
                    key={optIdx}
                    id={`opt-${currentQuestion.id}-${letter}`}
                    onClick={() => handleSelectAnswer(currentQuestion.id, optIdx)}
                    className={`w-full p-4 rounded-xl text-left border-2 flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 font-medium shadow-xs"
                        : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60 text-slate-800"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm sm:text-base leading-relaxed pt-0.5">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Next/Previous controls */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Oldingi savol</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <span>Keyingi savol</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-sm font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>Testni yakunlash</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Finish confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-emerald-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-emerald-700" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">
                Imtihonni yakunlamoqchimisiz?
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Jami {questions.length} ta savoldan {answeredCount} tasiga javob berdingiz.
                {answeredCount < questions.length && (
                  <span className="block mt-1 font-semibold text-amber-600">
                    Diqqat: {questions.length - answeredCount} ta savol javobsiz qolmoqda!
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Davom ettirish
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleComplete();
                }}
                className="flex-1 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition-colors cursor-pointer"
              >
                Ha, yakunlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
