<template>
  <v-app dark>
    <v-app-bar fixed app class="elevation-0 grey lighten-5" height="120px">
      <v-container>
        <nuxt-link to="/">
          <img src="~/assets/images/logo-2.svg" height="36" alt="google-icon">
        </nuxt-link>
        <v-spacer />
      </v-container>
    </v-app-bar>
    <v-main class="grey lighten-5">
      <v-container>
        <v-row justify="center" align="center" class="mt-3">
          <v-col cols="10" sm="8" md="4">
            <h2 class="text-h3 mb-9">
              Sign In
            </h2>
            <p class="mb-6">
              We only accept social auth here:
            </p>
            <v-btn
              x-large
              elevation="0"
              raised
              outlined
              class="pa-2"
              @click="signInWithGoogle"
            >
              <img
                src="~/assets/images/google-auth.svg"
                alt="google-auth"
                class="pa-1"
                style=" width: 48px; height: 48px; "
              >
              <span class="mx-2"> Sign in with Google </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  components: {},

  layout: 'free',

  data () {
    return {
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
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (authUser) {
      this.$router.push('/app')
    }
  },

  methods: {
    async signInWithGoogle () {
      const provider = new this.$fireModule.auth.GoogleAuthProvider()
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.activity.read'
      )
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.activity.write'
      )
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.blood_glucose.read'
      )
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.blood_pressure.read'
      )
      provider.addScope('https://www.googleapis.com/auth/fitness.body.read')
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.body_temperature.read'
      )
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.heart_rate.read'
      )
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.heart_rate.write'
      )
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.location.read'
      )
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.nutrition.read'
      )
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.oxygen_saturation.read'
      )
      provider.addScope(
        'https://www.googleapis.com/auth/fitness.reproductive_health.read'
      )
      provider.addScope('https://www.googleapis.com/auth/fitness.sleep.read')
      provider.addScope('https://www.googleapis.com/auth/fitness.sleep.write')
      // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      // You can add or remove more scopes here provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      const authData = await this.$fire.auth.signInWithPopup(provider)
      console.log('signInWithGoogle authData', authData)

      await this.$store.commit('SET_CREDENTIAL', authData.credential)
      await this.getDataSavingTime(authData.user.uid)

      if (authData.additionalUserInfo.isNewUser) {
        await this.createUser(authData)
      }

      await this.getMeDataSources(authData)
      await this.getMeSessionsSleep(authData.credential.accessToken)

      await this.$router.push('/')
    },

    async getDataSavingTime (uid) {
      await this.$store.dispatch('getDataSavingTime', { uid })
    },

    async createUser (data) {
      const { credential, additionalUserInfo, user } = data
      const date = new Date().getTime()
      try {
        await this.$fire.firestore
          .collection('users')
          .doc(user.uid)
          .set({
            createDate: date,
            uid: user.uid,
            ...credential,
            ...additionalUserInfo.profile,
            role: 'user'
          })

        this.showModal = false
      } catch (error) {
        return 'error'
      }
    },

    async getMeDataSources (data) {
      const { credential, user } = data

      const { accessToken } = credential
      const token = accessToken
      const headers = { Authorization: `Bearer ${token}` }
      try {
        const res = await this.$axios.$get(
          'https://www.googleapis.com/fitness/v1/users/me/dataSources',
          { headers }
        )
        this.saveDataSourcesByUsers(res.dataSource, user, accessToken)
      } catch (error) {
        console.log('LOGIN getMeDataSources error', error)
      }
    },

    async saveDataSourcesByUsers (dataSource, user, accessToken) {
      const rr = dataSource.filter((item) => {
        const scope = item.dataType.name
        return (
          scope === 'com.google.sleep.segment'
        )
      })

      console.log('saveDataSourcesByUsers sleep', rr)

      const dataSourceFilter = dataSource.filter((item) => {
        const scope = item.dataType.name
        const packageName = item.application ? item.application.packageName : ''
        const device = item.device

        return (
          (scope === 'com.google.heart_rate.bpm' ||
            scope === 'com.google.step_count.cadence' ||
            scope === 'com.google.step_count.delta' ||
            scope === 'com.google.sleep.segment' ||
            scope === 'com.google.calories.expended') &&
            packageName === 'com.google.android.gms' && !device
        )
      })
      try {
        await this.$fire.firestore.collection('dataSources').doc(user.uid).set({
          data: dataSourceFilter
        })

        const startTime = '2021-02-01T00:00:00.000Z'
        const start = new Date(startTime).getTime()

        const dataSaving = this.$store.state.dataSavingTime.length > 0 ? this.$store.state.dataSavingTime[0] : null

        const startDate = dataSaving ? dataSaving.date : start

        dataSourceFilter.forEach(async (item, index) => {
          await this.getMeDatasetStepSAVE(item, accessToken, startDate)
        })
      } catch (error) {
        return 'error'
      }
    },

    async getMeDatasetStepSAVE (item, accessToken, startDate) {
      const {
        dataStreamId,
        dataType: { name }
      } = item

      const token = accessToken
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const endDate = new Date().getTime()

      const body = {
        aggregateBy: [
          {
            dataTypeName: name,
            dataSourceId: dataStreamId
          }
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: startDate,
        endTimeMillis: endDate
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
              date: endDate,
              type: 'dataSet',
              uid
            })
          }
        }
      } catch (error) {
        console.log('getMeDatasetStep error', error)
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

    async saveTimeData (user, type) {
      const date = new Date().getTime()
      try {
        await this.$fire.firestore.collection('dataSavingTime').doc().set({
          date,
          type,
          uid: user.uid
        })
      } catch (error) {
        return 'error'
      }
    },

    async getMeSessions (accessToken) {
      const startTime = '2021-01-01T00:00:00.000Z'
      const endTime = '2021-01-31T23:59:59.999Z'

      const token = accessToken
      const headers = { Authorization: `Bearer ${token}` }
      try {
        const res = await this.$axios.$get(
          `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${startTime}&endTime=${endTime}`,
          { headers }
        )
        console.log('LOGIN getMeSessions res', res)
      } catch (error) {
        console.log('LOGIN getMeSessions error', error)
      }
    },

    async getMeSessionsSleep (accessToken) {
      console.log('LOGIN getMeSessionsSleep')
      const startTime = '2021-02-01T00:00:00.000Z'
      const endTime = '2021-03-03T23:59:59.999Z'

      const token = accessToken
      const headers = { Authorization: `Bearer ${token}` }
      try {
        const res = await this.$axios.$get(
          `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${startTime}&endTime=${endTime}&activityType=72`,
          { headers }
        )
        console.log('LOGIN getMeSessionsSleep res', res)
      } catch (error) {
        console.log('LOGIN getMeSessionsSleep error', error)
      }
    }
  }
}
</script>
