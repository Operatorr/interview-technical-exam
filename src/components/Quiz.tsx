import { useState, useEffect, useMemo, useRef } from 'react';
import { questions, sections, phases, getSectionName, type Question } from '../data/questions';
import { cn } from '../lib/utils';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  Trophy,
  Target,
  Lightbulb,
  Play,
  Clock,
  HelpCircle,
  FileText,
  Award
} from 'lucide-react';

interface QuizState {
  currentIndex: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  showResult: Record<number, boolean>;
  completed: boolean;
  startTime: number;
  quizStatus: 'not-started' | 'in-progress' | 'completed';
}

const STORAGE_KEY = 'quiz-state';

const defaultState: QuizState = {
  currentIndex: 0,
  answers: {},
  showResult: {},
  completed: false,
  startTime: 0,
  quizStatus: 'not-started',
};

export default function Quiz() {
  const [state, setState] = useState<QuizState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [, setTick] = useState(0);
  const [justAnswered, setJustAnswered] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.quizStatus !== 'in-progress') return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [state.quizStatus]);

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<QuizState>;
        setState({
          currentIndex: parsed.currentIndex ?? 0,
          answers: parsed.answers ?? {},
          showResult: parsed.showResult ?? {},
          completed: parsed.completed ?? false,
          startTime: parsed.startTime ?? 0,
          quizStatus: parsed.quizStatus ?? 'not-started',
        });
      }
    } catch {
      // Corrupted data — fall back to defaults
    }
    setHydrated(true);
  }, []);

  // Persist state to localStorage on every change (skip initial render before hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage unavailable (e.g. private browsing quota exceeded)
    }
  }, [state, hydrated]);

  // Scroll to top when navigating to a different question
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
  }, [state.currentIndex]);

  // Auto-scroll to feedback when user just answered
  useEffect(() => {
    if (!justAnswered || !state.showResult[questions[state.currentIndex]?.id]) return;
    const timer = setTimeout(() => {
      if (feedbackRef.current) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        feedbackRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? 'instant' : 'smooth',
          block: 'start',
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [justAnswered, state.showResult, state.currentIndex]);

  const currentQuestion = questions[state.currentIndex];
  const selectedAnswer = state.answers[currentQuestion.id];
  const showingResult = state.showResult[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleSelectAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (showingResult) return;

    setJustAnswered(true);
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion.id]: answer },
      showResult: { ...prev.showResult, [currentQuestion.id]: true },
    }));
  };

  const handleNext = () => {
    setJustAnswered(false);
    if (state.currentIndex < questions.length - 1) {
      setState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      setState(prev => ({ ...prev, completed: true, quizStatus: 'completed' }));
    }
  };

  const handlePrevious = () => {
    setJustAnswered(false);
    if (state.currentIndex > 0) {
      setState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  };

  const handleStartQuiz = () => {
    setState(prev => ({
      ...prev,
      currentIndex: 0,
      startTime: Date.now(),
      quizStatus: 'in-progress',
    }));
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
    setState({ ...defaultState });
  };

  const handleGoToQuestion = (index: number) => {
    setJustAnswered(false);
    setState(prev => ({ ...prev, currentIndex: index, completed: false }));
  };

  // Precompute question index map (avoids O(n²) findIndex in render)
  const questionIndexMap = useMemo(() => {
    const map: Record<number, number> = {};
    questions.forEach((q, i) => { map[q.id] = i; });
    return map;
  }, []);

  // Calculate scores (memoized to avoid recomputing on every render)
  const scores = useMemo(() => {
    const sectionScores: Record<string, { correct: number; total: number }> = {};
    let totalCorrect = 0;

    sections.forEach(section => {
      sectionScores[section.id] = { correct: 0, total: 0 };
    });

    questions.forEach(q => {
      sectionScores[q.section].total++;
      if (state.answers[q.id] === q.correctAnswer) {
        sectionScores[q.section].correct++;
        totalCorrect++;
      }
    });

    return { sectionScores, totalCorrect, total: questions.length };
  }, [state.answers]);

  const getElapsedTime = () => {
    if (state.startTime === 0) return '0:00';
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Progress indicator
  const answeredCount = Object.keys(state.answers).length;
  const progress = (answeredCount / questions.length) * 100;

  // Show start page before quiz begins
  if (state.quizStatus === 'not-started') {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 mb-4 animate-glow-pulse">
              <Target className="w-10 h-10 text-amber-500" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-foreground font-heading mb-2">Technical Assessment</h1>
            <p className="text-muted-foreground">IC4 Software Engineer - Back End</p>
          </div>

          {/* Information Card */}
          <div className="glass rounded-2xl p-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="text-sm text-muted-foreground">Total Questions</span>
                  <p className="font-semibold text-foreground">{questions.length} questions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="text-sm text-muted-foreground">Estimated Time</span>
                  <p className="font-semibold text-foreground">~{Math.ceil(questions.length * 1.5)} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-500 flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="text-sm text-muted-foreground">Instructions</span>
                  <p className="font-semibold text-foreground">Answer all questions to complete the assessment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-cockpit-dark rounded-lg font-semibold text-lg hover:bg-amber-400 transition-colors glow-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cockpit-dark"
            >
              <Play className="w-5 h-5" aria-hidden="true" />
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.completed) {
    const { sectionScores, totalCorrect, total } = scores;
    const percentage = Math.round((totalCorrect / total) * 100);

    let performanceLevel = '';
    let performanceColor = '';
    if (percentage >= 90) {
      performanceLevel = 'Excellent \u2014 You\u2019re Well Prepared!';
      performanceColor = 'text-neon-green';
    } else if (percentage >= 80) {
      performanceLevel = 'Good - Review the questions you missed';
      performanceColor = 'text-cyan-400';
    } else if (percentage >= 60) {
      performanceLevel = 'Fair - Focus on weak sections in the study guide';
      performanceColor = 'text-amber-400';
    } else {
      performanceLevel = 'More study needed - Review the Essential Study Guide thoroughly';
      performanceColor = 'text-neon-red';
    }

    let icLevel = '';
    let icTitle = '';
    let icDescription = '';
    let icColor = '';
    if (percentage >= 85) {
      icLevel = 'IC4';
      icTitle = 'Staff Engineer';
      icDescription = 'Comprehensive mastery across DSA, design patterns, and system architecture. Ready for staff-level technical challenges.';
      icColor = 'text-neon-green';
    } else if (percentage >= 65) {
      icLevel = 'IC3';
      icTitle = 'Senior Engineer';
      icDescription = 'Strong technical foundation with solid understanding of patterns and system design. Minor gaps to address in weaker sections.';
      icColor = 'text-cyan-400';
    } else if (percentage >= 35) {
      icLevel = 'IC2';
      icTitle = 'Mid-Level Engineer';
      icDescription = 'Good grasp of fundamentals. Focus on design patterns and system design concepts to progress to senior level.';
      icColor = 'text-amber-400';
    } else {
      icLevel = 'IC1';
      icTitle = 'Junior Engineer';
      icDescription = 'Building foundational knowledge. Review core data structures, algorithms, and complexity analysis.';
      icColor = 'text-neon-red';
    }

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 mb-4 animate-glow-pulse">
              <Trophy className="w-10 h-10 text-amber-500" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-foreground font-heading mb-2">Assessment Complete!</h1>
            <p className="text-muted-foreground">Here's how you performed on the Technical Assessment</p>
          </div>

          {/* Main Score Card */}
          <div className="glass rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center animate-ring-glow">
                <svg className="w-40 h-40 transform -rotate-90" aria-hidden="true">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-white/5"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${percentage * 4.4} 440`}
                    style={{ '--score-dash': `${percentage * 4.4}` } as React.CSSProperties}
                    className={cn(
                      "animate-score-reveal",
                      percentage >= 80 ? "text-neon-green" :
                      percentage >= 60 ? "text-amber-500" : "text-neon-red"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground font-heading">{percentage}%</span>
                  <span className="text-sm text-muted-foreground">{totalCorrect}/{total}</span>
                </div>
              </div>
              <p className={cn("text-lg font-medium mt-4", performanceColor)}>
                {performanceLevel}
              </p>
            </div>

            {/* Section Breakdown by Phase */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 font-heading">
                <Target className="w-5 h-5 text-amber-500" aria-hidden="true" />
                Score Breakdown
              </h2>
              {phases.map(phase => {
                const phaseSections = sections.filter(s => s.phase === phase.id);
                const phaseCorrect = phaseSections.reduce((sum, s) => sum + sectionScores[s.id].correct, 0);
                const phaseTotal = phaseSections.reduce((sum, s) => sum + sectionScores[s.id].total, 0);
                const phasePercent = Math.round((phaseCorrect / phaseTotal) * 100);
                return (
                  <div key={phase.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">
                        Phase {phase.id}: {phase.name}
                      </span>
                      <span className={cn(
                        "font-semibold text-sm",
                        phasePercent >= 80 ? "text-neon-green" :
                        phasePercent >= 60 ? "text-amber-400" : "text-neon-red"
                      )}>
                        {phaseCorrect}/{phaseTotal} ({phasePercent}%)
                      </span>
                    </div>
                    {phaseSections.map(section => {
                      const score = sectionScores[section.id];
                      const sectionPercent = Math.round((score.correct / score.total) * 100);
                      return (
                        <div key={section.id} className="bg-white/[0.03] rounded-lg p-4 ml-4 border border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-muted-foreground">
                              Section {section.id}: {section.name}
                            </span>
                            <span className={cn(
                              "font-semibold",
                              sectionPercent >= 80 ? "text-neon-green" :
                              sectionPercent >= 60 ? "text-amber-400" : "text-neon-red"
                            )}>
                              {score.correct}/{score.total} ({sectionPercent}%)
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2.5">
                            <div
                              className={cn(
                                "h-2.5 rounded-full transition-[width] duration-500 motion-reduce:transition-none animate-progress-glow",
                                sectionPercent >= 80 ? "bg-gradient-to-r from-neon-green to-neon-green/70" :
                                sectionPercent >= 60 ? "bg-gradient-to-r from-amber-500 to-amber-500/70" : "bg-gradient-to-r from-neon-red to-neon-red/70"
                              )}
                              style={{ width: `${sectionPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Questions Review */}
          <div className="glass rounded-2xl p-8 mb-8">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4 font-heading">
              <BookOpen className="w-5 h-5 text-amber-500" aria-hidden="true" />
              Review Your Answers
            </h2>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, index) => {
                const answered = state.answers[q.id];
                const correct = answered === q.correctAnswer;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleGoToQuestion(index)}
                    className={cn(
                      "w-10 h-10 rounded-lg font-mono font-medium text-sm transition-transform motion-reduce:transition-none",
                      "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cockpit-dark",
                      answered
                        ? correct
                          ? "bg-neon-green/15 text-neon-green border border-neon-green/30 shadow-[0_0_8px_rgba(34,197,94,0.2)]"
                          : "bg-neon-red/15 text-neon-red border border-neon-red/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                        : "bg-white/5 text-muted-foreground border border-white/10 hover:border-amber-500/30"
                    )}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-neon-green/15 border border-neon-green/30" />
                Correct
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-neon-red/15 border border-neon-red/30" />
                Incorrect
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />
                Unanswered
              </span>
            </div>
          </div>

          {/* IC Level Assessment */}
          <div className="glass rounded-2xl p-8 mb-8">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6 font-heading">
              <Award className="w-5 h-5 text-amber-500" aria-hidden="true" />
              Assessed IC Level
            </h2>
            <div className="text-center">
              <div className={cn("text-6xl font-bold font-heading mb-2", icColor)}>
                {icLevel}
              </div>
              <div className={cn("text-xl font-semibold mb-4", icColor)}>
                {icTitle}
              </div>
              <p className="text-muted-foreground max-w-lg mx-auto mb-4">
                {icDescription}
              </p>
              <p className="text-sm text-muted-foreground/70">
                Based on {totalCorrect}/{total} correct ({percentage}%)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-cockpit-dark rounded-lg font-medium hover:bg-amber-400 transition-colors glow-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cockpit-dark"
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
              Restart Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-cockpit-surface focus:text-amber-500 focus:underline"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="glass border-b border-amber-500/20 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground font-heading">Technical Assessment</h1>
              <p className="text-sm text-amber-500/70">IC4 Software Engineer - Back End</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Time</div>
                <div className="font-semibold text-foreground font-mono">{getElapsedTime()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="font-semibold text-foreground">{answeredCount}/{questions.length}</div>
              </div>
              <div className="w-32 bg-white/5 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-[width] duration-300 motion-reduce:transition-none animate-progress-glow"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className={cn("max-w-5xl mx-auto px-4 py-8", showingResult && "pb-24")}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden">
              {/* Question Header */}
              <div className="bg-white/[0.03] border-b border-white/5 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                        Phase {sections.find(s => s.id === currentQuestion.section)?.phase}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Section {currentQuestion.section}: {getSectionName(currentQuestion.section)}
                      </span>
                    </span>
                  </div>
                  <span className="text-muted-foreground font-medium font-mono">
                    Question {state.currentIndex + 1} of {questions.length}
                  </span>
                </div>
              </div>

              {/* Question Content */}
              <div key={currentQuestion.id} className="p-6 animate-fade-slide-in">
                <h2 className="text-lg font-semibold text-foreground mb-4 font-body">
                  {currentQuestion.id}. {currentQuestion.question}
                </h2>

                {/* Code Block if present */}
                {currentQuestion.code && (
                  <div className="mb-6">
                    <pre className="bg-cockpit-surface text-slate-100 rounded-lg p-4 overflow-x-auto text-sm font-mono border border-amber-500/15 shadow-[0_0_8px_rgba(245,158,11,0.1)]">
                      <code
                        className="language-python"
                        dangerouslySetInnerHTML={{
                          __html: Prism.highlight(currentQuestion.code, Prism.languages.python, 'python'),
                        }}
                      />
                    </pre>
                  </div>
                )}

                {/* Answer Options - Column Layout */}
                <div className="space-y-3">
                  {(['A', 'B', 'C', 'D'] as const).map(option => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = currentQuestion.correctAnswer === option;

                    let optionStyle = "bg-white/[0.03] border-white/10 hover:border-amber-500/40 hover:bg-amber-500/[0.05]";

                    if (showingResult) {
                      if (isCorrectAnswer) {
                        optionStyle = "bg-neon-green/[0.08] border-neon-green/40 glow-green";
                      } else if (isSelected && !isCorrectAnswer) {
                        optionStyle = "bg-neon-red/[0.08] border-neon-red/40 glow-red";
                      } else {
                        optionStyle = "bg-white/[0.02] border-white/5 opacity-60";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-amber-500/10 border-amber-500/50 glow-amber";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={showingResult}
                        style={{ touchAction: 'manipulation' }}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left transition-all motion-reduce:transition-none",
                          "flex items-start gap-4",
                          optionStyle,
                          !showingResult && "cursor-pointer"
                        )}
                      >
                        <span className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                          showingResult && isCorrectAnswer ? "bg-neon-green text-cockpit-dark" :
                          showingResult && isSelected && !isCorrectAnswer ? "bg-neon-red text-cockpit-dark" :
                          isSelected ? "bg-amber-500 text-cockpit-dark" :
                          "bg-white/10 text-muted-foreground"
                        )}>
                          {showingResult && isCorrectAnswer ? (
                            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                          ) : showingResult && isSelected && !isCorrectAnswer ? (
                            <XCircle className="w-5 h-5" aria-hidden="true" />
                          ) : (
                            option
                          )}
                        </span>
                        <span className="flex-1 pt-1">
                          {currentQuestion.options[option]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Section */}
                {showingResult && (
                  <div
                    ref={feedbackRef}
                    style={{ scrollMarginTop: '6rem' }}
                    className={cn(
                    "mt-6 p-6 rounded-xl border-l-4",
                    isCorrect
                      ? "border-l-neon-green bg-neon-green/[0.05] border border-neon-green/10"
                      : "border-l-amber-500 bg-amber-500/[0.05] border border-amber-500/10"
                  )}>
                    <div>
                      <h3 className={cn(
                        "font-semibold mb-2 flex items-center gap-2",
                        isCorrect ? "text-neon-green" : "text-amber-500"
                      )}>
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                        ) : (
                          <Lightbulb className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                        )}
                        {isCorrect ? "Correct!" : "Not Quite"}
                      </h3>
                      <p className={cn(
                        "text-sm leading-relaxed",
                        isCorrect ? "text-neon-green/80" : "text-amber-500/80"
                      )}>
                        {currentQuestion.explanation}
                      </p>
                      {currentQuestion.studyTip && (
                        <div className="mt-4 pt-4 border-t border-dashed border-current/20">
                          <p className="text-sm font-medium mb-1">💡 Study Tip:</p>
                          <p className="text-sm opacity-90">{currentQuestion.studyTip}</p>
                        </div>
                      )}
                      {currentQuestion.bobExample && (
                        <div className="mt-4 pt-4 border-t border-dashed border-current/20">
                          <div className="bg-white/[0.03] rounded-lg p-4 border border-white/5">
                            <p className="text-sm font-medium mb-2">🍎 Real World Example:</p>
                            <p className="text-sm opacity-90 italic">{currentQuestion.bobExample}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="bg-white/[0.03] border-t border-white/5 px-6 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={state.currentIndex === 0}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cockpit-dark",
                      state.currentIndex === 0
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    Previous
                  </button>

                  {showingResult && (
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-cockpit-dark rounded-lg font-medium hover:bg-amber-400 transition-colors glow-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cockpit-dark"
                    >
                      {state.currentIndex === questions.length - 1 ? (
                        <>
                          View Results
                          <Trophy className="w-5 h-5" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          Next Question
                          <ChevronRight className="w-5 h-5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h2 className="font-semibold text-foreground mb-4 font-heading">Question Navigator</h2>

              {phases.map(phase => (
                <div key={phase.id} className="mb-4">
                  <div className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-2 border-b border-white/5 pb-1 font-mono">
                    Phase {phase.id}: {phase.name}
                  </div>
                  {sections.filter(s => s.phase === phase.id).map(section => {
                    const sectionQuestions = questions.filter(q => q.section === section.id);
                    return (
                      <div key={section.id} className="mb-3 ml-1">
                        <div className="text-xs font-medium text-muted-foreground tracking-wide mb-1.5">
                          {section.id}. {section.name}
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                          {sectionQuestions.map((q, idx) => {
                            const qIndex = questionIndexMap[q.id] ?? 0;
                            const isAnswered = state.answers[q.id] !== undefined;
                            const isCurrent = state.currentIndex === qIndex;
                            const isCorrectAnswer = state.answers[q.id] === q.correctAnswer;

                            return (
                              <button
                                key={q.id}
                                onClick={() => handleGoToQuestion(qIndex)}
                                className={cn(
                                  "w-7 h-7 rounded-sm text-xs font-mono font-medium transition-colors motion-reduce:transition-none",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 focus-visible:ring-offset-cockpit-dark",
                                  isCurrent && "ring-2 ring-amber-500 ring-offset-1 ring-offset-cockpit-dark",
                                  isAnswered
                                    ? state.showResult[q.id]
                                      ? isCorrectAnswer
                                        ? "bg-neon-green/15 text-neon-green shadow-[0_0_6px_rgba(34,197,94,0.2)]"
                                        : "bg-neon-red/15 text-neon-red shadow-[0_0_6px_rgba(239,68,68,0.2)]"
                                      : "bg-amber-500/20 text-amber-500"
                                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                )}
                              >
                                {q.id}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="border-t border-white/5 pt-4 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Answered:</span>
                  <span className="font-semibold text-foreground font-mono">{answeredCount}/{questions.length}</span>
                </div>
                <div className="mt-2 w-full bg-white/5 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-[width] duration-300 motion-reduce:transition-none animate-progress-glow"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {answeredCount === questions.length && (
                <button
                  onClick={() => setState(prev => ({ ...prev, completed: true, quizStatus: 'completed' }))}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-cockpit-dark rounded-lg font-medium hover:bg-amber-400 transition-colors glow-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cockpit-dark"
                >
                  <Trophy className="w-5 h-5" aria-hidden="true" />
                  View Final Results
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      {showingResult && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-amber-500/20 backdrop-blur-xl bg-cockpit-dark/80 animate-fade-slide-up">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-neon-green" aria-hidden="true" />
              ) : (
                <XCircle className="w-5 h-5 text-neon-red" aria-hidden="true" />
              )}
              <span className={cn("font-medium text-sm", isCorrect ? "text-neon-green" : "text-neon-red")}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
              <span className="text-muted-foreground text-sm hidden sm:inline">
                {state.currentIndex + 1} of {questions.length}
              </span>
            </div>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2 bg-amber-500 text-cockpit-dark rounded-lg font-medium hover:bg-amber-400 transition-colors glow-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cockpit-dark"
            >
              {state.currentIndex === questions.length - 1 ? (
                <>
                  View Results
                  <Trophy className="w-4 h-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  Next Question
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
