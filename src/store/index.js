import Vue from "vue";
import Vuex from "vuex";

import bank from "./bank";
import shop from "./shop";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    bank,
    shop,
  },
});