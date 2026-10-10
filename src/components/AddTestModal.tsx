import React, { useState } from "react";
import { SUBJECTS } from "../data/courses";
import {
  saveCustomQuestion,
  deleteCustomQuestion,
  getAllQuestionsForSubject,
  getCustomQuestions,
} from "../data/storage";
import { ExamQuestion } from "../types";
import {
  PlusCircle,
  CheckCircle2,
  Trash2,
  Sparkles,
  HelpCircle,
  X,
  BookOpen,
  ListFilter,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface AddTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectId?: string;
  onQuestionAdded?: () => void;
}

export const AddTestModal: React.FC<AddTestModalProps> = ({
  isOpen,
  onClose,
  defaultSubjectId = "matematika",
  onQuestionAdded,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(defaultSubjectId);
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");

  // Form fields
  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState("");

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [showAIPrompt, setShowAIPrompt] = useState(false);

  // Questions for listing
  const [currentSubjectQuestions, setCurrentSubjectQuestions] = useState<ExamQuestion[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      refreshQuestions();
    }
  }, [isOpen, selectedSubject]);

  const refreshQuestions = () => {
    setCurrentSubjectQuestions(getAllQuestionsForSubject(selectedSubject));
  };

  if (!isOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFeedbackMsg(null);

    const qTrim = questionText.trim();
    const aTrim = optA.trim();
    const bTrim = optB.trim();
    const cTrim = optC.trim();
    const dTrim = optD.trim();

    if (!qTrim) {
      setFeedbackMsg({ type: "error", text: "Iltimos, savol matnini kiriting." });
      return;
    }

    if (!aTrim || !bTrim || !cTrim || !dTrim) {
      setFeedbackMsg({ type: "error", text: "Iltimos, barcha 4 ta javob variantlarini to'ldiring." });
      return;
    }

    // Save
    saveCustomQuestion(selectedSubject, {
      question: qTrim,
      options: [aTrim, bTrim, cTrim, dTrim],
      correctIndex,
      explanation: explanation.trim() || `To'g'ri javob: ${["A", "B", "C", "D"][correctIndex]} varianti.`,
    });

    // Reset inputs
    setQuestionText("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setExplanation("");
    setCorrectIndex(0);

    setFeedbackMsg({
      type: "success",
      text: "Test muvaffaqiyatli saqlandi va ushbu fan imtihoniga kiritildi!",
    });

    refreshQuestions();
    if (onQuestionAdded) onQuestionAdded();

    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  // Delete a question
  const handleDelete = (id: number) => {
    deleteCustomQuestion(selectedSubject, id);
    refreshQuestions();
    if (onQuestionAdded) onQuestionAdded();
    setFeedbackMsg({ type: "success", text: "Test o'chirildi." });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // AI Automatic Test Generation using Flash Model
  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) return;
    setIsAIGenerating(true);
    setFeedbackMsg(null);

    try {
      const subjectObj = SUBJECTS.find((s) => s.id === selectedSubject);
      const res = await fetch("/api/flash-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          prompt: `Siz ${subjectObj?.name || "Fan"} fani bo'yicha imtihon testlarini tuzuvchi mutaxassissiz.
Mavzu: "${aiTopic}".
Iltimos, quyidagi JSON formatida aniq 1 ta 4-variantli sifatli test savolini tuzib bering:
{
  "question": "Savol matni",
  "optA": "A varianti",
  "optB": "B varianti",
  "optC": "C varianti",
  "optD": "D varianti",
  "correctIndex": 0,
  "explanation": "Qisqa tushuntirish"
}
Faqat va faqat toza JSON formatida javob bering, boshqa hech narsa qo'shmang.`,
        }),
      });

      const data = await res.json();
      const rawText = data.reply || "";

      // Extract JSON substring
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.question) setQuestionText(parsed.question);
        if (parsed.optA) setOptA(parsed.optA);
        if (parsed.optB) setOptB(parsed.optB);
        if (parsed.optC) setOptC(parsed.optC);
        if (parsed.optD) setOptD(parsed.optD);
        if (typeof parsed.correctIndex === "number") setCorrectIndex(parsed.correctIndex);
        if (parsed.explanation) setExplanation(parsed.explanation);

        setShowAIPrompt(false);
        setAiTopic("");
        setFeedbackMsg({
          type: "success",
          text: "Flash AI yangi test savolini muvaffaqiyatli tuzib berdi! Ko'rib chiqing va 'Saqlash' tugmasini bosing.",
        });
      } else {
        setFeedbackMsg({
          type: "error",
          text: "AI javobini qayta ishlashda xatolik yuz berdi. Iltimos qo'lda kiriting.",
        });
      }
    } catch (e) {
      console.error(e);
      setFeedbackMsg({
        type: "error",
        text: "AI orqali test yaratishda xatolik. Qaytadan urinib ko'ring.",
      });
    } finally {
      setIsAIGenerating(false);
    }
  };

  const customQList = getCustomQuestions()[selectedSubject] || [];

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl border-2 border-emerald-300 flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 px-6 py-4 text-white flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <PlusCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-white tracking-wide">
                  Test Qo'shish va Boshqarish
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                  O'qituvchi / Admin
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                O'zingiz xohlagan fanga yangi testlar qo'shing va imtihonga kiriting
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

        {/* Subject Select Bar */}
        <div className="bg-emerald-50/90 px-5 py-3 border-b border-emerald-100 flex items-center justify-between gap-3 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-black text-emerald-950 whitespace-nowrap">Fan:</span>
            {SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubject === sub.id
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-emerald-200 shrink-0">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === "create" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yangi test
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === "list" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Testlar ({currentSubjectQuestions.length})</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
              feedbackMsg.type === "success"
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : "bg-red-100 text-red-900 border border-red-300"
            }`}
          >
            {feedbackMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Tab 1: Create Test */}
        {activeTab === "create" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* AI Generator Toggle Button */}
            <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent p-3.5 rounded-2xl border border-amber-300/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                <div>
                  <p className="text-xs font-black text-slate-800">
                    Flash AI bilan test tuzishni xohlaysizmi?
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Mavzuni aytsangiz, model 4 ta variant va yechimi bilan to'ldirib beradi.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAIPrompt((p) => !p)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-xs rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
              >
                {showAIPrompt ? "Bekor qilish" : "AI bilan tuzish"}
              </button>
            </div>

            {/* AI Prompt Input Bar */}
            {showAIPrompt && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                <label className="block text-xs font-bold text-amber-950">
                  Qaysi mavzudan test tuzilsin? (masalan: "Arifmetik progressiya hadlar yig'indisi" yoki "Present Perfect zamoni")
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="Mavzu nomini yozing..."
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-amber-300 outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                  <button
                    type="button"
                    disabled={isAIGenerating || !aiTopic.trim()}
                    onClick={handleGenerateWithAI}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {isAIGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Tuzilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Tuzish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Question Text */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Savol matni *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Masalan: Tenglamani yeching: 2x + 10 = 30"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                />
              </div>

              {/* 4 Options Grid */}
              <div className="space-y-2.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  4 ta Javob Variantlari va To'g'ri Javobni belgilash:
                </label>
                <p className="text-[11px] text-slate-500">
                  Har bir variantni yozing va qaysi biri to'g'ri bo'lsa, uning chapidagi harfni bosing.
                </p>

                {/* Option A */}
                <div
                  className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                    correctIndex === 0
                      ? "border-emerald-500 bg-emerald-50/70"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setCorrectIndex(0)}
                    className={`w-9 h-9 rounded-lg font-black text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      correctIndex === 0
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    A {correctIndex === 0 && <Check className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <input
                    type="text"
                    required
                    placeholder="A variant matni..."
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm bg-transparent outline-none"
                  />
                  {correctIndex === 0 && (
                    <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-200">
                      To'g'ri
                    </span>
                  )}
                </div>

                {/* Option B */}
                <div
                  className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                    correctIndex === 1
                      ? "border-emerald-500 bg-emerald-50/70"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setCorrectIndex(1)}
                    className={`w-9 h-9 rounded-lg font-black text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      correctIndex === 1
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    B {correctIndex === 1 && <Check className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <input
                    type="text"
                    required
                    placeholder="B variant matni..."
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm bg-transparent outline-none"
                  />
                  {correctIndex === 1 && (
                    <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-200">
                      To'g'ri
                    </span>
                  )}
                </div>

                {/* Option C */}
                <div
                  className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                    correctIndex === 2
                      ? "border-emerald-500 bg-emerald-50/70"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setCorrectIndex(2)}
                    className={`w-9 h-9 rounded-lg font-black text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      correctIndex === 2
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    C {correctIndex === 2 && <Check className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <input
                    type="text"
                    required
                    placeholder="C variant matni..."
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm bg-transparent outline-none"
                  />
                  {correctIndex === 2 && (
                    <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-200">
                      To'g'ri
                    </span>
                  )}
                </div>

                {/* Option D */}
                <div
                  className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                    correctIndex === 3
                      ? "border-emerald-500 bg-emerald-50/70"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setCorrectIndex(3)}
                    className={`w-9 h-9 rounded-lg font-black text-sm flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      correctIndex === 3
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    D {correctIndex === 3 && <Check className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <input
                    type="text"
                    required
                    placeholder="D variant matni..."
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm bg-transparent outline-none"
                  />
                  {correctIndex === 3 && (
                    <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-200">
                      To'g'ri
                    </span>
                  )}
                </div>
              </div>

              {/* Explanation / Solution Details */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                  Izoh / Yechim tushuntirishi (O'quvchi xato qilsa ko'rinadi)
                </label>
                <input
                  type="text"
                  placeholder="Masalan: 2x = 20 bo'ladi, demak x = 10."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border-2 border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-sm sm:text-base tracking-wide shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>TESTNI SAQLASH VA IMTIHONGA QO'SHISH</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: List Tests */}
        {activeTab === "list" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900">
                {SUBJECTS.find((s) => s.id === selectedSubject)?.name} — Barcha Testlar ({currentSubjectQuestions.length} ta)
              </h4>
              <span className="text-xs text-slate-500">
                Siz qo'shgan testlar: {customQList.length} ta
              </span>
            </div>

            {currentSubjectQuestions.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                Ushbu fanda hali testlar yo'q.
              </div>
            ) : (
              <div className="space-y-3">
                {currentSubjectQuestions.map((q, idx) => {
                  const isCustom = customQList.some((cq) => cq.id === q.id);
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{q.question}</p>
                            {isCustom && (
                              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                Siz qo'shgan test
                              </span>
                            )}
                          </div>
                        </div>

                        {isCustom && (
                          <button
                            onClick={() => handleDelete(q.id)}
                            title="Ushbu testni o'chirish"
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Options preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-8 text-xs">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border ${
                              oIdx === q.correctIndex
                                ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            <span className="font-mono mr-1.5">
                              {["A", "B", "C", "D"][oIdx]})
                            </span>
                            {opt}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="pl-8 text-[11px] text-slate-500 italic">
                          Izoh: {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
