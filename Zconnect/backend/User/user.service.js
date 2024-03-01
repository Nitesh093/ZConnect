const UserRepository = require('./user.repository');

class UserService {
    async searchUserByTerm(searchTerm, offset ,currentUserId) {
    const filteredUsers = await UserRepository.findUserByTerm(searchTerm,offset,currentUserId);
    return filteredUsers;
  }
}

module.exports = new UserService();
