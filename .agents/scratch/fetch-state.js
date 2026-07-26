async function runTest() {
  const url = "http://localhost:3000/api/ai/state-control";
  const payload = {
    message: "תראה לי סרטי דרמה משנת 2024"
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

runTest();
