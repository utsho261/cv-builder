import React, { CSSProperties, useRef, useState, useEffect } from 'react';
import { CVData, PersonalInfo, TemplateConfig } from './types';
import { Mail, Phone, MapPin, Globe, ExternalLink, Briefcase, Code, GraduationCap, Award, Languages, Sparkles } from 'lucide-react';

// ─── Template registry ────────────────────────────────────────────────────────

export const TEMPLATES: TemplateConfig[] = [
  { id: 'google', name: 'Google Tech (FAANG)', category: 'technical', layout: 'single', description: 'Engineered for top tech roles using Google’s XYZ formula: Accomplished X, measured by Y, by doing Z. Features Google 4-color accent, full-page balanced layout, and Material chips.', atcScore: 5, thumbnail: '#1A73E8' },
  { id: 'microsoft', name: 'Microsoft Executive', category: 'professional', layout: 'two-col', description: 'Fluent Design enterprise layout with Microsoft Blue accents, structured two-column hierarchy, and dedicated certification showcase.', atcScore: 5, thumbnail: '#0078D4' },
  { id: 'classic', name: 'Classic', category: 'professional', layout: 'single', description: 'Timeless single-column with EB Garamond. Universally readable.', atcScore: 5, thumbnail: '#1a1a1a' },
  { id: 'executive', name: 'Executive', category: 'professional', layout: 'sidebar-left', description: 'Dark sidebar with commanding authority. Senior leadership ready.', atcScore: 4, thumbnail: '#1C2B3A' },
  { id: 'modern-minimal', name: 'Modern Minimal', category: 'professional', layout: 'single', description: 'Ultra-clean white space. Contemporary and effortless.', atcScore: 5, thumbnail: '#F8F8F8' },
  { id: 'corporate', name: 'Corporate Blue', category: 'professional', layout: 'two-col', description: 'Two-column with blue accent. Classic business format.', atcScore: 4, thumbnail: '#1E3A5F' },
  { id: 'sidebar-noir', name: 'Sidebar Noir', category: 'creative', layout: 'sidebar-left', description: 'Black sidebar with Playfair Display. Striking contrast.', atcScore: 4, thumbnail: '#111111' },
  { id: 'academic', name: 'Academic', category: 'academic', layout: 'single', description: 'Libre Baskerville. Structured for research and academia.', atcScore: 5, thumbnail: '#2C3E50' },
  { id: 'tech-dark', name: 'Tech Dark', category: 'technical', layout: 'sidebar-left', description: 'Dark theme with monospace. Built for engineers.', atcScore: 3, thumbnail: '#0D1117' },
  { id: 'creative-edge', name: 'Creative Edge', category: 'creative', layout: 'bold-header', description: 'Bold color block header. Portfolio and creative roles.', atcScore: 3, thumbnail: '#D6431F' },
  { id: 'elegant-serif', name: 'Elegant Serif', category: 'professional', layout: 'single', description: 'Lora with generous line spacing. Refined and polished.', atcScore: 5, thumbnail: '#3D2B1F' },
  { id: 'swiss', name: 'Swiss Precision', category: 'professional', layout: 'two-col', description: 'Grid-based layout inspired by Swiss graphic design.', atcScore: 4, thumbnail: '#D40000' },
  { id: 'timeline', name: 'Timeline', category: 'professional', layout: 'timeline', description: 'Visual timeline rail. Great for career progression stories.', atcScore: 4, thumbnail: '#2D6A4F' },
  { id: 'consultant', name: 'Consultant Pro', category: 'professional', layout: 'two-col', description: 'Structured two-column. Ideal for consulting and finance.', atcScore: 5, thumbnail: '#2C3E50' },
  { id: 'fresh-grad', name: 'Fresh Graduate', category: 'professional', layout: 'single', description: 'Clean teal accent. Perfect for entry-level applications.', atcScore: 5, thumbnail: '#00897B' },
  { id: 'director', name: 'Director', category: 'professional', layout: 'bold-header', description: 'Commanding full-width header. C-suite and VP level.', atcScore: 4, thumbnail: '#1A1A2E' },
  { id: 'data-engineer', name: 'Data Engineer', category: 'technical', layout: 'two-col', description: 'Technical focus with monospace metadata. STEM-optimized.', atcScore: 4, thumbnail: '#16213E' },
  { id: 'architect', name: 'Architect', category: 'creative', layout: 'editorial', description: 'Geometric ruled headers. Precise and structural.', atcScore: 4, thumbnail: '#333333' },
  { id: 'editorial', name: 'Editorial', category: 'creative', layout: 'editorial', description: 'Newspaper column feel with hairline rules and small caps.', atcScore: 3, thumbnail: '#B5905A' },
  { id: 'bold-strike', name: 'Bold Strike', category: 'creative', layout: 'bold-header', description: 'Thick underlines and strong typographic hierarchy.', atcScore: 4, thumbnail: '#7B2D8B' },
  { id: 'minimal-mono', name: 'Minimal Mono', category: 'technical', layout: 'single', description: 'Monospace throughout. Code-aesthetic for developers.', atcScore: 4, thumbnail: '#1E1E2E' },
  { id: 'legal', name: 'Legal Classic', category: 'academic', layout: 'single', description: 'Ultra-conservative serif. Law and finance professionals.', atcScore: 5, thumbnail: '#2C2416' },
  { id: 'contemporary', name: 'Contemporary', category: 'professional', layout: 'sidebar-left', description: 'Current design with slate sidebar. Modern professional.', atcScore: 4, thumbnail: '#455A64' },
  { id: 'refined', name: 'Refined Luxury', category: 'professional', layout: 'single', description: 'Fraunces with wide margins. Understated elegance.', atcScore: 5, thumbnail: '#8B7355' },
];

// ─── Shared helpers & Link Buttons ────────────────────────────────────────────

const px = (n: number) => `${n}px`;
const sp = (n: number) => `${n * 4}px`;

function LinkedinIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block', flexShrink: 0, opacity: 0.9 }}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

function GithubIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block', flexShrink: 0, opacity: 0.9 }}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function formatHref(type: 'email' | 'phone' | 'url' | 'linkedin' | 'github' | 'location', value: string): string {
  const v = (value || '').trim();
  if (!v) return '';
  if (type === 'email') {
    return v.startsWith('mailto:') ? v : `mailto:${v}`;
  }
  if (type === 'phone') {
    return v.startsWith('tel:') ? v : `tel:${v.replace(/\s+/g, '')}`;
  }
  if (type === 'location') {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;
  }
  if (type === 'linkedin') {
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    if (v.startsWith('linkedin.com')) return `https://${v}`;
    return `https://linkedin.com/in/${v.replace(/^@/, '')}`;
  }
  if (type === 'github') {
    if (v.startsWith('http://') || v.startsWith('https://')) return v;
    if (v.startsWith('github.com')) return `https://${v}`;
    return `https://github.com/${v.replace(/^@/, '')}`;
  }
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://${v}`;
}

export interface LinkButtonProps {
  type: 'email' | 'phone' | 'website' | 'linkedin' | 'github' | 'location' | 'project';
  label: string;
  href?: string;
  variant?: 'default' | 'google' | 'microsoft' | 'sidebar' | 'dark' | 'outline' | 'minimal';
  style?: CSSProperties;
}

export function LinkButton({ type, label, href, variant = 'default', style }: LinkButtonProps) {
  if (!label) return null;

  const actualHref = href || (
    type === 'email' ? formatHref('email', label) :
    type === 'phone' ? formatHref('phone', label) :
    type === 'location' ? formatHref('location', label) :
    type === 'linkedin' ? formatHref('linkedin', label) :
    type === 'github' ? formatHref('github', label) :
    type === 'website' || type === 'project' ? formatHref('url', label) :
    undefined
  );

  const renderIcon = () => {
    switch (type) {
      case 'email':
        return <Mail size={11} style={{ display: 'block', flexShrink: 0, opacity: 0.9 }} />;
      case 'phone':
        return <Phone size={11} style={{ display: 'block', flexShrink: 0, opacity: 0.9 }} />;
      case 'location':
        return <MapPin size={11} style={{ display: 'block', flexShrink: 0, opacity: 0.9 }} />;
      case 'linkedin':
        return <LinkedinIcon size={11} />;
      case 'github':
        return <GithubIcon size={11} />;
      case 'website':
        return <Globe size={11} style={{ display: 'block', flexShrink: 0, opacity: 0.9 }} />;
      case 'project':
        return <ExternalLink size={10.5} style={{ display: 'block', flexShrink: 0, opacity: 0.9 }} />;
      default:
        return <ExternalLink size={10.5} style={{ display: 'block', flexShrink: 0, opacity: 0.9 }} />;
    }
  };

  let baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    height: 22,
    minHeight: 22,
    padding: '0 8px',
    borderRadius: 4,
    fontSize: 8.5,
    fontWeight: 500,
    textDecoration: 'none',
    lineHeight: 1,
    cursor: actualHref ? 'pointer' : 'default',
    boxSizing: 'border-box',
    maxWidth: '100%',
    verticalAlign: 'middle',
    userSelect: 'none',
  };

  if (variant === 'google') {
    baseStyle = {
      ...baseStyle,
      background: '#E8F0FE',
      color: '#1A73E8',
      border: '1px solid #D2E3FC',
      borderRadius: 11,
      fontWeight: 500,
      padding: '0 9px',
    };
  } else if (variant === 'microsoft') {
    baseStyle = {
      ...baseStyle,
      background: 'rgba(255, 255, 255, 0.16)',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 3,
      padding: '0 8px',
    };
  } else if (variant === 'sidebar') {
    baseStyle = {
      ...baseStyle,
      background: 'rgba(255, 255, 255, 0.08)',
      color: 'inherit',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      borderRadius: 4,
      width: '100%',
      justifyContent: 'flex-start',
      marginBottom: 5,
      padding: '0 8px',
      fontSize: 8,
    };
  } else if (variant === 'dark') {
    baseStyle = {
      ...baseStyle,
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#F0EDE8',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: 4,
    };
  } else {
    baseStyle = {
      ...baseStyle,
      background: 'rgba(20, 18, 16, 0.05)',
      color: '#1a1a1a',
      border: '1px solid rgba(20, 18, 16, 0.14)',
      borderRadius: 4,
    };
  }

  const combinedStyle = { ...baseStyle, ...style };

  const innerContent = (
    <>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 12,
          height: 12,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {renderIcon()}
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          lineHeight: 1,
          fontSize: 8.5,
          fontWeight: 500,
          textDecoration: 'none',
          color: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </>
  );

  if (actualHref) {
    return (
      <a
        href={actualHref}
        target="_blank"
        rel="noopener noreferrer"
        style={combinedStyle}
        className="cv-link-button"
        title={`Open ${label}`}
        data-link-url={actualHref}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <span style={combinedStyle} className="cv-link-button">
      {innerContent}
    </span>
  );
}

export function ContactButtonsBar({
  personal,
  variant = 'default',
  align = 'left',
  gap = 6,
}: {
  personal: PersonalInfo;
  variant?: 'default' | 'google' | 'microsoft' | 'sidebar' | 'dark' | 'outline' | 'minimal';
  align?: 'left' | 'center' | 'right';
  gap?: number;
}) {
  const items: { type: 'email' | 'phone' | 'location' | 'website' | 'linkedin' | 'github'; label: string }[] = [];
  if (personal.email) items.push({ type: 'email', label: personal.email });
  if (personal.phone) items.push({ type: 'phone', label: personal.phone });
  if (personal.location) items.push({ type: 'location', label: personal.location });
  if (personal.website) items.push({ type: 'website', label: personal.website });
  if (personal.linkedin) items.push({ type: 'linkedin', label: personal.linkedin });
  if (personal.github) items.push({ type: 'github', label: personal.github });

  if (items.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap,
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        alignItems: 'center',
        marginTop: 6,
      }}
    >
      {items.map((item, idx) => (
        <LinkButton
          key={idx}
          type={item.type}
          label={item.label}
          variant={variant}
        />
      ))}
    </div>
  );
}

export function ProjectLinkButton({
  url,
  variant = 'default',
}: {
  url: string;
  variant?: 'default' | 'google' | 'microsoft' | 'dark';
}) {
  if (!url) return null;
  return (
    <LinkButton
      type="project"
      label={url}
      href={formatHref('url', url)}
      variant={variant}
      style={
        variant === 'microsoft'
          ? { background: '#EFF6FC', color: '#0078D4', border: '1px solid #C7E0F4', borderRadius: 3 }
          : undefined
      }
    />
  );
}

function ContactLine({ items }: { items: (string | undefined)[] }) {
  const valid = items.filter(Boolean);
  return (
    <span>{valid.join(' · ')}</span>
  );
}

// ─── Layout: Single Column ────────────────────────────────────────────────────

interface SingleTheme {
  page: CSSProperties;
  header: CSSProperties;
  name: CSSProperties;
  title: CSSProperties;
  contact: CSSProperties;
  summary: CSSProperties;
  sectionWrap: CSSProperties;
  sectionHeader: CSSProperties;
  sectionRule: CSSProperties;
  jobTitle: CSSProperties;
  company: CSSProperties;
  meta: CSSProperties;
  bullet: CSSProperties;
  bulletDot: CSSProperties;
  skillCat: CSSProperties;
  skillItems: CSSProperties;
  degreeTitle: CSSProperties;
  institution: CSSProperties;
}

function PhotoCircle({ src, size, border }: { src: string; size: number; border?: string }) {
  if (!src) return null;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: border || '2px solid rgba(0,0,0,0.1)', display: 'inline-block' }}>
      <img src={src} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

function PhotoSquare({ src, size, border }: { src: string; size: number; border?: string }) {
  if (!src) return null;
  return (
    <div style={{ width: size, height: size, overflow: 'hidden', flexShrink: 0, border: border || '2px solid rgba(0,0,0,0.1)' }}>
      <img src={src} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

function SingleColumnCV({ data, theme }: { data: CVData; theme: SingleTheme }) {
  const { personal, experience, education, skills, projects, certifications, languages } = data;
  return (
    <div style={theme.page}>
      {/* Header */}
      <div style={{ ...theme.header, position: 'relative' }}>
        {personal.photo && (
          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <PhotoCircle src={personal.photo} size={72} border="2px solid rgba(0,0,0,0.15)" />
          </div>
        )}
        <div style={theme.name}>{personal.name || 'Your Name'}</div>
        {personal.title && <div style={theme.title}>{personal.title}</div>}
        <div style={theme.contact}>
          <ContactButtonsBar personal={personal} align={theme.header?.textAlign === 'center' ? 'center' : 'left'} />
        </div>
      </div>

      {/* Summary */}
      {personal.summary && (
        <Section label="Professional Summary" theme={theme}>
          <p style={theme.summary}>{personal.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section label="Experience" theme={theme}>
          {experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? sp(4) : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={theme.jobTitle}>{exp.position}</span>
                <span style={theme.meta}>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={theme.company}>{exp.company}</span>
                {exp.location && <span style={theme.meta}>{exp.location}</span>}
              </div>
              <ul style={{ margin: `${sp(1.5)} 0 0 ${sp(3)}`, padding: 0, listStyle: 'none' }}>
                {exp.bullets.map((b, bi) => (
                  <li key={bi} style={{ display: 'flex', gap: sp(1.5), marginBottom: sp(0.5) }}>
                    <span style={theme.bulletDot}>•</span>
                    <span style={theme.bullet}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section label="Education" theme={theme}>
          {education.map((edu, i) => (
            <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? sp(3) : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={theme.degreeTitle}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</span>
                <span style={theme.meta}>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={theme.institution}>{edu.institution}</div>
              {(edu.gpa || edu.honors) && (
                <div style={theme.meta}>{[edu.gpa && `GPA: ${edu.gpa}`, edu.honors].filter(Boolean).join(' · ')}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Section label="Skills" theme={theme}>
          {skills.map(sg => (
            <div key={sg.id} style={{ display: 'flex', gap: sp(2), marginBottom: sp(1) }}>
              <span style={theme.skillCat}>{sg.category}:</span>
              <span style={theme.skillItems}>{sg.items.join(', ')}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section label="Projects" theme={theme}>
          {projects.map((p, i) => (
            <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? sp(2.5) : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                <span style={theme.jobTitle}>{p.name}</span>
                {p.url && <ProjectLinkButton url={p.url} />}
              </div>
              {p.technologies.length > 0 && <span style={{ ...theme.meta, marginLeft: sp(2) }}>{p.technologies.join(', ')}</span>}
              <p style={{ ...theme.bullet, marginTop: sp(0.5) }}>{p.description}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section label="Certifications" theme={theme}>
          {certifications.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: sp(1) }}>
              <span style={theme.company}>{c.name} — {c.issuer}</span>
              <span style={theme.meta}>{c.date}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section label="Languages" theme={theme}>
          <div style={{ display: 'flex', gap: sp(4), flexWrap: 'wrap' }}>
            {languages.map(l => (
              <span key={l.id} style={theme.meta}><strong style={theme.skillCat}>{l.language}</strong> — {l.level}</span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ label, theme, children }: { label: string; theme: SingleTheme; children: React.ReactNode }) {
  return (
    <div style={theme.sectionWrap}>
      <div style={theme.sectionHeader}>{label.toUpperCase()}</div>
      <div style={theme.sectionRule} />
      {children}
    </div>
  );
}

// ─── Layout: Sidebar Left ─────────────────────────────────────────────────────

interface SidebarTheme {
  page: CSSProperties;
  sidebar: CSSProperties;
  main: CSSProperties;
  sidebarName: CSSProperties;
  sidebarTitle: CSSProperties;
  sidebarContact: CSSProperties;
  sidebarContactItem: CSSProperties;
  sidebarSection: CSSProperties;
  sidebarSectionLabel: CSSProperties;
  sidebarItem: CSSProperties;
  mainSection: CSSProperties;
  mainSectionLabel: CSSProperties;
  mainSectionRule: CSSProperties;
  jobTitle: CSSProperties;
  company: CSSProperties;
  meta: CSSProperties;
  bullet: CSSProperties;
  bulletDot: CSSProperties;
  summary: CSSProperties;
  degreeTitle: CSSProperties;
}

function SidebarCV({ data, theme }: { data: CVData; theme: SidebarTheme }) {
  const { personal, experience, education, skills, certifications, languages, projects } = data;
  return (
    <div style={theme.page}>
      {/* Sidebar */}
      <div style={theme.sidebar}>
        {personal.photo && (
          <div style={{ marginBottom: 16 }}>
            <PhotoCircle src={personal.photo} size={80} border="3px solid rgba(255,255,255,0.2)" />
          </div>
        )}
        <div style={theme.sidebarName}>{personal.name || 'Your Name'}</div>
        {personal.title && <div style={theme.sidebarTitle}>{personal.title}</div>}

        <div style={{ height: 20 }} />

        {/* Contact */}
        <div style={theme.sidebarSection}>
          <div style={theme.sidebarSectionLabel}>Contact & Links</div>
          <ContactButtonsBar personal={personal} variant="sidebar" />
        </div>

        {/* Skills in sidebar */}
        {skills.length > 0 && (
          <div style={theme.sidebarSection}>
            <div style={theme.sidebarSectionLabel}>Skills</div>
            {skills.map(sg => (
              <div key={sg.id} style={{ marginBottom: 10 }}>
                <div style={{ ...theme.sidebarItem, fontWeight: 600, marginBottom: 3 }}>{sg.category}</div>
                {sg.items.map(item => (
                  <div key={item} style={theme.sidebarItem}>— {item}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Languages in sidebar */}
        {languages.length > 0 && (
          <div style={theme.sidebarSection}>
            <div style={theme.sidebarSectionLabel}>Languages</div>
            {languages.map(l => (
              <div key={l.id} style={theme.sidebarItem}>{l.language} <span style={{ opacity: 0.7 }}>({l.level})</span></div>
            ))}
          </div>
        )}

        {/* Certifications in sidebar */}
        {certifications.length > 0 && (
          <div style={theme.sidebarSection}>
            <div style={theme.sidebarSectionLabel}>Certifications</div>
            {certifications.map(c => (
              <div key={c.id} style={{ marginBottom: 8 }}>
                <div style={theme.sidebarItem}>{c.name}</div>
                <div style={{ ...theme.sidebarItem, opacity: 0.7 }}>{c.issuer} · {c.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={theme.main}>
        {personal.summary && (
          <MainSection label="Profile" theme={theme}>
            <p style={theme.summary}>{personal.summary}</p>
          </MainSection>
        )}

        {experience.length > 0 && (
          <MainSection label="Experience" theme={theme}>
            {experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? 18 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={theme.jobTitle}>{exp.position}</span>
                  <span style={theme.meta}>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={theme.company}>{exp.company}</span>
                  {exp.location && <span style={theme.meta}>{exp.location}</span>}
                </div>
                <ul style={{ margin: '6px 0 0 14px', padding: 0, listStyle: 'none' }}>
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                      <span style={theme.bulletDot}>•</span>
                      <span style={theme.bullet}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </MainSection>
        )}

        {education.length > 0 && (
          <MainSection label="Education" theme={theme}>
            {education.map((edu, i) => (
              <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? 14 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={theme.degreeTitle}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</span>
                  <span style={theme.meta}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div style={theme.company}>{edu.institution}</div>
                {(edu.gpa || edu.honors) && (
                  <div style={theme.meta}>{[edu.gpa && `GPA: ${edu.gpa}`, edu.honors].filter(Boolean).join(' · ')}</div>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection label="Projects" theme={theme}>
            {projects.map((p, i) => (
              <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? 12 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                  <div style={theme.jobTitle}>{p.name}</div>
                  {p.url && <ProjectLinkButton url={p.url} />}
                </div>
                {p.technologies.length > 0 && <div style={theme.meta}>{p.technologies.join(', ')}</div>}
                <p style={theme.bullet}>{p.description}</p>
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function MainSection({ label, theme, children }: { label: string; theme: SidebarTheme; children: React.ReactNode }) {
  return (
    <div style={theme.mainSection}>
      <div style={theme.mainSectionLabel}>{label.toUpperCase()}</div>
      <div style={theme.mainSectionRule} />
      {children}
    </div>
  );
}

// ─── Layout: Two Column ───────────────────────────────────────────────────────

function TwoColCV({ data, theme }: { data: CVData; theme: any }) {
  const { personal, experience, education, skills, certifications, projects, languages } = data;
  return (
    <div style={theme.page}>
      {/* Header across full width */}
      <div style={{ ...theme.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={theme.name}>{personal.name || 'Your Name'}</div>
          {personal.title && <div style={theme.title}>{personal.title}</div>}
          <div style={theme.contact}>
            <ContactButtonsBar personal={personal} />
          </div>
        </div>
        {personal.photo && <PhotoSquare src={personal.photo} size={72} border="none" />}
      </div>
      {/* Two columns */}
      <div style={theme.cols}>
        {/* Left col — main content */}
        <div style={theme.leftCol}>
          {personal.summary && (
            <TwoColSection label="Summary" theme={theme}>
              <p style={theme.body}>{personal.summary}</p>
            </TwoColSection>
          )}
          {experience.length > 0 && (
            <TwoColSection label="Experience" theme={theme}>
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? 16 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={theme.jobTitle}>{exp.position}</span>
                    <span style={theme.meta}>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={theme.company}>{exp.company}</span>
                    {exp.location && <span style={theme.meta}>{exp.location}</span>}
                  </div>
                  <ul style={{ margin: '5px 0 0 14px', padding: 0, listStyle: 'none' }}>
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: 'flex', gap: 5, marginBottom: 3 }}>
                        <span style={theme.bulletDot}>•</span>
                        <span style={theme.bullet}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </TwoColSection>
          )}
          {projects.length > 0 && (
            <TwoColSection label="Projects" theme={theme}>
              {projects.map((p, i) => (
                <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? 10 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                    <div style={theme.jobTitle}>{p.name}</div>
                    {p.url && <ProjectLinkButton url={p.url} />}
                  </div>
                  {p.technologies.length > 0 && <div style={theme.meta}>{p.technologies.join(', ')}</div>}
                  <div style={theme.bullet}>{p.description}</div>
                </div>
              ))}
            </TwoColSection>
          )}
        </div>
        {/* Right col — sidebar content */}
        <div style={theme.rightCol}>
          {education.length > 0 && (
            <TwoColSection label="Education" theme={theme}>
              {education.map((edu, i) => (
                <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? 12 : 0 }}>
                  <div style={theme.jobTitle}>{edu.degree}</div>
                  <div style={theme.bullet}>{edu.field}</div>
                  <div style={theme.company}>{edu.institution}</div>
                  <div style={theme.meta}>{edu.startDate} – {edu.endDate}</div>
                  {edu.honors && <div style={theme.meta}>{edu.honors}</div>}
                </div>
              ))}
            </TwoColSection>
          )}
          {skills.length > 0 && (
            <TwoColSection label="Skills" theme={theme}>
              {skills.map(sg => (
                <div key={sg.id} style={{ marginBottom: 10 }}>
                  <div style={{ ...theme.jobTitle, fontSize: (theme.jobTitle.fontSize as number) - 1 }}>{sg.category}</div>
                  <div style={theme.bullet}>{sg.items.join(' · ')}</div>
                </div>
              ))}
            </TwoColSection>
          )}
          {certifications.length > 0 && (
            <TwoColSection label="Certifications" theme={theme}>
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: 8 }}>
                  <div style={theme.company}>{c.name}</div>
                  <div style={theme.meta}>{c.issuer} · {c.date}</div>
                </div>
              ))}
            </TwoColSection>
          )}
          {languages.length > 0 && (
            <TwoColSection label="Languages" theme={theme}>
              {languages.map(l => (
                <div key={l.id} style={{ ...theme.meta, marginBottom: 4 }}>{l.language} — {l.level}</div>
              ))}
            </TwoColSection>
          )}
        </div>
      </div>
    </div>
  );
}

function TwoColSection({ label, theme, children }: { label: string; theme: any; children: React.ReactNode }) {
  return (
    <div style={theme.sectionWrap}>
      <div style={theme.sectionLabel}>{label.toUpperCase()}</div>
      <div style={theme.sectionRule} />
      {children}
    </div>
  );
}

// ─── Layout: Timeline ─────────────────────────────────────────────────────────

function TimelineCV({ data, theme }: { data: CVData; theme: any }) {
  const { personal, experience, education, skills, certifications, languages, projects } = data;
  return (
    <div style={theme.page}>
      <div style={{ ...theme.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={theme.name}>{personal.name || 'Your Name'}</div>
          {personal.title && <div style={theme.title}>{personal.title}</div>}
          <div style={theme.contact}>
            <ContactButtonsBar personal={personal} />
          </div>
        </div>
        {personal.photo && <PhotoCircle src={personal.photo} size={68} border={`2px solid ${theme.title?.color || '#888'}`} />}
      </div>
      {personal.summary && <p style={theme.summary}>{personal.summary}</p>}

      <div style={{ display: 'flex', gap: 0, marginTop: 20 }}>
        {/* Timeline rail */}
        <div style={{ width: 80, flexShrink: 0 }}>
          {experience.map((exp) => (
            <div key={exp.id} style={{ position: 'relative', paddingBottom: 24 }}>
              <div style={theme.timelineYear}>{exp.startDate.split(' ').pop()}</div>
              <div style={theme.timelineDot} />
              <div style={theme.timelineLine} />
            </div>
          ))}
        </div>
        {/* Experience content */}
        <div style={{ flex: 1 }}>
          <div style={theme.sectionLabel}>EXPERIENCE</div>
          <div style={theme.sectionRule} />
          {experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? 18 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={theme.jobTitle}>{exp.position}</span>
                <span style={theme.meta}>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div style={theme.company}>{exp.company} {exp.location && `· ${exp.location}`}</div>
              <ul style={{ margin: '5px 0 0 14px', padding: 0, listStyle: 'none' }}>
                {exp.bullets.map((b, bi) => (
                  <li key={bi} style={{ ...theme.bullet, display: 'flex', gap: 5, marginBottom: 3 }}>
                    <span style={theme.bulletDot}>•</span><span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          {education.length > 0 && (
            <>
              <div style={theme.sectionLabel}>EDUCATION</div>
              <div style={theme.sectionRule} />
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 10 }}>
                  <div style={theme.jobTitle}>{edu.degree}, {edu.field}</div>
                  <div style={theme.company}>{edu.institution}</div>
                  <div style={theme.meta}>{edu.startDate} – {edu.endDate}{edu.honors ? ` · ${edu.honors}` : ''}</div>
                </div>
              ))}
            </>
          )}
          {projects && projects.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={theme.sectionLabel}>PROJECTS</div>
              <div style={theme.sectionRule} />
              {projects.map((p, i) => (
                <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? 10 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                    <span style={theme.jobTitle}>{p.name}</span>
                    {p.url && <ProjectLinkButton url={p.url} />}
                  </div>
                  {p.technologies && p.technologies.length > 0 && <div style={theme.meta}>{p.technologies.join(', ')}</div>}
                  <div style={theme.bullet}>{p.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          {skills.length > 0 && (
            <>
              <div style={theme.sectionLabel}>SKILLS</div>
              <div style={theme.sectionRule} />
              {skills.map(sg => (
                <div key={sg.id} style={{ marginBottom: 8 }}>
                  <span style={theme.jobTitle}>{sg.category}: </span>
                  <span style={theme.bullet}>{sg.items.join(', ')}</span>
                </div>
              ))}
            </>
          )}
          {languages.length > 0 && (
            <>
              <div style={{ ...theme.sectionLabel, marginTop: 14 }}>LANGUAGES</div>
              <div style={theme.sectionRule} />
              {languages.map(l => <div key={l.id} style={theme.bullet}>{l.language} — {l.level}</div>)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Layout: Editorial ────────────────────────────────────────────────────────

function EditorialCV({ data, theme }: { data: CVData; theme: any }) {
  const { personal, experience, education, skills, projects } = data;
  return (
    <div style={theme.page}>
      <div style={theme.runningHead}>CURRICULUM VITAE — {(personal.name || 'Your Name').toUpperCase()}</div>
      <div style={theme.headRule} />
      <div style={theme.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {personal.photo && <PhotoCircle src={personal.photo} size={60} border="2px solid rgba(0,0,0,0.15)" />}
          <div style={theme.nameBlock}>
            <div style={theme.name}>{personal.name || 'Your Name'}</div>
            {personal.title && <div style={theme.title}>{personal.title}</div>}
          </div>
        </div>
        <div style={{ ...theme.contactBlock, maxWidth: 360 }}>
          <ContactButtonsBar personal={personal} align="right" />
        </div>
      </div>
      <div style={theme.headRule} />

      {personal.summary && (
        <div style={theme.summaryBlock}>
          <div style={theme.figNumber}>§ 01</div>
          <p style={theme.summary}>{personal.summary}</p>
        </div>
      )}

      <div style={theme.cols}>
        <div style={theme.leftCol}>
          {experience.length > 0 && (
            <div style={theme.section}>
              <div style={theme.figNumber}>§ 02</div>
              <div style={theme.sectionLabel}>Experience</div>
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: 14, borderBottom: i < experience.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none', paddingBottom: 12 }}>
                  <div style={theme.jobTitle}>{exp.position}</div>
                  <div style={theme.company}>{exp.company} · {exp.startDate}–{exp.endDate}</div>
                  <ul style={{ margin: '4px 0 0 12px', padding: 0, listStyle: 'none' }}>
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} style={{ ...theme.bullet, display: 'flex', gap: 4, marginBottom: 2 }}>
                        <span>–</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {projects && projects.length > 0 && (
            <div style={theme.section}>
              <div style={theme.figNumber}>§ 03</div>
              <div style={theme.sectionLabel}>Key Projects</div>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                    <div style={theme.jobTitle}>{p.name}</div>
                    {p.url && <ProjectLinkButton url={p.url} />}
                  </div>
                  {p.technologies.length > 0 && <div style={theme.meta}>{p.technologies.join(', ')}</div>}
                  <div style={theme.bullet}>{p.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={theme.rightCol}>
          {education.length > 0 && (
            <div style={theme.section}>
              <div style={theme.figNumber}>§ 04</div>
              <div style={theme.sectionLabel}>Education</div>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 10 }}>
                  <div style={theme.jobTitle}>{edu.degree}</div>
                  <div style={theme.company}>{edu.field}</div>
                  <div style={theme.meta}>{edu.institution} · {edu.endDate}</div>
                  {edu.honors && <div style={theme.meta}>{edu.honors}</div>}
                </div>
              ))}
            </div>
          )}
          {skills.length > 0 && (
            <div style={theme.section}>
              <div style={theme.figNumber}>§ 05</div>
              <div style={theme.sectionLabel}>Expertise</div>
              {skills.map(sg => (
                <div key={sg.id} style={{ marginBottom: 6 }}>
                  <div style={theme.jobTitle}>{sg.category}</div>
                  <div style={theme.bullet}>{sg.items.join(', ')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Layout: Bold Header ──────────────────────────────────────────────────────

function BoldHeaderCV({ data, theme }: { data: CVData; theme: any }) {
  const { personal, experience, education, skills, certifications, languages, projects } = data;
  return (
    <div style={theme.page}>
      <div style={{ ...theme.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={theme.name}>{personal.name || 'Your Name'}</div>
          {personal.title && <div style={theme.title}>{personal.title}</div>}
          <div style={theme.contact}>
            <ContactButtonsBar personal={personal} variant="dark" />
          </div>
        </div>
        {personal.photo && <PhotoCircle src={personal.photo} size={72} border="3px solid rgba(255,255,255,0.3)" />}
      </div>
      <div style={theme.body}>
        {personal.summary && (
          <BoldSection label="Summary" theme={theme}>
            <p style={theme.bodyText}>{personal.summary}</p>
          </BoldSection>
        )}
        {experience.length > 0 && (
          <BoldSection label="Experience" theme={theme}>
            {experience.map((exp, i) => (
              <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={theme.jobTitle}>{exp.position}</span>
                  <span style={theme.meta}>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={theme.company}>{exp.company}</span>
                  {exp.location && <span style={theme.meta}>{exp.location}</span>}
                </div>
                <ul style={{ margin: '5px 0 0 14px', padding: 0, listStyle: 'none' }}>
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: 'flex', gap: 5, marginBottom: 3 }}>
                      <span style={theme.bulletDot}>•</span>
                      <span style={theme.bodyText}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </BoldSection>
        )}
        {education.length > 0 && (
          <BoldSection label="Education" theme={theme}>
            {education.map((edu, i) => (
              <div key={edu.id} style={{ marginBottom: i < education.length - 1 ? 10 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={theme.jobTitle}>{edu.degree}, {edu.field}</span>
                  <span style={theme.meta}>{edu.endDate}</span>
                </div>
                <div style={theme.company}>{edu.institution}</div>
              </div>
            ))}
          </BoldSection>
        )}
        {skills.length > 0 && (
          <BoldSection label="Skills" theme={theme}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {skills.map(sg => (
                <div key={sg.id} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ ...theme.company, minWidth: 110 }}>{sg.category}:</span>
                  <span style={theme.bodyText}>{sg.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </BoldSection>
        )}
        {projects.length > 0 && (
          <BoldSection label="Projects" theme={theme}>
            {projects.map((p, i) => (
              <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? 10 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                  <div style={theme.jobTitle}>{p.name}</div>
                  {p.url && <ProjectLinkButton url={p.url} variant="dark" />}
                </div>
                {p.technologies.length > 0 && <div style={theme.meta}>{p.technologies.join(', ')}</div>}
                <div style={theme.bodyText}>{p.description}</div>
              </div>
            ))}
          </BoldSection>
        )}
        {(certifications.length > 0 || languages.length > 0) && (
          <BoldSection label="Additional" theme={theme}>
            {certifications.map(c => (
              <div key={c.id} style={{ ...theme.bodyText, marginBottom: 4 }}>{c.name} — {c.issuer} ({c.date})</div>
            ))}
            {languages.map(l => (
              <div key={l.id} style={{ ...theme.bodyText, marginBottom: 2 }}>{l.language}: {l.level}</div>
            ))}
          </BoldSection>
        )}
      </div>
    </div>
  );
}

function BoldSection({ label, theme, children }: { label: string; theme: any; children: React.ReactNode }) {
  return (
    <div style={theme.section}>
      <div style={theme.sectionLabel}>{label.toUpperCase()}</div>
      <div style={theme.sectionRule} />
      {children}
    </div>
  );
}

// ─── Template themes ───────────────────────────────────────────────────────────

const A4 = { width: 794, padding: 56 };
const base = { fontSize: 10.5, lineHeight: 1.5 };

const themes: Record<string, any> = {
  classic: {
    page: { width: A4.width, minHeight: 1123, background: '#FFFDF9', padding: `${A4.padding}px`, fontFamily: "'EB Garamond', serif", fontSize: base.fontSize, color: '#1a1a1a', lineHeight: base.lineHeight },
    header: { textAlign: 'center' as const, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #1a1a1a' },
    name: { fontFamily: "'EB Garamond', serif", fontSize: 32, fontWeight: 600, letterSpacing: '0.03em', marginBottom: 4, color: '#1a1a1a' },
    title: { fontFamily: "'EB Garamond', serif", fontSize: 14, fontStyle: 'italic', color: '#555', marginBottom: 8 },
    contact: { fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.08em', color: '#444' },
    summary: { fontSize: 10.5, lineHeight: 1.6, color: '#222', margin: 0 },
    sectionWrap: { marginBottom: 18 },
    sectionHeader: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, fontWeight: 600, letterSpacing: '0.15em', marginBottom: 5, color: '#1a1a1a' },
    sectionRule: { height: 1, background: '#1a1a1a', marginBottom: 10 },
    jobTitle: { fontFamily: "'EB Garamond', serif", fontSize: 12, fontWeight: 600, color: '#1a1a1a' },
    company: { fontFamily: "'EB Garamond', serif", fontSize: 11, fontStyle: 'italic', color: '#444' },
    meta: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, color: '#666', letterSpacing: '0.04em' },
    bullet: { fontSize: 10, lineHeight: 1.5, color: '#222' },
    bulletDot: { color: '#1a1a1a', flexShrink: 0, marginTop: 1 },
    skillCat: { fontFamily: "'EB Garamond', serif", fontWeight: 600, fontSize: 10.5, minWidth: 110 },
    skillItems: { fontSize: 10, color: '#333' },
    degreeTitle: { fontFamily: "'EB Garamond', serif", fontSize: 12, fontWeight: 600, color: '#1a1a1a' },
    institution: { fontFamily: "'EB Garamond', serif", fontSize: 11, fontStyle: 'italic', color: '#444' },
  },

  executive: {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', display: 'flex', fontFamily: "'Inter', sans-serif", fontSize: base.fontSize, color: '#1a1a1a' },
    sidebar: { width: 220, background: '#1C2B3A', color: '#E8EDF2', padding: '40px 20px', flexShrink: 0 },
    main: { flex: 1, padding: '40px 32px' },
    sidebarName: { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, marginBottom: 6 },
    sidebarTitle: { fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#8BAAB8', marginBottom: 24 },
    sidebarSection: { marginBottom: 22 },
    sidebarSectionLabel: { fontFamily: "'Inter', sans-serif", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#4A8DB3', marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 5 },
    sidebarContact: {},
    sidebarContactItem: { fontSize: 8.5, color: '#B0C4D4', marginBottom: 4, lineHeight: 1.4, wordBreak: 'break-all' as const },
    sidebarItem: { fontSize: 8.5, color: '#C0D4E0', marginBottom: 3, lineHeight: 1.4 },
    mainSection: { marginBottom: 20 },
    mainSectionLabel: { fontFamily: "'Inter', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#1C2B3A', marginBottom: 6 },
    mainSectionRule: { height: 2, background: '#1C2B3A', marginBottom: 12 },
    jobTitle: { fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: '#1a1a1a' },
    company: { fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#4A8DB3', fontWeight: 500 },
    meta: { fontFamily: "'Inter', sans-serif", fontSize: 8.5, color: '#888', letterSpacing: '0.03em' },
    bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#333' },
    bulletDot: { color: '#4A8DB3', flexShrink: 0, marginTop: 1 },
    summary: { fontSize: 10, lineHeight: 1.6, color: '#333', margin: 0 },
    degreeTitle: { fontSize: 11, fontWeight: 600, color: '#1a1a1a' },
  },

  'modern-minimal': {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', padding: `${A4.padding}px`, fontFamily: "'Inter', sans-serif", fontSize: base.fontSize, color: '#111', lineHeight: base.lineHeight },
    header: { marginBottom: 28, borderBottom: '1px solid #E0E0E0', paddingBottom: 20 },
    name: { fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 4, color: '#111' },
    title: { fontSize: 13, fontWeight: 400, color: '#666', marginBottom: 10 },
    contact: { fontSize: 9, color: '#888', letterSpacing: '0.05em' },
    summary: { fontSize: 10.5, lineHeight: 1.7, color: '#444', margin: 0 },
    sectionWrap: { marginBottom: 22 },
    sectionHeader: { fontSize: 8, fontWeight: 600, letterSpacing: '0.18em', color: '#999', marginBottom: 6 },
    sectionRule: { height: 1, background: '#E8E8E8', marginBottom: 12 },
    jobTitle: { fontSize: 11.5, fontWeight: 600, color: '#111' },
    company: { fontSize: 10.5, color: '#555', fontWeight: 400 },
    meta: { fontSize: 8.5, color: '#999' },
    bullet: { fontSize: 9.5, lineHeight: 1.55, color: '#333' },
    bulletDot: { color: '#CCC', flexShrink: 0, marginTop: 1 },
    skillCat: { fontWeight: 600, fontSize: 10, color: '#333', minWidth: 110 },
    skillItems: { fontSize: 9.5, color: '#555' },
    degreeTitle: { fontSize: 11.5, fontWeight: 600, color: '#111' },
    institution: { fontSize: 10.5, color: '#555' },
  },

  corporate: {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', fontFamily: "'Source Sans 3', sans-serif", fontSize: base.fontSize, color: '#1a1a1a' },
    header: { background: '#1E3A5F', padding: '28px 40px', color: '#FFFFFF', marginBottom: 0 },
    name: { fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 3 },
    title: { fontSize: 12, color: '#A8C4E0', fontWeight: 400, marginBottom: 8 },
    contact: { fontSize: 9, color: '#C0D8F0', letterSpacing: '0.05em' },
    cols: { display: 'flex', padding: '28px 32px', gap: 28 },
    leftCol: { flex: 2 },
    rightCol: { width: 200, flexShrink: 0 },
    sectionWrap: { marginBottom: 20 },
    sectionLabel: { fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: '#1E3A5F', marginBottom: 5 },
    sectionRule: { height: 2, background: '#1E3A5F', marginBottom: 10 },
    jobTitle: { fontSize: 11, fontWeight: 600, color: '#1a1a1a' },
    company: { fontSize: 10, color: '#1E3A5F', fontWeight: 600 },
    meta: { fontSize: 8.5, color: '#777' },
    bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#333' },
    bulletDot: { color: '#1E3A5F', flexShrink: 0, marginTop: 1 },
    body: { fontSize: 10, lineHeight: 1.6, color: '#444' },
  },

  'sidebar-noir': {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', display: 'flex', fontFamily: "'Playfair Display', serif", fontSize: base.fontSize, color: '#1a1a1a' },
    sidebar: { width: 215, background: '#111111', color: '#F0EDE8', padding: '44px 22px', flexShrink: 0 },
    main: { flex: 1, padding: '44px 36px' },
    sidebarName: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.25, marginBottom: 6 },
    sidebarTitle: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#D6431F', marginBottom: 22 },
    sidebarSection: { marginBottom: 20 },
    sidebarSectionLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#D6431F', marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 5 },
    sidebarContact: {},
    sidebarContactItem: { fontSize: 8.5, color: '#BBB5AF', marginBottom: 4, lineHeight: 1.4, wordBreak: 'break-all' as const },
    sidebarItem: { fontSize: 8.5, color: '#C8C2BC', marginBottom: 3, lineHeight: 1.4 },
    mainSection: { marginBottom: 22 },
    mainSectionLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#1a1a1a', marginBottom: 5 },
    mainSectionRule: { height: 1, background: '#1a1a1a', marginBottom: 10 },
    jobTitle: { fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 700, color: '#1a1a1a' },
    company: { fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: '#D6431F', fontWeight: 500 },
    meta: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, color: '#888' },
    bullet: { fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, lineHeight: 1.5, color: '#333' },
    bulletDot: { color: '#D6431F', flexShrink: 0, marginTop: 1 },
    summary: { fontFamily: "'DM Sans', sans-serif", fontSize: 10, lineHeight: 1.6, color: '#333', margin: 0 },
    degreeTitle: { fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 600 },
  },

  academic: {
    page: { width: A4.width, minHeight: 1123, background: '#FAFAF8', padding: `${A4.padding}px 60px`, fontFamily: "'Libre Baskerville', serif", fontSize: base.fontSize, color: '#1a1a1a', lineHeight: 1.6 },
    header: { textAlign: 'center' as const, marginBottom: 24, borderBottom: '2px solid #1a1a1a', paddingBottom: 16 },
    name: { fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.02em', marginBottom: 5 },
    title: { fontFamily: "'Libre Baskerville', serif", fontSize: 12, fontStyle: 'italic', color: '#444', marginBottom: 6 },
    contact: { fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.06em', color: '#555' },
    summary: { fontSize: 10.5, lineHeight: 1.7, color: '#222', margin: 0, textAlign: 'justify' as const },
    sectionWrap: { marginBottom: 20 },
    sectionHeader: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#1a1a1a', marginBottom: 5 },
    sectionRule: { height: 1, background: '#1a1a1a', marginBottom: 10 },
    jobTitle: { fontFamily: "'Libre Baskerville', serif", fontSize: 11, fontWeight: 700, color: '#1a1a1a' },
    company: { fontFamily: "'Libre Baskerville', serif", fontSize: 10.5, fontStyle: 'italic', color: '#444' },
    meta: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, color: '#666' },
    bullet: { fontSize: 10, lineHeight: 1.6, color: '#222', textAlign: 'justify' as const },
    bulletDot: { color: '#1a1a1a', flexShrink: 0 },
    skillCat: { fontWeight: 700, minWidth: 120, fontSize: 10 },
    skillItems: { fontSize: 10 },
    degreeTitle: { fontFamily: "'Libre Baskerville', serif", fontSize: 11, fontWeight: 700 },
    institution: { fontFamily: "'Libre Baskerville', serif", fontSize: 10.5, fontStyle: 'italic', color: '#444' },
  },

  'tech-dark': {
    page: { width: A4.width, minHeight: 1123, background: '#0D1117', display: 'flex', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: '#C9D1D9' },
    sidebar: { width: 200, background: '#161B22', color: '#C9D1D9', padding: '36px 18px', flexShrink: 0, borderRight: '1px solid #30363D' },
    main: { flex: 1, padding: '36px 28px' },
    sidebarName: { fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: '#58A6FF', lineHeight: 1.3, marginBottom: 4 },
    sidebarTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#8B949E', marginBottom: 20 },
    sidebarSection: { marginBottom: 18 },
    sidebarSectionLabel: { fontSize: 7.5, fontWeight: 700, letterSpacing: '0.12em', color: '#3FB950', marginBottom: 8, borderBottom: '1px solid #30363D', paddingBottom: 4 },
    sidebarContact: {},
    sidebarContactItem: { fontSize: 8, color: '#8B949E', marginBottom: 4, lineHeight: 1.4, wordBreak: 'break-all' as const },
    sidebarItem: { fontSize: 8, color: '#8B949E', marginBottom: 3, lineHeight: 1.5 },
    mainSection: { marginBottom: 20 },
    mainSectionLabel: { fontSize: 7.5, fontWeight: 700, letterSpacing: '0.15em', color: '#3FB950', marginBottom: 5, borderBottom: '1px solid #30363D', paddingBottom: 4 },
    mainSectionRule: { display: 'none' },
    jobTitle: { fontSize: 10.5, fontWeight: 700, color: '#58A6FF' },
    company: { fontSize: 9, color: '#F0883E' },
    meta: { fontSize: 8, color: '#8B949E' },
    bullet: { fontSize: 9, lineHeight: 1.55, color: '#C9D1D9' },
    bulletDot: { color: '#3FB950', flexShrink: 0 },
    summary: { fontSize: 9.5, lineHeight: 1.6, color: '#8B949E', margin: 0 },
    degreeTitle: { fontSize: 10.5, fontWeight: 700, color: '#58A6FF' },
  },

  'creative-edge': {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', fontFamily: "'Work Sans', sans-serif", fontSize: base.fontSize, color: '#1a1a1a' },
    header: { background: '#D6431F', padding: '36px 48px', color: '#FFFFFF' },
    name: { fontSize: 38, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 4 },
    title: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 400, marginBottom: 8 },
    contact: { fontSize: 9, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em' },
    body: { padding: '28px 48px' },
    section: { marginBottom: 20 },
    sectionLabel: { fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: '#D6431F', marginBottom: 5 },
    sectionRule: { height: 2, background: '#D6431F', marginBottom: 10 },
    jobTitle: { fontSize: 11.5, fontWeight: 700, color: '#1a1a1a' },
    company: { fontSize: 10.5, color: '#D6431F', fontWeight: 600 },
    meta: { fontSize: 8.5, color: '#999' },
    bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#333' },
    bulletDot: { color: '#D6431F', flexShrink: 0 },
    bodyText: { fontSize: 10, lineHeight: 1.6, color: '#333' },
  },

  'elegant-serif': {
    page: { width: A4.width, minHeight: 1123, background: '#FDFAF6', padding: `${A4.padding}px 64px`, fontFamily: "'Lora', serif", fontSize: base.fontSize, color: '#1a1a1a', lineHeight: 1.6 },
    header: { textAlign: 'center' as const, marginBottom: 24, paddingBottom: 18 },
    name: { fontFamily: "'Lora', serif", fontSize: 34, fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.01em', marginBottom: 5 },
    title: { fontFamily: "'Lora', serif", fontSize: 13, fontStyle: 'italic', color: '#7A6956', marginBottom: 8 },
    contact: { fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.08em', color: '#5C4E3E' },
    summary: { fontSize: 10.5, lineHeight: 1.7, color: '#2C2218', margin: 0, fontStyle: 'italic' },
    sectionWrap: { marginBottom: 20 },
    sectionHeader: { fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: '0.2em', marginBottom: 4, color: '#7A6956' },
    sectionRule: { height: 1, background: '#C4A882', marginBottom: 10 },
    jobTitle: { fontFamily: "'Lora', serif", fontSize: 12, fontWeight: 700, color: '#1a1a1a' },
    company: { fontFamily: "'Lora', serif", fontSize: 11, fontStyle: 'italic', color: '#7A6956' },
    meta: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, color: '#9E8878' },
    bullet: { fontSize: 10, lineHeight: 1.6, color: '#2C2218' },
    bulletDot: { color: '#C4A882', flexShrink: 0 },
    skillCat: { fontFamily: "'Lora', serif", fontWeight: 700, minWidth: 110, fontSize: 10 },
    skillItems: { fontSize: 10, color: '#444' },
    degreeTitle: { fontFamily: "'Lora', serif", fontSize: 12, fontWeight: 700 },
    institution: { fontFamily: "'Lora', serif", fontSize: 11, fontStyle: 'italic', color: '#7A6956' },
  },

  swiss: {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: base.fontSize, color: '#111' },
    header: { borderTop: '4px solid #D40000', borderBottom: '1px solid #111', padding: '20px 40px', marginBottom: 0 },
    name: { fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', color: '#111', marginBottom: 2 },
    title: { fontSize: 11, color: '#555', fontWeight: 400, marginBottom: 5 },
    contact: { fontSize: 8.5, color: '#666', letterSpacing: '0.04em' },
    cols: { display: 'flex', padding: '20px 32px', gap: 24 },
    leftCol: { flex: 2.2 },
    rightCol: { width: 190, flexShrink: 0, borderLeft: '1px solid #DDD', paddingLeft: 20 },
    sectionWrap: { marginBottom: 18 },
    sectionLabel: { fontSize: 7.5, fontWeight: 700, letterSpacing: '0.2em', color: '#D40000', marginBottom: 4 },
    sectionRule: { height: 1, background: '#DDD', marginBottom: 10 },
    jobTitle: { fontSize: 11, fontWeight: 700, color: '#111' },
    company: { fontSize: 10, color: '#D40000', fontWeight: 600 },
    meta: { fontSize: 8, color: '#999', letterSpacing: '0.04em' },
    bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#333' },
    bulletDot: { color: '#D40000', flexShrink: 0 },
    body: { fontSize: 10, lineHeight: 1.5, color: '#333' },
  },

  timeline: {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', padding: `${A4.padding}px 48px`, fontFamily: "'Work Sans', sans-serif", fontSize: base.fontSize, color: '#1a1a1a' },
    header: { marginBottom: 20, paddingBottom: 16, borderBottom: '2px solid #2D6A4F' },
    name: { fontSize: 30, fontWeight: 600, color: '#1a1a1a', marginBottom: 3 },
    title: { fontSize: 12, color: '#2D6A4F', fontWeight: 500, marginBottom: 6 },
    contact: { fontSize: 8.5, color: '#666' },
    summary: { fontSize: 10, lineHeight: 1.6, color: '#444', margin: '0 0 0 0' },
    sectionLabel: { fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: '#2D6A4F', marginBottom: 5 },
    sectionRule: { height: 1, background: '#C8E6D8', marginBottom: 10 },
    timelineYear: { fontFamily: "'Work Sans', sans-serif", fontSize: 8, fontWeight: 700, color: '#2D6A4F', letterSpacing: '0.05em', marginBottom: 8 },
    timelineDot: { width: 8, height: 8, borderRadius: '50%', background: '#2D6A4F', position: 'absolute' as const, right: -4, top: 18, zIndex: 2 },
    timelineLine: { position: 'absolute' as const, right: -1, top: 28, bottom: 0, width: 1, background: '#C8E6D8' },
    jobTitle: { fontSize: 11, fontWeight: 600, color: '#1a1a1a' },
    company: { fontSize: 9.5, color: '#2D6A4F', fontWeight: 500 },
    meta: { fontSize: 8, color: '#888' },
    bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#333' },
    bulletDot: { color: '#2D6A4F', flexShrink: 0 },
  },

  consultant: {
    page: { width: A4.width, minHeight: 1123, background: '#FAFAFA', fontFamily: "'Inter', sans-serif", fontSize: base.fontSize, color: '#1a1a1a' },
    header: { background: '#FFFFFF', padding: '28px 40px', borderBottom: '3px solid #2C3E50', marginBottom: 0 },
    name: { fontSize: 28, fontWeight: 700, color: '#2C3E50', letterSpacing: '-0.01em', marginBottom: 3 },
    title: { fontSize: 11, color: '#7F8C8D', fontWeight: 400, marginBottom: 6 },
    contact: { fontSize: 8.5, color: '#95A5A6', letterSpacing: '0.04em' },
    cols: { display: 'flex', padding: '24px 32px', gap: 28 },
    leftCol: { flex: 2 },
    rightCol: { width: 200, flexShrink: 0 },
    sectionWrap: { marginBottom: 18 },
    sectionLabel: { fontSize: 7.5, fontWeight: 700, letterSpacing: '0.2em', color: '#2C3E50', marginBottom: 4 },
    sectionRule: { height: 2, background: '#2C3E50', marginBottom: 10 },
    jobTitle: { fontSize: 11, fontWeight: 700, color: '#2C3E50' },
    company: { fontSize: 10, color: '#E67E22', fontWeight: 600 },
    meta: { fontSize: 8.5, color: '#95A5A6' },
    bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#444' },
    bulletDot: { color: '#E67E22', flexShrink: 0 },
    body: { fontSize: 10, lineHeight: 1.6, color: '#555' },
  },

  'fresh-grad': {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', padding: `${A4.padding}px`, fontFamily: "'Outfit', sans-serif", fontSize: base.fontSize, color: '#1a1a1a', lineHeight: 1.55 },
    header: { marginBottom: 22, paddingBottom: 16, borderBottom: '2px solid #00897B' },
    name: { fontSize: 32, fontWeight: 700, color: '#1a1a1a', marginBottom: 3, letterSpacing: '-0.01em' },
    title: { fontSize: 13, color: '#00897B', fontWeight: 500, marginBottom: 7 },
    contact: { fontSize: 9, color: '#666' },
    summary: { fontSize: 10.5, lineHeight: 1.65, color: '#333', margin: 0 },
    sectionWrap: { marginBottom: 18 },
    sectionHeader: { fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: '#00897B', marginBottom: 5 },
    sectionRule: { height: 1, background: '#B2DFDB', marginBottom: 10 },
    jobTitle: { fontSize: 11.5, fontWeight: 600, color: '#1a1a1a' },
    company: { fontSize: 10.5, color: '#00897B', fontWeight: 500 },
    meta: { fontSize: 8.5, color: '#888' },
    bullet: { fontSize: 9.5, lineHeight: 1.55, color: '#333' },
    bulletDot: { color: '#00897B', flexShrink: 0 },
    skillCat: { fontWeight: 600, minWidth: 100, fontSize: 10, color: '#333' },
    skillItems: { fontSize: 9.5, color: '#555' },
    degreeTitle: { fontSize: 11.5, fontWeight: 600 },
    institution: { fontSize: 10.5, color: '#00897B' },
  },

  director: {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', fontFamily: "'Fraunces', serif", fontSize: base.fontSize, color: '#1a1a1a' },
    header: { background: '#1A1A2E', padding: '40px 48px', color: '#FFFFFF' },
    name: { fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 5 },
    title: { fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#8899AA', marginBottom: 10 },
    contact: { fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em' },
    body: { padding: '32px 48px' },
    section: { marginBottom: 22 },
    sectionLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.22em', color: '#1A1A2E', marginBottom: 5 },
    sectionRule: { height: 2, background: '#1A1A2E', marginBottom: 12 },
    jobTitle: { fontFamily: "'Fraunces', serif", fontSize: 13, fontWeight: 600, color: '#1A1A2E' },
    company: { fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#8899AA', fontWeight: 500 },
    meta: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, color: '#AAA' },
    bullet: { fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, lineHeight: 1.55, color: '#333' },
    bulletDot: { color: '#1A1A2E', flexShrink: 0 },
    bodyText: { fontFamily: "'DM Sans', sans-serif", fontSize: 10, lineHeight: 1.6, color: '#333' },
  },

  'data-engineer': {
    page: { width: A4.width, minHeight: 1123, background: '#F8FAFB', fontFamily: "'Inter', sans-serif", fontSize: base.fontSize, color: '#1a1a1a' },
    header: { background: '#16213E', padding: '28px 40px', marginBottom: 0 },
    name: { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: '#00D4FF', marginBottom: 4 },
    title: { fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#8899AA', marginBottom: 7, letterSpacing: '0.05em' },
    contact: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#66788A' },
    cols: { display: 'flex', padding: '20px 32px', gap: 24 },
    leftCol: { flex: 2.2 },
    rightCol: { width: 195, flexShrink: 0, borderLeft: '1px solid #DEE5ED', paddingLeft: 20 },
    sectionWrap: { marginBottom: 18 },
    sectionLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 7.5, fontWeight: 600, letterSpacing: '0.12em', color: '#00D4FF', marginBottom: 4 },
    sectionRule: { height: 1, background: '#DEE5ED', marginBottom: 10 },
    jobTitle: { fontSize: 11, fontWeight: 700, color: '#16213E' },
    company: { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#00A896' },
    meta: { fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#94A3B8' },
    bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#334155' },
    bulletDot: { color: '#00D4FF', flexShrink: 0 },
    body: { fontSize: 9.5, lineHeight: 1.55, color: '#334155' },
  },

  architect: {
    page: { width: A4.width, minHeight: 1123, background: '#FAFAFA', fontFamily: "'DM Sans', sans-serif", fontSize: base.fontSize, color: '#1a1a1a' },
    runningHead: { fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#666', padding: '8px 40px', borderBottom: '1px solid #DDD' },
    headRule: { height: 1, background: '#1a1a1a' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '20px 40px 16px' },
    nameBlock: {},
    name: { fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#1a1a1a', marginBottom: 4 },
    title: { fontSize: 11, color: '#666', fontWeight: 300, letterSpacing: '0.08em' },
    contactBlock: { textAlign: 'right' as const },
    contactItem: { fontSize: 8.5, color: '#666', marginBottom: 3, letterSpacing: '0.04em' },
    summaryBlock: { padding: '0 40px 18px', borderBottom: '1px solid #DDD' },
    figNumber: { fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.12em', color: '#D6431F', marginBottom: 4 },
    summary: { fontSize: 10, lineHeight: 1.65, color: '#333', margin: 0 },
    cols: { display: 'flex', padding: '18px 32px', gap: 24, alignItems: 'flex-start' },
    leftCol: { flex: 2 },
    rightCol: { width: 200, flexShrink: 0, borderLeft: '1px solid #DDD', paddingLeft: 20 },
    section: { marginBottom: 18 },
    sectionLabel: { fontSize: 8.5, fontWeight: 700, letterSpacing: '0.15em', color: '#1a1a1a', marginBottom: 5, paddingBottom: 5, borderBottom: '2px solid #1a1a1a' },
    jobTitle: { fontSize: 11, fontWeight: 700, color: '#1a1a1a' },
    company: { fontSize: 10, color: '#D6431F', fontWeight: 500 },
    meta: { fontSize: 8.5, color: '#888' },
    bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#333' },
  },

  editorial: {
    page: { width: A4.width, minHeight: 1123, background: '#F9F5EE', fontFamily: "'EB Garamond', serif", fontSize: base.fontSize, color: '#1a1a1a' },
    runningHead: { fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#8B7355', padding: '8px 40px', borderBottom: '1px solid #C4A882' },
    headRule: { height: 2, background: '#8B7355', margin: '0 40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '14px 40px 14px' },
    nameBlock: {},
    name: { fontFamily: "'EB Garamond', serif", fontSize: 32, fontWeight: 600, color: '#1a1a1a', marginBottom: 3, letterSpacing: '0.01em' },
    title: { fontFamily: "'EB Garamond', serif", fontSize: 13, fontStyle: 'italic', color: '#8B7355', marginBottom: 0 },
    contactBlock: { textAlign: 'right' as const },
    contactItem: { fontFamily: "'DM Sans', sans-serif", fontSize: 8, color: '#8B7355', marginBottom: 3 },
    summaryBlock: { padding: '12px 40px', borderTop: '1px solid #C4A882', borderBottom: '1px solid #C4A882', background: '#F3EDE3', marginBottom: 0 },
    figNumber: { fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.12em', color: '#D6431F', marginBottom: 3 },
    summary: { fontFamily: "'EB Garamond', serif", fontSize: 11, lineHeight: 1.6, color: '#2C2218', margin: 0, fontStyle: 'italic' },
    cols: { display: 'flex', padding: '14px 32px', gap: 0, borderTop: '1px solid #C4A882' },
    leftCol: { flex: 2, padding: '0 20px 0 8px', borderRight: '1px solid #C4A882' },
    rightCol: { flex: 1, padding: '0 8px 0 20px' },
    section: { marginBottom: 16 },
    sectionLabel: { fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#8B7355', marginBottom: 6, paddingBottom: 5, borderBottom: '1px solid #C4A882' },
    jobTitle: { fontFamily: "'EB Garamond', serif", fontSize: 12, fontWeight: 600, color: '#1a1a1a' },
    company: { fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: '#8B7355', fontWeight: 500 },
    meta: { fontFamily: "'DM Sans', sans-serif", fontSize: 8, color: '#9E8878' },
    bullet: { fontFamily: "'EB Garamond', serif", fontSize: 10.5, lineHeight: 1.5, color: '#2C2218' },
  },

  'bold-strike': {
    page: { width: A4.width, minHeight: 1123, background: '#FFFFFF', fontFamily: "'Work Sans', sans-serif", fontSize: base.fontSize, color: '#1a1a1a' },
    header: { padding: '36px 48px 28px', borderBottom: '5px solid #7B2D8B' },
    name: { fontSize: 36, fontWeight: 800, color: '#1a1a1a', marginBottom: 4, letterSpacing: '-0.02em' },
    title: { fontSize: 13, color: '#7B2D8B', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '0.08em' },
    contact: { fontSize: 9, color: '#666' },
    body: { padding: '24px 48px' },
    section: { marginBottom: 20 },
    sectionLabel: { fontSize: 8.5, fontWeight: 800, letterSpacing: '0.15em', color: '#1a1a1a', marginBottom: 0, paddingBottom: 4 },
    sectionRule: { height: 3, background: '#7B2D8B', marginBottom: 10, width: 40 },
    jobTitle: { fontSize: 12, fontWeight: 700, color: '#1a1a1a' },
    company: { fontSize: 10.5, color: '#7B2D8B', fontWeight: 600 },
    meta: { fontSize: 8.5, color: '#999' },
    bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#333' },
    bulletDot: { color: '#7B2D8B', flexShrink: 0 },
    bodyText: { fontSize: 10, lineHeight: 1.6, color: '#333' },
  },

  'minimal-mono': {
    page: { width: A4.width, minHeight: 1123, background: '#1E1E2E', padding: `${A4.padding}px`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: '#CDD6F4', lineHeight: 1.6 },
    header: { marginBottom: 24, borderBottom: '1px solid #313244', paddingBottom: 16 },
    name: { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: '#89B4FA', marginBottom: 4 },
    title: { fontSize: 10, color: '#A6ADC8', marginBottom: 8 },
    contact: { fontSize: 8.5, color: '#585B70' },
    summary: { fontSize: 9.5, lineHeight: 1.65, color: '#A6ADC8', margin: 0 },
    sectionWrap: { marginBottom: 20 },
    sectionHeader: { fontSize: 7.5, fontWeight: 700, letterSpacing: '0.15em', color: '#A6E3A1', marginBottom: 5 },
    sectionRule: { height: 1, background: '#313244', marginBottom: 10 },
    jobTitle: { fontSize: 10.5, fontWeight: 700, color: '#89B4FA' },
    company: { fontSize: 9.5, color: '#FAB387' },
    meta: { fontSize: 8.5, color: '#585B70' },
    bullet: { fontSize: 9, lineHeight: 1.55, color: '#BAC2DE' },
    bulletDot: { color: '#A6E3A1', flexShrink: 0 },
    skillCat: { fontWeight: 700, color: '#CBA6F7', minWidth: 110, fontSize: 9.5 },
    skillItems: { fontSize: 9, color: '#A6ADC8' },
    degreeTitle: { fontSize: 10.5, fontWeight: 700, color: '#89B4FA' },
    institution: { fontSize: 9.5, color: '#FAB387' },
  },

  legal: {
    page: { width: A4.width, minHeight: 1123, background: '#FFFEF9', padding: `${A4.padding}px 72px`, fontFamily: "'Merriweather', serif", fontSize: 10, color: '#1a1a1a', lineHeight: 1.7 },
    header: { textAlign: 'center' as const, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #1a1a1a' },
    name: { fontFamily: "'Merriweather', serif", fontSize: 22, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: '#1a1a1a', marginBottom: 5 },
    title: { fontFamily: "'Merriweather', serif", fontSize: 10.5, fontStyle: 'italic', color: '#444', marginBottom: 6 },
    contact: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, letterSpacing: '0.06em', color: '#555' },
    summary: { fontSize: 10, lineHeight: 1.75, color: '#1a1a1a', margin: 0, textAlign: 'justify' as const },
    sectionWrap: { marginBottom: 18 },
    sectionHeader: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#1a1a1a', marginBottom: 4, textAlign: 'center' as const },
    sectionRule: { height: 1, background: '#1a1a1a', marginBottom: 10 },
    jobTitle: { fontFamily: "'Merriweather', serif", fontSize: 10.5, fontWeight: 700, color: '#1a1a1a' },
    company: { fontFamily: "'Merriweather', serif", fontSize: 10, fontStyle: 'italic', color: '#333' },
    meta: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, color: '#666' },
    bullet: { fontSize: 10, lineHeight: 1.7, color: '#222', textAlign: 'justify' as const },
    bulletDot: { color: '#1a1a1a', flexShrink: 0 },
    skillCat: { fontWeight: 700, minWidth: 120, fontSize: 10 },
    skillItems: { fontSize: 10 },
    degreeTitle: { fontFamily: "'Merriweather', serif", fontSize: 10.5, fontWeight: 700 },
    institution: { fontFamily: "'Merriweather', serif", fontSize: 10, fontStyle: 'italic', color: '#333' },
  },

  contemporary: {
    page: { width: A4.width, minHeight: 1123, background: '#F5F7F8', display: 'flex', fontFamily: "'Source Sans 3', sans-serif", fontSize: base.fontSize, color: '#1a1a1a' },
    sidebar: { width: 210, background: '#455A64', color: '#ECEFF1', padding: '40px 20px', flexShrink: 0 },
    main: { flex: 1, padding: '40px 32px', background: '#FFFFFF' },
    sidebarName: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 20, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.25, marginBottom: 5 },
    sidebarTitle: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#90A4AE', marginBottom: 22 },
    sidebarSection: { marginBottom: 20 },
    sidebarSectionLabel: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#80CBC4', marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 5 },
    sidebarContact: {},
    sidebarContactItem: { fontSize: 8.5, color: '#B0BEC5', marginBottom: 4, lineHeight: 1.4, wordBreak: 'break-all' as const },
    sidebarItem: { fontSize: 8.5, color: '#CFD8DC', marginBottom: 3, lineHeight: 1.4 },
    mainSection: { marginBottom: 20 },
    mainSectionLabel: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#455A64', marginBottom: 5 },
    mainSectionRule: { height: 2, background: '#455A64', marginBottom: 12 },
    jobTitle: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 11.5, fontWeight: 700, color: '#1a1a1a' },
    company: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 10.5, color: '#455A64', fontWeight: 600 },
    meta: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 8.5, color: '#9E9E9E' },
    bullet: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 9.5, lineHeight: 1.55, color: '#333' },
    bulletDot: { color: '#455A64', flexShrink: 0 },
    summary: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, lineHeight: 1.65, color: '#444', margin: 0 },
    degreeTitle: { fontFamily: "'Source Sans 3', sans-serif", fontSize: 11.5, fontWeight: 600 },
  },

  refined: {
    page: { width: A4.width, minHeight: 1123, background: '#FEFCF8', padding: `${A4.padding}px 72px`, fontFamily: "'Fraunces', serif", fontSize: base.fontSize, color: '#1a1a1a', lineHeight: 1.65 },
    header: { marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #C4A882' },
    name: { fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 400, fontStyle: 'italic', color: '#1a1a1a', letterSpacing: '-0.01em', marginBottom: 5 },
    title: { fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#8B7355', marginBottom: 8 },
    contact: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, letterSpacing: '0.06em', color: '#9E8878' },
    summary: { fontFamily: "'Fraunces', serif", fontSize: 11, lineHeight: 1.75, color: '#2C2218', margin: 0, fontStyle: 'italic' },
    sectionWrap: { marginBottom: 22 },
    sectionHeader: { fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#8B7355', marginBottom: 5 },
    sectionRule: { height: 1, background: '#C4A882', marginBottom: 12 },
    jobTitle: { fontFamily: "'Fraunces', serif", fontSize: 13, fontWeight: 600, color: '#1a1a1a' },
    company: { fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: '#8B7355', fontWeight: 400 },
    meta: { fontFamily: "'DM Sans', sans-serif", fontSize: 8.5, color: '#B0997E' },
    bullet: { fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, lineHeight: 1.6, color: '#2C2218' },
    bulletDot: { color: '#C4A882', flexShrink: 0 },
    skillCat: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontStyle: 'italic', minWidth: 120, fontSize: 11 },
    skillItems: { fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: '#444' },
    degreeTitle: { fontFamily: "'Fraunces', serif", fontSize: 13, fontWeight: 600 },
    institution: { fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: '#8B7355' },
  },
};

// ─── Layout: Google Tech (XYZ Formula - 2-Column) ───────────────────────────

function GoogleSectionHeader({
  label,
  badge,
  icon,
}: {
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, marginTop: 3 }}>
      {icon && <span style={{ color: '#1A73E8', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
      <span
        style={{
          fontFamily: "'Roboto', 'Inter', sans-serif",
          fontSize: 8.8,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#1A73E8',
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1.5, background: '#E8EAED' }} />
      {badge && (
        <span
          style={{
            fontSize: 6.8,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#1A73E8',
            background: '#E8F0FE',
            border: '1px solid #D2E3FC',
            padding: '1px 5px',
            borderRadius: 3,
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function GoogleCV({ data }: { data: CVData }) {
  const { personal, experience, education, skills, projects, certifications, languages } = data;

  return (
    <div
      style={{
        width: A4.width,
        minHeight: 1123,
        background: '#FFFFFF',
        padding: '28px 38px 24px 38px',
        fontFamily: "'Roboto', 'Inter', sans-serif",
        color: '#202124',
        boxSizing: 'border-box',
        fontSize: 9.3,
        lineHeight: 1.48,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* 1. Header Section */}
      <div style={{ flexShrink: 0 }}>
        {/* Top Google 4-Color Accent Strip */}
        <div style={{ display: 'flex', height: 4.5, borderRadius: 2.5, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ flex: 1, background: '#4285F4' }} />
          <div style={{ flex: 1, background: '#EA4335' }} />
          <div style={{ flex: 1, background: '#FBBC05' }} />
          <div style={{ flex: 1, background: '#34A853' }} />
        </div>

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1.5px solid #E8EAED' }}>
          <div style={{ flex: 1 }}>
            <div>
              <div
                style={{
                  fontFamily: "'Roboto', 'Inter', sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#202124',
                  lineHeight: 1.15,
                  marginBottom: 3,
                }}
              >
                {personal.name || 'Your Name'}
              </div>
              {personal.title && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#1A73E8',
                    letterSpacing: '0.02em',
                    lineHeight: 1.25,
                  }}
                >
                  {personal.title}
                </div>
              )}
            </div>
            <div style={{ marginTop: 7 }}>
              <ContactButtonsBar personal={personal} variant="google" gap={6} />
            </div>
          </div>

          {personal.photo && (
            <div style={{ marginLeft: 18, flexShrink: 0 }}>
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: '50%',
                  padding: 2.5,
                  background: 'conic-gradient(#4285F4 0deg 90deg, #EA4335 90deg 180deg, #FBBC05 180deg 270deg, #34A853 270deg 360deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(26,115,232,0.22)',
                }}
              >
                <img
                  src={personal.photo}
                  alt={personal.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #FFFFFF',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Professional Profile Summary */}
      {personal.summary && (
        <div
          style={{
            flexShrink: 0,
            background: '#F8FAFD',
            borderLeft: '4px solid #1A73E8',
            borderTop: '1px solid #E8F0FE',
            borderRight: '1px solid #E8F0FE',
            borderBottom: '1px solid #E8F0FE',
            padding: '8px 14px',
            borderRadius: '0 6px 6px 0',
          }}
        >
          <div style={{ fontSize: 7.8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A73E8', marginBottom: 3 }}>
            Professional Profile
          </div>
          <p style={{ margin: 0, fontSize: 9.2, lineHeight: 1.52, color: '#3C4043' }}>
            {personal.summary}
          </p>
        </div>
      )}

      {/* 3. Technical Skills & Core Stack */}
      {skills.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          <GoogleSectionHeader label="Technical Skills & Core Stack" badge="Production Stack" icon={<Sparkles size={13} />} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 20px' }}>
            {skills.map(sg => (
              <div key={sg.id} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 8.6, fontWeight: 700, color: '#202124', minWidth: 100, flexShrink: 0 }}>
                  {sg.category}:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3.5 }}>
                  {sg.items.map(item => (
                    <span
                      key={item}
                      style={{
                        fontSize: 7.8,
                        fontWeight: 500,
                        color: '#174EA6',
                        background: '#E8F0FE',
                        border: '1px solid #D2E3FC',
                        padding: '1.5px 6.5px',
                        borderRadius: 4,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Work Experience */}
      {experience.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          <GoogleSectionHeader label="Work Experience" badge="Google XYZ Formula" icon={<Briefcase size={13} />} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#202124' }}>{exp.position}</span>
                  <span
                    style={{
                      fontSize: 8.2,
                      fontWeight: 500,
                      color: '#5F6368',
                      background: '#F1F3F4',
                      padding: '1.5px 7px',
                      borderRadius: 3,
                    }}
                  >
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ fontSize: 9.8, fontWeight: 600, color: '#1A73E8' }}>{exp.company}</span>
                  {exp.location && <span style={{ fontSize: 8.2, color: '#5F6368' }}>{exp.location}</span>}
                </div>
                <ul style={{ margin: 0, paddingLeft: 10, listStyle: 'none' }}>
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: 'flex', gap: 6, marginBottom: 3, alignItems: 'flex-start' }}>
                      <span style={{ color: '#1A73E8', fontSize: 11, lineHeight: '13px', flexShrink: 0 }}>•</span>
                      <span style={{ fontSize: 9, lineHeight: 1.46, color: '#3C4043' }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Featured Projects & Production Systems */}
      {projects.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          <GoogleSectionHeader label="Featured Projects & Production Systems" badge="Live Repos" icon={<Code size={13} />} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {projects.map(p => (
              <div key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontSize: 10.4, fontWeight: 700, color: '#202124' }}>{p.name}</span>
                  {p.url && <ProjectLinkButton url={p.url} variant="google" />}
                </div>
                {p.technologies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3.5, margin: '2.5px 0' }}>
                    {p.technologies.map(tech => (
                      <span
                        key={tech}
                        style={{
                          fontSize: 7.6,
                          color: '#5F6368',
                          background: '#F1F3F4',
                          padding: '1px 6px',
                          borderRadius: 3,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <p style={{ margin: '2px 0 0', fontSize: 8.9, lineHeight: 1.45, color: '#3C4043' }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Education Section (Full Width) */}
      {education.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          <GoogleSectionHeader label="Education" icon={<GraduationCap size={13} />} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {education.map(edu => (
              <div key={edu.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#202124' }}>
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 8.2, color: '#5F6368' }}>{edu.startDate} – {edu.endDate}</span>
                    {edu.gpa && (
                      <span style={{ fontSize: 7.8, fontWeight: 600, color: '#174EA6', background: '#E8F0FE', border: '1px solid #D2E3FC', padding: '1px 6px', borderRadius: 3 }}>
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                  <span style={{ fontSize: 9.2, fontWeight: 500, color: '#1A73E8' }}>{edu.institution}</span>
                  {edu.honors && (
                    <span style={{ fontSize: 8.2, color: '#5F6368', fontStyle: 'italic' }}>
                      {edu.honors}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Certifications, Achievements & Languages (Full-Width Bottom Anchor) */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <GoogleSectionHeader label="Certifications & Achievements" icon={<Award size={13} />} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4.5 }}>
                {certifications.map(c => (
                  <div
                    key={c.id}
                    style={{
                      background: '#F8FAFD',
                      border: '1px solid #E8EAED',
                      borderRadius: 4,
                      padding: '4px 8px',
                    }}
                  >
                    <div style={{ fontSize: 8.4, fontWeight: 700, color: '#202124', lineHeight: 1.3 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 7.6, color: '#1A73E8', fontWeight: 500 }}>
                      {c.issuer} {c.date ? `· ${c.date}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages & Core Competencies */}
          <div>
            {languages.length > 0 && (
              <div style={{ marginBottom: 6 }}>
                <GoogleSectionHeader label="Languages" icon={<Languages size={13} />} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {languages.map(l => (
                    <span
                      key={l.id}
                      style={{
                        fontSize: 8.2,
                        color: '#3C4043',
                        background: '#F1F3F4',
                        padding: '2px 8px',
                        borderRadius: 3,
                      }}
                    >
                      <strong>{l.language}:</strong> {l.level}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core ATS Competencies */}
            <div>
              <div style={{ fontSize: 7.6, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6368', marginBottom: 4, marginTop: 4 }}>
                Core Competencies
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3.5 }}>
                {['System Architecture', 'REST & gRPC APIs', 'Microservices', 'CI/CD Pipelines', 'Database Tuning'].map(comp => (
                  <span
                    key={comp}
                    style={{
                      fontSize: 7.4,
                      color: '#174EA6',
                      background: '#F8FAFD',
                      border: '1px solid #D2E3FC',
                      padding: '1px 5px',
                      borderRadius: 3,
                    }}
                  >
                    ✓ {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Layout: Microsoft Executive (Fluent Design) ──────────────────────────────

function MicrosoftSectionHeader({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          fontSize: 8.5,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#0078D4',
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div style={{ height: 2, background: '#0078D4', width: 28 }} />
    </div>
  );
}

function MicrosoftCV({ data }: { data: CVData }) {
  const { personal, experience, education, skills, projects, certifications, languages } = data;

  return (
    <div
      style={{
        width: A4.width,
        minHeight: 1123,
        background: '#FFFFFF',
        fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
        color: '#242424',
        boxSizing: 'border-box',
        fontSize: base.fontSize,
        lineHeight: 1.5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Microsoft Fluent Executive Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #005A9E 0%, #0078D4 100%)',
          color: '#FFFFFF',
          padding: '28px 40px 24px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              {/* Microsoft Fluent 4-tile micro emblem */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 6.5px)', gap: 2.5, flexShrink: 0 }}>
                <div style={{ width: 6.5, height: 6.5, background: '#F25022' }} />
                <div style={{ width: 6.5, height: 6.5, background: '#7FBA00' }} />
                <div style={{ width: 6.5, height: 6.5, background: '#00A4EF' }} />
                <div style={{ width: 6.5, height: 6.5, background: '#FFB900' }} />
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
                {personal.name || 'Your Name'}
              </div>
            </div>
            {personal.title && (
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#C7E0F4',
                  marginBottom: 10,
                  paddingLeft: 19,
                }}
              >
                {personal.title}
              </div>
            )}
            <div style={{ paddingLeft: 19, marginTop: 4 }}>
              <ContactButtonsBar personal={personal} variant="microsoft" />
            </div>
          </div>
          {personal.photo && (
            <div style={{ marginLeft: 20, flexShrink: 0 }}>
              <PhotoSquare src={personal.photo} size={72} border="2.5px solid rgba(255,255,255,0.4)" />
            </div>
          )}
        </div>
      </div>

      {/* Two-Column Fluent Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Main Column (Experience, Summary, Projects) */}
        <div style={{ flex: 1, padding: '24px 28px 28px 40px', boxSizing: 'border-box' }}>
          {/* Executive Summary */}
          {personal.summary && (
            <div style={{ marginBottom: 18 }}>
              <MicrosoftSectionHeader label="Executive Profile" />
              <p style={{ margin: 0, fontSize: 9.5, lineHeight: 1.62, color: '#323130' }}>
                {personal.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <MicrosoftSectionHeader label="Professional Experience" />
              {experience.map((exp, i) => (
                <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? 16 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#242424' }}>{exp.position}</span>
                    <span style={{ fontSize: 8.5, fontWeight: 500, color: '#605E5C' }}>
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#0078D4' }}>{exp.company}</span>
                    {exp.location && <span style={{ fontSize: 8.5, color: '#605E5C' }}>{exp.location}</span>}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 12, listStyle: 'none' }}>
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: 'flex', gap: 6, marginBottom: 3, alignItems: 'flex-start' }}>
                        <span style={{ color: '#0078D4', fontSize: 10, lineHeight: '14px', flexShrink: 0 }}>▪</span>
                        <span style={{ fontSize: 9.5, lineHeight: 1.52, color: '#323130' }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Technical Projects */}
          {projects.length > 0 && (
            <div>
              <MicrosoftSectionHeader label="Key Enterprise & Technical Initiatives" />
              {projects.map((p, i) => (
                <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? 12 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#242424' }}>{p.name}</span>
                    {p.url && <ProjectLinkButton url={p.url} variant="microsoft" />}
                  </div>
                  {p.technologies.length > 0 && (
                    <div style={{ fontSize: 8.5, color: '#0078D4', fontWeight: 500, margin: '2px 0 3px' }}>
                      {p.technologies.join(' · ')}
                    </div>
                  )}
                  <p style={{ margin: 0, fontSize: 9.5, lineHeight: 1.5, color: '#323130' }}>
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Column (Skills, Certifications, Education, Languages) */}
        <div
          style={{
            width: 230,
            flexShrink: 0,
            background: '#FAF9F8',
            borderLeft: '1px solid #EDEBE9',
            padding: '24px 32px 28px 20px',
            boxSizing: 'border-box',
          }}
        >
          {/* Core Competencies / Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <MicrosoftSectionHeader label="Core Competencies" />
              {skills.map(sg => (
                <div key={sg.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#242424', marginBottom: 4 }}>
                    {sg.category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {sg.items.map(item => (
                      <span
                        key={item}
                        style={{
                          fontSize: 8,
                          color: '#106EBE',
                          background: '#EFF6FC',
                          border: '1px solid #C7E0F4',
                          padding: '1.5px 6px',
                          borderRadius: 3,
                          fontWeight: 500,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <MicrosoftSectionHeader label="Certifications" />
              {certifications.map(c => (
                <div
                  key={c.id}
                  style={{
                    borderLeft: '3px solid #0078D4',
                    paddingLeft: 8,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#242424', lineHeight: 1.3 }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 8.5, color: '#0078D4', fontWeight: 500, marginTop: 1 }}>
                    {c.issuer}
                  </div>
                  <div style={{ fontSize: 8, color: '#605E5C' }}>
                    {c.date}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <MicrosoftSectionHeader label="Education" />
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: '#242424' }}>
                    {edu.degree}
                  </div>
                  {edu.field && (
                    <div style={{ fontSize: 8.5, color: '#323130' }}>
                      {edu.field}
                    </div>
                  )}
                  <div style={{ fontSize: 8.5, color: '#0078D4', fontWeight: 500 }}>
                    {edu.institution}
                  </div>
                  <div style={{ fontSize: 8, color: '#605E5C' }}>
                    {edu.startDate} – {edu.endDate}
                  </div>
                  {edu.honors && (
                    <div style={{ fontSize: 8, color: '#605E5C', fontStyle: 'italic', marginTop: 1 }}>
                      {edu.honors}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <MicrosoftSectionHeader label="Languages" />
              {languages.map(l => (
                <div key={l.id} style={{ fontSize: 8.5, color: '#323130', marginBottom: 4 }}>
                  <strong style={{ fontWeight: 600, color: '#242424' }}>{l.language}:</strong> {l.level}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Auto-Fit 1-Page Scaler Component ─────────────────────────────────────────

export function AutoFitSinglePage({ children, id }: { children: React.ReactNode; id?: string }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.scrollHeight;
      const targetHeight = 1123;
      if (h > targetHeight + 2) {
        const s = Math.min(1, Math.max(0.68, (targetHeight - 6) / h));
        setScale(parseFloat(s.toFixed(3)));
      } else {
        setScale(1);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div
      id={id}
      style={{
        width: 794,
        height: 1123,
        maxHeight: 1123,
        overflow: 'hidden',
        background: '#FFFFFF',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: 794,
          transform: scale < 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'top center',
          transition: 'transform 0.12s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Main renderer ─────────────────────────────────────────────────────────────

export function TemplateRenderer({ data, templateId }: { data: CVData; templateId: string }) {
  let content: React.ReactNode;

  if (templateId === 'google') {
    content = <GoogleCV data={data} />;
  } else if (templateId === 'microsoft') {
    content = <MicrosoftCV data={data} />;
  } else {
    const theme = themes[templateId] || themes.classic;

    const sidebarLayouts = ['executive', 'sidebar-noir', 'tech-dark', 'contemporary'];
    const twoColLayouts = ['corporate', 'swiss', 'consultant', 'data-engineer'];
    const timelineLayouts = ['timeline'];
    const editorialLayouts = ['architect', 'editorial'];
    const boldHeaderLayouts = ['creative-edge', 'director', 'bold-strike'];

    if (sidebarLayouts.includes(templateId)) {
      content = <SidebarCV data={data} theme={theme} />;
    } else if (twoColLayouts.includes(templateId)) {
      content = <TwoColCV data={data} theme={theme} />;
    } else if (timelineLayouts.includes(templateId)) {
      content = <TimelineCV data={data} theme={theme} />;
    } else if (editorialLayouts.includes(templateId)) {
      content = <EditorialCV data={data} theme={theme} />;
    } else if (boldHeaderLayouts.includes(templateId)) {
      content = <BoldHeaderCV data={data} theme={theme} />;
    } else {
      content = <SingleColumnCV data={data} theme={theme} />;
    }
  }

  return <AutoFitSinglePage>{content}</AutoFitSinglePage>;
}
