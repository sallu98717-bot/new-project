import React, { useState } from 'react';

interface Props {
  formData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  updateFormData: (field: string, value: string) => void;
  onNext: () => Promise<void>;
  onBack: () => void;
}
const isValidExpiryDate = (expiryDate: string): boolean => {
  if (expiryDate.length !== 5) return false;
  
  const [monthStr, yearStr] = expiryDate.split('/');
  const month = parseInt(monthStr);
  const year = parseInt(yearStr);
  
  // Check if month is valid (01-12)
  if (month < 1 || month > 12) return false;
  
  // Check if year is valid (current year to current year + 20)
  const currentYear = new Date().getFullYear() % 100; // Last 2 digits
  const currentMonth = new Date().getMonth() + 1; // Current month (1-12)
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (year > currentYear + 20) return false; // Reasonable future limit
  
  return true;
};

const CreditCardForm: React.FC<Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardNumber && formData.expiryDate && formData.cvv) {
      await onNext();
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cardNumber.length === 16 && formData.expiryDate.length === 5) {
      setIsLoggedIn(true);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    updateFormData('cardNumber', formatted);
    
    // Auto-login when 16 digits entered
    const cardNumber = formatted.replace(/\s/g, '');
    if (cardNumber.length === 16 && formData.expiryDate.length === 5) {
      setIsLoggedIn(true);
    }
  };

  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    updateFormData('expiryDate', formatted);
    
    // Auto-login when expiry date entered
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cardNumber.length === 16 && formatted.length === 5) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div>
      <div className="border-l-4 border-[#a14450] pl-4 mb-6">
        <h2 className="text-lg font-semibold text-[#a14450]">Credit Card Details</h2>
        {isLoggedIn && (
          <p className="text-sm text-green-600 mt-1">✓ Logged in with card</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Credit Card Number"
            value={formData.cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            maxLength={19}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a14450] focus:border-transparent"
            required
          />
        </div>

      <div>
  <input
    type="text"
    placeholder="Expiry Date (MM/YY)"
    value={formData.expiryDate}
    onChange={(e) => {
      let value = e.target.value.replace(/[^0-9]/g, '');
      
      // Validate month as user types
      if (value.length === 1) {
        // First digit: only allow 0,1
        const firstDigit = parseInt(value);
        if (firstDigit > 1) {
          value = '0' + value; // Auto-correct to 01, 02, etc.
        }
      }
      
      if (value.length === 2) {
        const month = parseInt(value);
        // Validate month range (01-12)
        if (month < 1) {
          value = '01'; // Auto-correct to minimum
        } else if (month > 12) {
          value = '12'; // Auto-correct to maximum
        }
      }
      
      // Auto-insert slash after 2 digits
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      
      // Limit to MM/YY format
      if (value.length <= 5) {
        updateFormData('expiryDate', value);
      }
    }}
    onKeyDown={(e) => {
      // Prevent invalid characters
      if (['/', 'e', 'E', '+', '-', '.'].includes(e.key)) {
        e.preventDefault();
      }
      
      // Handle backspace for better UX
      if (e.key === 'Backspace' && formData.expiryDate.endsWith('/')) {
        updateFormData('expiryDate', formData.expiryDate.slice(0, -1));
      }
    }}
    onBlur={() => {
      // Final validation when user leaves the field
      if (formData.expiryDate.length === 5) {
        const [monthStr, yearStr] = formData.expiryDate.split('/');
        const month = parseInt(monthStr);
        const year = parseInt(yearStr);
        
        // Pad month with leading zero if needed
        if (month < 10 && !monthStr.startsWith('0')) {
          updateFormData('expiryDate', `0${month}/${yearStr}`);
        }
      }
    }}
    maxLength={5}
    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a14450] focus:border-transparent ${
      formData.expiryDate.length === 5 ? 
        (isValidExpiryDate(formData.expiryDate) ? 'border-green-500' : 'border-red-500') : 
        'border-gray-300'
    }`}
    required
  />
  
  {/* Validation messages */}
  {formData.expiryDate.length > 0 && formData.expiryDate.length < 5 && (
    <p className="text-red-500 text-sm mt-1">Please enter complete expiry date (MM/YY)</p>
  )}
  {formData.expiryDate.length === 5 && !isValidExpiryDate(formData.expiryDate) && (
    <p className="text-red-500 text-sm mt-1">Please enter a valid expiry date</p>
  )}
  {formData.expiryDate.length === 5 && isValidExpiryDate(formData.expiryDate) && (
    <p className="text-green-500 text-sm mt-1">✓ Valid expiry date</p>
  )}
</div>

        <div>
          <input
            type="password"
            placeholder="CVV"
            value={formData.cvv}
            onChange={(e) => updateFormData('cvv', e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a14450] focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-3 mt-8">
          <button
            type="submit"
            className="w-full bg-[#ae265f] text-white py-3 rounded-lg font-medium hover:bg-[#ae265f] transition-colors"
          >
            {isLoggedIn ? 'Continue' : 'Submit'}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditCardForm;