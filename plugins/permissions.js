export const VIEW_ALL_ADMIN = 'view:all:admin';
export const VIEW_ALL_USERS = 'view:all:users';
export const VIEW_ALL_ROLES = 'view:all:roles';
export const VIEW_ALL_CATEGORIES = 'view:all:categories';
export const VIEW_ALL_FORMS = 'view:all:forms';
export const VIEW_ALL_EVENTS = 'view:all:events';
export const VIEW_ALL_MEDIA = 'view:all:media';
export const VIEW_ALL_SETTINGS = 'view:all:settings';
export const VIEW_ALL_TAGS = 'view:all:tags';

export const ADD_ALL_USERS = 'add:all:users';
export const ADD_ALL_ROLES = 'add:all:roles';
export const ADD_ALL_CATEGORIES = 'add:all:categories';
export const ADD_ALL_FORMS = 'add:all:forms';
export const ADD_ALL_EVENTS = 'add:all:events';
export const ADD_ALL_MEDIA = 'add:all:media';
export const ADD_ALL_TAGS = 'add:all:tags';

export const UPDATE_ALL_USERS = 'update:all:users';
export const UPDATE_ALL_ROLES = 'update:all:roles';
export const UPDATE_ALL_CATEGORIES = 'update:all:categories';
export const UPDATE_ALL_FORMS = 'update:all:forms';
export const UPDATE_ALL_EVENTS = 'update:all:events';
export const UPDATE_ALL_MEDIA = 'update:all:media';
export const UPDATE_ALL_SETTINGS = 'update:all:settings';
export const UPDATE_ALL_TAGS = 'update:all:tags';

export const DELETE_ALL_USERS = 'delete:all:users';
export const DELETE_ALL_ROLES = 'delete:all:roles';
export const DELETE_ALL_CATEGORIES = 'delete:all:categories';
export const DELETE_ALL_FORMS = 'delete:all:forms';
export const DELETE_ALL_EVENTS = 'delete:all:events';
export const DELETE_ALL_MEDIA = 'delete:all:media';
export const DELETE_ALL_TAGS = 'delete:all:tags';

/** OWN */
export const VIEW_OWN_FORMS = 'view:own:forms';
export const VIEW_OWN_EVENTS = 'view:own:events';
export const VIEW_OWN_MEDIA = 'view:own:media';

export const ADD_OWN_FORMS = 'add:own:forms';
export const ADD_OWN_EVENTS = 'add:own:events';
export const ADD_OWN_MEDIA = 'add:own:media';

export const UPDATE_OWN_FORMS = 'update:own:forms';
export const UPDATE_OWN_EVENTS = 'update:own:events';
export const UPDATE_OWN_MEDIA = 'update:own:media';

export const DELETE_OWN_FORMS = 'delete:own:forms';
export const DELETE_OWN_EVENTS = 'delete:own:events';
export const DELETE_OWN_MEDIA = 'delete:own:media';

export default function ({ app }, inject) {
  inject('permissions', {
    VIEW_ALL_ADMIN,
    VIEW_ALL_USERS,
    VIEW_ALL_ROLES,
    VIEW_ALL_CATEGORIES,
    VIEW_ALL_FORMS,
    VIEW_ALL_EVENTS,
    VIEW_ALL_MEDIA,
    VIEW_ALL_SETTINGS,
    VIEW_ALL_TAGS,
    ADD_ALL_USERS,
    ADD_ALL_ROLES,
    ADD_ALL_CATEGORIES,
    ADD_ALL_FORMS,
    ADD_ALL_EVENTS,
    ADD_ALL_MEDIA,
    ADD_ALL_TAGS,
    UPDATE_ALL_USERS,
    UPDATE_ALL_ROLES,
    UPDATE_ALL_CATEGORIES,
    UPDATE_ALL_FORMS,
    UPDATE_ALL_EVENTS,
    UPDATE_ALL_MEDIA,
    UPDATE_ALL_SETTINGS,
    UPDATE_ALL_TAGS,
    DELETE_ALL_USERS,
    DELETE_ALL_ROLES,
    DELETE_ALL_CATEGORIES,
    DELETE_ALL_FORMS,
    DELETE_ALL_EVENTS,
    DELETE_ALL_MEDIA,
    DELETE_ALL_TAGS,
    VIEW_OWN_FORMS,
    VIEW_OWN_EVENTS,
    VIEW_OWN_MEDIA,
    ADD_OWN_FORMS,
    ADD_OWN_EVENTS,
    ADD_OWN_MEDIA,
    UPDATE_OWN_FORMS,
    UPDATE_OWN_EVENTS,
    UPDATE_OWN_MEDIA,
    DELETE_OWN_FORMS,
    DELETE_OWN_EVENTS,
    DELETE_OWN_MEDIA,
  });
}
