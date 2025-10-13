# ParkNow — AI coding agent instructions

This is a React Native (Expo) app for parking (Android/iOS). Use these patterns and files to be productive fast.

## Architecture and key flows
- Navigation
  - Root stack in `src/navigation/AppNavigator.tsx` with tabs in `MainTabNavigator.tsx`.
  - Registration flow stack in `src/navigation/RegistrationNavigator.tsx` using custom header `components/RegistrationHeader.tsx`.
  - Route/type definitions in `src/navigation/types.ts` — update here when adding screens.
- State and services
  - REST API calls live in `src/services/api.ts`. Base URL is hardcoded in `API_ENDPOINT`. Tokens are stored in Expo SecureStore under key `userToken`.
  - Registration shared state is in `src/context/RegistrationContext.tsx` (phoneNumber, email, token, etc.).
- Authentication & registration
  - Login: `api.login(phone)` stores `userToken` on success and navigates to `MainApp`.
  - Registration (4 steps):
    1) `Step1PhoneScreen.tsx` → `api.checkPhone(phoneNumber)`
    2) `Step2EmailScreen.tsx` → `api.sendEmailOtp(email, phoneNumber)`
    3) `Step3OtpScreen.tsx` → `api.verifyEmailOtp(email, otp)` returns a token stored in context
    4) `Step4PasswordScreen.tsx` → `api.register({ phoneNumber, email, password, token })` then auto-login and reset to `CompleteProfile`.
  - Post-registration profile: `screens/CompleteProfileScreen.tsx` collects `name, avatar, dateOfBirth, gender` and calls `api.updateUserProfile`, then resets to `MainApp` Home.
- Profile editing for existing users lives in `screens/PersonalInformationScreen.tsx` and `screens/AccountScreen.tsx`.

## API conventions
- `api.ts` wraps fetch with `logAndParseResponse(response)` to log status/headers/body and return parsed JSON. Prefer using/adding methods here rather than inline fetches.
- Many endpoints return `{ statusCode, message, data }`. Treat `statusCode===200|201` as success. Some updates return HTTP 204 — handle as success per existing code.
- Auth endpoints used:
  - `POST /mobile/customer-authentication/login` (body: `{ phone }` in current client)
  - `POST /mobile/customer-authentication/check-phone` (body: `{ phoneNumber }`)
  - `POST /mobile/customer-authentication/send-email-otp` (body: `{ email, phoneNumber }`)
  - `POST /mobile/customer-authentication/verify-email-otp` (body: `{ email, otp }`) → returns verification token in `data`
  - `POST /mobile/customer-authentication/register` (body: `{ phoneNumber, email, password, token }`)
  - Profile: `GET/PUT /mobile/account` (Authorization: `Bearer ${userToken}`)

## UI patterns
- Use shared inputs and buttons:
  - `components/FormInput.tsx` for labeled inputs with Ionicons.
  - `components/Button.tsx` supports `type`, `disabled`, and `loading` states.
  - `components/ProfileInfoRow.tsx` for editable profile rows.
- Keep screens lean: local state + call `api.ts` + navigate using typed stacks from `types.ts`.

## Adding features safely
- Add new screens under `src/screens/...`, register in stack/tab, and update `src/navigation/types.ts` for route types.
- Add new API calls in `src/services/api.ts`; include logging via `logAndParseResponse` and match success criteria to existing endpoints.
- If an endpoint requires auth, fetch the token via `SecureStore.getItemAsync('userToken')` and send `Authorization: Bearer` header.
- When changing registration, ensure the 4-step flow state passes through `RegistrationContext` and navigation resets appropriately.

## Build, run, test
- Node >= 20 (see `package.json`). Expo project with common scripts:
  - Start Metro: `npm start`
  - Android: `npm run android`  |  iOS: `npm run ios`  |  Web: `npm run web`
- Tests: Jest is configured (`jest.config.js`, `__tests__/App.test.tsx`), but coverage is minimal.

## Integration tips
- API host is fixed in `src/services/api.ts` → `API_ENDPOINT`. Update for local/staging as needed.
- Location/map features: see `src/utils/geolocation.ts` and screens using `react-native-maps`.
- Lottie assets in `src/assets/json/*` for loading/empty/otp visuals.

When in doubt, search for a similar pattern in `src/screens` and copy the approach: typed navigation, shared components, `api.ts` method, optimistic loading state, and Alert-based errors.