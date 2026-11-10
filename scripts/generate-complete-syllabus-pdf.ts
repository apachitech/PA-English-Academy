/**
 * PA³ English Academy - Générateur Officiel du Master Syllabus PDF
 * Compile l'INTÉGRALITÉ du programme :
 * - Planches Visuelles Illustrées (Corps Humain, Phonétique, Mode Africaine, Objets du Quotidien)
 * - L'INTÉGRALITÉ DES 64 LEÇONS DÉTAILLÉES (A1, A2, B1, B2, ESP Métiers) avec Objectifs, Grammaire, Lexique et Contexte RDC.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import { SYLLABUS_CURRICULUM, SyllabusLevelId, SyllabusLesson } from '../src/lib/domain/syllabus-data';
import {
  BODY_PARTS_DATA,
  PRONUNCIATION_RULES_DATA,
  CLOTHING_DATA,
  EVERYDAY_OBJECTS_DATA,
} from '../src/lib/domain/illustrated-syllabus-data';

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

function fitText(font: any, text: string, fontSize: number, maxWidth: number): string {
  if (!text) return '';
  if (font.widthOfTextAtSize(text, fontSize) <= maxWidth) {
    return text;
  }
  let truncated = text;
  while (truncated.length > 3 && font.widthOfTextAtSize(truncated + '...', fontSize) > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated.trim() + '...';
}

async function buildMasterSyllabusPdf() {
  console.log('[START] Generating Complete Master Syllabus PDF with all 64 lessons & illustrated plates...');
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

  // Accents
  const colorEmerald = rgb(5 / 255, 150 / 255, 105 / 255);
  const colorSky = rgb(2 / 255, 132 / 255, 199 / 255);
  const colorPurple = rgb(124 / 255, 58 / 255, 237 / 255);
  const colorRose = rgb(225 / 255, 29 / 255, 72 / 255);

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
     PAGE 1 : COUVERTURE OFFICIELLE (COVER)
     ========================================================================= */
  {
    const page = createTrackedPage('COUVERTURE OFFICIELLE');

    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT * 0.32,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT * 0.68,
      color: colorNavy,
    });

    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT * 0.32,
      color: colorLightBg,
    });

    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT * 0.32 - 3,
      width: PAGE_WIDTH,
      height: 6,
      color: colorGold,
    });

    // Logo & Header
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

    page.drawText('REPUBLIQUE DEMOCRATIQUE DU CONGO  *  FORMATION BILINGUE ACCELEREE', {
      x: MARGIN + 85,
      y: PAGE_HEIGHT - 72,
      size: 8,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText('Kinshasa - Lubumbashi - Kolwezi - Goma - Afrique Francophone', {
      x: MARGIN + 85,
      y: PAGE_HEIGHT - 87,
      size: 9,
      font: fontRegular,
      color: rgb(226 / 255, 232 / 255, 240 / 255),
    });

    // Titles
    page.drawText('GRAND SYLLABUS OFFICIEL', {
      x: MARGIN,
      y: PAGE_HEIGHT - 160,
      size: 30,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText('& LIVRET VISUEL ILLUSTRE', {
      x: MARGIN,
      y: PAGE_HEIGHT - 198,
      size: 25,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText("Catalogue exhaustif rassemblant l'integralite des 64 lecons (A1 a B2 + Modules Metiers)"),
      {
        x: MARGIN,
        y: PAGE_HEIGHT - 230,
        size: 11,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );
    page.drawText(
      sanitizeText("ainsi que les 4 planches pedagogiques illustrees adaptees aux etudiants congolais et africains."),
      {
        x: MARGIN,
        y: PAGE_HEIGHT - 246,
        size: 11,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );

    // Summary Box of Content
    const sumY = PAGE_HEIGHT - 390;
    page.drawRectangle({
      x: MARGIN,
      y: sumY,
      width: CONTENT_WIDTH,
      height: 125,
      color: colorDeepBlue,
      borderColor: rgb(51 / 255, 65 / 255, 85 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText('SOMMAIRE GENERAL DU DOCUMENT :'), {
      x: MARGIN + 14,
      y: sumY + 104,
      size: 9.5,
      font: fontBold,
      color: colorGoldLight,
    });

    const sumLines = [
      '[PARTIE 1] Planche Visuelle 1 : Le Corps Humain & la Sante (21 parties avec phonetique & lingala)',
      '[PARTIE 2] Planche Visuelle 2 : Le Grand Guide de Prononciation (/th/, /h/, voyelles, pieges RDC)',
      '[PARTIE 3] Planche Visuelle 3 : Habits, Mode Africaine & Sape (Costumes corporate, Pagne/Wax, Boubous)',
      '[PARTIE 4] Planche Visuelle 4 : Objets du Quotidien & Terrain RDC (Tech, Power Bank, Mines, Mobile Money)',
      '[PARTIE 5] Lecons 1 a 12 : Niveau A1 - Debutant Fondamental (Objectifs, grammaire, vocabulaire)',
      '[PARTIE 6] Lecons 13 a 26 : Niveau A2 - Elementaire Operationnel',
      '[PARTIE 7] Lecons 27 a 42 : Niveau B1 - Intermediaire Professionnel',
      '[PARTIE 8] Lecons 43 a 56 : Niveau B2 - Avance & Affaires Internationales',
      '[PARTIE 9] Lecons 57 a 64 : Masterclasses Metiers ESP (Mines, Banque, Droit OHADA, Sante, Diplomatie)',
    ];

    sumLines.forEach((sl, idx) => {
      page.drawText(sanitizeText(sl), {
        x: MARGIN + 14,
        y: sumY + 86 - idx * 11,
        size: 7.5,
        font: fontRegular,
        color: colorWhite,
      });
    });

    // Lower Metric Cards
    const statBoxWidth = (CONTENT_WIDTH - 30) / 4;
    const statsY = PAGE_HEIGHT * 0.32 - 68;

    const stats = [
      { num: '64', label: 'Lecons Exhaustives', sub: 'A1 a B2 + ESP', color: colorEmerald },
      { num: '160h', label: 'Volume de Cours', sub: 'Micro-learning 15 min', color: colorSky },
      { num: '2 500+', label: 'Mots & Phrases', sub: 'Contextualises RDC', color: colorGold },
      { num: '4', label: 'Certificats Reconnus', sub: 'QR Code Verifiable', color: colorPurple },
    ];

    stats.forEach((st, idx) => {
      const boxX = MARGIN + idx * (statBoxWidth + 10);
      page.drawRectangle({
        x: boxX,
        y: statsY,
        width: statBoxWidth,
        height: 55,
        color: colorWhite,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      page.drawText(st.num, {
        x: boxX + 10,
        y: statsY + 34,
        size: 15,
        font: fontBold,
        color: st.color,
      });

      page.drawText(sanitizeText(st.label), {
        x: boxX + 10,
        y: statsY + 20,
        size: 8,
        font: fontBold,
        color: colorDark,
      });

      page.drawText(sanitizeText(st.sub), {
        x: boxX + 10,
        y: statsY + 9,
        size: 6.8,
        font: fontRegular,
        color: colorMuted,
      });
    });

    // Footer Info
    page.drawText(
      sanitizeText('Direction Pedagogique : Coach David Liandja * Plateforme Web : https://pa-english-academy.vercel.app'),
      {
        x: MARGIN,
        y: 40,
        size: 8,
        font: fontBold,
        color: colorNavy,
      }
    );
    page.drawText(
      sanitizeText('Kinshasa, RDC * Edition Complete 2026 * Repertoire exhaustif des cours'),
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
     PAGE 2 : PLANCHE VISUELLE 1 - CORPS HUMAIN & SANTE
     ========================================================================= */
  {
    const page = createTrackedPage('PLANCHE 1 : LE CORPS HUMAIN & LA SANTE');
    renderHeader(page, 'PLANCHE 1 : LE CORPS HUMAIN & LA SANTE (THE HUMAN BODY)');

    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 65,
      width: CONTENT_WIDTH,
      height: 28,
      color: colorEmerald,
    });

    page.drawText(sanitizeText('PLANCHE PEDAGOGIQUE 1 : LE CORPS HUMAIN & VOCABULAIRE MEDICAL (21 PARTIES)'), {
      x: MARGIN + 10,
      y: PAGE_HEIGHT - 48,
      size: 9.5,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText(
      sanitizeText('Phonetique IPA, equivalences lingala, pieges majeurs francophones et dialogue medical'),
      {
        x: MARGIN + 10,
        y: PAGE_HEIGHT - 59,
        size: 7.5,
        font: fontRegular,
        color: rgb(209 / 255, 250 / 255, 229 / 255),
      }
    );

    const colWidth = (CONTENT_WIDTH - 16) / 2;
    const bodyLeft = BODY_PARTS_DATA.slice(0, 11);
    const bodyRight = BODY_PARTS_DATA.slice(11);

    function renderBodyColumn(items: typeof BODY_PARTS_DATA, startX: number, startY: number, title: string) {
      page.drawRectangle({
        x: startX,
        y: startY,
        width: colWidth,
        height: 18,
        color: colorDeepBlue,
      });

      page.drawText(sanitizeText(title), {
        x: startX + 8,
        y: startY + 5,
        size: 8,
        font: fontBold,
        color: colorWhite,
      });

      let currentY = startY - 2;
      const rowHeight = 52;

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

        page.drawText(sanitizeText(`${it.nameEn}`), {
          x: startX + 8,
          y: currentY - 13,
          size: 8.5,
          font: fontBold,
          color: colorNavy,
        });

        page.drawText(sanitizeText(`${it.phonetic}`), {
          x: startX + 100,
          y: currentY - 13,
          size: 7.5,
          font: fontOblique,
          color: colorEmerald,
        });

        page.drawText(sanitizeText(`FR : ${it.nameFr} | Lingala : ${it.lingalaNote || '-'}`), {
          x: startX + 8,
          y: currentY - 25,
          size: 7.5,
          font: fontRegular,
          color: colorDark,
        });

        page.drawText(sanitizeText(`* Ex : "${it.sampleSentenceEn}"`), {
          x: startX + 8,
          y: currentY - 37,
          size: 6.8,
          font: fontRegular,
          color: colorMuted,
        });

        if (it.pitfallWarningFr) {
          page.drawText(sanitizeText(`! ${it.pitfallWarningFr.substring(0, 60)}...`), {
            x: startX + 8,
            y: currentY - 47,
            size: 6.5,
            font: fontBold,
            color: colorRose,
          });
        }

        currentY -= rowHeight;
      });
    }

    const startGridY = PAGE_HEIGHT - 90;
    renderBodyColumn(bodyLeft, MARGIN, startGridY, 'A. TETE, VISAGE & COU (HEAD & NECK)');
    renderBodyColumn(bodyRight, MARGIN + colWidth + 16, startGridY, 'B. BUSTE & MEMBRES (UPPER & LOWER BODY)');

    // Bottom Doctor Roleplay
    page.drawRectangle({
      x: MARGIN,
      y: 40,
      width: CONTENT_WIDTH,
      height: 70,
      color: rgb(240 / 255, 253 / 255, 250 / 255),
      borderColor: rgb(153 / 255, 246 / 255, 228 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText('SIMULATION CLINIQUE & SANTE A KINSHASA (ROLEPLAY CONSULTATION) :'), {
      x: MARGIN + 10,
      y: 94,
      size: 8,
      font: fontBold,
      color: colorEmerald,
    });

    const clinicDialogue = [
      "- Doctor : 'Good morning, Mr. Mutombo. Please take a seat. What seems to be the trouble today ?'",
      "- Patient : 'Doctor, I have had a severe headache and high fever since yesterday. My throat is also very sore.'",
      "- Doctor : 'I see. Let me check your forehead temperature and examine your chest and stomach. Take a deep breath.'",
      "- Expression cle : 'I have a sore throat' (mal de gorge) | 'My leg hurts' (ma jambe me fait mal) | 'A headache' (mal de tete).",
    ];

    clinicDialogue.forEach((dl, idx) => {
      page.drawText(sanitizeText(dl), {
        x: MARGIN + 10,
        y: 80 - idx * 11,
        size: 7.2,
        font: fontRegular,
        color: colorDark,
      });
    });
  }

  /* =========================================================================
     PAGE 3 : PLANCHE VISUELLE 2 - PRONONCIATION & PHONETIQUE
     ========================================================================= */
  {
    const page = createTrackedPage('PLANCHE 2 : PHONETIQUE & PRONONCIATION');
    renderHeader(page, 'PLANCHE 2 : LE GRAND GUIDE DE PRONONCIATION');

    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 65,
      width: CONTENT_WIDTH,
      height: 28,
      color: colorSky,
    });

    page.drawText(sanitizeText('PLANCHE PEDAGOGIQUE 2 : LES 5 SONS PIEGES POUR CONGOLAIS & FRANCOPHONES'), {
      x: MARGIN + 10,
      y: PAGE_HEIGHT - 48,
      size: 9.5,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText(
      sanitizeText('Schémas articulatoires, paires minimales embarrassantes et astuces du Coach David'),
      {
        x: MARGIN + 10,
        y: PAGE_HEIGHT - 59,
        size: 7.5,
        font: fontRegular,
        color: rgb(224 / 255, 242 / 255, 254 / 255),
      }
    );

    let curY = PAGE_HEIGHT - 80;

    PRONUNCIATION_RULES_DATA.forEach((rule) => {
      const cardHeight = 110;
      page.drawRectangle({
        x: MARGIN,
        y: curY - cardHeight,
        width: CONTENT_WIDTH,
        height: cardHeight,
        color: colorWhite,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      // Sound Header
      page.drawRectangle({
        x: MARGIN,
        y: curY - 20,
        width: 140,
        height: 20,
        color: colorSky,
      });

      page.drawText(sanitizeText(`${rule.soundIpa} - ${rule.vocalCords}`), {
        x: MARGIN + 8,
        y: curY - 14,
        size: 8,
        font: fontBold,
        color: colorWhite,
      });

      page.drawText(sanitizeText(rule.titleFr), {
        x: MARGIN + 150,
        y: curY - 14,
        size: 9,
        font: fontBold,
        color: colorNavy,
      });

      // Articulation & Pitfall
      page.drawText(sanitizeText(`* Articulation : ${rule.mouthPositionFr}`), {
        x: MARGIN + 10,
        y: curY - 35,
        size: 7.5,
        font: fontRegular,
        color: colorDark,
      });

      page.drawText(sanitizeText(`* Le Piege Africain : ${rule.africanPitfallFr}`), {
        x: MARGIN + 10,
        y: curY - 50,
        size: 7.2,
        font: fontBold,
        color: colorRose,
      });

      // Examples line
      const exStr = rule.goodExamples.map((g) => `${g.word} (${g.phonetic}) = ${g.translationFr}`).join(' | ');
      page.drawText(sanitizeText(`* Exemples cles : ${exStr}`), {
        x: MARGIN + 10,
        y: curY - 68,
        size: 7.2,
        font: fontBold,
        color: colorNavy,
      });

      // Coach Tip Box inside
      page.drawRectangle({
        x: MARGIN + 8,
        y: curY - 104,
        width: CONTENT_WIDTH - 16,
        height: 28,
        color: rgb(254 / 255, 243 / 255, 199 / 255),
        borderColor: rgb(252 / 255, 211 / 255, 77 / 255),
        borderWidth: 0.5,
      });

      page.drawText(sanitizeText(`Astuce Coach : ${rule.coachTipFr}`), {
        x: MARGIN + 12,
        y: curY - 95,
        size: 6.8,
        font: fontOblique,
        color: colorDark,
      });

      curY -= cardHeight + 12;
    });
  }

  /* =========================================================================
     PAGE 4 : PLANCHE VISUELLE 3 - HABITS & MODE AFRICAINE
     ========================================================================= */
  {
    const page = createTrackedPage('PLANCHE 3 : HABITS & MODE AFRICAINE');
    renderHeader(page, 'PLANCHE 3 : LA GARDE-ROBE, VETEMENTS & MODE AFRICAINE');

    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 65,
      width: CONTENT_WIDTH,
      height: 28,
      color: colorPurple,
    });

    page.drawText(sanitizeText('PLANCHE PEDAGOGIQUE 3 : HABITS, VETEMENTS & ART VESTIMENTAIRE AFRICAIN'), {
      x: MARGIN + 10,
      y: PAGE_HEIGHT - 48,
      size: 9.5,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText(
      sanitizeText('Costumes corporate, Pagne Wax congolais, Dashiki/Boubou et culture de la SAPE'),
      {
        x: MARGIN + 10,
        y: PAGE_HEIGHT - 59,
        size: 7.5,
        font: fontRegular,
        color: rgb(243 / 255, 232 / 255, 255 / 255),
      }
    );

    const colWidth = (CONTENT_WIDTH - 16) / 2;
    const clothesCorp = CLOTHING_DATA.filter((c) => c.category === 'business');
    const clothesAfrican = CLOTHING_DATA.filter((c) => c.category !== 'business');

    function renderClothingCol(items: typeof CLOTHING_DATA, startX: number, startY: number, title: string, bColor: any) {
      page.drawRectangle({
        x: startX,
        y: startY,
        width: colWidth,
        height: 18,
        color: bColor,
      });

      page.drawText(sanitizeText(title), {
        x: startX + 8,
        y: startY + 5,
        size: 8,
        font: fontBold,
        color: colorWhite,
      });

      let currentY = startY - 2;
      const rowHeight = 56;

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

        page.drawText(sanitizeText(`${it.emoji} ${it.nameEn}`), {
          x: startX + 8,
          y: currentY - 14,
          size: 8.5,
          font: fontBold,
          color: colorNavy,
        });

        page.drawText(sanitizeText(`${it.phonetic}`), {
          x: startX + 125,
          y: currentY - 14,
          size: 7.5,
          font: fontOblique,
          color: colorPurple,
        });

        page.drawText(sanitizeText(`FR : ${it.nameFr}`), {
          x: startX + 8,
          y: currentY - 26,
          size: 7.5,
          font: fontRegular,
          color: colorDark,
        });

        page.drawText(sanitizeText(`* Culture : ${it.culturalNoteFr}`), {
          x: startX + 8,
          y: currentY - 38,
          size: 6.8,
          font: fontRegular,
          color: colorMuted,
        });

        page.drawText(sanitizeText(`* Ex : "${it.sampleSentenceEn}"`), {
          x: startX + 8,
          y: currentY - 49,
          size: 6.5,
          font: fontOblique,
          color: colorDark,
        });

        currentY -= rowHeight;
      });
    }

    const startClothingY = PAGE_HEIGHT - 90;
    renderClothingCol(clothesCorp, MARGIN, startClothingY, 'A. CORPORATE & BUSINESS ATTIRE', colorDeepBlue);
    renderClothingCol(clothesAfrican.slice(0, 8), MARGIN + colWidth + 16, startClothingY, 'B. MODE AFRICAINE & CASUAL CHIC', colorPurple);

    // Bottom Sapeur note
    page.drawRectangle({
      x: MARGIN,
      y: 40,
      width: CONTENT_WIDTH,
      height: 55,
      color: rgb(250 / 255, 245 / 255, 255 / 255),
      borderColor: rgb(233 / 255, 213 / 255, 255 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText("L'ELEGANCE AFRICAINE & LA REGLE DU 'DRESS FOR SUCCESS' :"), {
      x: MARGIN + 10,
      y: 80,
      size: 8,
      font: fontBold,
      color: colorPurple,
    });

    const sapeurNotes = [
      "- En RDC, la facon de s'habiller traduit le respect porte a ses partenaires d'affaires ('Smart Casual' ou 'Business Suit').",
      "- Mots cles des tissus : Cotton (coton), Silk (soie), Leather (cuir), African wax print (tissu pagne).",
      "- La SAPE congolaise venerait deja les souliers Weston et l'harmonie des 3 couleurs bien avant la mondialisation !",
    ];

    sapeurNotes.forEach((sn, idx) => {
      page.drawText(sanitizeText(sn), {
        x: MARGIN + 10,
        y: 68 - idx * 11,
        size: 7.2,
        font: fontRegular,
        color: colorDark,
      });
    });
  }

  /* =========================================================================
     PAGE 5 : PLANCHE VISUELLE 4 - OBJETS DU QUOTIDIEN & TERRAIN RDC
     ========================================================================= */
  {
    const page = createTrackedPage('PLANCHE 4 : OBJETS DU QUOTIDIEN & TERRAIN');
    renderHeader(page, 'PLANCHE 4 : OBJETS DU QUOTIDIEN, DE BUREAU & TERRAIN');

    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 65,
      width: CONTENT_WIDTH,
      height: 28,
      color: colorGold,
    });

    page.drawText(sanitizeText('PLANCHE PEDAGOGIQUE 4 : OBJETS DU QUOTIDIEN, TECH, DELESTAGE & MINES RDC'), {
      x: MARGIN + 10,
      y: PAGE_HEIGHT - 48,
      size: 9.5,
      font: fontBold,
      color: colorWhite,
    });

    page.drawText(
      sanitizeText('Outils informatiques, fournitures de bureau, kit de terrain minier et survie urbaine'),
      {
        x: MARGIN + 10,
        y: PAGE_HEIGHT - 59,
        size: 7.5,
        font: fontRegular,
        color: rgb(254 / 255, 243 / 255, 199 / 255),
      }
    );

    const colWidth = (CONTENT_WIDTH - 16) / 2;
    const objTech = EVERYDAY_OBJECTS_DATA.filter((o) => o.category === 'tech_office');
    const objField = EVERYDAY_OBJECTS_DATA.filter((o) => o.category !== 'tech_office');

    function renderObjectsCol(items: typeof EVERYDAY_OBJECTS_DATA, startX: number, startY: number, title: string, bColor: any) {
      page.drawRectangle({
        x: startX,
        y: startY,
        width: colWidth,
        height: 18,
        color: bColor,
      });

      page.drawText(sanitizeText(title), {
        x: startX + 8,
        y: startY + 5,
        size: 8,
        font: fontBold,
        color: colorWhite,
      });

      let currentY = startY - 2;
      const rowHeight = 60;

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

        page.drawText(sanitizeText(`${it.nameEn}`), {
          x: startX + 8,
          y: currentY - 14,
          size: 8.5,
          font: fontBold,
          color: colorNavy,
        });

        page.drawText(sanitizeText(`${it.phonetic}`), {
          x: startX + 130,
          y: currentY - 14,
          size: 7.5,
          font: fontOblique,
          color: colorGold,
        });

        page.drawText(sanitizeText(`FR : ${it.nameFr}`), {
          x: startX + 8,
          y: currentY - 26,
          size: 7.5,
          font: fontRegular,
          color: colorDark,
        });

        page.drawText(sanitizeText(`* Pratique : ${it.practicalContextFr}`), {
          x: startX + 8,
          y: currentY - 38,
          size: 6.8,
          font: fontRegular,
          color: colorMuted,
        });

        page.drawText(sanitizeText(`* Ex : "${it.sampleSentenceEn}"`), {
          x: startX + 8,
          y: currentY - 50,
          size: 6.5,
          font: fontOblique,
          color: colorDark,
        });

        currentY -= rowHeight;
      });
    }

    const startObjY = PAGE_HEIGHT - 90;
    renderObjectsCol(objTech, MARGIN, startObjY, 'A. EQUIPEMENTS TECH & BUREAU', colorDeepBlue);
    renderObjectsCol(objField, MARGIN + colWidth + 16, startObjY, 'B. ESSENTIELS URBAINS & TERRAIN RDC', colorGold);

    // Bottom Power bank note
    page.drawRectangle({
      x: MARGIN,
      y: 40,
      width: CONTENT_WIDTH,
      height: 55,
      color: rgb(254 / 255, 243 / 255, 199 / 255),
      borderColor: rgb(252 / 255, 211 / 255, 77 / 255),
      borderWidth: 1,
    });

    page.drawText(sanitizeText('LE VOCABULAIRE DES URGENCES DU QUOTIDIEN EN RDC :'), {
      x: MARGIN + 10,
      y: 80,
      size: 8,
      font: fontBold,
      color: colorGold,
    });

    const objNotes = [
      "- 'Could I please borrow your laptop charger ?' (Puis-je emprunter votre chargeur ?)",
      "- 'My phone battery is running low due to a power outage. Do you have a power bank ?' (Batterie faible due au délestage).",
      "- 'Safety regulations in Kolwezi strictly require steel-toe boots and a hard hat.' (EPI minier obligatoire).",
    ];

    objNotes.forEach((on, idx) => {
      page.drawText(sanitizeText(on), {
        x: MARGIN + 10,
        y: 68 - idx * 11,
        size: 7.2,
        font: fontRegular,
        color: colorDark,
      });
    });
  }

  /* =========================================================================
     SECTIONS SUIVANTES : LES 64 LEÇONS DÉTAILLÉES (A1, A2, B1, B2, ESP)
     ========================================================================= */

  const levelsToRender: { id: SyllabusLevelId; headerTitle: string; color: any }[] = [
    { id: 'A1', headerTitle: 'PALIER A1 : DEBUTANT FONDAMENTAL (12 LECONS)', color: colorEmerald },
    { id: 'A2', headerTitle: 'PALIER A2 : ELEMENTAIRE OPERATIONNEL (14 LECONS)', color: colorSky },
    { id: 'B1', headerTitle: 'PALIER B1 : INTERMEDIAIRE PROFESSIONNEL (16 LECONS)', color: colorGold },
    { id: 'B2', headerTitle: 'PALIER B2 : AVANCE & AFFAIRES INTERNATIONALES (14 LECONS)', color: colorPurple },
    { id: 'SPECIAL', headerTitle: 'MODULES METIERS & ANGLAIS SPECIALISE ESP (8 MODULES)', color: colorRose },
  ];

  for (const lvlMeta of levelsToRender) {
    const lvlData = SYLLABUS_CURRICULUM[lvlMeta.id];
    let currentPage = createTrackedPage(lvlMeta.headerTitle);
    renderHeader(currentPage, lvlMeta.headerTitle);

    // Level intro banner on first page
    currentPage.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 70,
      width: CONTENT_WIDTH,
      height: 32,
      color: lvlMeta.color,
    });

    currentPage.drawText(sanitizeText(`${lvlData.nameFr} (${lvlData.nameEn})`), {
      x: MARGIN + 10,
      y: PAGE_HEIGHT - 52,
      size: 10,
      font: fontBold,
      color: colorWhite,
    });

    currentPage.drawText(
      sanitizeText(`${lvlData.hourlyVolume} | ${lvlData.totalLessons} Lecons | ${lvlData.recommendedPace}`),
      {
        x: MARGIN + 10,
        y: PAGE_HEIGHT - 63,
        size: 7.5,
        font: fontRegular,
        color: rgb(240 / 255, 240 / 255, 240 / 255),
      }
    );

    let curY = PAGE_HEIGHT - 85;

    // Render each lesson in this level
    for (const lesson of lvlData.lessons) {
      const lessonCardHeight = 78;

      // Check if we need a new page
      if (curY - lessonCardHeight < 40) {
        currentPage = createTrackedPage(lvlMeta.headerTitle);
        renderHeader(currentPage, lvlMeta.headerTitle);
        curY = PAGE_HEIGHT - 45;
      }

      // Draw Lesson Card
      currentPage.drawRectangle({
        x: MARGIN,
        y: curY - lessonCardHeight,
        width: CONTENT_WIDTH,
        height: lessonCardHeight,
        color: colorWhite,
        borderColor: colorBorder,
        borderWidth: 1,
      });

      // Top strip of card
      currentPage.drawRectangle({
        x: MARGIN,
        y: curY - 18,
        width: CONTENT_WIDTH,
        height: 18,
        color: colorLightBg,
        borderColor: colorBorder,
        borderWidth: 0.5,
      });

      // Right-hand metadata badge pill (clean, protected layer)
      const badgeText = sanitizeText(`Unite ${lesson.unitNumber} | ${lesson.skillFocus.toUpperCase()} | ${lesson.durationMinutes} min | +${lesson.xpReward} XP`);
      const badgeW = fontBold.widthOfTextAtSize(badgeText, 6.8);
      const badgeBoxW = badgeW + 10;
      const badgeBoxX = MARGIN + CONTENT_WIDTH - badgeBoxW - 5;
      const badgeBoxY = curY - 16;

      currentPage.drawRectangle({
        x: badgeBoxX,
        y: badgeBoxY,
        width: badgeBoxW,
        height: 14,
        color: colorWhite,
        borderColor: lvlMeta.color,
        borderWidth: 0.8,
      });

      currentPage.drawText(badgeText, {
        x: badgeBoxX + 5,
        y: curY - 12.5,
        size: 6.8,
        font: fontBold,
        color: lvlMeta.color,
      });

      // Left-hand title (strictly bounded by maxTitleW so it NEVER obstructs the badge)
      const maxTitleW = badgeBoxX - (MARGIN + 8) - 8;
      const fullTitle = sanitizeText(`LECON #${lesson.number} : ${lesson.titleFr} ("${lesson.titleEn}")`);
      let titleToDraw = fullTitle;

      if (fontBold.widthOfTextAtSize(fullTitle, 8.2) > maxTitleW) {
        const frTitle = sanitizeText(`LECON #${lesson.number} : ${lesson.titleFr}`);
        if (fontBold.widthOfTextAtSize(frTitle, 8.2) <= maxTitleW) {
          const remainingW = maxTitleW - fontBold.widthOfTextAtSize(frTitle, 8.2) - 6;
          if (remainingW >= 45) {
            const enSnippet = fitText(fontOblique, `("${lesson.titleEn}")`, 7.0, remainingW);
            titleToDraw = `${frTitle} ${enSnippet}`;
          } else {
            titleToDraw = frTitle;
          }
        } else {
          titleToDraw = fitText(fontBold, frTitle, 8.2, maxTitleW);
        }
      }

      currentPage.drawText(titleToDraw, {
        x: MARGIN + 8,
        y: curY - 12.5,
        size: 8.2,
        font: fontBold,
        color: colorNavy,
      });

      // Objective
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

      // Grammar & Vocabulary line
      const gramText = lesson.grammarPoints.join(', ');
      const vocabText = lesson.keyVocabulary.join(', ');
      currentPage.drawText(
        sanitizeText(`* Grammaire : ${gramText.substring(0, 75)}`),
        {
          x: MARGIN + 8,
          y: curY - 43,
          size: 7,
          font: fontBold,
          color: colorNavy,
        }
      );

      currentPage.drawText(
        sanitizeText(`* Vocabulaire : ${vocabText.substring(0, 85)}`),
        {
          x: MARGIN + 8,
          y: curY - 56,
          size: 7,
          font: fontRegular,
          color: colorEmerald,
        }
      );

      // DRC Context
      currentPage.drawText(
        sanitizeText(`* Contexte RDC : ${lesson.rdcContext.substring(0, 130)}`),
        {
          x: MARGIN + 8,
          y: curY - 70,
          size: 6.8,
          font: fontOblique,
          color: colorMuted,
        }
      );

      curY -= lessonCardHeight + 6;
    }
  }

  /* =========================================================================
     DERNIÈRE PAGE : MÉTHODE PA³, CERTIFICATION QR CODE & CONTACT
     ========================================================================= */
  {
    const page = createTrackedPage('METHODOLOGIE, EVALUATION & CERTIFICATION');
    renderHeader(page, 'LA METHODE PEDAGOGIQUE PA3 & ACCREDITATION');

    page.drawRectangle({
      x: MARGIN,
      y: PAGE_HEIGHT - 70,
      width: CONTENT_WIDTH,
      height: 32,
      color: colorNavy,
    });

    page.drawText(sanitizeText('LA FORMULE PEDAGOGIQUE PA3 POUR DEVENIR BILINGUE EN RDC'), {
      x: MARGIN + 12,
      y: PAGE_HEIGHT - 52,
      size: 11,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText('Micro-learning, immersion phonetique et debouches professionnels en Afrique et a l international'),
      {
        x: MARGIN + 12,
        y: PAGE_HEIGHT - 63,
        size: 8,
        font: fontRegular,
        color: rgb(226 / 255, 232 / 255, 240 / 255),
      }
    );

    // 3 Formula Pillars
    const fY = PAGE_HEIGHT - 210;
    const boxW = (CONTENT_WIDTH - 20) / 3;

    const formulaPillars = [
      {
        title: 'PILIER 1 : PRATIQUE ACTIVE',
        subtitle: '70% Oral - 30% Theorie',
        desc: "Parler a voix haute des le premier jour. Repeter face au miroir et lors des ateliers interactifs avec le Coach David Liandja.",
        col: colorEmerald,
      },
      {
        title: 'PILIER 2 : PHONETIQUE CIBLEE',
        subtitle: 'Zero Blocage Oral',
        desc: "Correction precise des interferences phonetiques lingala/swahili/francais (/th/, /h/, -ED, voyelles courtes).",
        col: colorSky,
      },
      {
        title: 'PILIER 3 : PROFESSIONNEL',
        subtitle: 'Emploi RDC & International',
        desc: "Vocabulaire branche sur les recruteurs de Kinshasa : Rawbank, Vodacom, agences ONU, societes minieres a Kolwezi.",
        col: colorGold,
      },
    ];

    formulaPillars.forEach((fp, idx) => {
      const bX = MARGIN + idx * (boxW + 10);
      page.drawRectangle({
        x: bX,
        y: fY,
        width: boxW,
        height: 125,
        color: colorWhite,
        borderColor: fp.col,
        borderWidth: 1.5,
      });

      page.drawRectangle({
        x: bX,
        y: fY + 100,
        width: boxW,
        height: 25,
        color: fp.col,
      });

      page.drawText(sanitizeText(fp.title), {
        x: bX + 8,
        y: fY + 112,
        size: 7.8,
        font: fontBold,
        color: colorWhite,
      });

      page.drawText(sanitizeText(fp.subtitle), {
        x: bX + 8,
        y: fY + 103,
        size: 6.8,
        font: fontRegular,
        color: colorWhite,
      });

      page.drawText(sanitizeText(fp.desc), {
        x: bX + 8,
        y: fY + 75,
        size: 7.2,
        font: fontRegular,
        color: colorDark,
      });
    });

    // Verification Box
    const vY = fY - 145;
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

    page.drawText(sanitizeText('SYSTEME DE CERTIFICATION NUMERIQUE VERIFIABLE PAR QR CODE'), {
      x: MARGIN + 12,
      y: vY + 115,
      size: 9,
      font: fontBold,
      color: colorGoldLight,
    });

    const certText = [
      "- Chaque palier valide avec 80% de reussite delivre un Certificat Officiel PA3 English Academy.",
      "- Tous nos certificats possedent un QR Code unique de verification en temps reel par les employeurs :",
      "  https://pa-english-academy.vercel.app/verify/[ID-CERTIFICAT]",
      "- Reconnu aupres des institutions, ONGs, banques et multinationales en RDC et en Afrique.",
    ];

    certText.forEach((ct, idx) => {
      page.drawText(sanitizeText(ct), {
        x: MARGIN + 12,
        y: vY + 86 - idx * 16,
        size: 7.8,
        font: idx === 2 ? fontBold : fontRegular,
        color: idx === 2 ? colorGold : colorDark,
      });
    });

    // CTA Box
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

    page.drawText(sanitizeText('INSCRIVEZ-VOUS DES AUJOURD HUI & PASSEZ VOTRE TEST DE NIVEAU !'), {
      x: MARGIN + 16,
      y: ctaY + 96,
      size: 12,
      font: fontBold,
      color: colorGoldLight,
    });

    page.drawText(
      sanitizeText('Plateforme officielle : https://pa-english-academy.vercel.app'),
      {
        x: MARGIN + 16,
        y: ctaY + 76,
        size: 9.5,
        font: fontBold,
        color: colorWhite,
      }
    );

    page.drawText(
      sanitizeText('Test de niveau gratuit en ligne * Cours interactifs A1 a B2 * Paiement securise Mobile Money'),
      {
        x: MARGIN + 16,
        y: ctaY + 56,
        size: 8,
        font: fontRegular,
        color: colorGoldLight,
      }
    );

    page.drawText(
      sanitizeText('Direction Pedagogique : Coach David Liandja * WhatsApp : +27 74 293 2071 * Kinshasa, RDC'),
      {
        x: MARGIN + 16,
        y: ctaY + 36,
        size: 8,
        font: fontBold,
        color: colorWhite,
      }
    );

    page.drawText(
      sanitizeText('Email : liandjadavid@gmail.com * Document protege par le droit d auteur - Edition 2026'),
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
     NUMÉROTATION & PIEDS DE PAGE SUR TOUTES LES PAGES
     ========================================================================= */
  const totalPagesCount = pagesList.length;
  console.log(`[INFO] Total generated pages for the Complete Master Syllabus: ${totalPagesCount}`);

  pagesList.forEach(({ page }, index) => {
    const pageNum = index + 1;

    // Skip footer on Cover page
    if (pageNum === 1) return;

    // Draw footer strip
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

  const outputPath = path.join(outputDir, 'PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`[SUCCESS] Master Syllabus PDF generated successfully!`);
  console.log(`[OUTPUT PATH] ${outputPath}`);
  console.log(`[TOTAL PAGES] ${totalPagesCount} pages`);
  console.log(`[FILE SIZE] ${(pdfBytes.length / 1024).toFixed(2)} KB`);
}

buildMasterSyllabusPdf().catch((err) => {
  console.error('[ERROR] Failed to generate Master Syllabus PDF:', err);
  process.exit(1);
});

