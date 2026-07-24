'use server';

import { RemixRequestSchema, RemixResponse } from '../validations/trailer-remixer.schema';
import { ActionResult } from './crowd-heatmap.actions';

export async function remixTrailerAction(
  rawInput: unknown
): Promise<ActionResult<RemixResponse>> {
  try {
    const input = RemixRequestSchema.parse(rawInput);

    // Dynamic AI era presets localized to Hebrew
    const eraPresets: Record<string, Omit<RemixResponse, 'movieId' | 'era'>> = {
      '80s_synthwave': {
        tagline: 'חלומות ניאון וסיוטים אנלוגיים',
        remixedSynopsis: 'במטרופולין מחושמל של שנת 1984, הסינתיסייזרים פועמים כשרשתות ניאון זוהרות מריצות אותך נגד הזמן בזכוכית קונטרסטית.',
        colorFilterCss: 'hue-rotate(270deg) contrast(150%) saturate(200%)',
        synthFrequencyHz: 440,
      },
      '50s_film_noir': {
        tagline: 'צללים, עשן ואמיתות שטרם נאמרו',
        remixedSynopsis: 'סמטה חשוכה גשומה בשחור-לבן עמוק, שבה תאורה עמומה וצללים דרמטיים מסתירים את התעלומה הקולנועית הגדולה.',
        colorFilterCss: 'grayscale(100%) contrast(200%) brightness(80%)',
        synthFrequencyHz: 180,
      },
      'cyberpunk_2099': {
        tagline: 'חיבור ניוראלי הופעל // סקטור 7',
        remixedSynopsis: 'חלקיקים הולוגרפיים מציפים את הרשת הקוואנטית כאשר פרוטוקול קולנועי סייברנטי תופס שליטה מלאה בחושים.',
        colorFilterCss: 'hue-rotate(180deg) saturate(250%) brightness(110%)',
        synthFrequencyHz: 808,
      },
      '70s_technicolor': {
        tagline: 'גרעיניות חמה ומחזה מרהיב',
        remixedSynopsis: 'צבעים אנלוגיים עשירים וטקסטורת פילם קלאסית שמחזירות אותך לתור הזהב המרהיב של הקולנוע.',
        colorFilterCss: 'sepia(40%) saturate(180%) contrast(110%)',
        synthFrequencyHz: 320,
      },
    };

    const selectedPreset = eraPresets[input.era] || eraPresets['80s_synthwave'];

    return {
      success: true,
      data: {
        movieId: input.movieId,
        era: input.era,
        ...selectedPreset,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'נכשל במקסוס הטריילר לתקופה המבוקשת',
    };
  }
}
