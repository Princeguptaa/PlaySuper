import React, { useState, useEffect } from 'react';
import { useAppStore } from '../state/useAppStore';
import { CoachMark } from '../components/CoachMark';

const TOUR_STEPS = [
  { id: 'tour-step-1', text: 'Play a round to earn coins' },
  { id: 'tour-step-2', text: 'Pin a reward as your goal' },
  { id: 'tour-step-3', text: 'See how many rounds it takes' },
  { id: ['tour-step-4', 'tour-step-4-desktop'], text: 'Open the PM Lens to see the data' },
];

export const GuidedTour: React.FC = () => {
  const { tourDone, screen } = useAppStore(state => ({
    tourDone: state.ui.tourDone,
    screen: state.ui.screen,
  }));
  
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (tourDone) return;
    
    // Auto-advance or sync step based on screen
    if (screen === 'game' && step === 0) {
      // stay on step 0
    } else if (screen === 'store_home' && step === 0) {
      setStep(1); // auto advance to goal card step
    } else if (screen === 'reward_detail' && step === 1) {
      setStep(2); // auto advance to effort label step
    }
  }, [screen, step, tourDone]);

  if (tourDone) return null;
  if (step >= TOUR_STEPS.length) {
    useAppStore.setState(state => ({ ui: { ...state.ui, tourDone: true } }));
    return null;
  }

  const currentStep = TOUR_STEPS[step];

  const handleNext = () => {
    if (step === TOUR_STEPS.length - 1) {
      useAppStore.setState(state => ({ ui: { ...state.ui, tourDone: true } }));
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = () => {
    useAppStore.setState(state => ({ ui: { ...state.ui, tourDone: true } }));
  };

  return (
    <CoachMark
      targetId={currentStep.id}
      text={currentStep.text}
      step={step + 1}
      totalSteps={TOUR_STEPS.length}
      onNext={handleNext}
      onSkip={handleSkip}
    />
  );
};
