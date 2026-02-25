<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>CRUD application</title>
	@vite(['resources/css/app.css', 'resources/js/app.js'])
	{{-- <script type="text/javascript" src="{{ asset('js/scripts.js') }}"></script> --}}
</head>
<body>
	@auth	{{-- if user is authenticated --}}
		<p>you are logged in</p>

		<div class="border-10 border-double">
			<h2>Create a new post</h2>
			<form action="/create-post" method="POST">
				{{-- https://en.wikipedia.org/wiki/Cross-site_request_forgery --}}
				{{-- https://laravel.com/docs/12.x/csrf --}}
				@csrf
				<input name="title" type="text" placeholder="post title">
				<textarea name="body"  placeholder="body content..."></textarea>
				<button>Save post</button>
			</form>
		</div>

		<div style="border: 3px solid black;">
			<h2>All posts</h2>
			{{--
			loops through each of your posts
			$posts comes from routes/web.php, at Route::get('/', function () {})
			--}}
			@foreach($posts as $post)
				<div style="background-color: gray; padding: 10px; margin: 10px;">
					{{--
					for the `$post->user->name` part, refer to app\Models\Post.php
					another thing to note is that $post is a Model object and $post['title'] is
					direct column access
					meanwhile, $post->user->name is like an SQL JOIN to a User object and get its
					name property
					$post['user'] won't work because there is no "user" column in posts table
					--}}
					<h3>{{ $post['title'] }} by {{ $post->user->name }}</h3>
					{{ $post['body'] }}
					{{-- $post['id'] works here --}}
					<p><a href="/edit-post/{{ $post->id }}">Edit</a></p>
					<form action="/delete-post/{{ $post->id }}" method="POST">
						@csrf
						@method('DELETE') {{-- because HTML can't do `method="DELETE"` --}}
						<button>Delete</button>
					</form>
				</div>
			@endforeach
		</div>

		<form action="/logout" method="POST">
			@csrf
			<button>Log out</button>
		</form>
	@else	{{-- else don't show that but prompt them to register/log in --}}
		<h1>CRUD application</h1>
		<div style="border: 3px solid black;">
			<h2>Register</h2>
			<form action="/register" method="POST">
				@csrf
				<input name="name" type="text" placeholder="name">
				<input name="email" type="text" placeholder="email">
				<input name="password" type="password" placeholder="password">
				<button>Register</button>
			</form>
		</div>

		<div style="border: 3px solid black;">
			<h2>Log in</h2>
			<form action="/login" method="POST">
				@csrf
				<input name="login-name" type="text" placeholder="name">
				<input name="login-password" type="password" placeholder="password">
				<button>Log in</button>
			</form>
		</div>
	@endauth
</body>
</html>