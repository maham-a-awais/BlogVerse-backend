import bcrypt from "bcrypt";

/**
 * Hashes a given password with a salt of 10.
 * @param password - The password to hash
 * @returns The hashed password
 */
export const hash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compares a given password to a hashed password.
 * @param password - The password to compare
 * @param hashedPassword - The hashed password to compare against
 * @returns A boolean indicating if the password matches
 */
export const compareHash = async (password: string, hashedPassword: string): Promise<boolean> => {
  console.log("Comparing hash");
  console.log(await bcrypt.compare(password, hashedPassword));
  return await bcrypt.compare(password, hashedPassword);
};
