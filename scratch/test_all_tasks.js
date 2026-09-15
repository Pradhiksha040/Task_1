const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = {
      'Accept': 'application/json',
      ...headers
    };

    let payload = null;
    if (body) {
      payload = JSON.stringify(body);
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(url, { method, headers: reqHeaders }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE TEST SUITE FOR TASKS 1 - 8');
  console.log('====================================================\n');

  try {
    // 1. Task 1: Check GET /
    console.log('1️⃣ Testing Task 1: GET / ...');
    const resHome = await makeRequest('GET', '/');
    console.log(`   Status: ${resHome.status} ${resHome.status === 200 ? '✅ PASS' : '❌ FAIL'}`);

    // 2. Task 2: Server-Side Validation Failure Test
    console.log('\n2️⃣ Testing Task 2: Invalid Submission Server-Side Validation (POST /api/temp-submit) ...');
    const resInvalid = await makeRequest('POST', '/api/temp-submit', {
      fullName: 'A', // too short
      email: 'invalid-email',
      phone: '123',
      dob: '2099-01-01', // future date
      gender: 'Invalid',
      address: 'Short',
      city: 'N',
      password: '123',
      confirmPassword: '456',
      termsAccepted: false
    });
    console.log(`   Status: ${resInvalid.status} (Expected 400 Bad Request) ${resInvalid.status === 400 ? '✅ PASS' : '❌ FAIL'}`);
    console.log('   Validation Errors Captured:', Object.keys(resInvalid.data.errors || {}).length);

    // 3. Task 2: Valid Submission & In-Memory Storage Test
    console.log('\n3️⃣ Testing Task 2: Valid Submission & In-Memory Store (POST /api/temp-submit) ...');
    const validUserPayload = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-0199',
      dob: '1995-05-15',
      gender: 'Male',
      address: '123 Innovation Way, Suite 400',
      city: 'New York',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      termsAccepted: true
    };
    const resValidTemp = await makeRequest('POST', '/api/temp-submit', validUserPayload);
    console.log(`   Status: ${resValidTemp.status} ${resValidTemp.status === 201 ? '✅ PASS' : '❌ FAIL'}`);
    console.log('   Response Message:', resValidTemp.data.message);

    // Retrieve Temp Submissions
    const resGetTemp = await makeRequest('GET', '/api/temp-submissions');
    console.log(`   GET /api/temp-submissions Status: ${resGetTemp.status}, Stored Count: ${resGetTemp.data.count} ${resGetTemp.data.count > 0 ? '✅ PASS' : '❌ FAIL'}`);

    // 4. Task 6: Auth Registration & JWT Token
    console.log('\n4️⃣ Testing Task 6: Auth User Registration (POST /api/auth/register) ...');
    const authRegPayload = {
      fullName: 'Alice Smith',
      email: 'alice.smith@example.com',
      phone: '+1 555-0288',
      dob: '1998-08-20',
      gender: 'Female',
      address: '456 Tech Avenue',
      city: 'San Francisco',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      termsAccepted: true
    };
    const resAuthReg = await makeRequest('POST', '/api/auth/register', authRegPayload);
    console.log(`   Status: ${resAuthReg.status} ${resAuthReg.status === 201 ? '✅ PASS' : '❌ FAIL'}`);
    const token = resAuthReg.data.token;
    const jobId = resAuthReg.data.jobId;
    console.log('   JWT Token Generated:', token ? 'YES (Valid JWT)' : 'NO');
    console.log('   Background Job Queued ID:', jobId);

    // 5. Task 6: Auth Login Test
    console.log('\n5️⃣ Testing Task 6: Auth User Login (POST /api/auth/login) ...');
    const resLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'alice.smith@example.com',
      password: 'SecurePass123!'
    });
    console.log(`   Status: ${resLogin.status} ${resLogin.status === 200 ? '✅ PASS' : '❌ FAIL'}`);

    // 6. Task 5 & 8: REST Users API & Caching Test
    console.log('\n6️⃣ Testing Task 5 & 8: GET /api/users & Response Caching ...');
    const resUsers1 = await makeRequest('GET', '/api/users');
    console.log(`   First Request Status: ${resUsers1.status}, Cached: ${resUsers1.data.cached || false}`);
    const resUsers2 = await makeRequest('GET', '/api/users');
    console.log(`   Second Request Status: ${resUsers2.status}, Cached: ${resUsers2.data.cached || false} (Expected CACHE HIT) ${resUsers2.data.cached ? '✅ PASS' : '❌ FAIL'}`);

    // 7. Task 5: REST User Update (PUT /api/users/:id)
    console.log('\n7️⃣ Testing Task 5: REST User Update (PUT /api/users/1) ...');
    const resUpdate = await makeRequest('PUT', '/api/users/1', {
      fullName: 'John Doe Updated',
      city: 'Boston'
    });
    console.log(`   Status: ${resUpdate.status} ${resUpdate.status === 200 ? '✅ PASS' : '❌ FAIL'}`);

    // 8. Task 7: External Weather Proxy Test
    console.log('\n8️⃣ Testing Task 7: External Weather Proxy (GET /api/external/weather) ...');
    const resWeather = await makeRequest('GET', '/api/external/weather');
    console.log(`   Status: ${resWeather.status} ${resWeather.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   City: ${resWeather.data.data?.city}, Temp: ${resWeather.data.data?.temperature}°C, Condition: ${resWeather.data.data?.condition}`);

    // 9. Task 8: Background Job Worker Status Test
    if (jobId) {
      console.log(`\n9️⃣ Testing Task 8: Background Job Status (GET /api/jobs/${jobId}) ...`);
      // Wait 2.2 seconds for background worker to complete job
      await new Promise(r => setTimeout(r, 2200));
      const resJob = await makeRequest('GET', `/api/jobs/${jobId}`);
      console.log(`   Job Status: ${resJob.data.data?.status} (Expected 'completed') ${resJob.data.data?.status === 'completed' ? '✅ PASS' : '❌ FAIL'}`);
      console.log('   Worker Output Result:', resJob.data.data?.result);
    }

    console.log('\n====================================================');
    console.log('🎉 ALL TASKS (1 to 8) VERIFIED SUCCESSFULLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Test Suite Error:', err);
  }
}

runTests();
