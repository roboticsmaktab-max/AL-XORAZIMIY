import React, { useState, useRef } from "react";
import {
  Sparkles,
  Send,
  Image as ImageIcon,
  X,
  Bot,
  User,
  Loader2,
  BookOpen,
  HelpCircle,
  Upload,
  RefreshCw,
} from "lucide-react";
import { SUBJECTS } from "../data/courses";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  image?: string;
  timestamp: string;
}

interface FlashAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectId?: string;
  initialPrompt?: string;
}

export const FlashAIModal: React.FC<FlashAIModalProps> = ({
  isOpen,
  onClose,
  defaultSubjectId,
  initialPrompt = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Assalomu alaykum! Men Al-Xorazmiy Ta'lim Platformasining rasmiy AI Flash modeliman. Barcha fanlardan (Matematika, Fizika, Ona tili, Ingliz tili, Tarix, Rus tili) savollaringizga bosqichma-bosqich javob beraman. Shuningdek, masala yoki test rasmini yuklasangiz, uni tahlil qilib yechimini ko'rsatib beraman!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [selectedSubject, setSelectedSubject] = useState(defaultSubjectId || "matematika");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt !== undefined ? customPrompt : inputPrompt).trim();
    if (!textToSend && !attachedImage) return;

    const userMsg: Message = {
      id: "user_" + Date.now(),
      sender: "user",
      text: textToSend,
      image: attachedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    const imageToSend = attachedImage;
    setAttachedImage(null);
    setIsLoading(true);

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      const res = await fetch("/api/flash-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          subject: selectedSubject,
          imageBase64: imageToSend,
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "Javob hosil qilindi.";

      const aiMsg: Message = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          sender: "ai",
          text: "Ulanishda xatolik yuz berdi. Iltimos qayta urinib ko'ring.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const samplePrompts = [
    "Matematikadan logarifm formulalarini tushuntir",
    "Fizikadan Nyutonning 2-qonuni va misol",
    "Ingliz tili CEFR B2 uchun Writing maslahatlari",
    "Ona tilidan undoshlar tasnifi",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[750px] shadow-2xl border-2 border-emerald-300 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 px-5 py-4 text-white flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white tracking-wide">
                  Al-Xorazmiy Flash AI Modeli
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                  Rash / Flash Model
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                Savollarni yechish va rasm orqali tahlil qilish tizimi
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

        {/* Subject Filter Bar */}
        <div className="bg-emerald-50/80 px-4 py-2 border-b border-emerald-100 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="font-bold text-emerald-950 whitespace-nowrap">Fan:</span>
          {SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === sub.id
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-900 text-emerald-300 border border-emerald-700"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-emerald-700 text-white shadow-md rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200/90 shadow-sm rounded-tl-none whitespace-pre-line"
                }`}
              >
                {msg.image && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-emerald-500/30 max-h-48">
                    <img
                      src={msg.image}
                      alt="Yuklangan rasm"
                      className="w-full h-auto object-contain bg-slate-900/10"
                    />
                  </div>
                )}
                <p>{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === "user" ? "text-emerald-200 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-300 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-emerald-900">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>Flash model javob tayyorlamoqda...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Savollar:
          </span>
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sp)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-950 text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
            >
              {sp}
            </button>
          ))}
        </div>

        {/* Attached Image Preview */}
        {attachedImage && (
          <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-300 bg-white">
                <img src={attachedImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-emerald-900">
                Rasm biriktirildi (Flash model tahlil qiladi)
              </span>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="text-xs text-red-600 hover:text-red-700 font-bold cursor-pointer"
            >
              O'chirish
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* File input for Rasm / Image */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Rasm yuklash (Masala rasmi)"
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-slate-200"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Savolingizni yozing yoki rasm yuklang..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm text-slate-900 font-medium transition-colors"
            />

            <button
              type="submit"
              disabled={isLoading || (!inputPrompt.trim() && !attachedImage)}
              className="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
