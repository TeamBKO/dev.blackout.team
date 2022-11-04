const urlPattern =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const isURL = (v) => (v && urlPattern.test(v)) || 'Must contain a valid url.';

const isNumber = (v) => {
  const parsed = parseInt(v, 10);
  return (
    (typeof parsed === 'number' && isFinite(parsed)) ||
    'Server id must be a number.'
  );
};

const state = () => ({
  showVideo: {
    type: 'boolean',
    group: 'video',
    title: 'Show video',
    description: 'Show or hide the video on the index page.',
    value: true,
  },
  showVideoOnMobile: {
    type: 'boolean',
    group: 'video',
    title: 'Show video on mobile',
    description: 'Show or hide the index page video on mobile.',
    value: true,
  },
  frontPageVideoUrl: {
    type: 'string',
    rules: [isURL],
    group: 'video',
    title: 'Video URL',
    description: 'Sets the url for the front page video url.',
    value: 'https://blackout-gaming.s3.amazonaws.com/video/0001-0876.webm',
  },
  showTestimonies: {
    type: 'boolean',
    group: 'standard',
    title: 'Show Testimonies',
    description: 'Show short text blobs of our victims for funnsies.',
    value: true,
  },
  showRecruitmentButton: {
    type: 'boolean',
    group: 'standard',
    title: 'Show recruitment button',
    description:
      'Enables/disables recruitment button on front page and in header. Enables/disables recruitment forms.',
    value: true,
  },
  enableUserRegistration: {
    type: 'boolean',
    group: 'authenticate',
    title: 'Enable user registration',
    description: 'Enables/disables user account creation',
    value: true,
  },
  enableUserAuthentication: {
    type: 'boolean',
    group: 'authenticate',
    title: 'Enable user authentication',
    description: 'Enables/disables all-encompasing user authentication.',
    value: true,
  },
  enableSocialAuthentication: {
    type: 'boolean',
    group: 'authenticate',
    title: 'Enable social authentication',
    description:
      'Enables/disables social authentication through 3rd party services like discord.',
    value: true,
    dependsOn: {
      group: 'authenticate',
      name: 'enableUserAuthentication',
      value: true,
    },
  },
  enableLocalAuthentication: {
    type: 'boolean',
    group: 'authenticate',
    title: 'Enable local authentication',
    description: 'Enables/disables local authentication and registeration.',
    value: false,
    dependsOn: {
      group: 'authenticate',
      name: 'enableUserAuthentication',
      value: true,
    },
  },
  timeTillNextUsernameChange: {
    type: 'integer',
    selected: 'week',
    selectOptions: ['hour', 'day', 'week', 'month'],
    group: 'account',
    title: 'Time till next username change',
    description:
      'Sets how long a user has to wait before they can change their username again.',
    value: 1,
  },
  requireAccountVerification: {
    type: 'boolean',
    group: 'account',
    title: 'Require account verification',
    description:
      'Require all newly made accounts to require additional verification through email.',
    value: true,
  },
  allowUsersToDeleteAccount: {
    type: 'boolean',
    group: 'account',
    title: 'Allow users to delete own account',
    description: 'Allows users to delete their own account.',
    value: false,
  },
  enableAccountMediaSharing: {
    type: 'boolean',
    group: 'account',
    title: 'Enable account media sharing',
    description: 'Allows users to share media amongst other accounts.',
    value: true,
  },
  universalRequestTtlInMinutes: {
    type: 'integer',
    min: 0,
    max: 10,
    group: 'account',
    title: 'Universal request TTL (in minutes)',
    description:
      'Sets how long a grace period between requests for user side operations like password update/reset, account deletion and contact changes.\n Entering a modest amount of time prevents abuse and throttles the number of emails that have to be dispatched.',
    value: 10,
  },
  enableBot: {
    type: 'boolean',
    group: 'discord',
    title: 'Enable bot',
    description: 'Enable the discord bot.',
    value: false,
  },
  botServerId: {
    type: 'string',
    rules: [isNumber],
    group: 'discord',
    title: 'Server ID',
    description:
      'The guild/server id for the bot. This is required for role and user look ups.',
    value: '',
  },
  botPrefix: {
    type: 'string',
    rules: [],
    group: 'discord',
    title: 'Bot prefix',
    description: 'Set the prefix the bot uses for commands.',
    value: '!',
  },
  cacheTTL: {
    type: 'integer',
    group: 'cache',
    title: 'Cache TTL',
    description:
      'Sets how long items should be cached in memory before expiring in seconds.',
    value: 120,
  },
  cacheUsersOnFetch: {
    type: 'boolean',
    group: 'cache',
    title: 'Cache users on fetch',
    description: 'Enable/Disable caching on users all fetch',
    value: true,
  },
  cacheRolessOnFetch: {
    type: 'boolean',
    group: 'cache',
    title: 'Cache roles on fetch',
    description: 'Enable/Disable caching on roles all fetch',
    value: true,
  },
  cacheFormsOnFetch: {
    type: 'boolean',
    group: 'cache',
    title: 'Cache forms on fetch',
    description: 'Enable/Disable caching on forms all fetch',
    value: true,
  },
  cacheCategoriesOnFetch: {
    type: 'boolean',
    group: 'cache',
    title: 'Cache categories on fetch',
    description: 'Enable/Disable caching on categories all fetch',
    value: true,
  },
  cacheTagsOnFetch: {
    type: 'boolean',
    group: 'cache',
    title: 'Cache tags on fetch',
    description: 'Enable/Disable caching on tags all fetch',
    value: true,
  },
  cacheRostersOnFetch: {
    type: 'boolean',
    group: 'cache',
    title: 'Cache rosters on fetch',
    description: 'Enable/Disable caching on rosters all fetch',
    value: true,
  },
});

export default state;
