import { useState } from "react";
import Links from "../component/dashboard/links";
import Token from "../component/dashboard/token";
import Home from "../component/dashboard/home";
import { Link, useLocation } from "react-router-dom";

const Dashboard = () => {
	const { search } = useLocation();
	const query = new URLSearchParams(search);
	const activePage =
		query.get("page") === "home" ||
		query.get("page") === "links" ||
		query.get("page") === "token"
			? query.get("page")
			: "home";

	const [active, setActive] = useState<"home" | "links" | "token">(
		activePage as "home" | "links" | "token"
	);
	const activeStyle = "text-white bg-violet-500";
	return (
		<div className="flex flex-row w-full h-screen">
			<aside className="w-[230px] bg-white border-r-2 border-gray-100 flex flex-col gap-4 pt-12 px-3">
				<Link
					to="/dashboard?page=home"
					onClick={() => setActive("home")}
					className={`px-6 w-full py-2 rounded-md ${
						active === "home" ? activeStyle : "text-black"
					}`}>
					Home
				</Link>
				<Link
					to="/dashboard?page=links"
					onClick={() => setActive("links")}
					className={`px-6 w-full py-2 rounded-md ${
						active === "links" ? activeStyle : "text-black"
					}`}>
					Links
				</Link>
				<Link
					to="/dashboard?page=token"
					onClick={() => setActive("token")}
					className={`px-6 w-full py-2 rounded-md ${
						active === "token" ? activeStyle : "text-black"
					}`}>
					Token
				</Link>
			</aside>
			<main className="flex-1">
				{active === "home" && <Home />}
				{active === "links" && <Links />}
				{active === "token" && <Token />}
			</main>
		</div>
	);
};

export default Dashboard;
