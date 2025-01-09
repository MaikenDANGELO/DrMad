<template>
  <div>
    <h1>Bank Account</h1>
    <span>Account Number</span><input v-model="accountNumber" @keyup="getIsAccountValid(accountNumber)">
    <button v-if="isAccountValid" @click="getIsAccountValid(accountNumber),getAccountAmount(accountNumber),getAccountTransactions(accountNumber)">Login</button>
    <button v-else @click="getIsAccountValid(accountNumber),getAccountAmount(accountNumber),getAccountTransactions(accountNumber)" disabled>Login</button>
    <button @click="resetAccountNumber()">Reset</button>
    <p v-if="accountAmount">Solde: {{accountAmount}}€</p>
    <div v-if="accountTransactions">
      <h3>Transactions du compte</h3>
      <ul>
        <li v-for="(transaction,index) in accountTransactions" :key="index">Montant : {{transaction.amount}}€ le {{formatDate(transaction.date["$date"])}}</li>
      </ul>
    </div>
  </div>
</template>

<script>

import {mapState, mapActions} from 'vuex'
export default {
  name: 'BankAccountView',
  data: () => ({
    accNumber: '',
  }),
  computed: {
    ...mapState('bank', ['accountNumber', 'accountAmount', 'accountTransactions', 'isAccountValid']),
    ...mapState('shop', ['shopUser']),
    accountNumber : {
      get () {
        return this.$store.state.accountNumber;
      },
      set (value) {
        this.$store.commit('updateAccountNumber', value);
      }
    }
  },
  methods: {
    ...mapActions('bank', ['getAccountAmount', 'getAccountTransactions', 'getIsAccountValid', 'resetAccountNumber']),
    formatDate(date){
      return new Date(date).toUTCString()
    },
    refuseDisconnectedUsers(){
      if(!this.shopUser) this.$router.push("/shop/login");
    },

  },
  mounted(){
    this.refuseDisconnectedUsers();
  }
}
</script>
