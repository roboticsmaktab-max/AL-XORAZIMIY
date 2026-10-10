export interface SpeakingQuestion {
  id: string;
  part: 1 | 2 | 3;
  partTitle: string;
  topic: string;
  question: string;
  promptGuidance?: string[];
  preparationTimeSeconds: number;
  speakingTimeSeconds: number;
  sampleAnswer: string;
  vocabulary: { word: string; meaning: string; phonetic?: string }[];
  targetBandScores: { band: string; criteriaFeedback: string }[];
}

export const SPEAKING_PARTS_INFO = [
  {
    part: 1,
    title: "Part 1: Introduction & Interview",
    description: "Kundalik hayot, qiziqishlar, oila va ta'lim haqidagi umumiy savollarga qisqa va tabiiy javob berish (4-5 daqiqa).",
    duration: "4-5 daqiqa",
    focus: "Fluency & Everyday Vocabulary",
  },
  {
    part: 2,
    title: "Part 2: Individual Long Turn (Cue Card)",
    description: "Berilgan mavzu kartochkasi bo'yicha 1 daqiqa tayyorgarlik ko'rib, to'xtovsiz 1-2 daqiqa gapirish (3-4 daqiqa).",
    duration: "3-4 daqiqa",
    focus: "Coherence, Structure & Range",
  },
  {
    part: 3,
    title: "Part 3: Two-way Discussion (In-depth Questions)",
    description: "Part 2 mavzusiga bog'liq chuqur ijtimoiy, falsafiy va global masalalarni tahlil qilish va bahslashish (4-5 daqiqa).",
    duration: "4-5 daqiqa",
    focus: "Abstract ideas, Critical thinking, Advanced lexis",
  },
];

export const SPEAKING_QUESTIONS_BANK: SpeakingQuestion[] = [
  // --- PART 1 ---
  {
    id: "spk_p1_1",
    part: 1,
    partTitle: "Part 1: Home & Hometown",
    topic: "Hometown and Living Environment",
    question: "Can you describe your hometown or the area where you currently live?",
    promptGuidance: [
      "Say where it is located in Uzbekistan or abroad",
      "Mention what you like most about it (atmosphere, people, architecture)",
      "Point out any changes that happened recently",
    ],
    preparationTimeSeconds: 15,
    speakingTimeSeconds: 45,
    sampleAnswer:
      "I was born and raised in Rishton, which is located in the Fergana region of Uzbekistan. It is world-renowned for its traditional blue ceramics and pottery heritage. What I cherish most about my hometown is the serene environment and the tightly-knit community where hospitality is a core value. In recent years, it has developed significantly with modernized educational centers and improved infrastructure.",
    vocabulary: [
      { word: "World-renowned", meaning: "Dunyo miqyosida mashhur / taniqli", phonetic: "/ˌwɜːld rɪˈnaʊnd/" },
      { word: "Serene environment", meaning: "Osoyishta, sokin muhit", phonetic: "/səˈriːn ɪnˈvaɪrənmənt/" },
      { word: "Tightly-knit community", meaning: "Ahil, o'zaro jipslashgan mahalla/jamoa", phonetic: "/ˈtaɪtli nɪt/" },
      { word: "Infrastructure", meaning: "Infratuzilma (yo'llar, kommunikatsiyalar)", phonetic: "/ˈɪnfrəstrʌktʃər/" },
    ],
    targetBandScores: [
      { band: "CEFR B2 / Band 6.5", criteriaFeedback: "Natural speed, good use of connecting words, clear pronunciation." },
      { band: "CEFR C1 / Band 7.5+", criteriaFeedback: "Idiomatic phrasing, sophisticated lexical resource ('world-renowned', 'cherish most'), flexible discourse." },
    ],
  },
  {
    id: "spk_p1_2",
    part: 1,
    partTitle: "Part 1: Studies & Ambitions",
    topic: "Academic Goals and Career Future",
    question: "What subject do you find most fascinating in your studies, and why?",
    promptGuidance: [
      "Specify your favorite academic discipline",
      "Explain the reasons (logic, problem-solving, practical use)",
      "Explain how it helps your future career",
    ],
    preparationTimeSeconds: 15,
    speakingTimeSeconds: 45,
    sampleAnswer:
      "Without a shadow of a doubt, I am deeply intrigued by Mathematics and Foreign Languages. Mathematics sharpens analytical acumen and logical reasoning, while English serves as an indispensable passport to global opportunities and academic literature. Balancing both empowers me to pursue competitive university degrees with great confidence.",
    vocabulary: [
      { word: "Without a shadow of a doubt", meaning: "Hech shubhasiz / mutlaqo aniq", phonetic: "/wɪˈðaʊt ə ˈʃædəʊ əv ə daʊt/" },
      { word: "Analytical acumen", meaning: "Tahliliy zakovat / o'tkir tushunish qobiliyati", phonetic: "/ˌænəˈlɪtɪkl əˈkjuːmən/" },
      { word: "Indispensable passport", meaning: "Ajralmas kalit / zarur vosita", phonetic: "/ˌɪndɪˈspensəbl/" },
    ],
    targetBandScores: [
      { band: "CEFR B2", criteriaFeedback: "Fluent reasoning, grammatical accuracy with complex sentences." },
      { band: "CEFR C1", criteriaFeedback: "Sophisticated vocabulary, varied structures without hesitation." },
    ],
  },
  {
    id: "spk_p1_3",
    part: 1,
    partTitle: "Part 1: Technology & Daily Life",
    topic: "Digital Tools & AI in Education",
    question: "How has modern technology transformed the way students prepare for national exams?",
    promptGuidance: [
      "Mention online testing platforms and mock exams",
      "Highlight instant feedback and automated analysis",
      "Mention the balance between digital learning and traditional books",
    ],
    preparationTimeSeconds: 15,
    speakingTimeSeconds: 45,
    sampleAnswer:
      "Technology has undeniably revolutionized test preparation. Previously, students relied exclusively on printed mock test booklets. Nowadays, platforms like Al-Xorazmiy enable learners to simulate official exam conditions under real time constraints, offering instantaneous evaluation based on Rasch measurement models. This saves tremendous time and pinpoints individual knowledge gaps.",
    vocabulary: [
      { word: "Revolutionized", meaning: "Tubdan o'zgartirdi / inqilobiy yangilik kiritdi", phonetic: "/ˌrevəˈluːʃənaɪzd/" },
      { word: "Instantaneous evaluation", meaning: "Bir zumda baholash", phonetic: "/ˌɪnstənˈteɪniəs/" },
      { word: "Pinpoint knowledge gaps", meaning: "Bilimdagi kamchiliklarni aniq ko'rsatib berish", phonetic: "/ˈpɪnpɔɪnt/" },
    ],
    targetBandScores: [
      { band: "CEFR B2 / C1", criteriaFeedback: "High topical accuracy, discourse markers, appropriate collocations." },
    ],
  },

  // --- PART 2 ---
  {
    id: "spk_p2_1",
    part: 2,
    partTitle: "Part 2: Cue Card (Long Turn)",
    topic: "Describe an Inspiring Teacher or Mentor",
    question: "Describe a teacher or mentor who had a profound and positive influence on your life.",
    promptGuidance: [
      "Who this teacher was and which subject they taught",
      "What made their instructional style unique or engaging",
      "What life lessons or academic skills you gained from them",
      "And explain why their guidance made such a lasting impression on you",
    ],
    preparationTimeSeconds: 60,
    speakingTimeSeconds: 120,
    sampleAnswer:
      "I would like to talk about my mentor, who taught us advanced science and mathematics during high school. What distinguished him was his ability to demystify complex, abstract theorems into tangible, intuitive daily scenarios.\n\nRather than forcing rote memorization, he encouraged inquisitive questioning and celebrated intellectual curiosity. Whenever we tackled arduous problems, he nurtured resilience, reiterating that errors are merely stepping stones to mastery.\n\nUltimately, his guidance went far beyond textbook equations; he instilled in me an unwavering commitment to lifelong learning, self-discipline, and academic rigor, which remains the cornerstone of my current successes.",
    vocabulary: [
      { word: "Profound influence", meaning: "Chuqur va ijobiy ta'sir", phonetic: "/prəˈfaʊnd ˈɪnfluəns/" },
      { word: "Demystify", meaning: "Murakkab narsani oson va tushunarli qilib berish", phonetic: "/diːˈmɪstɪfaɪ/" },
      { word: "Rote memorization", meaning: "Ko'r-ko'rona yodlash (tushunmasdan)", phonetic: "/rəʊt ˌmeməraɪˈzeɪʃn/" },
      { word: "Intellectual curiosity", meaning: "Aqliy qiziquvchanlik", phonetic: "/ˌɪntəˈlektʃuəl/" },
      { word: "Resilience", meaning: "Matonat, qiyinchiliklarga bardoshlilik", phonetic: "/rɪˈzɪliəns/" },
      { word: "Stepping stones", meaning: "Muvaffaqiyat poydevori / vositalari", phonetic: "/ˈstepɪŋ stəʊnz/" },
    ],
    targetBandScores: [
      { band: "CEFR B2 (Band 6.5)", criteriaFeedback: "Sustained monologue for 1.5+ minutes with clear sequence." },
      { band: "CEFR C1 (Band 7.5 - 8.0)", criteriaFeedback: "Cohesive narrative, elegant transitions, high-level idiomatic precision without repetition." },
    ],
  },
  {
    id: "spk_p2_2",
    part: 2,
    partTitle: "Part 2: Cue Card (Long Turn)",
    topic: "Describe a Major Milestone or Achievement",
    question: "Describe an accomplishment or goal you achieved after persevering through substantial difficulties.",
    promptGuidance: [
      "What the objective or competition was",
      "What hurdles or barriers you encountered along the way",
      "How you overcame the anxiety or workload",
      "And explain how you felt when you ultimately succeeded",
    ],
    preparationTimeSeconds: 60,
    speakingTimeSeconds: 120,
    sampleAnswer:
      "A defining achievement in my academic journey was scoring in the highest percentile on the national certificate mock examination. When I commenced my preparation, I was overwhelmed by the rigorous time constraints and the sheer breadth of the syllabus.\n\nTo overcome this, I engineered a disciplined timetable, dedicating early mornings to deliberate problem practice. Whenever fatigue set in, I reminded myself of my long-term university ambitions. When the official scores were unveiled, a rush of immense relief and euphoria swept over me, validating that relentless persistence pays dividends.",
    vocabulary: [
      { word: "Substantial difficulties", meaning: "Jiddiy qiyinchiliklar va to'siqlar", phonetic: "/səbˈstænʃl/" },
      { word: "Deliberate practice", meaning: "Maqsadli, ongli mashg'ulot", phonetic: "/dɪˈlɪbərət/" },
      { word: "Euphoria", meaning: "Cheksiz quvonch, g'alaba hissi", phonetic: "/juːˈfɔːriə/" },
      { word: "Pays dividends", meaning: "O'z mevasini beradi / foyda keltiradi", phonetic: "/peɪz ˈdɪvɪdendz/" },
    ],
    targetBandScores: [
      { band: "CEFR B2 - C1", criteriaFeedback: "Strong narrative drive, accurate past tenses, emotive description." },
    ],
  },

  // --- PART 3 ---
  {
    id: "spk_p3_1",
    part: 3,
    partTitle: "Part 3: In-Depth Discussion",
    topic: "Traditional Education vs Artificial Intelligence",
    question: "Do you believe artificial intelligence models could eventually replace human school educators in the classroom?",
    promptGuidance: [
      "Compare personalized algorithmic teaching with human empathy",
      "Discuss moral guidance, motivation and discipline",
      "Conclude with a nuanced hybrid model viewpoint",
    ],
    preparationTimeSeconds: 20,
    speakingTimeSeconds: 60,
    sampleAnswer:
      "While artificial intelligence has progressed by leaps and bounds in delivering tailored factual instruction and instant grading, I firmly contend that it cannot entirely supplant human teachers. Education is fundamentally a social enterprise that necessitates emotional intelligence, empathy, and mentorship. An AI can diagnose a student's grammatical error in milliseconds, but only an empathetic teacher can discern emotional distress, inspire personal resilience, and cultivate ethical character. Hence, the future will likely see a symbiotic synergy between AI tools and human educators.",
    vocabulary: [
      { word: "By leaps and bounds", meaning: "Katta qadamlar bilan / juda tez", phonetic: "/baɪ liːps ənd baʊndz/" },
      { word: "Supplant", meaning: "O'rnini egallamoq / siqib chiqarmoq", phonetic: "/səˈplɑːnt/" },
      { word: "Social enterprise", meaning: "Ijtimoiy faoliyat / jamoaviy jarayon", phonetic: "/ˈsəʊʃl ˈentəpraɪz/" },
      { word: "Discern", meaning: "Payqamoq, anglab yetmoq", phonetic: "/dɪˈsɜːn/" },
      { word: "Symbiotic synergy", meaning: "O'zaro bir-birini to'ldiruvchi uyg'unlik", phonetic: "/ˌsɪmbaɪˈɒtɪk ˈsɪnədʒi/" },
    ],
    targetBandScores: [
      { band: "CEFR B2", criteriaFeedback: "Clear opinion supported by reasons and contrasting conjunctions." },
      { band: "CEFR C1 / Band 8.0+", criteriaFeedback: "Abstract discourse, sophisticated vocabulary, balanced debate, natural cohesive devices." },
    ],
  },
  {
    id: "spk_p3_2",
    part: 3,
    partTitle: "Part 3: In-Depth Discussion",
    topic: "Standardized Testing and Student Creativity",
    question: "Some critics argue that high-stakes standardized tests stifle student creativity. What is your perspective on this?",
    promptGuidance: [
      "Acknowledge the benefits of standardization (fairness, meritocracy)",
      "Address the drawbacks (teaching to the test, stress)",
      "Offer possible systemic reforms or balance",
    ],
    preparationTimeSeconds: 20,
    speakingTimeSeconds: 60,
    sampleAnswer:
      "There is substantial validity to both perspectives. On one hand, standardized examinations ensure meritocratic fairness and objective benchmarks across diverse socioeconomic backgrounds. However, when academic institutions prioritize exam metrics above all else, curriculum delivery risks devolving into mechanistic test-taking drills, consequently dampening divergent thinking. The optimal paradigm lies in complementing standardized knowledge checks with project-based collaborative assessments that foster ingenuity.",
    vocabulary: [
      { word: "Stifle / dampen", meaning: "Bo'g'moq, so'ndirmoq", phonetic: "/ˈstaɪfl/" },
      { word: "Meritocratic fairness", meaning: "Bilim va mehnatga asoslangan adolat", phonetic: "/ˌmerɪtəˈkrætɪk/" },
      { word: "Divergent thinking", meaning: "Noan'anaviy, ijodiy fikrlash", phonetic: "/daɪˈvɜːdʒənt/" },
      { word: "Foster ingenuity", meaning: "Zukkolik va ijodkorlikni rivojlantirmoq", phonetic: "/ˈfɒstər ˌɪndʒəˈnjuːəti/" },
    ],
    targetBandScores: [
      { band: "CEFR C1", criteriaFeedback: "High lexical sophistication, passive and complex constructions, precise argument development." },
    ],
  },
];
