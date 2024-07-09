import bcrypt from 'bcryptjs';

export const saltAndHashPassword = (password : string) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};
