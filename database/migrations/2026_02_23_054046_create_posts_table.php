<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 */
	public function up(): void {
		// create a "posts" table with columns:
		Schema::create('posts', function (Blueprint $table) {
			$table->id();	// id (auto-incrementing primary key)
			$table->timestamps();	// created_at/updated_at for timestamps
			$table->string('title');	// title (short text)
			$table->longText('body');	// body (long text)
			$table->foreignId('user_id')->constrained();	// user_id (foreign key linking to users table)
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void {
		// this is the "undo" method, it reverses exactly what up() did
		// deletes the entire `posts` table from your database
		Schema::dropIfExists('posts');
	}
};
