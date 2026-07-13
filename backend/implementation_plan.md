# Implementation Plan: Fix Backend ESLint Errors

## Goal
Fix all 205 ESLint errors and warnings across the NestJS backend to ensure strong type safety, resolve unused variable issues, and ensure proper asynchronous behavior, as reported by `npm run lint`.

## Proposed Changes

### 1. Request Typing (Controllers)
- **Problem:** Widespread use of `@Request() req: any` causing `Unsafe member access .user on an any value` and `Unsafe argument of type any assigned...`.
- **Solution:** 
  - Create `src/common/interfaces/authenticated-request.interface.ts` defining `AuthenticatedRequest` which extends Express `Request` and includes the `user: { userId: string; email: string }` object.
  - Update all controllers to use this interface instead of `any`.
  - Affected files: 
    - `analytics.controller.ts`
    - `banners.controller.ts`
    - `business.controller.ts`
    - `dashboard.controller.ts`
    - `notifications.controller.ts`
    - `promotions.controller.ts`
    - `requests.controller.ts`
    - `tracking.controller.ts`
    - `users.controller.ts`

### 2. Services Typings
- **Problem:** Variables typed as `any` or implicitly `any` causing unsafe assignments, member accesses, and returns.
- **Solution:**
  - `analytics.service.ts`: Create strict types/interfaces for aggregation results (e.g., `{ totalPromotions: number, completedPromotions: number, totalClicks: number }`) to replace implicit `any` returns from Prisma group-by queries.
  - `business.service.ts`: Remove unused variables (`BadRequestException`). Replace `any` data objects (like `dataToUpdate: any`) with properly typed partial inputs. Properly cast `bannerTemplate` when used in switch statements.
  - `dashboard.service.ts`: Remove unused variables (`NotFoundException`, `e`). Type mapping functions correctly.
  - `promotions.service.ts`: Type Proof arrays.
  - `tracking.service.ts`: Add proper typings for header parsing (e.g. `const userAgent = req.headers['user-agent'] as string | undefined`).
  - `users.service.ts`: Remove unused `password` destructured variable. Add explicit types where variables implicitly evaluate to `any`.

### 3. Strategy and Filters
- **Problem:** `jwt.strategy.ts` `validate` lacks `await`, and `payload` is `any`. `http-exception.filter.ts` uses `any` for exceptions.
- **Solution:**
  - `jwt.strategy.ts`: Type `payload` as `{ sub: string, email: string }`. Remove `async` or return `Promise.resolve`.
  - `http-exception.filter.ts`: Check if `exception` is instance of `HttpException` and safely extract `.message`.

### 4. Gateways and Other Files
- **Problem:** Unused variables, floating promises, unhandled template literal `never` types.
- **Solution:**
  - `main.ts`: Await `app.listen()`.
  - `notifications.gateway.ts`: Remove unused imports. Await `this.prisma.notification.update()`. Define proper message payload type.
  - `corporate.template.ts`: Remove unused `e` parameter from `catch (e)`.
  - `banner.factory.ts`: Fix type casting for templates.
  - `create-business.dto.ts`: Remove unused `IsUrl` import.

## Verification Plan
1. Run `npm run lint` inside `backend`.
2. Ensure it completes with `0 problems`.
3. Verify the backend can still be compiled using `npm run build`.
