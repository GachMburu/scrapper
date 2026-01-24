'use client';

import { Lock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LockOverlayProps {
  lockedCount: number;
  price: number; 
  datasetId: string;
}

export default function LockOverlay({ lockedCount, price, datasetId }: LockOverlayProps) {
  const router = useRouter();

  const handleBuyClick = async () => {
    // Navigate to checkout API which will simulate payment and redirect back
    window.location.href = `/api/checkout?datasetId=${datasetId}`;
  };

  return (
    <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white via-white/90 to-transparent backdrop-blur-sm flex flex-col items-center justify-center pt-20">
      <Lock className="w-12 h-12 text-sky-600 mb-4" />
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Unlock {lockedCount} More Records</h3>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        Get full access to the complete dataset including all data points and details.
      </p>
      <button 
        onClick={handleBuyClick}
        className="bg-sky-600 hover:bg-sky-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-xl shadow-sky-500/40 transition transform hover:scale-105 active:scale-95"
      >
        Buy Full Access for ${price}
      </button>
      <p className="mt-4 text-sm text-slate-400 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Instant Email Delivery
      </p>
    </div>
  );
}
