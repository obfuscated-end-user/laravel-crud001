import axios from "axios";

// This creates a reusable Axios HTTP client for your React app to "talk" to Laravel.
const axiosClient = axios.create({
	baseURL: "http://127.0.0.1:8000",	// all requests go to Laravel server
	withCredentials: true,				// send/receive Laravel session cookies
});

export default axiosClient;
