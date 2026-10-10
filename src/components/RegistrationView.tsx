import React, { useState } from "react";
import { LOGO_SRC } from "../data/logo";
import { createRegistrationOnServer } from "../data/apiClient";
import { RegistrationRecord } from "../types";
import { User, Phone, CheckCircle2, ArrowRight, ArrowLeft, Zap } from "lucide-react";

interface RegistrationViewProps {
  initialName?: string;
  initialPhone?: string;
  onSuccess: (user: RegistrationRecord) => void;
  onBack: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  initialName = "",
  initialPhone = "",
  onSuccess,
  onBack,
}) => {
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone || "+998 ");

  const handleProceed = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const nameToSave = fullName.trim() || "Nomzod";
    let phoneToSave = phone.trim();
    if (!phoneToSave || phoneToSave === "+998") {
      phoneToSave = "+998 90 000 00 00";
    }

    // Instantly save to server backend and localStorage
    const record = await createRegistrationOnServer(nameToSave, phoneToSave);

    // Instantly jump to next view
    onSuccess(record);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Bosh sahifaga qaytish
      </button>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-200/80 p-6 sm:p-10 relative overflow-hidden">
        {/* Top brand icon */}
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-emerald-500 shadow-md flex items-center justify-center mb-4">
            <img
              src={LOGO_SRC}
              alt="Al-Xorazmiy Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
            Avtomatik Ro'yxatdan O'tish
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 mt-3 text-center leading-tight">
            AL-XORAZMIY TA'LIM PLATFORMASIDAN RO'YXATDAN O'TISH
          </h1>

          <p className="mt-2 text-sm text-slate-600 text-center max-w-md">
            Ism-familyangiz va telefon raqamingizni kiriting. Ma'lumotlaringiz avtomatik tarzda bazaga
            saqlanadi va hech qanday tasdiqlashlarsiz darhol imtihon fanlariga o'tiladi.
          </p>
        </div>

        {/* Clear Guarantee Box */}
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300/80 flex items-start gap-3">
          <Zap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
            <strong>Kutish yoki tasdiqlash talab etilmaydi:</strong> Tugmani bosishingiz bilan
            telefon raqamingiz bazaga tushadi va darhol 6 ta fan kategoriyasi ochiladi.
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleProceed} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Ism-familyangiz *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                type="text"
                autoFocus
                placeholder="Masalan: Sardor Alimov"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-base rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 font-medium transition-colors bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Telefon raqamingiz *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                type="text"
                placeholder="+998 94 044 77 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-base rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 font-medium transition-colors bg-white font-mono"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Raqam kiritilgach avtomatik bazaga biriktiriladi.
            </p>
          </div>

          {/* Big Action Button */}
          <button
            type="button"
            onClick={() => handleProceed()}
            className="w-full py-4 px-6 rounded-2xl font-black text-base text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-5"
          >
            <span>RO'YXATDAN O'TISH VA IMTIHON TOPSHIRISHGA O'TISH</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
