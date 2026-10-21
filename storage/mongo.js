const Client=require('../models/Client');
const {validateClients}=require('./validate');
function mongoStore(){return {
 async list(){return Client.find({}, {_id:0}).sort({id:1}).lean();},
 async get(id){return Client.findOne({id},{_id:0}).lean();},
 async replaceAll(records){validateClients(records);await Client.bulkWrite(records.map(c=>({replaceOne:{filter:{id:c.id},replacement:c,upsert:true}})),{ordered:true});}
};}
module.exports={mongoStore};
