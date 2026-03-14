import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Finds <div id="root">...</div> in app.blade.php, and create a React root for that DOM node.
// https://react.dev/reference/react/StrictMode
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
