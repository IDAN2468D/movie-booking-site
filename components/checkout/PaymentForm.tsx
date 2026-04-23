'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentFormProps {
  formData: { cardName: string; cardNumber: string; expiryDate: string; cvv: string };
  setFormData: (data: { cardName: string; cardNumber: string; expiryDate: string; cvv: string }) => void;
  errors: Record<string, string>;
}

export const PaymentForm = ({ formData, setFormData, errors }: PaymentFormProps) => {
  return (
    <div 
      className="rounded-[40px] p-10 border border-white/5"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4 flex-row-reverse">
        <CreditCard className="text-primary" /> שיטת תשלום
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 flex-row-reverse">
         <button className="p-6 rounded-3xl bg-primary/10 border-2 border-primary flex items-center justify-between text-white group flex-row-reverse">
            <div className="flex items-center gap-4 flex-row-reverse">
               <div className="w-12 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <CreditCard size={20} className="text-primary" />
               </div>
               <div className="text-right">
                  <p className="text-sm font-black">כרטיס אשראי</p>
                  <p className="text-[10px] text-slate-500">ויזה, מאסטרקארד, אמקס</p>
               </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
               <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            </div>
         </button>

         <button className="p-6 rounded-3xl bg-white/5 border-2 border-transparent hover:border-white/10 flex items-center justify-between text-slate-400 group transition-all flex-row-reverse">
            <div className="flex items-center gap-4 flex-row-reverse">
               <div className="w-12 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="font-black text-xs">PayPal</span>
               </div>
               <div className="text-right">
                  <p className="text-sm font-black">חשבון PayPal</p>
                  <p className="text-[10px] text-slate-500">מהיר ומאובטח</p>
               </div>
            </div>
         </button>
      </div>

      <div className="space-y-6">
        <Input 
          label="שם בעל הכרטיס" 
          placeholder="ישראל ישראלי" 
          value={formData.cardName}
          onChange={(v: string) => setFormData({ ...formData, cardName: v })}
          error={errors.cardName}
        />
        
        <div className="space-y-2 text-right">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">מספר כרטיס</label>
          <div className="relative">
            <CreditCard className={`absolute right-4 top-1/2 -translate-y-1/2 ${errors.cardNumber ? 'text-red-500/50' : 'text-slate-600'} w-5 h-5`} />
            <input 
              type="text" 
              placeholder="0000 0000 0000 0000" 
              value={formData.cardNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
                setFormData({ ...formData, cardNumber: value });
              }}
              className={`w-full bg-white/5 border ${errors.cardNumber ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors text-right`} 
            />
          </div>
          {errors.cardNumber && <p className="text-[10px] font-bold text-red-500 mr-1">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6 flex-row-reverse">
           <Input 
             label="תאריך תוקף" 
             placeholder="MM/YY" 
             value={formData.expiryDate}
             onChange={(v: string) => {
                let val = v.replace(/\D/g, '');
                if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                setFormData({ ...formData, expiryDate: val.slice(0, 5) });
             }}
             error={errors.expiryDate}
           />
           <Input 
             label="CVV" 
             placeholder="123" 
             value={formData.cvv}
             onChange={(v: string) => setFormData({ ...formData, cvv: v.replace(/\D/g, '').slice(0, 3) })}
             error={errors.cvv}
           />
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder, value, onChange, error }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; error?: string }) => (
  <div className="space-y-2 text-right">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors text-right`} 
    />
    {error && <p className="text-[10px] font-bold text-red-500 mr-1">{error}</p>}
  </div>
);
