import CreateLogForm from "@/components/CreateLogForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewLogPage() {
	const session = await auth();

	if (!session?.userId) {
		redirect("/sign-in");
	}

	return (
		<main className="min-h-screen bg-background">
			<div className="container mx-auto py-8">
				<h1 className="text-3xl font-bold mb-8">Create New Log</h1>
				<div className="bg-card rounded-lg border shadow-sm">
					<CreateLogForm />
				</div>
			</div>
		</main>
	);
}
