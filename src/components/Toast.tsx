import React from 'react';

export function useToast() {
  const [msg, setMsg] = React.useState<string | null>(null);
  const show = React.useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 1600);
  }, []);
  return { msg, show };
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      <div className={`toast ${message ? 'toast--show' : ''}`}>{message}</div>
    </div>
  );
}
