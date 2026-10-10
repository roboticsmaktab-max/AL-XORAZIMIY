import { ExamQuestion } from "../../types";
import { MATEMATIKA_QUESTIONS } from "./matematika";
import { FIZIKA_QUESTIONS } from "./fizika";
import { KIMYO_QUESTIONS } from "./kimyo";
import { BIOLOGIYA_QUESTIONS } from "./biologiya";
import { ONA_TILI_QUESTIONS } from "./onaTili";
import { TARIX_QUESTIONS } from "./tarix";
import { INGLIZ_TILI_QUESTIONS } from "./inglizTili";
import { RUS_TILI_QUESTIONS } from "./rusTili";

export const ALL_EXAM_QUESTIONS: Record<string, ExamQuestion[]> = {
  matematika: MATEMATIKA_QUESTIONS,
  fizika: FIZIKA_QUESTIONS,
  kimyo: KIMYO_QUESTIONS,
  biologiya: BIOLOGIYA_QUESTIONS,
  "ona-tili": ONA_TILI_QUESTIONS,
  tarix: TARIX_QUESTIONS,
  "ingliz-tili": INGLIZ_TILI_QUESTIONS,
  "rus-tili": RUS_TILI_QUESTIONS,
};
