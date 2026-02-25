<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// the login methods come from here, stuff like `auth()->guard()->login($user)`, etc.
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// A Laravel Model is a PHP class that represents one database table. Think of it as "your database
// table, but as a smart PHP object", instead of raw SQL Queries.
// The User model handles user data (name, email, and hashed password).
class User extends Authenticatable {
	/** @use HasFactory<\Database\Factories\UserFactory> */
	use HasFactory, Notifiable;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var list<string>
	 */
	protected $fillable = ['name', 'email', 'password'];

	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var list<string>
	 */
	protected $hidden = ['password', 'remember_token'];

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array {
		return [
			'email_verified_at' => 'datetime',
			'password' => 'hashed',
		];
	}

	public function usersPosts() {
		// return a relationship between a user and any blog posts they've created
		return $this->hasMany(Post::class, 'user_id');
	}
}
