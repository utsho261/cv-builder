import { CVData } from './types';
import utshoPhoto from './assets/utsho_profile.png';

// ─── 1. UTSHO ROY: BACKEND & API ENGINEER CV (Optimized for 1-Page) ───────────
export const utshoBackendCV: CVData = {
  personal: {
    name: 'Utsho Roy',
    title: 'Backend & API Engineer | Python & Django Specialist',
    email: 'utshoroy5@gmail.com',
    phone: '+880 1797-732899',
    location: 'Mirpur 2, Dhaka, Bangladesh',
    website: 'utsho261.github.io',
    linkedin: 'linkedin.com/in/utshoroy261',
    github: 'github.com/utsho261',
    photo: utshoPhoto,
    summary: 'Backend & API Engineer with a solid Computer Science foundation from BUBT. Specialized in architecting high-throughput Django REST APIs, relational database schemas (PostgreSQL, MySQL), and Celery distributed queues. Experienced in stateless SimpleJWT auth, 4-tier RBAC security, and query tuning cutting latency by 35%. Active competitive programmer with 154+ verified Codeforces solutions.',
  },
  experience: [
    {
      id: 'be-exp-1',
      company: 'CampusConnect (BUBT Capstone Project)',
      position: 'Lead Backend Engineer',
      startDate: 'Jan 2023',
      endDate: 'Present',
      location: 'Dhaka, Bangladesh',
      bullets: [
        'Architected decoupled REST API backend powering university campus platform, supporting high-throughput student & faculty requests using Django 5.1 & DRF',
        'Engineered stateless JWT authentication (SimpleJWT) with granular Role-Based Access Control (RBAC) across student, faculty, and administrative tiers',
        'Optimized PostgreSQL schema with B-tree indexing, foreign key constraints, and select_related query tuning, slashing database latency by 35%',
        'Integrated automated API documentation with Swagger/OpenAPI and configured modular Django app architecture ensuring rapid maintainability',
      ],
    },
    {
      id: 'be-exp-2',
      company: 'Ostad Platform',
      position: 'Backend Engineering Fellow (Python & Django)',
      startDate: 'Jan 2025',
      endDate: 'Jan 2026',
      location: 'Dhaka, Bangladesh',
      bullets: [
        'Engineered Hospital Management System backend featuring 4-Tier RBAC, nested writable serializers, and Celery distributed task queues with Redis broker',
        'Constructed automated unit tests and integration test suites using Pytest and Postman, ensuring robust API reliability across billing pipelines',
        'Designed asynchronous PDF prescription & billing statement generation pipelines offloading long-running calculation workloads from web threads',
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
        'Developed lightweight microservices utilizing FastAPI and Flask with MongoDB and SQLite for rapid prototype deployments',
        'Implemented API security best practices including CORS policy controls, rate limiting, and parameter validation sanitizing incoming payloads',
        'Streamlined local development and testing workflows with Docker containers and Docker Compose multi-service environments',
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
      endDate: 'Present',
      gpa: '3.75',
      honors: 'Capstone Lead: CampusConnect, Competitive Programming Squad',
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
      id: 'be-skill-1',
      category: 'Backend & Frameworks',
      items: ['Python 3', 'Django 5', 'Django REST Framework', 'FastAPI', 'Flask', 'REST APIs', 'SimpleJWT', 'Celery', 'Redis'],
    },
    {
      id: 'be-skill-2',
      category: 'Databases & Performance',
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Django ORM', 'Database Indexing', 'Query Optimization', 'RBAC Security'],
    },
    {
      id: 'be-skill-3',
      category: 'DevOps & Architecture',
      items: ['Git & GitHub', 'Docker Basics', 'Linux / Bash', 'Nginx Config', 'React 19 Integration', 'RESTful System Design'],
    },
    {
      id: 'be-skill-4',
      category: 'Problem Solving & CS',
      items: ['Codeforces (154+ Solved)', 'Algorithms & Data Structures', 'OOP', 'Pytest', 'Postman'],
    },
  ],
  projects: [
    {
      id: 'be-proj-1',
      name: 'CampusConnect — Full-Stack University Platform',
      description: 'Decoupled campus academic & social platform backend engineered with Django 5.1 & DRF, serving React 19 frontend with stateless SimpleJWT security and optimized PostgreSQL transactions.',
      technologies: ['Django 5.1', 'DRF', 'Python', 'PostgreSQL', 'SimpleJWT', 'React 19'],
      url: 'github.com/utsho261/CampusConnect',
    },
    {
      id: 'be-proj-2',
      name: 'Hospital Management System (API Architecture)',
      description: 'Enterprise healthcare backend REST API with strict 4-Tier RBAC, nested multi-drug prescription serializers, and Celery asynchronous billing calculation pipelines.',
      technologies: ['Python', 'Django 5', 'DRF', 'SimpleJWT', '4-Tier RBAC', 'PostgreSQL'],
      url: 'github.com/utsho261/hospital_management',
    },
    {
      id: 'be-proj-3',
      name: 'Smart Expense Tracker & Financial Analytics API',
      description: 'Personal finance budget tracker and visualization web API built with Flask and MongoDB. Features granular expense categorization and interactive Chart.js analytics.',
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
  languages: [
    { id: 'be-lang-1', language: 'Bengali', level: 'Native' },
    { id: 'be-lang-2', language: 'English', level: 'Professional Working Proficiency' },
  ],
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
