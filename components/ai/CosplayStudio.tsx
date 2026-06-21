'use client';

import React, { useState, useRef } from 'react';

import { Camera, Image as ImageIcon, Loader2, Sparkles, UploadCloud, Wand2, Download } from 'lucide-react';
import { cn } from '@/lib/utils/index';

const PROPS = [
  { id: 'lightsaber', label: 'חרב אור (מלחמת הכוכבים)', icon: '🗡️' },
  { id: 'fedora', label: 'כובע פדורה (אינדיאנה ג\'ונס)', icon: '🎩' },
  { id: 'wand', label: 'שרביט קסמים (הארי פוטר)', icon: '🪄' },
  { id: 'shades', label: 'משקפי מטריקס', icon: '🕶️' },
];

export default function CosplayStudio() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedProp, setSelectedProp] = useState<string>(PROPS[0].id);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleGenerate = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prop: selectedProp, image: imagePreview }) // Image included for realism, API mocks it anyway
      });
      const data = await res.json();
      if (data.success) {
        setResultImage(data.imageUrl);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8" dir="rtl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-fuchsia-500/20 rounded-xl">
          <Wand2 className="w-6 h-6 text-fuchsia-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">סטודיו Cosplay (AI In-Painting)</h2>
          <p className="text-gray-400">העלה תמונה שלך וה-AI ישתיל עליך אביזרים קולנועיים בצורה ריאליסטית.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Zone */}
        <div className="space-y-6">
          <div
            className={cn(
              "relative group h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden cursor-pointer",
              isDragActive ? "border-fuchsia-500 bg-fuchsia-500/10" : "border-white/20 bg-white/5 hover:border-fuchsia-500/50 hover:bg-white/10",
              imagePreview ? "border-solid border-fuchsia-500/50" : ""
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

            {imagePreview ? (
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-0 right-0 text-center flex flex-col items-center">
                  <Camera className="w-6 h-6 text-white mb-2" />
                  <span className="text-white font-bold text-sm">החלף תמונה</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400 group-hover:text-fuchsia-400 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="font-bold text-lg mb-1">גרור תמונה לכאן</p>
                <p className="text-sm">או לחץ כדי לבחור מקובץ</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400">בחר אביזר קולנועי:</label>
            <div className="grid grid-cols-2 gap-3">
              {PROPS.map(prop => (
                <button
                  key={prop.id}
                  onClick={() => setSelectedProp(prop.id)}
                  className={cn(
                    "p-3 rounded-xl border text-right transition-all flex items-center justify-between",
                    selectedProp === prop.id 
                      ? "bg-fuchsia-500/20 border-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.2)]" 
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  )}
                >
                  <span className="font-medium text-sm">{prop.label}</span>
                  <span className="text-xl">{prop.icon}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!imagePreview || isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-black text-lg hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            {isLoading ? 'מעבד תמונה ושותל אביזרים...' : 'בצע In-Painting קולנועי'}
          </button>
        </div>

        {/* Result Zone */}
        <div className="relative h-full min-h-[400px] rounded-3xl bg-black/50 border border-white/10 flex flex-col items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
              <div className="w-20 h-20 rounded-full border-4 border-fuchsia-500/30 border-t-fuchsia-500 animate-spin mb-6" />
              <p className="text-fuchsia-400 font-bold text-xl animate-pulse">מודל ה-AI בונה קסם קולנועי...</p>
            </div>
          ) : resultImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultImage} alt="Cosplay Result" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white font-bold text-sm">
                  נוצר באמצעות מודל AI
                </div>
                <button className="w-12 h-12 bg-fuchsia-500 text-white rounded-xl flex items-center justify-center hover:bg-fuchsia-400 transition-colors shadow-lg">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 px-8">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">תוצאת ה-Cosplay שלך תופיע כאן</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
