import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await auth();

	if (!session?.userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data: logs, error } = await supabase
		.from("logs")
		.select("*")
		.eq("user_id", session.userId)
		.order("log_datetime", { ascending: false });

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(logs);
}

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// First, get the user from the users table using clerk_id
	const { data: user, error: userError } = await supabase
		.from("users")
		.select("id")
		.eq("clerk_id", session.userId)
		.single();

	if (userError) {
		return NextResponse.json(
			{ error: "User not found in database" },
			{ status: 404 },
		);
	}

	const body = await request.json();
	const { title, description, tags, log_datetime } = body;

	const { data, error } = await supabase
		.from("logs")
		.insert([
			{
				title,
				description,
				tags,
				log_datetime,
				user_id: user.id, // Use the user.id from the database
			},
		])
		.select();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data[0]);
}
