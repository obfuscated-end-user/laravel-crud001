<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

// The PostController handles all post-related web requests, (create, edit, update, delete).
class PostController extends Controller {
	// create a new post
	public function createPost(Request $request) {
		// checks if 'title' and 'body' are filled, see the forms at home.blade.php and its
		// corresponding name attributes
		$incomingFields = $request->validate([
			'title' => 'required',
			'body' => 'required'
		]);

		// strip any potential HTML and PHP stuff the user might enter
		$incomingFields['title'] = strip_tags($incomingFields['title']);
		$incomingFields['body'] = strip_tags($incomingFields['body']);
		// use the current user's id as `user_id`
		$incomingFields['user_id'] = auth()->guard()->id();

		// use Post model to create this field and save to database
		Post::create($incomingFields);
		return redirect('/');
	}

	// shows the edit form, Laravel finds the post automatically by ID from the URL
	public function showEditScreen(Post $post) {
		// to prevent unauthorized users entering this page (ex. not the author of this post)
		if (auth()->guard()->user()->id !== $post['user_id']) {
			return redirect('/');
		}
		// if the name you chose for the post variable (`$post`) matches the dynamic part of your
		// URL, Laravel is going to perform the database lookup automatically
		// to be fair, i don't know what this would look like if they weren't the same
		// load edit-post.blade.php with post data
		return view('edit-post', ['post' => $post]);
	}

	// saves edited posts
	// $post is the post we're trying to update and $request gives us the incoming form data,
	// whatever the user typed in for their new values
	public function updatePost(Post $post, Request $request) {
		// check if they have authorization doing this
		if (auth()->guard()->user()->id !== $post['user_id']) {
			return redirect('/');
		}

		// check if these are filled in
		$incomingFields = $request->validate([
			'title' => 'required',
			'body' => 'required'
		]);

		$incomingFields['title'] = strip_tags($incomingFields['title']);
		$incomingFields['body'] = strip_tags($incomingFields['body']);

		// update the post with the values provided
		$post->update($incomingFields);

		return redirect('/');
	}

	public function deletePost(Post $post) {
		// if you are the author of this post
		if (auth()->guard()->user()->id === $post['user_id']) {
			// then actually delete the post
			$post->delete();
		}
		// else do nothing
		return redirect('/');
	}
}
