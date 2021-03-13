<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="10">
      <v-data-table
        :headers="headers"
        :items="dataSourceState"
        :sort-by="['type', 'type']"
        :sort-desc="[false, true]"
        multi-sort
        class="elevation-1"
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
  layout: 'dashboard',

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

        /*         {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'uid'
        },
        {
          text: 'Nombre',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Rol',
          align: 'start',
          sortable: false,
          value: 'role'
        },
        { text: 'Acciones', value: 'actions' } */
      ]
    }
  },

  async fetch ({ store }) {
    try {
      await store.dispatch('getDevices')
    } catch (e) {
      return 'error'
    }
  },

  computed: {
    auth () {
      return this.$store.state.authUser || null
    },

    dataSourceState () {
      return this.$store.state.devices.data
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getDevices')
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
