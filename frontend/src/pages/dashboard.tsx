import Links from "../component/dashboard/links";
import Token from "../component/dashboard/token";

const Dashboard = () => {
	return (
		<div className="flex flex-row w-full h-screen">
			<aside className="w-[250px] bg-white border-r-2 border-gray-300 flex flex-col gap-4 pt-12 px-3">
				<button className="px-6 py-2 text-white bg-violet-600 w-fit">
					Dashboard
				</button>
				<button className="px-6 py-2 text-black w-fit">Links</button>
				<button className="px-6 py-2 text-black w-fit">Token</button>
			</aside>
			<main className="flex-1"></main>
		</div>
	);
};

export default Dashboard;
