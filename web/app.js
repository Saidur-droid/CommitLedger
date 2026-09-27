const bountyForm = document.querySelector("#bounty-form");
const verifyForm = document.querySelector("#verify-form");
const issueStatus = document.querySelector("#issue-status");
const githubStatus = document.querySelector("#github-status");
const cantonBadge = document.querySelector("#canton-badge");
const ledgerStatus = document.querySelector("#ledger-status");
const bountySummary = document.querySelector("#bounty-summary");
const githubOutput = document.querySelector("#github-output");
const ledgerOutput = document.querySelector("#ledger-output");

let health = {};
let preparedBounty = null;

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function checkHealth() {
  try {
    health = await request("/api/health");
    cantonBadge.textContent = health.cantonConfigured ? "Canton connected" : "Canton setup pending";
    ledgerStatus.textContent = health.packageConfigured ? "Package configured" : "Needs package ID";
  } catch {
    cantonBadge.textContent = "Local app offline";
  }
}

bountyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  issueStatus.textContent = "Verifying";
  bountySummary.className = "summary muted";
  bountySummary.textContent = "Reading canonical GitHub issue…";
  ledgerOutput.textContent = "Waiting for verified issue.";
  try {
    const input = Object.fromEntries(new FormData(bountyForm));
    input.rewardAmount = Number(input.rewardAmount);
    const data = await request("/api/bounty/prepare", {
      method: "POST",
      body: JSON.stringify(input)
    });
    preparedBounty = data.bounty;
    issueStatus.textContent = "Issue verified";
    bountySummary.className = "summary";
    bountySummary.innerHTML = `
      <strong>${escapeHtml(data.bounty.title)}</strong>
      <span>${escapeHtml(data.bounty.repository)} #${data.bounty.issueNumber}</span>
      <span>${data.bounty.rewardAmount} ${escapeHtml(data.bounty.rewardUnit)} · demo/test value</span>
    `;

    if (!health.packageConfigured) {
      ledgerStatus.textContent = "Set CANTON_PACKAGE_ID";
      ledgerOutput.textContent = JSON.stringify({
        action: "createBounty",
        note: "Set CANTON_PACKAGE_ID plus party IDs to generate the final ledger command.",
        bounty: preparedBounty
      }, null, 2);
      return;
    }

    ledgerOutput.textContent = JSON.stringify({
      action: "createBounty",
      bounty: preparedBounty,
      next: "provide maintainer + verifier Canton party IDs"
    }, null, 2);
  } catch (error) {
    issueStatus.textContent = "Rejected";
    bountySummary.textContent = error.message;
    ledgerOutput.textContent = "No Canton command generated.";
  }
});

verifyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  githubStatus.textContent = "Verifying";
  githubOutput.textContent = "Reading canonical GitHub pull request…";
  const values = Object.fromEntries(new FormData(verifyForm));
  values.prNumber = Number(values.prNumber);
  try {
    const data = await request("/api/github/verify", {
      method: "POST",
      body: JSON.stringify(values)
    });
    githubStatus.textContent = "Merge verified";
    githubOutput.textContent = JSON.stringify(data.evidence, null, 2);
  } catch (error) {
    githubStatus.textContent = "Rejected";
    githubOutput.textContent = error.message;
  }
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

checkHealth();
