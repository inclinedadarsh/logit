import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { Github } from "lucide-react";
import Link from "next/link";

export function Navbar() {
	return (
		<nav className="flex items-center justify-between py-4 border-b">
			<Link href="/" className="text-2xl font-bold">
				Log It!
			</Link>

			<div className="flex items-center gap-4">
				<Link
					href="https://github.com/yourusername/logit"
					target="_blank"
					className={cn(
						buttonVariants({
							variant: "outline",
							size: "icon",
						}),
					)}
				>
					<Github />
				</Link>
				<SignedOut>
					<SignInButton mode="modal">
						<Button variant="outline">Log in</Button>
					</SignInButton>
					<SignUpButton mode="modal">
						<Button>Sign up</Button>
					</SignUpButton>
				</SignedOut>

				<SignedIn>
					<Link href="/logs/new">
						<Button variant="outline">Create a log</Button>
					</Link>
					<UserButton />
				</SignedIn>
			</div>
		</nav>
	);
}
