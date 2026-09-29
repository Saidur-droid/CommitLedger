const $=selector=>document.querySelector(selector);
let ready=false,lastProof=null;
const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
async function request(path,body) {
  const response=await fetch(path,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{});
  const value=await response.json();
  if(!response.ok) throw new Error(value.error||'Request failed');
  return value;
}
async function health() {
  try {
    const h=await request('/api/health');ready=h.lifecycleConfigured && h.ledgerReachable;
    $('#canton-badge').textContent=ready?'Canton connected':'Canton setup pending';
    $('#live-status').textContent=ready?'Ready for a real ledger run':h.lifecycleConfigured?'Ledger unreachable':'Runtime not configured';
    $('#configuration-note').textContent=h.configurationError||(!h.ledgerReachable?'Check that your Canton development ledger is running.':'Connected. No settlement has been claimed until a receipt is returned.');
  } catch(error) {ready=false;$('#canton-badge').textContent='Local app offline';$('#configuration-note').textContent=error.message;}
  $('#live-run').disabled=!ready;
}
$('#refresh-health').addEventListener('click',health);
const names={BOUNTY_ON_LEDGER:'Bounty created',CLAIM_REQUESTED:'Claim requested',CLAIMED:'Claim accepted',PR_SUBMITTED:'Pull request submitted',VERIFIED:'Merge verified',SETTLED:'Settlement recorded'};
function render(proof) {
  $('#timeline').innerHTML=proof.steps.map((step,i)=>`<article class="timeline-step"><strong>${i+1}. ${escape(names[step.name]||step.name)}</strong><span>Ledger offset ${escape(step.completionOffset)}</span><details><summary>Inspect full ledger references</summary><span>Contract ID</span><code>${escape(step.contractId)}</code><span>Update ID</span><code>${escape(step.updateId)}</code><span>Template</span><code>${escape(step.templateId)}</code></details></article>`).join('');
  const r=proof.settlementReceipt;
  $('#receipt-card').classList.remove('hidden');
  $('#receipt-card').innerHTML=`<p class="kicker">SETTLEMENT RECEIPT / DEMO VALUE</p><h3>${escape(r.rewardAmount)} ${escape(r.rewardUnit)}</h3><div class="receipt-grid"><div><span>Repository and issue</span><strong>${escape(r.repository)} #${escape(r.issueNumber)}</strong></div><div><span>Pull request</span><strong>#${escape(r.pullRequest.prNumber)}</strong></div><div><span>Merge commit SHA</span><code>${escape(r.mergeCommitSha)}</code></div><div><span>Evidence hash</span><code>${escape(r.evidenceHash)}</code></div></div>${proof.negativeChecks.map(c=>`<div class="negative"><strong>${escape(c.name)}</strong><code>${escape(c.code)}</code><details><summary>Inspect rejection response</summary><pre class="output">${escape(JSON.stringify(c.response,null,2))}</pre></details></div>`).join('')}<button type="button" id="download-proof">Download complete proof JSON</button><p class="muted">${escape(proof.environment)}. This receipt does not represent a transfer of real money.</p>`;
  $('#download-proof').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([JSON.stringify(lastProof,null,2)+'\n'],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download=`commitledger-proof-${lastProof.runId}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
}
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
health();
