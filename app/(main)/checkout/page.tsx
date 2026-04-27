'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ShieldCheck, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useBookingStore } from '@/lib/store';
import { useSocialStore } from '@/lib/store/social-store';
import { FOOD_ITEMS, CINEMA_BRANCHES } from '@/lib/constants';
import { calculateDynamicPrice, getPriceInsights } from '@/lib/utils/pricing-engine';
import { getImageUrl } from '@/lib/tmdb';

// Modular Components
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { FoodUpsell } from '@/components/checkout/FoodUpsell';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { SuccessView } from '@/components/checkout/SuccessView';
import { SplitPayPanel } from '@/components/social/SplitPayPanel';
import SmartCheckoutInsights from '@/components/checkout/SmartCheckoutInsights';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { 
    selectedMovie, selectedSeats, selectedFood, updateFoodQuantity, resetBooking,
    selectedDate, selectedShowtime, selectedHall, selectedBranchId
  } = useBookingStore();
  const { isSocialMode, groupMembers } = useSocialStore();

  const branch = CINEMA_BRANCHES.find(b => b.id === selectedBranchId);
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({ cardName: '', cardNumber: '', expiryDate: '', cvv: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const pricing = useMemo(() => {
    const seatCount = selectedSeats.length;
    
    // Dynamic Pricing Factors
    const now = new Date();
    const showtimeHour = parseInt(selectedShowtime?.split(':')[0] || '19');
    const isWeekend = [5, 6].includes(now.getDay()); // Fri, Sat
    
    const baseTicketPrice = calculateDynamicPrice({
      basePrice: 45.00,
      occupancyRate: 0.75, // Mocked occupancy
      isWeekend,
      daysUntilShow: 1, // Mocked
      isPrimeTime: showtimeHour >= 18 && showtimeHour <= 22
    });

    const foodTotal = selectedFood.reduce((acc, curr) => {
      const item = FOOD_ITEMS.find(f => f.id === curr.id);
      return acc + (curr.quantity * (item?.price || 0));
    }, 0);

    const subtotal = (seatCount * baseTicketPrice) + foodTotal;
    const tax = subtotal * 0.17;
    const total = subtotal + tax;
    const splitTotal = isSocialMode ? total / (groupMembers.length + 1) : total;
    
    const priceInsights = getPriceInsights({
      basePrice: 45.00,
      occupancyRate: 0.75,
      isWeekend,
      daysUntilShow: 1,
      isPrimeTime: showtimeHour >= 18 && showtimeHour <= 22
    });

    return { seatCount, ticketPrice: baseTicketPrice, foodTotal, subtotal, tax, total, splitTotal, priceInsights };
  }, [selectedSeats, selectedFood, isSocialMode, groupMembers, selectedShowtime]);

  if (!selectedMovie) return <EmptyState />;
  if (isSuccess) return <SuccessView resetBooking={resetBooking} />;

  const handlePayment = async () => {
    if (!validateForm(formData, setErrors)) return;
    if (!session) return alert('יש להתחבר כדי לבצע הזמנה');
    
    setIsProcessing(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          movie: selectedMovie, 
          seats: selectedSeats, 
          food: selectedFood, 
          total: pricing.total, 
          paymentInfo: formData,
          branchId: selectedBranchId,
          branchName: branch?.name
        }),
      });
      if (res.ok) {
        const bookingData = await res.json();
        setIsSuccess(true);
        // Automatically send email after purchase
        try {
          await fetch('/api/send-ticket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user?.email,
              movieTitle: selectedMovie.displayTitle,
              seats: selectedSeats,
              price: pricing.total,
              orderId: bookingData.bookingId,
              posterUrl: getImageUrl(selectedMovie.poster_path, 'w500'),
              date: selectedDate,
              time: selectedShowtime,
              hall: selectedHall,
              branchName: branch?.name,
              userName: session.user?.name || 'אורח'
            }),
          });
        } catch (emailErr) {
          console.error('Auto-email failed:', emailErr);
        }
      }
      else alert('נכשלנו ביצירת ההזמנה. נסה שוב.');
    } catch { alert('שגיאת תקשורת. נסה שוב מאוחר יותר.'); }
    finally { setIsProcessing(false); }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 text-right" dir="rtl">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 group flex-row-reverse transition-colors">
        <ChevronLeft size={20} className="group-hover:translate-x-1 transition-transform rotate-180" />
        <span className="text-sm font-bold uppercase tracking-widest">חזרה לסרט</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-8 order-2 lg:order-1">
          <SplitPayPanel splitTotal={pricing.splitTotal} />
          <FoodUpsell selectedFood={selectedFood} updateFoodQuantity={updateFoodQuantity} />
          <PaymentForm formData={formData} setFormData={setFormData} errors={errors} />
          <SecurityBadge />
        </div>

        <div className="lg:w-1/3 order-1 lg:order-2">
          <div className="sticky top-24">
            <OrderSummary 
              movie={selectedMovie} seats={selectedSeats} seatCount={pricing.seatCount} 
              ticketPrice={pricing.ticketPrice} foodTotal={pricing.foodTotal} 
              tax={pricing.tax} total={isSocialMode ? pricing.splitTotal : pricing.total} 
              isProcessing={isProcessing} onPayment={handlePayment} 
              priceInsights={pricing.priceInsights}
            />
            <div className="mt-6">
              <SmartCheckoutInsights movieTitle={selectedMovie.displayTitle} totalAmount={isSocialMode ? pricing.splitTotal : pricing.total} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const EmptyState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center" dir="rtl">
    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6"><Ticket size={40} className="text-slate-600" /></div>
    <h2 className="text-2xl font-bold text-white mb-2">לא נבחר סרט להזמנה</h2>
    <Link href="/" className="mt-8 px-8 py-3 bg-primary text-background rounded-xl font-black text-xs uppercase tracking-widest">חזור לדף הבית</Link>
  </div>
);

const SecurityBadge = () => (
  <div className="flex items-center gap-3 p-6 bg-primary/5 border border-primary/20 rounded-[32px] flex-row-reverse">
     <ShieldCheck className="text-primary" size={24} />
     <p className="text-xs text-slate-400 font-medium">התשלום שלך מאובטח באמצעות הצפנת SSL בתקן התעשייה. אנחנו אף פעם לא שומרים את פרטי הכרטיס המלאים שלך.</p>
  </div>
);

const validateForm = (data: { cardName: string; cardNumber: string; expiryDate: string; cvv: string }, setErrors: (errors: Record<string, string>) => void) => {
  const e: Record<string, string> = {};
  if (!data.cardName.trim()) e.cardName = 'חובה להזין שם';
  if (data.cardNumber.replace(/\s/g, '').length !== 16) e.cardNumber = '16 ספרות חובה';
  if (!data.expiryDate.includes('/')) e.expiryDate = 'MM/YY חובה';
  if (data.cvv.length !== 3) e.cvv = '3 ספרות';
  setErrors(e);
  return Object.keys(e).length === 0;
};
