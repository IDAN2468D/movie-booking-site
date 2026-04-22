'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Ticket, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  ChevronLeft,
  ShoppingBasket,
  Plus,
  Minus
} from 'lucide-react';
import { useBookingStore } from '@/lib/store';
import Link from 'next/link';
import NextImage from 'next/image';
import { FOOD_ITEMS } from '@/lib/constants';

import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { selectedMovie, selectedSeats, selectedFood, updateFoodQuantity, resetBooking } = useBookingStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!selectedMovie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center" dir="rtl">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Ticket size={40} className="text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">לא נבחר סרט להזמנה</h2>
        <p className="text-slate-500 mb-8">כדי להמשיך ברכישה, עליך לבחור סרט תחילה.</p>
        <Link href="/" className="px-8 py-3 bg-primary text-background rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
          חזור לדף הבית
        </Link>
      </div>
    );
  }

  const seatCount = selectedSeats.length;
  const ticketPrice = 45.00; // Real price in NIS
  const foodTotal = selectedFood.reduce((acc, curr) => {
    const item = FOOD_ITEMS.find(f => f.id === curr.id);
    return acc + (curr.quantity * (item?.price || 0));
  }, 0);
  const subtotal = (seatCount * ticketPrice) + foodTotal;
  const tax = subtotal * 0.17; // 17% VAT in Israel
  const total = subtotal + tax;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'חובה להזין שם';
    } else if (formData.cardName.length < 3) {
      newErrors.cardName = 'יש להזין שם מלא';
    }

    const cleanCard = formData.cardNumber.replace(/\s/g, '');
    if (!cleanCard) {
      newErrors.cardNumber = 'חובה להזין מספר כרטיס';
    } else if (!/^\d{16}$/.test(cleanCard)) {
      newErrors.cardNumber = 'חייב להכיל 16 ספרות';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'חובה';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'השתמש ב-MM/YY';
    }

    if (!formData.cvv) {
      newErrors.cvv = 'חובה';
    } else if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = '3 ספרות';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (!session) {
      alert('יש להתחבר כדי לבצע הזמנה');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie: selectedMovie,
          seats: selectedSeats,
          food: selectedFood,
          total,
          paymentInfo: formData
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'נכשלנו ביצירת ההזמנה. נסה שוב.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('שגיאת תקשורת. נסה שוב מאוחר יותר.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 text-right">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">ההזמנה <span className="text-primary">אושרה!</span></h1>
        <p className="text-slate-400 mb-12 max-w-md mx-auto">הכרטיסים שלך נשלחו לאימייל וזמינים כעת במדור &quot;הכרטיסים שלי&quot;.</p>
        
        <div className="flex gap-4 flex-row-reverse">
          <Link 
            href="/tickets" 
            className="px-8 py-4 bg-primary text-background rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
            onClick={() => resetBooking()}
          >
            צפה בכרטיסים
          </Link>
          <Link 
            href="/" 
            className="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            onClick={() => resetBooking()}
          >
            חזרה לבית
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-right">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group flex-row-reverse">
        <ChevronLeft size={20} className="group-hover:translate-x-1 transition-transform rotate-180" />
        <span className="text-sm font-bold uppercase tracking-widest">חזרה לסרט</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:flex lg:flex-row-reverse">
        {/* Left (Summary in RTL is on the left, Form on right) */}
        {/* Right (Form) */}
        <div className="lg:w-2/3 space-y-8">
          <div className="glass rounded-[40px] p-10 border border-white/5">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4 flex-row-reverse">
              <ShoppingBasket className="text-primary" /> תוספת לנשנוש
            </h2>
            <p className="text-slate-400 text-sm mb-8 font-medium">הוסיפו נשנושים ודלגו על התור בקולנוע!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-row-reverse">
              {FOOD_ITEMS.slice(0, 4).map(item => {
                const quantity = selectedFood.find(f => f.id === item.id)?.quantity || 0;
                return (
                  <div key={item.id} className="bg-white/5 rounded-3xl p-4 flex items-center justify-between border border-white/5 hover:border-primary/20 transition-all group flex-row-reverse">
                    <div className="flex items-center gap-4 flex-row-reverse">
                      <div className="w-16 h-16 relative rounded-2xl overflow-hidden">
                        <NextImage src={item.image} alt={item.name} fill sizes="64px" className="object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{item.name}</p>
                        <p className="text-xs text-primary font-black">₪{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-background rounded-xl p-1 border border-white/5 flex-row-reverse">
                      <button 
                        onClick={() => updateFoodQuantity(item.id, -1)}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-black text-white text-xs">{quantity}</span>
                      <button 
                        onClick={() => updateFoodQuantity(item.id, 1)}
                        className="p-1.5 bg-primary rounded-lg text-background hover:bg-[#FF7A00] transition-colors shadow-lg shadow-primary/20"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Link href="/food" className="mt-8 inline-flex items-center gap-2 text-primary hover:text-[#FF7A00] font-bold text-xs uppercase tracking-widest flex-row-reverse">
              <ArrowRight size={14} className="rotate-180" /> לצפייה בכל התפריט
            </Link>
          </div>

          <div className="glass rounded-[40px] p-10 border border-white/5">
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
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">שם בעל הכרטיס</label>
                <input 
                  type="text" 
                  placeholder="ישראל ישראלי" 
                  value={formData.cardName}
                  onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                  className={`w-full bg-white/5 border ${errors.cardName ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors text-right`} 
                />
                {errors.cardName && <p className="text-[10px] font-bold text-red-500 mr-1">{errors.cardName}</p>}
              </div>
              <div className="space-y-2">
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
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">תאריך תוקף</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        setFormData({ ...formData, expiryDate: val.slice(0, 5) });
                      }}
                      className={`w-full bg-white/5 border ${errors.expiryDate ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors text-right`} 
                    />
                    {errors.expiryDate && <p className="text-[10px] font-bold text-red-500 mr-1">{errors.expiryDate}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-1">CVV</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                      className={`w-full bg-white/5 border ${errors.cvv ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors text-right`} 
                    />
                    {errors.cvv && <p className="text-[10px] font-bold text-red-500 mr-1">{errors.cvv}</p>}
                 </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-6 bg-primary/5 border border-primary/20 rounded-[32px] flex-row-reverse">
             <ShieldCheck className="text-primary" size={24} />
             <p className="text-xs text-slate-400 font-medium">התשלום שלך מאובטח באמצעות הצפנת SSL בתקן התעשייה. אנחנו אף פעם לא שומרים את פרטי הכרטיס המלאים שלך.</p>
          </div>
        </div>

        {/* Right (Summary) */}
        <div className="lg:w-1/3 space-y-8">
          <div className="glass rounded-[40px] p-10 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mt-16" />
             
             <h3 className="text-xl font-bold text-white mb-8 tracking-tight">סיכום הזמנה</h3>
             
             {selectedMovie ? (
               <div className="flex gap-4 mb-8 flex-row-reverse">
                  <div className="w-20 h-28 relative rounded-xl overflow-hidden shadow-lg border border-white/5">
                    <NextImage 
                      src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`} 
                      alt={selectedMovie.title} 
                      fill
                      sizes="80px"
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex-1 py-1 text-right">
                    <h4 className="text-white font-black text-sm mb-2">{selectedMovie.title}</h4>
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-row-reverse">
                        <Calendar size={10} className="text-primary" /> {new Date().toLocaleDateString('he-IL', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-row-reverse">
                        <Clock size={10} className="text-primary" /> 19:30 • IMAX
                      </p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1.5 flex-row-reverse">
                        <Ticket size={10} className="text-primary" /> {selectedSeats.join(', ')}
                      </p>
                    </div>
                  </div>
               </div>
             ) : null}

             <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between text-sm flex-row-reverse">
                   <span className="text-slate-500 font-medium">כרטיסים ({seatCount}x)</span>
                   <span className="text-white font-bold">₪{(seatCount * ticketPrice).toFixed(2)}</span>
                </div>
                {selectedFood.length > 0 ? (
                  <div className="flex justify-between text-sm flex-row-reverse">
                    <span className="text-slate-500 font-medium">אוכל ונשנושים</span>
                    <span className="text-white font-bold">₪{foodTotal.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-sm flex-row-reverse">
                   <span className="text-slate-500 font-medium">מיסים ועמלות (17%)</span>
                   <span className="text-white font-bold">₪{tax.toFixed(2)}</span>
                </div>
                
                <div className="pt-6 mt-2 border-t border-white/5 flex justify-between items-end flex-row-reverse">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">סכום כולל</p>
                      <p className="text-3xl font-black text-white tracking-tighter">₪{total.toFixed(2)}</p>
                   </div>
                   <div className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black rounded-full border border-primary/30">
                      חיסכון ₪18.00
                   </div>
                </div>
             </div>

             <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-10 py-5 bg-primary text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:bg-[#FF7A00] transition-all flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-row-reverse"
             >
               {isProcessing ? (
                 <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
               ) : (
                 <>
                   השלם תשלום
                  <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform rotate-180" />
                 </>
               )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
