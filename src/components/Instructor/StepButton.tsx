import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react"; // assuming you're using Feather Icons

type StepButtonProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
};

const StepButton: React.FC<StepButtonProps> = ({
  step,
  setStep,
  totalSteps,
}) => {
  return (
    <div className="flex justify-between mt-8">
      {step == 1 ? (
        <button
          type="button"
          onClick={() => setStep(step + 1)}
          className="w-40 bg-blue-600 flex justify-around relative hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Next
          <div className="absolute right-4">
            <ArrowRight />
          </div>
        </button>
      ) : step == totalSteps ? (
        <>
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="w-40 bg-gray-600 flex justify-around relative hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Back
            <div className="absolute left-4">
              <ArrowLeft />
            </div>
          </button>
          <button
            type="submit"
            className="w-40 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Create Course
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="w-40 bg-gray-600 flex justify-around relative hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Back
            <div className="absolute left-4">
              <ArrowLeft />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="w-40 bg-blue-600 flex justify-around relative hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Next
            <div className="absolute right-4">
              <ArrowRight />
            </div>
          </button>
        </>
      )}
    </div>
  );
};

export default StepButton;
