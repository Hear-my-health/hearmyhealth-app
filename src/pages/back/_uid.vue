<template>
  <div>
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in tabs" :key="item.slug" :to="`#${item.slug}`">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="grey lighten-5">
      <v-tab-item value="dashboard">
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
      await store.dispatch('getThoughts', { uid: this.uid })
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
    /* user() {
      return this.$store.state.user;
    }, */
  },

  watch: {
    user () {
      this.specialty = this.user.specialty
      /* if (this.user.specialty) {
        localStorage.setItem("doctorSpecialty", this.user.specialty);
      } */
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getAlerts', { uid: this.uid })
      this.$store.dispatch('getThoughts', { uid: this.uid })
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

    formatDateTable (item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10)
      return ss
    },
    formatDateHour (item) {
      const ss = new Date(Number(item)).toISOString().substr(11, 5)
      return ss
    }
  }
}
</script>
