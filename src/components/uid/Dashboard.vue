<template>
  <v-container>
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
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" sm="12" md="4" justify="center" align="center">
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="15"
          :value="50"
          color="dataPhysicalHealth < 30 ? #51ff00:  #ffbe0a"
        >
          {{ dataPhysicalHealth }}
        </v-progress-circular>
      </v-col>
      <v-col
        v-if="dataMood.length > 0"
        cols="12"
        sm="12"
        md="8"
        justify="center"
        align="center"
      >
        <line-chart :chart-data="dataMood" :options="chartOptions" label="Mood" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from '~/components/uid/charts/LineChart'

export default {
  components: {
    LineChart
  },
  props: ['myUid'],
  /*   data: (vm) => ({ */
  data () {
    return {
      uid: this.$props.myUid,
      dateStart: '',
      dateStarFormatted: '',
      dateEnd: '',
      dateEndFormatted: '',
      menu1: false,
      menu2: false,
      start: 0,
      end: 0,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  /*   }), */

  computed: {
    auth () {
      return this.$store.state.authUser || null
    },

    dataPhysicalHealth () {
      const avgPhysical = []
      const dateStartTimePyshical = new Date(this.dateStart).getTime()
      const dateEndTimePyshical = new Date(this.dateEnd).getTime()
      const ddPyshical =
        (dateEndTimePyshical - dateStartTimePyshical) / 86400000
      let start = dateStartTimePyshical

      if (this.$store.state.dataSet.length > 0) {
        for (let index = 1; index <= Math.floor(ddPyshical); index++) {
          const dateEndPyshical = start + 86400000
          const ddPyshical = this.$store.state.dataSet.filter(
            s =>
              s.startTimeMillis >= start && s.endTimeMillis <= dateEndPyshical
          )
          const heartRateTemp = ddPyshical.filter(
            s => s.dataTypeName === 'com.google.heart_rate.bpm'
          )
          const stepsTemp = ddPyshical.filter(
            s => s.dataTypeName === 'com.google.step_count.delta'
          )
          const caloriesTemp = ddPyshical.filter(
            s => s.dataTypeName === 'com.google.calories.expended'
          )

          const hr = heartRateTemp.map((e) => {
            return e.value !== null || e.value !== undefined
              ? Math.round(e.value)
              : 0
          })
          const st = stepsTemp.map((e) => {
            return e.value !== null || e.value !== undefined
              ? Math.round(e.value)
              : 0
          })
          const c = caloriesTemp.map((e) => {
            return e.value !== null || e.value !== undefined
              ? Math.round(e.value)
              : 0
          })
          let avg = 0
          console.log('values', hr, st, c)
          for (let x = 0; x < heartRateTemp.length; x++) {
            /*             if (isNaN(hr[x])) {
              avg += 0.17 * st[x] + 0.33 * c[x];
            }
            if (isNaN(st[x])) {
              avg += 0.5 * hr[x] + 0.33 * c[x];
            }
            if (isNaN(c[x])) {
              avg += 0.5 * hr[x] + 0.17 * st[x];
            }
            if (!isNaN(hr[x]) && !isNaN(st[x]) && !isNaN(c[x])) {
              avg += 0.5 * hr[x] + 0.17 * st[x] + 0.33 * c[x];
            } */
            avg += this.round(0.5 * hr[x] + 0.17 * st[x] + 0.33 * c[x])
          }
          avgPhysical.push(avg)
          start = dateEndPyshical
        }
      }
      console.log(avgPhysical)
      let myAvg = 0
      for (let y = 0; y < avgPhysical.length; y++) {
        if (isNaN(avgPhysical[y])) {
          myAvg += 0
        } else {
          myAvg += avgPhysical[y]
        }
      }
      myAvg = myAvg / avgPhysical.length
      /* console.log(myAvg); */
      return Math.trunc(myAvg, 0)
    },

    dataMood () {
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
          /* const moodTemp = dd.find(
            (t) => t.dataTypeName === "com.google.calories.expended"
          ); */
          const moodTemp = dd.filter(
            s => s.dataTypeName === 'com.google.step_count.delta'
          )
          moodTemp.forEach((e) => {
            const ee = {
              date: this.formatDateTable(start),
              mood: e.value !== null ? Math.round(e.value) : 0
            }
            tt.push(ee)
          })

          start = dateEnd
        }
      }
      /* console.log(tt); */
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
    /*     dataPhysicalHealth(val) {
      console.log(this.dataPhysicalHealth);
    }, */
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
      /* this.$store.dispatch("getDataSet", { uid: authUser.uid }); */
      this.$store.dispatch('getDataSet', { uid: this.uid })
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

    formatDate (date) {
      if (!date) {
        return null
      }

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },

    formatDateTable (item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10)
      return ss
    },

    parseDate (date) {
      if (!date) {
        return null
      }

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },

    round (num) {
      return Math.round(num * 100) / 100
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
