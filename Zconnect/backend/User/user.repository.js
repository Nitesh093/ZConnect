const { ObjectId } = require('mongoose').Types;
const User = require('../User/model/userModel');

class UserRepository {
  async createUser(username, email, password, image, verificationToken) {
    try {
      const user = new User({
        username,
        email,
        password,
        verificationToken,
        image
      });

      await user.save();

      // Send email with verificationToken to the user
      // email sending logic
     
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async findUserByUsername(username) {
    try {
      return await User.findOne({ username });
    } catch (error) {
      throw error;
    }
  }

  async findUserByToken(verificationToken) {
    try {
      return await User.findOne({ verificationToken });
    } catch (error) {
      throw error;
    }
  }

  async findUserByTerm(searchTerm, offset, currentUserId,limit = 10, ) {
    try {
      const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive
  
      const filteredUsers = await User.find({
        $and: [
          { $or: [{ username: regex }, { email: regex }] },
          { _id: { $ne: new ObjectId(currentUserId) } }, // Convert to ObjectId
        ],
      })
        .skip(offset * limit)
        .limit(limit)
        .select('-password -verificationToken');
  
      return filteredUsers;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
