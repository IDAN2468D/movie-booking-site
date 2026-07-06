import { NextRequest, NextResponse } from 'next/server';

const CINEMATIC_POSTERS = [
  {
    keywords: ['space', 'חלל', 'כוכב', 'star', 'interstellar'],
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    title: 'Interstellar Odyssey'
  },
  {
    keywords: ['cyber', 'neon', 'ניאון', 'סייברפאנק', 'cyberpunk', 'עתידני'],
    url: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?q=80&w=600&auto=format&fit=crop',
    title: 'Neo-Tokyo 2099'
  },
  {
    keywords: ['fantasy', 'פנטזיה', 'קסם', 'magic', 'wizard', 'דרקון'],
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    title: 'Chronicles of Eldoria'
  },
  {
    keywords: ['noir', 'נואר', 'בלש', 'detective', 'שחור לבן', 'black and white'],
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop&grayscale',
    title: 'The Silent Detective'
  },
  {
    keywords: ['superhero', 'גיבור', 'marvel', 'dc', 'קומיקס', 'hero'],
    url: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?q=80&w=600&auto=format&fit=crop',
    title: 'Vanguard: Rise of Justice'
  }
];

const DEFAULT_POSTER = {
  url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
  title: 'Cinematic Vision'
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, history = [] } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'No prompt provided' }, { status: 400 });
    }

    // Simulate AI generation time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Determine the base poster image based on keywords in prompt
    const promptLower = prompt.toLowerCase();
    let selectedPoster = CINEMATIC_POSTERS.find(p => 
      p.keywords.some(keyword => promptLower.includes(keyword))
    );

    if (!selectedPoster) {
      // Also check history for keywords
      for (const histMsg of history) {
        if (histMsg.role === 'user') {
          const histLower = histMsg.content.toLowerCase();
          selectedPoster = CINEMATIC_POSTERS.find(p => 
            p.keywords.some(keyword => histLower.includes(keyword))
          );
          if (selectedPoster) break;
        }
      }
    }

    const basePoster = selectedPoster || DEFAULT_POSTER;

    // Conversational editing simulation using CSS filter overrides
    let cssFilter = '';
    let description = `נוצר פוסטר קולנועי מרהיב בסגנון: "${prompt}".`;

    // Look at user requests in history to apply edits dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editPrompts = [...history.filter((m: any) => m.role === 'user').map((m: any) => m.content.toLowerCase()), promptLower];
    
    for (const edit of editPrompts) {
      if (edit.includes('סגול') || edit.includes('purple') || edit.includes('fuchsia')) {
        cssFilter = 'hue-rotate(270deg) saturate(180%) contrast(110%)';
        description += ' הוחל גוון סגול עמוק קולנועי.';
      } else if (edit.includes('כחול') || edit.includes('blue') || edit.includes('cyan')) {
        cssFilter = 'hue-rotate(180deg) saturate(150%) brightness(95%)';
        description += ' הוחל גוון כחול ניאון קר.';
      } else if (edit.includes('אדום') || edit.includes('red') || edit.includes('crimson')) {
        cssFilter = 'hue-rotate(340deg) saturate(200%) contrast(120%)';
        description += ' הוחל פילטר אדום דרמטי עמוק.';
      } else if (edit.includes('ירוק') || edit.includes('green')) {
        cssFilter = 'hue-rotate(90deg) saturate(140%)';
        description += ' הוחל פילטר ירוק מטריקס.';
      } else if (edit.includes('זהב') || edit.includes('gold') || edit.includes('צהוב') || edit.includes('yellow')) {
        cssFilter = 'sepia(80%) saturate(180%) hue-rotate(5deg) contrast(105%)';
        description += ' הוחל פילטר ספיה וזהב חם.';
      } else if (edit.includes('שחור לבן') || edit.includes('vintage') || edit.includes('גרייסקייל') || edit.includes('grayscale')) {
        cssFilter = 'grayscale(100%) contrast(120%) brightness(90%)';
        description += ' הוחל עיבוד שחור-לבן דרמטי.';
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: basePoster.url,
      title: basePoster.title,
      cssFilter,
      description
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate poster';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
