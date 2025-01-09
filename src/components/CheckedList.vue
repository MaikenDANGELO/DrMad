<template>
  <div>
    <ul>
      <li v-for="(obj, index) in this.data" :key="obj[fields[0]]">
        <span v-if="itemCheck">
          <input v-bind="checked[index]" @change="updateCheckedItems(index)" type="checkbox">
        </span>
        <span v-for="field in fields" :key="field.id">{{field}}: {{obj[field]}}, </span>
        <div v-if="itemAmount">
          <label :for="'amount'+index">Quantité: </label>
          <input type="number" :max="obj['stock']" :id="'amount'+index" v-model="amounts[index]">
        </div>
        <button v-if="itemButton.show" @click="handleLineButtonClick(index)">{{itemButton.text}}</button><br>
      </li>
    </ul>
    <button v-if="listButton.show" @click="handleListButtonClick()">{{listButton.text}}</button>
  </div>
</template>

<script>
// SOUCIS AVEC LES CASES A COCHER IL FAUT DÉCOCHER APRES LIST BUTTON CLICK !!!!

export default {
  name: 'CheckedList',
  props: {
    data: Array, // les données sources
    fields: Array, // le tableau contenant le nom des champs
    itemCheck: Boolean, // s'il y a des case à cocher
    checked: Array, // le tableau des cases cochées
    itemButton: Object, // l'objet pour les boutons d'items
    listButton: Object, // l'objet pour le bouton de liste
    itemAmount: Boolean,
  },
  data : () => ({
    checkedItems: [],
    amounts: [],
  }),
  watch: {
    data: {
      immediate: true,
      handler(newData){
        this.handleAmounts(newData);
      }
    }
  },
  mounted() {
    this.handleAmounts(this.data);
  },
  methods: {
    handleAmounts(data){
      if(this.itemAmount){
        this.amounts = Array(data.length).fill(0);
      }
    },
    updateCheckedItems(index){
      this.checkedItems = this.checked;
      this.checkedItems[index] = !this.checkedItems[index];
    },
    handleLineButtonClick(index){
      this.$emit('item-button-clicked', index, this.amounts[index]);
    },
    handleListButtonClick(){
      let checkedData = [];
      for(let i = 0; i< this.data.length; i++){
        if(this.checkedItems[i]) {
          checkedData.push([i,this.amounts[i]]);
          this.checkedItems[i] = false;
        }
      }
      this.$emit('list-button-clicked', checkedData);
    }
  }
}
</script>

<style scoped>
</style>