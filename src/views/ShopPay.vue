<template>
    <div class="payer">
        <h1>Payer la commande</h1>
        <label for="order-id">ID de la commande: </label>
        <input id="order-id" type="text" v-model="orderID" style="width: 300px;">
        <button @click="handlePayOrder()">Payer la commande</button>
    </div>
</template>

<script>
import shopService from '@/services/shop.service';
import { mapState } from 'vuex';

export default {
    data: () => ({
        orderID: "",
    }),
    computed: {
        ...mapState('shop', ['shopUser'])
    },
    methods: {
        async handlePayOrder(){
            let response = await shopService.payOrder(this.shopUser, this.orderID);
            if(response.error === 0)
            {
                console.log(response.data)
                this.$router.push("/shop/orders")
            }
        },
        refuseDisconnectedUsers(){
        if(!this.shopUser) this.$router.push("/shop/login");
      },
    },
    async mounted(){
        this.refuseDisconnectedUsers();
        let p = this.$route.params.orderId
        if(p) this.orderID = p;
    }
}
</script>

<style scoped>
.payer{
    margin-left: 5%;
}
</style>