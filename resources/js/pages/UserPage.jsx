import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../Layout";
import { useAuth } from "../AuthContext";
import NotFound from "./NotFound";
import FeedPostCard from "../components/FeedPostCard";
import ConfirmModal from "../components/ConfirmModal";

export default function UserPage() {
	const { username } = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [user, setUser] = useState(null);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const isEditingAny = posts.some(p => p.isEditing);
	const [confirmState, setConfirmState] = useState({ show: false, message: "", onConfirm: null });

	const openConfirm = (message, onConfirm) => {
		setConfirmState({ show: true, message, onConfirm });
	};

	const closeConfirm = () => {
		setConfirmState({ show: false, message: "", onConfirm: null });
	};

	const handleDelete = id => {
		openConfirm("Delete this post?", async () => {
			await axiosClient.delete(`/delete-post/${id}`);
			setPosts(prev => prev.filter(p => p.id !== id));
			closeConfirm();
		});
	};

	const handleUpdate = async (id, body) => {
		if (!body.trim()) return;
		openConfirm("Save changes to this post?", async () => {
			const res = await axiosClient.put(`/edit-post/${id}`, { body });
			setPosts(prev =>
				prev.map(p => p.id === id ? { ...res.data, isEditing: false, editBody: "" } : p));
			closeConfirm();
		});
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
				<div className="border p-6 rounded-xl bg-white shadow-sm space-y-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">{user.display_name}</h1>
						<p className="text-blue-600 font-medium">@{user.name}</p>
					</div>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p className="text-gray-400">Joined</p>
							<p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
						</div>
						<div>
							<p className="text-gray-400">Posts</p>
							<p className="font-medium">{user.post_count}</p>
						</div>
					</div>
				</div>
				{/* posts */}
				<div className="space-y-4">
					{posts.map(post => (
						<FeedPostCard
							key={post.id}
							post={post}
							user={currentUser}
							navigate={navigate}
							isEditingAny={isEditingAny}
							setPosts={setPosts}
							onDelete={handleDelete}
							onUpdate={handleUpdate}
						/>
					))}
				</div>
				<ConfirmModal
					show={confirmState.show}
					message={confirmState.message}
					onClose={closeConfirm}
					onConfirm={confirmState.onConfirm}
				/>
			</div>
		</Layout>
	);
}