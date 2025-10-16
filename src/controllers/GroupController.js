import { GroupService } from '../services/GroupService.js';

export class GroupController {
  constructor() {
    this.groupService = new GroupService();
  }

  create = async (req, res) => {
    try {
      const { name, description } = req.body;
      const owner = req.user?.id;
      const group = await this.groupService.createGroup({ name, description, owner });

      res.status(201).json({ success: true, message: 'Group created successfully!', group });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAll = async (req, res) => {
    try {
      const groups = await this.groupService.getAllGroups();
      res.status(200).json({ success: true, groups });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  join = async (req, res) => {
    try {
      const userId = req.user?.id;
      const group = await this.groupService.joinGroup(req.params.id, userId);
      res.status(200).json({ success: true, message: 'Joined group successfully!', group });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  leave = async (req, res) => {
    try {
      const userId = req.user?.id;
      const group = await this.groupService.leaveGroup(req.params.id, userId);
      res.status(200).json({ success: true, message: 'Left group successfully!', group });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req, res) => {
    try {
      const userId = req.user?.id;
      const updatedGroup = await this.groupService.updateGroup(req.params.id, userId, req.body);
      res.status(200).json({ success: true, group: updatedGroup });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req, res) => {
    try {
      const userId = req.user?.id;
      await this.groupService.deleteGroup(req.params.id, userId);
      res.status(200).json({ success: true, message: 'Group deleted successfully!' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
