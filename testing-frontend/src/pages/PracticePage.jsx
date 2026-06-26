import { useMemo, useState } from 'react';
import PracticeWorkspace from '../components/PracticeWorkspace.jsx';
import { getCompanyMcqs, getPracticeChallenges } from '../services/api.js';

const companies = [
  'Google', 'Amazon', 'Meta', 'Microsoft', 'Netflix', 'Apple', 'Adobe', 'Salesforce',
  'Oracle', 'IBM', 'Intel', 'Nvidia', 'Tesla', 'Uber', 'Airbnb', 'LinkedIn', 'Spotify',
  'PayPal', 'Stripe', 'Atlassian', 'ServiceNow', 'Cisco', 'Qualcomm', 'Samsung',
  'Flipkart', 'Zomato', 'Swiggy', 'Walmart', 'Goldman Sachs', 'Morgan Stanley',
  'JPMorgan Chase', 'TCS', 'Infosys', 'Wipro', 'Accenture'
];

function normalizeArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export default function PracticePage() {
  const [query, setQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [mcqs, setMcqs] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredCompanies = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return companies.filter((company) => company.toLowerCase().includes(needle));
  }, [query]);

  const selectCompany = async (company) => {
    setSelectedCompany(company);
    setStatus('');
    setIsLoading(true);

    try {
      const [mcqPayload, challengePayload] = await Promise.all([getCompanyMcqs(company), getPracticeChallenges()]);
      setMcqs(normalizeArray(mcqPayload));
      setChallenges(normalizeArray(challengePayload));
    } catch (error) {
      setStatus(error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Practice data request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* THE FIX: We wrap the left and right sides in a Flex container 
        lg:flex-row makes it side-by-side on large screens, stacked on mobile.
      */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* === LEFT COLUMN: Company Grid (Takes up 2/3 of space) === */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Practice Hub</h2>
                <p className="text-sm text-slate-600">Select a dream company and probe practice endpoints.</p>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:max-w-xs"
                placeholder="Search companies"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 h-[600px] overflow-y-auto pr-2">
              {filteredCompanies.map((company) => (
                <button
                  key={company}
                  type="button"
                  onClick={() => selectCompany(company)}
                  className={`rounded-lg border px-4 py-4 text-left text-sm font-semibold shadow-sm hover:border-teal-500 hover:bg-teal-50 ${
                    selectedCompany === company ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: Workspace (Takes up 1/3 of space) === */}
        <div className="w-full lg:w-1/3 sticky top-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Dream Company</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-950">{selectedCompany || 'None selected'}</h3>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">{mcqs.length} MCQs</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                  {challenges.length} Challenges
                </span>
              </div>
            </div>

            {status ? <div className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{status}</div> : null}
            {isLoading ? <div className="mt-4 text-sm text-slate-600">Loading practice data...</div> : null}
          </div>

          {/* Render the interactive workspace here on the right! */}
          {selectedCompany && !isLoading && (
            <PracticeWorkspace mcqs={mcqs} codingChallenges={challenges} />
          )}
        </div>

      </div>
    </section>
  );
}