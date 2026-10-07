import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {fetchGitHubIssue,fetchVerifiedPullRequest} from './github-verifier.mjs';
import {validateBountyDraft} from './domain.mjs';
import * as builders from './canton-commands.mjs';
import {CantonJsonApi} from './canton-json-api.mjs';
import {runtimeConfigFromEnv,runFullLifecycle} from './orchestrator.mjs';
import {buildEvidencePassport} from './evidence-passport.mjs';
const projectRoot=fileURLToPath(new URL('../',import.meta.url));
const root=resolve(projectRoot,'web');
const evidenceRoot=resolve(projectRoot,'evidence');
const actions=Object.freeze({createBounty:'buildCreateBountyCommand',claimRequest:'buildClaimRequestCommand',acceptClaim:'buildAcceptClaimCommand',submitPullRequest:'buildSubmitPullRequestCommand',returnForRevision:'buildReturnForRevisionCommand',verifyMerged:'buildVerifyMergedCommand',settle:'buildSettleCommand'});
function json(res,status,payload) {
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(JSON.stringify(payload,null,2));
}
async function readJson(req) {
  let length=0;const chunks=[];
  for await(const chunk of req) {length+=chunk.length;if(length>1_000_000) throw new Error('request body too large');chunks.push(chunk);}
  const value=JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}');
  if(!value || typeof value!=='object' || Array.isArray(value)) throw new Error('invalid JSON object');
  return value;
}
async function readVerifiedProof() {
  const [proofRaw,verificationRaw]=await Promise.all([
    readFile(resolve(evidenceRoot,'canton-proof.json'),'utf8'),
    readFile(resolve(evidenceRoot,'verification.json'),'utf8')
  ]);
  const proof=JSON.parse(proofRaw);
  const verification=JSON.parse(verificationRaw);
  if(!/^[a-f0-9]{40}$/.test(proof.sourceCommit||'') || proof.sourceCommit!==verification.commit) {
    throw new Error('deployed proof artifacts are not source-commit coherent');
  }
  if(proof.steps?.length!==6 || proof.negativeChecks?.length!==3 || !proof.settlementReceipt) {
    throw new Error('deployed proof artifacts are incomplete');
  }
  return {proof,verification};
}
export function createAppServer(env=process.env) {
  return http.createServer(async(req,res)=>{
    try {
      const forwardedProto=String(req.headers['x-forwarded-proto']||'').split(',')[0].trim().toLowerCase();
      const protocol=['http','https'].includes(forwardedProto)?forwardedProto:'http';
      const origin=`${protocol}://${req.headers.host||'localhost'}`;
      const url=new URL(req.url,origin);
      const allowedHosts=new Set(['127.0.0.1','localhost','[::1]']);
      if(env.COMMITLEDGER_PUBLIC_HOST) allowedHosts.add(String(env.COMMITLEDGER_PUBLIC_HOST).trim().toLowerCase());
      if(!allowedHosts.has(url.hostname.toLowerCase())) return json(res,403,{error:'Untrusted host'});
      if(req.method==='POST') {
        if(req.headers.origin && req.headers.origin!==origin) return json(res,403,{error:'Cross-origin write rejected'});
        if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')) return json(res,415,{error:'application/json is required'});
      }
      if(req.method==='GET' && url.pathname==='/api/proof') {
        try {
          const {proof,verification}=await readVerifiedProof();
          return json(res,200,{ok:true,proof,verification});
        } catch {
          return json(res,503,{error:'Verified deployment proof is not available'});
        }
      }
      if(req.method==='GET' && url.pathname==='/api/passport') {
        try {
          const {proof}=await readVerifiedProof();
          return json(res,200,{ok:true,passport:buildEvidencePassport(proof)});
        } catch {
          return json(res,503,{error:'Verified Evidence Passport is not available'});
        }
      }
      if(req.method==='GET' && url.pathname==='/api/health') {
        let runtime;let configurationError='';let ledgerReachable=false;
        try {runtime=runtimeConfigFromEnv(env);} catch(error) {configurationError=error.message;}
        if(runtime) {
          try {
            const api=new CantonJsonApi({baseUrl:runtime.baseUrl,token:runtime.tokens.maintainer,userId:runtime.userId,insecureLocal:runtime.insecureLocal});
            await api.request('/v2/state/ledger-end',{signal:AbortSignal.timeout(3000)});
            ledgerReachable=true;
          } catch { /* Connectivity is separate from configuration and ledger proof. */ }
        }
        let verifiedProofAvailable=false;
        try {await readVerifiedProof();verifiedProofAvailable=true;} catch { /* Build proof is optional outside verified deployments. */ }
        return json(res,200,{ok:true,service:'CommitLedger',lifecycleConfigured:Boolean(runtime),cantonConfigured:Boolean(runtime),ledgerReachable,verifiedProofAvailable,configurationError,githubAuthenticated:Boolean(env.GITHUB_TOKEN),packageConfigured:Boolean(env.CANTON_PACKAGE_ID)});
      }
      if(req.method==='POST' && url.pathname==='/api/canton/submit-command') {
        return json(res,403,{error:'Arbitrary browser-supplied ledger commands are disabled; use the verified lifecycle'});
      }
      if(req.method==='POST' && url.pathname==='/api/bounty/prepare') {
        const input=await readJson(req);
        const issue=await fetchGitHubIssue({issueUrl:input.issueUrl,token:env.GITHUB_TOKEN});
        const bounty=validateBountyDraft({...issue,rewardAmount:input.rewardAmount,rewardUnit:'DEMO_CREDIT'});
        return json(res,200,{ok:true,issue,bounty});
      }
      if(req.method==='POST' && url.pathname==='/api/github/verify') {
        const input=await readJson(req);
        const evidence=await fetchVerifiedPullRequest({repository:input.repository,prNumber:Number(input.prNumber),token:env.GITHUB_TOKEN,expected:{headSha:input.headSha||'',mergeCommitSha:input.mergeCommitSha||'',baseBranch:input.baseBranch||'main',contributorGithub:input.contributorGithub||'',issueNumber:Number(input.issueNumber)}});
        return json(res,200,{ok:true,evidence});
      }
      if(req.method==='POST' && url.pathname==='/api/demo/run') {
        let runtime;
        try {runtime=runtimeConfigFromEnv(env);} catch(error) {return json(res,503,{error:`Canton setup pending: ${error.message}`});}
        const input=await readJson(req);
        const proof=await runFullLifecycle({runtime,issueUrl:input.issueUrl,rewardAmount:Number(input.rewardAmount||100),contributorGithub:input.contributorGithub,prNumber:Number(input.prNumber),baseBranch:input.baseBranch||'main',githubToken:env.GITHUB_TOKEN||''});
        return json(res,200,{ok:true,proof});
      }
      if(req.method==='POST' && url.pathname==='/api/canton/build-command') {
        const input=await readJson(req);
        const builder=Object.hasOwn(actions,input.action) ? builders[actions[input.action]] : null;
        if(typeof builder!=='function') return json(res,400,{error:'Unknown Canton action'});
        const command=builder({...input.payload,packageId:env.CANTON_PACKAGE_ID||input.packageId});
        return json(res,200,{ok:true,command});
      }
      if(req.method!=='GET') return json(res,405,{error:'method not allowed'});
      const target=resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
      if(!target.startsWith(resolve(root)+sep)) return json(res,403,{error:'forbidden'});
      try {
        const body=await readFile(target);
        res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'})[extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
        res.end(body);
      } catch {json(res,404,{error:'not found'});}
    } catch(error) {
      json(res,/required|invalid|mismatch|must|Unknown|distinct|JSON|too large/.test(error.message)?400:502,{error:error.message});
    }
  });
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const port=Number(process.env.PORT||4173);
  const host=process.env.COMMITLEDGER_BIND_HOST||'127.0.0.1';
  createAppServer().listen(port,host,()=>console.log(`CommitLedger running at http://${host}:${port}`));
}
