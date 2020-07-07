<template>
  <div style="font-family: 'Cabin', sans-serif;">
    <layout></layout>
    <agent uuid="d33aeb8e-0420-46c3-9b23-8faee4cb90b0" :socket="socket"></agent>
    <agent
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid"
    ></agent>
    <metric uuid="d33aeb8e-0420-46c3-9b23-8faee4cb90b0" type="rss" :socket="socket"></metric>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
const io = require('socket.io-client');
const Layout = require('./components/Layout.vue');
const Agent = require('./Agent.vue');
const Metric = require('./Metric.vue');

const socket = io();

module.exports = {
  name: 'App',
  components: {
    Layout,
    Agent,
    Metric
  },
  data() {
    return {
      agents: [],
      error: null,
      socket
    }
  },
  mounted () {
    this.initialize()
  },

  methods: {
    initialize () {
    }
  }
}
</script>