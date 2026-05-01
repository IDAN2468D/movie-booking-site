'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scan, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Camera,
  Keyboard,
  Zap,
  RotateCcw,
  ShieldCheck,
  SwitchCamera,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Html5Qrcode } from 'html5-qrcode';

export default function TicketScannerPage() {
  const [bookingId, setBookingId] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'warning' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  const isTransitioning = useRef(false);

  useEffect(() => {
    // Fetch available cameras
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length > 0) {
        setCameras(devices);
        // Try to pick the back camera by default
        const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear'));
        setSelectedCameraId(backCamera ? backCamera.id : devices[0].id);
      }
    }).catch(err => {
      console.error("Error getting cameras", err);
    });

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (mode === 'camera' && status === 'idle' && selectedCameraId) {
      startCamera(selectedCameraId);
    } else {
      stopCamera();
    }
  }, [mode, status, selectedCameraId]);

  const startCamera = async (cameraId: string) => {
    if (isTransitioning.current) return;
    
    try {
      if (!html5QrCode.current) {
        html5QrCode.current = new Html5Qrcode("reader");
      }

      if (html5QrCode.current.isScanning) {
        await html5QrCode.current.stop();
      }

      isTransitioning.current = true;
      const config = { 
        fps: 20, 
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0
      };
      
      await html5QrCode.current.start(
        cameraId,
        config,
        onScanSuccess,
        onScanFailure
      );
      setCameraActive(true);
      setErrorMsg("");
    } catch (err) {
      console.error("Camera start error:", err);
      setErrorMsg("שגיאה בפתיחת המצלמה. נסה לבחור מצלמה אחרת.");
    } finally {
      isTransitioning.current = false;
    }
  };

  const stopCamera = async () => {
    if (html5QrCode.current && html5QrCode.current.isScanning) {
      if (isTransitioning.current) return;
      try {
        isTransitioning.current = true;
        await html5QrCode.current.stop();
        setCameraActive(false);
      } catch (err) {
        console.error("Camera stop error:", err);
      } finally {
        isTransitioning.current = false;
      }
    }
  };

  const onScanSuccess = (decodedText: string) => {
    if (status !== 'idle') return;
    validateTicket(decodedText);
  };

  const onScanFailure = (error: any) => {
    // Ignore noise
  };

  const validateTicket = async (id: string) => {
    setStatus('scanning');
    await stopCamera();
    
    try {
      const res = await fetch('/api/erp/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        if (data.alreadyValidated) {
          setStatus('warning');
        } else {
          setStatus('success');
        }
      } else {
        setErrorMsg(data.error || 'אימות נכשל');
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg('שגיאת תקשורת עם השרת');
      setStatus('error');
    }
  };

  const resetScanner = () => {
    setStatus('idle');
    setResult(null);
    setBookingId('');
    setErrorMsg('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Auth Shield 3.0</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">ניהול כניסות</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Camera Selector (only in camera mode) */}
          {mode === 'camera' && cameras.length > 1 && (
            <select 
              value={selectedCameraId}
              onChange={(e) => setSelectedCameraId(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-primary/50"
            >
              {cameras.map(c => (
                <option key={c.id} value={c.id} className="bg-black">{c.label || `Camera ${c.id.slice(0,5)}`}</option>
              ))}
            </select>
          )}

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setMode('camera')}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                mode === 'camera' ? "bg-primary text-black" : "text-slate-500 hover:text-white"
              )}
            >
              <Camera size={12} />
              מצלמה
            </button>
            <button 
              onClick={() => setMode('manual')}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                mode === 'manual' ? "bg-primary text-black" : "text-slate-500 hover:text-white"
              )}
            >
              <Keyboard size={12} />
              ידני
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Scanner Window */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square bg-black rounded-[48px] border border-white/10 overflow-hidden shadow-2xl">
            
            {/* Real Video Feed */}
            <div id="reader" className={cn("w-full h-full", (mode === 'manual' || status !== 'idle') && "opacity-20 blur-2xl")} />

            {/* Custom Scanning HUD */}
            <AnimatePresence>
              {mode === 'camera' && status === 'idle' && cameraActive && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {/* Target Frame */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[280px] h-[280px] border-2 border-white/20 rounded-[40px] relative">
                      {/* Animated Laser */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_rgba(255,159,10,1)] z-10"
                      />
                      
                      {/* Glow Corners */}
                      <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                      <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                      <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                    </div>
                  </div>

                  {/* Darkened edges */}
                  <div className="absolute inset-0 bg-black/40" style={{ clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 15% 15%, 85% 15%, 85% 85%, 15% 85%, 15% 15%)' }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Overlays */}
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <AnimatePresence mode="wait">
                {status === 'scanning' && (
                  <motion.div key="scan" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-primary font-black uppercase tracking-widest text-xs">Verifying Database...</p>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-500/90 backdrop-blur-xl p-10 rounded-[40px] text-center pointer-events-auto shadow-2xl">
                    <CheckCircle2 size={64} className="text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-white mb-1">כניסה מאושרת!</h3>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-6">Access Granted</p>
                    <button onClick={resetScanner} className="px-8 py-3 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all">המשך לסריקה</button>
                  </motion.div>
                )}

                {status === 'warning' && (
                  <motion.div key="warning" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-amber-500/90 backdrop-blur-xl p-10 rounded-[40px] text-center pointer-events-auto shadow-2xl">
                    <AlertCircle size={64} className="text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-white mb-1">כרטיס כבר מומש</h3>
                    <p className="text-white/80 text-sm font-bold mb-6">הכרטיס נסרק בהצלחה בעבר.</p>
                    <button onClick={resetScanner} className="px-8 py-3 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all">הבנתי, המשך</button>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div key="error" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-500/90 backdrop-blur-xl p-10 rounded-[40px] text-center pointer-events-auto shadow-2xl">
                    <AlertCircle size={64} className="text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-white mb-1">שגיאה באימות</h3>
                    <p className="text-white/80 text-sm font-bold mb-6">{errorMsg}</p>
                    <button onClick={resetScanner} className="px-8 py-3 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all">נסה שוב</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Info & Details Column */}
        <div className="lg:col-span-5 space-y-6">
          
          <AnimatePresence mode="wait">
            {mode === 'manual' ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-[40px] p-8">
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <Keyboard className="text-primary" size={20} />
                  הזנה ידנית
                </h2>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="הזן מזהה הזמנה..."
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-primary/50 font-mono"
                  />
                  <button 
                    onClick={() => validateTicket(bookingId)}
                    disabled={!bookingId || status === 'scanning'}
                    className="w-full h-14 bg-primary text-black font-black rounded-2xl disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(255,159,10,0.3)]"
                  >
                    אמת כרטיס
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {result && (status === 'success' || status === 'warning') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className={cn(
                      "bg-gradient-to-br border rounded-[40px] p-8",
                      status === 'success' ? "from-primary/20 to-black border-primary/20" : "from-amber-500/10 to-black border-amber-500/20"
                    )}
                  >
                    <h3 className={cn(
                      "text-[10px] font-black uppercase tracking-[0.3em] mb-6",
                      status === 'success' ? "text-primary" : "text-amber-500"
                    )}>
                      {status === 'success' ? 'Ticket Information' : 'Previously Validated'}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-slate-500 font-bold text-xs uppercase">Movie</span>
                        <span className="text-white font-black text-sm">{result.movie}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-3">
                        <span className="text-slate-500 font-bold text-xs uppercase">Seats</span>
                        <span className="text-white font-bold text-sm">{result.seats.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold text-xs uppercase">User</span>
                        <span className="text-white font-bold text-sm">{result.user.split('@')[0]}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8">
                  <h3 className="text-white font-black mb-4 flex items-center gap-2">
                    <RotateCcw size={16} className="text-primary" />
                    הנחיות לצוות
                  </h3>
                  <ul className="space-y-3">
                    {['וודא שה-QR נקי וברור', 'בקש מהלקוח להגביר בהירות', 'סריקה אחת מסמנת את הכרטיס כ"מומש"', 'במקרה של תקלה טכנית - השתמש בהזנה ידנית'].map((t, i) => (
                      <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all border border-white/5 rounded-2xl"
          >
            Refresh Camera Interface
          </button>
        </div>

      </div>

      <style jsx global>{`
        #reader video {
          object-fit: cover !important;
          border-radius: 48px !important;
        }
        #reader__scan_region {
          background: transparent !important;
        }
        #reader__dashboard, #reader__status_span, .html5-qrcode-element {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
