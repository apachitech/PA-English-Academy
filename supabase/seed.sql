-- =====================================================================
-- SpeakUp Congo — seed data
-- Deterministic UUIDs make the seed idempotent-friendly and easy to reference.
--   levels : 00000000-0000-0000-0000-0000000000{a1,a2,b1,b2}
--   units  : 10000000-0000-0000-0000-00000000010{1..4}  (A1)
--   lessons: 20000000-0000-0000-0000-0000000001{unit}{pos}
-- =====================================================================

-- ---------- Levels ---------------------------------------------------
insert into public.levels (id, code, title_fr, description_fr, position, is_free, price_usd_cents, status) values
  ('00000000-0000-0000-0000-0000000000a1', 'A1', 'Débutant',
   'Les bases : saluer, se présenter, compter, parler de sa famille et faire ses courses au marché.', 1, true, 0, 'published'),
  ('00000000-0000-0000-0000-0000000000a2', 'A2', 'Élémentaire',
   'Parler de sa routine, de son travail, voyager et raconter des événements simples au passé.', 2, false, 500, 'published'),
  ('00000000-0000-0000-0000-0000000000b1', 'B1', 'Intermédiaire',
   'Exprimer son opinion, comprendre des conversations courantes et écrire des messages professionnels.', 3, false, 700, 'published'),
  ('00000000-0000-0000-0000-0000000000b2', 'B2', 'Intermédiaire avancé',
   'Débattre, comprendre des émissions et réussir des entretiens d''embauche en anglais.', 4, false, 900, 'published');

-- ---------- A1 Units -------------------------------------------------
insert into public.units (id, level_id, title_fr, description_fr, icon, position, status) values
  ('10000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-0000000000a1',
   'Premiers pas', 'Saluer, se présenter et compter jusqu''à 20.', 'hand', 1, 'published'),
  ('10000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-0000000000a1',
   'Ma famille et moi', 'Présenter sa famille, décrire les personnes et sa maison.', 'users', 2, 'published'),
  ('10000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-0000000000a1',
   'Au marché', 'La nourriture, les prix et les achats au marché.', 'shopping-basket', 3, 'published'),
  ('10000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-0000000000a1',
   'Le temps et la ville', 'Les jours, l''heure, les transports et les directions.', 'clock', 4, 'published');

-- ---------- A1 Lessons (4 units x 5 lessons) -------------------------
insert into public.lessons (id, unit_id, slug, title_fr, title_en, objective_fr, explanation_fr, position, xp_reward, est_minutes, status) values
  -- Unit 1
  ('20000000-0000-0000-0000-000000000111', '10000000-0000-0000-0000-000000000101', 'a1-salutations',
   'Les salutations', 'Greetings',
   'Dire bonjour, au revoir et demander « comment ça va ? » en anglais.',
   E'## Saluer selon le moment de la journée\n- **Good morning** : le matin (jusqu''à midi)\n- **Good afternoon** : l''après-midi\n- **Good evening** : le soir (pour arriver, pas pour partir)\n- **Good night** : pour aller dormir ou partir très tard\n\n## Familier ou poli ?\n- **Hi / Hello** : entre amis, au marché, au quartier.\n- **Good morning, sir / madam** : au bureau, à l''église, avec un professeur.\n\n## Demander des nouvelles\n- *How are you?* → **I''m fine, thank you. And you?**\n- *How is it going?* → **Not bad!**',
   1, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000112', '10000000-0000-0000-0000-000000000101', 'a1-se-presenter',
   'Se présenter', 'Introducing yourself',
   'Dire son nom, son âge, sa ville et demander ceux des autres.',
   E'## Le verbe *to be* (être)\n| Anglais | Français |\n|---|---|\n| I **am** (I''m) | je suis |\n| You **are** (you''re) | tu es / vous êtes |\n| He / She **is** (he''s / she''s) | il / elle est |\n\n## Phrases utiles\n- **My name is** Patrick. / **I''m** Patrick.\n- **I''m from** Kinshasa. (je viens de…)\n- **I''m** 25 **years old**. ⚠️ En anglais on *est* son âge, on ne l''*a* pas : ~~I have 25 years~~.\n- **Nice to meet you!** (Enchanté !)',
   2, 20, 10, 'published'),
  ('20000000-0000-0000-0000-000000000113', '10000000-0000-0000-0000-000000000101', 'a1-nombres-0-20',
   'Les nombres de 0 à 20', 'Numbers 0–20',
   'Compter de 0 à 20 et donner son numéro de téléphone.',
   E'## 0 à 10\nzero, one, two, three, four, five, six, seven, eight, nine, ten\n\n## 11 à 20\neleven, twelve, thir**teen**, four**teen**, fif**teen**, six**teen**, seven**teen**, eigh**teen**, nine**teen**, twenty\n\n💡 Les nombres en **-teen** (13–19) ont l''accent à la fin : thir**TEEN**. Ne confondez pas avec thir**ty** (30).\n\n## Numéro de téléphone\nOn lit chiffre par chiffre : 0812 → *zero, eight, one, two*. Le 0 se dit souvent **« oh »**.',
   3, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000114', '10000000-0000-0000-0000-000000000101', 'a1-alphabet',
   'L''alphabet et épeler', 'The alphabet & spelling', 'Épeler son nom et le nom de sa ville.', '', 4, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000115', '10000000-0000-0000-0000-000000000101', 'a1-pays-villes',
   'Pays et villes', 'Countries & cities', 'Parler des pays, des villes et des nationalités.', '', 5, 20, 8, 'published'),
  -- Unit 2
  ('20000000-0000-0000-0000-000000000121', '10000000-0000-0000-0000-000000000102', 'a1-la-famille',
   'Les membres de la famille', 'Family members', 'Nommer les membres de sa famille.', '', 1, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000122', '10000000-0000-0000-0000-000000000102', 'a1-possessifs',
   'My, your, his, her', 'Possessive adjectives', 'Utiliser les adjectifs possessifs.', '', 2, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000123', '10000000-0000-0000-0000-000000000102', 'a1-decrire-personnes',
   'Décrire une personne', 'Describing people', 'Décrire l''apparence et le caractère.', '', 3, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000124', '10000000-0000-0000-0000-000000000102', 'a1-ma-maison',
   'Ma maison', 'My home', 'Décrire les pièces et les objets de la maison.', '', 4, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000125', '10000000-0000-0000-0000-000000000102', 'a1-have-got',
   'Avoir : have / has', 'Have and has', 'Dire ce que l''on possède.', '', 5, 20, 8, 'published'),
  -- Unit 3
  ('20000000-0000-0000-0000-000000000131', '10000000-0000-0000-0000-000000000103', 'a1-nourriture',
   'La nourriture', 'Food', 'Nommer les aliments du quotidien (fufu, riz, poisson…).', '', 1, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000132', '10000000-0000-0000-0000-000000000103', 'a1-combien',
   'Combien ça coûte ?', 'How much is it?', 'Demander et comprendre un prix.', '', 2, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000133', '10000000-0000-0000-0000-000000000103', 'a1-aimer',
   'J''aime, je n''aime pas', 'Likes and dislikes', 'Exprimer ses goûts.', '', 3, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000134', '10000000-0000-0000-0000-000000000103', 'a1-quantites',
   'Some, any et les quantités', 'Quantities', 'Parler des quantités au marché.', '', 4, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000135', '10000000-0000-0000-0000-000000000103', 'a1-restaurant',
   'Au restaurant', 'At the restaurant', 'Commander à manger et à boire.', '', 5, 20, 8, 'published'),
  -- Unit 4
  ('20000000-0000-0000-0000-000000000141', '10000000-0000-0000-0000-000000000104', 'a1-jours-semaine',
   'Les jours de la semaine', 'Days of the week', 'Dire les jours et parler de son emploi du temps.', '', 1, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000142', '10000000-0000-0000-0000-000000000104', 'a1-heure',
   'Quelle heure est-il ?', 'Telling the time', 'Demander et dire l''heure.', '', 2, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000143', '10000000-0000-0000-0000-000000000104', 'a1-mois-dates',
   'Les mois et les dates', 'Months & dates', 'Dire une date et son anniversaire.', '', 3, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000144', '10000000-0000-0000-0000-000000000104', 'a1-transports',
   'Les transports', 'Transport', 'Parler du taxi-bus, de la moto et du bus.', '', 4, 20, 8, 'published'),
  ('20000000-0000-0000-0000-000000000145', '10000000-0000-0000-0000-000000000104', 'a1-directions',
   'Demander son chemin', 'Asking for directions', 'Demander et indiquer un chemin en ville.', '', 5, 20, 8, 'published');

-- Skeleton lessons are 'draft' until content exists; keep the 3 full lessons published.
update public.lessons set status = 'draft'
where unit_id <> '10000000-0000-0000-0000-000000000101'
   or slug in ('a1-alphabet', 'a1-pays-villes');

-- ---------- Videos (placeholders) ------------------------------------
insert into public.lesson_videos (lesson_id, provider, url, low_url, audio_url, poster_url, duration_s, captions, transcript_fr) values
  ('20000000-0000-0000-0000-000000000111', 'mp4',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', null,
   '/images/posters/salutations.webp', 300,
   '[{"lang":"en","label":"English","url":"/captions/a1-salutations.en.vtt"},{"lang":"fr","label":"Français","url":"/captions/a1-salutations.fr.vtt"}]',
   'Dans cette vidéo, Mama Nsimba salue ses voisins au marché de Gambela à différents moments de la journée.'),
  ('20000000-0000-0000-0000-000000000112', 'youtube', 'dQw4w9WgXcQ', null, null,
   '/images/posters/se-presenter.webp', 360,
   '[{"lang":"en","label":"English","url":"/captions/a1-se-presenter.en.vtt"},{"lang":"fr","label":"Français","url":"/captions/a1-se-presenter.fr.vtt"}]',
   'Patrick, étudiant à l''UNIKIN, se présente à de nouveaux camarades venus de Goma et de Lubumbashi.'),
  ('20000000-0000-0000-0000-000000000113', 'mp4',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', null,
   '/images/posters/nombres.webp', 280,
   '[{"lang":"en","label":"English","url":"/captions/a1-nombres-0-20.en.vtt"},{"lang":"fr","label":"Français","url":"/captions/a1-nombres-0-20.fr.vtt"}]',
   'Grâce compte les buts d''un match de football et échange son numéro de téléphone avec une amie.');

-- ---------- Vocabulary -----------------------------------------------
insert into public.vocabulary (lesson_id, term_en, term_fr, example_en, example_fr, position) values
  ('20000000-0000-0000-0000-000000000111', 'Good morning', 'Bonjour (le matin)', 'Good morning, Mama Nsimba!', 'Bonjour, Maman Nsimba !', 1),
  ('20000000-0000-0000-0000-000000000111', 'Good afternoon', 'Bon après-midi', 'Good afternoon, teacher.', 'Bonjour (après-midi), professeur.', 2),
  ('20000000-0000-0000-0000-000000000111', 'Good evening', 'Bonsoir', 'Good evening, everybody!', 'Bonsoir tout le monde !', 3),
  ('20000000-0000-0000-0000-000000000111', 'Goodbye', 'Au revoir', 'Goodbye, see you tomorrow.', 'Au revoir, à demain.', 4),
  ('20000000-0000-0000-0000-000000000111', 'How are you?', 'Comment allez-vous ?', 'Hello Jean, how are you?', 'Salut Jean, comment vas-tu ?', 5),
  ('20000000-0000-0000-0000-000000000111', 'Thank you', 'Merci', 'I''m fine, thank you.', 'Je vais bien, merci.', 6),
  ('20000000-0000-0000-0000-000000000112', 'My name is…', 'Je m''appelle…', 'My name is Patrick.', 'Je m''appelle Patrick.', 1),
  ('20000000-0000-0000-0000-000000000112', 'I''m from…', 'Je viens de…', 'I''m from Lubumbashi.', 'Je viens de Lubumbashi.', 2),
  ('20000000-0000-0000-0000-000000000112', 'years old', 'ans (âge)', 'I''m twenty years old.', 'J''ai vingt ans.', 3),
  ('20000000-0000-0000-0000-000000000112', 'Nice to meet you', 'Enchanté(e)', 'Nice to meet you, Grâce!', 'Enchanté, Grâce !', 4),
  ('20000000-0000-0000-0000-000000000112', 'student', 'étudiant(e)', 'I''m a student at UNIKIN.', 'Je suis étudiant à l''UNIKIN.', 5),
  ('20000000-0000-0000-0000-000000000113', 'one, two, three', 'un, deux, trois', 'One, two, three, go!', 'Un, deux, trois, partez !', 1),
  ('20000000-0000-0000-0000-000000000113', 'twelve', 'douze', 'I have twelve mangoes.', 'J''ai douze mangues.', 2),
  ('20000000-0000-0000-0000-000000000113', 'fifteen', 'quinze', 'She is fifteen.', 'Elle a quinze ans.', 3),
  ('20000000-0000-0000-0000-000000000113', 'twenty', 'vingt', 'Twenty francs, please.', 'Vingt francs, s''il vous plaît.', 4),
  ('20000000-0000-0000-0000-000000000113', 'phone number', 'numéro de téléphone', 'What''s your phone number?', 'Quel est ton numéro de téléphone ?', 5);

-- ---------- Exercises: Lesson 1 — Greetings (10) --------------------
insert into public.exercises (id, lesson_id, type, skill, prompt_fr, prompt_en, payload, explanation_fr, position) values
  ('30000000-0000-0000-0000-000000011101', '20000000-0000-0000-0000-000000000111', 'multiple_choice', 'vocabulary',
   'Il est 8 h du matin. Vous arrivez au bureau. Que dites-vous ?', null, '{}',
   'Le matin, on dit « Good morning ».', 1),
  ('30000000-0000-0000-0000-000000011102', '20000000-0000-0000-0000-000000000111', 'multiple_choice', 'vocabulary',
   'Que signifie « Goodbye » ?', 'Goodbye', '{}', null, 2),
  ('30000000-0000-0000-0000-000000011103', '20000000-0000-0000-0000-000000000111', 'fill_blank', 'grammar',
   'Complétez la réponse.', null,
   '{"sentence":"How are you? — I''m fine, ___ you.","answers":["thank"],"hint_fr":"merci"}',
   '« Thank you » = merci.', 3),
  ('30000000-0000-0000-0000-000000011104', '20000000-0000-0000-0000-000000000111', 'matching', 'vocabulary',
   'Associez chaque expression à sa traduction.', null, '{}', null, 4),
  ('30000000-0000-0000-0000-000000011105', '20000000-0000-0000-0000-000000000111', 'listen_choose', 'listening',
   'Écoutez et choisissez ce que vous entendez.', null,
   '{"audio_text":"Good afternoon, Mama Nsimba."}', null, 5),
  ('30000000-0000-0000-0000-000000011106', '20000000-0000-0000-0000-000000000111', 'word_order', 'grammar',
   'Remettez les mots dans le bon ordre.', null,
   '{"tokens":["are","How","you","?"],"answer":"How are you ?"}', null, 6),
  ('30000000-0000-0000-0000-000000011107', '20000000-0000-0000-0000-000000000111', 'multiple_choice', 'vocabulary',
   'Il est 22 h, vous quittez une fête chez des amis à Limete. Que dites-vous ?', null, '{}',
   '« Good night » s''utilise pour partir tard le soir ou aller dormir. « Good evening » sert à saluer en arrivant.', 7),
  ('30000000-0000-0000-0000-000000011108', '20000000-0000-0000-0000-000000000111', 'fill_blank', 'vocabulary',
   'Complétez la salutation de l''après-midi.', null,
   '{"sentence":"Good ___, teacher!","answers":["afternoon"],"hint_fr":"après-midi"}', null, 8),
  ('30000000-0000-0000-0000-000000011109', '20000000-0000-0000-0000-000000000111', 'listen_choose', 'listening',
   'Écoutez la question. Quelle est la bonne réponse ?', null,
   '{"audio_text":"How are you today?"}', null, 9),
  ('30000000-0000-0000-0000-000000011110', '20000000-0000-0000-0000-000000000111', 'speaking', 'speaking',
   'À vous ! Enregistrez-vous en saluant Maman Nsimba le matin, puis réécoutez-vous.', null,
   '{"target_en":"Good morning, Mama Nsimba! How are you?","tip_fr":"Insistez sur le « r » doux de morning et montez la voix à la fin de la question."}',
   null, 10);

insert into public.exercise_options (exercise_id, label, is_correct, pair_key, side, position) values
  ('30000000-0000-0000-0000-000000011101', 'Good morning', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011101', 'Good night', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011101', 'Good evening', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011101', 'Goodbye', false, null, null, 4),
  ('30000000-0000-0000-0000-000000011102', 'Au revoir', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011102', 'Bonjour', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011102', 'Merci', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011102', 'Bonne nuit', false, null, null, 4),
  ('30000000-0000-0000-0000-000000011104', 'Good evening', false, 'a', 'left', 1),
  ('30000000-0000-0000-0000-000000011104', 'Bonsoir', false, 'a', 'right', 2),
  ('30000000-0000-0000-0000-000000011104', 'Thank you', false, 'b', 'left', 3),
  ('30000000-0000-0000-0000-000000011104', 'Merci', false, 'b', 'right', 4),
  ('30000000-0000-0000-0000-000000011104', 'See you tomorrow', false, 'c', 'left', 5),
  ('30000000-0000-0000-0000-000000011104', 'À demain', false, 'c', 'right', 6),
  ('30000000-0000-0000-0000-000000011104', 'Hello', false, 'd', 'left', 7),
  ('30000000-0000-0000-0000-000000011104', 'Salut', false, 'd', 'right', 8),
  ('30000000-0000-0000-0000-000000011105', 'Good afternoon, Mama Nsimba.', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011105', 'Good evening, Mama Nsimba.', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011105', 'Good morning, Mama Nsimba.', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011107', 'Good night!', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011107', 'Good morning!', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011107', 'Good evening!', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011107', 'Hello!', false, null, null, 4),
  ('30000000-0000-0000-0000-000000011109', 'I''m fine, thank you.', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011109', 'My name is Jean.', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011109', 'I''m from Matadi.', false, null, null, 3);

-- ---------- Exercises: Lesson 2 — Introducing yourself (10) ---------
insert into public.exercises (id, lesson_id, type, skill, prompt_fr, prompt_en, payload, explanation_fr, position) values
  ('30000000-0000-0000-0000-000000011201', '20000000-0000-0000-0000-000000000112', 'multiple_choice', 'grammar',
   'Choisissez la bonne forme du verbe « to be ».', 'I ___ Patrick.', '{}', 'Avec « I », on utilise « am ».', 1),
  ('30000000-0000-0000-0000-000000011202', '20000000-0000-0000-0000-000000000112', 'multiple_choice', 'grammar',
   'Comment dit-on « J''ai 18 ans » ?', null, '{}',
   'En anglais, on utilise « to be » pour l''âge : I am 18 years old.', 2),
  ('30000000-0000-0000-0000-000000011203', '20000000-0000-0000-0000-000000000112', 'fill_blank', 'grammar',
   'Complétez avec « am », « is » ou « are ».', null,
   '{"sentence":"She ___ from Goma.","answers":["is"],"hint_fr":"elle est"}', null, 3),
  ('30000000-0000-0000-0000-000000011204', '20000000-0000-0000-0000-000000000112', 'word_order', 'grammar',
   'Remettez les mots dans le bon ordre.', null,
   '{"tokens":["name","My","Grâce","is"],"answer":"My name is Grâce"}', null, 4),
  ('30000000-0000-0000-0000-000000011205', '20000000-0000-0000-0000-000000000112', 'matching', 'vocabulary',
   'Associez les questions et les réponses.', null, '{}', null, 5),
  ('30000000-0000-0000-0000-000000011206', '20000000-0000-0000-0000-000000000112', 'listen_choose', 'listening',
   'Écoutez Patrick. D''où vient-il ?', null,
   '{"audio_text":"Hi, I''m Patrick. I''m from Kisangani."}', null, 6),
  ('30000000-0000-0000-0000-000000011207', '20000000-0000-0000-0000-000000000112', 'fill_blank', 'vocabulary',
   'Complétez la phrase.', null,
   '{"sentence":"Nice to ___ you!","answers":["meet"],"hint_fr":"rencontrer"}', null, 7),
  ('30000000-0000-0000-0000-000000011208', '20000000-0000-0000-0000-000000000112', 'multiple_choice', 'vocabulary',
   'Quelle question pose-t-on pour connaître le nom de quelqu''un ?', null, '{}', null, 8),
  ('30000000-0000-0000-0000-000000011209', '20000000-0000-0000-0000-000000000112', 'word_order', 'grammar',
   'Remettez les mots dans le bon ordre.', null,
   '{"tokens":["am","I","years","twenty","old"],"answer":"I am twenty years old"}', null, 9),
  ('30000000-0000-0000-0000-000000011210', '20000000-0000-0000-0000-000000000112', 'speaking', 'speaking',
   'Présentez-vous : votre nom, votre ville et votre âge.', null,
   '{"target_en":"Hello! My name is … I''m from … I''m … years old. Nice to meet you!","tip_fr":"Remplacez les … par vos informations. Parlez lentement et clairement."}',
   null, 10);

insert into public.exercise_options (exercise_id, label, is_correct, pair_key, side, position) values
  ('30000000-0000-0000-0000-000000011201', 'am', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011201', 'is', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011201', 'are', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011202', 'I am 18 years old.', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011202', 'I have 18 years.', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011202', 'I have 18 years old.', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011202', 'I is 18 years.', false, null, null, 4),
  ('30000000-0000-0000-0000-000000011205', 'What''s your name?', false, 'a', 'left', 1),
  ('30000000-0000-0000-0000-000000011205', 'My name is Bienvenu.', false, 'a', 'right', 2),
  ('30000000-0000-0000-0000-000000011205', 'Where are you from?', false, 'b', 'left', 3),
  ('30000000-0000-0000-0000-000000011205', 'I''m from Bukavu.', false, 'b', 'right', 4),
  ('30000000-0000-0000-0000-000000011205', 'How old are you?', false, 'c', 'left', 5),
  ('30000000-0000-0000-0000-000000011205', 'I''m nineteen.', false, 'c', 'right', 6),
  ('30000000-0000-0000-0000-000000011206', 'Kisangani', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011206', 'Kinshasa', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011206', 'Kananga', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011208', 'What''s your name?', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011208', 'How are you?', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011208', 'Where are you from?', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011208', 'How old are you?', false, null, null, 4);

-- ---------- Exercises: Lesson 3 — Numbers 0–20 (9) ------------------
insert into public.exercises (id, lesson_id, type, skill, prompt_fr, prompt_en, payload, explanation_fr, position) values
  ('30000000-0000-0000-0000-000000011301', '20000000-0000-0000-0000-000000000113', 'multiple_choice', 'vocabulary',
   'Comment écrit-on 13 en anglais ?', null, '{}', '13 = thirteen. Attention : thirty = 30.', 1),
  ('30000000-0000-0000-0000-000000011302', '20000000-0000-0000-0000-000000000113', 'listen_choose', 'listening',
   'Écoutez et choisissez le bon nombre.', null, '{"audio_text":"fifteen"}', null, 2),
  ('30000000-0000-0000-0000-000000011303', '20000000-0000-0000-0000-000000000113', 'matching', 'vocabulary',
   'Associez les nombres.', null, '{}', null, 3),
  ('30000000-0000-0000-0000-000000011304', '20000000-0000-0000-0000-000000000113', 'fill_blank', 'vocabulary',
   'Écrivez le nombre en lettres.', null,
   '{"sentence":"Five + five = ___","answers":["ten"],"hint_fr":"10"}', null, 4),
  ('30000000-0000-0000-0000-000000011305', '20000000-0000-0000-0000-000000000113', 'multiple_choice', 'reading',
   'Lisez : « TP Mazembe won the match three – one. » Quel est le score ?', null, '{}', null, 5),
  ('30000000-0000-0000-0000-000000011306', '20000000-0000-0000-0000-000000000113', 'listen_choose', 'listening',
   'Écoutez le numéro de téléphone de Grâce. Lequel est correct ?', null,
   '{"audio_text":"My number is oh eight one two, four five six, seven eight nine."}', null, 6),
  ('30000000-0000-0000-0000-000000011307', '20000000-0000-0000-0000-000000000113', 'fill_blank', 'vocabulary',
   'Complétez la suite.', null,
   '{"sentence":"eighteen, nineteen, ___","answers":["twenty"],"hint_fr":"20"}', null, 7),
  ('30000000-0000-0000-0000-000000011308', '20000000-0000-0000-0000-000000000113', 'word_order', 'grammar',
   'Remettez les mots dans le bon ordre.', null,
   '{"tokens":["your","What''s","number","phone","?"],"answer":"What''s your phone number ?"}', null, 8),
  ('30000000-0000-0000-0000-000000011309', '20000000-0000-0000-0000-000000000113', 'speaking', 'speaking',
   'Comptez à voix haute de 11 à 20, puis réécoutez-vous.', null,
   '{"target_en":"eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty","tip_fr":"Accentuez la fin des nombres en -teen : thir-TEEN, four-TEEN."}',
   null, 9);

insert into public.exercise_options (exercise_id, label, is_correct, pair_key, side, position) values
  ('30000000-0000-0000-0000-000000011301', 'thirteen', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011301', 'thirty', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011301', 'three', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011301', 'threeteen', false, null, null, 4),
  ('30000000-0000-0000-0000-000000011302', '15', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011302', '50', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011302', '5', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011302', '16', false, null, null, 4),
  ('30000000-0000-0000-0000-000000011303', '7', false, 'a', 'left', 1),
  ('30000000-0000-0000-0000-000000011303', 'seven', false, 'a', 'right', 2),
  ('30000000-0000-0000-0000-000000011303', '12', false, 'b', 'left', 3),
  ('30000000-0000-0000-0000-000000011303', 'twelve', false, 'b', 'right', 4),
  ('30000000-0000-0000-0000-000000011303', '18', false, 'c', 'left', 5),
  ('30000000-0000-0000-0000-000000011303', 'eighteen', false, 'c', 'right', 6),
  ('30000000-0000-0000-0000-000000011303', '4', false, 'd', 'left', 7),
  ('30000000-0000-0000-0000-000000011303', 'four', false, 'd', 'right', 8),
  ('30000000-0000-0000-0000-000000011305', '3 – 1', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011305', '1 – 3', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011305', '13 – 1', false, null, null, 3),
  ('30000000-0000-0000-0000-000000011305', '30 – 1', false, null, null, 4),
  ('30000000-0000-0000-0000-000000011306', '0812 456 789', true, null, null, 1),
  ('30000000-0000-0000-0000-000000011306', '0812 465 789', false, null, null, 2),
  ('30000000-0000-0000-0000-000000011306', '0821 456 798', false, null, null, 3);

-- ---------- Exams (skeleton; questions added in Phase 5) -------------
insert into public.exams (id, kind, level_id, unit_id, title_fr, pass_mark, time_limit_min, status) values
  ('40000000-0000-0000-0000-000000000101', 'unit', '00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-000000000101',
   'Test de l''unité 1 : Premiers pas', 70, 15, 'published'),
  ('40000000-0000-0000-0000-000000000102', 'unit', '00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-000000000102',
   'Test de l''unité 2 : Ma famille et moi', 70, 15, 'draft'),
  ('40000000-0000-0000-0000-000000000103', 'unit', '00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-000000000103',
   'Test de l''unité 3 : Au marché', 70, 15, 'draft'),
  ('40000000-0000-0000-0000-000000000104', 'unit', '00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-000000000104',
   'Test de l''unité 4 : Le temps et la ville', 70, 15, 'draft'),
  ('40000000-0000-0000-0000-0000000000a1', 'level', '00000000-0000-0000-0000-0000000000a1', null,
   'Examen final — Niveau A1', 75, 30, 'published');

-- ---------- Badges ---------------------------------------------------
insert into public.badges (code, title_fr, description_fr, icon, criteria, position) values
  ('first_lesson',  'Premier pas',        'Terminer votre première leçon.',            'footprints', '{"type":"lessons","value":1}', 1),
  ('lessons_10',    'Élève assidu',       'Terminer 10 leçons.',                       'book-open',  '{"type":"lessons","value":10}', 2),
  ('streak_3',      'En route !',         '3 jours d''affilée.',                       'flame',      '{"type":"streak","value":3}', 3),
  ('streak_7',      'Une semaine de feu', '7 jours d''affilée.',                       'flame',      '{"type":"streak","value":7}', 4),
  ('streak_30',     'Léopard',            '30 jours d''affilée. Impressionnant !',     'crown',      '{"type":"streak","value":30}', 5),
  ('perfect',       'Sans faute',         'Obtenir 100 % à une leçon.',                'star',       '{"type":"perfect","value":1}', 6),
  ('xp_500',        '500 XP',             'Gagner 500 points d''expérience.',          'zap',        '{"type":"xp","value":500}', 7),
  ('certificate_1', 'Diplômé',            'Obtenir votre premier certificat.',          'award',      '{"type":"certificates","value":1}', 8),
  ('placement',     'Je me connais',      'Passer le test de niveau.',                 'compass',    '{"type":"placement","value":1}', 9);

-- ---------- Placement questions (40: 10 per level) -------------------
insert into public.placement_questions (level, skill, prompt_fr, stem, passage, audio_text, options, correct_index) values
  -- A1
  ('A1','vocabulary','Choisissez la bonne traduction.','« Bonjour » (le matin)',null,null,'["Good morning","Good night","Goodbye","Thank you"]',0),
  ('A1','grammar','Complétez la phrase.','I ___ a student.',null,null,'["am","is","are","be"]',0),
  ('A1','grammar','Complétez la phrase.','They ___ from Lubumbashi.',null,null,'["is","am","are","be"]',2),
  ('A1','vocabulary','Quel mot ne va pas avec les autres ?','Mother, father, sister, banana',null,null,'["mother","father","sister","banana"]',3),
  ('A1','vocabulary','Choisissez le bon nombre.','fourteen',null,null,'["40","14","4","41"]',1),
  ('A1','listening','Écoutez et choisissez la bonne réponse.','What does the speaker say?',null,'My name is Joseph.','["My name is Joseph.","My father is Joseph.","My friend is Joseph.","I am from Joseph."]',0),
  ('A1','reading','Lisez le texte et répondez.','Where does Marie live?','Hello! I am Marie. I am 20 years old. I live in Goma with my mother and my two brothers.',null,'["In Kinshasa","In Goma","In Bukavu","In Matadi"]',1),
  ('A1','grammar','Complétez la phrase.','This is ___ book. (à moi)',null,null,'["my","me","I","mine"]',0),
  ('A1','vocabulary','Quel jour vient après lundi ?','Monday → ?',null,null,'["Sunday","Tuesday","Thursday","Friday"]',1),
  ('A1','listening','Écoutez et choisissez le prix.','How much is it?',null,'It is five dollars.','["$5","$15","$50","$9"]',0),
  -- A2
  ('A2','grammar','Complétez au passé.','Yesterday, I ___ to the market.',null,null,'["go","goes","went","going"]',2),
  ('A2','grammar','Complétez la phrase.','She ___ football every Saturday.',null,null,'["play","plays","playing","is play"]',1),
  ('A2','vocabulary','Choisissez le bon mot.','I take a ___ to go to work. (moyen de transport)',null,null,'["bus","bed","bread","book"]',0),
  ('A2','grammar','Choisissez la forme correcte.','Kinshasa is ___ than Matadi.',null,null,'["big","bigger","biggest","more big"]',1),
  ('A2','reading','Lisez le texte et répondez.','Why was Jean late?','Jean was late for school this morning. The taxi-bus broke down on Boulevard Lumumba, so he walked for 30 minutes.',null,'["He woke up late","The taxi-bus broke down","It was raining","He was sick"]',1),
  ('A2','listening','Écoutez et répondez.','What time does the shop open?',null,'The shop opens at half past eight in the morning.','["8:00","8:30","9:30","6:30"]',1),
  ('A2','grammar','Complétez la question.','___ you like fufu?',null,null,'["Do","Does","Are","Is"]',0),
  ('A2','vocabulary','Choisissez le contraire.','cheap',null,null,'["expensive","small","easy","new"]',0),
  ('A2','grammar','Complétez la phrase.','There aren''t ___ eggs in the fridge.',null,null,'["some","any","a","much"]',1),
  ('A2','listening','Écoutez et répondez.','Where is the speaker going?',null,'I''m going to the hospital to visit my uncle.','["To the church","To the hospital","To the school","To the bank"]',1),
  -- B1
  ('B1','grammar','Complétez avec le present perfect.','I ___ in Kinshasa since 2015.',null,null,'["live","lived","have lived","am living"]',2),
  ('B1','grammar','Complétez la phrase conditionnelle.','If it rains tomorrow, we ___ the match.',null,null,'["cancel","will cancel","would cancel","cancelled"]',1),
  ('B1','vocabulary','Choisissez le sens le plus proche.','I''m looking forward to the trip.',null,null,'["I''m worried about the trip","I''m excited about the trip","I''m planning to cancel the trip","I forgot the trip"]',1),
  ('B1','reading','Lisez le texte et répondez.','What is the main purpose of the message?','Dear colleagues, due to the power cut, tomorrow''s meeting will take place online at 10 a.m. instead of in the main office. Please check your email for the link.',null,'["To cancel the meeting","To change the meeting location","To complain about power cuts","To ask for a new link"]',1),
  ('B1','grammar','Choisissez la forme passive correcte.','The new bridge ___ last year.',null,null,'["built","was built","has build","is building"]',1),
  ('B1','listening','Écoutez et répondez.','What does the speaker suggest?',null,'Why don''t we take the boat to Brazzaville instead of waiting for the flight?','["Taking the plane","Taking the boat","Staying home","Driving"]',1),
  ('B1','vocabulary','Complétez avec le bon verbe à particule.','Please ___ the form before Friday.',null,null,'["fill in","fill up","fill on","fill at"]',0),
  ('B1','grammar','Complétez avec le bon pronom relatif.','The teacher ___ helped me is from Kikwit.',null,null,'["which","who","where","whose"]',1),
  ('B1','reading','Lisez et répondez.','What can we infer about Aline?','Aline has applied to three universities abroad. She practises English every evening and has already passed two online courses.',null,'["She is not interested in studying","She is motivated to study abroad","She lives abroad","She failed her courses"]',1),
  ('B1','listening','Écoutez et répondez.','How does the speaker feel?',null,'Honestly, I''m a bit disappointed. I expected the results to be much better.','["Happy","Disappointed","Angry","Bored"]',1),
  -- B2
  ('B2','grammar','Complétez la phrase (troisième conditionnel).','If I had known about the strike, I ___ a different route.',null,null,'["would take","will take","would have taken","had taken"]',2),
  ('B2','vocabulary','Choisissez le mot le plus approprié.','The government plans to ___ new measures to reduce inflation.',null,null,'["implement","implicate","imply","impose on"]',0),
  ('B2','grammar','Choisissez la bonne inversion.','Not only ___ late, but he also forgot the documents.',null,null,'["he arrived","did he arrive","he did arrive","arrived he"]',1),
  ('B2','reading','Lisez le texte et répondez.','What is the author''s attitude towards mobile money?','While mobile money has undeniably expanded access to financial services across the DRC, critics argue that high transaction fees still disproportionately affect the poorest users.',null,'["Entirely negative","Balanced, noting benefits and drawbacks","Entirely positive","Indifferent"]',1),
  ('B2','vocabulary','Choisissez le sens de l''expression.','It''s a long shot, but we might win the contract.',null,null,'["It''s very likely","It''s unlikely but possible","It''s impossible","It''s already decided"]',1),
  ('B2','grammar','Complétez la phrase.','She denied ___ the email.',null,null,'["to send","sending","send","to sending"]',1),
  ('B2','listening','Écoutez et répondez.','What is the speaker implying?',null,'Well, the proposal is interesting, but I''m not sure the budget will stretch that far.','["The budget is sufficient","The proposal may be too expensive","The proposal is boring","The budget has increased"]',1),
  ('B2','reading','Lisez et répondez.','Which word best replaces ''mitigate'' in the text?','The NGO launched a programme to mitigate the effects of flooding in Kinshasa''s low-lying neighbourhoods.',null,'["worsen","reduce","ignore","measure"]',1),
  ('B2','grammar','Choisissez la bonne forme.','By the time we arrive, the ceremony ___.',null,null,'["will have started","will start","has started","started"]',0),
  ('B2','listening','Écoutez et répondez.','Why did the speaker turn down the job?',null,'The salary was attractive, but relocating my family to Kolwezi on such short notice just wasn''t feasible.','["The salary was too low","Relocating was not feasible","She didn''t like Kolwezi","The job was boring"]',1);
