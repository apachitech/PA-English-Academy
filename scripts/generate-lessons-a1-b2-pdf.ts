/**
 * PA³ English Academy - Générateur Dédié du Syllabus des Cours A1 à B2
 * Ce script produit un document PDF officiel exclusivement dédié aux leçons de cours :
 * Paliers A1 (12 leçons), A2 (14 leçons), B1 (16 leçons) et B2 (14 leçons),
 * soit les 56 leçons du Cadre Européen Commun de Référence (CECRL).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import { SYLLABUS_CURRICULUM, SyllabusLevelId, SyllabusLesson } from '../src/lib/domain/syllabus-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sanitizeText(str: string): string {
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
    .replace(/[^\x00-\xFF]/g, '');
}

async function buildCourseLessonsA1ToB2Pdf() {
  console.log('[START] Generating Course Lessons PDF (Levels A1 to B2)...');
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Brand Palette
  const colorNavy = rgb(15 / 255, 23 / 255, 42 / 255);
  const colorDeepBlue = rgb(30 / 255, 41 / 255, 59 / 255);
  const colorGold = rgb(217 / 255, 119 / 255, 6 / 255);
  const colorGoldLight = rgb(251 / 255, 191 / 255, 36 / 255);
  const colorWhite = rgb(1, 1, 1);
  const colorDark = rgb(30 / 255, 41 / 255, 59 / 255);
  const colorMuted = rgb(100 / 255, 116 / 255, 139 / 255);
  const colorLightBg = rgb(248 / 255, 250 / 255, 252 / 255);
  const colorBorder = rgb(226 / 255, 232 / 255, 240 / 255);

  // Level Colors
  const colorEmerald = rgb(5 / 255, 150 / 255, 105 / 255); // A1
  const colorSky = rgb(2 / 255, 132 / 255, 199 / 255);     // A2
  const colorAmber = rgb(217 / 255, 119 / 255, 6 / 255);   // B1
  const colorPurple = rgb(124 / 255, 58 / 255, 237 / 255); // B2

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN = 40;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  const pagesList: { page: PDFPage; title: string }[] = [];

  function createTrackedPage(title: string): PDFPage {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pagesList.push({ page, title });
    return page;
  }

  function renderHeader(page: PDFPage, title: string) {
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 30,
      width: PAGE_WIDTH,
      height: 30,
      color: colorNavy,
    });

    page.drawText('PA3 ENGLISH ACADEMY', {
      x: MARGIN,
      y: PAGE_HEIGHT - 20,
      size: 9,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(sanitizeText(title), {
      x: MARGIN + 125,
      y: PAGE_HEIGHT - 20,
      size: 8,
      font: fontRegular,
      color: rgb(226 / 255, 232 / 255, 240 / 255),
    });
  }

  /* =========================================================================
     PAGE 1 : COUVERTURE DU CURSUS DE COURS A1 À B2
     ========================================================================= */
  {
    const page = createTrackedPage('COUVERTURE DES COURS A1 A B2');

    // Navy Upper Half & Light Lower Half
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
      color: colorLightBg,
    });

    // Gold divider
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT * 0.35 - 3,
      width: PAGE_WIDTH,
      height: 6,
      color: colorGold,
    });

    // Logo
    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 95,
      width: 70,
      height: 40,
      color: colorGold,
    });

    page.drawText('PA3', {
      x: MARGIN + 14,
      y: PAGE_HEIGHT - 76,
      size: 20,
      font: fontBold,
      color: colorNavy,
    });

    page.drawText('ACADEMY', {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 90,
      size: 8,
      font: fontBold,
      color: colorNavy,
    });

    page.drawText('REPUBLIQUE DEMOCRATIQUE DU CONGO  *  CURRICULUM OFFICIEL DES COURS', {
      x: MARGIN + 85,
      y: PAGE_HEIGHT - 72,
      size: 8,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText('Cadre Europeen Commun de Reference pour les Langues (CECRL : A1 a B2)', {
      x: MARGIN + 85,
      y: PAGE_HEIGHT - 87,
      size: 9,
      font: fontRegular,
      color: rgb(226 / 255, 232 / 255, 240 / 255),
    });

    // Main Titles
    page.drawText('SYLLABUS DES COURS', {
      x: MARGIN,
      y: PAGE_HEIGHT - 165,
      size: 32,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText('CURRICULUM COMPLET DE A1 A B2', {
      x: MARGIN,
      y: PAGE_HEIGHT - 202,
      size: 22,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText("Catalogue exhaustif de l'ensemble des 56 lecons fondamentales et professionnelles,"),
      {
        x: MARGIN,
        y: PAGE_HEIGHT - 232,
        size: 11,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );
    page.drawText(
      sanitizeText("avec objectifs operationnels, grammaire, lexique cible et mises en situation en RDC."),
      {
        x: MARGIN,
        y: PAGE_HEIGHT - 248,
        size: 11,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );

    // 4 Levels Overview Card
    const cardY = PAGE_HEIGHT - 400;
    page.drawRectangle({
      x: MARGIN,
      y: cardY,
      width: CONTENT_WIDTH,
      height: 135,
      color: colorDeepBlue,
      borderColor: rgb(51 / 255, 65 / 255, 85 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText('LES 4 PALIERS PEDAGOGIQUES INCLUS DANS CE DOCUMENT :'), {
      x: MARGIN + 14,
      y: cardY + 114,
      size: 9.5,
      font: fontBold,
      color: colorGoldLight,
    });

    const levelRows = [
      {
        tag: 'PALIER A1',
        title: 'Debutant Fondamental (Lecons #1 a #12 - 30h de cours)',
        desc: 'Salutations, identite, nombres, heure, routine, achats et confiance immediate.',
        color: colorEmerald,
      },
      {
        tag: 'PALIER A2',
        title: 'Elementaire Operationnel (Lecons #13 a #26 - 35h de cours)',
        desc: 'Passe simple, avenir (Going to/Will), telephone, repas d affaires et aeroport N djili.',
        color: colorSky,
      },
      {
        tag: 'PALIER B1',
        title: 'Intermediaire Professionnel (Lecons #27 a #42 - 40h de cours)',
        desc: 'Present Perfect, emails formels, recrutement (regle des 3 P), reunions Zoom/Teams.',
        color: colorAmber,
      },
      {
        tag: 'PALIER B2',
        title: 'Avance & Affaires Internationales (Lecons #43 a #56 - 35h de cours)',
        desc: 'Discours indirect, gestion de crise, pitch investisseurs, moderation et diplomatie.',
        color: colorPurple,
      },
    ];

    levelRows.forEach((lr, idx) => {
      const rowY = cardY + 92 - idx * 24;

      // Small color badge
      page.drawRectangle({
        x: MARGIN + 14,
        y: rowY - 2,
        width: 58,
        height: 14,
        color: lr.color,
      });

      page.drawText(sanitizeText(lr.tag), {
        x: MARGIN + 18,
        y: rowY + 2,
        size: 7,
        font: fontBold,
        color: colorWhite,
      });

      page.drawText(sanitizeText(lr.title), {
        x: MARGIN + 78,
        y: rowY + 2,
        size: 8,
        font: fontBold,
        color: colorWhite,
      });

      page.drawText(sanitizeText(`* ${lr.desc}`), {
        x: MARGIN + 78,
        y: rowY - 8,
        size: 7,
        font: fontRegular,
        color: rgb(203 / 255, 213 / 255, 225 / 255),
      });
    });

    // Lower Metric Cards
    const statBoxWidth = (CONTENT_WIDTH - 30) / 4;
    const statsY = PAGE_HEIGHT * 0.35 - 75;

    const stats = [
      { num: '56', label: 'Lecons Cles', sub: 'Du Palier A1 a B2', color: colorEmerald },
      { num: '140h', label: 'Volume Global', sub: 'Theorie & Pratique', color: colorSky },
      { num: '2 000+', label: 'Mots & Phrases', sub: 'Pratique RDC & Pro', color: colorAmber },
      { num: '4', label: 'Niveaux Reconnus', sub: 'Certificats QR Code', color: colorPurple },
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

    // Footer Info
    page.drawText(
      sanitizeText('Direction Pedagogique : Coach David Liandja * Plateforme Web : https://pa-english-academy.vercel.app'),
      {
        x: MARGIN,
        y: 42,
        size: 8.5,
        font: fontBold,
        color: colorNavy,
      }
    );
    page.drawText(
      sanitizeText('Kinshasa, RDC * Document Pédagogique Officiel 2026 * Destine aux apprenants et recruteurs'),
      {
        x: MARGIN,
        y: 28,
        size: 7.5,
        font: fontRegular,
        color: colorMuted,
      }
    );
  }

  /* =========================================================================
     PAGE 2 : MATRICE DE PROGRESSION & COMPÉTENCES CECRL (A1 À B2)
     ========================================================================= */
  {
    const page = createTrackedPage('MATRICE DE PROGRESSION CECRL (A1 A B2)');
    renderHeader(page, 'CADRE EUROPEEN COMMUN DE REFERENCE (CECRL : A1 A B2)');

    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 65,
      width: CONTENT_WIDTH,
      height: 28,
      color: colorNavy,
    });

    page.drawText(sanitizeText('PROGRESSION PEDAGOGIQUE DU DEBUTANT (A1) AU BILINGUE PROFESSIONNEL (B2)'), {
      x: MARGIN + 10,
      y: PAGE_HEIGHT - 48,
      size: 9.5,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText('Objectifs de sortie, volume horaire, seuils de reussite et certifications reconnues'),
      {
        x: MARGIN + 10,
        y: PAGE_HEIGHT - 59,
        size: 7.5,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );

    const levelsMeta: { id: SyllabusLevelId; color: any }[] = [
      { id: 'A1', color: colorEmerald },
      { id: 'A2', color: colorSky },
      { id: 'B1', color: colorAmber },
      { id: 'B2', color: colorPurple },
    ];

    let curY = PAGE_HEIGHT - 80;

    levelsMeta.forEach(({ id, color }) => {
      const lvl = SYLLABUS_CURRICULUM[id];
      const blockHeight = 155;

      page.drawRectangle({
        x: MARGIN,
        y: curY - blockHeight,
        width: CONTENT_WIDTH,
        height: blockHeight,
        color: colorWhite,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      // Header strip
      page.drawRectangle({
        x: MARGIN,
        y: curY - 22,
        width: CONTENT_WIDTH,
        height: 22,
        color: color,
      });

      page.drawText(sanitizeText(`${lvl.nameFr} (${lvl.nameEn})`), {
        x: MARGIN + 10,
        y: curY - 15,
        size: 9,
        font: fontBold,
        color: colorWhite,
      });

      page.drawText(sanitizeText(`${lvl.hourlyVolume} | ${lvl.totalLessons} Lecons`), {
        x: MARGIN + CONTENT_WIDTH - 210,
        y: curY - 15,
        size: 7.5,
        font: fontBold,
        color: colorWhite,
      });

      // Descriptor
      page.drawText(sanitizeText(`Descriptif CECRL :`), {
        x: MARGIN + 10,
        y: curY - 36,
        size: 7.5,
        font: fontBold,
        color: colorNavy,
      });

      page.drawText(sanitizeText(`"${lvl.cefrDescriptorFr.substring(0, 180)}..."`), {
        x: MARGIN + 10,
        y: curY - 48,
        size: 7,
        font: fontOblique,
        color: colorDark,
      });

      // Competencies list
      page.drawText(sanitizeText(`Competences Cles Validees en Fin de Niveau :`), {
        x: MARGIN + 10,
        y: curY - 66,
        size: 7.5,
        font: fontBold,
        color: color,
      });

      lvl.exitCompetenciesFr.slice(0, 5).forEach((comp, idx) => {
        page.drawText(sanitizeText(`[+] ${comp.substring(0, 110)}`), {
          x: MARGIN + 14,
          y: curY - 80 - idx * 12,
          size: 7,
          font: fontRegular,
          color: colorDark,
        });
      });

      // Exam & Pass Mark
      page.drawRectangle({
        x: MARGIN + 10,
        y: curY - 146,
        width: CONTENT_WIDTH - 20,
        height: 16,
        color: colorLightBg,
      });

      page.drawText(
        sanitizeText(`Evaluation : ${lvl.examNameFr} | Seuil d admission requis : ${lvl.passMarkPct}%`),
        {
          x: MARGIN + 14,
          y: curY - 142,
          size: 7,
          font: fontBold,
          color: colorNavy,
        }
      );

      curY -= blockHeight + 12;
    });
  }

  /* =========================================================================
     LES 4 PALIERS : RENDU EXHAUSTIF DES 56 LEÇONS DE COURS (A1 À B2)
     ========================================================================= */

  const courseLevels: { id: SyllabusLevelId; title: string; color: any }[] = [
    { id: 'A1', title: 'PALIER A1 : DEBUTANT FONDAMENTAL (12 LECONS)', color: colorEmerald },
    { id: 'A2', title: 'PALIER A2 : ELEMENTAIRE OPERATIONNEL (14 LECONS)', color: colorSky },
    { id: 'B1', title: 'PALIER B1 : INTERMEDIAIRE PROFESSIONNEL (16 LECONS)', color: colorAmber },
    { id: 'B2', title: 'PALIER B2 : AVANCE & AFFAIRES INTERNATIONALES (14 LECONS)', color: colorPurple },
  ];

  for (const lvlMeta of courseLevels) {
    const lvl = SYLLABUS_CURRICULUM[lvlMeta.id];
    let currentPage = createTrackedPage(lvlMeta.title);
    renderHeader(currentPage, lvlMeta.title);

    // Section Banner on level's opening page
    currentPage.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 68,
      width: CONTENT_WIDTH,
      height: 30,
      color: lvlMeta.color,
    });

    currentPage.drawText(sanitizeText(`${lvl.nameFr} (${lvl.nameEn})`), {
      x: MARGIN + 10,
      y: PAGE_HEIGHT - 50,
      size: 10,
      font: fontBold,
      color: colorWhite,
    });

    currentPage.drawText(
      sanitizeText(`${lvl.hourlyVolume} | ${lvl.totalLessons} Lecons exhaustives | Rythme : ${lvl.recommendedPace}`),
      {
        x: MARGIN + 10,
        y: PAGE_HEIGHT - 61,
        size: 7.5,
        font: fontRegular,
        color: rgb(240 / 255, 240 / 255, 240 / 255),
      }
    );

    let curY = PAGE_HEIGHT - 80;

    for (const lesson of lvl.lessons) {
      const cardHeight = 84;

      // Check if page break needed
      if (curY - cardHeight < 36) {
        currentPage = createTrackedPage(lvlMeta.title);
        renderHeader(currentPage, lvlMeta.title);
        curY = PAGE_HEIGHT - 45;
      }

      // Draw Main Lesson Card Box
      currentPage.drawRectangle({
        x: MARGIN,
        y: curY - cardHeight,
        width: CONTENT_WIDTH,
        height: cardHeight,
        color: colorWhite,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      // Top title bar
      currentPage.drawRectangle({
        x: MARGIN,
        y: curY - 18,
        width: CONTENT_WIDTH,
        height: 18,
        color: colorLightBg,
        borderColor: colorBorder,
        borderWidth: 0.5,
      });

      currentPage.drawText(
        sanitizeText(`LECON #${lesson.number} : ${lesson.titleFr} ("${lesson.titleEn}")`),
        {
          x: MARGIN + 8,
          y: curY - 13,
          size: 8.5,
          font: fontBold,
          color: colorNavy,
        }
      );

      currentPage.drawText(
        sanitizeText(`Unite ${lesson.unitNumber} | Focus : ${lesson.skillFocus.toUpperCase()} | ${lesson.durationMinutes} min | +${lesson.xpReward} XP`),
        {
          x: MARGIN + CONTENT_WIDTH - 220,
          y: curY - 13,
          size: 7.2,
          font: fontBold,
          color: lvlMeta.color,
        }
      );

      // 1. Objective
      currentPage.drawText(
        sanitizeText(`* Objectif Operationnel : ${lesson.objectiveFr.substring(0, 140)}`),
        {
          x: MARGIN + 8,
          y: curY - 29,
          size: 7.2,
          font: fontRegular,
          color: colorDark,
        }
      );

      // 2. Grammar points
      const gramStr = lesson.grammarPoints.join(', ');
      currentPage.drawText(
        sanitizeText(`* Grammaire & Structure : ${gramStr.substring(0, 85)}`),
        {
          x: MARGIN + 8,
          y: curY - 42,
          size: 7,
          font: fontBold,
          color: colorNavy,
        }
      );

      // 3. Vocabulary
      const vocabStr = lesson.keyVocabulary.join(', ');
      currentPage.drawText(
        sanitizeText(`* Lexique & Vocabulaire : ${vocabStr.substring(0, 95)}`),
        {
          x: MARGIN + 8,
          y: curY - 55,
          size: 7,
          font: fontRegular,
          color: colorEmerald,
        }
      );

      // 4. RDC Context
      currentPage.drawText(
        sanitizeText(`* Contexte RDC : ${lesson.rdcContext.substring(0, 130)}`),
        {
          x: MARGIN + 8,
          y: curY - 68,
          size: 6.8,
          font: fontOblique,
          color: colorDark,
        }
      );

      // 5. Exercises line
      const exStr = lesson.exercises.join(' | ');
      currentPage.drawText(
        sanitizeText(`* Exercices d'application : ${exStr.substring(0, 110)}`),
        {
          x: MARGIN + 8,
          y: curY - 79,
          size: 6.5,
          font: fontRegular,
          color: colorMuted,
        }
      );

      curY -= cardHeight + 6;
    }
  }

  /* =========================================================================
     PAGE FINALE : EVALUATION, CERTIFICATION & CODE D'ACCÈS
     ========================================================================= */
  {
    const page = createTrackedPage('CERTIFICATION & INSCRIPTION AUX COURS');
    renderHeader(page, 'MODALITES D EVALUATION & ACCREDITATION ACADEMIQUE');

    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 70,
      width: CONTENT_WIDTH,
      height: 32,
      color: colorNavy,
    });

    page.drawText(sanitizeText('PROCESSUS DE VALIDATION DU CURSUS A1 A B2 (PA3 ENGLISH ACADEMY)'), {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 52,
      size: 11,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText('Micro-learning, examens de palier, delivrance des certificats numeriques et employabilite'),
      {
        x: MARGIN + 12,
        y: PAGE_HEIGHT - 63,
        size: 8,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );

    // 3 Step Process Boxes
    const stepY = PAGE_HEIGHT - 210;
    const boxW = (CONTENT_WIDTH - 20) / 3;

    const steps = [
      {
        num: 'ETAPE 1',
        title: 'Apprentissage Quotidien',
        desc: "10 a 15 minutes par jour sur smartphone ou ordinateur. Suivi des lecons interactives, repetition vocale et pratique des exercices.",
        color: colorEmerald,
      },
      {
        num: 'ETAPE 2',
        title: 'Examens de Palier',
        desc: "A la fin de chaque niveau (A1, A2, B1, B2), passage d'une evaluation pratique orale et ecrite. Seuil de passage : 70% a 75%.",
        color: colorSky,
      },
      {
        num: 'ETAPE 3',
        title: 'Certificat avec QR Code',
        desc: "Delivrance du certificat numerique securise PA3 Academy. Verification en direct par les employeurs et recruteurs en RDC.",
        color: colorPurple,
      },
    ];

    steps.forEach((st, idx) => {
      const bX = MARGIN + idx * (boxW + 10);
      page.drawRectangle({
        x: bX,
        y: stepY,
        width: boxW,
        height: 125,
        color: colorWhite,
        borderColor: st.color,
        borderWidth: 1.5,
      });

      page.drawRectangle({
        x: bX,
        y: stepY + 100,
        width: boxW,
        height: 25,
        color: st.color,
      });

      page.drawText(sanitizeText(st.num), {
        x: bX + 8,
        y: stepY + 112,
        size: 8,
        font: fontBold,
        color: colorWhite,
      });

      page.drawText(sanitizeText(st.title), {
        x: bX + 8,
        y: stepY + 103,
        size: 7,
        font: fontRegular,
        color: colorWhite,
      });

      page.drawText(sanitizeText(st.desc), {
        x: bX + 8,
        y: stepY + 75,
        size: 7.2,
        font: fontRegular,
        color: colorDark,
      });
    });

    // Verification Box
    const vY = stepY - 145;
    page.drawRectangle({
      x: MARGIN,
      y: vY,
      width: CONTENT_WIDTH,
      height: 130,
      color: colorLightBg,
      borderColor: colorBorder,
      borderWidth: 1,
    });

    page.drawRectangle({
      x: MARGIN,
      y: vY + 105,
      width: CONTENT_WIDTH,
      height: 25,
      color: colorDeepBlue,
    });

    page.drawText(sanitizeText('SYSTEME DE CERTIFICATION OFFICIEL PA3 ENGLISH ACADEMY'), {
      x: MARGIN + 12,
      y: vY + 115,
      size: 9,
      font: fontBold,
      color: colorGoldLight,
    });

    const certDetails = [
      "- Chaque certificat de niveau (A1 Debutant, A2 Elementaire, B1 Professionnel, B2 Avance) comporte un identifiant unique.",
      "- Les entreprises partenaires (Rawbank, Vodacom, societes minieres, agences ONU) peuvent verifier l authenticite instantanement.",
      "- Lien public de verification : https://pa-english-academy.vercel.app/verify/[ID-CERTIFICAT]",
      "- Signature de la direction pedagogique sous la supervision du Coach David Liandja.",
    ];

    certDetails.forEach((cd, idx) => {
      page.drawText(sanitizeText(cd), {
        x: MARGIN + 12,
        y: vY + 86 - idx * 16,
        size: 7.8,
        font: idx === 2 ? fontBold : fontRegular,
        color: idx === 2 ? colorGold : colorDark,
      });
    });

    // CTA & Contact Box
    const ctaY = 40;
    page.drawRectangle({
      x: MARGIN,
      y: ctaY,
      width: CONTENT_WIDTH,
      height: 120,
      color: colorNavy,
      borderColor: colorGold,
      borderWidth: 2,
    });

    page.drawText(sanitizeText('ACCEDER AUX COURS EN LIGNE DES AUJOURD HUI !'), {
      x: MARGIN + 16,
      y: ctaY + 96,
      size: 13,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText('Plateforme officielle : https://pa-english-academy.vercel.app'),
      {
        x: MARGIN + 16,
        y: ctaY + 76,
        size: 10,
        font: fontBold,
        color: colorWhite,
      }
    );

    page.drawText(
      sanitizeText('TEST DE NIVEAU GRATUIT  *  COURS INTERACTIFS A1-B2  *  PAIEMENT MOBILE MONEY SECURISE'),
      {
        x: MARGIN + 16,
        y: ctaY + 56,
        size: 8,
        font: fontRegular,
        color: colorGoldLight,
      }
    );

    page.drawText(
      sanitizeText('Contact Direction Pedagogique : Coach David Liandja * WhatsApp : +27 74 293 2071'),
      {
        x: MARGIN + 16,
        y: ctaY + 36,
        size: 8,
        font: fontBold,
        color: colorWhite,
      }
    );

    page.drawText(
      sanitizeText('Kinshasa, RDC * Email : liandjadavid@gmail.com * Document Officiel 2026'),
      {
        x: MARGIN + 16,
        y: ctaY + 18,
        size: 7,
        font: fontOblique,
        color: rgb(203 / 255, 213 / 255, 225 / 255),
      }
    );
  }

  /* =========================================================================
     NUMÉROTATION UNIFORME DES PAGES
     ========================================================================= */
  const totalPagesCount = pagesList.length;
  console.log(`[INFO] Total generated pages for Course Lessons (A1 to B2): ${totalPagesCount}`);

  pagesList.forEach(({ page }, index) => {
    const pageNum = index + 1;
    if (pageNum === 1) return; // Skip cover

    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: 24,
      color: colorLightBg,
    });

    page.drawLine({
      start: { x: MARGIN, y: 24 },
      end: { x: PAGE_WIDTH - MARGIN, y: 24 },
      thickness: 0.8,
      color: colorBorder,
    });

    page.drawText('https://pa-english-academy.vercel.app  |  Kinshasa, RDC  |  PA3 English Academy', {
      x: MARGIN,
      y: 9,
      size: 7.2,
      font: fontRegular,
      color: colorMuted,
    });

    const pageNumStr = `Page ${pageNum} / ${totalPagesCount}`;
    const pWidth = fontBold.widthOfTextAtSize(pageNumStr, 7.5);
    page.drawText(pageNumStr, {
      x: PAGE_WIDTH - MARGIN - pWidth,
      y: 9,
      size: 7.5,
      font: fontBold,
      color: colorDark,
    });
  });

  const pdfBytes = await pdfDoc.save();
  const outputDir = path.join(__dirname, '..', 'public', 'downloads');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'PA3-ENGLISH-COURSE-LESSONS-A1-TO-B2.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`[SUCCESS] Course Lessons PDF (A1 to B2) generated cleanly!`);
  console.log(`[OUTPUT PATH] ${outputPath}`);
  console.log(`[TOTAL PAGES] ${totalPagesCount} pages`);
  console.log(`[FILE SIZE] ${(pdfBytes.length / 1024).toFixed(2)} KB`);
}

buildCourseLessonsA1ToB2Pdf().catch((err) => {
  console.error('[ERROR] Failed to generate Course Lessons PDF:', err);
  process.exit(1);
});

