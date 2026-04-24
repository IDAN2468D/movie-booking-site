import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { movieId, message } = await req.json();
    console.log(`AI Chat message for movie ${movieId}: ${message}`);

    // In a production scenario, we would:
    // 1. Get/Create a notebook for this movieId
    // 2. Call notebook_query(notebook_id, message)
    
    // For the demo, we'll return a simulated intelligent response 
    // that mimics what NotebookLM would do based on movie metadata.
    
    return NextResponse.json({ 
      success: true, 
      response: `זו שאלה מצוינת על הסרט! בהתבסס על הנתונים שיש לי ב-Notebook, נראה שהסרט הזה מתמקד בשימוש בטכניקות צילום חדשניות כדי להעביר את המסר שלו. האם תרצה שאפרט על הצוות או על מאחורי הקלעים?`
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}
