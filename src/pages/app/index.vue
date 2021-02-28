<template>
  <v-row>
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
            v-model="dateFormatted"
            label="Inicio"
            persistent-hint
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            @blur="dateStart = parseDate(dateFormatted)"
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
            v-model="dateFormatted"
            label="Fin"
            persistent-hint
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            @blur="dateEnd = parseDate(dateFormatted)"
            v-on="on"
          />
        </template>
        <v-date-picker v-model="dateEnd" no-title @input="menu2 = false" />
      </v-menu>
    </v-col>

    <v-col cols="12" sm="8" md="12">
      <div>
        <div v-for="(item, index) in dataSourceState" :key="index">
          <v-card @click="getMeDatasetStepSAVE(item)">
            <div>
              {{ index + 1 }}
            </div>
            <div>TIPO: {{ nameData(item.dataType.name) }}</div>
            <div>
              {{ item }}
            </div>
            <br>
            <div>
              <div v-if="item.device">
                Dispositivo
                <div>
                  Tipo:
                  {{ item.device.type }}
                </div>
                <div>Modelo: {{ item.device.model }}</div>
              </div>
            </div>
            <div>
              <div v-if="item.application">
                <div v-if="item.application.name">
                  Aplicación
                  <div>Nombre: {{ item.application.name }}</div>
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'dashboard',

  data: vm => ({
    dateStart: new Date().toISOString().substr(0, 10),
    dateEnd: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,
    menu2: false,

    values: [
      {
        key: 'heartRateByDay',
        name: 'Frecuencia Cardiaca',
        indicator: 'heartRate',
        indicatorUnit: 'lat/min',
        dataTypeName: 'com.google.heart_rate.bpm',
        type: 'healthPhysical',
        frequency: 'day',
        maxSalud: 120,
        minSalud: 60,
        maxAcept: 200,
        minAcept: 50,
        weight: 3,
        weightPercentage: 0.5
      },
      {
        key: 'stepByDay',
        name: 'Pasos',
        indicator: 'step',
        indicatorUnit: 'cal',
        dataTypeName: 'com.google.step_count.delta',
        type: 'healthPhysical',
        frequency: 'day',
        maxSalud: 730,
        minSalud: 365,
        maxAcept: 1460,
        minAcept: 180,
        weight: 1,
        weightPercentage: 0.17
      },
      {
        key: 'caloriesBurnedByDay',
        name: 'Calorias quemadas',
        indicator: 'caloriesBurned',
        indicatorUnit: 'cal',
        dataTypeName: 'com.google.calories.expended',
        type: 'healthPhysical',
        frequency: 'day',
        maxSalud: 100,
        minSalud: 50,
        maxAcept: 200,
        minAcept: 25,
        weight: 1,
        weightPercentage: 0.17
      },
      {
        key: 'sleepByDay',
        name: 'Sueño',
        indicator: 'sleep',
        indicatorUnit: 'horas',
        dataTypeName: 'com.google.sleep.segment',
        type: 'healthMental',
        frequency: 'day',
        maxSalud: 200,
        minSalud: 100,
        maxAcept: 400,
        minAcept: 50,
        weight: 1,
        weightPercentage: 0.17
      },
      {
        key: 'sleepDeepByDay',
        name: 'Sueño Profundo',
        indicator: 'sleepDeep',
        indicatorUnit: 'horas',
        dataTypeName: 'com.google.sleep.segment',
        type: 'healthMental',
        frequency: 'day',
        maxSalud: 100,
        minSalud: 50,
        maxAcept: 200,
        minAcept: 25,
        weight: 1,
        weightPercentage: 0.17
      },
      {
        key: 'moodByDay',
        name: 'Estado de animo',
        indicator: 'mood',
        indicatorUnit: 'horas',
        dataTypeName: 'com.google.sleep.segment',
        type: 'healthMental',
        frequency: 'day',
        maxSalud: 4,
        minSalud: 3,
        maxAcept: 2,
        minAcept: 1,
        weight: 1,
        weightPercentage: 0.17
      }
    ]
  }),

  async fetch ({ store }) {
    try {
      await store.dispatch('getDataSourceByUser')
    } catch (e) {
      return 'error'
    }
  },

  computed: {
    auth () {
      return this.$store.state.authUser || null
    },

    dataSourceState () {
      return this.$store.state.dataSource.data
    },

    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },

  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getDataSourceByUser')
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
    },

    getState (obj) {
      const { value } = obj
      if (value) {
        const dd = this.values.find(v => v.dataTypeName === obj.dataTypeName)
        if (value >= dd.minSalud && value <= dd.maxSalud) {
          return 'green'
        }
        if (value >= dd.minAcept && value <= dd.maxAcept) {
          return 'yellow'
        }
        return 'red'
      } else {
        return 'not'
      }
    },

    async getMeDatasetStepSAVE (item) {
      const {
        dataStreamId,
        dataType: { name }
      } = item

      const token =
        'ya29.A0AfH6SMAt5FGapj9sUA7qaGTVgBxtnH-_qsltjmTlUnhpiZ32jo1chH5UD6IaeX71OwdDYXrR3WPBsKjCet9A5eoGmhpzAReVkGw29yD4zJBTLS3K_sAyOwVf4hJPYRF8T4hdKCQGtlxTXyHjDzOWhA2hx_TFRw'
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const startTime = '2021-02-20T00:00:00.000Z'
      const start = new Date(startTime).getTime()
      const end = new Date().getTime()

      const body = {
        aggregateBy: [
          {
            dataTypeName: name,
            dataSourceId: dataStreamId
          }
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: start,
        endTimeMillis: end
      }

      const { uid } = this.$store.state.authUser

      try {
        const res = await this.$axios({
          method: 'post',
          url:
            'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
          headers,
          data: body
        })
        if (res) {
          if (res.data) {
            this.dataStream = res.data.bucket

            res.data.bucket.forEach(async (obj, index) => {
              try {
                let value
                if (name === 'com.google.step_count.delta' || name === 'com.google.step_count.delta') {
                  value = obj.dataset[0].point[0]
                    ? obj.dataset[0].point[0].value[0].intVal
                    : null
                } else {
                  value = obj.dataset[0].point[0]
                    ? obj.dataset[0].point[0].value[0].fpVal
                    : null
                }

                const dd = {
                  endTimeMillis: obj.endTimeMillis,
                  startTimeMillis: obj.startTimeMillis,
                  dataSourceId: obj.dataset[0].dataSourceId,
                  dataTypeName: name,
                  endTimeNanos: obj.dataset[0].point[0]
                    ? obj.dataset[0].point[0].endTimeNanos
                    : '',
                  originDataSourceId: obj.dataset[0].point[0]
                    ? obj.dataset[0].point[0].originDataSourceId
                    : '',
                  startTimeNanos: obj.dataset[0].point[0]
                    ? obj.dataset[0].point[0].startTimeNanos
                    : '',
                  value
                }

                const state = this.getState(dd)

                await this.$fire.firestore
                  .collection('dataSet')
                  .doc()
                  .set({
                    uid,
                    ...dd,
                    state
                  })
              } catch (error) {
                console.log('error', error)
              }
            })

            await this.$fire.firestore.collection('dataSavingTime').doc().set({
              date: end,
              type: 'dataSet',
              uid
            })
          }
        }
      } catch (error) {
        console.log('getMeDatasetStep error', error)
      }
    },

    async getMeDatasetStep (item) {
      // Para pasos funciona con el 29 y 30
      const {
        dataStreamId,
        dataType: { name }
      } = item

      const token =
     'ya29.A0AfH6SMBMOecDZ3Avs-Ng0oBRPNJNJLJ3kLnO1DUi4_YsO7gFs6MIQeiOxXS_3FGe6ksAP5IF7luUyJRiHri-gwvJVeTSzkHwoHRDe10dV_rqHa8katwExJEICbT1ubzLbd2IyIE4OjhDOyjZgPit5l89dEl9rA'
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const startTime = '2021-02-01T00:00:00.000Z'
      const startTimeMillis = new Date(startTime).getTime()
      // const endTime = '2021-02-31T23:59:59.999Z'
      const endTimeMillis = new Date().getTime()

      const body = {
        aggregateBy: [
          {
            dataTypeName: name,
            dataSourceId: dataStreamId
          }
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis,
        endTimeMillis
      }

      try {
        const res = await this.$axios({
          method: 'post',
          url:
            'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
          headers,
          data: body
        })
        if (res) {
          if (res.data) {
            this.dataStream = res.data.bucket
          }
        }
      } catch (error) {
        console.log('getMeDatasetStep error', error)
      }
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
    }
  }
}
</script>
