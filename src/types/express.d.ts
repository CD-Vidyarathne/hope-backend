import { Roles } from "./roles";

declare global {
  namespace Express {
    interface User {
      id: number;
      role: Roles;
    }

    interface Request {
      user?: User;
    }
  }
}
