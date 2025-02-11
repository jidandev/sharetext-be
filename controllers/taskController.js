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
