import React, { useState, useRef, useEffect } from 'react';

interface Props {
  formData: { otp: string };
  updateFormData: (field: string, value: string) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  onError: () => void;
  clearOTPTrigger?: number; // Add this prop
}

const OTPVerification: React.FC<Props> = ({ 
  formData, 
  updateFormData, 
  onSubmit, 
  onBack, 
  onError,
  clearOTPTrigger 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(109);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Clear OTP when component mounts OR when clearOTPTrigger changes
  useEffect(() => {
    setOtp(['', '', '', '', '', '']);
    updateFormData('otp', '');
    console.log('OTP cleared automatically');
  }, [clearOTPTrigger]); // This will run when clearOTPTrigger changes

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOTPChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);
    updateFormData('otp', newOtp.join(''));

    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbersOnly = pastedData.replace(/[^0-9]/g, '');
    
    if (numbersOnly.length >= 6) {
      const newOtp = numbersOnly.split('').slice(0, 6);
      setOtp(newOtp);
      updateFormData('otp', newOtp.join(''));
      inputRefs.current[5]?.focus();
    }
  };
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length === 6) {
      try {
        await onSubmit();
        onError();
      } catch (error) {
        console.error('Submission error:', error);
        onError();
      }
    }
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    updateFormData('otp', '');
    setCountdown(109);
    
    setTimeout(() => {
      inputRefs.current[0]?.focus();
      inputRefs.current[0]?.select();
    }, 100);
    
    console.log('OTP cleared and resend requested');
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 sm:px-0">
      <div className="border-l-4 border-[#a14450] pl-4 mb-6">
        <h2 className="text-lg font-semibold text-[#a14450]">One Time Password</h2>
      </div>

      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        A 6-digit One Time Password has been sent to your registered mobile number.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-2 sm:space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-medium border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a14450] focus:border-transparent transition-colors duration-200"
              maxLength={1}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={otp.join('').length !== 6}
          className="w-full bg-[#ae265f] text-white py-3 rounded-lg font-medium hover:bg-[#8a1e4b] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          Submit
        </button>

        <div className="text-center">
          <p className="text-gray-600 mb-2 text-sm sm:text-base">
            Didn't receive the OTP?{' '}
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-[#a14450] hover:underline font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={countdown > 100}
            >
              Resend 
            </button>
            {countdown > 0 && (
              <span className="text-gray-500 text-sm sm:text-base"> (in {formatTime(countdown)})</span>
            )}
          </p>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;