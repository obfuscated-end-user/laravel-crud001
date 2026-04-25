export default function ConfirmModal({ show, message, onClose, onConfirm,}) {
	if (!show) return null;

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/50"
			onClick={onClose}
		>
			<div
				className="bg-white p-6 rounded-lg shadow-lg w-80"
				onClick={e => e.stopPropagation()}
			>
				<p className="text-lg mb-4">{message}</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 border rounded cursor-pointer"
					>
						Cancel
					</button>
					<button
						onClick={() => {if (onConfirm) onConfirm(); onClose();}}
						className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}