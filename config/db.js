const {initORM} = require('ladder-orm');

let ormInstance;
let taskModel;
let subTaskModel;
let commentModel;
let replyModel;

async function setupORM() {
  if(!ormInstance) {
    ormInstance = await initORM("./schema.orm")
    taskModel = ormInstance.model("task");
    subTaskModel = ormInstance.model("subtask");
    commentModel = ormInstance.model("comment");
    replyModel = ormInstance.model("replie");
    console.log("Orm initialized")
  }
  
}
  module.exports = {setupORM, getTaskModel: () => taskModel, getSubTaskModel: () => subTaskModel, getCommentModel: () => commentModel, getReplyModel: () => replyModel};