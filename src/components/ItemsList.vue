<template>
    <div class="shop">
      <div class="virusShop">
        <h1>Catalogue</h1>
        <label for="showfilters">Activer filtres: </label>
        <input type="checkbox" v-model="showFilters" id="showfilters"><br><br>
        <div v-if="showFilters">
          <label for="filterprice">Prix inférieur à </label>
          <input v-model="priceFilter" id="filterprice"><br>
          <label for="filtername">Rechercher: </label>
          <input v-model="nameFilter" id="filtername"><br>
          <label for="stockfilter">En stock: </label>
          <input type="checkbox" v-model="stockFilter" id="stockfilter">
          <CheckedList :data="filterViruses" :fields="['name', 'price', 'promotion']" :itemCheck="true"
            :item-button="{ show: true, text: 'Ajouter au panier' }" :list-button="{ show: true, text: 'Tout ajouter au panier' }"
            :checked="getCheckedViruses(filterViruses)" @item-button-clicked="handleLineButtonClick"
            @list-button-clicked="handleListButtonClick" :item-amount="true"></CheckedList>
        </div>
        <div v-else>
          <CheckedList :data="this.viruses" :fields="['name', 'price', 'promotion']" :itemCheck="true"
            :item-button="{ show: true, text: 'Ajouter au panier' }" :list-button="{ show: true, text: 'Tout ajouter au panier' }"
            :checked="getCheckedViruses(this.viruses)" @item-button-clicked="handleLineButtonClick"
            @list-button-clicked="handleListButtonClick" :item-amount="true"></CheckedList>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  import { mapActions, mapState } from 'vuex'
  import CheckedList from "@/components/CheckedList.vue";
  import { filter } from "core-js/internals/array-iteration";
  export default {
    name: 'VirusesView',
    methods: {
      ...mapActions('shop', ['getAllViruses', 'shopLogin', 'fetchUserCart', 'addItemUserCart']),
      filter,
      refuseDisconnectedUsers(){
        if(!this.shopUser) this.$router.push("/shop/login");
      },
      async handleLineButtonClick(index, quantity) {
        await this.addItemUserCart([this.viruses,this.userCart,index, quantity, this.shopUser]);
      },
      async handleListButtonClick(list) {
        for (let i = 0; i < list.length; i++) {
          await this.addItemUserCart([this.viruses,this.userCart,list[i][0], list[i][1], this.shopUser]);
        }
        // pb avec ça, il faut que ça décoche les virus séléctionnés !
      }
    },
    components: { CheckedList },
    data: () => ({
      showFilters: false,
      priceFilter: 0,
      nameFilter: "",
      stockFilter: false,
    }),
    computed: {
      ...mapState('shop', ['viruses', 'shopUser', 'userCart']),
      filterVirusesByPrice() {
        let x = parseInt(this.priceFilter)
        if (isNaN(x)) return [];
        if (x > 0) return this.viruses.filter(v => v.price < this.priceFilter)
        return this.viruses
      },
      filterVirusesByName() {
        if (this.nameFilter !== "") return this.viruses.filter(v => v.name.includes(this.nameFilter))
        return this.viruses
      },
      filterVirusesByStock() {
        if (this.stockFilter) return this.viruses.filter(v => v.stock > 0);
        return this.viruses
      },
      filterViruses() {
        let vPrice = this.filterVirusesByPrice
        let vName = this.filterVirusesByName
        let vFilter = this.filterVirusesByStock
        return (vPrice.filter(v => vName.includes(v))).filter(v => vFilter.includes(v));
      },
      getCheckedViruses() {
        return (viruses) => {
          let checked = []
          for (let i = 0; i < viruses.length; i++) {
            checked.push(false);
          }
          return checked;
        }
      }
    }
  
  }
  </script>
  
  <style scoped>
  .shop{
    margin-left: 5%;
    margin-right: 5%;
    display: flex;
    flex-direction: row;
    max-width: 50%;
  }
  </style>
  