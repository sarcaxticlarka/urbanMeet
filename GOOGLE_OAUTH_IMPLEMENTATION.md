# Google OAuth Implementation Guide

## Overview
Google OAuth authentication has been successfully implemented in your UrbanMeet application. Users can now sign in and sign up using their Google accounts.

## What Was Changed

### Server Side (Backend)

1. **Dependencies Added**
   - `passport` - Authentication middleware
   - `passport-google-oauth20` - Google OAuth 2.0 strategy
   - `express-session` - Session management
   - Type definitions for all packages

2. **Database Schema Updates**
   - Added `googleId` field to the `User` model in Prisma schema
   - Created migration: `20251202072312_add_google_oauth`
   - The `password` field is now optional to support OAuth users

3. **New Files Created**
   - `/server/src/config/passport.ts` - Passport configuration with Google OAuth strategy

4. **Modified Files**
   - `/server/src/routes/auth.ts` - Added Google OAuth endpoints
   - `/server/src/index.ts` - Added passport initialization middleware
   - `/server/.env` - Added Google OAuth credentials

5. **New API Endpoints**
   - `GET /api/auth/google` - Initiates Google OAuth flow
   - `GET /api/auth/google/callback` - Handles OAuth callback and redirects with JWT token

### Client Side (Frontend)

1. **New Files Created**
   - `/client/app/auth/callback/page.tsx` - OAuth callback handler page

2. **Modified Files**
   - `/client/app/auth/login/page.tsx` - Removed Facebook & Apple, added Google OAuth button
   - `/client/app/auth/register/page.tsx` - Removed Facebook & Apple, added Google OAuth button
   - `/client/.env.local` - Added Google Client ID

## Environment Variables

### Server (.env)
```bash
GOOGLE_CLIENT_ID="769161405364-s1do8rtoqkg22tuonq2dtpp2oosd0uo1.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET_HERE"  # ⚠️ REPLACE THIS!
SERVER_URL="http://localhost:4000"  # Change for production
CLIENT_URL="http://localhost:3000"  # Change for production
```

### Client (.env.local)
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID="769161405364-s1do8rtoqkg22tuonq2dtpp2oosd0uo1.apps.googleusercontent.com"
```

## ⚠️ IMPORTANT: Missing Client Secret

You mentioned "this is client secret" but didn't provide the actual secret value. Please update the `GOOGLE_CLIENT_SECRET` in `/server/.env` with your actual Google OAuth client secret.

## Google OAuth Configuration

You need to configure your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"
4. Find your OAuth 2.0 Client ID
5. Add the following to **Authorized redirect URIs**:
   - `http://localhost:4000/api/auth/google/callback` (for development)
   - `https://urbanmeet.onrender.com/api/auth/google/callback` (for production)
   - Add any other deployment URLs you use

## How It Works

1. User clicks "Continue with Google" button on login/register page
2. User is redirected to `{API_URL}/api/auth/google`
3. Google OAuth consent screen appears
4. After user grants permission, Google redirects to `{API_URL}/api/auth/google/callback`
5. Server creates/updates user in database and generates JWT token
6. Server redirects to `{CLIENT_URL}/auth/callback?token={JWT_TOKEN}`
7. Client callback page extracts token, stores it, and redirects to profile page

## User Creation Flow

When a user signs in with Google:
- If user with that `googleId` exists → Log them in
- If user with that email exists but no `googleId` → Link Google account to existing user
- If user doesn't exist → Create new user with Google profile data

## Testing

### Development
1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Navigate to `http://localhost:3000/auth/login`
4. Click "Continue with Google"

### Production
Update these environment variables for production:
- `SERVER_URL` in server `.env`
- `CLIENT_URL` in server `.env`
- Update redirect URIs in Google Cloud Console

## Security Notes

1. **Never commit** the `GOOGLE_CLIENT_SECRET` to version control
2. The JWT secret should be strong and secure
3. Session data is minimal - we're using stateless JWT authentication
4. User passwords are optional (null) for OAuth-only users

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Check that the callback URL in Google Cloud Console matches exactly
- Include the protocol (http/https), domain, and full path

### Error: "Invalid client secret"
- Verify the client secret in your `.env` file
- Regenerate the secret in Google Cloud Console if needed

### Token not being set
- Check browser console for errors
- Verify the callback page is loading correctly
- Check that localStorage is accessible

## Files Modified Summary

**Server:**
- ✅ `server/prisma/schema.prisma` - Added googleId field
- ✅ `server/src/config/passport.ts` - NEW FILE
- ✅ `server/src/routes/auth.ts` - Added OAuth routes
- ✅ `server/src/index.ts` - Added passport middleware
- ✅ `server/.env` - Added Google OAuth config
- ✅ `server/package.json` - Added dependencies

**Client:**
- ✅ `client/app/auth/callback/page.tsx` - NEW FILE
- ✅ `client/app/auth/login/page.tsx` - Updated UI
- ✅ `client/app/auth/register/page.tsx` - Updated UI
- ✅ `client/.env.local` - Added Google Client ID

## Next Steps

1. **Add your Google Client Secret** to `server/.env`
2. **Update redirect URIs** in Google Cloud Console
3. Test the OAuth flow in development
4. Update production environment variables
5. Test in production environment

---

Your Google OAuth implementation is complete! Just add the client secret and you're ready to go! 🚀
