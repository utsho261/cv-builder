import { CVData } from './types';

export interface ATSCheckItem {
  id: string;
  category: 'Contact' | 'Summary' | 'Experience' | 'Skills' | 'Education';
  label: string;
  passed: boolean;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface ATSAnalysis {
  score: number;
  grade: 'Excellent' | 'Good' | 'Needs Work';
  color: string;
  strengths: string[];
  suggestions: string[];
  checks: ATSCheckItem[];
  quantifiableCount: number;
  actionVerbCount: number;
}

const ACTION_VERBS = [
  'led', 'spearheaded', 'managed', 'developed', 'designed', 'built', 'created',
  'engineered', 'launched', 'optimized', 'scaled', 'increased', 'reduced',
  'improved', 'shipped', 'achieved', 'established', 'automated', 'streamlined',
  'orchestrated', 'implemented', 'mentored', 'directed', 'formulated', 'drove'
];

export function analyzeCV(data: CVData): ATSAnalysis {
  const checks: ATSCheckItem[] = [];
  const strengths: string[] = [];
  const suggestions: string[] = [];

  // 1. Contact checks
  const hasName = Boolean(data.personal.name?.trim());
  const hasTitle = Boolean(data.personal.title?.trim());
  const hasEmail = Boolean(data.personal.email?.includes('@'));
  const hasPhone = Boolean(data.personal.phone?.trim());
  const hasLocation = Boolean(data.personal.location?.trim());
  const hasLinkedIn = Boolean(data.personal.linkedin?.trim());

  const contactScore =
    (hasName ? 5 : 0) +
    (hasTitle ? 4 : 0) +
    (hasEmail ? 5 : 0) +
    (hasPhone ? 4 : 0) +
    (hasLocation ? 4 : 0) +
    (hasLinkedIn ? 3 : 0);

  checks.push({
    id: 'contact',
    category: 'Contact',
    label: 'Contact Information & Links',
    passed: contactScore >= 20,
    score: contactScore,
    maxScore: 25,
    feedback: !hasEmail
      ? 'Add a valid email address so recruiters can reach you.'
      : !hasLinkedIn
      ? 'Adding a LinkedIn profile significantly boosts ATS recruiter matching.'
      : 'Contact details are complete and ATS-compliant.',
  });

  if (hasLinkedIn && hasEmail && hasPhone) {
    strengths.push('Comprehensive contact & profile links provided');
  } else {
    if (!hasLinkedIn) suggestions.push('Add your LinkedIn profile link to improve recruiter confidence');
    if (!hasPhone) suggestions.push('Include a contact phone number');
  }

  // 2. Summary check
  const summary = data.personal.summary?.trim() || '';
  const summaryLength = summary.length;
  let summaryScore = 0;
  if (summaryLength >= 100 && summaryLength <= 500) {
    summaryScore = 15;
    strengths.push('Ideal professional summary length (100–500 characters)');
  } else if (summaryLength > 500) {
    summaryScore = 10;
    suggestions.push('Shorten summary to under 500 characters for optimal recruiter skimmability');
  } else if (summaryLength > 30) {
    summaryScore = 8;
    suggestions.push('Expand professional summary to 2–4 sentences detailing your value proposition');
  } else {
    summaryScore = 0;
    suggestions.push('Add a professional summary section summarizing your career achievements');
  }

  checks.push({
    id: 'summary',
    category: 'Summary',
    label: 'Professional Summary',
    passed: summaryScore >= 10,
    score: summaryScore,
    maxScore: 15,
    feedback:
      summaryScore >= 10
        ? 'Well-crafted summary highlighting core competencies.'
        : 'A concise 2–3 sentence career summary is recommended for ATS parsing.',
  });

  // 3. Experience & Bullet Points analysis
  const expCount = data.experience.length;
  let expScore = 0;
  let actionVerbCount = 0;
  let quantifiableCount = 0;

  data.experience.forEach(exp => {
    exp.bullets.forEach(bullet => {
      const bLower = bullet.toLowerCase();
      // Check action verbs
      if (ACTION_VERBS.some(v => bLower.startsWith(v) || bLower.includes(` ${v} `))) {
        actionVerbCount++;
      }
      // Check metrics / numbers (%, $, +, numbers)
      if (/\b\d+(\.\d+)?%|\$\d+|\d+\+|\b\d{2,}\b/.test(bullet)) {
        quantifiableCount++;
      }
    });
  });

  if (expCount >= 2) expScore += 10;
  else if (expCount === 1) expScore += 6;

  if (actionVerbCount >= 4) {
    expScore += 10;
    strengths.push(`Strong action verbs used in ${actionVerbCount} bullet points`);
  } else if (actionVerbCount >= 2) {
    expScore += 6;
  } else {
    suggestions.push('Begin experience bullets with strong action verbs (e.g., "Led", "Optimized", "Engineered")');
  }

  if (quantifiableCount >= 3) {
    expScore += 10;
    strengths.push(`Quantifiable metrics found in ${quantifiableCount} bullet points`);
  } else if (quantifiableCount >= 1) {
    expScore += 6;
    suggestions.push('Add more measurable metrics (e.g., % growth, revenue, team size, time saved)');
  } else {
    suggestions.push('Include numbers, percentages, or metrics in work achievements for higher ATS ranking');
  }

  checks.push({
    id: 'experience',
    category: 'Experience',
    label: 'Work Experience & Impact',
    passed: expScore >= 22,
    score: Math.min(expScore, 30),
    maxScore: 30,
    feedback:
      expScore >= 22
        ? 'Strong experiential background with quantified outcomes.'
        : 'Enhance your experience bullets with measurable metrics and action verbs.',
  });

  // 4. Skills check
  const totalSkills = data.skills.reduce((acc, s) => acc + s.items.length, 0);
  let skillsScore = 0;
  if (totalSkills >= 8 && data.skills.length >= 2) {
    skillsScore = 15;
    strengths.push(`Rich skill catalog with ${totalSkills} skills across ${data.skills.length} categories`);
  } else if (totalSkills >= 5) {
    skillsScore = 10;
  } else if (totalSkills > 0) {
    skillsScore = 5;
    suggestions.push('Include at least 8 relevant technical or soft skills');
  } else {
    suggestions.push('Add skills categorized by area to help ATS match job requirements');
  }

  checks.push({
    id: 'skills',
    category: 'Skills',
    label: 'Categorized Skills',
    passed: skillsScore >= 10,
    score: skillsScore,
    maxScore: 15,
    feedback:
      skillsScore >= 10
        ? 'Categorized skills are easy for ATS and recruiters to match with keywords.'
        : 'Organize skills into logical groups (e.g. Tools, Languages, Frameworks).',
  });

  // 5. Education check
  const eduCount = data.education.length;
  let eduScore = 0;
  if (eduCount >= 1) {
    const hasDegreeAndSchool = data.education.some(e => e.institution?.trim() && e.degree?.trim());
    if (hasDegreeAndSchool) {
      eduScore = 15;
      strengths.push('Education credentials clearly specified');
    } else {
      eduScore = 8;
      suggestions.push('Ensure institution and degree title are filled out in Education');
    }
  } else {
    suggestions.push('Add at least one educational background entry');
  }

  checks.push({
    id: 'education',
    category: 'Education',
    label: 'Education & Credentials',
    passed: eduScore >= 10,
    score: eduScore,
    maxScore: 15,
    feedback: eduScore >= 10 ? 'Education history is properly formatted.' : 'Include degree, institution, and years.',
  });

  const totalScore = Math.min(100, Math.round(contactScore + summaryScore + expScore + skillsScore + eduScore));

  let grade: 'Excellent' | 'Good' | 'Needs Work' = 'Needs Work';
  let color = '#D6431F'; // warm red
  if (totalScore >= 85) {
    grade = 'Excellent';
    color = '#10B981'; // emerald
  } else if (totalScore >= 70) {
    grade = 'Good';
    color = '#F59E0B'; // amber
  }

  return {
    score: totalScore,
    grade,
    color,
    strengths,
    suggestions,
    checks,
    quantifiableCount,
    actionVerbCount,
  };
}
