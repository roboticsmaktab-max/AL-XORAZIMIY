import React, { useState, useEffect } from "react";
import { SUBJECTS, LESSONS_DATA } from "../data/courses";
import { Subject, Lesson, VideoShort } from "../types";
import { fetchVideos } from "../data/apiClient";
import {
  Calculator,
  Zap,
  BookOpen,
  Globe,
  Landmark,
  Languages,
  ChevronRight,
  ArrowLeft,
  PlayCircle,
  FileText,
  Clock,
  PlusCircle,
  CheckCircle,
  Sparkles,
  BookCheck,
  Video,
  Play,
  ExternalLink,
  Mic,
} from "lucide-react";

interface FreeLessonsProps {
  onStartExamForSubject?: (subjectId: string) => void;
  onOpenAddTest?: (subjectId: string) => void;
  onOpenSpeaking?: () => void;
}

export const FreeLessons: React.FC<FreeLessonsProps> = ({ onStartExamForSubject, onOpenSpeaking }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [customLessons, setCustomLessons] = useState<Record<string, Lesson[]>>({});
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTopics, setNewTopics] = useState("");
  const [videoShorts, setVideoShorts] = useState<VideoShort[]>([]);

  useEffect(() => {
    fetchVideos().then((data) => {
      if (Array.isArray(data)) {
        setVideoShorts(data);
      }
    });
  }, []);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case "Calculator":
        return <Calculator className="w-7 h-7 text-emerald-600" />;
      case "Zap":
        return <Zap className="w-7 h-7 text-amber-500" />;
      case "BookOpen":
        return <BookOpen className="w-7 h-7 text-emerald-600" />;
      case "Globe":
        return <Globe className="w-7 h-7 text-blue-500" />;
      case "Landmark":
        return <Landmark className="w-7 h-7 text-emerald-700" />;
      case "Languages":
        return <Languages className="w-7 h-7 text-indigo-500" />;
      default:
        return <BookOpen className="w-7 h-7 text-emerald-600" />;
    }
  };

  const getLessonsForSubject = (subjectId: string): Lesson[] => {
    const defaultLessons = LESSONS_DATA[subjectId] || [];
    const added = customLessons[subjectId] || [];
    return [...defaultLessons, ...added];
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !newTitle.trim() || !newContent.trim()) return;

    const newLesson: Lesson = {
      id: "lesson-" + Date.now(),
      title: newTitle.trim(),
      summary: newSummary.trim() || "Yangi joylangan dars",
      content: newContent.trim(),
      available: true,
      topics: newTopics
        ? newTopics.split(",").map((t) => t.trim()).filter(Boolean)
        : ["Nazariy asoslar", "Mustaqil tahlil"],
    };

    setCustomLessons((prev) => ({
      ...prev,
      [selectedSubject.id]: [...(prev[selectedSubject.id] || []), newLesson],
    }));

    setNewTitle("");
    setNewSummary("");
    setNewContent("");
    setNewTopics("");
    setIsAddingLesson(false);
    setActiveLesson(newLesson);
  };

  return (
    <section id="bepul-darslar" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      {!selectedSubject && (
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Ochiq Ta'lim Resurslari
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
            BEPUL DARSLAR BO'LIMI
          </h2>
          <p className="mt-3 text-base sm:text-lg text-emerald-800/80 leading-relaxed">
            Quyidagi fanlardan birini tanlang va malakali ustozlarimiz tomonidan tayyorlangan
            darslar, konspektlar hamda mavzular tahlili bilan bepul tanishing.
          </p>
        </div>
      )}

      {/* VIEW 1: All Subjects Categories Grid */}
      {!selectedSubject && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS.map((subject) => {
            const lessonsCount = getLessonsForSubject(subject.id).length;
            return (
              <div
                key={subject.id}
                id={`subject-card-${subject.id}`}
                onClick={() => {
                  setSelectedSubject(subject);
                  setActiveLesson(null);
                }}
                className="group relative bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-500/80 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getSubjectIcon(subject.iconName)}
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                      {subject.certType === "til" ? "CEFR / Til" : "Milliy Sertifikat"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {subject.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4 text-emerald-600" />
                    {lessonsCount} ta dars mavjud
                  </span>
                  <div className="flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all">
                    <span>Darslarga kirish</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video & Shorts Showcase (Global) */}
      {!selectedSubject && videoShorts.length > 0 && (
        <div className="mt-14 pt-10 border-t border-emerald-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Video className="w-3.5 h-3.5 text-rose-600" />
                <span>Tezkor Video & Shorts</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Foydali ta'limiy video qo'llanmalar
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Jami: {videoShorts.length} ta video mavjud
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videoShorts.map((vid) => (
              <div
                key={vid.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-rose-400 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                      <Play className="w-3 h-3 fill-rose-600 text-rose-600" />
                      {vid.subjectName || "Umumiy"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {vid.durationSeconds ? `${vid.durationSeconds} soniya` : "Shorts"}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-950 group-hover:text-rose-700 transition-colors line-clamp-2">
                    {vid.title}
                  </h4>

                  {vid.description && (
                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {vid.authorName || "Al-Xorazmiy"}
                  </span>
                  <a
                    href={vid.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    <span>Ko'rish</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Inside a Selected Subject (Category view) */}
      {selectedSubject && !activeLesson && (
        <div className="space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                id="back-to-categories-btn"
                onClick={() => setSelectedSubject(null)}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Barcha fanlar</span>
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                  {selectedSubject.name} — Bepul darslar
                </h2>
                <p className="text-xs sm:text-sm text-emerald-700">
                  Ushbu fandan yozdirilgan barcha darslar va konspektlar
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {selectedSubject.id === "ingliz-tili" && onOpenSpeaking && (
                <button
                  id="open-speaking-simulator-btn"
                  onClick={onOpenSpeaking}
                  className="px-3.5 py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-800 to-emerald-950 text-emerald-100 hover:text-white border border-emerald-500/70 rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Speaking (Og'zaki Nutq) Sinovi</span>
                  <span className="text-[10px] bg-emerald-500 text-emerald-950 px-1 rounded font-black uppercase">
                    CEFR
                  </span>
                </button>
              )}

              <button
                id="add-lesson-open-btn"
                onClick={() => setIsAddingLesson(true)}
                className="px-3.5 py-2 text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Dars joylash / qo'shish</span>
              </button>

              {onStartExamForSubject && (
                <button
                  id="subject-direct-exam-btn"
                  onClick={() => onStartExamForSubject(selectedSubject.id)}
                  className="px-4 py-2 text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BookCheck className="w-4 h-4" />
                  <span>Imtihondan sinab ko'rish</span>
                </button>
              )}
            </div>
          </div>

          {/* Lessons list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getLessonsForSubject(selectedSubject.id).map((lesson, idx) => (
              <div
                key={lesson.id}
                id={`lesson-item-${lesson.id}`}
                onClick={() => setActiveLesson(lesson)}
                className="bg-white rounded-2xl border border-emerald-100 hover:border-emerald-400 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      Mavzu #{idx + 1}
                    </span>
                    {lesson.available ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        O'rganishga tayyor
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Yozib olinmoqda
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{lesson.summary}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {lesson.topics.map((top, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-medium bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {top}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span className="flex items-center gap-1 text-slate-500 font-normal">
                    <Clock className="w-3.5 h-3.5" />
                    15-20 daqiqa
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Konspektni o'qish
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Videos/Shorts specifically for this subject */}
          {videoShorts.filter((v) => v.subjectId === selectedSubject.id).length > 0 && (
            <div className="mt-8 p-5 bg-rose-50/50 rounded-2xl border border-rose-200">
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-4 h-4 text-rose-600" />
                <h4 className="text-sm font-bold text-rose-950">
                  {selectedSubject.name} bo'yicha tezkor video roliklar
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videoShorts
                  .filter((v) => v.subjectId === selectedSubject.id)
                  .map((vid) => (
                    <div
                      key={vid.id}
                      className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{vid.title}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {vid.authorName || "Al-Xorazmiy"} • {vid.durationSeconds || 60}s
                        </p>
                      </div>
                      <a
                        href={vid.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1"
                      >
                        <span>Ko'rish</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Quick Notice about updating courses */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              <strong>Ustozlarimiz e'tiboriga:</strong> Al-Xorazmiy ta'lim platformasida yangi
              yozilgan video darslar, konspektlar va mashqlar yuqoridagi{" "}
              <span className="font-semibold underline">"Dars joylash / qo'shish"</span> tugmasi
              orqali to'g'ridan-to'g'ri fan bazasiga qo'shib boriladi.
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Specific Lesson Reader */}
      {selectedSubject && activeLesson && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-emerald-100">
            <button
              id="back-to-lessons-btn"
              onClick={() => setActiveLesson(null)}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{selectedSubject.name} darslariga qaytish</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                {selectedSubject.name}
              </span>
              <span className="text-xs text-slate-500 font-medium">Al-Xorazmiy Ta'lim</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              {activeLesson.title}
            </h2>
            <p className="mt-2 text-base text-slate-600">{activeLesson.summary}</p>
          </div>

          {/* Topics covered pill list */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              Darsda o'rganiladigan asosiy tayanch tushunchalar:
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeLesson.topics.map((top, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 shadow-2xs"
                >
                  {top}
                </span>
              ))}
            </div>
          </div>

          {/* Main content body */}
          <div className="prose prose-emerald max-w-none text-slate-800 leading-relaxed font-normal whitespace-pre-line bg-slate-50/60 p-6 rounded-2xl border border-slate-200">
            {activeLesson.content}
          </div>

          {/* Bottom Action bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setActiveLesson(null)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
            >
              Keyingi mavzularga qaytish
            </button>

            {onStartExamForSubject && (
              <button
                onClick={() => onStartExamForSubject(selectedSubject.id)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookCheck className="w-4 h-4" />
                <span>Ushbu fandan demo imtihon topshirish</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add / Upload New Lesson */}
      {isAddingLesson && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-emerald-950">
                {selectedSubject.name} uchun yangi dars joylash
              </h3>
              <button
                onClick={() => setIsAddingLesson(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dars mavzusi / sarlavhasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Logarifmik tengsizliklarni yechish usullari"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Qisqacha mazmuni (Annotatsiya)
                </label>
                <input
                  type="text"
                  placeholder="Mavzuning asosiy amaliy ahamiyati va qoidalari..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kalit so'zlar / Tayanch tushunchalar (vergul bilan)
                </label>
                <input
                  type="text"
                  placeholder="Formulalar, Teoremalar, Misollar tahlili"
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dars matni va konspekti *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Darsning batafsil qoidalari, formulalari va yechim algoritmlarini kiriting..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingLesson(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow cursor-pointer"
                >
                  Darsni joylash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
