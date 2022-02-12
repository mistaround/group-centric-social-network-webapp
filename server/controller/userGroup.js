const UserGroup = require("../model/userGroup");

// Import validation
const {
  createUserGroupValidation,
} = require("../validation/userGroupValidation");

const createUserGroup = async (data) => {
  const { err } = createUserGroupValidation(data);
  if (err) {
    return { err };
  }

  // Check if a userId - groupId pair is already existed
  const userGroupPairExisted = await UserGroup.find({
    $and: [{ userId: data.userId }, { groupId: data.groupId }],
  });
  if (userGroupPairExisted.length !== 0) {
    return { err: "User already in the group" };
  }

  // Create a new user group pair instance
  const newUserGroupPair = new UserGroup({
    groupId: data.groupId,
    userId: data.userId,
  });

  try {
    const savedUserGroup = await newUserGroupPair.save();
    return savedUserGroup;
    // eslint-disable-next-line no-shadow
  } catch (err) {
    return { err };
  }
};

module.exports = { createUserGroup };
