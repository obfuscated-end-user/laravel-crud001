export default function FeedPostCard({ post, user, navigate, isEditingAny, setPosts, onDelete, onUpdate }) {
	return (
		<div
			onClick={e => {
				if (isEditingAny) return;
				if (e.target.closest("[data-no-nav]")) return;
				navigate(`/u/${post.user?.name}/${post.id}`);
			}}
			className={
				"bg-gray-100 p-6 m-0 relative border border-gray-300 rounded-lg shadow-sm mb-2 " +
				(isEditingAny && !post.isEditing ? "opacity-60" : "hover:bg-blue-100 cursor-pointer")
			}
		>
			{post.isEditing ? (
				<div
					className="border-2 border-blue-500 p-6 bg-blue-50 rounded-lg" data-no-nav
					onClick={e => e.stopPropagation()}
				>
					<h3 className="text-xl font-semibold mb-4 text-blue-800">Edit post</h3>
					<textarea
						value={post.editBody ?? post.body} placeholder="You can't leave this blank!"
						maxLength={400}
						onChange={e => setPosts(prev => prev.map(
							p => p.id === post.id ? {...p, editBody: e.target.value} : p))}
						className="w-full p-4 border border-gray-300 rounded-lg resize-none"
					/>
					<p className="text-sm text-gray-500">{(post.editBody ?? post.body).length}/400</p>
					<div className="flex gap-3 pt-2">
						<button
							disabled={!post.editBody?.trim()}
							onClick={() => onUpdate(post.id, post.editBody ?? "")}
							className={"flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg " +
								"hover:bg-blue-700 cursor-pointer transition-colors font-semibold"}
						>
							Save
						</button>
						<button
							onClick={() => setPosts(prev => prev.map(
								p => p.id === post.id ? {...p, isEditing: false, editBody: ""} : p))}
							className={"px-4 py-2 border border-gray-300 text-gray-700 " +
								"cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"}
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<>
					<h3 className="text-xl font-semibold mb-3">
						<span
							onClick={e => {
								e.stopPropagation();
								navigate(`/u/${post.user?.name}`);
							}}
							className="text-blue-600 font-bold cursor-pointer hover:underline"
						>
							{post.user?.display_name}@{post.user?.name}
						</span>&nbsp;
						<span className="text-sm text-gray-500 mb-2">
							{new Date(post.created_at).toLocaleString()}
							{post.updated_at !== post.created_at && (
								<>{", last edited at " + new Date(post.updated_at).toLocaleString()}</>)}
						</span>
					</h3>
					<div
						className="whitespace-pre-wrap mb-4 text-gray-800 leading-relaxed"
					>
						{post.body}
					</div>
					{post.user_id === user?.id && (
						<div className="flex gap-3 pt-4">
							<button
								className="text-yellow-600 hover:underline cursor-pointer" data-no-nav
								onClick={e => {
									e.stopPropagation();
									setPosts(prev => prev.map(p => p.id === post.id ?
										{...p, isEditing: true, editBody: p.body} : p));
								}}
							>
								Edit
							</button>
							<button
								className="text-red-600 hover:underline cursor-pointer" data-no-nav
								onClick={e => {e.stopPropagation(); onDelete(post.id);}}
							>
								Delete
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}