
import React from 'react';
import { Appointment } from '../types';
import { CameraIcon, PaperclipIcon } from './icons';
import { translations } from '../i18n';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  t: (key: keyof typeof translations.en) => string;
}

const AppointmentsView: React.FC<AppointmentsViewProps> = ({ appointments, onSelectAppointment, t }) => {
  const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'] as const;
  const timeSlots = [];
  for (let i = 14; i < 22; i++) {
    timeSlots.push(`${i}:00`);
    timeSlots.push(`${i}:30`);
  }
  
  const today = new Date();
  const currentDayIndex = (today.getDay() + 1) % 7; // Saturday is 0 for our week
  const isFriday = today.getDay() === 5;

  const dayColors = [
    'bg-rose-50',    // Sunday
    'bg-sky-50',     // Monday
    'bg-teal-50',    // Tuesday
    'bg-amber-50',   // Wednesday
    'bg-violet-50',  // Thursday
    'bg-slate-50',   // Friday (unused)
    'bg-fuchsia-50', // Saturday
  ];
  const currentDayColor = dayColors[today.getDay()];

  const getAppointmentsForSlot = (dayIndex: number, time: string) => {
    // This is a simplified logic. A real app would handle dates properly.
    // For this demo, we'll only show appointments for the current day.
    if(dayIndex !== currentDayIndex) return [];
    
    const [hour, minute] = time.split(':').map(Number);
    return appointments.filter(apt => {
        const aptDate = new Date(apt.dateTime);
        const aptHour = aptDate.getHours();
        const aptMinute = aptDate.getMinutes();
        const isSameDate = aptDate.toDateString() === today.toDateString();
        
        return isSameDate && aptHour === hour && (minute < 30 ? aptMinute === 0 : aptMinute === 30);
    });
  };

  if(isFriday){
    return (
        <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-md p-6">
            <h2 className="text-3xl font-bold text-slate-700">{t('clinicClosed')}</h2>
            <p className="text-slate-500 mt-2">{t('clinicClosedMessage')}</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
      <div className="grid grid-cols-7" style={{minWidth: '1200px'}}>
        <div className="p-2 font-bold text-center text-slate-500">{t('time')}</div>
        {days.map(day => (
          <div key={day} className={`p-2 font-bold text-center ${days.indexOf(day) === currentDayIndex ? 'text-primary' : 'text-slate-700'}`}>{t(day)}</div>
        ))}
      </div>
      <div className="grid grid-cols-7" style={{minWidth: '1200px'}}>
        {/* Time Column */}
        <div className="col-span-1">
          {timeSlots.map(time => (
            <div key={time} className="h-24 flex items-center justify-center border-t border-e border-slate-200 text-sm font-mono text-slate-500">{time}</div>
          ))}
        </div>
        {/* Day Columns */}
        {days.map((day, dayIndex) => (
          <div key={day} className={`col-span-1 ${dayIndex === currentDayIndex ? currentDayColor : ''}`}>
            {timeSlots.map(time => (
              <div key={time} className="h-24 border-t border-e border-slate-200 p-1">
                {getAppointmentsForSlot(dayIndex, time).map(apt => (
                  <div 
                    key={apt.id} 
                    onClick={() => onSelectAppointment(apt)}
                    className="bg-primary text-white p-2 rounded-lg text-xs cursor-pointer h-full flex flex-col justify-center hover:bg-sky-600"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold truncate">{apt.patientName}</p>
                        <p className="text-xs truncate text-sky-200">{apt.chiefComplaint}</p>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0 ms-1">
                        {apt.attachments && apt.attachments.length > 0 && <PaperclipIcon className="h-3 w-3 text-white" />}
                        {apt.xrayImageUrl && <CameraIcon className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    <p className="truncate mt-1">{apt.workDone}</p>
                    {apt.selectedTeeth && apt.selectedTeeth.length > 0 &&
                        <p className="text-xs truncate text-sky-200">{t('teeth')}: {apt.selectedTeeth.join(', ')}</p>
                    }
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsView;