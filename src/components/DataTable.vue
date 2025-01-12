<template>
  <div class="data-table">
    <table>
      <thead>
        <tr>
          <th v-if="itemCheck">Select</th>
          <th v-for="header in headers" :key="header.name">{{ header.label }}</th>
          <th v-if="itemButton">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td v-if="itemCheck">
            <input type="checkbox" v-model="selectedItems" :value="item" />
          </td>
          <td v-for="header in headers" :key="header.name">
            <p v-if="(header.label==='Date')">{{ item[header.name].$date }}</p>
            <p v-else>{{ item[header.name] }}</p>
          </td>
          <td v-if="itemButton">
            <slot name="itemButton" :item="item">
              <button @click="emitItemClicked(item)">Action</button>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="tableButton">
      <slot name="tableButton">
        <button @click="emitTableClicked(this.selectedItems)">Submit</button>
      </slot>
    </div>
  </div>
</template>


<script>
export default {
  name: 'DataTable',
  props: {
    items: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    itemCheck: {
      type: Boolean,
      default: false
    },
    itemButton: {
      type: Boolean,
      default: false
    },
    tableButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedItems: []
    };
  },
  methods: {
    emitItemClicked(item) {
      this.$emit('itemClicked', item);
    },
    emitTableClicked(items) {
      this.$emit('tableClicked', items);
    }
  }
};
</script>

<style scoped>
.data-table {
  width: 100%;
  margin: 20px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>
