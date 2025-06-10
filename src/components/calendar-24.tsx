"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface Calendar24Props {
	value?: Date;
	onDateTimeChange?: (date: Date | undefined, time: string) => void;
	required?: boolean;
}

export default function Calendar24({
	value,
	onDateTimeChange,
	required,
}: Calendar24Props) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(value);
	const [time, setTime] = React.useState<string>(
		value
			? `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`
			: "00:00",
	);

	React.useEffect(() => {
		if (value) {
			setDate(value);
			setTime(
				`${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`,
			);
		}
	}, [value]);

	const handleDateSelect = (newDate: Date | undefined) => {
		setDate(newDate);
		if (newDate && onDateTimeChange) {
			onDateTimeChange(newDate, time);
		}
		setOpen(false);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = e.target.value;
		setTime(newTime);
		if (date && onDateTimeChange) {
			onDateTimeChange(date, newTime);
		}
	};

	return (
		<div className="flex gap-4">
			<div className="flex flex-col gap-3">
				<Label htmlFor="date" className="px-1">
					Date
				</Label>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							id="date"
							className="w-32 justify-between font-normal"
							aria-required={required}
						>
							{date ? date.toLocaleDateString() : "Select date"}
							<ChevronDownIcon />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-auto overflow-hidden p-0"
						align="start"
					>
						<Calendar
							mode="single"
							selected={date}
							captionLayout="dropdown"
							onSelect={handleDateSelect}
						/>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex flex-col gap-3">
				<Label htmlFor="time" className="px-1">
					Time
				</Label>
				<Input
					type="time"
					id="time"
					value={time}
					onChange={handleTimeChange}
					step="1"
					required={required}
					className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</div>
		</div>
	);
}
