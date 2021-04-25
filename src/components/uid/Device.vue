<template>
  <v-container>
    <v-row class="pl-5" justify="start" align="center">
      Paciente: {{ user.name }}
    </v-row>
    <br>
    <br>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="10">
        <v-data-table
          :headers="headers"
          :items="uniqueDevices"
          multi-sort
          class="elevation-0"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Dispositivos </v-toolbar-title>
              <v-divider class="mx-4" inset vertical />
              <v-spacer />
            </v-toolbar>
          </template>
          <template>
            <span>
              {{ uniqueDevices.type }}
            </span>
          </template>
          <template>
            <span>
              {{ uniqueDevices.model }}
            </span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
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
      uid: this.$props.myUid,
      uniqueDevices: [],
      headers: [
        {
          text: 'Dispositivo',
          align: 'start',
          sortable: false,
          value: 'type'
        },
        {
          text: 'Modelo',
          align: 'start',
          sortable: false,
          value: 'model'
        }
      ]
    }
  },

  async fetch ({ store }) {
    try {
      await store.dispatch('getDevices', { uid: this.uid })
      await store.dispatch('getUser', { uid: this.uid })
    } catch (e) {
      return 'error'
    }
  },

  computed: {
    auth () {
      return this.$store.state.authUser || null
    },

    user () {
      return this.$store.state.user
    },

    dataSourceState () {
      return this.$store.state.devices ? this.$store.state.devices.data : []
    }
  },

  watch: {
    dataSourceState () {
      if (this.dataSourceState) {
        this.setUniqueDevices()
      }
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getDevices', { uid: this.uid })
    }
  },

  methods: {
    setUniqueDevices () {
      const modelNames = this.dataSourceState.map((e) => {
        return e.device.model
      })
      const models = this.dataSourceState.map((e) => {
        const c = []
        c.uid = e.device.uid
        c.type =
          e.device.type === 'phone'
            ? 'Smartband'
            : e.device.type === 'watch'
              ? 'Smartwatch'
              : 'Otro dispositivo'
        c.model =
          e.device.model === 'Redmi Note 8'
            ? 'Mi Band'
            : e.device.model === 'iphone'
              ? 'Mi Band'
              : e.device.model
        return c
      })
      const v = []
      for (let i = 0; i < models.length; i++) {
        // eslint-disable-next-line no-empty
        if (v.some(e => e.model === modelNames[i])) {
        } else {
          v.push(models[i])
        }
      }
      this.uniqueDevices = v
    },
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
