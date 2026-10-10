import { CertType, ExamQuestion, QuestionDifficulty } from "../types";

export interface EvaluationResult {
  correctCount: number;
  totalCount: number;
  percent: number;
  raschScore: number; // Max 75.0
  maxScore: number; // 75.0
  gradeLabel: string;
  badgeColor: string;
  statusText: string;
  feedbackText: string;
  otmBenefit: string;
  isPassed: boolean;
  difficultyStats: {
    boshlangich: { correct: number; total: number };
    orta: { correct: number; total: number };
    yuqori: { correct: number; total: number };
  };
  raschTheta: string; // e.g. "+1.82 logits"
}

export function evaluateExam(
  userAnswers: Record<number, number>,
  questions: ExamQuestion[],
  certType: CertType
): EvaluationResult {
  const totalCount = questions.length;
  let correctCount = 0;

  const difficultyStats = {
    boshlangich: { correct: 0, total: 0 },
    orta: { correct: 0, total: 0 },
    yuqori: { correct: 0, total: 0 },
  };

  let earnedWeight = 0;
  let totalWeight = 0;

  questions.forEach((q) => {
    const diff: QuestionDifficulty = q.difficulty || "orta";
    const weight = q.weight || (diff === "boshlangich" ? 1.6 : diff === "orta" ? 2.1 : 2.7);

    difficultyStats[diff].total += 1;
    totalWeight += weight;

    if (userAnswers[q.id] === q.correctIndex) {
      correctCount += 1;
      earnedWeight += weight;
      difficultyStats[diff].correct += 1;
    }
  });

  // Calculate Rasch scaled score out of 75.0 points
  const rawRatio = totalWeight > 0 ? earnedWeight / totalWeight : correctCount / (totalCount || 1);
  const raschScore = Math.round(rawRatio * 75 * 10) / 10;
  const percent = Math.round((correctCount / (totalCount || 1)) * 100);

  // Rasch model Logit calculation estimation: ln(P / (1 - P))
  const pSafe = Math.min(Math.max(rawRatio, 0.05), 0.95);
  const logitVal = Math.log(pSafe / (1 - pSafe)).toFixed(2);
  const raschTheta = (Number(logitVal) >= 0 ? "+" : "") + logitVal + " logits";

  let gradeLabel = "";
  let badgeColor = "";
  let statusText = "";
  let feedbackText = "";
  let otmBenefit = "";
  let isPassed = false;

  if (certType === "til") {
    // Foreign Languages (Multi-level CEFR / TRKI standard out of 75 points)
    if (raschScore >= 70.0) {
      gradeLabel = "C1 (Ilg'or)";
      badgeColor = "bg-emerald-600 text-white";
      statusText = "Muvaffaqiyatli topshirildi — C1 Daraja!";
      otmBenefit = "OTMga kirishda 100% MAKSIMAL BALL (Chet tili imtihonidan to'liq ozod etiladi)";
      isPassed = true;
      feedbackText =
        "Ajoyib natija! Xalqaro CEFR va Milliy sertifikat mezonlariga ko'ra C1 (Ilg'or) darajasini qo'lga kiritdingiz. Siz barcha leksik-grammatik tuzilmalar, murakkab inversion va kontekstual tahlilni a'lo darajada o'zlashtirgansiz. Davlat OTMlariga kirishda chet tili fanidan 100% maksimal ball taqdim etiladi.";
    } else if (raschScore >= 60.0) {
      gradeLabel = "B2 (Mustaqil)";
      badgeColor = "bg-teal-600 text-white";
      statusText = "Muvaffaqiyatli topshirildi — B2 Daraja";
      otmBenefit = "OTMga kirishda 100% MAKSIMAL BALL (Abituriyentlar uchun to'liq imtiyoz)";
      isPassed = true;
      feedbackText =
        "Tabriklaymiz! O'zbekiston Respublikasi Vazirlar Mahkamasi qaroriga muvofiq, B2 darajali sertifikat sohiblariga oliy ta'lim muassasalariga kirish sinovlarida chet tili fanidan 100% maksimal ball beriladi. Bilimingiz mustahkam va ishonchli.";
    } else if (raschScore >= 46.0) {
      gradeLabel = "B1 (O'rta)";
      badgeColor = "bg-blue-600 text-white";
      statusText = "Muvaffaqiyatli topshirildi — B1 Daraja";
      otmBenefit = "B1 darajali milliy sertifikat (Bazaviy standart)";
      isPassed = true;
      feedbackText =
        "B1 darajasi bo'yicha sertifikat talabi bajarildi. Asosiy grammatik qoidalarni bilasiz, biroq C1/B2 ga ko'tarilish uchun akademik so'z boyligi va murakkab sintaksis ustida ishlashni davom ettiring.";
    } else if (raschScore >= 30.0) {
      gradeLabel = "A2 (Boshlang'ich)";
      badgeColor = "bg-amber-600 text-white";
      statusText = "A2 Daraja (Boshlang'ich)";
      otmBenefit = "Sertifikat beriladi, ammo OTM kirish imtiyozi taqdim etilmaydi";
      isPassed = true;
      feedbackText =
        "A2 boshlang'ich darajasi qayd etildi. OTMga kirishda imtiyozga ega bo'lish uchun bilim darajangizni kamida B2 darajasiga (60+ ball) yetkazish talab etiladi.";
    } else {
      gradeLabel = "Yetarli emas";
      badgeColor = "bg-red-600 text-white";
      statusText = "Sertifikat berilmaydi (30 balldan past)";
      otmBenefit = "Imtiyoz berilmaydi";
      isPassed = false;
      feedbackText =
        "Afsuski, to'plangan ball sertifikat olishning eng quyi chegarasidan past bo'ldi. Al-Xorazmiy maktabi darsliklari va ustozlari tavsiyalaridan foydalanib, mavzularni puxta o'rganing va qayta topshiring.";
    }
  } else {
    // Science and Humanities (Bilimni baholash agentligi Rasch modeli: Max 75 ball)
    if (raschScore >= 70.0) {
      gradeLabel = "A+ Daraja";
      badgeColor = "bg-emerald-600 text-white";
      statusText = "A+ Darajali Milliy Sertifikat (Maksimal Natija)";
      otmBenefit = "OTMga kirishda ushbu fandan 100% MAKSIMAL BALL (Imtihondan to'liq ozod etiladi)";
      isPassed = true;
      feedbackText =
        "Sensatsion natija! Siz Bilim va malakalarni baholash agentligi (BBA) Milliy sertifikatining eng yuqori — A+ darajasiga ega bo'ldingiz (70 balldan yuqori). O'zbekiston Respublikasi oliy ta'lim muassasalariga kirish test sinovlarida sizga ushbu fandan 100% MAKSIMAL BALL beriladi va test topshirishdan ozod etilasiz. Sertifikat 3 yil davomida to'liq kuchga ega.";
    } else if (raschScore >= 65.0) {
      gradeLabel = "A Daraja";
      badgeColor = "bg-emerald-500 text-white";
      statusText = "A Darajali Milliy Sertifikat";
      otmBenefit = "OTMga kirishda ushbu fandan 100% MAKSIMAL BALL (Imtihondan to'liq ozod etiladi)";
      isPassed = true;
      feedbackText =
        "Tabriklaymiz! Rasmiy qonunchilikka asosan, Milliy sertifikat imtihonida A daraja (65.0 - 69.9 ball) to'plagan abituriyentlarga OTMga kirishda ushbu fandan 100% maksimal ball beriladi. Test sinovlarida mazkur fanni ishlash shart emas! Sertifikat 3 yil muddatga amal qiladi.";
    } else if (raschScore >= 60.0) {
      gradeLabel = "B+ Daraja";
      badgeColor = "bg-teal-600 text-white";
      statusText = "B+ Darajali Milliy Sertifikat";
      otmBenefit = "OTMga kirishda maksimal ballga nisbatan proporsional yuqori ball (86.0%+)";
      isPassed = true;
      feedbackText =
        "Juda yaxshi natija! B+ darajasi (60.0 - 64.9 ball) uchun 3 yil amal qiluvchi davlat sertifikati beriladi. OTMga kirish test sinovlarida maksimal ballga nisbatan yuqori proporsional ball hisoblanadi. Bir oz mashq orqali A darajasiga chiqishingiz mumkin.";
    } else if (raschScore >= 55.0) {
      gradeLabel = "B Daraja";
      badgeColor = "bg-blue-600 text-white";
      statusText = "B Darajali Milliy Sertifikat";
      otmBenefit = "OTMga kirishda maksimal ballga nisbatan proporsional ball (75.0%+)";
      isPassed = true;
      feedbackText =
        "Ijobiy natija. B darajali (55.0 - 59.9 ball) sertifikat taqdim etiladi. Fanning o'rta va murakkab toifadagi savollari bo'yicha mustahkam bilimga egasiz. Sertifikat 3 yil amal qiladi.";
    } else if (raschScore >= 50.0) {
      gradeLabel = "C+ Daraja";
      badgeColor = "bg-amber-600 text-white";
      statusText = "C+ Darajali Milliy Sertifikat";
      otmBenefit = "OTMga kirishda maksimal ballga nisbatan proporsional ball (65.0%+)";
      isPassed = true;
      feedbackText =
        "C+ darajali sertifikat beriladi (50.0 - 54.9 ball). Asosiy tushunchalarni yaxshi bilasiz, ammo OTMga kirishda yuqori raqobatbardoshlikka erishish uchun ballni 65+ ga oshirishni tavsiya qilamiz.";
    } else if (raschScore >= 46.0) {
      gradeLabel = "C Daraja";
      badgeColor = "bg-orange-600 text-white";
      statusText = "C Darajali Milliy Sertifikat (Minimal O'tish Mezoni)";
      otmBenefit = "OTMga kirishda maksimal ballga nisbatan proporsional ball (60.0%+)";
      isPassed = true;
      feedbackText =
        "Minimal sertifikat talabi (kamida 46 ball yoki eng yuqori ballning 60 foizi) bajarildi va C darajali sertifikat rasmiylashtiriladi. 3 yil davomida amal qiladi.";
    } else {
      gradeLabel = "Yetarli emas";
      badgeColor = "bg-red-600 text-white";
      statusText = "Sertifikat berilmaydi (46 balldan past)";
      otmBenefit = "Sertifikat berilmaydi (eng yuqori ballning 60% dan past)";
      isPassed = false;
      feedbackText =
        "Natijangiz 46 balldan past bo'ldi. O'zbekiston Respublikasi qoidalariga ko'ra sertifikat test sinovi natijasi bo'yicha eng yuqori ballning kamida 60 foizini (46 ball) to'plagan shaxslarga beriladi. Tushkunlikka tushmang, platformadagi bepul darslarni ko'rib, ustozlar bilan konsultatsiya olib qayta topshiring!";
    }
  }

  return {
    correctCount,
    totalCount,
    percent,
    raschScore,
    maxScore: 75.0,
    gradeLabel,
    badgeColor,
    statusText,
    feedbackText,
    otmBenefit,
    isPassed,
    difficultyStats,
    raschTheta,
  };
}
