<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Edit post</title>
</head>
<body>
	<h1>Edit post</h1>
	{{--
	$post comes from `Route::get("/edit-post/{post}", [PostController::class, 'showEditScreen']);`
	so if id = 3, then action becomes "/edit-post/3"
	--}}
	<form action="/edit-post/{{ $post->id }}" method="POST">
		{{-- https://laravel.com/docs/12.x/csrf --}}
		@csrf
		{{-- HTML forms only do GET/POST, Laravel tricks it into treating it as a PUT request --}}
		@method('PUT')
		{{-- prepopulate the forms with post data because we're editing it now --}}
		<input type="text" name="title" value="{{ $post->title }}">
		<textarea name="body">{{ $post->body }}</textarea>
		<button>Save changes</button>
	</form>
</body>
</html>