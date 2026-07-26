async function runTest() {
  const url = "http://localhost:3000/api/ai/chat";
  const payload = {
    message: "שלום, אני רוצה המלצה לסרט פעולה טוב שמוקרן עכשיו",
    history: []
  };

  console.log("Sending request to:", url);
  try {
    const start = Date.now();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const duration = Date.now() - start;
    console.log(`Status: ${res.status} (${duration}ms)`);
    const data = await res.json();
    console.log("Response data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

// Wait 2 seconds before running to let dev server bind
setTimeout(runTest, 2000);
