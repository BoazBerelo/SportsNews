import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf4Tc3sytJsCaolXQtTfvOY8LOcp_JjxY",
  authDomain: "sports-news-pulse-2026.firebaseapp.com",
  projectId: "sports-news-pulse-2026",
  storageBucket: "sports-news-pulse-2026.firebasestorage.app",
  messagingSenderId: "135781768506",
  appId: "1:135781768506:web:a2fc5044dcbbffbc590403",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleStories = [
  {
    id: "story-1",
    headline: "דרמת ענק ביורוליג: מכבי תל אביב גוברת על פנאתינייקוס בשניית הסיום",
    summary: "משחק מותח במיוחד בבלגרד הסתיים בניצחון צהוב קריטי הודות לסל ניצחון דרמטי על הבאזר.",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    category: "euroleague",
    categoryLabel: "יורוליג",
    competitionBadge: "EuroLeague • Round 14",
    storyType: "story",
    updatedAt: "לפני 22 דקות",
    readingTimeMinutes: 4,
    articles: [
      {
        sourceId: "sport5",
        sourceName: "ספורט 5",
        sourceLang: "he",
        headline: "בלתי נתפס: סל ניצחון על הבאזר העניק למכבי ת״א 88:89 על אלופת אירופה",
        excerpt: "ערב לפנתיאון. הצהובים הובילו בדו-ספרתי וסגרו ניצחון ענק.",
        author: "עמרי מנהיים",
        publishedAt: "22:45",
        originalUrl: "https://www.sport5.co.il",
        takeaway: "דגש על הטקטיקה המבריקה של עודד קטש בדקה האחרונה."
      },
      {
        sourceId: "one",
        sourceName: "ONE",
        sourceLang: "he",
        headline: "אופי של ווינרים: צפו בסל המדהים שהכריע את המותחן בבלגרד",
        excerpt: "למרות סגל חסר ורוטציה קצרה, מכבי תל אביב סיפקה ניצחון הירואי.",
        author: "משה ברדה",
        publishedAt: "22:42",
        originalUrl: "https://www.one.co.il",
        takeaway: "התמקדות באנרגיות ובחגיגות בחדר ההלבשה."
      },
      {
        sourceId: "theathletic",
        sourceName: "The Athletic",
        sourceLang: "en",
        headline: "EuroLeague Shock: Maccabi Stuns Reigning Champions Panathinaikos at the Buzzer",
        excerpt: "A dramatic final possession exposed defensive lapses in the reigning champions' perimeter rotation.",
        author: "David Pick",
        publishedAt: "23:05",
        originalUrl: "https://theathletic.com",
        takeaway: "ניתוח אנליטי בינלאומי על חולשת ההגנה היוונית במאני-טיים."
      }
    ]
  },
  {
    id: "story-2",
    headline: "ליגת האלופות: ריאל מדריד מנצחת באנפילד במשחק משוגע; ויניסיוס הצטיין",
    summary: "קרב הטיטאנים בין ליברפול לריאל מדריד הסתיים בניצחון ספרדי מרשים 3:2.",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    category: "uefa-tournaments",
    categoryLabel: "ליגת האלופות",
    competitionBadge: "Champions League • Matchday 6",
    storyType: "breaking",
    updatedAt: "לפני 38 דקות",
    readingTimeMinutes: 3,
    articles: [
      {
        sourceId: "marca",
        sourceName: "Marca",
        sourceLang: "es",
        headline: "Reyes de Europa: El Madrid asalta Anfield con una exhibición de Vinicius",
        excerpt: "Una noche mágica más para el conjunto blanco tras remontar un 2:0 adverso.",
        author: "José Félix Díaz",
        publishedAt: "23:55",
        originalUrl: "https://www.marca.com",
        takeaway: "חגיגת גאווה ספרדית וציון 10 לויניסיוס ג'וניור."
      },
      {
        sourceId: "bbc",
        sourceName: "BBC Sport",
        sourceLang: "en",
        headline: "Liverpool 2-3 Real Madrid: European champions edge thrilling Anfield battle",
        excerpt: "Arne Slot's men started with breathless intensity, but Real's counter-attacks punished defensive errors.",
        author: "Phil McNulty",
        publishedAt: "23:50",
        originalUrl: "https://www.bbc.com/sport",
        takeaway: "דגש על הטעויות של הגנת ליברפול במעברים המהירים."
      },
      {
        sourceId: "sport5",
        sourceName: "ספורט 5",
        sourceLang: "he",
        headline: "האימפריה לא מתה: צפו ב-2:3 המחשמל של ריאל מדריד על ליברפול",
        excerpt: "הקבוצה של אנצ'לוטי הוכיחה שוב שאין לה תחליף במפעל היבשתי.",
        author: "נדב יעקבי",
        publishedAt: "23:52",
        originalUrl: "https://www.sport5.co.il",
        takeaway: "ניתוח מורשת ווינריות של ריאל מדריד במפעל."
      }
    ]
  },
  {
    id: "story-3",
    headline: "ליגת העל בכדורגל: מכבי חיפה גוברת על הפועל באר שבע במשחק העונה",
    summary: "קרב צמרת רותח באצטדיון סמי עופר הסתיים ב-0:1 ירוק שפתח פער של 4 נקודות בפסגה.",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    category: "israeli-football",
    categoryLabel: "כדורגל ישראלי",
    competitionBadge: "ליגת העל • מחזור 18",
    storyType: "breaking",
    updatedAt: "לפני שעה וחצי",
    readingTimeMinutes: 4,
    articles: [
      {
        sourceId: "sport5",
        sourceName: "ספורט 5",
        sourceLang: "he",
        headline: "הצהרת כוונות: 0:1 ענק למכבי חיפה על הפועל ב״ש בסמי עופר",
        excerpt: "משחק בעצימות אירופית. הירוקים לחצו גבוה ושמרו על שלוש נקודות יקרות.",
        author: "יגאל גולדשטיין",
        publishedAt: "22:30",
        originalUrl: "https://www.sport5.co.il",
        takeaway: "התמקדות באווירה המחשמלת ביציעים ובטקטיקה של חיפה."
      },
      {
        sourceId: "one",
        sourceName: "ONE",
        sourceLang: "he",
        headline: "סערת שיפוט בסמי עופר: ״שדדו אותנו, היה פנדל של 100 אחוז״",
        excerpt: "זעם עצום בהפועל באר שבע על שופטי ה-VAR.",
        author: "איציק כלפי",
        publishedAt: "22:35",
        originalUrl: "https://www.one.co.il",
        takeaway: "זווית המחאה והטענות הקשות של באר שבע על השיפוט."
      }
    ]
  },
  {
    id: "story-4",
    headline: "סיפור מיוחד: הילד ממחנה הפליטים שהפך לאלוף העולם בריצת מרתון",
    summary: "כתבת מגזין מרגשת החושפת את המסע המטלטל של אברהם קבדה מאפריקה ועד שבירת שיא העולם.",
    imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
    category: "global-stories",
    categoryLabel: "סיפורי מגזין עולמי",
    competitionBadge: "Long Read • World Athletics",
    storyType: "story",
    updatedAt: "לפני שעתיים",
    readingTimeMinutes: 7,
    articles: [
      {
        sourceId: "theathletic",
        sourceName: "The Athletic",
        sourceLang: "en",
        headline: "From Dusty Tracks to Marathon Immortality: The Unbelievable Odyssey of Abraham Kebede",
        excerpt: "He ran 20 kilometers every morning just to reach school. Today, sports scientists study his biomechanics.",
        author: "Donald McRae",
        publishedAt: "08:00",
        originalUrl: "https://theathletic.com",
        takeaway: "סיפור אנושי מעמיק על כוח רצון, פיזיולוגיה ומורשת משפחתית."
      },
      {
        sourceId: "guardian",
        sourceName: "The Guardian",
        sourceLang: "en",
        headline: "The barefoot pioneer redefining the limits of human endurance",
        excerpt: "In an era dominated by high-tech carbon super-shoes, Kebede's philosophy remains rooted in simplicity.",
        author: "Sean Ingle",
        publishedAt: "09:30",
        originalUrl: "https://theguardian.com/sport",
        takeaway: "השוואה מרתקת בין טכנולוגיית נעלי הריצה לפילוסופיה הנפשית שלו."
      }
    ]
  }
];

async function seed() {
  console.log("Connecting to Firestore database in sports-news-pulse-2026...");
  for (let i = 0; i < sampleStories.length; i++) {
    const story = sampleStories[i];
    const storyRef = doc(db, "stories", story.id);
    await setDoc(storyRef, {
      ...story,
      createdAt: Timestamp.fromMillis(Date.now() - i * 3600000),
    });
    console.log(`✓ Seeded story into Firestore: ${story.id} (${story.headline.slice(0, 32)}...)`);
  }
  console.log("Done! Firestore collection 'stories' is populated.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
