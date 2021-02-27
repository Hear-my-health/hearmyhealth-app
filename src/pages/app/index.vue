<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div>
        <!--         <div v-for="(item, index) in dataSourceState" :key="index">
          <v-card @click="getMeDatasetStep(item)">
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
        </div> -->
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'dashboard',

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
    }

    /*     dataSource () {
      return this.$store.state.dataSource.data.filter((item) => {
        const scope = item.dataType.name
        return (
          scope === 'com.google.heart_rate.bpm'
            ||
          scope === "com.google.heart_rate.bpm" ||
          scope === "com.google.step_count.cadence" ||
          scope === "com.google.step_count.delta" ||
          scope === "com.google.calories.expended"

        )
      })
    } */
  },

  mounted () {
    const { authUser } = this.$store.state
    console.log('PAGE index authUser', authUser)
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

    async getMeDatasetStep (item) {
      // Para pasos funciona con el 29 y 30
      console.log('getDatasetByDataSources item', item)
      const {
        dataStreamId,
        dataType: { name }
      } = item
      console.log('getDatasetByDataSources name', name)

      const token = this.$store.state.credential.accessToken
      const headers = {
        Authorization: `Bearer ${token}`
      }

      console.log('getMeDatasetStep dataStreamId', dataStreamId)
      const startTime = '2021-02-06T00:00:00.000Z'
      const start = new Date(startTime).getTime()
      console.log('getMeDatasetStep start', start)
      // const endTime = '2021-02-31T23:59:59.999Z'
      const end = new Date().getTime()
      console.log('getMeDatasetStep end', end)

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
      console.log('getMeDatasetStep body', body)

      try {
        const res = await this.$axios({
          method: 'post',
          url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
          headers,
          data: body
        })
        console.log('getMeDatasetStep res', res)
        if (res) {
          if (res.data) {
            this.dataStream = res.data.bucket
          }
        }
      } catch (error) {
        console.log('getMeDatasetStep error', error)
      }
    }
  }

}
</script>
