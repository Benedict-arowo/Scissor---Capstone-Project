require("dotenv").config({ path: "./.env" });

const config: Iconfig = {
	ROUTE_PREFIX: "",
	BASE_URL: "https://localhost.com/",
	NODE_ENV: "development",
	PORT: parseInt(process.env.PORT as string) || 5000,
	OPTIONS: {
		SCAN_URLS: false,
		UPDATE_USER_IP_INFO: false,
		TOKEN_EXPIRY_DAYS: 7,
		TOKEN_LENGTH: 32,
	},
	DB: {
		HOST: process.env.HOST as string,
		PORT: parseInt(process.env.PORT as string),
		USER: process.env.USER as string,
		PASSWORD: process.env.PASSWORD as string,
		DATABASE: process.env.DATABASE as string,
	},
	TOKENS: {
		WEATHER_API: process.env.WEATHER_API_TOKEN as string,
		CLOUDINARY: {
			CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
			API_KEY: process.env.CLOUDINARY_API_KEY as string,
			API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
		},
		VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY as string,
	},
	CORS_OPTION: {
		origin: process.env.CORS_ORIGIN
			? (process.env.CORS_ORIGIN as string).split("|")
			: ["http://localhost:3000/"],
	},
};

export default config;

interface Iconfig {
	ROUTE_PREFIX?: string;
	BASE_URL: string;
	NODE_ENV: "development" | "production";
	PORT: number;
	OPTIONS: {
		SCAN_URLS: boolean;
		UPDATE_USER_IP_INFO: boolean;
		TOKEN_EXPIRY_DAYS: number;
		TOKEN_LENGTH: number;
	};
	DB: {
		HOST: string;
		PORT: number;
		USER: string;
		PASSWORD: string;
		DATABASE: string;
	};
	TOKENS: {
		WEATHER_API: string;
		CLOUDINARY: {
			CLOUD_NAME: string;
			API_KEY: string;
			API_SECRET: string;
		};
		VIRUSTOTAL_API_KEY: string;
	};
	CORS_OPTION: {
		origin: string | string[];
	};
}
