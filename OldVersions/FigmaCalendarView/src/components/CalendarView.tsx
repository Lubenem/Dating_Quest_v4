import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";
import { CalendarEvent } from "../App";

interface CalendarViewProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarView({ events, selectedDate, onSelectDate }: CalendarViewProps) {
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const modifiers = {
    hasEvents: (date: Date) => getEventsForDate(date).length > 0
  };

  const modifiersClassNames = {
    hasEvents: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-indigo-600 after:rounded-full"
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur shadow-lg">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        className="rounded-md"
      />
    </Card>
  );
}
