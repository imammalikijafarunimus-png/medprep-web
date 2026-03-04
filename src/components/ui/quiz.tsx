/**
 * Quiz Components
 * ===============
 * Standardized UI components for MedPrep quiz/exam functionality.
 * 
 * Includes:
 * - QuestionCard: Container for quiz questions
 * - AnswerOption: Selectable answer choices
 * - QuizTimer: Timer display for timed exams
 * - QuizProgress: Progress indicator
 * - ScoreBadge: Score display with semantic colors
 */

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  ChevronRight,
  BookOpen,
  Lightbulb
} from "lucide-react"

// ============================================================
// QUESTION CARD
// ============================================================

interface QuestionCardProps extends React.ComponentProps<"div"> {
  questionNumber: number
  totalQuestions: number
  question: string
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  children: React.ReactNode
}

function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  category,
  difficulty,
  children,
  className,
  ...props
}: QuestionCardProps) {
  const difficultyColors = {
    easy: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    hard: "bg-destructive/10 text-destructive border-destructive/20",
  }

  return (
    <div
      data-slot="question-card"
      className={cn(
        "bg-card border rounded-xl p-6 space-y-4",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Badge variant="outline" className="font-mono">
          Soal {questionNumber} dari {totalQuestions}
        </Badge>
        <div className="flex items-center gap-2">
          {category && (
            <Badge variant="secondary">{category}</Badge>
          )}
          {difficulty && (
            <Badge className={cn("border", difficultyColors[difficulty])}>
              {difficulty === 'easy' ? 'Mudah' : difficulty === 'medium' ? 'Sedang' : 'Sulit'}
            </Badge>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="text-base leading-relaxed py-2">
        {question}
      </div>

      {/* Answer Options */}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

// ============================================================
// ANSWER OPTION
// ============================================================

interface AnswerOptionProps extends React.ComponentProps<"button"> {
  label: string
  answer: string
  isSelected?: boolean
  isCorrect?: boolean
  isIncorrect?: boolean
  showResult?: boolean
  explanation?: string
  index: number
}

function AnswerOption({
  label,
  answer,
  isSelected,
  isCorrect,
  isIncorrect,
  showResult,
  explanation,
  index,
  className,
  disabled,
  ...props
}: AnswerOptionProps) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  
  return (
    <div className="space-y-1">
      <button
        data-slot="answer-option"
        data-selected={isSelected}
        data-correct={isCorrect}
        data-incorrect={isIncorrect}
        disabled={disabled || showResult}
        className={cn(
          "w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-all duration-200",
          "hover:border-brand/50 hover:bg-brand/5",
          "focus:outline-none focus:ring-2 focus:ring-brand/30",
          isSelected && !showResult && "border-brand bg-brand/10 ring-1 ring-brand",
          showResult && isCorrect && "border-success bg-success/10 ring-1 ring-success",
          showResult && isIncorrect && "border-destructive bg-destructive/10 ring-1 ring-destructive",
          showResult && !isSelected && !isCorrect && "opacity-50",
          className
        )}
        {...props}
      >
        {/* Letter Badge */}
        <span className={cn(
          "shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-sm font-medium",
          isSelected && !showResult && "bg-brand text-brand-foreground",
          showResult && isCorrect && "bg-success text-success-foreground",
          showResult && isIncorrect && "bg-destructive text-destructive-foreground",
          !isSelected && !showResult && "bg-muted text-muted-foreground"
        )}>
          {letters[index]}
        </span>
        
        {/* Answer Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed">{answer}</p>
        </div>
        
        {/* Result Icon */}
        {showResult && isCorrect && (
          <CheckCircle2 className="size-5 text-success shrink-0" />
        )}
        {showResult && isIncorrect && (
          <XCircle className="size-5 text-destructive shrink-0" />
        )}
      </button>
      
      {/* Explanation */}
      {showResult && isSelected && explanation && (
        <div className={cn(
          "ml-10 p-3 rounded-lg text-sm",
          isCorrect ? "bg-success/5 border border-success/20" : "bg-destructive/5 border border-destructive/20"
        )}>
          <div className="flex items-start gap-2">
            <Lightbulb className={cn(
              "size-4 shrink-0 mt-0.5",
              isCorrect ? "text-success" : "text-destructive"
            )} />
            <p className="text-muted-foreground">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// QUIZ TIMER
// ============================================================

interface QuizTimerProps extends React.ComponentProps<"div"> {
  timeRemaining: number // in seconds
  totalTime: number // in seconds
  isWarning?: boolean
  isDanger?: boolean
  isPaused?: boolean
}

function QuizTimer({
  timeRemaining,
  totalTime,
  isWarning,
  isDanger,
  isPaused,
  className,
  ...props
}: QuizTimerProps) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const progress = (timeRemaining / totalTime) * 100

  return (
    <div
      data-slot="quiz-timer"
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg border",
        isDanger && "bg-destructive/10 border-destructive/30",
        isWarning && !isDanger && "bg-warning/10 border-warning/30",
        !isWarning && !isDanger && "bg-card border",
        isPaused && "opacity-50",
        className
      )}
      {...props}
    >
      <Clock className={cn(
        "size-5",
        isDanger && "text-destructive animate-pulse",
        isWarning && !isDanger && "text-warning",
        !isWarning && !isDanger && "text-muted-foreground"
      )} />
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            "font-mono font-semibold",
            isDanger && "text-destructive",
            isWarning && !isDanger && "text-warning"
          )}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          {isPaused && (
            <Badge variant="outline" className="text-xs">Paused</Badge>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isDanger && "bg-destructive",
              isWarning && !isDanger && "bg-warning",
              !isWarning && !isDanger && "bg-brand"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// QUIZ PROGRESS
// ============================================================

interface QuizProgressProps extends React.ComponentProps<"div"> {
  current: number
  total: number
  answered: number
  correct?: number
  incorrect?: number
}

function QuizProgress({
  current,
  total,
  answered,
  correct = 0,
  incorrect = 0,
  className,
  ...props
}: QuizProgressProps) {
  const progress = (answered / total) * 100

  return (
    <div
      data-slot="quiz-progress"
      className={cn("space-y-2", className)}
      {...props}
    >
      {/* Stats Row */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {answered} dari {total} soal dijawab
        </span>
        <div className="flex items-center gap-3">
          {correct > 0 && (
            <span className="flex items-center gap-1 text-success">
              <CheckCircle2 className="size-4" />
              {correct}
            </span>
          )}
          {incorrect > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <XCircle className="size-4" />
              {incorrect}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden flex">
        {correct > 0 && (
          <div
            className="bg-success transition-all duration-300"
            style={{ width: `${(correct / total) * 100}%` }}
          />
        )}
        {incorrect > 0 && (
          <div
            className="bg-destructive transition-all duration-300"
            style={{ width: `${(incorrect / total) * 100}%` }}
          />
        )}
        {answered > correct + incorrect && (
          <div
            className="bg-brand transition-all duration-300"
            style={{ width: `${((answered - correct - incorrect) / total) * 100}%` }}
          />
        )}
      </div>
    </div>
  )
}

// ============================================================
// SCORE BADGE
// ============================================================

interface ScoreBadgeProps extends React.ComponentProps<"div"> {
  score: number
  total: number
  showLabel?: boolean
  size?: 'sm' | 'default' | 'lg'
}

function ScoreBadge({
  score,
  total,
  showLabel = true,
  size = 'default',
  className,
  ...props
}: ScoreBadgeProps) {
  const percentage = Math.round((score / total) * 100)
  
  const getScoreLevel = () => {
    if (percentage >= 90) return { label: "Excellent", color: "text-success bg-success/10 border-success/20" }
    if (percentage >= 75) return { label: "Good", color: "text-brand bg-brand/10 border-brand/20" }
    if (percentage >= 60) return { label: "Average", color: "text-warning bg-warning/10 border-warning/20" }
    return { label: "Needs Improvement", color: "text-destructive bg-destructive/10 border-destructive/20" }
  }

  const level = getScoreLevel()
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  }

  return (
    <div
      data-slot="score-badge"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border font-medium",
        level.color,
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="font-bold">{percentage}%</span>
      {showLabel && (
        <span className="opacity-75">• {level.label}</span>
      )}
    </div>
  )
}

// ============================================================
// NAVIGATION BUTTONS
// ============================================================

interface QuizNavigationProps extends React.ComponentProps<"div"> {
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  canGoPrevious?: boolean
  canGoNext?: boolean
  isLastQuestion?: boolean
  isLoading?: boolean
}

function QuizNavigation({
  onPrevious,
  onNext,
  onSubmit,
  canGoPrevious = true,
  canGoNext = true,
  isLastQuestion = false,
  isLoading = false,
  className,
  ...props
}: QuizNavigationProps) {
  return (
    <div
      data-slot="quiz-navigation"
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    >
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious || isLoading}
      >
        Sebelumnya
      </Button>

      {isLastQuestion ? (
        <Button
          variant="brand"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Selesai"}
        </Button>
      ) : (
        <Button
          variant="brand"
          onClick={onNext}
          disabled={!canGoNext || isLoading}
        >
          Selanjutnya
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  )
}

// ============================================================
// INSIGHT BOX (for Islamic values integration)
// ============================================================

interface InsightBoxProps extends React.ComponentProps<"div"> {
  title?: string
  children: React.ReactNode
}

function InsightBox({
  title = "Nilai Islami",
  children,
  className,
  ...props
}: InsightBoxProps) {
  return (
    <div
      data-slot="insight-box"
      className={cn(
        "p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <BookOpen className="size-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
            {title}
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {children}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// EXPORTS
// ============================================================

export {
  QuestionCard,
  AnswerOption,
  QuizTimer,
  QuizProgress,
  ScoreBadge,
  QuizNavigation,
  InsightBox,
}