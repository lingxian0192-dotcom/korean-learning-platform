The 502 Bad Gateway error was caused by a port mismatch between Nginx and the Backend application.

### Problem Analysis
1.  **Nginx Configuration**: Configured to proxy requests to `http://localhost:3001` (`deploy/nginx.conf`).
2.  **Backend Configuration**: Defaulted to listening on port `3000` when the `PORT` environment variable is not set (`apps/server/src/main.ts`).
3.  **Result**: Nginx tried to connect to port 3001, but the backend was on 3000, resulting in a Connection Refused -> 502 Error.

### Implemented Solution
1.  **Updated Backend Port**: Modified `apps/server/src/main.ts` to use `3001` as the default port fallback (instead of 3000). This ensures the backend matches the Nginx configuration even if the `.env` file is missing or `PORT` var is not set in the cloud environment.
2.  **Updated Documentation**: Added a FAQ entry in `PROJECT_DOCS.md` explaining the 502 error and the port requirement.

### Verification & Next Steps
1.  **Auth Check**: Verified that `AuthService.signUp` uses `email_confirm: true` with the admin client, so registration should work immediately without email verification once the connection is established.
2.  **Action Required**: Please **redeploy the backend code** to your cloud server.
    *   Re-run your build and deployment script.
    *   Restart the backend service.
    *   The 502 error should disappear, and registration/login will work.