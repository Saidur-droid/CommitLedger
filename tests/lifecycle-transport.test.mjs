// Simulated HTTP transport tests. These are NOT Canton runtime evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {runFullLifecycle} from '../src/orchestrator.mjs';
const repository='Saidur-droid/CommitLedger';
const parties={maintainer:'Maintainer::unit',contributor:'Contributor::unit',verifier:'Verifier::unit'};
const runtime={baseUrl:'http://localhost:3975',packageId:'a'.repeat(64),packageName:'commit-ledger',parties,tokens:{maintainer:'unit-maintainer',contributor:'unit-contributor',verifier:'unit-verifier'}};
const input={runtime,issueUrl:`https://github.com/${repository}/issues/5`,contributorGithub:'Saidur-droid',prNumber:6};
function installTransport(t, {unmerged=false,negativeNetworkFailure=false}={}) {
  const active=new Map(); const commands=[]; let seq=0;
  t.mock.method(globalThis,'fetch',async (url,options={}) => {
    if(url.startsWith('https://api.github.com/')) {
      if(url.includes('/issues/')) return Response.json({number:5,html_url:input.issueUrl,title:'Unit fixture',state:'open',user:{login:'Saidur-droid'}});
      if(url.includes('/pulls/')) return Response.json({number:6,html_url:`https://github.com/${repository}/pull/6`,body:'References #5',merged:!unmerged,merged_at:unmerged?null:'2026-09-27T10:57:30Z',merge_commit_sha:'b'.repeat(40),head:{sha:'a'.repeat(40)},base:{ref:'main',repo:{full_name:repository}},user:{login:'Saidur-droid'}});
      if(url.includes('/commits/')) return Response.json({sha:'b'.repeat(40)});
      if(url.includes('/compare/')) return Response.json({status:'ahead'});
      throw new Error(`Unexpected GitHub URL: ${url}`);
    }
    const body=JSON.parse(options.body);
    const transactionMode=url.endsWith('/v2/commands/submit-and-wait-for-transaction');
    assert.ok(transactionMode || url.endsWith('/v2/commands/submit-and-wait'));
    const payload=transactionMode ? body.commands : body;
    commands.push(payload);
    const command=payload.commands[0]; let name,args;
    if(command.CreateCommand) {
      name=command.CreateCommand.templateId.split(':').at(-1);
      args=command.CreateCommand.createArguments;
    } else {
      const ex=command.ExerciseCommand;
      const previous=active.get(ex.contractId);
      if(!previous) return Response.json({code:'CONTRACT_NOT_FOUND',cause:`Contract ${ex.contractId} already consumed`},{status:404});
      args={...previous.createArgument};
      if(ex.choice==='ClaimRequest_Accept') {
        assert.equal(payload.actAs[0],parties.maintainer);
        const bounty=active.get(ex.choiceArgument.bountyCid);
        assert.ok(bounty,'exact prior bounty CID must be carried forward');
        args={...bounty.createArgument,contributor:args.contributor,contributorGithub:args.contributorGithub};
        active.delete(ex.choiceArgument.bountyCid); name='ClaimedBounty';
      } else if(ex.choice==='ClaimedBounty_SubmitPullRequest') {
        assert.equal(payload.actAs[0],parties.contributor);
        args.pullRequest=ex.choiceArgument.pullRequest; name='SubmittedBounty';
      } else if(ex.choice==='SubmittedBounty_VerifyMerged') {
        assert.equal(payload.actAs[0],parties.verifier);
        if(ex.choiceArgument.evidence.issueNumber!==args.issueNumber) {
          if(negativeNetworkFailure) throw new TypeError('fetch failed');
          return Response.json({code:'DAML_UNHANDLED_EXCEPTION',cause:'evidence issue number mismatch'},{status:400});
        }
        args.evidence=ex.choiceArgument.evidence;name='VerifiedBounty';
      } else if(ex.choice==='VerifiedBounty_Settle') {
        if(payload.actAs[0]!==parties.maintainer) return Response.json({code:'DAML_AUTHORIZATION_ERROR',cause:'wrong controller'},{status:400});
        args={...args,...ex.choiceArgument,evidenceHash:args.evidence.evidenceHash,mergeCommitSha:args.evidence.mergeCommitSha};name='SettlementReceipt';
      } else throw new Error(`Unexpected choice ${ex.choice}`);
      active.delete(ex.contractId);
    }
    seq++;
    const event={contractId:`unit-contract-${seq}`,templateId:`${'a'.repeat(64)}:CommitLedger:${name}`,createArgument:args};
    active.set(event.contractId,event);
    if(transactionMode) return Response.json({transaction:{updateId:`unit-update-${seq}`,offset:seq,events:[{CreatedEvent:event}]}});
    return Response.json({updateId:`unit-update-${seq}`,completionOffset:seq});
  });
  return {commands,active};
}
test('UNIT TRANSPORT: six transitions chain exact contract IDs and capture three specific rejections',async t=>{
  const {commands,active}=installTransport(t);
  const proof=await runFullLifecycle(input);
  assert.equal(proof.steps.length,6);
  assert.equal(proof.negativeChecks.length,3);
  assert.equal(commands.length,9);
  assert.equal(active.size,1);
  assert.equal(proof.settlementReceipt.evidenceHash,proof.mergeEvidence.evidenceHash);
  assert.equal(proof.settlementReceipt.mergeCommitSha,'b'.repeat(40));
  assert.deepEqual(proof.steps.map(x=>x.contractId),Array.from({length:6},(_,i)=>`unit-contract-${i+1}`));
  assert.deepEqual(proof.negativeChecks.map(x=>x.code),['DAML_UNHANDLED_EXCEPTION','DAML_AUTHORIZATION_ERROR','CONTRACT_NOT_FOUND']);
});
test('UNIT TRANSPORT: invalid PR is rejected before ANY ledger mutation',async t=>{
  const {commands}=installTransport(t,{unmerged:true});
  await assert.rejects(runFullLifecycle(input),/not merged/);
  assert.equal(commands.length,0);
});
test('UNIT TRANSPORT: a network failure during a negative check aborts, never becomes proof',async t=>{
  const {commands}=installTransport(t,{negativeNetworkFailure:true});
  await assert.rejects(runFullLifecycle(input),/Unproven ledger rejection/);
  assert.equal(commands.length,5);
});
test('UNIT TRANSPORT: repeat demos use distinct bounty identities',async t=>{
  installTransport(t);
  const a=await runFullLifecycle(input);
  const b=await runFullLifecycle(input);
  assert.notEqual(a.bounty.bountyId,b.bounty.bountyId);
  assert.notEqual(a.runId,b.runId);
});
