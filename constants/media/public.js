export default {
  getters: {
    GALLERY_SELECTED: 'media/gallerySelected',
    UPLOAD_SELECTED: 'media/uploadSelected',
    GALLERY_MEDIA: 'media/galleryMedia',
    UPLOAD: 'media/upload',
  },
  mutations: {
    ADD_MEDIA: 'media/addMedia',
    REMOVE_MEDIA: 'media/removeMedia',
    REMOVE_UPLOAD_MEDIA: 'media/removeUploadMedia',
    SET_GALLERY_SELECTED: 'media/setGallerySelected',
    SET_UPLOAD_SELECTED: 'media/setUploadSelected',
    SET_UPLOAD: 'media/setUpload',
  },
  actions: {
    UPLOAD_MEDIA: 'media/uploadMedia',
    REMOVE_MEDIA: 'media/removeMedia',
  },
};
