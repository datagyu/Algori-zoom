// Verify the 12 existing application lessons without changing their public API.
// node tests/existing-lessons.cjs [--browser]
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),ids=['5656','5209','5208','4202','5207','5205','5204','5203','5202','5201','5188','5189'];
const lessons={};
for(const id of ids){
  const src=fs.readFileSync(path.join(root,'problems',id,'script.js'),'utf8'),marker=src.lastIndexOf('  const markup');
  assert(marker>=0,`${id}: initialization boundary`);
  const ctx={window:{AlgoriZoomCore:{getByIds:()=>({}),clamp:(n,a,b)=>Math.min(b,Math.max(a,n))}}};vm.createContext(ctx);
  vm.runInContext(src.slice(0,marker)+`window.test={PROBLEM,parseInput,buildSteps${['5188','5189'].includes(id)?',explore':''}};})();`,ctx);
  lessons[id]=ctx.window.test;
}
function stepsFor(id,cases){const p=lessons[id];if(id==='5656')return Array.from(p.buildSteps(cases));if(p.explore){let output='',steps=[];for(const [i,d] of cases.entries()){const gen=p.explore(d,i+1,output,1800);let item;while(!(item=gen.next()).done)if(item.value)steps.push(item.value);output=item.value;}return steps;}return p.buildSteps(cases);}
const oracle={
  '5188':({N,board})=>{const dp=board.map(row=>row.map(()=>Infinity));dp[0][0]=board[0][0];for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(r||c)dp[r][c]=board[r][c]+Math.min(r?dp[r-1][c]:Infinity,c?dp[r][c-1]:Infinity);return dp[N-1][N-1];},
  '5189':({N,field})=>{const dp=Array.from({length:1<<N},()=>Array(N).fill(Infinity));dp[1][0]=0;for(let mask=1;mask<1<<N;mask++)for(let n=0;n<N;n++)for(let next=1;next<N;next++)if(!(mask&(1<<next)))dp[mask|1<<next][next]=Math.min(dp[mask|1<<next][next],dp[mask][n]+field[n][next]);return Math.min(...dp.at(-1).slice(1).map((v,i)=>v+field[i+1][0]));},
  '5209':({N,factory})=>{const dp=Array(1<<N).fill(Infinity);dp[0]=0;for(let mask=0;mask<1<<N;mask++){let product=0;for(let m=mask;m;m&=m-1)product++;for(let f=0;f<N;f++)if(!(mask&(1<<f)))dp[mask|1<<f]=Math.min(dp[mask|1<<f],dp[mask]+factory[product][f]);}return dp.at(-1);},
  '5208':({N,M})=>{const dp=Array(N).fill(Infinity);dp[0]=0;for(let n=0;n<N-1;n++)for(let next=n+1;next<N&&next<=n+M[n];next++)dp[next]=Math.min(dp[next],dp[n]+(n===0?0:1));return dp.at(-1);},
  '5205':({N,A})=>A.slice().sort((a,b)=>a-b)[Math.floor(N/2)],
  '5204':({N,arr})=>{let count=0;function divide(a){if(a.length<=1)return a;const mid=Math.floor(a.length/2),l=divide(a.slice(0,mid)),r=divide(a.slice(mid));if(l.at(-1)>r.at(-1))count++;return [...l,...r].sort((a,b)=>a-b);}const sorted=divide(arr);return `${sorted[Math.floor(N/2)]} ${count}`;},
  '5207':({A,B})=>{const sorted=A.slice().sort((a,b)=>a-b);function walk(target,left,right,previous){if(left>right)return false;const mid=Math.floor((left+right)/2);if(sorted[mid]===target)return true;const direction=target<sorted[mid]?'L':'R';if(direction===previous)return false;return direction==='L'?walk(target,left,mid-1,direction):walk(target,mid+1,right,direction);}return B.filter(n=>walk(n,0,sorted.length-1,'')).length;},
  '5203':({cards})=>{const counts=[Array(10).fill(0),Array(10).fill(0)];for(let i=0;i<12;i++){const c=counts[i%2];c[cards[i]]++;if(c.some(n=>n>=3)||c.some((n,j)=>j<=7&&n&&c[j+1]&&c[j+2]))return i%2+1;}return 0;},
  '5202':({works})=>{let best=0;for(let mask=0;mask<1<<works.length;mask++){const chosen=works.filter((_,i)=>mask&(1<<i)).sort((a,b)=>a[0]-b[0]);if(chosen.every((v,i)=>!i||chosen[i-1][1]<=v[0]))best=Math.max(best,chosen.length);}return best;},
  '5201':({box,truck})=>{let best=0;function match(i,mask,weight){if(i===truck.length){best=Math.max(best,weight);return;}match(i+1,mask,weight);for(let j=0;j<box.length;j++)if(!(mask&(1<<j))&&box[j]<=truck[i])match(i+1,mask|1<<j,weight+box[j]);}match(0,0,0);return best;},
  '4202':({N,recipe})=>{let best=Infinity;for(let mask=1;mask<1<<N;mask+=2){let size=0;for(let m=mask;m;m&=m-1)size++;if(size!==N/2)continue;let a=0,b=0;for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(i!==j){if(mask&(1<<i)){if(mask&(1<<j))a+=recipe[i][j];}else if(!(mask&(1<<j)))b+=recipe[i][j];}best=Math.min(best,Math.abs(a-b));}return best;},
  '5656':({N,W,H,board})=>{const memo=new Map();function search(b,left){const key=left+':'+b.flat().join(','),count=b.flat().filter(Boolean).length;if(!left||!count)return count;if(memo.has(key))return memo.get(key);let best=count;for(let c=0;c<W;c++){let r=0;while(r<H&&!b[r][c])r++;if(r===H)continue;const removed=new Set(),pending=[[r,c]];while(pending.length){const [rr,cc]=pending.pop(),k=rr*W+cc;if(removed.has(k))continue;removed.add(k);for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]])for(let d=1;d<b[rr][cc];d++){const nr=rr+dr*d,nc=cc+dc*d;if(nr<0||nr>=H||nc<0||nc>=W)break;if(b[nr][nc]&&!removed.has(nr*W+nc))pending.push([nr,nc]);}}
    const next=Array.from({length:H},()=>Array(W).fill(0));for(let cc=0;cc<W;cc++){const survivors=b.map((row,rr)=>removed.has(rr*W+cc)?0:row[cc]).filter(Boolean);survivors.forEach((v,i)=>next[H-survivors.length+i][cc]=v);}best=Math.min(best,search(next,left-1));if(!best)break;}memo.set(key,best);return best;}return search(board,N);}
};
let seed=20261008;const rand=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
function generated(id){const N=3+rand(3),matrix=(n,diag=false)=>Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>diag&&r===c?0:1+rand(20)));
  if(id==='5656'){const W=2+rand(3),H=3+rand(3);return {N:1+rand(3),W,H,board:Array.from({length:H},()=>Array.from({length:W},()=>rand(4)))};}
  if(id==='5188')return {N,board:matrix(N)};
  if(id==='5189')return {N,field:matrix(N,true)};
  if(id==='5209')return {N,factory:matrix(N)};
  if(id==='4202'){const size=2*(1+rand(3));return {N:size,recipe:matrix(size,true)};}
  if(id==='5208'){const size=3+rand(12);return {N:size,M:Array.from({length:size-1},()=>1+rand(size-1))};}
  if(id==='5205'||id==='5204'){const size=5+rand(16),a=Array.from({length:size},()=>rand(12));return id==='5205'?{N:size,A:a}:{N:size,arr:a};}
  if(id==='5207'){const A=[...new Set(Array.from({length:1+rand(25)},()=>1+rand(40)))],B=Array.from({length:1+rand(15)},()=>1+rand(40));return {N:A.length,M:B.length,A,B};}
  if(id==='5203')return {cards:Array.from({length:12},()=>rand(10))};
  if(id==='5202'){const works=Array.from({length:1+rand(8)},()=>{const start=rand(23);return [start,start+1+rand(24-start)];});return {N:works.length,works};}
  if(id==='5201'){const box=Array.from({length:1+rand(6)},()=>1+rand(15)),truck=Array.from({length:1+rand(4)},()=>1+rand(15));return {N:box.length,M:truck.length,box,truck};}
}
const reports=[],failures=[];let checks=0;
const mappedPhases={};
function verify(id,cases){const steps=stepsFor(id,cases),expected=cases.map((d,i)=>`#${i+1} ${oracle[id](d)}`).join('\n');assert.equal(steps.at(-1).output.trim(),expected,`${id} output`);for(const s of steps){
  assert(mappedPhases[id].has(s.phase),`${id}: unmapped ${s.phase}`);
  if(id==='5209'&&s.cost!==null)assert.equal(s.assign.reduce((n,a)=>n+a.cost,0),s.cost+(['use','recurse'].includes(s.phase)?s.pickCost:0));
  if(id==='5188'&&s.distance!==null&&s.phase!=='start')assert.equal(s.path.reduce((n,[r,c])=>n+s.data.board[r][c],0),s.distance);
  if(id==='5189')assert.equal(s.path.slice(1).reduce((n,to,i)=>n+s.data.field[s.path[i]][to],0),s.energy);
  if(id==='5188'&&s.phase==='output')assert.equal(s.bestPath.reduce((n,[r,c])=>n+s.data.board[r][c],0),s.ans);
  if(id==='5189'&&s.phase==='output')assert.equal(s.bestPath.slice(1).reduce((n,to,i)=>n+s.data.field[s.bestPath[i]][to],0),s.best);
}checks+=cases.length;return steps;}
for(const id of ids){try{
  const p=lessons[id],samples=[];
  const source=fs.readFileSync(path.join(root,'problems',id,'index.html'),'utf8').match(/<template id="sourceCode">([\s\S]*?)<\/template>/)[1].replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
  for(const anchor of p.PROBLEM.sourceSteps){const matches=source.split(/\r?\n/).filter(line=>line.trim()===anchor.text);assert(matches.length>=(anchor.occurrence||1),`${id} source: ${anchor.text}`);}
  // Use the real markup generator too: repeated anchors must not overwrite phases.
  const context={window:{matchMedia:()=>({matches:false})}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'assets/visualizer-core.js'),'utf8'),context);
  const markup=context.window.AlgoriZoomCore.createCodeMarkup({content:{textContent:source}},p.PROBLEM.sourceSteps);
  mappedPhases[id]=new Set([...markup.matchAll(/data-step-types="([^"]+)"/g)].flatMap(m=>m[1].split(' ')));
  p.PROBLEM.sourceSteps.forEach(a=>a.types.split(' ').forEach(type=>assert(mappedPhases[id].has(type),`${id} overwritten phase ${type}`)));
  for(const sample of p.PROBLEM.samples){if(sample.id==='all')continue;const steps=verify(id,p.parseInput(sample.value));samples.push({label:sample.label,frames:steps.length,seconds:Math.round((steps.length-1)*p.PROBLEM.autoplayMs/1000),output:steps.at(-1).output.trim()});}
  const all=p.PROBLEM.samples.find(s=>s.id==='all');if(all)verify(id,p.parseInput(all.value));
  for(let i=0;i<40;i++)verify(id,[generated(id)]);
  assert.throws(()=>p.parseInput('1\n'));assert.throws(()=>p.parseInput(p.PROBLEM.samples[0].value+'\n999'));
  reports.push({id,title:p.PROBLEM.title,samples});
}catch(e){failures.push({id,error:e.message});}}
console.log(JSON.stringify({checks,reports,failures},null,2));
if(failures.length)process.exitCode=1;
if(process.argv.includes('--browser'))(async()=>{
  const http=require('node:http'),server=http.createServer((req,res)=>{try{let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!f.startsWith(root+path.sep)&&f!==root)throw Error();if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');res.setHeader('Content-Type',f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.js')?'text/javascript; charset=utf-8':f.endsWith('.css')?'text/css':'image/svg+xml');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const {chromium}=require(process.env.ALGORIZOOM_PLAYWRIGHT||'playwright');let browser;
  try{browser=await chromium.launch({headless:true,...(process.env.ALGORIZOOM_BROWSER?{executablePath:process.env.ALGORIZOOM_BROWSER}:{})});const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    const waitReady=async()=>{if(await page.locator('#buildStatus').count())await page.waitForFunction(()=>!document.getElementById('applyBtn').disabled);};
    for(const width of [1440,390]){await page.setViewportSize({width,height:900});for(const id of ids){
      const p=lessons[id],sample=p.PROBLEM.samples.find(s=>s.id!=='all'),data=p.parseInput(sample.value);
      await page.goto(`http://127.0.0.1:${server.address().port}/problems/${id}/`);await waitReady();
      const button=page.locator('#sampleButtons button').filter({hasText:new RegExp('^'+sample.label+'$')});await button.click();await waitReady();
      assert.equal(await page.locator('#inputError').textContent(),'');
      const control=id=>page.locator(width<760?({skipBtn:'.mobile-settings button',resetBtn:'.mobile-settings button',replayBtn:'.mobile-settings button'}[id]||'#mobile'+id[0].toUpperCase()+id.slice(1)):'#'+id);
      const skip=width<760?control('skipBtn').filter({hasText:'끝으로'}):control('skipBtn');
      await control('nextBtn').click();assert.equal(await page.locator('.code-line.active').count(),2,`${id} active code`);
      await skip.click();await page.waitForFunction(()=>document.getElementById('outputView').textContent.trim().startsWith('#1'));
      assert.equal((await page.locator('#outputView').textContent()).trim(),`#1 ${oracle[id](data[0])}`);
      assert.equal(await page.locator('#outputView').textContent(),await page.locator('#mobileOutputView').textContent());
      const timeline=control('timeline');await timeline.fill('1');await timeline.dispatchEvent('input');assert.equal(await page.locator('.code-line.active').count(),2);
      const before=await timeline.inputValue();await page.locator('#inputArea').fill('1\n');await page.locator('#applyBtn').click();await waitReady();assert(await page.locator('#inputError').textContent());assert.equal(await timeline.inputValue(),before);
      await button.click();await waitReady();assert.equal(await page.locator('#inputError').textContent(),'');
      const play=control('playBtn');await play.click();assert.equal(await play.getAttribute('aria-pressed'),'true');
      await page.locator('#speedRange').fill('2');await page.locator('#speedRange').dispatchEvent('input');await page.waitForTimeout(420);assert.notEqual(await timeline.inputValue(),'0');
      await play.click();assert.equal(await play.getAttribute('aria-pressed'),'false');const paused=await timeline.inputValue();await page.waitForTimeout(420);assert.equal(await timeline.inputValue(),paused);
      const all=p.PROBLEM.samples.find(s=>s.id==='all');if(all){await page.locator('#sampleButtons button').filter({hasText:'전체 샘플'}).click();await waitReady();await skip.click();const expected=p.parseInput(all.value).map((d,i)=>`#${i+1} ${oracle[id](d)}`).join('\n');await page.waitForFunction(expected=>document.getElementById('outputView').textContent.trim()===expected,expected);}
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${id} horizontal overflow ${width}`);
      console.log(`Browser ${width}px: ${id} passed`);
      if((width===1440&&id==='5209')||(width===390&&id==='5189')){await page.locator('.code-reveal-cover button').filter({visible:true}).first().click();await page.screenshot({path:path.join(require('node:os').tmpdir(),`algorizoom-existing-${id}-${width}.png`),fullPage:true});}
    }}assert.deepEqual(errors,[]);
  }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
