import { CVData } from './types';
import utshoPhoto from './assets/utsho_profile.png';

// ─── 1. UTSHO ROY: BACKEND & API ENGINEER CV (Junior & Intern Focus) ─────────
export const utshoBackendCV: CVData = {
  personal: {
    name: 'Utsho Roy',
    title: 'Junior Backend Developer | Backend Engineering Intern',
    email: 'utshoroy5@gmail.com',
    phone: '+880 1797-732899',
    location: 'Mirpur 2, Dhaka, Bangladesh',
    website: 'utsho261.github.io',
    linkedin: 'linkedin.com/in/utshoroy261',
    github: 'github.com/utsho261',
    photo: utshoPhoto,
    summary: 'Computer Science undergraduate student at BUBT (CGPA 3.75) seeking an Internship or Junior Backend Developer position. Skilled in building RESTful APIs using Python, Django, Django REST Framework, and PostgreSQL. Solved 154+ algorithmic problems on Codeforces with a strong foundation in Data Structures and OOP. Passionate about writing clean code, learning new technologies, and contributing to real-world software products.',
  },
  experience: [
    {
      id: 'be-exp-1',
      company: 'CampusConnect (BUBT SDP-400 Project)',
      position: 'Lead Backend Developer',
      startDate: 'Jan 2024',
      endDate: 'Present',
      location: 'Dhaka, Bangladesh',
      bullets: [
        'Developed the backend REST API for a university platform (SDP-400 course project) using Django 5.1 and Django REST Framework',
        'Implemented secure user login and role-based permissions (Student, Faculty, Admin) using SimpleJWT',
        'Designed PostgreSQL database models and optimized queries, making API response times 35% faster',
        'Tested and documented all API endpoints with Postman for smooth frontend integration',
      ],
    },
    {
      id: 'be-exp-2',
      company: 'Ostad Platform',
      position: 'Backend Engineering Fellow (Trainee)',
      startDate: 'Jan 2025',
      endDate: 'Jan 2026',
      location: 'Dhaka, Bangladesh',
      bullets: [
        'Completed practical training on Python, Django, DRF, relational databases, and scalable system design',
        'Built an enterprise Hospital Management API with appointment booking, doctor schedules, and billing',
        'Used Celery and Redis to handle background tasks like calculating bills and generating reports',
      ],
    },
    {
      id: 'be-exp-3',
      company: 'Independent Software Projects',
      position: 'Python Backend Developer',
      startDate: 'Jun 2023',
      endDate: 'Present',
      location: 'Dhaka, Bangladesh',
      bullets: [
        'Built a RESTful personal finance API using Flask and MongoDB, implementing secure JWT authentication and dynamic expense analytics',
        'Containerized backend services with Docker and Docker Compose to ensure consistent local development and isolated test environments',
        'Strengthened API security and reliability by enforcing strict CORS policies, request rate limiting, and robust input validation',
      ],
    },
  ],
  education: [
    {
      id: 'be-edu-1',
      institution: 'Bangladesh University of Business and Technology (BUBT)',
      degree: 'Bachelor of Science (B.Sc.)',
      field: 'Computer Science & Engineering (CSE)',
      startDate: '2021',
      endDate: 'Present (Running Student)',
      gpa: '3.75 / 4.00',
      honors: 'SDP-400 Lead: CampusConnect, Competitive Programming Squad',
    },
    {
      id: 'be-edu-2',
      institution: 'Collectorate Public College, Nilphamari',
      degree: 'Higher Secondary Certificate (HSC)',
      field: 'Science (Higher Math & Physics)',
      startDate: '2019',
      endDate: '2021',
      gpa: '5.00',
      honors: 'Golden A+, Academic Excellence Award',
    },
  ],
  skills: [
    {
      id: 'be-skill-0',
      category: 'Programming Languages',
      items: ['Python', 'Java', 'C', 'C++'],
    },
    {
      id: 'be-skill-1',
      category: 'Backend & Frameworks',
      items: ['Django 5', 'Django REST Framework', 'FastAPI', 'Flask', 'REST APIs', 'SimpleJWT', 'Celery', 'Redis'],
    },
    {
      id: 'be-skill-2',
      category: 'Databases & ORM',
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Django ORM', 'Database Indexing', 'Query Optimization'],
    },
    {
      id: 'be-skill-3',
      category: 'Tools & DevOps',
      items: ['Git & GitHub', 'Postman', 'Docker (Basics)', 'Linux / Bash', 'Swagger / OpenAPI'],
    },
    {
      id: 'be-skill-4',
      category: 'Problem Solving & CS',
      items: ['Codeforces (154+ Solved)', 'Algorithms & Data Structures', 'OOP', 'Pytest'],
    },
  ],
  projects: [
    {
      id: 'be-proj-1',
      name: 'CampusConnect — University Platform (BUBT SDP-400)',
      description: 'A decoupled university community platform developed as a BUBT SDP-400 course project. Built with Django REST Framework backend and React frontend. Features user authentication, academic resources, club events, and a blood donation network.',
      technologies: ['Django 5.1', 'DRF', 'Python', 'PostgreSQL', 'SimpleJWT', 'React 19'],
      url: 'github.com/utsho261/CampusConnect',
    },
    {
      id: 'be-proj-2',
      name: 'Hospital Management System (Healthcare REST API)',
      description: 'A hospital backend REST API with 4 user roles (Admin, Doctor, Patient, Receptionist). Includes appointment booking, doctor schedules, and billing calculation pipelines.',
      technologies: ['Python', 'Django 5', 'DRF', 'SimpleJWT', '4-Tier RBAC', 'PostgreSQL'],
      url: 'github.com/utsho261/hospital_management',
    },
    {
      id: 'be-proj-3',
      name: 'Smart Expense Tracker & Financial Analytics API',
      description: 'A personal finance web app that tracks daily expenses and income. Features category filtering, budget limits, and interactive spending charts.',
      technologies: ['Python', 'Flask', 'MongoDB', 'JWT Auth', 'REST API', 'Chart.js'],
      url: 'github.com/utsho261/smart-expense-tracker',
    },
  ],
  certifications: [
    {
      id: 'be-cert-1',
      name: 'Full Stack Web Development (Python, Django & React)',
      issuer: 'Ostad Platform',
      date: 'Jan 2026',
    },
    {
      id: 'be-cert-2',
      name: '154+ Algorithmic Problems Solved (Max Rating: 956)',
      issuer: 'Codeforces (@UtshoRoy)',
      date: '2024',
    },
  ],
  languages: [],
};

// ─── 2. UTSHO ROY: NATIVE ANDROID DEVELOPER CV (Optimized for 1-Page) ─────────
export const utshoAndroidCV: CVData = {
  personal: {
    name: 'Utsho Roy',
    title: 'Native Android Developer | Mobile Application Engineer',
    email: 'utshoroy5@gmail.com',
    phone: '+880 1797-732899',
    location: 'Mirpur 2, Dhaka, Bangladesh',
    website: 'utsho261.github.io',
    linkedin: 'linkedin.com/in/utshoroy261',
    github: 'github.com/utsho261',
    photo: utshoPhoto,
    summary: 'Native Android Developer with a strong CS foundation from BUBT. Specialized in architecting offline-first mobile apps using Native Android (Java), Android SDK, and Jetpack components. Extensive experience implementing location-aware systems via Google Maps SDK, live messaging with Firebase Realtime DB & FCM, and caching with SQLite/Room DB. Competitive programmer with 154+ Codeforces solutions.',
  },
  experience: [
    {
      id: 'and-exp-1',
      company: 'Town Crier BD',
      position: 'Lead Native Android Developer',
      startDate: 'Mar 2022',
      endDate: 'Present',
      location: 'Dhaka, Bangladesh',
      bullets: [
        'Engineered Town Crier BD hyperlocal emergency broadcast Android application connecting local communities with real-time incident alerts',
        'Integrated Google Maps Android SDK with customized proximity radar pinning, location clustering, and real-time geospatial radius calculation',
        'Implemented Firebase Realtime Database and FCM high-priority notification channels for sub-second emergency hazard broadcast delivery',
        'Created custom Android notification channels and background receiver services ensuring alert delivery even when app is killed',
      ],
    },
    {
      id: 'and-exp-2',
      company: 'DescoSmartApp & Mobile Utility Automation',
      position: 'Native Android Engineer',
      startDate: 'Jan 2023',
      endDate: 'Dec 2024',
      location: 'Dhaka, Bangladesh',
      bullets: [
        'Architected DescoSmartApp for Dhaka electricity prepaid customers, automating periodic background meter balance queries via Android WorkManager',
        'Engineered offline-first SQLite / Room database caching to display historical recharge logs and consumption trends without active internet',
        'Optimized memory allocation and UI thread rendering for budget Android devices running low-RAM configurations',
      ],
    },
    {
      id: 'and-exp-3',
      company: 'Independent Mobile Application Projects',
      position: 'Android & Mobile Systems Developer',
      startDate: 'Jan 2022',
      endDate: 'Present',
      location: 'Dhaka, Bangladesh',
      bullets: [
        'Built responsive native XML UI layouts following Material Design 3 guidelines across various screen densities and orientations',
        'Integrated RESTful web services via OkHttp and JSON serialization with robust error handling for intermittent mobile network connectivity',
        'Implemented local encryption and secure SharedPreferences for caching user credentials and biometric preferences',
      ],
    },
  ],
  education: [
    {
      id: 'and-edu-1',
      institution: 'Bangladesh University of Business and Technology (BUBT)',
      degree: 'Bachelor of Science (B.Sc.)',
      field: 'Computer Science & Engineering (CSE)',
      startDate: '2021',
      endDate: 'Present',
      gpa: '3.75',
      honors: 'Mobile Systems Engineering, Competitive Programming Squad',
    },
    {
      id: 'and-edu-2',
      institution: 'Collectorate Public College, Nilphamari',
      degree: 'Higher Secondary Certificate (HSC)',
      field: 'Science (Higher Math & Physics)',
      startDate: '2019',
      endDate: '2021',
      gpa: '5.00',
      honors: 'Golden A+, Academic Excellence Award',
    },
  ],
  skills: [
    {
      id: 'and-skill-1',
      category: 'Android & Mobile Development',
      items: ['Native Android (Java)', 'Android SDK', 'Android Jetpack', 'Activities & Fragments', 'Material Design 3', 'XML Layouts', 'Background Services'],
    },
    {
      id: 'and-skill-2',
      category: 'Firebase & Cloud Services',
      items: ['Firebase Realtime DB', 'Firebase Cloud Messaging (FCM)', 'Google Maps Android API', 'Geolocation & GPS Tracking', 'Cloudinary CDN'],
    },
    {
      id: 'and-skill-3',
      category: 'Storage & Networking',
      items: ['SQLite', 'Room DB', 'SharedPreferences', 'Offline-First Architecture', 'OkHttp', 'REST API Client', 'WorkManager'],
    },
    {
      id: 'and-skill-4',
      category: 'Tools & CS Foundations',
      items: ['Android Studio', 'Gradle Build System', 'Git & GitHub', 'Logcat & Debugging', 'Codeforces (154+ Solved)', 'Data Structures & OOP'],
    },
  ],
  projects: [
    {
      id: 'and-proj-1',
      name: 'Town Crier BD — Hyperlocal Emergency Geo-Broadcast System',
      description: 'Hyperlocal emergency broadcast mobile application featuring Google Maps proximity radar pinning, Cloudinary media CDN, and low-latency Firebase FCM push notifications.',
      technologies: ['Android (Java)', 'Google Maps API', 'Firebase Realtime DB', 'Cloudinary API', 'Firebase FCM'],
      url: 'github.com/utsho261/TownCrierBD',
    },
    {
      id: 'and-proj-2',
      name: 'DescoSmartApp — Smart Electricity Meter Automation',
      description: 'Smart utility Android application for DESCO prepaid electricity customers in Dhaka. Automates background meter balance synchronization, WorkManager background checks, and low-balance warnings.',
      technologies: ['Android (Java)', 'Background Services', 'WorkManager', 'SQLite / Room Caching'],
      url: 'github.com/utsho261/DescoSmartApp',
    },
    {
      id: 'and-proj-3',
      name: 'Real-Time Geo-Proximity Messenger',
      description: 'Location-aware mobile application allowing users to broadcast alerts to nearby community members within an adjustable kilometer radius with real-time push synchronization.',
      technologies: ['Native Android (Java)', 'Google Play Location Services', 'Firebase Realtime DB', 'FCM'],
      url: 'github.com/utsho261',
    },
  ],
  certifications: [
    {
      id: 'and-cert-1',
      name: '154+ Algorithmic Problems Solved (Max Rating: 956)',
      issuer: 'Codeforces (@UtshoRoy)',
      date: '2024',
    },
    {
      id: 'and-cert-2',
      name: 'Full Stack Web & Mobile Development Track',
      issuer: 'Ostad Platform',
      date: 'Jan 2026',
    },
  ],
  languages: [
    { id: 'and-lang-1', language: 'Bengali', level: 'Native' },
    { id: 'and-lang-2', language: 'English', level: 'Professional Working Proficiency' },
  ],
};

// Default sampleData points to the Backend CV
export const sampleData: CVData = utshoBackendCV;

export const emptyData: CVData = {
  personal: { name: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '', photo: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};
