import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";
import { verifyToken } from "../utils/jwt";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Token ausente ou inválido."));
  }

  try {
    const payload = verifyToken(header.slice(7));
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role
    };
    next();
  } catch {
    next(new HttpError(401, "Token ausente ou inválido."));
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "Autenticação necessária."));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, "Acesso negado."));
    }

    next();
  };
}
