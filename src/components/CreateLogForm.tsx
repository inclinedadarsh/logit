"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateLogFormProps {
	onSuccess?: () => void;
}

export default function CreateLogForm({ onSuccess }: CreateLogFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const log_datetime = formData.get("log_datetime") as string;
		const tagsInput = formData.get("tags") as string;
		const tags = tagsInput
			.split(",")
			.map(tag => tag.trim())
			.filter(Boolean);

		try {
			const response = await fetch("/api/logs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					description,
					log_datetime,
					tags,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to create log");
			}

			if (onSuccess) {
				onSuccess();
			}
			router.refresh();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Something went wrong",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 max-w-2xl mx-auto p-4"
		>
			<div>
				<label
					htmlFor="title"
					className="block text-sm font-medium text-gray-700"
				>
					Title
				</label>
				<input
					type="text"
					id="title"
					name="title"
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				/>
			</div>

			<div>
				<label
					htmlFor="description"
					className="block text-sm font-medium text-gray-700"
				>
					Description
				</label>
				<textarea
					id="description"
					name="description"
					rows={4}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				/>
			</div>

			<div>
				<label
					htmlFor="log_datetime"
					className="block text-sm font-medium text-gray-700"
				>
					Date and Time
				</label>
				<input
					type="datetime-local"
					id="log_datetime"
					name="log_datetime"
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				/>
			</div>

			<div>
				<label
					htmlFor="tags"
					className="block text-sm font-medium text-gray-700"
				>
					Tags (comma-separated)
				</label>
				<input
					type="text"
					id="tags"
					name="tags"
					placeholder="work, personal, health"
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				/>
			</div>

			{error && <div className="text-red-600 text-sm">{error}</div>}

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
			>
				{isSubmitting ? "Creating..." : "Create Log"}
			</button>
		</form>
	);
}
