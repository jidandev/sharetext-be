const db = require('../config/db');
const {nanoid} = require('nanoid');

// exports.getTasks = (req, res) => {
//     let ids = req.query.ids;
//     if (!ids) return res.status(200).json({ message: "Empty tasks" });

//     ids = Array.isArray(ids) ? ids.map(Number) : ids.split(",").map(Number);

//     const query = `SELECT * FROM tasks WHERE id IN (?)`;
//     db.query(query, [ids], (err, results) => {
//         if (err) return res.status(500).json({ message: 'Cannot get tasks', details: err });
//         res.status(200).json(results);
//     });
// };
exports.getTasks = (req, res) => {
    let guest = req.query.guest;
    if (!guest) return res.status(200).json({ message: "Empty tasks" });

    const query = `SELECT * FROM tasks WHERE guest = ?`;
    db.query(query, [guest], (err, results) => {
        if (err) return res.status(500).json({ message: 'Cannot get tasks', details: err });
        res.status(200).json(results);
    });
};

exports.getTasksByUser = (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const query = `SELECT * FROM tasks WHERE user_id = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Cannot get tasks', details: err });
        res.status(200).json(results);
    });
};

exports.getSubTasks = (req, res) => {
  let taskId = req.query.taskId;
  
  if (!taskId) return res.status(400).json({ error: "Task ID is required" });
  
  const query = `SELECT * FROM subtasks where task_id = ?`
  db.query(query, [taskId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Cannot get subtasks', details: err });
        res.status(200).json(results);
  })
}

exports.getSubTask = (req, res) => {
  let subTaskId = req.params.id;
  
  const query = `SELECT * FROM subtasks where id = ?`
  db.query(query, [subTaskId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Cannot get subtask', details: err });
        res.status(200).json(results);
  })
}

exports.addTask = (req, res) => {
    const { userId, title, guest } = req.body;
    db.query('INSERT INTO tasks (title,user_id,guest) VALUES (?,?,?)', [title || "New task", userId, guest], (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to add task', details: err });
        res.status(200).json({ message: 'Task added successfully', data: {id: results.insertId, user_id: userId || null, guest: guest || null, title: title || "New task"} });
    });
};

exports.addSubTask = (req, res) => {
    const { title, text, lang, taskId } = req.body;
    db.query('INSERT INTO subtasks (title, text, lang, task_id) VALUES (?,?,?,?)', [title || "Title", text || '', lang || "text", taskId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to add subtask', details: err });
        res.json({ message: 'Subtask added successfully', data: {id: results.insertId, task_id: taskId, title: title || "Title", text: text || "", lang: lang || "text"} });
    });
};

exports.changeTitleSubTask = (req,res) => {
  const subTaskId = req.params.id;
  const {title} = req.body;
  
  if(!title) {
   return res.status(200).json({message: "Title not changed"})
  }
  
  const query = `UPDATE subtasks SET title = ? WHERE id = ?`;
  
  db.query(query, [title,subTaskId], (err,results) => {
    if (err) return res.status(500).json({ message: 'Failed to updated subtask title', details: err });
    
    res.status(200).json({message: "Subtask title successfully updated", data: {id: subTaskId, title: title}})
  })
}

exports.changeLangSubTask = (req,res) => {
  const subTaskId = req.params.id;
  const {lang} = req.body;
  
  if(!lang) {
   return res.status(200).json({message: "Language not changed"})
  }
  
  const query = `UPDATE subtasks SET lang = ? WHERE id = ?`;
  
  db.query(query, [lang,subTaskId], (err,results) => {
    if (err) return res.status(500).json({ message: 'Failed to updated subtask lang', details: err });
    
    res.status(200).json({message: "Subtask lang successfully updated", data: {id: subTaskId, lang: lang}})
  })
}

exports.changeTextSubTask = (req,res) => {
  const subTaskId = req.params.id;
  const {text} = req.body;
  
  const query = `UPDATE subtasks SET text = ? WHERE id = ?`;
  
  db.query(query, [text,subTaskId], (err,results) => {
    if (err) return res.status(500).json({ message: 'Failed to saved text', details: err });
    
    res.status(200).json({message: "Subtask text successfully saved", data: {id: subTaskId, text: text}})
  })
}

exports.updateSubTask = (req,res) => {
  const subTaskId= req.params.id;
  const {title,text,lang} = req.body;
  
  let fields = []
  let values = []
  
  if(title !== undefined) {
    fields.push("title = ?")
    values.push(title)
  }
  if(text !== undefined) {
    fields.push("text = ?")
    values.push(text)
  }
  if(lang !== undefined) {
    fields.push("lang = ?")
    values.push(lang)
  }
  
  if(fields.length == 0) {
    return res.status(400).json({message: "Tidak ada data yang akan diperbarui"})
  }
  values.push(subTaskId)
  
  const query = `UPDATE subtasks SET ${fields.join(', ')} WHERE id = ?`
  
  db.query(query, values, (err, results) => {
    if(err) return res.status(500).json({message: "Gagal update data", error: err})
    
    res.status(200).json({message: "Subtask berhasil diperbarui", id: subTaskId, updatedFields: req.body})
  })
}

exports.deleteSubTask = (req,res) => {
  const subTaskId = req.params.id;
  
  const query = `DELETE FROM subtasks WHERE id = ?`;
  
  db.query(query, [subTaskId], (err,results) => {
    if (err) return res.status(500).json({ message: 'Failed to delete subtask', details: err });
    
    res.status(200).json({message: "Subtask successfully delete"})
  })
}

async function generateGuestName() {
  return new Promise((resolve, reject) => {
    function attemptGuest() {
      const guest = nanoid(10);
      const query = `SELECT COUNT(*) as count from guests where name = ?`
      db.query(query,[guest],(err,results) => {
        if(err) return reject(err);
        if(results[0].count > 0) {
          attemptGuest();
        } else {
          resolve(guest)
        }
      })
    }
    attemptGuest();
  })
}

exports.addGuest = async (req,res) => {
  try {
    const guest = await generateGuestName();
    const query = `insert into guests (name) values(?)`;
    db.query(query,[guest],(err,results) => {
      if(err) return res.status(500).json({message: 'Databases error', details: err})
      res.status(200).json({name: guest})
    })
  } catch(e) {
    res.status(500).json({message: 'Error generating guest name', details: e})
  }
}

exports.yourTask = (req,res) => {
  const {taskId,guest}= req.query;
  
  if(!taskId) return res.status(500).json({message: 'Taskid required'})
  if(!guest) return res.status(500).json({message: 'Guest required'})
  
  const query = `SELECT * FROM tasks where id = ?`
  db.query(query,[taskId],(err,results) => {
    if(err) return res.status(500).json({details: err})
    
    if(results[0].guest == guest) {
      res.status(200).json(true)
    } else {
      res.status(200).json(false)
    }
  })
}