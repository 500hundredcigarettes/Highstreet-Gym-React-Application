import React, { useState, useMemo } from 'react';
import { format, getDay, startOfWeek, endOfWeek, parse } from 'date-fns';
import { handleSessionBooking } from './handleSessionBooking';
const dayAbbr = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];


export const Sessions = ({
  initialWeek = new Date().toISOString().slice(0, 10), 
  allSessions,
  user,
  selectMessage = 'Select a session',
}) => {
  let {renderBookingPage, renderEditBookingPage} = handleSessionBooking()
  const [selectedDay, setSelectedDay] = useState(null);      

  const [selectedWeek, setSelectedWeek] = useState(() => {
    const date = new Date(initialWeek);
    const year = date.getFullYear();
    const weekNum = Math.ceil((date - startOfWeek(date, { weekStartsOn: 1 })) / 604800000) + 1;
    return `${year}-W${String(weekNum).padStart(2, '0')}`;
  });

  const { weekStart, weekEnd, dateRangeString } = useMemo(() => {
    const [year, week] = selectedWeek.split('-W');
    const weekNum = parseInt(week, 10);

    const firstDay = new Date(parseInt(year), 0, 1);
    const mondayWeek1 = startOfWeek(firstDay, { weekStartsOn: 1 });

    const monday = new Date(mondayWeek1);
    monday.setDate(monday.getDate() + (weekNum - 1) * 7);

    const start = monday;
    const end = new Date(monday);
    end.setDate(end.getDate() + 6); 

    return {
      weekStart: start,
      weekEnd: end,
      dateRangeString: `${format(start, 'd MMM')} - ${format(end, 'd MMM')}`,
    };
  }, [selectedWeek]);

  const sessionsThisWeek = useMemo(() => {
    return allSessions.filter((s) => {
      const sessionDate = new Date(s.sessionDate);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });
  }, [allSessions, weekStart, weekEnd]);

    const isTrainer = user && (user.role === 'Trainer');
  // 5. Final filtered & sorted sessions (day + trainer filter)
  const filteredSessions = useMemo(() => {
        if (isTrainer) {
          return sessionsThisWeek
            .filter((session) => session.trainerId.id === user.id)
            .filter((session) => {
              const dayOfWeek = getDay(new Date(session.sessionDate)); 
              const matchesDay = selectedDay === null || dayOfWeek === selectedDay;
              return matchesDay;
            }).sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate)) 
        } else {
          const uniqueSessions = sessionsThisWeek.filter((session, index, self) => index === self.findIndex((duplicate) =>
            new Date(duplicate.sessionDate).getTime() === new Date(session.sessionDate).getTime() &&
            duplicate.activityId.id === session.activityId.id
          ));
          return uniqueSessions.filter((session) => {
            const dayOfWeek = getDay(new Date(session.sessionDate)); 
            const matchesDay = selectedDay === null || dayOfWeek === selectedDay;
            return matchesDay;
          }).sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate))
        }
      }, [sessionsThisWeek, selectedDay, isTrainer, user])

  return (
    <>
      <div className="text-center mb-4">
        <p className="text-lg">
          Timetable for:{' '}
          <span className="underline font-semibold">{dateRangeString}</span>
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <input
          type="week"
          value={selectedWeek}
          min="2025-W44"
          max="2026-W44"
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded"
        />
      </div>

      <h3 className="text-center my-2">{selectMessage}</h3>

      <div className="grid grid-cols-7 gap-2 my-6 text-center">
        {dayAbbr.map((abbr, idx) => (
          <button
            key={dayNames[idx]}
            onClick={() => setSelectedDay(selectedDay === idx ? null : idx)}
            className={`py-2 rounded font-bold transition-all ${
              selectedDay === idx
                ? 'border-2 border-indigo-700 bg-indigo-50 text-indigo-700'
                : 'border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            {abbr}
          </button>
        ))}
      </div>

      <div className="space-y-4 flex-col flex items-center">
        {isTrainer && (
          <button onClick={() => {renderEditBookingPage(null)}} className="inline-block px-5 py-2.5 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition">
            Add new session
          </button>
        )}

        {filteredSessions.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No sessions found for the selected week.
          </p>
        ) : (
          filteredSessions.map((session) => {
            const sessionDate = new Date(session.sessionDate);
            const formatted = format(sessionDate, 'd MMM');

            return (
              <div key={session.id} className="w-90 border border-gray-300 rounded-lg p-4 bg-sky-300 grid gap-3 items-center grid-cols-[2fr_1fr_auto] ">
                <p className="font-semibold text-lg">{session.activityId.activityName}</p>

                {isTrainer ? (
                  <>
                    <p>{session.sessionTime}</p>
                    <p>{formatted}</p>
                    <p>{session.trainerId.firstName} {session.trainerId.lastName}</p>
                    <p>{session.locationId.locationTitle}</p>
                    <button onClick={() => {
                      renderEditBookingPage(session.id)
                    }} className="text-indigo-700 font-bold hover:underline">
                      Edit session
                    </button>
                  </>
                ) : (
                  <>
                    <p>{session.sessionTime}</p>
                    <p>({formatted})</p>
                    <p>{session.locationId.locationTitle}</p>
                    <button onClick={() => {
                      renderBookingPage(session.id)
                      }} className="text-white font-bold">
                      Book {'>'}
                    </button>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Sessions