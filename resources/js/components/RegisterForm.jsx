export default function RegisterForm({ form, setForm, onSubmit, loading, error, clearError }) {
	return (
		<div className="border-4 border-black p-8 rounded-lg">
			<h2 className="text-2xl font-semibold mb-6">Register</h2>
			<form onSubmit={onSubmit} className="space-y-4">
				<input
					type="text" placeholder="name" value={form.name} disabled={loading}
					onChange={e => {
						setForm(f => ({...f, name: e.target.value}));
						clearError();
					}}
					className={"w-full p-3 border border-gray-300 rounded-lg focus:outline-none " +
						"focus:ring-2 focus:ring-blue-500"}
				/>
				<input
					type="text" placeholder="display name" value={form.display_name} disabled={loading}
					onChange={e => {
						setForm(f => ({...f, display_name: e.target.value}));
						clearError();
					}}
					className="w-full p-3 border border-gray-300 rounded-lg"
				/>
				<input
					type="text" placeholder="email" value={form.email} disabled={loading}
					onChange={e => {
						setForm(f => ({...f, email: e.target.value}));
						clearError();
					}}
					className={"w-full p-3 border border-gray-300 rounded-lg focus:outline-none " +
						"focus:ring-2 focus:ring-blue-500"}
				/>
				<input
					type="password" placeholder="password" value={form.password} disabled={loading}
					onChange={e => {
						setForm(f => ({...f, password: e.target.value}));
						clearError();
					}}
					className={"w-full p-3 border border-gray-300 rounded-lg focus:outline-none " +
						"focus:ring-2 focus:ring-blue-500"}
				/>
				<button
					disabled={loading}
					className={"w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 " +
						"cursor-pointer transition-colors font-semibold"}
				>
					{loading ? "Registering..." : "Register"}
				</button>
				{error && <p className="text-red-500 font-semibold">{error}</p>}
			</form>
		</div>
	);
}