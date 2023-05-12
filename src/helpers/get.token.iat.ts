import { decode } from "jsonwebtoken";

export const getTokenIat = (token: string) => {
  const tokenIat: any = decode(token);

  return new Date(tokenIat.iat);
};
