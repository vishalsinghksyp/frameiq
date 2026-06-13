const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function processUrl(url) {
  const res = await fetch(`${API_BASE}/api/video/process-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Failed to start processing");
  return res.json(); // { job_id, status }
}

export async function processFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/video/process-file`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to start processing");
  return res.json(); // { job_id, status }
}

export async function getStatus(jobId) {
  const res = await fetch(`${API_BASE}/api/video/status/${jobId}`);
  if (!res.ok) throw new Error("Failed to get status");
  return res.json(); // { status, step, result, error }
}

export async function askQuestion(sessionId, question) {
  const res = await fetch(`${API_BASE}/api/video/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, question }),
  });
  if (!res.ok) throw new Error("Failed to get answer");
  return res.json(); // { answer }
}
