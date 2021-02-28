<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="10" md="10">
      <v-data-table
        :headers="headers"
        :items="dataSet"
        :sort-by="['dataTypeName', 'type']"
        :sort-desc="[true, true]"
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
        <template #[`item.dateStart`]="{ item }">
          {{ formatDate(item.dateStart) }}
        </template>

        <template #[`item.dateEnd`]="{ item }">
          {{ formatDate(item.dateEnd) }}
        </template>

        <template #[`item.heartRate`]="{ item }">
          {{ redondear(item.heartRate.value || 0) }} -
          {{ item.heartRate.state || "" }}
        </template>
        <template #[`item.calories`]="{ item }">
          {{ redondear(item.calories.value || 0) }} -
          {{ item.calories.state || "" }}
        </template>
        <template #[`item.steps`]="{ item }">
          {{ redondear(item.steps.value || 0) }} -
          {{ item.steps.state || "" }}
        </template>
        <template #[`item.fisica`]="{ item }">
          {{
            redondear(
              0.5 * item.heartRate.value +
                0.17 * item.steps.value +
                0.33 * item.calories.value
            )
          }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            color="black"
            elevation="0"
            outlined
            raised
            :to="`/back/${item.uid}`"
          >
            Ver

            <v-icon small class="mr-2">
              mdi-arrow-right
            </v-icon>
          </v-btn>
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
          text: 'Fecha Fin',
          align: 'start',
          sortable: false,
          value: 'dateStart'
        },
        {
          text: 'Fecha Inicio',
          align: 'start',
          sortable: false,
          value: 'dateEnd'
        },
        {
          text: 'Hear rate',
          align: 'start',
          sortable: true,
          value: 'heartRate'
        },
        {
          text: 'Calorias',
          align: 'start',
          sortable: true,
          value: 'calories'
        },
        {
          text: 'Pasos',
          align: 'start',
          sortable: true,
          value: 'steps'
        },
        {
          text: 'Salud física',
          align: 'start',
          sortable: true,
          value: 'fisica'
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
      ],
      start: 0,
      end: 0
    }
  },

  computed: {
    auth () {
      return this.$store.state.authUser || null
    },

    dataSet () {
      const tt = []
      const dd = (this.end - this.start) / 86400000
      let start = this.start

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(dd); index++) {
          const dateEnd = start + 86400000
          const dd = this.$store.state.dataSet.filter(
            s => s.startTimeMillis >= start && s.endTimeMillis <= dateEnd
          )
          const ee = {
            dateStart: start,
            dateEnd,
            heartRate: dd.find(
              t => t.dataTypeName === 'com.google.heart_rate.bpm'
            ),
            calories: dd.find(
              t => t.dataTypeName === 'com.google.calories.expended'
            ),
            steps: dd.find(
              t => t.dataTypeName === 'com.google.step_count.delta'
            )
          }
          start = dateEnd
          tt.push(ee)
        }
      }
      return tt
    }
  },

  created () {
    const startTime = '2021-02-20T00:00:00.000Z'
    this.start = new Date(startTime).getTime()
    this.end = new Date().getTime()
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getDataSet', { uid: authUser.uid })
    }
  },

  methods: {
    redondear (num) {
      return Math.round(num * 100) / 100
    },
    formatDate (item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10)
      return ss
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
