'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';

export default function PhoneLoginPage() {
  const router = useRouter();
  const { setupRecaptcha, sendPhoneOTP, verifyPhoneOTP } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Initialize reCAPTCHA on component mount
    const { verifier, error: recaptchaError } = setupRecaptcha('recaptcha-container');
    
    if (recaptchaError) {
      setError('Failed to initialize reCAPTCHA: ' + recaptchaError);
    } else {
      setRecaptchaVerifier(verifier);
    }
  }, [setupRecaptcha]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!recaptchaVerifier) {
      setError('reCAPTCHA not initialized. Please refresh the page.');
      return;
    }

    setLoading(true);

    // Format phone number with country code if not present
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    const { confirmationResult, error: otpError } = await sendPhoneOTP(
      formattedPhone,
      recaptchaVerifier
    );

    setLoading(false);

    if (otpError) {
      setError(otpError);
      return;
    }

    if (confirmationResult) {
      setConfirmationResult(confirmationResult);
      setStep('otp');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!confirmationResult) {
      setError('No confirmation result found. Please try again.');
      return;
    }

    setLoading(true);

    const { user, error: verifyError } = await verifyPhoneOTP(confirmationResult, otp);

    setLoading(false);

    if (verifyError) {
      setError(verifyError);
      return;
    }

    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Phone Login</h1>
          <p className="mt-2 text-gray-600">
            {step === 'phone' ? 'Enter your phone number' : 'Enter the verification code'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="+1234567890"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Include country code (e.g., +1 for US, +880 for Bangladesh)
                </p>
              </div>

              {/* reCAPTCHA container */}
              <div id="recaptcha-container"></div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
                <p className="mt-1 text-xs text-gray-500 text-center">
                  Enter the 6-digit code sent to {phoneNumber}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
                className="w-full py-2 text-sm text-blue-600 hover:underline"
              >
                Change phone number
              </button>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <Link href="/login" className="block text-sm text-blue-600 hover:underline">
              Sign in with Email
            </Link>
            <Link href="/signup" className="block text-sm text-blue-600 hover:underline">
              Create new account
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> Phone authentication requires verification. Make sure your phone
            number is valid and can receive SMS messages.
          </p>
        </div>
      </div>
    </div>
  );
}
