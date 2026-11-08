import { Story } from "@/types/story";

export const MOCK_STORIES: Story[] = [
  {
    id: "story-1",
    headline: "דרמת ענק ביורוליג: מכבי תל אביב גוברת על פנאתינייקוס בשניית הסיום",
    summary:
      "משחק מותח במיוחד בבלגרד הסתיים בניצחון צהוב קריטי הודות לסל ניצחון דרמטי על הבאזר, למרות קאמבק יווני ברבע האחרון. כלי התקשורת בארץ וביוון מנתחים את המשמעויות של הניצחון למירוץ הפלייאוף.",
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "חגיגה צהובה על הפרקט בסיום המותחן בבלגרד",
    category: "euroleague",
    categoryLabel: "יורוליג",
    competitionBadge: "EuroLeague • Round 14",
    storyType: "story",
    isHero: true,
    updatedAt: "לפני 22 דקות",
    readingTimeMinutes: 4,
    articles: [
      {
        sourceId: "sport5",
        sourceName: "ספורט 5",
        sourceLang: "he",
        headline: "בלתי נתפס: סל ניצחון על הבאזר העניק למכבי ת״א 88:89 על אלופת אירופה",
        excerpt:
          "ערב לפנתיאון. הצהובים הובילו בדו-ספרתי, ראו את פנאתינייקוס עולה ליתרון בדקה האחרונה, אבל מהלך התקפי מבריק בשניות הסיום חתם ניצחון ענק על עתמאן.",
        author: "עמרי מנהיים",
        publishedAt: "22:45",
        originalUrl: "https://www.sport5.co.il",
        takeaway: "דגש על הטקטיקה המבריקה של עודד קטש בדקה האחרונה.",
        contentParagraphs: [
          "בלגרד האירה פנים למכבי תל אביב באחד המשחקים הדרמטיים ביותר שנראו העונה ביורוליג. אלופת אירופה, פנאתינייקוס, הגיעה כפייבוריטית מובהקת, אך נתקלה בחבורה צהובה עקשנית ומלאת אמונה.",
          "המשחק נפתח ביתרון צהוב משמעותי בזכות אחוזי קליעה גבוהים מעבר לקשת וסגירה הרמטית של הצבע. אולם ברבע השלישי, היוונים בניצוחם של סלוקאס ונאן החלו לכרסם בהפרש, עד שהפכו את התוצאה כדקה לסיום.",
          "בפיגור נקודה ועם 6 שניות על שעון המשחק, עודד קטש לקח פסק זמן מכריע ושרטט תרגיל מושלם לבידוד על קו העונשין. הכדור הגיע לידיים הנכונות, וזריקה קשתית מדויקת נשקה לרשת עם שריקת הסיום, מה שהוביל להתפרצות שמחה אדירה של הספסל הישראלי.",
          "בסיום, קטש התרגש: ״הראינו אופי בלתי רגיל מול קבוצה עמוקה בהרבה. הניצחון הזה שייך לכל אחד ואחד מהשחקנים שנלחמו על כל כדור״."
        ],
      },
      {
        sourceId: "one",
        sourceName: "ONE",
        sourceLang: "he",
        headline: "אופי של ווינרים: צפו בסל המדהים שהכריע את המותחן בבלגרד",
        excerpt:
          "למרות סגל חסר ורוטציה קצרה, מכבי תל אביב סיפקה את אחד ממשחקיה המרגשים העונה והנחילה הפסד כואב לירוקים מאתונה. השחקנים חגגו בחדר ההלבשה.",
        author: "משה ברדה",
        publishedAt: "22:42",
        originalUrl: "https://www.one.co.il",
        takeaway: "התמקדות באנרגיות ובחגיגות בחדר ההלבשה.",
        contentParagraphs: [
          "איזה ערב מחשמל בבירת סרביה. מכבי תל אביב הוכיחה שוב שהלב והנשמה גוברים על כל תקציב עתק, כשהנחילה לאלופת אירופה היוונית הפסד כואב וכמעט בלתי נתפס.",
          "בחדר ההלבשה נרשמו חגיגות ממושכות, שירים וריקודים. השחקנים חיבקו ארוכות את עודד קטש, שלמרות היעדרותם של שני שחקני מפתח עקב פציעות, ידע להפיק את המקסימום מכל שחקן שעלה לפרקט.",
          "הסל המכריע הגיע לאחר שפנאתינייקוס כבר ראתה את הניצחון בידיים שלה, אך טעות הגנתית בלתי מחויבת עלתה ליוונים ביוקר והעניקה לצהובים נקודות יקרות מפז במאבק על הפלייאוף."
        ],
      },
      {
        sourceId: "theathletic",
        sourceName: "The Athletic",
        sourceLang: "en",
        headline: "EuroLeague Shock: Maccabi Stuns Reigning Champions Panathinaikos at the Buzzer",
        excerpt:
          "A dramatic final possession exposed defensive lapses in the reigning champions' perimeter rotation, highlighting Maccabi's resilience under extraordinary neutral-venue circumstances.",
        author: "David Pick",
        publishedAt: "23:05",
        originalUrl: "https://theathletic.com",
        takeaway: "ניתוח אנליטי בינלאומי על חולשת ההגנה היוונית במאני-טיים.",
        contentParagraphs: [
          "BELGRADE — In what will stand as one of the definitive tactical upsets of this EuroLeague campaign, Maccabi Tel Aviv overcame severe depth limitations to outmaneuver reigning champions Panathinaikos in an 89-88 thriller.",
          "Panathinaikos coach Ergin Ataman opted for an aggressive switch-all defensive scheme in the final three minutes, betting that his athletic wings could neutralize isolation sets. However, Maccabi head coach Oded Kattash countered by running high-horns spacing that forced a fatal breakdown in the Greek switch.",
          "The victory underscores Maccabi's remarkable mental fortitude, maintaining playoff contention despite playing entire seasons displaced from their home arena in Tel Aviv."
        ],
      },
      {
        sourceId: "walla",
        sourceName: "וואלה! ספורט",
        sourceLang: "he",
        headline: "קטש מאושר: ״אחד הניצחונות הכי מתוקים שלי״; ביוון זועמים על השיפוט",
        excerpt:
          "ארגין עתמאן סירב ללחוץ יד בסיום והשתולל לעבר המזכירות. מנגד, במכבי תל אביב משבחים את המנהיגות והקור רוח בדקות ההכרעה.",
        author: "אהרלה ויסברג",
        publishedAt: "23:12",
        originalUrl: "https://sports.walla.co.il",
        takeaway: "סיקור תגובות המאמנים והסערה היוונית סביב השיפוט.",
      },
    ],
  },
  {
    id: "story-2",
    headline: "ליגת האלופות: ריאל מדריד מנצחת באנפילד במשחק משוגע; ויניסיוס הצטיין",
    summary:
      "קרב הטיטאנים בין ליברפול לריאל מדריד הסתיים בניצחון ספרדי מרשים 3:2. האנגלים הובילו מוקדם, אך מהפך שהובילו ויניסיוס ובלינגהאם הפך את הקערה על פיה.",
    imageUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "ויניסיוס חוגג שער ניצחון מרהיב מול הקופ",
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
        excerpt:
          "Una noche mágica más para el conjunto blanco. Tras encajar dos goles tempraneros, la reacción táctica de Ancelotti desarboló al Liverpool en una segunda parte memorable.",
        author: "José Félix Díaz",
        publishedAt: "23:55",
        originalUrl: "https://www.marca.com",
        takeaway: "חגיגת גאווה ספרדית וציון 10 לויניסיוס ג'וניור.",
      },
      {
        sourceId: "bbc",
        sourceName: "BBC Sport",
        sourceLang: "en",
        headline: "Liverpool 2-3 Real Madrid: European champions edge thrilling Anfield battle",
        excerpt:
          "Arne Slot's men started with breathless intensity, but Real's ruthless counter-attacks punished defensive errors in an enthralling encounter.",
        author: "Phil McNulty",
        publishedAt: "23:50",
        originalUrl: "https://www.bbc.com/sport",
        takeaway: "דגש על הטעויות של הגנת ליברפול במעברים המהירים.",
      },
      {
        sourceId: "sport5",
        sourceName: "ספורט 5",
        sourceLang: "he",
        headline: "האימפריה לא מתה: צפו ב-2:3 המחשמל של ריאל מדריד על ליברפול",
        excerpt:
          "הקבוצה של אנצ'לוטי הוכיחה שוב שאין לה תחליף במפעל היבשתי. בלינגהאם בישל במסירה גאונית, ויניסיוס כבש צמד והשתיק את אנפילד.",
        author: "נדב יעקבי",
        publishedAt: "23:52",
        originalUrl: "https://www.sport5.co.il",
        takeaway: "ניתוח מורשת ווינריות של ריאל מדריד במפעל.",
      },
      {
        sourceId: "one",
        sourceName: "ONE",
        sourceLang: "he",
        headline: "מופע של איש אחד: ויניסיוס פירק את ליברפול, 2:3 ענק לריאל",
        excerpt:
          "הכוכב הברזילאי סיפק את משחקו הטוב ביותר העונה. ליברפול לחצה עד השנייה האחרונה, אך קורטואה הציל שער שוויון ודאי בתוספת הזמן.",
        author: "מערכת ONE",
        publishedAt: "23:48",
        originalUrl: "https://www.one.co.il",
        takeaway: "דגש על הצלות הענק של קורטואה בתוספת הזמן.",
      },
    ],
  },
  {
    id: "story-3",
    headline: "סיפור מיוחד: הילד ממחנה הפליטים שהפך לאלוף העולם בריצת מרתון",
    summary:
      "כתבת מגזין מרגשת החושפת את המסע המטלטל של אברהם קבדה — מילדות ללא נעלי ריצה במזרח אפריקה ועד לשבירת שיא העולם ההיסטורי והתרומה למען דור העתיד.",
    imageUrl:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "חציית קו הסיום עם דמעות של שחרור ותקווה",
    category: "global-stories",
    categoryLabel: "סיפורי מגזין עולמי",
    competitionBadge: "Long Read • World Athletics",
    storyType: "story",
    updatedAt: "לפני שעה",
    readingTimeMinutes: 7,
    articles: [
      {
        sourceId: "theathletic",
        sourceName: "The Athletic",
        sourceLang: "en",
        headline: "From Dusty Tracks to Marathon Immortality: The Unbelievable Odyssey of Abraham Kebede",
        excerpt:
          "He ran 20 kilometers every morning just to reach school. Today, sports scientists study his biomechanics, but his real engine is the promise he made to his late mother.",
        author: "Donald McRae",
        publishedAt: "08:00",
        originalUrl: "https://theathletic.com",
        takeaway: "סיפור אנושי מעמיק על כוח רצון, פיזיולוגיה ומורשת משפחתית.",
      },
      {
        sourceId: "guardian",
        sourceName: "The Guardian",
        sourceLang: "en",
        headline: "The barefoot pioneer redefining the limits of human endurance",
        excerpt:
          "In an era dominated by high-tech carbon super-shoes, Kebede's philosophy remains rooted in simplicity, mental fortitude, and deep community bonds.",
        author: "Sean Ingle",
        publishedAt: "09:30",
        originalUrl: "https://theguardian.com/sport",
        takeaway: "השוואה מרתקת בין טכנולוגיית נעלי הריצה לפילוסופיה הנפשית שלו.",
      },
      {
        sourceId: "ynet",
        sourceName: "Ynet ספורט",
        sourceLang: "he",
        headline: "״הרגליים כאבו, אבל הרעב היה חזק יותר״: סיפורו המדהים של שיאן העולם החדש",
        excerpt:
          "בגיל 12 הוא שרד מסע מפרך, בגיל 18 התגלה במקרה על ידי מאמן שוודי, וכעת הוא הדהים את עולם האתלטיקה. ראיון בלעדי עם האתלט שריגש את העולם.",
        author: "אורן אהרוני",
        publishedAt: "11:15",
        originalUrl: "https://www.ynet.co.il/sport",
        takeaway: "ראיון אישי וציטוטים מרגשים על המאבק וההצלחה.",
      },
    ],
  },
  {
    id: "story-4",
    headline: "ליגת העל בכדורגל: מכבי חיפה גוברת על הפועל באר שבע במשחק העונה",
    summary:
      "קרב צמרת רותח באצטדיון סמי עופר הסתיים ב-0:1 ירוק. שער בודד במחצית השנייה פתח פער של 4 נקודות בפסגת ליגת העל. בבאר שבע טוענים לפנדל שלא נשרק.",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "חגיגת שער היתרון בסמי עופר מול 30 אלף צופים",
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
        excerpt:
          "משחק בעצימות אירופית. הירוקים לחצו גבוה, סיימו ב-10 שחקנים אחרי הרחקה דרמטית, אך שמרו על שלוש נקודות יקרות בדרך למקום הראשון.",
        author: "יגאל גולדשטיין",
        publishedAt: "22:30",
        originalUrl: "https://www.sport5.co.il",
        takeaway: "התמקדות באווירה המחשמלת ביציעים ובטקטיקה של חיפה.",
      },
      {
        sourceId: "one",
        sourceName: "ONE",
        sourceLang: "he",
        headline: "סערת שיפוט בסמי עופר: ״שדדו אותנו, היה פנדל של 100 אחוז״",
        excerpt:
          "זעם עצום בהפועל באר שבע על שופטי ה-VAR. רן קוז'וק בא בטענות בסיום: ״הגיע לנו שוויון, ההחלטות תמיד הולכות נגדנו במשחקים כאלה״.",
        author: "איציק כלפי",
        publishedAt: "22:35",
        originalUrl: "https://www.one.co.il",
        takeaway: "זווית המחאה והטענות הקשות של באר שבע על השיפוט.",
      },
      {
        sourceId: "walla",
        sourceName: "וואלה! ספורט",
        sourceLang: "he",
        headline: "שוב במקום הראוי לה: חיפה מוכיחה מדוע היא המועמדת הראשית לאליפות",
        excerpt:
          "טור דעה: עם אופי של ברזל וקהל תומך, הירוקים עמדו בלחץ של הפועל באר שבע והראו עליונות מנטלית ברגעי המבחן.",
        author: "איציק יצחקי",
        publishedAt: "22:50",
        originalUrl: "https://sports.walla.co.il",
        takeaway: "ניתוח מנטלי של מאבק האליפות בליגת העל.",
      },
    ],
  },
  {
    id: "story-5",
    headline: "NBA: דני אבדיה בשיא קריירה של 34 נקודות בניצחון דרמטי על בוסטון",
    summary:
      "משחק עילאי של הפורוורד הישראלי, שקלע 6 שלשות, חילק 9 אסיסטים והוביל קאמבק של 15 נקודות הפרש ברבע הרביעי מול אלופת ה-NBA.",
    imageUrl:
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "אבדיה חוגג שלשה מכריעה בקלאץ'",
    category: "nba",
    categoryLabel: "NBA",
    competitionBadge: "NBA Regular Season",
    storyType: "breaking",
    updatedAt: "לפני שעתיים",
    readingTimeMinutes: 3,
    articles: [
      {
        sourceId: "espn",
        sourceName: "ESPN",
        sourceLang: "en",
        headline: "Avdija's Career-High 34 Points Fuel Stunning 4th-Quarter Comeback Over Celtics",
        excerpt:
          "Showcasing poise beyond his years, Deni Avdija took over down the stretch, knocking down contested perimeter shots against Boston's premier wing defenders.",
        author: "Tim Bontemps",
        publishedAt: "06:15",
        originalUrl: "https://www.espn.com/nba",
        takeaway: "הכרה אמריקאית ביכולת הקלאץ' של אבדיה מול אלופת הליגה.",
      },
      {
        sourceId: "sport5",
        sourceName: "ספורט 5",
        sourceLang: "he",
        headline: "הלילה של חייו: 34 נקודות לדני אבדיה במופע ענק מול בוסטון",
        excerpt:
          "איזה טירוף. השדרים האמריקאים יצאו מגדרם כשהישראלי צלף שוב ושוב במאני טיים. השחקנים חגגו עליו במקלחת עם דליי מים.",
        author: "יואב מודעי",
        publishedAt: "06:30",
        originalUrl: "https://www.sport5.co.il",
        takeaway: "התלהבות ישראלית גדולה ותגובות השדרים בארה״ב.",
      },
      {
        sourceId: "theathletic",
        sourceName: "The Athletic",
        sourceLang: "en",
        headline: "How Deni Avdija Solved the Celtics' Switch Defense",
        excerpt:
          "Film room breakdown: dissecting how Avdija exploited mismatches in transition and punished Boston for underestimating his pull-up jumper.",
        author: "Zach Harper",
        publishedAt: "08:45",
        originalUrl: "https://theathletic.com",
        takeaway: "ניתוח וידאו מקצועי של קריאת המשחק והחלטות הזריקה.",
      },
    ],
  },
  {
    id: "story-6",
    headline: "מוקדמות המונדיאל וליגת האומות: נבחרת צרפת מביסה את הולנד 1:4 בהצגת כדורגל",
    summary:
      "שחמט של דידייה דשאן בפריז. קיליאן אמבפה הבריק עם צמד ובישול, בעוד ההולנדים נותרו חסרי אונים מול העוצמה של סגנית אלופת העולם.",
    imageUrl:
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "חגיגה טריקולורית סוחפת בסטאד דה פראנס",
    category: "uefa-tournaments",
    categoryLabel: "נבחרות ומוקדמות",
    competitionBadge: "UEFA Nations League • Matchday 5",
    storyType: "breaking",
    updatedAt: "לפני 3 שעות",
    readingTimeMinutes: 3,
    articles: [
      {
        sourceId: "bbc",
        sourceName: "BBC Sport",
        sourceLang: "en",
        headline: "France 4-1 Netherlands: Mbappe sparkles as ruthless French dismantle Dutch",
        excerpt:
          "A masterclass in attacking transitions left Ronald Koeman searching for answers as France secured their spot in the finals with supreme confidence.",
        author: "Alistair Magowan",
        publishedAt: "23:40",
        originalUrl: "https://www.bbc.com/sport",
        takeaway: "ביקורת על המערך ההולנדי ושבחים למעבר ההתקפי הצרפתי.",
      },
      {
        sourceId: "one",
        sourceName: "ONE",
        sourceLang: "he",
        headline: "פשוט רמה אחרת: צרפת פירקה 1:4 את הולנד, צמד אדיר לאמבפה",
        excerpt:
          "כדורגל מעולם אחר. הטריקולור סיפקו תצוגה מופלאה בפריז, השאירו אבק לכתומים והבטיחו את הכרטיס לשלב הבא בסטייל.",
        author: "מערכת ONE",
        publishedAt: "23:45",
        originalUrl: "https://www.one.co.il",
        takeaway: "דגש על הדומיננטיות המוחלטת של קיליאן אמבפה.",
      },
      {
        sourceId: "sport5",
        sourceName: "ספורט 5",
        sourceLang: "he",
        headline: "קונצרט בפריז: צפו ברביעייה של צרפת מול הולנד",
        excerpt:
          "דידייה דשאן השתיק את המבקרים. הצמד של אמבפה הוכיח מדוע צרפת נשארת המועמדת הבכירה לכל תואר בינלאומי.",
        author: "מערכת ספורט 5",
        publishedAt: "23:42",
        originalUrl: "https://www.sport5.co.il",
        takeaway: "ניתוח העומק של הסגל הצרפתי והתשובה של דשאן לביקורות.",
      },
    ],
  },
];

export const CATEGORIES_CONFIG = [
  { id: "all", label: "כל הסיפורים", icon: "Flame" },
  { id: "israeli-football", label: "כדורגל ישראלי", icon: "Trophy" },
  { id: "uefa-tournaments", label: "אירופה ונבחרות", icon: "Globe" },
  { id: "euroleague", label: "יורוליג", icon: "Shield" },
  { id: "nba", label: "NBA", icon: "Zap" },
  { id: "israeli-basketball", label: "כדורסל ישראלי", icon: "Activity" },
  { id: "global-stories", label: "סיפורי עומק ומגזין", icon: "BookOpen" },
] as const;
