export default function NewPostForm({
	newPost,
	setNewPost,
	onSubmit,
	error,
}) {
	return (
		<div className="border p-8 rounded-lg">
			<h2 className="text-2xl font-semibold mb-6">New post</h2>
			<form onSubmit={onSubmit}>
				<textarea
					value={newPost.body} maxLength={400} placeholder="Things beyond your screen..."
					onChange={e => setNewPost({body: e.target.value})}
					className="w-full p-4 border border-gray-300 rounded-lg resize-none"
				/>
				<p className="text-sm text-gray-500">{newPost.body.length}/400</p>
				<br/>
				<button
					className={"w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 " +
						"cursor-pointer transition-colors font-semibold"}
				>
					Save post
				</button>
				{error && <p className="text-red-500 font-semibold">{error}</p>}
			</form>
		</div>
	);
}