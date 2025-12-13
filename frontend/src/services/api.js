const BASE_URL = 'http://your-backend-host'; // or import from env

export async function getForecast(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/forecast?${query}`);
  if (!res.ok) throw new Error('Failed to load forecast');
  return res.json();
}

export async function getCapacityPlanning(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/capacity-planning?${query}`);
  if (!res.ok) throw new Error('Failed to load capacity');
  return res.json();
}

export async function downloadReport(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/report?${query}`);
  if (!res.ok) throw new Error('Failed to download report');
  return res.blob();
}

export async function getMonitoring(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/monitoring?${query}`);
  if (!res.ok) throw new Error('Failed to load monitoring data');
  return res.json();
}
