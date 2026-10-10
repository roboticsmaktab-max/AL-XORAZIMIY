import React, { useState } from "react";
import { LOGO_SRC } from "../data/logo";
import { loginAdminServer, AdminAccountInfo } from "../data/apiClient";
import { Lock, User, Eye, EyeOff, ShieldCheck, X, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: AdminAccountInfo) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Iltimos, login va parolni kiriting");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginAdminServer(username.trim(), password.trim());
      if (res.success && res.account) {
        onSuccess(res.account);
        onClose();
      } else {
        setErrorMessage(res.error || "Login yoki parol noto'g'ri kiritildi");
      }
    } catch {
      setErrorMessage("Serverga ulanishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-emerald-500/40 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top decorative header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 px-6 py-7 text-white relative text-center">
          <button
            onClick={onClose}
            id="close-admin-login-modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-2xl bg-white p-1 border-2 border-emerald-400 shadow-lg flex items-center justify-center mb-3">
            <img
              src={LOGO_SRC}
              alt="Al-Xorazmiy Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-xs font-bold text-emerald-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>XAVFSIZ ADMINISTRATSIYA KABINETI</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Admin Tizimiga Kirish
          </h3>
          <p className="text-xs text-emerald-200/80 mt-1 max-w-xs mx-auto">
            Maktab boshqaruvi, o'quvchilar arizalari va imtihon natijalarini ko'rish uchun hisobingizga kiring
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="p-6 sm:p-7 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Admin Login yoki Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="admin-login-username-input"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masalan: admin"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Admin Paroli
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="admin-login-password-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting"
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="admin-submit-login-btn"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Tekshirilmoqda...</span>
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Kabinetga Kirish</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          Al-Xorazmiy Xalqaro Xususiy Maktabi • Xavfsiz Shifrlangan Tizim
        </div>
      </div>
    </div>
  );
};
