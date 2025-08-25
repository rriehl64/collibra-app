import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Button,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Drawer,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Switch,
  Collapse,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { ChevronLeft, ChevronRight, ExpandMore, ExpandLess } from '@mui/icons-material';
import { studyAidsService, BaChapter, QuizItem, QuizResultItem } from '../services/studyAids';
import { ttsService } from '../services/tts';
import { API_BASE_URL } from '../services/api';

const primaryBlue = '#003366';

function a11yProps(index: number) {
  return {
    id: `ba-tab-${index}`,
    'aria-controls': `ba-tabpanel-${index}`,
  };
}

const TabPanel: React.FC<{ value: number; index: number; children: React.ReactNode }> = ({ value, index, children }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ba-tabpanel-${index}`}
      aria-labelledby={`ba-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

const StudyAidsBusinessAnalytics: React.FC = () => {
  const [tab, setTab] = useState(0);
  const sections = ['Overview', 'Chapters', 'Practice', 'Labs', 'Resources', 'Final Exam'];
  const [navOpen, setNavOpen] = useState(false);
  const [desktopNavOpen, setDesktopNavOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chapters, setChapters] = useState<BaChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>('1');
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<(number | number[] | null)[]>([]);
  const [result, setResult] = useState<{ total: number; score: number } | null>(null);
  const [resultDetails, setResultDetails] = useState<QuizResultItem[] | null>(null);
  // Final exam state (separate to avoid interfering with chapter practice)
  const [finalExam, setFinalExam] = useState<QuizItem[]>([]);
  const [finalAnswers, setFinalAnswers] = useState<(number | number[] | null)[]>([]);
  const [finalResult, setFinalResult] = useState<{ total: number; score: number } | null>(null);
  const [finalDetails, setFinalDetails] = useState<QuizResultItem[] | null>(null);
  const firstNavItemRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // Edit state for click-anywhere-to-edit
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<BaChapter>>({});

  // Read Aloud state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | ''>('');
  const [rate, setRate] = useState<number>(0.95); // 0.1 - 10
  const [pitch, setPitch] = useState<number>(1);   // 0 - 2
  const [volume, setVolume] = useState<number>(1); // 0 - 1
  const [naturalPauses, setNaturalPauses] = useState<boolean>(true);
  const [pauseMs, setPauseMs] = useState<number>(350);
  const chunksRef = useRef<string[] | null>(null);
  const chunkIndexRef = useRef<number>(0);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [usePremium, setUsePremium] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [premiumUrl, setPremiumUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [voiceOpen, setVoiceOpen] = useState<boolean>(false);

  // Load persisted TTS preferences
  useEffect(() => {
    try {
      const p = localStorage.getItem('tts.usePremium');
      const r = localStorage.getItem('tts.rate');
      const pi = localStorage.getItem('tts.pitch');
      const v = localStorage.getItem('tts.volume');
      const np = localStorage.getItem('tts.naturalPauses');
      const pm = localStorage.getItem('tts.pauseMs');
      const vu = localStorage.getItem('tts.voiceURI');
      const co = localStorage.getItem('tts.controlsOpen');
      if (p !== null) setUsePremium(p === 'true');
      if (r !== null) setRate(parseFloat(r));
      if (pi !== null) setPitch(parseFloat(pi));
      if (v !== null) setVolume(parseFloat(v));
      if (np !== null) setNaturalPauses(np === 'true');
      if (pm !== null) setPauseMs(parseInt(pm, 10));
      if (vu) setSelectedVoiceURI(vu);
      if (co !== null) setVoiceOpen(co === 'true');
    } catch {
      // ignore storage errors
    }
  }, []);

  // Load available voices (Web Speech API)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const load = () => {
      const v = synth.getVoices();
      setVoices(v);
      // If no selection yet, choose a sensible default (prefer female en-* if available)
      if (!selectedVoiceURI && v.length) {
        const femaleHints = ['female', 'samantha', 'victoria', 'karen', 'fiona', 'serena', 'olivia', 'allison', 'moira'];
        const enVoices = v.filter(vi => /^en[-_]/i.test(vi.lang));
        const preferred = enVoices.find(vi => femaleHints.some(h => vi.name.toLowerCase().includes(h)));
        const fallback = enVoices[0] || v[0];
        setSelectedVoiceURI((preferred || fallback).voiceURI);
      }
    };
    load();
    // Some browsers populate voices asynchronously
    if (synth.onvoiceschanged === null || typeof synth.onvoiceschanged === 'object') {
      synth.addEventListener?.('voiceschanged', load);
      return () => synth.removeEventListener?.('voiceschanged', load);
    } else {
      // Fallback assignment for older implementations
      // @ts-ignore
      const prev = synth.onvoiceschanged;
      // @ts-ignore
      synth.onvoiceschanged = () => { prev && prev(); load(); };
      return () => { /* no-op cleanup */ };
    }
  }, [selectedVoiceURI]);

  const loadChapters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ch = await studyAidsService.getChapters();
      setChapters(ch);
      // Keep current selection if id still exists; otherwise select first
      if (ch.length > 0) {
        const exists = ch.some((c) => c.id === selectedChapter);
        if (!exists) setSelectedChapter(ch[0].id);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load chapters');
    } finally {
      setLoading(false);
    }
  }, [selectedChapter]);

  useEffect(() => {
    loadChapters();
  }, [loadChapters]);

  // Focus the first nav item when opening the sidenav (mobile)
  useEffect(() => {
    if (navOpen && firstNavItemRef.current) {
      firstNavItemRef.current.focus();
    }
  }, [navOpen]);

  // Focus the first nav item when opening the desktop sidenav
  useEffect(() => {
    if (desktopNavOpen && firstNavItemRef.current) {
      firstNavItemRef.current.focus();
    }
  }, [desktopNavOpen]);

  useEffect(() => {
    const loadQuiz = async () => {
      setError(null);
      try {
        const items = await studyAidsService.getQuiz(selectedChapter);
        setQuiz(items);
        setAnswers(new Array(items.length).fill(null));
        setResult(null);
        setResultDetails(null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load quiz');
      }
    };
    if (tab === 2) loadQuiz();
  }, [tab, selectedChapter]);

  // Load Final Exam when its tab is active (index 5)
  useEffect(() => {
    const loadFinal = async () => {
      setError(null);
      try {
        const items = await studyAidsService.getFinalExam();
        setFinalExam(items);
        setFinalAnswers(new Array(items.length).fill(null));
        setFinalResult(null);
        setFinalDetails(null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load final exam');
      }
    };
    if (tab === 5) loadFinal();
  }, [tab]);

  const selectedChapterObj = useMemo(() => chapters.find(c => c.id === selectedChapter), [chapters, selectedChapter]);

  // When entering edit mode, initialize form and move focus to first input
  useEffect(() => {
    if (isEditing && selectedChapterObj) {
      setForm({
        title: selectedChapterObj.title,
        summary: selectedChapterObj.summary,
        objectives: selectedChapterObj.objectives || [],
        teachingPoints: selectedChapterObj.teachingPoints || [],
        keyTakeaways: selectedChapterObj.keyTakeaways || [],
        applications: selectedChapterObj.applications || [],
        resources: selectedChapterObj.resources || [],
        tags: selectedChapterObj.tags || [],
      });
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [isEditing, selectedChapterObj]);

  const handleCardActivate = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
    }
    setIsEditing(true);
  };

  // Helpers to map between textarea strings and arrays
  const strToList = (val: string): string[] => val
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
  const listToStr = (arr?: string[]): string => (arr || []).join('\n');

  // For resources, simple "label | url" per line
  const resourcesToStr = (res?: { label: string; url: string }[]): string =>
    (res || []).map(r => `${r.label} | ${r.url}`).join('\n');
  const strToResources = (val: string): { label: string; url: string }[] =>
    strToList(val).map(line => {
      const [label, url] = line.split('|').map(s => s.trim());
      return { label: label || '', url: url || '' };
    });

  const handleSave = async () => {
    if (!selectedChapterObj) return;
    try {
      setLoading(true);
      const payload: Partial<BaChapter> = {
        title: form.title || selectedChapterObj.title,
        summary: form.summary ?? selectedChapterObj.summary,
        objectives: form.objectives || selectedChapterObj.objectives,
        teachingPoints: form.teachingPoints || selectedChapterObj.teachingPoints,
        keyTakeaways: form.keyTakeaways || selectedChapterObj.keyTakeaways,
        applications: form.applications || selectedChapterObj.applications,
        resources: form.resources || selectedChapterObj.resources,
        tags: form.tags || selectedChapterObj.tags,
      };
      const updated = await studyAidsService.updateChapter(selectedChapterObj.id, payload);
      // Optimistically update local list
      setChapters(prev => prev.map(c => (c.id === updated.id ? updated : c)));
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Build a single string to read for the selected chapter
  const buildChapterText = useCallback((ch: BaChapter): string => {
    const lines: string[] = [];
    lines.push(`Chapter ${ch.number}: ${ch.title}`);
    if (ch.objectives?.length) {
      lines.push('Objectives:');
      ch.objectives.forEach((o, i) => lines.push(`${i + 1}. ${o}`));
    }
    if (ch.summary) {
      lines.push('Summary:');
      lines.push(ch.summary);
    }
    if (ch.teachingPoints?.length) {
      lines.push('Teaching Points:');
      ch.teachingPoints.forEach((t, i) => lines.push(`${i + 1}. ${t}`));
    }
    if (ch.keyTakeaways?.length) {
      lines.push('Key Takeaways:');
      ch.keyTakeaways.forEach((t, i) => lines.push(`${i + 1}. ${t}`));
    }
    if (ch.applications?.length) {
      lines.push('Applications:');
      ch.applications.forEach((app) => {
        if (app.context) lines.push(app.context);
        (app.items || []).forEach((it) => lines.push(it));
      });
    }
    if (ch.resources?.length) {
      lines.push('Resources:');
      ch.resources.forEach((r) => lines.push(`${r.label}. Link: ${r.url}`));
    }
    if (ch.tags?.length) {
      lines.push(`Tags: ${ch.tags.join(', ')}`);
    }
    return lines.join('\n');
  }, []);

  const stopSpeaking = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch { /* no-op */ }
    utteranceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
    chunksRef.current = null;
    chunkIndexRef.current = 0;
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const speakChunk = useCallback((text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    const chosen = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (chosen) {
      u.voice = chosen;
      u.lang = chosen.lang;
    }
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;
    u.onend = () => {
      // schedule next chunk if any
      if (chunksRef.current && chunkIndexRef.current < chunksRef.current.length) {
        const delay = naturalPauses ? pauseMs : 0;
        pauseTimerRef.current = setTimeout(() => {
          if (!chunksRef.current) return; // stopped
          const next = chunksRef.current[chunkIndexRef.current++];
          speakChunk(next);
        }, delay);
      } else {
        setIsSpeaking(false);
      }
    };
    u.onerror = () => setIsSpeaking(false);
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, [naturalPauses, pauseMs, pitch, rate, selectedVoiceURI, voices, volume]);

  const handleToggleSpeak = useCallback(async () => {
    if (!selectedChapterObj) return;
    // Stop if already speaking
    if (isSpeaking) {
      if (usePremium) {
        try {
          audioRef.current?.pause();
          if (audioRef.current) audioRef.current.currentTime = 0;
        } catch {}
        setIsSpeaking(false);
        setIsPaused(false);
        setPremiumUrl(null);
      } else {
        stopSpeaking();
      }
      return;
    }
    if (usePremium) {
      let premiumStarted = false;
      try {
        setIsGenerating(true);
        setError(null);
        const text = buildChapterText(selectedChapterObj);
        const res = await ttsService.generate({ text });
        if (!res.success || !res.url) {
          throw new Error(res.error || 'TTS generation failed');
        }
        // Build absolute URL to backend static file
        const backendBase = API_BASE_URL.replace(/\/api\/v1$/, '');
        const abs = `${backendBase}${res.url}`;
        setPremiumUrl(abs);
        setIsSpeaking(true);
        setIsPaused(false);
        premiumStarted = true;
        // Play via audio element
        setTimeout(() => {
          try {
            if (audioRef.current) {
              audioRef.current.src = abs;
              audioRef.current.play().catch(() => {/* ignore */});
            }
          } catch {}
        }, 0);
      } catch (e: any) {
        // Fallback to Web Speech on error
        setError(e?.message || 'Premium TTS failed; using browser voice');
      } finally {
        setIsGenerating(false);
      }
      if (premiumStarted) {
        return; // skip Web Speech if premium playback started
      }
      // else fall through to Web Speech branch
    }
    // Web Speech branch (default or fallback)
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setError('Read Aloud is not supported in this browser');
      return;
    }
    setIsSpeaking(true);
    setIsPaused(false);
    window.speechSynthesis.cancel();
    const full = buildChapterText(selectedChapterObj);
    if (naturalPauses) {
      // split by sentences and headings to create natural breaks
      const parts = full
        .split(/(?<=[.!?])\s+|\n+|:\s*/)
        .map(s => s.trim())
        .filter(Boolean);
      chunksRef.current = parts;
      chunkIndexRef.current = 0;
      if (chunksRef.current.length) {
        const first = chunksRef.current[chunkIndexRef.current++];
        speakChunk(first);
      } else {
        setIsSpeaking(false);
      }
    } else {
      chunksRef.current = null;
      chunkIndexRef.current = 0;
      speakChunk(full);
    }
  }, [API_BASE_URL, buildChapterText, isSpeaking, naturalPauses, premiumUrl, selectedChapterObj, speakChunk, stopSpeaking, usePremium]);

  // Stop reading when chapter changes, tab changes away, or component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
      try { audioRef.current?.pause(); } catch {}
    };
  }, [stopSpeaking]);
  useEffect(() => {
    if (isSpeaking) stopSpeaking();
  }, [selectedChapter, tab]);

  // ESC to stop reading
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSpeaking) {
        e.preventDefault();
        stopSpeaking();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSpeaking, stopSpeaking]);

  const handlePauseResume = useCallback(() => {
    if (!isSpeaking) return;
    if (usePremium) {
      try {
        if (!isPaused) {
          audioRef.current?.pause();
          setIsPaused(true);
        } else {
          audioRef.current?.play();
          setIsPaused(false);
        }
      } catch {}
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    if (!isPaused) {
      try { synth.pause(); } catch {}
      setIsPaused(true);
    } else {
      try { synth.resume(); } catch {}
      setIsPaused(false);
    }
  }, [isPaused, isSpeaking, usePremium]);

  // Attach audio end handler for premium playback
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('ended', onEnded);
    };
  }, [audioRef.current]);

  // Persist TTS preferences on change
  useEffect(() => {
    try { localStorage.setItem('tts.usePremium', String(usePremium)); } catch {}
  }, [usePremium]);
  useEffect(() => {
    try { localStorage.setItem('tts.voiceURI', selectedVoiceURI || ''); } catch {}
  }, [selectedVoiceURI]);
  useEffect(() => {
    try { localStorage.setItem('tts.rate', String(rate)); } catch {}
  }, [rate]);
  useEffect(() => {
    try { localStorage.setItem('tts.pitch', String(pitch)); } catch {}
  }, [pitch]);
  useEffect(() => {
    try { localStorage.setItem('tts.volume', String(volume)); } catch {}
  }, [volume]);
  useEffect(() => {
    try { localStorage.setItem('tts.naturalPauses', String(naturalPauses)); } catch {}
  }, [naturalPauses]);
  useEffect(() => {
    try { localStorage.setItem('tts.pauseMs', String(pauseMs)); } catch {}
  }, [pauseMs]);
  useEffect(() => {
    try { localStorage.setItem('tts.controlsOpen', String(voiceOpen)); } catch {}
  }, [voiceOpen]);

  const handleSubmitQuiz = async () => {
    try {
      const res = await studyAidsService.submitQuiz(selectedChapter, answers);
      setResult({ total: res.total, score: res.score });
      setResultDetails(res.results);
    } catch (e: any) {
      setError(e?.message || 'Failed to submit quiz');
    }
  };

  const handleSubmitFinal = async () => {
    try {
      const res = await studyAidsService.submitFinalExam(finalAnswers);
      setFinalResult({ total: res.total, score: res.score });
      setFinalDetails(res.results);
    } catch (e: any) {
      setError(e?.message || 'Failed to submit final exam');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ color: primaryBlue, fontWeight: 700, mb: 1 }}>
        Study Aids: Business Analytics
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Guides, practice, labs, and resources aligned to Albright & Winston (8th ed.).
      </Typography>

      {error && <Alert severity="error" role="alert">{error}</Alert>}

      {/* Top tabs for large screens */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        aria-label="Business Analytics study aids tabs"
        textColor="primary"
        indicatorColor="primary"
        sx={{ borderBottom: '1px solid #e0e0e0', display: { xs: 'none', md: 'flex' } }}
      >
        {sections.map((label, idx) => (
          <Tab key={label} label={label} {...a11yProps(idx)} />
        ))}
      </Tabs>

      {/* Mobile sidenav toggle */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', my: 1 }}>
        <IconButton
          onClick={() => setNavOpen(true)}
          aria-label="Open section navigation"
          aria-haspopup="true"
          aria-expanded={navOpen ? 'true' : 'false'}
        >
          <span className="material-icons" aria-hidden>menu</span>
        </IconButton>
        <Typography sx={{ ml: 1, fontWeight: 600 }}>Sections</Typography>
      </Box>

      {/* Desktop sidenav toggle */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', my: 1 }}>
        <IconButton
          onClick={() => setDesktopNavOpen((v) => !v)}
          aria-label={desktopNavOpen ? 'Collapse section navigation' : 'Expand section navigation'}
          aria-controls="ba-desktop-sidenav"
          aria-expanded={desktopNavOpen ? 'true' : 'false'}
        >
          {desktopNavOpen ? (
            <ChevronLeft aria-hidden fontSize="small" />
          ) : (
            <ChevronRight aria-hidden fontSize="small" />
          )}
        </IconButton>
        <Typography sx={{ ml: 1, fontWeight: 600 }}>Sections</Typography>
      </Box>

      {/* Desktop layout with permanent sidenav */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={desktopNavOpen ? 3 : 0} sx={{ display: { xs: 'none', md: desktopNavOpen ? 'block' : 'none' } }}>
          <Paper id="ba-desktop-sidenav" variant="outlined" role="navigation" aria-label="Section navigation" sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ px: 1, pt: 1, pb: 0.5, fontWeight: 700, color: 'text.secondary' }}>
              Sections
            </Typography>
            <List
              role="listbox"
              aria-label="Study aids sections"
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  const dir = e.key === 'ArrowDown' ? 1 : -1;
                  const next = (tab + dir + sections.length) % sections.length;
                  setTab(next);
                }
              }}
            >
              {sections.map((label, idx) => (
                <ListItemButton
                  key={`sec-${label}`}
                  role="option"
                  aria-selected={tab === idx}
                  selected={tab === idx}
                  onClick={() => setTab(idx)}
                  ref={idx === 0 ? firstNavItemRef : undefined}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={desktopNavOpen ? 9 : 12}>
          {/* Content panels remain the same */}
          <TabPanel value={tab} index={0}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>How to use this module</Typography>
              <Typography component="ul" sx={{ pl: 3 }}>
                <li>Start with Chapter Guides for concise summaries and objectives.</li>
                <li>Use Practice to check understanding with immediate feedback.</li>
                <li>Complete Labs to build Excel/Power Query/Power Pivot skills.</li>
                <li>Visit Resources for links to official material and datasets.</li>
              </Typography>
            </Paper>
          </TabPanel>

          <TabPanel value={tab} index={5}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Final Exam</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(JSON.stringify(finalExam, null, 2));
                      alert('Final exam JSON copied to clipboard');
                    } catch {
                      alert('Failed to copy exam to clipboard');
                    }
                  }}
                  aria-label="Export final exam as JSON"
                >
                  Export Exam
                </Button>
              </Box>
              {!finalExam.length && !error ? (
                <Typography>Final exam is not available yet.</Typography>
              ) : (
                <Box component="ol" sx={{ pl: 3 }}>
                  {finalExam.map((q, qi) => (
                    <Box key={q.id || qi} component="li" sx={{ mb: 2 }}>
                      <Typography sx={{ mb: 1 }}>{q.prompt}</Typography>
                      {!!q.id && /^(\d+)-/.test(String(q.id)) && (
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                          Source chapter: {String(q.id).match(/^(\d+)-/)?.[1]}
                        </Typography>
                      )}
                      {q.type === 'mcq' && Array.isArray(q.options) && (
                        <RadioGroup
                          value={typeof finalAnswers[qi] === 'number' ? String(finalAnswers[qi]) : ''}
                          onChange={(_, val) => {
                            setFinalAnswers(prev => {
                              const next = [...prev];
                              next[qi] = Number(val);
                              return next;
                            });
                          }}
                          aria-label={`Final exam question ${qi + 1}`}
                        >
                          {q.options.map((opt, oi) => (
                            <FormControlLabel key={oi} value={String(oi)} control={<Radio />} label={opt} />
                          ))}
                        </RadioGroup>
                      )}
                      {q.type === 'msq' && Array.isArray(q.options) && (
                        <FormGroup aria-label={`Final exam question ${qi + 1}`}>
                          {q.options.map((opt, oi) => {
                            const arr = Array.isArray(finalAnswers[qi]) ? (finalAnswers[qi] as number[]) : [];
                            const checked = arr.includes(oi);
                            return (
                              <FormControlLabel
                                key={oi}
                                control={
                                  <Checkbox
                                    checked={checked}
                                    onChange={(e) => {
                                      setFinalAnswers(prev => {
                                        const cur = Array.isArray(prev[qi]) ? ([...(prev[qi] as number[])]) : [];
                                        const nextSet = new Set(cur);
                                        if (e.target.checked) nextSet.add(oi); else nextSet.delete(oi);
                                        const next = [...prev];
                                        next[qi] = Array.from(nextSet).sort((a,b)=>a-b);
                                        return next;
                                      });
                                    }}
                                  />
                                }
                                label={opt}
                              />
                            );
                          })}
                        </FormGroup>
                      )}
                      {q.type === 'numeric' && (
                        <TextField
                          type="number"
                          size="small"
                          inputProps={{ step: 'any' }}
                          aria-label={`Final exam question ${qi + 1} numeric answer`}
                          value={typeof finalAnswers[qi] === 'number' ? String(finalAnswers[qi]) : ''}
                          onChange={(e) => {
                            const num = e.target.value === '' ? null : Number(e.target.value);
                            setFinalAnswers(prev => {
                              const next = [...prev];
                              next[qi] = Number.isFinite(num as number) || num === null ? (num as number | null) : null;
                              return next;
                            });
                          }}
                        />
                      )}
                      {q.type !== 'mcq' && q.type !== 'msq' && q.type !== 'numeric' && (
                        <Alert severity="info">This question type is not yet supported in submission.</Alert>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmitFinal}
                  disabled={!finalExam.length}
                  aria-label="Submit final exam answers"
                >
                  Submit Final
                </Button>
                <Button
                  variant="text"
                  onClick={() => { setFinalAnswers(new Array(finalExam.length).fill(null)); setFinalResult(null); setFinalDetails(null); }}
                  disabled={!finalExam.length}
                  aria-label="Clear final exam answers"
                >
                  Clear
                </Button>
              </Box>

              {finalResult && (
                <Alert severity="success" sx={{ mt: 2 }} role="status" aria-live="polite">
                  You scored {finalResult.score} out of {finalResult.total}.
                </Alert>
              )}
              {finalDetails && finalDetails.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Review</Typography>
                  <Box component="ul" sx={{ pl: 3 }}>
                    {finalDetails.map((r, i) => (
                      <li key={r.id || i}>
                        <Typography component="span" sx={{ fontWeight: 600, color: r.correct ? 'success.main' : 'error.main' }}>
                          Q{i + 1}: {r.correct ? 'Correct' : 'Incorrect'}
                        </Typography>
                        {r.explanation && (
                          <Typography component="div" variant="body2">{r.explanation}</Typography>
                        )}
                      </li>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" role="navigation" aria-label="Chapter list" sx={{ maxHeight: 480, overflow: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderBottom: '1px solid #eee' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Chapters</Typography>
                    <Button
                      size="small"
                      onClick={loadChapters}
                      disabled={loading}
                      aria-label="Refresh chapters from server"
                    >
                      {loading ? 'Refreshing…' : 'Refresh'}
                    </Button>
                  </Box>
                  {loading ? (
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} aria-label="Loading" /> <Typography>Loading chapters…</Typography>
                    </Box>
                  ) : (
                    <List>
                      {chapters.map((c) => (
                        <ListItemButton
                          key={c.id}
                          role="button"
                          aria-label={`Open Chapter ${c.number}: ${c.title}`}
                          selected={selectedChapter === c.id}
                          onClick={() => setSelectedChapter(c.id)}
                        >
                          <ListItemText primary={`Chapter ${c.number}: ${c.title}`} />
                        </ListItemButton>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={8}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, outline: 'none', '&:focus-visible': { boxShadow: `0 0 0 3px ${primaryBlue}` }, cursor: isEditing ? 'default' : 'pointer' }}
                  role={!isEditing ? 'button' : undefined}
                  tabIndex={!isEditing ? 0 : -1}
                  aria-label={!isEditing ? 'Edit chapter' : undefined}
                  onClick={!isEditing ? handleCardActivate : undefined}
                  onKeyDown={!isEditing ? handleCardActivate : undefined}
                >
                  {selectedChapterObj ? (
                    isEditing ? (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>{`Edit Chapter ${selectedChapterObj.number}`}</Typography>
                        <TextField
                          inputRef={firstInputRef}
                          label="Title"
                          fullWidth
                          value={form.title ?? ''}
                          onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                          aria-label="Chapter title"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Summary"
                          fullWidth
                          multiline
                          minRows={3}
                          value={form.summary ?? ''}
                          onChange={(e) => setForm(f => ({ ...f, summary: e.target.value }))}
                          aria-label="Chapter summary"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Objectives (one per line)"
                          fullWidth
                          multiline
                          minRows={3}
                          value={listToStr(form.objectives as string[])}
                          onChange={(e) => setForm(f => ({ ...f, objectives: strToList(e.target.value) }))}
                          aria-label="Chapter objectives"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Teaching Points (one per line)"
                          fullWidth
                          multiline
                          minRows={3}
                          value={listToStr(form.teachingPoints as string[])}
                          onChange={(e) => setForm(f => ({ ...f, teachingPoints: strToList(e.target.value) }))}
                          aria-label="Teaching points"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Key Takeaways (one per line)"
                          fullWidth
                          multiline
                          minRows={3}
                          value={listToStr(form.keyTakeaways as string[])}
                          onChange={(e) => setForm(f => ({ ...f, keyTakeaways: strToList(e.target.value) }))}
                          aria-label="Key takeaways"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Applications (context and items not fully editable in v1)"
                          fullWidth
                          multiline
                          minRows={3}
                          value={JSON.stringify(form.applications || [], null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              setForm(f => ({ ...f, applications: parsed }));
                            } catch { /* ignore parse errors while typing */ }
                          }}
                          aria-label="Applications JSON"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Resources (label | url per line)"
                          fullWidth
                          multiline
                          minRows={3}
                          value={resourcesToStr(form.resources as { label: string; url: string }[])}
                          onChange={(e) => setForm(f => ({ ...f, resources: strToResources(e.target.value) }))}
                          aria-label="Resources"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Tags (comma separated)"
                          fullWidth
                          value={(form.tags || []).join(', ')}
                          onChange={(e) => setForm(f => ({ ...f, tags: strToList(e.target.value.replace(/\s*,\s*/g, '\n')) }))}
                          aria-label="Tags"
                          sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button variant="contained" onClick={handleSave} disabled={loading} aria-label="Save chapter changes">
                            Save
                          </Button>
                          <Button variant="outlined" onClick={handleCancel} aria-label="Cancel editing">
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>{`Chapter ${selectedChapterObj.number}: ${selectedChapterObj.title}`}</Typography>
                        <Grid container spacing={2} alignItems="flex-start">
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button variant="outlined" onClick={(e) => { e.stopPropagation(); handleToggleSpeak(); }} aria-pressed={isSpeaking} aria-label={isSpeaking ? 'Stop reading aloud' : 'Read chapter aloud'} sx={{ minWidth: 140 }}>
                                  {isSpeaking ? 'Stop' : 'Read Aloud'}
                                </Button>
                                <Button variant="outlined" onClick={(e) => { e.stopPropagation(); handlePauseResume(); }} disabled={!isSpeaking} aria-label={!isSpeaking ? 'Pause reading (disabled)' : (isPaused ? 'Resume reading aloud' : 'Pause reading aloud')} sx={{ minWidth: 140 }}>
                                  {isPaused ? 'Resume' : 'Pause'}
                                </Button>
                                {isGenerating && (
                                  <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', alignItems: 'center', gap: 1 }} aria-live="polite" aria-atomic="true">
                                    <CircularProgress size={18} />
                                    <Typography variant="body2">Generating audio…</Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                            {premiumUrl && (
                              <Box onClick={(e) => e.stopPropagation()} sx={{ mt: 1 }}>
                                <audio ref={audioRef} controls src={premiumUrl} aria-label={`Premium narration for Chapter ${selectedChapterObj.number}: ${selectedChapterObj.title}`} style={{ width: '100%' }} />
                              </Box>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                              <Button variant="text" size="small" onClick={(e) => { e.stopPropagation(); setVoiceOpen(o => !o); }} aria-expanded={voiceOpen} aria-controls="voice-controls-panel" aria-label={voiceOpen ? 'Hide voice controls' : 'Show voice controls'} sx={{ textTransform: 'none' }} endIcon={voiceOpen ? <ExpandLess /> : <ExpandMore />}>
                                Voice Controls
                              </Button>
                            </Box>
                            <Collapse in={voiceOpen} aria-hidden={!voiceOpen}>
                              <Box id="voice-controls-panel" onClick={(e) => e.stopPropagation()} aria-labelledby="tts-controls-heading">
                                <Typography id="tts-controls-heading" variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Voice Controls</Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography id="rate-slider" variant="caption">Rate</Typography>
                                    <Slider aria-labelledby="rate-slider" value={rate} min={0.5} max={1.5} step={0.05} valueLabelDisplay="auto" onChange={(_, v) => setRate(v as number)} />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography id="pitch-slider" variant="caption">Pitch</Typography>
                                    <Slider aria-labelledby="pitch-slider" value={pitch} min={0} max={2} step={0.1} valueLabelDisplay="auto" onChange={(_, v) => setPitch(v as number)} />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography id="volume-slider" variant="caption">Volume</Typography>
                                    <Slider aria-labelledby="volume-slider" value={volume} min={0} max={1} step={0.05} valueLabelDisplay="auto" onChange={(_, v) => setVolume(v as number)} />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <FormControlLabel control={<Switch checked={naturalPauses} onChange={(e) => setNaturalPauses(e.target.checked)} />} label="Natural Pauses" aria-label="Toggle natural pauses" />
                                    <Box sx={{ display: 'grid', gap: 0.5, mt: 1 }}>
                                      <Typography id="pause-ms-slider" variant="caption">Pause duration (ms)</Typography>
                                      <Slider aria-labelledby="pause-ms-slider" value={pauseMs} min={100} max={2000} step={50} valueLabelDisplay="auto" onChange={(_, v) => setPauseMs(v as number)} disabled={!naturalPauses} />
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <FormControlLabel control={<Switch checked={usePremium} onChange={(e) => setUsePremium(e.target.checked)} />} label="Use ElevenLabs Premium Voice" aria-label="Toggle premium ElevenLabs voice" />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <FormControl size="small" sx={{ minWidth: 220 }}>
                                      <Select displayEmpty aria-label="Voice selection" value={selectedVoiceURI} onChange={(e) => setSelectedVoiceURI(e.target.value as string)} renderValue={(val) => {
                                        if (!val) return 'Default Voice';
                                        const v = voices.find(vi => vi.voiceURI === val);
                                        return v ? `${v.name} (${v.lang})` : 'Default Voice';
                                      }}>
                                        <MenuItem value="">Default Voice</MenuItem>
                                        {voices.filter(v => /^en[-_]/i.test(v.lang)).map(v => (
                                          <MenuItem key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Collapse>
                          </Grid>
                        </Grid>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Summary</Typography>
                        <Typography sx={{ mb: 2 }}>{selectedChapterObj.summary}</Typography>
                        {Array.isArray(selectedChapterObj.teachingPoints) && selectedChapterObj.teachingPoints.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Teaching Points</Typography>
                            <Box component="ul" sx={{ pl: 3 }}>
                              {selectedChapterObj.teachingPoints.map((tp, i) => (
                                <li key={`tp-${i}`}>{tp}</li>
                              ))}
                            </Box>
                          </Box>
                        )}
                        {Array.isArray(selectedChapterObj.keyTakeaways) && selectedChapterObj.keyTakeaways.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Key Takeaways</Typography>
                            <Box component="ul" sx={{ pl: 3 }}>
                              {selectedChapterObj.keyTakeaways.map((kt, i) => (
                                <li key={`kt-${i}`}>{kt}</li>
                              ))}
                            </Box>
                          </Box>
                        )}
                        {Array.isArray(selectedChapterObj.applications) && selectedChapterObj.applications.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>How This Applies</Typography>
                            {selectedChapterObj.applications.map((app, idx) => (
                              <Box key={`app-${idx}`} sx={{ mb: 1 }}>
                                {app.context && (<Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{app.context}</Typography>)}
                                <Box component="ul" sx={{ pl: 3 }}>
                                  {(app.items || []).map((it, i) => (<li key={`app-${idx}-it-${i}`}>{it}</li>))}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Resources</Typography>
                        {selectedChapterObj.resources.length === 0 ? (
                          <Typography>No chapter-specific links yet.</Typography>
                        ) : (
                          <Box component="ul" sx={{ pl: 3 }}>
                            {selectedChapterObj.resources.map((r, i) => (
                              <li key={i}><a href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>
                            ))}
                          </Box>
                        )}
                      </Box>
                    )) : (
                      <Typography>Select a chapter to view details.</Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tab} index={2}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Practice{selectedChapterObj ? `: Chapter ${selectedChapterObj.number}` : ''}</Typography>
                {!quiz.length && !error ? (
                  <Typography>No practice questions available for this chapter yet.</Typography>
                ) : (
                  <Box component="ol" sx={{ pl: 3 }}>
                    {quiz.map((q, qi) => (
                      <Box key={q.id || qi} component="li" sx={{ mb: 2 }}>
                        <Typography sx={{ mb: 1 }}>{q.prompt}</Typography>
                        {q.type === 'mcq' && Array.isArray(q.options) && (
                          <RadioGroup
                            value={typeof answers[qi] === 'number' ? String(answers[qi]) : ''}
                            onChange={(_, val) => {
                              setAnswers(prev => {
                                const next = [...prev];
                                next[qi] = Number(val);
                                return next;
                              });
                            }}
                            aria-label={`Question ${qi + 1}`}
                          >
                            {q.options.map((opt, oi) => (
                              <FormControlLabel key={oi} value={String(oi)} control={<Radio />} label={opt} />
                            ))}
                          </RadioGroup>
                        )}
                        {q.type === 'msq' && Array.isArray(q.options) && (
                          <FormGroup aria-label={`Question ${qi + 1}`}>
                            {q.options.map((opt, oi) => {
                              const arr = Array.isArray(answers[qi]) ? (answers[qi] as number[]) : [];
                              const checked = arr.includes(oi);
                              return (
                                <FormControlLabel
                                  key={oi}
                                  control={
                                    <Checkbox
                                      checked={checked}
                                      onChange={(e) => {
                                        setAnswers(prev => {
                                          const cur = Array.isArray(prev[qi]) ? ([...(prev[qi] as number[])]) : [];
                                          const nextSet = new Set(cur);
                                          if (e.target.checked) nextSet.add(oi); else nextSet.delete(oi);
                                          const next = [...prev];
                                          next[qi] = Array.from(nextSet).sort((a,b)=>a-b);
                                          return next;
                                        });
                                      }}
                                    />
                                  }
                                  label={opt}
                                />
                              );
                            })}
                          </FormGroup>
                        )}
                        {q.type === 'numeric' && (
                          <TextField
                            type="number"
                            size="small"
                            inputProps={{ step: 'any' }}
                            aria-label={`Question ${qi + 1} numeric answer`}
                            value={typeof answers[qi] === 'number' ? String(answers[qi]) : ''}
                            onChange={(e) => {
                              const num = e.target.value === '' ? null : Number(e.target.value);
                              setAnswers(prev => {
                                const next = [...prev];
                                next[qi] = Number.isFinite(num as number) || num === null ? (num as number | null) : null;
                                return next;
                              });
                            }}
                          />
                        )}
                        {q.type !== 'mcq' && q.type !== 'msq' && q.type !== 'numeric' && (
                          <Alert severity="info">This question type is not yet supported in submission.</Alert>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleSubmitQuiz}
                    disabled={!quiz.length}
                    aria-label="Submit practice answers"
                  >
                    Submit Answers
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => { setAnswers(new Array(quiz.length).fill(null)); setResult(null); setResultDetails(null); }}
                    disabled={!quiz.length}
                    aria-label="Clear answers"
                  >
                    Clear
                  </Button>
                </Box>

                {result && (
                  <Alert severity="success" sx={{ mt: 2 }} role="status" aria-live="polite">
                    You scored {result.score} out of {result.total}.
                  </Alert>
                )}
                {resultDetails && resultDetails.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Review</Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                      {resultDetails.map((r, i) => (
                        <li key={r.id || i}>
                          <Typography component="span" sx={{ fontWeight: 600, color: r.correct ? 'success.main' : 'error.main' }}>
                            Q{i + 1}: {r.correct ? 'Correct' : 'Incorrect'}
                          </Typography>
                          {r.explanation && (
                            <Typography component="div" variant="body2">{r.explanation}</Typography>
                          )}
                        </li>
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            </TabPanel>

            <TabPanel value={tab} index={3}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Labs</Typography>
                <Typography sx={{ mb: 1 }}>Excel / Power Query / Power Pivot hands-on activities.</Typography>
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const labs = await studyAidsService.getLabs();
                      setLoading(false);
                      alert(`${labs.length} lab(s) available: ` + labs.map((l: any) => l.title).join(', '));
                    } catch (e: any) {
                      setLoading(false);
                      setError(e?.message || 'Failed to load labs');
                    }
                  }}
                  variant="outlined"
                  aria-label="Load labs"
                >
                  Load Labs
                </Button>
              </Paper>
            </TabPanel>

            <TabPanel value={tab} index={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Resources</Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                  <li><a href="https://sites.google.com/view/albrightbooks/home/business-analytics-data-analysis-decision-making/badadm-8e-table-of-contents" target="_blank" rel="noreferrer">Official Table of Contents</a></li>
                  <li><a href="https://www.cengageasia.com/TitleDetails/isbn/9780357984581" target="_blank" rel="noreferrer">Publisher Page</a></li>
                  <li><a href="https://www.barnesandnoble.com/w/business-analytics-s-albright/1116345520" target="_blank" rel="noreferrer">Barnes & Noble</a></li>
                  <li><a href="https://www.vitalsource.com/products/business-analytics-data-analysis-amp-decision-s-christian-albright-wayne-v9798214048666" target="_blank" rel="noreferrer">VitalSource</a></li>
                </Box>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Respect copyright and academic integrity. Use official resources and your own notes.
                </Alert>
              </Paper>
            </TabPanel>
          </Grid>
        </Grid>

      {/* Mobile Drawer for sidenav */}
      <Drawer
        anchor="left"
        open={navOpen}
        onClose={() => setNavOpen(false)}
        ModalProps={{ keepMounted: true }}
        aria-label="Section navigation drawer"
      >
        <Box sx={{ width: 260 }} role="navigation" aria-label="Section navigation">
          <List
            role="listbox"
            aria-label="Study aids sections"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const dir = e.key === 'ArrowDown' ? 1 : -1;
                const next = (tab + dir + sections.length) % sections.length;
                setTab(next);
              }
            }}
          >
            {sections.map((label, idx) => (
              <ListItemButton
                key={`m-${label}`}
                role="option"
                aria-selected={tab === idx}
                selected={tab === idx}
                onClick={() => {
                  setTab(idx);
                  setNavOpen(false);
                }}
                ref={idx === 0 ? firstNavItemRef : undefined}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

    </Box>
  );
};

export default StudyAidsBusinessAnalytics;
