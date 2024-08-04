import Nav from "./component/nav";
import Index from "./pages";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";

const App = () => {
	return (
		<>
			<Nav />
			<Dashboard />
		</>
	);
};

export default App;
