import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Sparkles,
  UserCheck,
  Building,
  Check,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    dismissNotification,
    clearAllNotifications,
    registerForEvent,
    setSelectedEventForModal,
    events,
  } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            Notifications Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contextual alerts, countdown rescue dispatches, and faculty announcements.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 rounded-xl text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white">No active notifications</h3>
            <p className="text-xs text-slate-500 mt-1">
              You are completely caught up with all campus opportunity deadlines.
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isRescue = notif.type === 'missed_rescue';

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isRescue
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200 shadow-md shadow-amber-950/30'
                    : notif.read
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                    : 'bg-slate-900 border-slate-750 text-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {isRescue && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                    <h3 className="text-sm font-bold text-white">{notif.title}</h3>
                  </div>
                  <span className="text-[11px] text-slate-500">{notif.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">{notif.message}</p>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                  <div>
                    {notif.actionButton && (
                      <button
                        onClick={() => {
                          if (notif.actionButton?.action === 'register' && notif.eventId) {
                            registerForEvent(notif.eventId);
                          } else if (notif.actionButton?.action === 'view_event' && notif.eventId) {
                            const ev = events.find((e) => e.id === notif.eventId);
                            if (ev) setSelectedEventForModal(ev);
                          }
                          markNotificationAsRead(notif.id);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow"
                      >
                        {notif.actionButton.label}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="text-blue-400 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => dismissNotification(notif.id)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
