import ProgressSteps from "@/components/ProgressSteps";
import { CompanyDetails, ShareHolderDetails } from "@/components/steps";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useMultipleForm } from "@/hooks/use-multi-step-form";
import { companySchema, type CompanySchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Register = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    formData,
    isFirstStep,
    isLastStep,
    steps,

    goToNextStep,
    goToPrevStep,
    updateFormData,
    resetForm
  } = useMultipleForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    control,
    watch,
  } = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    mode: "onChange",
    defaultValues: formData,
  });

  useEffect(() => {
    reset(formData);
  }, [currentStep, formData, reset]);

  useEffect(() => {
    const saved = localStorage.getItem("companyDetails")
    if (saved) {
      const parsed = JSON.parse(saved);
      fetch(`http://localhost:3000/company/${parsed.companyId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            reset({
              companyName: data.company.company_name,
              panNumber: data.company.pan_number,
              totalCapitalInvested: data.company.total_capital_invested,
              numberOfShareholders: data.company.no_of_shareholders,
            });
          }
        });
    }
  }, [])
  const onNext = async (data: CompanySchema) => {
    // Manual validation check
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    if (isFirstStep) {
      try {
        const companyDetails = JSON.parse(localStorage.getItem("companyDetails") || "{}");
        const endpoint = companyDetails.companyId
          ? "http://localhost:3000/register/update"
          : "http://localhost:3000/register";

        const method = companyDetails.companyId ? "PUT" : "POST"
        const request = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ company_id: companyDetails.companyId, company_name: data.companyName, pan_number: data.panNumber, total_capital_invested: data.totalCapitalInvested, no_of_shareholders: data.numberOfShareholders })
        })
        const response = await request.json();
        if (!response || !response.success) {
          alert(response.message);
          return;
        }
        if (method === "POST") {
          alert(response.message);
        }
        const companyId = response.companyId || companyDetails.companyId;
        window.localStorage.setItem("companyDetails", JSON.stringify({ ...data, companyId }))
      } catch (error) {
        console.error("Error while creating company, please try again later", error)
      }
    }

    //Merge current data with all previous data
    const updateData = { ...formData, ...data };
    updateFormData(updateData);
    if (isLastStep) {
      const companyDetails = JSON.parse(localStorage.getItem("companyDetails") || "{}");
      console.log("CompanyDetails:", companyDetails);

      const response = await fetch("http://localhost:3000/shareholders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ shareholders: updateData.shareholders, company_id: companyDetails.companyId })
      })

      const result = await response.json();

      if (!result.success) {
        alert("Failed to register shareholders");
        return;
      }

      alert(result.message);
      localStorage.removeItem("companyDetails");
      resetForm();
      navigate("/", { replace: true })
    } else {
      goToNextStep();
    }
  };
  return (
    <div className="flex justify-center bg-gray-50 px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <ProgressSteps currentStep={currentStep} steps={steps} />
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <CompanyDetails register={register} errors={errors} />
          )}
          {currentStep === 1 && (
            <ShareHolderDetails
              register={register}
              errors={errors}
              control={control}
              watch={watch}
            />
          )}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => goToPrevStep()}
              disabled={isFirstStep}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <Button type="button" onClick={handleSubmit(onNext)}>
              {isLastStep ? "Submit" : "Next"}
              {!isLastStep && <ChevronRight className="w-4 h-4 mr-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
