import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FormProvider, useForm } from './hooks/useForm';
import { Stepper } from './components/Stepper';
import { BottomBar } from './components/BottomBar';
import { PatientForm } from './components/PatientForm';
import { TestPicker } from './components/TestPicker';
import { ReviewAndSign } from './components/ReviewAndSign';
import { LocaleSwitch } from './components/LocaleSwitch';
import { useLocale } from './i18n/LocaleContext';
import { CompletionBanner } from './components/CompletionBanner';

function Steps() {
  const { step, data, totalSelected } = useForm();
  const { locale, t } = useLocale();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const meta = React.useMemo(
    () => [
      {
        title: locale === 'en' ? 'Patient onboarding' : 'Nhập thông tin bệnh nhân',
        subtitle:
          data.patient.fullName && data.patient.phone
            ? `${data.patient.fullName} • ${data.patient.phone}`
            : locale === 'en'
            ? 'Capture contact, identifiers, and sample priority.'
            : 'Nhập liên hệ, thông tin định danh và ưu tiên mẫu.',
      },
      {
        title: locale === 'en' ? 'Curate diagnostics' : 'Chọn xét nghiệm',
        subtitle:
          totalSelected > 0
            ? `${totalSelected} test${totalSelected > 1 ? 's' : ''} selected.`
            : locale === 'en'
            ? 'Search and tap to pick the right panels.'
            : 'Tìm và chọn các gói xét nghiệm phù hợp.',
      },
      {
        title: locale === 'en' ? 'Review & finalize' : 'Xem lại & hoàn tất',
        subtitle: data.signatureDataUrl
          ? locale === 'en'
            ? 'Signature captured. Generate the PDF anytime.'
            : 'Đã ký. Có thể xuất PDF bất kỳ lúc nào.'
          : locale === 'en'
          ? 'Verify details, capture signature, then export.'
          : 'Kiểm tra thông tin, ký xác nhận rồi xuất PDF.',
      },
    ],
    [locale, data.patient.fullName, data.patient.phone, totalSelected, data.signatureDataUrl]
  );

  const renderStep = () => {
    if (step === 0) return <PatientForm />;
    if (step === 1) return <TestPicker />;
    return <ReviewAndSign />;
  };

  const priorityLabel = data.priority === 'Regular' ? t('regular') : t('urgent');
  const testsLabel =
    totalSelected > 0
      ? t('stepTestsSelected', { count: totalSelected, plural: totalSelected > 1 ? 's' : '' })
      : locale === 'en'
      ? 'None yet'
      : 'Chưa có';
  const summaryMeta = {
    patient: data.patient.fullName.trim() || '—',
    priority: priorityLabel,
    tests: testsLabel,
    doctor: data.patient.doctor.trim() || '—',
  };

  return (
    <main className="container">
      <LocaleSwitch />
      <Stepper />
      <CompletionBanner />
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
        {step > 0 && (
          <motion.aside
            key={`summary-${step}-${summaryMeta.tests}`}
            className="compact-summary"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            aria-live="polite"
          >
            <h2 className="compact-summary__title">{t('snapshotTitle')}</h2>
            <div className="compact-summary__grid">
              <div className="compact-summary__item">
                <span>{t('snapshotPatient')}</span>
                <span>{summaryMeta.patient}</span>
              </div>
              <div className="compact-summary__item">
                <span>{t('snapshotPriority')}</span>
                <span>{summaryMeta.priority}</span>
              </div>
              <div className="compact-summary__item">
                <span>{t('snapshotTests')}</span>
                <span>{summaryMeta.tests}</span>
              </div>
              <div className="compact-summary__item">
                <span>{t('snapshotDoctor')}</span>
                <span>{summaryMeta.doctor}</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
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
