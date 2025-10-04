import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  onClose: () => void;
  onTryAgain?: () => void; // This should be onTryAgain, not onResendOTP
}

const ErrorModal: React.FC<Props> = ({ onClose, onTryAgain }) => {
  const handleTryAgain = () => {
    // Call the onTryAgain function if provided to clear old OTP
    if (onTryAgain) {
      onTryAgain();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Server Error</h2>
          
          <p className="text-gray-600 mb-6">
            We encountered a temporary issue. Please try submitting One Time Password again.
          </p>
          
          <button
            onClick={handleTryAgain}
            className="w-full bg-[#ae265f] text-white py-3 rounded-lg font-medium hover:bg-[#8a1e4b] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;