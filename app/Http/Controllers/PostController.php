<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

// The PostController handles all post-related web requests, (create, edit, update, delete).
class PostController extends Controller {
	// Create a new post.
	public function createPost(Request $request) {
		// Checks if 'title' and 'body' are filled, see the forms at home.blade.php and its
		// corresponding name attributes.
		// https://api.laravel.com/docs/12.x/Illuminate/Http/Request.html#method_validate
		$incomingFields = $request->validate([
			'title' => 'required',
			'body' => 'required'
		]);

		// Strip any potential HTML and PHP stuff the user might enter.
		// https://www.php.net/manual/en/function.strip-tags.php
		$incomingFields['title'] = strip_tags($incomingFields['title']);
		$incomingFields['body'] = strip_tags($incomingFields['body']);
		// use the current user's id as `user_id`
		$incomingFields['user_id'] = auth()->guard()->id();

		// Use Post model to create this field and save to database.
		// I think this is it here?
		// https://api.laravel.com/docs/12.x/Illuminate/Database/Eloquent/Builder.html#method_create
		Post::create($incomingFields);
		return redirect('/');
	}

	// Shows the edit form, Laravel finds the post automatically by ID from the URL.
	public function showEditScreen(Post $post) {
		// To prevent unauthorized users entering this page (ex. not the author of this post),
		if (auth()->guard()->user()->id !== $post['user_id'])
			// redirect them back to the home page.
			return redirect('/');

		// Because the route uses {post} and the controller parameter is type-hinted as Post $post,
		// Laravel automatically performs "route model binding". It fetches the Post with the given
		// ID and injects it into this method.
		// More on that here: https://laravel.com/docs/10.x/routing#route-model-binding

		// I know that you don't literally pass the value 7 as $post, but instead, it does something
		// like this behind the scenes:
		// $post = Post::findOrFail(7);
		// which then returns a Post object with relevant data.

		// To be fair, I don't know what this would look like if they weren't the same.
		return view('edit-post', ['post' => $post]);
	}

	// Saves edited posts.
	// $post is the post we're trying to update and $request gives us the incoming form data,
	// whatever the user typed in for their new values.
	public function updatePost(Post $post, Request $request) {
		if (auth()->guard()->user()->id !== $post['user_id'])
			return redirect('/');

		$incomingFields = $request->validate([
			'title' => 'required',
			'body' => 'required'
		]);

		$incomingFields['title'] = strip_tags($incomingFields['title']);
		$incomingFields['body'] = strip_tags($incomingFields['body']);

		// Update the post with the values provided.
		// https://api.laravel.com/docs/12.x/Illuminate/Database/Eloquent/Builder.html#method_update
		$post->update($incomingFields);

		return redirect('/');
	}

	public function deletePost(Post $post) {
		// if you are the author of this post
		if (auth()->guard()->user()->id === $post['user_id'])
			// then actually delete the post
			$post->delete();
		// else do nothing
		return redirect('/');
	}
}
