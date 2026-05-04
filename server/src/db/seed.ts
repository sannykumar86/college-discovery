import 'dotenv/config';
import { getDb, initializeDatabase, queryOne, run } from './index.js';

// Base generator functions
const generateColleges = () => {
  const colleges: any[] = [];
  let idCounter = 1;

  // Helper to add
  const add = (name: string, location: string, state: string, fees: number, rating: number, placement: number, year: number, type: string, avg: number, high: number, students: number, exams: string[]) => {
    colleges.push({
      id: idCounter++,
      name, location, state, fees, rating, placement_percentage: placement, established_year: year, type,
      description: `${name} is a premier ${type} institution in ${state} offering exceptional technical education.`,
      image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
      website: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu.in`,
      avg_package: avg, highest_package: high, total_students: students,
      courses: JSON.stringify(["Computer Science", "Electronics", "Mechanical", "Civil", "IT"]),
      accepted_exams: JSON.stringify(exams)
    });
  };

  // 1. All 23 IITs
  const iits = [
    {n:"Kharagpur", s:"West Bengal", y:1951}, {n:"Bombay", s:"Maharashtra", y:1958}, {n:"Madras", s:"Tamil Nadu", y:1959},
    {n:"Kanpur", s:"Uttar Pradesh", y:1959}, {n:"Delhi", s:"Delhi", y:1961}, {n:"Guwahati", s:"Assam", y:1994},
    {n:"Roorkee", s:"Uttarakhand", y:1847}, {n:"Ropar", s:"Punjab", y:2008}, {n:"Bhubaneswar", s:"Odisha", y:2008},
    {n:"Gandhinagar", s:"Gujarat", y:2008}, {n:"Hyderabad", s:"Telangana", y:2008}, {n:"Jodhpur", s:"Rajasthan", y:2008},
    {n:"Patna", s:"Bihar", y:2008}, {n:"Indore", s:"Madhya Pradesh", y:2009}, {n:"Mandi", s:"Himachal Pradesh", y:2009},
    {n:"BHU Varanasi", s:"Uttar Pradesh", y:1919}, {n:"Palakkad", s:"Kerala", y:2015}, {n:"Tirupati", s:"Andhra Pradesh", y:2015},
    {n:"Dhanbad (ISM)", s:"Jharkhand", y:1926}, {n:"Bhilai", s:"Chhattisgarh", y:2016}, {n:"Goa", s:"Goa", y:2016},
    {n:"Jammu", s:"Jammu and Kashmir", y:2016}, {n:"Dharwad", s:"Karnataka", y:2016}
  ];
  iits.forEach(iit => add(`Indian Institute of Technology (IIT) ${iit.n}`, iit.n.split(' ')[0], iit.s, 250000, 4.8 + Math.random()*0.2, 90 + Math.random()*8, iit.y, "Government", 15 + Math.random()*8, 100 + Math.random()*150, 4000 + Math.random()*6000, ["JEE Advanced"]));

  // 2. All 31 NITs
  const nits = [
    {n:"Trichy", s:"Tamil Nadu", c:"Tiruchirappalli"}, {n:"Surathkal", s:"Karnataka", c:"Mangalore"}, {n:"Warangal", s:"Telangana", c:"Warangal"},
    {n:"Rourkela", s:"Odisha", c:"Rourkela"}, {n:"Calicut", s:"Kerala", c:"Kozhikode"}, {n:"Allahabad", s:"Uttar Pradesh", c:"Prayagraj"},
    {n:"Kurukshetra", s:"Haryana", c:"Kurukshetra"}, {n:"Durgapur", s:"West Bengal", c:"Durgapur"}, {n:"Silchar", s:"Assam", c:"Silchar"},
    {n:"Jaipur", s:"Rajasthan", c:"Jaipur"}, {n:"Nagpur", s:"Maharashtra", c:"Nagpur"}, {n:"Bhopal", s:"Madhya Pradesh", c:"Bhopal"},
    {n:"Surat", s:"Gujarat", c:"Surat"}, {n:"Raipur", s:"Chhattisgarh", c:"Raipur"}, {n:"Jalandhar", s:"Punjab", c:"Jalandhar"},
    {n:"Agartala", s:"Tripura", c:"Agartala"}, {n:"Meghalaya", s:"Meghalaya", c:"Shillong"}, {n:"Patna", s:"Bihar", c:"Patna"},
    {n:"Goa", s:"Goa", c:"Ponda"}, {n:"Jamshedpur", s:"Jharkhand", c:"Jamshedpur"}, {n:"Hamirpur", s:"Himachal Pradesh", c:"Hamirpur"},
    {n:"Srinagar", s:"Jammu and Kashmir", c:"Srinagar"}, {n:"Uttarakhand", s:"Uttarakhand", c:"Srinagar"}, {n:"Puducherry", s:"Puducherry", c:"Karaikal"},
    {n:"Arunachal Pradesh", s:"Arunachal Pradesh", c:"Yupia"}, {n:"Sikkim", s:"Sikkim", c:"Ravangla"}, {n:"Delhi", s:"Delhi", c:"New Delhi"},
    {n:"Mizoram", s:"Mizoram", c:"Aizawl"}, {n:"Nagaland", s:"Nagaland", c:"Chumukedima"}, {n:"Manipur", s:"Manipur", c:"Imphal"},
    {n:"Andhra Pradesh", s:"Andhra Pradesh", c:"Tadepalligudem"}
  ];
  nits.forEach(nit => add(`National Institute of Technology (NIT) ${nit.n}`, nit.c, nit.s, 150000, 4.2 + Math.random()*0.6, 80 + Math.random()*15, 1960 + Math.floor(Math.random()*50), "Government", 8 + Math.random()*6, 40 + Math.random()*40, 3000 + Math.random()*4000, ["JEE Main"]));

  // 3. IIITs (Indian Institutes of Information Technology)
  const iiits = ["Hyderabad", "Bangalore", "Allahabad", "Gwalior", "Jabalpur", "Kanchipuram", "Guwahati", "Pune", "Kota", "Sri City", "Vadodara", "Nagpur", "Kalyani", "Lucknow", "Dharwad", "Bhagalpur", "Bhopal", "Kottayam", "Ranchi", "Una", "Surat"];
  iiits.forEach(c => add(`Indian Institute of Information Technology (IIIT) ${c}`, c, "Various", 200000, 4.0 + Math.random()*0.8, 85 + Math.random()*10, 1998 + Math.floor(Math.random()*20), "Government", 10 + Math.random()*8, 45 + Math.random()*60, 1500 + Math.random()*2000, ["JEE Main", "UGEE"]));

  // 4. AKTU Affiliated Colleges
  const aktuGov = [
    {n: "Institute of Engineering and Technology (IET) Lucknow", c: "Lucknow", y: 1984},
    {n: "Bundelkhand Institute of Engineering & Technology (BIET) Jhansi", c: "Jhansi", y: 1986},
    {n: "Kamla Nehru Institute of Technology (KNIT) Sultanpur", c: "Sultanpur", y: 1979},
    {n: "Uttar Pradesh Textile Technology Institute (UPTTI) Kanpur", c: "Kanpur", y: 1923}
  ];
  aktuGov.forEach(g => add(g.n, g.c, "Uttar Pradesh", 85000, 4.2 + Math.random()*0.5, 80 + Math.random()*10, g.y, "Government", 6 + Math.random()*3, 25 + Math.random()*20, 2000 + Math.random()*1000, ["JEE Main", "CUET"]));

  const aktuProminent = [
    "JSS Academy of Technical Education", "KIET Group of Institutions", "Ajay Kumar Garg Engineering College (AKGEC)", 
    "ABES Engineering College", "GL Bajaj Institute of Technology and Management", "Galgotias College of Engineering and Technology", 
    "Noida Institute of Engineering and Technology (NIET)", "IMS Engineering College", "Inderprastha Engineering College", 
    "Raj Kumar Goel Institute of Technology", "Krishna Engineering College", "United College of Engineering and Research", 
    "Shri Ram Murti Smarak College of Engineering", "Pranveer Singh Institute of Technology", 
    "ITS Engineering College", "Lloyd Institute of Engineering", "Accurate Institute", "Dronacharya Group"
  ];
  aktuProminent.forEach(name => add(name, "Noida/Greater Noida/Ghaziabad/Kanpur".split('/')[Math.floor(Math.random()*4)], "Uttar Pradesh", 125000, 3.8 + Math.random()*0.7, 75 + Math.random()*15, 1995 + Math.floor(Math.random()*20), "Private", 5 + Math.random()*2.5, 18 + Math.random()*25, 3000 + Math.random()*2000, ["CUET", "JEE Main"]));
  
  for(let i=1; i<=100; i++) {
    add(`AKTU Affiliated Institute of Technology ${i}`, "Uttar Pradesh Region", "Uttar Pradesh", 90000 + Math.random()*50000, 3.0 + Math.random()*1.5, 50 + Math.random()*40, 2000 + Math.floor(Math.random()*20), "Private", 3.0 + Math.random()*3, 10 + Math.random()*20, 1000 + Math.random()*2000, ["UPCET", "CUET"]);
  }

  // 5. Major Private Universities 
  const privates = [
    "BITS Pilani", "BITS Goa", "BITS Hyderabad", "VIT Vellore", "VIT Chennai", "VIT Bhopal", "VIT AP", 
    "SRM Institute of Science and Technology, Chennai", "SRM Ramapuram", "SRM NCR",
    "Manipal Institute of Technology", "Manipal University Jaipur", "Sikkim Manipal",
    "Amity University Noida", "Amity University Gurgaon", "Amity University Lucknow", "Amity University Jaipur",
    "LPU Jalandhar", "Chandigarh University", "Chitkara University", 
    "KIIT Bhubaneswar", "ITER Siksha 'O' Anusandhan", "C.V. Raman Global University",
    "Thapar Institute of Engineering and Technology", "Shiv Nadar University", "Ashoka University", "O.P. Jindal",
    "Symbiosis Institute of Technology", "MIT-WPU Pune", "Bhartiya Vidyapeeth",
    "PES University Bangalore", "RV College of Engineering", "BMS College of Engineering", "MSRIT Bangalore", "Dayananda Sagar",
    "Hindustan Institute of Technology", "Sathyabama Institute", "Kalinga Institute", "UPES Dehradun", "Graphic Era Dehradun"
  ];
  privates.forEach(p => add(p, p.split(' ').slice(-1)[0], "Various", 300000 + Math.random()*200000, 3.8 + Math.random()*1.0, 75 + Math.random()*20, 1980 + Math.floor(Math.random()*30), "Private", 6 + Math.random()*6, 30 + Math.random()*50, 5000 + Math.random()*15000, ["University Specific Exam", "JEE Main"]));

  // 6. Top State Government Colleges
  const stateGovIds = [
    {n:"Delhi Technological University (DTU)", s:"Delhi", c:"New Delhi"}, {n:"Netaji Subhas University of Technology (NSUT)", s:"Delhi", c:"New Delhi"},
    {n:"Jadavpur University", s:"West Bengal", c:"Kolkata"}, {n:"College of Engineering Pune (COEP)", s:"Maharashtra", c:"Pune"},
    {n:"VJTI Mumbai", s:"Maharashtra", c:"Mumbai"}, {n:"Anna University", s:"Tamil Nadu", c:"Chennai"},
    {n:"PSG College of Technology", s:"Tamil Nadu", c:"Coimbatore"}, {n:"PEC Chandigarh", s:"Chandigarh", c:"Chandigarh"},
    {n:"Osmania University", s:"Telangana", c:"Hyderabad"}, {n:"JNTU Hyderabad", s:"Telangana", c:"Hyderabad"},
    {n:"LD College of Engineering", s:"Gujarat", c:"Ahmedabad"}
  ];
  stateGovIds.forEach(sg => add(sg.n, sg.c, sg.s, 50000 + Math.random()*100000, 4.2 + Math.random()*0.6, 85 + Math.random()*10, 1850 + Math.floor(Math.random()*100), "Government", 8 + Math.random()*6, 40 + Math.random()*40, 4000 + Math.random()*4000, ["State CET", "JEE Main"]));

  // 7. Rajkiya Engineering Colleges (RECs) and others
  const recs = [
    {n:"Rajkiya Engineering College (REC) Bijnor", c:"Bijnor", s:"Uttar Pradesh"},
    {n:"Rajkiya Engineering College (REC) Ambedkar Nagar", c:"Ambedkar Nagar", s:"Uttar Pradesh"},
    {n:"Rajkiya Engineering College (REC) Azamgarh", c:"Azamgarh", s:"Uttar Pradesh"},
    {n:"Rajkiya Engineering College (REC) Banda", c:"Banda", s:"Uttar Pradesh"},
    {n:"Rajkiya Engineering College (REC) Kannauj", c:"Kannauj", s:"Uttar Pradesh"},
    {n:"Rajkiya Engineering College (REC) Mainpuri", c:"Mainpuri", s:"Uttar Pradesh"},
    {n:"Rajkiya Engineering College (REC) Sonbhadra", c:"Sonbhadra", s:"Uttar Pradesh"},
    {n:"Rajkiya Engineering College (REC) Gonda", c:"Gonda", s:"Uttar Pradesh"},
    {n:"Rajkiya Engineering College (REC) Basti", c:"Basti", s:"Uttar Pradesh"}
  ];
  recs.forEach(rec => add(rec.n, rec.c, rec.s, 60000, 3.8 + Math.random()*0.5, 70 + Math.random()*15, 2010 + Math.floor(Math.random()*5), "Government", 4 + Math.random()*2, 10 + Math.random()*10, 1000 + Math.random()*500, ["JEE Main", "UPCET"]));

  return colleges;
};

const reviewsData = [
  { rating: 5, title: "Excellent Institution", content: "World-class faculty and infrastructure.", user_name: "Rahul Sharma" },
  { rating: 4, title: "Great College Experience", content: "Amazing campus life and good academics.", user_name: "Priya Singh" },
  { rating: 4, title: "Good Academics", content: "Strong curriculum and knowledgeable professors.", user_name: "Amit Kumar" },
  { rating: 5, title: "Best Decision of My Life", content: "Choosing this college was the best decision.", user_name: "Sneha Patel" },
  { rating: 3, title: "Average Experience", content: "Decent college with okay infrastructure.", user_name: "Vikram Reddy" },
];

async function seed() {
  const db = await getDb();
  await initializeDatabase(db);

  await run(db, 'DELETE FROM reviews');
  await run(db, 'DELETE FROM saved_colleges');
  await run(db, 'DELETE FROM colleges');

  const generatedColleges = generateColleges();
  
  for (const college of generatedColleges) {
    const result = await queryOne(db, 
      `INSERT INTO colleges (name, location, state, fees, rating, courses, placement_percentage, established_year, type, description, image_url, website, avg_package, highest_package, total_students, accepted_exams)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      [college.name, college.location, college.state, Math.floor(college.fees), college.rating, college.courses, college.placement_percentage, Math.floor(college.established_year), college.type, college.description, college.image_url, college.website, college.avg_package, college.highest_package, Math.floor(college.total_students), college.accepted_exams]
    );

    const collegeId = result.id;

    const numReviews = 1 + Math.floor(Math.random() * 2);
    const shuffled = [...reviewsData].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numReviews; i++) {
      const r = shuffled[i];
      await run(db, 
        `INSERT INTO reviews (college_id, user_name, rating, title, content) VALUES (?, ?, ?, ?, ?)`,
        [collegeId, r.user_name, r.rating, r.title, r.content]
      );
    }
  }

  const finalCount = await queryOne(db, 'SELECT COUNT(*) as cnt FROM colleges');
  console.log(`Successfully seeded ${finalCount.cnt} colleges from across India! Includes all IITs, NITs, IIITs, AKTU colleges, and State/Private institutes.`);
}

seed().catch(console.error);
