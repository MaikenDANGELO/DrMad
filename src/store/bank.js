import BankService from "../services/bankaccount.service";

export default {
  namespaced: true,
  // state = les données centralisées
  state: () => ({
    account: {
      accountNumber: '',
      accountAmount: 0,
      accountTransactions: [],
    },
    transactions: [],
    isAccountValid: false,
  }),
  // mutations = fonctions synchrones pour mettre à jour le state (!!! interdit de modifier directement le state)
  mutations: {
    updateAccountNumber(state, number){
      state.account.accountNumber = number
    },
    updateIsAccountValid(state, valid){
      state.isAccountValid = valid
    },
    updateAccountAmount(state, amount){
      state.account.accountAmount = amount
    },
    updateAccountTransactions(state, transactions){
      state.account.accountTransactions = transactions
    },
    updateTransactions(state, transaction) {
      state.transactions.push(transaction)
    },
    updateAccount(state, acc){
      state.account = acc
    }
  },
  // actions = fonctions asynchrone pour mettre à jour le state, en faisant appel aux mutations, via la fonction commit()
  actions: {
    async accountLogin({commit}, number){
    commit('updateAccountNumber', number);

    let response = await BankService.getAccountAmount(number)
      if(response.error === 0){
        commit('updateAccountAmount', response.data)
      }else {
        console.log(response.data)
      }

      response = await BankService.getAccountTransactions(number)
      if(response.error === 0){
        commit('updateAccountTransactions', response.data)
      }else {
        console.log(response.data)
      }
    },
    async accountLogout({commit}){
      let acc = {account: {
        accountNumber: '',
        accountAmount: 0,
        accountTransactions: [],
      }
    }
      commit('updateAccount', acc.account)
    },
    async getAccountAmount({commit}, number){
      console.log('récupération du montant du compte');
      let response = await BankService.getAccountAmount(number)
      if(response.error === 0){
        commit('updateAccountAmount', response.data)
      }else {
        console.log(response.data)
      }
    },
    async getAccount(_o, number) {
      console.log('récupération du compte')
      let response = await BankService.getAccount(number)
      if (response.error === 0) {
        return response.data
      } else {
        console.log(response.data)
      }
    },
    async getAccountTransactions({commit}, number){
      console.log('récupération des transactions du compte');
      let response = await BankService.getAccountTransactions(number)
      if(response.error === 0){
        commit('updateAccountTransactions', response.data)
      }else {
        console.log(response.data)
      }
    },
    async getIsAccountValid({commit}, number){
      console.log('validation du compte');
      if(!number) return false
      let response = await BankService.getIsAccountValid(number);
      if(response.error === 0){
        commit('updateIsAccountValid', response.data)
        return response.data
      }else{
        return false
      }
    },
    async resetAccountNumber({commit}){
      console.log('reinitialisation du numéro de compte');
      let response = await BankService.resetAccountNumber()
      commit('updateAccountNumber', response.data);
      commit('updateIsAccountValid', false);
      commit('updateAccountAmount', 0)
      commit('updateAccountTransactions', [])
    },
    async createPayment(_o, payload){
      console.log('création d\'un paiement');
      let response = await BankService.createPayment(payload[0], payload[1], payload[2])
      console.log(response.data)
      return response
    },
    async createWithdraw(_o, payload){
      console.log('création d\'un débit');
      let response = await BankService.createWithdraw(payload[0], payload[1])
      console.log(response.data)
      return response
    },
    async getTransactions({commit}, number){
      console.log('récupération des transactions');
      let response = await BankService.getTransactions(number)
      if(response.error === 0){
        commit('updateTransactions', response.data)
      }else {
        console.log(response.data)
      }
    },
  }
}
