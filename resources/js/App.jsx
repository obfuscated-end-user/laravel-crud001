import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./AuthContext";

import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import NotFound from "./pages/NotFound";

function ProtectedRoute({ children }) {
	const { authenticated, loading } = useAuth();
	if (loading) return <div className="p-8">Loading...</div>;
	if (!authenticated) return <Navigate to="/" />;

	return children;
}

// Wraps the Home component with <AuthProvider>, so the whole app can read the auth state (useAuth).
export default function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/u/:username" element={<ProtectedRoute><UserPage/></ProtectedRoute>}/>
				<Route path="/u/:username/:postId" element={<ProtectedRoute><PostPage/></ProtectedRoute>}/>
				<Route path="*" element={<NotFound/>}/>
			</Routes>
		</AuthProvider>
	);
}