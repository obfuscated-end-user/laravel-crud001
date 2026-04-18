import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../Layout";
import { useAuth } from "../AuthContext";
import NotFound from "./NotFound";

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
			.then(res => setPost(res.data))
			.catch(() => setPost(null))
			.finally(() => setLoading(false));
	}, [postId]);

	if (loading) return <div className="p-8">Loading...</div>;
	if (!loading && !post) return <NotFound/>;

	return (
		<Layout>
			<div className="space-y-6">
				{/* post */}
				<div className="bg-gray-100 p-6 border rounded-lg">
					<h3 className="mb-2">
						<span
							onClick={() => navigate(`/u/${post.user?.name}`)}
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
					{isEditing?(
						<div className="border-2 border-blue-500 p-6 bg-blue-50 rounded-lg">
							<h3 className="text-xl font-semibold mb-4 text-blue-800">Edit post</h3>
							<textarea 
								value={editBody} onChange={e => setEditBody(e.target.value)}
								className="w-full p-4 border border-gray-300 rounded-lg resize-none"
							/>
							<p className="text-sm text-gray-500">{editBody.length}/400</p>
							<div className="flex gap-3 mt-2">
							<button 
								onClick={handleUpdate}
								className={"flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg " +
									"hover:bg-blue-700 cursor-pointer transition-colors font-semibold"}
							>
								Save
							</button>
							<button 
								onClick={() => setIsEditing(false)}
								className={"px-4 py-2 border border-gray-300 text-gray-700 " +
									"cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"}
							>
								Cancel
							</button>
							</div>
						</div>
					) : (
						<div
							className="whitespace-pre-wrap mb-4 text-gray-800 leading-relaxed"
						>
							{post.body}
						</div>
					)}
					{post.user_id === currentUser?.id && !isEditing && (
						<div className="flex gap-3 pt-4">
							<button
								className="text-yellow-600 hover:underline cursor-pointer"
								onClick={() => {setIsEditing(true); setEditBody(post.body);}}
							>
								Edit
							</button>
							<button
								onClick={handleDelete}
								className="text-red-600 hover:underline cursor-pointer"
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