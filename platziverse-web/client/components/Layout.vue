<template>
  <div>
    <nav class="navbar">
      <a class="navbar-brand" href="#">
        <img class="navbar-brand-logo" src="https://static.platzi.com/media/tmp/class-files/github/platziverse/platziverse-38-presentacion-frontend-vue/platziverse-web/public/images/platziverse.png" width="-webkit-fill-available" alt="Logo">
      </a>
      <a class="navbar-brand">
        <button id="login" type="button" class="btn btn-warning" data-toggle="modal" data-target="#exampleModal">{{ statusSession ? 'Session' : 'Login' }}</button>
      </a>
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ statusSession ? 'Session' : 'Login' }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <button type="button" class="btn btn-danger" id="exampleModalLabel"><a href="http://localhost:5009/auth/google-oauth">Sign in with google</a> <img style="width: 56px;" src="https://i.pinimg.com/originals/c3/a2/6c/c3a26c0c8b6110d2e232e72c79c1ba68.jpg" alt="google"></button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    </nav>
  </div>
</template>

<script>
module.exports = {
  props: ['statusSession']
}
</script>

<style scoped>
  .navbar {
    background: linear-gradient(to right, rgb(152,202,63), #ff7a22);
    box-shadow: 0px 19px 24px 0 rgba(130, 130, 130, 0.29);
  }
  .navbar-brand-logo {
    border-radius: 50px;
  }
</style>