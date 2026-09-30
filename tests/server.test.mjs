import test from 'node:test';
import assert from 'node:assert/strict';
import {request as httpRequest} from 'node:http';
import {createAppServer} from '../src/server.mjs';
async function withServer(t) {
  const server=createAppServer({});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
  return `http://127.0.0.1:${server.address().port}`;
}
test('health never calls unconfigured Canton ready',async t=>{
  const base=await withServer(t);const value=await (await fetch(base+'/api/health')).json();
  assert.equal(value.lifecycleConfigured,false);assert.equal(value.ledgerReachable,false);
});
test('unconfigured demo fails closed',async t=>{
  const base=await withServer(t);const response=await fetch(base+'/api/demo/run',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
  assert.equal(response.status,503);
});
test('arbitrary browser commands cannot use server-held ledger credentials',async t=>{
  const base=await withServer(t);const response=await fetch(base+'/api/canton/submit-command',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
  assert.equal(response.status,403);
});
test('cross-origin writes and simple-form content types are rejected',async t=>{
  const base=await withServer(t);
  const a=await fetch(base+'/api/demo/run',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://evil.example'},body:'{}'});
  assert.equal(a.status,403);
  const b=await fetch(base+'/api/demo/run',{method:'POST',headers:{'Content-Type':'text/plain'},body:'{}'});
  assert.equal(b.status,415);
});

test('configured public host accepts Render-style forwarded HTTPS origin',async t=>{
  const server=createAppServer({COMMITLEDGER_PUBLIC_HOST:'commitledger-proof-final.onrender.com'});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
  const port=server.address().port;
  const result=await new Promise((resolve,reject)=>{
    const req=httpRequest({
      host:'127.0.0.1',
      port,
      path:'/api/demo/run',
      method:'POST',
      headers:{
        Host:'commitledger-proof-final.onrender.com',
        'X-Forwarded-Proto':'https',
        Origin:'https://commitledger-proof-final.onrender.com',
        'Content-Type':'application/json'
      }
    },res=>{
      res.resume();
      res.on('end',()=>resolve(res.statusCode));
    });
    req.on('error',reject);
    req.end('{}');
  });
  assert.equal(result,503);
});
