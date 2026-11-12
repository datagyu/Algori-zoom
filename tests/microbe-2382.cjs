// node tests/microbe-2382.cjs
// Validate the SWEA 2382 visualizer simulation independently of browser DOM.
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const assert=require("node:assert/strict");
const src=fs.readFileSync(path.join(__dirname,"../problems/2382/script.js"),"utf8");
const marker=src.lastIndexOf("  renderCode();");
assert(marker>=0,"initialization boundary");
const sandbox={window:{AlgoriZoomCore:{getByIds:()=>({})}}};
vm.createContext(sandbox);
vm.runInContext(src.slice(0,marker)+"  stepLineMap=new Map(PROBLEM.sourceSteps.flatMap(x=>x.types.split(' ').map(t=>[t,1]))); window.test2382={parseInput,buildSteps,PROBLEM}; })();",sandbox);
const {parseInput,buildSteps,PROBLEM}=sandbox.window.test2382;
function oracle({N,M,worms}){
  let groups=worms.map(g=>({...g}));
  const dr=[0,-1,1,0,0],dc=[0,0,0,-1,1],reverse=[0,2,1,4,3];
  for(let h=0;h<M;h++){
    const byCell=new Map();
    for(const g of groups){
      const r=g.r+dr[g.d],c=g.c+dc[g.d],edge=r===0||c===0||r===N-1||c===N-1;
      const n=edge?Math.floor(g.n/2):g.n,d=edge?reverse[g.d]:g.d;
      if(!n)continue;
      const k=r*N+c;
      if(!byCell.has(k))byCell.set(k,[]);
      byCell.get(k).push({r,c,n,d});
    }
    groups=[...byCell.values()].map(items=>({
      r:items[0].r,c:items[0].c,
      n:items.reduce((sum,g)=>sum+g.n,0),
      d:items.reduce((max,g)=>g.n>max.n?g:max).d
    }));
  }
  return groups.reduce((sum,g)=>sum+g.n,0);
}
function check(cases){
  const steps=buildSteps(cases),output=steps.at(-1).output.trim().split("\n");
  assert.equal(output.length,cases.length);
  cases.forEach((c,i)=>assert.equal(output[i],"#"+(i+1)+" "+oracle(c)));
  for(const s of steps){
    assert.equal(s.visibleTotal,s.pending.reduce((n,g)=>n+g.n,0)+s.board.reduce((n,g)=>n+g.n,0));
    for(const g of s.board){assert(g.maxCount<=g.n);assert(g.n>0);}
  }
  return steps;
}
const samples=parseInput(PROBLEM.samples.find(s=>s.id==="all").value);
check(samples);
const special=parseInput("1\n5 2 3\n2 1 10 4\n1 2 9 2\n2 3 20 3");
const steps=check(special);
assert(steps.some(s=>s.phase==="merge"));
assert(steps.some(s=>s.phase==="maximum"));
assert(steps.some(s=>s.phase==="halve"||s.phase==="reverse"));
assert.throws(()=>parseInput("1\n5 2 2\n2 2 10 1\n2 2 15 2"),/중복/);
assert.throws(()=>parseInput("1\n5 2 1\n2 2 10 8"),/확인/);
let seed=2382;
function rand(n){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;}
for(let i=0;i<75;i++){
  const N=5+rand(5),M=1+rand(8),K=1+rand(Math.min(15,(N-2)**2));
  const slots=[];for(let r=1;r<N-1;r++)for(let c=1;c<N-1;c++)slots.push([r,c]);
  const worms=[];
  for(let j=0;j<K;j++){
    const slot=slots.splice(rand(slots.length),1)[0];
    worms.push({r:slot[0],c:slot[1],n:1+rand(80),d:1+rand(4)});
  }
  check([{N,M,worms}]);
}
console.log("SWEA 2382: samples, collisions, edge cases and 75 randomized simulations passed");
