export default function Layout({ children }) {
	// Links don't work yet.
	return (
		<div className="min-h-screen bg-gray-100 flex justify-center">
			{/* left sidebar */}
			<div className="w-64 bg-white border-r p-4 flex flex-col sticky top-0 h-screen">
				<h1 className="text-xl font-bold mb-6">Outside</h1>
				<p className="font-bold mb-6 text-gray-400">Time to go outside, I guess.</p>
				<nav className="space-y-2">
					<a className="block hover:underline cursor-pointer">Home</a>
					<a className="block hover:underline cursor-pointer">Profile</a>
					<a className="block hover:underline cursor-pointer">Settings</a>
					<a className="block hover:underline cursor-pointer">New Post</a>
				</nav>
				{/* Push footer down */}
				<div className="mt-auto text-sm text-gray-500">
					© { new Date().getFullYear() } random programmers incorporated.
				</div>
			</div>
			{/* main scrollable content */}
			<div className="w-full max-w-3xl p-8">
				{ children }
			</div>
			{/* right sidebar */}
			<div className="w-64 bg-white border-l p-4 sticky top-0 h-screen">
				<h2 className="font-semibold mb-4">Trending</h2>
				<p className="text-sm text-gray-500">#comingsoon</p>
				<p className="text-sm text-gray-500">#nothing</p>
			</div>
		</div>
	);
}
// obfuscated-end-user.