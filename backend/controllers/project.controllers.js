import Project from '../models/project.js';
import Task from '../models/task.js';

/** Create a new project — any authenticated user becomes owner */
export const createProject = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        if (!title?.trim()) {
            return res.status(400).json({ message: 'Project title is required' });
        }
        const project = new Project({
            title: title.trim(),
            description: description || '',
            status: status || 'active',
            owner: req.user.id,
            members: [{ user: req.user.id, role: 'admin' }],
        });
        await project.save();
        res.status(201).json({ project, message: 'Project created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

/** Get all projects where the user is owner or member */
export const getProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        const projects = await Project.find({
            $or: [{ owner: userId }, { 'members.user': userId }],
        })
            .populate('owner', 'name email')
            .sort({ updatedAt: -1 });

        // Attach task counts per project
        const projectsWithCounts = await Promise.all(
            projects.map(async (p) => {
                const [todo, inprogress, done] = await Promise.all([
                    Task.countDocuments({ project: p._id, status: 'todo' }),
                    Task.countDocuments({ project: p._id, status: 'inprogress' }),
                    Task.countDocuments({ project: p._id, status: 'done' }),
                ]);
                return {
                    ...p.toObject(),
                    taskCounts: { todo, inprogress, done, total: todo + inprogress + done },
                };
            })
        );

        res.status(200).json({ projects: projectsWithCounts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

/** Get a single project by ID */
export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id)
            .populate('owner', 'name email')
            .populate('members.user', 'name email');
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Verify access
        const userId = req.user.id;
        const isOwner = project.owner._id.toString() === userId;
        const isMember = project.members.some(m => m.user._id.toString() === userId);
        if (!isOwner && !isMember) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json({ project });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

/** Update a project — owner or admin member only */
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const userId = req.user.id;
        const isOwner = project.owner.toString() === userId;
        const memberEntry = project.members.find(m => m.user.toString() === userId);
        const isAdminMember = memberEntry?.role === 'admin';

        if (!isOwner && !isAdminMember) {
            return res.status(403).json({ message: 'Only admins can update this project' });
        }

        if (title) project.title = title.trim();
        if (description !== undefined) project.description = description;
        if (status) project.status = status;
        await project.save();

        res.status(200).json({ project, message: 'Project updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

/** Delete a project — admin/owner only */
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const userId = req.user.id;
        const userRole = req.user.email?.role; // from JWT payload
        const isOwner = project.owner.toString() === userId;
        const memberEntry = project.members.find(m => m.user.toString() === userId);
        const isAdminMember = memberEntry?.role === 'admin';

        if (!isOwner && !isAdminMember) {
            return res.status(403).json({ message: 'Only project admins can delete this project' });
        }

        // Delete associated tasks
        await Task.deleteMany({ project: id });
        await Project.findByIdAndDelete(id);

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

/** Add a member to a project */
export const addMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId: newUserId, role } = req.body;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const isOwner = project.owner.toString() === req.user.id;
        const memberEntry = project.members.find(m => m.user.toString() === req.user.id);
        if (!isOwner && memberEntry?.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can add members' });
        }

        const alreadyMember = project.members.find(m => m.user.toString() === newUserId);
        if (alreadyMember) {
            return res.status(409).json({ message: 'User is already a member' });
        }

        project.members.push({ user: newUserId, role: role || 'member' });
        await project.save();
        res.status(200).json({ message: 'Member added', project });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
