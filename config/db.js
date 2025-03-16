const {initORM} = require('ladder-orm');

let ormInstance;
let taskModel;
let subTaskModel;

async function setupORM() {
  if(!ormInstance) {
    ormInstance = await initORM("./schema.orm")
    taskModel = ormInstance.model("task");
    subTaskModel = ormInstance.model("subtask");
    console.log("Orm initialized")
  }
  
}
  module.exports = {setupORM, getTaskModel: () => taskModel, getSubTaskModel: () => subTaskModel };
