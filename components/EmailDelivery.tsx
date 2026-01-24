'use client';

import { Mail, Loader, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface EmailDeliveryProps {
  datasetId: string;
}

type ModalState = 'idle' | 'loading' | 'success';

export default function EmailDelivery({ datasetId }: EmailDeliveryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<ModalState>('idle');

  const handleSendEmail = async () => {
    if (!email) return;

    setState('loading');
    
    try {
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, datasetId }),
      });

      if (response.ok) {
        setState('success');
        setTimeout(() => {
          setIsOpen(false);
          setState('idle');
          setEmail('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setState('idle');
    }
  };

  return (
    <>
      {/* Email Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
      >
        <Mail className="w-4 h-4" /> Email Data
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            {state === 'idle' && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Data to Email</h2>
                <p className="text-slate-600 mb-6">Enter your email address to receive the dataset as CSV.</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setEmail('');
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={!email}
                    className="flex-1 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    Send Now
                  </button>
                </div>
              </>
            )}

            {state === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader className="w-8 h-8 text-sky-600 animate-spin mb-4" />
                <p className="text-slate-600">Sending your data...</p>
              </div>
            )}

            {state === 'success' && (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle2 className="w-8 h-8 text-green-600 mb-4" />
                <p className="text-lg font-semibold text-green-600">Sent!</p>
                <p className="text-slate-600 text-center text-sm mt-2">
                  Check your email inbox for the dataset.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
