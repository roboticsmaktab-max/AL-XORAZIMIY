import React from "react";
import { LOGO_SRC } from "../data/logo";
import { BookOpen, Award, ShieldCheck, UserCheck, Sparkles, Moon, Sun, PlusCircle, GraduationCap, Phone, MapPin, KeyRound, Mic } from "lucide-react";
import { RegistrationRecord } from "../types";
import { AdminAccountInfo } from "../data/apiClient";

interface NavbarProps {
  currentUser: RegistrationRecord | null;
  registrationCount: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenAdmin?: () => void;
  onOpenFlashAI: () => void;
  onOpenAddTest: () => void;
  onStartExam: () => void;
  onGoHome: () => void;
  onGoLessons: () => void;
  onGoTeachers: () => void;
  onGoSpeaking?: () => void;
  adminAccount?: AdminAccountInfo | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  registrationCount,
  isDarkMode = false,
  onToggleDarkMode,
  onOpenAdmin,
  onOpenFlashAI,
  onOpenAddTest,
  onStartExam,
  onGoHome,
  onGoLessons,
  onGoTeachers,
  onGoSpeaking,
  adminAccount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800 text-white shadow-md">
      {/* Top Hotline Bar */}
      <div className="bg-emerald-900/90 border-b border-emerald-800/80 text-[11px] sm:text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="hidden sm:inline font-medium text-emerald-200">
              Qabul va axborot markazi:
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-100 bg-emerald-800/80 px-2 py-0.5 rounded-md border border-emerald-700/60">
              <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
              <span>Rishton tumani</span>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 font-bold text-white">
            <a
              href="tel:+998940447700"
              className="flex items-center gap-1 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>+998 94 044 77 00</span>
            </a>
            <span className="text-emerald-500">•</span>
            <a
              href="tel:+998907791144"
              className="flex items-center gap-1 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>+998 90 779 11 44</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Brand Name */}
        <div
          id="nav-brand"
          onClick={onGoHome}
          onDoubleClick={() => {
            if (onOpenAdmin) onOpenAdmin();
          }}
          title="Al-Xorazmiy Ta'lim Platformasi"
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-inner flex items-center justify-center overflow-hidden border border-emerald-600/50 transition-transform group-hover:scale-105">
            <img
              src={LOGO_SRC}
              alt="Al-Xorazmiy Ta'lim Platformasi Logotipi"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm sm:text-base md:text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors leading-tight">
              AL-XORAZMIY XALQARO XUSUSIY MAKTABI
            </span>
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              TA'LIM PLATFORMASI
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            id="nav-home-btn"
            onClick={onGoHome}
            className="px-3 py-2 text-sm font-medium text-emerald-100 hover:text-white hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer"
          >
            Bosh sahifa
          </button>
          <button
            id="nav-lessons-btn"
            onClick={onGoLessons}
            className="px-3 py-2 text-sm font-medium text-emerald-100 hover:text-white hover:bg-emerald-900/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Bepul darslar
          </button>

          {/* English Speaking Simulator */}
          {onGoSpeaking && (
            <button
              id="nav-speaking-btn"
              onClick={onGoSpeaking}
              className="px-3 py-2 text-sm font-bold text-emerald-200 hover:text-white bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/80 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Ingliz tili Speaking (Og'zaki nutq) sinovi"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Speaking Sinovi</span>
              <span className="text-[10px] uppercase font-black px-1 py-0.5 bg-emerald-500 text-emerald-950 rounded">
                Yangi
              </span>
            </button>
          )}

          {/* Flash AI / Rash Model button */}
          <button
            id="nav-flash-ai-btn"
            onClick={onOpenFlashAI}
            className="px-3 py-2 text-sm font-bold text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Flash AI Modeli</span>
          </button>

          <button
            id="nav-exam-btn"
            onClick={onStartExam}
            className="px-3.5 py-2 text-sm font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            Imtihon topshirish
          </button>
        </nav>

        {/* Right action area: Admin, Dark Mode, Active User */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle (in case user meant 'dark mode') */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? "Yorug' rejimga o'tish" : "Tungi rejimga o'tish (Dark mode)"}
              className="p-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile Flash AI Icon */}
          <button
            onClick={onOpenFlashAI}
            title="Flash AI Modeli"
            className="md:hidden p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/30 transition-colors"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
          </button>

          {currentUser && (
            <div className="hidden lg:flex items-center gap-2 bg-emerald-900/70 border border-emerald-700/60 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[120px] text-white font-semibold">
                {currentUser.fullName}
              </span>
            </div>
          )}

          {/* Admin tugmasi (bosh sahifa tepasida ko'rinadigan, zamonaviy va chiroyli dizaynda) */}
          {onOpenAdmin && (
            <button
              id="admin-panel-toggle-btn"
              onClick={onOpenAdmin}
              title={adminAccount ? `Admin kabineti (@${adminAccount.username})` : "Admin tizimiga kirish"}
              className={`relative px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                adminAccount
                  ? "text-emerald-950 bg-gradient-to-r from-emerald-300 to-emerald-400 hover:from-emerald-200 hover:to-emerald-300 border border-emerald-300 shadow-emerald-500/20"
                  : "text-emerald-100 bg-emerald-900/90 hover:bg-emerald-800 hover:text-white border border-emerald-700/80 hover:border-emerald-500"
              }`}
            >
              {adminAccount ? (
                <KeyRound className="w-4 h-4 text-emerald-950 animate-bounce" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span className="inline font-bold">
                {adminAccount ? `@${adminAccount.username}` : "Admin"}
              </span>
              {adminAccount ? (
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping ml-0.5" />
              ) : (
                registrationCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-extrabold bg-emerald-500 text-emerald-950 rounded-full">
                    {registrationCount}
                  </span>
                )
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
