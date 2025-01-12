<template>
    <div>
        <h1 style="margin: auto;">Déconnexion de la banque...</h1>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions('bank', ['accountLogout'])
    },
    mounted() {
        this.accountLogout();
        setTimeout(() => {
            this.$router.push("/");
        }, 1000);
    }
};
</script>
