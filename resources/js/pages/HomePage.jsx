import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axiosClient from "../api/axiosClient";
import { usePosts } from "../hooks/usePosts";
import Layout from "../Layout";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import NewPostForm from "../components/NewPostForm";
import FeedPostCard from "../components/FeedPostCard";
import ConfirmModal from "../components/ConfirmModal";

// This is the main React app component that shows the login/register UI when the user is not
// authenticated, the post creation and post list UI when the user is logged in.
export default function HomePage() {
	// go to AuthContext.jsx, auth state
	const {
		authenticated, loading, user, login, register, logout, loggingIn, registering, loginError,
		registerError, setLoginError, setRegisterError
	} = useAuth();
	const navigate = useNavigate();
	// go to hooks\usePosts.js, posts state
	// local states that hold what the user types in forms
	const [registerForm, setRegisterForm] = useState({
		name: "",
		display_name: "",
		email: "",
		password: "",
	});
	const [loginForm, setLoginForm] = useState({ name: "", password: "" });
	const [newPost, setNewPost] = useState({ body: "" });
	const [formError, setFormError] = useState("");
	const [confirmState, setConfirmState] = useState({ show: false, message: "", onConfirm: null });
	// this has to be at the bottom
	// 2026/04/18: i forgot what this does
	const { posts, setPosts, loading: postsLoading } = usePosts(authenticated, "feed", null);
	const isEditingAny = posts.some(p => p.isEditing);

	const openConfirm = (message, onConfirm) => {
		setConfirmState({ show: true, message, onConfirm });
	};

	const closeConfirm = () => {
		setConfirmState({ show: false, message: "", onConfirm: null });
	};

	const handleRegister = async e => {
		e.preventDefault();	// prevent the page from reloading
		// Call register(name, email, password), which hits "POST /register", see function in
		// AuthContext.jsx.
		await register(
			registerForm.name,
			registerForm.display_name,
			registerForm.email,
			registerForm.password
		);
	};

	const handleLogin = async e => {
		e.preventDefault();
		await login(loginForm.name, loginForm.password);	// "POST /login"
	};

	const handleCreatePost = async e => {
		e.preventDefault();
		if (!newPost.body.trim()) {
			setFormError("Content is required");
			return;
		}
		openConfirm("Create this post?", async () => {
			// Sends "POST /create-post" with the new body.
			await axiosClient.post("/create-post", { body: newPost.body });
			const res = await axiosClient.get("/posts");
			setPosts(res.data);
			setNewPost({ body: "" });	// Clear the form.
			setFormError("");
			closeConfirm();
		});
	};

	const handleDeletePost = async id => {
		openConfirm("Are you sure you want to delete this post?", async () => {
			await axiosClient.delete(`/delete-post/${id}`);		// "DELETE /delete-posts/${id}"
			setPosts(prev => prev.filter(p => p.id !== id));	// Removes that post from the list.
			closeConfirm();
		});
	};

	const handleUpdatePost = async (id, body) => {
		if (!body.trim()) {
			setFormError("Content is required");
			return;
		}
		openConfirm("Save changes to this post?", async () => {
			try {
				// Sends "PUT /edit-post/{id}" with new body.
				// Laravel PostController::updatePost validates and saves to database.
				// Returns updated post as JSON (res.data)
				const res = await axiosClient.put(`/edit-post/${id}`, { body });
				// prev.map creates new array and finds post where p.id === id (the one being edited), replaces it with
				// res.data (fresh backend data) and resets editing flags.
				// Then, it keeps all other posts unchanged (": p" at the end), and { ...res.data, isEditing: false, ... }
				// merges backend data with UI state reset.
				setPosts(prev => prev.map(p =>
					p.id === id ? {...res.data, isEditing: false, editBody: ""} : p
				));
				closeConfirm();
			} catch (err) {
				alert("Failed to update post.");
			}
		});
	};

	// Show "Loading..." while checking if the user is already logged in.
	if (loading) return <div className="text-center p-8 text-xl">Loading...</div>;

	// If not authenticated, show a register and login form.
	if (!authenticated) {
		return (
			<Layout>
				<div className="p-8 space-y-8">
					<h1 className="text-4xl font-bold text-center mb-12">Outside</h1>
					<RegisterForm
						form={registerForm} setForm={setRegisterForm} onSubmit={handleRegister}
						loading={registering} error={registerError}
						clearError={() => setRegisterError(null)}
					/>
					<LoginForm
						form={loginForm} setForm={setLoginForm} onSubmit={handleLogin}
						loading={loggingIn} error={loginError} clearError={() => setLoginError(null)}
					/>
				</div>
			</Layout>
		);
	}

	// Attempt to emulate blade template @auth. If authenticated, show their username, a form to
	// create a new post, a list of all their posts.
	return (
		<Layout>
			<div className="space-y-6">
				<p className="text-xl font-semibold text-gray-700">
					You are logged in as{" "}
					<span className="font-bold text-blue-600">{user?.name}</span>
				</p>
				<NewPostForm
					newPost={newPost} setNewPost={setNewPost} onSubmit={handleCreatePost}
					error={formError}
				/>
				<div className="rounded-lg">
					{postsLoading && (<p className="text-lg text-gray-500">Loading posts...</p>)}
					<div className="space-y-4">
						{posts.map(post => (
							<FeedPostCard
								key={post.id} post={post} user={user} navigate={navigate}
								isEditingAny={isEditingAny} setPosts={setPosts}
								onDelete={handleDeletePost} onUpdate={handleUpdatePost}
							/>
						))}
					</div>
				</div>

				<ConfirmModal
					show={confirmState.show} message={confirmState.message}
					onClose={closeConfirm} onConfirm={confirmState.onConfirm}
				/>
			</div>
		</Layout>
	);
}