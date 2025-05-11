//import all component for global use
import SvgIcons from './SvgIcons/index.vue';

const allGlobalComponents = {
  SvgIcons,
};

export default {
  install(app: any) {
    for (const [key, component] of Object.entries(allGlobalComponents)) {
      app.component(key, component);
    }
  },
};