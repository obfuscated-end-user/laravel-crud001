<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller {
	public function createPost(Request $request) {
		$incomingFields = $request->validate([
			'title' => 'required',
			'body' => 'required'
		]);

		// strip any potential html and php stuff the user might enter
		$incomingFields['title'] = strip_tags($incomingFields['title']);
		$incomingFields['body'] = strip_tags($incomingFields['body']);
		// use the current user's id as `user_id`
		$incomingFields['user_id'] = auth()->guard()->id();

		// use Post model to create this field
		Post::create($incomingFields);
		return redirect('/');
	}
}
