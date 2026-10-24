'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import {
  isAdminAuthenticated,
  verifyAndLoginAdmin,
  logoutAdmin,
  getAdminUser,
  isValidAdminEmail,
  AdminUser,
} from '@/lib/auth-admin';
import { toast } from 'sonner';

interface VideoScript {
  id: string;
  pole: 'A' | 'B' | 'C';
  poleTitle: string;
  number: number;
  title: string;
  level: string;
  duration: string;
  targetIssue: string;
  method: string;
  keyPhrases: string[];
  fullScriptOutline: string;
}

const VIDEO_SCRIPTS: VideoScript[] = [
  {
    id: 'vid-01',
    pole: 'A',
    poleTitle: 'Anglais du Recrutement & des Affaires',
    number: 1,
    title: '« Réussir la question "Tell me about yourself" lors d\'un entretien »',
    level: 'A2 - B1',
    duration: '7 minutes',
    targetIssue: 'Raconter sa vie depuis l’école primaire ou réciter mot pour mot son CV.',
    method: 'La règle des 3 P (Present, Past, Future) :',
    keyPhrases: [
      '"I specialize in project management, and over the past three years, I successfully led..."',
      '"What excites me about this role at your company in Kinshasa is..."',
      '"Currently, I work as a sales supervisor, where I helped increase our client portfolio by 25%."',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Si vous commencez votre réponse par 'I was born in Kinshasa in 1995...', vous perdez immédiatement l'intérêt du recruteur ! Aujourd'hui, je vous donne la formule des 3 P qui vous démarque à coup sûr."
2. EXPLICATION (1m30) : Règle des 3 P :
   - Present : Qui je suis professionnellement aujourd'hui.
   - Past : 2 réalisations majeures et compétences prouvées.
   - Future : Pourquoi cette offre d'emploi est exactement votre prochaine étape.
3. EXEMPLES RDC (2m) : Simulation pour un poste chez Rawbank, Vodacom ou une ONG à Gombe.
4. RÉPÉTITION (1m30) : Faire répéter l'accroche avec assurance face caméra.
5. CALL TO ACTION (30s) : Entraînez-vous dans le module Recrutement de PA³ English Academy.`,
  },
  {
    id: 'vid-02',
    pole: 'A',
    poleTitle: 'Anglais du Recrutement & des Affaires',
    number: 2,
    title: '« Les 10 questions pièges des ONGs et multinationales en RDC »',
    level: 'B1 - B2',
    duration: '10 minutes',
    targetIssue: 'Paniquer face aux questions comportementales (MONUSCO, UNICEF, banques commerciales, sociétés minières).',
    method: 'La méthode STAR (Situation, Task, Action, Result) :',
    keyPhrases: [
      '"What is your greatest weakness? -> I sometimes focus too much on details, but I now use time-tracking tools..."',
      '"Describe a conflict you resolved in your previous team."',
      '"Why do you want to work with us in the DRC?"',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Pourquoi les recruteurs internationaux vous demandent-ils votre pire faiblesse ? Ce n'est pas pour vous piéger, c'est pour tester votre maturité en anglais !"
2. MÉTHODE STAR (2m) : Décortiquer S (Situation), T (Tâche), A (Action posée), R (Résultat mesurable).
3. CAS PRATIQUE (4m) : Décrire un défi logistique ou d'équipe résolu avec succès en RDC.
4. PHRASES CLÉS (2m) : Formulations professionnelles pour valoriser son leadership.
5. CALL TO ACTION (1m) : Quiz de mise en situation sur l'app PA³.`,
  },
  {
    id: 'vid-03',
    pole: 'A',
    poleTitle: 'Anglais du Recrutement & des Affaires',
    number: 3,
    title: '« Rédiger un email professionnel moderne (Exit les formules du 19e siècle) »',
    level: 'A2 - B1',
    duration: '6 minutes',
    targetIssue: 'Traduire littéralement "Je viens par la présente solliciter..." ou utiliser un style trop lourd et désuet.',
    method: 'Formules directes, chaleureuses et concises :',
    keyPhrases: [
      '"I hope this email finds you well."',
      '"Please find attached my resume and cover letter for your review."',
      '"I am writing to follow up on our discussion yesterday."',
      '"Looking forward to hearing from you soon. Best regards."',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "N'écrivez plus jamais 'I come by this letter to request...' en anglais des affaires ! Voici comment écrire un email que les partenaires anglophones lisent et respectent."
2. STRUCTURE EN 3 BLOCS (1m30) : Salutation moderne, raison du contact en 1 phrase, appel à l'action clair.
3. EXEMPLES D'OBJETS PERCUTANTS (1m30) : Remplacer 'Demande' par 'Inquiry regarding Partnership - PA³ Academy'.
4. PHRASES PRÊTES À L'EMPLOI (2m) : Relance polie, transmission de documents.
5. CALL TO ACTION (30s) : Modèles d'emails téléchargeables sur PA³.`,
  },
  {
    id: 'vid-04',
    pole: 'A',
    poleTitle: 'Anglais du Recrutement & des Affaires',
    number: 4,
    title: '« Téléphoner et prendre un message en anglais sans stress »',
    level: 'A2',
    duration: '5 minutes',
    targetIssue: 'Peur panique quand le téléphone sonne et qu’une voix anglophone parle rapidement avec du bruit à Kinshasa.',
    method: 'Les 4 phrases boucliers de sauvetage en cas de mauvaise ligne :',
    keyPhrases: [
      '"Could you please speak a little slower? The line is a bit noisy."',
      '"The line is breaking up. Could you repeat that, please?"',
      '"May I take a message, or would you like to call back later?"',
      '"Could you spell your name for me, please?"',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Le téléphone sonne au bureau, vous décrochez : 'Hello?'. L'interlocuteur parle à 100 à l'heure avec un accent américain. Que faites-vous ? Respirez, voici vos 4 phrases magiques."
2. PHRASES BOUCLIERS (1m30) : Comment demander de ralentir sans paraître incompétent.
3. PRENDRE UN MESSAGE (1m30) : Noter le nom, le numéro et le motif de l'appel.
4. EXERCICE DE SIMULATION (1m) : Le Coach joue l'appelant rapide, l'élève répond.
5. CALL TO ACTION (30s) : Module audio sur PA³ English Academy.`,
  },
  {
    id: 'vid-05',
    pole: 'B',
    poleTitle: 'Prononciation & Accent Congolais',
    number: 5,
    title: '« La règle d\'or pour prononcer le son -ED au passé »',
    level: 'A1 - A2',
    duration: '6 minutes',
    targetIssue: 'Prononcer tous les verbes avec deux syllabes (work-ed, ask-ed, watch-ed, help-ed).',
    method: 'La règle des 3 sons (/ɪd/, /t/, /d/) :',
    keyPhrases: [
      '1. /ɪd/ : Uniquement après T et D (wanted, decided, invited).',
      '2. /t/ : Après consonnes sourdes (worked, stopped, laughed, watched).',
      '3. /d/ : Dans tous les autres cas (played, called, lived, opened).',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Si vous dites 'I work-ed yesterday', tout le monde sait que vous êtes francophone ! En anglais, le -ED ne se prononce presque JAMAIS comme ça."
2. TEST PHYSIQUE (1m30) : Mettre deux doigts sur la gorge pour tester la vibration des cordes vocales.
3. LES 3 GROUPES (2m) :
   - Son /ɪd/ : seulement si le verbe se termine déjà par un son T ou D.
   - Son /t/ : explosion d'air sans vibration (worked = work-T).
   - Son /d/ : vibration fluide (called = call-D).
4. DRILL DE RÉPÉTITION (1m30) : 10 verbes à prononcer en rafale.
5. CALL TO ACTION (30s) : Pratiquez la reconnaissance vocale dans la leçon A2 de PA³.`,
  },
  {
    id: 'vid-06',
    pole: 'B',
    poleTitle: 'Prononciation & Accent Congolais',
    number: 6,
    title: '« Arrêtez de dire "E-student" et "E-school" ! »',
    level: 'A1 Débutant',
    duration: '4 minutes',
    targetIssue: 'L’habitude francophone d’ajouter un son [e] ou [i] devant les mots qui commencent par S + consonne.',
    method: 'L’exercice physique du serpent (Sssssss) :',
    keyPhrases: [
      '"Sssss-peak (Speak, et non E-speak)"',
      '"Sssss-tudent (Student, et non E-student)"',
      '"Sssss-pecial (Special, et non E-special)"',
      '"Sssss-pain (Spain, et non E-spain)"',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Pourquoi disons-nous souvent 'E-station' ou 'E-school' ? C'est le piège numéro 1 des Congolais en anglais. Aujourd'hui, on le règle en 3 minutes !"
2. MÉCANIQUE PHONÉTIQUE (1m) : En anglais, la lettre S en début de mot est un souffle pur, sans aucune voyelle devant.
3. LE BRUIT DU SERPENT (1m30) :
   - Bloquez la langue contre le palais.
   - Faites siffler le serpent : 'Sssss'.
   - Collez le mot : 'Sssss-peak', 'Sssss-tart', 'Sssss-mart'.
4. RÉPÉTITION RYTHMÉE (1m) : Séquence rapide de 5 mots pièges.
5. CALL TO ACTION (30s) : Testez votre score dans l'unité 4 sur PA³.`,
  },
  {
    id: 'vid-07',
    pole: 'B',
    poleTitle: 'Prononciation & Accent Congolais',
    number: 7,
    title: '« Différencier le TH doux et le TH dur (Think vs This) »',
    level: 'A1 - A2',
    duration: '5 minutes',
    targetIssue: 'Remplacer le son TH par S, Z, F ou D (sink au lieu de think, dis au lieu de this).',
    method: 'Positionnement visible de la langue entre les incisives :',
    keyPhrases: [
      'TH doux (souffle sans voix) : Think, Three, Thank you, Birthday.',
      'TH dur (vibration vocale) : This, That, These, Father, Together.',
      'Contrastes : Think / Sink • Three / Free • This / Dis.',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Saviez-vous que si vous dites 'I sink' au lieu de 'I think', vous dites 'Je coule au fond de l'eau' au lieu de 'Je pense' ? Placez votre langue avec moi !"
2. DÉMONSTRATION VISUELLE (1m30) : Zoom sur la bouche du Coach. La pointe de la langue sort légèrement entre les dents.
3. LES DEUX VARIANTES (1m30) :
   - Le souffle doux : 'Thank you' (air pur).
   - La vibration : 'This / That' (faire vibrer le moteur).
4. EXERCICE DU MIROIR (1m) : Pratique avec un miroir ou la caméra frontale.
5. CALL TO ACTION (30s) : Enregistrez votre voix sur PA³ pour validation.`,
  },
  {
    id: 'vid-08',
    pole: 'B',
    poleTitle: 'Prononciation & Accent Congolais',
    number: 8,
    title: '« Les voyelles courtes vs voyelles longues (Ship vs Sheep) »',
    level: 'A2',
    duration: '6 minutes',
    targetIssue: 'Confondre la durée des voyelles anglaises, ce qui produit des quiproquos embarrassants.',
    method: 'Contraste de longueur et ouverture de mâchoire :',
    keyPhrases: [
      'Sheet (feuille de papier / drap) vs Shit (insulte)',
      'Beach (plage de sable) vs Bitch (injure)',
      'Leave (quitter / partir) vs Live (vivre / habiter)',
      'Ship (grand bateau) vs Sheep (mouton)',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Attention ! Si vous prononcez mal le mot 'sheet of paper' en réunion, vous venez d'insulter tout le monde sans le vouloir ! Voici comment ne plus jamais faire cette gaffe."
2. LA DIFFÉRENCE FONDAMENTALE (1m30) :
   - /iː/ long : Sourire large, son étiré ('Beeeeach', 'Sheeeep').
   - /ɪ/ court et relâché : Bouche semi-ouverte, son bref ('Bitch', 'Ship').
3. COMPARAISON CÔTE À CÔTE (2m) : Exemples répétés 3 fois chacun.
4. TEST AUDITIF FLASH (1m) : Le Coach prononce un mot, l'élève devine lequel c'est.
5. CALL TO ACTION (30s) : Écoutez les enregistrements natifs sur PA³ Academy.`,
  },
  {
    id: 'vid-09',
    pole: 'C',
    poleTitle: 'Expression Orale & Spontanéité',
    number: 9,
    title: '« 15 expressions de transition pour sonner comme un bilingue »',
    level: 'A2 - B1',
    duration: '6 minutes',
    targetIssue: 'Faire des silences gênés ("Euuuh...") en cherchant ses mots.',
    method: 'Les connecteurs de fluidité naturelle :',
    keyPhrases: [
      '"To be honest / Honestly speaking..." (Pour être honnête...)',
      '"As far as I\'m concerned..." (En ce qui me concerne...)',
      '"At the end of the day..." (En fin de compte...)',
      '"You know what I mean?" (Vous voyez ce que je veux dire ?)',
      '"That\'s a great point, however..." (C\'est un excellent point, cependant...)',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Arrêtez de dire 'Euuuh' pendant 10 secondes quand on vous pose une question en anglais ! Les bilingues utilisent des connecteurs pour gagner du temps."
2. LES 5 CONNECTEURS D'OUVERTURE (1m30) : Comment démarrer sa phrase avec élégance.
3. LES CONNECTEURS DE NUANCE (1m30) : Exprimer un désaccord poli.
4. MISE EN SITUATION (1m30) : Répondre à : "Do you prefer living in Kinshasa or abroad?".
5. CALL TO ACTION (30s) : Retrouvez la fiche mémo PDF dans votre espace étudiant PA³.`,
  },
  {
    id: 'vid-10',
    pole: 'C',
    poleTitle: 'Expression Orale & Spontanéité',
    number: 10,
    title: '« Comment arrêter de traduire dans sa tête »',
    level: 'Tous Niveaux',
    duration: '8 minutes',
    targetIssue: 'Formuler d’abord en français ou en lingala, puis tenter de traduire mot à mot mot (ce qui bloque la parole).',
    method: 'Les 3 exercices mentaux quotidiens :',
    keyPhrases: [
      'Exercice 1 : Nommer mentalement les objets de sa chambre en anglais au réveil (bed, curtains, shoes).',
      'Exercice 2 : Décrire son trajet matinal à Kinshasa en monologue intérieur ("Traffic is dense today").',
      'Exercice 3 : Basculer son téléphone et ses réseaux sociaux à 100% en anglais.',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Pourquoi est-ce si lent de parler anglais ? Parce que votre cerveau fait un double trajet : Français -> Traduction mot à mot -> Blocage grammatical ! Aujourd'hui, on coupe le traducteur interne."
2. POURQUOI LA TRADUCTION ÉCHOUE (2m) : En anglais, la structure des idées est directe et imagée.
3. LES 3 ENTRAÎNEMENTS QUOTIDIENS (3m) :
   - Le scan de la pièce (30 objets en 60 secondes).
   - Le commentaire sportif de sa propre journée.
   - La consommation passive de contenu (podcasts, vidéos courtes sans sous-titres français).
4. DÉFI 7 JOURS (1m30) : Passer son WhatsApp et smartphone en langue anglaise.
5. CALL TO ACTION (1m) : Suivez votre défi quotidien sur le dashboard PA³.`,
  },
  {
    id: 'vid-11',
    pole: 'C',
    poleTitle: 'Expression Orale & Spontanéité',
    number: 11,
    title: '« Commander au restaurant ou à l\'hôtel en voyage »',
    level: 'A1 - A2',
    duration: '5 minutes',
    targetIssue: 'Utiliser "I want" qui est perçu dans le monde anglophone comme impoli, autoritaire et agressif.',
    method: 'Les formules de politesse diplomatique :',
    keyPhrases: [
      'Remplacer "I want a coffee" par "Could I please have a cup of coffee?"',
      '"I would like to order the grilled fish, please."',
      '"Could we have the check/bill, please?"',
      '"Is service included?"',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "En voyage à Nairobi, Johannesburg ou Londres, si vous dites au serveur 'I want this', vous passez immédiatement pour quelqu'un d'impoli ! Voici la formule respectueuse."
2. LA NUANCE CULTURELLE (1m) : En anglais, 'I want' est réservé aux enfants capricieux. Les adultes utilisent 'Could I have' ou 'I would like'.
3. SCÈNE AU RESTAURANT (2m) : Demander le menu, commander un plat, demander l'addition.
4. SIMULATION DE DIALOGUE (1m) : Le Coach joue le serveur, l'étudiant passe commande.
5. CALL TO ACTION (30s) : Leçon pratique interactive 'Au restaurant' sur PA³.`,
  },
  {
    id: 'vid-12',
    pole: 'C',
    poleTitle: 'Expression Orale & Spontanéité',
    number: 12,
    title: '« Les faux-amis les plus trompeurs en anglais »',
    level: 'A2 - B1',
    duration: '6 minutes',
    targetIssue: 'Utiliser des mots anglais qui ressemblent au français mais ont un sens totalement opposé.',
    method: 'Démystification par paires avec alertes rouges :',
    keyPhrases: [
      'Currently = Actuellement (et NON couramment)',
      'Eventually = Finalement / À terme (et NON éventuellement)',
      'To attend = Assister à / Participer (et NON attendre)',
      'Opportunity = Occasion favorable (et NON opportunisme politique)',
      'Sympathetic = Compatissant / Compréhensif (et NON sympathique)',
    ],
    fullScriptOutline: `1. ACCROCHE (20s) : "Si vous dites 'I will attend you at 2 PM', vous ne dites pas 'Je vais vous attendre', mais 'Je vais assister à votre événement' ! Évitez ces 5 faux-amis mortels."
2. LES 5 PIÈGES DU QUOTIDIEN (3m) : Décryptage avec exemples en milieu professionnel à Kinshasa.
3. COMMENT LES RETENIR (1m30) : Flashcards mémorielles et associations d'images.
4. QUIZ ÉCLAIR (1m) : 3 phrases à corriger en direct.
5. CALL TO ACTION (30s) : Testez vos réflexes dans le quiz faux-amis sur PA³.`,
  },
];

const CURRICULUM_LESSONS = [
  {
    slug: 'a1-salutations',
    title: 'Les salutations du quotidien',
    cefr: 'A1',
    category: 'Bases & Politesse',
    objective: "Saluer selon le moment de la journée (Good morning, afternoon, evening, night), demander 'How are you?' et répondre poliment.",
    status: 'En ligne',
  },
  {
    slug: 'a1-se-presenter',
    title: 'Se présenter avec assurance',
    cefr: 'A1',
    category: 'Identité',
    objective: "Exprimer son nom, sa ville d'origine, son âge avec le verbe to be ('I am 24 years old', et jamais 'I have').",
    status: 'En ligne',
  },
  {
    slug: 'a1-nombres-0-20',
    title: 'Les nombres de 0 à 20',
    cefr: 'A1',
    category: 'Pratique',
    objective: "Compter, donner son numéro de téléphone WhatsApp sans hésiter, différencier les terminaisons en -teen (13 à 19).",
    status: 'En ligne',
  },
  {
    slug: 'a1-alphabet',
    title: "L'Alphabet & Épeler son nom",
    cefr: 'A1',
    category: 'Phonétique',
    objective: "Épeler son nom et prénom pour un formulaire de visa ou bancaire, dicter son adresse email ('at' = @, 'dot' = .).",
    status: 'Nouveau',
  },
  {
    slug: 'a1-pays-villes',
    title: 'Pays, Villes & Nationalités',
    cefr: 'A1',
    category: 'Culture & Géographie',
    objective: "Formuler d'où l'on vient ('I am from the DRC, I live in Kinshasa'), parler de ses origines et de la nationalité congolaise.",
    status: 'Nouveau',
  },
  {
    slug: 'a1-la-famille',
    title: 'La famille & Les Possessifs',
    cefr: 'A1',
    category: 'Grammaire & Vocabulaire',
    objective: "Présenter ses proches, maîtriser la règle d'or des adjectifs possessifs : his (son/sa à lui) et her (son/sa à elle).",
    status: 'Nouveau',
  },
  {
    slug: 'a1-combien',
    title: 'Combien ça coûte ? Achats & Négociation',
    cefr: 'A1',
    category: 'Vie Quotidienne & Commerce',
    objective: "Demander un prix ('How much is this?'), négocier poliment une réduction ('Can you give me a discount?'), payer par Mobile Money.",
    status: 'Nouveau',
  },
];

export default function AdminSuggestionsPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Login states
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Content filters
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'A' | 'B' | 'C' | 'CURRICULUM' | 'FORMULA' | 'TECHNIQUE'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedScriptId, setExpandedScriptId] = useState<string | null>('vid-01');

  useEffect(() => {
    setIsMounted(true);
    const authenticated = isAdminAuthenticated();
    setIsAdmin(authenticated);
    if (authenticated) {
      setAdminUser(getAdminUser());
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      const result = verifyAndLoginAdmin(emailInput, passwordInput);
      if (result.success && result.user) {
        setIsAdmin(true);
        setAdminUser(result.user);
        toast.success(`Bienvenue Coach ${result.user.name} ! Accès administrateur déverrouillé.`);
      } else {
        setLoginError(result.error || 'Identifiants administrateur incorrects.');
        toast.error('Échec de connexion administrateur.');
      }
    } catch {
      setLoginError('Erreur de validation des identifiants.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    setAdminUser(null);
    toast.info('Session administrateur fermée.');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copié dans le presse-papier : ${label}`);
  };

  const filteredScripts = VIDEO_SCRIPTS.filter((script) => {
    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'A' && script.pole === 'A') ||
      (selectedFilter === 'B' && script.pole === 'B') ||
      (selectedFilter === 'C' && script.pole === 'C');

    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      script.title.toLowerCase().includes(q) ||
      script.targetIssue.toLowerCase().includes(q) ||
      script.method.toLowerCase().includes(q) ||
      script.poleTitle.toLowerCase().includes(q) ||
      script.keyPhrases.some((p) => p.toLowerCase().includes(q))
    );
  });

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  // 1. SECURITY GUARD: Render Admin Login Gate if not authenticated
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8 bg-slate-900/90 border border-gold/30 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <Link href="/" className="inline-block mb-4">
              <Logo variant="dark" size="md" />
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider mb-2">
              🔒 Espace Réservé à l&apos;Administration
            </div>
            <h1 className="text-2xl font-black text-white">Guide Pédagogique & Suggestions</h1>
            <p className="mt-2 text-sm text-slate-400">
              Ce document de stratégie et ces 12 scripts de leçons vidéo sont strictement réservés à la Direction Pédagogique de PA³ English Academy.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-300 text-xs font-medium">
                ⚠️ {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Administrateur (Coach David Liandja)
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="liandjadavid@gmail.com"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-gold transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mot de Passe Maître / Clé d&apos;Accès
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-gold transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? 'Vérification...' : '🔓 Déverrouiller le Guide Pédagogique'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              href="/admin"
              className="text-xs text-slate-400 hover:text-gold transition font-medium"
            >
              ← Retour au Tableau de bord Administrateur
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-6">
          PA³ English Academy • Kinshasa, RDC © 2026 • Accès Sécurisé
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED: Render the Complete Pedagogical Guide
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Sticky Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-slate-400 hover:text-white transition group">
            <span className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 text-sm">←</span>
            <span className="text-xs font-semibold hidden sm:inline">Tableau de bord Admin</span>
          </Link>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 rounded-md">
              ADMIN ONLY
            </span>
            <span className="text-sm font-bold text-white hidden md:inline">
              Guide Pédagogique & Suggestions de Vidéos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin?tab=vod"
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>🎥</span>
            <span className="hidden sm:inline">Gérer la VOD</span>
          </Link>

          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-xl">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-[10px]">
              {adminUser?.avatar || 'CD'}
            </div>
            <span className="text-xs text-slate-300 hidden lg:inline font-medium">
              {adminUser?.name || 'Coach David Liandja'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg text-xs transition"
            title="Déconnexion Admin"
          >
            🚪
          </button>
        </div>
      </header>

      {/* Hero Banner with Summary */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border-b border-slate-800/80 px-4 sm:px-8 py-8 lg:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                📖 Stratégie de Contenu • Kinshasa, RDC
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Guide Pédagogique & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">12 Scripts de Leçons Vidéo</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                Ce guide stratégique rassemble l&apos;intégralité de la formule pédagogique PA³, le cursus interactif A1 déployé,
                les scripts mot-à-mot des 12 vidéos prioritaires pour le Coach David Liandja, ainsi que les directives de tournage adaptées au contexte de Kinshasa.
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => copyToClipboard('https://pa-english-academy.vercel.app/admin/suggestions', 'Lien du Guide')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                🔗 Copier le lien d&apos;accès
              </button>
              <Link
                href="/admin?tab=vod"
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
              >
                ➕ Ajouter une vidéo tournée
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-amber-400">12</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Scripts Vidéos Complets</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">7</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Leçons A1 Interactives</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-sky-400">5 min</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Formule Chrono par Vidéo</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-purple-400">3 Pôles</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Business, Phonétique & Spontanéité</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-10">
        {/* Navigation Tabs Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous les 12 Scripts
            </button>
            <button
              onClick={() => setSelectedFilter('A')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedFilter === 'A'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💼 Pôle A: Business (4)
            </button>
            <button
              onClick={() => setSelectedFilter('B')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedFilter === 'B'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗣️ Pôle B: Prononciation (4)
            </button>
            <button
              onClick={() => setSelectedFilter('C')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedFilter === 'C'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Pôle C: Spontanéité (4)
            </button>
            <button
              onClick={() => setSelectedFilter('CURRICULUM')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedFilter === 'CURRICULUM'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📚 Cursus A1
            </button>
            <button
              onClick={() => setSelectedFilter('FORMULA')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedFilter === 'FORMULA'
                  ? 'bg-sky-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎙️ Formule 5 Étapes
            </button>
            <button
              onClick={() => setSelectedFilter('TECHNIQUE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedFilter === 'TECHNIQUE'
                  ? 'bg-purple-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛠️ Guide Tournage Kinshasa
            </button>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un sujet ou mot..."
              className="w-full px-3.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* SECTION 1: VISION PÉDAGOGIQUE PA³ */}
        {(selectedFilter === 'ALL' || selectedFilter === 'FORMULA') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  1. La Vision Pédagogique PA³ : Pourquoi Nos Étudiants Réussissent
                </h2>
                <p className="text-xs text-slate-400">
                  Comprendre les blocages spécifiques des apprenants en République Démocratique du Congo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2">
                <div className="font-bold text-red-300 flex items-center gap-1.5">
                  <span>❌</span> Approche Trop Théorique
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Des listes de verbes irréguliers apprises par cœur pendant des années à l&apos;école sans jamais oser formuler une phrase complète.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2">
                <div className="font-bold text-red-300 flex items-center gap-1.5">
                  <span>❌</span> Inadéquation Culturelle
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Des manuels importés d&apos;Europe parlant de métro à Londres plutôt que de négocier à Gambela ou de postuler chez Rawbank.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2">
                <div className="font-bold text-red-300 flex items-center gap-1.5">
                  <span>❌</span> Blocage de Traduction
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Penser en lingala/français puis traduire mot-à-mot, créant un décalage de 10 secondes et une anxiété permanente.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-amber-300 mb-3 uppercase tracking-wider">
                Les 4 Piliers de la Méthode PA³ :
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400">⚡ Micro-apprentissage</div>
                  <div className="text-slate-400">5 à 8 minutes par jour, faisables dans le taxi-bus ou à la pause midi.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400">🇨🇩 Ancrage Congolais</div>
                  <div className="text-slate-400">Exemples concrets vécus à Kinshasa, Lubumbashi et Goma.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400">🗣️ Immersion Phonétique</div>
                  <div className="text-slate-400">Répétition active à voix haute et déconstruction des accents pièges.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400">🏆 Gamification & Diplôme</div>
                  <div className="text-slate-400">Points XP, paliers CECRL, QR Code scannable et vérification en ligne.</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: CURRICULUM ACTUEL */}
        {(selectedFilter === 'ALL' || selectedFilter === 'CURRICULUM') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    2. Cursus Actuel & Leçons Interactives Déployées (Niveau A1)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ces modules interactifs avec reconnaissance vocale et quiz sont actuellement disponibles pour les apprenants
                  </p>
                </div>
              </div>
              <Link
                href="/admin?tab=lessons"
                className="text-xs text-gold hover:underline font-bold hidden sm:inline"
              >
                Gérer dans l&apos;éditeur de leçons →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CURRICULUM_LESSONS.map((lesson, idx) => (
                <div
                  key={lesson.slug}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Module {idx + 1} • {lesson.cefr}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {lesson.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{lesson.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{lesson.objective}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                    <code className="text-[11px] text-amber-400/90 font-mono">/lecon/{lesson.slug}</code>
                    <Link
                      href={`/lecon/${lesson.slug}`}
                      target="_blank"
                      className="text-slate-400 hover:text-white transition font-medium flex items-center gap-1"
                    >
                      <span>Tester</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: LES 12 SCRIPTS VIDÉO PRIORITAIRES */}
        {(selectedFilter === 'ALL' || selectedFilter === 'A' || selectedFilter === 'B' || selectedFilter === 'C') && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎬</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    3. Les 12 Leçons Vidéo Prioritaires à Enregistrer (Scripts Clé en Main)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Cliquez sur un module pour afficher son déroulé complet, ses phrases clés et son script type
                  </p>
                </div>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-bold">
                {filteredScripts.length} affichés
              </span>
            </div>

            <div className="space-y-4">
              {filteredScripts.map((script) => {
                const isExpanded = expandedScriptId === script.id;
                const poleBadgeColor =
                  script.pole === 'A'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : script.pole === 'B'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-sky-500/20 text-sky-300 border-sky-500/40';

                return (
                  <div
                    key={script.id}
                    className={`rounded-3xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-slate-900 border-gold/40 shadow-xl shadow-amber-500/5'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <div
                      onClick={() => setExpandedScriptId(isExpanded ? null : script.id)}
                      className="p-5 sm:p-6 cursor-pointer flex items-start sm:items-center justify-between gap-4 select-none"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-9 h-9 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-amber-400 text-sm shrink-0 border border-slate-700">
                          {script.number}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${poleBadgeColor}`}>
                              Pôle {script.pole} • {script.poleTitle}
                            </span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-semibold">
                              {script.level}
                            </span>
                            <span className="text-[10px] text-slate-400">⏱️ {script.duration}</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white hover:text-amber-300 transition">
                            {script.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          {isExpanded ? 'Masquer' : 'Voir le script'}
                        </span>
                        <span className="text-slate-400 text-lg transition-transform duration-200">
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Script Body */}
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-6">
                        {/* Target & Method */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                            <div className="font-bold text-red-400 flex items-center gap-1.5">
                              <span>🎯</span> Le problème de l&apos;étudiant congolais :
                            </div>
                            <p className="text-slate-300 leading-relaxed">{script.targetIssue}</p>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                              <span>💡</span> La méthode enseignée par le Coach :
                            </div>
                            <p className="text-slate-300 leading-relaxed">{script.method}</p>
                          </div>
                        </div>

                        {/* Key Phrases to Repeat */}
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🗣️</span> Phrases clés à faire répéter à haute voix :
                            </span>
                            <button
                              onClick={() => copyToClipboard(script.keyPhrases.join('\n'), 'Phrases Clés')}
                              className="text-[11px] text-amber-400 hover:text-amber-300 transition font-semibold"
                            >
                              Copier ces phrases 📋
                            </button>
                          </div>
                          <ul className="space-y-1.5">
                            {script.keyPhrases.map((phrase, pIdx) => (
                              <li
                                key={pIdx}
                                className="text-xs text-white font-mono bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/80"
                              >
                                {phrase}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Full Script Outline */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <span>📜</span> Déroulé & Timing du Tournage (Chronologie) :
                            </span>
                            <button
                              onClick={() => copyToClipboard(script.fullScriptOutline, `Script Vidéo ${script.number}`)}
                              className="text-xs text-gold hover:underline font-bold flex items-center gap-1"
                            >
                              <span>Copier tout le script</span>
                              <span>📋</span>
                            </button>
                          </div>

                          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-sans text-xs whitespace-pre-wrap leading-relaxed border border-slate-800">
                            {script.fullScriptOutline}
                          </pre>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                          <button
                            onClick={() => copyToClipboard(script.fullScriptOutline, `Script Vidéo ${script.number}`)}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2"
                          >
                            <span>Copier le Script</span>
                            <span>📋</span>
                          </button>
                          <Link
                            href="/admin?tab=vod"
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2"
                          >
                            <span>Ajouter cette vidéo dans la VOD</span>
                            <span>🎥</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 4: LA FORMULE DU TOURNAGE EN 5 ÉTAPES */}
        {(selectedFilter === 'ALL' || selectedFilter === 'FORMULA') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎙️</span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  4. La Formule du Tournage en 5 Étapes (Méthode 5 Minutes Chrono)
                </h2>
                <p className="text-xs text-slate-400">
                  La structure psychologique infaillible à respecter pour chaque vidéo
                </p>
              </div>
            </div>

            {/* Timeline cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                  0:00 - 0:20
                </span>
                <div className="font-bold text-white text-sm">1. L&apos;Accroche Choc</div>
                <p className="text-slate-400">
                  Interpellation directe sur une faute courante qui coûte un travail ou un examen.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  0:20 - 1:30
                </span>
                <div className="font-bold text-white text-sm">2. La Règle Simple</div>
                <p className="text-slate-400">
                  Explication imagée en français, sans jargon grammatical lourd.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  1:30 - 3:30
                </span>
                <div className="font-bold text-white text-sm">3. Exemples RDC</div>
                <p className="text-slate-400">
                  3 mises en situation vécues à Kinshasa (bureau, taxi, restaurant, visa).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                  3:30 - 4:30
                </span>
                <div className="font-bold text-white text-sm">4. Répétition Active</div>
                <p className="text-slate-400">
                  Faire parler l&apos;élève. Pause silencieuse face caméra en souriant.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  4:30 - 5:00
                </span>
                <div className="font-bold text-white text-sm">5. Appel à l&apos;Action</div>
                <p className="text-slate-400">
                  Renvoyer vers l&apos;exercice correspondant sur pa-english-academy.vercel.app.
                </p>
              </div>
            </div>

            {/* Script Template */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Script Type Mot-à-Mot (Exemple &quot;I agree&quot;) :
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `1. Accroche (20s) : « Si vous dites encore "I am agree with you", arrêtez tout de suite ! C'est une faute qui saute aux yeux de n'importe quel recruteur anglophone. Aujourd'hui, je vous montre la formule exacte en 30 secondes. »\n2. Explication (1m) : « En français, "d'accord" est un adjectif, donc on utilise "être". Mais en anglais, "to agree" est déjà un VERBE à part entière ! Donc on ne met JAMAIS le verbe être devant. »\n3. Exemples (2m) :\n- "I agree with the manager."\n- "I completely agree."\n- "I disagree."\n4. Répétition (1m) : « Répétez après moi avec énergie : I agree ! ... À votre tour ! (pause de 2 secondes). Excellent ! »\n5. Appel à l'action (30s) : « Ouvrez l'application PA³ English Academy, gagnez vos 20 XP sur l'exercice de l'unité ! »`,
                      'Script Type'
                    )
                  }
                  className="text-xs text-amber-400 hover:underline font-bold"
                >
                  Copier ce modèle 📋
                </button>
              </div>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>
                  <strong className="text-red-400">1. Accroche :</strong> <em>« Si vous dites encore &quot;I am agree with you&quot;, arrêtez tout de suite ! C&apos;est une faute qui saute aux yeux de n&apos;importe quel recruteur anglophone. Aujourd&apos;hui, je vous montre la formule exacte en 30 secondes. »</em>
                </p>
                <p>
                  <strong className="text-amber-400">2. Explication :</strong> <em>« En français, &quot;d&apos;accord&quot; est un adjectif, donc on utilise &quot;être&quot;. Mais en anglais, &quot;to agree&quot; est déjà un VERBE à part entière ! Donc on ne met JAMAIS le verbe être devant. »</em>
                </p>
                <p>
                  <strong className="text-emerald-400">3. Exemples :</strong> <em>&quot;I agree with the manager.&quot; • &quot;I completely agree.&quot; • &quot;I disagree.&quot;</em>
                </p>
                <p>
                  <strong className="text-sky-400">4. Pratique :</strong> <em>« Répétez après moi avec énergie : I agree ! ... À votre tour ! (pause de 2 secondes en souriant). Excellent ! »</em>
                </p>
                <p>
                  <strong className="text-purple-400">5. Appel à l&apos;action :</strong> <em>« Ouvrez l&apos;application PA³ English Academy, allez dans l&apos;exercice correspondant et gagnez vos 20 points XP. Rendez-vous sur pa-english-academy.vercel.app ! »</em>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: GUIDE TECHNIQUE KINSHASA */}
        {(selectedFilter === 'ALL' || selectedFilter === 'TECHNIQUE') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛠️</span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  5. Guide Technique : Tourner des Vidéos Pro à Kinshasa
                </h2>
                <p className="text-xs text-slate-400">
                  Pas besoin de matériel coûteux : 95% des meilleures vidéos sur TikTok et YouTube sont faites avec un smartphone bien utilisé
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-amber-400 font-bold text-sm flex items-center gap-2">
                  <span>☀️</span> 1. La Lumière Naturelle
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Placez-vous toujours <strong className="text-white">FACE à une fenêtre</strong>. La lumière du jour de Kinshasa donne un teint éclatant et naturel.
                </p>
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-semibold">
                  ⛔ Interdit : Avoir une fenêtre ou une lampe forte dans votre dos (contre-jour).
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                  <span>🎙️</span> 2. Le Son (Priorité Absolue)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Les apprenants pardonnent une image moyenne, mais personne ne regarde une vidéo avec un mauvais son ou de l&apos;écho.
                </p>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                  💡 Conseil : Achetez un micro-cravate sans fil (K9 ou Boya, ~$10 à Kinshasa) qui se branche directement sur le téléphone.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="text-sky-400 font-bold text-sm flex items-center gap-2">
                  <span>📱</span> 3. Cadrage & Formats
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-white">Vertical (9:16) :</strong> Idéal pour TikTok, Reels, Shorts et statuts WhatsApp. Cadrer de la poitrine au crâne.<br />
                  <strong className="text-white">Paysage (16:9) :</strong> Pour les cours complets sur grand écran.
                </p>
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 font-semibold">
                  💡 Pensez à nettoyer la lentille de votre smartphone avec un chiffon doux avant de filmer !
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 6: PUBLICATION SUR LA PLATEFORME PA³ */}
        {(selectedFilter === 'ALL' || selectedFilter === 'TECHNIQUE') && (
          <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-purple-950/40 border border-purple-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📲</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    6. Comment Publier Vos Vidéos sur la Plateforme PA³
                  </h2>
                  <p className="text-xs text-purple-300">
                    Processus pas à pas pour mettre en ligne vos leçons en quelques secondes
                  </p>
                </div>
              </div>
              <Link
                href="/admin?tab=vod"
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-600/30 transition flex items-center gap-2 self-start sm:self-auto"
              >
                <span>Accéder à la Vidéothèque VOD</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-400">Étape 1 : Hébergement</div>
                <p className="text-slate-300">
                  Uploadez la vidéo sur votre chaîne YouTube en mode <strong>« Non répertorié »</strong> (gratuit et illimité) ou sur Cloudinary MP4.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-400">Étape 2 : Création VOD</div>
                <p className="text-slate-300">
                  Dans le panneau admin PA³, allez dans l&apos;onglet <strong>« Vidéothèque VOD »</strong> et cliquez sur <strong>« Ajouter une nouvelle vidéo »</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-400">Étape 3 : Diffusion Directe</div>
                <p className="text-slate-300">
                  Collez le lien, cochez le niveau (A1, A2 ou B1) et enregistrez. La vidéo est immédiatement disponible pour tous les étudiants !
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        PA³ English Academy • Document Pédagogique & Stratégique Réservé à l&apos;Administration • Kinshasa, RDC © 2026.
      </footer>
    </div>
  );
}
