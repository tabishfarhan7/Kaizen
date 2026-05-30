import { useState } from 'react';
import { loginUser, registerUser } from '../services/api.js';

const initialForm = {
  name: '',
  email: '',
  password: '',
};

function getTokenFromResponse(data) {
  return data?.token || data?.jwt || data?.accessToken || data?.data?.token || '';
}

export default function AuthTester({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    try {
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const data = mode === 'login' ? await loginUser(payload) : await registerUser(payload);
      const token = getTokenFromResponse(data);

      if (!token) {
        setStatus('Request succeeded, but no token was found in the response payload.');
        return;
      }

      localStorage.setItem('token', token);
      onAuthenticated(token);
    } catch (error) {
      setStatus(error?.response?.data?.message || error?.message || 'Authentication request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 grid grid-cols-2 rounded-md bg-slate-100 p-1">
        {['login', 'register'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setMode(item);
              setStatus('');
            }}
            className={`rounded px-3 py-2 text-sm font-semibold capitalize ${
              mode === item ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <form onSubmit={submitForm} className="space-y-4">
        {mode === 'register' ? (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Test Candidate"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="candidate@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
          <input
            required
            type="password"
            name="password"
            value={form.password}
            onChange={updateField}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            placeholder="password"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Submitting...' : mode === 'login' ? 'Login and Open Workspace' : 'Register and Open Workspace'}
        </button>
      </form>

      {status ? (
        <pre className="mt-4 max-h-48 overflow-auto rounded-md bg-rose-50 p-3 text-sm text-rose-800">{status}</pre>
      ) : null}
    </section>
  );
}
