import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getInterviewDetails, getInterviewHistory } from '../services/api.js';

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.interviews)) return payload.interviews;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function normalizeMessages(details) {
  const messages = details?.messages || details?.transcript?.messages || details?.transcript || [];
  return Array.isArray(messages) ? messages : [];
}

function getMessageRole(message) {
  return String(message?.role || message?.sender || message?.type || '').toUpperCase();
}

function getMessageText(message) {
  return message?.text || message?.content || message?.message || JSON.stringify(message, null, 2);
}

export default function DashboardTester() {
  const [history, setHistory] = useState([]);
  const [details, setDetails] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const loadHistory = async () => {
    setStatus('');
    setIsLoadingHistory(true);

    try {
      const payload = await getInterviewHistory();
      setHistory(normalizeList(payload));
    } catch (error) {
      setStatus(error?.response?.data?.message || error?.message || 'Failed to load interview history.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadDetails = async (id) => {
    if (!id) return;

    setStatus('');
    setSelectedId(id);
    setIsLoadingDetails(true);

    try {
      const payload = await getInterviewDetails(id);
      setDetails(payload?.interview || payload?.data || payload);
    } catch (error) {
      setStatus(error?.response?.data?.message || error?.message || 'Failed to load interview details.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const messages = normalizeMessages(details);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Analytics Dashboard Tester</h2>
          <p className="text-sm text-slate-600">Fetch interview history and inspect saved transcripts.</p>
        </div>
        <button
          type="button"
          onClick={loadHistory}
          disabled={isLoadingHistory}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoadingHistory ? 'Loading...' : 'Load History'}
        </button>
      </div>

      {status ? <div className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{status}</div> : null}

      <div className="max-h-80 overflow-auto rounded-md border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="sticky top-0 bg-slate-100 text-left text-xs uppercase text-slate-600">
            <tr>
              <th className="px-3 py-2 font-semibold">Session ID</th>
              <th className="px-3 py-2 font-semibold">Target Role</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">AI Score</th>
              <th className="px-3 py-2 font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {history.length ? (
              history.map((item) => {
                const id = item.id || item.sessionId || item._id;

                return (
                  <tr
                    key={id}
                    onClick={() => loadDetails(id)}
                    className={`cursor-pointer hover:bg-teal-50 ${
                      selectedId === id ? 'bg-teal-50' : ''
                    }`}
                  >
                    <td className="max-w-48 truncate px-3 py-2 font-mono text-xs text-slate-700">{id}</td>
                    <td className="px-3 py-2">{item.targetRole || item.role || 'N/A'}</td>
                    <td className="px-3 py-2">{item.status || 'N/A'}</td>
                    <td className="px-3 py-2">{item.aiScore ?? item.score ?? 'N/A'}</td>
                    <td className="px-3 py-2">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="px-3 py-8 text-center text-slate-500" colSpan="5">
                  No history loaded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isLoadingDetails ? <div className="mt-4 text-sm text-slate-600">Loading details...</div> : null}

      {details ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-600">Overall Score</p>
            <p className="text-3xl font-bold text-teal-700">{details.aiScore ?? details.score ?? 'N/A'}</p>
          </div>

          <div className="rounded-md border border-slate-200 p-4">
            <h3 className="mb-2 font-semibold text-slate-950">Feedback</h3>
            <div className="prose prose-sm max-w-none text-slate-700">
              <ReactMarkdown>{details.feedback || 'No feedback field returned.'}</ReactMarkdown>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 p-4">
            <h3 className="mb-3 font-semibold text-slate-950">Transcript Messages</h3>
            <div className="max-h-96 space-y-3 overflow-auto">
              {messages.length ? (
                messages.map((message, index) => {
                  const role = getMessageRole(message);
                  const isUser = role.includes('USER') || role.includes('CANDIDATE');

                  return (
                    <div key={`${role}-${index}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          isUser ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p className="mb-1 text-xs font-bold uppercase opacity-75">{isUser ? 'USER' : 'AI'}</p>
                        <p className="whitespace-pre-wrap">{getMessageText(message)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">No nested messages array returned.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
