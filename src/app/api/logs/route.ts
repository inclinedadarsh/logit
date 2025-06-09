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
				user_id: session.userId,
			},
		])
		.select();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data[0]);
}
