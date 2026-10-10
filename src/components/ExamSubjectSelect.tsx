import React from "react";
import { SUBJECTS } from "../data/courses";
import { Subject, RegistrationRecord } from "../types";
import {
  Calculator,
  Zap,
  BookOpen,
  Globe,
  Landmark,
  Languages,
  FlaskConical,
  Dna,
  Clock,
  HelpCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  User,
  Sparkles,
  Edit3,
  PlusCircle,
} from "lucide-react";

interface ExamSubjectSelectProps {
  currentUser: RegistrationRecord;
  onSelectSubject: (subject: Subject) => void;
  onBack: () => void;
  onChangeUser?: () => void;
  onOpenAddTest?: (subjectId?: string) => void;
}

export const ExamSubjectSelect: React.FC<ExamSubjectSelectProps> = ({
  currentUser,
  onSelectSubject,
  onBack,
  onChangeUser,
  onOpenAddTest,
}) => {
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case "Calculator":
        return <Calculator className="w-8 h-8 text-emerald-600" />;
      case "Zap":
        return <Zap className="w-8 h-8 text-amber-500" />;
      case "FlaskConical":
        return <FlaskConical className="w-8 h-8 text-cyan-600" />;
      case "Dna":
        return <Dna className="w-8 h-8 text-teal-600" />;
      case "BookOpen":
        return <BookOpen className="w-8 h-8 text-emerald-600" />;
      case "Globe":
        return <Globe className="w-8 h-8 text-blue-500" />;
      case "Landmark":
        return <Landmark className="w-8 h-8 text-emerald-700" />;
      case "Languages":
        return <Languages className="w-8 h-8 text-indigo-500" />;
      default:
        return <BookOpen className="w-8 h-8 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header section: Exactly "DEMO SERTIFIKAT IMTIHON TOPSHIRISH BO'LIMI" */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10 border border-emerald-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Bosh sahifaga qaytish
            </button>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Sertifikat Sinovi Bosqichi
            </div>
            <h1
              id="exam-section-title"
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-1 uppercase tracking-tight"
            >
              DEMO SERTIFIKAT IMTIHON TOPSHIRISH BO'LIMI
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-200/90 max-w-2xl leading-relaxed">
              Quyidagi fanlardan birini tanlang. Fan tugmasini bosishingiz bilanoq real sertifikat
              imtihoni (savollar va vaqt hisoblagich) boshlanadi.
            </p>
          </div>

          {/* User Confirmation Card */}
          <div className="bg-emerald-900/90 border border-emerald-700/80 rounded-2xl p-4 shrink-0 flex items-center justify-between gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">
                  Nomzod:
                </p>
                <p className="text-sm sm:text-base font-bold text-white leading-tight">
                  {currentUser?.fullName || "Foydalanuvchi"}
                </p>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  {currentUser?.phone || "+998"}
                </p>
              </div>
            </div>

            {onChangeUser && (
              <button
                onClick={onChangeUser}
                title="Ma'lumotlarni o'zgartirish"
                className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tahrirlash</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of the 6 Categories:
          MATEMATIKA, FIZIKA, ONA TILI VA ADABIYOT, INGLIZ TILI, TARIX, RUS TILI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((subject) => (
          <div
            key={subject.id}
            id={`category-exam-card-${subject.id}`}
            onClick={() => onSelectSubject(subject)}
            className="bg-white rounded-3xl border-2 border-emerald-100 hover:border-emerald-500 shadow-sm hover:shadow-2xl transition-all duration-200 p-6 flex flex-col justify-between group cursor-pointer transform hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getSubjectIcon(subject.iconName)}
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {subject.certType === "til" ? "CEFR / Til" : "Milliy Sertifikat"}
                </span>
              </div>

              {/* Exact Category Name in bold uppercase */}
              <h3 className="text-xl font-black text-emerald-950 group-hover:text-emerald-700 transition-colors tracking-wide uppercase">
                {subject.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                {subject.description}
              </p>

              {/* Exam specs */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{subject.durationMinutes} daqiqa</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>{subject.questionCount} ta savol</span>
                </div>
              </div>
            </div>

            {/* Direct Click to Start Exam */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                className="w-full py-3.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white group-hover:text-emerald-950 font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Award className="w-4 h-4" />
                <span>Imtihon topshirishni boshlash</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
