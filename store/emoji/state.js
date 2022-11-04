import people from '~/components/discord/emoji/people.json';
import nature from '~/components/discord/emoji/nature.json';
import food from '~/components/discord/emoji/food.json';
import symbols from '~/components/discord/emoji/symbols.json';
import flags from '~/components/discord/emoji/flags.json';
import travel from '~/components/discord/emoji/travel.json';
import activities from '~/components/discord/emoji/activities.json';
import objects from '~/components/discord/emoji/objects.json';

const state = () => ({
  emoji: [people, nature, food, activities, travel, objects, symbols, flags],
  // emoji: {
  //   custom: {
  //     group: '',
  //     icon: '',
  //     emojiList: [],
  //   },
  //   people,
  //   nature,
  //   food,
  //   objects,
  //   travel,
  //   activities,
  //   symbols,
  //   flags,
  // },

  tag: '',
});

export default state;
