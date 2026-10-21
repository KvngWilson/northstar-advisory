const fs=require('node:fs/promises');
const path=require('node:path');
const {validateClients}=require('./validate');
function fileStore(filename){
 const file=path.resolve(filename);
 return {
  async list(){const records=JSON.parse(await fs.readFile(file,'utf8'));return validateClients(records);},
  async get(id){return (await this.list()).find(c=>c.id===id)||null;},
  async replaceAll(records){validateClients(records);const temp=`${file}.${process.pid}.${Date.now()}.tmp`;try{await fs.writeFile(temp,JSON.stringify(records,null,2)+'\n',{flag:'wx'});await fs.rename(temp,file);}catch(e){await fs.rm(temp,{force:true});throw e;}}
 };
}
module.exports={fileStore};
