declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      role: string;
    }
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};
