import { CalendarEvent } from "../App";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, Clock } from "lucide-react";

interface EventListProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onDeleteEvent: (id: string) => void;
}

export function EventList({ events, selectedDate, onDeleteEvent }: EventListProps) {
  const eventsForSelectedDate = events
    .filter(event => event.date.toDateString() === selectedDate.toDateString())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 border-blue-300 text-blue-900",
    red: "bg-red-100 border-red-300 text-red-900",
    green: "bg-green-100 border-green-300 text-green-900",
    purple: "bg-purple-100 border-purple-300 text-purple-900",
    orange: "bg-orange-100 border-orange-300 text-orange-900"
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur shadow-lg">
      <h2 className="mb-4 text-indigo-900">
        Events for {selectedDate.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          year: 'numeric'
        })}
      </h2>

      {eventsForSelectedDate.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No events scheduled</p>
      ) : (
        <div className="space-y-3">
          {eventsForSelectedDate.map(event => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border-2 ${colorMap[event.color || 'blue']}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="mb-1">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm opacity-80 mb-2">{event.description}</p>
                  )}
                  <div className="flex items-center gap-1 text-sm opacity-70">
                    <Clock className="w-3 h-3" />
                    {event.date.toLocaleTimeString('en-US', { 
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteEvent(event.id)}
                  className="hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
