import { useState, useEffect, useMemo } from 'react';
import { questions, sections, phases, getSectionName, type Question } from '../data/questions';
import { cn } from '../lib/utils';
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  Trophy,
  Target,
  Lightbulb
} from 'lucide-react';

interface QuizState {
  currentIndex: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  showResult: Record<number, boolean>;
  completed: boolean;
  startTime: number;
}

export default function Quiz() {
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    answers: {},
    showResult: {},
    completed: false,
    startTime: 0,
  });

  useEffect(() => {
    setState(prev => ({ ...prev, startTime: Date.now() }));
  }, []);

  const currentQuestion = questions[state.currentIndex];
  const selectedAnswer = state.answers[currentQuestion.id];
  const showingResult = state.showResult[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleSelectAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (showingResult) return;

    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion.id]: answer },
      showResult: { ...prev.showResult, [currentQuestion.id]: true },
    }));
  };

  const handleNext = () => {
    if (state.currentIndex < questions.length - 1) {
      setState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      setState(prev => ({ ...prev, completed: true }));
    }
  };

  const handlePrevious = () => {
    if (state.currentIndex > 0) {
      setState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  };

  const handleRestart = () => {
    setState({
      currentIndex: 0,
      answers: {},
      showResult: {},
      completed: false,
      startTime: Date.now(), // safe: only called from client interaction
    });
  };

  const handleGoToQuestion = (index: number) => {
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
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Progress indicator
  const answeredCount = Object.keys(state.answers).length;
  const progress = (answeredCount / questions.length) * 100;

  if (state.completed) {
    const { sectionScores, totalCorrect, total } = scores;
    const percentage = Math.round((totalCorrect / total) * 100);

    let performanceLevel = '';
    let performanceColor = '';
    if (percentage >= 90) {
      performanceLevel = 'Excellent \u2014 You\u2019re Well Prepared!';
      performanceColor = 'text-green-600';
    } else if (percentage >= 80) {
      performanceLevel = 'Good - Review the questions you missed';
      performanceColor = 'text-blue-600';
    } else if (percentage >= 60) {
      performanceLevel = 'Fair - Focus on weak sections in the study guide';
      performanceColor = 'text-yellow-600';
    } else {
      performanceLevel = 'More study needed - Review the Essential Study Guide thoroughly';
      performanceColor = 'text-red-600';
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Trophy className="w-10 h-10 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Assessment Complete!</h1>
            <p className="text-slate-600">Here's how you performed on the Technical Assessment</p>
          </div>

          {/* Main Score Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90" aria-hidden="true">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-slate-100"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${percentage * 4.4} 440`}
                    className={cn(
                      "transition-[stroke-dasharray] duration-1000 motion-reduce:transition-none",
                      percentage >= 80 ? "text-green-500" :
                      percentage >= 60 ? "text-yellow-500" : "text-red-500"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-slate-900">{percentage}%</span>
                  <span className="text-sm text-slate-500">{totalCorrect}/{total}</span>
                </div>
              </div>
              <p className={cn("text-lg font-medium mt-4", performanceColor)}>
                {performanceLevel}
              </p>
            </div>

            {/* Section Breakdown by Phase */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5" aria-hidden="true" />
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
                      <span className="font-semibold text-slate-800">
                        Phase {phase.id}: {phase.name}
                      </span>
                      <span className={cn(
                        "font-semibold text-sm",
                        phasePercent >= 80 ? "text-green-600" :
                        phasePercent >= 60 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {phaseCorrect}/{phaseTotal} ({phasePercent}%)
                      </span>
                    </div>
                    {phaseSections.map(section => {
                      const score = sectionScores[section.id];
                      const sectionPercent = Math.round((score.correct / score.total) * 100);
                      return (
                        <div key={section.id} className="bg-slate-50 rounded-lg p-4 ml-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-slate-700">
                              Section {section.id}: {section.name}
                            </span>
                            <span className={cn(
                              "font-semibold",
                              sectionPercent >= 80 ? "text-green-600" :
                              sectionPercent >= 60 ? "text-yellow-600" : "text-red-600"
                            )}>
                              {score.correct}/{score.total} ({sectionPercent}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                              className={cn(
                                "h-2.5 rounded-full transition-[width] duration-500 motion-reduce:transition-none",
                                sectionPercent >= 80 ? "bg-green-500" :
                                sectionPercent >= 60 ? "bg-yellow-500" : "bg-red-500"
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
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
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
                      "w-10 h-10 rounded-lg font-medium text-sm transition-transform motion-reduce:transition-none",
                      "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                      answered
                        ? correct
                          ? "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500"
                          : "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 focus:ring-slate-500"
                    )}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
                Correct
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
                Incorrect
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-slate-100 border border-slate-300" />
                Unanswered
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-primary focus:underline"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Technical Assessment</h1>
              <p className="text-sm text-slate-500">IC4 Software Engineer - Back End</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-500">Progress</div>
                <div className="font-semibold text-slate-900">{answeredCount}/{questions.length}</div>
              </div>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Question Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                        Phase {sections.find(s => s.id === currentQuestion.section)?.phase}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Section {currentQuestion.section}: {getSectionName(currentQuestion.section)}
                      </span>
                    </span>
                  </div>
                  <span className="text-slate-500 font-medium">
                    Question {state.currentIndex + 1} of {questions.length}
                  </span>
                </div>
              </div>

              {/* Question Content */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  {currentQuestion.id}. {currentQuestion.question}
                </h2>

                {/* Code Block if present */}
                {currentQuestion.code && (
                  <div className="mb-6">
                    <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                      <code>{currentQuestion.code}</code>
                    </pre>
                  </div>
                )}

                {/* Answer Options - Column Layout */}
                <div className="space-y-3">
                  {(['A', 'B', 'C', 'D'] as const).map(option => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = currentQuestion.correctAnswer === option;

                    let optionStyle = "bg-white border-slate-200 hover:border-primary hover:bg-primary/5";

                    if (showingResult) {
                      if (isCorrectAnswer) {
                        optionStyle = "bg-green-50 border-green-500 text-green-900";
                      } else if (isSelected && !isCorrectAnswer) {
                        optionStyle = "bg-red-50 border-red-500 text-red-900";
                      } else {
                        optionStyle = "bg-slate-50 border-slate-200 opacity-60";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-primary/10 border-primary";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={showingResult}
                        style={{ touchAction: 'manipulation' }}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left transition-colors motion-reduce:transition-none",
                          "flex items-start gap-4",
                          optionStyle,
                          !showingResult && "cursor-pointer"
                        )}
                      >
                        <span className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                          showingResult && isCorrectAnswer ? "bg-green-500 text-white" :
                          showingResult && isSelected && !isCorrectAnswer ? "bg-red-500 text-white" :
                          isSelected ? "bg-primary text-white" :
                          "bg-slate-100 text-slate-600"
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
                  <div className={cn(
                    "mt-6 p-6 rounded-xl border-2",
                    isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-amber-50 border-amber-200"
                  )}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      ) : (
                        <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                      <div>
                        <h3 className={cn(
                          "font-semibold mb-2",
                          isCorrect ? "text-green-800" : "text-amber-800"
                        )}>
                          {isCorrect ? "Correct!" : "Not Quite"}
                        </h3>
                        <p className={cn(
                          "text-sm leading-relaxed",
                          isCorrect ? "text-green-700" : "text-amber-700"
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
                            <div className="bg-white/60 rounded-lg p-4 border border-current/10">
                              <p className="text-sm font-medium mb-2">🍎 Real World Example:</p>
                              <p className="text-sm opacity-90 italic">{currentQuestion.bobExample}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={state.currentIndex === 0}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      state.currentIndex === 0
                        ? "text-slate-400 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    Previous
                  </button>

                  {showingResult && (
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-4">Question Navigator</h2>

              {phases.map(phase => (
                <div key={phase.id} className="mb-4">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2 border-b border-slate-100 pb-1">
                    Phase {phase.id}: {phase.name}
                  </div>
                  {sections.filter(s => s.phase === phase.id).map(section => {
                    const sectionQuestions = questions.filter(q => q.section === section.id);
                    return (
                      <div key={section.id} className="mb-3 ml-1">
                        <div className="text-xs font-medium text-slate-500 tracking-wide mb-1.5">
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
                                  "w-8 h-8 rounded text-xs font-medium transition-colors motion-reduce:transition-none",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                                  isCurrent && "ring-2 ring-primary ring-offset-1",
                                  isAnswered
                                    ? state.showResult[q.id]
                                      ? isCorrectAnswer
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                      : "bg-primary/20 text-primary"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
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

              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Answered:</span>
                  <span className="font-semibold text-slate-900">{answeredCount}/{questions.length}</span>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-[width] duration-300 motion-reduce:transition-none"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {answeredCount === questions.length && (
                <button
                  onClick={() => setState(prev => ({ ...prev, completed: true }))}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Trophy className="w-5 h-5" aria-hidden="true" />
                  View Final Results
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
