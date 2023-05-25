import { hash } from 'bcrypt';

export const generateHash = async (password: string): Promise<string> =>
  await hash(password, 10);
