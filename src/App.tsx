import { useState, useRef, useCallback, useEffect, useMemo, Component } from 'react';
import { createPortal } from 'react-dom';
// @ts-ignore
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CVData, TemplateConfig } from './types';
import { TEMPLATES, TemplateRenderer } from './templates';
import { sampleData, utshoBackendCV, utshoAndroidCV, emptyData } from './sampleData';
import { PRESET_PROFILES, PresetProfile, formatCVAsPlainText } from './presets';
import { analyzeCV, ATSAnalysis } from './atsAnalyzer';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Download,
  Upload,
  Copy,
  Check,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileText,
  FileDown,
  Printer,
  Loader2,
  X,
  Layers,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Globe,
  User,
  CheckCircle2,
  Server,
  Smartphone,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Focus,
  Eye,
  Mail,
  Phone,
  MapPin,
  Code2,
  SlidersHorizontal,
  LayoutTemplate,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building2,
} from 'lucide-react';

const LinkedinIcon = ({ size = 14, color = '#64748B' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 14, color = '#64748B' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// ─── Types ─────────────────────────────────────────────────────────────────────

type View = 'landing' | 'builder';
type FormTab = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages';
type PreviewBgMode = 'cream' | 'neutral' | 'dark' | 'grid';
type MobileTab = 'edit' | 'preview' | 'templates';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const ACTION_VERBS = [
  'Led', 'Spearheaded', 'Architected', 'Optimized', 'Engineered', 'Launched',
  'Automated', 'Scaled', 'Streamlined', 'Shipped', 'Orchestrated', 'Improved'
];

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; errorMsg: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Builder Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', background: '#F4EFE6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#D6431F', marginBottom: 12 }}>
            Unable to load builder preview
          </h2>
          <p style={{ color: '#5C5650', fontSize: 12, marginBottom: 20, maxWidth: 400 }}>
            {this.state.errorMsg}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('cv_builder_draft');
              window.location.reload();
            }}
            style={{
              background: '#141210',
              color: '#F4EFE6',
              padding: '10px 24px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Reset Form Data & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>(() => {
    try {
      const savedView = localStorage.getItem('cv_builder_view') as View;
      if (savedView === 'landing' || savedView === 'builder') return savedView;
      return 'builder';
    } catch {
      return 'builder';
    }
  });
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem('cv_builder_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.personal?.name && parsed.personal.name !== 'Alexandra Chen') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return sampleData;
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>(() => {
    try {
      return localStorage.getItem('cv_builder_template') || 'google';
    } catch {
      return 'google';
    }
  });
  const [formTab, setFormTab] = useState<FormTab>('personal');
  const [toast, setToast] = useState<string | null>(null);

  // Auto-save CV data & view preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cv_builder_draft', JSON.stringify(cvData));
    } catch {}
  }, [cvData]);

  useEffect(() => {
    try {
      localStorage.setItem('cv_builder_view', view);
    } catch {}
  }, [view]);

  useEffect(() => {
    try {
      localStorage.setItem('cv_builder_template', selectedTemplate);
    } catch {}
  }, [selectedTemplate]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(prev => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  const handleSelectTemplateFromLanding = (templateId: string) => {
    setSelectedTemplate(templateId);
    setView('builder');
  };

  return (
    <div>
      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 99999,
            background: '#141210',
            color: '#F4EFE6',
            padding: '10px 20px',
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
            borderLeft: '3px solid #D6431F',
          }}
          className="animate-fade-in"
        >
          <CheckCircle2 size={15} color="#10B981" />
          <span>{toast}</span>
        </div>
      )}

      {view === 'landing' ? (
        <LandingPage
          onStart={() => setView('builder')}
          onSelectTemplate={handleSelectTemplateFromLanding}
          onLaunchRole={(role) => {
            if (role === 'backend') {
              setCvData(utshoBackendCV);
              showToast('Loaded Utsho Roy — Backend & API Engineer CV');
            } else {
              setCvData(utshoAndroidCV);
              showToast('Loaded Utsho Roy — Native Android Developer CV');
            }
            setView('builder');
          }}
        />
      ) : (
        <ErrorBoundary>
          <BuilderPage
            cvData={cvData}
            setCvData={setCvData}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            formTab={formTab}
            setFormTab={setFormTab}
            onBack={() => setView('landing')}
            showToast={showToast}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}

// ─── Landing Page (Modern Colorful 2026 SaaS Design by Utsho Roy) ──────────────

function LandingPage({
  onStart,
  onSelectTemplate,
  onLaunchRole,
}: {
  onStart: () => void;
  onSelectTemplate: (id: string) => void;
  onLaunchRole: (role: 'backend' | 'android') => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchCat = activeCategory === 'all' || t.category === activeCategory;
      const matchQuery =
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.layout.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: '#0F172A', overflowX: 'hidden' }}>
      
      {/* ─── Sticky Navbar with Creator Badge ───────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E2E8F0',
          padding: '12px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Left: Brand + Creator Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 16,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              CV
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                CV Studio
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6366F1' }}>
                ATS ENGINE V2.5
              </div>
            </div>
          </div>

          {/* Prominent Creator Badge in Navbar */}
          <a
            href="https://utsho261.github.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)',
              border: '1px solid #C7D2FE',
              borderRadius: 9999,
              padding: '4px 12px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            title="Created & Engineered by Utsho Roy"
          >
            <img
              src="/utsho_profile.png"
              alt="Utsho Roy"
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #2563EB',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>
              Built by <strong style={{ color: '#2563EB' }}>Utsho</strong>
            </span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          </a>
        </div>

        {/* Right Nav Links & Launch Button */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="#templates-section"
            style={{
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 600,
              color: '#475569',
              padding: '6px 12px',
              borderRadius: 6,
              transition: 'all 0.12s',
            }}
          >
            Templates ({TEMPLATES.length})
          </a>
          <a
            href="#creator-spotlight"
            style={{
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 600,
              color: '#475569',
              padding: '6px 12px',
              borderRadius: 6,
              transition: 'all 0.12s',
            }}
          >
            About Creator
          </a>
          <a
            href="https://github.com/utsho261"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              fontSize: 12,
              fontWeight: 600,
              color: '#1E293B',
              padding: '6px 12px',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <GithubIcon size={14} color="#0F172A" />
            <span>GitHub</span>
          </a>
          <button
            onClick={onStart}
            style={{
              background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 700,
              padding: '9px 20px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.35)';
            }}
          >
            <span>Launch Builder →</span>
          </button>
        </div>
      </header>

      {/* ─── Hero Section with Vibrant Gradients & Glowing Accents ────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '64px 32px 48px',
          background: 'radial-gradient(1000px circle at 50% 0%, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.08) 45%, rgba(248, 250, 252, 0) 75%)',
          borderBottom: '1px solid #E2E8F0',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          
          {/* Top Pill Announcement */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFFFFF',
              border: '1px solid #BFDBFE',
              borderRadius: 9999,
              padding: '6px 16px',
              fontSize: 11.5,
              fontWeight: 700,
              color: '#1D4ED8',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)',
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 13 }}>✨</span>
            <span>Next-Gen 1-Page A4 Resume Builder</span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ color: '#7C3AED' }}>Engineered by Utsho Roy</span>
          </div>

          {/* Hero Headline */}
          <h1
            style={{
              fontSize: 'clamp(36px, 5.5vw, 62px)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#0F172A',
              marginBottom: 20,
            }}
          >
            Build a CV{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Engineered to Win
            </span>
            <br />
            Top Tech Interviews.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 15.5,
              lineHeight: 1.65,
              color: '#475569',
              maxWidth: 620,
              margin: '0 auto 32px',
            }}
          >
            Choose from <strong>24 publication-grade typographic layouts</strong> built with strict 1-page A4 vertical rhythm, 100% clickable PDF hyperlinks, live ATS keyword scoring, and instant 1-click role presets.
          </p>

          {/* Call to Action Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', marginBottom: 28 }}>
            <button
              onClick={onStart}
              style={{
                background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 700,
                padding: '13px 26px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 99, 235, 0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.35)';
              }}
            >
              <Sparkles size={16} />
              <span>Launch CV Studio Free →</span>
            </button>

            <button
              onClick={() => onLaunchRole('backend')}
              style={{
                background: 'linear-gradient(135deg, #059669, #0D9488)',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 700,
                padding: '13px 22px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 8px 20px rgba(5, 150, 105, 0.25)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(5, 150, 105, 0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(5, 150, 105, 0.25)';
              }}
            >
              <Server size={15} />
              <span>Utsho's Backend CV →</span>
            </button>

            <button
              onClick={() => onLaunchRole('android')}
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 700,
                padding: '13px 22px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(124, 58, 237, 0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.25)';
              }}
            >
              <Smartphone size={15} />
              <span>Android Dev CV →</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap', fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckCircle2 size={14} color="#10B981" /> 100% 1-Page A4 Guarantee
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckCircle2 size={14} color="#10B981" /> Clickable PDF Hyperlinks
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckCircle2 size={14} color="#10B981" /> 0 Paywalls (Free Forever)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckCircle2 size={14} color="#10B981" /> ATS 99% Benchmark Score
            </span>
          </div>
        </div>
      </section>

      {/* ─── Creator Spotlight Card: "Engineered by Utsho Roy" ──────────────────── */}
      <section
        id="creator-spotlight"
        style={{
          padding: '40px 32px',
          background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 50%, #F8FAFC 100%)',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            background: '#FFFFFF',
            border: '1.5px solid #BFDBFE',
            borderRadius: 18,
            padding: '28px 32px',
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.08)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top colored accent stripe */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #2563EB, #7C3AED, #EC4899, #10B981)',
            }}
          />

          {/* Left: Avatar + Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: '1 1 450px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src="/utsho_profile.png"
                alt="Utsho Roy - Creator of CV Studio"
                style={{
                  width: 82,
                  height: 82,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #3B82F6',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Verified Creator"
              >
                <Check size={11} color="#FFFFFF" strokeWidth={3} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
                  Utsho Roy
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #EFF6FF, #EEF2FF)',
                    color: '#2563EB',
                    border: '1px solid #BFDBFE',
                    borderRadius: 9999,
                    padding: '2px 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Founder & Engineer
                </span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#4F46E5', marginBottom: 6 }}>
                Backend & API Engineer | Python, Django & Mobile Specialist
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.55, color: '#64748B', margin: 0, maxWidth: 480 }}>
                I developed <strong>CV Studio</strong> to fix broken multi-page resumes, missing PDF links, and ATS formatting rejection. Every single template is engineered to guarantee a crisp <strong>1-page A4 fit with live clickable links</strong>.
              </p>
            </div>
          </div>

          {/* Right: Social & Contact Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href="https://utsho261.github.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: 7,
                  padding: '7px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#1E40AF',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.12s',
                }}
              >
                <Globe size={13} color="#2563EB" />
                <span>Portfolio</span>
              </a>

              <a
                href="https://github.com/utsho261"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#0F172A',
                  border: '1px solid #0F172A',
                  borderRadius: 7,
                  padding: '7px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.12s',
                }}
              >
                <GithubIcon size={13} color="#FFFFFF" />
                <span>GitHub</span>
              </a>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href="https://linkedin.com/in/utshoroy261"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  borderRadius: 7,
                  padding: '7px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#0369A1',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.12s',
                }}
              >
                <LinkedinIcon size={13} color="#0284C7" />
                <span>LinkedIn</span>
              </a>

              <a
                href="mailto:utshoroy5@gmail.com"
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: 7,
                  padding: '7px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#334155',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.12s',
                }}
              >
                <Mail size={13} color="#64748B" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Feature Cards (Vibrant Gradients & Modern Glassmorphism) ──────────── */}
      <section style={{ padding: '56px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Engineered For Job Seekers
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
            Features Built For Modern Tech Hiring
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {/* Card 1: ATS Engine */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.12)';
              e.currentTarget.style.borderColor = '#10B981';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #10B981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                marginBottom: 16,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
              Live ATS Health Engine
            </h3>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#64748B', margin: 0 }}>
              Real-time parser score checks keyword density, contact link presence, measurable metrics, and action verbs to pass recruiter screeners.
            </p>
          </div>

          {/* Card 2: 24 Typographic Designs */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.12)';
              e.currentTarget.style.borderColor = '#2563EB';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                marginBottom: 16,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
              24 Handcrafted Templates
            </h3>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#64748B', margin: 0 }}>
              Google Tech FAANG, Microsoft Executive, Classic, Minimalist, Corporate Blue, Academic, and Modern Noir layouts for every career stage.
            </p>
          </div>

          {/* Card 3: 1-Page A4 Guarantee + Clickable Links */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(124, 58, 237, 0.12)';
              e.currentTarget.style.borderColor = '#7C3AED';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7C3AED, #9333EA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                marginBottom: 16,
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
              }}
            >
              <Printer size={22} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
              1-Page A4 + Live PDF Links
            </h3>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#64748B', margin: 0 }}>
              Strict vertical geometry prevents blank overflow pages. Downloaded PDFs keep all email, GitHub, LinkedIn, and project repo links 100% clickable.
            </p>
          </div>

          {/* Card 4: Role Presets & JSON Portability */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 14,
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(245, 158, 11, 0.12)';
              e.currentTarget.style.borderColor = '#F59E0B';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.03)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                marginBottom: 16,
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
              }}
            >
              <SlidersHorizontal size={22} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
              6 Role Presets & JSON Export
            </h3>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#64748B', margin: 0 }}>
              Instantly load production developer profiles or backup your data in pure JSON. Zero paywall, zero vendor lock-in, zero advertisements.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4 Metric Counters (Colorful Stat Strip) ────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          color: '#FFFFFF',
          padding: '48px 32px',
          borderTop: '1px solid #334155',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 44, fontWeight: 800, background: 'linear-gradient(135deg, #60A5FA, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
              {TEMPLATES.length}+
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginTop: 8 }}>
              Handcrafted Templates
            </div>
          </div>
          <div>
            <div style={{ fontSize: 44, fontWeight: 800, background: 'linear-gradient(135deg, #34D399, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
              100%
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginTop: 8 }}>
              1-Page A4 Precision
            </div>
          </div>
          <div>
            <div style={{ fontSize: 44, fontWeight: 800, background: 'linear-gradient(135deg, #C084FC, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
              $0
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginTop: 8 }}>
              Free & Open Source
            </div>
          </div>
          <div>
            <div style={{ fontSize: 44, fontWeight: 800, background: 'linear-gradient(135deg, #FBBF24, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
              99%
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', marginTop: 8 }}>
              ATS Parser Compatibility
            </div>
          </div>
        </div>
      </section>

      {/* ─── Template Showcase Gallery (Modern Cards & Colorful Badges) ─────────── */}
      <section id="templates-section" style={{ padding: '64px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid #E2E8F0' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Design Catalog
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              Template Gallery ({TEMPLATES.length})
            </h2>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
              Select any design below to customize in real time
            </div>
          </div>

          {/* Filter Pills & Search */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#64748B" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: 8,
                  padding: '7px 14px 7px 32px',
                  fontSize: 12,
                  fontFamily: 'inherit',
                  color: '#0F172A',
                  outline: 'none',
                  width: 190,
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#CBD5E1'; }}
              />
            </div>

            <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 4, borderRadius: 8 }}>
              {[
                ['all', `All (${TEMPLATES.length})`],
                ['professional', 'Professional'],
                ['creative', 'Creative'],
                ['technical', 'Technical'],
                ['academic', 'Academic'],
              ].map(([cat, label]) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      fontSize: 11,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#FFFFFF' : '#475569',
                      background: isActive ? '#2563EB' : 'transparent',
                      border: 'none',
                      borderRadius: 6,
                      padding: '5px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
          {filteredTemplates.map(t => (
            <div
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              style={{
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                borderRadius: 12,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(37,99,235,0.15)';
                e.currentTarget.style.borderColor = '#3B82F6';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              {/* Color swatch banner */}
              <div
                style={{
                  width: '100%',
                  height: 72,
                  background: t.thumbnail,
                  borderRadius: 8,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    padding: '3px 10px',
                    borderRadius: 4,
                  }}
                >
                  {t.layout}
                </span>
              </div>

              {/* Title & Category */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0F172A' }}>
                  {t.name}
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: t.category === 'technical' ? '#059669' : t.category === 'creative' ? '#7C3AED' : '#2563EB',
                    background: t.category === 'technical' ? '#ECFDF5' : t.category === 'creative' ? '#F5F3FF' : '#EFF6FF',
                    padding: '1px 6px',
                    borderRadius: 4,
                  }}
                >
                  {t.category}
                </span>
              </div>

              {/* Description */}
              <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5, marginBottom: 12, minHeight: 33 }}>
                {t.description}
              </div>

              {/* Bottom ATS & CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#10B981', letterSpacing: '0.05em' }}>
                    ATS
                  </span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <div
                        key={s}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 2,
                          background: s <= t.atcScore ? '#10B981' : '#E2E8F0',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB' }}>
                  Use Template →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Modern SaaS Footer with Utsho Creator Attribution ─────────────────── */}
      <footer
        style={{
          borderTop: '1px solid #E2E8F0',
          background: '#FFFFFF',
          padding: '28px 32px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/utsho_profile.png"
              alt="Utsho Roy"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #2563EB',
              }}
            />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                CV Studio — Engineered & Designed by <span style={{ color: '#2563EB' }}>Utsho Roy</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748B' }}>
                Free, ATS-optimized, 1-page A4 resume generator for engineers & professionals worldwide.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <a
              href="https://utsho261.github.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11.5, fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}
            >
              utsho261.github.io
            </a>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <a
              href="https://github.com/utsho261"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11.5, fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}
            >
              GitHub
            </a>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <button
              onClick={onStart}
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: '#2563EB',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: 6,
                padding: '5px 12px',
                cursor: 'pointer',
              }}
            >
              Open Builder →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Builder Page ─────────────────────────────────────────────────────────────

function BuilderPage({
  cvData,
  setCvData,
  selectedTemplate,
  setSelectedTemplate,
  formTab,
  setFormTab,
  onBack,
  showToast,
}: {
  cvData: CVData;
  setCvData: (d: CVData) => void;
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  formTab: FormTab;
  setFormTab: (t: FormTab) => void;
  onBack: () => void;
  showToast: (msg: string) => void;
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [zoom, setZoom] = useState<number>(0.88);
  const [previewBg, setPreviewBg] = useState<PreviewBgMode>('grid');
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showAtsModal, setShowAtsModal] = useState<boolean>(false);
  const [showPresetsModal, setShowPresetsModal] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [templateSearch, setTemplateSearch] = useState<string>('');
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');
  const [showToolsMenu, setShowToolsMenu] = useState<boolean>(false);

  // Close tools menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showToolsMenu && !(e.target as HTMLElement).closest('#tools-menu-container')) {
        setShowToolsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showToolsMenu]);

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  // Real-time ATS analysis
  const atsReport = useMemo<ATSAnalysis>(() => {
    return analyzeCV(cvData);
  }, [cvData]);

  const isAndroidCV =
    Boolean(cvData.personal.title?.toLowerCase().includes('android')) &&
    !cvData.personal.title?.toLowerCase().includes('backend');
  const isBackendCV =
    Boolean(cvData.personal.title?.toLowerCase().includes('backend')) &&
    !cvData.personal.title?.toLowerCase().includes('android');

  const handleLoadUtshoCV = (type: 'backend' | 'android') => {
    if (type === 'backend') {
      setCvData(utshoBackendCV);
      showToast('Switched to Utsho Roy — Backend & API Engineer CV');
    } else {
      setCvData(utshoAndroidCV);
      showToast('Switched to Utsho Roy — Native Android Developer CV');
    }
  };

  const [printMountNode, setPrintMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById('print-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'print-root';
      document.body.appendChild(el);
    }
    setPrintMountNode(el);
  }, []);

  // Handle PDF Print / Save as PDF (Native Browser Vector Print)
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Direct High-Resolution 1-Page PDF Download with REAL Clickable Link Buttons
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    showToast('Generating 1-Page PDF with clickable links, please wait...');

    try {
      // Prioritize unzoomed clean print target container to prevent double-text / transform ghosting
      const printTarget = document.getElementById('print-target-container');
      const activePreview = document.getElementById('cv-active-preview');
      const target = (printTarget || activePreview) as HTMLElement;

      if (!target) {
        handlePrint();
        return;
      }

      // Ensure all web fonts are fully loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Render high-DPI canvas directly from unzoomed container
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      // Create exact A4 single-page PDF
      const doc = new jsPDF('p', 'mm', 'a4');
      const pdfW = 210;
      const pdfH = 297;

      doc.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH, undefined, 'FAST');

      // Add clickable PDF link annotations for all interactive links in the CV
      const containerRect = target.getBoundingClientRect();
      const linkNodes = target.querySelectorAll('a[href], [data-link-url]');

      linkNodes.forEach(node => {
        const el = node as HTMLElement;
        let url = el.getAttribute('data-link-url') || el.getAttribute('href');
        if (!url || url === '#' || url.startsWith('javascript:')) return;

        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
          url = `https://${url}`;
        }

        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        // Proportional millimeter coordinates mapped to A4
        const x = ((rect.left - containerRect.left) / containerRect.width) * pdfW;
        const y = ((rect.top - containerRect.top) / containerRect.height) * pdfH;
        const w = (rect.width / containerRect.width) * pdfW;
        const h = (rect.height / containerRect.height) * pdfH;

        doc.link(x, y, w, h, { url });
      });

      const cleanName = (cvData.personal.name || 'CV').replace(/\s+/g, '_');
      doc.save(`${cleanName}_Resume.pdf`);
      showToast('✓ 1-Page PDF downloaded! All link buttons are clickable.');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Opening print dialog to Save as PDF...');
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom(z => Math.min(1.4, parseFloat((z + 0.08).toFixed(2))));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, parseFloat((z - 0.08).toFixed(2))));
  const handleZoomReset = () => setZoom(1.0);
  const handleZoomFit = () => setZoom(0.88);
  const handleToggleFocus = () => {
    if (!isLeftCollapsed || !isRightCollapsed) {
      setIsLeftCollapsed(true);
      setIsRightCollapsed(true);
      setZoom(1.0);
      showToast('Focus Mode: 100% Zoom (Panels Hidden)');
    } else {
      setIsLeftCollapsed(false);
      setIsRightCollapsed(false);
      setZoom(0.88);
      showToast('Restored Standard View');
    }
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(cvData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${(cvData.personal.name || 'resume').replace(/\s+/g, '_')}_cv_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('CV data exported as JSON file');
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.personal) {
          setCvData(parsed);
          showToast('CV data imported successfully!');
        } else {
          alert('Invalid CV data JSON file format.');
        }
      } catch {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Copy plain text ATS
  const handleCopyPlainText = () => {
    const text = formatCVAsPlainText(cvData);
    navigator.clipboard.writeText(text).then(() => {
      showToast('ATS Plain-Text copied to clipboard!');
    });
  };

  // Download ATS Plain-Text file
  const handleDownloadTxt = () => {
    const text = formatCVAsPlainText(cvData);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(cvData.personal.name || 'resume').replace(/\s+/g, '_')}_ATS_Text.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Downloaded ATS Plain-Text (.txt)');
  };

  // Load Preset
  const handleLoadPreset = (preset: PresetProfile) => {
    setCvData(preset.data);
    setShowPresetsModal(false);
    showToast(`Loaded ${preset.name} (${preset.role}) profile!`);
  };

  // Form tab definitions with live item count badges
  const formTabs = useMemo<{ id: FormTab; label: string; shortLabel: string; count?: number; icon: React.ReactNode }[]>(() => [
    { id: 'personal', label: 'Personal', shortLabel: 'Personal', icon: <User size={12} /> },
    { id: 'experience', label: 'Experience', shortLabel: 'Exp', count: cvData.experience.length, icon: <Briefcase size={12} /> },
    { id: 'education', label: 'Education', shortLabel: 'Edu', count: cvData.education.length, icon: <GraduationCap size={12} /> },
    { id: 'skills', label: 'Skills', shortLabel: 'Skills', count: cvData.skills.length, icon: <Wrench size={12} /> },
    { id: 'projects', label: 'Projects', shortLabel: 'Projects', count: cvData.projects.length, icon: <FolderGit2 size={12} /> },
    { id: 'certifications', label: 'Certifications', shortLabel: 'Certs', count: cvData.certifications.length, icon: <Award size={12} /> },
    { id: 'languages', label: 'Languages', shortLabel: 'Languages', count: cvData.languages.length, icon: <Globe size={12} /> },
  ], [cvData]);

  const filteredTemplateList = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchCat = templateFilter === 'all' || t.category === templateFilter;
      const matchQuery =
        !templateSearch ||
        t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(templateSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [templateFilter, templateSearch]);

  const previewBackgrounds: Record<PreviewBgMode, string> = {
    grid: 'radial-gradient(#CBD5E1 1.2px, #F8FAFC 1.2px) 0 0 / 22px 22px',
    neutral: '#F1F5F9',
    cream: '#FAF8F5',
    dark: '#0F172A',
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", overflow: 'hidden' }}>
      {/* Top Application Bar */}
      <header
        style={{
          borderBottom: '1px solid #E2E8F0',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 54,
          flexShrink: 0,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 40,
          userSelect: 'none',
          gap: 12,
        }}
      >
        {/* Left: Back, Panel Toggles & Active Template */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <button
            onClick={onBack}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#0F172A',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 11px',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.background = '#F8FAFC';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.background = '#FFFFFF';
            }}
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </button>

          {/* Toggle Left Editor Panel */}
          <button
            onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
            title={isLeftCollapsed ? 'Show Editor Panel' : 'Hide Editor Panel to expand CV workspace'}
            style={{
              background: isLeftCollapsed ? '#F8FAFC' : '#EFF6FF',
              border: isLeftCollapsed ? '1px solid #CBD5E1' : '1px solid #3B82F6',
              color: isLeftCollapsed ? '#64748B' : '#2563EB',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
          >
            {isLeftCollapsed ? <PanelLeftOpen size={13} /> : <PanelLeftClose size={13} />}
            <span className="hidden sm:inline">{isLeftCollapsed ? 'Show Editor' : 'Editor'}</span>
          </button>

          {/* Active Template Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '4px 9px' }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
              {currentTemplate.name}
            </span>
            <span style={{ fontSize: 9, fontWeight: 700, background: '#E2E8F0', color: '#475569', padding: '1px 5px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }} className="hidden md:inline">
              {currentTemplate.layout}
            </span>
          </div>

          {/* Toggle Right Template Panel */}
          <button
            onClick={() => setIsRightCollapsed(!isRightCollapsed)}
            title={isRightCollapsed ? 'Show Templates Drawer' : 'Hide Templates Drawer to expand CV workspace'}
            style={{
              background: isRightCollapsed ? '#F8FAFC' : '#EFF6FF',
              border: isRightCollapsed ? '1px solid #CBD5E1' : '1px solid #3B82F6',
              color: isRightCollapsed ? '#64748B' : '#2563EB',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
          >
            {isRightCollapsed ? <PanelRightOpen size={13} /> : <PanelRightClose size={13} />}
            <span className="hidden sm:inline">{isRightCollapsed ? 'Show Templates' : 'Templates'}</span>
            <span style={{ fontSize: 9.5, background: isRightCollapsed ? '#E2E8F0' : '#DBEAFE', color: isRightCollapsed ? '#475569' : '#1E40AF', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
              {TEMPLATES.length}
            </span>
          </button>

          {/* Creator Attribution Link in Builder Navbar */}
          <a
            href="https://utsho261.github.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 20,
              padding: '4px 10px',
              textDecoration: 'none',
              fontSize: 10.5,
              fontWeight: 600,
              color: '#334155',
            }}
            title="CV Studio was Created & Engineered by Utsho Roy"
            className="hidden xl:flex"
          >
            <img
              src="/utsho_profile.png"
              alt="Utsho Roy"
              style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #2563EB' }}
            />
            <span>Built by <strong style={{ color: '#2563EB' }}>Utsho</strong></span>
          </a>
        </div>

        {/* Center: CV Profile Quick Switcher & ATS Score Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          {/* Utsho CV Quick Switcher Segmented Control */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: 9999,
              padding: 3,
              gap: 3,
            }}
          >
            <button
              onClick={() => handleLoadUtshoCV('backend')}
              title="Load Utsho's Backend & API Engineer CV (Python, Django, PostgreSQL)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 11px',
                borderRadius: 9999,
                border: 'none',
                background: isBackendCV ? '#FFFFFF' : 'transparent',
                color: isBackendCV ? '#0F172A' : '#64748B',
                boxShadow: isBackendCV ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                fontWeight: isBackendCV ? 700 : 500,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              <Server size={12} color={isBackendCV ? '#2563EB' : '#94A3B8'} />
              <span className="hidden md:inline">Backend & API</span>
            </button>
            <button
              onClick={() => handleLoadUtshoCV('android')}
              title="Load Utsho's Native Android Developer CV (Java, Mobile, Google Maps, Firebase)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 11px',
                borderRadius: 9999,
                border: 'none',
                background: isAndroidCV ? '#FFFFFF' : 'transparent',
                color: isAndroidCV ? '#0F172A' : '#64748B',
                boxShadow: isAndroidCV ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                fontWeight: isAndroidCV ? 700 : 500,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              <Smartphone size={12} color={isAndroidCV ? '#10B981' : '#94A3B8'} />
              <span className="hidden md:inline">Android Dev</span>
            </button>
          </div>

          {/* ATS Score Pill */}
          <button
            onClick={() => setShowAtsModal(true)}
            style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: 9999,
              padding: '5px 11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.15s ease',
            }}
            title="Click to view ATS Diagnostic Report"
            onMouseEnter={e => (e.currentTarget.style.background = '#D1FAE5')}
            onMouseLeave={e => (e.currentTarget.style.background = '#ECFDF5')}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.7)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#065F46' }}>
              ATS {atsReport.score}%
            </span>
            <span style={{ fontSize: 10, color: '#047857', fontWeight: 600 }} className="hidden lg:inline">
              ({atsReport.grade})
            </span>
            <Sparkles size={11} color="#059669" />
          </button>
        </div>

        {/* Right: Tools Dropdown & PRIMARY Print / Download Buttons (Pinned, ALWAYS visible!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 'auto' }}>
          {/* Tools & More Dropdown */}
          <div id="tools-menu-container" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowToolsMenu(prev => !prev)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#334155',
                background: showToolsMenu ? '#F1F5F9' : '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 8,
                padding: '6px 11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.15s ease',
              }}
              title="More actions: Role Presets, Plain Text, Import/Export JSON, Reset"
            >
              <SlidersHorizontal size={13} color="#64748B" />
              <span>Tools ▾</span>
            </button>

            {/* Dropdown Menu */}
            {showToolsMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 6,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  boxShadow: '0 15px 35px -5px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.05)',
                  minWidth: 215,
                  padding: 6,
                  zIndex: 9999,
                }}
              >
                <button
                  onClick={() => { setShowPresetsModal(true); setShowToolsMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, color: '#334155', fontWeight: 500, textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Layers size={13} color="#64748B" />
                  <span>Role Career Presets</span>
                </button>
                <button
                  onClick={() => { handleCopyPlainText(); setShowToolsMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, color: '#334155', fontWeight: 500, textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Copy size={13} color="#64748B" />
                  <span>Copy ATS Plain Text</span>
                </button>
                <button
                  onClick={() => { handleDownloadTxt(); setShowToolsMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, color: '#334155', fontWeight: 500, textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <FileText size={13} color="#64748B" />
                  <span>Download Plain Text (.txt)</span>
                </button>
                <div style={{ height: 1, background: '#E2E8F0', margin: '4px 0' }} />
                <button
                  onClick={() => { handleExportJSON(); setShowToolsMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, color: '#334155', fontWeight: 500, textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Download size={13} color="#64748B" />
                  <span>Export Backup (JSON)</span>
                </button>
                <label
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, color: '#334155', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Upload size={13} color="#64748B" />
                  <span>Import Backup (JSON)</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={e => { handleImportJSON(e); setShowToolsMenu(false); }}
                  />
                </label>
                <div style={{ height: 1, background: '#E2E8F0', margin: '4px 0' }} />
                <button
                  onClick={() => { setShowClearConfirm(true); setShowToolsMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, color: '#EF4444', fontWeight: 500, textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <RotateCcw size={13} color="#EF4444" />
                  <span>Reset / Clear Form</span>
                </button>
              </div>
            )}
          </div>

          {/* Secondary Print / Save as PDF Button (Always Visible) */}
          <button
            onClick={handlePrint}
            title="Print or Save as PDF (Ctrl + P)"
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: '#0F172A',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: 8,
              cursor: 'pointer',
              padding: '7px 13px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#E2E8F0';
              e.currentTarget.style.borderColor = '#94A3B8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Primary Download 1-Page PDF Button (Pinned, Always Visible!) */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            title="Download guaranteed 1-Page PDF with interactive clickable link buttons"
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              border: 'none',
              borderRadius: 8,
              cursor: isGeneratingPdf ? 'wait' : 'pointer',
              padding: '7px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
              opacity: isGeneratingPdf ? 0.8 : 1,
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              if (!isGeneratingPdf) {
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.45)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={e => {
              if (!isGeneratingPdf) {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isGeneratingPdf ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
            <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Mobile view segment switcher (visible on small screens) */}
      <div
        style={{
          display: 'none',
          borderBottom: '1px solid #E2E8F0',
          background: '#FFFFFF',
        }}
        className="flex md:!hidden"
      >
        {[
          ['edit', 'Edit Content'],
          ['preview', 'Preview A4'],
          ['templates', 'Templates'],
        ].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab as MobileTab)}
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: 11,
              fontWeight: 700,
              border: 'none',
              background: mobileTab === tab ? '#0F172A' : 'transparent',
              color: mobileTab === tab ? '#FFFFFF' : '#64748B',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Workspace Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Panel 1: Forms & Content Editor */}
        {!isLeftCollapsed && (
          <div
            style={{
              width: 380,
              borderRight: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#FFFFFF',
              boxShadow: '1px 0 3px rgba(0,0,0,0.02)',
              zIndex: 10,
            }}
            className={`${mobileTab !== 'edit' ? 'hidden md:!flex' : 'flex w-full md:!w-[380px]'}`}
          >
            {/* Form Panel Header */}
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={13} color="#2563EB" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Content Editor</span>
              </div>
              <button
                onClick={() => setIsLeftCollapsed(true)}
                title="Hide Editor to expand CV canvas area"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#E2E8F0';
                  e.currentTarget.style.color = '#0F172A';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#F1F5F9';
                  e.currentTarget.style.color = '#475569';
                }}
              >
                <PanelLeftClose size={12} />
                <span>Hide ×</span>
              </button>
            </div>

            {/* Form category tabs (2-row organized grid: 100% visible, zero cut-off, zero horizontal scrolling) */}
            <div
              style={{
                borderBottom: '1px solid #E2E8F0',
                background: '#F8FAFC',
                padding: '7px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                flexShrink: 0,
              }}
            >
              {/* Row 1: Core Sections (Personal, Experience, Education, Skills) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                {formTabs.slice(0, 4).map(tab => {
                  const isActive = formTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setFormTab(tab.id)}
                      style={{
                        fontSize: 10.5,
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#1D4ED8' : '#475569',
                        background: isActive ? '#EFF6FF' : '#FFFFFF',
                        border: isActive ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                        borderRadius: 6,
                        cursor: 'pointer',
                        padding: '6px 2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3.5,
                        boxShadow: isActive ? '0 1px 2px rgba(37,99,235,0.12)' : 'none',
                        transition: 'all 0.12s ease',
                        minWidth: 0,
                      }}
                      title={tab.label}
                    >
                      <span style={{ color: isActive ? '#2563EB' : '#64748B', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        {tab.icon}
                      </span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tab.shortLabel}
                      </span>
                      {tab.count !== undefined && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            background: isActive ? '#2563EB' : '#F1F5F9',
                            color: isActive ? '#FFFFFF' : '#64748B',
                            padding: '0 4px',
                            borderRadius: 9999,
                            minWidth: 14,
                            lineHeight: '13px',
                            textAlign: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Projects, Certifications & Languages */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {formTabs.slice(4).map(tab => {
                  const isActive = formTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setFormTab(tab.id)}
                      style={{
                        fontSize: 10.5,
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#1D4ED8' : '#475569',
                        background: isActive ? '#EFF6FF' : '#FFFFFF',
                        border: isActive ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                        borderRadius: 6,
                        cursor: 'pointer',
                        padding: '6px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        boxShadow: isActive ? '0 1px 2px rgba(37,99,235,0.12)' : 'none',
                        transition: 'all 0.12s ease',
                        minWidth: 0,
                      }}
                      title={tab.label}
                    >
                      <span style={{ color: isActive ? '#2563EB' : '#64748B', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        {tab.icon}
                      </span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tab.shortLabel}
                      </span>
                      {tab.count !== undefined && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            background: isActive ? '#2563EB' : '#F1F5F9',
                            color: isActive ? '#FFFFFF' : '#64748B',
                            padding: '0 4px',
                            borderRadius: 9999,
                            minWidth: 14,
                            lineHeight: '13px',
                            textAlign: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form scrollable inputs */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', background: '#FFFFFF' }}>
              <FormPanel tab={formTab} data={cvData} onChange={setCvData} />
            </div>
          </div>
        )}

        {/* Panel 2: Interactive A4 Canvas Preview Workspace */}
        <div
          style={{
            flex: 1,
            background: previewBackgrounds[previewBg],
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          className={`${mobileTab !== 'preview' ? 'hidden md:!flex' : 'flex w-full'}`}
        >
          {/* Floating Pill on top-left to re-open Editor when collapsed */}
          {isLeftCollapsed && (
            <button
              onClick={() => setIsLeftCollapsed(false)}
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                zIndex: 25,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 9999,
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                color: '#2563EB',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.08)';
              }}
              title="Open Content Editor"
            >
              <PanelLeftOpen size={13} />
              <span>Show Editor</span>
            </button>
          )}

          {/* Floating Pill on top-right to re-open Templates when collapsed */}
          {isRightCollapsed && (
            <button
              onClick={() => setIsRightCollapsed(false)}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                zIndex: 25,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: 9999,
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                color: '#2563EB',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.08)';
              }}
              title="Open Templates drawer"
            >
              <LayoutTemplate size={13} />
              <span>Show Templates ({TEMPLATES.length})</span>
            </button>
          )}

          {/* Scrollable Canvas Area */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '36px 16px 90px 16px',
            }}
          >
            {/* Scaled A4 Preview Box */}
            <div style={{ position: 'relative' }}>
              <div
                id="cv-active-preview"
                style={{
                  width: 794,
                  minHeight: 1123,
                  transformOrigin: 'top center',
                  transform: `scale(${zoom})`,
                  boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(15, 23, 42, 0.06), 0 4px 10px rgba(15, 23, 42, 0.03)',
                  borderRadius: 4,
                  marginBottom: `calc((1123px * ${zoom}) - 1123px)`,
                  transition: 'transform 0.12s ease-out',
                  background: '#FFFFFF',
                }}
              >
                <TemplateRenderer data={cvData} templateId={selectedTemplate} />
              </div>
            </div>
          </div>

          {/* Floating Bottom Canvas Toolbar (Modern Glassmorphic Studio Dock) */}
          <div
            style={{
              position: 'absolute',
              bottom: 22,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#FFFFFF',
              borderRadius: 9999,
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.35), 0 1px 2px rgba(255,255,255,0.1) inset',
              border: '1px solid rgba(255,255,255,0.15)',
              userSelect: 'none',
              maxWidth: '96vw',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* 1-Page Guaranteed Indicator Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 9999,
                fontSize: 10,
                color: '#34D399',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
              title="Smart Auto-Fit Engine ensures all content is formatted onto 1 single page"
            >
              <CheckCircle2 size={12} />
              <span>1-Page Guaranteed</span>
            </div>

            {/* Zoom controls */}
            <button
              onClick={handleZoomOut}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 3, opacity: 0.85 }}
              title="Zoom out (-)"
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, minWidth: 38, textAlign: 'center', color: '#FFFFFF' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 3, opacity: 0.85 }}
              title="Zoom in (+)"
            >
              <ZoomIn size={14} />
            </button>

            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />

            {/* Fast Zoom Presets */}
            <button
              onClick={() => setZoom(0.88)}
              style={{
                background: zoom === 0.88 ? 'rgba(255,255,255,0.25)' : 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 7px',
                borderRadius: 6,
              }}
              title="Default 88% preview"
            >
              88%
            </button>
            <button
              onClick={() => setZoom(1.0)}
              style={{
                background: zoom === 1.0 ? 'rgba(255,255,255,0.25)' : 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 7px',
                borderRadius: 6,
              }}
              title="100% Actual A4 size"
            >
              100%
            </button>
            <button
              onClick={() => setZoom(1.15)}
              style={{
                background: zoom === 1.15 ? 'rgba(255,255,255,0.25)' : 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 7px',
                borderRadius: 6,
              }}
              title="Large Zoom (115%)"
            >
              115%
            </button>
            <button
              onClick={() => setZoom(1.25)}
              style={{
                background: zoom === 1.25 ? 'rgba(255,255,255,0.25)' : 'none',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 600,
                padding: '3px 7px',
                borderRadius: 6,
              }}
              title="Extra Large Zoom (125%)"
            >
              125%
            </button>

            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />

            {/* Focus Mode Button */}
            <button
              onClick={handleToggleFocus}
              style={{
                background: (isLeftCollapsed && isRightCollapsed) ? 'rgba(37, 99, 235, 0.45)' : 'rgba(255,255,255,0.1)',
                border: (isLeftCollapsed && isRightCollapsed) ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 600,
                padding: '4px 9px',
                borderRadius: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              title="Focus Mode (Hide sidebars, 100% scale)"
            >
              <Focus size={12} />
              <span>{(isLeftCollapsed && isRightCollapsed) ? 'Exit Focus' : 'Focus'}</span>
            </button>

            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />

            {/* Quick Print Button in Dock */}
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                borderRadius: 9999,
                padding: '4px 9px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 10.5,
                fontWeight: 600,
              }}
              title="Print or Save as PDF"
            >
              <Printer size={12} />
              <span>Print</span>
            </button>

            {/* Quick Download PDF in Dock */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: 9999,
                padding: '4px 12px',
                cursor: isGeneratingPdf ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 10.5,
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
              }}
              title="Download 1-Page PDF with clickable links"
            >
              {isGeneratingPdf ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
              <span>{isGeneratingPdf ? 'Exporting...' : 'PDF'}</span>
            </button>

            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />

            {/* Backdrop modes */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {(['grid', 'neutral', 'dark', 'cream'] as PreviewBgMode[]).map(bg => (
                <button
                  key={bg}
                  onClick={() => setPreviewBg(bg)}
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: '50%',
                    background: bg === 'grid' ? '#CBD5E1' : bg === 'neutral' ? '#F1F5F9' : bg === 'dark' ? '#0F172A' : '#FAF8F5',
                    border: previewBg === bg ? '2px solid #3B82F6' : '1px solid rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                  }}
                  title={`${bg} desk mode`}
                />
              ))}
            </div>

            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(true)}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 3, opacity: 0.85 }}
              title="Fullscreen Preview"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* Panel 3: Template Selector */}
        {!isRightCollapsed && (
          <div
            style={{
              width: 260,
              borderLeft: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#FFFFFF',
              boxShadow: '-1px 0 3px rgba(0,0,0,0.02)',
              zIndex: 10,
            }}
            className={`${mobileTab !== 'templates' ? 'hidden md:!flex' : 'flex w-full md:!w-[260px]'}`}
          >
            {/* Header & Search */}
            <div style={{ borderBottom: '1px solid #E2E8F0', padding: '10px 14px', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LayoutTemplate size={13} color="#2563EB" />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A' }}>
                    Templates ({filteredTemplateList.length})
                  </span>
                </div>
                <button
                  onClick={() => setIsRightCollapsed(true)}
                  title="Hide Templates panel to enlarge CV workspace"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: 6,
                    padding: '3px 7px',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#E2E8F0';
                    e.currentTarget.style.color = '#0F172A';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#F1F5F9';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  <X size={12} />
                  <span>Hide ×</span>
                </button>
              </div>

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter templates..."
                  value={templateSearch}
                  onChange={e => setTemplateSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 7,
                    padding: '6px 10px 6px 30px',
                    fontSize: 11,
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Category pills */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {['all', 'professional', 'creative', 'technical', 'academic'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTemplateFilter(cat)}
                    style={{
                      fontSize: 9.5,
                      fontWeight: templateFilter === cat ? 700 : 500,
                      textTransform: 'capitalize',
                      color: templateFilter === cat ? '#FFFFFF' : '#475569',
                      background: templateFilter === cat ? '#0F172A' : '#FFFFFF',
                      border: '1px solid',
                      borderColor: templateFilter === cat ? '#0F172A' : '#E2E8F0',
                      borderRadius: 9999,
                      padding: '3px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of templates */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {filteredTemplateList.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderRadius: 8,
                    marginBottom: 6,
                    background: selectedTemplate === t.id ? '#EFF6FF' : '#FFFFFF',
                    border: selectedTemplate === t.id ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (selectedTemplate !== t.id) {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedTemplate !== t.id) {
                      e.currentTarget.style.background = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 44,
                      background: t.thumbnail,
                      flexShrink: 0,
                      borderRadius: 3,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 9, color: '#64748B', textTransform: 'capitalize' }}>
                      {t.category} · {t.layout}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: '#2563EB' }}>ATS</span>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <div
                            key={s}
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: 1,
                              background: s <= t.atcScore ? '#2563EB' : '#E2E8F0',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden Print Element mounted into document.getElementById('print-root') */}
      {printMountNode &&
        createPortal(
          <div id="print-target-container" style={{ width: 794, minHeight: 1123, background: '#FFFFFF' }}>
            <TemplateRenderer data={cvData} templateId={selectedTemplate} />
          </div>,
          printMountNode
        )}

      {/* Modal: Fullscreen Preview */}
      {isFullscreen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
          }}
          className="animate-fade-in"
        >
          {/* Header */}
          <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.8)' }}>
            <span style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>
              Fullscreen Preview — {currentTemplate.name}
            </span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 7,
                  padding: '7px 16px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: isGeneratingPdf ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                }}
              >
                {isGeneratingPdf ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />}
                <span>{isGeneratingPdf ? 'Generating...' : 'Download 1-Page PDF'}</span>
              </button>

              <button
                onClick={handlePrint}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 7,
                  padding: '7px 14px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Printer size={13} />
                <span>Print</span>
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: 7,
                  borderRadius: 7,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={17} />
              </button>
            </div>
          </div>
          {/* Canvas */}
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '36px 16px' }}>
            <div style={{ width: 794, minHeight: 1123, background: '#FFFFFF', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', borderRadius: 4 }}>
              <TemplateRenderer data={cvData} templateId={selectedTemplate} />
            </div>
          </div>
        </div>
      )}

      {/* Modal: ATS Health & Optimization Drawer */}
      {showAtsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setShowAtsModal(false)}
        >
          <div
            style={{
              width: 440,
              maxWidth: '90vw',
              background: '#FFFFFF',
              height: '100%',
              boxShadow: '-12px 0 40px rgba(15, 23, 42, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderLeft: '1px solid #E2E8F0',
            }}
            className="animate-slide-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <ShieldCheck size={20} color="#2563EB" />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                  ATS Diagnostic Engine
                </span>
              </div>
              <button
                onClick={() => setShowAtsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Score Banner */}
            <div style={{ padding: '20px 22px', background: '#0F172A', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 600 }}>Overall ATS Match</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: atsReport.color, lineHeight: 1.1 }}>
                    {atsReport.score}<span style={{ fontSize: 18, color: '#64748B' }}>/100</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 4, fontWeight: 600 }}>Verdict</div>
                  <span style={{ background: atsReport.color, color: '#FFFFFF', fontWeight: 800, fontSize: 10, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 9999, letterSpacing: '0.04em' }}>
                    {atsReport.grade}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ width: `${atsReport.score}%`, height: '100%', background: atsReport.color, transition: 'width 0.3s ease' }} />
              </div>
            </div>

            {/* Scrollable breakdown & tips */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {/* Strengths */}
              {atsReport.strengths.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#059669', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={13} />
                    <span>Identified Strengths</span>
                  </div>
                  {atsReport.strengths.map((str, idx) => (
                    <div key={idx} style={{ fontSize: 11.5, color: '#065F46', padding: '8px 12px', background: '#ECFDF5', borderLeft: '3px solid #10B981', borderRadius: 6, marginBottom: 6 }}>
                      {str}
                    </div>
                  ))}
                </div>
              )}

              {/* Actionable recommendations */}
              {atsReport.suggestions.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#DC2626', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={13} />
                    <span>Recommendations to Boost Ranking</span>
                  </div>
                  {atsReport.suggestions.map((sug, idx) => (
                    <div key={idx} style={{ fontSize: 11.5, color: '#991B1B', padding: '8px 12px', background: '#FEF2F2', borderLeft: '3px solid #EF4444', borderRadius: 6, marginBottom: 6 }}>
                      {sug}
                    </div>
                  ))}
                </div>
              )}

              {/* Detailed section tests */}
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B', marginBottom: 10 }}>
                ATS Section Checklists
              </div>
              {atsReport.checks.map(chk => (
                <div key={chk.id} style={{ background: '#F8FAFC', padding: '12px 14px', marginBottom: 10, border: '1px solid #E2E8F0', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A' }}>{chk.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: chk.passed ? '#059669' : '#DC2626' }}>
                      {chk.score}/{chk.maxScore} pts
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
                    {chk.feedback}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Presets Profile Switcher */}
      {showPresetsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowPresetsModal(false)}
        >
          <div
            style={{
              width: 560,
              maxWidth: '100%',
              background: '#FFFFFF',
              borderRadius: 16,
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
            }}
            className="animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#0F172A' }}>
                  Load Career Profile Preset
                </div>
                <div style={{ fontSize: 11, color: '#64748B' }}>
                  Instantly fill your CV with rich industry-tailored sample content
                </div>
              </div>
              <button onClick={() => setShowPresetsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B' }}>
                Utsho Roy — Specialized CV Profiles
              </div>
              {PRESET_PROFILES.filter(p => p.id.startsWith('utsho')).map(preset => (
                <div
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  style={{
                    padding: '14px 18px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#EFF6FF';
                    e.currentTarget.style.borderColor = '#3B82F6';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        background: preset.avatarBg,
                        color: '#FFFFFF',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {preset.name.includes('Android') ? <Smartphone size={18} /> : <Server size={18} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                        {preset.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>
                        {preset.role} · {preset.data.experience.length} experiences · {preset.data.projects.length} projects
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                    Load CV →
                  </span>
                </div>
              ))}

              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B', marginTop: 8 }}>
                Industry Benchmarks
              </div>
              {PRESET_PROFILES.filter(p => !p.id.startsWith('utsho')).map(preset => (
                <div
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  style={{
                    padding: '14px 18px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#EFF6FF';
                    e.currentTarget.style.borderColor = '#3B82F6';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        background: preset.avatarBg,
                        color: '#FFFFFF',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {preset.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                        {preset.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>
                        {preset.role} · {preset.data.experience.length} experiences · {preset.data.skills.length} skills
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                    Load →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Clear */}
      {showClearConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            style={{
              width: 400,
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
              Clear CV Form?
            </div>
            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>
              This will reset all sections so you can start from scratch. You can always reload a preset anytime.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 600, color: '#334155', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCvData(emptyData);
                  setShowClearConfirm(false);
                  showToast('CV form cleared');
                }}
                style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Off-screen Portal for Native Print and High-Res Clean PDF Export */}
      {printMountNode && createPortal(
        <div id="print-target-container">
          <TemplateRenderer data={cvData} templateId={selectedTemplate} />
        </div>,
        printMountNode
      )}
    </div>
  );
}

// ─── Form Panel Helpers ────────────────────────────────────────────────────────

function ControlledBulletsInput({
  bullets,
  onChange,
  style,
  placeholder,
}: {
  bullets: string[];
  onChange: (b: string[]) => void;
  style: React.CSSProperties;
  placeholder: string;
}) {
  const [val, setVal] = useState(bullets.join('\n'));

  useEffect(() => {
    setVal(bullets.join('\n'));
  }, [bullets]);

  return (
    <textarea
      value={val}
      onChange={e => {
        setVal(e.target.value);
        onChange(e.target.value.split('\n'));
      }}
      onBlur={() => {
        const cleaned = val.split('\n').map(s => s.trim()).filter(Boolean);
        setVal(cleaned.join('\n'));
        onChange(cleaned);
      }}
      style={style}
      placeholder={placeholder}
      rows={4}
    />
  );
}

// ─── Interactive Tag Input for Skills and Technologies ─────────────────────────

function InteractiveTagInput({
  items,
  onChange,
  placeholder = "Type a skill & press Enter or comma (e.g. Docker)...",
  suggestions = [],
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  style?: React.CSSProperties;
  isTextarea?: boolean;
}) {
  const [inputValue, setInputValue] = useState('');
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  const [bulkText, setBulkText] = useState(items.join(', '));
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync bulk text when items change externally
  useEffect(() => {
    setBulkText(items.join(', '));
  }, [items]);

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Support comma or plus separated entries
    const newTokens = trimmed
      .split(/[,+]/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (newTokens.length === 0) return;

    // Filter out duplicates (case-insensitive)
    const existingSet = new Set(items.map(it => it.toLowerCase()));
    const toAdd: string[] = [];
    for (const tok of newTokens) {
      if (!existingSet.has(tok.toLowerCase())) {
        toAdd.push(tok);
        existingSet.add(tok.toLowerCase());
      }
    }

    if (toAdd.length > 0) {
      onChange([...items, ...toAdd]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && items.length > 0) {
      onChange(items.slice(0, -1));
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(items.filter((_, idx) => idx !== indexToRemove));
  };

  const handleApplyBulk = () => {
    const cleaned = bulkText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    onChange(cleaned);
    setIsBulkEdit(false);
  };

  return (
    <div style={{ marginTop: 2, marginBottom: 12 }}>
      {/* Action line: count and Bulk edit toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
          {items.length} {items.length === 1 ? 'skill tag' : 'skill tags'}
        </span>
        <button
          type="button"
          onClick={() => {
            if (isBulkEdit) {
              handleApplyBulk();
            } else {
              setBulkText(items.join(', '));
              setIsBulkEdit(true);
            }
          }}
          style={{
            background: isBulkEdit ? '#EFF6FF' : 'transparent',
            border: isBulkEdit ? '1px solid #BFDBFE' : 'none',
            borderRadius: 5,
            color: '#2563EB',
            fontSize: 10.5,
            fontWeight: 700,
            cursor: 'pointer',
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {isBulkEdit ? '✓ Done (Tags View)' : '📝 Edit as comma-separated text'}
        </button>
      </div>

      {isBulkEdit ? (
        <div>
          <textarea
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            onBlur={handleApplyBulk}
            rows={3}
            placeholder="Type or paste skills separated by commas..."
            style={{
              width: '100%',
              fontSize: 12,
              fontFamily: 'inherit',
              padding: '8px 10px',
              border: '1.5px solid #3B82F6',
              borderRadius: 7,
              outline: 'none',
              background: '#FFFFFF',
              color: '#0F172A',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 5 }}>
            <button
              type="button"
              onClick={() => setIsBulkEdit(false)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                background: '#F1F5F9',
                color: '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: 5,
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyBulk}
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 5,
                padding: '4px 12px',
                cursor: 'pointer',
              }}
            >
              Apply Changes
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Active Tag Chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 5,
              minHeight: 34,
              padding: items.length > 0 ? '6px 8px' : '6px',
              background: items.length > 0 ? '#F8FAFC' : '#FAFAFA',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            {items.length === 0 ? (
              <span style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', padding: '3px 2px' }}>
                No tags yet. Type in the box below and press Enter or click "+ Add".
              </span>
            ) : (
              items.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#1E40AF',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: 6,
                    padding: '2.5px 8px',
                    boxShadow: '0 1px 2px rgba(37,99,235,0.05)',
                  }}
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#60A5FA',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      lineHeight: 1,
                      transition: 'color 0.1s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#60A5FA'; }}
                    title={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          {/* New Tag Input + Add Button */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              style={{
                flex: 1,
                fontSize: 12,
                fontFamily: 'inherit',
                padding: '7px 10px',
                border: '1.5px solid #CBD5E1',
                borderRadius: 7,
                outline: 'none',
                background: '#FFFFFF',
                color: '#0F172A',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#CBD5E1'; }}
            />
            <button
              type="button"
              onClick={() => {
                addTag(inputValue);
                inputRef.current?.focus();
              }}
              style={{
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 7,
                padding: '7px 14px',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(37,99,235,0.25)',
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; }}
              title="Add this skill"
            >
              <Plus size={13} />
              <span>Add</span>
            </button>
          </div>

          {/* Quick-add suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 7, alignItems: 'center' }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                Suggestions:
              </span>
              {suggestions
                .filter(s => !items.some(it => it.toLowerCase() === s.toLowerCase()))
                .slice(0, 6)
                .map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addTag(s)}
                    style={{
                      background: '#F1F5F9',
                      border: '1px dashed #CBD5E1',
                      borderRadius: 5,
                      padding: '2px 7px',
                      fontSize: 10,
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#EFF6FF';
                      e.currentTarget.style.borderColor = '#93C5FD';
                      e.currentTarget.style.color = '#1D4ED8';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#F1F5F9';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.color = '#475569';
                    }}
                    title={`Click to add ${s}`}
                  >
                    <span>+</span>
                    <span>{s}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Alias for backwards compatibility
const ControlledCommaInput = InteractiveTagInput;

// ─── Form Panel with Accordion and Reordering ──────────────────────────────────

function FormPanel({
  tab,
  data,
  onChange,
}: {
  tab: FormTab;
  data: CVData;
  onChange: (d: CVData) => void;
}) {
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>({});
  const toggleItemCollapse = (id: string) => setCollapsedItems(prev => ({ ...prev, [id]: !prev[id] }));

  const labelStyle: React.CSSProperties = {
    fontSize: 11.5,
    fontWeight: 600,
    color: '#334155',
    display: 'block',
    marginBottom: 5,
  };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 12.5,
    color: '#0F172A',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
    marginBottom: 10,
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  };
  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical' as const,
    minHeight: 76,
    lineHeight: 1.55,
    marginBottom: 10,
  };
  const sectionHeadStyle: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottom: '1px solid #E2E8F0',
    letterSpacing: '-0.01em',
  };
  const addBtnStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.02em',
    color: '#2563EB',
    background: '#EFF6FF',
    border: '1.5px dashed #3B82F6',
    borderRadius: 8,
    padding: '9px 16px',
    cursor: 'pointer',
    width: '100%',
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.15s ease',
  };
  const itemWrapStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 10,
    padding: '12px 14px',
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
    borderLeft: '3px solid #2563EB',
  };

  // Reordering helpers
  const moveItem = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const copy = [...list];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= copy.length) return copy;
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    return copy;
  };

  const setPersonal = (field: string, val: string) =>
    onChange({ ...data, personal: { ...data.personal, [field]: val } });

  // 1. Personal Information Tab
  if (tab === 'personal') {
    const personalFields = [
      { field: 'name', label: 'Full Name', type: 'text', icon: <User size={14} color="#64748B" /> },
      { field: 'title', label: 'Professional Title', type: 'text', icon: <Briefcase size={14} color="#64748B" /> },
      { field: 'email', label: 'Email Address', type: 'email', icon: <Mail size={14} color="#64748B" /> },
      { field: 'phone', label: 'Phone Number', type: 'tel', icon: <Phone size={14} color="#64748B" /> },
      { field: 'location', label: 'Location (City, Country)', type: 'text', icon: <MapPin size={14} color="#64748B" /> },
      { field: 'linkedin', label: 'LinkedIn Profile URL', type: 'text', icon: <LinkedinIcon size={14} color="#64748B" /> },
      { field: 'website', label: 'Website / Portfolio URL', type: 'text', icon: <Globe size={14} color="#64748B" /> },
      { field: 'github', label: 'GitHub Username / URL', type: 'text', icon: <GithubIcon size={14} color="#64748B" /> },
    ];

    return (
      <div>
        <div style={sectionHeadStyle}>Personal Information</div>
        {personalFields.map(({ field, label, type, icon }) => (
          <div key={field} style={{ marginBottom: 12 }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: 10, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                {icon}
              </span>
              <input
                type={type}
                value={(data.personal as any)[field] || ''}
                onChange={e => setPersonal(field, e.target.value)}
                style={{ ...inputStyle, paddingLeft: 34, marginBottom: 0 }}
                placeholder={label}
              />
            </div>
          </div>
        ))}

        {/* Profile Photo */}
        <label style={labelStyle}>Profile Photo</label>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
          {data.personal.photo ? (
            <img
              src={data.personal.photo}
              alt="Profile"
              style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: '50%', border: '2px solid #2563EB', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)' }}
            />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF' }}>
              <User size={22} color="#94A3B8" />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 700,
                color: '#2563EB',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: 6,
                padding: '5px 12px',
                cursor: 'pointer',
              }}
            >
              <Upload size={12} />
              <span>{data.personal.photo ? 'Change Photo' : 'Upload Photo'}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => setPersonal('photo', ev.target?.result as string);
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {data.personal.photo && (
              <button
                type="button"
                onClick={() => setPersonal('photo', '')}
                style={{
                  fontSize: 10.5,
                  color: '#EF4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: 0,
                }}
              >
                <Trash2 size={11} />
                <span>Remove Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Professional Summary</label>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 4,
              background: (data.personal.summary || '').length > 360 ? '#FEF2F2' : (data.personal.summary || '').length > 300 ? '#FFFBEB' : '#ECFDF5',
              color: (data.personal.summary || '').length > 360 ? '#DC2626' : (data.personal.summary || '').length > 300 ? '#D97706' : '#059669',
              border: `1px solid ${(data.personal.summary || '').length > 360 ? '#FCA5A5' : (data.personal.summary || '').length > 300 ? '#FDE68A' : '#A7F3D0'}`,
            }}
          >
            {(data.personal.summary || '').length} / 380 chars (1-Page Fit)
          </span>
        </div>
        <textarea
          value={data.personal.summary}
          maxLength={380}
          onChange={e => setPersonal('summary', e.target.value)}
          style={textareaStyle}
          placeholder="2–4 sentences summarizing your core engineering expertise, key production metrics, and value proposition..."
          rows={4}
        />
        <div style={{ fontSize: 10.5, color: '#64748B', marginTop: -4, marginBottom: 12 }}>
          💡 Tip: Keeping summary under 380 characters ensures optimal spacing across all 1-page templates.
        </div>
      </div>
    );
  }

  // 2. Experience Tab
  if (tab === 'experience') {
    return (
      <div>
        <div style={sectionHeadStyle}>Work Experience</div>

        {/* Action Verb Assistant Chip Bar */}
        <div style={{ marginBottom: 14, padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#475569', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Sparkles size={11} color="#2563EB" />
            <span>Power Action Verbs (Click to insert into latest role)</span>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {ACTION_VERBS.map(verb => (
              <button
                key={verb}
                type="button"
                onClick={() => {
                  if (data.experience.length > 0) {
                    const firstExp = data.experience[0];
                    const updatedBullets = [...firstExp.bullets, `${verb} `];
                    onChange({
                      ...data,
                      experience: data.experience.map((x, idx) =>
                        idx === 0 ? { ...x, bullets: updatedBullets } : x
                      ),
                    });
                  }
                }}
                style={{
                  fontSize: 9.5,
                  fontWeight: 600,
                  padding: '2px 7px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 4,
                  cursor: 'pointer',
                  color: '#1E293B',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#EFF6FF';
                  e.currentTarget.style.color = '#2563EB';
                  e.currentTarget.style.borderColor = '#93C5FD';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#1E293B';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
              >
                + {verb}
              </button>
            ))}
          </div>
        </div>

        {data.experience.map((exp, i) => {
          const isCollapsed = collapsedItems[exp.id];
          return (
            <div key={exp.id} style={itemWrapStyle}>
              {/* Header with Title, Expand/Collapse & Reordering */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : 12, paddingBottom: isCollapsed ? 0 : 8, borderBottom: isCollapsed ? 'none' : '1px solid #E2E8F0' }}>
                <div
                  onClick={() => toggleItemCollapse(exp.id)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}
                >
                  <Briefcase size={13} color="#2563EB" />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                    {exp.position || exp.company ? `${exp.position || 'Role'} · ${exp.company || 'Company'}` : `Position ${i + 1}`}
                  </span>
                  {exp.startDate && (
                    <span style={{ fontSize: 9.5, color: '#64748B', background: '#F1F5F9', padding: '1px 5px', borderRadius: 4 }}>
                      {exp.startDate} – {exp.endDate}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <button
                    disabled={i === 0}
                    onClick={() => onChange({ ...data, experience: moveItem(data.experience, i, 'up') })}
                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                    title="Move Up"
                  >
                    <ChevronUp size={12} color="#475569" />
                  </button>
                  <button
                    disabled={i === data.experience.length - 1}
                    onClick={() => onChange({ ...data, experience: moveItem(data.experience, i, 'down') })}
                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === data.experience.length - 1 ? 'default' : 'pointer', opacity: i === data.experience.length - 1 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                    title="Move Down"
                  >
                    <ChevronDown size={12} color="#475569" />
                  </button>
                  <button
                    onClick={() => onChange({ ...data, experience: data.experience.filter(e => e.id !== exp.id) })}
                    style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 4, cursor: 'pointer', color: '#EF4444', padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                    title="Remove Position"
                  >
                    <Trash2 size={12} />
                  </button>
                  <button
                    onClick={() => toggleItemCollapse(exp.id)}
                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: 'pointer', padding: '3px 6px', display: 'flex', alignItems: 'center', fontSize: 10, color: '#475569', fontWeight: 600 }}
                  >
                    {isCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={labelStyle}>Job Title</label>
                      <input
                        value={exp.position}
                        onChange={e =>
                          onChange({
                            ...data,
                            experience: data.experience.map(x =>
                              x.id === exp.id ? { ...x, position: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="e.g. Lead Backend Engineer"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Company Name</label>
                      <input
                        value={exp.company}
                        onChange={e =>
                          onChange({
                            ...data,
                            experience: data.experience.map(x =>
                              x.id === exp.id ? { ...x, company: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="e.g. CampusConnect"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={labelStyle}>Location</label>
                      <input
                        value={exp.location}
                        onChange={e =>
                          onChange({
                            ...data,
                            experience: data.experience.map(x =>
                              x.id === exp.id ? { ...x, location: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="Dhaka, Bangladesh"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Start Date</label>
                      <input
                        value={exp.startDate}
                        onChange={e =>
                          onChange({
                            ...data,
                            experience: data.experience.map(x =>
                              x.id === exp.id ? { ...x, startDate: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="Jan 2023"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>End Date</label>
                      <input
                        value={exp.endDate}
                        onChange={e =>
                          onChange({
                            ...data,
                            experience: data.experience.map(x =>
                              x.id === exp.id ? { ...x, endDate: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="Present"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label style={labelStyle}>Responsibilities & Metrics (One bullet per line)</label>
                    <span style={{ fontSize: 9.5, color: '#64748B', fontWeight: 600 }}>{exp.bullets.length} bullets</span>
                  </div>
                  <ControlledBulletsInput
                    bullets={exp.bullets}
                    onChange={newBullets =>
                      onChange({
                        ...data,
                        experience: data.experience.map(x =>
                          x.id === exp.id ? { ...x, bullets: newBullets } : x
                        ),
                      })
                    }
                    style={{ ...textareaStyle, minHeight: 96 }}
                    placeholder="Architected decoupled REST API using Django 5.1 & DRF..."
                  />
                </div>
              )}
            </div>
          );
        })}

        <button
          style={addBtnStyle}
          onClick={() =>
            onChange({
              ...data,
              experience: [
                ...data.experience,
                { id: uid(), company: '', position: '', startDate: '', endDate: 'Present', location: '', bullets: [] },
              ],
            })
          }
        >
          <Plus size={14} />
          <span>Add Work Experience</span>
        </button>
      </div>
    );
  }

  // 3. Education Tab
  if (tab === 'education') {
    return (
      <div>
        <div style={sectionHeadStyle}>Education</div>
        {data.education.map((edu, i) => {
          const isCollapsed = collapsedItems[edu.id];
          return (
            <div key={edu.id} style={itemWrapStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : 12, paddingBottom: isCollapsed ? 0 : 8, borderBottom: isCollapsed ? 'none' : '1px solid #E2E8F0' }}>
                <div
                  onClick={() => toggleItemCollapse(edu.id)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}
                >
                  <GraduationCap size={13} color="#2563EB" />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                    {edu.degree || edu.institution ? `${edu.degree} — ${edu.institution}` : `Education ${i + 1}`}
                  </span>
                  {edu.gpa && (
                    <span style={{ fontSize: 9.5, color: '#1E40AF', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>
                      GPA {edu.gpa}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <button
                    disabled={i === 0}
                    onClick={() => onChange({ ...data, education: moveItem(data.education, i, 'up') })}
                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                    title="Move Up"
                  >
                    <ChevronUp size={12} color="#475569" />
                  </button>
                  <button
                    disabled={i === data.education.length - 1}
                    onClick={() => onChange({ ...data, education: moveItem(data.education, i, 'down') })}
                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === data.education.length - 1 ? 'default' : 'pointer', opacity: i === data.education.length - 1 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                    title="Move Down"
                  >
                    <ChevronDown size={12} color="#475569" />
                  </button>
                  <button
                    onClick={() => onChange({ ...data, education: data.education.filter(e => e.id !== edu.id) })}
                    style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 4, cursor: 'pointer', color: '#EF4444', padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                    title="Remove Education"
                  >
                    <Trash2 size={12} />
                  </button>
                  <button
                    onClick={() => toggleItemCollapse(edu.id)}
                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: 'pointer', padding: '3px 6px', display: 'flex', alignItems: 'center', fontSize: 10, color: '#475569', fontWeight: 600 }}
                  >
                    {isCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={labelStyle}>Institution / University</label>
                      <input
                        value={edu.institution}
                        onChange={e =>
                          onChange({
                            ...data,
                            education: data.education.map(x =>
                              x.id === edu.id ? { ...x, institution: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="e.g. Bangladesh University of Business and Technology"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Degree Title</label>
                      <input
                        value={edu.degree}
                        onChange={e =>
                          onChange({
                            ...data,
                            education: data.education.map(x =>
                              x.id === edu.id ? { ...x, degree: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="e.g. Bachelor of Science"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={labelStyle}>Field of Study</label>
                      <input
                        value={edu.field}
                        onChange={e =>
                          onChange({
                            ...data,
                            education: data.education.map(x =>
                              x.id === edu.id ? { ...x, field: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="Computer Science & Engineering"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Graduation Year</label>
                      <input
                        value={edu.endDate}
                        onChange={e =>
                          onChange({
                            ...data,
                            education: data.education.map(x =>
                              x.id === edu.id ? { ...x, endDate: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="2025"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>GPA (optional)</label>
                      <input
                        value={edu.gpa}
                        onChange={e =>
                          onChange({
                            ...data,
                            education: data.education.map(x =>
                              x.id === edu.id ? { ...x, gpa: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="3.75 / 4.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Honors / Focus / Activities</label>
                    <input
                      value={edu.honors}
                      onChange={e =>
                        onChange({
                          ...data,
                          education: data.education.map(x =>
                            x.id === edu.id ? { ...x, honors: e.target.value } : x
                          ),
                        })
                      }
                      style={inputStyle}
                      placeholder="Capstone Lead: CampusConnect, Competitive Programming Squad"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          style={addBtnStyle}
          onClick={() =>
            onChange({
              ...data,
              education: [
                ...data.education,
                { id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', honors: '' },
              ],
            })
          }
        >
          <Plus size={14} />
          <span>Add Education</span>
        </button>
      </div>
    );
  }

  // 4. Skills Tab
  if (tab === 'skills') {
    return (
      <div>
        <div style={sectionHeadStyle}>Skills & Core Stack</div>
        {data.skills.map((sg, i) => (
          <div key={sg.id} style={itemWrapStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wrench size={13} color="#2563EB" />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                  {sg.category || `Category ${i + 1}`}
                </span>
                <span style={{ fontSize: 9.5, color: '#64748B', background: '#F1F5F9', padding: '1px 5px', borderRadius: 4 }}>
                  {sg.items.length} skills
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <button
                  disabled={i === 0}
                  onClick={() => onChange({ ...data, skills: moveItem(data.skills, i, 'up') })}
                  style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                  title="Move Up"
                >
                  <ChevronUp size={12} color="#475569" />
                </button>
                <button
                  disabled={i === data.skills.length - 1}
                  onClick={() => onChange({ ...data, skills: moveItem(data.skills, i, 'down') })}
                  style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === data.skills.length - 1 ? 'default' : 'pointer', opacity: i === data.skills.length - 1 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                  title="Move Down"
                >
                  <ChevronDown size={12} color="#475569" />
                </button>
                <button
                  onClick={() => onChange({ ...data, skills: data.skills.filter(s => s.id !== sg.id) })}
                  style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 4, cursor: 'pointer', color: '#EF4444', padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                  title="Remove Category"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <label style={labelStyle}>Category Name</label>
            <input
              value={sg.category}
              onChange={e =>
                onChange({
                  ...data,
                  skills: data.skills.map(x =>
                    x.id === sg.id ? { ...x, category: e.target.value } : x
                  ),
                })
              }
              style={inputStyle}
              placeholder="e.g. Backend & Frameworks, Databases, Tools..."
            />

            <label style={labelStyle}>Skills & Technologies</label>
            <InteractiveTagInput
              items={sg.items}
              onChange={newItems =>
                onChange({
                  ...data,
                  skills: data.skills.map(x =>
                    x.id === sg.id ? { ...x, items: newItems } : x
                  ),
                })
              }
              placeholder="Type skill & press Enter, comma, or click + Add..."
              suggestions={
                (sg.category || '').toLowerCase().includes('database') || (sg.category || '').toLowerCase().includes('data')
                  ? ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Prisma', 'Elasticsearch', 'SQLite']
                  : (sg.category || '').toLowerCase().includes('devops') || (sg.category || '').toLowerCase().includes('cloud') || (sg.category || '').toLowerCase().includes('architecture')
                  ? ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Nginx', 'GitHub Actions', 'Terraform']
                  : (sg.category || '').toLowerCase().includes('problem') || (sg.category || '').toLowerCase().includes('cs')
                  ? ['LeetCode', 'Algorithms', 'Data Structures', 'System Design', 'Postman', 'Pytest']
                  : ['Python 3', 'Django 5', 'FastAPI', 'Node.js', 'REST APIs', 'Celery', 'Docker', 'GraphQL']
              }
            />
          </div>
        ))}

        <button
          style={addBtnStyle}
          onClick={() =>
            onChange({
              ...data,
              skills: [...data.skills, { id: uid(), category: '', items: [] }],
            })
          }
        >
          <Plus size={14} />
          <span>Add Skill Category</span>
        </button>
      </div>
    );
  }

  // 5. Projects Tab
  if (tab === 'projects') {
    return (
      <div>
        <div style={sectionHeadStyle}>Featured Projects & Production Systems</div>
        {data.projects.map((p, i) => {
          const isCollapsed = collapsedItems[p.id];
          return (
            <div key={p.id} style={itemWrapStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : 12, paddingBottom: isCollapsed ? 0 : 8, borderBottom: isCollapsed ? 'none' : '1px solid #E2E8F0' }}>
                <div
                  onClick={() => toggleItemCollapse(p.id)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}
                >
                  <FolderGit2 size={13} color="#2563EB" />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                    {p.name || `Project ${i + 1}`}
                  </span>
                  {p.url && (
                    <span style={{ fontSize: 9.5, color: '#2563EB', background: '#EFF6FF', padding: '1px 5px', borderRadius: 4, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.url}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <button
                    disabled={i === 0}
                    onClick={() => onChange({ ...data, projects: moveItem(data.projects, i, 'up') })}
                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                    title="Move Up"
                  >
                    <ChevronUp size={12} color="#475569" />
                  </button>
                  <button
                    disabled={i === data.projects.length - 1}
                    onClick={() => onChange({ ...data, projects: moveItem(data.projects, i, 'down') })}
                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === data.projects.length - 1 ? 'default' : 'pointer', opacity: i === data.projects.length - 1 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                    title="Move Down"
                  >
                    <ChevronDown size={12} color="#475569" />
                  </button>
                  <button
                    onClick={() => onChange({ ...data, projects: data.projects.filter(x => x.id !== p.id) })}
                    style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 4, cursor: 'pointer', color: '#EF4444', padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                    title="Remove Project"
                  >
                    <Trash2 size={12} />
                  </button>
                  <button
                    onClick={() => toggleItemCollapse(p.id)}
                    style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: 'pointer', padding: '3px 6px', display: 'flex', alignItems: 'center', fontSize: 10, color: '#475569', fontWeight: 600 }}
                  >
                    {isCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={labelStyle}>Project Name</label>
                      <input
                        value={p.name}
                        onChange={e =>
                          onChange({
                            ...data,
                            projects: data.projects.map(x =>
                              x.id === p.id ? { ...x, name: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="e.g. CampusConnect"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>URL / GitHub Repo</label>
                      <input
                        value={p.url}
                        onChange={e =>
                          onChange({
                            ...data,
                            projects: data.projects.map(x =>
                              x.id === p.id ? { ...x, url: e.target.value } : x
                            ),
                          })
                        }
                        style={inputStyle}
                        placeholder="github.com/utsho261/CampusConnect"
                      />
                    </div>
                  </div>

                  <label style={labelStyle}>Technologies Used (Tags)</label>
                  <InteractiveTagInput
                    items={p.technologies}
                    onChange={newTechs =>
                      onChange({
                        ...data,
                        projects: data.projects.map(x =>
                          x.id === p.id ? { ...x, technologies: newTechs } : x
                        ),
                      })
                    }
                    placeholder="Type tech & press Enter or comma (e.g. React 19, Docker)..."
                    suggestions={['React 19', 'Django 5', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'TypeScript', 'Tailwind CSS']}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Description & Architecture Impact</label>
                    <span style={{ fontSize: 9.5, color: (p.description || '').length > 240 ? '#DC2626' : '#64748B', fontWeight: 600 }}>
                      {(p.description || '').length} / 260 chars (1-Page Fit)
                    </span>
                  </div>
                  <textarea
                    value={p.description}
                    maxLength={260}
                    onChange={e =>
                      onChange({
                        ...data,
                        projects: data.projects.map(x =>
                          x.id === p.id ? { ...x, description: e.target.value } : x
                        ),
                      })
                    }
                    style={textareaStyle}
                    placeholder="Decoupled campus academic & social platform backend engineered with Django 5.1 & DRF..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          );
        })}

        <button
          style={addBtnStyle}
          onClick={() =>
            onChange({
              ...data,
              projects: [...data.projects, { id: uid(), name: '', description: '', technologies: [], url: '' }],
            })
          }
        >
          <Plus size={14} />
          <span>Add Project</span>
        </button>
      </div>
    );
  }

  // 6. Certifications Tab
  if (tab === 'certifications') {
    return (
      <div>
        <div style={sectionHeadStyle}>Certifications & Achievements</div>
        {data.certifications.map((c, i) => (
          <div key={c.id} style={itemWrapStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={13} color="#2563EB" />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                  {c.name || `Certification ${i + 1}`}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <button
                  disabled={i === 0}
                  onClick={() => onChange({ ...data, certifications: moveItem(data.certifications, i, 'up') })}
                  style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                  title="Move Up"
                >
                  <ChevronUp size={12} color="#475569" />
                </button>
                <button
                  disabled={i === data.certifications.length - 1}
                  onClick={() => onChange({ ...data, certifications: moveItem(data.certifications, i, 'down') })}
                  style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === data.certifications.length - 1 ? 'default' : 'pointer', opacity: i === data.certifications.length - 1 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                  title="Move Down"
                >
                  <ChevronDown size={12} color="#475569" />
                </button>
                <button
                  onClick={() => onChange({ ...data, certifications: data.certifications.filter(x => x.id !== c.id) })}
                  style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 4, cursor: 'pointer', color: '#EF4444', padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                  title="Remove Certification"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8 }}>
              <div>
                <label style={labelStyle}>Certification / Honor Title</label>
                <input
                  value={c.name}
                  onChange={e =>
                    onChange({
                      ...data,
                      certifications: data.certifications.map(x =>
                        x.id === c.id ? { ...x, name: e.target.value } : x
                      ),
                    })
                  }
                  style={inputStyle}
                  placeholder="e.g. Full Stack Web Development"
                />
              </div>
              <div>
                <label style={labelStyle}>Issuer / Platform</label>
                <input
                  value={c.issuer}
                  onChange={e =>
                    onChange({
                      ...data,
                      certifications: data.certifications.map(x =>
                        x.id === c.id ? { ...x, issuer: e.target.value } : x
                      ),
                    })
                  }
                  style={inputStyle}
                  placeholder="e.g. Ostad Platform"
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Date Obtained</label>
              <input
                value={c.date}
                onChange={e =>
                  onChange({
                    ...data,
                    certifications: data.certifications.map(x =>
                      x.id === c.id ? { ...x, date: e.target.value } : x
                    ),
                  })
                }
                style={inputStyle}
                placeholder="Jan 2025"
              />
            </div>
          </div>
        ))}

        <button
          style={addBtnStyle}
          onClick={() =>
            onChange({
              ...data,
              certifications: [...data.certifications, { id: uid(), name: '', issuer: '', date: '' }],
            })
          }
        >
          <Plus size={14} />
          <span>Add Certification</span>
        </button>
      </div>
    );
  }

  // 7. Languages Tab
  if (tab === 'languages') {
    return (
      <div>
        <div style={sectionHeadStyle}>Languages</div>
        {data.languages.map((l, i) => (
          <div key={l.id} style={itemWrapStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={13} color="#2563EB" />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>
                  {l.language || `Language ${i + 1}`}
                </span>
                <span style={{ fontSize: 9.5, color: '#1E40AF', background: '#EFF6FF', padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>
                  {l.level}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <button
                  disabled={i === 0}
                  onClick={() => onChange({ ...data, languages: moveItem(data.languages, i, 'up') })}
                  style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                  title="Move Up"
                >
                  <ChevronUp size={12} color="#475569" />
                </button>
                <button
                  disabled={i === data.languages.length - 1}
                  onClick={() => onChange({ ...data, languages: moveItem(data.languages, i, 'down') })}
                  style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, cursor: i === data.languages.length - 1 ? 'default' : 'pointer', opacity: i === data.languages.length - 1 ? 0.3 : 1, padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                  title="Move Down"
                >
                  <ChevronDown size={12} color="#475569" />
                </button>
                <button
                  onClick={() => onChange({ ...data, languages: data.languages.filter(x => x.id !== l.id) })}
                  style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 4, cursor: 'pointer', color: '#EF4444', padding: '3px 5px', display: 'flex', alignItems: 'center' }}
                  title="Remove Language"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Language</label>
                <input
                  value={l.language}
                  onChange={e =>
                    onChange({
                      ...data,
                      languages: data.languages.map(x =>
                        x.id === l.id ? { ...x, language: e.target.value } : x
                      ),
                    })
                  }
                  style={inputStyle}
                  placeholder="e.g. English, Bengali..."
                />
              </div>
              <div>
                <label style={labelStyle}>Proficiency Level</label>
                <select
                  value={l.level}
                  onChange={e =>
                    onChange({
                      ...data,
                      languages: data.languages.map(x =>
                        x.id === l.id ? { ...x, level: e.target.value } : x
                      ),
                    })
                  }
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'].map(lv => (
                    <option key={lv} value={lv}>
                      {lv}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <button
          style={addBtnStyle}
          onClick={() =>
            onChange({
              ...data,
              languages: [...data.languages, { id: uid(), language: '', level: 'Professional' }],
            })
          }
        >
          <Plus size={14} />
          <span>Add Language</span>
        </button>
      </div>
    );
  }

  return null;
}

