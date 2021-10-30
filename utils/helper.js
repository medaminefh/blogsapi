const mergeById = (a1, a2) =>
  a1.map((itm) => ({
    ...a2.find((item) => item.blogId === itm._id && item),
    ...itm,
  }));

module.exports = { mergeById };
