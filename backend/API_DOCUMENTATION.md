# Rently Backend API Documentation

## Twilio OTP Authentication Endpoints

### 1. Signup - Initiate (Send OTP)
**Endpoint:** `POST /api/auth/signup-initiate`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "role": "tenant"
}
```

**Response (Success):**
```json
{
  "message": "OTP sent to your phone",
  "email": "john@example.com",
  "phone": "+1234567890",
  "otpSent": true
}
```

---

### 2. Signup - Verify OTP
**Endpoint:** `POST /api/auth/signup-verify-otp`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "name": "John Doe",
  "password": "password123",
  "phone": "+1234567890",
  "role": "tenant"
}
```

**Response (Success):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Forgot Password - Initiate (Send OTP)
**Endpoint:** `POST /api/auth/forgot-password-initiate`

**Request Body:**
```json
{
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**Response (Success):**
```json
{
  "message": "OTP sent to your registered phone number",
  "email": "john@example.com",
  "otpSent": true
}
```

---

### 4. Forgot Password - Verify OTP
**Endpoint:** `POST /api/auth/forgot-password-verify-otp`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "message": "OTP verified. You can now reset your password.",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com"
}
```

---

### 5. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "newPassword": "newpassword123",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success):**
```json
{
  "message": "Password reset successfully"
}
```

---

### 6. Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Features

✅ **Twilio SMS OTP Integration**
- Automatic 6-digit OTP generation
- SMS delivery via Twilio
- OTP validity: 10 minutes (configurable)
- Max attempts: 3 per OTP

✅ **Signup with OTP Verification**
- Two-step process: initiate → verify
- User verification on successful signup

✅ **Forgot Password with OTP**
- Phone number verification
- Temporary reset token generation
- Password update with token validation

✅ **Secure Authentication**
- JWT token-based authentication
- Bcrypt password hashing
- 7-day token expiration

✅ **Error Handling**
- Comprehensive error messages
- Attempt tracking
- Auto-cleanup of expired OTPs

---

## Environment Variables Required

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
```

---

## Flow Diagrams

### Signup Flow
```
User Registration
    ↓
/signup-initiate (Enter details)
    ↓
OTP Sent via SMS
    ↓
/signup-verify-otp (Enter OTP)
    ↓
User Created + JWT Token Generated
```

### Forgot Password Flow
```
Forgot Password Request
    ↓
/forgot-password-initiate (Email + Phone)
    ↓
OTP Sent via SMS
    ↓
/forgot-password-verify-otp (Enter OTP)
    ↓
Reset Token Generated
    ↓
/reset-password (New Password + Reset Token)
    ↓
Password Updated
```

---

## Testing with Curl

### Test Signup Initiate
```bash
curl -X POST http://localhost:3000/api/auth/signup-initiate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "password": "test123",
    "role": "tenant"
  }'
```

### Test Forgot Password Initiate
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password-initiate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+1234567890"
  }'
```

---

## Notes

- All phone numbers should be in international format (e.g., +1234567890)
- OTPs are automatically deleted after 10 minutes
- OTP records include attempt tracking to prevent brute force
- Reset tokens expire in 15 minutes
- JWT tokens expire in 7 days