const { getTaskModel, getSubTaskModel } = require("../config/db");
const { nanoid } = require("nanoid")

function generateSlug() {
  return nanoid(Math.floor(Math.random() * (10-5 + 1)) + 5)
}

const TaskController = {
  async createTask(req, res) {
    try {
      
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      async function cekSlug(slug) {
        const userExist = await taskModel.find({where: {slug: slug}})
        if(userExist) {
          return cekSlug(generateSlug())
        } else {
          return slug
        }
      }
      let slug = await cekSlug(generateSlug())
      
      const newTask = await taskModel.create({slug: slug, title: "New task"});
      const newSubTask = await subTaskModel.create({taskId: newTask.id});
      res.status(200).json({
        task: newTask,
        subTask: newSubTask,
        slug: newTask.slug
      })
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async getTaskBySlug(req,res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const { slug } = req.params;
      const task = await taskModel.find({where: {slug: slug}});
      if(!task) return res.status(404).json({data: null, message: "Task not found"})
      
      res.status(200).json(task)
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async getTaskBySlugs(req,res) {
    try {
      const taskModel = getTaskModel();
      if (!taskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const slugs = req.query.slugs.split(",")
      const tasks = await taskModel.findMany({where: {slug: slugs}});
      
      res.status(200).json(tasks)
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async renderTask(req,res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const { slug } = req.params;
      const task = await taskModel.find({where: {slug: slug}});
      if(!task) {
        return res.status(404).json({data: null, message: "Task not found"})
      } else {
        const subTask = await subTaskModel.findMany({where: {taskId: task.id}});
      
      
      res.status(200).json({
        task,
        subTask
      })
      }
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async updatePassword(req,res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const {slug} = req.params;
      const { password } = req.body;
      const task = await taskModel.updateOne({where: {slug}, data: {password}});
      
      res.status(200).json(task)
      
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async updateTitle(req,res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const {slug} = req.params;
      const { title } = req.body;
      const task = await taskModel.updateOne({where: {slug}, data: {title}});
      
      res.status(200).json(task)
      
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  async deleteTask(req,res) {
    try {
      const taskModel = getTaskModel();
      const subTaskModel = getSubTaskModel()
      if (!taskModel && !subTaskModel) {
        return res.status(500).json({ error: "ORM not initialized" });
      }
      
      const {slug} = req.params;
      const task = await taskModel.delete({where: {slug}});
      
      res.status(200).json(task)
      
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = TaskController;