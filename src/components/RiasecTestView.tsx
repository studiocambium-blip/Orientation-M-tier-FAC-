import React, { useState, useEffect, useRef } from 'react';
import { Question, RiasecDimension, RiasecScores } from '../types/riasec';
import { RIASEC_QUESTIONS, RIASEC_DIMENSIONS, RESPONSE_OPTIONS } from '../data/riasecData';
import { calculateScoresFromAnswers } from '../utils/riasecMatching';
import { useLanguage } from '../context/LanguageContext';
import { 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Target, 
  Zap,
  Info
} from 'lucide-react';

interface RiasecTestViewProps {
  onCompleteTest: (scores: RiasecScores) => void;
  initialAnswers?: Record<number, number>;
}

export const RiasecTestView: React.FC<RiasecTestViewProps> = ({
  onCompleteTest,
  initialAnswers = {}
}) => {
  const { language, t } = useLanguage();
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showDimensionGuide, setShowDimensionGuide] = useState<boolean>(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState<boolean>(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalQuestions = RIASEC_QUESTIONS.length;
  const currentQuestion = RIASEC_QUESTIONS[currentIndex];
  const currentDimInfo = RIASEC_DIMENSIONS[currentQuestion.dimension];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const isCurrentAnswered = answers[currentQuestion.id] !== undefined;

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const val = parseInt(e.key, 10);
        handleSelectAnswer(currentQuestion.id, val);
      } else if (e.key === 'ArrowRight' && currentIndex < totalQuestions - 1) {
        // Can only advance forward if the current question is answered
        if (answers[currentQuestion.id] !== undefined) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQuestion, answers]);

  // Reset auto-advancing flag on question switch and clear pending timer
  useEffect(() => {
    setIsAutoAdvancing(false);
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [currentIndex]);

  const handleSelectAnswer = (questionId: number, value: number) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    if (currentIndex < totalQuestions - 1) {
      setIsAutoAdvancing(true);
      autoAdvanceTimerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 180);
    }
  };

  const handleFinish = () => {
    // If any question is unanswered, navigate to it first
    const unansweredQuestion = RIASEC_QUESTIONS.find((q) => answers[q.id] === undefined);
    if (unansweredQuestion) {
      const idx = RIASEC_QUESTIONS.findIndex((q) => q.id === unansweredQuestion.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
        return;
      }
    }
    const computedScores = calculateScoresFromAnswers(answers);
    onCompleteTest(computedScores);
  };

  // Demo presets for fast testing
  const loadPresetProfile = (presetType: 'infantry' | 'cyber' | 'pilot' | 'medic' | 'logistics') => {
    const presetMap: Record<string, Record<RiasecDimension, number>> = {
      infantry: { R: 5, I: 2, A: 1, S: 4, E: 5, C: 3 },
      pilot: { R: 5, I: 5, A: 2, S: 3, E: 5, C: 4 },
      cyber: { R: 3, I: 5, A: 2, S: 2, E: 3, C: 5 },
      medic: { R: 4, I: 5, A: 1, S: 5, E: 3, C: 4 },
      logistics: { R: 3, I: 3, A: 1, S: 4, E: 5, C: 5 }
    };

    const targetPattern = presetMap[presetType];
    const generatedAnswers: Record<number, number> = {};

    RIASEC_QUESTIONS.forEach((q) => {
      generatedAnswers[q.id] = targetPattern[q.dimension];
    });

    setAnswers(generatedAnswers);
    const computedScores = calculateScoresFromAnswers(generatedAnswers);
    onCompleteTest(computedScores);
  };

  const promptText = language === 'en' && currentQuestion.promptEn ? currentQuestion.promptEn : currentQuestion.prompt;
  const contextText = language === 'en' && currentQuestion.operationalContextEn ? currentQuestion.operationalContextEn : currentQuestion.operationalContext;
  const dimName = language === 'en' ? currentDimInfo.nameEn : currentDimInfo.nameFr;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Introduction Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#c41230] uppercase tracking-wider mb-1 font-semibold">
              <span>{t('testEvaluationHeader')}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'en' ? 'Canadian Armed Forces' : 'Forces armées canadiennes'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {t('testTitle')}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {t('testDescription')}
            </p>
          </div>

          <button
            onClick={() => setShowDimensionGuide(!showDimensionGuide)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors shrink-0"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>{showDimensionGuide ? t('hideHelp') : t('understandDimensions')}</span>
          </button>
        </div>

        {/* Dimension Guide Drawer */}
        {showDimensionGuide && (
          <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(RIASEC_DIMENSIONS).map((dim) => {
              const dName = language === 'en' ? dim.nameEn : dim.nameFr;
              const dTagline = language === 'en' && dim.taglineEn ? dim.taglineEn : dim.tagline;
              return (
                <div
                  key={dim.code}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: dim.color }}
                      />
                      {dName}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{dim.letter}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {dTagline}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Progress & Demo Presets Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-600 mb-1.5">
            <span>{t('progress')} : {answeredCount} / {totalQuestions} {t('questions')}</span>
            <span className="font-bold text-[#c41230]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#f1b331] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Demo profiles dropdown */}
        <div className="flex flex-wrap items-center gap-1.5 justify-end w-full sm:w-auto">
          <span className="text-[11px] text-slate-500 mr-1 flex items-center gap-1 font-semibold">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="hidden md:inline">{t('typicalProfiles')}</span>
          </span>
          <button
            onClick={() => loadPresetProfile('infantry')}
            className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 transition-colors shadow-2xs"
            title={t('infantryTitle')}
          >
            {t('infantryPreset')}
          </button>
          <button
            onClick={() => loadPresetProfile('pilot')}
            className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 transition-colors shadow-2xs"
            title={t('pilotTitle')}
          >
            {t('pilotPreset')}
          </button>
          <button
            onClick={() => loadPresetProfile('cyber')}
            className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 transition-colors shadow-2xs"
            title={t('cyberTitle')}
          >
            {t('cyberPreset')}
          </button>
          <button
            onClick={() => loadPresetProfile('medic')}
            className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 transition-colors shadow-2xs"
            title={t('healthTitle')}
          >
            {t('healthPreset')}
          </button>
        </div>
      </div>

      {/* 6 RIASEC Dimension Navigation Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {(['R', 'I', 'A', 'S', 'E', 'C'] as RiasecDimension[]).map((dimKey) => {
          const dim = RIASEC_DIMENSIONS[dimKey];
          const dimQuestions = RIASEC_QUESTIONS.filter((q) => q.dimension === dimKey);
          const dimAnswered = dimQuestions.filter((q) => answers[q.id] !== undefined).length;
          const isCurrentDim = currentQuestion.dimension === dimKey;
          const isDimComplete = dimAnswered === dimQuestions.length;
          const dimensionLabel = language === 'en' ? dim.nameEn.split(' ')[0] : dim.nameFr.split(' ')[0];

          return (
            <button
              key={dimKey}
              onClick={() => {
                const firstUnanswered = dimQuestions.find((q) => answers[q.id] === undefined);
                const targetQ = firstUnanswered || dimQuestions[0];
                const targetIdx = RIASEC_QUESTIONS.findIndex((q) => q.id === targetQ.id);
                if (targetIdx !== -1) setCurrentIndex(targetIdx);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isCurrentDim
                  ? 'bg-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1.5" style={{ color: dim.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dim.color }} />
                  {dimKey}
                </span>
                <span className={`text-[10px] font-mono font-bold ${isDimComplete ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {dimAnswered}/{dimQuestions.length}
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-800 truncate mt-1">
                {dimensionLabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Question Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-[#f1b331] font-mono font-bold text-xs text-slate-950 flex items-center justify-center shadow-2xs">
              {currentIndex + 1}
            </span>
            <div className="text-xs font-mono text-slate-600">
              {t('evaluatedDimension')}{' '}
              <strong style={{ color: currentDimInfo.color }}>
                {dimName} ({currentDimInfo.letter})
              </strong>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            {t('shortcuts')}
          </div>
        </div>

        {/* Prompt */}
        <div className="space-y-3 py-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display leading-snug">
            « {promptText} »
          </h2>

          <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">{t('operationalContextTitle')} </strong>
              {contextText}
            </span>
          </div>
        </div>

        {/* 5 Response Options */}
        <div className="space-y-3 pt-2">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-500 font-semibold">
            {t('interestDegreeTitle')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {RESPONSE_OPTIONS.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.value;
              const label = language === 'en' ? opt.labelEn : opt.label;
              const short = language === 'en' ? opt.shortEn : opt.short;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelectAnswer(currentQuestion.id, opt.value)}
                  className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-[#f1b331] border-[#dfa222] text-slate-950 shadow-sm ring-2 ring-[#f1b331]/40 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="font-mono text-xs opacity-75">
                    [{opt.value}]
                  </span>
                  <span className="text-xs font-semibold leading-tight">
                    {label}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('previous')}</span>
          </button>

          {/* Question Index & Dimension Dots */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-black bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              {t('questionNumber')} {currentIndex + 1} / {totalQuestions}
            </span>
            <div className="hidden sm:flex items-center gap-1">
              {RIASEC_QUESTIONS.filter((q) => q.dimension === currentQuestion.dimension).map((q) => {
                const qIdx = RIASEC_QUESTIONS.findIndex((item) => item.id === q.id);
                const isAns = answers[q.id] !== undefined;
                const isCurr = qIdx === currentIndex;
                const canNavigate = isAns || qIdx <= currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      if (canNavigate) {
                        setCurrentIndex(qIdx);
                      }
                    }}
                    disabled={!canNavigate}
                    className={`h-2 rounded-full transition-all ${
                      isCurr
                        ? 'w-5 bg-[#f1b331]'
                        : isAns
                        ? 'w-2 bg-emerald-600'
                        : canNavigate
                        ? 'w-2 bg-slate-300 hover:bg-slate-400'
                        : 'w-2 bg-slate-200 cursor-not-allowed opacity-50'
                    }`}
                    title={`${t('questionNumber')} ${qIdx + 1} (${q.dimension})`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 min-h-[40px]">
            {currentIndex < totalQuestions - 1 ? (
              !isAutoAdvancing && isCurrentAnswered ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                >
                  <span>{t('next')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs font-medium text-slate-400 italic px-2 py-1 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                  {t('selectAnswerToAdvance')}
                </span>
              )
            ) : isCurrentAnswered ? (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#f1b331] hover:bg-[#dfa222] text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md hover:scale-105"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t('finishAndSeeMatches')}</span>
              </button>
            ) : (
              <span className="text-xs font-medium text-slate-400 italic px-2 py-1 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                {t('answerToFinish')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
