import React, { useRef } from "react";
import { Subject, RegistrationRecord, ExamQuestion } from "../types";
import { LOGO_SRC } from "../data/logo";
import { evaluateExam } from "../data/evaluation";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  QrCode,
  Printer,
  Sparkles,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Scale,
  ShieldCheck,
} from "lucide-react";

interface ExamResultViewProps {
  subject: Subject;
  currentUser: RegistrationRecord;
  userAnswers: Record<number, number>;
  questions: ExamQuestion[];
  onRetake: () => void;
  onSelectOtherSubject: () => void;
  onGoLessons: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  subject,
  currentUser,
  userAnswers,
  questions,
  onRetake,
  onSelectOtherSubject,
  onGoLessons,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  // Evaluate exam with Uzbekistan BBA / Rasch model
  const evalResult = evaluateExam(userAnswers, questions, subject.certType);

  const handlePrint = () => {
    window.print();
  };

  const certNumber = "AX-" + Math.floor(100000 + Math.random() * 900000);
  const formattedDate = new Date().toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner: Congratulations & Rasch Score Metrics */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            O'zbekiston BBA Standarti — Rasch Modeli
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {currentUser.fullName}, natijangiz hisoblandi!
          </h1>
          <p className="text-sm text-emerald-200/90 max-w-xl">
            <strong>{subject.name}</strong> fani bo'yicha 35 ta topshiriq va murakkablik vaznlari
            asosida hisoblangan rasmiy sertifikat ko'rsatkichi.
          </p>
        </div>

        {/* Score Ring / Metric Group */}
        <div className="flex flex-wrap items-center justify-center gap-3 bg-emerald-900/90 p-4 rounded-2xl border border-emerald-700/80 shrink-0">
          <div className="text-center px-3 border-r border-emerald-800">
            <span className="text-2xl sm:text-3xl font-black text-emerald-300">
              {evalResult.raschScore}
            </span>
            <span className="text-xs text-emerald-300 font-bold block">/ 75.0 ball</span>
            <p className="text-[10px] font-medium text-emerald-200 uppercase tracking-wider mt-0.5">
              Rasch balli
            </p>
          </div>

          <div className="text-center px-3 border-r border-emerald-800">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {evalResult.correctCount}/{evalResult.totalCount}
            </span>
            <span className="text-xs text-emerald-200 font-bold block">{evalResult.percent}%</span>
            <p className="text-[10px] font-medium text-emerald-200 uppercase tracking-wider mt-0.5">
              To'g'ri javob
            </p>
          </div>

          <div className="text-center px-3">
            <span className="inline-block px-3 py-1 rounded-lg text-sm font-black bg-emerald-400 text-emerald-950">
              {evalResult.gradeLabel}
            </span>
            <p className="text-[10px] font-medium text-emerald-200 uppercase tracking-wider mt-1">
              Daraja
            </p>
          </div>
        </div>
      </div>

      {/* OTM Imtiyozi va Rasch Mezonlari Bar */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-full">
                OTMga Kirish Imtiyozi
              </span>
              <span className="text-xs font-mono font-bold text-slate-600">
                {evalResult.raschTheta}
              </span>
            </div>
            <p className="mt-1 text-base font-bold text-emerald-950">
              {evalResult.otmBenefit}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {evalResult.statusText}
            </p>
          </div>
        </div>

        {/* Difficulty stats pills */}
        <div className="flex items-center gap-2 shrink-0 bg-white p-3 rounded-2xl border border-emerald-200">
          <div className="text-center px-2 border-r border-slate-100">
            <span className="text-[10px] font-bold text-emerald-700 block">Boshlang'ich</span>
            <span className="text-xs font-black text-slate-800">
              {evalResult.difficultyStats.boshlangich.correct}/{evalResult.difficultyStats.boshlangich.total}
            </span>
          </div>
          <div className="text-center px-2 border-r border-slate-100">
            <span className="text-[10px] font-bold text-blue-700 block">O'rta</span>
            <span className="text-xs font-black text-slate-800">
              {evalResult.difficultyStats.orta.correct}/{evalResult.difficultyStats.orta.total}
            </span>
          </div>
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-rose-700 block">Yuqori</span>
            <span className="text-xs font-black text-slate-800">
              {evalResult.difficultyStats.yuqori.correct}/{evalResult.difficultyStats.yuqori.total}
            </span>
          </div>
        </div>
      </div>

      {/* Official Certificate Card (Printable & Styled) */}
      <div
        ref={certRef}
        id="official-certificate-preview"
        className="bg-white rounded-3xl border-4 border-emerald-900/90 p-6 sm:p-10 shadow-2xl relative overflow-hidden print:m-0 print:border-2"
      >
        {/* Subtle decorative watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none w-96 h-96">
          <img src={LOGO_SRC} alt="Watermark" className="w-full h-full object-contain" />
        </div>

        {/* Certificate Outer Border Frame */}
        <div className="border-2 border-dashed border-emerald-700/40 rounded-2xl p-6 sm:p-8 relative">
          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-emerald-800/20 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-white p-1 border-2 border-emerald-600 shadow flex items-center justify-center">
                <img
                  src={LOGO_SRC}
                  alt="Al-Xorazmiy Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-emerald-950 tracking-tight leading-tight">
                  AL-XORAZMIY XALQARO XUSUSIY MAKTABI
                </h2>
                <p className="text-xs font-bold text-emerald-700 tracking-wider uppercase mt-0.5">
                  TA'LIM PLATFORMASI | RASMIY SERTIFIKATLASH TIZIMI
                </p>
              </div>
            </div>

            <div className="text-right sm:block hidden">
              <p className="text-xs font-mono text-slate-500">Sertifikat №</p>
              <p className="text-sm font-bold font-mono text-emerald-900">{certNumber}</p>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="py-8 text-center space-y-4">
            <span className="inline-block px-5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black tracking-widest uppercase border border-emerald-200">
              MILLIY SERTIFIKAT MEZONLARI ASOSIDA RASMIY DEMO SERTIFIKAT
            </span>

            <p className="text-xs sm:text-sm text-slate-600 italic">
              Ushbu sertifikat quyidagi nomzodga berildi:
            </p>

            <h3 className="text-2xl sm:text-4xl font-black text-emerald-950 font-serif tracking-wide underline decoration-emerald-500 decoration-2 underline-offset-8">
              {currentUser.fullName}
            </h3>

            <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed pt-2">
              Nomzod <strong>{subject.name}</strong> fani bo'yicha Al-Xorazmiy ta'lim
              platformasida tashkil etilgan O'zbekiston Respublikasi Bilimni baholash agentligi (BBA)
              va Rash modeli talablariga mos standart sertifikat sinovini topshirdi.
            </p>

            {/* Grade & Score Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <div className="px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs text-slate-500 font-semibold block">Rasch Modeli Balli</span>
                <span className="text-2xl font-black text-emerald-950">
                  {evalResult.raschScore} <span className="text-sm font-bold text-slate-500">/ 75.0</span>
                </span>
              </div>

              <div className={`px-5 py-2.5 rounded-xl ${evalResult.badgeColor} text-center shadow-sm`}>
                <span className="text-xs font-semibold opacity-90 block">Sertifikat Darajasi</span>
                <span className="text-2xl font-black">{evalResult.gradeLabel}</span>
              </div>

              <div className="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-semibold block">To'g'ri / Umumiy</span>
                <span className="text-xl font-black text-slate-800">
                  {evalResult.correctCount} / {evalResult.totalCount} ({evalResult.percent}%)
                </span>
              </div>
            </div>

            {/* Certificate OTM Imtiyozi Quote */}
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 max-w-xl mx-auto text-xs text-emerald-900 font-semibold">
              <span className="font-black text-emerald-950">OTM Imtiyozi: </span>
              {evalResult.otmBenefit}
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="pt-6 border-t-2 border-emerald-800/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <QrCode className="w-10 h-10 text-emerald-900" />
              <div>
                <p className="font-semibold text-slate-900">QR-tasdiq kodi</p>
                <p className="text-[10px] text-slate-500">platform.alxorazmiy.uz/verify/{certNumber}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="font-semibold text-slate-900">Berilgan sana:</p>
              <p className="font-medium text-emerald-800">{formattedDate}</p>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 pb-1 px-4 font-serif italic text-emerald-900 font-bold">
                Al-Xorazmiy Ekspertlar Kengashi
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Metodik Ekspertiza va Rasch Baholash Muhri</p>
            </div>
          </div>
        </div>

        {/* Certificate Actions */}
        <div className="mt-5 flex justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Chop etish / Saqlash</span>
          </button>
        </div>
      </div>

      {/* Detailed Feedback & Recommendations Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            Metodistlar va Ekspertlar Xulosasi
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
            Batafsil Tahliliy Fikr-Mulohaza
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
            {evalResult.feedbackText}
          </p>
        </div>

        {/* Question-by-Question Review */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <span>Barcha 35 ta topshiriq va ilmiy yechimlar tahlili:</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              To'g'ri: {evalResult.correctCount} ta / Xato: {evalResult.totalCount - evalResult.correctCount} ta
            </span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              const isCorrect = selectedOpt === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border-2 transition-colors ${
                    isCorrect
                      ? "bg-emerald-50/40 border-emerald-200"
                      : "bg-red-50/30 border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        Topshiriq #{idx + 1}
                      </span>
                      {q.difficulty && (
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            q.difficulty === "yuqori"
                              ? "bg-rose-100 text-rose-800"
                              : q.difficulty === "orta"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {q.difficulty === "yuqori"
                            ? "Yuqori (2.7 ball)"
                            : q.difficulty === "orta"
                            ? "O'rta (2.1 ball)"
                            : "Boshlang'ich (1.6 ball)"}
                        </span>
                      )}
                      {q.topic && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {q.topic}
                        </span>
                      )}
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 ml-auto">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          To'g'ri topildi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 ml-auto">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Xato belgilangan
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-900 mt-1">
                    {q.question}
                  </p>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div
                      className={`p-2.5 rounded-lg border font-medium ${
                        isCorrect
                          ? "bg-emerald-100/70 border-emerald-300 text-emerald-950"
                          : "bg-red-100/70 border-red-300 text-red-950"
                      }`}
                    >
                      <span className="font-bold block text-[11px] uppercase tracking-wider mb-0.5">
                        Siz tanlagan variant:
                      </span>
                      {selectedOpt !== undefined ? (
                        <span>
                          {String.fromCharCode(65 + selectedOpt)}) {q.options[selectedOpt]}
                        </span>
                      ) : (
                        <span className="italic text-slate-500">Javob belgilanmagan</span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg border bg-emerald-50 border-emerald-300 text-emerald-950 font-medium">
                      <span className="font-bold block text-[11px] uppercase tracking-wider mb-0.5 text-emerald-800">
                        To'g'ri variant:
                      </span>
                      <span>
                        {String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                      </span>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-700">
                    <span className="font-bold text-emerald-800">Ilmiy izoh / Yechish usuli: </span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRetake}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan topshirish</span>
            </button>

            <button
              onClick={onSelectOtherSubject}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Boshqa fanni tanlash</span>
            </button>
          </div>

          <button
            onClick={onGoLessons}
            className="px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Bepul darslar bo'limiga o'tish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
