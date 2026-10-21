const express=require('express');
function routes(store){const router=express.Router();
 router.get('/clients',async(req,res,next)=>{try{res.json(await store.list());}catch(e){next(e);}});
 router.get('/clients/:id',async(req,res,next)=>{try{const client=await store.get(req.params.id);if(!client)return res.status(404).json({error:'Client not found'});res.json(client);}catch(e){next(e);}});
 router.get('/metrics',async(req,res,next)=>{try{const clients=await store.list();res.json({totalClients:clients.length,totalPortfolioValue:clients.reduce((s,c)=>s+c.portfolioValue,0),highRisk:clients.filter(c=>c.riskCategory==='High').length,kycPending:clients.filter(c=>!c.kycComplete).length});}catch(e){next(e);}});
 return router;
}
module.exports={routes};
