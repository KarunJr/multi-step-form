import {
  type Step,
  type CompanySchema,
} from "@/types";
import { BriefcaseBusiness, User } from "lucide-react";
import { useState } from "react";

export const steps: Step[] = [
  { id: "company", name: "Company Details", icon: BriefcaseBusiness },
  { id: "users", name: "Shareholder Details", icon: User },
];

export function useMultipleForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CompanySchema>>({});

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  /** --- Go to next step --- */
  const goToNextStep = () => {    
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  /** --- Go to previous step --- */
  const goToPrevStep = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /** --- Merge and update form data --- */
  const updateFormData = (newData: Partial<CompanySchema>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  /** --- Reset the form entirely --- */
  const resetForm = () => {
    setFormData({});
    setCurrentStep(0);
  };


  return {
    currentStep,
    formData,
    isFirstStep,
    isLastStep,
    steps,

    goToNextStep,
    goToPrevStep,
    updateFormData,
    resetForm,
  }
}
