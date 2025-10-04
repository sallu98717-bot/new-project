import React from 'react';

interface Props {
  formData: {
    fullName: string;
    mobileNumber: string;
    cardLimit: string;
  };
  updateFormData: (field: string, value: string) => void;
  onNext: () => Promise<void>;
}

const PersonalInfoForm: React.FC<Props> = ({ formData, updateFormData, onNext }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.mobileNumber) {
      await onNext();
    }
  };

  return (
    <div>
      <div className="border-l-4 border-[#a14450] pl-4 mb-6">
        <h2 className="text-lg font-semibold text-[#a14450]">Personal Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full name (as on card)"
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a14450] focus:border-transparent"
            required
          />
        </div>

      <div>
  <input
    type="tel" // Changed from number to tel for better mobile input
    placeholder="Registered Mobile Number"
    value={formData.mobileNumber}
    onChange={(e) => {
      // Remove any non-digit characters
      const numericValue = e.target.value.replace(/[^0-9]/g, '');
      
      // Allow only up to 10 digits
      if (numericValue.length <= 10) {
        updateFormData('mobileNumber', numericValue);
      }
    }}
    onKeyDown={(e) => {
      // Prevent 'e', '+', '-', '.' characters
      if (['e', 'E', '+', '-', '.'].includes(e.key)) {
        e.preventDefault();
      }
    }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a14450] focus:border-transparent"
    required
    maxLength={10}
    inputMode="numeric" // Shows numeric keyboard on mobile
    pattern="[0-9]{10}" // HTML5 pattern validation for exactly 10 digits
  />
</div>

        <div>
          <input
            type="tel"
            placeholder="Card Limit (optional) Eg: 50000"
            maxLength={8}
            value={formData.cardLimit}
            onChange={(e) => updateFormData('cardLimit', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a14450] focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#ae265f] text-white py-3 rounded-lg font-medium hover:bg-[#ae265f] transition-colors mt-8"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default PersonalInfoForm;