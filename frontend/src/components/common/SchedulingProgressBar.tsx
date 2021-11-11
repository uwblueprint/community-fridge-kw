import { Step, Steps, useSteps } from "chakra-ui-steps";
import React from "react";

const content = (
  <div>
    <p>Hello</p>
  </div>
);

const steps = [
  { label: "Step 1", content },
  { label: "Step 2", content },
  { label: "Step 3", content },
];

const SchedulingProgressBar = () => {
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  return (
    <Steps activeStep={activeStep}>
      {steps.map(({ label }) => (
        <Step label={label} key={label}>
          {content}
        </Step>
      ))}
    </Steps>
  );
};

// const SchedulingProgressBar = ({
//   currentStep,
//   totalSteps,
// }: SchedulingProgressBarProps): JSX.Element => {
//   const [current, setCurrent] = React.useState(0);

//   function handleNext() {
//     console.log("next");
//     setCurrent(Math.min(current + 1, steps.length));
//   }
//   function handlePrevious() {
//     console.log("prev");
//     setCurrent(Math.max(current - 1, 0));
//   }
//   return (
//     <>
//       <Progress
//         value={(currentStep * 100) / totalSteps}
//         size="sm"
//         hasStripe
//         color="pink"
//       />
//       <Box bg="customTheme.colors.balcl" height="200px" width="200px" />
//       <Button onClick={handlePrevious}> Prev Page </Button>
//       <Button onClick={handleNext}> Next Page </Button>
//     </>
//   );
// };

export default SchedulingProgressBar;
