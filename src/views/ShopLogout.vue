<template>
    <div>
        <h1 style="margin: auto;">Déconnexion de la boutique...</h1>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions('shop', ['shopDisconnect'])
    },
    mounted() {
        this.shopDisconnect();
        setTimeout(() => {
            this.$router.push("/");
        }, 1000);
    }
};
</script>
