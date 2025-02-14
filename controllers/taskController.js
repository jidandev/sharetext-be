const db = require('../config/db');

exports.getTasks = (req, res) => {
    let ids = req.query.ids;
    if (!ids) return res.status(200).json({ message: "Empty tasks" });

    ids = Array.isArray(ids) ? ids.map(Number) : ids.split(",").map(Number);

    const query = `SELECT * FROM tasks WHERE id IN (?)`;
    db.query(query, [ids], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getTasksByUser = (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const query = `SELECT * FROM tasks WHERE user_id = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getSubTasks = (req, res) => {
  let taskId = req.query.taskId;
  
  if (!taskId) return res.status(400).json({ error: "Task ID is required" });
  
  const query = `SELECT * FROM subtasks where task_id = ?`
  db.query(query, [taskId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
        res.json(results);
  })
}

exports.getSubTask = (req, res) => {
  let subTaskId = req.params.id;
  
  const query = `SELECT * FROM subtasks where id = ?`
  db.query(query, [subTaskId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
        res.json(results);
  })
}

exports.addTask = (req, res) => {
    const { userId, title } = req.body;
    db.query('INSERT INTO tasks (title,user_id) VALUES (?,?)', [title || "New task", userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User added successfully', data: {id: results.insertId, user_id: userId || null, title: title || "New task"} });
    });
};

exports.addSubTask = (req, res) => {
    const { title, text, lang, taskId } = req.body;
    db.query('INSERT INTO subtasks (title, text, lang, task_id) VALUES (?,?,?,?)', [title || "Title", text || '', lang || "text", taskId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User added successfully', data: {id: results.insertId, task_id: taskId, title: title || "Title", text: text || "", lang: lang || "text"} });
    });
};

exports.changeTitleSubTask = (req,res) => {
  const subTaskId = req.params.id;
  const {title} = req.body;
  
  if(!title) {
   return res.status(200).json({message: "Title tidak diganti"})
  }
  
  const query = `UPDATE subtasks SET title = ? WHERE id = ?`;
  
  db.query(query, [title,subTaskId], (err,results) => {
    if(err) return res.status(500).json({message: "Gagal update data", error: err})
    
    res.status(200).json({message: "Subtask title berhasil diperbarui", data: {id: subTaskId, title: title}})
  })
}

exports.changeLangSubTask = (req,res) => {
  const subTaskId = req.params.id;
  const {lang} = req.body;
  
  if(!lang) {
   return res.status(200).json({message: "Language tidak diganti"})
  }
  
  const query = `UPDATE subtasks SET lang = ? WHERE id = ?`;
  
  db.query(query, [lang,subTaskId], (err,results) => {
    if(err) return res.status(500).json({message: "Gagal update data", error: err})
    
    res.status(200).json({message: "Subtask lang berhasil diperbarui", data: {id: subTaskId, lang: lang}})
  })
}

exports.changeTextSubTask = (req,res) => {
  const subTaskId = req.params.id;
  const {text} = req.body;
  
  const query = `UPDATE subtasks SET text = ? WHERE id = ?`;
  
  db.query(query, [text,subTaskId], (err,results) => {
    if(err) return res.status(500).json({message: "Gagal update data", error: err})
    
    res.status(200).json({message: "Subtask text berhasil diperbarui", data: {id: subTaskId, text: text}})
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
    if(err) return res.status(500).json({message: "Gagal delete data", error: err})
    
    res.status(200).json({message: "Subtask berhasil didelete"})
  })
}