const { getTaskModel, getSubTaskModel, getCommentModel, getReplyModel } = require("../config/db");

const SubTaskController = {
  async createSubTask(req, res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const {taskId} = req.body;
      const newSubTask = await subTaskModel.create({taskId: taskId});
      res.status(200).json(newSubTask)
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async getSubTasks(req,res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const { taskId } = req.params;
      const subTask = await subTaskModel.findMany({where: {taskId: taskId}});
      
      
      res.status(200).json(subTask)
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async updateContent(req,res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const {id} = req.params;
      const { content } = req.body;
      if(content) {
        const subTask = await subTaskModel.updateOne({where: {id}, data: {content}});
      
      res.status(200).json(subTask)
      } else {
        const subTask = await subTaskModel.updateOne({where: {id}, data: {content: ""}});
      
      res.status(200).json(subTask)
      }
      
      
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async updateLang(req,res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const {id} = req.params;
      const { lang } = req.body;
      const subTask = await subTaskModel.updateOne({where: {id}, data: {lang}});
      
      res.status(200).json(subTask)
      
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async deleteSubTask(req,res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const {id} = req.params;
      const subTask = await subTaskModel.delete({where: {id}});
      
      res.status(200).json(subTask)
      
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  
  async fetchComments(req,res) {
    try {
      const commentModel = getCommentModel();
      const replyModel = getReplyModel()
      if (!replyModel && !commentModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      const {subTaskId} = req.params;
      
      const comments = await commentModel.findMany({where: {subTaskId}})
      
      const commentIds = comments.map(c => c.id)
      const replies = await replyModel.findMany({where:{commentId: commentIds}})
      
      
      const commentMap = {};
      const mainComments = [];
      
      comments.forEach(cmt => {
        cmt.replies = [];
        commentMap[cmt.id] = cmt;
        mainComments.push(cmt)
      })
      
      replies.forEach(rep => {
        if(commentMap[rep.commentId]) {
          commentMap[rep.commentId].replies.push(rep)
        }
      })
      
      res.status(200).json(mainComments)
    } catch(e) {
      res.status(500).json({error: "Error fetching comments", detail: e})
    }
  }
};

module.exports = SubTaskController;