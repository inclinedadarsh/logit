import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ username: string }>;
}): Promise<Metadata> {
	const { username } = await params;
	if (!username) {
		return {
			title: "User Not Found",
		};
	}

	const { data: user } = await supabase
		.from("users")
		.select("username, first_name, last_name")
		.eq("username", username)
		.single();

	if (!user) {
		return {
			title: "User Not Found",
		};
	}

	const displayName =
		user.first_name && user.last_name
			? `${user.first_name} ${user.last_name}`
			: user.username;

	return {
		title: `${displayName}'s Logs`,
	};
}

export default async function UserLogsPage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;
	// First, get the user from the username
	const { data: user, error: userError } = await supabase
		.from("users")
		.select("id, username, first_name, last_name")
		.eq("username", username)
		.single();

	if (userError || !user) {
		notFound();
	}

	// Then get all logs for this user
	const { data: logs, error: logsError } = await supabase
		.from("logs")
		.select("*")
		.eq("user_id", user.id)
		.order("log_datetime", { ascending: false });

	if (logsError) {
		throw new Error("Failed to fetch logs");
	}

	const displayName =
		user.first_name && user.last_name
			? `${user.first_name} ${user.last_name}`
			: user.username;

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">
					{displayName}'s Logs
				</h1>

				{logs.length === 0 ? (
					<p className="text-gray-600 text-center py-8">
						No logs found.
					</p>
				) : (
					<div className="space-y-6">
						{logs.map(log => (
							<article
								key={log.id}
								className="bg-white rounded-lg shadow p-6 border border-gray-200"
							>
								<h2 className="text-xl font-semibold mb-2">
									{log.title}
								</h2>
								{log.description && (
									<p className="text-gray-600 mb-4">
										{log.description}
									</p>
								)}
								<div className="flex flex-wrap gap-2 mb-4">
									{log.tags?.map((tag: string) => (
										<span
											key={tag}
											className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
								<time className="text-sm text-gray-500">
									{new Date(
										log.log_datetime,
									).toLocaleString()}
								</time>
							</article>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
