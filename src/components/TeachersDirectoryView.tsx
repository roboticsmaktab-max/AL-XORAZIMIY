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
  Search,
  Filter,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface TeachersDirectoryViewProps {
  onSelectTeacher: (teacher: Teacher) => void;
  onOpenAddTeacher: () => void;
  onViewLessons: (subjectId: string) => void;
  onStartExam: (subjectId: string) => void;
  onAskTeacherAI: (subjectId: string, teacherName: string) => void;
  onGoHome: () => void;
}

export const TeachersDirectoryView: React.FC<TeachersDirectoryViewProps> = ({
  onSelectTeacher,
  onOpenAddTeacher,
  onViewLessons,
  onStartExam,
  onAskTeacherAI,
  onGoHome,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers] = useState<Teacher[]>(getTeachers());

  const filteredTeachers = teachers.filter((t) => {
    const matchesSubject = selectedSubjectFilter === "all" || t.subjectId === selectedSubjectFilter;
    const matchesSearch =
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.degree.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button
            onClick={onGoHome}
            className="hover:text-emerald-700 transition-colors cursor-pointer"
          >
            Bosh sahifa
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-emerald-800 font-bold">Domlalar va Ekspertlar Bo'limi</span>
        </div>

        {/* Directory Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>AL-XORAZMIY XALQARO XUSUSIY MAKTABI</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Platforma Domlalari va Ilmiy Ekspertlar
            </h1>
            <p className="text-sm sm:text-base text-emerald-200/90 max-w-2xl leading-relaxed">
              Barcha 8 ta asosiy fan bo'yicha Milliy sertifikat (BBA) hamda xalqaro darajadagi eng kuchli pedagoglar. Har bir domlaning shaxsiy sahifasida uning darslari, metodikasi, konsultatsiyasi va 35 talik Rasch testlari mavjud.
            </p>
          </div>

          <button
            onClick={onOpenAddTeacher}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 text-emerald-950" />
            <span>+ Yangi Domla Qo'shish</span>
          </button>
        </div>

        {/* Search & Subject Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Domla ism-sharifi, fani yoki mutaxassisligi bo'yicha qidirish..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs font-bold text-slate-500 shrink-0">
              Topildi: {filteredTeachers.length} nafar domla
            </span>
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none text-xs font-bold">
            <button
              onClick={() => setSelectedSubjectFilter("all")}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedSubjectFilter === "all"
                  ? "bg-emerald-700 text-white shadow"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Barcha Fanlar ({teachers.length})
            </button>
            {SUBJECTS.map((sub) => {
              const count = teachers.filter((t) => t.subjectId === sub.id).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectFilter(sub.id)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    selectedSubjectFilter === sub.id
                      ? "bg-emerald-700 text-white shadow"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {sub.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Card Top */}
              <div className="p-6 pb-4 border-b border-slate-100 relative">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-400 shrink-0 bg-slate-100 shadow-md">
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
                    <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-emerald-900 transition-colors">
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
                    Mualliflik Darslari ({teacher.lessonsTopics.length} ta)
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {teacher.lessonsTopics.slice(0, 3).map((top, idx) => (
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

                {/* Action Buttons: Opens individual dedicated teacher page */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onSelectTeacher(teacher)}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Domla sahifasiga o'tish (Batafsil)</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewLessons(teacher.subjectId)}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      Darslari
                    </button>
                    <button
                      onClick={() => onStartExam(teacher.subjectId)}
                      className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Imtihon</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
