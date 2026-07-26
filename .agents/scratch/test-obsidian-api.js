// We need to bypass self-signed certificate checks because the Local REST API plugin uses a self-signed HTTPS cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const token = "888d9823eaad03927f2640c2db64a7b9ee223319f637dfe2f3892cc2d0a477ca";
const host = "127.0.0.1";
const port = "27124";

async function testHeader(authHeader, label) {
  const url = `https://${host}:${port}/vault/`;
  console.log(`\nTesting: ${label}...`);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": authHeader
      }
    });
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Response (first 100 chars):`, text.substring(0, 100));
  } catch (error) {
    console.error(`Error:`, error.message);
  }
}

async function runTests() {
  // Test 1: Bearer token (Standard)
  await testHeader(`Bearer ${token}`, "Standard 'Bearer <token>'");
  
  // Test 2: Token directly
  await testHeader(token, "Direct token without Bearer prefix");

  // Test 3: Standard Bearer with "Bearer" double prefix (in case user pasted "Bearer Bearer ...")
  await testHeader(`Bearer Bearer ${token}`, "Double Bearer prefix");
  
  // Test 4: Bearer directly (in case the token itself is the whole string)
  await testHeader(`Bearer 888d9823eaad03927f2640c2db64a7b9ee223319f637dfe2f3892cc2d0a477ca`, "Bearer with token");
  
  // Test 5: What if the API Key is literally the exact string the user provided?
  await testHeader(`888d9823eaad03927f2640c2db64a7b9ee223319f637dfe2f3892cc2d0a477ca`, "Plain token");
}

runTests();
