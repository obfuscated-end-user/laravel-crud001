import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "./api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axiosClient.get("/me")
			.then(res => {
				setAuthenticated(res.data.authenticated);
				setUser(res.data.user);
			})
			.catch(() => {
				setAuthenticated(false);
				setUser(null);
			})
			.finally(() => setLoading(false));
	}, []);

	const login = async (name, password) => {
		const res = await axiosClient.post("/login", {
			"login-name": name,
			"login-password": password,
		});
		setAuthenticated(res.data.authenticated);
		setUser(res.data.user ?? null);
	};

	const register = async (name, email, password) => {
		const res = await axiosClient.post("/register", {
			name,
			email,
			password
		});
		setAuthenticated(true);
		setUser(res.data.user);
	};

	const logout = async () => {
		await axiosClient.post("/logout");
		setAuthenticated(false);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, authenticated, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
