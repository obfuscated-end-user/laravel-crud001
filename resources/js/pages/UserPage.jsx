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
	useEffect(() => {
		setLoading(true);
		Promise.all([
			axiosClient.get(`/api/users/${username}`),
			axiosClient.get(`/api/users/${username}/posts`)
		])
			.then(([userRes, postsRes]) => {
				setUser(userRes.data);
				setPosts(postsRes.data);
			})
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, [username]);

	if (loading) return <div className="p-8">Loading...</div>;
	if (!loading && !user) return <NotFound />;

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
							key={post.id} className="bg-gray-100 p-6 border rounded-lg cursor-pointer"
							onClick={e => {
								if (e.target.closest("[data-no-nav]")) return;
								navigate(`/u/${post.user?.name}/${post.id}`);
							}}
						>
							<h3 className="text-sm text-gray-500 mb-2">{new Date(post.created_at).toLocaleString()}</h3>
							<div className="whitespace-pre-wrap">{post.body}</div>
							{post.user_id === currentUser?.id && (
								<div className="flex gap-3 pt-3">
									<button data-no-nav className="text-yellow-600">Edit</button>
									<button data-no-nav className="text-red-600">Delete</button>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</Layout>
	);
}