'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  datasetId: string;
  datasetName: string;
  price: number;
  onClose: () => void;
}

export default function CheckoutModal({
  isOpen,
  datasetId,
  datasetName,
  price,
  onClose,
}: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Redirect to checkout API which will then redirect to dataset page with paid=true
      window.location.href = `/api/checkout?datasetId=${datasetId}`;
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Unlock Dataset</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-2">Dataset</p>
            <p className="text-lg font-semibold text-slate-900">{datasetName}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex items-baseline justify-between">
              <span className="text-slate-600 font-medium">Price</span>
              <span className="text-3xl font-bold text-slate-900">
                ${price}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-6">
            Get full access to this dataset including download and email delivery options.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : `Pay $${price}`}
          </button>
        </div>
      </div>
    </div>
  );
}
