export type School = {
  id: string;
  name: string;
  logo: string;
  photo: string;
  location: string;
  province: string;
  type: string;
  gender: "Co-ed" | "Boys" | "Girls";
  boarding: boolean;
  rating: number;
  reviews: number;
  verified: boolean;
  description: string;
  startingFees: number;
  founded: number;
  students: number;
  passRate: number;
  curriculum: string[];
  facilities: string[];
  featured?: boolean;
  motto?: string;
  phone?: string;
  email?: string;
  website?: string;
};

export const PROVINCES = [
  { name: "Harare", schools: 342, image: "photo-1580582932707-520aed937b7b" },
  { name: "Bulawayo", schools: 198, image: "photo-1562774053-701939374585" },
  { name: "Manicaland", schools: 156, image: "photo-1523050854058-8df90110c9f1" },
  { name: "Mashonaland East", schools: 143, image: "photo-1541339907198-e08756dedf3f" },
  { name: "Mashonaland West", schools: 121, image: "photo-1594608661623-aa0bd3a69d98" },
  { name: "Masvingo", schools: 109, image: "photo-1607013251379-e6eecfffe234" },
  { name: "Midlands", schools: 132, image: "photo-1555854877-bab0e564b8d5" },
  { name: "Matabeleland North", schools: 87, image: "photo-1509062522246-3755977927d7" },
];

export const SCHOOL_TYPES = [
  { name: "Primary School", icon: "backpack", count: 620 },
  { name: "Secondary School", icon: "school", count: 540 },
  { name: "High School", icon: "history_edu", count: 310 },
  { name: "Boarding School", icon: "night_shelter", count: 145 },
  { name: "International School", icon: "public", count: 42 },
  { name: "Special Needs", icon: "accessibility_new", count: 38 },
  { name: "Technical College", icon: "engineering", count: 56 },
  { name: "Early Learning", icon: "child_care", count: 210 },
];

export const SCHOOLS: School[] = [
  {
    id: "prince-edward",
    name: "Prince Edward School",
    logo: "photo-1599305445671-ac291c95aaa9",
    photo: "photo-1580582932707-520aed937b7b",
    location: "Harare CBD, Harare",
    province: "Harare",
    type: "High School",
    gender: "Boys",
    boarding: true,
    rating: 4.8,
    reviews: 214,
    verified: true,
    description: "A prestigious boys' high school renowned for academic excellence, sporting achievement and a proud tradition spanning over a century.",
    startingFees: 1250,
    founded: 1898,
    students: 1400,
    passRate: 96,
    curriculum: ["ZIMSEC", "Cambridge"],
    facilities: ["Science Labs", "Rugby Fields", "Swimming Pool", "Library", "Boarding", "ICT Centre"],
    featured: true,
  },
  {
    id: "arundel",
    name: "Arundel School",
    logo: "photo-1594608661623-aa0bd3a69d98",
    photo: "photo-1541339907198-e08756dedf3f",
    location: "Mount Pleasant, Harare",
    province: "Harare",
    type: "High School",
    gender: "Girls",
    boarding: true,
    rating: 4.9,
    reviews: 187,
    verified: true,
    description: "An independent girls' school offering a nurturing environment with strong emphasis on leadership, arts and academic distinction.",
    startingFees: 1480,
    founded: 1955,
    students: 620,
    passRate: 98,
    curriculum: ["Cambridge", "ZIMSEC"],
    facilities: ["Art Studios", "Hockey Fields", "Library", "Boarding", "Music School", "Theatre"],
    featured: true,
  },
  {
    id: "st-georges",
    name: "St George's College",
    logo: "photo-1523240795612-9a054b0db644",
    photo: "photo-1562774053-701939374585",
    location: "Borrowdale, Harare",
    province: "Harare",
    type: "High School",
    gender: "Boys",
    boarding: false,
    rating: 4.7,
    reviews: 156,
    verified: true,
    description: "A Jesuit Catholic day school committed to forming young men of competence, conscience and compassion.",
    startingFees: 1350,
    founded: 1896,
    students: 900,
    passRate: 95,
    curriculum: ["Cambridge", "ZIMSEC"],
    facilities: ["Chapel", "Cricket Oval", "Science Labs", "Library", "ICT Centre", "Athletics Track"],
    featured: true,
  },
  {
    id: "petra-college",
    name: "Petra College",
    logo: "photo-1509062522246-3755977927d7",
    photo: "photo-1555854877-bab0e564b8d5",
    location: "Hillside, Bulawayo",
    province: "Bulawayo",
    type: "Secondary School",
    gender: "Co-ed",
    boarding: true,
    rating: 4.6,
    reviews: 98,
    verified: true,
    description: "A vibrant co-educational school in Bulawayo delivering holistic education with a global outlook and modern facilities.",
    startingFees: 980,
    founded: 1993,
    students: 750,
    passRate: 93,
    curriculum: ["Cambridge", "ZIMSEC"],
    facilities: ["Science Labs", "Sports Fields", "Boarding", "Library", "ICT Centre"],
    featured: true,
  },
  {
    id: "gateway",
    name: "Gateway High School",
    logo: "photo-1541178735493-479c1a27ed24",
    photo: "photo-1523050854058-8df90110c9f1",
    location: "Marlborough, Harare",
    province: "Harare",
    type: "International School",
    gender: "Co-ed",
    boarding: false,
    rating: 4.5,
    reviews: 132,
    verified: true,
    description: "An international co-educational school offering the Cambridge curriculum with world-class facilities and small class sizes.",
    startingFees: 1650,
    founded: 1999,
    students: 680,
    passRate: 97,
    curriculum: ["Cambridge", "IGCSE"],
    facilities: ["Swimming Pool", "Science Labs", "Auditorium", "Library", "ICT Centre", "Sports Complex"],
    featured: true,
  },
  {
    id: "kyle-college",
    name: "Kyle College",
    logo: "photo-1607013251379-e6eecfffe234",
    photo: "photo-1607013251379-e6eecfffe234",
    location: "Masvingo Town, Masvingo",
    province: "Masvingo",
    type: "Boarding School",
    gender: "Co-ed",
    boarding: true,
    rating: 4.4,
    reviews: 74,
    verified: false,
    description: "A friendly boarding school near Lake Mutirikwi combining academic rigour with outdoor education and community values.",
    startingFees: 890,
    founded: 1990,
    students: 520,
    passRate: 90,
    curriculum: ["ZIMSEC", "Cambridge"],
    facilities: ["Boarding", "Sports Fields", "Library", "Science Labs", "Farm"],
    featured: true,
  },
  {
    id: "hellenic",
    name: "Hellenic Academy",
    logo: "photo-1580894742597-87bc8789db3d",
    photo: "photo-1594608661623-aa0bd3a69d98",
    location: "Belvedere, Harare",
    province: "Harare",
    type: "Primary School",
    gender: "Co-ed",
    boarding: false,
    rating: 4.6,
    reviews: 88,
    verified: true,
    description: "A well-rounded primary and secondary academy focused on individual attention and strong foundational learning.",
    startingFees: 720,
    founded: 1982,
    students: 940,
    passRate: 92,
    curriculum: ["ZIMSEC", "Cambridge"],
    facilities: ["Playgrounds", "Library", "ICT Centre", "Sports Fields", "Music Room"],
  },
  {
    id: "peterhouse",
    name: "Peterhouse Group",
    logo: "photo-1523240795612-9a054b0db644",
    photo: "photo-1541339907198-e08756dedf3f",
    location: "Marondera, Mash East",
    province: "Mashonaland East",
    type: "Boarding School",
    gender: "Co-ed",
    boarding: true,
    rating: 4.8,
    reviews: 145,
    verified: true,
    description: "A leading independent boarding community set in the highveld, known for character formation and academic distinction.",
    startingFees: 1550,
    founded: 1955,
    students: 1100,
    passRate: 97,
    curriculum: ["Cambridge", "ZIMSEC"],
    facilities: ["Boarding", "Chapel", "Science Labs", "Sports Complex", "Theatre", "Library", "Farm"],
  },
  {
    id: "cbc",
    name: "Christian Brothers College",
    logo: "photo-1541178735493-479c1a27ed24",
    photo: "photo-1562774053-701939374585",
    location: "Suburbs, Bulawayo",
    province: "Bulawayo",
    type: "High School",
    gender: "Boys",
    boarding: false,
    rating: 4.5,
    reviews: 67,
    verified: true,
    description: "A Catholic boys' school with a strong reputation for discipline, sport and service to the Bulawayo community.",
    startingFees: 860,
    founded: 1954,
    students: 700,
    passRate: 91,
    curriculum: ["ZIMSEC", "Cambridge"],
    facilities: ["Chapel", "Rugby Fields", "Science Labs", "Library", "ICT Centre"],
  },
];

export type Review = {
  id: string;
  schoolId?: string;
  author: string;
  avatar: string;
  role: string;
  school: string;
  rating: number;
  date: string;
  title: string;
  body: string;
};

export const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Tendai Moyo",
    avatar: "photo-1614023342667-6f060e9d1e04",
    role: "Parent of two",
    school: "Prince Edward School",
    rating: 5,
    date: "2 weeks ago",
    title: "Outstanding academic support",
    body: "The teachers genuinely care. My son's confidence and results have improved dramatically since he joined. The sporting programme is superb too.",
  },
  {
    id: "r2",
    author: "Chipo Ncube",
    avatar: "photo-1593351799227-75df2026356b",
    role: "Guardian",
    school: "Arundel School",
    rating: 5,
    date: "1 month ago",
    title: "A nurturing environment for girls",
    body: "Arundel has helped my niece grow into a confident young leader. Communication from the school is excellent and transparent.",
  },
  {
    id: "r3",
    author: "Farai Dube",
    avatar: "photo-1616805765352-beedbad46b2a",
    role: "Parent",
    school: "Gateway High School",
    rating: 4,
    date: "3 weeks ago",
    title: "Great facilities, small classes",
    body: "We chose Gateway for the Cambridge curriculum and small class sizes. Fees are on the higher side but the value is clear.",
  },
  {
    id: "r4",
    author: "Rutendo Sibanda",
    avatar: "photo-1563132337-f159f484226c",
    role: "Parent of three",
    school: "Petra College",
    rating: 5,
    date: "5 days ago",
    title: "Feels like family",
    body: "The boarding staff treat the children like their own. My daughter has settled in beautifully and loves the weekend activities.",
  },
  {
    id: "r5",
    author: "Blessing Chikowore",
    avatar: "photo-1605602517387-ec78b947335e",
    role: "Parent",
    school: "St George's College",
    rating: 5,
    date: "2 months ago",
    title: "Best decision we ever made",
    body: "St George's has a culture of excellence that motivates every student. The discipline is firm but fair and the results speak for themselves.",
  },
  {
    id: "r6",
    author: "Nyasha Mutasa",
    avatar: "photo-1573497019418-b400bb3ab074",
    role: "Guardian",
    school: "Dominican Convent High",
    rating: 4,
    date: "3 months ago",
    title: "Strong values and academics",
    body: "The Convent instils real discipline and character. My niece has flourished academically and socially. Highly recommend for any serious family.",
  },
  {
    id: "r7",
    author: "Tafadzwa Murewa",
    avatar: "photo-1531901599143-df5010ab9438",
    role: "Parent of two",
    school: "Harare International School",
    rating: 4,
    date: "1 month ago",
    title: "World-class international education",
    body: "HIS prepared my children for university abroad better than I could have hoped. The IB programme is rigorous and the teachers outstanding.",
  },
  {
    id: "r8",
    author: "Sekai Zimuto",
    avatar: "photo-1561406636-b80293969660",
    role: "Parent",
    school: "Chisipite Senior School",
    rating: 5,
    date: "6 days ago",
    title: "Warm, supportive community",
    body: "From the first day Chisipite felt like home. The pastoral care is exceptional and the academic results have exceeded our expectations.",
  },
];

export type Resource = {
  id: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
  excerpt: string;
};

export const RESOURCES: Resource[] = [
  {
    id: "res1",
    title: "How to Choose the Right School for Your Child",
    category: "Guides",
    readTime: "8 min read",
    image: "photo-1503676260728-1c00da094a0b",
    excerpt: "A practical framework for weighing academics, values, distance and fees when selecting a school in Zimbabwe.",
  },
  {
    id: "res2",
    title: "Understanding ZIMSEC vs Cambridge Curricula",
    category: "Curriculum",
    readTime: "6 min read",
    image: "photo-1523050854058-8df90110c9f1",
    excerpt: "The key differences between the two dominant curricula and what they mean for your child's future.",
  },
  {
    id: "res3",
    title: "Boarding vs Day School: What to Consider",
    category: "Guides",
    readTime: "5 min read",
    image: "photo-1509062522246-3755977927d7",
    excerpt: "Weigh the benefits and trade-offs of boarding education for your family's circumstances.",
  },
  {
    id: "res4",
    title: "A Parent's Guide to School Fees & Payment Plans",
    category: "Finance",
    readTime: "7 min read",
    image: "photo-1554224155-6726b3ff858f",
    excerpt: "Budgeting tips, term breakdowns and questions to ask about levies and additional costs.",
  },
  {
    id: "res5",
    title: "Preparing Your Child for Grade 1",
    category: "Early Years",
    readTime: "4 min read",
    image: "photo-1544717297-fa95b6ee9643",
    excerpt: "Simple ways to build reading, social and independence skills before the first day of school.",
  },
  {
    id: "res6",
    title: "Questions to Ask on a School Open Day",
    category: "Guides",
    readTime: "5 min read",
    image: "photo-1427504494785-3a9ca7044f45",
    excerpt: "Make the most of your visit with this checklist of the questions that really matter.",
  },
];

export const unsplash = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

const STORAGE_KEY_CUSTOM_SCHOOLS = "school_finder_custom_schools";

export function getCustomSchools(): School[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_SCHOOLS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomSchool(school: School): void {
  try {
    const existing = getCustomSchools();
    const updated = [school, ...existing.filter((s) => s.id !== school.id)];
    localStorage.setItem(STORAGE_KEY_CUSTOM_SCHOOLS, JSON.stringify(updated));
    window.dispatchEvent(new Event("school_data_updated"));
  } catch (err) {
    console.error("Failed to save custom school", err);
  }
}

export function getAllSchools(): School[] {
  const custom = getCustomSchools();
  const customIds = new Set(custom.map((s) => s.id));
  return [...custom, ...SCHOOLS.filter((s) => !customIds.has(s.id))];
}

export function getSchoolById(id: string): School | undefined {
  return getAllSchools().find((s) => s.id === id);
}
