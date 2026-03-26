import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

// This is a custom React hook that fetches and manages posts from your Laravel API.
// `enabled` controls when to fetch posts (only runs when true)
export function usePosts(enabled, view, selectedUserId) {
	const [posts, setPosts] = useState([]);			// array of post data
	const [loading, setLoading] = useState(false);	// loading spinner state

	useEffect(() => {
		if (!enabled) return;	// skip if not authenticated
		setLoading(true);
		const url = view === "feed" ? "/posts" : `/users/${selectedUserId}/posts`;
		axiosClient.get(url)	// fetch from Laravel /posts route or a single user, /user
			.then(res => setPosts(res.data))	// store posts
			.finally(() => setLoading(false));	// always stop loading
	}, [enabled, view, selectedUserId]);

	// return an object containing all the hook's state and functions
	return { posts, setPosts, loading };
}
