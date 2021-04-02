<template>
  <div>
    <v-btn elevation="0" outlined raised @click="saveDataFirebase">
      Guardar
    </v-btn>
  </div>
</template>

<script>

const database = require('../../assets/dataset.json')

export default {
  layout: 'back',

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getValues')
    }
  },

  methods: {
    saveDataFirebase () {
      const db2 = database

      const dbList = JSON.parse(JSON.stringify(db2))

      const uid = 'q21Oz6PDyBfWprf3u5Al69HEnWw1'

      dbList.forEach((obj, index) => {
        try {
          const startTime = obj.starDate
          const endTime = obj.endDate

          const objects = [
            {
              dataSourceId: 'app.web.hear-my-health.csv.claudia',
              dataTypeName: 'com.google.heart_rate.bpm',
              endTimeMillis: endTime,
              endTimeNanos: '',
              originDataSourceId: '',
              point: '',
              startTimeMillis: startTime,
              startTimeNanos: '',
              value: obj.heartRate,
              name: '',
              modifiedTimeMillis: '',
              activityType: '',
              state: this.getState(obj.heartRate, 'com.google.heart_rate.bpm'),
              uid
            },
            {
              dataSourceId: 'app.web.hear-my-health.csv.claudia',
              dataTypeName: 'com.google.step_count.delta',
              endTimeMillis: endTime,
              endTimeNanos: '',
              originDataSourceId: '',
              point: '',
              startTimeMillis: startTime,
              startTimeNanos: '',
              value: obj.steps,
              name: '',
              modifiedTimeMillis: '',
              activityType: '',
              state: this.getState(obj.steps, 'com.google.step_count.delta'),
              uid
            },
            {
              dataSourceId: 'app.web.hear-my-health.csv.claudia',
              dataTypeName: 'com.google.calories.expended',
              endTimeMillis: endTime,
              endTimeNanos: '',
              originDataSourceId: '',
              point: '',
              startTimeMillis: startTime,
              startTimeNanos: '',
              value: obj.calories,
              name: '',
              modifiedTimeMillis: '',
              activityType: '',
              state: this.getState(obj.calories, 'com.google.calories.expended'),
              uid
            },
            {
              dataSourceId: 'app.web.hear-my-health.csv.claudia',
              dataTypeName: 'com.google.sleep.segment',
              endTimeMillis: endTime,
              endTimeNanos: '',
              originDataSourceId: '',
              point: '',
              startTimeMillis: startTime,
              startTimeNanos: '',
              value: obj.sleep,
              name: '',
              modifiedTimeMillis: '',
              activityType: '',
              state: this.getState(obj.sleep, 'com.google.sleep.segment'),
              uid
            },
            {
              dataSourceId: 'app.web.hear-my-health.csv.claudia',
              dataTypeName: 'app.web.hear-my-health.sleep.deep',
              endTimeMillis: endTime,
              endTimeNanos: '',
              originDataSourceId: '',
              point: '',
              startTimeMillis: startTime,
              startTimeNanos: '',
              value: obj.deepSleep,
              name: '',
              modifiedTimeMillis: '',
              activityType: '',
              state: this.getState(obj.deepSleep, 'app.web.hear-my-health.sleep.deep'),
              uid
            },
            {
              dataSourceId: 'app.web.hear-my-health.csv.claudia',
              dataTypeName: 'app.web.hear-my-health.mood.segment',
              endTimeMillis: endTime,
              endTimeNanos: '',
              originDataSourceId: '',
              point: '',
              startTimeMillis: startTime,
              startTimeNanos: '',
              value: obj.moodbyDay,
              name: '',
              modifiedTimeMillis: '',
              activityType: '',
              state: this.getState(obj.moodbyDay, 'app.web.hear-my-health.mood.segment'),
              uid
            }
          ]

          objects.forEach(async (obj) => {
            await this.$fire.firestore
              .collection('dataSet')
              .doc()
              .set(obj)
          })
        } catch (error) {
          this.$store.dispatch('SET_MESSAGE', { message: error })
        }
      })
    },

    getState (value, dataTypeName) {
      if (value) {
        const dd = this.$store.state.values.find(
          v => v.dataTypeName === dataTypeName
        )
        if (dd) {
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
      } else {
        return 'not'
      }
    }

  }
}
</script>
