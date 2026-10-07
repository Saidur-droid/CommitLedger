const $=selector=>document.querySelector(selector);
let ready=false,lastProof=null;
const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
async function request(path,body) {
  const response=await fetch(path,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{});
  const value=await response.json();
  if(!response.ok) throw new Error(value.error||'Request failed');
  return value;
}
const names={BOUNTY_ON_LEDGER:'Bounty created',CLAIM_REQUESTED:'Claim requested',CLAIMED:'Claim accepted',PR_SUBMITTED:'Pull request submitted',VERIFIED:'Merge verified',SETTLED:'Settlement recorded'};
function render(proof) {
  $('#timeline').innerHTML=proof.steps.map((step,i)=>`<article class="timeline-step"><strong>${i+1}. ${escape(names[step.name]||step.name)}</strong><span>Ledger offset ${escape(step.completionOffset)}</span><details><summary>Inspect full ledger references</summary><span>Contract ID</span><code>${escape(step.contractId)}</code><span>Update ID</span><code>${escape(step.updateId)}</code><span>Template</span><code>${escape(step.templateId)}</code></details></article>`).join('');
  const r=proof.settlementReceipt;
  $('#receipt-card').classList.remove('hidden');
  $('#receipt-card').innerHTML=`<p class="kicker">SETTLEMENT RECEIPT / DEMO VALUE</p><h3>${escape(r.rewardAmount)} ${escape(r.rewardUnit)}</h3><div class="receipt-grid"><div><span>Repository and issue</span><strong>${escape(r.repository)} #${escape(r.issueNumber)}</strong></div><div><span>Pull request</span><strong>#${escape(r.pullRequest.prNumber)}</strong></div><div><span>Source commit</span><code>${escape(proof.sourceCommit)}</code></div><div><span>Merge commit SHA</span><code>${escape(r.mergeCommitSha)}</code></div><div><span>Evidence hash</span><code>${escape(r.evidenceHash)}</code></div><div><span>Package ID</span><code>${escape(proof.packageId)}</code></div></div>${proof.negativeChecks.map(c=>`<div class="negative"><strong>${escape(c.name)}</strong><code>${escape(c.code)}</code><details><summary>Inspect rejection response</summary><pre class="output">${escape(JSON.stringify(c.response,null,2))}</pre></details></div>`).join('')}<button type="button" id="download-proof">Download complete proof JSON</button><p class="muted">${escape(proof.environment)}. This receipt does not represent a transfer of real money.</p>`;
  $('#download-proof').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([JSON.stringify(lastProof,null,2)+'\n'],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download=`commitledger-proof-${lastProof.runId}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
}
function renderPassport(passport) {
  const card=$('#passport-card');
  card.classList.remove('hidden');
  card.innerHTML=`<p class="kicker">EVIDENCE PASSPORT</p><h3>${escape(passport.workEvidence.repository)} #${escape(passport.workEvidence.issueNumber)} → PR #${escape(passport.workEvidence.pullRequestNumber)}</h3><div class="passport-grid"><div><span>Authority</span><strong>${escape(passport.authorization.model)}</strong></div><div><span>Receipt contract</span><code>${escape(passport.settlement.receiptContractId)}</code></div><div><span>Merge SHA</span><code>${escape(passport.workEvidence.mergeCommitSha)}</code></div><div><span>Evidence hash</span><code>${escape(passport.workEvidence.evidenceHash)}</code></div><div><span>Source commit</span><code>${escape(passport.sourceCommit)}</code></div><div><span>Environment</span><strong>${escape(passport.environment)}</strong></div></div><p class="muted">${escape(passport.integrity.statement)}</p>`;
}
function renderRejectionSpotlight(proof) {
  const target=$('#rejection-spotlight');
  const duplicate=proof?.negativeChecks?.find(check=>/duplicate/i.test(check.name)) || proof?.negativeChecks?.at(-1);
  if(!duplicate) return;
  target.classList.remove('hidden');
  target.innerHTML=`<p class="kicker">THE REJECTION MOMENT</p><h3>Try to settle the same verified work twice.</h3><div class="rejection-code">REJECTED · ${escape(duplicate.code)}</div><p>${escape(duplicate.name)}</p><small>This is captured from the same source-bound proof run. A network error never counts as security proof.</small>`;
}
async function loadPassport() {
  const {passport}=await request('/api/passport');
  renderPassport(passport);
}
async function loadProof() {
  try {
    const {proof,verification}=await request('/api/proof');
    lastProof=proof;
    render(proof);
    $('#canton-badge').textContent='Verified Canton proof';
    $('#live-status').textContent='Verified deployment proof loaded';
    $('#configuration-note').textContent=`Read-only proof for source ${proof.sourceCommit}. Node/Daml verification commit: ${verification.commit}. The build-time Canton sandbox is intentionally not persistent.`;
  } catch(error) {
    $('#canton-badge').textContent='Proof unavailable';
    $('#live-status').textContent='Verified proof unavailable';
    $('#configuration-note').textContent=error.message;
  }
}
async function health() {
  try {
    const h=await request('/api/health');ready=h.lifecycleConfigured && h.ledgerReachable;
    if(!lastProof) {
      $('#canton-badge').textContent=h.verifiedProofAvailable?'Verified proof available':ready?'Canton connected':'Canton runtime offline';
      $('#live-status').textContent=ready?'Ready for another real ledger run':h.verifiedProofAvailable?'Deployment proof available':'Runtime not configured';
      $('#configuration-note').textContent=h.configurationError||(!h.ledgerReachable?'The public service does not keep the build-time sandbox alive.':'Connected. No settlement has been claimed until a receipt is returned.');
    }
  } catch(error) {
    ready=false;
    if(!lastProof) {$('#canton-badge').textContent='App offline';$('#configuration-note').textContent=error.message;}
  }
  $('#live-run').disabled=!ready;
}
$('#refresh-health').addEventListener('click',async()=>{await health();await loadProof();});
$('#live-form').addEventListener('submit',async event=>{
  event.preventDefault();if(!ready)return;
  lastProof=null;$('#live-run').disabled=true;$('#receipt-card').classList.add('hidden');
  $('#live-status').textContent='Executing real ledger commands';$('#timeline').innerHTML='<div class="timeline-empty">Waiting for actual Canton responses. No simulated success.</div>';
  try {const data=await request('/api/demo/run',Object.fromEntries(new FormData(event.target)));lastProof=data.proof;render(lastProof);$('#live-status').textContent='Settlement receipt returned';}
  catch(error){$('#live-status').textContent='Ledger run failed';$('#timeline').innerHTML=`<div class="timeline-error">${escape(error.message)}<p>No successful proof bundle was produced.</p></div>`;}
  finally{$('#live-run').disabled=!ready;}
});
$('#bounty-form').addEventListener('submit',async event=>{
  event.preventDefault();$('#issue-status').textContent='Verifying';
  try {const {bounty}=await request('/api/bounty/prepare',Object.fromEntries(new FormData(event.target)));$('#issue-status').textContent='Issue verified';$('#bounty-summary').textContent=`${bounty.title} / ${bounty.repository} #${bounty.issueNumber} / ${bounty.rewardAmount} ${bounty.rewardUnit}`;}
  catch(error){$('#issue-status').textContent='Verification failed';$('#bounty-summary').textContent=error.message;}
});
$('#verify-form').addEventListener('submit',async event=>{
  event.preventDefault();$('#github-status').textContent='Verifying';
  try {const {evidence}=await request('/api/github/verify',Object.fromEntries(new FormData(event.target)));$('#github-status').textContent='Merge verified';$('#github-output').textContent=JSON.stringify(evidence,null,2);}
  catch(error){$('#github-status').textContent='Verification failed';$('#github-output').textContent=error.message;}
});
await health();
await loadProof();
$('#show-passport').addEventListener('click',async()=>{
  try { await loadPassport(); } catch(error) { $('#passport-card').classList.remove('hidden'); $('#passport-card').textContent=error.message; }
});
$('#show-rejections').addEventListener('click',()=>{ if(lastProof) renderRejectionSpotlight(lastProof); });
