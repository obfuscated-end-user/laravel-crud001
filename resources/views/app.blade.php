<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>CRUD application</title>
	<meta name="csrf-token" content="{{ csrf_token() }}">
	@viteReactRefresh
	@vite(["resources/css/app.css", "resources/js/main.jsx"])
</head>

<body>
	<div id="root">Loading...</div>
</body>
</html>