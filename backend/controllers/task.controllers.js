import Task from '../models/task.js';

export const addTask = async (req, res) => {
    try {
        let { title, status, projectId } = req.body;
        const userId = req.user.id;
        const newtask = new Task({
            user: userId,
            title: title,
            status: status || 'todo',
            project: projectId || null,
        });
        await newtask.save();
        res.status(200).json({
            newtask,
            message: "Task added successfully",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const showTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { projectId } = req.query;
        const filter = { user: id };
        if (projectId) filter.project = projectId;
        const task = await Task.find(filter).sort({ createdAt: -1 });
        const newArr = task.map((item) => {
            return {
                title: item.title,
                id: item._id,
                status: item.status,
                updatedAt: item.updatedAt,
                attachments: item.attachments?.length || 0,
            };
        });
        res.status(200).json({ task: newArr });
    } catch (err) {
        res.status(500).json({ message: "internal error not fetching data" });
    }
};

export const showone = async (req, res) => {
    try {
        const { projectId } = req.params;
        const task = await Task.findById(projectId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export const editTask = async (req, res) => {
    try {
        let { id } = req.params;
        let { description, title, status } = req.body;
        const updateData = {};
        if (description !== undefined) updateData.description = description;
        if (title) updateData.title = title;
        if (status) updateData.status = status;
        const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({
            editTask: updatedTask,
            message: 'Task updated successfully',
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['todo', 'inprogress', 'done'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ task, message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        let { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: "deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const uploadAttachment = async (req, res) => {
    try {
        const { id } = req.params;
        const { filename, mimetype, data, size } = req.body;

        if (!data || !filename) {
            return res.status(400).json({ message: 'filename and data are required' });
        }

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.attachments.push({ filename, mimetype, data, size });
        await task.save();

        res.status(200).json({
            message: 'Attachment uploaded',
            attachment: task.attachments[task.attachments.length - 1],
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteAttachment = async (req, res) => {
    try {
        const { id, attachmentId } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        task.attachments = task.attachments.filter(a => a._id.toString() !== attachmentId);
        await task.save();
        res.status(200).json({ message: 'Attachment removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });
        res.status(200).json({ tasks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
