import React, { useState } from "react";
import { LOGO_SRC } from "../data/logo";
import { createRegistrationOnServer } from "../data/apiClient";
import { RegistrationRecord } from "../types";
import { User, Phone, ArrowRight, X, Zap } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: RegistrationRecord) => void;
  initialName?: string;
  initialPhone?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialName = "",
  initialPhone = "",
}) => {
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone || "+998 ");

  if (!isOpen) return null;

  const handleProceed = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const nameToSave = fullName.trim() || "Nomzod";
    let phoneToSave = phone.trim();
    if (!phoneToSave || phoneToSave === "+998") {
      phoneToSave = "+998 90 000 00 00";
    }

    // Instantly save to server database and localStorage
    const record = await createRegistrationOnServer(nameToSave, phoneToSave);

    // Instantly jump to Demo Imtihon Topshirish bo'limi
    onSuccess(record);
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-200 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-registration-btn"
          aria-label="Yopish"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-emerald-500/40 shadow-md flex items-center justify-center mb-3">
            <img
              src={LOGO_SRC}
              alt="Al-Xorazmiy Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Avtomatik Ro'yxatdan O'tish
          </span>

          <h3
            id="registration-modal-title"
            className="text-xl sm:text-2xl font-black text-emerald-950 mt-2.5 text-center leading-tight"
          >
            AL-XORAZMIY TA'LIM PLATFORMASIDAN RO'YXATDAN O'TISH
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 text-center leading-relaxed max-w-sm">
            Tugmani bosishingiz bilan raqamingiz avtomatik bazaga tushadi va hech qanday tasdiqlashlarsiz
            darhol imtihon fanlari ochiladi.
          </p>
        </div>

        {/* Quick info */}
        <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-950 font-medium">
          <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tasdiqlash shart emas: Bir zumda bazaga yozilib, fanlar ochiladi!</span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleProceed} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Ism-familyangiz *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                id="reg-fullname-input"
                type="text"
                autoFocus
                placeholder="Masalan: Sardor Alimov"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 font-medium transition-colors"
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
                id="reg-phone-input"
                type="text"
                placeholder="+998 94 044 77 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 font-medium transition-colors font-mono"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="button"
            onClick={() => handleProceed()}
            id="reg-submit-btn"
            className="w-full py-4 px-6 rounded-xl font-black text-base text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            <span>RO'YXATDAN O'TISH VA IMTIHONGA O'TISH</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
