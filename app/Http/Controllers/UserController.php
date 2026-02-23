<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\User;

class UserController extends Controller {
	public function register(Request $request) {
		// validate the registration data
		// if the validation fails, Laravel won't move past this line
		$incomingFields = $request->validate([
			// Rule::unique(table, column) says that this must be unique, no duplicates
			'name' => ['required', 'min:3', 'max:10', Rule::unique('users', 'name')],	// length must be 3-10 characters
			'email' => ['required', 'email', Rule::unique('users', 'email')],	// must look like an email
			'password' => ['required', 'min:8', 'max:200'],	// length must be 8-200 characters
		]);

		// you don't want to store your passwords in plaintext, so you hash them first before
		// storing it in your database
		$incomingFields['password'] = bcrypt($incomingFields['password']);

		// a Model is like a way of mapping out a data for an item, Laravel already did this for you
		// so you get the data that was typed by the user before, and store it in your database
		$user = User::create($incomingFields);

		// log the user in
		auth()->guard()->login($user);
		return redirect('/');
	}

	public function login(Request $request) {
		$incomingFields = $request->validate([
			'login-name' => 'required',
			'login-password' => 'required'
		]);

		// check if name and password is in the database
		if (auth()->guard()->attempt(['name' => $incomingFields['login-name'], 'password' => $incomingFields['login-password']])) {
			// generate a session and a cookie
			$request->session()->regenerate();
		}

		return redirect('/');
	}

	public function logout() {
		// log this user out
		auth()->guard()->logout();
		return redirect('/');
	}
}
