<template>
  <div class="vertical-menu">
    <div v-for="(item, index) in items" :key="index">
      <template v-if="item.type === 'title'">
        <slot name="menu-title" :label="item.label">{{ item.label }}</slot>
      </template>
      <template v-else-if="item.type === 'link'">
        <span @click="goTo(item.to)">
          <slot name="menu-link" :label="item.label">
            <button>{{ item.label }}</button>
          </slot>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalMenu',
  props: { items: Array },
  methods: {
    goTo(dest) {
      if(this.$route.path !== dest) this.$router.push(dest);
    }
  }
}
</script>

<style scoped>
.vertical-menu {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  background-color: rgba(20,20,20,0.7);
}

button {
  border: 1px solid darkgreen;
  border-radius: 5px;
  background-color: rgba(35,150,60,1);
  padding: 10px;
  width: 150px;
  font-size: 14px;
  color: white;
}

button:hover {
  cursor: grab;
  transition: 0.1s linear;
  transform: scale(1.05);
  box-shadow: 0px 0px 10px darkgreen;
}
</style>
