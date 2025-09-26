import logger from "#config/logger.js"
import bcrypt from 'bcrypt'
import { db } from '#config/database.js'
import { eq } from "drizzle-orm"
import { users } from '#models/user.model.js'
export const hashedPassword = async (password)=>{
    try {
        return await bcrypt.hash(password,10)
    } catch (error) {
        logger.error(`Error hashing the password : ${error}`);
        throw new Error('Error Hashing!')
    }
}

export const createUser = async ({ name, email, password, role = 'user' }) => {
    try {
        // check if user already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            throw new Error('User with this Email already exists');
        }

        // hash password
        const password_hash = await hashedPassword(password);

        // insert user
        const [newUser] = await db
            .insert(users)
            .values({ name, email, password: password_hash, role })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.created_at,
            });

        logger.info(`User ${newUser.email} created successfully!`);
        return newUser;
    } catch (error) {
        logger.error(`Error Creating User : ${error}`);
        throw error;
    }
};