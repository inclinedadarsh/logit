import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function SignInPage() {
	return (
		<div className="container mx-auto py-16 px-4">
			<div className="max-w-md mx-auto text-center space-y-8">
				<h1 className="text-3xl font-bold">Welcome to Log It!</h1>
				<p className="text-gray-600">
					Please sign in or register to start creating your work logs.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<SignInButton mode="modal">
						<Button variant="outline" className="w-full sm:w-auto">
							Sign In
						</Button>
					</SignInButton>
					<SignUpButton mode="modal">
						<Button className="w-full sm:w-auto">Sign Up</Button>
					</SignUpButton>
				</div>
			</div>
		</div>
	);
}
