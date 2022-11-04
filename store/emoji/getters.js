const findEmoji = (tag, emoji) => {
  // const emojiList = Object.entries(emoji).reduce((obj, [key, item]) => {
  //   obj = obj.concat(item.emojiList);
  //   return obj;
  // }, []);

  const emojiList = emoji.reduce((obj, item) => {
    obj = obj.concat(item.emojiList);
    return obj;
  }, []);

  const filtered = emojiList.filter((emoji) => emoji.tags.includes(tag));

  // const filtered = emojiList.filter((emoji) => {
  //   return emoji.tags.some((t) => {
  //     const regex = new RegExp(`${t}?`, 'g');
  //     return regex.test(tag);
  //   });
  // });

  return { group: 'Filter', icon: 'mdi-filter', emojiList: filtered };
};

const getters = {
  emoji: (state) => {
    if (!state.tag) return state.emoji;
    return findEmoji(state.tag, state.emoji);
  },
  tag: (state) => state.tag,
};

export default getters;
