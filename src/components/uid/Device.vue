<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="10">
      <v-data-table
        :headers="headers"
        :items="dataSourceState"
        :sort-by="['type', 'type']"
        :sort-desc="[false, true]"
        multi-sort
        class="elevation-0"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Fuente de datos </v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
          </v-toolbar>
        </template>
        <template #[`item.device`]="{ item }">
          <span v-if="item.device">
            {{ item.device.uid }}
          </span>
        </template>
        <template #[`item.type`]="{ item }">
          <span v-if="item.device">
            {{ item.device.type }}
          </span>
        </template>
        <template #[`item.application`]="{ item }">
          <span v-if="item.device">
            {{ item.device.model }}
          </span>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    myUid: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'device'
        },
        {
          text: 'Tipo',
          align: 'start',
          sortable: false,
          value: 'type'
        },
        {
          text: 'Aplicación',
          align: 'start',
          sortable: false,
          value: 'application'
        }
      ]
    }
  },

  computed: {
    auth () {
      return this.$store.state.authUser || null
    },

    dataSourceState () {
      return this.$store.state.devices ? this.$store.state.devices.data : []
    }
  },

  methods: {
    nameData (scope) {
      switch (scope) {
        case 'com.google.heart_rate.bpm':
          return 'Ritmo cardiaco'
        case 'com.google.sleep.segment':
          return 'Dormir'
        case 'com.google.step_count.cadence':
          return 'Cadencia de conteo de pasos'
        case 'com.google.step_count.delta':
          return 'Delta de recuento de pasos'
        case 'com.google.calories.expended':
          return 'Calorías quemadas'
        default:
          return 'desconocido'
      }
    }
  }
}
</script>
