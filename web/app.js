const form = document.querySelector("#verify-form");
const output = document.querySelector("#github-output");
const status = document.querySelector("#github-status");
const health = document.querySelector("#health-status");

async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    health.textContent = data.cantonConfigured ? "Canton configured" : "LocalNet not configured";
  } catch {
    health.textContent = "Offline";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "Verifying";
  output.textContent = "Reading canonical GitHub state…";
  const values = Object.fromEntries(new FormData(form));
  values.prNumber = Number(values.prNumber);
  try {
    const res = await fetch("/api/github/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Verification failed");
    status.textContent = "Verified merge";
    output.textContent = JSON.stringify(data.evidence, null, 2);
  } catch (error) {
    status.textContent = "Rejected";
    output.textContent = error.message;
  }
});

checkHealth();
