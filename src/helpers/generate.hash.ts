import { hash } from 'bcrypt';

export const generateHash = async (
  password: string,
  salt: string
): Promise<string> => await hash(password, salt);
