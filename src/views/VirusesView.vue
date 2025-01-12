<template>
  <div class="shop">
    <div class="virusShop">
      <h1>Catalogue</h1>
      <p>sous forme de liste avec certains champs</p>
      <label for="showfilters">Voir les filtres: </label>
      <input type="checkbox" v-model="showFilters" id="showfilters"><br><br>
      <div v-if="showFilters">
        <label for="filterprice">Prix inférieur à </label>
        <input v-model="priceFilter" id="filterprice"><br>
        <label for="filtername">Rechercher: </label>
        <input v-model="nameFilter" id="filtername"><br>
        <label for="stockfilter">En stock: </label>
        <input type="checkbox" v-model="stockFilter" id="stockfilter">
        <CheckedList :data="filterViruses" :fields="['name', 'price']" :itemCheck="true"
          :item-button="{ show: true, text: 'Détails' }" :list-button="{ show: true, text: 'Détails de la séléction' }"
          :checked="getCheckedViruses(filterViruses)" @item-button-clicked="handleLineButtonClick"
          @list-button-clicked="handleListButtonClick"></CheckedList>
      </div>
      <div v-else>
        <CheckedList :data="this.viruses" :fields="['name', 'price']" :itemCheck="true"
          :item-button="{ show: true, text: 'Détails' }" :list-button="{ show: true, text: 'Détails de la séléction' }"
          :checked="getCheckedViruses(this.viruses)" @item-button-clicked="handleLineButtonClick"
          @list-button-clicked="handleListButtonClick"></CheckedList>
      </div>
    </div>
    <div class="shopCart">
      <h1>Votre panier maléfique</h1>
        <div class="cartItems">
          <div class="cartItem" v-for="(obj, ind) of cartItems" :key="obj['_id']">
            <p>{{ obj["name"] }} x{{ cartItemsAmount[ind] }} : {{ obj["price"]*cartItemsAmount[ind] }}€</p>
          </div>
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
    ...mapActions('shop', ['getAllViruses', 'shopLogin']),
    filter,
    refuseDisconnectedUsers(){
      if(!this.shopUser) this.$router.push("/shop/login");
    },
    handleLineButtonClick(viruses, index) {
      let virus = viruses[index];
      let s = `nom: ${virus.name}, prix: ${virus.price}, stock: ${virus.stock}, en vente: ${(virus.sold ? "oui" : "non")}`;
      alert(s);
    },
    handleListButtonClick(list) {
      let s = "";
      for (let i = 0; i < list.length; i++) {
        let virus = list[i];
        s += `nom: ${virus.name}, prix: ${virus.price}, stock: ${virus.stock}, en vente: ${(virus.sold ? "oui" : "non")}\n`;
      }
      alert(s);
    }
  },
  components: { CheckedList },
  data: () => ({
    showFilters: false,
    priceFilter: 0,
    nameFilter: "",
    stockFilter: false,
    cartItems: [],
    cartItemsAmount: [],
  }),
  mounted(){
    this.refuseDisconnectedUsers();
  },
  computed: {
    ...mapState('shop', ['viruses', 'shopUser']),
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
  margin-right: auto;
  display: flex;
  flex-direction: row;
  gap: 20%;
}
</style>
