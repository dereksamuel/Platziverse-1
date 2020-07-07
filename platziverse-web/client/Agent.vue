<template>
  <div class="agent">
    <section class="card" id="agent_info">
      <div class="card-header">
        <h2 class="agent_info-title"><span style="color: black; font-weight: 100;">{{name}}</span> <span style="font-weight: 100;">({{pid}})</span></h2>
      </div>
      <div class="card-body">
        <p class="agent_info-hostname">{{hostname}}</p>
        <div style="display: flex;">
          <p class="agent_info-status">Connected: </p>
          <div :class="connected ? 'circle_status-green' : 'circle_status-red'"></div>
        </div>
        <button type="button" class="btn btn-outline-warning btn-block" data-toggle="modal" data-target="#staticBackdrop" @click="toggleMetrics">Toggle Metrics</button>
        <div v-show="showMetrics">
          <hr>
          <h3 class="metrics-title">Metrics</h3>
          <hr>
          <metrics
            :uuid="uuid"
            :socket="socket"
            v-for="metric in metrics"
            :key="metric.type"
            :type="metric.type"
          ></metrics>
        </div>
      </div>
    </section>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
const Metrics = require('./Metric.vue');
const request = require('request-promise-native');

module.exports = {
  props: [ 'uuid', 'socket' ],
  name: 'Agent',
  components: {
    Metrics
  },
  data () {
    return {
      name: null,
      pid: null,
      hostname: null,
      showMetrics: false,
      connected: false,
    }
  },

  mounted() {
    this.initialize();
  },

  methods: {
    async initialize() {
      const { uuid } = this;

      const options = {
        method: 'GET',
        url: `http://localhost:5009/agent/${uuid}`,
        json: true
      };

      let agent;
      try {
        console.log('dentro de try');
        agent = await request(options);
      } catch (err) {
        this.error = err.message;
        return;
      };

      this.name = agent.name;
      console.log(agent);
      this.hostname = agent.hostname;
      this.connected = agent.connected;
      this.pid = agent.pid;
      this.loadMetrics();
    },
    async loadMetrics() {
      const { uuid } = this;

      const options = {
        methods: 'GET',
        url: `http://localhost:5009/metrics/${uuid}`,
        json: true
      };

      let metrics;
      try {
        metrics = await request(options);
      } catch (err) {
        this.error = err.message;
        return;
      };

      this.metrics = metrics;
    },
    toggleMetrics () {
      this.showMetrics = this.showMetrics ? false : true;
    }
  }
}
</script>

<style scoped>
#agent_info {
  margin: 45px;
  font-size: 19px;
}
.agent_info-title {
  color: #48b03b;
  font-weight: bold;
}
.circle_status-green {
  width: 20px;
  height: 20px;
  border: 4px solid #868686;
  border-style: inset;
  background-color: #99ff00;
  border-radius: 50%;
  margin: 3px;
  margin-left: 10px;
}
.circle_status-red {
  width: 20px;
  height: 20px;
  border: 4px solid #868686;
  border-style: inset;
  background-color: #ff0000fc;
  border-radius: 50%;
  margin: 3px;
  margin-left: 10px;
}

.metrics-title {
  text-align: center;
  font-size: 28px;
  letter-spacing: 1px;
  font-weight: bold;
}
</style>