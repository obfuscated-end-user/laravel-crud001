export default function PostEditor({ value, setValue, onSave, onCancel, maxLength = 400 }) {
	return (
		<div className="border-2 border-blue-500 p-6 bg-blue-50 rounded-lg">
			<h3 className="text-xl font-semibold mb-4 text-blue-800">Edit post</h3>
			<textarea
				value={value} onChange={e => setValue(e.target.value)}
				className="w-full p-4 border border-gray-300 rounded-lg resize-none"
			/>
			<p className="text-sm text-gray-500">{value.length}/{maxLength}</p>
			<div className="flex gap-3 pt-2">
				<button
					disabled={!value.trim()} onClick={onSave}
					className={"flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer " +
						"hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"}
				>
					Save
				</button>

				<button
					onClick={onCancel}
					className={"px-4 py-2 border border-gray-300 text-gray-700 cursor-pointer " +
						"rounded-lg hover:bg-gray-50 transition-colors"}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}