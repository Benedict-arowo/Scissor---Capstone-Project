import React from "react";

const Links = () => {
	return (
		<div className="mx-4">
			links
			<article className="w-full px-6 py-2 items-center border">
				<div className="flex flex-row justify-between">
					<div className="flex flex-col gap-0">
						<p className="">/bhjjs1</p>
						<span className="text-xs text-gray-400 font-light m-0">
							14/06/2024
							{/* Created time */}
						</span>
					</div>
					<p>300 clicks</p>
					<div className="w-4 h-4 bg-green-500 rounded-full"></div>
				</div>
				<div className="flex flex-row gap-0">
					{/* barcode */}
					<img className="w-[300px]" src="" alt="" />
					<div className="flex-1 flex flex-row">
						<div>
							<fieldset className="flex flex-col gap-1 flex-1">
								<label htmlFor="domain">Domain</label>
								<input
									className="py-2 px-4 rounded-md border bg-gray-200 border-gray-500 focus:outline-none focus:border-violet-600 transition duration-300 w-fit"
									type="text"
									name="domain"
									id="domain"
									disabled
									value={"/uughhh"}
									// value={domain}
								/>
							</fieldset>
							<p>300 Clicks</p>
							<p>120 Unique Clicks</p>
						</div>
						List of Clicks
					</div>
				</div>
			</article>
		</div>
	);
};

export default Links;

// id String @id @default(cuid())
// short_url String @unique
// long_url String
// expiration_date DateTime
// qr_code Json?
// password String?
// is_safe Boolean @default(false)
// clicks UrlClick[]
// last_visited DateTime?
// owner User? @relation(fields: [owner_id], references: [email], onDelete: Cascade)
// owner_id String?
// created_at DateTime @default(now())
