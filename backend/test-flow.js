const TEST_USER = {
  name: 'Test User',
  email: 'test' + Date.now() + '@example.com',
  phone: '+917986621813',
  password: 'password123',
  role: 'tenant',
  otp: '123456'
};

const BASE_URL = 'http://localhost:3001/api';

async function runTest() {
  console.log('--- STARTING FULL FLOW TEST ---');

  try {
    // 1. Signup Initiate
    console.log('\n1. Testing Signup Initiate...');
    const signupInit = await fetch(`${BASE_URL}/auth/signup-initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: TEST_USER.name,
        email: TEST_USER.email,
        phone: TEST_USER.phone,
        password: TEST_USER.password,
        role: TEST_USER.role
      })
    });
    const initData = await signupInit.json();
    console.log('Response:', initData);
    if (!signupInit.ok) throw new Error('Signup Initiate Failed');

    // 2. Signup Verify OTP
    console.log('\n2. Testing Signup Verify OTP...');
    const signupVerify = await fetch(`${BASE_URL}/auth/signup-verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: TEST_USER.name,
        email: TEST_USER.email,
        phone: TEST_USER.phone,
        password: TEST_USER.password,
        role: TEST_USER.role,
        otp: TEST_USER.otp
      })
    });
    const verifyData = await signupVerify.json();
    console.log('Response:', verifyData);
    if (!signupVerify.ok) throw new Error('Signup Verify Failed');
    const token = verifyData.token;

    // 3. Login
    console.log('\n3. Testing Login...');
    const login = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: TEST_USER.phone,
        password: TEST_USER.password
      })
    });
    const loginData = await login.json();
    console.log('Response:', loginData);
    if (!login.ok) throw new Error('Login Failed');

    // 4. Forgot Password Initiate
    console.log('\n4. Testing Forgot Password Initiate...');
    const forgotInit = await fetch(`${BASE_URL}/auth/forgot-password-initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: TEST_USER.phone })
    });
    const forgotInitData = await forgotInit.json();
    console.log('Response:', forgotInitData);
    if (!forgotInit.ok) throw new Error('Forgot Password Initiate Failed');

    // 5. Forgot Password Verify OTP
    console.log('\n5. Testing Forgot Password Verify OTP...');
    const forgotVerify = await fetch(`${BASE_URL}/auth/forgot-password-verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: TEST_USER.phone,
        otp: TEST_USER.otp
      })
    });
    const forgotVerifyData = await forgotVerify.json();
    console.log('Response:', forgotVerifyData);
    if (!forgotVerify.ok) throw new Error('Forgot Password Verify Failed');
    const resetToken = forgotVerifyData.resetToken;

    // 6. Reset Password
    console.log('\n6. Testing Reset Password...');
    const reset = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resetToken: resetToken,
        newPassword: 'newpassword123'
      })
    });
    const resetData = await reset.json();
    console.log('Response:', resetData);
    if (!reset.ok) throw new Error('Reset Password Failed');

    console.log('\n--- ALL TESTS PASSED SUCCESSFULLY! ✅ ---');
  } catch (error) {
    console.error('\n--- TEST FAILED! ❌ ---');
    console.error(error.message);
  }
}

runTest();
