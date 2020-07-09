<template>
  <div class="home">
    <div class="home_countainer-img">
      <img src="https://images.vexels.com/media/users/3/152639/isolated/lists/506b575739e90613428cdb399175e2c8-dibujos-animados-de-astronauta-espacial.png" alt="home img" class="img-notFound">
    </div>
    <div>
      <h1>Login to see the agents</h1>
    </div>
  </div>
</template>

<style scoped>
  .home {
    display: flex;
    align-items: center;
  }
  .img-notFound {
    animation: movementImg 10s infinite;
    width: 148px;
  }
  @keyframes movementImg{
    100% {
      transform: translateY(-25%);
    }100% {
      transform: translateY(25%);
    }
  }
</style>