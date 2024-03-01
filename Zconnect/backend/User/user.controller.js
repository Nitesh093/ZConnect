const userService = require('./user.service');

class UserController {
  async searchUser(req, res) {
    const searchTerm = req.query['search-user'];
    const offset = parseInt(req.query.offset) || 0;
    const currentUserId =req.user.userId;
    

    if (!searchTerm) {
      return res.status(400).json({ error: 'Bad Request - Invalid search query or missing parameters' });
    }
    

    const result =  await userService.searchUserByTerm(searchTerm, offset ,currentUserId);
    

    return res.status(200).json({ result });
  }
}

module.exports = new UserController();
