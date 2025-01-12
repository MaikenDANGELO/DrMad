<template>
  <div>
    <h1>Solde du compte</h1>
    <h2 :class="{ 'red': account.accountAmount < 0, 'green': account.accountAmount >= 0 }">{{ account.accountAmount.toFixed(2) + ' €' }}</h2>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'BankAmount',
  computed: {
    ...mapState('bank', ['account'])
  },
  methods: {
    ...mapActions('bank', ['getAccountAmount'])
  },
  async mounted(){
    await this.getAccountAmount(this.account.accountNumber)
  }
}
</script>

<style scoped>
div {
  text-align: center;
  margin-top: 50px;
}
.red {
  color: red;
}
.green {
  color: green;
}
</style>
