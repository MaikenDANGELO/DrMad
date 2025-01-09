<template>
    <div class="shopCart">
        <h1>Votre panier maléfique</h1>
        <CheckedList :data="cartInfo" :fields="['name', 'amount', 'price']" :itemCheck="true"
            :item-button="{ show: true, text: 'Supprimer du panier' }" :list-button="{ show: true, text: 'Tout supprimer du panier' }"
            :checked="getCheckedCartItems(cartInfo)" @item-button-clicked="handleLineButtonClick"
            @list-button-clicked="handleListButtonClick" :item-amount="false"></CheckedList>
            <button @click="handlePassOrder()">Passer la Commande</button>
      </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CheckedList from './CheckedList.vue';

export default {
  data: () => ({
    cartInfo: [], 
    checkedCartItems: [],
  }),
  components: {
    CheckedList,
  },
  computed: {
    ...mapState('shop', ['shopUser', 'userCart', 'viruses']),
  },
  watch: {
    userCart: {
      handler() {
        this.updateCartInfo();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions('shop', ['fetchUserCart', 'getAllViruses', 'removeItemUserCart', 'clearUserCart', 'addItemUserCart','passOrder']),
    getVirusFromKey(key) {
      return this.viruses.find(e => e.name === key);
    },
    updateCartInfo() {
      let cart = [];
      for (let [key, value] of this.userCart.entries()) {
        const virus = this.getVirusFromKey(key);
        if (virus) {
          cart.push({
            name: key,
            amount: value,
            price: virus.price * value,
          });
        }
      }
      this.cartInfo = cart;
      this.checkedCartItems = this.getCheckedCartItems(this.cartInfo);
    },
    getCheckedCartItems(items) {
      let checked = [];
      for (let i = 0; i < items.length; i++) {
        checked.push(false);
      }
      return checked;
    },
    async handleLineButtonClick(index) {
      await this.removeItemUserCart([this.viruses, this.userCart, index, this.shopUser]).then(() => {
        this.updateCartInfo();
      });
    },
    async handleListButtonClick(list) {
      if (list != null) {
        await this.clearUserCart([this.userCart, this.shopUser]).then(() => {
          this.updateCartInfo();
        });
      }
    },
    async handlePassOrder() {
      let response = await this.passOrder([this.shopUser, this.userCart]);
      const regexExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (typeof response === 'string' && regexExp.test(response)) {
        this.$router.push("/shop/pay/" + response);
      }
    }
  },
  mounted() {
    this.updateCartInfo();
  },
};
</script>
