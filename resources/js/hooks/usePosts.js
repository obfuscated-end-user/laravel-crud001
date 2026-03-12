import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export function usePosts(enabled) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!enabled)
			return;

		setLoading(true);
		axiosClient.get("/posts")
			.then(res => setPosts(res.data))
			.finally(() => setLoading(false));
	}, [enabled]);

	return { posts, setPosts, loading };
}
