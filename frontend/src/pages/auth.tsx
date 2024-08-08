import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Auth = () => {
	const { search } = useLocation();
	const query = new URLSearchParams(search);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [mode, setMode] = useState<"login" | "signup">(
		query.get("mode") === "login" ? "login" : "signup"
	);

	return (
		<div className="grid place-content-center">
			<header className="mt-12 mx-auto">
				<h2 className="w-full text-center font-medium text-5xl text-violet-600">
					{mode === "login" ? "Login" : "Sign Up"}
				</h2>
				<p className="text-gray-600 w-full text-center font-light mt-1">
					{mode === "login"
						? "Enter your details to be logged into your account!"
						: "Enter your details below to create a new account!"}
				</p>
			</header>

			<main className="mt-16 flex flex-col items-center gap-4 min-w-[400px]">
				<fieldset className="w-full flex flex-col">
					<label htmlFor="email" className="text-sm font-medium">
						Email:
					</label>
					<div className="flex flex-row gap-2 items-center  rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full focus:drop-shadow-md px-4">
						<i className="pi pi-user"></i>
						<input
							className="py-3 border-none outline-none w-full"
							placeholder="johndoe@example.com"
							type="email"
							name="email"
							id="email"
						/>
					</div>
				</fieldset>

				<fieldset className="w-full flex flex-col">
					<label htmlFor="password" className="text-sm font-medium">
						Password:
					</label>
					<div className="flex flex-row gap-2 items-center  rounded-md border border-gray-300 focus:outline-none focus:border-violet-600 transition duration-300 w-full focus:drop-shadow-md px-4">
						<i className="pi pi-key"></i>
						<input
							className="py-3 border-none outline-none w-full"
							placeholder="http://www.example.com/something?cool=true"
							type="password"
							name="password"
							id="password"
						/>
					</div>
				</fieldset>

				<button
					type="submit"
					className="w-full bg-violet-600 text-white py-2 font-medium rounded-md hover:bg-violet-400 transition-all duration-300 hover:border-violet-500 border border-violet-600">
					{mode === "login" ? "Log In" : "Register"}
				</button>
				<p className="text-gray-400 text-sm">
					Don't have an account?{" "}
					{mode === "login" ? (
						<Link
							to="/auth?mode=register"
							className="text-violet-600 underline hover:text-violet-400"
							onClick={() => setMode("signup")}>
							Signup now
						</Link>
					) : (
						<Link
							className="text-violet-600 underline hover:text-violet-400"
							onClick={() => setMode("login")}
							to="/auth?mode=login">
							Login now
						</Link>
					)}
				</p>
			</main>
		</div>
	);
};

export default Auth;
