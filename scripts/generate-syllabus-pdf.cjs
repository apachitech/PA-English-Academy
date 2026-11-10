/**
 * PA³ English Academy - Générateur Officiel du Syllabus PDF Illustré
 * Produit un document PDF multipage haute fidélité (A4) avec design élégant,
 * planches de vocabulaire thématiques, phonétique appliquée et curriculum complet.
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

function sanitizeText(str) {
  if (!str) return '';
  return str
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/–/g, '-')
    .replace(/—/g, ' - ')
    .replace(/…/g, '...')
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'Oe')
    .replace(/•/g, '-')
    .replace(/[^\x00-\xFF]/g, ''); // Ensure ISO-8859-1 compatible characters
}

async function generateSyllabusPdf() {
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Brand Palette
  const colorNavy = rgb(15 / 255, 23 / 255, 42 / 255); // #0f172a
  const colorDeepBlue = rgb(30 / 255, 41 / 255, 59 / 255); // #1e293b
  const colorGold = rgb(217 / 255, 119 / 255, 6 / 255); // #d97706
  const colorGoldLight = rgb(251 / 255, 191 / 255, 36 / 255); // #fbbf24
  const colorWhite = rgb(1, 1, 1);
  const colorDark = rgb(30 / 255, 41 / 255, 59 / 255);
  const colorMuted = rgb(100 / 255, 116 / 255, 139 / 255); // #64748b
  const colorLightBg = rgb(248 / 255, 250 / 255, 252 / 255); // #f8fafc
  const colorBorder = rgb(226 / 255, 232 / 255, 240 / 255); // #e2e8f0

  // Emerald, Sky, Purple, Rose accents
  const colorEmerald = rgb(5 / 255, 150 / 255, 105 / 255);
  const colorSky = rgb(2 / 255, 132 / 255, 199 / 255);
  const colorPurple = rgb(124 / 255, 58 / 255, 237 / 255);
  const colorRose = rgb(225 / 255, 29 / 255, 72 / 255);

  const PAGE_WIDTH = 595.28; // A4 portrait width in points
  const PAGE_HEIGHT = 841.89; // A4 portrait height in points
  const MARGIN = 40;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  function addHeaderAndFooter(page, pageNum, totalPages, title = 'PA3 ENGLISH ACADEMY - SYLLABUS ILLUSTRE') {
    // Top bar
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 32,
      width: PAGE_WIDTH,
      height: 32,
      color: colorNavy,
    });

    page.drawText('PA3 ENGLISH ACADEMY', {
      x: MARGIN,
      y: PAGE_HEIGHT - 21,
      size: 9,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(sanitizeText(title), {
      x: MARGIN + 130,
      y: PAGE_HEIGHT - 21,
      size: 8,
      font: fontRegular,
      color: rgb(203 / 255, 213 / 255, 225 / 255),
    });

    // Bottom bar
    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: 26,
      color: colorLightBg,
    });

    page.drawLine({
      start: { x: MARGIN, y: 26 },
      end: { x: PAGE_WIDTH - MARGIN, y: 26 },
      thickness: 1,
      color: colorBorder,
    });

    page.drawText('https://pa-english-academy.vercel.app  |  Kinshasa, RDC', {
      x: MARGIN,
      y: 10,
      size: 7.5,
      font: fontRegular,
      color: colorMuted,
    });

    const pageStr = `Page ${pageNum} / ${totalPages}`;
    const pageStrWidth = fontRegular.widthOfTextAtSize(pageStr, 7.5);
    page.drawText(pageStr, {
      x: PAGE_WIDTH - MARGIN - pageStrWidth,
      y: 10,
      size: 7.5,
      font: fontBold,
      color: colorDark,
    });
  }

  /* =========================================================================
     PAGE 1: COUVERTURE OFFICIELLE (COVER PAGE)
     ========================================================================= */
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    // Background gradient effect: Top 65% Navy, Bottom 35% White/Slate
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT * 0.35,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT * 0.65,
      color: colorNavy,
    });

    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT * 0.35,
      color: rgb(248 / 255, 250 / 255, 252 / 255),
    });

    // Golden decorative divider line
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT * 0.35 - 3,
      width: PAGE_WIDTH,
      height: 6,
      color: colorGold,
    });

    // Top Crest / Emblem Box
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 100,
      width: 70,
      height: 40,
      color: colorGold,
    });

    page.drawText('PA3', {
      x: MARGIN + 14,
      y: PAGE_HEIGHT - 80,
      size: 20,
      font: fontBold,
      color: colorNavy,
    });

    page.drawText('ACADEMY', {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 94,
      size: 8,
      font: fontBold,
      color: colorNavy,
    });

    // Header Badges
    page.drawText('REPUBLIQUE DEMOCRATIQUE DU CONGO  *  FORMATION BILINGUE ACCELEREE', {
      x: MARGIN + 85,
      y: PAGE_HEIGHT - 75,
      size: 8,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText('Kinshasa - Lubumbashi - Goma - Afrique Francophone', {
      x: MARGIN + 85,
      y: PAGE_HEIGHT - 90,
      size: 9,
      font: fontRegular,
      color: rgb(226 / 255, 232 / 255, 240 / 255),
    });

    // Main Title
    page.drawText('SYLLABUS OFFICIEL', {
      x: MARGIN,
      y: PAGE_HEIGHT - 170,
      size: 32,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText('& LIVRET VISUEL ILLUSTRE', {
      x: MARGIN,
      y: PAGE_HEIGHT - 208,
      size: 26,
      font: fontBold,
      color: colorGoldLight,
    });

    // Subtitle
    page.drawText(
      sanitizeText("Guide d'apprentissage de l'anglais spécialement adapté aux étudiants"),
      {
        x: MARGIN,
        y: PAGE_HEIGHT - 240,
        size: 11.5,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );
    page.drawText(
      sanitizeText("francophones, congolais et africains. Cadre CECRL : Niveaux A1, A2, B1, B2 + ESP."),
      {
        x: MARGIN,
        y: PAGE_HEIGHT - 256,
        size: 11.5,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );

    // 4 Key Pillars Feature Box on Dark Background
    const pillarsY = PAGE_HEIGHT - 380;
    page.drawRectangle({
      x: MARGIN,
      y: pillarsY,
      width: CONTENT_WIDTH,
      height: 95,
      color: colorDeepBlue,
      borderColor: rgb(51 / 255, 65 / 255, 85 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText('CONTENU DU LIVRET PEDAGOGIQUE :'), {
      x: MARGIN + 14,
      y: pillarsY + 74,
      size: 9.5,
      font: fontBold,
      color: colorGoldLight,
    });

    const pillars = [
      '[1] Le Corps Humain & la Sante (21 parties du corps, phonetique, roleplays medicaux)',
      '[2] Guide Visuel de Prononciation (Les sons pieges /th/, /h/, voyelles courtes vs longues)',
      '[3] La Garde-Robe & la Mode Africaine (Costumes corporate, Pagne/Wax, Sapeur dandy)',
      '[4] Objets du Quotidien & Bureau (Equipements tech, bureau, kits de terrain et de survie RDC)',
      '[5] Cursus Complet des 64 Lecons (De A1 a B2 + Modules Metiers : Mines, Banque, Droit, ONGs)',
    ];

    pillars.forEach((p, idx) => {
      page.drawText(sanitizeText(p), {
        x: MARGIN + 14,
        y: pillarsY + 56 - idx * 13,
        size: 8,
        font: fontRegular,
        color: colorWhite,
      });
    });

    // Lower Section (White area): Statistics Cards
    const statsY = PAGE_HEIGHT * 0.35 - 75;
    const statBoxWidth = (CONTENT_WIDTH - 30) / 4;

    const stats = [
      { num: '64', label: 'Lecons Exhaustives', sub: 'A1 a B2 + ESP', color: colorEmerald },
      { num: '160h', label: 'Volume de Cours', sub: 'Pratique Orale 70%', color: colorSky },
      { num: '2 500+', label: 'Mots de Vocabulaire', sub: 'Contextualises RDC', color: colorGold },
      { num: '4', label: 'Certificats Reconnus', sub: 'Verification QR Code', color: colorPurple },
    ];

    stats.forEach((st, idx) => {
      const boxX = MARGIN + idx * (statBoxWidth + 10);
      page.drawRectangle({
        x: boxX,
        y: statsY,
        width: statBoxWidth,
        height: 60,
        color: colorWhite,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      page.drawText(st.num, {
        x: boxX + 10,
        y: statsY + 38,
        size: 16,
        font: fontBold,
        color: st.color,
      });

      page.drawText(sanitizeText(st.label), {
        x: boxX + 10,
        y: statsY + 22,
        size: 8,
        font: fontBold,
        color: colorDark,
      });

      page.drawText(sanitizeText(st.sub), {
        x: boxX + 10,
        y: statsY + 10,
        size: 7,
        font: fontRegular,
        color: colorMuted,
      });
    });

    // Accreditation & Author Footer Box
    const authorY = 40;
    page.drawText(sanitizeText('DIRECTION PEDAGOGIQUE : Coach David Liandja & Equipe Academique PA3'), {
      x: MARGIN,
      y: authorY + 28,
      size: 9,
      font: fontBold,
      color: colorNavy,
    });

    page.drawText(
      sanitizeText('PA3 English Academy * Kinshasa, RDC * Plateforme en ligne : https://pa-english-academy.vercel.app'),
      {
        x: MARGIN,
        y: authorY + 14,
        size: 8,
        font: fontRegular,
        color: colorMuted,
      }
    );

    page.drawText(
      sanitizeText('Document officiel 2026 - Tous droits reserves. Reproduction et diffusion autorisees a titre educatif.'),
      {
        x: MARGIN,
        y: authorY,
        size: 7,
        font: fontOblique,
        color: colorMuted,
      }
    );
  }

  /* =========================================================================
     PAGE 2: PLANCHE VISUELLE 1 - LE CORPS HUMAIN (THE HUMAN BODY)
     ========================================================================= */
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    addHeaderAndFooter(page, 2, 7, 'PLANCHE 1 : LE CORPS HUMAIN & LA SANTE');

    // Section Banner
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 75,
      width: CONTENT_WIDTH,
      height: 34,
      color: colorEmerald,
    });

    page.drawText(sanitizeText('PLANCHE PEDAGOGIQUE 1 : LE CORPS HUMAIN (THE HUMAN BODY)'), {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 58,
      size: 11,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText(
      sanitizeText('Vocabulaire anatomique complet, phonetique, correspondances lingala et pieges a eviter'),
      {
        x: MARGIN + 12,
        y: PAGE_HEIGHT - 70,
        size: 8,
        font: fontRegular,
        color: rgb(209 / 255, 250 / 255, 229 / 255),
      }
    );

    // Contextual Tip Box
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 120,
      width: CONTENT_WIDTH,
      height: 38,
      color: rgb(236 / 255, 253 / 255, 245 / 255),
      borderColor: rgb(167 / 255, 243 / 255, 208 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText("CONSEIL DU COACH POUR LES ETUDIANTS CONGOLAIS :"), {
      x: MARGIN + 10,
      y: PAGE_HEIGHT - 96,
      size: 8,
      font: fontBold,
      color: colorEmerald,
    });

    page.drawText(
      sanitizeText("Ne dites jamais 'I have pain on my leg'. Dites : 'My leg hurts' ou 'I have a sore throat' (mal de gorge)."),
      {
        x: MARGIN + 10,
        y: PAGE_HEIGHT - 108,
        size: 7.5,
        font: fontRegular,
        color: colorDark,
      }
    );

    page.drawText(
      sanitizeText("Attention aux pluriels irreguliers : One tooth -> Two teeth (dents) | One foot -> Two feet (pieds)."),
      {
        x: MARGIN + 10,
        y: PAGE_HEIGHT - 117,
        size: 7.5,
        font: fontBold,
        color: colorEmerald,
      }
    );

    // Anatomical Grid (2 Columns: Left = Head & Neck, Right = Upper Body & Limbs)
    const colWidth = (CONTENT_WIDTH - 16) / 2;
    const bodyItemsLeft = [
      { en: 'Head', fr: 'Tete', ling: 'Motu', ipa: '/hed/', note: 'Aspirer le /h/ ! Ne pas dire "ed".' },
      { en: 'Forehead', fr: 'Front', ling: 'Elongi', ipa: '/ˈfɔː.hed/', note: 'Prendre la temperature au front.' },
      { en: 'Eyes (Eye)', fr: 'Yeux (Oeil)', ling: 'Miso (Liso)', ipa: '/aɪz/ (/aɪ/)', note: 'Se prononce exactement comme la lettre I.' },
      { en: 'Ears (Ear)', fr: 'Oreilles', ling: 'Matoi', ipa: '/ɪərz/', note: 'Indispensable pour active listening.' },
      { en: 'Nose', fr: 'Nez', ling: 'Zolo', ipa: '/noʊz/', note: 'Porter un masque dans les mines de Kolwezi.' },
      { en: 'Mouth', fr: 'Bouche', ling: 'Monoko', ipa: '/maʊθ/', note: 'Finir avec la langue entre les dents /th/.' },
      { en: 'Teeth (Tooth)', fr: 'Dents', ling: 'Mino (Lino)', ipa: '/tiːθ/', note: 'Pluriel irregulier : 1 tooth -> 2 teeth.' },
      { en: 'Tongue', fr: 'Langue', ling: 'Lolemu', ipa: '/tʌŋ/', note: 'Prononcer "teungue", jamais "ton-gue" !' },
      { en: 'Throat', fr: 'Gorge', ling: 'Mongongo', ipa: '/θroʊt/', note: "'Sore throat' = mal de gorge." },
      { en: 'Neck', fr: 'Cou', ling: 'Nkingo', ipa: '/nek/', note: 'Porter une cravate ou un collier.' },
    ];

    const bodyItemsRight = [
      { en: 'Shoulders', fr: 'Epaules', ling: 'Mapeka', ipa: '/ˈʃoʊl.dərz/', note: 'Garder les epaules detendues en public.' },
      { en: 'Chest', fr: 'Poitrine / Torse', ling: 'Ntolo', ipa: '/tʃest/', note: 'Respirer profondement avant un pitch.' },
      { en: 'Stomach / Belly', fr: 'Estomac / Ventre', ling: 'Libumu', ipa: '/ˈstʌm.ək/', note: 'PIEGE : Finit par le son /k/, JAMAIS "tch" !' },
      { en: 'Arms (Arm)', fr: 'Bras', ling: 'Maboko', ipa: '/ɑːrmz/', note: 'Croiser les bras respectueusement.' },
      { en: 'Elbow', fr: 'Coude', ling: 'Liyingo', ipa: '/ˈel.boʊ/', note: 'Ne pas poser les coudes sur la table.' },
      { en: 'Hands (Hand)', fr: 'Mains (Main)', ling: 'Maboko (Loboko)', ipa: '/hændz/', note: 'Aspirer le /h/ : "Hand" et non "and".' },
      { en: 'Fingers & Thumb', fr: 'Doigts & Pouce', ling: 'Misapi', ipa: '/ˈfɪŋ.ɡərz/ & /θʌm/', note: 'Le "b" de thumb est silencieux : /théme/.' },
      { en: 'Knee', fr: 'Genou', ling: 'Libongo', ipa: '/niː/', note: 'Le "K" est 100% muet ! Dites "Nii".' },
      { en: 'Ankle', fr: 'Cheville', ling: 'Litongi', ipa: '/ˈæŋ.kəl/', note: 'Attention aux trottoirs a Kinshasa.' },
      { en: 'Feet (Foot)', fr: 'Pieds (Pied)', ling: 'Makolo', ipa: '/fiːt/ (/fʊt/)', note: "Dire 'On foot' (a pied) et JAMAIS 'by foot'." },
    ];

    function drawBodyTable(items, startX, startY, colTitle) {
      page.drawRectangle({
        x: startX,
        y: startY,
        width: colWidth,
        height: 18,
        color: colorDeepBlue,
      });

      page.drawText(sanitizeText(colTitle), {
        x: startX + 8,
        y: startY + 5,
        size: 8,
        font: fontBold,
        color: colorWhite,
      });

      let currentY = startY - 2;
      const rowHeight = 44;

      items.forEach((it, idx) => {
        const rowBg = idx % 2 === 0 ? colorWhite : colorLightBg;
        page.drawRectangle({
          x: startX,
          y: currentY - rowHeight,
          width: colWidth,
          height: rowHeight,
          color: rowBg,
          borderColor: colorBorder,
          borderWidth: 0.5,
        });

        // English Title + Phonetic
        page.drawText(sanitizeText(`${it.en}`), {
          x: startX + 8,
          y: currentY - 13,
          size: 8.5,
          font: fontBold,
          color: colorNavy,
        });

        page.drawText(sanitizeText(`${it.ipa}`), {
          x: startX + 90,
          y: currentY - 13,
          size: 7.5,
          font: fontOblique,
          color: colorEmerald,
        });

        // French & Lingala
        page.drawText(sanitizeText(`FR : ${it.fr}  |  Lingala : ${it.ling}`), {
          x: startX + 8,
          y: currentY - 25,
          size: 7.5,
          font: fontRegular,
          color: colorDark,
        });

        // Pedagogical Note / Warning
        page.drawText(sanitizeText(`* ${it.note}`), {
          x: startX + 8,
          y: currentY - 37,
          size: 6.8,
          font: fontBold,
          color: colorMuted,
        });

        currentY -= rowHeight;
      });
    }

    const tableStartY = PAGE_HEIGHT - 146;
    drawBodyTable(bodyItemsLeft, MARGIN, tableStartY, 'A. TETE, VISAGE & COU (HEAD & NECK)');
    drawBodyTable(bodyItemsRight, MARGIN + colWidth + 16, tableStartY, 'B. BUSTE & MEMBRES (UPPER & LOWER BODY)');

    // Bottom Medical Roleplay Card
    const clinicY = 48;
    page.drawRectangle({
      x: MARGIN,
      y: clinicY,
      width: CONTENT_WIDTH,
      height: 70,
      color: rgb(240 / 255, 253 / 255, 250 / 255),
      borderColor: rgb(153 / 255, 246 / 255, 228 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText('SIMULATION CLINIQUE & SANTE A KINSHASA (DOCTOR & PATIENT DIALOGUE) :'), {
      x: MARGIN + 10,
      y: clinicY + 54,
      size: 8,
      font: fontBold,
      color: colorEmerald,
    });

    const clinicLines = [
      "- Doctor : 'Good morning, Mr. Kabila. What seems to be the problem today ?'",
      "- Patient : 'Doctor, I have had a severe headache and a sore throat since yesterday, and my stomach hurts.'",
      "- Doctor : 'Let me examine your chest and check your temperature. Please take a deep breath.'",
      "- Conseil : Retenez les 3 expressions cles : 'I have a headache' | 'My ankle is swollen' | 'I caught a cold'.",
    ];

    clinicLines.forEach((line, idx) => {
      page.drawText(sanitizeText(line), {
        x: MARGIN + 10,
        y: clinicY + 40 - idx * 11,
        size: 7.5,
        font: fontRegular,
        color: colorDark,
      });
    });
  }

  /* =========================================================================
     PAGE 3: PLANCHE VISUELLE 2 - PRONONCIATION & PHONETIQUE
     ========================================================================= */
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    addHeaderAndFooter(page, 3, 7, 'PLANCHE 2 : PHONETIQUE & PRONONCIATION');

    // Section Banner
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 75,
      width: CONTENT_WIDTH,
      height: 34,
      color: colorSky,
    });

    page.drawText(sanitizeText('PLANCHE PEDAGOGIQUE 2 : PRONONCIATION & PHONETIQUE APPLIQUEE'), {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 58,
      size: 11,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText(
      sanitizeText('Maitriser les 4 sons pieges qui trahissent les francophones et etudiants congolais'),
      {
        x: MARGIN + 12,
        y: PAGE_HEIGHT - 70,
        size: 8,
        font: fontRegular,
        color: rgb(224 / 255, 242 / 255, 254 / 255),
      }
    );

    let currentY = PAGE_HEIGHT - 90;

    const rules = [
      {
        sound: '/th/ Sourd (/θ/)',
        title: 'La langue entre les dents sans vibration vocale',
        piege: 'Remplacer /θ/ par "S" ou "T" : Dire "I sink" (Je coule) au lieu de "I think" (Je pense).',
        methode: 'Pousser le bout de la langue entre les incisives superieures et souffler doucement.',
        exemples: 'Think (/θɪŋk/) | Thank you (/ˈθæŋk juː/) | Three (/θriː/) | Month (/mʌnθ/)',
        color: colorSky,
      },
      {
        sound: '/th/ Sonore (/ð/)',
        title: 'La langue entre les dents AVEC bourdonnement vocal',
        piege: 'Remplacer /ð/ par "Z" ou "D" ("Zis morning", "Dis man") qui donne un accent lourd.',
        methode: 'Meme position de langue que /θ/, mais faire vibrer les cordes vocales comme une abeille.',
        exemples: 'This / That (/ðɪs/, /ðæt/) | Brother (/ˈbrʌðər/) | Together (/təˈɡeðər/) | With (/wɪð/)',
        color: colorNavy,
      },
      {
        sound: 'Le H Aspire (/h/)',
        title: "L'expiration franche d'air chaud venant des poumons",
        piege: 'Oublier le H : Dire "I am angry" (Je suis en colere !) au lieu de "I am hungry" (J ai faim).',
        methode: 'Expirez comme pour faire de la buee sur une vitre en hiver.',
        exemples: 'Hospital (/ˈhɒs.pɪ.təl/) | Hotel (/hoʊˈtel/) | House (/haʊs/) | Hungry (/ˈhʌŋ.ɡri/)',
        color: colorGold,
      },
      {
        sound: 'Voyelles : /ɪ/ vs /i:/',
        title: 'Voyelle courte relachee vs Voyelle longue tendue',
        piege: 'Ne pas allonger le /i:/ dans "Sheet" ou "Beach" produit des insultes vulgaires en anglais !',
        methode: 'Pour /i:/ long, souriez largement. Pour /ɪ/ court, relachez totalement la machoire.',
        exemples: 'Ship (/ɪ/) vs Sheep (/i:/) | Leave (/i:/) vs Live (/ɪ/) | Sheet (/i:/) vs Shit (/ɪ/)',
        color: colorRose,
      },
      {
        sound: 'La Fin en -ED au Passe',
        title: 'Trois prononciations : /t/, /d/ ou /ɪd/',
        piege: 'Lire -ED comme deux syllabes : Ne dites jamais "work-ed" ni "play-ed" !',
        methode: 'Seuls les verbes finissant par T ou D ont droit a /ɪd/ (ex: Started, Decided). Le reste finit en /t/ ou /d/.',
        exemples: 'Worked (/wɜːrkt/ - 1 syllabe) | Called (/kɔːld/) | Started (/ˈstɑːr.tɪd/ - 2 syllabes)',
        color: colorEmerald,
      },
    ];

    rules.forEach((r) => {
      const cardHeight = 98;
      page.drawRectangle({
        x: MARGIN,
        y: currentY - cardHeight,
        width: CONTENT_WIDTH,
        height: cardHeight,
        color: colorWhite,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      // Sound Tag
      page.drawRectangle({
        x: MARGIN,
        y: currentY - 22,
        width: 130,
        height: 22,
        color: r.color,
      });

      page.drawText(sanitizeText(r.sound), {
        x: MARGIN + 8,
        y: currentY - 16,
        size: 9,
        font: fontBold,
        color: colorWhite,
      });

      page.drawText(sanitizeText(r.title), {
        x: MARGIN + 140,
        y: currentY - 15,
        size: 9,
        font: fontBold,
        color: colorNavy,
      });

      // Content inside card
      page.drawText(sanitizeText(`* LE PIEGE AFRICAIN : ${r.piege}`), {
        x: MARGIN + 10,
        y: currentY - 38,
        size: 7.5,
        font: fontBold,
        color: colorRose,
      });

      page.drawText(sanitizeText(`* METHODE D'ARTICULATION : ${r.methode}`), {
        x: MARGIN + 10,
        y: currentY - 54,
        size: 7.5,
        font: fontRegular,
        color: colorDark,
      });

      page.drawText(sanitizeText(`* EXEMPLES MODELES : ${r.exemples}`), {
        x: MARGIN + 10,
        y: currentY - 70,
        size: 7.5,
        font: fontBold,
        color: colorNavy,
      });

      page.drawRectangle({
        x: MARGIN + 10,
        y: currentY - 90,
        width: CONTENT_WIDTH - 20,
        height: 14,
        color: colorLightBg,
      });

      page.drawText(
        sanitizeText("Pratique : Repetez a voix haute 5 fois chaque matin devant votre miroir pour fixer le reflexe."),
        {
          x: MARGIN + 14,
          y: currentY - 86,
          size: 6.8,
          font: fontOblique,
          color: colorMuted,
        }
      );

      currentY -= cardHeight + 10;
    });

    // Bottom Gold Banner
    page.drawRectangle({
      x: MARGIN,
      y: 42,
      width: CONTENT_WIDTH,
      height: 48,
      color: rgb(254 / 255, 243 / 255, 199 / 255),
      borderColor: rgb(252 / 255, 211 / 255, 77 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText("LA REGLE D'OR DU COACH DAVID LIANDJA :"), {
      x: MARGIN + 10,
      y: 74,
      size: 8,
      font: fontBold,
      color: colorGold,
    });

    page.drawText(
      sanitizeText(
        "\"Ce n'est pas votre grammaire qui fait mauvaise impression en premier lors d'un entretien, c'est votre accent et votre phonetique. Soignez ces 5 sons et vous sonnerez instantanement comme un pro international.\""
      ),
      {
        x: MARGIN + 10,
        y: 56,
        size: 7.5,
        font: fontOblique,
        color: colorDark,
      }
    );
  }

  /* =========================================================================
     PAGE 4: PLANCHE VISUELLE 3 - LES HABITS, LA MODE AFRICAINE & VETEMENTS
     ========================================================================= */
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    addHeaderAndFooter(page, 4, 7, 'PLANCHE 3 : HABITS & MODE AFRICAINE');

    // Section Banner
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 75,
      width: CONTENT_WIDTH,
      height: 34,
      color: colorPurple,
    });

    page.drawText(sanitizeText('PLANCHE PEDAGOGIQUE 3 : HABITS, VETEMENTS & MODE AFRICAINE'), {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 58,
      size: 11,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText(
      sanitizeText('Garde-robe corporate, tissus traditionnels africains (Wax/Pagne) et art de la SAPE'),
      {
        x: MARGIN + 12,
        y: PAGE_HEIGHT - 70,
        size: 8,
        font: fontRegular,
        color: rgb(243 / 255, 232 / 255, 255 / 255),
      }
    );

    const colWidth = (CONTENT_WIDTH - 16) / 2;

    const clothingCorporate = [
      { en: 'Business Suit', fr: 'Costume complet / Tailleur', ipa: '/ˈbɪz.nɪs suːt/', desc: 'Indispensable pour rendez-vous d affaires et banques.' },
      { en: 'Tie & Bow tie', fr: 'Cravate & Noeud papillon', ipa: '/taɪ/ & /ˈboʊ taɪ/', desc: 'Assortir obligatoirement la cravate a la pochette.' },
      { en: 'Dress Shirt', fr: 'Chemise habillee repassee', ipa: '/dres ʃɜːrt/', desc: 'Chemise blanche ou bleu ciel a col italien.' },
      { en: 'Pencil Skirt', fr: 'Jupe droite de travail', ipa: '/ˈpen.səl skɜːrt/', desc: 'Tenue corporate feminine classique et elegante.' },
      { en: 'Blouse', fr: 'Chemisier en soie / coton', ipa: '/blaʊz/', desc: 'Porte avec un pantalon a pinces ou une jupe.' },
      { en: 'Dress Shoes', fr: 'Souliers en cuir cires', ipa: '/dres ʃuːz/', desc: 'Richelieu ou Derby vernis. Cirage impeccable !' },
      { en: 'Blazer / Jacket', fr: 'Veste de tailleur / Blazer', ipa: '/ˈbleɪ.zər/', desc: 'A porter lors des presentations et conferences.' },
    ];

    const clothingAfrican = [
      { en: 'African Wax Fabric', fr: 'Tissu pagne / Wax africain', ipa: '/ˈæf.rɪ.kən wæks/', desc: 'Fierte congolaise portee le dimanche et aux fetes.' },
      { en: 'Dashiki / Boubou', fr: 'Grand Boubou brode', ipa: '/dəˈʃiː.ki/ / /buːˈbuː/', desc: 'Tunique traditionnelle portee par les dignitaires.' },
      { en: 'African Headwrap', fr: 'Foulard de tete / Turban', ipa: '/ˈhed.ræp/', desc: 'Symbole de noblesse et d elegance feminine africaine.' },
      { en: 'Sapeur Dandy Attire', fr: 'Tenue de Sapeur chic', ipa: '/sæpˈɜːr əˈtaɪər/', desc: 'Respect de la regle des 3 couleurs et tissus nobles.' },
      { en: 'Casual T-Shirt', fr: 'T-shirt decontracte', ipa: '/ˈtiː.ʃɜːrt/', desc: 'Pour les vendredis detendus et les weekends.' },
      { en: 'Jeans & Sneakers', fr: 'Jean & Baskets confortables', ipa: '/dʒiːnz/ & /ˈsniː.kərz/', desc: 'Idéal pour les deplacements a pied en ville.' },
      { en: 'Wristwatch & Belt', fr: 'Montre & Ceinture en cuir', ipa: '/ˈrɪst.wɒtʃ/ & /belt/', desc: 'Toujours assortir la couleur de la ceinture aux souliers.' },
    ];

    function drawClothingTable(items, startX, startY, colTitle, bannerColor) {
      page.drawRectangle({
        x: startX,
        y: startY,
        width: colWidth,
        height: 20,
        color: bannerColor,
      });

      page.drawText(sanitizeText(colTitle), {
        x: startX + 8,
        y: startY + 6,
        size: 8,
        font: fontBold,
        color: colorWhite,
      });

      let currentY = startY - 2;
      const rowHeight = 58;

      items.forEach((it, idx) => {
        const rowBg = idx % 2 === 0 ? colorWhite : colorLightBg;
        page.drawRectangle({
          x: startX,
          y: currentY - rowHeight,
          width: colWidth,
          height: rowHeight,
          color: rowBg,
          borderColor: colorBorder,
          borderWidth: 0.5,
        });

        page.drawText(sanitizeText(`${it.en}`), {
          x: startX + 8,
          y: currentY - 14,
          size: 8.5,
          font: fontBold,
          color: colorNavy,
        });

        page.drawText(sanitizeText(`${it.ipa}`), {
          x: startX + 115,
          y: currentY - 14,
          size: 7.5,
          font: fontOblique,
          color: colorPurple,
        });

        page.drawText(sanitizeText(`FR : ${it.fr}`), {
          x: startX + 8,
          y: currentY - 28,
          size: 7.5,
          font: fontRegular,
          color: colorDark,
        });

        page.drawText(sanitizeText(`* Contexte : ${it.desc}`), {
          x: startX + 8,
          y: currentY - 42,
          size: 7,
          font: fontRegular,
          color: colorMuted,
        });

        currentY -= rowHeight;
      });
    }

    const tableStartY = PAGE_HEIGHT - 96;
    drawClothingTable(clothingCorporate, MARGIN, tableStartY, 'A. CORPORATE & BUSINESS ATTIRE', colorDeepBlue);
    drawClothingTable(clothingAfrican, MARGIN + colWidth + 16, tableStartY, 'B. MODE AFRICAINE & STYLE CASUAL', colorPurple);

    // Bottom Sapeur & Culture Note
    const sapeurY = 48;
    page.drawRectangle({
      x: MARGIN,
      y: sapeurY,
      width: CONTENT_WIDTH,
      height: 60,
      color: rgb(250 / 255, 245 / 255, 255 / 255),
      borderColor: rgb(233 / 255, 213 / 255, 255 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText('NOTE CULTURELLE : L ELEGANCE AFRICAINE DANS LE VOCABULAIRE ANGLAIS'), {
      x: MARGIN + 10,
      y: sapeurY + 46,
      size: 8,
      font: fontBold,
      color: colorPurple,
    });

    const sapeurNotes = [
      "- 'Dress for success' : La facon dont vous vous habillez en Afrique temoigne du respect que vous portez a vos interlocuteurs.",
      "- En anglais des affaires, on dit 'Smart Casual' pour une tenue soignee sans cravate, et 'Black Tie' pour une soiree de gala.",
      "- Vocabulaire des matieres : Cotton (coton), Silk (soie), Wool (laine), Leather (cuir), Wax print (tissu pagne imprime).",
    ];

    sapeurNotes.forEach((line, idx) => {
      page.drawText(sanitizeText(line), {
        x: MARGIN + 10,
        y: sapeurY + 32 - idx * 11,
        size: 7.5,
        font: fontRegular,
        color: colorDark,
      });
    });
  }

  /* =========================================================================
     PAGE 5: PLANCHE VISUELLE 4 - LES OBJETS DU QUOTIDIEN, DU BUREAU & TERRAIN
     ========================================================================= */
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    addHeaderAndFooter(page, 5, 7, 'PLANCHE 4 : OBJETS DU QUOTIDIEN & BUREAU');

    // Section Banner
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 75,
      width: CONTENT_WIDTH,
      height: 34,
      color: colorGold,
    });

    page.drawText(sanitizeText('PLANCHE PEDAGOGIQUE 4 : OBJETS DU QUOTIDIEN, DE BUREAU & TERRAIN RDC'), {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 58,
      size: 11,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText(
      sanitizeText('Outils numeriques, equipements de terrain, fournitures de bureau et necessaire urbain'),
      {
        x: MARGIN + 12,
        y: PAGE_HEIGHT - 70,
        size: 8,
        font: fontRegular,
        color: rgb(254 / 255, 243 / 255, 199 / 255),
      }
    );

    const colWidth = (CONTENT_WIDTH - 16) / 2;

    const objectsTech = [
      { en: 'Laptop & Charger', fr: 'Ordinateur portable & Chargeur', ipa: '/ˈlæp.tɒp/ & /ˈtʃɑːr.dʒər/', desc: 'Outil de base pour travailler et suivre les cours en ligne.' },
      { en: 'Smartphone & SIM', fr: 'Smartphone & Carte SIM', ipa: '/ˈsmɑːrt.foʊn/', desc: 'Telephone multi-cartes pour les appels et le Mobile Money.' },
      { en: 'Headphones / Headset', fr: 'Casque audio avec microphone', ipa: '/ˈhed.foʊnz/', desc: 'Essentiel pour participer aux visioconferences Zoom / Teams.' },
      { en: 'Power Bank', fr: 'Batterie externe portable', ipa: '/ˈpaʊ.ər bæŋk/', desc: 'LE sauveur indispensable en cas de delestage a Kinshasa.' },
      { en: 'ID Badge & Lanyard', fr: 'Badge d identification & Cordon', ipa: '/aɪˈdiː bædʒ/', desc: 'Exige a l entree des ministeres, banques et agences ONU.' },
      { en: 'Notebook & Pen', fr: 'Cahier de notes & Stylo', ipa: '/ˈnoʊt.bʊk/ & /pen/', desc: 'Pour noter immediatement les nouveaux mots et devoirs.' },
      { en: 'USB Flash Drive', fr: 'Cle USB de stockage', ipa: '/ˌjuː.esˈbiː draɪv/', desc: 'Partager des documents volumineux et sauvegarder ses cours.' },
    ];

    const objectsField = [
      { en: 'Passport & Visa', fr: 'Passeport & Visa de voyage', ipa: '/ˈpæs.pɔːrt/ & /ˈviː.zə/', desc: 'Pour les missions internationales a Nairobi, Kigali ou Paris.' },
      { en: 'Wallet & Cash', fr: 'Portefeuille & Especes', ipa: '/ˈwɒl.ɪt/ & /kæʃ/', desc: 'Payer les courses de taxi en francs congolais ou dollars.' },
      { en: 'House Keys', fr: 'Trousseau de cles', ipa: '/haʊs kiːz/', desc: 'Toujours verifier ses cles avant de quitter le domicile.' },
      { en: 'Water Bottle', fr: 'Gourde d eau reutilisable', ipa: '/ˈwɔː.tər ˈbɒt.əl/', desc: 'S hydrater regulierement sous la chaleur equatoriale.' },
      { en: 'Umbrella', fr: 'Parapluie robuste', ipa: '/ʌmˈbrel.ə/', desc: 'Protection indispensable lors des pluies diluviennes.' },
      { en: 'Safety Helmet & PPE', fr: 'Casque de chantier & EPI', ipa: '/ˈseɪf.ti ˈhel.mɪt/', desc: 'Obligatoire sur les sites miniers de Kolwezi et Lubumbashi.' },
      { en: 'Field Backpack', fr: 'Sac a dos de terrain', ipa: '/ˈbæk.pæk/', desc: 'Ideal pour les missions des ONGs dans les provinces.' },
    ];

    function drawObjectTable(items, startX, startY, colTitle, bannerColor) {
      page.drawRectangle({
        x: startX,
        y: startY,
        width: colWidth,
        height: 20,
        color: bannerColor,
      });

      page.drawText(sanitizeText(colTitle), {
        x: startX + 8,
        y: startY + 6,
        size: 8,
        font: fontBold,
        color: colorWhite,
      });

      let currentY = startY - 2;
      const rowHeight = 58;

      items.forEach((it, idx) => {
        const rowBg = idx % 2 === 0 ? colorWhite : colorLightBg;
        page.drawRectangle({
          x: startX,
          y: currentY - rowHeight,
          width: colWidth,
          height: rowHeight,
          color: rowBg,
          borderColor: colorBorder,
          borderWidth: 0.5,
        });

        page.drawText(sanitizeText(`${it.en}`), {
          x: startX + 8,
          y: currentY - 14,
          size: 8.5,
          font: fontBold,
          color: colorNavy,
        });

        page.drawText(sanitizeText(`${it.ipa}`), {
          x: startX + 120,
          y: currentY - 14,
          size: 7.5,
          font: fontOblique,
          color: colorGold,
        });

        page.drawText(sanitizeText(`FR : ${it.fr}`), {
          x: startX + 8,
          y: currentY - 28,
          size: 7.5,
          font: fontRegular,
          color: colorDark,
        });

        page.drawText(sanitizeText(`* Pratique : ${it.desc}`), {
          x: startX + 8,
          y: currentY - 42,
          size: 7,
          font: fontRegular,
          color: colorMuted,
        });

        currentY -= rowHeight;
      });
    }

    const tableStartY = PAGE_HEIGHT - 96;
    drawObjectTable(objectsTech, MARGIN, tableStartY, 'A. EQUIPEMENTS TECH & BUREAU', colorDeepBlue);
    drawObjectTable(objectsField, MARGIN + colWidth + 16, tableStartY, 'B. ESSENTIELS DE TERRAIN & VOYAGE', colorGold);

    // Bottom Practice Sentences
    const bottomY = 48;
    page.drawRectangle({
      x: MARGIN,
      y: bottomY,
      width: CONTENT_WIDTH,
      height: 60,
      color: rgb(254 / 255, 243 / 255, 199 / 255),
      borderColor: rgb(252 / 255, 211 / 255, 77 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText('PHRASES CLES DU QUOTIDIEN EN ANGLAIS A MEMORISER :'), {
      x: MARGIN + 10,
      y: bottomY + 46,
      size: 8,
      font: fontBold,
      color: colorGold,
    });

    const objectPhrases = [
      "- 'Could I please borrow your laptop charger for thirty minutes ?' (Puis-je emprunter votre chargeur ?)",
      "- 'My phone battery is running low, do you have a spare power bank ?' (Ma batterie est faible, avez-vous une batterie externe ?)",
      "- 'Always keep your passport, company ID badge, and office keys in a safe place.' (Gardez toujours vos cles et papiers en lieu sur.)",
    ];

    objectPhrases.forEach((p, idx) => {
      page.drawText(sanitizeText(p), {
        x: MARGIN + 10,
        y: bottomY + 32 - idx * 11,
        size: 7.5,
        font: fontRegular,
        color: colorDark,
      });
    });
  }

  /* =========================================================================
     PAGE 6: SOMMAIRE & CATALOGUE DES 64 LECONS EN COULEURS (A1 -> B2 + ESP)
     ========================================================================= */
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    addHeaderAndFooter(page, 6, 7, 'CURRICULUM EXHAUSTIF DES 64 LECONS');

    // Section Banner
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 75,
      width: CONTENT_WIDTH,
      height: 34,
      color: colorNavy,
    });

    page.drawText(sanitizeText('CURRICULUM ACADEMIQUE EXHAUSTIF : LES 64 LECONS (A1 -> B2 + ESP)'), {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 58,
      size: 11,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText('160 heures de formation structuree reparties sur 5 paliers colores et progressifs'),
      {
        x: MARGIN + 12,
        y: PAGE_HEIGHT - 70,
        size: 8,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );

    let currentY = PAGE_HEIGHT - 90;

    const levelsSummary = [
      {
        code: 'PALIER A1',
        title: 'DEBUTANT FONDAMENTAL (12 Lecons * 30 Heures)',
        color: colorEmerald,
        lessons: [
          '#1 Salutations du quotidien & politesse',
          '#2 Se presenter avec assurance (I am...)',
          '#3 Nombres de 0 a 20 & numeros WhatsApp',
          '#4 L Alphabet & epeler son nom',
          '#5 Demander et donner l heure (Trafic)',
          '#6 Commander a manger & prix en USD / FC',
          '#7 Decrire sa routine quotidienne',
          '#8 Les objets du bureau & de la maison',
          '#9 Presenter les membres de sa famille',
          '#10 Demander son chemin a Kinshasa',
          '#11 Parler de la meteo & saisons tropicales',
          '#12 Grand Bilan A1 & Premier Test Pratique',
        ],
      },
      {
        code: 'PALIER A2',
        title: 'ELEMENTAIRE OPERATIONNEL (14 Lecons * 35 Heures)',
        color: colorSky,
        lessons: [
          '#13 Raconter son weekend (Passe Simple)',
          '#14 Projets d avenir (Going to & Will)',
          '#15 Exprimer ses capacites (Can & Could)',
          '#16 Comparer des offres & services',
          '#17 Passer un appel telephonique pro',
          '#18 Exprimer l obligation (Must & Have to)',
          '#19 Parler de son parcours professionnel',
          '#20 Decrire un probleme & depannage',
          '#21 Au restaurant & commander un repas',
          '#22 Donner des conseils (Should & Ought to)',
          '#23 Les voyages & l aeroport de N djili',
          '#24 Les loisirs & passions personnelles',
          '#25 Poser des questions ouvertes fluides',
          '#26 Bilan A2 & Simulation d Entretien A2',
        ],
      },
      {
        code: 'PALIER B1',
        title: 'INTERMEDIAIRE PROFESSIONNEL (16 Lecons * 40 Heures)',
        color: colorGold,
        lessons: [
          '#27 Experiences de vie (Present Perfect)',
          '#28 Rediger des emails formels percutants',
          '#29 Pitch de recrutement : Formule des 3 P',
          '#30 Reussir les questions pieges en ONG',
          '#31 Animer une reunion Zoom / Teams',
          '#32 Exprimer un desaccord diplomatique',
          '#33 Négocier un contrat commercial',
          '#34 Presenter des donnees & graphiques',
          '#35 Gerer les objections clients',
          '#36 Rediger un rapport d activite synthétique',
          '#37 Hypotheses professionnelles (Cond. 1 & 2)',
          '#38 Participer a une table ronde sectorielle',
          '#39 Telephoner pour resoudre un litige bancaire',
          '#40 Les verbes a particule incontournables',
          '#41 Conduire une session de feedback',
          '#42 Bilan B1 & Simulation Complète B1',
        ],
      },
      {
        code: 'PALIER B2 & ESP',
        title: 'AVANCE, AFFAIRES & MASTERCLASSES METIERS (22 Lecons * 55 Heures)',
        color: colorPurple,
        lessons: [
          '#43 Discours indirect & synthese de debats',
          '#44 Conditionnel passe & gestion de crise',
          '#45 Art de la persuasion & discours public',
          '#46 Moderation de panels internationaux',
          '#47 Redaction de propositions d appel d offres',
          '#48 Communication interculturelle globale',
          '#49 Negociation de haut niveau & diplomatie',
          '#50 Analyse des risques & audit international',
          '#51 Storytelling pour dirigeants & leaders',
          '#52-56 Masterclasses : Anglais Minier, Droit, Banque, Sante & Tech',
          '#57-64 Specialisations Logistique, Aviation & Bilan Final B2 Pro',
        ],
      },
    ];

    levelsSummary.forEach((lvl) => {
      const cardHeight = 158;
      page.drawRectangle({
        x: MARGIN,
        y: currentY - cardHeight,
        width: CONTENT_WIDTH,
        height: cardHeight,
        color: colorWhite,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      // Header strip
      page.drawRectangle({
        x: MARGIN,
        y: currentY - 20,
        width: CONTENT_WIDTH,
        height: 20,
        color: lvl.color,
      });

      page.drawText(sanitizeText(`${lvl.code} - ${lvl.title}`), {
        x: MARGIN + 10,
        y: currentY - 14,
        size: 8.5,
        font: fontBold,
        color: colorWhite,
      });

      // 2 columns for lessons
      const half = Math.ceil(lvl.lessons.length / 2);
      const col1 = lvl.lessons.slice(0, half);
      const col2 = lvl.lessons.slice(half);

      col1.forEach((ls, idx) => {
        page.drawText(sanitizeText(ls), {
          x: MARGIN + 10,
          y: currentY - 36 - idx * 17,
          size: 7,
          font: fontRegular,
          color: colorDark,
        });
      });

      col2.forEach((ls, idx) => {
        page.drawText(sanitizeText(ls), {
          x: MARGIN + CONTENT_WIDTH / 2 + 10,
          y: currentY - 36 - idx * 17,
          size: 7,
          font: fontRegular,
          color: colorDark,
        });
      });

      currentY -= cardHeight + 8;
    });
  }

  /* =========================================================================
     PAGE 7: CHARTE PEDAGOGIQUE, CERTIFICATION & CODE D'ACCES
     ========================================================================= */
  {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    addHeaderAndFooter(page, 7, 7, 'ENGAGEMENT PEDAGOGIQUE & ACCREDITATION');

    // Section Banner
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 75,
      width: CONTENT_WIDTH,
      height: 34,
      color: colorNavy,
    });

    page.drawText(sanitizeText('LA METHODE PA3 : 3 PILIERS POUR DEVENIR BILINGUE EN RDC'), {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 58,
      size: 11,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText('Pratique active quotidienne, phonetique sans complexe et preparation aux carrières mondiales'),
      {
        x: MARGIN + 12,
        y: PAGE_HEIGHT - 70,
        size: 8,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );

    // 3 Formula Boxes
    const formulaY = PAGE_HEIGHT - 210;
    const boxW = (CONTENT_WIDTH - 20) / 3;

    const formula = [
      {
        titre: 'PILIER 1 : PRATIQUE',
        soustitre: '70% Oral - 30% Theorie',
        desc: "Finie la grammaire passive sur un cahier ! Des le premier jour, vous parlez a voix haute. Vous repetez les structures cles face au miroir et lors des ateliers interactifs avec le Coach David Liandja.",
        color: colorEmerald,
      },
      {
        titre: 'PILIER 2 : PHONETIQUE',
        soustitre: 'Decomplexer la Voix',
        desc: "Nous corrigeons precisement les blocages phonetiques propres aux locuteurs du lingala, du swahili et du francais (/th/, /h/, voyelles). Vous gagnez l'assurance necessaire pour parler sans timidite.",
        color: colorSky,
      },
      {
        titre: 'PILIER 3 : PROFESSIONNEL',
        soustitre: 'Emploi & Carriere RDC',
        desc: "Notre vocabulaire est directement branche sur les recruteurs de Kinshasa : Rawbank, Vodacom, agences de l'ONU, societes minieres a Kolwezi, cabinets d avocats et organisations humanitaires.",
        color: colorGold,
      },
    ];

    formula.forEach((f, idx) => {
      const bX = MARGIN + idx * (boxW + 10);
      page.drawRectangle({
        x: bX,
        y: formulaY,
        width: boxW,
        height: 120,
        color: colorWhite,
        borderColor: f.color,
        borderWidth: 1.5,
      });

      page.drawRectangle({
        x: bX,
        y: formulaY + 95,
        width: boxW,
        height: 25,
        color: f.color,
      });

      page.drawText(sanitizeText(f.titre), {
        x: bX + 8,
        y: formulaY + 107,
        size: 8.5,
        font: fontBold,
        color: colorWhite,
      });

      page.drawText(sanitizeText(f.soustitre), {
        x: bX + 8,
        y: formulaY + 98,
        size: 6.8,
        font: fontRegular,
        color: colorWhite,
      });

      // Description lines
      const words = f.desc.split(' ');
      let line = '';
      let lineY = formulaY + 80;
      words.forEach((w) => {
        if ((line + ' ' + w).length > 27) {
          page.drawText(sanitizeText(line), {
            x: bX + 8,
            y: lineY,
            size: 7,
            font: fontRegular,
            color: colorDark,
          });
          line = w;
          lineY -= 11;
        } else {
          line = line ? line + ' ' + w : w;
        }
      });
      if (line) {
        page.drawText(sanitizeText(line), {
          x: bX + 8,
          y: lineY,
          size: 7,
          font: fontRegular,
          color: colorDark,
        });
      }
    });

    // Verification & Certificate Showcase Card
    const certY = formulaY - 140;
    page.drawRectangle({
      x: MARGIN,
      y: certY,
      width: CONTENT_WIDTH,
      height: 125,
      color: colorLightBg,
      borderColor: colorBorder,
      borderWidth: 1,
    });

    page.drawRectangle({
      x: MARGIN,
      y: certY + 98,
      width: CONTENT_WIDTH,
      height: 27,
      color: colorDeepBlue,
    });

    page.drawText(sanitizeText('SYSTEME DE CERTIFICATION NUMERIQUE VERIFIABLE PAR QR CODE'), {
      x: MARGIN + 12,
      y: certY + 109,
      size: 9,
      font: fontBold,
      color: colorGoldLight,
    });

    const certPoints = [
      "- Chaque palier franchi avec succes (A1, A2, B1, B2) delivre un Certificat de Reussite Officiel PA3.",
      "- Tous nos certificats possedent un identifiant unique et un QR Code de verification instantanee.",
      "- Les employeurs a Kinshasa et a l international peuvent scanner le certificat pour verifier l authenticite en temps reel :",
      "  Lien de controle : https://pa-english-academy.vercel.app/verify/[ID-CERTIFICAT]",
      "- Score minimum requis pour la certification : 80% aux evaluations orales et aux quiz de chaque unite.",
    ];

    certPoints.forEach((cp, idx) => {
      page.drawText(sanitizeText(cp), {
        x: MARGIN + 12,
        y: certY + 80 - idx * 14,
        size: 7.5,
        font: idx === 3 ? fontBold : fontRegular,
        color: idx === 3 ? colorGold : colorDark,
      });
    });

    // Final Call To Action & Access Card
    const ctaY = 50;
    page.drawRectangle({
      x: MARGIN,
      y: ctaY,
      width: CONTENT_WIDTH,
      height: 120,
      color: colorNavy,
      borderColor: colorGold,
      borderWidth: 2,
    });

    page.drawText(sanitizeText('COMMENCEZ VOTRE FORMATION DES AUJOURD HUI !'), {
      x: MARGIN + 16,
      y: ctaY + 96,
      size: 13,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText(
        'Rejoignez la communaute des professionnels bilingues de la RDC et d Afrique sur notre plateforme officielle :'
      ),
      {
        x: MARGIN + 16,
        y: ctaY + 78,
        size: 8.5,
        font: fontRegular,
        color: colorWhite,
      }
    );

    page.drawText(sanitizeText('SITE INTERNET : https://pa-english-academy.vercel.app'), {
      x: MARGIN + 16,
      y: ctaY + 58,
      size: 10,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText(
      sanitizeText('TEST DE NIVEAU GRATUIT  *  COURS INTERACTIFS A1-B2  *  PAIEMENT SECURISE MOBILE MONEY'),
      {
        x: MARGIN + 16,
        y: ctaY + 40,
        size: 8,
        font: fontBold,
        color: colorGoldLight,
      }
    );

    page.drawText(
      sanitizeText('Contact Direction Pedagogique (Kinshasa) : info.speakupcongo@gmail.com  |  Coach David Liandja'),
      {
        x: MARGIN + 16,
        y: ctaY + 20,
        size: 7.5,
        font: fontRegular,
        color: rgb(203 / 255, 213 / 255, 225 / 255),
      }
    );
  }

  const pdfBytes = await pdfDoc.save();
  const outputDir = path.join(__dirname, '..', 'public', 'downloads');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`[SUCCESS] Illustrated Syllabus PDF generated cleanly at: ${outputPath}`);
  console.log(`[FILE SIZE] ${(pdfBytes.length / 1024).toFixed(2)} KB`);
  console.log(`[PAGES] ${pdfDoc.getPageCount()} pages`);
}

generateSyllabusPdf().catch((err) => {
  console.error('[ERROR] Failed to generate PDF:', err);
  process.exit(1);
});
