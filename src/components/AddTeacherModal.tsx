import React, { useState } from "react";
import { SUBJECTS } from "../data/courses";
import { saveTeacher } from "../data/teachers";
import { Teacher } from "../types";
import {
  X,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Award,
  BookOpen,
} from "lucide-react";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeacherSaved: () => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  onTeacherSaved,
}) => {
  const [fullName, setFullName] = useState("");
  const [subjectId, setSubjectId] = useState("matematika");
  const [role, setRole] = useState("");
  const [experienceYears, setExperienceYears] = useState(5);
  const [degree, setDegree] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [badgesText, setBadgesText] = useState("");
  const [contactPhone, setContactPhone] = useState("+998 ");
  const [telegramHandle, setTelegramHandle] = useState("@");
  const [topicsText, setTopicsText] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Ustoz ism-sharifini kiriting.");
      return;
    }

    const subjectObj = SUBJECTS.find((s) => s.id === subjectId);
    const badges = badgesText
      ? badgesText.split(",").map((b) => b.trim()).filter(Boolean)
      : ["Oliy toifali ustoz", "Sertifikat eksperti"];

    const lessonsTopics = topicsText
      ? topicsText.split("\n").map((t) => t.trim()).filter(Boolean)
      : [
          `${subjectObj?.name || "Fan"} asoslari va formulalari`,
          "Imtihon savollari tahlili va amaliyot",
          "Murakkab masalalar yechish usullari",
        ];

    const finalAvatar =
      avatarUrl.trim() ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

    saveTeacher({
      fullName: fullName.trim(),
      subjectId,
      subjectName: subjectObj?.name || "Fan",
      role: role.trim() || "Oliy toifali o'qituvchi",
      experienceYears: Number(experienceYears) || 5,
      degree: degree.trim() || "Oliy toifali pedagog",
      bio: bio.trim() || `${fullName} - ${subjectObj?.name} fani bo'yicha yetakchi mutaxassis.`,
      avatarUrl: finalAvatar,
      badges,
      contactPhone: contactPhone.trim(),
      telegramHandle: telegramHandle.trim(),
      lessonsTopics,
    });

    onTeacherSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] shadow-2xl border-2 border-emerald-300 flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <UserPlus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Yangi Ustoz Qo'shish</h3>
              <p className="text-xs text-emerald-300">
                Ustoz profilini yarating va platformada o'z bo'limini oching
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
              Ustoz Ism-Sharifi *
            </label>
            <input
              type="text"
              required
              placeholder="Masalan: Anvar Qodirov"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>

          {/* Subject & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                Fani *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white font-medium"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                Tajribasi (yil)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          </div>

          {/* Role & Degree */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                Lavozimi / Maqomi
              </label>
              <input
                type="text"
                placeholder="Masalan: Bosh repetitor, IELTS instruktori"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                Ilmiy darajasi / Toifasi
              </label>
              <input
                type="text"
                placeholder="Masalan: Oliy toifali o'qituvchi, Magistr"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
              Ustoz Haqida Ma'lumot (Bio)
            </label>
            <textarea
              rows={3}
              placeholder="Ustozning ta'lim yo'li, yutuqlari va o'quvchilari natijalari haqida..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 outline-none"
            />
          </div>

          {/* Badges */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
              Sertifikatlar va Yutuqlar (vergul bilan ajrating)
            </label>
            <input
              type="text"
              placeholder="Masalan: Milliy sertifikat A+, 10 yillik tajriba, Olimpiada murabbiyi"
              value={badgesText}
              onChange={(e) => setBadgesText(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 outline-none"
            />
          </div>

          {/* Topics (Lessons) */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
              Ustoz Darslari (har bir mavzuni yangi qatordan yozing)
            </label>
            <textarea
              rows={2}
              placeholder={"1-dars mavzusi\n2-dars mavzusi"}
              value={topicsText}
              onChange={(e) => setTopicsText(e.target.value)}
              className="w-full p-3 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 outline-none"
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                Telefon raqam
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                Telegram profil
              </label>
              <input
                type="text"
                value={telegramHandle}
                onChange={(e) => setTelegramHandle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>USTOZNI SAQLASH VA BO'LIMINI OCHISH</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
