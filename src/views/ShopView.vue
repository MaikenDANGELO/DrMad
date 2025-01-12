<template>
    <div>
        <NavBar v-if="shopUser" :links="[{label: 'Acheter', to: '/shop/buy'},{label: 'Payer', to: '/shop/pay'},{label: 'Mes Commandes', to: '/shop/orders'},{label: 'Se déconnecter', to: '/shop/logout'}]"></NavBar>
        <NavBar v-else :links="[{label: 'Se connecter', to: '/shop/login'}]"></NavBar>
        <router-view name="shopmain"></router-view>
    </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import {mapState} from "vuex"


export default {
    components: {NavBar},
    computed: {
        ...mapState('shop', ['shopUser']),
    }
}
</script>