<template>
  <v-container>
    <v-row class="pl-5" justify="start" align="center">
      Paciente: {{ user.name }}
    </v-row>
    <br>
    <br>
    <v-timeline dense>
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
                hint="MM/DD/YYYY"
                @blur="dateStart = parseDate(dateStarFormatted)"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="dateStart"
              no-title
              @input="menu1 = false"
            />
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
                hint="MM/DD/YYYY"
                @blur="dateEnd = parseDate(dateEndFormatted)"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="dateEnd" no-title @input="menu2 = false" />
          </v-menu>
        </v-col>
      </v-row>
      <v-timeline-item v-for="(thought, ith) in thoughts" :key="ith">
        <v-card class="elevation-0 blue-grey lighten-5">
          <v-card-title class="title font-weight-regular">
            <img
              :src="`/images/${thought.name}.svg`"
              alt="google-auth"
              style="width: 32px; height: 32px"
              class="mr-3"
            >
            {{ thought.thought }}
          </v-card-title>
          <v-card-text class="subtitle-1 font-weight-light">
            {{
              "Fecha: " +
                formatDateTable(thought.date) +
                "  Hora: " +
                formatDateHour(thought.date)
            }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
import moment from 'moment'
export default {
  props: ['myUid'],
  data () {
    return {
      params: {
        uid: '',
        start: 0,
        end: 0
      },
      dateStart: '',
      dateStarFormatted: '',
      dateEnd: '',
      dateEndFormatted: '',
      menu1: false,
      menu2: false,
      uid: this.$props.myUid
    }
  },

  async fetch ({ store }) {
    try {
      this.params.uid = this.uid
      this.params.start = new Date(this.dateStart).getTime()
      this.params.end = new Date(this.dateEnd).setUTCHours(23, 59)
      console.log(this.params)
      this.$store.dispatch('getThoughtsByDate', this.params)
      await store.dispatch('getUser', { uid: this.uid })
    } catch (e) {
      return 'error'
    }
  },

  computed: {
    thoughts () {
      return this.$store.state.thoughts
    },
    user () {
      return this.$store.state.user
    }
  },

  watch: {
    dateStart (val) {
      this.dateStarFormatted = this.formatDate(this.dateStart)
      this.params.uid = this.uid
      this.params.start = new Date(this.dateStart).getTime()
      this.params.end = new Date(this.dateEnd).setUTCHours(23, 59)
      this.$store.dispatch('getThoughtsByDate', this.params)
    },
    dateEnd (val) {
      this.dateEndFormatted = this.formatDate(this.dateEnd)
      this.params.uid = this.uid
      this.params.start = new Date(this.dateStart).getTime()
      this.params.end = new Date(this.dateEnd).setUTCHours(23, 59)
      this.$store.dispatch('getThoughtsByDate', this.params)
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
      this.params.uid = this.uid
      this.params.start = new Date(this.dateStart).getTime()
      this.params.end = new Date(this.dateEnd).setUTCHours(23, 59)
      this.$store.dispatch('getThoughtsByDate', this.params)
      this.$store.dispatch('getUser', { uid: this.uid })
    }
  },

  methods: {
    parseDate (date) {
      if (!date) {
        return null
      }

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    formatDate (date) {
      if (!date) {
        return null
      }

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    formatDateTable (item) {
      const ss = new Date(Number(item)).toISOString()
      const parseTime = moment(ss).format('DD/MM/YYYY')
      return parseTime
    },
    formatDateHour (item) {
      const ss = new Date(Number(item)).toISOString()
      const parseTime = moment(ss).format('HH:mm')
      console.log(parseTime)
      return parseTime
    }
  }
}
</script>
