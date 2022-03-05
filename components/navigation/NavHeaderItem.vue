<script>
import {
  VSpacer,
  VList,
  VTab,
  VIcon,
  VMenu,
  VListItem,
  VListItemIcon,
  VListItemContent,
  VListItemGroup,
} from 'vuetify/lib';

import { nanoid } from 'nanoid';
import throttle from 'lodash/throttle';

export default {
  name: 'NavigationLink',

  components: {
    VSpacer,
    VList,
    VTab,
    VIcon,
    VMenu,
    VListItem,
    VListItemIcon,
    VListItemContent,
    VListItemGroup,
  },

  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator: (val) => {
        const valid = ['horizontal', 'vertical'];
        return valid.includes(val);
      },
    },
    link: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      menuId: `menu-${nanoid()}`,
      menuOpen: false,
      childTransition: 'scroll-x-reverse-transition',
    };
  },

  mounted() {
    if (typeof window === undefined) return;
    window.addEventListener('resize', this.throttled());
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.throttled());
  },

  methods: {
    closeAllMenusOnResize() {
      this.$refs.menu.save('');
    },

    throttled() {
      return throttle(function () {
        if (this.menuOpen) {
          this.$refs.menu.save();
        }
      }, 150).bind(this);
    },

    genMenu(children, element, child, opts, _props, ref, menuId) {
      const scopedSlots = {
        activator: ({ on }) => {
          const options = Object.assign({}, opts, { on: on });
          return this.$createElement(element, options, child);
        },
      };

      const defaultProps = {
        'offset-y': true,
        'content-class': this.contentClass,
        bottom: true,
      };

      const on = {
        input: (v) => {
          this.$emit('input', v);
          this.menuOpen = v;
        },
      };

      const props = Object.assign({}, defaultProps, _props);

      const menuOptions = { scopedSlots, on, props };

      const menuList = children.map((link) => this.genMenuItem(link, ref));

      if (ref) {
        menuOptions.ref = ref;
        // menuOptions.props.attach = ref;
      }

      return this.$createElement('v-menu', menuOptions, [
        this.$createElement('v-list', {}, [menuList]),
      ]);
    },

    genMenuItem(link, ref) {
      const props = { nuxt: true, exact: true };

      const hasChildren =
        link.hasOwnProperty('children') &&
        link.children &&
        link.children.length;

      if (link.to) Object.assign(props, { to: link.to });

      if (hasChildren) {
        const menuProps = {
          'offset-y': false,
          'offset-x': true,
          'close-on-content-click': true,
          // attach: this.$refs[ref],
          transition: this.childTransition,
          bottom: false,
          top: true,
          right: true,
        };

        return this.genMenu(
          link.children,
          'v-list-item',
          [
            this.$createElement('v-list-item-content', {}, [
              this.$createElement(
                'v-list-item-title',
                { staticClass: 'd-flex' },
                [
                  link.title,
                  this.$createElement('v-spacer', {}, []),
                  this.genIcon('mdi-chevron-right'),
                ]
              ),
            ]),
          ],
          {},
          menuProps
        );
      }

      const nativeOn = { click: () => this.$refs.menu.save('') };

      return this.$createElement('v-list-item', { props, nativeOn }, [
        this.$createElement('v-list-item-content', {}, [
          this.$createElement('v-list-item-title', {}, link.title),
        ]),
      ]);
    },

    genMobileMenu(children, title) {
      const scopedSlots = {
        activator: ({ on }) =>
          this.$createElement('v-list-item-content', { on: on }, [
            this.$createElement('v-list-item-title'),
            {},
            [title],
          ]),
      };
    },

    genIcon(icon, opts = {}) {
      const props = Object.assign({}, opts, { right: false, small: true });
      return this.$createElement('v-icon', { props }, icon);
    },

    genHorizontalLink() {
      const props = {
        nuxt: true,
        // exact: true,
        to: this.link.to,
      };

      const classes = [this.menuId];

      const icon = !this.menuOpen ? 'mdi-chevron-down' : 'mdi-chevron-up';

      return this.hasChildren
        ? this.genMenu(
            this.link.children,
            'div',
            [this.link.title, this.genIcon(icon)],
            {
              staticClass: 'v-tab',
            },
            { 'content-class': this.menuId },
            'menu'
          )
        : this.$createElement('v-tab', { props, class: classes }, [
            this.link.title,
          ]);
    },
  },

  render(h) {
    return this.genHorizontalLink();
  },

  computed: {
    hasChildren() {
      return (
        this.link.hasOwnProperty('children') &&
        Array.isArray(this.link.children) &&
        this.link.children.length > 0
      );
    },

    contentClass() {
      return ['nav-item-top', 'hidden-sm-and-down'].join(' ');
    },
  },
};
</script>
<style scoped>
.nav-item-top {
  top: 80px !important;
}
</style>
