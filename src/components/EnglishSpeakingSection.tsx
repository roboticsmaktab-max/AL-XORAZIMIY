import React, { useState, useEffect, useRef } from "react";
import {
  SPEAKING_QUESTIONS_BANK,
  SPEAKING_PARTS_INFO,
  SpeakingQuestion,
} from "../data/speakingData";
import {
  evaluateSpeakingResponse,
  SpeakingEvaluationResponse,
} from "../data/apiClient";
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Square,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Languages,
  Flame,
  Send,
  HelpCircle,
  FileText,
  UserCheck,
} from "lucide-react";

interface EnglishSpeakingSectionProps {
  onBackToLessons?: () => void;
  onStartWrittenExam?: () => void;
  onOpenAdmin?: () => void;
}

export const EnglishSpeakingSection: React.FC<EnglishSpeakingSectionProps> = ({
  onBackToLessons,
  onStartWrittenExam,
  onOpenAdmin,
}) => {
  const [selectedPart, setSelectedPart] = useState<1 | 2 | 3>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [userSpeechTranscript, setUserSpeechTranscript] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] =
    useState<SpeakingEvaluationResponse | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isPlayingSampleAudio, setIsPlayingSampleAudio] = useState(false);

  // Timer countdown for preparation & speech
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number | null>(null);
  const [isPrepActive, setIsPrepActive] = useState(false);

  // Speech Recognition reference
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const prepIntervalRef = useRef<any>(null);

  // Filter questions for the active part
  const partQuestions = SPEAKING_QUESTIONS_BANK.filter(
    (q) => q.part === selectedPart
  );
  const activeQuestion: SpeakingQuestion =
    partQuestions[currentQuestionIndex] || partQuestions[0];

  // Initialize Speech Recognition on client
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  // Reset states when changing question
  useEffect(() => {
    stopRecording();
    setUserSpeechTranscript("");
    setEvaluationResult(null);
    setEvaluationError(null);
    setShowSampleAnswer(false);
    setRecordingSeconds(0);
    setIsPrepActive(false);
    setPrepSecondsLeft(null);
  }, [selectedPart, currentQuestionIndex]);

  // Preparation Timer
  const handleStartPreparation = () => {
    if (isRecording) stopRecording();
    setIsPrepActive(true);
    setPrepSecondsLeft(activeQuestion.preparationTimeSeconds);

    if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
    prepIntervalRef.current = setInterval(() => {
      setPrepSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(prepIntervalRef.current);
          setIsPrepActive(false);
          // Play a small beep if possible or alert
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start Voice Recording
  const startRecording = () => {
    setEvaluationResult(null);
    setEvaluationError(null);
    setUserSpeechTranscript("");
    setRecordingSeconds(0);
    setIsRecording(true);

    // Timer
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setUserSpeechTranscript(currentTranscript.trim());
        };

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition error:", err);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn("Could not start speech recognition:", e);
      }
    }
  };

  // Stop Recording
  const stopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
  };

  // Text-To-Speech for sample answer / questions
  const handleSpeakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isPlayingSampleAudio) {
        setIsPlayingSampleAudio(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.95; // Clear natural speed
      utterance.onend = () => setIsPlayingSampleAudio(false);
      utterance.onerror = () => setIsPlayingSampleAudio(false);

      setIsPlayingSampleAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Submit Spoken Answer to AI Examiner
  const handleEvaluateAnswer = async () => {
    if (!userSpeechTranscript || userSpeechTranscript.trim().length < 10) {
      setEvaluationError(
        "Iltimos, avval mikrofon orqali kamida 2-3 ta gap gapiring yoki javobingizni quyidagi maydonga yozing."
      );
      return;
    }

    stopRecording();
    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      const result = await evaluateSpeakingResponse({
        question: activeQuestion.question,
        speechTranscript: userSpeechTranscript,
        part: activeQuestion.part,
        topic: activeQuestion.topic,
        studentAudioSeconds: recordingSeconds || 35,
      });

      setEvaluationResult(result);
    } catch (err: any) {
      setEvaluationError(
        err?.message ||
          "Baholashda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-emerald-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Multi-Level / CEFR B1 - C1 Speaking Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              Ingliz Tili: Speaking (Og'zaki Nutq) Sinovi
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-200/90 max-w-2xl leading-relaxed">
              O'zbekiston BBA va Cambridge CEFR standartlari asosida audio yozuv
              yordamida real vaqtda gapiring. Sun'iy intellekt (AI Examiner)
              nutqingizni tahlil qilib, <b>Band Score (B1, B2, C1)</b>, leksika,
              grammatika va talaffuz bo'yicha batafsil baholash beradi.
            </p>
          </div>

          <div className="bg-emerald-900/90 border border-emerald-700/80 rounded-2xl p-4 shrink-0 flex flex-col gap-2 w-full md:w-auto text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <Languages className="w-5 h-5 text-emerald-400" />
              <span>Format: 3 ta Rasmiy Bosqich</span>
            </div>
            <p className="text-emerald-200/80 text-xs">
              Part 1: Interview • Part 2: Cue Card • Part 3: Discussion
            </p>
            {onStartWrittenExam && (
              <button
                onClick={onStartWrittenExam}
                className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>35 ta Yozma Testga o'tish</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Part Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {SPEAKING_PARTS_INFO.map((p) => {
          const isActive = selectedPart === p.part;
          return (
            <button
              key={p.part}
              onClick={() => {
                setSelectedPart(p.part as 1 | 2 | 3);
                setCurrentQuestionIndex(0);
              }}
              className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "bg-emerald-900 text-white border-emerald-400 shadow-lg transform -translate-y-0.5"
                  : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-black uppercase px-2.5 py-1 rounded-md ${
                      isActive
                        ? "bg-emerald-800 text-emerald-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Part {p.part}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? "text-emerald-300" : "text-slate-500"
                    }`}
                  >
                    {p.duration}
                  </span>
                </div>
                <h3
                  className={`font-black text-base ${
                    isActive ? "text-white" : "text-slate-900"
                  }`}
                >
                  {p.title}
                </h3>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    isActive ? "text-emerald-200/90" : "text-slate-500"
                  }`}
                >
                  {p.description}
                </p>
              </div>

              <div
                className={`mt-4 pt-3 border-t text-[11px] font-bold flex items-center justify-between ${
                  isActive
                    ? "border-emerald-800/80 text-emerald-300"
                    : "border-slate-100 text-emerald-700"
                }`}
              >
                <span>Fokus: {p.focus}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Examination & Speaking Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Col: The Question Cue Card & Audio Prompt */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border-2 border-emerald-200/80 shadow-md p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>{activeQuestion.partTitle}</span>
              </div>

              {/* Question Navigation if multiple */}
              {partQuestions.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        prev > 0 ? prev - 1 : partQuestions.length - 1
                      )
                    }
                    className="p-1.5 rounded-lg border hover:bg-slate-100 text-slate-700 cursor-pointer"
                    title="Oldingi savol"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-slate-800">
                    {currentQuestionIndex + 1} / {partQuestions.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        prev < partQuestions.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="p-1.5 rounded-lg border hover:bg-slate-100 text-slate-700 cursor-pointer"
                    title="Keyingi savol"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Topic & Big Question */}
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Topic: {activeQuestion.topic}
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
              "{activeQuestion.question}"
            </h2>

            {/* Cue Card guidance bullets if Part 2 or Part 3 */}
            {activeQuestion.promptGuidance && (
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  You should say:
                </p>
                <ul className="space-y-1.5">
                  {activeQuestion.promptGuidance.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-600 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timers & Audio Controls Toolbar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeakText(activeQuestion.question)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Savolni inglizcha talaffuzda eshitish"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Savolni tinglash</span>
                </button>

                {activeQuestion.part === 2 && (
                  <button
                    onClick={handleStartPreparation}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      isPrepActive
                        ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                    }`}
                  >
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>
                      {isPrepActive
                        ? `Tayyorgarlik: ${prepSecondsLeft}s`
                        : "1 min Tayyorgarlik Taymeri"}
                    </span>
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Tavsiya etilgan nutq vaqti:{" "}
                  <b>{activeQuestion.speakingTimeSeconds} soniya</b>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Vocabulary & Key Phrasal Expressions */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Ushbu mavzu bo'yicha yuqori ball keltiruvchi so'zlar (C1 Lexis)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeQuestion.vocabulary.map((vocab, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 text-sm">
                      {vocab.word}
                    </span>
                    {vocab.phonetic && (
                      <span className="text-[11px] font-mono text-emerald-700 bg-white/80 px-1.5 py-0.5 rounded border border-emerald-200">
                        {vocab.phonetic}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{vocab.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Audio Recorder & AI Examiner Feedback */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border-2 border-emerald-200/80 shadow-md p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ovoz yozish & Jonli Nutq
                </span>
                {isRecording && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    Yozilmoqda ({recordingSeconds}s)
                  </span>
                )}
              </div>

              {/* Central Mic Button */}
              <div className="flex flex-col items-center justify-center my-4 py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer group"
                    title="Ovoz yozishni boshlash"
                  >
                    <Mic className="w-9 h-9 text-white group-hover:animate-bounce" />
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/30 flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer animate-pulse"
                    title="Ovoz yozishni to'xtatish"
                  >
                    <Square className="w-8 h-8 text-white fill-current" />
                  </button>
                )}

                <p className="mt-3 text-xs font-bold text-slate-700">
                  {!isRecording
                    ? "Tugmani bosing va inglizcha javob bering"
                    : "Nutqingiz yozilmoqda... To'xtatish uchun bosing"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 text-center px-4">
                  Mikrofon orqali gapirishingiz bilan so'zlaringiz avtomatik
                  matnga aylanadi.
                </p>
              </div>

              {/* Speech Transcript textarea (editable for convenience) */}
              <div className="space-y-1.5 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">
                    Nutq Matni (Transkript):
                  </label>
                  <span className="text-slate-400 text-[11px]">
                    {userSpeechTranscript.trim().split(/\s+/).filter(Boolean).length} ta so'z
                  </span>
                </div>
                <textarea
                  value={userSpeechTranscript}
                  onChange={(e) => setUserSpeechTranscript(e.target.value)}
                  placeholder="Mikrofon orqali gapiring yoki javobingizni to'g'ridan-to'g'ri ingliz tilida yozing..."
                  rows={4}
                  className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none leading-relaxed transition-all resize-none"
                />
              </div>

              {evaluationError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{evaluationError}</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Evaluate / Reset */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleEvaluateAnswer}
                disabled={isEvaluating || !userSpeechTranscript.trim()}
                className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  isEvaluating || !userSpeechTranscript.trim()
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25"
                }`}
              >
                {isEvaluating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-white" />
                    <span>AI Examiner Baholamoqda...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-emerald-100" />
                    <span>Natijani Baholash</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  stopRecording();
                  setUserSpeechTranscript("");
                  setEvaluationResult(null);
                  setRecordingSeconds(0);
                }}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                title="Qaytadan boshlash"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sample Model Answer Accordion */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm">
            <button
              onClick={() => setShowSampleAnswer(!showSampleAnswer)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Namuna Javob (Band 8.5 / C1 Model Answer)</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 underline">
                {showSampleAnswer ? "Yashirish" : "Ko'rish"}
              </span>
            </button>

            {showSampleAnswer && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                <p className="italic bg-slate-50 p-3.5 rounded-xl border border-slate-200 whitespace-pre-line">
                  "{activeQuestion.sampleAnswer}"
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleSpeakText(activeQuestion.sampleAnswer)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Namuna nutqni tinglash</span>
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Cambridge C1 Examiner tomonidan tasdiqlangan
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Examiner Detailed Score Sheet (When Evaluated) */}
      {evaluationResult && (
        <div
          id="speaking-evaluation-report"
          className="bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl p-6 sm:p-10 mb-12 animate-fade-in"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Al-Xorazmiy AI Examiner Rasmiy Baholash Natijasi</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Sizning Speaking Natijangiz: {evaluationResult.bandScore}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Baholash CEFR (B1, B2, C1) va IELTS rasmiy rubrikasi bo'yicha
                amalga oshirildi.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-5 rounded-2xl border border-emerald-700 flex items-center gap-4 shrink-0">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">
                  Umumiy Ball (Score):
                </p>
                <p className="text-3xl font-black text-white leading-tight">
                  {evaluationResult.overallScore}{" "}
                  <span className="text-base text-emerald-300 font-normal">
                    / 75
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                <Award className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* 4 Official Assessment Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                1. Fluency & Coherence
              </span>
              <p className="text-xl font-black text-emerald-950 mt-1">
                {evaluationResult.criteria.fluencyAndCoherence.score}
              </p>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {evaluationResult.criteria.fluencyAndCoherence.feedback}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                2. Lexical Resource
              </span>
              <p className="text-xl font-black text-emerald-950 mt-1">
                {evaluationResult.criteria.lexicalResource.score}
              </p>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {evaluationResult.criteria.lexicalResource.feedback}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                3. Grammatical Range
              </span>
              <p className="text-xl font-black text-emerald-950 mt-1">
                {evaluationResult.criteria.grammaticalRange.score}
              </p>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {evaluationResult.criteria.grammaticalRange.feedback}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                4. Pronunciation
              </span>
              <p className="text-xl font-black text-emerald-950 mt-1">
                {evaluationResult.criteria.pronunciation.score}
              </p>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {evaluationResult.criteria.pronunciation.feedback}
              </p>
            </div>
          </div>

          {/* Strengths & Improvement Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kuchli Tomonlaringiz (Strengths)</span>
              </h4>
              <ul className="space-y-1.5">
                {evaluationResult.strengths.map((str, i) => (
                  <li
                    key={i}
                    className="text-xs sm:text-sm text-slate-700 flex items-start gap-2"
                  >
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Rivojlantirish Tavsiyalari (Recommendations)</span>
              </h4>
              <ul className="space-y-1.5">
                {evaluationResult.areasForImprovement.map((imp, i) => (
                  <li
                    key={i}
                    className="text-xs sm:text-sm text-slate-700 flex items-start gap-2"
                  >
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Improved Model Answer from student transcript */}
          {evaluationResult.improvedSampleAnswer && (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Sizning javobingizning Band 8.5 / C1 talqini:</span>
                </h4>
                <button
                  onClick={() =>
                    handleSpeakText(evaluationResult.improvedSampleAnswer)
                  }
                  className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Eshitish</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed italic whitespace-pre-line">
                "{evaluationResult.improvedSampleAnswer}"
              </p>
              {evaluationResult.examinerNote && (
                <p className="text-xs text-emerald-300/80 mt-3 pt-2 border-t border-emerald-800">
                  <b>Ekspert xulosasi:</b> {evaluationResult.examinerNote}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
