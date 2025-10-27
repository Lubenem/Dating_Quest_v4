import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, LayoutDashboard, BarChart3, Award, MessageSquare, File, Settings } from "lucide-react";

interface DateIndicator {
  date: number;
  types: ('approaches' | 'contacts' | 'planned' | 'instant')[];
}

export function CalendarComponent() {
  const [currentMonth] = useState("September 2025");
  
  // Sample data - dates with different event types
  const indicators: DateIndicator[] = [
    { date: 15, types: ['approaches'] },
    { date: 17, types: ['planned'] },
    { date: 19, types: ['contacts'] },
    { date: 20, types: ['instant'] },
    { date: 27, types: ['approaches', 'contacts'] },
  ];

  const getIndicatorsForDate = (date: number) => {
    return indicators.find(ind => ind.date === date)?.types || [];
  };

  // Calendar grid - September 2025 starts on Monday
  const daysInMonth = 30;
  const firstDayOfWeek = 1; // Monday (0 = Sunday)
  const prevMonthDays = [31];
  const nextMonthDays = [1, 2, 3, 4];

  const allDates = [
    ...prevMonthDays.map(d => ({ day: d, isCurrentMonth: false })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, isCurrentMonth: true })),
    ...nextMonthDays.map(d => ({ day: d, isCurrentMonth: false }))
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-white">Analytics</h1>
        <RefreshCw className="w-5 h-5 text-gray-400" />
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <span className="text-white">{currentMonth}</span>
        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-gray-400 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {allDates.map((date, index) => {
          const dateIndicators = date.isCurrentMonth ? getIndicatorsForDate(date.day) : [];
          const isSelected = date.day === 27 && date.isCurrentMonth;
          
          return (
            <button
              key={index}
              className={`
                aspect-square rounded-xl border flex flex-col items-center justify-center relative
                transition-all
                ${date.isCurrentMonth 
                  ? isSelected
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-slate-800/40 border-slate-700 text-gray-200 hover:bg-slate-700/50'
                  : 'bg-slate-800/20 border-slate-700/30 text-gray-600'
                }
              `}
            >
              <span className="text-sm">{date.day}</span>
              
              {/* Indicator dots */}
              {dateIndicators.length > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dateIndicators.map((type, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full ${
                        type === 'approaches' ? 'bg-purple-400' :
                        type === 'contacts' ? 'bg-pink-400' :
                        type === 'planned' ? 'bg-purple-500' :
                        'bg-pink-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-slate-800/50 rounded-2xl p-5 backdrop-blur-sm border border-slate-700/50 mb-6">
        <h3 className="text-gray-200 mb-4">Legend</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <span className="text-gray-300 text-sm">Approaches</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400"></div>
            <span className="text-gray-300 text-sm">Contacts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-gray-300 text-sm">Planned Dates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <span className="text-gray-300 text-sm">Instant Dates</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto pt-4">
        <div className="bg-slate-800/60 rounded-2xl p-3 backdrop-blur-sm border border-slate-700/50">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 text-purple-400 transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white transition-colors relative">
              <Award className="w-5 h-5" />
              <span className="text-xs">Quests</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs">Chats</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white transition-colors">
              <File className="w-5 h-5" />
              <span className="text-xs">Guides</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
