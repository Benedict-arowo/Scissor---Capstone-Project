import { Link } from "react-router-dom";

const Nav = () => {
	return (
		<nav className="w-full bg-white  px-12 py-4 flex flex-row justify-between items-center">
			<Link to="/">
				<h1>Logo</h1>
			</Link>

			<div className="flex flex-row gap-3">
				<Link
					to={"/auth?mode=login"}
					className="py-1.5 px-5 border border-violet-600 text-violet-600 rounded-md font-medium hover:bg-violet-500 hover:text-white duration-300 transition-all w-fit">
					Login
				</Link>

				<Link
					to={"/dashboard"}
					className="py-1.5 px-5 border border-violet-600 text-violet-600 rounded-md font-medium hover:bg-violet-500 hover:text-white duration-300 transition-all w-fit">
					Dashboard
				</Link>
			</div>
		</nav>
	);
};

export default Nav;
