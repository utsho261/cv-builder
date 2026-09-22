import { CVData } from './types';
import { sampleData, utshoBackendCV, utshoAndroidCV, emptyData } from './sampleData';

export interface PresetProfile {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  data: CVData;
}

export const softwareEngineerData: CVData = {
  personal: {
    name: 'Marcus Vance',
    title: 'Staff Software Engineer & Distributed Systems Architect',
    email: 'marcus.vance@techdev.io',
    phone: '+1 (512) 555-0842',
    location: 'Austin, TX',
    website: 'marcusvance.dev',
    linkedin: 'linkedin.com/in/marcusvance',
    github: 'github.com/marcusvance',
    photo: '',
    summary: 'Distributed systems engineer with 10+ years designing high-throughput backends processing over 500k requests/sec. Core contributor to high-performance microservices, event streaming, and cloud infrastructure with 99.999% SLA reliability.',
  },
  experience: [
    {
      id: 'swe-1',
      company: 'Datadog',
      position: 'Staff Infrastructure Engineer',
      startDate: 'Feb 2021',
      endDate: 'Present',
      location: 'Austin, TX',
      bullets: [
        'Architected real-time log ingestion pipeline handling 1.8M events/sec, cutting cloud infrastructure costs by $1.4M annually',
        'Spearheaded migration of 140+ microservices to Kubernetes with zero downtime and automated canary deployments',
        'Engineered distributed caching layer in Go and Redis, reducing p99 latency by 42% across core query endpoints',
        'Mentored 12 junior and senior engineers and authored engineering-wide distributed systems design RFCs',
      ],
    },
    {
      id: 'swe-2',
      company: 'Twilio',
      position: 'Senior Backend Engineer',
      startDate: 'Aug 2017',
      endDate: 'Jan 2021',
      location: 'San Francisco, CA',
      bullets: [
        'Led messaging core engine delivering 800M+ SMS/day with strict 99.999% SLA uptime guarantee',
        'Optimized PostgreSQL partitioning and connection pooling, mitigating database connection saturation spikes during flash events',
        'Implemented end-to-end telemetry and OpenTelemetry tracing across asynchronous Kafka message pipelines',
      ],
    },
  ],
  education: [
    {
      id: 'edu-swe-1',
      institution: 'University of Texas at Austin',
      degree: 'Master of Science',
      field: 'Computer Engineering',
      startDate: '2012',
      endDate: '2014',
      gpa: '3.94',
      honors: 'Systems Engineering Research Fellow',
    },
  ],
  skills: [
    {
      id: 's-lang',
      category: 'Languages',
      items: ['Go', 'TypeScript', 'Rust', 'Python', 'Java', 'SQL', 'Bash'],
    },
    {
      id: 's-infra',
      category: 'Cloud & Infrastructure',
      items: ['Kubernetes', 'Docker', 'AWS (EKS, RDS, S3)', 'Terraform', 'Kafka', 'gRPC', 'Redis', 'PostgreSQL'],
    },
  ],
  projects: [
    {
      id: 'p-1',
      name: 'StreamMesh — Ultra-low latency Event Broker',
      description: 'Open-source distributed pub/sub broker written in Rust benchmarking 2.5x throughput compared to Apache Kafka for lightweight event routing.',
      technologies: ['Rust', 'Tokio', 'Raft Consensus', 'gRPC'],
      url: 'github.com/marcusvance/streammesh',
    },
  ],
  certifications: [
    {
      id: 'c-1',
      name: 'AWS Certified Solutions Architect — Professional',
      issuer: 'Amazon Web Services',
      date: '2023',
    },
  ],
  languages: [
    { id: 'l-1', language: 'English', level: 'Native' },
  ],
};

export const productManagerData: CVData = {
  personal: {
    name: 'Alexandra Chen',
    title: 'Senior Product Manager',
    email: 'alexandra.chen@email.com',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    website: 'alexandrachen.com',
    linkedin: 'linkedin.com/in/alexandrachen',
    github: 'github.com/alexchen',
    photo: '',
    summary: 'Results-driven Product Manager with 8+ years of experience launching consumer and enterprise products at scale. Proven track record of growing revenue by 40% YoY through data-informed strategy and cross-functional leadership. Expert in agile methodologies, user research, and roadmap prioritization.',
  },
  experience: [
    {
      id: 'pm-1',
      company: 'Stripe',
      position: 'Senior Product Manager, Payments Infrastructure',
      startDate: 'Jan 2021',
      endDate: 'Present',
      location: 'San Francisco, CA',
      bullets: [
        "Led product strategy for Stripe's core payments infrastructure serving 2M+ businesses, driving $4.2B in annual processing volume",
        'Shipped 12 major product releases per year, reducing payment failure rates by 23% through ML-powered retry logic',
        'Managed cross-functional team of 18 engineers, designers, and analysts across 3 time zones',
      ],
    },
  ],
  education: [
    {
      id: 'edu-pm-1',
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2014',
      endDate: '2016',
      gpa: '3.9',
      honors: "Dean's List, Graduate Fellowship",
    },
  ],
  skills: [
    {
      id: 'pm-s1',
      category: 'Product Strategy',
      items: ['Roadmap Planning', 'OKR Frameworks', 'Go-to-Market Strategy', 'Pricing Strategy', 'User Research'],
    },
  ],
  projects: [
    {
      id: 'pm-p1',
      name: 'PayFlow — Open Source Payment SDK',
      description: 'Developed and maintained open-source payment integration library with 2,400+ GitHub stars and 180+ contributors worldwide.',
      technologies: ['TypeScript', 'Node.js', 'React'],
      url: 'github.com/alexchen/payflow',
    },
  ],
  certifications: [
    {
      id: 'pm-c1',
      name: 'Certified Scrum Product Owner (CSPO)',
      issuer: 'Scrum Alliance',
      date: 'Mar 2022',
    },
  ],
  languages: [
    { id: 'pm-l1', language: 'English', level: 'Native' },
  ],
};

export const googleSeniorSweData: CVData = {
  personal: {
    name: 'David Zhang',
    title: 'Senior Software Engineer — Distributed Systems & AI Infrastructure',
    email: 'david.zhang@techcloud.org',
    phone: '+1 (650) 555-0149',
    location: 'Mountain View, CA',
    website: 'davidzhang.tech',
    linkedin: 'linkedin.com/in/davidzhang-swe',
    github: 'github.com/davidzhang',
    photo: '',
    summary: 'Senior Software Engineer with 8+ years designing high-availability distributed systems at hyper-scale. Specialist in low-latency RPC networks, automated cluster management, and machine learning model serving infrastructure with 99.999% SLA reliability.',
  },
  experience: [
    {
      id: 'goog-1',
      company: 'Google',
      position: 'Senior Software Engineer (L5), Core Infrastructure',
      startDate: 'Feb 2021',
      endDate: 'Present',
      location: 'Sunnyvale, CA',
      bullets: [
        'Accomplished 38% reduction in p99 query latency for 450M daily active users by re-architecting distributed RPC caching layer using Go and gRPC',
        'Cut global cloud compute spend by $2.4M annually by implementing intelligent GPU pod bin-packing and predictive autoscaling on Borg/Kubernetes',
        'Spearheaded zero-downtime database migration across 8 global availability zones, transferring 14PB of active storage with 99.999% SLA uptime',
        'Authored 5 engineering-wide design RFCs and mentored 6 engineers across distributed systems and concurrency best practices',
      ],
    },
    {
      id: 'goog-2',
      company: 'Stripe',
      position: 'Software Engineer, Core Payments Infrastructure',
      startDate: 'Aug 2017',
      endDate: 'Jan 2021',
      location: 'San Francisco, CA',
      bullets: [
        'Increased transactional throughput by 52% (surpassing 25,000 TPS) by rewriting idempotency engine in Rust and Redis',
        'Automated end-to-end integration testing suite, reducing CI build wait times by 40 minutes per developer deployment cycle',
        'Built real-time anomaly detection pipelines processing $12B+ in annual transaction volume with zero false-positive payment blocks',
      ],
    },
  ],
  education: [
    {
      id: 'edu-goog-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science & Mathematics',
      startDate: '2013',
      endDate: '2017',
      gpa: '3.92',
      honors: 'EECS Honors Scholar, Magna Cum Laude',
    },
  ],
  skills: [
    {
      id: 'g-lang',
      category: 'Languages',
      items: ['Go', 'C++', 'Rust', 'Python', 'TypeScript', 'SQL', 'Bash'],
    },
    {
      id: 'g-sys',
      category: 'Systems & Cloud',
      items: ['Kubernetes', 'Borg', 'gRPC', 'Protobuf', 'Kafka', 'Redis', 'Envoy', 'Linux eBPF', 'Terraform'],
    },
    {
      id: 'g-data',
      category: 'Distributed Databases',
      items: ['Google Cloud Spanner', 'Bigtable', 'PostgreSQL', 'CockroachDB', 'DynamoDB'],
    },
  ],
  projects: [
    {
      id: 'g-p1',
      name: 'RPC-Mesh — Ultra-Low Latency Service Mesh',
      description: 'Open-source Envoy-compatible sidecar proxy written in Rust benchmarked at sub-100µs mediation latency with zero memory footprint leaks.',
      technologies: ['Rust', 'Tokio', 'eBPF', 'gRPC'],
      url: 'github.com/davidzhang/rpc-mesh',
    },
  ],
  certifications: [
    {
      id: 'g-c1',
      name: 'Google Cloud Certified Professional Cloud Architect',
      issuer: 'Google Cloud',
      date: '2023',
    },
    {
      id: 'g-c2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Linux Foundation / CNCF',
      date: '2022',
    },
  ],
  languages: [
    { id: 'g-l1', language: 'English', level: 'Native' },
    { id: 'g-l2', language: 'Mandarin', level: 'Professional' },
  ],
};

export const microsoftArchitectData: CVData = {
  personal: {
    name: 'Elena Rostova',
    title: 'Principal Cloud Solutions Architect — Enterprise Azure',
    email: 'elena.rostova@enterprisecloud.io',
    phone: '+1 (425) 555-0812',
    location: 'Redmond, WA',
    website: 'elenarostova.dev',
    linkedin: 'linkedin.com/in/elena-rostova-cloud',
    github: 'github.com/erostova',
    photo: '',
    summary: 'Principal Enterprise Cloud Architect with 12+ years directing large-scale Azure cloud transformations, sovereign landing zones, and generative AI enterprise integrations for Fortune 100 institutions. Proven success saving $10M+ in cloud TCO.',
  },
  experience: [
    {
      id: 'msft-1',
      company: 'Microsoft',
      position: 'Principal Cloud Solutions Architect, Enterprise Commercial',
      startDate: 'Jan 2020',
      endDate: 'Present',
      location: 'Redmond, WA',
      bullets: [
        'Orchestrated cloud modernization strategy for Fortune 50 banking customer migrating 4,200 workloads to Azure, driving 34% TCO reduction over 3 years',
        'Designed sovereign multi-tenant Azure landing zone architecture meeting strict FedRAMP High, HIPAA, and SOC2 Type II compliance standards',
        'Accelerated enterprise Copilot integration across 14 business units, unlocking $12M in annual productivity gains through Azure OpenAI Service',
        'Recognized with Microsoft Platinum Circle of Excellence award for delivering top 1% enterprise architecture impact worldwide',
      ],
    },
    {
      id: 'msft-2',
      company: 'Accenture',
      position: 'Senior Manager, Cloud Strategy & Enterprise Architecture',
      startDate: 'May 2015',
      endDate: 'Dec 2019',
      location: 'Seattle, WA',
      bullets: [
        'Led delivery team of 24 cloud architects in executing complex hybrid cloud transitions across aerospace and financial services sectors',
        'Implemented automated DevSecOps pipelines with GitHub Enterprise and Bicep, shrinking deployment cycles from 6 weeks to daily continuous releases',
        'Directed disaster recovery resilience programs ensuring RPO < 5 minutes and RTO < 15 minutes across multi-region active-active deployments',
      ],
    },
  ],
  education: [
    {
      id: 'edu-msft-1',
      institution: 'University of Washington',
      degree: 'Master of Science',
      field: 'Information Systems Management',
      startDate: '2013',
      endDate: '2015',
      gpa: '3.95',
      honors: 'Foster School Graduate Scholar, Beta Gamma Sigma',
    },
  ],
  skills: [
    {
      id: 'ms-plat',
      category: 'Cloud Architecture',
      items: ['Microsoft Azure (AKS, Cosmos DB, Front Door)', 'Azure OpenAI Service', 'Hybrid Cloud', 'Bicep', 'ARM Templates', 'Terraform'],
    },
    {
      id: 'ms-arch',
      category: 'Enterprise Frameworks',
      items: ['Microsoft Well-Architected Framework', 'TOGAF 9.2', 'Zero Trust Security', 'Microservices', 'Event-Driven Architecture', 'FinOps'],
    },
    {
      id: 'ms-ops',
      category: 'DevOps & Tooling',
      items: ['GitHub Enterprise', 'Azure DevOps', 'PowerShell', 'C# .NET', 'Docker', 'Kubernetes'],
    },
  ],
  projects: [
    {
      id: 'ms-p1',
      name: 'Azure Enterprise Landing Zone Accelerator',
      description: 'Modular Infrastructure-as-Code framework deployed across 40+ enterprise subscriptions with automated security policy guardrails and cost controls.',
      technologies: ['Bicep', 'Azure Policy', 'GitHub Actions', 'PowerShell'],
      url: 'github.com/erostova/azure-landing-zone-accelerator',
    },
  ],
  certifications: [
    {
      id: 'ms-c1',
      name: 'Microsoft Certified: Azure Solutions Architect Expert (AZ-305)',
      issuer: 'Microsoft',
      date: '2024',
    },
    {
      id: 'ms-c2',
      name: 'Microsoft Certified: Azure DevOps Engineer Expert (AZ-400)',
      issuer: 'Microsoft',
      date: '2023',
    },
    {
      id: 'ms-c3',
      name: 'Microsoft Certified: Cybersecurity Architect Expert (SC-100)',
      issuer: 'Microsoft',
      date: '2023',
    },
  ],
  languages: [
    { id: 'ms-l1', language: 'English', level: 'Native' },
    { id: 'ms-l2', language: 'German', level: 'Professional' },
  ],
};

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'utsho-backend',
    name: 'Utsho Roy (Backend)',
    role: 'Backend & API Engineer (Python & Django)',
    avatarBg: '#059669',
    data: utshoBackendCV,
  },
  {
    id: 'utsho-android',
    name: 'Utsho Roy (Android)',
    role: 'Native Android Developer (Java & Mobile)',
    avatarBg: '#D6431F',
    data: utshoAndroidCV,
  },
  {
    id: 'google-swe',
    name: 'David Zhang',
    role: 'Google Senior SWE (XYZ)',
    avatarBg: '#1A73E8',
    data: googleSeniorSweData,
  },
  {
    id: 'msft-arch',
    name: 'Elena Rostova',
    role: 'Microsoft Cloud Architect',
    avatarBg: '#0078D4',
    data: microsoftArchitectData,
  },
  {
    id: 'swe',
    name: 'Marcus Vance',
    role: 'Staff Software / Distributed Systems',
    avatarBg: '#2563EB',
    data: softwareEngineerData,
  },
  {
    id: 'pm',
    name: 'Alexandra Chen',
    role: 'Product Management',
    avatarBg: '#7C3AED',
    data: productManagerData,
  },
];

export function formatCVAsPlainText(data: CVData): string {
  const lines: string[] = [];

  // Header
  lines.push(data.personal.name.toUpperCase());
  if (data.personal.title) lines.push(data.personal.title);
  
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.linkedin,
    data.personal.website,
    data.personal.github,
  ].filter(Boolean);

  if (contacts.length > 0) {
    lines.push(contacts.join(' | '));
  }
  lines.push('--------------------------------------------------');
  lines.push('');

  // Summary
  if (data.personal.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push(data.personal.summary);
    lines.push('');
  }

  // Experience
  if (data.experience.length > 0) {
    lines.push('WORK EXPERIENCE');
    data.experience.forEach(exp => {
      lines.push(`${exp.position.toUpperCase()} — ${exp.company}`);
      lines.push(`${exp.startDate} – ${exp.endDate}${exp.location ? ` | ${exp.location}` : ''}`);
      exp.bullets.forEach(b => lines.push(`• ${b}`));
      lines.push('');
    });
  }

  // Education
  if (data.education.length > 0) {
    lines.push('EDUCATION');
    data.education.forEach(edu => {
      lines.push(`${edu.degree}${edu.field ? `, ${edu.field}` : ''}`);
      lines.push(`${edu.institution} (${edu.startDate} – ${edu.endDate})`);
      if (edu.gpa || edu.honors) {
        lines.push([edu.gpa && `GPA: ${edu.gpa}`, edu.honors].filter(Boolean).join(' | '));
      }
      lines.push('');
    });
  }

  // Skills
  if (data.skills.length > 0) {
    lines.push('SKILLS');
    data.skills.forEach(s => {
      lines.push(`${s.category}: ${s.items.join(', ')}`);
    });
    lines.push('');
  }

  // Projects
  if (data.projects.length > 0) {
    lines.push('PROJECTS');
    data.projects.forEach(p => {
      lines.push(`${p.name}${p.url ? ` (${p.url})` : ''}`);
      if (p.technologies.length > 0) lines.push(`Technologies: ${p.technologies.join(', ')}`);
      lines.push(p.description);
      lines.push('');
    });
  }

  // Certifications
  if (data.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    data.certifications.forEach(c => {
      lines.push(`${c.name} — ${c.issuer} (${c.date})`);
    });
    lines.push('');
  }

  // Languages
  if (data.languages.length > 0) {
    lines.push('LANGUAGES');
    lines.push(data.languages.map(l => `${l.language} (${l.level})`).join(', '));
    lines.push('');
  }

  return lines.join('\n');
}
