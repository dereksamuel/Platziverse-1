'use strict';

const Vue = require('vue');
const App = require('./App.vue');
const Agent = require('./Agent.vue');
const Metric = require('./Metric.vue');

Vue.component('agent', Agent);
Vue.component('metric', Metric);

const vm = new Vue({
  el: '#app',
  render (createElement) {
    return createElement(App);
  }
});
