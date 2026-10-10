import React from "react";
import { Teacher, Subject } from "../types";
import { SUBJECTS } from "../data/courses";
import {
  X,
  Award,
  BookOpen,
  GraduationCap,
  Star,
  Users,
  Phone,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface TeacherProfileModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onStartExam: (subjectId: string) => void;
  onViewLessons: (subjectId: string) => void;
  onAskTeacherAI: (subjectId: string, teacherName: string) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onStartExam,
  onViewLessons,
  onAskTeacherAI,
}) => {
  if (!isOpen || !teacher) return null;

  const subjectObj = SUBJECTS.find((s) => s.id === teacher.subjectId);

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] shadow-2xl border-2 border-emerald-300 flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Photo & Gradient */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-3 border-emerald-400 shadow-xl shrink-0 bg-emerald-800">
              <img
                src={teacher.avatarUrl}
                alt={teacher.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-[10px] text-center font-bold text-emerald-300 py-0.5">
                {teacher.experienceYears} yil tajriba
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950">
                  {teacher.subjectName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-800/80 text-emerald-200 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                  {teacher.rating.toFixed(2)} reyting
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {teacher.fullName}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-emerald-300">
                {teacher.role}
              </p>
              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{teacher.degree}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Badges / Yutuqlar */}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Sertifikatlar va Yutuqlar
            </h4>
            <div className="flex flex-wrap gap-2">
              {teacher.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Ustoz haqida (Bio) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">
              Ustoz Haqida
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {teacher.bio}
            </p>
          </div>

          {/* Ustozning Asosiy Dars Mavzulari */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Ustozning Asosiy Darslari ({teacher.lessonsTopics.length} ta)
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onViewLessons(teacher.subjectId);
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Barcha darslar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {teacher.lessonsTopics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onClose();
                    onViewLessons(teacher.subjectId);
                  }}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-emerald-950">
                      {topic}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Ko'rish <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ustoz bilan bog'lanish va Konsultatsiya */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-3">
            <h4 className="text-xs font-black uppercase text-emerald-950 tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              Ustoz bilan bog'lanish va Konsultatsiya
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
              {teacher.contactPhone && (
                <a
                  href={`tel:${teacher.contactPhone.replace(/\s+/g, "")}`}
                  className="p-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>{teacher.contactPhone}</span>
                </a>
              )}
              {teacher.telegramHandle && (
                <a
                  href={`https://t.me/${teacher.telegramHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 flex items-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>{teacher.telegramHandle}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              onAskTeacherAI(teacher.subjectId, teacher.fullName);
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-950" />
            <span>Ustoz nomidan AI bilan savol-javob</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onViewLessons(teacher.subjectId);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Darslari
            </button>
            <button
              onClick={() => {
                onClose();
                onStartExam(teacher.subjectId);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Imtihon topshirish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
