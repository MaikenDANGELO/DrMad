<template>
    <div>
        <h1>Commandes</h1>
        <ul class="commandes">
            <li class="commande" v-for="order of shopUser.orders" :key="order.uuid">
                <hr style="width: 500px;">
                <span>Articles: </span>
                <span v-for="item of order.items" :key="item.item.name">{{ item.item.name }} x{{ item.amount }} ({{ item.amount*item.item.price }}€), </span>
                <br><span>Total: {{ order.total }}€  </span>
                <br><span>Date d'achat: {{ order.date }}</span>
                <br><span>Status: {{ order.status }}</span>
                <div v-if="order.status==='waiting_payment'">
                    <button style="margin:1%;" @click="handleCancelOrder(order.uuid)">Annuler la commande</button>
                    <button @click="$router.push('/shop/pay/'+order.uuid)">Payer la commande</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import shopService from '@/services/shop.service';
import { mapActions, mapState } from 'vuex';

export default {
    data: () => ({
        
    }),
    computed: {
        ...mapState('shop', ['shopUser']),
        
    },
    methods: {
        ...mapActions('shop', ['fetchUserOrders']),
        refuseDisconnectedUsers(){
        if(!this.shopUser) this.$router.push("/shop/login");
      },
      async handleCancelOrder(uuid){
        await shopService.cancelOrder(this.shopUser, uuid);
        this.fetchUserOrders(this.shopUser)
      }
    },
    mounted(){
        this.refuseDisconnectedUsers();
        if(this.shopUser !== null) this.fetchUserOrders(this.shopUser);
    },
    watch: {
    userOrders: {
      handler() {
        this.fetchUserOrders(this.shopUser);
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style scoped>
.commandes{
    margin-left: 5%;
    width: 500px;
}
</style>