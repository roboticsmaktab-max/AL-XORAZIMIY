import { Teacher, TeacherReview, TeacherConsultationInquiry } from "../types";

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "teacher-matematika-1",
    fullName: "Bobur Alimov",
    subjectId: "matematika",
    subjectName: "Matematika",
    role: "Bosh o'qituvchi va Milliy sertifikat eksperti",
    experienceYears: 12,
    degree: "Oliy toifali pedagog, Matematika fani magistri",
    bio: "Al-Xorazmiy nomidagi ixtisoslashtirilgan maktab sobiq ustozi. 12 yildan ortiq vaqt davomida abituriyentlar va o'qituvchilarni Milliy sertifikat hamda olimpiadalarga tayyorlab kelmoqda. 1500+ o'quvchisi A va A+ sertifikatlarini qo'lga kiritgan. Oliy ta'lim muassasalariga 100% lik kirish imtiyoziga erishgan iqtidorli yoshlar ustozi.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    rating: 4.96,
    studentsCount: 1840,
    badges: ["Milliy sertifikat A+ (73.8 ball)", "Olimpiada murabbiyi", "12 yillik tajriba", "Top Repetitor", "BBA Eksperti"],
    contactPhone: "+998 94 044 77 00",
    telegramHandle: "@bobur_math_expert",
    education: [
      "Mirzo Ulug'bek nomidagi O'zbekiston Milliy Universiteti (Bakalavr, Matematika)",
      "O'zMU Mexanika-matematika fakulteti (Magistratura, Imtiyozli diplom)",
      "Pedagogik mahorat va xalqaro baholash malaka oshirish kursi (BBA)",
    ],
    methodology: [
      "Murakkab stereometriya va fazoviy shakllarni 3D vizual tasavvur qilish usuli",
      "Vaqtni tejovchi nostandart tezkor yechimlar va formulalar texnikasi",
      "Rasch modeli bo'yicha yuqori vaznli 3-darajali masalalarni bosqichma-bosqich yechish",
    ],
    achievements: [
      "1500+ nafar o'quvchi A va A+ darajali Milliy sertifikat olgan",
      "Respublika fan olimpiadasida 12 nafar sovrindor shogird",
      "O'zbekiston Respublikasi Xalq ta'limi a'lochisi ko'krak nishoni",
    ],
    consultationSchedule: "Dushanba - Juma: 15:00 - 19:00 | Shanba: 10:00 - 14:00",
    lessonsTopics: [
      "Hosilaning geometrik va fizik ma'nosi",
      "Logarifmik tenglama va tengsizliklar",
      "Trigonometrik ayniyatlar va hisoblash usullari",
      "Stereometriya va fazoviy shakllar yuzasi",
      "Kombinatorika va ehtimollar nazariyasi asoslari",
    ],
    reviews: [
      {
        id: "rev-m-1",
        studentName: "Shoxrux Mirzayev",
        scoreOrCert: "A+ sertifikat (72.6 ball) — O'zMU talabasi",
        comment: "Bobur ustozning darslari tufayli matematikani noldan A+ darajasiga ko'tardim. Ayniqsa stereometriya va parametrli masalalarni tushuntirish uslubi ajoyib!",
        date: "2024-05-18",
        rating: 5,
      },
      {
        id: "rev-m-2",
        studentName: "Madinaxon Aliyeva",
        scoreOrCert: "A sertifikat (64.2 ball) — TATU talabasi",
        comment: "Milliy sertifikat sinovidagi 35 ta testdan 33 tasini to'g'ri yechdim. Ustozga cheksiz minnatdorchilik bildiraman!",
        date: "2024-06-02",
        rating: 5,
      },
    ],
  },
  {
    id: "teacher-fizika-1",
    fullName: "Dilshod Rahimov",
    subjectId: "fizika",
    subjectName: "Fizika",
    role: "Oliy toifali Fizika fani ustozi va Ilmiy tadqiqotchi",
    experienceYears: 14,
    degree: "Fizika-matematika fanlari nomzodi (PhD), Dotsent",
    bio: "Mexanika, molekulyar fizika va elektrodinamika bo'yicha sertifikat imtihonlariga tayyorlash metodikasi muallifi. Xalqaro va Respublika fan olimpiadasi g'oliblari ustozi. Fizika qonuniyatlarini quruq yodlash emas, chuqur tushunish va laboratoriya tajribalari bilan o'rgatadi.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    rating: 4.93,
    studentsCount: 1420,
    badges: ["PhD Dotsent", "Milliy sertifikat A+", "14 yillik tajriba", "Eksperimentlar ustasi", "Fizika Olimpiada Murabbiyi"],
    contactPhone: "+998 90 779 11 44",
    telegramHandle: "@dilshod_fizika",
    education: [
      "Samarqand Davlat Universiteti (Fizika fakulteti)",
      "O'zbekiston Fanlar Akademiyasi Yadro fizikasi instituti (Aspirantura, PhD)",
    ],
    methodology: [
      "Fizik hodisalarning mikrodunyo animatsiyalari va grafik modellari orqali tushuntirilishi",
      "Formulalarni birliklar tahlili (o'lchov birliklari) orqali tekshirish san'ati",
      "Sxemalar va zanjirlarni soddalashtirishning eng samarali usullari",
    ],
    achievements: [
      "Respublika bo'yicha fizika fani darsliklariga kiritilgan metodik qo'llanmalar muallifi",
      "900+ o'quvchisi nufuzli texnika universitetlariga grant asosida qabul qilingan",
    ],
    consultationSchedule: "Seshanba - Payshanba - Shanba: 14:00 - 18:30",
    lessonsTopics: [
      "Nyuton qonunlari va harakat dinamikasi",
      "Termodinamika qonunlari va ideal gaz holati",
      "Elektromagnit induksiya va Lorens kuchi",
      "Fotoeffekt va yorug'lik kvantlari",
      "Garmonik tebranishlar va to'lqinlar",
    ],
    reviews: [
      {
        id: "rev-f-1",
        studentName: "Javohir To'rayev",
        scoreOrCert: "A+ sertifikat (71.0 ball) — Turin Politexnika",
        comment: "Fizikadagi elektr va optika mavzulari mening eng zaif tomonim edi. Dilshod domlaning mantiqiy tushuntirishi evaziga maksimal ball to'pladim.",
        date: "2024-04-20",
        rating: 5,
      },
    ],
  },
  {
    id: "teacher-kimyo-1",
    fullName: "Azizbek Yusupov",
    subjectId: "kimyo",
    subjectName: "Kimyo",
    role: "Oliy toifali Kimyo ustozi va Olimpiada ustozi",
    experienceYears: 11,
    degree: "Kimyo fanlari nomzodi (PhD), Oliy toifali pedagog",
    bio: "Tibbiyot va farmatsevtika yo'nalishlariga kiruvchi abituriyentlar uchun Milliy sertifikat va Davlat testlariga tayyorlash bo'yicha yetakchi ekspert. Anorganik va organik kimyoda reaksiyalarni yodlamasdan mexanizmlari bilan o'rganish dasturi muallifi.",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    rating: 4.97,
    studentsCount: 1620,
    badges: ["PhD Kimyo", "Milliy sertifikat A+", "Mendeleyev olimpiadasi ustozi", "Tibbiyot tayyorlov mutaxassisi"],
    contactPhone: "+998 94 044 77 00",
    telegramHandle: "@azizbek_chem_expert",
    education: [
      "O'zbekiston Milliy Universiteti Kimyo fakulteti (Bakalavr va Magistr)",
      "Bioorganik kimyo instituti (Ilmiy izlanuvchi, PhD)",
    ],
    methodology: [
      "Molyar massa, eritmalar va konsentratsiya masalalarini qisqa usullarda hisoblash",
      "Organik kimyo reaksiyalari mexanizmini modellar orqali tushunish",
      "BBA kimyo testlari tuzilishi va tuzoq savollarni aniqlash texnikasi",
    ],
    achievements: [
      "Shogirdlarining 90% dan ortig'i Toshkent Tibbiyot Akademiyasi va Samarqand Davlat Tibbiyot Universitetiga grant yutgan",
      "Kimyo fanidan Respublika olimpiadasida 8 ta sovrinli o'rin",
    ],
    consultationSchedule: "Dushanba - Chorshanba - Juma: 16:00 - 20:00",
    lessonsTopics: [
      "Atom tuzilishi va D.I. Mendeleyev davriy qonuni",
      "Eritmalar konsentratsiyasi va eruvchanlik masalalari",
      "Organik birikmalar izomeriyasi va nomlanishi",
      "Elektroliz qonunlari va gidroliz jarayonlari",
      "Murakkab masalalarni proporsiyasiz va tezkor yechish sirlari",
    ],
    reviews: [
      {
        id: "rev-k-1",
        studentName: "Nilufar Oripova",
        scoreOrCert: "A+ sertifikat (74.1 ball) — Toshkent Tibbiyot Akademiyasi 1-kurs",
        comment: "Kimyodan Milliy sertifikat A+ olib, Tibbiyotga imtihonsiz 100% grant bilan kirdim! Azizbek ustoz eng zo'r domla!",
        date: "2024-06-15",
        rating: 5,
      },
    ],
  },
  {
    id: "teacher-biologiya-1",
    fullName: "Shahnoza Ergasheva",
    subjectId: "biologiya",
    subjectName: "Biologiya",
    role: "Bosh biologiya ustozi va Genetika mutaxassisi",
    experienceYears: 10,
    degree: "Biologiya fanlari magistri, Oliy toifali metodist",
    bio: "Sitologiya, genetika, odam anatomiyasi va evolutsiya bo'yicha 10 yillik ilmiy-pedagogik faoliyat egasi. Biologiyadagi eng murakkab genetik masalalar, qon guruhlari va xromosoma tahlillarini sodda formulalarga keltirish bo'yicha kitoblar muallifi.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    rating: 4.95,
    studentsCount: 1750,
    badges: ["Milliy sertifikat A+", "Genetika masalalari ustasi", "Oliy toifa", "Tibbiyot yo'nalishi yetakchisi"],
    contactPhone: "+998 90 779 11 44",
    telegramHandle: "@shahnoza_biologiya",
    education: [
      "Farg'ona Davlat Universiteti Tabiiy fanlar fakulteti",
      "O'zMU Genetika kafedrasi magistraturasi",
    ],
    methodology: [
      "Genetik masalalarni Punnet kataklarisiz tezkor matematik modellashtirish",
      "Inson fiziologiyasini interaktiv 3D atlaslar asosida o'rganish",
      "Biologik atamalarni mantiqiy ildizlar orqali eslab qolish mnemonikasi",
    ],
    achievements: [
      "1200+ shogird tibbiyot va farmatsevtika yo'nalishlarida ta'lim olmoqda",
      "Xalqaro biologiya olimpiadasi ishtirokchilari murabbiyi",
    ],
    consultationSchedule: "Seshanba - Payshanba: 15:00 - 19:00 | Shanba: 13:00 - 17:00",
    lessonsTopics: [
      "Sitologiya: Hujayra organoidlari va funksiyalari",
      "Mendel qonunlari va noallel genlarning ta'sirlashuvi",
      "Odam anatomiyasi: Yurak-qon tomir va asab tizimi",
      "Evolutsion ta'limot va mikroevolyutsiya omillari",
      "Genetik masalalarni 30 soniyada yechish formulalari",
    ],
    reviews: [
      {
        id: "rev-b-1",
        studentName: "Dilrabo Qobilova",
        scoreOrCert: "A+ sertifikat (72.8 ball) — Samarqand Davlat Tibbiyot Universiteti",
        comment: "Shahnoza ustozning genetika darslari mening butun dunyoqarashimni o'zgartirdi. Hech qanday chalkashliksiz imtihonda maksimal ball oldim.",
        date: "2024-05-29",
        rating: 5,
      },
    ],
  },
  {
    id: "teacher-ona-tili-1",
    fullName: "Gulnoza Karimova",
    subjectId: "ona-tili",
    subjectName: "Ona tili va adabiyot",
    role: "Filologiya bo'yicha ekspert-pedagog va Darslik muallifi",
    experienceYears: 10,
    degree: "Filologiya fanlari magistri, Oliy toifali o'qituvchi",
    bio: "Ona tili va adabiyot fani bo'yicha yangi Milliy sertifikat baholash mezonlari mutaxassisi. Matn tahlili, morfologiya, sintaksis va insho yozish san'ati bo'yicha maxsus kurslar muallifi. Al-Xorazmiy maktabida tilshunoslik laboratoriyasini boshqaradi.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    rating: 4.97,
    studentsCount: 2100,
    badges: ["Milliy sertifikat A+", "Darslik hammuallifi", "10 yillik tajriba", "Matn tahlili ustasi", "Insho mutaxassisi"],
    contactPhone: "+998 94 044 77 00",
    telegramHandle: "@gulnoza_onatili",
    education: [
      "Alisher Navoiy nomidagi Toshkent Davlat O'zbek tili va adabiyoti universiteti",
      "O'zbek tilshunosligi magistraturasi (Qizil diplom)",
    ],
    methodology: [
      "Matn strukturasini intellektual xaritalar (Mind map) orqali tahlil qilish",
      "Mumtoz asarlar lug'ati va aruz vaznini qofiyadosh misralar yordamida o'rganish",
      "Tinish belgilari mantiqiy algoritmi",
    ],
    achievements: [
      "Ona tili bo'yicha Respublika Milliy sertifikatida eng ko'p A+ chiqargan pedagoglardan biri",
      "Umumta'lim maktablari uchun 2 ta uslubiy qo'llanma muallifi",
    ],
    consultationSchedule: "Dushanba - Juma: 14:00 - 18:00",
    lessonsTopics: [
      "Morfologiya va so'z turkumlari tahlili",
      "Murakkab qo'shma gap sintaksisi",
      "O'zbek mumtoz g'azaliyoti va vazn tahlili",
      "Orfografiya va tinish belgilari qoidalari",
      "Matn mazmuni bo'yicha ochiq va yopiq testlarni tahlil qilish",
    ],
    reviews: [
      {
        id: "rev-ot-1",
        studentName: "Anvarjon Saidov",
        scoreOrCert: "A+ sertifikat (73.5 ball) — O'zDJTU talabasi",
        comment: "Gulnoza ustoz matn tahlili bo'yicha O'zbekistondagi eng kuchli mutaxassis! Har bir savolning tag zamiridagi mohiyatni ko'rsatib beradilar.",
        date: "2024-05-10",
        rating: 5,
      },
    ],
  },
  {
    id: "teacher-ingliz-tili-1",
    fullName: "Jasur Qodirov",
    subjectId: "ingliz-tili",
    subjectName: "Ingliz tili",
    role: "Xalqaro toifali IELTS va CEFR B2/C1 bosh instruktori",
    experienceYears: 9,
    degree: "IELTS 8.5, CELTA / TESOL xalqaro sertifikati",
    bio: "Buyuk Britaniya nufuzli universitetlari bitiruvchisi. CEFR B2/C1 va IELTS imtihonlariga tezkor va kafolatli tayyorlash bo'yicha 9 yillik amaliy tajribaga ega. O'quvchilari 100% sertifikat olib, barcha davlat OTMlariga ingliz tilidan maksimal ball olgan.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    rating: 4.98,
    studentsCount: 2650,
    badges: ["IELTS 8.5", "CELTA Certified", "CEFR C1 Trainer", "9 yillik tajriba", "Native-like Accent"],
    contactPhone: "+998 90 779 11 44",
    telegramHandle: "@jasur_english_pro",
    education: [
      "O'zbekiston Davlat Jahon Tillari Universiteti (Ingliz filologiyasi)",
      "University of Westminster almashinuv dasturi bitiruvchisi",
      "Cambridge University CELTA sertifikati",
    ],
    methodology: [
      "Active Recall va Spaced Repetition orqali akademik so'zlarni tez eslab qolish",
      "Reading Skimming & Scanning strategiyasi (har bir matnga 15 daqiqa tejash)",
      "Writing Task 2 uchun Band 7+ shablonlar va grammatik murakkabliklar",
    ],
    achievements: [
      "1200+ o'quvchi IELTS 7.0+ va CEFR C1/B2 sertifikatiga ega bo'ldi",
      "Al-Xorazmiy maktabida Speaking Club asoschisi",
    ],
    consultationSchedule: "Har kuni: 16:00 - 20:30",
    lessonsTopics: [
      "Tenses & Advanced Grammar in Context",
      "CEFR Reading Strategies & Skimming",
      "Writing Task 2: Band 7+ Essay Structure",
      "Essential Academic Vocabulary & Phrasal Verbs",
      "Listening: Predicting answers & accent mastery",
    ],
    reviews: [
      {
        id: "rev-en-1",
        studentName: "Zarina Usmonova",
        scoreOrCert: "CEFR C1 (91 ball) — Jahon Iqtisodiyoti va Diplomatiya Universiteti",
        comment: "Jasur domla darslarida faqat inglizcha gaplashdik. CEFR imtihonida C1 darajani olib, JIDUga 100% ozod bo'ldim!",
        date: "2024-06-22",
        rating: 5,
      },
    ],
  },
  {
    id: "teacher-tarix-1",
    fullName: "Rustam Ahmedov",
    subjectId: "tarix",
    subjectName: "Tarix",
    role: "Oliy toifali Tarixchi-pedagog va Tadqiqotchi",
    experienceYears: 11,
    degree: "O'zbekiston Milliy Universiteti Tarix fakulteti magistri",
    bio: "O'zbekiston tarixi va Jahon tarixining barcha davrlari bo'yicha xaritalar, sanalar va shaxslarni assotsiativ xotira orqali yodlash usulining muallifi. Respublika olimpiadalari hakamlar hay'ati a'zosi. Tarixiy voqealar sabab-oqibat zanjirini o'rganish bo'yicha mashhur mutaxassis.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    rating: 4.89,
    studentsCount: 1280,
    badges: ["Oliy toifa", "Milliy sertifikat A+", "Xaritalar metodisti", "11 yillik tajriba", "Tarixiy tahlil ustasi"],
    contactPhone: "+998 94 044 77 00",
    telegramHandle: "@rustam_tarix",
    education: [
      "Mirzo Ulug'bek nomidagi O'zMU Tarix fakulteti (Bakalavr va Magistratura)",
      "Sharqshunoslik instituti qoshidagi ilmiy amaliyot",
    ],
    methodology: [
      "Xronologik xaritalar va davlatlar chegaralarining davriy solishtirmasi",
      "Shaxslar va sulolalar genologiyasi asosida mantiqiy bog'lanishlar",
      "BBA testlaridagi chalg'ituvchi sanalar va shartnomalar tahlili",
    ],
    achievements: [
      "800+ nafar yoshlar Yuridik va Tarix fakultetlariga talaba bo'lishgan",
      "Tarixiy xaritalar bilan ishlash elektron qo'llanmasi muallifi",
    ],
    consultationSchedule: "Dushanba - Chorshanba - Juma: 15:00 - 19:00",
    lessonsTopics: [
      "Qadimgi davlatlar va Buyuk Ipak Yo'li",
      "Amir Temur va Temuriylar davri taraqqiyoti",
      "Xonliklar davri va milliy ozodlik harakatlari",
      "Jahon tarixi: Birinchi va Ikkinchi jahon urushlari",
      "Mustaqil O'zbekistonning tashqi siyosati va konstitutsiyaviy islohotlar",
    ],
    reviews: [
      {
        id: "rev-t-1",
        studentName: "Mirjalol Eshonqulov",
        scoreOrCert: "A+ sertifikat (71.8 ball) — Toshkent Davlat Yuridik Universiteti",
        comment: "Rustam ustozning xarita darslari imtihondagi eng qiyin savollarni bir zumda yechishga yordam berdi. Yuridik universitetga grant yutdim!",
        date: "2024-05-14",
        rating: 5,
      },
    ],
  },
  {
    id: "teacher-rus-tili-1",
    fullName: "Nilufar Sobirova",
    subjectId: "rus-tili",
    subjectName: "Rus tili",
    role: "TRKI C2 Xalqaro sertifikati sohibasi va Filolog",
    experienceYears: 13,
    degree: "Oliy toifali filolog, Rus tili va adabiyoti mutaxassisi",
    bio: "Rus tilini chet tili sifatida (RKI) va Milliy sertifikat darajasida o'qitish bo'yicha yetakchi mutaxassis. Grammatika, nutq madaniyati va matn bilan ishlash bo'yicha interaktiv darslar olib boradi. Barcha darajadagi abituriyentlarga qisqa muddatda yuqori ball olish sirlarini o'rgatadi.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    rating: 4.93,
    studentsCount: 1530,
    badges: ["TRKI C2", "Milliy sertifikat A+", "Oliy toifa", "13 yillik tajriba", "Suhbatdoshlik klubi koordinatori"],
    contactPhone: "+998 90 779 11 44",
    telegramHandle: "@nilufar_rustili",
    education: [
      "Nizomiy nomidagi Toshkent Davlat Pedagogika Universiteti",
      "Moskva Davlat Universiteti (MGU) malaka oshirish kursi sertifikati",
    ],
    methodology: [
      "Keling, ruscha gaplashamiz: Jonli nutq va tinglab tushunish trenajyori",
      "Padyejlar va fe'l predloglarini formulaviy jadvallar orqali o'rganish",
      "Matn yozish va adabiy tahlil qoidalari",
    ],
    achievements: [
      "TRKI C2 sertifikatiga ega bo'lgan kam sonli o'zbekistonlik mutaxassislardan biri",
      "1000+ o'quvchisi xalqaro va milliy sertifikatlarga ega bo'ldi",
    ],
    consultationSchedule: "Seshanba - Payshanba - Shanba: 14:30 - 18:30",
    lessonsTopics: [
      "Падежи и предложно-падежная система",
      "Глаголы движения с приставками",
      "Сложноподчинённые предложения",
      "Культура речи и лексика высокого уровня",
      "Анализ текстов и тонкости грамматических тестов",
    ],
    reviews: [
      {
        id: "rev-r-1",
        studentName: "Durdona Saidazimova",
        scoreOrCert: "TRKI C1 / Milliy sertifikat A (68.4 ball)",
        comment: "Nilufar ustozning uslubi juda aniq va qiziqarli. Rus tili grammatikasidagi barcha qiyin fe'llarni oson o'zlashtirdim.",
        date: "2024-06-08",
        rating: 5,
      },
    ],
  },
];

const TEACHERS_STORAGE_KEY = "al_xorazmiy_teachers";
const CONSULTATIONS_STORAGE_KEY = "al_xorazmiy_consultations";

export function getTeachers(): Teacher[] {
  try {
    const raw = localStorage.getItem(TEACHERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(INITIAL_TEACHERS));
      return INITIAL_TEACHERS;
    }
    const parsed: Teacher[] = JSON.parse(raw);
    
    // Ensure all 8 initial subjects are represented
    const missingInitial = INITIAL_TEACHERS.filter(
      (init) => !parsed.some((p) => p.id === init.id || p.subjectId === init.subjectId)
    );
    if (missingInitial.length > 0) {
      const merged = [...parsed, ...missingInitial];
      localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (e) {
    console.error("Error reading teachers from storage", e);
    return INITIAL_TEACHERS;
  }
}

export function getTeacherById(teacherId: string): Teacher | undefined {
  const teachers = getTeachers();
  return teachers.find((t) => t.id === teacherId);
}

export function saveTeacher(teacher: Omit<Teacher, "id" | "rating" | "studentsCount"> & { id?: string }): Teacher {
  const teachers = getTeachers();
  let updated: Teacher;

  if (teacher.id) {
    // Edit existing
    const existingIndex = teachers.findIndex((t) => t.id === teacher.id);
    if (existingIndex !== -1) {
      updated = {
        ...teachers[existingIndex],
        ...teacher,
      };
      teachers[existingIndex] = updated;
    } else {
      updated = {
        ...teacher,
        id: "teacher_" + Date.now(),
        rating: 5.0,
        studentsCount: 1,
      };
      teachers.unshift(updated);
    }
  } else {
    // Create new
    updated = {
      ...teacher,
      id: "teacher_" + Date.now(),
      rating: 5.0,
      studentsCount: 1,
    };
    teachers.unshift(updated);
  }

  try {
    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers));
  } catch (e) {
    console.error("Error saving teachers", e);
  }

  return updated;
}

export function addTeacherReview(teacherId: string, review: Omit<TeacherReview, "id" | "date">): TeacherReview {
  const teachers = getTeachers();
  const teacher = teachers.find((t) => t.id === teacherId);
  const newReview: TeacherReview = {
    ...review,
    id: "rev_" + Date.now(),
    date: new Date().toISOString().split("T")[0],
  };

  if (teacher) {
    if (!teacher.reviews) {
      teacher.reviews = [];
    }
    teacher.reviews.unshift(newReview);

    // Update teacher average rating
    const totalRating = teacher.reviews.reduce((acc, r) => acc + r.rating, 0);
    teacher.rating = Number((totalRating / teacher.reviews.length).toFixed(2));

    try {
      localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers));
    } catch (e) {
      console.error("Error updating teacher review", e);
    }
  }

  return newReview;
}

export function saveConsultationInquiry(inquiry: Omit<TeacherConsultationInquiry, "id" | "createdAt">): TeacherConsultationInquiry {
  const newInquiry: TeacherConsultationInquiry = {
    ...inquiry,
    id: "inq_" + Date.now(),
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(CONSULTATIONS_STORAGE_KEY);
    const list: TeacherConsultationInquiry[] = raw ? JSON.parse(raw) : [];
    list.unshift(newInquiry);
    localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving consultation inquiry", e);
  }

  return newInquiry;
}

export function getConsultationInquiries(): TeacherConsultationInquiry[] {
  try {
    const raw = localStorage.getItem(CONSULTATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading consultations", e);
    return [];
  }
}

export function deleteTeacher(teacherId: string) {
  const teachers = getTeachers().filter((t) => t.id !== teacherId);
  try {
    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers));
  } catch (e) {
    console.error("Error deleting teacher", e);
  }
}
