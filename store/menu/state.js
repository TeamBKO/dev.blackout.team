const state = () => ({
  links: [
    { icon: 'mdi-home', title: 'Home', to: '/' },
    { icon: 'mdi-book', title: 'Guides', to: '/guides' },
    { icon: 'mdi-information', title: 'History', to: '/history' },
    {
      icon: 'mdi-information',
      title: 'Community',
      children: [
        { title: 'Discord', to: '/' },
        { title: 'Forum', to: '/' },
        {
          title: 'Social',
          children: [
            { title: 'Youtube', to: '/' },
            { title: 'Twitch', to: '/' },
          ],
        },
        {
          title: 'Twitter',
          children: [
            { title: 'Child 1', to: '/guides' },
            {
              title: 'Community',
              to: '/guides',
              children: [
                { title: 'Descendent 1', to: '/guides' },
                { title: 'Descendent 2', to: '/guides' },
              ],
            },
            { title: 'Child 3', to: '/history' },
          ],
        },
      ],
    },
    { title: 'Rosters', to: '/rosters', conditions: ['loggedIn'] },
    // { icon: "mdi-calendar", title: "Events", to: "/events" }
  ],
});

export default state;
