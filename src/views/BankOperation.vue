<template>
  <div>
    <h2>
      <slot name="title">Débit / Virement</slot>
    </h2>
    <form @submit.prevent="submitForm">
      <label for="amount">Montant</label>
      <input type="number" id="amount" v-model="amount" required>
      <br>
      <label for="destinataire">Destinataire</label>
      <input type="checkbox" id="destinataire" v-model="isDestinataire">
      <input type="text" id="destinataire-number" v-if="isDestinataire" v-model="destinataireNumber">
      <br>
      <button type="submit">Valider</button>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  data() {
    return {
      amount: '',
      isDestinataire: false,
      destinataireNumber: '',
      successMessage: null,
      errorMessage: null
    }
  },
  computed: {
    ...mapState('bank', ['account']),
  },
  methods: {
    ...mapActions('bank',['createWithdraw','createPayment']),
    async submitForm() {
      try {
        let response
        if (this.isDestinataire) {
          response = await this.createPayment([this.account.accountNumber, this.amount, this.destinataireNumber])
        }else{
          response = await this.createWithdraw([this.account.accountNumber, this.amount]);
        }
        if(response.error !== 0) throw new Error(response.data);
        
        this.successMessage = `L'opération est validée avec le n° : ${response.data.uuid}. Vous pouvez la retrouver dans l'historique`
        setTimeout(() => {
          this.successMessage = null
        }, 5000)
      } catch (error) {
        this.errorMessage = error.message
        setTimeout(() => {
          this.errorMessage = null
        }, 5000)
      }
    }
  }
}
</script>

<style>
.success-message {
  color: green;
  font-size: 14px;
  margin-top: 10px;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
