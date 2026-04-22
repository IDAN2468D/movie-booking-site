'use client';

import React from 'react';
import { Bell, Ticket, Gift, Utensils, Info, CheckCircle2, Clock } from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'הזמנה אושרה!',
    message: 'הכרטיס שלך ל\'הקול בראש 2\' (אולם 4) אושר. תהנה מהסרט!',
    time: 'לפני 2 דקות',
    type: 'booking',
    icon: Ticket,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    unread: true,
  },
  {
    id: 2,
    title: 'מבצע קומבו: 20% הנחה',
    message: 'קבל 20% הנחה על קומבו פופקורן גדול + שתייה. תקף להיום בלבד!',
    time: 'לפני שעה',
    type: 'offer',
    icon: Gift,
    color: 'text-primary',
    bg: 'bg-primary/10',
    unread: true,
  },
  {
    id: 3,
    title: 'הזמן אוכל מראש',
    message: 'דלג על התור! הזמן נשנושים עכשיו וקבל אותם עד למושב.',
    time: 'לפני 3 שעות',
    type: 'food',
    icon: Utensils,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    unread: false,
  },
  {
    id: 4,
    title: 'עדכון בטיחות בקולנוע',
    message: 'עדכנו את פרוטוקולי הבטיחות שלנו. בדוק את מערכת הכניסה החדשה ללא מגע.',
    time: 'אתמול',
    type: 'info',
    icon: Info,
    color: 'text-slate-400',
    bg: 'bg-white/5',
    unread: false,
  },
];

export default function NotificationsPage() {
  return (
    <div className="p-10 max-w-4xl mx-auto pb-20 text-right">
      <div className="flex items-center justify-between mb-12 flex-row-reverse">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            ההתראות <span className="text-primary">שלי</span>
          </h1>
          <p className="text-slate-400 font-medium">הישאר מעודכן בהזמנות ובמבצעים שלך</p>
        </div>
        <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-slate-300 transition-all uppercase tracking-widest">
          סמן הכל כנקרא
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <div 
              key={notif.id} 
              className={`group relative flex items-start gap-6 p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex-row-reverse ${
                notif.unread 
                  ? 'bg-white/5 border-[#FF9F0A]/20 shadow-lg' 
                  : 'bg-transparent border-white/5 hover:bg-white/5'
              }`}
            >
              {notif.unread && (
                <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#FF9F0A]" />
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${notif.bg} ${notif.color} border border-white/5 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>

              <div className="flex-1 text-right">
                <div className="flex items-center gap-3 mb-1 justify-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                    {notif.type === 'booking' ? 'הזמנה' : 
                     notif.type === 'offer' ? 'מבצע' :
                     notif.type === 'food' ? 'אוכל' : 'מידע'}
                  </span>
                  <h3 className={`font-bold tracking-tight ${notif.unread ? 'text-white text-lg' : 'text-slate-300'}`}>
                    {notif.title}
                  </h3>
                </div>
                <p className="text-slate-400 font-medium mb-3 leading-relaxed">
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest justify-end">
                  {notif.time}
                  <Clock className="w-3 h-3" />
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 text-slate-500 hover:text-white">
                   <CheckCircle2 className="w-5 h-5" />
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
            <Bell className="w-10 h-10 text-slate-700" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">הכל מעודכן!</h2>
          <p className="text-slate-500 max-w-xs">אין לך התראות חדשות. בדוק שוב מאוחר יותר לעדכונים.</p>
        </div>
      )}
    </div>
  );
}
