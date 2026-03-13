import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

// This is a custom React hook that fetches and manages posts from your Laravel API.
// `enabled` controls when to fetch posts (only runs when true)
export function usePosts(enabled) {
	const [posts, setPosts] = useState([]);			// array of post data
	const [loading, setLoading] = useState(false);	// loading spinner state

	useEffect(() => {
		if (!enabled)	// skip if not authenticated
			return;

		setLoading(true);
		axiosClient.get("/posts")				// fetch from Laravel /posts route
			.then(res => setPosts(res.data))	// store posts
			.finally(() => setLoading(false));	// always stop loading
	}, [enabled]);	// rerun only when `enabled` changes

	// return an object containing all the hook's state and functions
	return { posts, setPosts, loading };
}
