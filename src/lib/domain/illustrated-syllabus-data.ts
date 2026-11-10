/**
 * PA³ English Academy - Données Pédagogiques du Syllabus Illustré
 * Guide visuel exhaustif spécialement adapté aux apprenants francophones, congolais et africains.
 */

export interface BodyPartItem {
  id: string;
  nameEn: string;
  nameFr: string;
  lingalaNote?: string;
  phonetic: string;
  category: 'head' | 'upper_body' | 'arms' | 'lower_body';
  sampleSentenceEn: string;
  sampleSentenceFr: string;
  pitfallWarningFr?: string;
}

export interface PronunciationRule {
  id: string;
  soundIpa: string;
  titleFr: string;
  subtitleFr: string;
  mouthPositionFr: string;
  vocalCords: 'Vibrantes (Voiced)' | 'Silencieuses (Voiceless)' | 'Mixte / Selon le verbe';
  africanPitfallFr: string;
  goodExamples: { word: string; phonetic: string; translationFr: string }[];
  trapComparison: {
    wrongSound: string;
    wrongWord: string;
    wrongMeaning: string;
    correctWord: string;
    correctMeaning: string;
  }[];
  coachTipFr: string;
}

export interface ClothingItem {
  id: string;
  nameEn: string;
  nameFr: string;
  category: 'business' | 'african_heritage' | 'casual' | 'accessories';
  phonetic: string;
  culturalNoteFr: string;
  sampleSentenceEn: string;
  sampleSentenceFr: string;
  emoji: string;
}

export interface EverydayObjectItem {
  id: string;
  nameEn: string;
  nameFr: string;
  category: 'tech_office' | 'daily_essentials' | 'rdc_field';
  phonetic: string;
  practicalContextFr: string;
  sampleSentenceEn: string;
  sampleSentenceFr: string;
  iconName: string;
}

/* =========================================================================
   1. LES DIFFÉRENTES PARTIES DU CORPS HUMAIN (THE HUMAN BODY)
   ========================================================================= */

export const BODY_PARTS_DATA: BodyPartItem[] = [
  // Tête & Visage
  {
    id: 'head',
    nameEn: 'Head',
    nameFr: 'Tête',
    lingalaNote: 'Mótu',
    phonetic: '/hɛd/',
    category: 'head',
    sampleSentenceEn: 'I have a terrible headache after working in the sun.',
    sampleSentenceFr: "J'ai un violent mal de tête après avoir travaillé au soleil.",
    pitfallWarningFr: 'Pensez à aspirer le /h/ initial ! Ne dites pas "ed", mais "Head".',
  },
  {
    id: 'forehead',
    nameEn: 'Forehead',
    nameFr: 'Front',
    lingalaNote: 'Elongi (partie supérieure)',
    phonetic: '/ˈfɔː.hɛd/ ou /ˈfɒr.ɪd/',
    category: 'head',
    sampleSentenceEn: 'The doctor checked the fever by placing a hand on the forehead.',
    sampleSentenceFr: 'Le médecin a vérifié la fièvre en posant sa main sur le front.',
  },
  {
    id: 'eyes',
    nameEn: 'Eyes (Eye)',
    nameFr: 'Yeux (Œil)',
    lingalaNote: 'Míso (Líso)',
    phonetic: '/aɪz/ (/aɪ/)',
    category: 'head',
    sampleSentenceEn: 'Please look the interviewer directly in the eyes.',
    sampleSentenceFr: 'Regardez le recruteur droit dans les yeux avec assurance.',
    pitfallWarningFr: 'Le singulier "eye" se prononce exactement comme la lettre "I" (/aɪ/).',
  },
  {
    id: 'ears',
    nameEn: 'Ears (Ear)',
    nameFr: 'Oreilles (Oreille)',
    lingalaNote: 'Matói (Litói)',
    phonetic: '/ɪərz/ (/ɪər/)',
    category: 'head',
    sampleSentenceEn: 'Active listening requires opening your ears and taking notes.',
    sampleSentenceFr: "L'écoute active exige d'ouvrir grand vos oreilles et de prendre des notes.",
  },
  {
    id: 'nose',
    nameEn: 'Nose',
    nameFr: 'Nez',
    lingalaNote: 'Zólo',
    phonetic: '/noʊz/',
    category: 'head',
    sampleSentenceEn: 'In mining sites, dust masks protect your nose and lungs.',
    sampleSentenceFr: 'Dans les carrières minières, les masques protègent votre nez et vos poumons.',
  },
  {
    id: 'mouth',
    nameEn: 'Mouth',
    nameFr: 'Bouche',
    lingalaNote: 'Monɔkɔ',
    phonetic: '/maʊθ/',
    category: 'head',
    sampleSentenceEn: 'Open your mouth and speak up with confidence!',
    sampleSentenceFr: 'Ouvrez la bouche et parlez fort avec confiance !',
    pitfallWarningFr: 'Termine par le son /θ/ (langue entre les dents). Ne dites pas "maousse" ni "maoute" !',
  },
  {
    id: 'teeth',
    nameEn: 'Teeth (Tooth)',
    nameFr: 'Dents (Dent)',
    lingalaNote: 'Míno (Líno)',
    phonetic: '/tiːθ/ (/tuːθ/)',
    category: 'head',
    sampleSentenceEn: 'Brush your teeth twice a day for a bright smile.',
    sampleSentenceFr: 'Brossez-vous les dents deux fois par jour pour un sourire éclatant.',
    pitfallWarningFr: 'Pluriel irrégulier : 1 tooth, 2 teeth (ne dites jamais "tooths").',
  },
  {
    id: 'tongue',
    nameEn: 'Tongue',
    nameFr: 'Langue',
    lingalaNote: 'Lolému',
    phonetic: '/tʌŋ/',
    category: 'head',
    sampleSentenceEn: 'Place your tongue between your teeth to pronounce "think" correctly.',
    sampleSentenceFr: 'Placez votre langue entre vos dents pour prononcer "think" correctement.',
    pitfallWarningFr: 'Prononcez "teungue" (/tʌŋ/), jamais "ton-gué" !',
  },
  {
    id: 'neck',
    nameEn: 'Neck',
    nameFr: 'Cou',
    lingalaNote: 'Nkíngó',
    phonetic: '/nɛk/',
    category: 'upper_body',
    sampleSentenceEn: 'He wears a warm scarf around his neck when traveling abroad.',
    sampleSentenceFr: 'Il porte une écharpe chaude autour du cou lors de ses voyages à l’étranger.',
  },
  {
    id: 'throat',
    nameEn: 'Throat',
    nameFr: 'Gorge',
    lingalaNote: 'Mongóngó',
    phonetic: '/θroʊt/',
    category: 'upper_body',
    sampleSentenceEn: 'Drink warm honey tea if you have a sore throat before giving a speech.',
    sampleSentenceFr: 'Buvez du thé tiède au miel si vous avez mal à la gorge avant un discours.',
    pitfallWarningFr: 'Débute par /θr/ : glissez la langue entre les incisives.',
  },
  {
    id: 'shoulders',
    nameEn: 'Shoulders (Shoulder)',
    nameFr: 'Épaules (Épaule)',
    lingalaNote: 'Mapeka (Lipeka)',
    phonetic: '/ˈʃoʊl.dərz/',
    category: 'upper_body',
    sampleSentenceEn: 'Keep your shoulders relaxed and your back straight during meetings.',
    sampleSentenceFr: 'Gardez les épaules détendues et le dos droit pendant les réunions.',
  },
  {
    id: 'chest',
    nameEn: 'Chest',
    nameFr: 'Poitrine / Torse',
    lingalaNote: 'Ntólo',
    phonetic: '/tʃɛst/',
    category: 'upper_body',
    sampleSentenceEn: 'Take a deep breath and expand your chest before speaking in public.',
    sampleSentenceFr: 'Inspirez profondément et gonflez votre poitrine avant de parler en public.',
  },
  {
    id: 'stomach',
    nameEn: 'Stomach / Belly',
    nameFr: 'Estomac / Ventre',
    lingalaNote: 'Libumu',
    phonetic: '/ˈstʌm.ək/ / /ˈbɛl.i/',
    category: 'upper_body',
    sampleSentenceEn: 'I have a stomach ache after eating spicy pondu.',
    sampleSentenceFr: "J'ai mal au ventre après avoir mangé du pondu très pimenté.",
    pitfallWarningFr: 'Piège majeur : "Stomach" se termine par le son /k/ ("stémek") et JAMAIS par "tch" !',
  },
  {
    id: 'arm',
    nameEn: 'Arms (Arm)',
    nameFr: 'Bras',
    lingalaNote: 'Mabɔ́kɔ',
    phonetic: '/ɑːrmz/',
    category: 'arms',
    sampleSentenceEn: 'Fold your arms respectfully when listening attentively.',
    sampleSentenceFr: 'Croisez vos bras respectueusement lors d’une écoute attentive.',
  },
  {
    id: 'elbow',
    nameEn: 'Elbow',
    nameFr: 'Coude',
    lingalaNote: 'Liyíngó',
    phonetic: '/ˈɛl.boʊ/',
    category: 'arms',
    sampleSentenceEn: 'Do not put your elbows on the dining table in professional banquets.',
    sampleSentenceFr: 'Ne posez pas les coudes sur la table lors des banquets officiels.',
  },
  {
    id: 'hand',
    nameEn: 'Hands (Hand)',
    nameFr: 'Mains (Main)',
    lingalaNote: 'Mabɔ́kɔ (Lobɔ́kɔ)',
    phonetic: '/hændz/',
    category: 'arms',
    sampleSentenceEn: 'A firm handshake demonstrates confidence and honesty.',
    sampleSentenceFr: 'Une poignée de main ferme démontre votre assurance et votre franchise.',
    pitfallWarningFr: 'Aspirer le /h/ : "Hand" et non "and".',
  },
  {
    id: 'fingers',
    nameEn: 'Fingers & Thumb',
    nameFr: 'Doigts & Pouce',
    lingalaNote: 'Misápi (Mosápi)',
    phonetic: '/ˈfɪŋ.ɡərz/ & /θʌm/',
    category: 'arms',
    sampleSentenceEn: 'Type with all ten fingers to increase your computer efficiency.',
    sampleSentenceFr: 'Tapez avec vos dix doigts pour gagner en rapidité sur ordinateur.',
    pitfallWarningFr: 'Le "b" de "Thumb" (pouce) est complètement muet : prononcez /θʌm/ ("théme").',
  },
  {
    id: 'leg',
    nameEn: 'Legs (Leg)',
    nameFr: 'Jambes (Jambe)',
    lingalaNote: 'Makolo (Lokolo)',
    phonetic: '/lɛɡz/',
    category: 'lower_body',
    sampleSentenceEn: 'After walking from Victoire to Gombe, my legs were exhausted.',
    sampleSentenceFr: 'Après avoir marché de Victoire à la Gombe, mes jambes étaient épuisées.',
  },
  {
    id: 'knee',
    nameEn: 'Knee',
    nameFr: 'Genou',
    lingalaNote: 'Libɔ́ngɔ́',
    phonetic: '/niː/',
    category: 'lower_body',
    sampleSentenceEn: 'He hurt his right knee during a friendly football match.',
    sampleSentenceFr: "Il s'est blessé au genou droit pendant un match de football amical.",
    pitfallWarningFr: 'Le "K" initial est 100% muet ! Dites "Nii" (/niː/) et non "k-ni". Même règle pour Knife (couteau) et Know (savoir).',
  },
  {
    id: 'ankle',
    nameEn: 'Ankle',
    nameFr: 'Cheville',
    lingalaNote: 'Litóngi',
    phonetic: '/ˈæŋ.kəl/',
    category: 'lower_body',
    sampleSentenceEn: 'Watch your step on Kinshasa sidewalks to avoid twisting your ankle.',
    sampleSentenceFr: 'Faites attention où vous marchez sur les trottoirs pour ne pas vous tordre la cheville.',
  },
  {
    id: 'foot',
    nameEn: 'Feet (Foot)',
    nameFr: 'Pieds (Pied)',
    lingalaNote: 'Makolo (Lokolo)',
    phonetic: '/fiːt/ (/fʊt/)',
    category: 'lower_body',
    sampleSentenceEn: 'I came on foot because the traffic jam was too heavy.',
    sampleSentenceFr: "Je suis venu à pied parce que l'embouteillage était trop dense.",
    pitfallWarningFr: 'Pluriel irrégulier : 1 foot, 2 feet. Dire "on foot" (à pied), jamais "by foot".',
  },
];

/* =========================================================================
   2. LE GRAND GUIDE DE PRONONCIATION PHONÉTIQUE
   (Spécialement ciblé sur les difficultés des Congolais et Francophones)
   ========================================================================= */

export const PRONUNCIATION_RULES_DATA: PronunciationRule[] = [
  {
    id: 'th-unvoiced',
    soundIpa: '/θ/',
    titleFr: 'Le Son TH Sourd (Langue entre les dents)',
    subtitleFr: 'La clé pour ne plus dire "I tink" ni "I sink"',
    mouthPositionFr: 'Poussez doucement le bout de la langue entre les incisives du haut et du bas. Soufflez de l’air sans faire vibrer la gorge.',
    vocalCords: 'Silencieuses (Voiceless)',
    africanPitfallFr:
      'En français et lingala, ce son n’existe pas. Les apprenants le remplacent instinctivement par un /s/ ou un /t/. Dire "I sink" signifie "Je coule / Je sombre" au lieu de "Je pense" !',
    goodExamples: [
      { word: 'Think', phonetic: '/θɪŋk/', translationFr: 'Penser / Réfléchir' },
      { word: 'Thank you', phonetic: '/ˈθæŋk juː/', translationFr: 'Merci' },
      { word: 'Three', phonetic: '/θriː/', translationFr: 'Trois (3)' },
      { word: 'Month', phonetic: '/mʌnθ/', translationFr: 'Mois' },
      { word: 'Health', phonetic: '/hɛlθ/', translationFr: 'Santé' },
    ],
    trapComparison: [
      {
        wrongSound: '/s/',
        wrongWord: 'Sink',
        wrongMeaning: 'Couler / Évier',
        correctWord: 'Think',
        correctMeaning: 'Penser',
      },
      {
        wrongSound: '/t/',
        wrongWord: 'Tree',
        wrongMeaning: 'Arbre',
        correctWord: 'Three',
        correctMeaning: 'Trois (3)',
      },
      {
        wrongSound: '/t/',
        wrongWord: 'Tin',
        wrongMeaning: 'Boîte de conserve',
        correctWord: 'Thin',
        correctMeaning: 'Mince / Fin',
      },
    ],
    coachTipFr:
      'Placez votre index verticalement à 1 cm de vos lèvres. En prononçant "Three" et "Think", votre langue doit effleurer votre doigt !',
  },
  {
    id: 'th-voiced',
    soundIpa: '/ð/',
    titleFr: 'Le Son TH Sonore (Avec vibration vocale)',
    subtitleFr: 'Pour dire "This, That, Brother" avec élégance',
    mouthPositionFr: 'Même position de la langue entre les dents que pour /θ/, mais cette fois, vous FAITES VIBRER vos cordes vocales comme une abeille.',
    vocalCords: 'Vibrantes (Voiced)',
    africanPitfallFr:
      'Remplacé à tort par un /z/ ou un /d/ ("Dis morning", "Zat man"). Les anglophones entendent un accent très lourd.',
    goodExamples: [
      { word: 'This / That', phonetic: '/ðɪs/ / /ðæt/', translationFr: 'Ceci / Cela' },
      { word: 'Mother / Father', phonetic: '/ˈmʌðər/ / /ˈfɑːðər/', translationFr: 'Mère / Père' },
      { word: 'Together', phonetic: '/təˈɡɛðər/', translationFr: 'Ensemble' },
      { word: 'With', phonetic: '/wɪð/', translationFr: 'Avec' },
      { word: 'Weather', phonetic: '/ˈwɛðər/', translationFr: 'Météo / Temps qu’il fait' },
    ],
    trapComparison: [
      {
        wrongSound: '/d/',
        wrongWord: 'Dare',
        wrongMeaning: 'Oser',
        correctWord: 'There',
        correctMeaning: 'Là-bas',
      },
      {
        wrongSound: '/z/',
        wrongWord: 'Breeze',
        wrongMeaning: 'Brise / Petit vent',
        correctWord: 'Breathe',
        correctMeaning: 'Respirer',
      },
    ],
    coachTipFr: 'Posez deux doigts sur votre gorge : vous DEVEZ ressentir un bourdonnement intense en disant "This".',
  },
  {
    id: 'h-aspirated',
    soundIpa: '/h/',
    titleFr: 'Le H Aspiré (Le souffle d’énergie)',
    subtitleFr: 'Ne confondez plus "Hungry" (faim) et "Angry" (colère) !',
    mouthPositionFr: 'Bouche ouverte, gorge détendue. Expirez un souffle franc et chaud venant des poumons, comme pour faire de la buée sur un miroir.',
    vocalCords: 'Silencieuses (Voiceless)',
    africanPitfallFr:
      'En français, le H est toujours silencieux (homme, hôpital). En RDC, beaucoup disent "I am hungry" sans H, ce qui donne "I am angry" (Je suis en colère !). Dire à un serveur à Kinshasa "I am angry" au lieu de "I am hungry" peut créer un énorme malentendu.',
    goodExamples: [
      { word: 'Hospital', phonetic: '/ˈhɒs.pɪ.təl/', translationFr: 'Hôpital' },
      { word: 'Hotel', phonetic: '/hoʊˈtɛl/', translationFr: 'Hôtel' },
      { word: 'Help', phonetic: '/hɛlp/', translationFr: 'Aide / Secours' },
      { word: 'Hope', phonetic: '/hoʊp/', translationFr: 'Espoir / Espérer' },
      { word: 'Hungry', phonetic: '/ˈhʌŋ.ɡri/', translationFr: 'Avoir faim' },
    ],
    trapComparison: [
      {
        wrongSound: 'Muet',
        wrongWord: 'Angry',
        wrongMeaning: 'En colère',
        correctWord: 'Hungry',
        correctMeaning: 'Affamé',
      },
      {
        wrongSound: 'Muet',
        wrongWord: 'Ear',
        wrongMeaning: 'Oreille',
        correctWord: 'Hear',
        correctMeaning: 'Entendre',
      },
      {
        wrongSound: 'Muet',
        wrongWord: 'Air',
        wrongMeaning: 'Air que l’on respire',
        correctWord: 'Hair',
        correctMeaning: 'Cheveux',
      },
    ],
    coachTipFr: 'Attention aux 4 seules exceptions où le H est muet en anglais moderne : Hour (heure), Honest (honnête), Honor (honneur), Heir (héritier).',
  },
  {
    id: 'vowel-short-long',
    soundIpa: '/ɪ/ vs /iː/',
    titleFr: 'Voyelles Courtes Relâchées vs Voyelles Longues Tendues',
    subtitleFr: 'La différence vitale entre Ship et Sheep, Beach et Bitch',
    mouthPositionFr:
      'Pour /iː/ long : Souriez largement en tirant les commissures des lèvres. Pour /ɪ/ court : Ouvrez légèrement la mâchoire, lèvres totalement détendues.',
    vocalCords: 'Vibrantes (Voiced)',
    africanPitfallFr:
      'Le français n’a qu’un seul "i". Si vous ne tenez pas le /iː/ long dans "Sheet of paper" (feuille de papier) ou "Beach" (plage), vous prononcez involontairement des insultes vulgaires en anglais !',
    goodExamples: [
      { word: 'Leave (/iː/)', phonetic: '/liːv/', translationFr: 'Partir / Quitter' },
      { word: 'Live (/ɪ/)', phonetic: '/lɪv/', translationFr: 'Vivre / Habiter' },
      { word: 'Sheep (/iː/)', phonetic: '/ʃiːp/', translationFr: 'Mouton' },
      { word: 'Ship (/ɪ/)', phonetic: '/ʃɪp/', translationFr: 'Grand bateau / Navire' },
      { word: 'Feet (/iː/)', phonetic: '/fiːt/', translationFr: 'Pieds' },
      { word: 'Fit (/ɪ/)', phonetic: '/fɪt/', translationFr: 'En bonne forme / Ajusté' },
    ],
    trapComparison: [
      {
        wrongSound: '/ɪ/ bref',
        wrongWord: 'Shit',
        wrongMeaning: 'Excrément / Injure',
        correctWord: 'Sheet',
        correctMeaning: 'Feuille de papier / Drap',
      },
      {
        wrongSound: '/ɪ/ bref',
        wrongWord: 'Bitch',
        wrongMeaning: 'Insulte sexiste vulgaire',
        correctWord: 'Beach',
        correctMeaning: 'Plage de sable',
      },
    ],
    coachTipFr: 'Prenez 1 seconde complète pour étirer le son dans "P-l-e-a-s-e take a s-e-a-t" (Veuillez vous asseoir).',
  },
  {
    id: 'ed-ending',
    soundIpa: '/t/ • /d/ • /ɪd/',
    titleFr: 'La Règle d’Or de la Fin en -ED au Passé',
    subtitleFr: 'Ne prononcez plus jamais "work-ed" ni "play-ed" !',
    mouthPositionFr:
      '90% des verbes au passé se terminent par un simple son /t/ ou /d/ d’un coup sec. Vous n’ajoutez une syllabe supplémentaire (/ɪd/) QUE si le verbe se termine déjà par le son T ou D.',
    vocalCords: 'Mixte / Selon le verbe',
    africanPitfallFr:
      'La tendance naturelle francophone est de lire toutes les lettres écrites, créant des faux verbes à deux syllabes ("Watched-e", "Talk-ed-e").',
    goodExamples: [
      { word: 'Worked (/t/)', phonetic: '/wɜːrkt/', translationFr: 'A travaillé (1 seule syllabe)' },
      { word: 'Called (/d/)', phonetic: '/kɔːld/', translationFr: 'A appelé (1 seule syllabe)' },
      { word: 'Started (/ɪd/)', phonetic: '/ˈstɑːr.tɪd/', translationFr: 'A commencé (se termine par T)' },
      { word: 'Decided (/ɪd/)', phonetic: '/dɪˈsaɪ.dɪd/', translationFr: 'A décidé (se termine par D)' },
    ],
    trapComparison: [
      {
        wrongSound: '2 syllabes',
        wrongWord: 'Ask-ed',
        wrongMeaning: 'Mauvaise prononciation',
        correctWord: 'Asked (/æskt/)',
        correctMeaning: 'A demandé (1 syllabe)',
      },
      {
        wrongSound: '2 syllabes',
        wrongWord: 'Stop-ped',
        wrongMeaning: 'Mauvaise prononciation',
        correctWord: 'Stopped (/stɒpt/)',
        correctMeaning: 'S’est arrêté (1 syllabe)',
      },
    ],
    coachTipFr: 'Mémorisez cette formule magique : "Seuls T et D ont droit à -ED ! Tout le reste se termine en claquement /t/ ou /d/."',
  },
];

/* =========================================================================
   3. LES HABITS, VÊTEMENTS & MODE AFRICAINE (CLOTHES & AFRICAN FASHION)
   ========================================================================= */

export const CLOTHING_DATA: ClothingItem[] = [
  // Business & Corporate
  {
    id: 'suit',
    nameEn: 'Business Suit',
    nameFr: 'Costume complet / Tailleur',
    category: 'business',
    phonetic: '/ˈbɪz.nɪs suːt/',
    culturalNoteFr: 'Indispensable pour les rendez-vous ministériels à Gombe ou les banques.',
    sampleSentenceEn: 'He wore a dark navy blue suit to his job interview at the UN agency.',
    sampleSentenceFr: "Il portait un costume bleu marine sombre pour son entretien d'embauche à l'agence de l'ONU.",
    emoji: '🤵',
  },
  {
    id: 'tie',
    nameEn: 'Tie & Bow tie',
    nameFr: 'Cravate & Nœud papillon',
    category: 'business',
    phonetic: '/taɪ/ & /ˈboʊ taɪ/',
    culturalNoteFr: 'Élément central de la distinction professionnelle.',
    sampleSentenceEn: 'Make sure your tie matches the color of your suit.',
    sampleSentenceFr: 'Assurez-vous que votre cravate s’accorde avec la couleur de votre costume.',
    emoji: '👔',
  },
  {
    id: 'dress-shirt',
    nameEn: 'Dress Shirt',
    nameFr: 'Chemise habillée à boutons',
    category: 'business',
    phonetic: '/drɛs ʃɜːrt/',
    culturalNoteFr: 'Bien repassée, manche longue avec boutons de manchette.',
    sampleSentenceEn: 'A crisp white dress shirt is a timeless wardrobe essential.',
    sampleSentenceFr: 'Une chemise blanche impeccable est un basique intemporel de toute garde-robe.',
    emoji: '👔',
  },
  {
    id: 'pencil-skirt',
    nameEn: 'Pencil Skirt & Blouse',
    nameFr: 'Jupe droite & Chemisier',
    category: 'business',
    phonetic: '/ˈpɛn.səl skɜːrt/ & /blaʊz/',
    culturalNoteFr: 'Tenue corporate féminine très appréciée en entreprise et institutions internationales.',
    sampleSentenceEn: 'She paired an elegant pencil skirt with a cream silk blouse.',
    sampleSentenceFr: 'Elle a associé une jupe crayon élégante à un chemisier en soie crème.',
    emoji: '👗',
  },
  {
    id: 'oxford-shoes',
    nameEn: 'Leather Dress Shoes',
    nameFr: 'Souliers en cuir vernis / Richelieu',
    category: 'business',
    phonetic: '/ˈlɛð.ər drɛs ʃuːz/',
    culturalNoteFr: 'La SAPE congolaise vénère les souliers Weston, Berluti ou Church’s.',
    sampleSentenceEn: 'His polished black leather shoes were shining in the sun.',
    sampleSentenceFr: 'Ses souliers en cuir noir cirés brillaient au soleil.',
    emoji: '👞',
  },

  // African Heritage & Congolese Culture
  {
    id: 'african-wax',
    nameEn: 'African Wax Print Fabric (Pagne)',
    nameFr: 'Tissu pagne / Wax africain',
    category: 'african_heritage',
    phonetic: '/ˈæf.rɪ.kən wæks prɪnt ˈfæb.rɪk/',
    culturalNoteFr: 'Fierté nationale en RDC, porté pour les mariages coutumiers, dimanches et événements officiels.',
    sampleSentenceEn: 'Congolese women wear exquisite African wax print dresses for Sunday celebrations.',
    sampleSentenceFr: 'Les femmes congolaises portent de magnifiques robes en tissu pagne pour les célébrations dominicales.',
    emoji: '👘',
  },
  {
    id: 'dashiki-boubou',
    nameEn: 'Dashiki / African Boubou',
    nameFr: 'Dashiki / Grand Boubou brodé',
    category: 'african_heritage',
    phonetic: '/dəˈʃiː.ki/ / /buːˈbuː/',
    culturalNoteFr: 'Tunique brodée traditionnelle portée avec fierté à travers toute l’Afrique.',
    sampleSentenceEn: 'He welcomed the international delegation wearing a magnificent gold-embroidered boubou.',
    sampleSentenceFr: 'Il a accueilli la délégation internationale vêtu d’un magnifique boubou brodé d’or.',
    emoji: '🥻',
  },
  {
    id: 'headwrap',
    nameEn: 'African Headwrap / Turban',
    nameFr: 'Foulard de tête / Turban africain',
    category: 'african_heritage',
    phonetic: '/ˈhɛd.ræp/ / /ˈtɜːr.bən/',
    culturalNoteFr: 'Symbole de noblesse, de féminité et d’élégance africaine.',
    sampleSentenceEn: 'Her colorful headwrap complemented the pattern of her traditional gown.',
    sampleSentenceFr: 'Son foulard de tête coloré complétait parfaitement les motifs de sa robe traditionnelle.',
    emoji: '👑',
  },
  {
    id: 'sapeur-style',
    nameEn: 'Sapeur Dandy Attire',
    nameFr: 'Tenue de Sapeur (Société des Ambianceurs)',
    category: 'african_heritage',
    phonetic: '/sæpˈɜːr ˈdæn.di əˈtaɪər/',
    culturalNoteFr: 'Mouvement culturel unique né à Brazzaville et Kinshasa, basé sur le respect, la paix et l’élégance.',
    sampleSentenceEn: 'The Congolese Sapeurs turned street fashion into an internationally recognized art form.',
    sampleSentenceFr: 'Les Sapeurs congolais ont transformé la mode de rue en une véritable œuvre d’art reconnue mondialement.',
    emoji: '🎩',
  },

  // Casual & Everyday
  {
    id: 'tshirt-jeans',
    nameEn: 'T-Shirt & Jeans',
    nameFr: 'T-shirt & Jean',
    category: 'casual',
    phonetic: '/ˈtiː.ʃɜːrt/ & /dʒiːnz/',
    culturalNoteFr: 'Tenue universelle pour le week-end et les cours à l’université.',
    sampleSentenceEn: 'On Fridays, our tech company allows employees to wear polo shirts and jeans.',
    sampleSentenceFr: 'Le vendredi, notre entreprise technologique autorise le port du polo et du jean.',
    emoji: '👕',
  },
  {
    id: 'sneakers',
    nameEn: 'Sneakers / Trainers',
    nameFr: 'Baskets / Chaussures de sport',
    category: 'casual',
    phonetic: '/ˈsniː.kərz/ / /ˈtreɪ.nərz/',
    culturalNoteFr: '"Sneakers" en anglais américain, "Trainers" en anglais britannique.',
    sampleSentenceEn: 'Comfortable sneakers are essential when walking long distances across the city.',
    sampleSentenceFr: 'Des baskets confortables sont indispensables pour marcher de longues distances en ville.',
    emoji: '👟',
  },
  {
    id: 'hoodie',
    nameEn: 'Hoodie & Jacket',
    nameFr: 'Sweat à capuche & Veste',
    category: 'casual',
    phonetic: '/ˈhʊd.i/ & /ˈdʒæk.ɪt/',
    culturalNoteFr: 'Idéal pendant la saison des pluies ou dans les bureaux climatisés à fond.',
    sampleSentenceEn: 'Bring a light jacket because the air conditioning in the conference room is very cold.',
    sampleSentenceFr: 'Apportez une veste légère car la climatisation dans la salle de conférence est très fraîche.',
    emoji: '🧥',
  },

  // Accessories
  {
    id: 'watch',
    nameEn: 'Wristwatch',
    nameFr: 'Montre-bracelet',
    category: 'accessories',
    phonetic: '/ˈrɪst.wɒtʃ/',
    culturalNoteFr: 'Symbole de ponctualité ("Be on time!").',
    sampleSentenceEn: 'Checking his wristwatch, he realized he arrived ten minutes early.',
    sampleSentenceFr: 'En regardant sa montre, il s’est rendu compte qu’il était arrivé dix minutes en avance.',
    emoji: '⌚',
  },
  {
    id: 'belt',
    nameEn: 'Leather Belt',
    nameFr: 'Ceinture en cuir',
    category: 'accessories',
    phonetic: '/ˈlɛð.ər bɛlt/',
    culturalNoteFr: 'Doit toujours être assortie à la couleur des chaussures en milieu corporate.',
    sampleSentenceEn: 'Always match your belt color with your shoes: black with black, brown with brown.',
    sampleSentenceFr: 'Assortissez toujours la couleur de votre ceinture à vos chaussures : noir avec noir, marron avec marron.',
    emoji: '🥋',
  },
  {
    id: 'handbag',
    nameEn: 'Handbag / Tote Bag',
    nameFr: 'Sac à main / Grand sac cabas',
    category: 'accessories',
    phonetic: '/ˈhænd.bæɡ/ / /toʊt bæɡ/',
    culturalNoteFr: 'Pour transporter documents, tablette et effets personnels.',
    sampleSentenceEn: 'She kept her passport, laptop, and notebook safe inside her leather handbag.',
    sampleSentenceFr: 'Elle gardait son passeport, son ordinateur et son carnet en sécurité dans son sac à main en cuir.',
    emoji: '👜',
  },
  {
    id: 'sunglasses',
    nameEn: 'Sunglasses',
    nameFr: 'Lunettes de soleil',
    category: 'accessories',
    phonetic: '/ˈsʌnˌɡlæs.ɪz/',
    culturalNoteFr: 'Toujours au pluriel en anglais (comme "glasses", "trousers", "scissors").',
    sampleSentenceEn: 'Under the tropical Kinshasa sun, dark sunglasses protect your eyes from UV rays.',
    sampleSentenceFr: 'Sous le soleil tropical de Kinshasa, des lunettes de soleil sombres protègent vos yeux des rayons UV.',
    emoji: '🕶️',
  },
];

/* =========================================================================
   4. LES OBJETS DU QUOTIDIEN, DE BUREAU & DE TERRAIN
   ========================================================================= */

export const EVERYDAY_OBJECTS_DATA: EverydayObjectItem[] = [
  // Tech & Bureau
  {
    id: 'laptop',
    nameEn: 'Laptop Computer',
    nameFr: 'Ordinateur portable',
    category: 'tech_office',
    phonetic: '/ˈlæp.tɒp kəmˈpjuː.tər/',
    practicalContextFr: 'Outil numéro un des cadres, consultants et étudiants bilingues.',
    sampleSentenceEn: 'Please bring your charged laptop to the training workshop tomorrow morning.',
    sampleSentenceFr: 'Veuillez apporter votre ordinateur portable chargé pour l’atelier de formation demain matin.',
    iconName: 'Laptop',
  },
  {
    id: 'smartphone',
    nameEn: 'Smartphone & Charger',
    nameFr: 'Smartphone & Chargeur',
    category: 'tech_office',
    phonetic: '/ˈsmɑːrt.foʊn/ & /ˈtʃɑːr.dʒər/',
    practicalContextFr: 'Pour les appels WhatsApp, les e-mails professionnels et le Mobile Money.',
    sampleSentenceEn: 'Do you have a USB-C charger I can borrow for twenty minutes?',
    sampleSentenceFr: 'Avez-vous un chargeur USB-C que je pourrais emprunter pendant vingt minutes ?',
    iconName: 'Smartphone',
  },
  {
    id: 'headphones',
    nameEn: 'Headphones / Headset',
    nameFr: 'Casque audio / Écouteurs avec micro',
    category: 'tech_office',
    phonetic: '/ˈhɛd.foʊnz/ / /ˈhɛd.sɛt/',
    practicalContextFr: 'Essentiel pour écouter les podcasts d’anglais et participer aux visioconférences sans bruit ambiant.',
    sampleSentenceEn: 'Using noise-canceling headphones improves your English pronunciation listening practice.',
    sampleSentenceFr: "L'utilisation d'un casque anti-bruit améliore votre écoute pour la prononciation anglaise.",
    iconName: 'Headphones',
  },
  {
    id: 'id-badge',
    nameEn: 'ID Badge & Lanyard',
    nameFr: 'Badge d’identification & Tour de cou',
    category: 'tech_office',
    phonetic: '/aɪˈdiː bædʒ/ & /ˈlæn.jərd/',
    practicalContextFr: 'Exigé pour entrer dans les immeubles des ONGs, ambassades et banques.',
    sampleSentenceEn: 'Security guards will ask you to display your employee ID badge at the reception desk.',
    sampleSentenceFr: 'Les agents de sécurité vous demanderont de présenter votre badge à la réception.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'notebook-pen',
    nameEn: 'Notebook & Ballpoint Pen',
    nameFr: 'Cahier de notes & Stylo à bille',
    category: 'tech_office',
    phonetic: '/ˈnoʊt.bʊk/ & /ˈbɔːl.pɔɪnt pɛn/',
    practicalContextFr: 'Toujours avoir de quoi noter les nouvelles expressions et consignes du coach.',
    sampleSentenceEn: 'A good student always carries a pocket notebook to write down new English vocabulary.',
    sampleSentenceFr: 'Un bon étudiant a toujours un carnet de poche pour noter les nouveaux mots anglais.',
    iconName: 'BookOpen',
  },

  // Daily Essentials & City Life
  {
    id: 'keys',
    nameEn: 'Keys & Keyring',
    nameFr: 'Clés & Porte-clés',
    category: 'daily_essentials',
    phonetic: '/kiːz/ & /ˈkiː.rɪŋ/',
    practicalContextFr: 'Clés de maison, du bureau ou de la voiture.',
    sampleSentenceEn: 'Do not forget your house keys on the kitchen counter.',
    sampleSentenceFr: 'N’oubliez pas vos clés de maison sur le comptoir de la cuisine.',
    iconName: 'Key',
  },
  {
    id: 'wallet',
    nameEn: 'Wallet & Bank Card',
    nameFr: 'Portefeuille & Carte bancaire',
    category: 'daily_essentials',
    phonetic: '/ˈwɒl.ɪt/ & /bæŋk kɑːrd/',
    practicalContextFr: 'Cartes bancaires (Visa/Mastercard) et pièces d’identité.',
    sampleSentenceEn: 'He opened his leather wallet to pay for the taxi fare in US dollars.',
    sampleSentenceFr: 'Il a ouvert son portefeuille en cuir pour payer la course de taxi en dollars américains.',
    iconName: 'CreditCard',
  },
  {
    id: 'water-bottle',
    nameEn: 'Water Bottle & Thermos',
    nameFr: 'Gourde d’eau & Bouteille isotherme',
    category: 'daily_essentials',
    phonetic: '/ˈwɔː.tər ˈbɒt.əl/',
    practicalContextFr: 'Rester hydraté sous la chaleur tropicale de Kinshasa et Lubumbashi.',
    sampleSentenceEn: 'Drinking water from your reusable bottle keeps your vocal cords hydrated for speaking.',
    sampleSentenceFr: 'Boire de l’eau dans votre gourde réutilisable garde vos cordes vocales bien hydratées pour parler.',
    iconName: 'CupSoda',
  },
  {
    id: 'umbrella',
    nameEn: 'Umbrella',
    nameFr: 'Parapluie',
    category: 'daily_essentials',
    phonetic: '/ʌmˈbrɛl.ə/',
    practicalContextFr: 'Indispensable lors des averses tropicales soudaines de septembre à mai.',
    sampleSentenceEn: 'Keep a compact umbrella in your backpack during the rainy season in Central Africa.',
    sampleSentenceFr: 'Gardez un parapluie compact dans votre sac à dos pendant la saison des pluies en Afrique Centrale.',
    iconName: 'Umbrella',
  },
  {
    id: 'passport',
    nameEn: 'Passport & Travel Visa',
    nameFr: 'Passeport & Visa de voyage',
    category: 'daily_essentials',
    phonetic: '/ˈpæs.pɔːrt/ & /ˈtræv.əl ˈviː.zə/',
    practicalContextFr: 'Le sésame pour les voyages d’affaires à Dubaï, Johannesburg, Nairobi ou Londres.',
    sampleSentenceEn: 'The immigration officer at N’djili International Airport stamped his passport.',
    sampleSentenceFr: "L'officier d'immigration à l'aéroport international de N'djili a tamponné son passeport.",
    iconName: 'FileCheck',
  },

  // RDC Specific & Field Work
  {
    id: 'power-bank',
    nameEn: 'Portable Power Bank',
    nameFr: 'Batterie externe portable',
    category: 'rdc_field',
    phonetic: '/ˈpɔːr.tə.bəl ˈpaʊ.ər bæŋk/',
    practicalContextFr: 'Le sauveur indispensable en cas de coupure de courant (délestage) pour garder son téléphone allumé.',
    sampleSentenceEn: 'During a power outage in Kinshasa, my 20,000 mAh power bank kept my phone alive for two days.',
    sampleSentenceFr: 'Pendant une coupure de courant à Kinshasa, ma batterie externe a alimenté mon téléphone pendant deux jours.',
    iconName: 'BatteryCharging',
  },
  {
    id: 'ppe-mining',
    nameEn: 'Personal Protective Equipment (Hard Hat & Safety Boots)',
    nameFr: 'Équipement de Protection Individuelle (Casque de chantier & Bottes)',
    category: 'rdc_field',
    phonetic: '/ˈhɑːrd hæt/ & /ˈseɪf.ti buːts/',
    practicalContextFr: 'Obligatoire pour les ingénieurs et cadres visitant les sites miniers du Katanga et du Lualaba.',
    sampleSentenceEn: 'Safety regulations in Kolwezi copper mines strictly require hard hats, goggles, and steel-toe boots.',
    sampleSentenceFr: 'Les règles de sécurité dans les mines de cuivre de Kolwezi exigent strictement casque, lunettes et bottes de sécurité.',
    iconName: 'HardHat',
  },
  {
    id: 'mobile-money',
    nameEn: 'Mobile Money Phone',
    nameFr: 'Téléphone Mobile Money (M-Pesa, Airtel Money, Orange Money)',
    category: 'rdc_field',
    phonetic: '/ˈmoʊ.bəl ˈmʌn.i foʊn/',
    practicalContextFr: 'Moyen de paiement prédominant en RDC pour régler cours, courses et salaires.',
    sampleSentenceEn: 'You can instantly activate your English Academy subscription via Mobile Money transfer.',
    sampleSentenceFr: 'Vous pouvez activer instantanément votre abonnement PA³ English Academy par transfert Mobile Money.',
    iconName: 'Send',
  },
];
