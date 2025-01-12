<template>
  <div>
    <div class="bank-view">
      <div v-if="isAccountConnected">
        <VerticalMenu :items="[
        {type: 'title', label: 'Opérations'},
        {type: 'link', label: 'Solde', to: '/bank/amount'},
        {type: 'link', label: 'Débit/Virement', to: '/bank/operation'},
        {type: 'title', label: 'États'},
        {type: 'link', label: 'Historique', to: '/bank/history'},
        {type: 'title', label: 'Compte'},
        {type: 'link', label: 'Se déconnecter', to: '/bank/logout'},
      ]">
          <template v-slot:menu-title="{ label }">
            <h2><u><b>{{ label }}</b></u></h2>
          </template>
        </VerticalMenu>
      </div>
      <div v-else>
        <VerticalMenu :items="[
        {type: 'title', label: 'Compte'},
        {type: 'link', label: 'Se connecter', to: '/bank/account'},
      ]">
          <template v-slot:menu-title="{ label }">
            <h2><u><b>{{ label }}</b></u></h2>
          </template>
        </VerticalMenu>
      </div>
      <router-view name="bankmain"></router-view>
    </div>
  </div>
</template>

<script>
import VerticalMenu from '../components/VerticalMenu.vue'
import { mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    isAccountConnected: false,
  }),
  components: { VerticalMenu },
  computed: {
    ...mapState('bank', ['account']),
  },
  methods: {
    ...mapActions('bank', ['getIsAccountValid']),
  },
  watch: {
    account: {
      deep: true, 
      handler(newAccount) {
        if(this.getIsAccountValid(newAccount.accountNumber)){
        this.isAccountConnected = true
        }else this.isAccountConnected = false;
      },
    },
  },
  async mounted() {
    if(await this.getIsAccountValid(this.account.accountNumber)){
      this.isAccountConnected = true
    }else this.isAccountConnected = false;
  },
}
</script>

<style scoped>
.bank-view {
  display: flex;
  flex-direction: row;
  padding: 10px;
  gap: 10px;
}
</style>
