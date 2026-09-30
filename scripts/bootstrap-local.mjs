// This bootstrap ONLY targets an explicitly unauthenticated loopback demo ledger.
import {writeFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {setTimeout as delay} from 'node:timers/promises';
import {randomUUID} from 'node:crypto';
import {CantonJsonApi} from '../src/canton-json-api.mjs';
import {CantonApiError} from '../src/ledger-errors.mjs';

const baseUrl=process.env.CANTON_JSON_API_URL || 'http://127.0.0.1:3975';
const api=new CantonJsonApi({baseUrl,insecureLocal:true});
const suffix=randomUUID().slice(0,8);
const fallbackPackageId=()=>readFileSync('evidence/dar-package-id.txt','utf8').trim();
const env={CANTON_JSON_API_URL:baseUrl,CANTON_INSECURE_LOCAL:'true',CANTON_PACKAGE_ID:process.env.CANTON_PACKAGE_ID || fallbackPackageId(),CANTON_PACKAGE_NAME:process.env.CANTON_PACKAGE_NAME || 'commit-ledger'};
if(!/^[a-f0-9]{64}$/.test(env.CANTON_PACKAGE_ID||'')) throw new Error('Actual DAR package ID is required');

async function allocateParty(role) {
  const requestBody=JSON.stringify({partyIdHint:`CommitLedger-${role}-${suffix}`,identityProviderId:''});
  for(let attempt=1; attempt<=30; attempt+=1) {
    try {
      const result=await api.request('/v2/parties',{method:'POST',body:requestBody});
      const party=result.partyDetails?.party;
      if(!party) throw new Error(`Party allocation did not return partyDetails.party for ${role}`);
      return party;
    } catch(error) {
      const transient=error instanceof CantonApiError && error.code==='PARTY_ALLOCATION_WITHOUT_CONNECTED_SYNCHRONIZER';
      if(!transient || attempt===30) throw error;
      await delay(1000);
    }
  }
  throw new Error(`Party allocation retry loop exhausted for ${role}`);
}

const parties=[];
for(const role of ['MAINTAINER','CONTRIBUTOR','VERIFIER']) {
  const party=await allocateParty(role);
  env[`CANTON_${role}_PARTY`]=party;
  parties.push(party);
}

const userId=`commitledger-demo-${suffix}`;
await api.request('/v2/users',{method:'POST',body:JSON.stringify({
  user:{id:userId,primaryParty:parties[0],identityProviderId:'',isDeactivated:false},
  rights:parties.flatMap(party=>[
    {kind:{CanActAs:{value:{party}}}},
    {kind:{CanReadAs:{value:{party}}}}
  ])
})});
env.CANTON_USER_ID=userId;

const quote=value=>"'"+String(value).replaceAll("'","'\\''")+"'";
await writeFile('.env.canton-demo.local',Object.entries(env).map(([k,v])=>`${k}=${quote(v)}`).join('\n')+'\n',{mode:0o600});
await writeFile('evidence/ledger-setup.json',JSON.stringify({environment:'local-sandbox-no-auth',packageId:env.CANTON_PACKAGE_ID,packageName:env.CANTON_PACKAGE_NAME,parties,userId},null,2)+'\n');
console.log('Allocated three real demo parties and one local demo user; wrote .env.canton-demo.local.');
