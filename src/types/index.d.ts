export {};

declare global {
  namespace Express {
    interface Request {
      userId: string | null;
      deviceId: string | null;
    }
  }
}
