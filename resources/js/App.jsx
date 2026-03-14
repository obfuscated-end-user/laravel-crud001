import React, { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import axiosClient from "./api/axiosClient";
import { usePosts } from "./hooks/usePosts";

// This is the main React app component that shows the login/register UI when the user is not
// authenticated, the post creation and post list UI when the user is logged in.

// The main sscreen that changes its layout depending on whether you're logged in or not.
function Home() {
	// go to AuthContext.jsx, auth state
	const { authenticated, loading, user, login, register, logout } = useAuth();
	// go to hooks\usePosts.js, posts state
	const { posts, setPosts, loading: postsLoading } = usePosts(authenticated);
	// local states that hold what the user types in forms
	const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });
	const [loginForm, setLoginForm] = useState({ name: "", password: "" });
	const [newPost, setNewPost] = useState({ title: "", body: "" });

	const handleRegister = async (e) => {
		e.preventDefault();	// prevent the page from reloading
		// Call register(name, email, password), which hits "POST /register", see function in
		// AuthContext.jsx.
		await register(registerForm.name, registerForm.email, registerForm.password);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		await login(loginForm.name, loginForm.password);	// "POST /login"
	};

	const handleLogout = async (e) => {
		e.preventDefault();
		await logout();	// POST /logout
	};

	const handleCreatePost = async (e) => {
		e.preventDefault();
		// Sends "POST /create-post" with the new title and body.
		const res = await axiosClient.post("/create-post", newPost);
		setPosts(prev => [res.data, ...prev]);	// Adds the returned post to the list at the top.
		setNewPost({ title: "", body: "" });	// Clear the form.
	};

	const handleDeletePost = async (id) => {
		await axiosClient.delete(`/posts/${id}`);			// "DELETE /posts/${id}"
		setPosts(prev => prev.filter(p => p.id !== id));	// Removes that post from the list.
	};

	if (loading)	// Show "Loading..." while checking if the user is already logged in.
		return <div>Loading...</div>;

	// If not authenticated, show a register and login form.
	if (!authenticated) {
		return (
			<div>
				<h1>CRUD application</h1>
				<div style={{ border: "3px solid black" }}>
					<h2>Register</h2>
					<form onSubmit={ handleRegister }>
						<input
							name="name"
							type="text"
							placeholder="name"
							value={ registerForm.name }
							onChange={ e => setRegisterForm(f => ({ ...f, name: e.target.value })) }
						/>
						<input
							name="email"
							type="text"
							placeholder="email"
							value={ registerForm.email }
							onChange={ e => setRegisterForm(f => ({ ...f, email: e.target.value })) }
						/>
						<input
							name="password"
							type="password"
							placeholder="password"
							value={ registerForm.password }
							onChange={ e => setRegisterForm(f => ({ ...f, password: e.target.value })) }
						/>
						<button>Register</button>
					</form>
				</div>

				<div style={{ border: "3px solid black" }}>
					<h2>Log in</h2>
					<form onSubmit={ handleLogin }>
						<input
							name="login-name"
							type="text"
							placeholder="name"
							value={loginForm.name}
							onChange={ e => setLoginForm(f => ({ ...f, name: e.target.value })) }
						/>
						<input
							name="login-password"
							type="password"
							placeholder="password"
							value={ loginForm.password }
							onChange={ e => setLoginForm(f => ({ ...f, password: e.target.value })) }
						/>
						<button>Log in</button>
					</form>
				</div>
			</div>
		);
	}

	// Attempt to emulate blade template @auth.
	// Else if authenticated, show their username, a form to create a new post, a list of all their
	// posts, and a logout button.
	return (
		<div>
			<p>you are logged in as {user?.name}</p>

			<div style={{ border: "3px solid black" }}>
				<h2>Create a new post</h2>
				<form onSubmit={handleCreatePost}>
					<input
						name="title"
						type="text"
						placeholder="post title"
						value={newPost.title}
						onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
					/>
					<textarea
						name="body"
						placeholder="body content..."
						value={newPost.body}
						onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))}
					/>
					<button>Save post</button>
				</form>
			</div>

			<div style={{ border: "3px solid black" }}>
				<h2>All posts</h2>
				{postsLoading && <p>Loading posts...</p>}
				{posts.map(post => (
					<div
						key={ post.id }
						style={{ backgroundColor: "gray", padding: 10, margin: 10 }}
					>
						<h3>{ post.title } by { post.user?.name ?? "You" }</h3>
						<div>{ post.body }</div>
						{/* Edit would navigate to another React route or inline form */}
						<button onClick={ () => handleDeletePost(post.id) }>Delete</button>
					</div>
				))}
			</div>

			<form onSubmit={ handleLogout }>
				<button>Log out</button>
			</form>
		</div>
	);
}

// Wraps the Home component with <AuthProvider>, so the whole app can read the auth state (useAuth).
export default function Root() {
	return (
		<AuthProvider>	{/*  provides login state to entire app */}
			<Home />
		</AuthProvider>
	);
}
