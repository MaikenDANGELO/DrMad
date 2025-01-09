<template>
    <div class="shop">
        <ItemsList></ItemsList>
        <BasketList></BasketList>
    </div>
</template>

<script>
import BasketList from '@/components/BasketList.vue';
import ItemsList from '@/components/ItemsList.vue';
import { mapActions,mapState } from 'vuex';

export default {
    components: {
        ItemsList,
        BasketList,
    },
    computed: {
        ...mapState('shop', ['shopUser']),
    },
    methods: {
        ...mapActions('shop',['fetchUserCart','getAllViruses']),
        refuseDisconnectedUsers(){
        if(!this.shopUser) this.$router.push("/shop/login");
      },
    },
    mounted(){
      this.refuseDisconnectedUsers();
      this.fetchUserCart(this.shopUser);
      this.getAllViruses();
    },
}
</script>

<style scoped>
.shop{
    display: flex;
    flex-direction: row;
}
</style>