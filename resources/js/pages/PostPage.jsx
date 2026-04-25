import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../Layout";
import { useAuth } from "../AuthContext";
import NotFound from "./NotFound";
import PostEditor from "../components/PostEditor";
import ConfirmModal from "../components/ConfirmModal";

export default function PostPage() {
	const { username, postId } = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editBody, setEditBody] = useState("");
	const [confirmState, setConfirmState] = useState({ show: false, message: "", onConfirm: null });

	const handleDelete = () => {
		openConfirm("Delete this post?", async () => {
			await axiosClient.delete(`/delete-post/${post.id}`);
			navigate(`/${username}`);
			closeConfirm();
		});
	};

	const handleUpdate = () => {
		if (!editBody.trim()) return;
		openConfirm("Save changes to this post?", async () => {
			try {
				const res = await axiosClient.put(`/edit-post/${post.id}`, { body: editBody });
				setPost(res.data);
				setIsEditing(false);
			} catch (err) {
				alert("Failed to update post");
			}
		});
	};

	const openConfirm = (message, onConfirm) => {
		setConfirmState({ show: true, message, onConfirm });
	}

	const closeConfirm = () => {
		setConfirmState({ show: false, message: "", onConfirm: null });
	}

	useEffect(() => {
		setLoading(true);
		axiosClient.get(`/api/posts/${postId}`)
			.then(res => setPost(res.data))
			.catch(() => setPost(null))
			.finally(() => setLoading(false));
	}, [postId]);

	if (loading) return <div className="p-8">Loading...</div>;
	if (!loading && !post) return <NotFound/>;

	return (
		<Layout>
			<div className="bg-gray-100 p-6 border rounded-lg">
				{isEditing ? (
					<PostEditor
						value={editBody} setValue={setEditBody} onSave={handleUpdate}
						onCancel={() => setIsEditing(false)}
					/>
				) : (
					<>
						<h3 className="mb-2">
							<span
								onClick={() => navigate(`/u/${post.user?.name}`)}
								className="text-blue-600 font-bold cursor-pointer hover:underline"
							>
								{post.user?.display_name}@{post.user?.name}
							</span>
						</h3>

						<p className="text-sm text-gray-500 mb-3">
							{new Date(post.created_at).toLocaleString()}
							{post.updated_at !== post.created_at && (
								<><br/>{"last edited at " + new Date(post.updated_at).toLocaleString()}</>
							)}
						</p>

						<div className="whitespace-pre-wrap mb-4 text-gray-800 leading-relaxed">
							{post.body}
						</div>
						{post.user_id === currentUser?.id && (
							<div className="flex gap-3 pt-4">
								<button
									className="text-yellow-600 hover:underline cursor-pointer"
									onClick={() => {setIsEditing(true); setEditBody(post.body);}}
								>
									Edit
								</button>

								<button
									onClick={handleDelete} className="text-red-600 hover:underline cursor-pointer"
								>
									Delete
								</button>
							</div>
						)}
					</>
				)}
			</div>
			<ConfirmModal
				show={confirmState.show} message={confirmState.message} onClose={closeConfirm}
				onConfirm={confirmState.onConfirm}
			/>
		</Layout>
	);
}