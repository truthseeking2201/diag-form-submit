import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FormProvider, useForm } from './hooks/useForm';
import { Stepper } from './components/Stepper';
import { BottomBar } from './components/BottomBar';
import { PatientForm } from './components/PatientForm';
import { TestPicker } from './components/TestPicker';
import { ReviewAndSign } from './components/ReviewAndSign';

function Steps() {
  const { step, data, totalSelected } = useForm();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const meta = React.useMemo(
    () => [
      {
        title: 'Patient onboarding',
        subtitle:
          data.patient.fullName && data.patient.phone
            ? `${data.patient.fullName} • ${data.patient.phone}`
            : 'Capture contact, identifiers, and sample priority.',
      },
      {
        title: 'Curate diagnostics',
        subtitle:
          totalSelected > 0
            ? `${totalSelected} test${totalSelected > 1 ? 's' : ''} selected.`
            : 'Search and tap to pick the right panels.',
      },
      {
        title: 'Review & finalize',
        subtitle: data.signatureDataUrl
          ? 'Signature captured. Generate the PDF anytime.'
          : 'Verify details, capture signature, then export.',
      },
    ],
    [data.patient.fullName, data.patient.phone, totalSelected, data.signatureDataUrl]
  );

  const renderStep = () => {
    if (step === 0) return <PatientForm />;
    if (step === 1) return <TestPicker />;
    return <ReviewAndSign />;
  };

  return (
    <main className="container">
      <Stepper />
      <motion.section
        key={`intro-${step}`}
        className="step-intro"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h1 className="step-intro__title">{meta[step].title}</h1>
        <p className="step-intro__subtitle">{meta[step].subtitle}</p>
      </motion.section>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="step-transition"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
      <BottomBar />
    </main>
  );
}

const App: React.FC = () => (
  <FormProvider>
    <Steps />
  </FormProvider>
);

export default App;
