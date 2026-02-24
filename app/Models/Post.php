<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model {
	use HasFactory;

	protected $fillable = ['title', 'body', 'user_id'];

	public function user() {
		// return a "blog Post (this file) that belongs to a User', and `user_id` belongs to the
		// Post table
		// Laravel will write the SQL statement and perform the JOIN for us
		return $this->belongsTo(User::class, 'user_id');
	}
}
