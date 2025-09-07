const BASE = import.meta.env.VITE_API_URL || 'https://zenith-backend-2jen.onrender.com';

async function request(path, options = {}) {
	const url = BASE + path;
	
	// Get token from localStorage
	const token = localStorage.getItem('token');
	
	const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
	
	// Add Authorization header if token exists
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	
	const res = await fetch(url, {
		credentials: 'include',
		headers,
		...options,
	});
	
	const text = await res.text();
	
	// Handle empty responses
	if (!text) {
		if (res.ok) {
			return {};
		} else {
			throw new Error('Request failed');
		}
	}
	
	let data;
	try {
		data = JSON.parse(text);
	} catch (e) {
		console.error('JSON Parse Error:', e, 'Full text:', text);
		// If it's not JSON, it might be an HTML error page
		if (text.includes('<html>') || text.includes('<!DOCTYPE')) {
			throw new Error('Server returned HTML instead of JSON. This might be a server error.');
		}
		// Check if it's a simple string response
		if (text.startsWith('"') && text.endsWith('"')) {
			try {
				data = { message: JSON.parse(text) };
			} catch {
				throw new Error('Invalid response from server');
			}
		} else {
			throw new Error('Invalid response from server');
		}
	}
	
	if (!res.ok) {
		// Handle different error formats
		const errorMessage = data.error || data.message || 'Request failed';
		const error = new Error(errorMessage);
		error.status = res.status;
		error.code = data.code;
		throw error;
	}
	
	return data;
}

export const api = {
	get: (p) => request(p),
	post: (p, body) => request(p, { method: 'POST', body: JSON.stringify(body) }),
	put: (p, body) => request(p, { method: 'PUT', body: JSON.stringify(body) }),
	delete: (p) => request(p, { method: 'DELETE' }),
};