import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../Layout";
import { useAuth } from "../AuthContext";
import NotFound from "./NotFound";

export default function UserPage() {
	const { username } = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const isEditingAny = posts.some(p => p.isEditing);

	const handleUpdate = async (id, body) => {
		if (!body.trim()) return;
		const res = await axiosClient.put(`/edit-post/${id}`, {body});
		setPosts(prev => prev.map(
			p => p.id === id ? { ...res.data, isEditing: false, editBody: "" } : p));
	};

	const handleDelete = async (id) => {
		if (!confirm("Delete this post?")) return;
		await axiosClient.delete(`/delete-post/${id}`);
		setPosts(prev => prev.filter(p => p.id !== id));
	};

	useEffect(() => {
		setLoading(true);
		Promise.all([
			axiosClient.get(`/api/users/${username}`),
			axiosClient.get(`/api/users/${username}/posts`)
		])
			.then(([userRes, postsRes]) => {
				setUser(userRes.data);
				setPosts(postsRes.data.map(p => ({...p, isEditing: false, editBody: ""})));
			})
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, [username]);

	if (loading) return <div className="p-8">Loading...</div>;
	if (!loading && !user) return <NotFound/>;

	return (
		<Layout>
			<div className="space-y-6">
				{/* user header */}
				<div className="border p-6 rounded-lg bg-white">
					<h1 className="text-2xl font-bold">{user.display_name} @{user.name}</h1>
				</div>
				{/* posts */}
				<div className="space-y-4">
					{posts.map(post => (
						<div
							key={post.id}
							className={"bg-gray-100 p-6 m-0 relative border border-gray-300 rounded-lg shadow-sm mb-2 "
								+ (isEditingAny && !post.isEditing ? "opacity-60": "hover:bg-blue-100 cursor-pointer")}
							onClick={e => {
								if (isEditingAny) return;
								if (e.target.closest("[data-no-nav]")) return;
								navigate(`/u/${post.user?.name}/${post.id}`);
							}}
						>
							<h3 className="text-sm text-gray-500 mb-2">{new Date(post.created_at).toLocaleString()}</h3>
							{!post.isEditing && (<div className="whitespace-pre-wrap">{post.body}</div>)}
							{post.isEditing ? (
								<div data-no-nav>
									<textarea
										className="w-full p-4 border rounded-lg" value={post.editBody ?? post.body}
										onChange={e => setPosts(prev => prev.map(
											p => p.id === post.id ? {...p, editBody: e.target.value} : p))}
									/>
									<div className="flex gap-3 mt-2">
									<button
										className={"flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg " +
											"hover:bg-blue-700 cursor-pointer transition-colors font-semibold"}
										onClick={() => handleUpdate(post.id, post.editBody ?? "")}
									>
										Save
									</button>
									<button
										className={"px-4 py-2 border border-gray-300 text-gray-700 cursor-pointer " +
											"rounded-lg hover:bg-gray-50 transition-colors"}
										onClick={() => setPosts(prev => prev.map(
											p => p.id === post.id ? {...p, isEditing: false} : p))}
									>
										Cancel
									</button>
									</div>
								</div>
							) : (
								post.user_id === currentUser?.id && (
									<div className="flex gap-3 pt-3">
									<button
										className="text-yellow-600 hover:underline cursor-pointer" data-no-nav
										onClick={() => setPosts(prev => prev.map(
											p => p.id === post.id ? {...p, isEditing: true, editBody: p.body} : p))}
									>
										Edit
									</button>
									<button
										className="text-red-600 hover:underline cursor-pointer" data-no-nav
										onClick={() => handleDelete(post.id)}
									>
										Delete
									</button>
									</div>
								)
							)}
						</div>
					))}
				</div>
			</div>
		</Layout>
	);
}