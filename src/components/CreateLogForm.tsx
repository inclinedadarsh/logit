"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Calendar24 from "./calendar-24";

interface CreateLogFormProps {
	onSuccess?: () => void;
}

export default function CreateLogForm({ onSuccess }: CreateLogFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		log_datetime: "",
		tags: "",
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const tags = formData.tags
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
					title: formData.title,
					description: formData.description,
					log_datetime: formData.log_datetime,
					tags,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to create log");
			}

			toast.success("Log created successfully", {
				description: "You can see your log on your profile page.",
			});

			// Clear form
			setFormData({
				title: "",
				description: "",
				log_datetime: "",
				tags: "",
			});

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

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleDateTimeChange = (date: Date | undefined, time: string) => {
		if (date && time) {
			const [hours, minutes] = time.split(":");
			date.setHours(Number.parseInt(hours, 10));
			date.setMinutes(Number.parseInt(minutes, 10));
			setFormData(prev => ({
				...prev,
				log_datetime: date.toISOString(),
			}));
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 max-w-2xl mx-auto p-4"
		>
			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					name="title"
					value={formData.title}
					onChange={handleInputChange}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleInputChange}
					rows={4}
				/>
			</div>

			<div className="space-y-2">
				<Calendar24
					onDateTimeChange={handleDateTimeChange}
					value={
						formData.log_datetime
							? new Date(formData.log_datetime)
							: undefined
					}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="tags">Tags (comma-separated)</Label>
				<Input
					id="tags"
					name="tags"
					value={formData.tags}
					onChange={handleInputChange}
					placeholder="work, personal, health"
				/>
			</div>

			{error && <div className="text-destructive text-sm">{error}</div>}

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Creating...
					</>
				) : (
					"Create Log"
				)}
			</Button>
		</form>
	);
}
