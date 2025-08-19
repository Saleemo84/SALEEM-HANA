import React, { useState, useMemo, useEffect } from 'react';
import { View, Appointment, Expense, LabWork, ExpenseCategory, LabWorkStatus } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AppointmentsView from './components/AppointmentsView';
import FinancesView from './components/FinancesView';
import LabWorkView from './components/LabWorkView';
import Header from './components/Header';
import { PlusIcon } from './components/icons';
import AppointmentForm from './components/AppointmentForm';
import ExpenseForm from './components/ExpenseForm';
import BackupModal from './components/BackupModal';
import { translations } from './i18n';

// Mock Data
const today = new Date();
const getTodayAt = (hour: number, minute: number = 0) => {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
};

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', patientName: 'John Doe', phoneNumber: '555-1234', dateTime: getTodayAt(14, 30), chiefComplaint: 'Toothache in upper right', workDone: 'Cleaning & Checkup', paymentDone: 150, paymentDue: 0, isPaid: true, notes: 'Regular 6-month checkup.', selectedTeeth: [3, 14] },
  { id: '2', patientName: 'Jane Smith', phoneNumber: '555-5678', dateTime: getTodayAt(16, 0), chiefComplaint: 'Broken filling', workDone: 'Filling', paymentDone: 250, paymentDue: 50, isPaid: false, notes: 'Composite filling on tooth #14.', xrayImageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', attachments: [{ id: 'attach1', name: 'Insurance_Agreement.pdf', type: 'application/pdf', data: 'data:application/pdf;base64,JVBERi0xLjEKJSAxIDAgb2JqPDwvVHlwZS9QYWdlcy9LaWRzWzMgMCBSXS9Db3VudCAxPj5lbmRvYmoKMiAwIG9iago8PC9Qcm9jU2V0Wy9QREYvVGV4dF0vQ29sb3JTcGFjZTw8L0NzMS9EZXZpY2VSR0I+Pi9Gb250PDwvRm8xPDwvRmFtaWx5KEhlbHZldGljYSktLUJhc2VGb250L0hlbHZldGljYT4+Pj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlL1BhcmVudCAxIDAgUi9SZXNvdXJjZXMgMiAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL0NvbnRlbnRzIDQgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDQ0Pj5zdHJlYW0KQlQgL0ZvMSAxMiBUZiAxMDAgODAwIFRkIChIZWxsbyB3b3JsZCkhIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEyIDAwMDAwIG4gCjAwMDAwMDAwNzcgMDAwMDAwIG4gCjAwMDAwMDAyMjIgMDAwMDAwIG4gCjAwMDAwMDAzMjAgMDAwMDAwIG4gCnRyYWlsZXIKPDwvUm9vdCAxIDAgUi9TaXplIDU+PgpzdGFydHhyZWYKNDE1CiUlRU9GCg==' }] },
  { id: '3', patientName: 'Mike Johnson', phoneNumber: '555-8765', dateTime: getTodayAt(17, 30), chiefComplaint: 'Wants a new crown', workDone: 'Crown Prep', paymentDone: 600, paymentDue: 400, isPaid: false, notes: 'Prep for Zirconia crown on #30.', selectedTeeth: [30] },
  { id: '4', patientName: 'Emily White', phoneNumber: '555-4444', dateTime: new Date(today.getTime() - 86400000 * 1), chiefComplaint: 'Pain from wisdom teeth', workDone: 'Wisdom Tooth Consult', paymentDone: 100, paymentDue: 0, isPaid: true, notes: '' },
  { id: '5', patientName: 'Chris Brown', phoneNumber: '555-5555', dateTime: new Date(today.getTime() - 86400000 * 2), chiefComplaint: 'Severe pain in lower left', workDone: 'Root Canal', paymentDone: 800, paymentDue: 200, isPaid: false, notes: '' },
  { id: '6', patientName: 'John Doe', phoneNumber: '555-1234', dateTime: new Date(today.getTime() - 86400000 * 30), chiefComplaint: 'Regular checkup', workDone: 'Old Checkup', paymentDone: 150, paymentDue: 0, isPaid: true, notes: 'Previous month appointment' },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', date: new Date(today.getTime() - 86400000 * 2), category: ExpenseCategory.Lab, description: 'Crown for M. Johnson', amount: 250 },
  { id: 'e2', date: new Date(today.getTime() - 86400000 * 5), category: ExpenseCategory.Supplies, description: 'Gloves and Masks Order', amount: 320 },
  { id: 'e3', date: new Date(today.getTime() - 86400000 * 10), category: ExpenseCategory.Bill, description: 'Electricity Bill - July', amount: 180 },
  { id: 'e4', date: new Date(today.getTime() - 86400000 * 1), category: ExpenseCategory.Other, description: 'Snacks for staff', amount: 45 },
];

const MOCK_LAB_WORK: LabWork[] = [
    { id: 'l1', patientName: 'Mike Johnson', labName: 'Precision Dental Lab', typeOfWork: 'Zirconia Crown', dateSent: new Date(today.getTime() - 86400000 * 3), dateDue: new Date(today.getTime() + 86400000 * 4), status: LabWorkStatus.Sent, cost: 250 },
    { id: 'l2', patientName: 'Sarah Lee', labName: 'Aesthetic Labs', typeOfWork: 'Veneers', dateSent: new Date(today.getTime() - 86400000 * 10), dateDue: new Date(today.getTime() - 86400000 * 2), status: LabWorkStatus.Received, cost: 1200 },
];

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Dashboard);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [labWorks, setLabWorks] = useState<LabWork[]>(MOCK_LAB_WORK);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const t = (key: keyof typeof translations.en) => translations[language][key] || translations.en[key];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    // Check if it's December (month is 0-indexed)
    if (currentMonth === 11) {
        setNotifications([
            'Prepare year-end salary bonuses.',
            'Pay annual clinic rent.',
            'Review and pay final quarter electricity bill.',
            'Settle all outstanding lab payments for the year.'
        ]);
    }
  }, []);


  const income = useMemo(() => appointments.reduce((acc, curr) => acc + curr.paymentDone, 0), [appointments]);

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };
  
  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt));
  };
  
  const addExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense].sort((a,b) => b.date.getTime() - a.date.getTime()));
  };
  
  const openAppointmentModal = (appointment: Appointment | null = null) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  }

  const handleSyncOutlook = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const getNextTimeSlot = (startDate: Date) => {
        const newDate = new Date(startDate);
        const lastAptTime = appointments.reduce((latest, apt) => apt.dateTime > latest ? apt.dateTime : latest, new Date(0));
        if (lastAptTime.getTime() > newDate.getTime()) {
            newDate.setTime(lastAptTime.getTime() + 30 * 60 * 1000);
        }
        if (newDate.getHours() >= 22) {
            newDate.setDate(newDate.getDate() + 1);
            newDate.setHours(14, 0, 0, 0);
        }
        return newDate;
    }

    const syncedAppointments: Appointment[] = [
      { id: `outlook-${Date.now()}`, patientName: 'Carol White (Outlook)', phoneNumber: '555-SYNC-1', dateTime: getNextTimeSlot(getTodayAt(19, 0)), chiefComplaint: 'Follow-up', workDone: 'Follow-up Consultation', paymentDone: 0, paymentDue: 75, isPaid: false, notes: 'Synced from Outlook Calendar event.' },
      { id: `outlook-${Date.now()+1}`, patientName: 'David Green (Outlook)', phoneNumber: '555-SYNC-2', dateTime: getNextTimeSlot(getTodayAt(20, 0)), chiefComplaint: 'Emergency', workDone: 'Emergency Toothache', paymentDone: 100, paymentDue: 100, isPaid: false, notes: 'Synced from Outlook Calendar event.' },
    ];

    setAppointments(prev => {
        const existingOutlookIds = new Set(prev.map(p => p.id));
        const newAppointments = syncedAppointments.filter(p => !existingOutlookIds.has(p.id));
        return [...prev, ...newAppointments];
    });

    setIsSyncing(false);
    alert("Outlook Calendar sync simulation complete! 2 new appointments added.");
  };

  const handleBackupData = () => {
    const allData = {
        appointments,
        expenses,
        labWorks,
        backupDate: new Date().toISOString()
    };
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `dentaldash_backup_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    localStorage.setItem('lastBackupDate', new Date().toISOString());
    setIsBackupModalOpen(true);
  };


  const renderView = () => {
    switch (view) {
      case View.Appointments:
        return <AppointmentsView appointments={appointments} onSelectAppointment={openAppointmentModal} t={t} />;
      case View.Finances:
        return <FinancesView appointments={appointments} expenses={expenses} t={t} />;
      case View.LabWork:
        return <LabWorkView labWorks={labWorks} t={t} />;
      case View.Dashboard:
      default:
        return <Dashboard appointments={appointments} expenses={expenses} labWorks={labWorks} onSelectAppointment={openAppointmentModal} onBackup={handleBackupData} t={t} />;
    }
  };

  const handleFabClick = () => {
    if (view === View.Finances) {
        setIsExpenseModalOpen(true);
    } else {
        openAppointmentModal(null);
    }
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar activeView={view} setView={setView} t={t} language={language} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={t(view.toLowerCase() as keyof typeof translations.en)} onSync={handleSyncOutlook} isSyncing={isSyncing} notifications={notifications} onBackup={handleBackupData} t={t} language={language} setLanguage={setLanguage} />
        <div className="flex-1 p-6 overflow-y-auto">
          {renderView()}
        </div>
        <button
          onClick={handleFabClick}
          className="absolute bottom-8 end-8 bg-primary hover:bg-sky-600 text-white rounded-full p-4 shadow-lg transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label={view === View.Finances ? t('addExpense') : t('addAppointment')}
        >
          <PlusIcon className="h-8 w-8" />
        </button>
      </main>
      
      {isAppointmentModalOpen && (
        <AppointmentForm
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          onSave={(apt) => {
            if(apt.id && apt.id !== 'new') {
              updateAppointment(apt);
            } else {
              addAppointment({...apt, id: new Date().toISOString() });
            }
          }}
          appointment={selectedAppointment}
          t={t}
        />
      )}
      
      {isExpenseModalOpen && (
        <ExpenseForm
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={(expense) => addExpense({ ...expense, id: new Date().toISOString() })}
          t={t}
        />
      )}

      <BackupModal isOpen={isBackupModalOpen} onClose={() => setIsBackupModalOpen(false)} t={t} />
    </div>
  );
};

export default App;