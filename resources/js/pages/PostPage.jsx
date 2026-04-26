import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../Layout";
import { useAuth } from "../AuthContext";
import NotFound from "./NotFound";
import PostEditor from "../components/PostEditor";
import ConfirmModal from "../components/ConfirmModal";
import FeedPostCard from "../components/FeedPostCard";

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
			// navigate(`/u/${username}`);
			navigate("/");	// go to home page instead of 404ing
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
			<FeedPostCard
				post={post} user={currentUser} navigate={navigate} isEditingAny={isEditing}
				setPosts={fn => {
						// adapt single post into array-like update
						setPost(prev => {
						const updated = fn([prev])[0];
						return updated;
					});
				}}
				onDelete={() => handleDelete()}
				onUpdate={(id, body) => { setEditBody(body); handleUpdate(); }}
				disableNavigation={true}
			/>
			<ConfirmModal
				show={confirmState.show} message={confirmState.message} onClose={closeConfirm}
				onConfirm={confirmState.onConfirm}
			/>
		</Layout>
	);
}