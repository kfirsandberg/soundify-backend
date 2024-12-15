import { authService } from './auth.service.js'
import { logger } from '../../services/logger.service.js'
import { userService } from './../user/user.service.js'


export async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const user = await userService.getByUsername(username);

        if (!user || !user.password) {
            console.error(`[LOGIN FAILURE1] Username: ${username} not found or password missing`);
            return res.status(401).send('Invalid username or password');
        }
        
        // Directly compare passwords (plaintext comparison)
        if (password !== user.password) {
            console.error(`[LOGIN FAILURE2] Incorrect password for username: ${username}`);
            return res.status(401).send('Invalid username or password');
        }

        // Generate the token
        const token = authService.generateToken(user);

        // Log a message indicating the token has been generated successfully
        console.log(`[TOKEN GENERATED] Successfully generated token for user: ${username}`);

        // Set the token in an HTTP-only cookie
        res.cookie('loginToken', token, { httpOnly: true, secure: true, sameSite: 'None' });

        // Respond with the user data (excluding the password) and the token
        delete user.password;  // Remove password for security
        res.json({
            user: user,
            token: token // Include the token here
        });
    } catch (err) {
        console.error('Failed to login:', err);
        res.status(500).send('Failed to login');
    }
}



export async function signup(req, res) {
    try {
        const credentials = req.body;

     
        const account = await authService.signup(credentials);
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account));

        // Directly use the credentials for login
        const user = await authService.login(credentials.username, credentials.password);
        logger.info('User signup:', user);

        const loginToken = authService.getLoginToken(user);
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true });
        res.json(user);
    } catch (err) {
        logger.error('Failed to signup ' + err);
        res.status(400).send({ err: 'Failed to signup' });
    }
}

export async function logout(req, res) {
    try {
        
        const token = req.cookies.loginToken;
        if (!token) {
            return res.status(401).send({ msg: 'No user is logged in' });
        }

        const user = authService.validateToken(token); 
        if (!user) {
            return res.status(401).send({ msg: 'Invalid token, no user logged out' });
        }

        console.log(`User logged out: ${user.username}`); // Log the username or other decoded data

        // Clear the login token cookie
        res.clearCookie('loginToken');
        res.send({ msg: 'Logged out successfully', username: user.username }); // Return user info to frontend
    } catch (err) {
        console.error('Logout error:', err); // Log errors for debugging
        res.status(500).send({ err: 'Failed to logout' });
    }
}




export async function validateToken(req, res) {
    try {
        const token = req.cookies.loginToken || req.body.token;
        console.log('Token received for validation:', token); // Debug the token

        if (!token) {
            console.error('No token provided');
            return res.status(401).json({ isLoggedIn: false });
        }

        const user = authService.validateToken(token);
        if (user) {
            console.log('Token is valid for user:', user); // Debug user info
            return res.status(200).json({ isLoggedIn: true, user });
        } else {
            console.error('Invalid token');
            return res.status(401).json({ isLoggedIn: false });
        }
    } catch (err) {
        console.error('Error during token validation:', err.message); // Debug the error message
        return res.status(500).json({ err: 'Failed to validate token' });
    }
}
