import React from "react";
import { LOGO_SRC } from "../data/logo";
import { Award, ArrowRight, CheckCircle2, Sparkles, BookOpenCheck, GraduationCap } from "lucide-react";

interface HeroProps {
  onStartExam: () => void;
  onExploreLessons: () => void;
  onExploreTeachers?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartExam, onExploreLessons, onExploreTeachers }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/80">
      {/* Subtle geometric pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Authentic Center Logo Badge */}
        <div className="mb-6 inline-flex items-center gap-3 p-2 bg-emerald-900/90 rounded-2xl border border-emerald-700/80 shadow-xl backdrop-blur">
          <div className="w-14 h-14 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shadow">
            <img
              src={LOGO_SRC}
              alt="Al-Xorazmiy Ta'lim Platformasi"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left pr-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Milliy Ta'lim Tizimi
            </span>
            <p className="text-sm font-bold text-white">Al-Xorazmiy Akademiyasi</p>
          </div>
        </div>

        {/* Exact User Requested Main Heading */}
        <h1
          id="hero-main-title"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl leading-tight"
        >
          AL-XORAZMIY XALQARO XUSUSIY MAKTABI | TA'LIM PLATFORMASI
        </h1>

        {/* Exact User Requested Subtitle */}
        <p
          id="hero-subtitle"
          className="mt-6 text-sm sm:text-base md:text-lg text-emerald-100/90 max-w-3xl leading-relaxed font-normal"
        >
          O'zbekiston Respublikasi Bilimni baholash agentligi (BBA) rasmiy milliy sertifikat imtihonlari talablari asosida — 35 ta test topshirig'i, belgilangan vaqt me'yori hamda Rash (Rasch) modeli bo'yicha haqiqiy sertifikat balli va OTM imtiyozlarini aniqlab oling.
        </p>

        {/* Exact User Requested "IMTIHON TOPSHIRISH" Button */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4">
          <button
            id="hero-start-exam-btn"
            onClick={onStartExam}
            className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Award className="w-6 h-6 text-emerald-950" />
            <span>IMTIHON TOPSHIRISH</span>
            <ArrowRight className="w-5 h-5 text-emerald-950" />
          </button>

          <button
            id="hero-view-lessons-btn"
            onClick={onExploreLessons}
            className="w-full sm:w-auto px-6 py-4 text-base font-semibold text-white bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/80 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpenCheck className="w-5 h-5 text-emerald-300" />
            <span>Bepul darslarni ko'rish</span>
          </button>
        </div>

        {/* Feature Highlights with Clean Emerald Tone */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl text-left">
          <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-xl p-4.5 flex items-start gap-3.5 backdrop-blur-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-white">8 ta Asosiy Fan</h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                Matematika, Fizika, Kimyo, Biologiya, Ona tili, Tarix, Ingliz tili va Rus tili.
              </p>
            </div>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-xl p-4.5 flex items-start gap-3.5 backdrop-blur-xs">
            <GraduationCap className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-white">35 ta Haqiqiy Test</h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                Bilimni baholash agentligi (BBA) formati va me'yorlariga 100% mos topshiriqlar.
              </p>
            </div>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-xl p-4.5 flex items-start gap-3.5 backdrop-blur-xs">
            <Award className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-white">Rash (Rasch) Baholash</h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                75 ballik shkala, darajalar (A+, A, B+, B, C+, C / C1, B2, B1) va OTM imtiyozi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
