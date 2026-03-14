<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\User;

class UserController extends Controller {
	public function register(Request $request) {
		// Validate the registration data.
		// If the validation fails, Laravel won't move past this line.
		$incomingFields = $request->validate([
			// Rule::unique(table, column) says that this must be unique, no duplicates.
			// https://api.laravel.com/docs/12.x/Illuminate/Validation/Rule.html#method_unique
			'name' => ['required', 'min:3', 'max:10', Rule::unique('users', 'name')],	// length must be 3-10 characters
			'email' => ['required', 'email', Rule::unique('users', 'email')],	// must look like an email
			'password' => ['required', 'min:8', 'max:200']	// length must be 8-200 characters
		]);

		// You don't want to store your passwords in plaintext, so you hash them first before
		// storing it in your database.
		// https://www.php.net/manual/en/function.password-hash.php
		$incomingFields['password'] = bcrypt($incomingFields['password']);

		// A Model is like a way of mapping out a data for an item, Laravel already did this for you
		// so you get the data that was typed by the user before, and store it in your database.
		$user = User::create($incomingFields);

		// Log the user in and return a response.
		// https://laravel.com/docs/12.x/responses
		auth()->guard()->login($user);
		return response()->json([
			'user' => $user,
			'authenticated' => true
		], 201);
	}

	public function login(Request $request) {
		$incomingFields = $request->validate([
			'login-name' => 'required',
			'login-password' => 'required'
		]);

		// Check if name and password is in the database.
		// https://api.laravel.com/docs/12.x/Illuminate/Contracts/Auth/StatefulGuard.html#method_attempt
		if (auth()->guard()->attempt([
			'name' => $incomingFields['login-name'],
			'password' => $incomingFields['login-password']
		])) {
			// Create a new session ID for the user.
			// https://laravel.com/docs/12.x/session#regenerating-the-session-id
			// https://api.laravel.com/docs/12.x/Illuminate/Contracts/Session/Session.html#method_regenerate
			$request->session()->regenerate();

			return response()->json([
				'user' => auth()->guard()->user(),
				'authenticated' => true
			]);
		}

		// This will always run if the above attempt fails.
		return response()->json([
			'message' => 'Invalid credentials',
			'authenticated' => false
		], 422);
	}

	public function logout(Request $request) {
		// log this user out
		auth()->guard()->logout();
		$request->session()->invalidate();
		$request->session()->regenerateToken();
		return response()->json(['authenticated' => false]);
	}
}
