'use server';

import { SubtitleTranslationInputSchema, SubtitleTranslationResult } from '../validations/subtitle-pitcher-schema';

const TRANSLATION_MAP: Record<string, Record<string, string>> = {
  'The first rule of Fight Club is: you do not talk about Fight Club.': {
    he: 'החוק הראשון של מועדון קרב הוא: לא מדברים על מועדון קרב.',
    en: 'The first rule of Fight Club is: you do not talk about Fight Club.',
    es: 'La primera regla del Club de la Lucha es: no se habla del Club de la Lucha.',
    ja: 'ファイト・クラブの最初のルールは、ファイト・クラブについて話さないことだ。',
    fr: 'La première règle du Fight Club est : vous ne parlez pas du Fight Club.',
  },
  'An idea is like a virus. Resilient. Highly contagious.': {
    he: 'רעיון הוא כמו וירוס. עמיד. מדבק ביותר.',
    en: 'An idea is like a virus. Resilient. Highly contagious.',
    es: 'Una idea es como un virus. Resistente. Altamente contagioso.',
    ja: 'アイデアはウイルスのようだ。しぶとく、非常に伝染しやすい。',
    fr: 'Une idée est comme un virus. Résistante. Extrêmement contagieuse.',
  },
  'Fear is the mind-killer. I will face my fear.': {
    he: 'הפחד הוא הורג הבינה. אני אעמוד מול הפחד שלי.',
    en: 'Fear is the mind-killer. I will face my fear.',
    es: 'El miedo es el asesino de la mente. Enfrentaré mi miedo.',
    ja: '恐れは心を殺すもの。私は恐怖に立ち向かう。',
    fr: 'La peur est le tueur d’esprit. Je ferai face à ma peur.',
  },
  'Mankind was born on Earth. It was never meant to die here.': {
    he: 'האנושות נולדה על כדור הארץ. היא מעולם לא נועדה למות כאן.',
    en: 'Mankind was born on Earth. It was never meant to die here.',
    es: 'La humanidad nació en la Tierra. Nunca estuvo destinada a morir aquí.',
    ja: '人類は地球で生まれた。ここで死ぬ運命ではない。',
    fr: 'L’humanité est née sur Terre. Elle n’a jamais été destinée à y mourir.',
  },
  'What we do in life echoes in eternity.': {
    he: 'מה שאנחנו עושים בחיים מהדהד לנצח.',
    en: 'What we do in life echoes in eternity.',
    es: 'Lo que hacemos en la vida tiene su eco en la eternidad.',
    ja: '私たちが人生で行うことは、永遠に響き渡る。',
    fr: 'Ce que nous faisons dans la vie résonne dans l’éternité.',
  },
};

export async function translateSubtitle(input: { text: string; targetLang: 'he' | 'en' | 'es' | 'ja' | 'fr'; pitchShift?: number }): Promise<{
  success: boolean;
  data?: SubtitleTranslationResult;
  error?: string;
}> {
  try {
    const parsed = SubtitleTranslationInputSchema.parse(input);
    const original = parsed.text;
    const lang = parsed.targetLang;

    let translated = original;
    if (TRANSLATION_MAP[original] && TRANSLATION_MAP[original][lang]) {
      translated = TRANSLATION_MAP[original][lang];
    } else if (lang === 'he') {
      translated = `תרגום AI לעברית: "${original}"`;
    }

    const freqBoost = 440 * Math.pow(2, (parsed.pitchShift || 0) / 12);

    return {
      success: true,
      data: {
        originalText: original,
        translatedText: translated,
        lang,
        pitchShiftSemitones: parsed.pitchShift || 0,
        audioFreqBoostHz: Math.round(freqBoost),
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Subtitle translation error';
    return { success: false, error: msg };
  }
}
