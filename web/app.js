const bountyForm = document.querySelector("#bounty-form");
const verifyForm = document.querySelector("#verify-form");
const liveForm = document.querySelector("#live-form");
const liveRun = document.querySelector("#live-run");
const liveStatus = document.querySelector("#live-status");
const timeline = document.querySelector("#timeline");
const receiptCard = document.querySelector("#receipt-card");
const issueStatus = document.querySelector("#issue-status");
const githubStatus = document.querySelector("#github-status");
const cantonBadge = document.querySelector("#canton-badge");
const bountySummary = document.querySelector("#bounty-summary");
const githubOutput = document.querySelector("#github-output");

let health = {};

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
    cantonBadge.textContent = health.lifecycleConfigured ? "Canton lifecycle ready" : "Canton setup pending";
    liveStatus.textContent = health.lifecycleConfigured ? "Ready for real ledger run" : "Runtime not configured";
    liveRun.disabled = !health.lifecycleConfigured;
  } catch {
    cantonBadge.textContent = "Local app offline";
    liveStatus.textContent = "Offline";
    liveRun.disabled = true;
  }
}

liveForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!health.lifecycleConfigured) return;
  liveRun.disabled = true;
  liveStatus.textContent = "Submitting to Canton…";
  timeline.innerHTML = '<div class="timeline-empty">Executing real ledger transitions. No mocked steps are shown.</div>';
  receiptCard.classList.add("hidden");
  try {
    const input = Object.fromEntries(new FormData(liveForm));
    input.prNumber = Number(input.prNumber);
    input.rewardAmount = Number(input.rewardAmount);
    const data = await request("/api/demo/run", {
      method: "POST",
      body: JSON.stringify(input)
    });
    liveStatus.textContent = "Settlement receipt verified";
    renderTimeline(data.proof.steps);
    renderReceipt(data.proof);
  } catch (error) {
    liveStatus.textContent = "Ledger run failed";
    timeline.innerHTML = `<div class="timeline-error">${escapeHtml(error.message)}</div>`;
  } finally {
    liveRun.disabled = !health.lifecycleConfigured;
  }
});

bountyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  issueStatus.textContent = "Verifying";
  bountySummary.className = "summary muted";
  bountySummary.textContent = "Reading canonical GitHub issue…";
  try {
    const input = Object.fromEntries(new FormData(bountyForm));
    input.rewardAmount = Number(input.rewardAmount);
    const data = await request("/api/bounty/prepare", {
      method: "POST",
      body: JSON.stringify(input)
    });
    issueStatus.textContent = "Issue verified";
    bountySummary.className = "summary";
    bountySummary.innerHTML = `
      <strong>${escapeHtml(data.bounty.title)}</strong>
      <span>${escapeHtml(data.bounty.repository)} #${data.bounty.issueNumber}</span>
      <span>${data.bounty.rewardAmount} ${escapeHtml(data.bounty.rewardUnit)} · demo/test value</span>
    `;
  } catch (error) {
    issueStatus.textContent = "Rejected";
    bountySummary.textContent = error.message;
  }
});

verifyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  githubStatus.textContent = "Verifying";
  githubOutput.textContent = "Reading canonical GitHub pull request…";
  const values = Object.fromEntries(new FormData(verifyForm));
  values.issueNumber = Number(values.issueNumber);
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

function renderTimeline(steps) {
  timeline.innerHTML = steps.map((step, index) => `
    <article class="timeline-step">
      <div class="step-index">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <strong>${escapeHtml(step.name)}</strong>
        <span>contract · ${escapeHtml(shortId(step.contractId))}</span>
        <span>update · ${escapeHtml(shortId(step.updateId))} · offset ${step.completionOffset}</span>
      </div>
    </article>
  `).join("");
}

function renderReceipt(proof) {
  const receipt = proof.settlementReceipt || {};
  receiptCard.classList.remove("hidden");
  receiptCard.innerHTML = `
    <p class="kicker">SETTLEMENT RECEIPT</p>
    <h3>${escapeHtml(receipt.bountyId || "Settled bounty")}</h3>
    <div class="receipt-grid">
      <div><span>Repository</span><strong>${escapeHtml(receipt.repository || "")}</strong></div>
      <div><span>Pull request</span><strong>#${receipt.pullRequest?.prNumber ?? ""}</strong></div>
      <div><span>Reward</span><strong>${escapeHtml(receipt.rewardAmount || "")} ${escapeHtml(receipt.rewardUnit || "")}</strong></div>
      <div><span>Evidence</span><strong>${escapeHtml(shortId(receipt.evidenceHash || ""))}</strong></div>
      <div><span>Settlement ref</span><strong>${escapeHtml(receipt.settlementRef || "")}</strong></div>
      <div><span>Canton proof</span><strong>${proof.steps.length} committed transitions</strong></div>
      <div><span>Negative checks</span><strong>${proof.negativeChecks?.filter(check => check.rejected).length || 0} enforced rejections</strong></div>
    </div>
  `;
}

function shortId(value) {
  const text = String(value || "");
  return text.length > 22 ? `${text.slice(0, 10)}…${text.slice(-8)}` : text;
}

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
