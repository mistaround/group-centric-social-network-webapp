const Tag = require("../model/tag");

// Import validation
const { createTagValidation } = require("../validation/tagValidation");

const createTag = async (tag) => {
  const { error } = createTagValidation(tag);
  if (error) {
    return { error };
  }

  // Check if a tag with same name is already existed
  const tagExisted = await Tag.findOne({ name: tag.name });
  if (tagExisted) {
    return tagExisted;
  }

  // Create a new tag instance
  const newtag = new Tag({
    name: tag.name,
  });

  try {
    const savedTag = await newtag.save();
    return savedTag;
  } catch (err) {
    return { err };
  }
};

module.exports = { createTag };
