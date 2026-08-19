import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

/**
 * Extracts the authenticated user's id from the request, however JwtStrategy
 * ends up shaping req.user. Throws if no authenticated user is present -
 * callers must never fall back to a placeholder id.
 */
export function requestingUserId(req: any): string {
  const id = req?.user?.userId || req?.user?.id || req?.user?.sub;
  if (!id) {
    throw new UnauthorizedException('Authenticated user could not be identified');
  }
  return id;
}

/**
 * Guards routes shaped as /:userId/... - ensures the authenticated caller
 * is only ever acting on their own userId path segment.
 */
export function requireSelf(req: any, userId: string): string {
  const callerId = requestingUserId(req);
  if (callerId !== userId) {
    throw new ForbiddenException('You do not have access to this resource');
  }
  return callerId;
}

/**
 * Guards routes that look up a record by its own id (not the owning
 * userId) - ensures the record actually belongs to the authenticated caller.
 */
export function assertOwns(ownerId: string | null | undefined, requestingId: string): void {
  if (!ownerId || ownerId !== requestingId) {
    throw new ForbiddenException('You do not have access to this resource');
  }
}
