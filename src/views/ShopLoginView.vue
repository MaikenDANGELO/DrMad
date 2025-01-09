<template>
  <div class="loginContainer">
    <h2>Se connecter</h2>
    <div class="credentials">
      <label for="login">LogIn: </label><input id="login" v-model="login" placeholder="Entrez votre identifiant..." required>
      <label for="passwd">Mot de passe: </label><input type="password" id="passwd" v-model="password" placeholder="Entrez votre mot de passe.." required>
      <button @click="logIn({login, password})">Connexion</button>
    </div>
    <p v-if="shopUser">{{shopUser}}</p>
  </div>

</template>

<script>

import {mapState, mapActions} from 'vuex'
export default {
  name: 'ShopLoginView',
  data: () => ({
    login: '',
    password:'',
  }),
  computed: {
    ...mapState('shop', ['shopUser'])
  },
  methods: {
    ...mapActions('shop', ['shopLogin']),
    async logIn({login, password}){
      await this.shopLogin({login, password})
      if(this.shopUser) {
        await this.$router.push('/shop/buy');
      }
    }
  }
}
</script>

<style scoped>
.loginContainer{
  margin: 3%;
}
.credentials{
  display: flex;
  flex-direction: column;
  gap: 20px;
}
input, button{
  width: 33%;
}
</style>