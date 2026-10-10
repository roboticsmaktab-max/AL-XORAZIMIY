import React, { useState } from "react";
import { Teacher, TeacherReview } from "../types";
import { SUBJECTS } from "../data/courses";
import { addTeacherReview, getTeachers } from "../data/teachers";
import { createConsultationOnServer } from "../data/apiClient";
import { LOGO_SRC } from "../data/logo";
import {
  GraduationCap,
  Star,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Phone,
  Send,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Users,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  ThumbsUp,
  Share2,
} from "lucide-react";

interface TeacherDetailPageProps {
  teacher: Teacher;
  onBack: () => void;
  onSelectTeacher: (teacher: Teacher) => void;
  onStartExam: (subjectId: string) => void;
  onViewLessons: (subjectId: string) => void;
  onAskTeacherAI: (subjectId: string, teacherName: string) => void;
}

export const TeacherDetailPage: React.FC<TeacherDetailPageProps> = ({
  teacher,
  onBack,
  onSelectTeacher,
  onStartExam,
  onViewLessons,
  onAskTeacherAI,
}) => {
  const [activeTab, setActiveTab] = useState<"about" | "lessons" | "exam" | "reviews" | "consultation">("about");
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerScore, setReviewerScore] = useState("");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Consultation Form State
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("+998 ");
  const [preferredTime, setPreferredTime] = useState("Kechki payt (17:00 - 19:00)");
  const [consultationMessage, setConsultationMessage] = useState("");
  const [consultationSuccess, setConsultationSuccess] = useState(false);

  // Other teachers for quick switching
  const allTeachers = getTeachers();
  const otherTeachers = allTeachers.filter((t) => t.id !== teacher.id);

  const subjectObj = SUBJECTS.find((s) => s.id === teacher.subjectId);

  const handleCopyPhone = () => {
    if (teacher.contactPhone) {
      navigator.clipboard.writeText(teacher.contactPhone.replace(/\s+/g, ""));
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    addTeacherReview(teacher.id, {
      studentName: reviewerName.trim(),
      scoreOrCert: reviewerScore.trim() || "Milliy sertifikat nomzodi",
      rating: reviewerRating,
      comment: reviewerComment.trim(),
    });

    setReviewSuccess(true);
    setReviewerName("");
    setReviewerScore("");
    setReviewerComment("");
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewForm(false);
    }, 2000);
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) return;

    await createConsultationOnServer({
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      subjectName: teacher.subjectName,
      studentName: studentName.trim(),
      phone: studentPhone.trim(),
      preferredTime,
      message: consultationMessage.trim(),
    });

    setConsultationSuccess(true);
    setStudentName("");
    setStudentPhone("+998 ");
    setConsultationMessage("");
    setTimeout(() => {
      setConsultationSuccess(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Breadcrumbs & Back Bar */}
      <div className="bg-emerald-950 text-white border-b border-emerald-800 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Barcha Domlalar Ro'yxatiga Qaytish</span>
          </button>

          <div className="flex items-center gap-2 text-emerald-300/80 text-xs">
            <span>Al-Xorazmiy</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Domlalar</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">{teacher.fullName}</span>
          </div>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white relative overflow-hidden border-b-4 border-emerald-600 shadow-xl">
        {/* Decorative background logo */}
        <div className="absolute right-[-60px] top-[-60px] w-96 h-96 opacity-5 pointer-events-none">
          <img src={LOGO_SRC} alt="" className="w-full h-full object-contain" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Teacher Photo & Floating Badges */}
            <div className="relative shrink-0 text-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-emerald-400 shadow-2xl bg-emerald-900 mx-auto">
                <img
                  src={teacher.avatarUrl}
                  alt={teacher.fullName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tasdiqlangan ekspert-domla</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-400 text-emerald-950">
                  {teacher.subjectName}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-800/90 text-emerald-200 border border-emerald-700/80">
                  {teacher.experienceYears} yillik tajriba
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{teacher.rating.toFixed(2)} reyting</span>
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-800/80 text-emerald-200 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{teacher.studentsCount}+ shogird</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {teacher.fullName}
              </h1>

              <p className="text-base sm:text-lg font-semibold text-emerald-300">
                {teacher.role}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 flex items-center justify-center lg:justify-start gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{teacher.degree}</span>
              </p>

              {/* Badges preview */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-2">
                {teacher.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-emerald-800/60 border border-emerald-700/60 text-[11px] font-medium text-emerald-100"
                  >
                    {b}
                  </span>
                ))}
              </div>

              {/* Action Buttons in Hero */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => setActiveTab("consultation")}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-emerald-950" />
                  <span>Darsga / Konsultatsiyaga yozilish</span>
                </button>

                <button
                  onClick={() => onStartExam(teacher.subjectId)}
                  className="px-5 py-3 rounded-2xl bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm border border-emerald-600/70 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-emerald-300" />
                  <span>35 talik Sertifikat Testi (Rasch)</span>
                </button>

                <button
                  onClick={() => onAskTeacherAI(teacher.subjectId, teacher.fullName)}
                  className="px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Repetitor bilan savol-javob</span>
                </button>
              </div>

              {/* Contact direct buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs">
                {teacher.contactPhone && (
                  <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <a
                      href={`tel:${teacher.contactPhone.replace(/\s+/g, "")}`}
                      className="font-bold text-white hover:text-emerald-300 transition-colors"
                    >
                      {teacher.contactPhone}
                    </a>
                    <button
                      onClick={handleCopyPhone}
                      className="ml-1 text-[10px] text-emerald-300 hover:text-white underline cursor-pointer"
                    >
                      {copiedPhone ? "Nusxalandi!" : "Nusxalash"}
                    </button>
                  </div>
                )}
                {teacher.telegramHandle && (
                  <a
                    href={`https://t.me/${teacher.telegramHandle.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-800 text-emerald-200 hover:text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram: {teacher.telegramHandle}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="bg-emerald-950/90 border-t border-emerald-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "about"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-emerald-200 hover:text-white hover:bg-emerald-900/60"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Domla Haqida & Metodika</span>
            </button>

            <button
              onClick={() => setActiveTab("lessons")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "lessons"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-emerald-200 hover:text-white hover:bg-emerald-900/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Mualliflik Darslari ({teacher.lessonsTopics.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("exam")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "exam"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-emerald-200 hover:text-white hover:bg-emerald-900/60"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Milliy Sertifikat Testi (35 ta)</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-emerald-200 hover:text-white hover:bg-emerald-900/60"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Sharhlar va Natijalar ({teacher.reviews?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab("consultation")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "consultation"
                  ? "bg-emerald-500 text-emerald-950 shadow"
                  : "text-amber-300 hover:text-amber-200 hover:bg-emerald-900/60"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Konsultatsiyaga Yozilish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area Based on Active Tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* TAB 1: ABOUT & CREDENTIALS */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Detailed Bio, Education, Methodology */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-black uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>Pedagogik Faoliyat va Biografiya</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {teacher.fullName} haqida ma'lumot
                </h2>
                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {teacher.bio}
                </p>

                {teacher.consultationSchedule && (
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center gap-3">
                    <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <span className="font-bold block text-emerald-900">Dars va konsultatsiya qabul vaqtlari:</span>
                      <span>{teacher.consultationSchedule}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Education & Qualifications */}
              {teacher.education && teacher.education.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    <span>Ta'lim va Malaka darajalari</span>
                  </h3>
                  <div className="space-y-3">
                    {teacher.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                      >
                        <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">{edu}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Methodology */}
              {teacher.methodology && teacher.methodology.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Mualliflik O'qitish Metodikasi</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    O'zbekiston BBA va xalqaro Rasch baholash mezonlariga asoslangan zamonaviy dars uslubi:
                  </p>
                  <div className="space-y-3">
                    {teacher.methodology.map((meth, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-emerald-950">{meth}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Achievements */}
              {teacher.achievements && teacher.achievements.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>Erishilgan Yutuqlar va Natijalar</span>
                  </h3>
                  <div className="space-y-3">
                    {teacher.achievements.map((ach, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3"
                      >
                        <Star className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-900">{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Col: Quick Contact, Exam CTA, Subject Specs */}
            <div className="space-y-6">
              {/* Quick Exam Card */}
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 border border-emerald-700 shadow-lg space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  BBA Rasch Standarti
                </span>
                <h3 className="text-xl font-black">
                  {teacher.subjectName} Imtihonini Topshiring
                </h3>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Ushbu domla metodikasi asosida tuzilgan 35 ta sertifikat testini yeching va Rasch modeli (75.0 ball) bo'yicha darajangizni aniqlang.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onStartExam(teacher.subjectId)}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-emerald-950" />
                    <span>Hozirroq Sinovni Boshlash</span>
                  </button>
                </div>
              </div>

              {/* AI Assistant Card */}
              <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Flash AI Repetitor</span>
                </div>
                <h4 className="text-base font-black text-slate-900">
                  {teacher.fullName} nomidan savol so'rang
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Domlaning fani bo'yicha formulalar, yechimlar yoki qiyin mavzular yuzasidan sun'iy intellektdan tezkor javob oling.
                </p>
                <button
                  onClick={() => onAskTeacherAI(teacher.subjectId, teacher.fullName)}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>AI bilan savol-javob</span>
                </button>
              </div>

              {/* Consultation Booking Quick Card */}
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-3">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>To'g'ridan-to'g'ri aloqa</span>
                </h4>
                <p className="text-xs text-slate-600">
                  Ustoz bilan individual darslar va konsultatsiya uchun bog'lanish:
                </p>
                {teacher.contactPhone && (
                  <a
                    href={`tel:${teacher.contactPhone.replace(/\s+/g, "")}`}
                    className="block w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs text-center transition-colors"
                  >
                    Qo'ng'iroq qilish: {teacher.contactPhone}
                  </a>
                )}
                {teacher.telegramHandle && (
                  <a
                    href={`https://t.me/${teacher.telegramHandle.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 font-black text-xs text-center transition-colors"
                  >
                    Telegram orqali yozish
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LESSONS & CURRICULUM */}
        {activeTab === "lessons" && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-black uppercase tracking-wider mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Fan Kursi Darslari</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {teacher.fullName} tomonidan tayyorlangan darslar
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Har bir mavzu O'zbekiston davlat ta'lim standarti va Milliy sertifikat mezonlariga moslashtirilgan.
                  </p>
                </div>

                <button
                  onClick={() => onViewLessons(teacher.subjectId)}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm tracking-wide shadow transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Platforma darslari bo'limiga o'tish</span>
                </button>
              </div>

              {/* Lessons List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {teacher.lessonsTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border-2 border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all bg-white flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">
                          {idx + 1}-mavzu
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>45 daqiqa</span>
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                        {topic}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        Nazariy ma'lumotlar, formulalar isboti, Milliy sertifikat darajasidagi namunaviy masalalar tahlili va amaliy topshiriqlar.
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Bepul ochiq dars</span>
                      </span>
                      <button
                        onClick={() => onViewLessons(teacher.subjectId)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Darsni ko'rish</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXAM (35 QUESTIONS, RASCH) */}
        {activeTab === "exam" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-8">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2">
                O'zbekiston BBA Standarti
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {teacher.fullName} — {teacher.subjectName} Milliy Sertifikat Testi
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                Ushbu fan bo'yicha Bilimni baholash agentligi (BBA) tomonidan belgilangan rasmiy standartlarga mos 35 ta test savoli tayyorlangan. Imtihon Rasch modeli (75.0 ball) bo'yicha baholanadi.
              </p>
            </div>

            {/* Exam Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-700 block mb-1">Savollar soni</span>
                <span className="text-2xl font-black text-emerald-950">35 ta test</span>
                <p className="text-[11px] text-slate-600 mt-1">Barcha murakkablik darajalarida</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-700 block mb-1">Rasch Shkalasi</span>
                <span className="text-2xl font-black text-emerald-950">75.0 ball</span>
                <p className="text-[11px] text-slate-600 mt-1">A+, A, B+, B, C darajalar</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-700 block mb-1">OTM Imtiyozi</span>
                <span className="text-2xl font-black text-emerald-950">100% gacha</span>
                <p className="text-[11px] text-slate-600 mt-1">Maksimal imtiyoz balli ta'minlanadi</p>
              </div>
            </div>

            {/* Difficulty weights breakdown */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Topshiriqlar darajalari va koeffitsiyentlari:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="font-bold text-emerald-800 block">Boshlang'ich daraja</span>
                  <span className="text-slate-600">1.6 balllik koeffitsiyent</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-200">
                  <span className="font-bold text-blue-800 block">O'rta daraja</span>
                  <span className="text-slate-600">2.1 balllik koeffitsiyent</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-800 block">Yuqori daraja</span>
                  <span className="text-slate-600">2.7 balllik koeffitsiyent</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onStartExam(teacher.subjectId)}
                className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base tracking-wide shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <Award className="w-5 h-5 text-white" />
                <span>Ushbu Fan Bo'yicha Imtihonni Boshlash</span>
              </button>

              <button
                onClick={() => onViewLessons(teacher.subjectId)}
                className="px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>Oldin darslarni takrorlash</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS & TESTIMONIALS */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    O'quvchilar va Ota-onalar fikrlari
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {teacher.fullName} o'quvchilarining to'plagan ballari va natijalar haqidagi fikrlari.
                  </p>
                </div>

                <button
                  onClick={() => setShowReviewForm((prev) => !prev)}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{showReviewForm ? "Formani yopish" : "+ O'z fikringizni qoldiring"}</span>
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-6 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-4 animate-in fade-in duration-200"
                >
                  <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                    Yangi Fikr / Sharh Yozish
                  </h4>

                  {reviewSuccess && (
                    <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Rahmat! Sizning fikringiz muvaffaqiyatli saqlandi!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ism-sharifingiz:
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="Masalan: Sardor Komilov"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Natijangiz yoki o'qiyotgan joyingiz:
                      </label>
                      <input
                        type="text"
                        value={reviewerScore}
                        onChange={(e) => setReviewerScore(e.target.value)}
                        placeholder="Masalan: A+ sertifikat (71.5 ball) yoki TATU 1-kurs"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ustozga bahoyingiz:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewerRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewerRating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 ml-2">
                        {reviewerRating} / 5 yulduz
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fikr va minnatdorchilik matni:
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewerComment}
                      onChange={(e) => setReviewerComment(e.target.value)}
                      placeholder="Ustozning darslari, tushuntirish uslubi va erishgan natijangiz haqida yozing..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
                  >
                    Sharhni yuborish
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {(!teacher.reviews || teacher.reviews.length === 0) && (
                  <p className="text-xs text-slate-500 italic py-4">
                    Hozircha sharhlar yo'q. Birinchi bo'lib fikr qoldiring!
                  </p>
                )}

                {teacher.reviews &&
                  teacher.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 hover:bg-white transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-black text-slate-900">
                            {rev.studentName}
                          </h4>
                          <span className="text-xs font-semibold text-emerald-700">
                            {rev.scoreOrCert}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                          <span className="text-[11px] text-slate-400 ml-1.5">{rev.date}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONSULTATION & BOOKING */}
        {activeTab === "consultation" && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-6">
            <div className="text-center space-y-2 pb-6 border-b border-slate-100">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider">
                Al-Xorazmiy Ta'lim Xizmati
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {teacher.fullName} bilan Dars / Konsultatsiyaga Yozilish
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Formani to'ldiring, ma'muriyatimiz va domlamiz 15 daqiqa ichida siz bilan bog'lanib, o'quv rejasini belgilaydi.
              </p>
            </div>

            {consultationSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center space-y-3 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-emerald-950">
                  Arizangiz qabul qilindi!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                  {teacher.fullName} va qabul markazi mutaxassislari tez orada siz bilan bog'lanishadi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    O'quvchi yoki ota-onaning ism-sharifi: *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Masalan: Jamshid Yo'ldoshev"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Telefon raqamingiz: *
                  </label>
                  <input
                    type="tel"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Sizga qulay bo'lgan dars / qo'ng'iroq vaqti:
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="Ertalab (09:00 - 12:00)">Ertalab (09:00 - 12:00)</option>
                    <option value="Tushdan keyin (13:00 - 16:00)">Tushdan keyin (13:00 - 16:00)</option>
                    <option value="Kechki payt (17:00 - 20:00)">Kechki payt (17:00 - 20:00)</option>
                    <option value="Dam olish kunlari (Shanba / Yakshanba)">Dam olish kunlari (Shanba / Yakshanba)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Qo'shimcha savol yoki maqsadingiz (ixtiyoriy):
                  </label>
                  <textarea
                    rows={3}
                    value={consultationMessage}
                    onChange={(e) => setConsultationMessage(e.target.value)}
                    placeholder="Masalan: Milliy sertifikatdan A+ olib Tibbiyot akademiyasiga topshirmoqchiman..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    <span>Arizani Tasdiqlash va Yuborish</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 text-center pt-1">
                  Ma'lumotlaringiz maxfiy saqlanadi va faqat o'quv dasturi koordinatsiyasi uchun ishlatiladi.
                </p>
              </form>
            )}
          </div>
        )}

        {/* Bottom Section: Recommendation of Other Teachers */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Boshqa Fan Domlalari
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Boshqa fanlar bo'yicha ham yetakchi ekspertlar bilan tanishing:
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Barcha domlalarni ko'rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherTeachers.slice(0, 4).map((ot) => (
              <div
                key={ot.id}
                onClick={() => {
                  onSelectTeacher(ot);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex items-center gap-3.5"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-emerald-300 bg-slate-100 shrink-0">
                  <img
                    src={ot.avatarUrl}
                    alt={ot.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {ot.subjectName}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 truncate mt-1 group-hover:text-emerald-800 transition-colors">
                    {ot.fullName}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{ot.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({ot.studentsCount}+)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
