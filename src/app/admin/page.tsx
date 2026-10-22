'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { SAMPLE_LESSONS, CompleteLesson } from '@/lib/domain/lessons-data';
import { ContentStatus, VideoProvider, CefrLevel, Skill } from '@/lib/supabase/database.types';
import { PLACEMENT_QUESTIONS, PlacementQuestion } from '@/lib/domain/placement-bank';
import { SKILL_LABELS_FR } from '@/lib/domain/placement';
import { Palier, INITIAL_PALIERS, getStoredPaliers, saveStoredPaliers } from '@/lib/domain/paliers';
import {
  VodVideo,
  VodCategory,
  VOD_CATEGORIES,
  INITIAL_VOD_VIDEOS,
  getStoredVodVideos,
  saveStoredVodVideos,
} from '@/lib/domain/vod';
import {
  detectVideoProvider,
  getCloudinaryEcoUrl,
  getCloudinaryPosterUrl,
  getCloudinaryAudioUrl,
} from '@/lib/video-helpers';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { PricingManagement } from '@/components/admin/PricingManagement';
import {
  isAdminAuthenticated,
  verifyAndLoginAdmin,
  logoutAdmin,
  getAdminUser,
  AdminUser,
} from '@/lib/auth-admin';
import { toast } from 'sonner';

interface LearnerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  level: string;
  role: 'learner' | 'teacher' | 'admin';
  status: 'active' | 'suspended';
  lessonsDone: number;
  totalXp: number;
  streakDays: number;
  lastActive: string;
}

const INITIAL_LEARNERS: LearnerRecord[] = [
  {
    id: 'usr-00',
    name: 'Coach David Liandja',
    email: 'liandjadavid@gmail.com',
    phone: '+27 74 293 2071',
    city: 'Kinshasa (Gombe)',
    level: 'B2',
    role: 'admin',
    status: 'active',
    lessonsDone: 45,
    totalXp: 3500,
    streakDays: 45,
    lastActive: 'En ligne maintenant',
  },
  {
    id: 'lrn-01',
    name: 'Naomi Kabamba',
    email: 'naomi.k@gmail.com',
    phone: '+243 81 234 5678',
    city: 'Kinshasa (Gombe)',
    level: 'A2',
    role: 'learner',
    status: 'active',
    lessonsDone: 14,
    totalXp: 520,
    streakDays: 14,
    lastActive: 'Aujourd’hui',
  },
  {
    id: 'lrn-02',
    name: 'Gloire Mwamba',
    email: 'gloire.m@yahoo.fr',
    phone: '+243 99 876 5432',
    city: 'Lubumbashi',
    level: 'A1',
    role: 'learner',
    status: 'active',
    lessonsDone: 11,
    totalXp: 420,
    streakDays: 9,
    lastActive: 'Aujourd’hui',
  },
  {
    id: 'lrn-03',
    name: 'Christelle Lukusa',
    email: 'lukusa.c@outlook.com',
    phone: '+243 97 111 2233',
    city: 'Goma',
    level: 'B1',
    role: 'learner',
    status: 'active',
    lessonsDone: 24,
    totalXp: 890,
    streakDays: 21,
    lastActive: 'Hier',
  },
  {
    id: 'lrn-04',
    name: 'Junior Ilunga',
    email: 'junior.ilunga@gmail.com',
    phone: '+243 82 444 5566',
    city: 'Kinshasa (Limete)',
    level: 'A1',
    role: 'learner',
    status: 'active',
    lessonsDone: 5,
    totalXp: 310,
    streakDays: 5,
    lastActive: 'Aujourd’hui',
  },
  {
    id: 'lrn-05',
    name: 'Dorcas Masika',
    email: 'dorcas.m@gmail.com',
    phone: '+243 85 999 8877',
    city: 'Bukavu',
    level: 'A2',
    role: 'learner',
    status: 'active',
    lessonsDone: 8,
    totalXp: 280,
    streakDays: 7,
    lastActive: 'Il y a 2 jours',
  },
  {
    id: 'lrn-06',
    name: 'Prince Mulumba',
    email: 'prince.mulumba@gmail.com',
    phone: '+243 81 000 1122',
    city: 'Matadi',
    level: 'A1',
    role: 'learner',
    status: 'active',
    lessonsDone: 3,
    totalXp: 190,
    streakDays: 3,
    lastActive: 'Il y a 3 jours',
  },
];

interface LearnerFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  level: string;
  role: 'learner' | 'teacher' | 'admin';
  status: 'active' | 'suspended';
  totalXp: number;
  streakDays: number;
}

const EMPTY_LEARNER_FORM: LearnerFormData = {
  name: '',
  email: '',
  phone: '+243 ',
  city: 'Kinshasa',
  level: 'A1',
  role: 'learner',
  status: 'active',
  totalXp: 0,
  streakDays: 1,
};

interface LessonFormData {
  slug: string;
  title_fr: string;
  title_en: string;
  objective_fr: string;
  explanation_fr: string;
  est_minutes: number;
  xp_reward: number;
  pass_mark: number;
  status: ContentStatus;
  video_url?: string;
  video_provider?: VideoProvider;
}

const EMPTY_FORM: LessonFormData = {
  slug: '',
  title_fr: '',
  title_en: '',
  objective_fr: '',
  explanation_fr: '',
  est_minutes: 8,
  xp_reward: 20,
  pass_mark: 70,
  status: 'published',
  video_url: '',
  video_provider: 'youtube',
};

interface QuestionFormData {
  id?: string;
  level: CefrLevel;
  skill: Skill;
  prompt_fr: string;
  stem: string;
  passage: string;
  audio_text: string;
  option0: string;
  option1: string;
  option2: string;
  option3: string;
  correct_index: number;
  explanation_fr: string;
}

const EMPTY_QUESTION_FORM: QuestionFormData = {
  level: 'A1',
  skill: 'vocabulary',
  prompt_fr: 'Choisissez la bonne réponse.',
  stem: '',
  passage: '',
  audio_text: '',
  option0: '',
  option1: '',
  option2: '',
  option3: '',
  correct_index: 0,
  explanation_fr: '',
};

interface PalierFormData {
  id?: string;
  code: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  badgeIcon: string;
  colorTheme: 'emerald' | 'blue' | 'indigo' | 'purple' | 'amber' | 'rose';
  position: number;
  isFree: boolean;
  requiredXp: number;
  passingScorePct: number;
  status: 'published' | 'draft' | 'archived';
  estimatedWeeks: number;
  targetLearner: string;
}

const EMPTY_PALIER_FORM: PalierFormData = {
  code: '',
  titleFr: '',
  titleEn: '',
  descriptionFr: '',
  badgeIcon: '🌱',
  colorTheme: 'emerald',
  position: 1,
  isFree: false,
  requiredXp: 500,
  passingScorePct: 75,
  status: 'published',
  estimatedWeeks: 6,
  targetLearner: 'Apprenants motivés',
};

interface VodFormData {
  title: string;
  description: string;
  category: VodCategory;
  level: string;
  provider: VideoProvider;
  url: string;
  lowUrl: string;
  audioUrl: string;
  posterUrl: string;
  durationMinutes: number;
  isFree: boolean;
  status: 'published' | 'draft';
  xpReward: number;
  coachNote: string;
}

const EMPTY_VOD_FORM: VodFormData = {
  title: '',
  description: '',
  category: 'prononciation',
  level: 'A1',
  provider: 'cloudinary',
  url: '',
  lowUrl: '',
  audioUrl: '',
  posterUrl: '',
  durationMinutes: 15,
  isFree: true,
  status: 'published',
  xpReward: 35,
  coachNote: '',
};

export default function AdminDashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'learners' | 'questions' | 'paliers' | 'vod' | 'pricing'>('lessons');
  const [lessons, setLessons] = useState<CompleteLesson[]>(Object.values(SAMPLE_LESSONS));
  const [learners, setLearners] = useState<LearnerRecord[]>(INITIAL_LEARNERS);
  const [questions, setQuestions] = useState<PlacementQuestion[]>(PLACEMENT_QUESTIONS);
  const [paliers, setPaliers] = useState<Palier[]>(INITIAL_PALIERS);

  // Search & filters for paliers
  const [palierSearch, setPalierSearch] = useState('');
  const [palierStatusFilter, setPalierStatusFilter] = useState<'ALL' | 'published' | 'draft'>('ALL');

  // Modal states for Palier CRUD
  const [isPalierCreateOpen, setIsPalierCreateOpen] = useState(false);
  const [editingPalierId, setEditingPalierId] = useState<string | null>(null);
  const [palierFormData, setPalierFormData] = useState<PalierFormData>(EMPTY_PALIER_FORM);
  const [deletingPalierId, setDeletingPalierId] = useState<string | null>(null);

  // Search & filters for learners
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'learner' | 'teacher' | 'admin'>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | 'active' | 'suspended'>('ALL');

  // Modal states for Learner CRUD
  const [isLearnerCreateOpen, setIsLearnerCreateOpen] = useState(false);
  const [editingLearnerId, setEditingLearnerId] = useState<string | null>(null);
  const [learnerFormData, setLearnerFormData] = useState<LearnerFormData>(EMPTY_LEARNER_FORM);
  const [deletingLearnerId, setDeletingLearnerId] = useState<string | null>(null);

  // Search & filters for lessons
  const [lessonSearch, setLessonSearch] = useState('');
  const [lessonStatusFilter, setLessonStatusFilter] = useState<'ALL' | 'published' | 'draft'>('ALL');

  // Modal states for Lesson CRUD
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLessonSlug, setEditingLessonSlug] = useState<string | null>(null);
  const [lessonFormData, setLessonFormData] = useState<LessonFormData>(EMPTY_FORM);
  const [deletingLessonSlug, setDeletingLessonSlug] = useState<string | null>(null);

  // Search & filters for questions
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionLevelFilter, setQuestionLevelFilter] = useState<'ALL' | CefrLevel>('ALL');
  const [questionSkillFilter, setQuestionSkillFilter] = useState<'ALL' | Skill>('ALL');

  // Modal states for Question CRUD
  const [isQuestionCreateOpen, setIsQuestionCreateOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionFormData, setQuestionFormData] = useState<QuestionFormData>(EMPTY_QUESTION_FORM);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  // Search & filters for VOD videos
  const [vodVideos, setVodVideos] = useState<VodVideo[]>(INITIAL_VOD_VIDEOS);
  const [vodSearch, setVodSearch] = useState('');
  const [vodCategoryFilter, setVodCategoryFilter] = useState<string>('ALL');
  const [vodStatusFilter, setVodStatusFilter] = useState<'ALL' | 'published' | 'draft'>('ALL');
  const [vodProviderFilter, setVodProviderFilter] = useState<string>('ALL');

  // Modal states for VOD CRUD
  const [isVodCreateOpen, setIsVodCreateOpen] = useState(false);
  const [editingVodId, setEditingVodId] = useState<string | null>(null);
  const [vodFormData, setVodFormData] = useState<VodFormData>(EMPTY_VOD_FORM);
  const [deletingVodId, setDeletingVodId] = useState<string | null>(null);
  const [previewVodVideo, setPreviewVodVideo] = useState<VodVideo | null>(null);

  // Admin Authentication Guard States
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminEmail, setAdminEmail] = useState('liandjadavid@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load from localStorage on mount (persistence) and check tab query param
  useEffect(() => {
    setIsMounted(true);
    try {
      const authenticated = isAdminAuthenticated();
      setIsAdmin(authenticated);
      if (authenticated) {
        setAdminUser(getAdminUser());
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const requestedTab = params.get('tab');
        if (
          requestedTab === 'overview' ||
          requestedTab === 'lessons' ||
          requestedTab === 'learners' ||
          requestedTab === 'questions' ||
          requestedTab === 'paliers' ||
          requestedTab === 'vod' ||
          requestedTab === 'pricing'
        ) {
          setActiveTab(requestedTab);
        }
      }

      // Load stored VOD videos
      const loadedVod = getStoredVodVideos();
      if (loadedVod && loadedVod.length > 0) {
        setVodVideos(loadedVod);
      }

      // Load stored paliers
      const loadedPaliers = getStoredPaliers();
      if (loadedPaliers && loadedPaliers.length > 0) {
        setPaliers(loadedPaliers);
      }

      const saved = localStorage.getItem('pa3_admin_lessons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLessons(parsed);
        }
      }

      const savedLearners = localStorage.getItem('pa3_admin_learners');
      if (savedLearners) {
        const parsedLearners = JSON.parse(savedLearners);
        if (Array.isArray(parsedLearners) && parsedLearners.length > 0) {
          setLearners(parsedLearners);
        }
      }

      const savedQuestions = localStorage.getItem('pa3_admin_placement_questions');
      if (savedQuestions) {
        const parsedQuestions = JSON.parse(savedQuestions);
        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          setQuestions(parsedQuestions);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Helper to persist lessons
  const saveLessons = (newLessons: CompleteLesson[]) => {
    setLessons(newLessons);
    try {
      localStorage.setItem('pa3_admin_lessons', JSON.stringify(newLessons));
    } catch {
      // ignore
    }
  };

  // Helper to persist learners
  const saveLearners = (newLearners: LearnerRecord[]) => {
    setLearners(newLearners);
    try {
      localStorage.setItem('pa3_admin_learners', JSON.stringify(newLearners));
    } catch {
      // ignore
    }
  };

  // Helper to persist placement questions
  const saveQuestions = (newQuestions: PlacementQuestion[]) => {
    setQuestions(newQuestions);
    try {
      localStorage.setItem('pa3_admin_placement_questions', JSON.stringify(newQuestions));
    } catch {
      // ignore
    }
  };

  // Helper to persist paliers / levels
  const savePaliers = (newPaliers: Palier[]) => {
    setPaliers(newPaliers);
    saveStoredPaliers(newPaliers);
  };

  // 1. CREATE: Open modal
  const handleOpenCreate = () => {
    setLessonFormData(EMPTY_FORM);
    setIsCreateModalOpen(true);
  };

  // 1. CREATE: Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonFormData.title_fr.trim() || !lessonFormData.title_en.trim()) {
      toast.error('Veuillez renseigner les titres en français et en anglais.');
      return;
    }

    const slug =
      lessonFormData.slug.trim() ||
      'a1-' +
        lessonFormData.title_fr
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

    // Check duplicate slug
    if (lessons.some((l) => l.lesson.slug === slug)) {
      toast.error(`Une leçon avec le slug "${slug}" existe déjà.`);
      return;
    }

    const newCompleteLesson: CompleteLesson = {
      lesson: {
        id: 'usr-' + Date.now(),
        unit_id: '10000000-0000-0000-0000-000000000101',
        slug,
        title_fr: lessonFormData.title_fr.trim(),
        title_en: lessonFormData.title_en.trim(),
        objective_fr: lessonFormData.objective_fr.trim() || 'Comprendre et pratiquer ces expressions en anglais.',
        explanation_fr: lessonFormData.explanation_fr.trim() || 'Pratique guidée avec Coach David Liandja.',
        position: lessons.length + 1,
        xp_reward: Number(lessonFormData.xp_reward) || 20,
        est_minutes: Number(lessonFormData.est_minutes) || 8,
        pass_mark: Number(lessonFormData.pass_mark) || 70,
        status: lessonFormData.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      video: {
        id: 'vid-' + Date.now(),
        lesson_id: 'usr-' + Date.now(),
        provider: lessonFormData.video_provider || 'youtube',
        url: lessonFormData.video_url?.trim() || 'dQw4w9WgXcQ',
        low_url: null,
        audio_url: null,
        poster_url: '/images/posters/salutations.webp',
        duration_s: (Number(lessonFormData.est_minutes) || 8) * 60,
        captions: [],
        transcript_fr: 'Transcription vidéo de la leçon.',
        position: 1,
        created_at: new Date().toISOString(),
      },
      vocabulary: [
        {
          id: 'voc-' + Date.now(),
          lesson_id: 'usr-' + Date.now(),
          term_en: lessonFormData.title_en,
          term_fr: lessonFormData.title_fr,
          example_en: `Practice: ${lessonFormData.title_en}`,
          example_fr: `Pratiquez : ${lessonFormData.title_fr}`,
          audio_url: null,
          position: 1,
        },
      ],
      exercises: [
        {
          exercise: {
            id: 'ex-' + Date.now(),
            lesson_id: 'usr-' + Date.now(),
            exam_id: null,
            type: 'multiple_choice',
            prompt_fr: 'Choisissez la bonne traduction en anglais.',
            prompt_en: 'Choose the correct English translation.',
            payload: {
              stem: `Comment dit-on « ${lessonFormData.title_fr} » en anglais ?`,
              options: [
                lessonFormData.title_en,
                'Good evening everyone',
                'Thank you very much',
                'See you tomorrow',
              ],
              correct_index: 0,
            },
            skill: 'vocabulary',
            audio_url: null,
            explanation_fr: `La bonne réponse est « ${lessonFormData.title_en} ».`,
            position: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          options: [],
        },
      ],
    };

    saveLessons([...lessons, newCompleteLesson]);
    setIsCreateModalOpen(false);
    toast.success(`Leçon « ${newCompleteLesson.lesson.title_fr} » créée avec succès !`);
  };

  // 2. UPDATE: Open Edit Modal
  const handleOpenEdit = (item: CompleteLesson) => {
    setEditingLessonSlug(item.lesson.slug);
    setLessonFormData({
      slug: item.lesson.slug,
      title_fr: item.lesson.title_fr,
      title_en: item.lesson.title_en,
      objective_fr: item.lesson.objective_fr,
      explanation_fr: item.lesson.explanation_fr,
      est_minutes: item.lesson.est_minutes,
      xp_reward: item.lesson.xp_reward,
      pass_mark: item.lesson.pass_mark,
      status: item.lesson.status,
      video_url: item.video?.url || '',
      video_provider: item.video?.provider || 'youtube',
    });
  };

  // 2. UPDATE: Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLessonSlug) return;

    const updatedLessons = lessons.map((item) => {
      if (item.lesson.slug === editingLessonSlug) {
        return {
          ...item,
          lesson: {
            ...item.lesson,
            title_fr: lessonFormData.title_fr.trim(),
            title_en: lessonFormData.title_en.trim(),
            objective_fr: lessonFormData.objective_fr.trim(),
            explanation_fr: lessonFormData.explanation_fr.trim(),
            est_minutes: Number(lessonFormData.est_minutes) || 8,
            xp_reward: Number(lessonFormData.xp_reward) || 20,
            pass_mark: Number(lessonFormData.pass_mark) || 70,
            status: lessonFormData.status,
            updated_at: new Date().toISOString(),
          },
          video: {
            ...item.video,
            provider: lessonFormData.video_provider || 'youtube',
            url: lessonFormData.video_url?.trim() || item.video.url,
          },
        };
      }
      return item;
    });

    saveLessons(updatedLessons);
    setEditingLessonSlug(null);
    toast.success(`Leçon « ${lessonFormData.title_fr} » mise à jour avec succès !`);
  };

  // 3. TOGGLE PUBLISH / DRAFT
  const toggleLessonStatus = (slug: string) => {
    const updated = lessons.map((l) =>
      l.lesson.slug === slug
        ? {
            ...l,
            lesson: {
              ...l.lesson,
              status: (l.lesson.status === 'published' ? 'draft' : 'published') as ContentStatus,
            },
          }
        : l
    );
    saveLessons(updated);
    const target = updated.find((l) => l.lesson.slug === slug);
    if (target?.lesson.status === 'published') {
      toast.success(`La leçon « ${target.lesson.title_fr} » est maintenant EN LIGNE.`);
    } else {
      toast.info(`La leçon « ${target?.lesson.title_fr} » est repassée en BROUILLON.`);
    }
  };

  // 4. DUPLICATE LESSON
  const handleDuplicateLesson = (item: CompleteLesson) => {
    const newSlug = item.lesson.slug + '-copie-' + Math.floor(100 + Math.random() * 900);
    const duplicate: CompleteLesson = {
      ...item,
      lesson: {
        ...item.lesson,
        id: 'dup-' + Date.now(),
        slug: newSlug,
        title_fr: `${item.lesson.title_fr} (Copie)`,
        status: 'draft',
        position: lessons.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      video: {
        ...item.video,
        id: 'vid-dup-' + Date.now(),
        lesson_id: 'dup-' + Date.now(),
      },
    };
    saveLessons([...lessons, duplicate]);
    toast.success(`Leçon dupliquée : « ${duplicate.lesson.title_fr} » (Brouillon)`);
  };

  // 5. DELETE LESSON
  const handleConfirmDelete = () => {
    if (!deletingLessonSlug) return;
    const target = lessons.find((l) => l.lesson.slug === deletingLessonSlug);
    const updated = lessons.filter((l) => l.lesson.slug !== deletingLessonSlug);
    saveLessons(updated);
    setDeletingLessonSlug(null);
    toast.info(`La leçon « ${target?.lesson.title_fr || deletingLessonSlug} » a été supprimée.`);
  };

  // =================================================================
  // USER / LEARNER CRUD HANDLERS
  // =================================================================

  // 1. CREATE LEARNER
  const handleOpenCreateLearner = () => {
    setLearnerFormData(EMPTY_LEARNER_FORM);
    setIsLearnerCreateOpen(true);
  };

  const handleCreateLearnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerFormData.name.trim() || !learnerFormData.email.trim()) {
      toast.error('Veuillez renseigner le nom complet et l’adresse email.');
      return;
    }

    if (learners.some((l) => l.email.toLowerCase() === learnerFormData.email.trim().toLowerCase())) {
      toast.error(`Un utilisateur avec l'adresse « ${learnerFormData.email} » existe déjà.`);
      return;
    }

    const newLearner: LearnerRecord = {
      id: 'usr-' + Date.now(),
      name: learnerFormData.name.trim(),
      email: learnerFormData.email.trim().toLowerCase(),
      phone: learnerFormData.phone.trim() || '+243 ',
      city: learnerFormData.city.trim() || 'Kinshasa',
      level: learnerFormData.level || 'A1',
      role: learnerFormData.role || 'learner',
      status: learnerFormData.status || 'active',
      lessonsDone: 0,
      totalXp: Number(learnerFormData.totalXp) || 0,
      streakDays: Number(learnerFormData.streakDays) || 1,
      lastActive: 'Aujourd’hui',
    };

    saveLearners([newLearner, ...learners]);
    setIsLearnerCreateOpen(false);
    toast.success(`Utilisateur « ${newLearner.name} » inscrit avec succès !`);
  };

  // 2. UPDATE LEARNER
  const handleOpenEditLearner = (lrn: LearnerRecord) => {
    setEditingLearnerId(lrn.id);
    setLearnerFormData({
      id: lrn.id,
      name: lrn.name,
      email: lrn.email,
      phone: lrn.phone,
      city: lrn.city,
      level: lrn.level,
      role: lrn.role,
      status: lrn.status,
      totalXp: lrn.totalXp,
      streakDays: lrn.streakDays,
    });
  };

  const handleEditLearnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLearnerId) return;

    const updated = learners.map((l) => {
      if (l.id === editingLearnerId) {
        return {
          ...l,
          name: learnerFormData.name.trim(),
          email: learnerFormData.email.trim().toLowerCase(),
          phone: learnerFormData.phone.trim(),
          city: learnerFormData.city.trim(),
          level: learnerFormData.level,
          role: learnerFormData.role,
          status: learnerFormData.status,
          totalXp: Number(learnerFormData.totalXp) || 0,
          streakDays: Number(learnerFormData.streakDays) || 0,
        };
      }
      return l;
    });

    saveLearners(updated);
    setEditingLearnerId(null);
    toast.success(`Profil de « ${learnerFormData.name} » mis à jour avec succès !`);
  };

  // 3. TOGGLE LEARNER STATUS
  const toggleLearnerStatus = (id: string) => {
    const updated = learners.map((l) => {
      if (l.id === id) {
        const nextStatus = l.status === 'active' ? 'suspended' : 'active';
        return { ...l, status: nextStatus as 'active' | 'suspended' };
      }
      return l;
    });
    saveLearners(updated);
    const target = updated.find((l) => l.id === id);
    if (target?.status === 'active') {
      toast.success(`Le compte de « ${target.name} » est maintenant ACTIF.`);
    } else {
      toast.warning(`Le compte de « ${target?.name} » a été SUSPENDU.`);
    }
  };

  // 4. AWARD BONUS XP
  const handleAwardBonusXp = (id: string, amount: number = 50) => {
    const updated = learners.map((l) =>
      l.id === id ? { ...l, totalXp: l.totalXp + amount } : l
    );
    saveLearners(updated);
    const target = updated.find((l) => l.id === id);
    toast.success(`+${amount} XP accordés à « ${target?.name} » !`);
  };

  // 5. DELETE LEARNER
  const handleConfirmDeleteLearner = () => {
    if (!deletingLearnerId) return;
    const target = learners.find((l) => l.id === deletingLearnerId);
    if (target?.role === 'admin') {
      toast.error('Impossible de supprimer un compte Administrateur principal.');
      setDeletingLearnerId(null);
      return;
    }
    const filtered = learners.filter((l) => l.id !== deletingLearnerId);
    saveLearners(filtered);
    setDeletingLearnerId(null);
    toast.info(`L'utilisateur « ${target?.name} » a été supprimé.`);
  };

  // Export CSV for learners
  const handleExportCsv = () => {
    const headers = [
      'Nom',
      'Email',
      'Téléphone',
      'Ville',
      'Niveau',
      'Rôle',
      'Statut',
      'Leçons complétées',
      'XP Total',
      'Série (jours)',
      'Dernière activité',
    ];
    const rows = learners.map((l) => [
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.city}"`,
      `"${l.level}"`,
      `"${l.role}"`,
      `"${l.status}"`,
      l.lessonsDone,
      l.totalXp,
      l.streakDays,
      `"${l.lastActive}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pa3_apprenants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =================================================================
  // PLACEMENT QUESTIONS CRUD HANDLERS
  // =================================================================

  // 1. CREATE QUESTION
  const handleOpenCreateQuestion = () => {
    setQuestionFormData(EMPTY_QUESTION_FORM);
    setIsQuestionCreateOpen(true);
  };

  const handleCreateQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFormData.stem.trim()) {
      toast.error("Veuillez renseigner l'énoncé de la question.");
      return;
    }
    const options = [
      questionFormData.option0.trim(),
      questionFormData.option1.trim(),
      questionFormData.option2.trim(),
      questionFormData.option3.trim(),
    ].filter(Boolean);

    if (options.length < 2) {
      toast.error('Veuillez renseigner au moins 2 options de réponse.');
      return;
    }

    if (questionFormData.correct_index >= options.length) {
      toast.error("L'option désignée comme bonne réponse n'est pas renseignée.");
      return;
    }

    const newQuestion: PlacementQuestion = {
      id: 'pq-custom-' + Date.now(),
      level: questionFormData.level,
      skill: questionFormData.skill,
      prompt_fr: questionFormData.prompt_fr.trim() || 'Choisissez la bonne réponse.',
      stem: questionFormData.stem.trim(),
      passage: questionFormData.passage.trim() || undefined,
      audio_text: questionFormData.audio_text.trim() || undefined,
      options,
      correct_index: questionFormData.correct_index,
      explanation_fr: questionFormData.explanation_fr.trim() || undefined,
    };

    saveQuestions([newQuestion, ...questions]);
    setIsQuestionCreateOpen(false);
    toast.success('Question ajoutée à la banque de test avec succès !');
  };

  // 2. UPDATE QUESTION
  const handleOpenEditQuestion = (q: PlacementQuestion) => {
    setEditingQuestionId(q.id);
    setQuestionFormData({
      id: q.id,
      level: q.level,
      skill: q.skill,
      prompt_fr: q.prompt_fr,
      stem: q.stem,
      passage: q.passage || '',
      audio_text: q.audio_text || '',
      option0: q.options[0] || '',
      option1: q.options[1] || '',
      option2: q.options[2] || '',
      option3: q.options[3] || '',
      correct_index: q.correct_index,
      explanation_fr: q.explanation_fr || '',
    });
  };

  const handleEditQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestionId) return;

    if (!questionFormData.stem.trim()) {
      toast.error("Veuillez renseigner l'énoncé de la question.");
      return;
    }
    const options = [
      questionFormData.option0.trim(),
      questionFormData.option1.trim(),
      questionFormData.option2.trim(),
      questionFormData.option3.trim(),
    ].filter(Boolean);

    if (options.length < 2) {
      toast.error('Veuillez renseigner au moins 2 options de réponse.');
      return;
    }

    if (questionFormData.correct_index >= options.length) {
      toast.error("L'option désignée comme bonne réponse n'est pas renseignée.");
      return;
    }

    const updated = questions.map((q) => {
      if (q.id === editingQuestionId) {
        return {
          ...q,
          level: questionFormData.level,
          skill: questionFormData.skill,
          prompt_fr: questionFormData.prompt_fr.trim() || 'Choisissez la bonne réponse.',
          stem: questionFormData.stem.trim(),
          passage: questionFormData.passage.trim() || undefined,
          audio_text: questionFormData.audio_text.trim() || undefined,
          options,
          correct_index: questionFormData.correct_index,
          explanation_fr: questionFormData.explanation_fr.trim() || undefined,
        };
      }
      return q;
    });

    saveQuestions(updated);
    setEditingQuestionId(null);
    toast.success('Question mise à jour avec succès !');
  };

  // 3. DUPLICATE QUESTION
  const handleDuplicateQuestion = (q: PlacementQuestion) => {
    const duplicate: PlacementQuestion = {
      ...q,
      id: 'pq-dup-' + Date.now(),
      stem: `${q.stem} (Copie)`,
    };
    saveQuestions([duplicate, ...questions]);
    toast.success('Question dupliquée avec succès !');
  };

  // 4. DELETE QUESTION
  const handleConfirmDeleteQuestion = () => {
    if (!deletingQuestionId) return;
    const updated = questions.filter((q) => q.id !== deletingQuestionId);
    saveQuestions(updated);
    setDeletingQuestionId(null);
    toast.info('Question supprimée de la banque.');
  };

  // 5. EXPORT CSV FOR QUESTIONS
  const handleExportQuestionsCsv = () => {
    const headers = [
      'ID',
      'Niveau',
      'Compétence',
      'Consigne FR',
      'Énoncé Stem',
      'Extrait / Passage',
      'Texte Audio',
      'Option 1',
      'Option 2',
      'Option 3',
      'Option 4',
      'Index Bonne Réponse (0-3)',
      'Bonne Réponse Texte',
      'Explication FR',
    ];
    const rows = questions.map((q) => [
      `"${q.id}"`,
      `"${q.level}"`,
      `"${q.skill}"`,
      `"${(q.prompt_fr || '').replace(/"/g, '""')}"`,
      `"${(q.stem || '').replace(/"/g, '""')}"`,
      `"${(q.passage || '').replace(/"/g, '""')}"`,
      `"${(q.audio_text || '').replace(/"/g, '""')}"`,
      `"${(q.options[0] || '').replace(/"/g, '""')}"`,
      `"${(q.options[1] || '').replace(/"/g, '""')}"`,
      `"${(q.options[2] || '').replace(/"/g, '""')}"`,
      `"${(q.options[3] || '').replace(/"/g, '""')}"`,
      q.correct_index,
      `"${(q.options[q.correct_index] || '').replace(/"/g, '""')}"`,
      `"${(q.explanation_fr || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pa3_questions_placement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =================================================================
  // LEVEL / PALIER CRUD HANDLERS
  // =================================================================

  // 1. CREATE PALIER
  const handleOpenCreatePalier = () => {
    setPalierFormData({
      ...EMPTY_PALIER_FORM,
      position: paliers.length + 1,
    });
    setIsPalierCreateOpen(true);
  };

  const handleCreatePalierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = palierFormData.code.trim().toUpperCase();
    if (!cleanCode || !palierFormData.titleFr.trim()) {
      toast.error('Veuillez renseigner le code (ex: C1) et le titre du palier.');
      return;
    }
    if (paliers.some((p) => p.code.toUpperCase() === cleanCode)) {
      toast.error(`Un palier avec le code « ${cleanCode} » existe déjà.`);
      return;
    }
    const newPalier: Palier = {
      id: 'palier-' + cleanCode.toLowerCase() + '-' + Date.now(),
      code: cleanCode,
      titleFr: palierFormData.titleFr.trim(),
      titleEn: palierFormData.titleEn.trim() || palierFormData.titleFr.trim(),
      descriptionFr: palierFormData.descriptionFr.trim(),
      badgeIcon: palierFormData.badgeIcon.trim() || '🎯',
      colorTheme: palierFormData.colorTheme,
      position: Number(palierFormData.position) || paliers.length + 1,
      isFree: Boolean(palierFormData.isFree),
      requiredXp: Number(palierFormData.requiredXp) || 0,
      passingScorePct: Number(palierFormData.passingScorePct) || 75,
      status: palierFormData.status,
      estimatedWeeks: Number(palierFormData.estimatedWeeks) || 6,
      targetLearner: palierFormData.targetLearner.trim() || 'Tous niveaux',
    };
    const updated = [...paliers, newPalier].sort((a, b) => a.position - b.position);
    savePaliers(updated);
    setIsPalierCreateOpen(false);
    toast.success(`Palier « ${newPalier.code} - ${newPalier.titleFr} » créé avec succès !`);
  };

  // 2. EDIT PALIER
  const handleOpenEditPalier = (p: Palier) => {
    setEditingPalierId(p.id);
    setPalierFormData({
      id: p.id,
      code: p.code,
      titleFr: p.titleFr,
      titleEn: p.titleEn,
      descriptionFr: p.descriptionFr,
      badgeIcon: p.badgeIcon,
      colorTheme: p.colorTheme,
      position: p.position,
      isFree: p.isFree,
      requiredXp: p.requiredXp,
      passingScorePct: p.passingScorePct,
      status: p.status,
      estimatedWeeks: p.estimatedWeeks || 6,
      targetLearner: p.targetLearner || '',
    });
  };

  const handleEditPalierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!palierFormData.titleFr.trim()) {
      toast.error('Veuillez renseigner le titre du palier.');
      return;
    }
    const updated = paliers
      .map((p) => {
        if (p.id === editingPalierId) {
          return {
            ...p,
            titleFr: palierFormData.titleFr.trim(),
            titleEn: palierFormData.titleEn.trim() || palierFormData.titleFr.trim(),
            descriptionFr: palierFormData.descriptionFr.trim(),
            badgeIcon: palierFormData.badgeIcon.trim() || '🎯',
            colorTheme: palierFormData.colorTheme,
            position: Number(palierFormData.position) || p.position,
            isFree: p.code === 'A1' ? true : Boolean(palierFormData.isFree),
            requiredXp: Number(palierFormData.requiredXp) || 0,
            passingScorePct: Number(palierFormData.passingScorePct) || 75,
            status: palierFormData.status,
            estimatedWeeks: Number(palierFormData.estimatedWeeks) || 6,
            targetLearner: palierFormData.targetLearner.trim(),
          };
        }
        return p;
      })
      .sort((a, b) => a.position - b.position);

    savePaliers(updated);
    setEditingPalierId(null);
    toast.success('Palier mis à jour avec succès !');
  };

  // 3. TOGGLE PALIER STATUS
  const handleTogglePalierStatus = (p: Palier) => {
    const nextStatus: 'published' | 'draft' = p.status === 'published' ? 'draft' : 'published';
    const updated: Palier[] = paliers.map((item) =>
      item.id === p.id ? { ...item, status: nextStatus } : item
    );
    savePaliers(updated);
    toast.success(
      `Statut du palier « ${p.code} » changé en : ${nextStatus === 'published' ? 'Publié 🟢' : 'Brouillon 🟡'}`
    );
  };

  // 4. DELETE PALIER
  const handleConfirmDeletePalier = () => {
    if (!deletingPalierId) return;
    const target = paliers.find((p) => p.id === deletingPalierId);
    if (target?.code === 'A1') {
      toast.error('Le Palier A1 (Fondamental) ne peut pas être supprimé car il sert de socle gratuit à la plateforme.');
      setDeletingPalierId(null);
      return;
    }
    const updated = paliers.filter((p) => p.id !== deletingPalierId);
    savePaliers(updated);
    setDeletingPalierId(null);
    toast.info(`Palier « ${target?.code} » supprimé.`);
  };

  // 5. EXPORT PALIERS CSV
  const handleExportPaliersCsv = () => {
    const headers = [
      'Code',
      'Titre FR',
      'Titre EN',
      'Description FR',
      'Icône',
      'Position',
      'Accès Gratuit',
      'XP Requis',
      'Score Examen Min',
      'Statut',
      'Semaines Estimées',
      'Public Cible',
    ];
    const rows = paliers.map((p) => [
      `"${p.code}"`,
      `"${p.titleFr.replace(/"/g, '""')}"`,
      `"${p.titleEn.replace(/"/g, '""')}"`,
      `"${p.descriptionFr.replace(/"/g, '""')}"`,
      `"${p.badgeIcon}"`,
      p.position,
      p.isFree ? 'OUI' : 'NON',
      p.requiredXp,
      `${p.passingScorePct}%`,
      p.status,
      p.estimatedWeeks || 6,
      `"${(p.targetLearner || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `paliers_pa3_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export CSV des paliers téléchargé !');
  };

  // =========================================================================
  // VOD CRUD HANDLERS
  // =========================================================================
  const saveVodVideos = (items: VodVideo[]) => {
    setVodVideos(items);
    saveStoredVodVideos(items);
  };

  const handleCreateVodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vodFormData.title.trim() || !vodFormData.url.trim()) {
      toast.error('Le titre et l’URL de la vidéo sont obligatoires.');
      return;
    }

    const detectedProvider = detectVideoProvider(vodFormData.url);
    const finalProvider = vodFormData.provider || detectedProvider;

    const newVideo: VodVideo = {
      id: `vod_${Date.now()}`,
      title: vodFormData.title.trim(),
      description: vodFormData.description.trim(),
      category: vodFormData.category,
      level: vodFormData.level,
      provider: finalProvider,
      url: vodFormData.url.trim(),
      lowUrl: vodFormData.lowUrl.trim() || undefined,
      audioUrl: vodFormData.audioUrl.trim() || undefined,
      posterUrl: vodFormData.posterUrl.trim() || undefined,
      durationMinutes: Number(vodFormData.durationMinutes) || 15,
      isFree: vodFormData.isFree,
      status: vodFormData.status,
      viewsCount: 0,
      xpReward: Number(vodFormData.xpReward) || 35,
      coachNote: vodFormData.coachNote.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveVodVideos([newVideo, ...vodVideos]);
    setIsVodCreateOpen(false);
    setVodFormData(EMPTY_VOD_FORM);
    toast.success(`Vidéo VOD « ${newVideo.title} » ajoutée avec succès !`);
  };

  const handleOpenEditVod = (v: VodVideo) => {
    setEditingVodId(v.id);
    setVodFormData({
      title: v.title,
      description: v.description,
      category: v.category,
      level: v.level,
      provider: v.provider,
      url: v.url,
      lowUrl: v.lowUrl || '',
      audioUrl: v.audioUrl || '',
      posterUrl: v.posterUrl || '',
      durationMinutes: v.durationMinutes,
      isFree: v.isFree,
      status: v.status,
      xpReward: v.xpReward,
      coachNote: v.coachNote || '',
    });
  };

  const handleEditVodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVodId) return;

    const updated = vodVideos.map((v) => {
      if (v.id === editingVodId) {
        return {
          ...v,
          title: vodFormData.title.trim(),
          description: vodFormData.description.trim(),
          category: vodFormData.category,
          level: vodFormData.level,
          provider: vodFormData.provider || detectVideoProvider(vodFormData.url),
          url: vodFormData.url.trim(),
          lowUrl: vodFormData.lowUrl.trim() || undefined,
          audioUrl: vodFormData.audioUrl.trim() || undefined,
          posterUrl: vodFormData.posterUrl.trim() || undefined,
          durationMinutes: Number(vodFormData.durationMinutes) || 15,
          isFree: vodFormData.isFree,
          status: vodFormData.status,
          xpReward: Number(vodFormData.xpReward) || 35,
          coachNote: vodFormData.coachNote.trim() || undefined,
          updatedAt: new Date().toISOString(),
        };
      }
      return v;
    });

    saveVodVideos(updated);
    setEditingVodId(null);
    toast.success('Vidéo VOD mise à jour avec succès !');
  };

  const handleToggleVodStatus = (v: VodVideo) => {
    const nextStatus: 'published' | 'draft' = v.status === 'published' ? 'draft' : 'published';
    const updated: VodVideo[] = vodVideos.map((item) =>
      item.id === v.id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item
    );
    saveVodVideos(updated);
    toast.success(
      `Statut de la vidéo changé en : ${nextStatus === 'published' ? 'Publiée 🟢' : 'Brouillon 🟡'}`
    );
  };

  const handleConfirmDeleteVod = () => {
    if (!deletingVodId) return;
    const target = vodVideos.find((v) => v.id === deletingVodId);
    const updated = vodVideos.filter((v) => v.id !== deletingVodId);
    saveVodVideos(updated);
    setDeletingVodId(null);
    toast.info(`Vidéo « ${target?.title} » supprimée.`);
  };

  const handleOptimizeCloudinaryUrl = () => {
    const rawUrl = vodFormData.url.trim();
    if (!rawUrl) {
      toast.error('Veuillez d’abord coller une URL de vidéo.');
      return;
    }
    const detected = detectVideoProvider(rawUrl);
    if (detected === 'cloudinary' || rawUrl.includes('cloudinary.com')) {
      const eco = getCloudinaryEcoUrl(rawUrl);
      const poster = getCloudinaryPosterUrl(rawUrl) || '';
      const audio = getCloudinaryAudioUrl(rawUrl) || '';

      setVodFormData((prev) => ({
        ...prev,
        provider: 'cloudinary',
        lowUrl: eco,
        posterUrl: poster || prev.posterUrl,
        audioUrl: audio || prev.audioUrl,
      }));
      toast.success('✨ Lien Cloudinary détecté et optimisations 3G/Poster appliquées !');
    } else {
      setVodFormData((prev) => ({
        ...prev,
        provider: detected,
      }));
      toast.info(`Format détecté : ${detected.toUpperCase()}`);
    }
  };

  const handleExportVodCsv = () => {
    const headers = [
      'ID',
      'Titre',
      'Catégorie',
      'Niveau',
      'Hébergeur',
      'URL Principale',
      'URL 3G Éco',
      'Durée (min)',
      'Accès Gratuit',
      'XP Accordé',
      'Vues',
      'Statut',
    ];
    const rows = vodVideos.map((v) => [
      `"${v.id}"`,
      `"${v.title.replace(/"/g, '""')}"`,
      `"${v.category}"`,
      `"${v.level}"`,
      `"${v.provider}"`,
      `"${v.url}"`,
      `"${v.lowUrl || ''}"`,
      v.durationMinutes,
      v.isFree ? 'OUI' : 'NON',
      v.xpReward,
      v.viewsCount,
      v.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vod_videos_pa3_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export CSV des vidéos VOD téléchargé !');
  };

  // =========================================================================
  // ADMIN AUTHENTICATION HANDLERS
  // =========================================================================
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    setTimeout(() => {
      const res = verifyAndLoginAdmin(adminEmail, adminPassword);
      setIsLoggingIn(false);
      if (res.success && res.user) {
        setIsAdmin(true);
        setAdminUser(res.user);
        toast.success(`👑 Bienvenue ${res.user.name}, session administrateur activée !`);
      } else {
        setAuthError(res.error || 'Identifiants administrateur incorrects.');
        toast.error('Accès refusé : identifiants non valides.');
      }
    }, 350);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    setAdminUser(null);
    setAdminPassword('');
    toast.info('Session administrateur verrouillée.');
  };

  // Filtered lists
  const filteredLearners = learners.filter((l) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      l.name.toLowerCase().includes(term) ||
      l.email.toLowerCase().includes(term) ||
      l.phone.toLowerCase().includes(term) ||
      l.city.toLowerCase().includes(term);
    const matchesLevel = levelFilter === 'ALL' || l.level === levelFilter;
    const matchesRole = roleFilter === 'ALL' || l.role === roleFilter;
    const matchesStatus = userStatusFilter === 'ALL' || l.status === userStatusFilter;
    return matchesSearch && matchesLevel && matchesRole && matchesStatus;
  });

  const filteredLessons = lessons.filter((item) => {
    const matchesSearch =
      item.lesson.title_fr.toLowerCase().includes(lessonSearch.toLowerCase()) ||
      item.lesson.title_en.toLowerCase().includes(lessonSearch.toLowerCase()) ||
      item.lesson.slug.toLowerCase().includes(lessonSearch.toLowerCase());
    const matchesStatus =
      lessonStatusFilter === 'ALL' || item.lesson.status === lessonStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredQuestions = questions.filter((q) => {
    const term = questionSearch.toLowerCase();
    const matchesSearch =
      q.stem.toLowerCase().includes(term) ||
      q.prompt_fr.toLowerCase().includes(term) ||
      (q.explanation_fr && q.explanation_fr.toLowerCase().includes(term)) ||
      q.options.some((opt) => opt.toLowerCase().includes(term));
    const matchesLevel = questionLevelFilter === 'ALL' || q.level === questionLevelFilter;
    const matchesSkill = questionSkillFilter === 'ALL' || q.skill === questionSkillFilter;
    return matchesSearch && matchesLevel && matchesSkill;
  });

  const filteredPaliers = paliers
    .filter((p) => {
      const term = palierSearch.toLowerCase();
      const matchesSearch =
        p.code.toLowerCase().includes(term) ||
        p.titleFr.toLowerCase().includes(term) ||
        p.titleEn.toLowerCase().includes(term) ||
        p.descriptionFr.toLowerCase().includes(term);
      const matchesStatus = palierStatusFilter === 'ALL' || p.status === palierStatusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.position - b.position);

  // Authentication Barrier: Show loading skeleton while hydrating client session
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-xs font-semibold tracking-wider uppercase">Chargement sécurisé...</p>
        </div>
      </div>
    );
  }

  // Authentication Barrier: Block non-admin visitors and render dedicated Admin Unlock screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 relative overflow-hidden" suppressHydrationWarning>
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-sky-500/5 to-transparent pointer-events-none blur-3xl" />

        {/* Minimal secure header */}
        <header className="relative z-10 border-b border-white/10 bg-slate-900/60 backdrop-blur-md px-4 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Logo variant="dark" size="sm" />
            <Link
              href="/tableau-de-bord"
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition inline-flex items-center gap-1.5"
            >
              <span>← Retour à l'Académie</span>
            </Link>
          </div>
        </header>

        {/* Main Security Card */}
        <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
          <div className="w-full max-w-md bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            {/* Top Security Badge */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-2xl">
              🔒
            </div>

            <div className="text-center mb-6">
              <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-2">
                Accès Restreint &amp; Sécurisé
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Portail Administration PA³
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Ce portail de gestion (CRUD Leçons, Paliers, Apprenants, VOD, Test de niveau) est strictement réservé au <strong className="text-amber-300 font-semibold">Coach David Liandja</strong> et aux administrateurs accrédités.
              </p>
            </div>

            {/* Error Message if any */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email Administrateur
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="liandjadavid@gmail.com"
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Mot de passe ou Clé Maître
                  </label>
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    Master Key
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Entrez le mot de passe admin..."
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white rounded-xl px-3.5 py-2.5 text-sm outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    <span>🔐 Déverrouiller le Portail Admin</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Info */}
            <div className="mt-6 pt-5 border-t border-white/10 text-[11px] text-slate-400 text-center">
              <p className="font-semibold text-slate-300 mb-1">
                Compte par défaut (Coach David Liandja) :
              </p>
              <p className="font-mono text-amber-400/90 text-[10px]">
                Email: liandjadavid@gmail.com
              </p>
              <p className="font-mono text-slate-400 text-[10px] mt-0.5">
                Mot de passe : <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">CoachDavid2026!</code> ou <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">admin2026</code>
              </p>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="relative z-10 text-center py-4 text-[11px] text-slate-500 border-t border-white/5">
          SpeakUp Congo - PA³ English Academy Kinshasa &copy; 2026. Tous droits réservés.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800" suppressHydrationWarning>
      {/* Admin Header */}
      <header className="bg-navy text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="dark" size="sm" />
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/20">
              <span className="text-xs uppercase tracking-wider font-bold bg-gold/20 text-gold px-2.5 py-0.5 rounded-full border border-gold/30">
                Administration
              </span>
              <span className="text-xs text-slate-300">Portail Pédagogique</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{adminUser?.name || 'Coach David Liandja'}</div>
              <div className="text-[11px] text-slate-400">Directeur Pédagogique • Admin</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center font-black text-gold text-sm shadow">
              {adminUser?.avatar || 'CD'}
            </div>
            <button
              onClick={handleAdminLogout}
              className="text-xs font-bold text-rose-300 hover:text-white px-3 py-1.5 rounded-lg border border-rose-500/40 hover:bg-rose-500/20 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Fermer la session administrateur"
            >
              <span>🔒</span>
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
            <Link
              href="/tableau-de-bord"
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition"
              title="Aller sur l'espace apprenant"
            >
              Quitter
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Nav Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-2xs" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-2 overflow-x-auto touch-scroll no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`py-3.5 px-4 font-black text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'lessons'
                ? 'border-navy text-navy bg-gold/15'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📚 Gestion &amp; CRUD des Leçons</span>
            <span
              className="bg-navy text-gold text-[10px] font-black px-2 py-0.5 rounded-full"
              suppressHydrationWarning
            >
              {isMounted ? lessons.length : 3}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-navy text-navy bg-slate-50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Vue d’ensemble &amp; Chiffres
          </button>
          <button
            onClick={() => setActiveTab('learners')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'learners'
                ? 'border-navy text-navy bg-gold/15 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👥 Gestion des Apprenants</span>
            <span
              className="bg-navy text-gold text-[10px] font-black px-2 py-0.5 rounded-full"
              suppressHydrationWarning
            >
              {isMounted ? learners.length : INITIAL_LEARNERS.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'questions'
                ? 'border-navy text-navy bg-gold/15 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🧭 Test de Niveau &amp; Questions</span>
            <span
              className="bg-navy text-gold text-[10px] font-black px-2 py-0.5 rounded-full"
              suppressHydrationWarning
            >
              {isMounted ? questions.length : 40}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('paliers')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'paliers'
                ? 'border-navy text-navy bg-gold/15 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎯 Paliers &amp; Niveaux CECRL</span>
            <span
              className="bg-navy text-gold text-[10px] font-black px-2 py-0.5 rounded-full"
              suppressHydrationWarning
            >
              {isMounted ? paliers.length : INITIAL_PALIERS.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('vod')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'vod'
                ? 'border-navy text-navy bg-gold/15 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎥 Vidéos VOD &amp; Cloudinary</span>
            <span
              className="bg-navy text-gold text-[10px] font-black px-2 py-0.5 rounded-full"
              suppressHydrationWarning
            >
              {isMounted ? vodVideos.length : INITIAL_VOD_VIDEOS.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'pricing'
                ? 'border-navy text-navy bg-gold/15 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>💳 Tarifs &amp; Afrimoney</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Banner to jump to CRUD */}
            <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white rounded-2xl p-5 border border-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-gold text-navy text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                    Accès Rapide
                  </span>
                  <span className="font-bold text-sm">Gestion &amp; CRUD des Leçons</span>
                </div>
                <p className="text-xs text-slate-300">
                  Ajoutez, modifiez, dupliquez ou mettez vos leçons en ligne / brouillon instantanément.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('lessons')}
                className="btn-3d-gold !py-2.5 !px-5 text-xs font-black inline-flex items-center gap-2 shrink-0"
              >
                <span>Ouvrir la gestion des leçons</span>
                <span>→</span>
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Apprenants Inscrits</div>
                <div className="text-2xl sm:text-3xl font-black text-navy mt-1">1,420</div>
                <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                  <span>↗</span> +18 % ce mois en RDC
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Catalogue de Leçons</div>
                  <div className="text-2xl sm:text-3xl font-black text-navy mt-1" suppressHydrationWarning>
                    {isMounted ? lessons.length : 3}
                  </div>
                  <div className="text-xs text-slate-500 mt-1" suppressHydrationWarning>
                    {isMounted
                      ? `${lessons.filter((l) => l.lesson.status === 'published').length} publiées • ${lessons.filter((l) => l.lesson.status === 'draft').length} brouillons`
                      : '3 publiées • 0 brouillon'}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('lessons')}
                  className="mt-3 text-xs font-bold text-navy hover:text-gold flex items-center gap-1 transition"
                >
                  <span>Gérer les leçons (CRUD) →</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Taux de Réussite</div>
                <div className="text-2xl sm:text-3xl font-black text-green-600 mt-1">84.5 %</div>
                <div className="text-xs text-slate-500 mt-1">Seuil minimal : 70 % requis</div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Certificats Délivrés</div>
                <div className="text-2xl sm:text-3xl font-black text-gold-dark mt-1">215</div>
                <div className="text-xs text-slate-500 mt-1">Vérifiables par QR code officiel</div>
              </div>
            </div>

            {/* Quick Actions & City Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* City Breakdown */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>📍</span> Répartition Géographique en RD Congo
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Kinshasa (Gombe, Limete, Bandal, etc.)</span>
                      <span>62 % (880 apprenants)</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-navy h-full rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Lubumbashi &amp; Haut-Katanga</span>
                      <span>21 % (298 apprenants)</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-gold h-full rounded-full" style={{ width: '21%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Goma &amp; Nord-Kivu</span>
                      <span>11 % (156 apprenants)</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-green-600 h-full rounded-full" style={{ width: '11%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Autres (Matadi, Bukavu, Kolwezi, Kisangani)</span>
                      <span>6 % (86 apprenants)</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full" style={{ width: '6%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Coach Contact & Direct Support */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span>📱</span> Contact Direct Coach David
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Assistance pédagogique et orientation des étudiants en présentiel &amp; en ligne.
                  </p>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-500">WhatsApp :</span>{' '}
                      <span className="font-bold text-slate-900">+27 74 293 2071</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-500">Téléphone RDC :</span>{' '}
                      <span className="font-bold text-slate-900">098 689 8083</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-500">Email :</span>{' '}
                      <span className="font-bold text-slate-900">liandjadavid@gmail.com</span>
                    </div>
                  </div>
                </div>

                <a
                  href="https://wa.me/27742932071"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 btn-duo-secondary !py-2.5 text-xs text-center block"
                >
                  Ouvrir WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LESSONS (FULL CRUD & CONTROL) */}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Rechercher une leçon par titre ou slug..."
                  value={lessonSearch}
                  onChange={(e) => setLessonSearch(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-navy"
                />

                <select
                  value={lessonStatusFilter}
                  onChange={(e) => setLessonStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                >
                  <option value="ALL">Tous les statuts ({lessons.length})</option>
                  <option value="published">
                    En ligne ({lessons.filter((l) => l.lesson.status === 'published').length})
                  </option>
                  <option value="draft">
                    Brouillons ({lessons.filter((l) => l.lesson.status === 'draft').length})
                  </option>
                </select>
              </div>

              {/* CREATE BUTTON */}
              <button
                onClick={handleOpenCreate}
                className="btn-duo !py-2.5 !px-4 text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 font-black shadow"
              >
                <span>➕</span> Créer une nouvelle leçon
              </button>
            </div>

            {/* Lessons List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">
                  Catalogue des Cours &amp; Leçons ({filteredLessons.length})
                </h2>
                <span className="text-xs text-slate-500">
                  Modifiez, dupliquez ou publiez vos leçons en un clic.
                </span>
              </div>

              {filteredLessons.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Aucune leçon ne correspond à votre recherche.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLessons.map((item) => {
                    const isPublished = item.lesson.status === 'published';
                    return (
                      <div
                        key={item.lesson.slug}
                        className="rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-sm transition bg-white"
                      >
                        {/* Info Column */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-slate-900 text-base sm:text-lg">
                              {item.lesson.title_fr}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              ({item.lesson.title_en})
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                isPublished
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isPublished ? '● En ligne' : '○ Brouillon'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-1">
                            {item.lesson.objective_fr}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
                              slug: {item.lesson.slug}
                            </span>
                            <span>⏱️ {item.lesson.est_minutes} min</span>
                            <span>⚡ +{item.lesson.xp_reward} XP</span>
                            <span>🎯 Réussite : {item.lesson.pass_mark}%</span>
                            <span>📝 {item.exercises.length} exercices</span>
                            {item.video?.url && (
                              <span className="text-blue-600 font-semibold">
                                📹 Vidéo ({item.video.provider})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions Toolbar */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                          {/* Preview Link */}
                          <Link
                            href={`/lecon/${item.lesson.slug}`}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1"
                            title="Voir la leçon comme un étudiant"
                          >
                            <span>👁️</span> Aperçu
                          </Link>

                          {/* UPDATE / EDIT BUTTON */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="px-3 py-1.5 rounded-xl bg-navy/10 hover:bg-navy/15 text-navy font-bold text-xs transition flex items-center gap-1"
                          >
                            <span>✏️</span> Modifier
                          </button>

                          {/* DUPLICATE BUTTON */}
                          <button
                            onClick={() => handleDuplicateLesson(item)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition"
                            title="Dupliquer la leçon"
                          >
                            <span>📋</span> Copier
                          </button>

                          {/* TOGGLE PUBLISH / DRAFT */}
                          <button
                            onClick={() => toggleLessonStatus(item.lesson.slug)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                              isPublished
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                            }`}
                          >
                            {isPublished ? 'Mettre en brouillon' : 'Publier'}
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => setDeletingLessonSlug(item.lesson.slug)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Supprimer la leçon"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LEARNERS & USERS (FULL CRUD & CONTROL) */}
        {activeTab === 'learners' && (
          <div className="space-y-6">
            {/* Action & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, tél ou ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-navy"
                />

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                >
                  <option value="ALL">Tous les niveaux</option>
                  <option value="A1">Niveau A1</option>
                  <option value="A2">Niveau A2</option>
                  <option value="B1">Niveau B1</option>
                  <option value="B2">Niveau B2</option>
                </select>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                >
                  <option value="ALL">Tous les rôles</option>
                  <option value="learner">Apprenants</option>
                  <option value="teacher">Enseignants</option>
                  <option value="admin">Administrateurs</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="suspended">Suspendus</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {/* CREATE LEARNER BUTTON */}
                <button
                  onClick={handleOpenCreateLearner}
                  className="btn-duo !py-2.5 !px-4 text-xs sm:text-sm flex items-center justify-center gap-2 font-black shadow"
                >
                  <span>➕</span> Inscrire un apprenant
                </button>

                {/* EXPORT CSV BUTTON */}
                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  title="Exporter au format CSV"
                >
                  <span>📥</span> CSV
                </button>
              </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Répertoire des Apprenants &amp; Utilisateurs ({filteredLearners.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gérez les inscriptions, mettez à jour les profils, suspendez ou attribuez des XP.
                  </p>
                </div>
                {learners.length !== INITIAL_LEARNERS.length && (
                  <button
                    onClick={() => {
                      if (confirm('Réinitialiser la liste des apprenants aux valeurs par défaut ?')) {
                        saveLearners(INITIAL_LEARNERS);
                        toast.info('Liste des apprenants réinitialisée.');
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {filteredLearners.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Aucun utilisateur ne correspond à vos critères de recherche.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Utilisateur / Apprenant</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Ville</th>
                        <th className="py-3 px-4 text-center">Niveau &amp; Statut</th>
                        <th className="py-3 px-4 text-center">Progression</th>
                        <th className="py-3 px-4 text-right">Actions (CRUD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLearners.map((lrn) => {
                        const isActive = lrn.status === 'active';
                        return (
                          <tr key={lrn.id} className="hover:bg-slate-50/80 transition">
                            {/* User & Role */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-navy/10 text-navy font-black flex items-center justify-center text-xs shrink-0">
                                  {lrn.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{lrn.name}</span>
                                    {lrn.role === 'admin' && (
                                      <span className="text-[10px] font-black uppercase bg-gold/20 text-gold-dark border border-gold/40 px-1.5 py-0.2 rounded">
                                        Admin
                                      </span>
                                    )}
                                    {lrn.role === 'teacher' && (
                                      <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded">
                                        Coach
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    id: {lrn.id}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Contact */}
                            <td className="py-3.5 px-4 text-slate-600">
                              <a
                                href={`mailto:${lrn.email}`}
                                className="hover:text-navy hover:underline block font-medium"
                              >
                                {lrn.email}
                              </a>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {lrn.phone}
                              </div>
                            </td>

                            {/* City */}
                            <td className="py-3.5 px-4 text-slate-700">
                              <span className="inline-flex items-center gap-1">
                                <span>📍</span>
                                <span>{lrn.city}</span>
                              </span>
                            </td>

                            {/* Level & Status */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="px-2 py-0.5 rounded font-black text-xs bg-navy text-white">
                                  {lrn.level}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    isActive
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-red-100 text-red-800 border border-red-300'
                                  }`}
                                >
                                  {isActive ? '● Actif' : '○ Suspendu'}
                                </span>
                              </div>
                            </td>

                            {/* Progress */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="text-xs font-bold text-slate-900">
                                {lrn.lessonsDone} cours
                              </div>
                              <div className="text-[11px] font-extrabold text-gold-dark">
                                ⚡ {lrn.totalXp} XP
                              </div>
                              <div className="text-[11px] font-bold text-amber-700">
                                🔥 {lrn.streakDays}j série
                              </div>
                            </td>

                            {/* Actions Toolbar */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                {/* EDIT BUTTON */}
                                <button
                                  onClick={() => handleOpenEditLearner(lrn)}
                                  className="px-2.5 py-1 rounded-lg bg-navy/10 hover:bg-navy/15 text-navy font-bold text-xs transition flex items-center gap-1"
                                  title="Modifier les informations"
                                >
                                  <span>✏️</span> Modifier
                                </button>

                                {/* TOGGLE STATUS BUTTON */}
                                <button
                                  onClick={() => toggleLearnerStatus(lrn.id)}
                                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                                    isActive
                                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                                  title={isActive ? 'Suspendre le compte' : 'Activer le compte'}
                                >
                                  {isActive ? 'Suspendre' : 'Activer'}
                                </button>

                                {/* BONUS XP */}
                                <button
                                  onClick={() => handleAwardBonusXp(lrn.id, 50)}
                                  className="px-2 py-1 rounded-lg bg-gold/20 hover:bg-gold/30 text-gold-dark font-extrabold text-[11px] transition"
                                  title="Accorder +50 XP bonus"
                                >
                                  +50 XP
                                </button>

                                {/* WHATSAPP */}
                                {lrn.phone && (
                                  <a
                                    href={`https://wa.me/${lrn.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                      `Bonjour ${lrn.name}, c'est Coach David de PA³ English Academy ! Félicitations pour tes progrès.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs"
                                    title="Discuter sur WhatsApp"
                                  >
                                    💬
                                  </a>
                                )}

                                {/* DELETE BUTTON */}
                                {lrn.role !== 'admin' && (
                                  <button
                                    onClick={() => setDeletingLearnerId(lrn.id)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition text-xs"
                                    title="Supprimer l'apprenant"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: QUESTIONS CRUD */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Top Stats & Filters Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Rechercher par mot-clé, énoncé, consigne..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                  {questionSearch && (
                    <button
                      onClick={() => setQuestionSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Level Filter */}
                <select
                  value={questionLevelFilter}
                  onChange={(e) => setQuestionLevelFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy font-bold text-navy"
                >
                  <option value="ALL">Tous les niveaux</option>
                  <option value="A1">Niveau A1 (Débutant)</option>
                  <option value="A2">Niveau A2 (Élémentaire)</option>
                  <option value="B1">Niveau B1 (Intermédiaire)</option>
                  <option value="B2">Niveau B2 (Avancé)</option>
                </select>

                {/* Skill Filter */}
                <select
                  value={questionSkillFilter}
                  onChange={(e) => setQuestionSkillFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                >
                  <option value="ALL">Toutes les compétences</option>
                  <option value="vocabulary">🔤 Vocabulaire</option>
                  <option value="grammar">✍️ Grammaire</option>
                  <option value="reading">📖 Compréhension écrite</option>
                  <option value="listening">🎧 Compréhension orale</option>
                  <option value="speaking">🎙️ Expression orale</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {/* CREATE QUESTION BUTTON */}
                <button
                  onClick={handleOpenCreateQuestion}
                  className="btn-duo !py-2.5 !px-4 text-xs sm:text-sm flex items-center justify-center gap-2 font-black shadow"
                >
                  <span>➕</span> Nouvelle question
                </button>

                {/* EXPORT CSV BUTTON */}
                <button
                  onClick={handleExportQuestionsCsv}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  title="Exporter les questions au format CSV"
                >
                  <span>📥</span> CSV
                </button>
              </div>
            </div>

            {/* Quick Level Distribution Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['A1', 'A2', 'B1', 'B2'] as CefrLevel[]).map((lvl) => {
                const count = questions.filter((q) => q.level === lvl).length;
                const isSelected = questionLevelFilter === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() =>
                      setQuestionLevelFilter(isSelected ? 'ALL' : lvl)
                    }
                    className={`p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-navy text-white border-navy shadow-md ring-2 ring-gold'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Palier {lvl}
                      </span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-gold text-navy' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {count} questions
                      </span>
                    </div>
                    <div className="text-[11px] opacity-80 truncate">
                      {lvl === 'A1' && 'Débutant immédiat'}
                      {lvl === 'A2' && 'Expressions quotidiennes'}
                      {lvl === 'B1' && 'Autonomie & Débats'}
                      {lvl === 'B2' && 'Entretiens & Bourses'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Questions List Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Banque de Questions d’Évaluation ({filteredQuestions.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ces questions alimentent en direct l’algorithme adaptatif du{' '}
                    <Link
                      href="/test-de-niveau"
                      target="_blank"
                      className="text-navy font-bold hover:underline"
                    >
                      Test de Niveau en ligne ↗
                    </Link>
                  </p>
                </div>
                {questions.length !== PLACEMENT_QUESTIONS.length && (
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          'Réinitialiser la banque de questions aux 40 questions étalonnées par défaut ?'
                        )
                      ) {
                        saveQuestions(PLACEMENT_QUESTIONS);
                        toast.info('Banque de questions réinitialisée aux 40 d’origine.');
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm space-y-2">
                  <div className="text-3xl">🔍</div>
                  <p className="font-bold text-slate-700">
                    Aucune question ne correspond à vos filtres.
                  </p>
                  <button
                    onClick={() => {
                      setQuestionSearch('');
                      setQuestionLevelFilter('ALL');
                      setQuestionSkillFilter('ALL');
                    }}
                    className="text-xs text-navy font-bold hover:underline"
                  >
                    Effacer les filtres
                  </button>
                </div>
              ) : (
                <div className="p-4 sm:p-6 space-y-4">
                  {filteredQuestions.map((q, idx) => {
                    const skillLabel = SKILL_LABELS_FR[q.skill] || q.skill;
                    return (
                      <div
                        key={q.id}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition space-y-3"
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider text-white ${
                                q.level === 'A1'
                                  ? 'bg-emerald-600'
                                  : q.level === 'A2'
                                  ? 'bg-sky-600'
                                  : q.level === 'B1'
                                  ? 'bg-amber-600'
                                  : 'bg-purple-600'
                              }`}
                            >
                              {q.level}
                            </span>
                            <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              {q.skill === 'vocabulary' && '🔤'}
                              {q.skill === 'grammar' && '✍️'}
                              {q.skill === 'reading' && '📖'}
                              {q.skill === 'listening' && '🎧'}
                              {q.skill === 'speaking' && '🎙️'}
                              <span>{skillLabel}</span>
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              #{idx + 1} ({q.id})
                            </span>
                          </div>

                          {/* Action Toolbar */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleOpenEditQuestion(q)}
                              className="px-2.5 py-1 rounded-lg bg-navy/10 hover:bg-navy/15 text-navy font-bold text-xs transition flex items-center gap-1"
                              title="Modifier la question"
                            >
                              <span>✏️</span> Modifier
                            </button>
                            <button
                              onClick={() => handleDuplicateQuestion(q)}
                              className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition flex items-center gap-1"
                              title="Dupliquer la question"
                            >
                              <span>📋</span> Copier
                            </button>
                            <button
                              onClick={() => setDeletingQuestionId(q.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition text-xs"
                              title="Supprimer la question"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* Prompt & Stem */}
                        <div>
                          {q.prompt_fr && (
                            <div className="text-xs text-slate-500 italic mb-1">
                              👉 {q.prompt_fr}
                            </div>
                          )}
                          <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                            {q.stem}
                          </div>
                        </div>

                        {/* Optional Passage */}
                        {q.passage && (
                          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-slate-700 leading-relaxed font-serif">
                            <strong className="block text-[10px] font-sans font-bold uppercase tracking-wider text-amber-900 mb-1">
                              Extrait à lire :
                            </strong>
                            « {q.passage} »
                          </div>
                        )}

                        {/* Optional Audio Text */}
                        {q.audio_text && (
                          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center gap-2">
                            <span>🔊</span>
                            <span>
                              <strong>Audio prononcé :</strong> &quot;{q.audio_text}&quot;
                            </span>
                          </div>
                        )}

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = optIdx === q.correct_index;
                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl border flex items-center justify-between gap-1 transition ${
                                  isCorrect
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className="truncate">
                                  <strong className="font-mono text-slate-400 mr-1.5">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </strong>
                                  {opt}
                                </span>
                                {isCorrect && (
                                  <span className="text-emerald-600 text-xs shrink-0 font-bold" title="Bonne réponse">
                                    ✓
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation_fr && (
                          <div className="text-[11px] text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2">
                            <span>💡</span>
                            <span>
                              <strong>Explication :</strong> {q.explanation_fr}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: PALIERS & NIVEAUX CECRL */}
        {/* ================================================================= */}
        {activeTab === 'paliers' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white rounded-3xl p-6 sm:p-8 border border-gold/40 shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-extrabold bg-gold/20 text-gold px-3 py-1 rounded-full border border-gold/40">
                      Structure Pédagogique CECRL
                    </span>
                    <span className="text-xs text-slate-300">Portail Directoire PA³</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    🎯 Paliers d’Apprentissage &amp; Niveaux d’Anglais
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Créez et configurez les paliers du parcours d&apos;apprentissage (A1, A2, B1, B2, C1, Anglais des Affaires...).
                    Toute modification ou ajout se synchronise directement avec le parcours interactif des apprenants,
                    la tarification des pass et la progression par paliers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                  <button
                    onClick={handleExportPaliersCsv}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-2"
                  >
                    <span>📥</span>
                    <span>Exporter CSV</span>
                  </button>
                  <button
                    onClick={handleOpenCreatePalier}
                    className="btn-duo !py-3 !px-5 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>➕</span>
                    <span>Nouveau Palier / Niveau</span>
                  </button>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                  <div className="text-[11px] font-bold text-slate-400">Total Paliers</div>
                  <div className="text-2xl font-black text-white mt-0.5">{paliers.length}</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                  <div className="text-[11px] font-bold text-slate-400">Paliers Publiés</div>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">
                    {paliers.filter((p) => p.status === 'published').length}
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                  <div className="text-[11px] font-bold text-slate-400">Accès 100% Gratuit</div>
                  <div className="text-2xl font-black text-gold mt-0.5">
                    {paliers.filter((p) => p.isFree).length}
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                  <div className="text-[11px] font-bold text-slate-400">Seuil XP Maximal</div>
                  <div className="text-2xl font-black text-sky-400 mt-0.5">
                    {Math.max(...paliers.map((p) => p.requiredXp || 0))} XP
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-96 relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Rechercher par code (A1, B2...), titre ou public cible..."
                  value={palierSearch}
                  onChange={(e) => setPalierSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                <span className="text-xs font-bold text-slate-500 shrink-0">Statut :</span>
                {(['ALL', 'published', 'draft'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPalierStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      palierStatusFilter === st
                        ? 'bg-navy text-gold shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {st === 'ALL' ? 'Tous les statuts' : st === 'published' ? '🟢 Publiés' : '🟡 Brouillons'}
                  </button>
                ))}
              </div>
            </div>

            {/* Paliers Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPaliers.map((palier) => {
                const isPublished = palier.status === 'published';
                const associatedLessons = lessons.filter(
                  (l) => l.lesson.slug.startsWith(palier.code.toLowerCase()) || (l.lesson as any).level === palier.code
                );

                return (
                  <div
                    key={palier.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden relative group"
                  >
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Top Bar: Icon + Code + Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-3xl flex items-center justify-center shadow-inner shrink-0">
                            {palier.badgeIcon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-xl text-slate-900">{palier.code}</h3>
                              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                                Pos. #{palier.position}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-slate-500 block">
                              {palier.titleEn}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isPublished
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isPublished ? '● Publié' : '○ Brouillon'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              palier.isFree
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-gold/15 text-navy border border-gold/40'
                            }`}
                          >
                            {palier.isFree ? '100% Gratuit' : 'Pass Membre'}
                          </span>
                        </div>
                      </div>

                      {/* Main Title & Description */}
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                          {palier.titleFr}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {palier.descriptionFr}
                        </p>
                      </div>

                      {/* Metadata Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-bold text-slate-700">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                          <span className="text-slate-500">XP Requis :</span>
                          <span className="text-navy font-black">{palier.requiredXp} XP</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                          <span className="text-slate-500">Validation :</span>
                          <span className="text-emerald-700 font-black">≥ {palier.passingScorePct}%</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                          <span className="text-slate-500">Durée est. :</span>
                          <span>{palier.estimatedWeeks || 6} sem.</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                          <span className="text-slate-500">Leçons :</span>
                          <span className="text-navy font-bold">{associatedLessons.length}</span>
                        </div>
                      </div>

                      {/* Target Learner */}
                      {palier.targetLearner && (
                        <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2 rounded-xl border border-amber-200/60">
                          🎯 <strong>Public cible :</strong> {palier.targetLearner}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleTogglePalierStatus(palier)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                          isPublished
                            ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                        title={isPublished ? 'Passer en brouillon' : 'Publier ce palier'}
                      >
                        <span>{isPublished ? '👁️' : '🚀'}</span>
                        <span>{isPublished ? 'Brouillon' : 'Publier'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditPalier(palier)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition flex items-center gap-1"
                        >
                          <span>✏️</span>
                          <span>Modifier</span>
                        </button>
                        {palier.code !== 'A1' && (
                          <button
                            onClick={() => setDeletingPalierId(palier.id)}
                            className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-slate-200 font-bold text-xs transition"
                            title="Supprimer ce palier"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: VIDEO ON DEMAND (VOD) & CLOUDINARY */}
        {/* ================================================================= */}
        {activeTab === 'vod' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white rounded-3xl p-6 sm:p-8 border border-gold/40 shadow-md relative overflow-hidden">
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-gold/20 text-gold text-xs font-black uppercase px-3 py-1 rounded-full border border-gold/30">
                    <span>🎥 Streaming &amp; Vidéo Pédagogique</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    Gestion des Vidéos à la Demande (VOD)
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Ajoutez et intégrez facilement vos cours par simple lien URL. Compatible avec{' '}
                    <strong className="text-sky-300">Cloudinary</strong> (optimisation automatique 3G &amp; miniatures),{' '}
                    <strong className="text-red-300">YouTube</strong>,{' '}
                    <strong className="text-sky-400">Vimeo</strong> et fichiers MP4 directs.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    onClick={handleExportVodCsv}
                    className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>📥 Exporter CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      setVodFormData(EMPTY_VOD_FORM);
                      setIsVodCreateOpen(true);
                    }}
                    className="px-5 py-3 rounded-xl bg-gold hover:bg-gold-light text-navy font-black text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>➕ Ajouter une Vidéo VOD</span>
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <div className="text-slate-400 text-[11px] font-semibold">Total Vidéos</div>
                  <div className="text-xl font-black text-white mt-1">{vodVideos.length}</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <div className="text-slate-400 text-[11px] font-semibold">Vidéos Publiées</div>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    {vodVideos.filter((v) => v.status === 'published').length}
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <div className="text-slate-400 text-[11px] font-semibold">Hébergées Cloudinary</div>
                  <div className="text-xl font-black text-sky-400 mt-1">
                    {vodVideos.filter((v) => v.provider === 'cloudinary').length}
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                  <div className="text-slate-400 text-[11px] font-semibold">100% Gratuites</div>
                  <div className="text-xl font-black text-amber-300 mt-1">
                    {vodVideos.filter((v) => v.isFree).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Rechercher une vidéo VOD par titre, description ou note du coach..."
                  value={vodSearch}
                  onChange={(e) => setVodSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-gold"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Category Filter */}
                <select
                  value={vodCategoryFilter}
                  onChange={(e) => setVodCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-gold"
                >
                  <option value="ALL">Toutes Catégories</option>
                  {VOD_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>

                {/* Provider Filter */}
                <select
                  value={vodProviderFilter}
                  onChange={(e) => setVodProviderFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-gold"
                >
                  <option value="ALL">Tous Hébergeurs</option>
                  <option value="cloudinary">Cloudinary</option>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="mp4">MP4 direct</option>
                </select>

                {/* Status Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setVodStatusFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      vodStatusFilter === 'ALL' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setVodStatusFilter('published')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      vodStatusFilter === 'published'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Publiés
                  </button>
                  <button
                    onClick={() => setVodStatusFilter('draft')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      vodStatusFilter === 'draft'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Brouillons
                  </button>
                </div>
              </div>
            </div>

            {/* VOD Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {vodVideos
                .filter((v) => {
                  const q = vodSearch.toLowerCase();
                  const matchSearch =
                    v.title.toLowerCase().includes(q) ||
                    v.description.toLowerCase().includes(q) ||
                    (v.coachNote || '').toLowerCase().includes(q);
                  const matchCategory = vodCategoryFilter === 'ALL' || v.category === vodCategoryFilter;
                  const matchProvider = vodProviderFilter === 'ALL' || v.provider === vodProviderFilter;
                  const matchStatus = vodStatusFilter === 'ALL' || v.status === vodStatusFilter;
                  return matchSearch && matchCategory && matchProvider && matchStatus;
                })
                .map((video) => {
                  const isPublished = video.status === 'published';

                  return (
                    <div
                      key={video.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      {/* Top Poster Thumbnail */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        {video.posterUrl ? (
                          <img
                            src={video.posterUrl}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-slate-900 text-slate-500">
                            <span className="text-3xl">🎥</span>
                          </div>
                        )}

                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="bg-navy/90 text-gold text-[10px] font-black px-2 py-0.5 rounded-md border border-gold/30">
                            Niveau {video.level}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                              video.provider === 'cloudinary'
                                ? 'bg-sky-500 text-white font-black'
                                : video.provider === 'youtube'
                                ? 'bg-red-600 text-white font-black'
                                : 'bg-slate-800 text-white font-bold'
                            }`}
                          >
                            {video.provider}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          {video.isFree ? (
                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                              Gratuit
                            </span>
                          ) : (
                            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              🔒 Membre
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs font-semibold">
                          <span>⏱️ {video.durationMinutes} min</span>
                          <span>⚡ +{video.xpReward} XP</span>
                          <span>👁️ {video.viewsCount} vues</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            {VOD_CATEGORIES.find((c) => c.id === video.category)?.label || video.category}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isPublished ? '🟢 Publiée' : '🟡 Brouillon'}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                          {video.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>

                        {video.coachNote && (
                          <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200 line-clamp-2">
                            <strong>Note Coach :</strong> {video.coachNote}
                          </div>
                        )}
                      </div>

                      {/* Actions Footer */}
                      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => setPreviewVodVideo(video)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                          title="Tester la lecture dans le lecteur"
                        >
                          <span>▶️</span>
                          <span>Aperçu</span>
                        </button>

                        <button
                          onClick={() => handleToggleVodStatus(video)}
                          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            isPublished
                              ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                          title={isPublished ? 'Passer en brouillon' : 'Publier la vidéo'}
                        >
                          <span>{isPublished ? '👁️' : '🚀'}</span>
                          <span>{isPublished ? 'Brouillon' : 'Publier'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditVod(video)}
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                            title="Modifier cette vidéo"
                          >
                            <span>✏️</span>
                            <span>Modifier</span>
                          </button>

                          <button
                            onClick={() => setDeletingVodId(video.id)}
                            className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-slate-200 font-bold text-xs transition cursor-pointer"
                            title="Supprimer cette vidéo"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 7: PRICING & AFRIMONEY */}
        {activeTab === 'pricing' && (
          <PricingManagement />
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL 1: CREATE LESSON */}
      {/* ================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                  Portail Pédagogique
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Créer une Nouvelle Leçon
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre en Français *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Au restaurant"
                      value={lessonFormData.title_fr}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, title_fr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre en Anglais *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: At the Restaurant"
                      value={lessonFormData.title_en}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, title_en: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Slug URL (optionnel, généré automatiquement)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: a1-au-restaurant"
                    value={lessonFormData.slug}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Objectif Pédagogique (pour l'étudiant)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ex: Commander à manger, demander l'addition et comprendre les prix."
                    value={lessonFormData.objective_fr}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, objective_fr: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Explication de Cours &amp; Vocabulaire Clé
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Conseils de prononciation, points de grammaire et dialogue type..."
                    value={lessonFormData.explanation_fr}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, explanation_fr: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Durée (min)</label>
                    <input
                      type="number"
                      min={2}
                      max={60}
                      value={lessonFormData.est_minutes}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, est_minutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">XP Récompense</label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={lessonFormData.xp_reward}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, xp_reward: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Réussite (%)</label>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={lessonFormData.pass_mark}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, pass_mark: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Statut Initial</label>
                    <select
                      value={lessonFormData.status}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    >
                      <option value="published">En ligne</option>
                      <option value="draft">Brouillon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ID Vidéo YouTube ou URL MP4 (optionnel)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={lessonFormData.video_provider}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, video_provider: e.target.value as any })}
                      className="px-3 py-2 rounded-xl border border-slate-300 shrink-0 font-medium"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="mp4">MP4 Direct</option>
                      <option value="hls">HLS Stream</option>
                    </select>
                    <input
                      type="text"
                      placeholder="ex: dQw4w9WgXcQ ou lien vidéo"
                      value={lessonFormData.video_url}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, video_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-duo !py-2.5 !px-6 font-black shadow"
                >
                  Enregistrer et Créer la Leçon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: EDIT / UPDATE LESSON */}
      {/* ================================================================= */}
      {editingLessonSlug && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                  Mise à jour Pédagogique
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Modifier la Leçon : {lessonFormData.title_fr}
                </h3>
              </div>
              <button
                onClick={() => setEditingLessonSlug(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre en Français *
                    </label>
                    <input
                      type="text"
                      required
                      value={lessonFormData.title_fr}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, title_fr: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre en Anglais *
                    </label>
                    <input
                      type="text"
                      required
                      value={lessonFormData.title_en}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, title_en: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Slug Identifiant (lecture seule)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={lessonFormData.slug}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Objectif Pédagogique
                  </label>
                  <textarea
                    rows={2}
                    value={lessonFormData.objective_fr}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, objective_fr: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Explication de Cours (Markdown)
                  </label>
                  <textarea
                    rows={4}
                    value={lessonFormData.explanation_fr}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, explanation_fr: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Durée (min)</label>
                    <input
                      type="number"
                      min={2}
                      max={60}
                      value={lessonFormData.est_minutes}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, est_minutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">XP Récompense</label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={lessonFormData.xp_reward}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, xp_reward: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Réussite (%)</label>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={lessonFormData.pass_mark}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, pass_mark: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Statut</label>
                    <select
                      value={lessonFormData.status}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                    >
                      <option value="published">En ligne</option>
                      <option value="draft">Brouillon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ID Vidéo YouTube ou Lien MP4
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={lessonFormData.video_provider}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, video_provider: e.target.value as any })}
                      className="px-3 py-2 rounded-xl border border-slate-300 shrink-0 font-medium"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="mp4">MP4 Direct</option>
                      <option value="hls">HLS Stream</option>
                    </select>
                    <input
                      type="text"
                      value={lessonFormData.video_url}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, video_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLessonSlug(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-duo !py-2.5 !px-6 font-black shadow"
                >
                  Sauvegarder les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION */}
      {/* ================================================================= */}
      {deletingLessonSlug && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
              ⚠️
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">
                Supprimer cette leçon ?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement la leçon{' '}
                <strong className="text-slate-900 font-mono">
                  {deletingLessonSlug}
                </strong>{' '}
                ? Cette action retirera la leçon du parcours étudiant.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingLessonSlug(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
              >
                Oui, Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 4: CREATE LEARNER / USER */}
      {/* ================================================================= */}
      {isLearnerCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                  Gestion des Utilisateurs
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Inscrire un Nouvel Utilisateur
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Création manuelle de compte dans le répertoire PA³ English Academy.
                </p>
              </div>
              <button
                onClick={() => setIsLearnerCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLearnerSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nom Complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Patient Kalala"
                      value={learnerFormData.name}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ex: patient.kalala@gmail.com"
                      value={learnerFormData.email}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Téléphone / WhatsApp
                    </label>
                    <input
                      type="text"
                      placeholder="+243 81 234 5678"
                      value={learnerFormData.phone}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ville / Commune
                    </label>
                    <input
                      type="text"
                      placeholder="Kinshasa (Gombe), Lubumbashi, Goma..."
                      value={learnerFormData.city}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, city: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Niveau CECRL
                    </label>
                    <select
                      value={learnerFormData.level}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, level: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy font-bold text-navy"
                    >
                      {paliers.map((p) => (
                        <option key={p.id} value={p.code}>
                          {p.badgeIcon} {p.code} - {p.titleFr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Rôle Système
                    </label>
                    <select
                      value={learnerFormData.role}
                      onChange={(e) =>
                        setLearnerFormData({
                          ...learnerFormData,
                          role: e.target.value as 'learner' | 'teacher' | 'admin',
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    >
                      <option value="learner">Apprenant</option>
                      <option value="teacher">Coach / Enseignant</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Statut du Compte
                    </label>
                    <select
                      value={learnerFormData.status}
                      onChange={(e) =>
                        setLearnerFormData({
                          ...learnerFormData,
                          status: e.target.value as 'active' | 'suspended',
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    >
                      <option value="active">Actif (autorisé)</option>
                      <option value="suspended">Suspendu (bloqué)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      XP Initiaux (⚡)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={learnerFormData.totalXp}
                      onChange={(e) =>
                        setLearnerFormData({
                          ...learnerFormData,
                          totalXp: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Série Initiale (Jours 🔥)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={learnerFormData.streakDays}
                      onChange={(e) =>
                        setLearnerFormData({
                          ...learnerFormData,
                          streakDays: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>
              </div>

              {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLearnerCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-duo !py-2.5 !px-6 font-black shadow-md flex items-center gap-2"
                >
                  <span>➕</span> Inscrire l&apos;Utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 5: EDIT LEARNER / USER */}
      {/* ================================================================= */}
      {editingLearnerId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                  Mise à jour Utilisateur
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Modifier : {learnerFormData.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                  ID: {editingLearnerId}
                </p>
              </div>
              <button
                onClick={() => setEditingLearnerId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditLearnerSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nom Complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={learnerFormData.name}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={learnerFormData.email}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Téléphone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={learnerFormData.phone}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ville / Commune
                    </label>
                    <input
                      type="text"
                      value={learnerFormData.city}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, city: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Niveau CECRL
                    </label>
                    <select
                      value={learnerFormData.level}
                      onChange={(e) =>
                        setLearnerFormData({ ...learnerFormData, level: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy font-bold text-navy"
                    >
                      {paliers.map((p) => (
                        <option key={p.id} value={p.code}>
                          {p.badgeIcon} {p.code} - {p.titleFr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Rôle Système
                    </label>
                    <select
                      value={learnerFormData.role}
                      onChange={(e) =>
                        setLearnerFormData({
                          ...learnerFormData,
                          role: e.target.value as 'learner' | 'teacher' | 'admin',
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    >
                      <option value="learner">Apprenant</option>
                      <option value="teacher">Coach / Enseignant</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Statut du Compte
                    </label>
                    <select
                      value={learnerFormData.status}
                      onChange={(e) =>
                        setLearnerFormData({
                          ...learnerFormData,
                          status: e.target.value as 'active' | 'suspended',
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    >
                      <option value="active">Actif</option>
                      <option value="suspended">Suspendu</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      XP Total (⚡)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={learnerFormData.totalXp}
                      onChange={(e) =>
                        setLearnerFormData({
                          ...learnerFormData,
                          totalXp: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Série Active (Jours 🔥)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={learnerFormData.streakDays}
                      onChange={(e) =>
                        setLearnerFormData({
                          ...learnerFormData,
                          streakDays: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>
              </div>

              {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLearnerId(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-duo !py-2.5 !px-6 font-black shadow-md flex items-center gap-2"
                >
                  <span>💾</span> Sauvegarder les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 6: DELETE LEARNER / USER CONFIRMATION */}
      {/* ================================================================= */}
      {deletingLearnerId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
              👤
            </div>

            {(() => {
              const target = learners.find((l) => l.id === deletingLearnerId);
              const isAdmin = target?.role === 'admin';

              return (
                <>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-900">
                      Supprimer cet utilisateur ?
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Êtes-vous sûr de vouloir supprimer définitivement le compte de{' '}
                      <strong className="text-slate-900">{target?.name}</strong> (
                      <span className="font-mono text-slate-500">{target?.email}</span>) ?
                    </p>
                    {isAdmin ? (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                        ⚠️ Ce compte est un Administrateur. Pour des raisons de sécurité, les administrateurs ne peuvent pas être supprimés.
                      </div>
                    ) : (
                      <p className="text-[11px] text-red-600 mt-2 font-medium">
                        Cette action est irréversible et supprimera tout son historique de leçons et d’XP.
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setDeletingLearnerId(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                    >
                      Annuler
                    </button>
                    {!isAdmin && (
                      <button
                        onClick={handleConfirmDeleteLearner}
                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
                      >
                        Oui, Supprimer
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 7: CREATE PLACEMENT QUESTION */}
      {/* ================================================================= */}
      {isQuestionCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                  Banque de Test Adaptatif
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Créer une Question d’Évaluation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cette question sera intégrée aux tests de niveau passés par les nouveaux apprenants.
                </p>
              </div>
              <button
                onClick={() => setIsQuestionCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition shrink-0 ml-4"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestionSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Niveau CECRL Visé *
                  </label>
                  <select
                    value={questionFormData.level}
                    onChange={(e) =>
                      setQuestionFormData({ ...questionFormData, level: e.target.value as CefrLevel })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy font-bold text-navy"
                  >
                    {paliers.map((p) => (
                      <option key={p.id} value={p.code}>
                        {p.badgeIcon} Palier {p.code} - {p.titleFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Compétence Évaluée *
                  </label>
                  <select
                    value={questionFormData.skill}
                    onChange={(e) =>
                      setQuestionFormData({ ...questionFormData, skill: e.target.value as Skill })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                  >
                    <option value="vocabulary">🔤 Vocabulaire</option>
                    <option value="grammar">✍️ Grammaire</option>
                    <option value="reading">📖 Compréhension écrite</option>
                    <option value="listening">🎧 Compréhension orale</option>
                    <option value="speaking">🎙️ Expression orale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Consigne pour l’apprenant (FR) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Choisissez la bonne traduction / Complétez la phrase..."
                  value={questionFormData.prompt_fr}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, prompt_fr: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Énoncé de la question (Stem) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: « Bonjour » (le matin)  OU  She ___ to university every morning."
                  value={questionFormData.stem}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, stem: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy font-bold text-slate-900"
                />
              </div>

              {/* Optional Passage & Audio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Extrait / Passage de lecture (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Texte court pour les questions de lecture..."
                    value={questionFormData.passage}
                    onChange={(e) =>
                      setQuestionFormData({ ...questionFormData, passage: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Texte prononcé en audio (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Phrase anglaise pour la synthèse vocale d'écoute..."
                    value={questionFormData.audio_text}
                    onChange={(e) =>
                      setQuestionFormData({ ...questionFormData, audio_text: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                  />
                </div>
              </div>

              {/* 4 Options with Correct Answer Selector */}
              <div className="space-y-2 pt-1">
                <label className="block font-bold text-slate-700">
                  Options de Réponse &amp; Bonne Réponse *
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Cochez le bouton radio vert en face de la bonne réponse.
                </p>

                <div className="space-y-2.5">
                  {[0, 1, 2, 3].map((optIdx) => {
                    const fieldKey = `option${optIdx}` as 'option0' | 'option1' | 'option2' | 'option3';
                    const isSelected = questionFormData.correct_index === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        <label className="flex items-center gap-1.5 cursor-pointer pl-2 text-xs font-bold shrink-0">
                          <input
                            type="radio"
                            name="correct_index_create"
                            checked={isSelected}
                            onChange={() =>
                              setQuestionFormData({ ...questionFormData, correct_index: optIdx })
                            }
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className={isSelected ? 'text-emerald-800' : 'text-slate-600'}>
                            Option {letter}
                          </span>
                        </label>
                        <input
                          type="text"
                          required={optIdx < 2}
                          placeholder={`Texte de l'option ${letter}...`}
                          value={questionFormData[fieldKey]}
                          onChange={(e) =>
                            setQuestionFormData({ ...questionFormData, [fieldKey]: e.target.value })
                          }
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-navy text-xs"
                        />
                        {isSelected && (
                          <span className="text-[11px] font-bold text-emerald-700 pr-2 shrink-0">
                            ✓ Bonne
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Explication pédagogique (affichée après correction)
                </label>
                <textarea
                  rows={2}
                  placeholder="ex: 'Good morning' s'utilise le matin jusqu'à 12h..."
                  value={questionFormData.explanation_fr}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, explanation_fr: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                />
              </div>
            </div>

            {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsQuestionCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-duo !py-2.5 !px-6 font-black shadow-md flex items-center gap-2"
                >
                  <span>➕</span> Ajouter la Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 8: EDIT PLACEMENT QUESTION */}
      {/* ================================================================= */}
      {editingQuestionId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                  Mise à jour Question
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Modifier la Question : {editingQuestionId}
                </h3>
              </div>
              <button
                onClick={() => setEditingQuestionId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition shrink-0 ml-4"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditQuestionSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Niveau CECRL *
                  </label>
                  <select
                    value={questionFormData.level}
                    onChange={(e) =>
                      setQuestionFormData({ ...questionFormData, level: e.target.value as CefrLevel })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy font-bold text-navy"
                  >
                    {paliers.map((p) => (
                      <option key={p.id} value={p.code}>
                        {p.badgeIcon} Palier {p.code} - {p.titleFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Compétence Évaluée *
                  </label>
                  <select
                    value={questionFormData.skill}
                    onChange={(e) =>
                      setQuestionFormData({ ...questionFormData, skill: e.target.value as Skill })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                  >
                    <option value="vocabulary">🔤 Vocabulaire</option>
                    <option value="grammar">✍️ Grammaire</option>
                    <option value="reading">📖 Compréhension écrite</option>
                    <option value="listening">🎧 Compréhension orale</option>
                    <option value="speaking">🎙️ Expression orale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Consigne pour l’apprenant (FR) *
                </label>
                <input
                  type="text"
                  required
                  value={questionFormData.prompt_fr}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, prompt_fr: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Énoncé de la question (Stem) *
                </label>
                <input
                  type="text"
                  required
                  value={questionFormData.stem}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, stem: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy font-bold text-slate-900"
                />
              </div>

              {/* Optional Passage & Audio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Extrait / Passage de lecture (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={questionFormData.passage}
                    onChange={(e) =>
                      setQuestionFormData({ ...questionFormData, passage: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Texte prononcé en audio (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={questionFormData.audio_text}
                    onChange={(e) =>
                      setQuestionFormData({ ...questionFormData, audio_text: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                  />
                </div>
              </div>

              {/* 4 Options with Correct Answer Selector */}
              <div className="space-y-2 pt-1">
                <label className="block font-bold text-slate-700">
                  Options de Réponse &amp; Bonne Réponse *
                </label>
                <div className="space-y-2.5">
                  {[0, 1, 2, 3].map((optIdx) => {
                    const fieldKey = `option${optIdx}` as 'option0' | 'option1' | 'option2' | 'option3';
                    const isSelected = questionFormData.correct_index === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        <label className="flex items-center gap-1.5 cursor-pointer pl-2 text-xs font-bold shrink-0">
                          <input
                            type="radio"
                            name="correct_index_edit"
                            checked={isSelected}
                            onChange={() =>
                              setQuestionFormData({ ...questionFormData, correct_index: optIdx })
                            }
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className={isSelected ? 'text-emerald-800' : 'text-slate-600'}>
                            Option {letter}
                          </span>
                        </label>
                        <input
                          type="text"
                          required={optIdx < 2}
                          value={questionFormData[fieldKey]}
                          onChange={(e) =>
                            setQuestionFormData({ ...questionFormData, [fieldKey]: e.target.value })
                          }
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-navy text-xs"
                        />
                        {isSelected && (
                          <span className="text-[11px] font-bold text-emerald-700 pr-2 shrink-0">
                            ✓ Bonne
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Explication pédagogique
                </label>
                <textarea
                  rows={2}
                  value={questionFormData.explanation_fr}
                  onChange={(e) =>
                    setQuestionFormData({ ...questionFormData, explanation_fr: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                />
              </div>
            </div>

            {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingQuestionId(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-duo !py-2.5 !px-6 font-black shadow-md flex items-center gap-2"
                >
                  <span>💾</span> Sauvegarder les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 9: DELETE QUESTION CONFIRMATION */}
      {/* ================================================================= */}
      {deletingQuestionId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
              📝
            </div>

            {(() => {
              const target = questions.find((q) => q.id === deletingQuestionId);
              return (
                <>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-900">
                      Supprimer cette question ?
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Êtes-vous sûr de vouloir supprimer définitivement la question{' '}
                      <strong className="text-slate-900 font-mono">{target?.id}</strong> (
                      <span className="font-semibold">{target?.level}</span>) :
                    </p>
                    <p className="text-xs text-slate-800 font-bold mt-2 bg-slate-100 p-2.5 rounded-xl">
                      &quot;{target?.stem}&quot;
                    </p>
                    <p className="text-[11px] text-red-600 mt-2 font-medium">
                      Cette question ne sera plus proposée aux apprenants lors du test de niveau.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setDeletingQuestionId(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleConfirmDeleteQuestion}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
                    >
                      Oui, Supprimer
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 10: CREATE PALIER / LEVEL */}
      {/* ================================================================= */}
      {isPalierCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                  Directoire Pédagogique
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Créer un Nouveau Palier / Niveau
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ce palier apparaîtra dans le parcours étudiant, les tarifs et les sélecteurs de cours.
                </p>
              </div>
              <button
                onClick={() => setIsPalierCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition shrink-0 ml-4"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePalierSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Code Palier (ex: C1, PRO) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: C1"
                      value={palierFormData.code}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, code: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-navy uppercase text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Icône / Émoji Badge *
                    </label>
                    <select
                      value={palierFormData.badgeIcon}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, badgeIcon: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-base focus:outline-none focus:ring-2 focus:ring-navy"
                    >
                      <option value="🌱">🌱 Graine / Débutant</option>
                      <option value="🚀">🚀 Fusée / Élan</option>
                      <option value="💼">💼 Mallette / Pro</option>
                      <option value="🏆">🏆 Trophée / Avancé</option>
                      <option value="👑">👑 Couronne / Expert</option>
                      <option value="💎">💎 Diamant / Élite</option>
                      <option value="🌟">🌟 Étoile / Brillant</option>
                      <option value="🎓">🎓 Toque / Académique</option>
                      <option value="🔥">🔥 Flamme / Intensif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ordre d&apos;Affichage (Position)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={palierFormData.position}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, position: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre en Français *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Palier C1 - Avancé & Bilinguisme"
                      value={palierFormData.titleFr}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, titleFr: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-navy text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre en Anglais
                    </label>
                    <input
                      type="text"
                      placeholder="ex: C1 - Advanced Fluency & Mastery"
                      value={palierFormData.titleEn}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, titleEn: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Description des Objectifs Pédagogiques *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="ex: Maîtrise fluide, nuances idiomatiques et préparation aux tests internationaux..."
                    value={palierFormData.descriptionFr}
                    onChange={(e) =>
                      setPalierFormData({ ...palierFormData, descriptionFr: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Seuil XP Requis (Validation)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={palierFormData.requiredXp}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, requiredXp: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Score Min. Examen (%)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={palierFormData.passingScorePct}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, passingScorePct: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Durée Estimée (Semaines)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={palierFormData.estimatedWeeks}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, estimatedWeeks: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Public Cible Recommandé
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Cadres, universitaires et diplomates"
                      value={palierFormData.targetLearner}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, targetLearner: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Statut de Publication *
                    </label>
                    <select
                      value={palierFormData.status}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, status: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    >
                      <option value="published">🟢 Publié (Visible sur le site)</option>
                      <option value="draft">🟡 Brouillon (En préparation)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      Modalité d&apos;Accès Apprenant
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Cochez si ce niveau est accessible gratuitement sans pass payant.
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-navy">
                    <input
                      type="checkbox"
                      checked={palierFormData.isFree}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, isFree: e.target.checked })
                      }
                      className="w-4 h-4 text-navy rounded border-slate-300 focus:ring-navy"
                    />
                    <span>100% Gratuit</span>
                  </label>
                </div>
              </div>

              {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPalierCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-duo !py-2.5 !px-6 font-black shadow-md flex items-center gap-2"
                >
                  <span>➕</span> Créer le Palier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 11: EDIT PALIER / LEVEL */}
      {/* ================================================================= */}
      {editingPalierId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                  Mise à Jour Palier
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Modifier le Palier : {palierFormData.code}
                </h3>
              </div>
              <button
                onClick={() => setEditingPalierId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition shrink-0 ml-4"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditPalierSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Code Palier
                    </label>
                    <input
                      type="text"
                      disabled
                      value={palierFormData.code}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-black text-slate-500 uppercase text-sm cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Icône / Émoji Badge *
                    </label>
                    <select
                      value={palierFormData.badgeIcon}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, badgeIcon: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-base focus:outline-none focus:ring-2 focus:ring-navy"
                    >
                      <option value="🌱">🌱 Graine / Débutant</option>
                      <option value="🚀">🚀 Fusée / Élan</option>
                      <option value="💼">💼 Mallette / Pro</option>
                      <option value="🏆">🏆 Trophée / Avancé</option>
                      <option value="👑">👑 Couronne / Expert</option>
                      <option value="💎">💎 Diamant / Élite</option>
                      <option value="🌟">🌟 Étoile / Brillant</option>
                      <option value="🎓">🎓 Toque / Académique</option>
                      <option value="🔥">🔥 Flamme / Intensif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Position
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={palierFormData.position}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, position: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre en Français *
                    </label>
                    <input
                      type="text"
                      required
                      value={palierFormData.titleFr}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, titleFr: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-navy text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre en Anglais
                    </label>
                    <input
                      type="text"
                      value={palierFormData.titleEn}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, titleEn: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Description des Objectifs Pédagogiques *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={palierFormData.descriptionFr}
                    onChange={(e) =>
                      setPalierFormData({ ...palierFormData, descriptionFr: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      XP Requis
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={palierFormData.requiredXp}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, requiredXp: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Score Min. (%)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={palierFormData.passingScorePct}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, passingScorePct: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Semaines Est.
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={palierFormData.estimatedWeeks}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, estimatedWeeks: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Public Cible Recommandé
                    </label>
                    <input
                      type="text"
                      value={palierFormData.targetLearner}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, targetLearner: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Statut de Publication
                    </label>
                    <select
                      value={palierFormData.status}
                      onChange={(e) =>
                        setPalierFormData({ ...palierFormData, status: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-navy text-xs"
                    >
                      <option value="published">🟢 Publié (Visible sur le site)</option>
                      <option value="draft">🟡 Brouillon (En préparation)</option>
                    </select>
                  </div>
                </div>

                {palierFormData.code !== 'A1' ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">
                        Modalité d&apos;Accès Apprenant
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Cochez si ce niveau est accessible gratuitement.
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-navy">
                      <input
                        type="checkbox"
                        checked={palierFormData.isFree}
                        onChange={(e) =>
                          setPalierFormData({ ...palierFormData, isFree: e.target.checked })
                        }
                        className="w-4 h-4 text-navy rounded border-slate-300 focus:ring-navy"
                      />
                      <span>100% Gratuit</span>
                    </label>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
                    <span>✓</span>
                    <span>Le Palier A1 est le socle d&apos;accueil gratuit de la plateforme.</span>
                  </div>
                )}
              </div>

              {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 shrink-0 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPalierId(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-duo !py-2.5 !px-6 font-black shadow-md flex items-center gap-2"
                >
                  <span>💾</span> Sauvegarder les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 12: DELETE PALIER CONFIRMATION */}
      {/* ================================================================= */}
      {deletingPalierId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
              🎯
            </div>

            {(() => {
              const target = paliers.find((p) => p.id === deletingPalierId);
              const isA1 = target?.code === 'A1';

              return (
                <>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-900">
                      Supprimer ce palier ?
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Êtes-vous sûr de vouloir supprimer définitivement le palier{' '}
                      <strong className="text-slate-900">{target?.badgeIcon} {target?.code}</strong> (
                      <span className="font-semibold">{target?.titleFr}</span>) ?
                    </p>

                    {isA1 ? (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                        ⚠️ Le palier A1 est le palier fondamental gratuit de la plateforme et ne peut pas être supprimé.
                      </div>
                    ) : (
                      <p className="text-[11px] text-red-600 mt-2 font-medium">
                        Cette action retirera ce palier de la navigation du parcours étudiant et des filtres.
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setDeletingPalierId(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                    >
                      Annuler
                    </button>
                    {!isA1 && (
                      <button
                        onClick={handleConfirmDeletePalier}
                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
                      >
                        Oui, Supprimer
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 13: CREATE VOD VIDEO */}
      {/* ================================================================= */}
      {isVodCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                  Streaming &amp; VOD
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Ajouter une Vidéo à la Demande
                </h3>
              </div>
              <button
                onClick={() => setIsVodCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVodSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Titre de la Vidéo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Les 10 erreurs de prononciation typiques des francophones en RDC"
                    value={vodFormData.title}
                    onChange={(e) => setVodFormData({ ...vodFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-hidden focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Catégorie VOD *
                    </label>
                    <select
                      value={vodFormData.category}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, category: e.target.value as VodCategory })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-navy"
                    >
                      {VOD_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Niveau CECRL Cible *
                    </label>
                    <select
                      value={vodFormData.level}
                      onChange={(e) => setVodFormData({ ...vodFormData, level: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-navy"
                    >
                      <option value="Tous">Tous Niveaux (Général)</option>
                      {paliers.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.badgeIcon} {p.code} — {p.titleFr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Video URL with Cloudinary Assistant */}
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-black text-sky-950 text-xs sm:text-sm">
                      Lien Vidéo (URL Embed ou Direct) *
                    </label>
                    <button
                      type="button"
                      onClick={handleOptimizeCloudinaryUrl}
                      className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shadow-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>⚡ Auto-optimiser Cloudinary</span>
                    </button>
                  </div>

                  <input
                    type="url"
                    required
                    placeholder="https://res.cloudinary.com/.../video.mp4 ou YouTube ou Vimeo"
                    value={vodFormData.url}
                    onChange={(e) => {
                      const newUrl = e.target.value;
                      const detected = detectVideoProvider(newUrl);
                      setVodFormData({
                        ...vodFormData,
                        url: newUrl,
                        provider: detected,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-300 bg-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-sky-800">
                    <span>
                      Hébergeur sélectionné :{' '}
                      <strong className="uppercase bg-sky-200/80 px-2 py-0.5 rounded font-black text-sky-950">
                        {vodFormData.provider}
                      </strong>
                    </span>
                    <span className="text-slate-500">
                      Formats supportés : Cloudinary, YouTube, Vimeo, MP4 direct.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      URL Flux 3G Éco (Optionnel)
                    </label>
                    <input
                      type="url"
                      placeholder="Généré automatiquement pour Cloudinary"
                      value={vodFormData.lowUrl}
                      onChange={(e) => setVodFormData({ ...vodFormData, lowUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      URL Image Miniature / Poster
                    </label>
                    <input
                      type="url"
                      placeholder="https://.../thumbnail.jpg"
                      value={vodFormData.posterUrl}
                      onChange={(e) => setVodFormData({ ...vodFormData, posterUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Durée (min)</label>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={vodFormData.durationMinutes}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, durationMinutes: Number(e.target.value) || 15 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-hidden focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">XP Accordé</label>
                    <input
                      type="number"
                      min={5}
                      max={500}
                      value={vodFormData.xpReward}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, xpReward: Number(e.target.value) || 35 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-hidden focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Accès</label>
                    <select
                      value={vodFormData.isFree ? 'free' : 'member'}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, isFree: e.target.value === 'free' })
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                    >
                      <option value="free">100% Gratuit</option>
                      <option value="member">🔒 Pass Membre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Statut</label>
                    <select
                      value={vodFormData.status}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, status: e.target.value as 'published' | 'draft' })
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                    >
                      <option value="published">🟢 Publié</option>
                      <option value="draft">🟡 Brouillon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Description de la leçon vidéo *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Ce que l'apprenant va retenir de cette vidéo..."
                    value={vodFormData.description}
                    onChange={(e) => setVodFormData({ ...vodFormData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-hidden focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Conseil Pédagogique du Coach David (Affiché sous la vidéo)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Répétez 3 fois à voix haute en imitant l'accent tonique..."
                    value={vodFormData.coachNote}
                    onChange={(e) => setVodFormData({ ...vodFormData, coachNote: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                  />
                </div>
              </div>

              {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVodCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-black text-xs shadow-md transition cursor-pointer"
                >
                  Enregistrer la Vidéo VOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 13B: EDIT VOD VIDEO */}
      {/* ================================================================= */}
      {editingVodId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                  Modifier Vidéo VOD
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Éditer la Vidéo
                </h3>
              </div>
              <button
                onClick={() => setEditingVodId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditVodSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* SCROLLABLE BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Titre de la Vidéo *
                  </label>
                  <input
                    type="text"
                    required
                    value={vodFormData.title}
                    onChange={(e) => setVodFormData({ ...vodFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-hidden focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Catégorie VOD *</label>
                    <select
                      value={vodFormData.category}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, category: e.target.value as VodCategory })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-navy"
                    >
                      {VOD_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Niveau CECRL Cible *</label>
                    <select
                      value={vodFormData.level}
                      onChange={(e) => setVodFormData({ ...vodFormData, level: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-navy"
                    >
                      <option value="Tous">Tous Niveaux (Général)</option>
                      {paliers.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.badgeIcon} {p.code} — {p.titleFr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Video URL with Cloudinary Assistant */}
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-black text-sky-950 text-xs sm:text-sm">
                      Lien Vidéo (URL Embed ou Direct) *
                    </label>
                    <button
                      type="button"
                      onClick={handleOptimizeCloudinaryUrl}
                      className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shadow-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>⚡ Auto-optimiser Cloudinary</span>
                    </button>
                  </div>

                  <input
                    type="url"
                    required
                    value={vodFormData.url}
                    onChange={(e) => {
                      const newUrl = e.target.value;
                      const detected = detectVideoProvider(newUrl);
                      setVodFormData({
                        ...vodFormData,
                        url: newUrl,
                        provider: detected,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-300 bg-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-sky-800">
                    <span>
                      Hébergeur :{' '}
                      <strong className="uppercase bg-sky-200/80 px-2 py-0.5 rounded font-black text-sky-950">
                        {vodFormData.provider}
                      </strong>
                    </span>
                    <span className="text-slate-500">
                      Cloudinary, YouTube, Vimeo, MP4 direct.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">URL Flux 3G Éco</label>
                    <input
                      type="url"
                      value={vodFormData.lowUrl}
                      onChange={(e) => setVodFormData({ ...vodFormData, lowUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">URL Miniature Poster</label>
                    <input
                      type="url"
                      value={vodFormData.posterUrl}
                      onChange={(e) => setVodFormData({ ...vodFormData, posterUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Durée (min)</label>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={vodFormData.durationMinutes}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, durationMinutes: Number(e.target.value) || 15 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-hidden focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">XP Accordé</label>
                    <input
                      type="number"
                      min={5}
                      max={500}
                      value={vodFormData.xpReward}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, xpReward: Number(e.target.value) || 35 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold focus:outline-hidden focus:ring-2 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Accès</label>
                    <select
                      value={vodFormData.isFree ? 'free' : 'member'}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, isFree: e.target.value === 'free' })
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                    >
                      <option value="free">100% Gratuit</option>
                      <option value="member">🔒 Pass Membre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Statut</label>
                    <select
                      value={vodFormData.status}
                      onChange={(e) =>
                        setVodFormData({ ...vodFormData, status: e.target.value as 'published' | 'draft' })
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                    >
                      <option value="published">🟢 Publié</option>
                      <option value="draft">🟡 Brouillon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Description de la leçon vidéo *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={vodFormData.description}
                    onChange={(e) => setVodFormData({ ...vodFormData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-hidden focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Conseil Pédagogique du Coach David
                  </label>
                  <textarea
                    rows={2}
                    value={vodFormData.coachNote}
                    onChange={(e) => setVodFormData({ ...vodFormData, coachNote: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium text-xs focus:outline-hidden focus:ring-2 focus:ring-navy"
                  />
                </div>
              </div>

              {/* STICKY FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingVodId(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-black text-xs shadow-md transition cursor-pointer"
                >
                  Mettre à Jour la Vidéo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 14: DELETE VOD CONFIRMATION */}
      {/* ================================================================= */}
      {deletingVodId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {(() => {
              const target = vodVideos.find((v) => v.id === deletingVodId);
              return (
                <>
                  <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl">
                    🗑️
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Supprimer cette Vidéo VOD ?
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Êtes-vous sûr de vouloir supprimer « <strong className="text-slate-800">{target?.title}</strong> » ?
                    </p>
                    <p className="text-[11px] text-red-600 mt-2 font-medium">
                      Cette vidéo ne sera plus accessible aux apprenants dans le catalogue VOD.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setDeletingVodId(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleConfirmDeleteVod}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Oui, Supprimer
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 15: PREVIEW VOD PLAYER */}
      {/* ================================================================= */}
      {previewVodVideo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-1 rounded-full">
                  Aperçu Lecteur ({previewVodVideo.provider.toUpperCase()})
                </span>
                <span className="font-bold text-sm text-slate-800 truncate max-w-md">
                  {previewVodVideo.title}
                </span>
              </div>
              <button
                onClick={() => setPreviewVodVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Video Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-md">
                <VideoPlayer
                  provider={previewVodVideo.provider}
                  url={previewVodVideo.url}
                  lowUrl={previewVodVideo.lowUrl}
                  audioUrl={previewVodVideo.audioUrl}
                  posterUrl={previewVodVideo.posterUrl}
                  title={previewVodVideo.title}
                  transcriptFr={previewVodVideo.coachNote}
                  dataSaverDefault={false}
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span>Catégorie : {previewVodVideo.category}</span>
                  <span>Niveau : {previewVodVideo.level}</span>
                  <span>Durée : {previewVodVideo.durationMinutes} min</span>
                  <span>XP : +{previewVodVideo.xpReward} XP</span>
                </div>
                <p className="text-slate-600">{previewVodVideo.description}</p>
                {previewVodVideo.coachNote && (
                  <p className="text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    <strong>Note Pédagogique :</strong> {previewVodVideo.coachNote}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setPreviewVodVideo(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition cursor-pointer"
              >
                Fermer l&apos;Aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
