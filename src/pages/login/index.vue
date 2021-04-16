<template>
  <v-container>
    <v-row justify="center" align="center" class="mt-3">
      <v-col cols="10" sm="8" md="4">
        <h2 class="text-h3 mb-9">
          Iniciar sesión
        </h2>
        <div class="mb-9">
          <p class="mb-3">
            Iniciar sesión como paciente
          </p>
          <v-btn
            x-large
            elevation="0"
            raised
            outlined
            class="pa-2"
            block
            @click="signInWithGoogle"
          >
            <img
              src="~/assets/images/google-auth.svg"
              alt="google-auth"
              class="pa-1"
              style="width: 48px; height: 48px"
            >
            <span class="mx-2"> Inicia sesión con Google </span>
          </v-btn>
        </div>
        <div>
          <p class="mb-3">
            También puedes ingresar como especialista
          </p>
          <v-btn
            class="lighten-1 blue accent-4"
            raised
            outlined
            large
            dark
            block
            to="/login/admin"
          >
            Inicia sesión
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'free',

  middleware: 'authenticated',

  data () {
    return {}
  },

  async mounted () {
    const { authUser } = this.$store.state

    if (authUser) {
      await this.$router.push('/app')
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

      this.$store.commit('SET_CREDENTIAL', authData.credential)
      await this.getDataSavingTime(authData.user.uid)

      if (authData.additionalUserInfo.isNewUser) {
        await this.createUser(authData)
      }

      await this.getMeDataSources(authData)

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
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    },

    async saveDataSourcesByUsers (dataSource, user, accessToken) {
      const dataSourceFilter = dataSource.filter((item) => {
        const scope = item.dataType.name
        const packageName = item.application
          ? item.application.packageName
          : ''
        const device = item.device

        return (
          (scope === 'com.google.heart_rate.bpm' ||
            scope === 'com.google.step_count.cadence' ||
            scope === 'com.google.step_count.delta' ||
            scope === 'com.google.calories.expended') &&
          packageName === 'com.google.android.gms' &&
          !device
        )
      })

      const dataSourceFilterDevice = dataSource.filter((item) => {
        const scope = item.dataType.name
        const packageName = item.application
          ? item.application.packageName
          : ''
        const device = item.device

        return (
          (scope === 'com.google.heart_rate.bpm' ||
            scope === 'com.google.step_count.cadence' ||
            scope === 'com.google.step_count.delta' ||
            scope === 'com.google.calories.expended') &&
          packageName === 'com.google.android.gms' &&
          !!device
        )
      })

      try {
        await this.$fire.firestore.collection('devices').doc(user.uid).set({
          data: dataSourceFilterDevice
        })

        await this.$fire.firestore.collection('dataSources').doc(user.uid).set({
          data: dataSourceFilter
        })

        const startDateOrigin = '2021-03-01T00:00:00.000Z'
        const startTimeOrigin = new Date(startDateOrigin).getTime()

        const dataSaving =
          this.$store.state.dataSavingTime.length > 0
            ? this.$store.state.dataSavingTime[0]
            : null

        const startTime = dataSaving ? dataSaving.date : startTimeOrigin

        const endDate = new Date().setHours(0, 0, 0, 0)

        const endTime = endDate.getTime()

        dataSourceFilter.forEach(async (item) => {
          await this.getMeDatasetStepSAVE(
            item,
            accessToken,
            startTime,
            endTime
          )
        })

        this.getMeSessionsSleep(accessToken, startTime, endDate)
      } catch (error) {
        return 'error'
      }
    },

    async getMeDatasetStepSAVE (item, accessToken, startDate, endDate) {
      const {
        dataStreamId,
        dataType: { name }
      } = item

      const token = accessToken
      const headers = {
        Authorization: `Bearer ${token}`
      }

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
                if (
                  name === 'com.google.step_count.delta'
                ) {
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
                  point: obj.dataset[0].point.length
                    ? obj.dataset[0].point[0]
                    : '',
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
                return error
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
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    },

    getState (obj) {
      const { value } = obj
      if (value) {
        const dd = this.$store.state.values.find(
          v => v.dataTypeName === obj.dataTypeName
        )
        if (value >= dd.minSalud && value <= dd.maxSalud) {
          return 'green'
        }
        if (value >= dd.minAcept && (value < dd.minSalud || value > dd.maxSalud) && value <= dd.maxAcept && value !== 0) {
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

    async getMeSessionsSleep (accessToken, startTime, endDate) {
      const startDate = new Date(Number(startTime))
      const { uid } = this.$store.state.authUser

      const token = accessToken
      const headers = { Authorization: `Bearer ${token}` }
      try {
        const res = await this.$axios.$get(
          `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}&activityType=72`,
          { headers }
        )

        res.session.forEach(async (obj, index) => {
          try {
            const value = (
              (obj.endTimeMillis - obj.startTimeMillis) /
              60 /
              60 /
              1000
            ).toFixed(2)

            const sleepObj = {
              dataSourceId: obj.application.packageName,
              dataTypeName: 'com.google.sleep.segment',
              endTimeMillis: obj.endTimeMillis,
              endTimeNanos: '',
              originDataSourceId: obj.id,
              point: obj,
              startTimeMillis: obj.startTimeMillis,
              startTimeNanos: '',

              value: Number(value),

              name: obj.name,
              modifiedTimeMillis: obj.modifiedTimeMillis,
              activityType: obj.activityType
            }
            const stateSleep = this.getState(sleepObj)

            const valueSleep = value * 0.2

            const sleepDeepObj = {
              dataSourceId: obj.application.packageName,
              dataTypeName: 'app.web.hear-my-health.sleep.deep',
              endTimeMillis: obj.endTimeMillis,
              endTimeNanos: '',
              originDataSourceId: obj.id,
              point: obj,
              startTimeMillis: obj.startTimeMillis,
              startTimeNanos: '',

              value: valueSleep,

              name: obj.name,
              modifiedTimeMillis: obj.modifiedTimeMillis,
              activityType: obj.activityType
            }
            const stateSleepDeep = this.getState(sleepDeepObj)

            await this.$fire.firestore
              .collection('dataSet')
              .doc()
              .set({
                uid,
                ...sleepObj,
                state: stateSleep
              })
            await this.$fire.firestore
              .collection('dataSet')
              .doc()
              .set({
                uid,
                ...sleepDeepObj,
                state: stateSleepDeep
              })
          } catch (error) {
            this.$store.dispatch('SET_MESSAGE', { message: error })
          }
        })
      } catch (error) {
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    }
  }
}
</script>
