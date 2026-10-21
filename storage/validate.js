const required=['id','name','classification','riskCategory','email','phone','advisor','status','portfolioValue','lastReview','nextReview','kycComplete','objective','notes'];
function validateClients(records){
 if(!Array.isArray(records))throw new Error('Client dataset must be an array');
 const ids=new Set();
 for(const c of records){
  if(!c||typeof c!=='object'||required.some(k=>!(k in c)))throw new Error('Malformed client record');
  if(typeof c.id!=='string'||! /^[A-Za-z0-9-]+$/.test(c.id)||ids.has(c.id))throw new Error('Invalid or duplicate client ID');
  ids.add(c.id);
  if(!['Individual','Corporate'].includes(c.classification)||!['Low','Moderate','High'].includes(c.riskCategory)||typeof c.portfolioValue!=='number'||!Number.isFinite(c.portfolioValue)||c.portfolioValue<0||typeof c.kycComplete!=='boolean')throw new Error('Invalid client fields');
  for(const k of ['name','email','phone','advisor','status','objective','notes'])if(typeof c[k]!=='string'||!c[k].trim())throw new Error(`Invalid ${k}`);
  for(const k of ['lastReview','nextReview'])if(typeof c[k]!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(c[k]))throw new Error(`Invalid ${k}`);
 }
 return records;
}
module.exports={validateClients};
