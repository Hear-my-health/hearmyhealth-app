<template>
  <div>
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in tabs" :key="item.slug" :to="`#${item.slug}`">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="grey lighten-5">
      <v-tab-item value="dashboard">
        <br>
        <Dashboard :my-uid="uid" class="mt-3" />
      </v-tab-item>
      <v-tab-item value="data">
        <Data :my-uid="uid" class="mt-3" />
      </v-tab-item>
      <v-tab-item value="devices" class="mt-3">
        <Device :my-uid="uid" />
      </v-tab-item>
      <v-tab-item value="thoughts">
        <h5 class="text-h5">
          Pensamientos
        </h5>
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
                <v-date-picker
                  v-model="dateEnd"
                  no-title
                  @input="menu2 = false"
                />
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
      </v-tab-item>
      <v-tab-item value="alerts">
        <h5 class="text-h5">
          Alertas
        </h5>
        <Alert :my-uid="uid" />
      </v-tab-item>
      <v-tab-item value="profile">
        <Profile :my-uid="uid" class="mt-3" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import moment from 'moment'
import Data from '~/components/uid/Data'
import Device from '~/components/uid/Device'
import Dashboard from '~/components/uid/Dashboard'
import Profile from '~/components/uid/Profile'
import Alert from '~/components/uid/Alert'

export default {
  components: {
    Data,
    Device,
    Dashboard,
    Profile,
    Alert
  },
  layout: 'back',
  asyncData ({ params }) {
    const { uid } = params

    return { uid }
  },

  data: vm => ({
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
    dialog: false,
    isEditing: true,
    specialty: '',
    form: {
      alert: '',
      type: ''
    },

    formTitle: 'Agregar alerta',
    tab: null,
    tabs: [
      {
        name: 'Dashboard',
        slug: 'dashboard',
        value: 'dashboard'
      },
      {
        name: 'Datos',
        slug: 'data',
        value: 'data'
      },
      {
        name: 'Dispositivos',
        slug: 'devices',
        value: 'devices'
      },
      {
        name: 'Pensamientos',
        slug: 'thoughts',
        value: 'thoughts'
      },
      {
        name: 'Alertas',
        slug: 'alerts',
        value: 'alerts'
      },
      {
        name: 'Información',
        slug: 'profile',
        value: 'profile'
      }
    ],
    text: 'loremos'
  }),

  async fetch ({ store }) {
    try {
      await store.dispatch('getAlerts', { uid: this.uid })
      /* await store.dispatch("getThoughts", { uid: this.uid }); */
      this.params.uid = this.uid
      this.params.start = new Date(this.dateStart).getTime()
      this.params.end = new Date(this.dateEnd).setUTCHours(23, 59)
      console.log(this.params)
      this.$store.dispatch('getThoughtsByDate', this.params)
      /* await store.dispatch("getDataSet", { uid: this.uid }); */
      await store.dispatch('getDevices', { uid: this.uid })
      /* await store.dispatch("getUser", { uid: this.$store.state.authUser.uid }); */
    } catch (e) {
      return 'error'
    }
  },

  computed: {
    alerts () {
      return this.$store.state.alerts
    },
    thoughts () {
      return this.$store.state.thoughts
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
    },
    user () {
      this.specialty = this.user.specialty
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
      this.$store.dispatch('getAlerts', { uid: this.uid })
      /* this.$store.dispatch("getThoughts", { uid: this.uid }); */
      this.params.uid = this.uid
      this.params.start = new Date(this.dateStart).getTime()
      this.params.end = new Date(this.dateEnd).setUTCHours(23, 59)
      this.$store.dispatch('getThoughtsByDate', this.params)
      /* this.$store.dispatch("getDataSet", { uid: this.uid }); */
      this.$store.dispatch('getDevices', { uid: this.uid })
      /* this.$store.dispatch("getUser", { uid: this.$store.state.authUser.uid }); */
      /* if (this.user) {
        this.specialty = this.user.specialty;
      } */
    }
  },

  methods: {
    close () {
      this.dialog = !this.dialog
    },

    async createAlert () {
      try {
        const { uid } = this.uid
        const { alert, type } = this.form
        const date = new Date().getTime()

        await this.$fire.firestore.collection('alerts').doc().set({
          date,
          alert,
          type,
          uid,
          createdBy: this.$store.state.authUser
        })

        this.close()
      } catch (error) {
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    },
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
