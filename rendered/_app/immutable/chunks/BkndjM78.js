import{a as i,f as c}from"./C3J-C5dd.js";import"./DFNLgyrO.js";import{B as d,i as u}from"./DjPrEgA8.js";import{l as p,s as l}from"./DlXlcSp3.js";import{R as h}from"./CMDZh9pQ.js";import{R as f}from"./OWt1Mo0g.js";const e={layout:"runbook",title:"0002: Merge reports only after verifying the cause",owner:"mmodiG8",status:"accepted",reviewed:"2026-10-28",signature:"v1.eyJzdWIiOiI0NDE4IiwiYXVkIjoiY2hhbGxlbmdlOndoYXQtaXQtc2hvd3MiLCJpYXQiOjE3OTMyMTQ1NDEsImV4cCI6MTc5MzMwMDk0MX0.6i0P5K-Xd4-o0heoy9hnT_UXvEHG5EHSy7cTdKCOTXo"},{layout:T,title:j,owner:O,status:x,reviewed:D,signature:m}=e;var g=c(`<p><strong>Date:</strong> 29 October 2026. <strong>Decider:</strong> mmodiG8. <strong>Supersedes:</strong> <a href="/kb/decisions/0001-dedupe-by-subject">decision 0001</a>.</p> <h2>Context</h2> <p>The review of <a href="/kb/incidents/4471-review">#4471</a> found different causes hidden
inside one known ticket. Matching subjects neither establish the same failure
nor exclude a different one. The former accepted record remains unchanged as
history, not as the current merge policy.</p> <h2>Decision</h2> <p>Read each report and verify its cause before merging. For the date failures,
look up the tenant locale and booking-form version and inspect the channel
using <code>causeOf</code> and <code>sameCause</code> in <code>src/lib/kb/causes.ts</code>.
Browser intake tags and normalized subjects are hints, not authority.
Matching subjects may point to different tickets, and different subjects may
describe the same cause. Unknown tenant or insufficient evidence means no
automatic merge; investigate first.</p> <h2>Consequences</h2> <p>Triage takes more reading but preserves separate engineering fixes and honest
counts. Deduplicate exports by report ID, not by subject or raw row count.
Re-evaluate open known tickets as reports arrive. Treat classifier results
as the exported model, and retain contrary body evidence for investigation
rather than claiming a cause the data does not establish.</p> <!>`,1);function b(r,o){const s=p(o,["children","$$slots","$$events","$$legacy"]);h(r,l(()=>s,()=>e,{children:(a,v)=>{var t=g(),n=d(u(t),14);f(n,{get signature(){return m}}),i(a,t)},$$slots:{default:!0}}))}const X=Object.freeze(Object.defineProperty({__proto__:null,default:b,metadata:e},Symbol.toStringTag,{value:"Module"}));export{X as _,b as a};
