window.MAJESTY_CURRICULUM = {
  "JSS 1":["English Language","Mathematics","Basic Science","Basic Technology","Social Studies","Civic Education","Computer Studies","Agricultural Science","Business Studies","Cultural & Creative Arts","Physical & Health Education","Christian Religious Studies","Home Economics","French"],
  "JSS 2":["English Language","Mathematics","Basic Science","Basic Technology","Social Studies","Civic Education","Computer Studies","Agricultural Science","Business Studies","Cultural & Creative Arts","Physical & Health Education","Christian Religious Studies","Home Economics","French"],
  "JSS 3":["English Language","Mathematics","Basic Science","Basic Technology","Social Studies","Civic Education","Computer Studies","Agricultural Science","Business Studies","Cultural & Creative Arts","Physical & Health Education","Christian Religious Studies","Home Economics","French"],
  "SS 1":["English Language","Mathematics","Biology","Chemistry","Physics","Further Mathematics","Agricultural Science","Economics","Government","Literature in English","Commerce","Financial Accounting","Geography","Computer Studies","Civic Education"],
  "SS 2":["English Language","Mathematics","Biology","Chemistry","Physics","Further Mathematics","Agricultural Science","Economics","Government","Literature in English","Commerce","Financial Accounting","Geography","Computer Studies","Civic Education"],
  "SS 3":["English Language","Mathematics","Biology","Chemistry","Physics","Further Mathematics","Agricultural Science","Economics","Government","Literature in English","Commerce","Financial Accounting","Geography","Computer Studies","Civic Education"]
};
window.MAJESTY_UNIVERSITY = {
 "Science & Technology":{"Computer Science":["CSC 101 — Introduction to Computing","CSC 102 — Fundamentals of Programming","MTH 101 — General Mathematics I","STA 101 — Introduction to Statistics"],"Biochemistry":["BCH 101 — General Biochemistry","BIO 101 — General Biology","CHM 101 — General Chemistry"],"Microbiology":["MCB 101 — Introduction to Microbiology","BIO 101 — General Biology","CHM 101 — General Chemistry"],"Mathematics":["MTH 101 — General Mathematics I","MTH 102 — General Mathematics II","STA 101 — Introduction to Statistics"]},
 "Engineering":{"Electrical/Electronics Engineering":["EEE 101 — Introduction to Electrical Engineering","PHY 101 — General Physics","MTH 101 — General Mathematics I"],"Civil Engineering":["CVE 101 — Introduction to Civil Engineering","PHY 101 — General Physics","MTH 101 — General Mathematics I"],"Mechanical Engineering":["MEE 101 — Engineering Drawing","PHY 101 — General Physics","MTH 101 — General Mathematics I"]},
 "Management & Social Sciences":{"Accounting":["ACC 101 — Principles of Accounting","ECO 101 — Principles of Economics","BUS 101 — Introduction to Business"],"Economics":["ECO 101 — Principles of Economics","ECO 102 — Microeconomics","MTH 101 — General Mathematics I"],"Business Administration":["BUS 101 — Introduction to Business","MGT 101 — Principles of Management","ACC 101 — Principles of Accounting"],"Mass Communication":["MAC 101 — Introduction to Mass Communication","ENG 101 — Use of English","SOC 101 — Introduction to Sociology"]},
 "Arts & Humanities":{"English & Literary Studies":["ENG 101 — Use of English","LIT 101 — Introduction to Literature","LIN 101 — Introduction to Linguistics"],"History & International Studies":["HIS 101 — Introduction to History","POL 101 — Introduction to Political Science"],"Law":["LAW 101 — Legal Methods","LAW 102 — Nigerian Legal System"]},
 "Health Sciences":{"Nursing Science":["ANA 101 — Human Anatomy","PHY 101 — Human Physiology","NUR 101 — Foundations of Nursing"],"Public Health":["PHE 101 — Introduction to Public Health","BIO 101 — General Biology","STA 101 — Introduction to Statistics"]}
};
window.MAJESTY_LESSONS = {
 "Mathematics":{topic:"Understanding algebraic expressions",notes:"An algebraic expression combines numbers, variables and operations. A variable is a letter representing an unknown or changing value. Like terms have the same variable raised to the same power.",example:"Simplify 3x + 2x − 4. Combine like terms: 3x + 2x = 5x. Answer: 5x − 4.",questions:[{q:"Simplify 4a + 3a.",a:["7a","7a²","a","12a"],correct:0,why:"4a and 3a are like terms, so add their coefficients: 4 + 3 = 7."},{q:"If x = 3, what is 2x + 5?",a:["8","10","11","13"],correct:2,why:"Substitute 3 for x: 2(3) + 5 = 11."}]},
 "English Language":{topic:"Parts of speech",notes:"Parts of speech describe how words function in sentences. Nouns name people, places or things; verbs express actions or states; adjectives describe nouns; adverbs modify verbs, adjectives or other adverbs.",example:"The diligent student reads carefully. Student = noun; reads = verb; diligent = adjective; carefully = adverb.",questions:[{q:"Which word is an adjective in 'the bright student smiled'?",a:["student","smiled","bright","the"],correct:2,why:"Bright describes the noun student."}]},
 "Basic Science":{topic:"Living and non-living things",notes:"Living things carry out life processes such as nutrition, respiration, growth, movement, excretion, reproduction and sensitivity. Non-living things do not independently carry out all these processes.",example:"A seed can germinate and grow under suitable conditions; a stone cannot.",questions:[{q:"Which is a characteristic of living things?",a:["Rusting","Respiration","Melting","Breaking"],correct:1,why:"Respiration releases energy from food in living cells."}]},
 "Biology":{topic:"Cell structure and function",notes:"The cell is the basic structural and functional unit of life. The cell membrane controls movement of substances; cytoplasm hosts many reactions; the nucleus contains genetic material and helps control cell activities.",example:"Plant cells typically have a cellulose cell wall and chloroplasts; animal cells do not have these structures.",questions:[{q:"Which structure controls most cell activities?",a:["Nucleus","Cell wall","Vacuole","Ribosome"],correct:0,why:"The nucleus contains DNA and regulates cell activities."}]},
 "Chemistry":{topic:"Atoms and elements",notes:"An atom is the smallest unit of an element that retains its chemical properties. Atoms contain protons and neutrons in a nucleus, with electrons occupying regions around it.",example:"A neutral carbon atom has 6 protons and 6 electrons.",questions:[{q:"Which particle has a negative charge?",a:["Proton","Neutron","Electron","Nucleus"],correct:2,why:"Electrons carry a negative electric charge."}]},
 "Physics":{topic:"Speed, distance and time",notes:"Speed is the distance travelled per unit time. The formula is speed = distance ÷ time. Use consistent units when calculating.",example:"A car travels 120 km in 2 hours. Speed = 120 ÷ 2 = 60 km/h.",questions:[{q:"A runner covers 100 m in 20 s. What is the average speed?",a:["2 m/s","5 m/s","20 m/s","200 m/s"],correct:1,why:"Speed = 100 ÷ 20 = 5 m/s."}]}
};

// Topic catalogues for every school subject and university course currently listed above.
window.MAJESTY_TOPICS = {
  "English Language": [
    "Parts of speech",
    "Nouns, pronouns and determiners",
    "Tenses and concord",
    "Sentence types and clauses",
    "Punctuation and capitalisation",
    "Comprehension skills",
    "Summary writing",
    "Formal and informal letter writing",
    "Essay and creative writing",
    "Speech work and oral English"
  ],
  "Mathematics": [
    "Number bases and place value",
    "Fractions, decimals and percentages",
    "Ratio, proportion and rates",
    "Algebraic expressions",
    "Linear equations and inequalities",
    "Geometry: angles and polygons",
    "Mensuration: perimeter, area and volume",
    "Statistics and data representation",
    "Probability",
    "Graphs and functions"
  ],
  "Basic Science": [
    "Living and non-living things",
    "Cells and simple organisms",
    "Nutrition and balanced diet",
    "Respiration and circulation",
    "Matter and its states",
    "Energy, heat and temperature",
    "Force, motion and simple machines",
    "The environment and ecosystems",
    "Reproduction and growth",
    "Safety, health and disease prevention"
  ],
  "Basic Technology": [
    "Workshop safety and tools",
    "Materials: wood, metals and plastics",
    "Technical drawing and instruments",
    "Measurement and simple constructions",
    "Building materials and structures",
    "Basic electricity and circuits",
    "Machines and mechanical systems",
    "Maintenance and repairs"
  ],
  "Social Studies": [
    "Family and social institutions",
    "Culture, values and identity",
    "Community development",
    "Socialisation and human relationships",
    "Population and migration",
    "Environmental problems",
    "Transportation and communication",
    "National integration and cooperation"
  ],
  "Civic Education": [
    "Citizenship and civic responsibilities",
    "Human rights and duties",
    "Rule of law",
    "Democracy and democratic institutions",
    "Constitution and government",
    "National values and integrity",
    "Elections and political participation",
    "Peace, conflict resolution and security"
  ],
  "Computer Studies": [
    "Parts of a computer system",
    "Input, output and storage devices",
    "Operating systems and file management",
    "Word processing",
    "Spreadsheets and data handling",
    "Presentation software",
    "Internet, email and digital communication",
    "Computer networks",
    "Cyber safety and digital citizenship",
    "Introduction to programming"
  ],
  "Agricultural Science": [
    "Meaning and importance of agriculture",
    "Branches of agriculture",
    "Soil formation and properties",
    "Soil fertility and conservation",
    "Crop production and farm practices",
    "Livestock production",
    "Farm tools and machinery",
    "Pests, diseases and control",
    "Agricultural economics and marketing",
    "Agricultural extension"
  ],
  "Business Studies": [
    "Introduction to business",
    "Office practice and procedures",
    "Communication in business",
    "Entrepreneurship and small business",
    "Trade and distribution",
    "Banking and financial services",
    "Bookkeeping basics",
    "Consumer rights and protection"
  ],
  "Cultural & Creative Arts": [
    "Elements and principles of art",
    "Drawing and painting techniques",
    "Colour theory",
    "Crafts and design",
    "Nigerian traditional arts and culture",
    "Music: rhythm, melody and instruments",
    "Drama and performance",
    "Art appreciation and creative projects"
  ],
  "Physical & Health Education": [
    "Physical fitness and components",
    "Fundamental movement skills",
    "Games and sports skills",
    "Athletics and track events",
    "Personal hygiene and sanitation",
    "Nutrition and healthy living",
    "First aid and safety",
    "Human body systems and exercise",
    "Drug abuse prevention"
  ],
  "Christian Religious Studies": [
    "Creation and the nature of God",
    "The call and leadership of biblical figures",
    "The life and teachings of Jesus",
    "Parables and miracles",
    "Love, forgiveness and service",
    "The early church",
    "Christian living and moral values",
    "Faith, prayer and worship"
  ],
  "Home Economics": [
    "Food, nutrition and meal planning",
    "Food hygiene and kitchen safety",
    "Food preparation and preservation",
    "Clothing and textile care",
    "Sewing tools and basic stitches",
    "Family relationships and responsibilities",
    "Home management and budgeting",
    "Child development and family health"
  ],
  "French": [
    "Greetings and introductions",
    "French alphabet and pronunciation",
    "Numbers, dates and time",
    "Articles, nouns and adjectives",
    "Present-tense regular verbs",
    "Family, school and daily routines",
    "Asking and answering questions",
    "Basic reading and conversation"
  ],
  "Biology": [
    "Cell structure and organisation",
    "Nutrition in plants and animals",
    "Transport systems",
    "Respiration and gaseous exchange",
    "Excretion and homeostasis",
    "Reproduction in plants and animals",
    "Genetics and inheritance",
    "Ecology and ecosystems",
    "Evolution and adaptation",
    "Classification of living organisms"
  ],
  "Chemistry": [
    "Atoms, elements and compounds",
    "Atomic structure and isotopes",
    "Periodic table and periodicity",
    "Chemical bonding",
    "Chemical formulae and equations",
    "Acids, bases and salts",
    "Mole concept and stoichiometry",
    "States of matter and gas laws",
    "Rates of reaction",
    "Organic chemistry and hydrocarbons"
  ],
  "Physics": [
    "Physical quantities and measurement",
    "Motion, speed and acceleration",
    "Scalars and vectors",
    "Forces and Newton's laws",
    "Work, energy and power",
    "Heat and temperature",
    "Waves and sound",
    "Light and optics",
    "Electricity and circuits",
    "Magnetism and electromagnetism"
  ],
  "Further Mathematics": [
    "Sets, relations and functions",
    "Quadratic equations and inequalities",
    "Sequences and series",
    "Binomial theorem",
    "Trigonometric identities",
    "Differentiation",
    "Applications of differentiation",
    "Integration",
    "Vectors and coordinate geometry",
    "Matrices and determinants"
  ],
  "Economics": [
    "Basic economic concepts and scarcity",
    "Demand and supply",
    "Elasticity of demand and supply",
    "Production and costs",
    "Market structures",
    "National income",
    "Money, banking and inflation",
    "Public finance and taxation",
    "International trade",
    "Economic development in Nigeria"
  ],
  "Government": [
    "Meaning and scope of government",
    "Political concepts and authority",
    "Constitution and constitutionalism",
    "Organs and levels of government",
    "Political parties and pressure groups",
    "Electoral systems and processes",
    "Public administration",
    "Political ideologies",
    "Nigeria's political development",
    "International relations"
  ],
  "Literature in English": [
    "Genres of literature",
    "Elements of prose fiction",
    "Plot, setting and characterisation",
    "Poetry: form, imagery and sound",
    "Figures of speech",
    "Drama and dramatic techniques",
    "Literary themes and context",
    "Critical appreciation and essay writing"
  ],
  "Commerce": [
    "Trade and its functions",
    "Home and foreign trade",
    "Aids to trade",
    "Business organisations",
    "Insurance and risk management",
    "Banking and financial institutions",
    "Transportation and warehousing",
    "Advertising and sales promotion",
    "Consumer protection",
    "International trade"
  ],
  "Financial Accounting": [
    "Introduction to accounting",
    "Accounting concepts and conventions",
    "Source documents and books of original entry",
    "Ledger accounts and trial balance",
    "Cash books and bank reconciliation",
    "Depreciation of fixed assets",
    "Final accounts of a sole trader",
    "Control accounts",
    "Partnership accounts",
    "Company accounts"
  ],
  "Geography": [
    "The earth and the solar system",
    "Latitude, longitude and time",
    "Weather and climate",
    "Rocks and the rock cycle",
    "Landforms and geomorphic processes",
    "Soils and vegetation",
    "Population and settlement",
    "Agriculture and natural resources",
    "Map reading and interpretation",
    "Environmental management"
  ],
  "CSC 101 — Introduction to Computing": [
    "History and generations of computers",
    "Computer hardware and software",
    "Data, information and information processing",
    "Number systems and data representation",
    "Operating systems and application software",
    "Computer networks and the internet",
    "Database fundamentals",
    "Algorithms and problem solving",
    "Computer ethics and cyber security"
  ],
  "CSC 102 — Fundamentals of Programming": [
    "Programming concepts and problem solving",
    "Algorithms and flowcharts",
    "Variables, data types and operators",
    "Input and output",
    "Conditional statements",
    "Loops and iteration",
    "Functions and modular programming",
    "Arrays and strings",
    "Testing and debugging"
  ],
  "MTH 101 — General Mathematics I": [
    "Sets and real number systems",
    "Indices, surds and logarithms",
    "Algebraic equations and inequalities",
    "Functions and graphs",
    "Trigonometric functions",
    "Coordinate geometry",
    "Sequences and series",
    "Limits and continuity"
  ],
  "MTH 102 — General Mathematics II": [
    "Differentiation techniques",
    "Applications of differentiation",
    "Integration techniques",
    "Definite integrals and area",
    "Matrices and determinants",
    "Vectors",
    "Complex numbers",
    "First-order differential equations"
  ],
  "STA 101 — Introduction to Statistics": [
    "Types and sources of data",
    "Data presentation and frequency tables",
    "Measures of central tendency",
    "Measures of dispersion",
    "Probability fundamentals",
    "Probability distributions",
    "Sampling methods",
    "Correlation and regression"
  ],
  "BCH 101 — General Biochemistry": [
    "Biomolecules and water",
    "Carbohydrates and their functions",
    "Lipids and membranes",
    "Proteins and amino acids",
    "Enzymes and enzyme activity",
    "Vitamins and minerals",
    "Metabolism fundamentals"
  ],
  "BIO 101 — General Biology": [
    "Characteristics and classification of life",
    "Cell structure and function",
    "Biological molecules",
    "Cell division",
    "Basic genetics",
    "Evolution and biodiversity",
    "Ecology and environment"
  ],
  "CHM 101 — General Chemistry": [
    "Atomic theory and electronic structure",
    "Periodic table",
    "Chemical bonding",
    "Chemical equations and stoichiometry",
    "Gas laws",
    "Solutions and concentration",
    "Acids and bases",
    "Chemical equilibrium"
  ],
  "MCB 101 — Introduction to Microbiology": [
    "History and scope of microbiology",
    "Microscopy and staining",
    "Bacterial cell structure",
    "Microbial growth and nutrition",
    "Microbial genetics",
    "Viruses and fungi",
    "Microorganisms and disease",
    "Sterilisation and aseptic techniques"
  ],
  "EEE 101 — Introduction to Electrical Engineering": [
    "Electrical quantities and units",
    "Electric charge, current and voltage",
    "Ohm's law",
    "Series and parallel circuits",
    "Kirchhoff's laws",
    "Electrical power and energy",
    "Basic circuit measurement",
    "Electrical safety"
  ],
  "CVE 101 — Introduction to Civil Engineering": [
    "Scope of civil engineering",
    "Engineering materials",
    "Surveying principles",
    "Structural systems and loads",
    "Soil mechanics fundamentals",
    "Water supply and sanitation",
    "Roads and transportation",
    "Construction safety"
  ],
  "MEE 101 — Engineering Drawing": [
    "Drawing instruments and standards",
    "Lines, scales and lettering",
    "Geometrical constructions",
    "Orthographic projection",
    "Isometric drawing",
    "Sections and sectional views",
    "Dimensioning",
    "Introduction to CAD"
  ],
  "ACC 101 — Principles of Accounting": [
    "Purpose and users of accounting",
    "Accounting equation",
    "Double-entry bookkeeping",
    "Journal and ledger",
    "Trial balance",
    "Cash book",
    "Bank reconciliation",
    "Financial statements"
  ],
  "ECO 101 — Principles of Economics": [
    "Scarcity, choice and opportunity cost",
    "Production possibility frontier",
    "Demand and supply",
    "Market equilibrium",
    "Elasticity",
    "Production and costs",
    "Market structures",
    "Macroeconomic objectives"
  ],
  "ECO 102 — Microeconomics": [
    "Consumer behaviour and utility",
    "Indifference curves",
    "Theory of production",
    "Costs of production",
    "Perfect competition",
    "Monopoly and price discrimination",
    "Oligopoly and monopolistic competition",
    "Factor markets"
  ],
  "BUS 101 — Introduction to Business": [
    "Nature and purpose of business",
    "Forms of business ownership",
    "Entrepreneurship",
    "Business environment",
    "Management functions",
    "Marketing fundamentals",
    "Business finance",
    "Business ethics"
  ],
  "MGT 101 — Principles of Management": [
    "Evolution of management thought",
    "Planning and decision making",
    "Organising and delegation",
    "Leadership styles",
    "Motivation theories",
    "Communication in organisations",
    "Control and performance",
    "Organisational culture"
  ],
  "MAC 101 — Introduction to Mass Communication": [
    "Meaning and scope of mass communication",
    "Communication models",
    "Print media",
    "Broadcast media",
    "Digital and social media",
    "News values and journalism",
    "Media ethics and law",
    "Audience and media effects"
  ],
  "ENG 101 — Use of English": [
    "Grammar and sentence structure",
    "Parts of speech",
    "Concord and common errors",
    "Vocabulary development",
    "Comprehension",
    "Summary writing",
    "Academic writing and referencing",
    "Oral communication"
  ],
  "LIT 101 — Introduction to Literature": [
    "Definitions and functions of literature",
    "Literary genres",
    "Elements of prose",
    "Poetry and poetic devices",
    "Drama and stage conventions",
    "Literary themes",
    "Critical reading and interpretation"
  ],
  "LIN 101 — Introduction to Linguistics": [
    "Nature and scope of linguistics",
    "Phonetics",
    "Phonology",
    "Morphology",
    "Syntax",
    "Semantics and pragmatics",
    "Sociolinguistics"
  ],
  "HIS 101 — Introduction to History": [
    "Meaning and sources of history",
    "Historical methods",
    "Pre-colonial African societies",
    "Early states and empires",
    "Trade and cultural exchange",
    "Colonialism and resistance",
    "Historical interpretation"
  ],
  "POL 101 — Introduction to Political Science": [
    "Meaning and scope of political science",
    "State, nation and sovereignty",
    "Power, authority and legitimacy",
    "Political culture and socialisation",
    "Political ideologies",
    "Political systems",
    "Comparative politics"
  ],
  "LAW 101 — Legal Methods": [
    "Nature and sources of law",
    "Legal systems and traditions",
    "Legislation and case law",
    "Court structure and jurisdiction",
    "Legal reasoning and precedent",
    "Legal research and citation",
    "Reading and interpreting statutes"
  ],
  "LAW 102 — Nigerian Legal System": [
    "Historical development of Nigerian law",
    "Sources of Nigerian law",
    "The Nigerian court system",
    "Jurisdiction of courts",
    "Legal profession in Nigeria",
    "Customary and Islamic law",
    "Constitutional framework"
  ],
  "ANA 101 — Human Anatomy": [
    "Introduction to human anatomy",
    "Anatomical terms and body organisation",
    "Cells and tissues",
    "Skeletal system",
    "Muscular system",
    "Cardiovascular system",
    "Respiratory system",
    "Digestive system",
    "Nervous system"
  ],
  "PHY 101 — General Physics": [
    "Physical quantities and measurement",
    "Vectors and scalars",
    "Motion and kinematics",
    "Newton's laws",
    "Work, energy and power",
    "Momentum and collisions",
    "Waves and oscillations",
    "Heat and thermodynamics"
  ],
  "NUR 101 — Foundations of Nursing": [
    "History and philosophy of nursing",
    "Roles and responsibilities of nurses",
    "Nursing ethics and professional conduct",
    "Communication and therapeutic relationships",
    "Patient safety and infection prevention",
    "Vital signs",
    "Basic nursing process",
    "Documentation and record keeping"
  ],
  "PHE 101 — Introduction to Public Health": [
    "Meaning and scope of public health",
    "Determinants of health",
    "Health promotion and prevention",
    "Epidemiology fundamentals",
    "Disease surveillance",
    "Environmental health",
    "Primary health care",
    "Community health assessment"
  ]
};
