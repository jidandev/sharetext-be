const { getTaskModel, getSubTaskModel } = require("../config/db");

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
      const subTask = await subTaskModel.update({where: {id}, data: {content}});
      
      res.status(200).json(subTask)
      
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
      const subTask = await subTaskModel.update({where: {id}, data: {lang}});
      
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
};

module.exports = SubTaskController;