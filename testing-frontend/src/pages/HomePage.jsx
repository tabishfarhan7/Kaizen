import { Link } from 'react-router-dom';
import DashboardTester from '../components/DashboardTester.jsx';

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('kaizenUser')) || {};
  } catch {
    return {};
  }
}

const heatmapCells = Array.from({ length: 84 }, (_, index) => {
  const values = ['bg-slate-200', 'bg-emerald-100', 'bg-emerald-300', 'bg-emerald-500', 'bg-teal-700'];
  return values[(index * 7 + index) % values.length];
});

export default function HomePage() {
  const user = getStoredUser();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Landing Dashboard</h2>
          <p className="mt-1 text-sm text-slate-600">Choose the next backend flow to exercise.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link
              to="/practice"
              className="rounded-lg border border-teal-200 bg-teal-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-md"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Option A</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">Enhance Your Skills</h3>
              <p className="mt-3 text-sm text-slate-700">Company practice, MCQ probes, and coding challenge checks.</p>
            </Link>

            <Link
              to="/interview"
              className="rounded-lg border border-slate-300 bg-slate-950 p-6 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-md"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">Option B</p>
              <h3 className="mt-2 text-2xl font-bold">Attempt Live Interview</h3>
              <p className="mt-3 text-sm text-slate-200">WebSocket voice room, webcam preview, and transcript terminal.</p>
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Profile</p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{user.name || 'Test Candidate'}</h3>
          <p className="mt-1 text-sm text-slate-600">{user.targetRole || 'Full-Stack Developer'}</p>
          <div className="mt-4 rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            JWT: {localStorage.getItem('token') ? 'Available' : 'Missing'}
          </div>
        </aside>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950">Activity Heatmap</h2>
          <span className="text-sm text-slate-500">Simulated practice history</span>
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1">
          {heatmapCells.map((color, index) => (
            <div key={index} className={`h-4 w-4 rounded-sm ${color}`} title={`Activity cell ${index + 1}`} />
          ))}
        </div>
      </section>

      <DashboardTester />
    </div>
  );
}
