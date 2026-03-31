import React, { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import axiosClient from "./api/axiosClient";
import { usePosts } from "./hooks/usePosts";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";

// This is the main React app component that shows the login/register UI when the user is not
// authenticated, the post creation and post list UI when the user is logged in.

// The main sscreen that changes its layout depending on whether you're logged in or not.
function Home() {
	// go to AuthContext.jsx, auth state
	const {
		authenticated, loading, user, login, register, logout, loggingIn, registering, loginError,
		registerError, setLoginError, setRegisterError
	} = useAuth();
	// go to hooks\usePosts.js, posts state
	// local states that hold what the user types in forms
	const [registerForm, setRegisterForm] = useState({
		name: "",
		display_name: "",
		email: "",
		password: ""
	});
	const [loginForm, setLoginForm] = useState({ name: "", password: "" });
	const [newPost, setNewPost] = useState({ body: "" });
	const [confirmState, setConfirmState] = useState({ show: false, message: "", onConfirm: null });
	const [formError, setFormError] = useState("");
	const [view, setView] = useState("feed");	// "feed"/"user"
	const [selectedUserId, setSelectedUserId] = useState(null);
	// this has to be at the bottom
	const { posts, setPosts, loading: postsLoading } = usePosts(authenticated, view, selectedUserId);
	const navigate = useNavigate();

	const openConfirm = (message, onConfirm) => {
		setConfirmState({ show: true, message, onConfirm });
	};

	const closeConfirm = () => {
		setConfirmState({ show: false, message: "", onConfirm: null });
	};

	const handleRegister = async (e) => {
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

		if (!newPost.body.trim()) {
			setFormError("Content is required");
			return;
		}

		openConfirm("Create this post?", async () => {
			// Sends "POST /create-post" with the new body.
			// DO NOT REMOVE res!
			// const res = await axiosClient.post("/create-post", newPost);
			const res = await axiosClient.post("/create-post", { body: newPost.body });
			// setPosts(prev => [res.data, ...prev]);	// Adds the returned post to the list at the top.
			// refetch posts to get complete data w/ user relationship
			setPosts(await (await axiosClient.get("/posts")).data);
			setNewPost({ body: "" });	// Clear the form.
			closeConfirm();
		});
		
	};

	const handleDeletePost = async (id) => {
		openConfirm("Are you sure you want to delete this post?", async () => {
			await axiosClient.delete(`/delete-post/${id}`);		// "DELETE /delete-posts/${id}"
			setPosts(prev => prev.filter(p => p.id !== id));	// Removes that post from the list.
			closeConfirm();
		});
	};

	// This part consists of the HTML stuff, and some lines tend to get very long.
	// Consider this to be an exception to the "100-char rule".

	// Show "Loading..." while checking if the user is already logged in.
	if (loading) return <div className="text-center p-8 text-xl">Loading...</div>;

	// If not authenticated, show a register and login form.
	if (!authenticated) {
		return (
			<div className="max-w-2xl mx-auto p-8 space-y-8">
				<h1 className="text-4xl font-bold text-center mb-12">Outside</h1>
				<div className="border-4 border-black p-8 rounded-lg">
					<h2 className="text-2xl font-semibold mb-6">Register</h2>
					<form onSubmit={ handleRegister } className="space-y-4">
						<input
							name="name" type="text" placeholder="name" value={ registerForm.name } disabled={ registering }
							onChange={ e => { setRegisterForm(f => ({ ...f, name: e.target.value })); setRegisterError(null); } }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<input
							name="display_name" type="text" placeholder="display name" value={ registerForm.display_name } disabled={ registering }
							onChange={ e => { setRegisterForm(f => ({ ...f, display_name: e.target.value })); setRegisterError(null); } }
							className="w-full p-3 border border-gray-300 rounded-lg"
						/>
						<input
							name="email" type="text" placeholder="email" value={ registerForm.email }
							onChange={ e => { setRegisterForm(f => ({ ...f, email: e.target.value })); setRegisterError(null); } } disabled={ registering }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<input
							name="password" type="password" placeholder="password" value={ registerForm.password } disabled={ registering }
							onChange={ e => { setRegisterForm(f => ({ ...f, password: e.target.value })); setRegisterError(null); } }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button disabled={ registering } className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-semibold">
							{ registering ? "Registering..." : "Register" }
						</button>
						{ registerError && <p className="text-red-500 mb-3 font-semibold">{ registerError }</p> }
					</form>
				</div>

				<div className="border-4 border-black p-8 rounded-lg">
					<h2 className="text-2xl font-semibold mb-6">Log in</h2>
					<form onSubmit={ handleLogin } className="space-y-4">
						<input
							name="login-name" type="text" placeholder="name" value={ loginForm.name } disabled={ loggingIn }
							onChange={ e => setLoginForm(f => ({ ...f, name: e.target.value })) }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<input
							name="login-password" type="password" placeholder="password" value={ loginForm.password }
							onChange={ e => setLoginForm(f => ({ ...f, password: e.target.value })) } disabled={ loggingIn }
							className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button disabled={ loggingIn } className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 cursor-pointer transition-colors font-semibold">
							{ loggingIn ? "Logging in..." : "Log in" }
						</button>
						{ loginError && <p className="text-red-500 mb-3 font-semibold">{ loginError }</p> }
					</form>
				</div>
			</div>
		);
	}

	// Handle post update helper function.
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
					p.id === id ? { ...res.data, isEditing: false, editBody: "" } : p
				));
				closeConfirm();
			} catch (err) {
				alert("Failed to update post.");
			}
		});
	};

	// Attempt to emulate blade template @auth. If authenticated, show their username, a form to
	// create a new post, a list of all their posts.
	return (
		<Layout>
			<div className="p-8 space-y-8">
				<p className="text-xl font-semibold text-gray-700">
					You are logged in as <span className="font-bold text-blue-600">{ user?.name }</span>
				</p>

				<div className="border-1 p-8 rounded-lg">
					<h2 className="text-2xl font-semibold mb-6">New post</h2>
					<form onSubmit={handleCreatePost}>
						<textarea
							name="body" placeholder="Things beyond your screen..." value={ newPost.body } maxLength={ 400 }
							onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))}
							className="w-full p-4 border border-gray-300 rounded-lg resize-none"
						/>
						<p className="text-sm text-gray-500">
							{newPost.body.length}/400
						</p><br/>
						<button className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 cursor-pointer transition-colors font-semibold">
							Save post
						</button>
						{ formError && <p className="text-red-500 mb-3 font-semibold">{ formError }</p> }
					</form>
				</div>
				{/* You know, this is kinda hard to read. Maybe do something? */}
				<div className="rounded-lg">
					{ view === "user" && (
						<button
							onClick={() => {setView("feed"); setSelectedUserId(null);}}
							className="mb-4 text-blue-600 hover:underline"
						>
							&lt;&lt; back
						</button>
					)}
					{postsLoading && <p className="text-lg text-gray-500">Loading posts...</p>}
					<div className="space-y-4">
						{posts.map(post => (
							<div
								key={post.id}
								onClick={(e) => {
									if (e.target.closest("[data-no-nav]")) return;
									navigate(`/${post.user?.name}/${post.id}`);
								}}
								className="bg-gray-100 p-6 m-0 relative border border-gray-300 rounded-lg shadow-sm mb-2"
							>
								{post.isEditing ? (
									// edit form, shows when editing
									<div
										className="border-2 border-blue-500 p-6 bg-blue-50 rounded-lg" data-no-nav
										onClick={(e) => e.stopPropagation()}
									>
										<h3 className="text-xl font-semibold mb-4 text-blue-800">Edit post</h3>
										<textarea
											value={ post.editBody || post.body } placeholder="body content"
											onChange={(e) => { setPosts(prev => prev.map(p => p.id === post.id ? {...p, editBody: e.target.value} : p));}}
											className="w-full p-4 border border-gray-300 rounded-lg resize-none"
										/>
										<div className="flex gap-3 pt-2">
											<button 
												onClick={() => handleUpdatePost(post.id, post.editBody || post.body)}
												className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-semibold"
											>
												Save
											</button>
											<button 
												onClick={() => {setPosts(prev => prev.map(p => ({...p, isEditing: false, editBody: ""})));}}
												className="px-4 py-2 border border-gray-300 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									// normal post view
									<>
										<h3 className="text-xl font-semibold mb-3">
											<span
												onClick={(e) => {e.stopPropagation(); navigate(`/${post.user?.name}`);}}
												className="text-blue-600 font-bold cursor-pointer hover:underline"
											>
												{post.user?.display_name} @{post.user?.name}
											</span>&nbsp;
											<span className="text-sm text-gray-500 mb-2">
												{new Date(post.created_at).toLocaleString()}
												{post.updated_at !== post.created_at && (
													<>{", last edited at " + new Date(post.updated_at).toLocaleString()}</>
												)}
											</span>
										</h3>
										{/* pre-wrap renders newlines in posts instead of removing them */}
										<div className="whitespace-pre-wrap mb-4 text-gray-800 leading-relaxed">{ post.body }</div>
										{/* this should only appear if a post author and current logged in user is the same */}
										{post.user_id === user?.id && (
											<div className="flex gap-3 pt-4">
												<button
													data-no-nav className="text-yellow-600 hover:underline cursor-pointer"
													onClick={(e) => {
														e.stopPropagation();
														setPosts(prev => prev.map(
															p => p.id === post.id ? { ...p, isEditing: true } : p));}}
												>
													Edit
												</button>
												<button
													data-no-nav className="text-red-600 hover:underline cursor-pointer"
													onClick={(e) => {e.stopPropagation(); handleDeletePost(post.id)}}
												>
													Delete
												</button>
											</div>
										)}
									</>
								)}
							</div>
						))}
					</div>
				</div>
				{/* Confirmation modal */}
				{confirmState.show && (
					<div
						className="fixed inset-0 flex items-center justify-center bg-black/50"
						data-no-nav
						onClick={closeConfirm}
					>
						<div
							className="bg-white p-6 rounded-lg shadow-lg w-80"
							onClick={(e) => e.stopPropagation()}
						>
							<p className="text-lg mb-4">{confirmState.message}</p>
							<div className="flex justify-end gap-3">
								<button onClick={closeConfirm} className="px-4 py-2 border rounded cursor-pointer">Cancel</button>
								<button onClick={confirmState.onConfirm} className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded">Confirm</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}

// Wraps the Home component with <AuthProvider>, so the whole app can read the auth state (useAuth).
export default function Root() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/" element={ <Home/> }/>
				<Route path="/:username" element={ <UserPage/> }/>
				<Route path="/:username/:postId" element={ <PostPage/> }/>
			</Routes>
		</AuthProvider>
	);
}
