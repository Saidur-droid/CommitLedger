// This bootstrap ONLY targets an explicitly unauthenticated loopback demo ledger.
import {writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {CantonJsonApi} from '../src/canton-json-api.mjs';
const baseUrl=process.env.CANTON_JSON_API_URL || 'http://127.0.0.1:3975';
const api=new CantonJsonApi({baseUrl,insecureLocal:true});
const suffix=randomUUID().slice(0,8);
const env={CANTON_JSON_API_URL:baseUrl,CANTON_INSECURE_LOCAL:'true',CANTON_PACKAGE_ID:process.env.CANTON_PACKAGE_ID};
if(!/^[a-f0-9]{64}$/.test(env.CANTON_PACKAGE_ID||'')) throw new Error('Actual DAR package ID is required');
const parties=[];
for(const role of ['MAINTAINER','CONTRIBUTOR','VERIFIER']) {
  const result=await api.request('/v2/parties',{method:'POST',body:JSON.stringify({partyIdHint:`CommitLedger-${role}-${suffix}`,identityProviderId:''})});
  const party=result.partyDetails?.party;
  if(!party) throw new Error(`Party allocation did not return partyDetails.party for ${role}`);
  env[`CANTON_${role}_PARTY`]=party;parties.push(party);
}
const userId=`commitledger-demo-${suffix}`;
await api.request('/v2/users',{method:'POST',body:JSON.stringify({
  user:{id:userId,primaryParty:parties[0],identityProviderId:'',isDeactivated:false},
  rights:parties.flatMap(party=>[
    {kind:{CanActAs:{value:{party}}}}, {kind:{CanReadAs:{value:{party}}}}
  ])
})});
env.CANTON_USER_ID=userId;
// Shell single-quote escaping. No bearer tokens are created or written here.
const quote=value=>"'"+String(value).replaceAll("'","'\\''")+"'";
await writeFile('.env.canton-demo.local',Object.entries(env).map(([k,v])=>`${k}=${quote(v)}`).join('\n')+'\n',{mode:0o600});
await writeFile('evidence/ledger-setup.json',JSON.stringify({environment:'local-sandbox-no-auth',packageId:env.CANTON_PACKAGE_ID,parties,userId},null,2)+'\n');
console.log('Allocated three real demo parties and one local demo user; wrote .env.canton-demo.local.');
