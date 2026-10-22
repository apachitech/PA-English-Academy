/**
 * Database types for supabase-js.
 *
 * Hand-maintained to mirror supabase/migrations. Once your project is linked,
 * you can regenerate them with:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Rel<FK extends string, Cols extends string, Ref extends string, One extends boolean = false> = {
  foreignKeyName: FK;
  columns: [Cols];
  isOneToOne: One;
  referencedRelation: Ref;
  referencedColumns: ["id"];
};

type Tbl<Row, Req extends keyof Row, Rels extends unknown[] = []> = {
  Row: Row;
  Insert: Pick<Row, Req> & Partial<Omit<Row, Req>>;
  Update: Partial<Row>;
  Relationships: Rels;
};

export type UserRole = "learner" | "teacher" | "admin";
export type ContentStatus = "draft" | "published" | "archived";
export type CefrLevel = "A1" | "A2" | "B1" | "B2";
export type Skill = "vocabulary" | "grammar" | "reading" | "listening" | "speaking";
export type ExerciseType =
  | "multiple_choice"
  | "fill_blank"
  | "matching"
  | "word_order"
  | "listen_choose"
  | "speaking";
export type ProgressStatus = "in_progress" | "completed";
export type ExamKind = "unit" | "level";
export type VideoProvider = "youtube" | "mp4" | "hls" | "bunny" | "cloudflare" | "cloudinary" | "vimeo";
export type AttemptStatus = "in_progress" | "completed" | "abandoned";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded" | "cancelled";
export type PaymentMethod = "mpesa" | "airtel_money" | "orange_money" | "card" | "mock";
export type SubscriptionStatus = "active" | "past_due" | "cancelled" | "expired";

export type ProfileRow = {
  id: string;
  full_name: string;
  role: UserRole;
  city: string | null;
  locale: string;
  current_level: CefrLevel | null;
  onboarding_done: boolean;
  daily_goal_minutes: number;
  data_saver: boolean;
  leaderboard_opt_in: boolean;
  total_xp: number;
  created_at: string;
  updated_at: string;
};

export type LevelRow = {
  id: string;
  code: CefrLevel;
  title_fr: string;
  description_fr: string;
  position: number;
  is_free: boolean;
  price_usd_cents: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type UnitRow = {
  id: string;
  level_id: string;
  title_fr: string;
  description_fr: string;
  icon: string;
  position: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type LessonRow = {
  id: string;
  unit_id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  objective_fr: string;
  explanation_fr: string;
  position: number;
  xp_reward: number;
  est_minutes: number;
  pass_mark: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type CaptionTrack = { lang: string; label: string; url: string };

export type LessonVideoRow = {
  id: string;
  lesson_id: string;
  provider: VideoProvider;
  url: string;
  low_url: string | null;
  audio_url: string | null;
  poster_url: string | null;
  duration_s: number;
  captions: Json;
  transcript_fr: string | null;
  position: number;
  created_at: string;
};

export type VocabularyRow = {
  id: string;
  lesson_id: string;
  term_en: string;
  term_fr: string;
  example_en: string | null;
  example_fr: string | null;
  audio_url: string | null;
  position: number;
};

export type ExamRow = {
  id: string;
  kind: ExamKind;
  level_id: string;
  unit_id: string | null;
  title_fr: string;
  pass_mark: number;
  time_limit_min: number | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type ExerciseRow = {
  id: string;
  lesson_id: string | null;
  exam_id: string | null;
  type: ExerciseType;
  skill: Skill;
  prompt_fr: string;
  prompt_en: string | null;
  payload: Json;
  audio_url: string | null;
  explanation_fr: string | null;
  position: number;
  created_at: string;
  updated_at: string;
};

export type ExerciseOptionRow = {
  id: string;
  exercise_id: string;
  label: string;
  is_correct: boolean;
  pair_key: string | null;
  side: "left" | "right" | null;
  position: number;
};

export type PlacementQuestionRow = {
  id: string;
  level: CefrLevel;
  skill: Skill;
  type: ExerciseType;
  prompt_fr: string;
  stem: string;
  passage: string | null;
  audio_text: string | null;
  audio_url: string | null;
  options: Json;
  correct_index: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type PlacementAttemptRow = {
  id: string;
  user_id: string;
  status: AttemptStatus;
  answers: Json;
  current_question_id: string | null;
  result_level: CefrLevel | null;
  skill_scores: Json | null;
  started_at: string;
  completed_at: string | null;
};

export type UserProgressRow = {
  user_id: string;
  lesson_id: string;
  status: ProgressStatus;
  best_score: number;
  attempts: number;
  completed_at: string | null;
  updated_at: string;
};

export type LessonAttemptRow = {
  id: string;
  user_id: string;
  lesson_id: string;
  score: number;
  passed: boolean;
  answers: Json;
  skill_scores: Json | null;
  duration_s: number;
  created_at: string;
};

export type ExamAttemptRow = {
  id: string;
  user_id: string;
  exam_id: string;
  score: number;
  passed: boolean;
  answers: Json;
  duration_s: number;
  created_at: string;
};

export type CertificateRow = {
  id: string;
  code: string;
  user_id: string;
  level_id: string;
  exam_attempt_id: string | null;
  learner_name: string;
  level_code: CefrLevel;
  score: number;
  issued_at: string;
  revoked_at: string | null;
};

export type StreakRow = {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  freezes: number;
  updated_at: string;
};

export type XpEventRow = {
  id: number;
  user_id: string;
  amount: number;
  source: string;
  ref_id: string | null;
  created_at: string;
};

export type DailyActivityRow = {
  user_id: string;
  day: string;
  seconds: number;
  xp: number;
  lessons: number;
};

export type BadgeRow = {
  id: string;
  code: string;
  title_fr: string;
  description_fr: string;
  icon: string;
  criteria: Json;
  position: number;
};

export type UserBadgeRow = { user_id: string; badge_id: string; earned_at: string };

export type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: string;
  status: SubscriptionStatus;
  provider: string;
  provider_ref: string | null;
  current_period_end: string;
  created_at: string;
  updated_at: string;
};

export type EntitlementRow = {
  id: string;
  user_id: string;
  level_id: string | null;
  source: string;
  source_ref: string | null;
  valid_until: string | null;
  created_at: string;
};

export type PaymentRow = {
  id: string;
  user_id: string;
  provider: string;
  method: PaymentMethod;
  product: string;
  amount_cents: number;
  currency: string;
  status: PaymentStatus;
  provider_ref: string | null;
  phone: string | null;
  raw: Json | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: Tbl<ProfileRow, "id">;
      levels: Tbl<LevelRow, "code" | "title_fr" | "position">;
      units: Tbl<
        UnitRow,
        "level_id" | "title_fr" | "position",
        [Rel<"units_level_id_fkey", "level_id", "levels">]
      >;
      lessons: Tbl<
        LessonRow,
        "unit_id" | "slug" | "title_fr" | "position",
        [Rel<"lessons_unit_id_fkey", "unit_id", "units">]
      >;
      lesson_videos: Tbl<
        LessonVideoRow,
        "lesson_id" | "provider" | "url",
        [Rel<"lesson_videos_lesson_id_fkey", "lesson_id", "lessons">]
      >;
      vocabulary: Tbl<
        VocabularyRow,
        "lesson_id" | "term_en" | "term_fr",
        [Rel<"vocabulary_lesson_id_fkey", "lesson_id", "lessons">]
      >;
      exams: Tbl<
        ExamRow,
        "kind" | "level_id" | "title_fr",
        [
          Rel<"exams_level_id_fkey", "level_id", "levels">,
          Rel<"exams_unit_id_fkey", "unit_id", "units">,
        ]
      >;
      exercises: Tbl<
        ExerciseRow,
        "type" | "skill" | "prompt_fr",
        [
          Rel<"exercises_lesson_id_fkey", "lesson_id", "lessons">,
          Rel<"exercises_exam_id_fkey", "exam_id", "exams">,
        ]
      >;
      exercise_options: Tbl<
        ExerciseOptionRow,
        "exercise_id" | "label",
        [Rel<"exercise_options_exercise_id_fkey", "exercise_id", "exercises">]
      >;
      placement_questions: Tbl<
        PlacementQuestionRow,
        "level" | "skill" | "prompt_fr" | "stem" | "options" | "correct_index"
      >;
      placement_attempts: Tbl<
        PlacementAttemptRow,
        "user_id",
        [Rel<"placement_attempts_user_id_fkey", "user_id", "profiles">]
      >;
      user_progress: Tbl<
        UserProgressRow,
        "user_id" | "lesson_id",
        [
          Rel<"user_progress_user_id_fkey", "user_id", "profiles">,
          Rel<"user_progress_lesson_id_fkey", "lesson_id", "lessons">,
        ]
      >;
      lesson_attempts: Tbl<
        LessonAttemptRow,
        "user_id" | "lesson_id" | "score" | "passed",
        [
          Rel<"lesson_attempts_user_id_fkey", "user_id", "profiles">,
          Rel<"lesson_attempts_lesson_id_fkey", "lesson_id", "lessons">,
        ]
      >;
      exam_attempts: Tbl<
        ExamAttemptRow,
        "user_id" | "exam_id" | "score" | "passed",
        [
          Rel<"exam_attempts_user_id_fkey", "user_id", "profiles">,
          Rel<"exam_attempts_exam_id_fkey", "exam_id", "exams">,
        ]
      >;
      certificates: Tbl<
        CertificateRow,
        "code" | "user_id" | "level_id" | "learner_name" | "level_code" | "score",
        [
          Rel<"certificates_user_id_fkey", "user_id", "profiles">,
          Rel<"certificates_level_id_fkey", "level_id", "levels">,
        ]
      >;
      streaks: Tbl<
        StreakRow,
        "user_id",
        [Rel<"streaks_user_id_fkey", "user_id", "profiles", true>]
      >;
      xp_events: Tbl<
        XpEventRow,
        "user_id" | "amount" | "source",
        [Rel<"xp_events_user_id_fkey", "user_id", "profiles">]
      >;
      daily_activity: Tbl<
        DailyActivityRow,
        "user_id" | "day",
        [Rel<"daily_activity_user_id_fkey", "user_id", "profiles">]
      >;
      badges: Tbl<BadgeRow, "code" | "title_fr" | "description_fr" | "criteria">;
      user_badges: Tbl<
        UserBadgeRow,
        "user_id" | "badge_id",
        [
          Rel<"user_badges_user_id_fkey", "user_id", "profiles">,
          Rel<"user_badges_badge_id_fkey", "badge_id", "badges">,
        ]
      >;
      subscriptions: Tbl<
        SubscriptionRow,
        "user_id" | "plan" | "current_period_end",
        [Rel<"subscriptions_user_id_fkey", "user_id", "profiles">]
      >;
      entitlements: Tbl<
        EntitlementRow,
        "user_id" | "source",
        [
          Rel<"entitlements_user_id_fkey", "user_id", "profiles">,
          Rel<"entitlements_level_id_fkey", "level_id", "levels">,
        ]
      >;
      payments: Tbl<
        PaymentRow,
        "user_id" | "provider" | "method" | "product" | "amount_cents",
        [Rel<"payments_user_id_fkey", "user_id", "profiles">]
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      verify_certificate: {
        Args: { p_code: string };
        Returns: {
          code: string;
          learner_name: string;
          level_code: CefrLevel;
          score: number;
          issued_at: string;
          revoked: boolean;
        }[];
      };
      weekly_leaderboard: {
        Args: { p_limit?: number };
        Returns: { user_id: string; full_name: string; city: string | null; xp: number }[];
      };
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      content_status: ContentStatus;
      cefr_level: CefrLevel;
      skill: Skill;
      exercise_type: ExerciseType;
      progress_status: ProgressStatus;
      exam_kind: ExamKind;
      video_provider: VideoProvider;
      attempt_status: AttemptStatus;
      payment_status: PaymentStatus;
      payment_method: PaymentMethod;
      subscription_status: SubscriptionStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
