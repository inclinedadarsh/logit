import { supabase } from "@/lib/supabase";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
	// Get the headers
	const headersList = await headers();
	const svix_id = headersList.get("svix-id");
	const svix_timestamp = headersList.get("svix-timestamp");
	const svix_signature = headersList.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occured -- no svix headers", {
			status: 400,
		});
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your webhook secret
	const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

	let evt: WebhookEvent;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error occured", {
			status: 400,
		});
	}

	// Handle the webhook
	const eventType = evt.type;

	if (eventType === "user.created") {
		const { id, username, first_name, last_name } = evt.data;

		// Insert the user into Supabase
		const { error } = await supabase.from("users").insert([
			{
				clerk_id: id,
				username: username || id, // Use clerk_id as username if username is not provided
				first_name: first_name || null,
				last_name: last_name || null,
			},
		]);

		if (error) {
			console.error("Error inserting user into Supabase:", error);
			return new Response("Error inserting user into database", {
				status: 500,
			});
		}
	}

	return NextResponse.json({ success: true });
}
