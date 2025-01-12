<template>
  <div class="bank-history">
    <h2>
      <slot name="title">Opérations passées</slot>
    </h2>
    <div>
      <input type="checkbox" id="filter-period" v-model="filterByPeriod" />
      <label for="filter-period">Filtrer par période</label>
      <div v-if="filterByPeriod">
        <div>
          <label for="start-date">Du</label>
          <input type="date" id="start-date" v-model="startDate" @change="validateDates" />
        </div>
        <div>
          <label for="end-date">Au</label>
          <input type="date" id="end-date" v-model="endDate" @change="validateDates" />
        </div>
      </div>
    </div>
    <DataTable :items="filteredTransactions" :headers="headers" :itemCheck="true" :itemButton="true" :tableButton="true"
      @itemClicked="showTransactionDetails" @tableClicked="showSelectedTransactionDetails">
      <template v-slot:itemButton="{ item }">
        <button @click="showTransactionDetails(item)">Détails</button>
      </template>
      <template v-slot:tableButton="{items}">
        <button @click="showSelectedTransactionDetails(items)">Voir</button>
      </template>

    </DataTable>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'BankHistory',
  components: {
    DataTable
  },
  data() {
    return {
      filterByPeriod: false,
      startDate: '',
      endDate: '',
      errorMessage: '',
      headers: [
        { label: 'Montant', name: 'amount' },
        { label: 'Date', name: 'date' },
      ]
    };
  },
  computed: {
    ...mapState('bank', ['account']),
    filteredTransactions() {
      return this.account.accountTransactions
        .filter(transaction => {
          const transactionDate = new Date(transaction.date.$date);
          if (this.filterByPeriod) {
            if (this.startDate && this.endDate) {
              return transactionDate >= new Date(this.startDate) && transactionDate <= new Date(this.endDate);
            } else if (this.startDate) {
              return transactionDate >= new Date(this.startDate);
            } else if (this.endDate) {
              return transactionDate <= new Date(this.endDate);
            }
          }
          return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  async mounted() {
    await this.getAccountTransactions(this.account.accountNumber)
  },
  methods: {
    ...mapActions('bank', [
      'getAccountAmount',
      'getAccountTransactions',
      'getIsAccountValid'
    ]),
    validateDates() {
      if (this.startDate && this.endDate && new Date(this.endDate) < new Date(this.startDate)) {
        this.startDate = '';
        this.endDate = '';
        this.errorMessage = 'La date de début doit être antérieure à la date de fin.';
      }
    },
    showTransactionDetails(item) {

      alert(`UUID de la transaction : ${item.uuid}`);
    },
    showSelectedTransactionDetails(items) {
      console.log(items)
      if (!Array.isArray(items) || items.length === 0) {
        alert('Aucune transaction sélectionnée.');
        return;
      }

      const uuids = items.filter(item => item && item.uuid).map(item => item.uuid).join(', ');
      if (uuids) {
        alert(`UUID des transactions sélectionnées : ${uuids}`);
      } else {
        alert('Aucune transaction valide sélectionnée.');
      }
    }
  }
};
</script>

<style scoped>
.bank-history {
  margin: 20px;
}

.error-message {
  color: red;
}
</style>
