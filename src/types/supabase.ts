export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					id: string;
					username: string;
					clerk_id: string;
					first_name: string | null;
					last_name: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					username: string;
					clerk_id: string;
					first_name?: string | null;
					last_name?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					username?: string;
					clerk_id?: string;
					first_name?: string | null;
					last_name?: string | null;
					created_at?: string;
				};
			};
			logs: {
				Row: {
					id: string;
					title: string;
					description: string | null;
					tags: string[];
					log_datetime: string;
					created_at: string;
					user_id: string;
				};
				Insert: {
					id?: string;
					title: string;
					description?: string | null;
					tags?: string[];
					log_datetime: string;
					created_at?: string;
					user_id: string;
				};
				Update: {
					id?: string;
					title?: string;
					description?: string | null;
					tags?: string[];
					log_datetime?: string;
					created_at?: string;
					user_id?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
