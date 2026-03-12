<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// A Laravel Model is a PHP class that represents one database table. Think of it as "your database
// table, but as a smart PHP object", instead of raw SQL Queries.
// The Post model handles post data.
class Post extends Model {
	// Add factory support to your model, it lets you generate fake test data automatically.
	// I think your app will work fine without it, I just left it because it was already in here.
	// https://laravel.com/docs/12.x/eloquent-factories
	use HasFactory;

	// This is a security whitelist that tells Laravel "these fields are safe to fill from user
	// input all at once".
	// Read more here to see what this measure prevents:
	// https://laravel.com/docs/12.x/eloquent#mass-assignment
	// https://stackoverflow.com/questions/22279435/what-does-mass-assignment-mean-in-laravel
	protected $fillable = ['title', 'body', 'user_id'];

	public function user() {
		// Return a blog Post (this file) that belongs to a User', and `user_id` belongs to the
		// Post table.
		// Laravel will write the SQL statement and perform the JOIN for us.
		return $this->belongsTo(User::class, 'user_id');
	}
}
