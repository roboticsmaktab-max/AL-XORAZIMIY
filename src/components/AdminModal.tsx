import React, { useState, useEffect } from "react";
import {
  fetchRegistrations,
  deleteRegistrationOnServer,
  fetchExamResults,
  deleteExamResultOnServer,
  fetchConsultations,
  updateConsultationStatus,
  deleteConsultationOnServer,
  checkServerStatus,
  getAdminStats,
  fetchAdminLogs,
  updateAdminAccountServer,
  fetchVideos,
  saveVideoShort,
  deleteVideoShort,
  fetchTelegramSettings,
  saveTelegramSettings,
  sendTelegramTestMessage,
  TelegramConfig,
  ServerStatusResponse,
  AdminStatsResponse,
  AdminActivityLog,
  AdminAccountInfo,
} from "../data/apiClient";
import { RegistrationRecord, ExamResultRecord, TeacherConsultationInquiry, VideoShort } from "../types";
import { SUBJECTS } from "../data/courses";
import {
  ShieldCheck,
  Phone,
  Calendar,
  Award,
  Search,
  Download,
  X,
  RefreshCw,
  Users,
  CheckCircle2,
  PlusCircle,
  UserPlus,
  MessageSquare,
  Clock,
  Server,
  Trash2,
  Activity,
  FileSpreadsheet,
  AlertCircle,
  User,
  LogOut,
  KeyRound,
  Lock,
  Mail,
  Check,
  Eye,
  EyeOff,
  Video,
  Play,
  ExternalLink,
  Sparkles,
  Send,
} from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddTest?: () => void;
  onOpenAddTeacher?: () => void;
  adminAccount: AdminAccountInfo | null;
  onLogout: () => void;
  onAccountUpdated?: (acc: AdminAccountInfo) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onOpenAddTest,
  onOpenAddTeacher,
  adminAccount,
  onLogout,
  onAccountUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<"registrations" | "results" | "consultations" | "videos" | "telegram" | "logs" | "account">("registrations");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [results, setResults] = useState<ExamResultRecord[]>([]);
  const [consultations, setConsultations] = useState<(TeacherConsultationInquiry & { status?: "yangi" | "boglanildi" | "yakunlandi" })[]>([]);
  const [videos, setVideos] = useState<VideoShort[]>([]);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);

  // Video / Shorts Form state
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSubjectId, setVideoSubjectId] = useState("matematika");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoAuthor, setVideoAuthor] = useState("Al-Xorazmiy Maktabi");
  const [videoDuration, setVideoDuration] = useState("60");
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoMsg, setVideoMsg] = useState<string | null>(null);

  // Server metadata states
  const [serverOnline, setServerOnline] = useState<boolean>(true);
  const [serverData, setServerData] = useState<ServerStatusResponse | null>(null);
  const [serverStats, setServerStats] = useState<AdminStatsResponse | null>(null);
  const [serverPing, setServerPing] = useState<number | null>(null);

  // Telegram Integration State
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    botToken: "",
    chatId: "",
    hasToken: false,
    channelUsername: "@alxorazmiyntm",
    notifyOnExamSubmission: true,
    notifyOnRegistration: true,
    notifyOnConsultation: true,
  });
  const [telegramTokenInput, setTelegramTokenInput] = useState("");
  const [telegramChatIdInput, setTelegramChatIdInput] = useState("");
  const [telegramChannelInput, setTelegramChannelInput] = useState("@alxorazmiyntm");
  const [telegramNotifyExam, setTelegramNotifyExam] = useState(true);
  const [telegramNotifyReg, setTelegramNotifyReg] = useState(true);
  const [telegramNotifyCons, setTelegramNotifyCons] = useState(true);
  const [telegramSaving, setTelegramSaving] = useState(false);
  const [telegramTesting, setTelegramTesting] = useState(false);
  const [telegramMsg, setTelegramMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Account Settings state
  const [editFullName, setEditFullName] = useState(adminAccount?.fullName || "Al-Xorazmiy Bosh Administratori");
  const [editUsername, setEditUsername] = useState(adminAccount?.username || "admin");
  const [editEmail, setEditEmail] = useState(adminAccount?.email || "roboticsmaktab@gmail.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [accountMsg, setAccountMsg] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  // Sync account form when adminAccount prop changes
  useEffect(() => {
    if (adminAccount) {
      setEditFullName(adminAccount.fullName || "");
      setEditUsername(adminAccount.username || "admin");
      setEditEmail(adminAccount.email || "");
    }
  }, [adminAccount]);

  // Load data on open
  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Check server health
      const statusRes = await checkServerStatus();
      setServerOnline(statusRes.online);
      if (statusRes.data) setServerData(statusRes.data);
      if (statusRes.pingMs !== undefined) setServerPing(statusRes.pingMs);

      // Parallel fetch
      const [regs, res, cons, vids, stats, activityLogs, tgConfig] = await Promise.all([
        fetchRegistrations(),
        fetchExamResults(),
        fetchConsultations(),
        fetchVideos(),
        getAdminStats(),
        fetchAdminLogs(),
        fetchTelegramSettings(),
      ]);

      setRegistrations(regs);
      setResults(res);
      setConsultations(cons);
      setVideos(vids);
      if (stats) setServerStats(stats);
      setLogs(activityLogs);

      if (tgConfig) {
        setTelegramConfig(tgConfig);
        setTelegramChatIdInput(tgConfig.chatId || "");
        setTelegramChannelInput(tgConfig.channelUsername || "@alxorazmiyntm");
        setTelegramNotifyExam(tgConfig.notifyOnExamSubmission ?? true);
        setTelegramNotifyReg(tgConfig.notifyOnRegistration ?? true);
        setTelegramNotifyCons(tgConfig.notifyOnConsultation ?? true);
      }
    } catch (e) {
      console.error("Error loading admin data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Handlers for deleting & updating
  const handleDeleteReg = async (id: string, name: string) => {
    if (window.confirm(`${name} ma'lumotlarini serverdan o'chirishni tasdiqlaysizmi?`)) {
      await deleteRegistrationOnServer(id);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleDeleteResult = async (id: string, name: string) => {
    if (window.confirm(`${name} imtihon natijasini serverdan o'chirishni tasdiqlaysizmi?`)) {
      await deleteExamResultOnServer(id);
      setResults((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleUpdateConsultationStatus = async (id: string, newStatus: "yangi" | "boglanildi" | "yakunlandi") => {
    await updateConsultationStatus(id, newStatus);
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleDeleteConsultation = async (id: string) => {
    if (window.confirm("Arizani serverdan o'chirmoqchimisiz?")) {
      await deleteConsultationOnServer(id);
      setConsultations((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleDeleteVideo = async (id: string, title: string) => {
    if (window.confirm(`"${title}" videosini o'chirishni tasdiqlaysizmi?`)) {
      const ok = await deleteVideoShort(id);
      if (ok) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
        fetchAdminLogs().then(setLogs);
      }
    }
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) {
      setVideoMsg("Sarlavha va video havola (URL) kiritilishi shart!");
      return;
    }

    setVideoSaving(true);
    setVideoMsg(null);
    try {
      const sub = SUBJECTS.find((s) => s.id === videoSubjectId);
      const created = await saveVideoShort({
        title: videoTitle.trim(),
        videoUrl: videoUrl.trim(),
        subjectId: videoSubjectId,
        subjectName: sub ? sub.name : "Umumiy",
        description: videoDescription.trim(),
        authorName: videoAuthor.trim() || "Admin",
        durationSeconds: parseInt(videoDuration, 10) || 60,
      });

      if (created) {
        setVideos((prev) => [created, ...prev]);
        setVideoTitle("");
        setVideoUrl("");
        setVideoDescription("");
        setIsAddingVideo(false);
        fetchAdminLogs().then(setLogs);
      } else {
        setVideoMsg("Videoni saqlashda xatolik yuz berdi");
      }
    } catch {
      setVideoMsg("Server bilan bog'lanishda xatolik yuz berdi");
    } finally {
      setVideoSaving(false);
    }
  };

  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setTelegramSaving(true);
    setTelegramMsg(null);
    try {
      const payload: {
        botToken?: string;
        chatId: string;
        channelUsername?: string;
        notifyOnExamSubmission: boolean;
        notifyOnRegistration: boolean;
        notifyOnConsultation: boolean;
      } = {
        chatId: telegramChatIdInput.trim(),
        channelUsername: telegramChannelInput.trim() || "@alxorazmiyntm",
        notifyOnExamSubmission: telegramNotifyExam,
        notifyOnRegistration: telegramNotifyReg,
        notifyOnConsultation: telegramNotifyCons,
      };

      if (telegramTokenInput.trim()) {
        payload.botToken = telegramTokenInput.trim();
      }

      const res = await saveTelegramSettings(payload);
      if (res.success && res.settings) {
        setTelegramConfig(res.settings);
        setTelegramTokenInput("");
        setTelegramMsg({
          type: "success",
          text: "Telegram bot sozlamalari muvaffaqiyatli saqlandi!",
        });
        fetchAdminLogs().then(setLogs);
      } else {
        setTelegramMsg({
          type: "error",
          text: res.message || "Telegram sozlamalarini saqlashda xatolik yuz berdi",
        });
      }
    } catch {
      setTelegramMsg({
        type: "error",
        text: "Server bilan bog'lanishda xatolik",
      });
    } finally {
      setTelegramSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    setTelegramTesting(true);
    setTelegramMsg(null);
    try {
      const res = await sendTelegramTestMessage({
        botToken: telegramTokenInput || undefined,
        chatId: telegramChatIdInput || undefined,
        message:
          "🔔 Al-Xorazmiy Ta'lim Platformasi sinov xabari!\n\nBot ulanishi va bildirishnomalar tizimi muvaffaqiyatli tekshirildi. ✅",
      });
      if (res.success) {
        setTelegramMsg({
          type: "success",
          text: res.message || "Sinov xabari Telegram guruhi / kanaliga yuborildi! ✅",
        });
      } else {
        setTelegramMsg({
          type: "error",
          text: res.message || "Xabarni yuborishda xatolik. Token yoki Chat ID ni tekshiring.",
        });
      }
    } catch {
      setTelegramMsg({
        type: "error",
        text: "Sinov xabarini yuborishda server xatosi yuz berdi",
      });
    } finally {
      setTelegramTesting(false);
    }
  };

  const filteredRegistrations = registrations.filter(
    (r) =>
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery)
  );

  const filteredResults = results.filter(
    (res) =>
      res.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.phone.includes(searchQuery)
  );

  const filteredConsultations = consultations.filter(
    (c) =>
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.subjectName && v.subjectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountMsg(null);
    setAccountError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setAccountError("Yangi parollar bir-biriga mos kelmadi");
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setAccountError("Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setIsSavingAccount(true);
    try {
      const res = await updateAdminAccountServer({
        currentPassword: currentPassword.trim() || undefined,
        newUsername: editUsername.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
        newFullName: editFullName.trim() || undefined,
        newEmail: editEmail.trim() || undefined,
      });

      if (res.success && res.account) {
        setAccountMsg("Admin hisobi ma'lumotlari muvaffaqiyatli saqlandi!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        if (onAccountUpdated) {
          onAccountUpdated(res.account);
        }
        // Refresh logs
        fetchAdminLogs().then(setLogs);
      } else {
        setAccountError(res.error || "Ma'lumotlarni saqlab bo'lmadi");
      }
    } catch {
      setAccountError("Server bilan bog'lanishda xatolik yuz berdi");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleExportJSON = () => {
    window.open("/api/admin/export", "_blank");
  };

  const handleExportCSV = () => {
    // Generate CSV for current tab
    let csvContent = "";
    if (activeTab === "registrations") {
      csvContent = "ID,Ism familiya,Telefon,Vaqti\n" +
        registrations.map(r => `"${r.id}","${r.fullName}","${r.phone}","${r.createdAt}"`).join("\n");
    } else if (activeTab === "results") {
      csvContent = "ID,O'quvchi,Telefon,Fan,To'g'ri,Jami,Foiz,Rasch bali,Daraja,Vaqti\n" +
        results.map(r => `"${r.id}","${r.studentName}","${r.phone}","${r.subjectName}",${r.correctAnswers},${r.totalQuestions},${r.scorePercent}%,"${r.raschScore || ''}","${r.gradeLabel}","${r.completedAt}"`).join("\n");
    } else {
      csvContent = "ID,O'quvchi,Telefon,Ustoz,Fan,Qulay vaqt,Holat,Xabar,Vaqti\n" +
        consultations.map(c => `"${c.id}","${c.studentName}","${c.phone}","${c.teacherName}","${c.subjectName}","${c.preferredTime}","${c.status || 'yangi'}","${c.message || ''}","${c.createdAt}"`).join("\n");
    }

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `al_xorazmiy_${activeTab}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Server Status & Admin Profile */}
        <div className="bg-emerald-950 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-800/80 flex items-center justify-center text-emerald-400 border border-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  AL-XORAZMIY MAKTABI | ADMIN SERVERI
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-800/80 text-emerald-300 border border-emerald-700">
                  Node.js v{serverData?.nodeVersion || "18+"}
                </span>
              </div>
              <p className="text-xs text-emerald-300/90">
                Markazlashtirilgan backend server, o'quvchilar arizalari va Rasch modeli natijalari
              </p>
            </div>
          </div>

          {/* Admin identity badge, server status & logout */}
          <div className="flex flex-wrap items-center gap-2.5">
            {adminAccount && (
              <div
                onClick={() => setActiveTab("account")}
                title="Akkaunt sozlamalarini ko'rish"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800/90 border border-emerald-700/80 text-xs cursor-pointer transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white">
                  {adminAccount.fullName ? adminAccount.fullName.charAt(0) : "A"}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white leading-none max-w-[120px] truncate text-[11px]">
                    {adminAccount.fullName || "Admin"}
                  </div>
                  <div className="text-[10px] text-emerald-300 font-mono leading-none mt-0.5">
                    @{adminAccount.username}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onLogout}
              title="Admin kabinetidan chiqish"
              className="px-2.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/80 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>

            <div className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
              serverOnline 
                ? "bg-emerald-900/60 border-emerald-500/50 text-emerald-300"
                : "bg-red-900/60 border-red-500/50 text-red-300"
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${serverOnline ? "bg-emerald-400" : "bg-red-500"}`} />
              <span className="text-[11px]">{serverOnline ? "Faol" : "Ulanmadi"}</span>
              {serverPing !== null && (
                <span className="text-[10px] font-mono opacity-75">{serverPing}ms</span>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-emerald-900 hover:bg-emerald-800 text-emerald-200 flex items-center justify-center transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Server Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-emerald-900/20 border-b border-emerald-100/50 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 font-medium">Jami O'quvchilar:</div>
            <div className="text-base font-black text-slate-900 mt-0.5">
              {serverStats?.totalRegistrations ?? registrations.length} ta
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 font-medium">Topshirilgan Imtihon:</div>
            <div className="text-base font-black text-emerald-700 mt-0.5">
              {serverStats?.totalExams ?? results.length} ta
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 font-medium">O'rtacha Rasch Bali:</div>
            <div className="text-base font-black text-teal-700 mt-0.5">
              {serverStats?.avgRasch ?? "68.2"} / 75.0
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 font-medium">Domlaga Arizalar:</div>
            <div className="text-base font-black text-amber-600 mt-0.5">
              {serverStats?.totalConsultations ?? consultations.length} ta
            </div>
          </div>
        </div>

        {/* Toolbar & Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tab buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("registrations")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "registrations"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>O'quvchilar ({registrations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("results")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "results"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Imtihonlar ({results.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("consultations")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "consultations"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Arizalar ({consultations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "videos"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-rose-500" />
              <span>Video / Shorts ({videos.length})</span>
            </button>

            <button
              id="admin-tab-telegram"
              onClick={() => setActiveTab("telegram")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "telegram"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Send className="w-3.5 h-3.5 text-sky-500" />
              <span>Telegram Bot {telegramConfig.hasToken ? "✅" : ""}</span>
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "logs"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Server Jurnali ({logs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("account")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "account"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin Akkaunti</span>
            </button>
          </div>

          {/* Action buttons & Search */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Qidirish (ism, tel)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              onClick={loadAllData}
              disabled={isLoading}
              title="Serverdan yangilash"
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
            </button>

            <button
              onClick={handleExportCSV}
              title="Excel (CSV) eksport"
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              title="To'liq server bazasini yuklash"
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>

            {onOpenAddTest && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAddTest();
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Test</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab("videos");
                setIsAddingVideo(true);
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white transition-all flex items-center gap-1 cursor-pointer"
              title="Yangi video yoki shorts qo'shish"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Video</span>
            </button>

            {onOpenAddTeacher && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAddTeacher();
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Ustoz</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === "registrations" ? (
            <div>
              {filteredRegistrations.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Ro'yxatdan o'tgan foydalanuvchilar mavjud emas.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  {filteredRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                          {reg.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{reg.fullName}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1 text-emerald-700 font-medium">
                              <Phone className="w-3 h-3" />
                              {reg.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(reg.createdAt).toLocaleString("uz-UZ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Serverda saqlandi
                        </span>
                        <button
                          onClick={() => handleDeleteReg(reg.id, reg.fullName)}
                          title="O'chirish"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "results" ? (
            <div>
              {filteredResults.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Hozircha yakunlangan imtihon natijalari mavjud emas.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  {filteredResults.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{item.studentName}</h4>
                          <span className="text-xs text-slate-500">({item.phone})</span>
                        </div>
                        <p className="text-xs font-medium text-emerald-800 mt-0.5">
                          Fan: <span className="font-bold">{item.subjectName}</span> • Topshirdi:{" "}
                          {new Date(item.completedAt).toLocaleString("uz-UZ")}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        {item.raschScore !== undefined && (
                          <span className="text-xs font-black px-3 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300">
                            {item.raschScore} / 75.0 ball
                          </span>
                        )}
                        <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                          {item.correctAnswers} / {item.totalQuestions} ({item.scorePercent}%)
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-600 text-white">
                          {item.gradeLabel}
                        </span>
                        <button
                          onClick={() => handleDeleteResult(item.id, item.studentName)}
                          title="Natijani o'chirish"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "consultations" ? (
            <div>
              {filteredConsultations.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Hozircha ustozlarga tushgan arizalar mavjud emas.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  {filteredConsultations.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{inq.studentName}</h4>
                          <a
                            href={`tel:${inq.phone.replace(/\s+/g, "")}`}
                            className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {inq.phone}
                          </a>
                        </div>
                        <p className="text-xs text-slate-600">
                          Tanlangan ustoz: <span className="font-bold text-slate-800">{inq.teacherName}</span> ({inq.subjectName})
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Qulay vaqt: {inq.preferredTime}</span>
                        </p>
                        {inq.message && (
                          <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1 italic">
                            "{inq.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        {/* Status switcher */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            onClick={() => handleUpdateConsultationStatus(inq.id, "yangi")}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              inq.status === "yangi" || !inq.status
                                ? "bg-amber-500 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Yangi
                          </button>
                          <button
                            onClick={() => handleUpdateConsultationStatus(inq.id, "boglanildi")}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              inq.status === "boglanildi"
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Bog'lanildi
                          </button>
                          <button
                            onClick={() => handleUpdateConsultationStatus(inq.id, "yakunlandi")}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              inq.status === "yakunlandi"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Yakunlandi
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">
                            {new Date(inq.createdAt).toLocaleString("uz-UZ")}
                          </span>
                          <button
                            onClick={() => handleDeleteConsultation(inq.id)}
                            title="Arizani o'chirish"
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "videos" ? (
            /* Video / Shorts Management Tab */
            <div className="space-y-5">
              {/* Header with Create Video button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-emerald-950 text-white border border-rose-900/50 shadow-md">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-[11px] font-bold text-rose-300 mb-1">
                    <Video className="w-3.5 h-3.5 text-rose-400" />
                    <span>Video & Shorts Boshqaruvi</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    Tezkor ta'limiy roliklar va video qo'llanmalar
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    YouTube Shorts, TikTok yoki to'g'ridan-to'g'ri dars videolari ro'yxatini boshqaring
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingVideo(!isAddingVideo)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAddingVideo ? "Formani yopish" : "+ Yangi Video / Shorts"}</span>
                </button>
              </div>

              {/* Add Video Form Drawer */}
              {isAddingVideo && (
                <form
                  onSubmit={handleCreateVideo}
                  className="p-5 bg-rose-50/40 border border-rose-200 rounded-2xl shadow-xs space-y-4 animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
                    <h4 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      Yangi Video yoki Shorts qo'shish
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingVideo(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {videoMsg && (
                    <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs rounded-xl font-medium">
                      {videoMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Video Sarlavhasi *
                      </label>
                      <input
                        type="text"
                        required
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Masalan: Matematika: 5 soniyada kvadratga ko'tarish usuli! #shorts"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Video Havolasi (YouTube / Shorts / MP4 URL) *
                      </label>
                      <input
                        type="url"
                        required
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/shorts/... yoki https://..."
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Tegishli Fan
                      </label>
                      <select
                        value={videoSubjectId}
                        onChange={(e) => setVideoSubjectId(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                      >
                        <option value="umumiy">Umumiy ta'lim / Barcha fanlar</option>
                        {SUBJECTS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Muallif / Kanal nomi
                      </label>
                      <input
                        type="text"
                        value={videoAuthor}
                        onChange={(e) => setVideoAuthor(e.target.value)}
                        placeholder="Al-Xorazmiy Maktabi"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Qisqacha tavsif / Maslahat
                      </label>
                      <textarea
                        rows={2}
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Ushbu video orqali qanday bilim yoki usul o'rganiladi..."
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingVideo(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={videoSaving}
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {videoSaving ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Saqlanmoqda...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Videoni Saqlash</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Videos and Shorts list */}
              {filteredVideos.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm bg-slate-50 border border-slate-200 rounded-2xl">
                  <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span>Video roliklar topilmadi. Yuqoridagi "+ Yangi Video / Shorts" orqali qo'shing.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVideos.map((vid) => (
                    <div
                      key={vid.id}
                      className="p-4 bg-white border border-slate-200 hover:border-rose-300 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                            <Play className="w-3 h-3 fill-rose-600 text-rose-600" />
                            {vid.subjectName || "Umumiy"}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(vid.createdAt).toLocaleDateString("uz-UZ")}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors line-clamp-2">
                          {vid.title}
                        </h4>

                        {vid.description && (
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{vid.description}</p>
                        )}

                        <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-600 font-mono">
                          <a
                            href={vid.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-rose-600 hover:underline flex items-center gap-1 truncate max-w-[260px]"
                            title={vid.videoUrl}
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{vid.videoUrl}</span>
                          </a>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Muallif: {vid.authorName || "Admin"}</span>
                        <button
                          onClick={() => handleDeleteVideo(vid.id, vid.title)}
                          title="Videoni o'chirish"
                          className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>O'chirish</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === "logs" ? (
            /* Server Logs & Health Tab */
            <div className="space-y-4">
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 text-xs font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">SERVER ENVIRONMENT & SYSTEM SPEC</span>
                  </div>
                  <span className="text-emerald-400">STATUS: ACTIVE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-slate-300">
                  <div>Backend: Node.js Express Server (Port 3000)</div>
                  <div>Ishga tushgan vaqti: {serverData?.timestamp || new Date().toISOString()}</div>
                  <div>Uptime: {serverData?.uptimeSeconds ? `${serverData.uptimeSeconds} soniya` : "Faol"}</div>
                  <div>Ma'lumotlar bazasi: /server_data/admin_database.json (Persistent)</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  Oxirgi amallar jurnali (Audit Trail)
                </h4>
                {logs.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                    Jurnal hozircha bo'sh.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    {logs.map((log) => (
                      <div key={log.id} className="p-3 text-xs flex items-center justify-between gap-3 hover:bg-slate-50">
                        <div>
                          <span className="font-mono font-bold text-emerald-700 mr-2 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                            {log.action}
                          </span>
                          <span className="text-slate-800 font-medium">{log.details}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString("uz-UZ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Admin Account Settings Tab */
            <div className="max-w-2xl mx-auto space-y-6 py-2">
              {/* Profile Card Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-emerald-900 text-white border border-emerald-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-700/80 border-2 border-emerald-400/80 flex items-center justify-center text-white text-xl font-black shadow-inner shrink-0">
                    {adminAccount?.fullName ? adminAccount.fullName.charAt(0) : "A"}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-[10px] font-bold text-emerald-300 mb-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{adminAccount?.role || "Bosh Administrator / Maktab Rahbariyati"}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-extrabold text-white">
                      {adminAccount?.fullName || "Al-Xorazmiy Bosh Administratori"}
                    </h4>
                    <p className="text-xs text-emerald-200/80 font-mono mt-0.5">
                      Foydalanuvchi: @{adminAccount?.username || "admin"} • {adminAccount?.email || "roboticsmaktab@gmail.com"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3.5 py-2 rounded-xl bg-rose-900/90 hover:bg-rose-800 text-rose-100 border border-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Kabinetdan Chiqish</span>
                </button>
              </div>

              {/* Feedback messages */}
              {accountMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="font-semibold">{accountMsg}</div>
                </div>
              )}

              {accountError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="font-semibold">{accountError}</div>
                </div>
              )}

              {/* Edit Form */}
              <form onSubmit={handleSaveAccount} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Shaxsiy ma'lumotlar va Login</span>
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Administrator hisobingiz nomini va kirish loginini yangilashingiz mumkin
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      F.I.Sh (To'liq ism)
                    </label>
                    <input
                      type="text"
                      required
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="Al-Xorazmiy Bosh Administratori"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Admin Login (Foydalanuvchi nomi)
                    </label>
                    <input
                      type="text"
                      required
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Elektron Pochta (Email)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="roboticsmaktab@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
                    <KeyRound className="w-4 h-4 text-emerald-600" />
                    <span>Parolni O'zgartirish (Xavfsizlik)</span>
                  </h5>
                  <p className="text-xs text-slate-500 mb-4">
                    Agar parolni o'zgartirmoqchi bo'lsangiz, joriy va yangi parolni kiriting. O'zgartirmaslik uchun bo'sh qoldiring.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Joriy Parol (Tasdiqlash uchun)
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Joriy parolingiz (standart: admin123)"
                          className="w-full px-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Yangi Parol
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPass ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Kamida 4 ta belgi"
                            className="w-full px-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Yangi Parolni Takrorlang
                        </label>
                        <input
                          type={showNewPass ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Parolni qayta tering"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingAccount}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
                  >
                    {isSavingAccount ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Serverga saqlanmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>O'zgarishlarni Saqlash</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 7: Telegram Bot & Bildirishnomalar */}
          {activeTab === "telegram" && (
            <div className="space-y-6 max-w-4xl mx-auto py-2">
              {/* Info Header Card */}
              <div className="bg-gradient-to-r from-sky-900 via-sky-950 to-slate-950 p-6 rounded-2xl text-white shadow-md border border-sky-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
                      <Send className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1">
                        Rasmiy Telegram Bot Integratsiyasi
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Telegram Bildirishnomalari & Kanal Sozlamalari
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-sky-200/80 max-w-2xl leading-relaxed">
                        Saytdagi ro'yxatdan o'tishlar, topshirilgan imtihon natijalari (Rasch modeli) va ustozlarga yuborilgan arizalarni avtomatik ravishda o'z Telegram guruhingiz yoki kanalingizga qabul qiling.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      telegramConfig.hasToken
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                        : "bg-amber-950/80 text-amber-300 border-amber-500/50"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${telegramConfig.hasToken ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                      {telegramConfig.hasToken ? "Token Ulandi ✅" : "Token kiritilmagan"}
                    </span>
                    <span className="text-[11px] text-sky-300/80 font-mono">
                      Kanal: {telegramConfig.channelUsername || "@alxorazmiyntm"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status or Alert Messages */}
              {telegramMsg && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
                    telegramMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                      : "bg-rose-50 text-rose-900 border-rose-200"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 whitespace-pre-line">{telegramMsg.text}</div>
                  <button
                    onClick={() => setTelegramMsg(null)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Telegram Form */}
              <form onSubmit={handleSaveTelegram} className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                    <KeyRound className="w-4 h-4 text-sky-600" />
                    <span>Telegram Bot API Kalitlari (BotFather)</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Bot Token Input */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Bot Tokeni (HTTP API Token)
                      </label>
                      <input
                        type="text"
                        value={telegramTokenInput}
                        onChange={(e) => setTelegramTokenInput(e.target.value)}
                        placeholder={
                          telegramConfig.hasToken
                            ? "Token allaqachon sozlangan. Yangilash uchun yangi tokenni kiriting (masalan: 123456789:ABCdef...)"
                            : "Masalan: 7123456789:AAHk1_xyz..."
                        }
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                      />
                      <p className="mt-1.5 text-[11px] text-slate-500">
                        Telegram'da <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-600 underline font-bold">@BotFather</a> orqali o'z botingizni oching va berilgan tokenni bu yerga qo'ying.
                      </p>
                    </div>

                    {/* Chat ID Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Guruh yoki Kanal Chat ID raqami
                      </label>
                      <input
                        type="text"
                        value={telegramChatIdInput}
                        onChange={(e) => setTelegramChatIdInput(e.target.value)}
                        placeholder="Masalan: -100123456789 yoki @alxorazmiyntm"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-medium"
                      />
                      <p className="mt-1.5 text-[11px] text-slate-500">
                        Bildirishnomalar yuboriladigan guruh yoki kanal ID'si (Botingizni guruhga qo'shib, admin qiling).
                      </p>
                    </div>

                    {/* Channel Username Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Ochiq Kanal Usernamesi
                      </label>
                      <input
                        type="text"
                        value={telegramChannelInput}
                        onChange={(e) => setTelegramChannelInput(e.target.value)}
                        placeholder="@alxorazmiyntm"
                        className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                      />
                      <p className="mt-1.5 text-[11px] text-slate-500">
                        Sayt pastida va xabarlarda foydalaniladigan rasmiy kanal havolasi (masalan: <b>@alxorazmiyntm</b>).
                      </p>
                    </div>
                  </div>

                  {/* Notification Triggers Checkboxes */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Qaysi hodisalar Telegramga yuborilsin?
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={telegramNotifyExam}
                          onChange={(e) => setTelegramNotifyExam(e.target.checked)}
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Imtihon topshirilganda (Rasch)
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={telegramNotifyReg}
                          onChange={(e) => setTelegramNotifyReg(e.target.checked)}
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Yangi o'quvchi ro'yxatdan o'tganda
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={telegramNotifyCons}
                          onChange={(e) => setTelegramNotifyCons(e.target.checked)}
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Ustozga konsultatsiya arizasi
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Buttons: Save & Test Message */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleTestTelegram}
                    disabled={telegramTesting || (!telegramConfig.hasToken && !telegramTokenInput)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-2 border-sky-600 text-sky-700 hover:bg-sky-50 disabled:opacity-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    {telegramTesting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                        <span>Sinov xabari yuborilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-sky-600" />
                        <span>Sinov Xabarini Yuborish (Test Message)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    disabled={telegramSaving}
                    className="w-full sm:w-auto px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
                  >
                    {telegramSaving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Saqlanmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Sozlamalarni Saqlash</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Bot Usage Guidance */}
              <div className="bg-slate-100/90 rounded-2xl p-5 border border-slate-200/80 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Qanday qilib ulash mumkin?</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Telegramda <b>@BotFather</b> ga <code className="bg-white px-1.5 py-0.5 rounded border font-mono">/newbot</code> buyrug'ini yuborib bot yarating.</li>
                  <li>Sizga berilgan <b>HTTP API Token</b>'ni nusxalab, yuqoridagi <b>Bot Tokeni</b> qatoriga joylashtiring.</li>
                  <li>Botingizni o'z Telegram guruhingizga qo'shing va unga <b>Admin</b> huquqini bering.</li>
                  <li>Guruh yoki kanalingiz ID sini (masalan: <b>-100...</b>) yoki kanal username'ini <b>Chat ID</b> maydoniga yozing.</li>
                  <li><b>"Sozlamalarni Saqlash"</b> tugmasini bosing, so'ngra <b>"Sinov Xabarini Yuborish"</b> tugmasi orqali tekshirib ko'ring.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Al-Xorazmiy Ta'lim Platformasi Serveri (Port 3000)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer"
            >
              JSON Baza yuklash
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold cursor-pointer"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
