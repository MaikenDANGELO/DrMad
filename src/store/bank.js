import BankService from "../services/bankaccount.service";

export default {
  namespaced: true,
  // state = les données centralisées
  state: () => ({
    shopUser: null,
    accountNumber: '',
    accountAmount: 0,
    accountTransactions: [],
    isAccountValid: false,
  }),
  // mutations = fonctions synchrones pour mettre à jour le state (!!! interdit de modifier directement le state)
  mutations: {
    updateAccountNumber(state, number){
      state.accountNumber = number
    },

    updateAccountAmount(state, amount){
      state.accountAmount = amount
    },
    updateAccountTransactions(state, transactions){
      state.accountTransactions = transactions
    },
    updateIsAccountValid(state, isValid){
      state.isAccountValid = isValid
    },
  },
  // actions = fonctions asynchrone pour mettre à jour le state, en faisant appel aux mutations, via la fonction commit()
  actions: {
    async getAccountAmount({commit}, number){
      console.log('récupération du montant du compte');
      let response = await BankService.getAccountAmount(number)
      if(response.error === 0){
        commit('updateAccountAmount', response.data)
      }else {
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
      let response = await BankService.getIsAccountValid(number);
      if(response.error === 0){
        commit('updateIsAccountValid', response.data);
        commit('updateAccountNumber', number);
      }else{
        commit('updateIsAccountValid', false);
        commit('updateAccountAmount', 0)
        commit('updateAccountTransactions', [])
        console.log(response.data);
      }
    },
    async resetAccountNumber({commit}){
      console.log('reinitialisation du numéro de compte');
      let response = await BankService.resetAccountNumber()
      commit('updateAccountNumber', response.data);
      commit('updateIsAccountValid', false);
      commit('updateAccountAmount', 0)
      commit('updateAccountTransactions', [])
    }
  }
}
