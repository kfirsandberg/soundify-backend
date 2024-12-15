import { userService } from '../user/user.service.js';
import { logger } from '../../services/logger.service.js';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'gign585';

export const authService = {
    signup,
    login,
    generateToken,
    validateToken,
};

// Login function
async function login(username, password) {
    logger.debug('authService.login - Start login process');
    console.log(`[LOGIN ATTEMPT] Username: ${username}`);

    // Fetch the user by username
    const user = await userService.getByUsername(username);
    if (!user) {
        console.error(`[LOGIN FAILURE] Username: ${username} not found`);
        logger.warn(`authService.login - Failed login: username "${username}" not found`);
        throw new Error('Invalid username or password');
    }

    console.log(`[USER FOUND] Username: ${username}`);

    // Compare the provided password with the stored password (plain text comparison)
    if (user.password !== password) {
        console.error(`[LOGIN FAILURE] Incorrect password for username: ${username}`);
        logger.warn(`authService.login - Failed login: invalid password for username "${username}"`);
        throw new Error('Invalid username or password');
    }

    console.log(`[PASSWORD VERIFIED] Username: ${username}`);

    // Remove sensitive information from the user object
    delete user.password;
    user._id = user._id.toString();

    // Generate and return login token
    const token = generateToken(user);
    console.log(`[TOKEN GENERATED] For username: ${username}`);
    logger.info(`authService.login - Successful login for username "${username}"`);

    return { user, token };
}

// Signup function
async function signup({ username, password, imgUrl }) {
    logger.debug(`authService.signup - Attempting signup with username: ${username}`);

    if (!username || !password) {
        throw new Error('Missing required signup information');
    }

    const userExist = await userService.getByUsername(username);
    if (userExist) {
        throw new Error('Username already taken');
    }

    // Add the new user
    const newUser = await userService.add({ username, password, imgUrl });
    logger.info(`authService.signup - New user created: ${username}`);
    return newUser;
}

// Generate a JWT token
export function generateToken(user) {
    const payload = { 
        id: user._id, 
        username: user.username 
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    console.log('[GENERATED TOKEN]:', token); // Debugging the generated token
    return token;
}

// Validate and decode a JWT token
export function validateToken(token) {
    try {
        if (!token) {
            console.error('No token provided');
            return null;
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Token successfully validated:', decoded); // Debug decoded payload
        return decoded;
    } catch (err) {
        console.error('Token validation failed:', err.message); // Detailed error logging
        return null;
    }
}

