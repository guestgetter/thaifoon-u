const { default: fetch } = require('node-fetch');

async function testAuth() {
  try {
    console.log('Testing authentication...');
    
    // First get CSRF token
    const csrfResponse = await fetch('http://localhost:8000/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    console.log('CSRF Token:', csrfData.csrfToken);
    
    // Try to authenticate
    const authResponse = await fetch('http://localhost:8000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'admin@thaifoon.com',
        password: 'admin123',
        csrfToken: csrfData.csrfToken,
        callbackUrl: 'http://localhost:8000/dashboard',
        redirect: 'false'
      })
    });
    
    console.log('Auth response status:', authResponse.status);
    console.log('Auth response headers:', Object.fromEntries(authResponse.headers));
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('Auth successful:', authData);
    } else {
      const errorText = await authResponse.text();
      console.log('Auth failed:', errorText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();