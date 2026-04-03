import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../Layout";
import { useAuth } from "../AuthContext";

export default function PostPage() {
	const { username, postId } = useParams();
	const navigate = useNavigate();
	const { user: currentUser } = useAuth();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editBody, setEditBody] = useState("");

	const handleDelete = async () => {
		if (!confirm("Delete this post?")) return;
		await axiosClient.delete(`/delete-post/${post.id}`);
		navigate(`/${username}`);
	}

	const handleUpdate = async () => {
		if (!editBody.trim()) return;
		const res = await axiosClient.put(`/edit-post/${post.id}`, {body: editBody});
		setPost(res.data);
		setIsEditing(false);
	}

	useEffect(() => {
		setLoading(true);
		axiosClient.get(`/api/posts/${postId}`)
			.then(res => {
				setPost(res.data);
			})
			.finally(() => setLoading(false));
	}, [postId]);

	if (loading) return <div className="p-8">Loading...</div>;
	if (!post) return <div className="p-8">Post not found</div>;

	return (
		<Layout>
			<div className="space-y-6">
				<button onClick={ () => navigate(`/${username}`) } className="text-blue-600 hover:underline">
					&lt;&lt; back
				</button>
				{/* post */}
				<div className="bg-gray-100 p-6 border rounded-lg">
					<h3 className="mb-2">
						<span
							onClick={() => navigate(`/${post.user?.name}`)}
							className="text-blue-600 font-bold cursor-pointer hover:underline"
						>
							{post.user?.display_name} @{post.user?.name}
						</span>
					</h3>
					<p className="text-sm text-gray-500 mb-3">
						{new Date(post.created_at).toLocaleString()}
						{post.updated_at !== post.created_at && (
							<><br/>{"last edited at " + new Date(post.updated_at).toLocaleString()}</>
						)}
					</p>
					{isEditing ? (
						<div>
							<textarea
								value={editBody} onChange={e => setEditBody(e.target.value)}
								className="w-full p-4 border rounded-lg"
							/>
							<div className="flex gap-3 mt-2">
								<button onClick={handleUpdate} className="text-blue-600">Save</button>
								<button onClick={() => setIsEditing(false)} className="text-gray-600">Cancel</button>
							</div>
						</div>
					) : (
						<div className="whitespace-pre-wrap mb-4">{post.body}</div>
					)}
					{post.user_id === currentUser?.id && (
						<div className="flex gap-3">
							<button
								className="text-yellow-600 hover:underline cursor-pointer"
								onClick={() => {setIsEditing(true); setEditBody(post.body);}}
							>
									Edit
							</button>
							<button
								className="text-red-600 hover:underline cursor-pointer"
								onClick={handleDelete}
							>
								Delete
							</button>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
}