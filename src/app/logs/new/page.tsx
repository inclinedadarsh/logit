import CreateLogForm from "@/components/CreateLogForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewLogPage() {
	const session = await auth();

	if (!session?.userId) {
		redirect("/sign-in");
	}

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-2xl font-bold text-center mb-8">
				Create New Log
			</h1>
			<CreateLogForm />
		</div>
	);
}
