import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "./api/axiosClient";

// Define a React authentication context stores whether the user is logged in, holds the current
// user data, and exposes functions to login, register and logout.

// Create a global "auth state" container that any component can read from without manually passing 
// down props.
// https://react.dev/reference/react/createContext
const AuthContext = createContext(null);

// Wraps the whole application or part of it so that every child can read the auth state.
export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);	// either the current user object or null
	const [authenticated, setAuthenticated] = useState(false);	// true if logged in
	const [loading, setLoading] = useState(true);				// boolean for the initial check

	useEffect(() => {	// On mount...
		axiosClient.get("/me")	// call this to ask Laravel if the user is already logged in.
			.then(res => {		// If the backend returns { authenticated: true, user: ... },
				setAuthenticated(res.data.authenticated);	// set `authenticated` to true,
				setUser(res.data.user);						// and sets `user` to that user object.
			})
			.catch(() => {	// If the request fails (no session foe example),
				setAuthenticated(false);	// set this to false
				setUser(null);				// and clear user.
			})
			// Set `loading` to false so the UI stops showing a loading state.
			.finally(() => setLoading(false));
	}, []);

	// Calls "POST /login" with `login-name` and `login-password`, then updates the React state with
	// the response's `authenticated` and `user`.
	const login = async (name, password) => {
		const res = await axiosClient.post("/login", {
			"login-name": name,
			"login-password": password,
		});
		setAuthenticated(res.data.authenticated);
		setUser(res.data.user ?? null);
	};

	// Calls "POST /register", then sets `authenticated` to true and stores the returned user in
	// state.
	const register = async (name, email, password) => {
		const res = await axiosClient.post("/register", { name, email, password });
		setAuthenticated(true);
		setUser(res.data.user);
	};

	// Calls "POST /logout" on the backend, then clears `user` and sets `authenticated` to false.
	const logout = async () => {
		await axiosClient.post("/logout");
		setAuthenticated(false);
		setUser(null);
	};

	// https://react.dev/reference/react/createContext#provider
	return (
		// Wraps the React component tree and tells React that everything inside here can read the
		// value passed as `value={...}`, and that value object is that actual "auth state" that
		// gets shared.
		<AuthContext.Provider value={{ user, authenticated, loading, login, register, logout }}>
			{ children /* Represents whatever components are inside <AuthProvider></AuthProvider> tags. */ }
		</AuthContext.Provider>
	);
}

export function useAuth() {
	// Lets any component easily read the "auth state".
	// https://react.dev/reference/react/useContext
	return useContext(AuthContext);
}
