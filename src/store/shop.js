import ShopService from '../services/shop.service'

export default {
  namespaced: true,
  // state = les données centralisées
  state: () => ({
    shopUser: null,
    viruses: [],
    userCart: new Map(),
  }),
  // mutations = fonctions synchrones pour mettre à jour le state (!!! interdit de modifier directement le state)
  mutations: {
    updateViruses(state, viruses) {
      state.viruses = viruses
    },
    updateShopUser(state, user) {
        state.shopUser = user
    },
    fetchUserCart(state, cart){
      state.userCart = new Map(cart)
    },
    fetchUserOrders(state, orders){
      state.shopUser.orders = orders;
    }
  },
  // actions = fonctions asynchrone pour mettre à jour le state, en faisant appel aux mutations, via la fonction commit()
  actions: {
    async fetchUserOrders({commit}, user){
      console.log("récupération des commandes utilisateur");
      let response = await ShopService.getUserOrders(user);
      if(response.error === 0){
        commit("fetchUserOrders", response.data);
      }else{
        console.log(response.data)
      }
    },
    async shopLogin({commit}, data) {
        console.log('login');
        let response = await ShopService.shopLogin(data)
        if (response.error === 0) {
        commit('updateShopUser', response.data)
        }
        else {
        console.log(response.data)
        }
    },
    async shopDisconnect({commit}){
      commit('updateShopUser',null);
    },
    async getAllViruses({commit}) {
      console.log('récupération des viruses');
      let response = await ShopService.getAllViruses()
      if (response.error === 0) {
        commit('updateViruses', response.data)
      }
      else {
        console.log(response.data)
      }
    },
    async fetchUserCart({commit}, user){
      console.log('récupération du panier de l\'utilisateur')
      let response = await ShopService.getUserCart(user);
      if(response.error === 0){
        commit('fetchUserCart', response.data);
      }else{
        console.log(response.data)
      }
    },
    async saveUserCart({commit},data){
      let cart = data[0];
      let user = data[1];
      commit("fetchUserCart", cart);
      console.log("enregistrement du panier de l'utilisateur dans la bdd locale")
      let response = await ShopService.updateUserCart(cart, user)
      console.log(response.data)
    },
    async addItemUserCart({commit},data){
      let viruses = data[0];
      let cart = data[1];
      let index = data[2];
      let quantity = data[3];
      let user = data[4];
      let virus = viruses[index];

      if(quantity !== 0 && user){
        if(cart.has(virus.name)){
          cart.set(virus.name, cart.get(virus.name)+parseInt(quantity));
            if(cart.get(virus.name) > virus["stock"]){
              cart.set(virus.name, virus["stock"]);
            }
        }else{
          cart.set(virus.name, parseInt(quantity));
        }
      }
      commit('fetchUserCart', cart);
      ShopService.updateUserCart(cart, user);
    },
    async removeItemUserCart({ commit }, data) {
      let viruses = data[0];
      let cart = data[1];
      let index = data[2];
      let user = data[3];
    
      let entriesArray = Array.from(cart.entries());
      let [key] = entriesArray[index];
    
      let virus = viruses.find(e => e.name === key);
    
      if (cart.has(key)) {
        console.log("virus " + virus.name +" supprimé du panier");
        cart.delete(key);
        commit('fetchUserCart', cart);
        ShopService.updateUserCart(cart, user);
      }
    },
    async clearUserCart({commit}, data){
      console.log("suppression du panier")
      let cart = data[0];
      let user = data[1];
      cart.clear();
      commit('fetchUserCart', cart);
      ShopService.updateUserCart(cart, user);
    },
    async passOrder({commit}, data){
      console.log("passage de commande");
      let cart = data[1];
      let user = data[0];
      if(cart.size > 0){
        let response = await ShopService.passOrder(cart,user);
        if(response.error === 0){
          cart.clear();
          commit('fetchUserCart', cart);
          ShopService.updateUserCart(cart, user);
          return response.data
        }else {
          console.log(response.data)
        }
      }
    }
  }
}
