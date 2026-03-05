import { type Request, Response, NextFunction } from 'express';
import { verifyToken, type TokenPayload, hasPermission } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware для проверки JWT токена
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer '
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
}

/**
 * Middleware для проверки роли
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!hasPermission(req.user.role, roles)) {
      return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
    }

    next();
  };
}

/**
 * Middleware для проверки, что пользователь принадлежит к группе или является админом
 */
export function requireGroup(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!hasPermission(req.user.role, roles) && !req.user.groupId) {
      return res.status(403).json({ message: 'Forbidden - user has no group' });
    }

    next();
  };
}
