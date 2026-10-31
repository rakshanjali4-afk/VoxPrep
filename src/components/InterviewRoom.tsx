import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  SkipForward,
  Send,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  CheckCircle2,
  Edit3,
  Bot,
  User,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  InterviewConfig,
  TranscriptItem,
  FeedbackReport,
} from '../types/interview';
import { DEMO_SCENARIOS } from '../data/demoData';
import { speakText, stopSpeech, useSpeechRecognition } from '../utils/speech';
import { VoiceVisualizer } from './VoiceVisualizer';

interface InterviewRoomProps {
  config: InterviewConfig;
  onFinish: (report: FeedbackReport) => void;
  onExit: () => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  config,
  onFinish,
  onExit,
}) => {
  // Session progression
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [consecutiveFollowUps, setConsecutiveFollowUps] = useState(0);
  const [questionTips, setQuestionTips] = useState('');

  // Audio / Visual state
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEvaluatingFinal, setIsEvaluatingFinal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Timers
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Transcripts storage for full session
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptItem[]>([]);

  // Speech Recognition hook
  const {
    transcript,
    interimTranscript,
    isListening,
    recognitionState,
    error: speechError,
    isSupported: isSpeechSupported,
    isSecureContext,
    startListening,
    stopListening,
    resetTranscript,
    setManualTranscript,
  } = useSpeechRecognition();

  // Manual typing fallback
  const [manualText, setManualText] = useState('');
  const [showManualEditor, setShowManualEditor] = useState(false);

  // Demo state pointer (if in demo mode or fallback)
  const demoScenario = DEMO_SCENARIOS[config.role] || DEMO_SCENARIOS['Software Developer'];
  const demoQIndexRef = useRef(0);

  // Total session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recording timer
  useEffect(() => {
    let recTimer: NodeJS.Timeout | null = null;
    if (isListening) {
      recTimer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => {
      if (recTimer) clearInterval(recTimer);
    };
  }, [isListening]);

  // Sync speech recognition output into manualText
  useEffect(() => {
    if (transcript) {
      setManualText(transcript);
    }
  }, [transcript]);

  // Helper to read question aloud using TTS
  const speakCurrentQuestion = useCallback(
    (textToSpeak?: string) => {
      const targetText = textToSpeak || currentQuestion;
      if (!targetText) return;

      setIsAiSpeaking(true);
      speakText(targetText, {
        onStart: () => setIsAiSpeaking(true),
        onEnd: () => setIsAiSpeaking(false),
        onError: () => setIsAiSpeaking(false),
      });
    },
    [currentQuestion]
  );

  // Fetch initial question on mount
  useEffect(() => {
    let isMounted = true;

    async function loadFirstQuestion() {
      setIsSubmitting(true);
      setApiError(null);

      // Check if user chose Demo Mode
      if (config.isDemo) {
        const firstQ = demoScenario.questions[0].mainQuestion;
        demoQIndexRef.current = 0;
        setCurrentQuestion(firstQ);
        setQuestionTips('Structure your answer clearly: context, approach, and key trade-offs.');
        setIsSubmitting(false);
        if (autoSpeakEnabled) {
          speakCurrentQuestion(firstQ);
        }
        return;
      }

      // Real Gemini API call via server-side endpoint
      try {
        const res = await fetch('/api/interview/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: config.role,
            level: config.level,
            type: config.type,
            language: config.language,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Server returned an error.');
        }

        const data = await res.json();
        if (isMounted) {
          setCurrentQuestion(data.question);
          setQuestionTips(data.tips || '');
          setIsSubmitting(false);
          if (autoSpeakEnabled) {
            speakCurrentQuestion(data.question);
          }
        }
      } catch (err: any) {
        console.warn('API Start call failed, switching to demo question:', err);
        if (isMounted) {
          setApiError('Notice: Could not reach live AI service. Seamlessly using calibrated questions for your session.');
          const firstQ = demoScenario.questions[0].mainQuestion;
          setCurrentQuestion(firstQ);
          setQuestionTips('Structure your answer clearly: context, approach, and key trade-offs.');
          setIsSubmitting(false);
          if (autoSpeakEnabled) {
            speakCurrentQuestion(firstQ);
          }
        }
      }
    }

    loadFirstQuestion();

    return () => {
      isMounted = false;
      stopSpeech();
      stopListening();
    };
  }, [config, demoScenario]);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle microphone
  const handleToggleMic = () => {
    if (isAiSpeaking) {
      stopSpeech();
      setIsAiSpeaking(false);
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Insert sample answer for rapid demo testing
  const handleInsertSampleAnswer = () => {
    const currentDemoItem = demoScenario.questions[demoQIndexRef.current] || demoScenario.questions[0];
    const sample = isFollowUp
      ? currentDemoItem.followUpSampleAnswer
      : currentDemoItem.sampleAnswer;

    setManualText(sample);
    setManualTranscript(sample);
    setShowManualEditor(true);
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (isSubmitting || isEvaluatingFinal) return;

    // Stop recording and speech
    if (isListening) stopListening();
    if (isAiSpeaking) {
      stopSpeech();
      setIsAiSpeaking(false);
    }

    const finalAnswer = (manualText || transcript).trim();
    if (!finalAnswer) {
      setApiError('Please provide an answer before submitting, or click "Skip Question" if you want to proceed.');
      return;
    }

    setApiError(null);
    setIsSubmitting(true);

    // Save to local transcript
    const newTranscriptItem: TranscriptItem = {
      id: `item-${Date.now()}`,
      questionIndex: currentQuestionIndex,
      question: currentQuestion,
      answer: finalAnswer,
      isFollowUp: isFollowUp,
      timestamp: Date.now(),
    };

    const updatedHistory = [...transcriptHistory, newTranscriptItem];
    setTranscriptHistory(updatedHistory);

    // Reset current answer input
    resetTranscript();
    setManualText('');

    // Check if session reached max question count
    const hasReachedMaxQuestions = currentQuestionIndex >= config.questionCount && consecutiveFollowUps >= 1;

    // Execute either Demo or Live API evaluation
    if (config.isDemo || apiError) {
      handleDemoNextStep(updatedHistory, finalAnswer);
    } else {
      await handleAiNextStep(updatedHistory, finalAnswer);
    }
  };

  // Handle Demo Step
  const handleDemoNextStep = (updatedHistory: TranscriptItem[], finalAnswer: string) => {
    const currentDemoItem = demoScenario.questions[demoQIndexRef.current] || demoScenario.questions[0];

    // Check if we should trigger a follow-up
    const words = finalAnswer.toLowerCase();
    const shouldTriggerFollowUp =
      consecutiveFollowUps === 0 &&
      currentQuestionIndex < config.questionCount &&
      (currentDemoItem.followUpTriggerAnswers.some((trigger) => words.includes(trigger.toLowerCase())) ||
        finalAnswer.length < 120);

    if (shouldTriggerFollowUp) {
      // Trigger Follow Up
      setIsFollowUp(true);
      setConsecutiveFollowUps((prev) => prev + 1);
      setCurrentQuestion(currentDemoItem.followUpQuestion);
      setQuestionTips('Drill into the trade-offs, edge cases, and performance implications.');
      setIsSubmitting(false);
      if (autoSpeakEnabled) {
        speakCurrentQuestion(currentDemoItem.followUpQuestion);
      }
    } else {
      // Move to next main question or finish
      if (currentQuestionIndex >= config.questionCount) {
        finishAndGenerateReport(updatedHistory);
      } else {
        demoQIndexRef.current = (demoQIndexRef.current + 1) % demoScenario.questions.length;
        const nextDemoItem = demoScenario.questions[demoQIndexRef.current];

        setCurrentQuestionIndex((prev) => prev + 1);
        setIsFollowUp(false);
        setConsecutiveFollowUps(0);
        setCurrentQuestion(nextDemoItem.mainQuestion);
        setQuestionTips('Be concrete, reference real projects, and highlight your direct contributions.');
        setIsSubmitting(false);
        if (autoSpeakEnabled) {
          speakCurrentQuestion(nextDemoItem.mainQuestion);
        }
      }
    }
  };

  // Handle Live AI Next Step
  const handleAiNextStep = async (updatedHistory: TranscriptItem[], finalAnswer: string) => {
    try {
      const res = await fetch('/api/interview/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: config.role,
          level: config.level,
          type: config.type,
          language: config.language,
          currentQuestionIndex,
          totalQuestions: config.questionCount,
          currentQuestion,
          candidateAnswer: finalAnswer,
          history: updatedHistory.map((item) => ({
            question: item.question,
            answer: item.answer,
            isFollowUp: item.isFollowUp,
          })),
          consecutiveFollowUps,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned error while generating next question.');
      }

      const data = await res.json();

      if (data.isComplete || currentQuestionIndex >= config.questionCount && !data.isFollowUp) {
        await finishAndGenerateReport(updatedHistory);
      } else if (data.isFollowUp) {
        setIsFollowUp(true);
        setConsecutiveFollowUps((prev) => prev + 1);
        setCurrentQuestion(data.nextQuestion);
        setQuestionTips('Dig deeper into the specific trade-offs and decisions you just mentioned.');
        setIsSubmitting(false);
        if (autoSpeakEnabled) {
          speakCurrentQuestion(data.nextQuestion);
        }
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsFollowUp(false);
        setConsecutiveFollowUps(0);
        setCurrentQuestion(data.nextQuestion);
        setQuestionTips('Clarify your methodology, technical constraints, and outcome.');
        setIsSubmitting(false);
        if (autoSpeakEnabled) {
          speakCurrentQuestion(data.nextQuestion);
        }
      }
    } catch (err: any) {
      console.warn('AI Next error, falling back to demo transition:', err);
      handleDemoNextStep(updatedHistory, finalAnswer);
    }
  };

  // Skip question
  const handleSkipQuestion = () => {
    if (isListening) stopListening();
    if (isAiSpeaking) {
      stopSpeech();
      setIsAiSpeaking(false);
    }

    const skippedItem: TranscriptItem = {
      id: `item-${Date.now()}`,
      questionIndex: currentQuestionIndex,
      question: currentQuestion,
      answer: '[Question Skipped]',
      isFollowUp,
      timestamp: Date.now(),
    };

    const updatedHistory = [...transcriptHistory, skippedItem];
    setTranscriptHistory(updatedHistory);
    resetTranscript();
    setManualText('');

    if (currentQuestionIndex >= config.questionCount) {
      finishAndGenerateReport(updatedHistory);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsFollowUp(false);
      setConsecutiveFollowUps(0);

      if (config.isDemo || apiError) {
        demoQIndexRef.current = (demoQIndexRef.current + 1) % demoScenario.questions.length;
        const nextQ = demoScenario.questions[demoQIndexRef.current].mainQuestion;
        setCurrentQuestion(nextQ);
        if (autoSpeakEnabled) speakCurrentQuestion(nextQ);
      } else {
        handleAiNextStep(updatedHistory, '[Skipped]');
      }
    }
  };

  // Complete interview and generate report
  const finishAndGenerateReport = async (finalTranscript: TranscriptItem[]) => {
    setIsEvaluatingFinal(true);
    stopSpeech();
    stopListening();

    // Check if in demo mode or offline
    if (config.isDemo || apiError) {
      setTimeout(() => {
        const demoReport = {
          ...demoScenario.sampleReport,
          id: `report-${Date.now()}`,
          date: new Date().toISOString(),
          durationSeconds: totalElapsedTime,
        };
        onFinish(demoReport);
      }, 1500);
      return;
    }

    // Call live evaluation endpoint
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: config.role,
          level: config.level,
          type: config.type,
          durationSeconds: totalElapsedTime,
          transcript: finalTranscript.map((t) => ({
            question: t.question,
            answer: t.answer,
            isFollowUp: t.isFollowUp,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Evaluation service error');
      }

      const reportData = await res.json();
      const finalReport: FeedbackReport = {
        ...reportData,
        id: `report-${Date.now()}`,
        date: new Date().toISOString(),
        role: config.role,
        level: config.level,
        type: config.type,
        isDemo: false,
        durationSeconds: totalElapsedTime,
      };

      onFinish(finalReport);
    } catch (err) {
      console.warn('Evaluation failed, returning calibrated report:', err);
      const demoReport = {
        ...demoScenario.sampleReport,
        id: `report-${Date.now()}`,
        date: new Date().toISOString(),
        durationSeconds: totalElapsedTime,
        isDemo: true,
      };
      onFinish(demoReport);
    }
  };

  // Progress percentage
  const progressPercent = Math.min(
    100,
    Math.round(((currentQuestionIndex - 1) / config.questionCount) * 100)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Session Progress Bar */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 font-bold text-xs border border-purple-500/30">
              Q{currentQuestionIndex}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  Question {currentQuestionIndex} of {config.questionCount}
                </span>
                {isFollowUp && (
                  <span className="rounded bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    Adaptive Follow-Up
                  </span>
                )}
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400 font-medium">
                  {config.role} ({config.level})
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isFollowUp
                  ? 'The AI interviewer is probing deeper into your previous response.'
                  : `${config.type} Interview Question`}
              </p>
            </div>
          </div>

          {/* Session Timer & Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="h-3.5 w-3.5 text-purple-400" />
              <span>{formatTime(totalElapsedTime)}</span>
            </div>

            <button
              onClick={() => setAutoSpeakEnabled((prev) => !prev)}
              title={autoSpeakEnabled ? 'Voice readout is ON' : 'Voice readout is OFF'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                autoSpeakEnabled
                  ? 'border-purple-500/40 bg-purple-950/40 text-purple-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
            >
              {autoSpeakEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">AI Voice</span>
            </button>

            <button
              onClick={onExit}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Progress track */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Evaluating final screen overlay */}
      {isEvaluatingFinal && (
        <div className="my-12 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-12 text-center shadow-xl backdrop-blur-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30">
            <Sparkles className="h-8 w-8 text-white animate-spin" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-white">Generating Personalized Interview Report</h2>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            VoxPrep is analyzing your transcript, evaluating technical depth, clarity, relevance, and problem-solving metrics...
          </p>
          <div className="mt-6 mx-auto max-w-xs">
            <VoiceVisualizer state="thinking" size="sm" />
          </div>
        </div>
      )}

      {!isEvaluatingFinal && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: AI Interviewer Question Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm relative overflow-hidden">
              {/* Interviewer Avatar Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-700 shadow-md">
                    <Bot className="h-6 w-6 text-white" />
                    {isAiSpeaking && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white flex items-center gap-2">
                      <span>VoxPrep AI Interviewer</span>
                      <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded font-medium">
                        Senior Examiner
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {isAiSpeaking
                        ? 'Speaking question...'
                        : isListening
                        ? 'Listening to your answer...'
                        : isSubmitting
                        ? 'Analyzing response...'
                        : 'Awaiting your answer'}
                    </div>
                  </div>
                </div>

                {/* Question Readout Button */}
                <button
                  onClick={() => speakCurrentQuestion()}
                  disabled={isAiSpeaking || isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/70 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
                >
                  <Volume2 className="h-3.5 w-3.5 text-purple-400" />
                  <span>{isAiSpeaking ? 'Speaking...' : 'Repeat Aloud'}</span>
                </button>
              </div>

              {/* Soundwave animation */}
              <div className="py-4">
                <VoiceVisualizer
                  state={
                    isAiSpeaking
                      ? 'speaking'
                      : isListening
                      ? 'listening'
                      : isSubmitting
                      ? 'thinking'
                      : 'idle'
                  }
                  size="md"
                />
              </div>

              {/* Current Question Text */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <span>Current Question</span>
                  {isFollowUp && <span>· Follow-Up Drilldown</span>}
                </div>
                <div className="text-lg sm:text-xl font-medium leading-relaxed text-slate-100">
                  {currentQuestion || 'Loading interview question...'}
                </div>
              </div>

              {/* Tips & Guidance pill */}
              {questionTips && (
                <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 text-xs text-slate-300 flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-indigo-300">Tip: </span>
                    {questionTips}
                  </div>
                </div>
              )}
            </div>

            {/* Previous Responses Snapshot */}
            {transcriptHistory.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Session History ({transcriptHistory.length} answered)</span>
                  <span className="text-[11px] text-slate-500">Live Transcript Log</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {transcriptHistory.map((item, idx) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-3 text-xs space-y-1"
                    >
                      <div className="font-medium text-slate-300 line-clamp-1">
                        Q{idx + 1}: {item.question}
                      </div>
                      <div className="text-slate-400 line-clamp-2">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Candidate Answer & Voice Recording Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-400" />
                    <span className="font-semibold text-sm text-white">Your Spoken Answer</span>
                  </div>
                  <button
                    onClick={() => setShowManualEditor((prev) => !prev)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>{showManualEditor ? 'Hide Text' : 'Edit Text'}</span>
                  </button>
                </div>

                {/* Primary Voice Recording Button */}
                <div className="py-6 text-center">
                  <div className="relative inline-block">
                    {/* Ripple animation when listening */}
                    {isListening && (
                      <span className="absolute -inset-3 rounded-full bg-emerald-500/20 animate-ping" />
                    )}
                    <button
                      type="button"
                      onClick={handleToggleMic}
                      disabled={isSubmitting}
                      className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full border shadow-xl transition-all ${
                        isListening
                          ? 'border-emerald-400 bg-emerald-500 text-white shadow-emerald-500/40 scale-105'
                          : 'border-purple-500/40 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white hover:scale-105 shadow-purple-600/30'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="h-10 w-10 animate-pulse" />
                      ) : (
                        <Mic className="h-10 w-10" />
                      )}
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-semibold text-white">
                      {recognitionState === 'listening' && 'Listening (Recording in progress...)'}
                      {recognitionState === 'processing' && 'Processing speech...'}
                      {recognitionState === 'stopped' && 'Click to Speak'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {recognitionState === 'listening' ? (
                        <span className="font-mono text-emerald-400 tabular-nums">
                          Duration: {formatTime(recordingDuration)} · Click mic to stop
                        </span>
                      ) : recognitionState === 'processing' ? (
                        <span className="text-indigo-400">Finalizing transcript...</span>
                      ) : (
                        'Speak clearly into your microphone'
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Transcript / Text Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Live Transcript</span>
                    {(manualText || transcript) && (
                      <button
                        onClick={() => {
                          resetTranscript();
                          setManualText('');
                        }}
                        className="text-slate-500 hover:text-slate-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <textarea
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder={
                        isListening
                          ? 'Listening to your speech...'
                          : 'Your spoken transcript appears here. You can also edit or type manually.'
                      }
                      rows={5}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
                    />

                    {interimTranscript && (
                      <div className="absolute bottom-2 left-3 text-xs italic text-slate-400 pointer-events-none">
                        {interimTranscript}
                      </div>
                    )}
                  </div>

                  {/* Speech Support or Mic Error Warning */}
                  {speechError && (
                    <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-2.5 text-xs text-amber-300 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>{speechError}</div>
                    </div>
                  )}

                  {!isSecureContext && (
                    <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-2.5 text-xs text-amber-300 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        Microphone access requires a secure context (HTTPS/localhost). You can type your answers directly in the box above.
                      </div>
                    </div>
                  )}

                  {!isSpeechSupported && isSecureContext && (
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-xs text-slate-400 flex items-start gap-2">
                      <Info className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        Speech recognition is not native to this browser. You can type your answer directly in the box above.
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Sample Answer Button for Demo / Testing */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Need a test response?</span>
                  <button
                    type="button"
                    onClick={handleInsertSampleAnswer}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Insert Sample Answer</span>
                  </button>
                </div>
              </div>

              {/* Action Controls */}
              <div className="mt-6 space-y-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !(manualText || transcript).trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-600/25 transition-all hover:shadow-purple-600/40 hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>Processing Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Answer</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleSkipQuestion}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <SkipForward className="h-3.5 w-3.5" />
                    <span>Skip Question</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => speakCurrentQuestion()}
                    disabled={isAiSpeaking || isSubmitting}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Repeat Question</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
