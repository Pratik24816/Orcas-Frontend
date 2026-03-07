// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { apiFetch } from '../services/api';
// import { Card, PrimaryButton } from '../components/Ui';
// import { useAuth } from '../context/AuthContext';

// const InviteAcceptPage = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const { setUser } = useAuth();
//   const [step, setStep] = useState('request');
//   const [form, setForm] = useState({ code: '' });
//   const [message, setMessage] = useState('');

//   const requestOtp = async () => {
//     try {
//       await apiFetch(`/api/invitations/${token}/request-otp`, { method: 'POST' });
//       setMessage('OTP sent to your email.');
//       setStep('verify');
//     } catch (err) {
//       setMessage(err.message);
//     }
//   };

//   const verifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const user = await apiFetch(`/api/invitations/${token}/verify-otp`, {
//         method: 'POST',
//         body: JSON.stringify({ code: form.code })
//       });
//       setUser(user);
//       navigate('/dev');
//     } catch (err) {
//       setMessage(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-6">
//       <Card className="w-full max-w-lg">
//         <h2 className="font-heading text-2xl mb-4">Accept Invitation</h2>
//         {step === 'request' ? (
//           <div>
//             <p className="text-slate-700 mb-4">Request a one-time OTP to verify your email.</p>
//             <PrimaryButton onClick={requestOtp}>Send OTP</PrimaryButton>
//           </div>
//         ) : (
//           <form onSubmit={verifyOtp} className="space-y-3">
//             <input
//               className="w-full border rounded-xl px-4 py-3"
//               placeholder="OTP Code"
//               value={form.code}
//               onChange={(e) => setForm({ ...form, code: e.target.value })}
//             />
//             <PrimaryButton type="submit">Verify & Join</PrimaryButton>
//           </form>
//         )}
//         {message && <p className="text-slate-700 mt-3">{message}</p>}
//       </Card>
//     </div>
//   );
// };

// export default InviteAcceptPage;



import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './InviteAcceptPage.css';

const InviteAcceptPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState('request');
  const [form, setForm] = useState({ code: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      await apiFetch(`/api/invitations/${token}/request-otp`, { method: 'POST' });
      setMessage('OTP sent to your email. Check your inbox.');
      setStep('verify');
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const user = await apiFetch(`/api/invitations/${token}/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({ code: form.code })
      });
      setUser(user);
      navigate('/dev');
    } catch (err) {
      setMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="iap">
      {/* Background shapes */}
      <div className="iap-bg-shapes" aria-hidden="true">
        <div className="iap-triangle-blue" />
        <div className="iap-triangle-green" />
        <div className="iap-dot-grid" />
      </div>

      {/* Nav */}
      <header className="iap-nav">
        <div className="iap-logo">
          <div className="iap-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span className="iap-logo-name">Orcas</span>
        </div>
      </header>

      {/* Main */}
      <main className="iap-main">
        <div className="iap-card">

          {/* Icon */}
          <div className="iap-icon-wrap">
            <div className="iap-icon-pulse" />
            <div className="iap-icon">
              {step === 'request' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="30" height="30">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="30" height="30">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
            </div>
          </div>

          {/* Step indicator */}
          <div className="iap-steps">
            <div className={`iap-step ${step === 'request' ? 'iap-step--active' : 'iap-step--done'}`}>
              <div className="iap-step-dot">
                {step === 'verify' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                ) : '1'}
              </div>
              <span>Send OTP</span>
            </div>
            <div className="iap-step-line" />
            <div className={`iap-step ${step === 'verify' ? 'iap-step--active' : ''}`}>
              <div className="iap-step-dot">2</div>
              <span>Verify & Join</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="iap-title">
            {step === 'request' ? 'Accept Invitation' : 'Verify Your Email'}
          </h2>
          <p className="iap-sub">
            {step === 'request'
              ? "You've been invited to join a workspace. We'll send a one-time code to verify your email."
              : 'Enter the 6-digit code we sent to your email to complete joining the workspace.'}
          </p>

          {/* Step: Request OTP */}
          {step === 'request' && (
            <div className="iap-section">
              <div className="iap-info-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                A one-time code will be sent to the email address registered with this invite.
              </div>
              <button
                className="iap-primary-btn"
                onClick={requestOtp}
                disabled={loading}
              >
                {loading ? (
                  <span className="iap-spinner" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                )}
                {loading ? 'Sending…' : 'Send OTP to Email'}
              </button>
            </div>
          )}

          {/* Step: Verify OTP */}
          {step === 'verify' && (
            <form onSubmit={verifyOtp} className="iap-section">
              <div className="iap-field">
                <label htmlFor="iap-code">One-Time Code</label>
                <div className="iap-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="iap-code"
                    placeholder="e.g. 482910"
                    value={form.code}
                    maxLength={8}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="iap-primary-btn"
                disabled={loading || !form.code.trim()}
              >
                {loading ? (
                  <span className="iap-spinner" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                )}
                {loading ? 'Verifying…' : 'Verify & Join Workspace'}
              </button>

              <button
                type="button"
                className="iap-ghost-btn"
                onClick={() => { setStep('request'); setMessage(''); setForm({ code: '' }); }}
              >
                Resend Code
              </button>
            </form>
          )}

          {/* Message */}
          {message && (
            <div className={`iap-message ${isError ? 'iap-message--error' : 'iap-message--success'}`}>
              {isError ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
              {message}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="iap-footer-note">
          Secure invite · Powered by Orcas
        </p>
      </main>

      <footer className="iap-footer">
        © 2024 Orcas Inc. &nbsp;·&nbsp;
        <a href="#">Privacy</a> &nbsp;·&nbsp;
        <a href="#">Terms</a>
      </footer>
    </div>
  );
};

export default InviteAcceptPage;