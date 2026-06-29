/**
 * TextDirectionUtil — Shared internationalization utility for RTL/LTR detection.
 *
 * Provides automatic language detection based on Unicode character analysis.
 * Used across assessment engine, quiz test, and results review components
 * to dynamically switch text direction and choice labels.
 */

// Arabic Unicode range: \u0600-\u06FF (Arabic), \u0750-\u077F (Arabic Supplement),
// \uFB50-\uFDFF (Arabic Presentation Forms-A), \uFE70-\uFEFF (Arabic Presentation Forms-B)
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
const ARABIC_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/g;
const LATIN_CHAR_REGEX = /[A-Za-z]/g;

export class TextDirectionUtil {

  /**
   * Checks if a given text string is predominantly Arabic.
   * Returns true if Arabic characters make up more than 40% of all
   * alphabetic characters (Arabic + Latin).
   */
  static isArabicText(text: string): boolean {
    if (!text || text.trim().length === 0) return true; // default to Arabic (RTL)

    const arabicMatches = text.match(ARABIC_CHAR_REGEX);
    const latinMatches = text.match(LATIN_CHAR_REGEX);

    const arabicCount = arabicMatches ? arabicMatches.length : 0;
    const latinCount = latinMatches ? latinMatches.length : 0;
    const totalAlpha = arabicCount + latinCount;

    if (totalAlpha === 0) return true; // no alphabetic chars, default RTL

    return (arabicCount / totalAlpha) > 0.4;
  }

  /**
   * Detects the primary language of the given text.
   * Returns 'ar' for Arabic-dominant text, 'en' for English/Latin-dominant.
   */
  static detectLanguage(text: string): 'ar' | 'en' {
    return TextDirectionUtil.isArabicText(text) ? 'ar' : 'en';
  }

  /**
   * Returns the appropriate CSS text direction for the given text.
   * 'rtl' for Arabic, 'ltr' for English/Latin.
   */
  static getTextDirection(text: string): 'rtl' | 'ltr' {
    return TextDirectionUtil.isArabicText(text) ? 'rtl' : 'ltr';
  }

  /**
   * Returns the appropriate text-align value for the given text.
   * 'right' for Arabic (RTL), 'left' for English (LTR).
   */
  static getTextAlign(text: string): 'right' | 'left' {
    return TextDirectionUtil.isArabicText(text) ? 'right' : 'left';
  }

  /**
   * Returns the appropriate choice letters based on text direction.
   * Arabic: ['أ', 'ب', 'ج', 'د', 'هـ', 'و']
   * English: ['A', 'B', 'C', 'D', 'E', 'F']
   */
  static getChoiceLetters(direction: 'rtl' | 'ltr'): string[] {
    if (direction === 'ltr') {
      return ['A', 'B', 'C', 'D', 'E', 'F'];
    }
    return ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];
  }

  /**
   * Returns a single choice letter at the given index, based on the question text.
   * Convenience method for templates.
   */
  static getChoiceLetter(questionText: string, index: number): string {
    const dir = TextDirectionUtil.getTextDirection(questionText);
    const letters = TextDirectionUtil.getChoiceLetters(dir);
    return letters[index] || String(index + 1);
  }
}
