// Extend legacy simulated DOM checks for execution replay controls. Not browser QA.
function node(base={}) {
 return Object.assign({children:[],style:{},dataset:{},textContent:'',disabled:false,className:'',
  appendChild(child){this.children.push(child);return child;},
  replaceChildren(...children){this.children=children;},
  classList:{toggle(){}}
 },base);
}
function extend(ctx,nodes,html){
 for(const id of Object.keys(nodes))nodes[id]=node(nodes[id]);
 const make=ctx.document.createElement;
 ctx.document.createElement=(tag)=>node(make(tag));
 const lines=[...html.matchAll(/data-step="(\d+)"/g)].map(m=>node({dataset:{step:m[1]}}));
 ctx.document.querySelectorAll=s=>s==='#traceCode .code-line'?lines:[];
}
module.exports={node,extend};
