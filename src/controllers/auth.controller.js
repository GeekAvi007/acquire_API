import logger from "#config/logger.js"
import { createUser } from "#services/auth.service.js";
import { formatValidationErrors } from "#utils/format.js";
import { jwttoken } from "#utils/jwt.js";
import { signUpSchema } from "#validations/auth.validation.js";
import { cookies } from "#utils/cookies.js";

export const signup = async (req, res, next) => {
    try {
        const validationResult = signUpSchema.safeParse(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                error: 'Validation Error!',
                details: formatValidationErrors(validationResult.error)
            })
        }

        const { name, email,password, role} = validationResult.data;

        // AUTH
        const user = await createUser({name , email, password, role})

        const token = jwttoken.sign({id: user.id, email: user.email, role: user.role})

        cookies.set(res, 'token', token);

        logger.info(`User Registered Successfully, ${email}`);
        res.status(201).json({
            message: 'User Registered!',
            user: {
                id: user.id , name: user.name, email: user.email, role:user.role
            }
        })
    } catch (error) {
        logger.error('Signup Error', error)

        if(error.message === 'User with this Email already exists') {
            return res.status(409).json({ error: 'Email already exist'});
        }

        next(error);
    }
}