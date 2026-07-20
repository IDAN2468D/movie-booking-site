import os
import sys

# Ensure the SDK is installed
try:
    from google import genai
except ImportError:
    print("Error: The 'google-genai' SDK is not installed.")
    print("Please run: pip install google-genai")
    sys.exit(1)

# Check for API key
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY environment variable is not set.")
    print("Please set it before running this script.")
    sys.exit(1)

print("Initializing Gemini Client...")
client = genai.Client()

print("Triggering Antigravity Managed Agent...")
print("Task: 'Calculate 100 * 25 using Python and print the result'")

try:
    interaction = client.interactions.create(
        agent="antigravity-preview-05-2026",
        input="Write a python script that calculates 100 * 25, run it, and tell me the output. Keep it very short.",
        environment="remote"
    )
    
    print("\n✅ Success! The agent responded:\n")
    print("-" * 40)
    print(interaction.output_text)
    print("-" * 40)
    
except Exception as e:
    print("\n❌ Failed to run the managed agent.")
    print(f"Error details: {str(e)}")
