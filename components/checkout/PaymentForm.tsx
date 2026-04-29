'use client';

import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentFormProps {
  formData: { cardName: string; cardNumber: string; expiryDate: string; cvv: string };
  setFormData: (data: { cardName: string; cardNumber: string; expiryDate: string; cvv: string }) => void;
  errors: Record<string, string>;
}

export const PaymentForm = ({ formData, setFormData, errors }: PaymentFormProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-[40px] p-8 md:p-10 border border-white/[0.06] relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255,255,255,0.03)'
      }}
    >
      {/* Ambient Glow */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-primary/[0.03] rounded-full blur-[80px] -ml-24 -mt-24" />

      {/* Header */}
      <div className="flex items-center gap-4 flex-row-reverse mb-8">
        <div className="w-11 h-11 bg-[#FF1464]/10 rounded-2xl flex items-center justify-center border border-[#FF1464]/20">
          <CreditCard className="text-[#FF1464]" size={20} />
        </div>
        <div className="text-right">
          <h2 className="text-xl font-black text-white font-rubik tracking-tight">שיטת תשלום</h2>
          <p className="text-[10px] text-white/30 font-bold font-rubik mt-0.5">בחר את אמצעי התשלום המועדף עליך</p>
        </div>
      </div>
      
      {/* Payment Method Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
         <motion.button 
           whileHover={{ scale: 1.01 }}
           whileTap={{ scale: 0.99 }}
           className="p-5 rounded-[24px] bg-[#FF1464]/[0.06] border-2 border-[#FF1464]/30 flex items-center justify-between text-white group flex-row-reverse transition-all shadow-[0_0_30px_rgba(255,20,100,0.1)]"
         >
            <div className="flex items-center gap-4 flex-row-reverse">
               <div className="w-11 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <CreditCard size={18} className="text-[#FF1464]" />
               </div>
               <div className="text-right">
                  <p className="text-sm font-black font-rubik">כרטיס אשראי</p>
                  <p className="text-[9px] text-white/30 font-bold font-rubik mt-0.5">ויזה, מאסטרקארד, אמקס</p>
               </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-[#FF1464] flex items-center justify-center">
               <div className="w-2.5 h-2.5 rounded-full bg-[#FF1464]" />
            </div>
         </motion.button>

         <motion.button 
           whileHover={{ scale: 1.01 }}
           whileTap={{ scale: 0.99 }}
           className="p-5 rounded-[24px] bg-white/[0.02] border-2 border-white/[0.06] hover:border-white/10 flex items-center justify-between text-white/40 group transition-all flex-row-reverse"
         >
            <div className="flex items-center gap-4 flex-row-reverse">
               <div className="w-11 h-8 bg-white/[0.05] rounded-xl flex items-center justify-center border border-white/[0.06]">
                  <Wallet size={18} className="text-white/30" />
               </div>
               <div className="text-right">
                  <p className="text-sm font-black font-rubik text-white/50">PayPal</p>
                  <p className="text-[9px] text-white/20 font-bold font-rubik mt-0.5">מהיר ומאובטח</p>
               </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-white/10" />
         </motion.button>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        <FormInput 
          label="שם בעל הכרטיס" 
          placeholder="ישראל ישראלי" 
          value={formData.cardName}
          onChange={(v: string) => setFormData({ ...formData, cardName: v })}
          error={errors.cardName}
        />
        
        <div className="space-y-2 text-right">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mr-1 font-rubik">מספר כרטיס</label>
          <div className="relative">
            <CreditCard className={`absolute right-4 top-1/2 -translate-y-1/2 ${errors.cardNumber ? 'text-red-400/50' : 'text-white/15'} w-5 h-5`} />
            <input 
              type="text" 
              placeholder="0000 0000 0000 0000" 
              value={formData.cardNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
                setFormData({ ...formData, cardNumber: value });
              }}
              className={`w-full bg-white/[0.03] border ${errors.cardNumber ? 'border-red-400/40 shadow-[0_0_20px_rgba(248,113,113,0.1)]' : 'border-white/[0.06]'} rounded-2xl py-4 pr-12 pl-4 text-white placeholder:text-white/15 focus:outline-none focus:border-[#FF1464]/40 focus:shadow-[0_0_30px_rgba(255,20,100,0.1)] transition-all text-right font-rubik`} 
            />
          </div>
          {errors.cardNumber && <p className="text-[10px] font-bold text-red-400 mr-1 font-rubik">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-5">
           <FormInput 
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
           <FormInput 
             label="CVV" 
             placeholder="•••" 
             value={formData.cvv}
             onChange={(v: string) => setFormData({ ...formData, cvv: v.replace(/\D/g, '').slice(0, 3) })}
             error={errors.cvv}
           />
        </div>
      </div>
    </motion.div>
  );
};

const FormInput = ({ label, placeholder, value, onChange, error }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; error?: string }) => (
  <div className="space-y-2 text-right">
    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mr-1 font-rubik">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-white/[0.03] border ${error ? 'border-red-400/40 shadow-[0_0_20px_rgba(248,113,113,0.1)]' : 'border-white/[0.06]'} rounded-2xl p-4 text-white placeholder:text-white/15 focus:outline-none focus:border-[#FF1464]/40 focus:shadow-[0_0_30px_rgba(255,20,100,0.1)] transition-all text-right font-rubik`} 
    />
    {error && <p className="text-[10px] font-bold text-red-400 mr-1 font-rubik">{error}</p>}
  </div>
);
