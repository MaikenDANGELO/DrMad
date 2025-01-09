<template>
  <div class="navBar">
    <div class="navTitle">
      <h3><router-link to="/">DrMad</router-link></h3>
    </div>
      <div class="navButtons" v-if="shopUser">
        <button class="navButton" v-for="(title,index) in titles" :key="title.text" @click="handleClick(index)">{{title.text}}</button>
      </div>
      <div class="navButtons" v-else>
        <button class="navButton" @click="handleClick(99)">Se connecter</button>
      </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'NavBar',
  props: { titles: Array },
  computed:{
    ...mapState('shop',['shopUser']),
  },
  methods:{
    handleClick(index) {
      this.$emit('menu-clicked', index);
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navBar{
  display: flex;
  flex-direction: row;
  padding: 10px;
  gap: 25px;
  background-color: rgba(20,20,20,0.7);
}
.navTitle{
  font-size: 20px;
  position: absolute;
  bottom: 92.5vh;
  left: 25px;

}
.navTitle a{
  color: white;
  text-decoration: none;
}
.navTitle:hover{
  transition: 0.1s linear;
  transform: scale(1.05);
}
.navButtons{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  margin: auto;
  gap: 10px;
}
.navButton{
  border: 1px solid darkgreen;
  border-radius: 5px;
  background-color: rgba(35,150,60,1);
  padding: 10px;
  width: 150px;
  font-size: 14px;
  color: white;
}

.navButton:hover{
  cursor: grab;
  transition: 0.1s linear;
  transform: scale(1.05);
  box-shadow: 0px 0px 10px darkgreen;
}
</style>