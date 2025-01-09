<template>
  <div id="app">
    <NavBar :titles="[{text: 'Acheter', color: 'red'},{text: 'Payer', color: 'blue'},{text: 'Mes Commandes', color: 'blue'},{text: 'Se déconnecter', color: 'green'}]" @menu-clicked="menu_clicked"></NavBar>
    <router-view></router-view>
  </div>

</template>

<script>

import {mapActions} from 'vuex'
import NavBar from "@/components/NavBar.vue";

export default {
  name: 'App',
  components: {NavBar},

  data: () => ({
    //
  }),
  methods: {
    ...mapActions('shop',['getAllViruses', 'shopDisconnect']),
    menu_clicked(x){
      let currentRoute = this.$router.currentRoute.path;
      if(x === 99 && currentRoute !== '/shop/login') this.$router.push('/shop/login')
      else if(x!==3){
        const paths = ['/shop/buy', '/shop/pay/', '/shop/orders']; // à changer pour déconnexion
        const targetPath = paths[x];
        if(targetPath && currentRoute !== targetPath){
          console.log('navigating to '+targetPath)
          this.$router.push(targetPath);
        }
      }else{
        this.shopDisconnect();
        this.$router.push('/shop/login');
      }

    }
  },
  mounted() {
    this.getAllViruses()
  }
};
</script>

<style scoped>
#app{
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  background-color: rgba(180,180,180,0.4);
}
.mainTitle{
  text-align: center;
  margin-top: 15px;
  margin-bottom: auto;
}
</style>