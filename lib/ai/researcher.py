import sys
import os
import json
from google import genai

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Movie title not provided"}))
        sys.exit(1)
        
    movie_title = sys.argv[1]
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        print(json.dumps({"error": "GEMINI_API_KEY not found"}))
        sys.exit(1)
        
    client = genai.Client()
    
    prompt = f"""
    You are an expert cinematic researcher. Search the web for deep lore, trivia, and cultural impact about the movie '{movie_title}'.
    IMPORTANT: You MUST write your entire response in Hebrew (עברית).
    Format the response strictly as a JSON object with the following schema:
    {{
        "trivia": ["string", "string", "string"],
        "culturalImpact": "string",
        "behindTheScenes": "string"
    }}
    Do not wrap the output in markdown code blocks. Output raw JSON only.
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config={
                "tools": [{"google_search": {}}],
            }
        )
        
        # Clean the output in case the agent wrapped it in markdown
        output = response.text.strip()
        if output.startswith("```json"):
            output = output[7:]
        if output.startswith("```"):
            output = output[3:]
        if output.endswith("```"):
            output = output[:-3]
            
        # Validate that it's JSON
        parsed = json.loads(output.strip())
        print(json.dumps(parsed))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
