import bcrypt from "bcrypt";
import config from "../config";

const generateHash = (password: string): any => {
  const saltRounds = parseInt(config.bycrypt_salt_rounds || "10", 10);
  if (isNaN(saltRounds)) {
    throw new Error("Invalid bcrypt salt rounds configuration");
  }

  return bcrypt.hash(password, saltRounds);
};

const compareHash = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

export const hashHelper = {
  generateHash,
  compareHash,
};
