import type { Step } from "@/types"
import { Check } from "lucide-react";

interface ProgressSteps {
  currentStep: number,
  steps: Step[]
}

const ProgressSteps = ({ currentStep, steps }: ProgressSteps) => {
  return (
    <div className="ml-2 sm:ml-30 flex items-center justify-between">
      {
        steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted ? "bg-primary text-primary-foreground" : isCurrent ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-500"}`}>

                  {
                    isCompleted ? (<Check className="w-5 h-5" />) : (<Icon className="h-5 w-5" />)
                  }
                </div>
                <span className="text-xs mt-2 font-medium">{step.name}</span>
              </div>

              {
                index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 w-full mx-2 transition-colors ${isCompleted ? "bg-primary" : "bg-gray-200"}`} />
                )
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default ProgressSteps
