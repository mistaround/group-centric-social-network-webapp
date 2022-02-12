const GroupTag = require("../model/groupTag");

// Import validation
const {
  createGroupTagValidation,
} = require("../validation/groupTagValidation");

const createGroupTag = async (data) => {
  const { error } = createGroupTagValidation(data);
  if (error) {
    return { error };
  }

  // Check if a tagId - groupId pair is already existed
  const tagGroupPairExisted = await GroupTag.find({
    $and: [{ tagId: data.tagId }, { groupId: data.groupId }],
  });
  if (tagGroupPairExisted.length !== 0) {
    return tagGroupPairExisted;
  }

  // Create a new tag instance
  const newGroupTag = new GroupTag({
    groupId: data.groupId,
    tagId: data.tagId,
  });

  try {
    const savedGroupTag = await newGroupTag.save();
    return savedGroupTag;
  } catch (err) {
    return { err };
  }
};

module.exports = { createGroupTag };
