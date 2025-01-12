<template>
  <div>
    <h1>Bank Account</h1>
    <span>Account Number</span><input v-model="accNumber" @keyup="handleAccNumber()">
    <button v-if="accValid" @click="handleLogin(accNumber)">Login</button>
    <button v-else disabled>Login</button>
  </div>
</template>

<script>

import {mapState, mapActions} from 'vuex'
export default {
  name: 'BankAccountView',
  data: () => ({
    accNumber: '',
    accValid: false,
  }),
  computed: {
    ...mapState('bank', ['account']),
    accountNumber : {
      get () {
        return this.$store.state.bank.account.accountNumber;
      },
      set (value) {
        this.$store.commit('updateAccountNumber', value);
      }
    }
  },
  methods: {
    ...mapActions('bank', ['accountLogin', 'getIsAccountValid']),
    async handleLogin(number){
      await this.accountLogin(number)
      this.$router.push('/bank')
    },
    async handleAccNumber(){
      this.accValid = await this.getIsAccountValid(this.accNumber)
        
    }
  },
}
</script>
