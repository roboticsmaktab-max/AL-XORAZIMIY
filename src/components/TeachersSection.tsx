import React, { useState } from "react";
import { Teacher } from "../types";
import { SUBJECTS } from "../data/courses";
import { getTeachers } from "../data/teachers";
import {
  GraduationCap,
  Star,
  BookOpen,
  Award,
  UserPlus,
  Users,
  Sparkles,
  ArrowRight,
  Phone,
  Send,
  CheckCircle2,
} from "lucide-react";

interface TeachersSectionProps {
  onSelectTeacher: (teacher: Teacher) => void;
  onOpenAddTeacher: () => void;
  onViewLessons: (subjectId: string) => void;
  onStartExam: (subjectId: string) => void;
  onAskTeacherAI: (subjectId: string, teacherName: string) => void;
  onViewAllTeachers?: () => void;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({
  onSelectTeacher,
  onOpenAddTeacher,
  onViewLessons,
  onStartExam,
  onAskTeacherAI,
  onViewAllTeachers,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [teachers, setTeachers] = useState<Teacher[]>(getTeachers());

  const filteredTeachers = teachers.filter((t) => {
    if (selectedSubjectFilter === "all") return true;
    return t.subjectId === selectedSubjectFilter;
  });

  return (
    <section id="ustozlarimiz" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-black uppercase tracking-wider mb-3">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Har bir fanga alohida ustoz bo'limi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Platforma Ustozlari va Ekspertlar
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Har bitta ustoz o'z fani bo'yicha Milliy va xalqaro sertifikatlarga ega. Ularning shaxsiy bo'limidan darslari, testlari va bog'lanish kontaktlarini topasiz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onViewAllTeachers && (
              <button
                onClick={onViewAllTeachers}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 border-2 border-emerald-600 text-emerald-900 font-black text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Barcha Domlalar Bo'limi</span>
              </button>
            )}
            <button
              onClick={onOpenAddTeacher}
              className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Yangi Ustoz Qo'shish</span>
            </button>
          </div>
        </div>

        {/* Subject Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setSelectedSubjectFilter("all")}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedSubjectFilter === "all"
                ? "bg-emerald-700 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Barcha Ustozlar ({teachers.length})
          </button>
          {SUBJECTS.map((sub) => {
            const count = teachers.filter((t) => t.subjectId === sub.id).length;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectFilter(sub.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubjectFilter === sub.id
                    ? "bg-emerald-700 text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {sub.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-emerald-500/80 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Card Top */}
              <div className="p-6 pb-4 border-b border-slate-100 relative">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-400/80 shrink-0 bg-slate-100 shadow-md">
                    <img
                      src={teacher.avatarUrl}
                      alt={teacher.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-[9px] text-center font-bold text-emerald-300 py-0.5">
                      {teacher.experienceYears} yil
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 mb-1">
                      {teacher.subjectName}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 truncate">
                      {teacher.fullName}
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold truncate">
                      {teacher.role}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {teacher.rating.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {teacher.studentsCount}+ o'quvchi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges preview */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {teacher.badges.slice(0, 3).map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Middle: Ustoz Darslari Preview */}
              <div className="p-6 pt-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Ustoz Darslari ({teacher.lessonsTopics.length} ta)
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {teacher.lessonsTopics.slice(0, 2).map((top, idx) => (
                      <li key={idx} className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">{top}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact phone badge */}
                {teacher.contactPhone && (
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Aloqa:</span>
                    </span>
                    <a
                      href={`tel:${teacher.contactPhone.replace(/\s+/g, "")}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold text-emerald-800 hover:text-emerald-600 transition-colors"
                    >
                      {teacher.contactPhone}
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onSelectTeacher(teacher)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Ustoz Bo'limi (Batafsil profil)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewLessons(teacher.subjectId)}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      Darslarini ko'rish
                    </button>
                    <button
                      onClick={() => onStartExam(teacher.subjectId)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Imtihon</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
