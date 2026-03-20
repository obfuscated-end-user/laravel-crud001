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
		// DO NOT REMOVE res!
		const res = await axiosClient.post("/create-post", newPost);
		// setPosts(prev => [res.data, ...prev]);	// Adds the returned post to the list at the top.
		// refetch posts to get complete data w/ user relationsutp
		setPosts(await (await axiosClient.get("/posts")).data);
		setNewPost({ title: "", body: "" });	// Clear the form.
	};

	const handleDeletePost = async (id) => {
		await axiosClient.delete(`/delete-post/${id}`);		// "DELETE /delete-posts/${id}"
		setPosts(prev => prev.filter(p => p.id !== id));	// Removes that post from the list.
	};

	if (loading)	// Show "Loading..." while checking if the user is already logged in.
		return <div className="text-center p-8 text-xl">Loading...</div>;

	// If not authenticated, show a register and login form.
	if (!authenticated) {
		return (
			<div className="max-w-2xl mx-auto p-8 space-y-8">
				<h1 className="text-4xl font-bold text-center mb-12">CRUD application</h1>
				<div className="border-4 border-black p-8 rounded-lg">
					<h2 className="text-2xl font-semibold mb-6">Register</h2>
					<form onSubmit={ handleRegister } className="space-y-4">
						<input
							name="name" type="text" placeholder="name" value={ registerForm.name }
							onChange={ e => setRegisterForm(f => ({ ...f, name: e.target.value })) }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<input
							name="email" type="text" placeholder="email" value={ registerForm.email }
							onChange={ e => setRegisterForm(f => ({ ...f, email: e.target.value })) }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<input
							name="password" type="password" placeholder="password" value={ registerForm.password }
							onChange={ e => setRegisterForm(f => ({ ...f, password: e.target.value })) }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
							Register
						</button>
					</form>
				</div>

				<div className="border-4 border-black p-8 rounded-lg">
					<h2 className="text-2xl font-semibold mb-6">Log in</h2>
					<form onSubmit={ handleLogin } className="space-y-4">
						<input
							name="login-name" type="text" placeholder="name" value={ loginForm.name }
							onChange={ e => setLoginForm(f => ({ ...f, name: e.target.value })) }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<input
							name="login-password" type="password" placeholder="password" value={ loginForm.password }
							onChange={ e => setLoginForm(f => ({ ...f, password: e.target.value })) }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
							Log in
						</button>
					</form>
				</div>
			</div>
		);
	}

	// Handle post update helper function.
	const handleUpdatePost = async (id, title, body) => {
		try {
			// Sends "PUT /edit-post/{id}" with new title/body.
			// Laravel PostController::updatePost validates and saves to database.
			// Returns updated post as JSON (res.data)
			const res = await axiosClient.put(`/edit-post/${id}`, { title, body });
			// prev.map creates new array and finds post where p.id === id (the one being edited), replaces it with
			// res.data (fresh backend data) and resets editing flags.
			// Then, it keeps all other posts unchanged (": p" at the end), and { ...res.data, isEditing: false, ... }
			// merges backend data with UI state reset.
			setPosts(prev => prev.map(p => 
				p.id === id ? { ...res.data, isEditing: false, editTitle: "", editBody: "" } : p
			));
		} catch (error) {
			console.error("Update failed:", error);
			alert("Failed to update post");
		}
	};

	// Attempt to emulate blade template @auth.
	// Else if authenticated, show their username, a form to create a new post, a list of all their
	// posts, and a logout button.
	return (
		<div className="max-w-4xl mx-auto p-8 space-y-8">
			<p className="text-xl font-semibold text-gray-700">
				You are logged in as <span className="font-bold text-blue-600">{ user?.name }</span>
			</p>

			<div className="border-4 border-black p-8 rounded-lg">
				<h2 className="text-2xl font-semibold mb-6">Create a new post</h2>
				<form onSubmit={handleCreatePost}>
					<input
						name="title" type="text" placeholder="post title" value={newPost.title}
						onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
					/>
					<textarea
						name="body" placeholder="body content" value={newPost.body}
						onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))}
						className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-vertical"
					/>
					<button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
						Save post
					</button>
				</form>
			</div>
			{/* You know, this is kinda hard to read. Maybe do something? */}
			<div className="border-4 border-black p-8 rounded-lg">
				<h2 className="text-2xl font-semibold mb-6">All posts</h2>
				{ postsLoading && <p className="text-lg text-gray-500">Loading posts...</p> }
				<div className="space-y-4">
					{posts.map(post => (
						<div
							key={ post.id }
							className="bg-gray-100 p-6 m-0 relative border border-gray-300 rounded-lg shadow-sm"
						>
							{post.isEditing ? (
								// edit form, shows when editing
								<div className="border-2 border-blue-500 p-6 bg-blue-50 rounded-lg">
									<h3 className="text-xl font-semibold mb-4 text-blue-800">Edit Post</h3>
									<input
										type="text" value={ post.editTitle || post.title } placeholder="post title"
										onChange={ (e) => { setPosts(prev => prev.map(
											p => p.id === post.id ? { ...p, editTitle: e.target.value } : p)); }}
										className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-lg"
									/>
									<textarea
										value={ post.editBody || post.body } placeholder="body content"
										onChange={ (e) => { setPosts(prev => prev.map(
											p => p.id === post.id ? { ...p, editBody: e.target.value } : p)); }}
										className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-24 resize-vertical"
									/>
									<div className="flex gap-3 pt-2">
										<button 
											onClick={ () => handleUpdatePost(
												post.id, post.editTitle || post.title, post.editBody || post.body) }
											className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
										>
											Save
										</button>
										<button 
											onClick={ () => { setPosts(prev => prev.map(p => (
												{ ...p, isEditing: false, editTitle: "", editBody: "" }))); }}
											className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
										>
											Cancel
										</button>
									</div>
								</div>
							) : (
								// normal post view
								<>
									<h3 className="text-xl font-semibold mb-3">
										{ post.title } by <span className="text-blue-600 font-bold">{ post.user?.name ?? user.name }</span>
									</h3>
									{/* pre-wrap renders newlines in posts instead of removing them */}
									<div className="whitespace-pre-wrap mb-4 text-gray-800 leading-relaxed">{ post.body }</div>
									<div className="flex gap-3 pt-4">
										<button 
											onClick={ () => { setPosts(prev => prev.map(
												p => p.id === post.id ? { ...p, isEditing: true } : p)); }}
											className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
										>
											Edit
										</button>
										<button 
											onClick={ () => handleDeletePost(post.id) } 
											className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
										>
											Delete
										</button>
									</div>
								</>
							)}
						</div>
					))}
				</div>
			</div>
			<form onSubmit={ handleLogout } className="text-center">
				<button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
					Log out
				</button>
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
