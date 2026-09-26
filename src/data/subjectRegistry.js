// src/data/subjectRegistry.js
// Centralized, Age-Based Subject & Curriculum Mapping for LearnFlux AI
// Covers Age 1–15 (Core), Age 15–18 (Advanced/Applied), and Age 18+ (Adult/Professional)
// with classroom-aligned sub-tiers (1–5 early, 6–10 primary, 11–15 middle/high).

import {
  BookOpen,
  Microscope,
  Calculator,
  Globe2,
  Code,
  Terminal,
  Cpu,
  Atom,
  FlaskConical,
  BrainCircuit,
  Database,
  TrendingUp,
  Award,
  Briefcase,
  Layers,
  Sparkles,
  FileText,
} from "lucide-react";

export const AGE_OPTIONS = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "18+",
];

/**
 * Determine the age band and sub-tier for a given age string or number
 */
export function getAgeBandInfo(ageInput) {
  const ageStr = String(ageInput || "16").trim();
  if (ageStr === "18+") {
    return {
      band: "adult",
      bandLabel: "Adult & Professional",
      subTier: "professional",
      tierLabel: "Professional / Industry Specialization",
      minAge: 18,
      maxAge: 99,
    };
  }

  const num = parseInt(ageStr, 10);
  if (isNaN(num) || num > 18) {
    return {
      band: "adult",
      bandLabel: "Adult & Professional",
      subTier: "professional",
      tierLabel: "Professional / Industry Specialization",
      minAge: 18,
      maxAge: 99,
    };
  }

  if (num >= 15 && num <= 18) {
    return {
      band: "advanced",
      bandLabel: "Age 15–18 • Advanced / Applied",
      subTier: "college_prep",
      tierLabel: "College & Competitive Exam Preparation",
      minAge: 15,
      maxAge: 18,
    };
  }

  // Age 1–15 Core Band
  if (num <= 5) {
    return {
      band: "core",
      bandLabel: "Age 1–15 • Core Subjects",
      subTier: "early",
      tierLabel: "Early Learners (Ages 1–5)",
      minAge: 1,
      maxAge: 5,
    };
  } else if (num <= 10) {
    return {
      band: "core",
      bandLabel: "Age 1–15 • Core Subjects",
      subTier: "primary",
      tierLabel: "Primary School (Ages 6–10)",
      minAge: 6,
      maxAge: 10,
    };
  } else {
    return {
      band: "core",
      bandLabel: "Age 1–15 • Core Subjects",
      subTier: "middle_high",
      tierLabel: "Middle & High School (Ages 11–15)",
      minAge: 11,
      maxAge: 15,
    };
  }
}

/**
 * Age 1–15 Core Subjects dictionary by sub-tier
 */
const coreSubjectsBySubTier = {
  // SUB-TIER 1: Ages 1–5 (Early Learners)
  early: [
    {
      id: "core-english",
      name: "English",
      category: "Core Language",
      icon: BookOpen,
      color: "#ec4899",
      gradeRange: "Ages 1–5 • Early Learners",
      desc: "Phonics sounds, alphabet recognition (A–Z), picture sight words, and rhyming songs.",
      topics: ["Alphabet Tracing & Sounds", "Sight Words & Flashcards", "Rhyme & Story Listening", "Simple Sentence Building"],
      diagnosticQuestion: {
        category: "Letter Sounds",
        q: "Which letter makes the beginning sound for the word 'Apple'?",
        options: ["Letter B", "Letter A", "Letter D", "Letter M"],
        correct: 1,
        explanation: "The word 'Apple' starts with the short 'A' vowel sound (/æ/).",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "What color is the sun typically represented as in picture stories?",
          options: ["Blue", "Yellow", "Purple", "Green"],
          correct: 1,
          explanation: "In picture books and nature, the sun is represented by yellow or bright gold.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "Which pair of words rhymes?",
          options: ["Cat and Hat", "Dog and Tree", "Sun and Book", "Fish and Car"],
          correct: 0,
          explanation: "'Cat' and 'Hat' share the exact same ending sound (-at), making them rhyming words.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "Which of the following is an uppercase capital letter?",
          options: ["b", "m", "G", "p"],
          correct: 2,
          explanation: "'G' is an uppercase letter; 'b', 'm', and 'p' are lowercase.",
        },
      ],
      pathNodes: [
        { id: 1, name: "Phonics & Vowel Sounds", status: "done", score: "96% Mastery", desc: "Recognizing short vowel phonics /a/, /e/, /i/, /o/, /u/.", duration: "20 min" },
        { id: 2, name: "Sight Words (Cat, Dog, Sun, Run)", status: "done", score: "90% Mastery", desc: "Recognizing high-frequency early reader sight vocabulary.", duration: "25 min" },
        { id: 3, name: "Rhyming Pairs & Story Time", status: "current", score: "55% • Active Focus", desc: "Identifying phonetic rhymes and sequencing story scenes.", duration: "25 min", highlight: true },
        { id: 4, name: "Alphabet Book Writing", status: "locked", score: "Unlocks Next", desc: "Tracing uppercase and lowercase letters with motor guidance.", duration: "30 min" },
      ],
    },
    {
      id: "core-science",
      name: "Science",
      category: "Natural World",
      icon: Microscope,
      color: "#10b981",
      gradeRange: "Ages 1–5 • Early Learners",
      desc: "Five senses, living animals, weather patterns (sun, rain, snow), and plant seedlings.",
      topics: ["The 5 Senses", "Animals & Their Babies", "Weather & Seasons", "Things That Float vs Sink"],
      diagnosticQuestion: {
        category: "Five Senses",
        q: "Which human sense organ do we use to listen to birds singing?",
        options: ["Eyes", "Ears", "Nose", "Tongue"],
        correct: 1,
        explanation: "Our ears are our sensory organs for hearing sounds and music in our environment.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "What do green plants need every day to grow healthy and strong?",
          options: ["Ice cream and juice", "Sunlight and water", "Rocks and darkness", "Paper and pens"],
          correct: 1,
          explanation: "Plants require sunlight, water, and soil nutrients to photosynthesize and grow.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "Which of these animals lives and breathes underwater?",
          options: ["Golden Fish", "Brown Bear", "Sparrow", "Rabbit"],
          correct: 0,
          explanation: "Fish have gills that allow them to extract dissolved oxygen directly from water.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "What falls from clouds when the winter air becomes very freezing cold?",
          options: ["Rain drops", "Snowflakes", "Warm breeze", "Dry sand"],
          correct: 1,
          explanation: "When water vapor freezes in cold atmospheric clouds, it forms crystalline snowflakes.",
        },
      ],
      pathNodes: [
        { id: 1, name: "Our Five Wonder Senses", status: "done", score: "95% Mastery", desc: "Seeing, hearing, smelling, tasting, and touching.", duration: "20 min" },
        { id: 2, name: "Animals, Birds & Ocean Friends", status: "done", score: "92% Mastery", desc: "Animal habitats, sounds, and baby animal names.", duration: "20 min" },
        { id: 3, name: "Sun, Clouds & Rain Weather", status: "current", score: "48% • Active Focus", desc: "Seasonal changes, rain cycles, and dressing for weather.", duration: "25 min", highlight: true },
        { id: 4, name: "Planting a Seed Garden", status: "locked", score: "Unlocks Next", desc: "Observing stem growth, leaf development, and sunlight.", duration: "30 min" },
      ],
    },
    {
      id: "core-maths",
      name: "Maths",
      category: "Foundational Numbers",
      icon: Calculator,
      color: "#38bdf8",
      gradeRange: "Ages 1–5 • Early Learners",
      desc: "Counting objects 1–20, identifying shapes (circle, square, triangle), and big vs small sizes.",
      topics: ["Number Counting 1–20", "Circle, Square, Triangle", "Sorting by Color & Size", "Simple Picture Addition"],
      diagnosticQuestion: {
        category: "Counting",
        q: "If you have 2 red apples and your friend gives you 1 more, how many apples do you have?",
        options: ["1 Apple", "2 Apples", "3 Apples", "5 Apples"],
        correct: 2,
        explanation: "Counting forward: 2 + 1 = 3 apples.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "How many corners does a round circle have?",
          options: ["0 corners", "3 corners", "4 corners", "8 corners"],
          correct: 0,
          explanation: "A circle is a continuous round curve and has 0 sharp corners.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "What number comes immediately after number 7 when counting up?",
          options: ["6", "8", "9", "5"],
          correct: 1,
          explanation: "Counting in sequence: 5, 6, 7, 8.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "Which object is the biggest in real life?",
          options: ["A little toy car", "A giant yellow school bus", "An apple", "A pencil"],
          correct: 1,
          explanation: "A full-sized school bus is vastly larger in dimensions and weight.",
        },
      ],
      pathNodes: [
        { id: 1, name: "Counting Fingers & Toys (1–10)", status: "done", score: "98% Mastery", desc: "One-to-one counting correspondence and quantity match.", duration: "20 min" },
        { id: 2, name: "Shapes: Circle, Square, Triangle", status: "done", score: "89% Mastery", desc: "Identifying geometric shapes in daily objects.", duration: "25 min" },
        { id: 3, name: "Counting Up to 20 & Comparisons", status: "current", score: "52% • Active Focus", desc: "More than, less than, and ordering numbers 1 to 20.", duration: "30 min", highlight: true },
        { id: 4, name: "Picture Addition & Subtraction", status: "locked", score: "Unlocks Next", desc: "Visual combining and taking away with colorful counters.", duration: "30 min" },
      ],
    },
    {
      id: "core-geography",
      name: "Geography",
      category: "World Exploration",
      icon: Globe2,
      color: "#f59e0b",
      gradeRange: "Ages 1–5 • Early Learners",
      desc: "My neighborhood, drawing basic maps, land vs ocean water, and mountain pictures.",
      topics: ["My Home & School Neighborhood", "Land, Mountains & Blue Oceans", "Up, Down, Left, Right", "Day and Night Sky"],
      diagnosticQuestion: {
        category: "Land & Water",
        q: "On a globe of planet Earth, what color represents the deep oceans and seas?",
        options: ["Green", "Blue", "Brown", "Red"],
        correct: 1,
        explanation: "Blue represents water bodies (oceans, lakes, and rivers) which cover over 70% of Earth.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "Where do we look up to see the bright stars and moon at bedtime?",
          options: ["In the night sky", "Under the ocean", "Under the kitchen table", "Inside a drawer"],
          correct: 0,
          explanation: "The stars and moon illuminate the night sky when our side of Earth faces away from the sun.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "Which geographical feature is very tall and has snowy peaks touching the clouds?",
          options: ["A mountain", "A flat sandbox", "A swimming pool", "A street sidewalk"],
          correct: 0,
          explanation: "Mountains are elevated landforms with steep sides and high peaks.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "A simple drawing that shows how to find rooms or streets is called a:",
          options: ["Map", "Story poem", "Song", "Fork"],
          correct: 0,
          explanation: "A map is a visual diagram of an area showing paths, rooms, landmarks, or streets.",
        },
      ],
      pathNodes: [
        { id: 1, name: "My Room, House & School Map", status: "done", score: "94% Mastery", desc: "Understanding spatial layouts and bird's eye view.", duration: "20 min" },
        { id: 2, name: "Earth: Blue Water & Green Land", status: "done", score: "91% Mastery", desc: "Distinguishing continents from ocean water bodies.", duration: "25 min" },
        { id: 3, name: "Sun Directions & Day/Night", status: "current", score: "50% • Active Focus", desc: "How the sun rises and sets to create day and night.", duration: "25 min", highlight: true },
        { id: 4, name: "Exploring Animals Across Continents", status: "locked", score: "Unlocks Next", desc: "Where penguins, lions, and pandas live around the globe.", duration: "30 min" },
      ],
    },
  ],

  // SUB-TIER 2: Ages 6–10 (Primary School)
  primary: [
    {
      id: "core-english",
      name: "English",
      category: "Language & Literature",
      icon: BookOpen,
      color: "#ec4899",
      gradeRange: "Ages 6–10 • Primary School",
      desc: "Reading comprehension passages, grammar (nouns, verbs, adjectives), punctuation, and creative story writing.",
      topics: ["Parts of Speech (Nouns, Verbs, Adjectives)", "Punctuation & Capitalization", "Reading Comprehension & Inferences", "Paragraph Writing & Story Structure"],
      diagnosticQuestion: {
        category: "Parts of Speech",
        q: "In the sentence 'The energetic puppy chased the red ball', which word is an adjective describing the ball?",
        options: ["Energetic", "Chased", "Red", "Puppy"],
        correct: 2,
        explanation: "'Red' is the descriptive adjective that directly modifies and describes the noun 'ball'.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "Which word is an action verb in the sentence: 'Sarah quickly reads her favorite mystery book'?",
          options: ["Sarah", "Quickly", "Reads", "Book"],
          correct: 2,
          explanation: "'Reads' describes the physical/mental action being performed by the subject.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "Choose the sentence that uses correct apostrophe punctuation for plural possession:",
          options: [
            "The boys' basketball team won the championship trophy.",
            "The boy's basketball team won the championship trophy.",
            "The boys basketball team won the championship trophy.",
            "The boyes basketball team won the championship trophy.",
          ],
          correct: 0,
          explanation: "For a regular plural noun ending in 's' ('boys'), the apostrophe is placed after the 's' ('boys'').",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "What literary device is used in the phrase: 'The thunder roared like an angry lion'?",
          options: ["Simile", "Metaphor", "Alliteration", "Hyperbole"],
          correct: 0,
          explanation: "A simile compares two distinct things using connecting words 'like' or 'as'.",
        },
      ],
      pathNodes: [
        { id: 1, name: "Nouns, Pronouns & Verbs", status: "done", score: "93% Mastery", desc: "Subject-verb agreement and identifying core grammatical elements.", duration: "35 min" },
        { id: 2, name: "Adjectives, Adverbs & Conjunctions", status: "done", score: "88% Mastery", desc: "Expanding descriptive vocabulary and connecting compound clauses.", duration: "40 min" },
        { id: 3, name: "Reading Comprehension & Inferences", status: "current", score: "54% • Active Focus", desc: "Finding main idea, supporting details, and author's purpose.", duration: "45 min", highlight: true },
        { id: 4, name: "Creative Narrative & Paragraph Writing", status: "locked", score: "Unlocks Next", desc: "Topic sentences, chronological transitions, and concluding thoughts.", duration: "50 min" },
      ],
    },
    {
      id: "core-science",
      name: "Science",
      category: "General Science",
      icon: Microscope,
      color: "#10b981",
      gradeRange: "Ages 6–10 • Primary School",
      desc: "Plant photosynthesis & parts, animal adaptations & life cycles, states of matter, and our Solar System.",
      topics: ["Plant Anatomy & Photosynthesis", "Food Chains & Animal Habitats", "States of Matter (Solids, Liquids, Gases)", "Earth, Moon Phases & The Solar System"],
      diagnosticQuestion: {
        category: "Plant Biology",
        q: "What green pigment in plant leaves absorbs sunlight to carry out photosynthesis?",
        options: ["Hemoglobin", "Chlorophyll", "Melanin", "Carotene"],
        correct: 1,
        explanation: "Chlorophyll is the green pigment in chloroplasts that absorbs light energy to convert CO₂ and water into glucose.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "Water turning into water vapor steam when heated on a stove is an example of:",
          options: ["Freezing", "Evaporation", "Condensation", "Sublimation"],
          correct: 1,
          explanation: "Evaporation is the transition of a liquid into gaseous vapor upon gaining thermal heat energy.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "In a forest food chain consisting of: Grass → Grasshopper → Frog → Snake, which organism is the primary consumer?",
          options: ["Grass", "Grasshopper", "Frog", "Snake"],
          correct: 1,
          explanation: "Grass is the primary producer; the herbivorous Grasshopper that eats it is the primary consumer.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "Why does the Moon appear to change shape throughout the month when viewed from Earth?",
          options: [
            "The Moon physically shrinks and expands in space",
            "Earth's shadow covers the Moon every single night",
            "We see varying illuminated portions of the Moon as it orbits Earth",
            "Clouds consistently block different halves of the Moon",
          ],
          correct: 2,
          explanation: "Moon phases occur because the Moon orbits Earth, changing the fraction of its sunlit side visible to us.",
        },
      ],
      pathNodes: [
        { id: 1, name: "Plant Systems & Photosynthesis", status: "done", score: "92% Mastery", desc: "Roots, xylem/phloem, leaves, sunlight, and oxygen release.", duration: "40 min" },
        { id: 2, name: "Ecosystems, Habitats & Food Webs", status: "done", score: "87% Mastery", desc: "Producers, primary/secondary consumers, and decomposers.", duration: "45 min" },
        { id: 3, name: "States of Matter & Phase Transitions", status: "current", score: "51% • Active Focus", desc: "Particle arrangement in solids, liquids, and gases during temperature shifts.", duration: "45 min", highlight: true },
        { id: 4, name: "Solar System & Planetary Orbits", status: "locked", score: "Unlocks Next", desc: "The eight planets, asteroid belt, lunar cycles, and gravity.", duration: "50 min" },
      ],
    },
    {
      id: "core-maths",
      name: "Maths",
      category: "Primary Mathematics",
      icon: Calculator,
      color: "#38bdf8",
      gradeRange: "Ages 6–10 • Primary School",
      desc: "Multi-digit arithmetic, multiplication tables (2–12), long division, basic fractions, and perimeter/area.",
      topics: ["Multi-Digit Addition & Subtraction", "Multiplication & Division Operations", "Fractions (Halves, Thirds, Quarters)", "Geometry: 2D/3D Shapes, Perimeter & Area"],
      diagnosticQuestion: {
        category: "Fractions",
        q: "Which fraction is equivalent to 2/4 in its simplest reduced form?",
        options: ["1/3", "1/2", "3/4", "2/3"],
        correct: 1,
        explanation: "Dividing both numerator and denominator by 2 gives: 2 ÷ 2 / 4 ÷ 2 = 1/2.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "What is the product of multiplying 8 by 7?",
          options: ["54", "56", "64", "48"],
          correct: 1,
          explanation: "Using times tables: 8 × 7 = 56.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "A rectangular garden has a length of 8 meters and a width of 5 meters. What is its perimeter?",
          options: ["40 meters", "26 meters", "13 meters", "32 meters"],
          correct: 1,
          explanation: "Perimeter formula: P = 2 × (Length + Width) = 2 × (8 + 5) = 2 × 13 = 26 meters.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "If 144 candies are distributed equally into 12 gift bags, how many candies go into each bag?",
          options: ["10", "11", "12", "14"],
          correct: 2,
          explanation: "144 ÷ 12 = 12 candies per gift bag.",
        },
      ],
      pathNodes: [
        { id: 1, name: "Column Addition & Subtraction with Regrouping", status: "done", score: "96% Mastery", desc: "Place values (ones, tens, hundreds, thousands) and borrowing.", duration: "35 min" },
        { id: 2, name: "Multiplication Tables & Word Problems", status: "done", score: "90% Mastery", desc: "Mental math strategies, arrays, and times tables up to 12.", duration: "40 min" },
        { id: 3, name: "Fractions, Decimals & Equivalence", status: "current", score: "49% • Active Focus", desc: "Visual fraction bars, comparing numerators/denominators, and decimals.", duration: "45 min", highlight: true },
        { id: 4, name: "Measurement, Perimeter & Area", status: "locked", score: "Unlocks Next", desc: "Calculating metric units, perimeter of polygons, and grid area.", duration: "50 min" },
      ],
    },
    {
      id: "core-geography",
      name: "Geography",
      category: "World Geography",
      icon: Globe2,
      color: "#f59e0b",
      gradeRange: "Ages 6–10 • Primary School",
      desc: "World continents, oceans, latitude/longitude, global climate zones, and landforms.",
      topics: ["The 7 Continents & 5 Oceans", "Equator, Poles & Climate Zones", "Mountains, Rivers, Deserts & Valleys", "Compass Rose & Map Coordinates"],
      diagnosticQuestion: {
        category: "Continents",
        q: "Which continent is both the largest in total land area and the most populated on Earth?",
        options: ["Africa", "Asia", "North America", "Europe"],
        correct: 1,
        explanation: "Asia is Earth's largest continent by both land area (44.58 million km²) and human population.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "What imaginary line divides the Earth into the Northern and Southern Hemispheres?",
          options: ["Prime Meridian", "The Equator", "Tropic of Cancer", "International Date Line"],
          correct: 1,
          explanation: "The Equator is the zero-degree latitude line encircling the midpoint of Earth.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "Which of the following is considered the longest river system on the African continent?",
          options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
          correct: 1,
          explanation: "The Nile River in northeastern Africa is approximately 6,650 km long.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "Regions near the Earth's poles experience very cold temperatures year-round primarily because:",
          options: [
            "They are physically further away from the Sun than the equator",
            "Sunlight strikes the poles at a sharp, shallow angle over a wider surface area",
            "The poles have no oceans or water bodies to store heat",
            "Volcanoes do not exist at the polar caps",
          ],
          correct: 1,
          explanation: "Due to Earth's curvature, polar solar rays hit at low angles, dispersing solar energy over larger surface areas.",
        },
      ],
      pathNodes: [
        { id: 1, name: "The Seven Continents & Five Oceans", status: "done", score: "95% Mastery", desc: "Locating Asia, Africa, Europe, Americas, Australia, Antarctica.", duration: "35 min" },
        { id: 2, name: "Latitude, Longitude & Hemispheres", status: "done", score: "89% Mastery", desc: "Equator, Prime Meridian, coordinates, and hemispheres.", duration: "40 min" },
        { id: 3, name: "Climate Zones & Rainforest/Desert Biomes", status: "current", score: "53% • Active Focus", desc: "Tropical, temperate, and polar climate characteristics.", duration: "45 min", highlight: true },
        { id: 4, name: "Major Mountain Ranges & Rivers", status: "locked", score: "Unlocks Next", desc: "Himalayas, Andes, Rockies, Amazon, Nile, and Danube.", duration: "50 min" },
      ],
    },
  ],

  // SUB-TIER 3: Ages 11–15 (Middle & Early High School)
  middle_high: [
    {
      id: "core-english",
      name: "English",
      category: "Literature & Language Arts",
      icon: BookOpen,
      color: "#ec4899",
      gradeRange: "Ages 11–15 • Middle/High School",
      desc: "Literary analysis, thesis statements, rhetorical devices, argumentative essays, and vocabulary synthesis.",
      topics: ["Rhetorical Devices (Ethos, Pathos, Logos)", "Thesis Development & Textual Evidence", "Complex Sentence Syntax & Voice", "Poetry Analysis & Metaphor Interpretation"],
      diagnosticQuestion: {
        category: "Rhetorical Analysis",
        q: "An appeal in persuasive speech that relies on factual statistics, rational evidence, and empirical logic is known as:",
        options: ["Pathos", "Ethos", "Logos", "Kairos"],
        correct: 2,
        explanation: "Logos appeals to reason, deductive/inductive logic, and empirical evidence.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "Which sentence correctly demonstrates active voice?",
          options: [
            "The scientific experiment was completed by the students.",
            "The students completed the scientific experiment.",
            "A conclusion was reached after the experiment.",
            "The results were analyzed by the teacher.",
          ],
          correct: 1,
          explanation: "In active voice, the subject ('The students') performs the action ('completed') directly upon the object ('experiment').",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "In literary analysis, when an author drops subtle clues suggesting events that will happen later in the plot, this is called:",
          options: ["Irony", "Foreshadowing", "Allegory", "Flashback"],
          correct: 1,
          explanation: "Foreshadowing provides narrative hints or warnings about forthcoming dramatic developments.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "What differentiates dramatic irony from situational irony?",
          options: [
            "In dramatic irony, the audience knows critical information that the characters do not.",
            "In dramatic irony, words literally mean the exact opposite of what is spoken.",
            "Dramatic irony only occurs in poetic sonnets.",
            "Situational irony involves mythological gods intervening directly.",
          ],
          correct: 0,
          explanation: "Dramatic irony arises when readers/viewers possess crucial knowledge withheld from theatrical or story characters.",
        },
      ],
      pathNodes: [
        { id: 1, name: "Thesis Statements & Evidence Citation", status: "done", score: "94% Mastery", desc: "Constructing defensible claims supported by direct quotes.", duration: "45 min" },
        { id: 2, name: "Active Voice, Complex Clauses & Syntax", status: "done", score: "86% Mastery", desc: "Eliminating passive drift, misplaced modifiers, and comma splices.", duration: "50 min" },
        { id: 3, name: "Rhetorical Devices & Persuasive Techniques", status: "current", score: "52% • Active Focus", desc: "Analyzing ethos, pathos, logos, antithesis, and anaphora.", duration: "50 min", highlight: true },
        { id: 4, name: "Comparative Essay Synthesis", status: "locked", score: "Unlocks Next", desc: "Evaluating conflicting thematic perspectives across literature.", duration: "60 min" },
      ],
    },
    {
      id: "core-science",
      name: "Science",
      category: "Integrated Sciences",
      icon: Microscope,
      color: "#10b981",
      gradeRange: "Ages 11–15 • Middle/High School",
      desc: "Cell organelles, Mendelian genetics, Newtonian mechanics (F=ma), periodic trends, and chemical reactions.",
      topics: ["Cell Biology & Genetic Inheritance", "Newton's Laws of Motion & Energy", "Periodic Table Trends & Chemical Bonding", "Ecological Cycles & Climate Dynamics"],
      diagnosticQuestion: {
        category: "Cellular Biology",
        q: "Which organelle houses cellular genetic material (DNA) and directs gene transcription in eukaryotic cells?",
        options: ["Ribosome", "Nucleus", "Vacuole", "Golgi Body"],
        correct: 1,
        explanation: "The nucleus is the membrane-bound organelle containing genomic DNA and regulating transcription.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "According to Newton's Second Law, if you double the net force applied to a constant mass, its acceleration:",
          options: ["Halves", "Remains constant", "Doubles", "Quadruples"],
          correct: 2,
          explanation: "By F = m·a, acceleration is directly proportional to net force: a = F / m.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "When an atom transfers valence electrons completely to another atom forming positive and negative ions, what bond results?",
          options: ["Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"],
          correct: 1,
          explanation: "Ionic bonds form through electrostatic attraction between positively and negatively charged ions created by electron transfer.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "What cellular process converts glucose into pyruvate, generating 2 ATP molecules in the cytoplasm without requiring oxygen?",
          options: ["Krebs Citric Acid Cycle", "Electron Transport Chain", "Glycolysis", "Calvin Cycle"],
          correct: 2,
          explanation: "Glycolysis is the anaerobic breakdown of 6-carbon glucose into two 3-carbon pyruvates in the cytosol.",
        },
      ],
      pathNodes: [
        { id: 1, name: "Cell Structure, Mitosis & Organelles", status: "done", score: "91% Mastery", desc: "Prokaryotic vs eukaryotic cells, cell cycle phases, and organelles.", duration: "45 min" },
        { id: 2, name: "Forces, Inertia & Newton's Laws (F=ma)", status: "done", score: "88% Mastery", desc: "Kinematics, vector addition, normal force, and friction.", duration: "50 min" },
        { id: 3, name: "Atoms, Periodic Trends & Ionic/Covalent Bonds", status: "current", score: "48% • Active Focus", desc: "Atomic number, valence octets, Lewis structures, and electronegativity.", duration: "50 min", highlight: true },
        { id: 4, name: "Mendelian Genetics & Punnett Squares", status: "locked", score: "Unlocks Next", desc: "Dominant/recessive alleles, monohybrid crosses, and pedigree charts.", duration: "55 min" },
      ],
    },
    {
      id: "core-maths",
      name: "Maths",
      category: "Algebra & Pre-Calculus",
      icon: Calculator,
      color: "#38bdf8",
      gradeRange: "Ages 11–15 • Middle/High School",
      desc: "Algebraic equations, linear systems, coordinate geometry, Pythagorean theorem, and quadratic factoring.",
      topics: ["Linear Equations & Systems", "Slope-Intercept Form (y = mx + b)", "Pythagorean Theorem & Right Triangles", "Quadratic Equations & Polynomial Factoring"],
      diagnosticQuestion: {
        category: "Algebra",
        q: "If 4x - 12 = 20, what is the value of x?",
        options: ["x = 6", "x = 8", "x = 10", "x = 4"],
        correct: 1,
        explanation: "Add 12 to both sides: 4x = 32. Divide by 4: x = 8.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "What is the slope (m) of a line passing through coordinates (1, 2) and (5, 10)?",
          options: ["m = 1", "m = 2", "m = 4", "m = 8"],
          correct: 1,
          explanation: "Slope formula m = (y2 - y1) / (x2 - x1) = (10 - 2) / (5 - 1) = 8 / 4 = 2.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "In a right triangle with legs of length 6 cm and 8 cm, what is the length of the hypotenuse?",
          options: ["10 cm", "14 cm", "12 cm", "48 cm"],
          correct: 0,
          explanation: "Pythagorean theorem: a² + b² = c² ⇒ 6² + 8² = 36 + 64 = 100 ⇒ c = √100 = 10 cm.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "What are the real roots of the quadratic equation x² - 5x + 6 = 0?",
          options: ["x = 1 and x = 6", "x = 2 and x = 3", "x = -2 and x = -3", "x = 0 and x = 5"],
          correct: 1,
          explanation: "Factoring the trinomial: (x - 2)(x - 3) = 0 ⇒ x = 2 and x = 3.",
        },
      ],
      pathNodes: [
        { id: 1, name: "Multi-Step Linear Equations & Inequalities", status: "done", score: "95% Mastery", desc: "Isolating variables, distributing negatives, and graphing bounds.", duration: "45 min" },
        { id: 2, name: "Coordinate Geometry: Slope & Line Graphs", status: "done", score: "89% Mastery", desc: "y = mx + b, point-slope, parallel vs perpendicular lines.", duration: "50 min" },
        { id: 3, name: "Quadratic Equations & Trinomial Factoring", status: "current", score: "53% • Active Focus", desc: "Factoring, completing the square, and quadratic formula.", duration: "55 min", highlight: true },
        { id: 4, name: "Systems of Equations & Matrices", status: "locked", score: "Unlocks Next", desc: "Solving 2-variable systems via substitution and elimination.", duration: "60 min" },
      ],
    },
    {
      id: "core-geography",
      name: "Geography",
      category: "Physical & Human Geography",
      icon: Globe2,
      color: "#f59e0b",
      gradeRange: "Ages 11–15 • Middle/High School",
      desc: "Plate tectonics, earthquakes, atmospheric circulation, demographic migration, and geopolitical borders.",
      topics: ["Plate Tectonics & Seismic Faults", "Atmospheric Pressure & Weather Systems", "Global Urbanization & Demographics", "Geopolitics, Trade Routes & Resources"],
      diagnosticQuestion: {
        category: "Physical Geography",
        q: "What geologic process occurs when two tectonic plates slide past one another horizontally along a strike-slip fault?",
        options: ["Seafloor spreading", "Transform fault earthquakes", "Subduction trench formation", "Glacial moraine deposition"],
        correct: 1,
        explanation: "Transform plate boundaries (like the San Andreas Fault) grind past each other, releasing seismic energy as earthquakes.",
      },
      adaptiveQuestions: [
        {
          level: "FOUNDATION",
          tier: 1,
          q: "The ozone layer, which absorbs harmful ultraviolet (UV) radiation, is located in which atmospheric layer?",
          options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
          correct: 1,
          explanation: "The ozone layer resides in the stratosphere between roughly 15 to 35 km altitude.",
        },
        {
          level: "INTERMEDIATE",
          tier: 2,
          q: "The demographic transition model explains how human populations change as countries develop from:",
          options: [
            "Low birth/death rates to high birth/death rates",
            "High birth/death rates to low birth/death rates",
            "Urban agriculture to nomadic hunting",
            "Democratic regimes to authoritarian regimes",
          ],
          correct: 1,
          explanation: "Demographic transition tracks industrial transition from high birth and death rates to low birth and death rates.",
        },
        {
          level: "ADVANCED",
          tier: 3,
          q: "Why do prevailing trade winds blow primarily from east to west in the tropical latitudes?",
          options: [
            "The gravitational pull of the Moon's tidal waves",
            "The Coriolis effect deflecting wind flow due to Earth's counterclockwise rotation",
            "Ocean thermal currents dragging air molecules westward",
            "Mountain barriers forcing atmospheric deflection",
          ],
          correct: 1,
          explanation: "The Coriolis effect deflects equatorward atmospheric winds toward the west, generating the tropical easterlies (trade winds).",
        },
      ],
      pathNodes: [
        { id: 1, name: "Plate Tectonics & Continental Drift", status: "done", score: "93% Mastery", desc: "Convergent, divergent, and transform boundaries, volcanoes, and earthquakes.", duration: "45 min" },
        { id: 2, name: "Atmospheric Layers, Winds & Weather", status: "done", score: "87% Mastery", desc: "Troposphere convection, Coriolis deflection, cyclones, and jet streams.", duration: "50 min" },
        { id: 3, name: "Demographics, Migration & Urban Settlement", status: "current", score: "55% • Active Focus", desc: "Population pyramids, urbanization rates, and demographic transition.", duration: "50 min", highlight: true },
        { id: 4, name: "Geopolitics & Natural Resource Economics", status: "locked", score: "Unlocks Next", desc: "Global energy corridors, water security, and trade shipping lanes.", duration: "55 min" },
      ],
    },
  ],
};

/**
 * Age 15–18 Advanced / Applied Subjects (Exam & College Prep)
 */
const advancedSubjects = [
  {
    id: "adv-dsa",
    name: "DSA (Data Structures & Algorithms)",
    category: "Computer Science",
    icon: Code,
    color: "#c77dff",
    gradeRange: "Ages 15–18 • College & Exam Prep",
    desc: "Asymptotic Big-O analysis, dynamic arrays, binary search trees, recursion trees, and dynamic programming.",
    topics: ["Big-O, Omega & Theta Bounds", "Binary Search & Search Space", "Tree Traversals (BST, BFS, DFS)", "Dynamic Programming (Memoization vs Tabulation)"],
    diagnosticQuestion: {
      category: "Complexity Analysis",
      q: "What is the tightest asymptotic worst-case time complexity of searching in an unsorted array of n elements?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correct: 2,
      explanation: "Without sorted ordering, every element must potentially be inspected in worst case, requiring O(n) linear time.",
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: "If an algorithm scans every element of a list with size n exactly once in a single loop, what is its asymptotic time complexity?",
        options: ["O(1) Constant", "O(n) Linear", "O(log n) Logarithmic", "O(n²) Quadratic"],
        correct: 1,
        explanation: "A single loop visiting n elements executes n iterations, scaling linearly with input size n as O(n).",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: "In a balanced Binary Search Tree with n nodes, what is the worst-case time complexity of searching for an arbitrary key?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correct: 1,
        explanation: "A balanced BST has tree height ⌊log₂ n⌋. Each comparison halves the remaining subtree, yielding O(log n).",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: "Which recurrence relation describes Merge Sort, and what is its closed-form solution via the Master Theorem?",
        options: [
          "T(n) = 2T(n/2) + O(n) ⇒ O(n log n)",
          "T(n) = T(n-1) + O(1) ⇒ O(n)",
          "T(n) = 2T(n/2) + O(1) ⇒ O(n)",
          "T(n) = 4T(n/2) + O(n²) ⇒ O(n² log n)",
        ],
        correct: 0,
        explanation: "Merge Sort splits into 2 subproblems (2T(n/2)) and merges in O(n) time. Case 2 of Master Theorem gives O(n log n).",
      },
    ],
    pathNodes: [
      { id: 1, name: "Dynamic Arrays & Pointer Arithmetic", status: "done", score: "92% Mastery", desc: "Amortized resizing and contiguous memory caches.", duration: "45 min" },
      { id: 2, name: "Loop Invariants & Iterative Proofs", status: "done", score: "86% Mastery", desc: "Induction termination and nested loop analysis.", duration: "50 min" },
      { id: 3, name: "Asymptotic Notation: Time & Space Complexity", status: "current", score: "48% • Active Gap", desc: "Big-O upper bounds and recursion stack frame analysis.", duration: "50 min", highlight: true },
      { id: 4, name: "Binary Search & Tree Traversals", status: "locked", score: "Unlocks Next", desc: "Monotonic search spaces and binary search tree validations.", duration: "60 min" },
    ],
  },
  {
    id: "adv-prog",
    name: "Programming Fundamentals",
    category: "Software Engineering",
    icon: Terminal,
    color: "#22d3ee",
    gradeRange: "Ages 15–18 • College & Exam Prep",
    desc: "Syntax, memory management, pointers/references, functions, object-oriented paradigms, and modular design.",
    topics: ["Memory Allocation & Pointer Mechanics", "Object-Oriented Design (Polymorphism, Inheritance)", "Exception Handling & Unit Testing", "Data Serialization & File I/O"],
    diagnosticQuestion: {
      category: "Memory Management",
      q: "In systems programming, which memory region is used for dynamic variable allocations managed at runtime via malloc / new?",
      options: ["Call Stack", "Heap Memory", "Instruction Cache", "CPU Register"],
      correct: 1,
      explanation: "Heap memory provides dynamically allocated memory whose lifetime persists beyond stack frame execution.",
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: "Which object-oriented principle refers to hiding internal state and requiring all interaction through methods?",
        options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
        correct: 1,
        explanation: "Encapsulation bundles data and restrictive methods together to prevent direct unauthorized mutation.",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: "What error occurs when recursive function calls consume all allotted memory on the thread execution stack?",
        options: ["Segmentation Fault in Heap", "Stack Overflow", "Deadlock", "Memory Leak"],
        correct: 1,
        explanation: "Each recursive call pushes an activation frame onto the call stack. Unbounded recursion exhausts stack memory.",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: "In concurrency, what condition occurs when two or more threads are permanently blocked waiting for resources held by each other?",
        options: ["Race Condition", "Deadlock", "Livelock", "Starvation"],
        correct: 1,
        explanation: "Deadlock occurs under mutual exclusion, hold-and-wait, no preemption, and circular wait conditions.",
      },
    ],
    pathNodes: [
      { id: 1, name: "Types, Variables & Memory Layout", status: "done", score: "94% Mastery", desc: "Primitives, arrays, memory alignment, and scoping.", duration: "45 min" },
      { id: 2, name: "Functions, Scope & Call Stacks", status: "done", score: "89% Mastery", desc: "Pass-by-value vs pass-by-reference and activation frames.", duration: "50 min" },
      { id: 3, name: "Object-Oriented Modeling & Interfaces", status: "current", score: "54% • Active Focus", desc: "Classes, encapsulation, inheritance, and polymorphic dispatch.", duration: "55 min", highlight: true },
      { id: 4, name: "Concurrency & Asynchronous I/O", status: "locked", score: "Unlocks Next", desc: "Threads, mutex locks, and event loops.", duration: "60 min" },
    ],
  },
  {
    id: "adv-math",
    name: "Advanced Mathematics (Calculus, Statistics)",
    category: "Higher Mathematics",
    icon: Calculator,
    color: "#38bdf8",
    gradeRange: "Ages 15–18 • College & Exam Prep",
    desc: "Differential & integral calculus, limits, vectors, matrix algebra, probability distributions, and series expansions.",
    topics: ["Limits & L'Hôpital's Rule", "Derivatives & Chain Rule", "Definite & Indefinite Integrals", "Vectors, Matrices & Linear Systems"],
    diagnosticQuestion: {
      category: "Differential Calculus",
      q: "What is the derivative of f(x) = x³ · e^(2x) with respect to x using the Product and Chain Rules?",
      options: [
        "f'(x) = 3x² · e^(2x)",
        "f'(x) = e^(2x) · (3x² + 2x³)",
        "f'(x) = 2x³ · e^(2x)",
        "f'(x) = 6x² · e^(2x)",
      ],
      correct: 1,
      explanation: "Product Rule: (x³)' · e^(2x) + x³ · (e^(2x))' = 3x²·e^(2x) + 2x³·e^(2x) = e^(2x)(3x² + 2x³).",
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: "What is the limit of (sin x) / x as x approaches 0?",
        options: ["0", "1", "Undefined", "Infinity"],
        correct: 1,
        explanation: "By L'Hôpital's Rule or geometric unit circle limits, lim_{x→0} (sin x)/x = 1.",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: "Evaluate the definite integral: ∫ from 0 to 3 of (2x + 1) dx.",
        options: ["10", "12", "15", "18"],
        correct: 1,
        explanation: "The antiderivative is F(x) = x² + x. Evaluating F(3) - F(0) = (9 + 3) - 0 = 12.",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: "For a 2×2 matrix A = [[3, 2], [1, 4]], what is the determinant det(A)?",
        options: ["10", "14", "12", "8"],
        correct: 0,
        explanation: "det(A) = (3)(4) - (2)(1) = 12 - 2 = 10.",
      },
    ],
    pathNodes: [
      { id: 1, name: "Limits, Continuity & Asymptotes", status: "done", score: "93% Mastery", desc: "Epsilon-delta definitions, limit laws, and L'Hôpital's rule.", duration: "45 min" },
      { id: 2, name: "Derivatives, Optimization & Related Rates", status: "done", score: "88% Mastery", desc: "Chain rule, implicit differentiation, and curve sketching.", duration: "50 min" },
      { id: 3, name: "Integrals & Fundamental Theorem of Calculus", status: "current", score: "50% • Active Focus", desc: "U-substitution, integration by parts, and definite area.", duration: "55 min", highlight: true },
      { id: 4, name: "Matrices, Determinants & Vector Spaces", status: "locked", score: "Unlocks Next", desc: "Matrix transformations, dot/cross products, and eigenvalues.", duration: "60 min" },
    ],
  },
  {
    id: "adv-phys-chem",
    name: "Physics / Chemistry (Applied & Exam-Prep)",
    category: "Applied Physical Sciences",
    icon: Atom,
    color: "#f59e0b",
    gradeRange: "Ages 15–18 • College & Exam Prep",
    desc: "Kinematics, rotational torque, conservation laws, stoichiometry, thermodynamics, and chemical equilibria.",
    topics: ["Conservation of Mechanical Energy & Momentum", "Electric Fields & Circuit Laws", "Stoichiometry & Mole Calculations", "Thermodynamics & Le Chatelier Shifts"],
    diagnosticQuestion: {
      category: "Kinematics & Energy",
      q: "A 0.5 kg object is dropped from rest from a height of 20 m. Neglecting air resistance, what is its kinetic energy right before impact? (g = 9.8 m/s²)",
      options: ["49 J", "98 J", "196 J", "392 J"],
      correct: 1,
      explanation: "By conservation of mechanical energy: Final KE = Initial PE = m·g·h = 0.5 · 9.8 · 20 = 98 Joules.",
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: "What is the pH of a 0.01 M hydrochloric acid (HCl) solution, assuming 100% dissociation?",
        options: ["pH = 1", "pH = 2", "pH = 7", "pH = 12"],
        correct: 1,
        explanation: "HCl is strong acid: [H⁺] = 0.01 = 10⁻² M. pH = -log₁₀(10⁻²) = 2.",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: "In an inelastic collision between two moving billiard balls in a closed system, which physical quantity is strictly conserved?",
        options: ["Kinetic Energy only", "Linear Momentum only", "Both Kinetic Energy and Linear Momentum", "Mechanical Potential Energy"],
        correct: 1,
        explanation: "Total linear momentum is conserved in all collisions, while kinetic energy is partially converted into internal thermal/sound energy in inelastic collisions.",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: "In an exothermic reversible reaction at equilibrium (ΔH < 0), what occurs if the temperature of the reaction vessel is raised?",
        options: [
          "The equilibrium shifts forward toward products",
          "The equilibrium shifts backward toward reactants",
          "The equilibrium constant K increases",
          "Reaction stops completely",
        ],
        correct: 1,
        explanation: "By Le Chatelier's Principle, adding heat to an exothermic system shifts the equilibrium in the endothermic direction (reverse toward reactants).",
      },
    ],
    pathNodes: [
      { id: 1, name: "Kinematics, Force Vectors & Newton's Laws", status: "done", score: "94% Mastery", desc: "SUVAT equations, friction vectors, and free body analysis.", duration: "45 min" },
      { id: 2, name: "Work, Energy & Linear Momentum Collisions", status: "done", score: "87% Mastery", desc: "Work-energy theorem, impulse, and elastic collisions.", duration: "50 min" },
      { id: 3, name: "Stoichiometry & Chemical Equilibrium", status: "current", score: "49% • Active Focus", desc: "Molar mass, limiting reagents, and Le Chatelier shifts.", duration: "55 min", highlight: true },
      { id: 4, name: "Electromagnetism & Thermodynamics", status: "locked", score: "Unlocks Next", desc: "Coulomb's Law, circuits, enthalpy ΔH, and entropy ΔS.", duration: "60 min" },
    ],
  },
];

/**
 * Age 18+ Adult / Professional Subjects
 */
const adultSubjects = [
  {
    id: "prof-aiml",
    name: "Data Science & AI/ML",
    category: "Artificial Intelligence",
    icon: BrainCircuit,
    color: "#c77dff",
    gradeRange: "Age 18+ • Professional",
    desc: "Machine learning algorithms, transformer architectures, vector embeddings, fine-tuning LLMs, and data pipelines.",
    topics: ["Supervised & Unsupervised Learning", "Transformer Attention & Embeddings", "Model Evaluation & Loss Functions", "MLOps, Vector Databases & RAG"],
    diagnosticQuestion: {
      category: "Neural Architectures",
      q: "What attention mechanism in Transformer models allows tokens to attend to all positions in the input sequence in parallel?",
      options: ["Recurrent Gating", "Scaled Dot-Product Self-Attention", "Max Pooling", "Convolutional Stride"],
      correct: 1,
      explanation: "Scaled Dot-Product Self-Attention computes Attention(Q, K, V) = softmax(QK^T / √d_k) · V across all tokens simultaneously.",
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: "Which technique is commonly used to prevent overfitting in deep neural networks by randomly deactivating neurons during training?",
        options: ["Batch Normalization", "Dropout", "Gradient Clipping", "Weight Quantization"],
        correct: 1,
        explanation: "Dropout randomly sets a fraction of input units to 0 at each update, preventing co-adaptation of feature detectors.",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: "In Retrieval-Augmented Generation (RAG), what mathematical metric is commonly used to measure similarity between query and document vectors?",
        options: ["Cosine Similarity", "Euclidean Manhattan Sum", "Hamming Distance", "Jaccard Index"],
        correct: 0,
        explanation: "Cosine similarity measures the cosine of the angle between two embedding vectors in high-dimensional space.",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: "What loss function is standard for training multi-class classification neural networks with softmax output?",
        options: ["Mean Squared Error (MSE)", "Categorical Cross-Entropy", "Hinge Loss", "Huber Loss"],
        correct: 1,
        explanation: "Categorical Cross-Entropy penalizes divergences between predicted softmax probabilities and one-hot ground-truth classes.",
      },
    ],
    pathNodes: [
      { id: 1, name: "Data Wrangling & Statistical Foundations", status: "done", score: "95% Mastery", desc: "Pandas, NumPy, distributions, and hypothesis testing.", duration: "50 min" },
      { id: 2, name: "Supervised Learning: Regression & Classifiers", status: "done", score: "90% Mastery", desc: "Linear/logistic models, decision trees, and gradient boosting.", duration: "55 min" },
      { id: 3, name: "Deep Learning & Transformer Architectures", status: "current", score: "54% • Active Focus", desc: "Backpropagation, PyTorch, self-attention, and embeddings.", duration: "60 min", highlight: true },
      { id: 4, name: "RAG Systems & Vector Search Engineering", status: "locked", score: "Unlocks Next", desc: "Vector databases, chunking strategies, and LLM evaluation.", duration: "65 min" },
    ],
  },
  {
    id: "prof-cloud",
    name: "Software Engineering & Cloud Architecture",
    category: "Systems Engineering",
    icon: Database,
    color: "#38bdf8",
    gradeRange: "Age 18+ • Professional",
    desc: "Distributed microservices, Docker & Kubernetes container orchestration, CI/CD pipelines, and high-availability design.",
    topics: ["Microservices & API Gateways", "Docker Containers & Kubernetes Pods", "Event-Driven Messaging (Kafka, RabbitMQ)", "CAP Theorem & Database Sharding"],
    diagnosticQuestion: {
      category: "System Design",
      q: "According to the CAP Theorem, when a network partition (P) occurs in a distributed data store, the system must trade off between:",
      options: ["Latency and Storage", "Consistency and Availability", "Throughput and Reliability", "Security and Scalability"],
      correct: 1,
      explanation: "The CAP Theorem states that under network partition, a distributed system can guarantee either Consistency (CP) or Availability (AP), but not both.",
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: "What is the primary function of a reverse proxy like NGINX in front of backend application servers?",
        options: [
          "Compiling TypeScript code into binary",
          "Load balancing, SSL termination, and caching incoming traffic",
          "Generating relational database schema migrations",
          "Running background cron jobs",
        ],
        correct: 1,
        explanation: "A reverse proxy distributes incoming requests across backend nodes, handles SSL handshakes, and caches static assets.",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: "Which caching strategy writes data simultaneously to both the cache and the permanent database backing store before returning success?",
        options: ["Write-Through", "Write-Around", "Write-Back (Write-Behind)", "Read-Through"],
        correct: 0,
        explanation: "Write-Through ensures high data consistency by persisting to both cache and storage simultaneously.",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: "In Kubernetes, which controller resource guarantees that a single copy of a pod runs on all (or selected) worker nodes in the cluster?",
        options: ["Deployment", "StatefulSet", "DaemonSet", "ReplicaSet"],
        correct: 2,
        explanation: "A DaemonSet ensures all nodes run an identical pod (standard for monitoring agents, log collectors, or node daemons).",
      },
    ],
    pathNodes: [
      { id: 1, name: "Containerization with Docker & OCI Specs", status: "done", score: "93% Mastery", desc: "Multi-stage Dockerfiles, image layers, and container networking.", duration: "45 min" },
      { id: 2, name: "Kubernetes Orchestration & Helm Charts", status: "done", score: "88% Mastery", desc: "Pods, services, ingress controllers, and config maps.", duration: "55 min" },
      { id: 3, name: "Microservices & Distributed Transactions", status: "current", score: "51% • Active Focus", desc: "Saga pattern, idempotent consumers, and event-driven queues.", duration: "60 min", highlight: true },
      { id: 4, name: "Zero-Trust Security & Cloud Observability", status: "locked", score: "Unlocks Next", desc: "mTLS, OpenTelemetry tracing, and Grafana monitoring.", duration: "65 min" },
    ],
  },
  {
    id: "prof-finance",
    name: "Finance, Economics & Investing",
    category: "Financial Intelligence",
    icon: TrendingUp,
    color: "#10b981",
    gradeRange: "Age 18+ • Professional",
    desc: "Valuation models (DCF), capital markets, portfolio asset allocation, macroeconomic monetary policy, and risk hedging.",
    topics: ["Discounted Cash Flow (DCF) Valuation", "Modern Portfolio Theory & Sharpe Ratio", "Central Bank Interest Rates & Inflation", "Options, Futures & Derivatives Hedging"],
    diagnosticQuestion: {
      category: "Corporate Valuation",
      q: "In a Discounted Cash Flow (DCF) valuation model, future free cash flows are discounted to present value using which rate?",
      options: ["Nominal GDP Growth Rate", "Weighted Average Cost of Capital (WACC)", "Consumer Price Index (CPI)", "Book Value Return"],
      correct: 1,
      explanation: "WACC represents a company's blended cost of capital across equity and debt, serving as the discount rate for firm cash flows.",
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: "What does the Sharpe Ratio measure when evaluating an investment portfolio?",
        options: [
          "Total dividend payout percentage",
          "Risk-adjusted return per unit of volatility (standard deviation)",
          "Net book value to market equity ratio",
          "Annual tax deduction liability",
        ],
        correct: 1,
        explanation: "Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Standard Deviation, measuring excess return per unit of risk.",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: "When a Central Bank raises benchmark interest rates, what is the typical intended macroeconomic impact?",
        options: [
          "To stimulate rapid credit borrowing and accelerate inflation",
          "To cool borrowing, decrease aggregate demand, and curb inflation",
          "To devalue the domestic currency exchange rate",
          "To eliminate federal budget deficits immediately",
        ],
        correct: 1,
        explanation: "Higher interest rates increase borrowing costs for consumers and businesses, slowing spending to dampen inflationary pressures.",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: "Which derivative contract gives the buyer the right, but not the obligation, to sell an underlying asset at a specified strike price?",
        options: ["Call Option", "Put Option", "Forward Contract", "Credit Default Swap"],
        correct: 1,
        explanation: "A Put Option gives the holder the right to sell at strike price; a Call Option gives the right to purchase.",
      },
    ],
    pathNodes: [
      { id: 1, name: "Financial Statement Analysis & Ratio Metrics", status: "done", score: "94% Mastery", desc: "Income statement, balance sheet, cash flows, EBITDA, and ROIC.", duration: "45 min" },
      { id: 2, name: "Discounted Cash Flows (DCF) & Enterprise Value", status: "done", score: "89% Mastery", desc: "Free cash flow to firm (FCFF), terminal value, and sensitivity tables.", duration: "50 min" },
      { id: 3, name: "Portfolio Theory, Asset Allocation & Risk", status: "current", score: "53% • Active Focus", desc: "Efficient frontier, beta, Sharpe ratio, and rebalancing rules.", duration: "55 min", highlight: true },
      { id: 4, name: "Options Strategies & Derivatives Hedging", status: "locked", score: "Unlocks Next", desc: "Black-Scholes model, option Greeks, and protective collars.", duration: "60 min" },
    ],
  },
  {
    id: "prof-aptitude",
    name: "Competitive Exam Prep & Quantitative Aptitude",
    category: "Analytical Reasoning",
    icon: Award,
    color: "#f59e0b",
    gradeRange: "Age 18+ • Professional",
    desc: "Advanced logic puzzles, critical verbal deduction, data interpretation, probability permutations, and speed math.",
    topics: ["Data Interpretation & Tabular Analysis", "Permutations, Combinations & Probability", "Logical Deduction & Syllogisms", "Speed Mathematics & Mental Algebra"],
    diagnosticQuestion: {
      category: "Combinatorics",
      q: "In how many distinct ways can a committee of 3 people be selected from a pool of 8 eligible candidates?",
      options: ["24", "56", "336", "512"],
      correct: 1,
      explanation: "Using combinations formula C(n, r) = n! / (r! · (n-r)!) ⇒ C(8, 3) = (8 · 7 · 6) / (3 · 2 · 1) = 56.",
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: "If a train traveling at 72 km/h crosses a 200-meter platform in 20 seconds, what is the length of the train?",
        options: ["150 meters", "200 meters", "250 meters", "300 meters"],
        correct: 1,
        explanation: "Speed in m/s = 72 × (5/18) = 20 m/s. Total distance = speed × time = 20 × 20 = 400 m. Train length = 400 - 200 = 200 m.",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: "Two fair six-sided dice are rolled simultaneously. What is the exact probability that the sum of the numbers is 8?",
        options: ["5/36", "1/6", "7/36", "1/12"],
        correct: 0,
        explanation: "Possible pairs summing to 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 outcomes out of 36 total ⇒ 5/36.",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: "If A can complete a project in 12 days and B can complete it in 18 days, how many days will it take if they work together?",
        options: ["6.5 days", "7.2 days", "8.0 days", "15.0 days"],
        correct: 1,
        explanation: "Combined work rate = 1/12 + 1/18 = (3 + 2)/36 = 5/36 per day. Time = 36 / 5 = 7.2 days.",
      },
    ],
    pathNodes: [
      { id: 1, name: "Speed Arithmetic, Percentages & Ratios", status: "done", score: "96% Mastery", desc: "Mental math shortcuts, compound percentages, and alligation.", duration: "45 min" },
      { id: 2, name: "Permutations, Combinations & Probability", status: "done", score: "90% Mastery", desc: "Factorials, arrangement restrictions, and conditional probability.", duration: "50 min" },
      { id: 3, name: "Data Interpretation & Chart Analysis", status: "current", score: "52% • Active Focus", desc: "Multi-axis bar charts, radar plots, and trend inferences.", duration: "55 min", highlight: true },
      { id: 4, name: "Logical Deduction & Syllogism Proofs", status: "locked", score: "Unlocks Next", desc: "Venn diagram proofs, seating arrangements, and critical fallacies.", duration: "60 min" },
    ],
  },
  {
    id: "prof-career",
    name: "Career Skills & Strategic Management",
    category: "Professional Leadership",
    icon: Briefcase,
    color: "#ec4899",
    gradeRange: "Age 18+ • Professional",
    desc: "Agile product lifecycle, stakeholder diplomacy, system thinking, technical communications, and executive strategy.",
    topics: ["Agile/Scrum Sprint Frameworks", "Executive Stakeholder Communications", "Root Cause Analysis (5 Whys, Fishbone)", "Strategic Trade-off Analysis & Roadmaps"],
    diagnosticQuestion: {
      category: "Agile Product Management",
      q: "In Scrum methodology, which event is specifically held at the conclusion of a sprint to inspect process improvements for the next iteration?",
      options: ["Sprint Planning", "Daily Standup", "Sprint Review", "Sprint Retrospective"],
      correct: 3,
      explanation: "The Sprint Retrospective focus is continuous team process improvement, inspecting what went well and what to adjust.",
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: "Which framework is used to prioritize feature backlogs based on Value, Effort, Confidence, and Reach?",
        options: ["RICE Framework", "SWOT Analysis", "Kanban WIP Limit", "Porter's Five Forces"],
        correct: 0,
        explanation: "RICE Score = (Reach × Impact × Confidence) / Effort, providing quantitative prioritization across feature backlogs.",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: "What engineering management tool isolates the underlying root trigger of a systemic failure rather than surface symptoms?",
        options: ["5 Whys & Ishikawa (Fishbone) Diagram", "Gantt Chart Milestone Track", "Burn-down Velocity Chart", "User Journey Map"],
        correct: 0,
        explanation: "The 5 Whys and Ishikawa Fishbone diagram trace causal chains backwards to identify foundational root vulnerabilities.",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: "In high-stakes technical leadership, what does Conway's Law observe about system design?",
        options: [
          "Systems will run twice as fast every 18 months",
          "Organizations design systems that mirror their own communication structures",
          "Software complexity scales exponentially with team headcount",
          "Premature optimization is the root of all engineering delays",
        ],
        correct: 1,
        explanation: "Conway's Law states: 'Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations.'",
      },
    ],
    pathNodes: [
      { id: 1, name: "Agile Principles & Scrum Lifecycle", status: "done", score: "95% Mastery", desc: "User stories, acceptance criteria, velocity, and backlog grooming.", duration: "45 min" },
      { id: 2, name: "Technical Communication & Executive Briefs", status: "done", score: "91% Mastery", desc: "Pyramid principle, RFC design docs, and concise stakeholder updates.", duration: "50 min" },
      { id: 3, name: "System Thinking & Root Cause Analysis", status: "current", score: "54% • Active Focus", desc: "Feedback loops, 5-Whys postmortems, and risk mitigation.", duration: "55 min", highlight: true },
      { id: 4, name: "Strategic Roadmapping & Resource Negotiation", status: "locked", score: "Unlocks Next", desc: "Balancing tech debt, feature delivery, and cross-functional alignment.", duration: "60 min" },
    ],
  },
];

/**
 * Returns the appropriate list of predefined subjects based on the user's age.
 * Adds any custom subjects the user has created.
 */
export function getSubjectsForUser(user) {
  const age = user?.age || "16";
  const ageBandInfo = getAgeBandInfo(age);
  let baseSubjects = [];

  if (ageBandInfo.band === "adult") {
    baseSubjects = adultSubjects;
  } else if (ageBandInfo.band === "advanced") {
    baseSubjects = advancedSubjects;
  } else {
    // Core band (Age 1–15)
    baseSubjects = coreSubjectsBySubTier[ageBandInfo.subTier] || coreSubjectsBySubTier.primary;
  }

  // Append user's custom subjects
  const customSubjects = (user?.custom_subjects || []).map((cs) => ({
    id: cs.id,
    name: cs.name,
    category: "Custom Curriculum",
    icon: Sparkles,
    color: cs.color || "#a855f7",
    gradeRange: `Custom • ${cs.media?.length || 0} Resource File(s)`,
    desc: cs.desc || "Custom student-created subject with uploaded notes and syllabus materials.",
    is_custom: true,
    media: cs.media || [],
    topics: cs.topics || ["Student Uploaded Notes", "Custom Flashcards", "AI Generated Quiz", "Prerequisite Mastery"],
    diagnosticQuestion: {
      category: "Conceptual Knowledge",
      q: `What is the foundational core principle of ${cs.name} based on your uploaded curriculum?`,
      options: [
        "Core foundational definitions and nomenclature",
        "Applied practical calculations and mechanics",
        "Higher-order synthesis and case study evaluation",
        "Prerequisite terminology mastery",
      ],
      correct: 0,
      explanation: `Fundamental conceptual mastery in ${cs.name} requires establishing verified baseline terminology and core axioms.`,
    },
    adaptiveQuestions: [
      {
        level: "FOUNDATION",
        tier: 1,
        q: `Which concept represents the primary building block of ${cs.name}?`,
        options: ["Baseline Axioms", "Peripheral Applications", "Secondary Theories", "Historical Anecdotes"],
        correct: 0,
        explanation: "Establishing robust foundational axioms allows advanced problem solving in this discipline.",
      },
      {
        level: "INTERMEDIATE",
        tier: 2,
        q: `When applying principles of ${cs.name} to complex problem scenarios, what is the optimal first step?`,
        options: ["Guessing the outcome", "Decomposing the problem into foundational components", "Skipping prerequisites", "Memorizing formulas without understanding"],
        correct: 1,
        explanation: "Problem decomposition is the hallmark of mastery across customized technical domains.",
      },
      {
        level: "ADVANCED",
        tier: 3,
        q: `How do advanced practitioners in ${cs.name} validate conceptual hypotheses?`,
        options: ["By empirical verification and peer review", "By subjective intuition alone", "By ignoring counter-examples", "By avoiding testing"],
        correct: 0,
        explanation: "Rigorous empirical verification guarantees high-fidelity understanding in custom fields.",
      },
    ],
    pathNodes: [
      { id: 1, name: "Core Principles & Verified Nomenclature", status: "done", score: "90% Mastery", desc: "Deconstructing core definitions from your uploaded reference notes.", duration: "35 min" },
      { id: 2, name: "Structural Frameworks & Axiomatic Models", status: "done", score: "85% Mastery", desc: "Analyzing relationship models and primary formulas.", duration: "45 min" },
      { id: 3, name: "Applied Practice & Case Diagnostics", status: "current", score: "50% • Active Focus", desc: "Synthesizing custom notes with adaptive AI problem scenarios.", duration: "45 min", highlight: true },
      { id: 4, name: "Advanced Synthesis & Real-World Projects", status: "locked", score: "Unlocks Next", desc: "Comprehensive problem solving and mastery certification.", duration: "50 min" },
    ],
  }));

  return [...baseSubjects, ...customSubjects];
}
