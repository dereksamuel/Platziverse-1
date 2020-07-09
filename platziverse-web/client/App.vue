<template>
  <div style="font-family: 'Cabin', sans-serif;">
    <layout :statusSession="statusSession"></layout>
    <div v-if="statusSession">
      <agent
        v-for="agent in agents"
        :uuid="agent.uuid"
        :key="agent.uuid"
        :socket="socket"
      ></agent>
    </div>
    <div v-if="!statusSession">
      <home class="centered-Home"></home>
    </div>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
const request = require('request-promise-native');
const io = require('socket.io-client');
const Layout = require('./components/Layout.vue');
const Home = require('./components/Home.vue');
const Agent = require('./Agent.vue');
const Metric = require('./Metric.vue');

const socket = io();

module.exports = {
  name: 'App',
  components: {
    Layout,
    Agent,
    Metric,
    Home
  },
  data() {
    return {
      agents: [],
      error: null,
      socket,
      statusSession: false
    }
  },
  mounted () {
    this.initialize()
  },

  methods: {
    async initialize () {
      const options = {
        method: 'GET',
        url: 'http://localhost:5009/agents',
        json: true
      };

      let result;
      try {
        result = await request(options);
      } catch (err) {
        this.error = err.message;
        return;
      };

      this.agents = result;

      socket.on('agent/connected', payload => {
        const { uuid } = payload.agent;
        const existing = this.agents.find(a => a.uuid === uuid);
        if (!existing) {
          this.agents.push(payload.agent);
        };
      });
    }
  }
}
</script>
<style scoped>
.centered-Home {
  justify-content: center;
}
</style>