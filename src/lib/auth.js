// src/lib/auth.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

// For production, store hashed passwords in database
const ADMIN_USERS = [
	{
		id: 1,
		username: 'admin',
		// Hash of 'your_admin_password' - generate with: bcrypt.hash('your_password', 10)
		passwordHash: '$2b$10$example_hash_here',
		role: 'admin'
	}
];

export async function validateCredentials(username, password) {
	const user = ADMIN_USERS.find(u => u.username === username);
	if (!user) return null;
	
	const isValid = await bcrypt.compare(password, user.passwordHash);
	if (!isValid) return null;
	
	return {
		id: user.id,
		username: user.username,
		role: user.role
	};
}

export function generateToken(user) {
	return jwt.sign(
		{ 
			id: user.id, 
			username: user.username, 
			role: user.role 
		},
		JWT_SECRET,
		{ expiresIn: '7d' }
	);
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
}

export async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}

// Middleware for protecting routes
export function requireAuth(cookies) {
	const token = cookies.get('admin_token');
	if (!token) return null;
	
	const user = verifyToken(token);
	return user;
}