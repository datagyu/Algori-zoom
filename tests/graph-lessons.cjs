// node tests/graph-lessons.cjs [--browser]
// Optional browser dependencies: ALGORIZOOM_PLAYWRIGHT, ALGORIZOOM_BROWSER.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),ids=['10966','24220','5247','5248','5249','5251'];
const lessons={};let checks=0;
for(const id of ids){const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'assets/graph-lesson-data.js'),'utf8'),ctx);ctx.GraphLessonInput=ctx.window.GraphLessonInput;vm.runInContext(fs.readFileSync(path.join(root,'problems',id,'script.js'),'utf8'),ctx);lessons[id]=ctx.window.GraphLesson;}
const expected={'10966':[9,4,15],'24220':[3,4,0],'5247':[3,4,8],'5248':[3,2,3],'5249':[2,13,7],'5251':[2,4,4]};
for(const [id,p] of Object.entries(lessons)){
  const source=fs.readFileSync(path.join(root,'problems',id,'index.html'),'utf8').match(/<template id="sourceCode">([\s\S]*?)<\/template>/)[1].replaceAll('&lt;','<').replaceAll('&amp;','&');
  for(const a of p.anchors)assert(source.split(/\r?\n/).some(l=>l.trim()===a.text),`${id}: ${a.text}`);
  const phases=new Set(p.anchors.flatMap(a=>a.types.split(' ')));
  p.samples.forEach((s,i)=>{const r=p.build(p.parse(s)[0]);assert.equal(r.answer,expected[id][i]);r.steps.forEach(s=>assert(phases.has(s.phase)));checks++;});
  assert.throws(()=>p.parse('1\n'));assert.throws(()=>p.parse(p.samples[0]+'\n999'));
}
// Reproducible independent oracles: Manhattan distances, subset paths,
// connected components, Prim, and Bellman-Ford.
let seed=20261008;const random=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
for(let trial=0;trial<60;trial++){
  const grid=Array.from({length:4},()=>Array.from({length:5},()=>random(4)?'L':'W'));grid[0][0]='W';
  const waters=grid.flatMap((row,r)=>row.flatMap((v,c)=>v==='W'?[[r,c]]:[]));let sum=0;
  grid.forEach((row,r)=>row.forEach((v,c)=>{if(v==='L')sum+=Math.min(...waters.map(([rr,cc])=>Math.abs(r-rr)+Math.abs(c-cc)));}));
  assert.equal(lessons['10966'].build({grid}).answer,sum);checks++;
  const N=5,edges=[];for(let a=1;a<=N;a++)for(let b=1;b<=N;b++)if(a!==b&&random(4)===0)edges.push([a,b]);
  // Subset DP counts paths independently of the visualizer's backtracking.
  const dp=Array.from({length:1<<N},()=>Array(N).fill(0));dp[1][0]=1;let count=0;
  for(let mask=1;mask<1<<N;mask++)for(let n=0;n<N;n++)if(dp[mask][n]){if(n===N-1){count+=dp[mask][n];continue;}for(const [a,b] of edges)if(a===n+1&&!(mask&(1<<(b-1))))dp[mask|1<<(b-1)][b-1]+=dp[mask][n];}
  assert.equal(lessons['24220'].build({N,edges,S:1,G:N}).answer,count);checks++;
  const seen=new Set();let groups=0;for(let n=1;n<=N;n++){if(seen.has(n))continue;groups++;const stack=[n];seen.add(n);while(stack.length){const x=stack.pop();for(const [a,b] of edges){const y=a===x?b:b===x?a:null;if(y!=null&&!seen.has(y)){seen.add(y);stack.push(y);}}}}
  assert.equal(lessons['5248'].build({N,edges}).answer,groups);checks++;
  const weighted=[];for(let a=0;a<5;a++)for(let b=a+1;b<5;b++)weighted.push([a,b,random(10)+1]);
  const chosen=new Set([0]);let cost=0;while(chosen.size<5){let best=null;for(const e of weighted)if(chosen.has(e[0])!==chosen.has(e[1])&&(!best||e[2]<best[2]))best=e;cost+=best[2];chosen.add(best[0]);chosen.add(best[1]);}
  assert.equal(lessons['5249'].build({V:4,edges:weighted}).answer,cost);checks++;
  const directed=[...weighted,...weighted.filter(()=>random(2)).map(([a,b,w])=>[b,a,w])],d=Array(5).fill(Infinity);d[0]=0;
  for(let pass=0;pass<4;pass++)for(const [a,b,w] of directed)d[b]=Math.min(d[b],d[a]+w);
  assert.equal(lessons['5251'].build({N:4,edges:directed}).answer,d[4]);checks++;
}
// Bidirectional relaxation for small operation inputs, including N=M.
for(let trial=0;trial<25;trial++){
  const N=random(30)+1,M=random(30)+1,d=Array(121).fill(Infinity);d[N]=0;
  // Paths leaving 1..120 cannot improve distances between 1..30.
  for(let pass=0;pass<120;pass++)for(let n=1;n<=120;n++)for(const next of [n+1,n-1,n*2,n-10])if(next>=1&&next<=120)d[next]=Math.min(d[next],d[n]+1);
  assert.equal(lessons['5247'].build({N,M}).answer,d[M]);checks++;
}
assert(lessons['5247'].build({N:2000,M:1}).steps.length<30);
assert.throws(()=>lessons['10966'].parse('1\n1 1\nL'));
assert.throws(()=>lessons['5249'].build({V:2,edges:[[0,1,1]]}));
assert.throws(()=>lessons['5251'].build({N:2,edges:[[1,0,1]]}));
console.log(`${checks} sample / independent-oracle checks passed; code mappings and invalid inputs passed.`);
if(process.argv.includes('--browser'))(async()=>{
  const http=require('node:http'),server=http.createServer((req,res)=>{try{let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!f.startsWith(root+path.sep)&&f!==root)throw Error();if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');res.setHeader('Content-Type',f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.js')?'text/javascript; charset=utf-8':f.endsWith('.css')?'text/css':'image/svg+xml');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const {chromium}=require(process.env.ALGORIZOOM_PLAYWRIGHT||'playwright');
  let browser;try{
    browser=await chromium.launch({headless:true,...(process.env.ALGORIZOOM_BROWSER?{executablePath:process.env.ALGORIZOOM_BROWSER}:{})});
    const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(const width of [1440,390]){await page.setViewportSize({width,height:900});for(const id of ids){
      await page.goto(`http://127.0.0.1:${server.address().port}/problems/${id}/`);
      assert.equal(await page.locator('#inputError').textContent(),'');
      await page.locator(width<760?'#mobileNextBtn':'#nextBtn').click();
      assert.equal(await page.locator('.code-line.active').count(),2);
      await page.locator(width<760?'.mobile-settings button': '#skipBtn').filter({hasText:width<760?'끝으로':''}).last().click();
      assert.equal((await page.locator(width<760?'#mobileOutputView':'#outputView').textContent()).trim(),`#1 ${expected[id][0]}`);
      await page.locator('#sampleButtons button').filter({hasText:'전체 샘플'}).click();
      await page.locator(width<760?'.mobile-settings button':'#skipBtn').filter({hasText:width<760?'끝으로':''}).last().click();
      assert.equal((await page.locator(width<760?'#mobileOutputView':'#outputView').textContent()).trim(),expected[id].map((n,i)=>`#${i+1} ${n}`).join('\n'));
      // Native timeline, input failures, state preservation, sample selection.
      const timeline=page.locator(width<760?'#mobileTimeline':'#timeline');await timeline.fill('1');await timeline.dispatchEvent('input');
      await page.locator('#inputArea').fill('1\n');await page.locator('#applyBtn').click();assert(await page.locator('#inputError').textContent());
      await page.locator('#sampleButtons button').first().click();assert.equal(await page.locator('#inputError').textContent(),'');
      const play=page.locator(width<760?'#mobilePlayBtn':'#playBtn');
      await play.click();assert.equal(await play.getAttribute('aria-pressed'),'true');
      await page.locator('#speedRange').fill('2');await page.locator('#speedRange').dispatchEvent('input');
      await page.waitForTimeout(620);assert.notEqual(await timeline.inputValue(),'0');
      await play.click();assert.equal(await play.getAttribute('aria-pressed'),'false');
      const paused=await timeline.inputValue();await page.waitForTimeout(620);assert.equal(await timeline.inputValue(),paused);
      if((width===1440&&id==='5251')||(width===390&&id==='10966')){
        await page.locator('.code-reveal-cover button').filter({visible:true}).first().click();
        await page.screenshot({path:path.join(require('node:os').tmpdir(),`algorizoom-${id}-${width}.png`),fullPage:true});
      }
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${id}: page overflow at ${width}`);
      console.log(`Browser ${width}px: ${id} passed`);
    }}
    assert.deepEqual(errors,[]);
  }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
