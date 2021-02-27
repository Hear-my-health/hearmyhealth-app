<template>
  <v-app dark>
    <v-app-bar fixed app class="elevation-0 grey lighten-5" height="120px">
      <v-container>
        <nuxt-link to="/">
          <img src="~/assets/images/logo-2.svg" height="36" alt="google-icon">
        </nuxt-link>
        <v-spacer />
      </v-container>

      <!--       <v-btn
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
        depressed
        plain
        color="black"
      >
        {{ link.name }}
      </v-btn>

      <v-divider class="mx-4" vertical />
      <v-btn :to="'/login'" color="primary" elevation="1">
        Ir a la App
      </v-btn> -->
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
                src="~/assets/images/google-icon.webp"
                width="48"
                height="48"
                alt="google-icon"
                class="pa-1"
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

  mounted () {
    const { authUser } = this.$store.state
    console.log('PAGE index authUser', authUser)
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
      await this.getMeDataSources(authData)
      await this.getMeSessions(authData.credential.accessToken)
      await this.getMeSessionsSleep(authData.credential.accessToken)

      if (authData.additionalUserInfo.isNewUser) {
        this.createUser(authData)
      }

      this.$store.commit('SET_CREDENTIAL', authData.credential)
      this.$router.push('/')
    },

    async createUser (data) {
      const { credential, additionalUserInfo, user } = data
      console.log('createUser')
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
        console.log('error', error)
        return 'error'
      }
    },

    async getMeDataSources (data) {
      const { credential, user } = data

      const { accessToken } = credential
      console.log('LOGIN getMeDataSources credential', credential)
      const token = accessToken
      const headers = { Authorization: `Bearer ${token}` }
      try {
        const res = await this.$axios.$get(
          'https://www.googleapis.com/fitness/v1/users/me/dataSources',
          { headers }
        )
        console.log('LOGIN getMeDataSources res', res)
        this.saveDataSourcesByUsers(res.dataSource, user)
      } catch (error) {
        console.log('LOGIN getMeDataSources error', error)
      }
    },

    async saveDataSourcesByUsers (dataSource, user) {
      const ss = dataSource.filter((item) => {
        const scope = item.dataType.name
        return (
          scope === 'com.google.heart_rate.bpm' ||
            scope === 'com.google.heart_rate.bpm' ||
            scope === 'com.google.step_count.cadence' ||
            scope === 'com.google.step_count.delta' ||
            scope === 'com.google.calories.expended'
        )
      })
      try {
        await this.$fire.firestore.collection('dataSources').doc(user.uid).set({
          data: ss
        })
        this.saveTimeData(user, 'dateSource')
      } catch (error) {
        console.log('error', error)
        return 'error'
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
        console.log('error', error)
        return 'error'
      }
    },

    async getMeSessions (accessToken) {
      console.log('LOGIN getMeSessions')
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
      const endTime = '2021-02-10T23:59:59.999Z'

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
