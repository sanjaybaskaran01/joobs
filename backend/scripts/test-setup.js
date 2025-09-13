#!/usr/bin/env node

/**
 * Test script to verify the server setup
 * Run with: node scripts/test-setup.js
 */

const https = require('https');
const http = require('http');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

console.log('🧪 Testing Firebase Gmail Server Setup...\n');

// Test health endpoint
function testHealthEndpoint() {
  return new Promise((resolve, reject) => {
    const url = new URL('/health', SERVER_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('response', response);
          if (res.statusCode === 200 && response.status === 'OK') {
            console.log('✅ Health endpoint working');
            resolve(response);
          } else {
            console.log('❌ Health endpoint failed:', response);
            reject(new Error('Health check failed'));
          }
        } catch (error) {
          console.log('❌ Invalid JSON response from health endpoint');
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Cannot connect to server:', error.message);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Health endpoint timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Test auth endpoint
function testAuthEndpoint() {
  return new Promise((resolve, reject) => {
    const url = new URL('/auth/google', SERVER_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('response', response);
          if (res.statusCode === 200 && response.authUrl) {
            console.log('✅ Auth endpoint working');
            resolve(response);
          } else {
            console.log('❌ Auth endpoint failed:', response);
            reject(new Error('Auth endpoint failed'));
          }
        } catch (error) {
          console.log('❌ Invalid JSON response from auth endpoint');
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Cannot connect to auth endpoint:', error.message);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Auth endpoint timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Run tests
async function runTests() {
  try {
    await testHealthEndpoint();
    await testAuthEndpoint();
    
    console.log('\n🎉 All tests passed! Server is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. Set up your .env file with Firebase and Google OAuth credentials');
    console.log('2. Start the server with: npm run dev');
    console.log('3. Test the OAuth flow by visiting: http://localhost:3000/auth/google');
    
  } catch (error) {
    console.log('\n❌ Tests failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the server is running: npm run dev');
    console.log('2. Check your .env file configuration');
    console.log('3. Verify Firebase and Google OAuth setup');
    process.exit(1);
  }
}

runTests();

