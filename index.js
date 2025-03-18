const express = require('express');
const dotenv = require('dotenv');
const { Server } = require("socket.io")
const cors = require("cors")
const taskRoutes = require('./routes/taskRoutes');
const subTaskRoutes = require('./routes/subTaskRoutes');
const {setupORM, getCommentModel, getReplyModel } = require("./config/db")


dotenv.config();

const app = express();
app.use(express.json());
setupORM();

app.use('/', taskRoutes);
app.use('/', subTaskRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {origin: "*"},
})

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id)
  
  //Send comment
  socket.on("sendComment", async(data) => {
    try {
      const commentModel = getCommentModel();
      
      if(commentModel) {
        const comment = await commentModel.create({username: socket.id, content: data.content, subTaskId: data.subTaskId})
        io.emit("receiveComment", {...comment, replies: []})
      }
    } catch(e) {
      console.error("Error saving comment: ", e)
    }
  })
  
  //Send Reply
  socket.on("sendReply", async(data) => {
    try {
      const replyModel = getReplyModel();
      
      if(replyModel) {
        const reply = await replyModel.create({username: data.username, content: data.content, commentId: data.commentId})
        io.emit("receiveReply", reply)
      }
    } catch(e) {
      console.error("Error saving reply: ", e)
    }
  })
  
  //Disconect
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id)
  })
})