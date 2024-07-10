const nav = () => {
	return (
		<nav className="w-full bg-white shadow-lg px-12 py-4 flex flex-row justify-between items-center">
			<h1 tabIndex={1}>Logo</h1>

			<div className="flex flex-row gap-3">
				<button className="py-1.5 px-5 hover:font-medium">Login</button>
				<button className="py-1.5 px-5 border border-violet-600 text-violet-600 rounded-md font-medium hover:bg-violet-500 hover:text-white duration-300">
					Register
				</button>
			</div>
		</nav>
	);
};

export default nav;
