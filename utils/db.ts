import { db } from '@/server';
import { users } from '@/server/schema';
import bcrypt from 'bcryptjs';
import { eq } from "drizzle-orm"


export const getUserFromDb = async (email: string, password: string) => {
  try {
    const result = await db.query.users.findMany({
      where: (fields:any) => ({
        // where: eq(productVariants.id, Number(params.slug)),
        where: eq(email, users.email)
      }),
    });

    // const result = await db.query.users.findfirst();

    const user = result[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      // Return user object excluding the password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error finding user in DB: ", error);
    return null;
  }
};
