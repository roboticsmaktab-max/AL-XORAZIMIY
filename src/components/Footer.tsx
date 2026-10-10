import React from "react";
import { LOGO_SRC } from "../data/logo";
import { BookOpen, Award, Phone, Mail, MapPin, Lock, ShieldCheck, Send, Instagram, ExternalLink } from "lucide-react";
import { AdminAccountInfo } from "../data/apiClient";

interface FooterProps {
  onGoHome: () => void;
  onGoLessons: () => void;
  onStartExam: () => void;
  onGoSpeaking?: () => void;
  onGoTeachers?: () => void;
  onOpenAdmin?: () => void;
  adminAccount?: AdminAccountInfo | null;
}

export const Footer: React.FC<FooterProps> = ({
  onGoHome,
  onGoLessons,
  onStartExam,
  onGoSpeaking,
  onGoTeachers,
  onOpenAdmin,
  adminAccount,
}) => {
  return (
    <footer className="bg-emerald-950 text-white border-t border-emerald-800/80 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1: Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden border border-emerald-700 shadow">
              <img
                src={LOGO_SRC}
                alt="Al-Xorazmiy Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight text-white block leading-tight">
                AL-XORAZMIY XALQARO XUSUSIY MAKTABI
              </span>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
                TA'LIM PLATFORMASI
              </p>
            </div>
          </div>
          <p className="text-sm text-emerald-200/80 max-w-md leading-relaxed">
            Barcha fanlardan davlat sertifikat imtihonlariga sifatli tayyorgarlik ko'rish, bepul
            darslar bazasidan foydalanish hamda demo sertifikat sinovlarini topshirish uchun
            yaratilgan milliy ta'lim platformasi.
          </p>
        </div>

        {/* Col 2: Sahifalar */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Bo'limlar</h4>
          <ul className="space-y-2 text-sm text-emerald-200/80">
            <li>
              <button
                onClick={onGoHome}
                className="hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Bosh sahifa
              </button>
            </li>
            <li>
              <button
                onClick={onGoLessons}
                className="hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Bepul darslar
              </button>
            </li>
            <li>
              <button
                onClick={onStartExam}
                className="hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Demo imtihon topshirish
              </button>
            </li>
            {onGoSpeaking && (
              <li>
                <button
                  onClick={onGoSpeaking}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-emerald-300 font-semibold flex items-center gap-1.5"
                >
                  <span>Ingliz tili: Speaking sinovi</span>
                  <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-bold">
                    CEFR
                  </span>
                </button>
              </li>
            )}
            {onOpenAdmin && (
              <li className="pt-2 border-t border-emerald-900/60">
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-emerald-300 transition-colors cursor-pointer inline-flex items-center gap-1.5 text-xs text-emerald-300/70 hover:text-white"
                  title="Tizim ma'muriyati uchun maxfiy kirish (Ctrl+Shift+A)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{adminAccount ? `Admin kabineti (@${adminAccount.username})` : "Tizim ma'murlari"}</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Col 3: Bog'lanish */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Bog'lanish</h4>
          <ul className="space-y-2.5 text-xs text-emerald-200/80">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href="https://maps.google.com/?q=Rishton+tumani+Farg%27ona+Al-Xorazmiy"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1 group"
                title="Xaritada lokatsiyani ko'rish"
              >
                <span>Farg'ona viloyati, Rishton tumani</span>
                <ExternalLink className="w-3 h-3 text-emerald-400 opacity-70 group-hover:opacity-100" />
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-400 shrink-0" />
              <a
                href="https://t.me/alxorazmiyntm"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300 font-semibold text-emerald-100 transition-colors inline-flex items-center gap-1"
              >
                <span>Telegram: @alxorazmiyntm</span>
                <ExternalLink className="w-3 h-3 text-sky-400/80" />
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
              <a
                href="http://instagram.com/alxoramiy_rishton"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-300 font-semibold text-emerald-100 transition-colors inline-flex items-center gap-1"
              >
                <span>Instagram: @alxoramiy_rishton</span>
                <ExternalLink className="w-3 h-3 text-pink-400/80" />
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <a
                  href="tel:+998940447700"
                  className="hover:text-emerald-300 font-bold transition-colors"
                >
                  +998 94 044 77 00
                </a>
                <a
                  href="tel:+998907791144"
                  className="hover:text-emerald-300 font-bold transition-colors"
                >
                  +998 90 779 11 44
                </a>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>info@alxorazmiy.uz</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-emerald-900 text-center text-xs text-emerald-400/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} AL-XORAZMIY TA'LIM PLATFORMASI. Barcha huquqlar himoyalangan.</p>
        <div className="flex items-center gap-3">
          <p className="text-[11px] text-emerald-300/60 hidden sm:block">
            To'q yashil, och yashil va oq ranglar uyg'unligida ishlab chiqildi.
          </p>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400/60 hover:text-emerald-200 transition-colors cursor-pointer px-2.5 py-1 rounded-lg border border-emerald-800/60 hover:border-emerald-600 bg-emerald-900/40"
              title="Admin boshqaruv tizimi (Maxfiy kombinatsiya: Ctrl + Shift + A)"
            >
              <Lock className="w-3 h-3 text-emerald-400/80" />
              <span>{adminAccount ? `Admin: @${adminAccount.username}` : "Admin tizimi"}</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
