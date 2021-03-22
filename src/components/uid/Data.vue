<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="3">
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="dateStarFormatted"
            label="Inicio"
            persistent-hint
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            @blur="dateStart = parseDate(dateStarFormatted)"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="dateStart" no-title @input="menu1 = false" />
      </v-menu>
    </v-col>

    <v-col cols="12" sm="8" md="3">
      <v-menu
        ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="dateEndFormatted"
            label="Fin"
            persistent-hint
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            @blur="dateEnd = parseDate(dateEndFormatted)"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="dateEnd" no-title @input="menu2 = false" />
      </v-menu>
    </v-col>

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
          {{ formatDateTable(item.dateStart) }}
        </template>

        <template #[`item.dateEnd`]="{ item }">
          {{ formatDateTable(item.dateEnd) }}
        </template>

        <template #[`item.heartRate`]="{ item }">
          <div
            v-if="item.heartRate"
            :class="`${item.heartRate.state}`"
            class="py-1 text-center"
          >
            {{ redondear(item.heartRate.value || 0) }}
          </div>
        </template>
        <template #[`item.calories`]="{ item }">
          <div
            v-if="item.calories"
            :class="`${item.calories.state}`"
            class="py-1 text-center"
          >
            {{ redondear(item.calories.value || 0) }}
          </div>
        </template>
        <template #[`item.steps`]="{ item }">
          <div
            v-if="item.steps"
            :class="`${item.steps.state}`"
            class="py-1 text-center"
          >
            {{ redondear(item.steps.value || 0) }}
          </div>
        </template>

        <template #[`item.sleep`]="{ item }">
          <div
            v-if="item.sleep"
            :class="`${item.sleep.state}`"
            class="py-1 text-center"
          >
            {{ redondear(item.sleep.value || 0) }}
          </div>
        </template>

        <template #[`item.deepSleep`]="{ item }">
          <div
            v-if="item.deepSleep"
            :class="`${item.deepSleep.state}`"
            class="py-1 text-center"
          >
            {{ redondear(item.deepSleep.value || 0) }}
          </div>
        </template>

        <template #[`item.mood`]="{ item }">
          <div
            v-if="item.mood"
            :class="`${item.mood.state}`"
            class="py-1 text-center"
          >
            {{ redondear(item.mood.value || 0) }}
          </div>
        </template>

        <template #[`item.fisica`]="{ item }">
          <span v-if="item.heartRate && item.calories && item.steps">
            {{
              redondear(
                0.5 * findState(item.heartRate.state).value +
                  0.17 * findState(item.steps.state).value +
                  0.33 * findState(item.calories.state).value
              )
            }}
          </span>
        </template>

        <template #[`item.mental`]="{ item }">
          <span v-if="item.heartRate && item.calories && item.steps">
            {{
              redondear(
                0.5 * findState(item.heartRate.state).value +
                  0.17 * findState(item.steps.state).value +
                  0.33 * findState(item.calories.state).value
              )
            }}
          </span>
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

    <div v-if="false">
      <div>dataSetSleep {{ dataSetSleep.length }}</div>
      <div v-for="(item, index) in dataSetSleep" :key="index">
        <div class="card">
          item {{ item.point }}
        </div>
      </div>
    </div>
  </v-row>
</template>
<script>
export default {
  data: vm => ({
    dateStart: '',
    dateStarFormatted: '',
    dateEnd: '',
    dateEndFormatted: '',
    menu1: false,
    menu2: false,

    headers: [
      {
        text: 'Fecha Inicio',
        align: 'start',
        sortable: false,
        value: 'dateStart'
      },
      {
        text: 'Fecha Fin',
        align: 'start',
        sortable: false,
        value: 'dateEnd'
      },
      {
        text: 'Frecuencia cardiaca',
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
        text: 'Sueño',
        align: 'start',
        sortable: true,
        value: 'sleep'
      },
      {
        text: 'Sueño profundo',
        align: 'start',
        sortable: true,
        value: 'deepSleep'
      },
      {
        text: 'Estado de animo',
        align: 'start',
        sortable: true,
        value: 'mood'
      },
      {
        text: 'Salud física',
        align: 'start',
        sortable: true,
        value: 'fisica'
      },
      {
        text: 'Salud mental',
        align: 'start',
        sortable: true,
        value: 'mental'
      }
    ],
    start: 0,
    end: 0
  }),

  computed: {
    auth () {
      return this.$store.state.authUser || null
    },

    dataSetSleep () {
      return this.$store.state.dataSet.filter(
        s => s.dataTypeName === 'com.google.sleep.segment'
      )
    },

    dataSet () {
      const tt = []
      const dateStartTime = new Date(this.dateStart).getTime()
      const dateEndTime = new Date(this.dateEnd).getTime()
      const dd = (dateEndTime - dateStartTime) / 86400000
      let start = dateStartTime

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
            ),
            sleep: dd.find(
              t => t.dataTypeName === 'com.google.sleep.segment'
            ),
            deepSleep: dd.find(
              t => t.dataTypeName === 'app.web.hear-my-health.sleep.deep'
            ),
            mood: dd.find(
              t => t.dataTypeName === 'app.web.hear-my-health.mood.segment'
            )
          }
          start = dateEnd
          tt.push(ee)
        }
      }
      return tt
    }
  },

  watch: {
    dateStart (val) {
      this.dateStarFormatted = this.formatDate(this.dateStart)
    },
    dateEnd (val) {
      this.dateEndFormatted = this.formatDate(this.dateEnd)
    }
  },

  created () {
    const date = new Date()
    this.dateEnd = date.toISOString().substr(0, 10)
    this.dateEndFormatted = this.formatDate(date.toISOString().substr(0, 10))

    date.setDate(date.getDate() - 7)
    this.dateStart = date.toISOString().substr(0, 10)
    this.dateStarFormatted = this.formatDate(date.toISOString().substr(0, 10))
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
    findState (key) {
      const state = [
        {
          key: 'green',
          value: 1,
          percentaje: 100
        },
        {
          key: 'yellow',
          value: 0.5,
          percentaje: 100
        },
        {
          key: 'red',
          value: 0,
          percentaje: 100
        },
        {
          key: 'not',
          value: -0.01,
          percentaje: 100
        }
      ]
      return state.find(e => e.key === key)
    },

    redondear (num) {
      return Math.round(num * 100) / 100
    },

    formatDateTable (item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10)
      return ss
    },

    formatDate (date) {
      if (!date) {
        return null
      }

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) {
        return null
      }

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },

    nameData (scope) {
      switch (scope) {
        case 'com.google.heart_rate.bpm':
          return 'Ritmo cardiaco'
        case 'com.google.step_count.cadence':
          return 'Cadencia de conteo de pasos'
        case 'com.google.step_count.delta':
          return 'Delta de recuento de pasos'
        case 'com.google.calories.expended':
          return 'Calorías quemadas'
        case 'com.google.sleep.segment':
          return 'Sueño'
        case 'app.web.hear-my-health.sleep.deep':
          return 'Sueño profundo'
        case 'app.web.hear-my-health.mood.segment':
          return 'Estado de animo'
        default:
          return 'desconocido'
      }
    }
  }
}
</script>
