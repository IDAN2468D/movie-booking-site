'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ShieldCheck, Ticket, Lock, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/store';
import { useSocialStore } from '@/lib/store/social-store';
import { FOOD_ITEMS, CINEMA_BRANCHES } from '@/lib/constants';
import { calculateDynamicPrice, getPriceInsights } from '@/lib/utils/pricing-engine';
import { getImageUrl } from '@/lib/tmdb';

// Modular Components
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { VisualCateringGrid } from '@/components/catering/VisualCateringGrid';
import { SingularityOrb } from '@/components/checkout/SingularityOrb';
import { SuccessView } from '@/components/checkout/SuccessView';
import { SplitPayPanel } from '@/components/social/SplitPayPanel';
import SmartCheckoutInsights from '@/components/checkout/SmartCheckoutInsights';
import CurrencyCascade from '@/components/fx/CurrencyCascade';
import RoaringLionCelebration from '@/components/fx/RoaringLionCelebration';
import { ScratchRewardBanner } from '@/components/booking/ScratchRewardBanner';
import { HolographicShardFusion } from '@/components/checkout/HolographicShardFusion';
import { useCheckoutResonance } from '@/hooks/useCheckoutResonance';
import { useLiquidGlassStore } from '@/lib/store/liquidGlassStore';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { 
    selectedMovie, selectedSeats, selectedFood, updateFoodQuantity, resetBooking,
    selectedDate, selectedShowtime, selectedHall, selectedBranchId, setTransactionCompleted, appliedFlashOffer
  } = useBookingStore();
  const { isSocialMode, groupMembers } = useSocialStore();
  const { triggerResonance } = useCheckoutResonance();
  const setFusionShardsActive = useLiquidGlassStore(state => state.setFusionShardsActive);

  const branch = CINEMA_BRANCHES.find(b => b.id === selectedBranchId);
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({ cardName: '', cardNumber: '', expiryDate: '', cvv: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loyaltyData, setLoyaltyData] = React.useState<{ tier: string; points: number } | null>(null);
  const [scratchReward, setScratchReward] = React.useState<any>(null);

  React.useEffect(() => {
    if (session?.user?.id) {
      import('@/app/actions/bonusActions').then(({ getUserLoyaltyData, getPendingScratchReward }) => {
        getUserLoyaltyData(session.user.id).then(res => {
          if (res.success && res.data) {
            setLoyaltyData(res.data);
          }
        });
        getPendingScratchReward(session.user.id).then(res => {
          if (res.success && res.data) {
            setScratchReward(res.data);
          }
        });
      });
    }
  }, [session?.user?.id]);

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
    let tax = subtotal * 0.17;
    let total = subtotal + tax;
    
    let discount = 0;
    // Apply flash offer pricing logic
    if (appliedFlashOffer) {
      const hasAllOfferSeats = appliedFlashOffer.seats.every(seat => selectedSeats.includes(seat));
      if (hasAllOfferSeats) {
        // The normal total price for these seats would be their base price + tax
        const normalTotalForOfferSeats = (appliedFlashOffer.seats.length * baseTicketPrice) * 1.17;
        discount = normalTotalForOfferSeats - appliedFlashOffer.price;
        total -= discount;
        // Re-calculate the tax proportion based on the new final total
        tax = total - (total / 1.17);
      }
    }

    let vipDiscount = 0;
    let vipInsight = '';
    let pointsMultiplier = 1;

    if (loyaltyData) {
      if (loyaltyData.tier === 'Silver') {
        vipDiscount = foodTotal * 0.10; // 10% off food
        vipInsight = `הטבת VIP (Silver): חסכת 10% על נשנושים`;
        pointsMultiplier = 1.5;
      } else if (loyaltyData.tier === 'Gold') {
        vipDiscount = (foodTotal * 0.15) + (seatCount * baseTicketPrice * 0.10); // 15% off food, 10% off tickets
        vipInsight = `הטבת VIP (Gold): חסכת על כרטיסים ונשנושים`;
        pointsMultiplier = 2;
      } else if (loyaltyData.tier === 'Liquid Elite') {
        vipDiscount = (foodTotal * 0.20) + (seatCount * baseTicketPrice * 0.20); // 20% off all
        vipInsight = `הטבת VIP (Liquid Elite): חסכת 20% מההזמנה`;
        pointsMultiplier = 3;
      }
    }

    if (vipDiscount > 0) {
      discount += vipDiscount;
      total -= vipDiscount;
      tax = total - (total / 1.17);
    }

    const priceBeforeScratch = total;
    let scratchDiscount = 0;
    if (scratchReward) {
      if (scratchReward.type === 'discount_percentage') {
        scratchDiscount = priceBeforeScratch * (scratchReward.value / 100);
      } else if (scratchReward.type === 'fixed_discount') {
        scratchDiscount = Math.min(priceBeforeScratch, scratchReward.value);
      } else if (scratchReward.type === 'free_ticket') {
        const ticketPriceWithTax = baseTicketPrice * 1.17;
        scratchDiscount = Math.min(priceBeforeScratch, ticketPriceWithTax);
      }
      discount += scratchDiscount;
      total -= scratchDiscount;
      tax = total - (total / 1.17);
    }

    const splitTotal = isSocialMode ? total / (groupMembers.length + 1) : total;
    const earnedPoints = Math.round((isSocialMode ? splitTotal : total) * pointsMultiplier);
    
    const priceInsights = getPriceInsights({
      basePrice: 45.00,
      occupancyRate: 0.75,
      isWeekend,
      daysUntilShow: 1,
      isPrimeTime: showtimeHour >= 18 && showtimeHour <= 22
    });

    if (appliedFlashOffer && discount > vipDiscount) {
      priceInsights.push('מבצע בזק הופעל: נחסכו ₪' + Math.round(discount - vipDiscount));
    }
    
    if (vipInsight) {
      priceInsights.push(vipInsight);
    }

    if (scratchDiscount > 0) {
      priceInsights.push('הטבת כרטיס גירוד הופעלה בהצלחה');
    }

    return { seatCount, ticketPrice: baseTicketPrice, foodTotal, subtotal, tax, discount, total, splitTotal, priceInsights, earnedPoints, originalPriceForReward: priceBeforeScratch, scratchDiscount };
  }, [selectedSeats, selectedFood, isSocialMode, groupMembers, selectedShowtime, appliedFlashOffer, loyaltyData, scratchReward]);

  if (!selectedMovie) return <EmptyState />;
  if (isSuccess) return (
    <>
      <CurrencyCascade />
      <RoaringLionCelebration />
      <HolographicShardFusion />
      <SuccessView resetBooking={resetBooking} />
    </>
  );

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
          branchName: branch?.name,
          date: selectedDate,
          showtime: selectedShowtime,
          originalPrice: pricing.originalPriceForReward,
          rewardId: scratchReward?.rewardId
        }),
      });
      if (res.ok) {
        triggerResonance();
        setFusionShardsActive(true);
        const bookingData = await res.json();
        setTransactionCompleted(true);
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
      else {
        const errorData = await res.json().catch(() => null);
        console.error('Booking failed:', errorData);
      }
    } catch { alert('שגיאת תקשורת. נסה שוב מאוחר יותר.'); }
    finally { setIsProcessing(false); }
  };

  const handleQuantumPayment = async (): Promise<boolean> => {
    if (!session) {
      alert('יש להתחבר כדי לבצע הזמנה');
      return false;
    }
    
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
          paymentInfo: { cardName: 'Quantum Wallet', cardNumber: '1111222233334444', expiryDate: '12/99', cvv: '123' },
          branchId: selectedBranchId,
          branchName: branch?.name,
          date: selectedDate,
          showtime: selectedShowtime,
          originalPrice: pricing.originalPriceForReward,
          rewardId: scratchReward?.rewardId
        }),
      });
      if (res.ok) {
        triggerResonance();
        setFusionShardsActive(true);
        const bookingData = await res.json();
        setTransactionCompleted(true);
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
        } catch (emailErr) {}
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative" dir="rtl">
      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF1464]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0AEFFF]/[0.02] rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-6 relative z-10">
        {/* Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10 md:mb-14"
        >
          <Link href="/" className="inline-flex items-center gap-3 text-white/40 hover:text-white group transition-all duration-300 flex-row-reverse">
            <ChevronLeft size={18} className="group-hover:translate-x-1 transition-transform rotate-180 text-[#FF1464]" />
            <span className="text-xs font-black uppercase tracking-[0.3em] font-rubik">חזרה לסרט</span>
          </Link>

          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-3 flex-row-reverse">
            <StepBadge number={1} label="בחירת מושבים" done />
            <div className="w-8 h-px bg-white/10" />
            <StepBadge number={2} label="סיכום ותשלום" active />
            <div className="w-8 h-px bg-white/10" />
            <StepBadge number={3} label="אישור" />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Payment & Extras */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-[60%] space-y-8 order-2 lg:order-1"
          >
            <SplitPayPanel splitTotal={pricing.splitTotal} />
            <VisualCateringGrid selectedFood={selectedFood} updateFoodQuantity={updateFoodQuantity} />
            <div className="mt-12 mb-8">
              <h3 className="text-xl font-black text-white font-rubik tracking-tight text-right mb-6">תשלום קוונטי מקוצר</h3>
              <SingularityOrb 
                amount={Math.round(isSocialMode ? pricing.splitTotal : pricing.total)} 
                onProcess={handleQuantumPayment}
                onSuccess={() => setIsSuccess(true)}
              />
            </div>
            <SecurityBadge />
          </motion.div>

          {/* Right Column: Order Summary (Sticky) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-[40%] order-1 lg:order-2"
          >
            <div className="sticky top-24 space-y-6">
              {scratchReward && (
                <ScratchRewardBanner 
                  type={scratchReward.type} 
                  value={scratchReward.value} 
                  discountAmount={pricing.scratchDiscount} 
                />
              )}
              <OrderSummary 
                movie={selectedMovie} seats={selectedSeats} seatCount={pricing.seatCount} 
                ticketPrice={pricing.ticketPrice} foodTotal={pricing.foodTotal} 
                tax={pricing.tax} discount={pricing.discount} total={isSocialMode ? pricing.splitTotal : pricing.total} 
                isProcessing={isProcessing} onPayment={handlePayment} 
                priceInsights={pricing.priceInsights}
                earnedPoints={pricing.earnedPoints}
              />
              <SmartCheckoutInsights movieTitle={selectedMovie.displayTitle} totalAmount={isSocialMode ? pricing.splitTotal : pricing.total} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-Components ── */

const StepBadge = ({ number, label, active, done }: { number: number; label: string; active?: boolean; done?: boolean }) => (
  <div className="flex items-center gap-2.5 flex-row-reverse">
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black font-anton transition-all ${
      done ? 'bg-[#FF1464] text-white' 
      : active ? 'bg-[#FF1464]/20 text-[#FF1464] border border-[#FF1464]/40 shadow-[0_0_20px_rgba(255,20,100,0.3)]' 
      : 'bg-white/5 text-white/30 border border-white/10'
    }`}>
      {done ? '✓' : number}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest font-rubik ${
      active ? 'text-white' : done ? 'text-white/50' : 'text-white/20'
    }`}>{label}</span>
  </div>
);

const EmptyState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center" dir="rtl">
    <motion.div 
      initial={{ scale: 0 }} 
      animate={{ scale: 1 }} 
      transition={{ type: 'spring', damping: 15 }}
      className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10"
    >
      <Ticket size={44} className="text-white/20" />
    </motion.div>
    <h2 className="text-3xl font-black text-white mb-3 font-rubik tracking-tight">לא נבחר סרט להזמנה</h2>
    <p className="text-white/40 text-sm mb-10 font-rubik">חזור לדף הבית ובחר סרט כדי להתחיל</p>
    <Link href="/" className="px-10 py-4 bg-[#FF1464] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] font-rubik hover:scale-105 transition-all shadow-2xl shadow-[#FF1464]/30">חזור לדף הבית</Link>
  </div>
);

const SecurityBadge = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.6 }}
    className="rounded-[32px] p-8 border border-white/5 relative overflow-hidden"
    style={{
      background: 'linear-gradient(135deg, rgba(0,255,133,0.03), rgba(10,239,255,0.02), transparent)',
    }}
  >
    <div className="flex items-start gap-5 flex-row-reverse">
      <div className="w-12 h-12 bg-[#00FF85]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#00FF85]/20">
        <ShieldCheck className="text-[#00FF85]" size={22} />
      </div>
      <div className="flex-1 text-right">
        <h4 className="text-sm font-black text-white mb-2 font-rubik">תשלום מאובטח בתקן PCI DSS</h4>
        <p className="text-xs text-white/40 leading-relaxed font-rubik">
          התשלום שלך מאובטח באמצעות הצפנת SSL 256-bit בתקן התעשייה. אנחנו אף פעם לא שומרים את פרטי הכרטיס המלאים שלך.
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4 mt-6 flex-row-reverse">
      <SecurityChip icon={<Lock size={12} />} label="SSL 256-bit" />
      <SecurityChip icon={<Fingerprint size={12} />} label="3D Secure" />
      <SecurityChip icon={<ShieldCheck size={12} />} label="PCI Certified" />
    </div>
  </motion.div>
);

const SecurityChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] rounded-xl border border-white/5 text-white/30">
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest font-anton">{label}</span>
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
