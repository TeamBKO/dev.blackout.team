import { marked } from 'marked';

const renderer = {
  image: function (href, title, text) {
    return marked.Renderer.prototype.link.call(this, href, title, text);
  },
  paragraph: function (text) {
    return text;
  },
};

const m = marked.setOptions({
  gfm: true,
  breaks: true,
});

m.use({ renderer });

export default m;
