import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import NotFound from "./pages/NotFound";

// Wraps the Home component with <AuthProvider>, so the whole app can read the auth state (useAuth).
export default function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/u/:username" element={<UserPage/>}/>
				<Route path="/u/:username/:postId" element={<PostPage/>}/>
				<Route path="*" element={<NotFound/>}/>
			</Routes>
		</AuthProvider>
	);
}