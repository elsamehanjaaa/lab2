import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react"; // assuming you're using Feather Icons

type StepButtonProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
  submit: (e: any) => void;
  finalStepTitle?: string;
  loading: boolean;
};

const StepButton: React.FC<StepButtonProps> = ({
  step,
  setStep,
  totalSteps,
  submit,
  finalStepTitle,
  loading,
}) => {
  return (
    <div className="flex justify-between mt-8">
      {step == 1 ? (
        <button
          type="button"
          onClick={() => setStep(step + 1)}
          className="w-40 bg-blue-900 flex justify-around relative hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
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
            type="button"
            disabled={loading}
            onClick={(e) => submit(e)}
            className={`w-40 ${
              loading ? "bg-green-700 cursor-not-allowed" : "bg-green-600"
            } hover: text-white font-medium py-2 px-6 rounded-lg transition align-middle`}
          >
            {loading ? (
              <LoaderCircle className="animate-spin w-8 h-8 text-gray-700 mx-auto" />
            ) : (
              finalStepTitle || "Create Course"
            )}
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
            className="w-40 bg-blue-900 flex justify-around relative  text-white font-medium py-2 px-6 rounded-lg transition"
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
