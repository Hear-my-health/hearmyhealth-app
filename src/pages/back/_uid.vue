<template>
  <div>
    <v-tabs v-model="tab" background-color="transparent" color="basil" fixed-tabs>
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
        <Data :my-uid="uid" class="mt-4" />
      </v-tab-item>
      <v-tab-item value="devices" class="mt-3">
        <Device :my-uid="uid" />
      </v-tab-item>
      <v-tab-item value="thoughts" class="mt-3">
        <Thought :my-uid="uid" />
      </v-tab-item>
      <v-tab-item value="alerts" class="mt-4">
        <Alert :my-uid="uid" />
      </v-tab-item>
      <v-tab-item value="profile">
        <Profile :my-uid="uid" class="mt-3" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import Data from '~/components/uid/Data'
import Device from '~/components/uid/Device'
import Dashboard from '~/components/uid/Dashboard'
import Profile from '~/components/uid/Profile'
import Alert from '~/components/uid/Alert'
import Thought from '~/components/uid/Thought'

export default {
  components: {
    Data,
    Device,
    Dashboard,
    Profile,
    Alert,
    Thought
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

  // eslint-disable-next-line require-await
  async fetch ({ store }) {
    // eslint-disable-next-line no-empty
    try {
    } catch (e) {
      return 'error'
    }
  },

  computed: {
    /* user() {
      return this.$store.state.user;
    }, */
  },

  watch: {
    user () {
      this.specialty = this.user.specialty
    }
  },

  created () {},
  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    // eslint-disable-next-line no-empty
    } else {
    }
  },

  methods: {
    close () {
      this.dialog = !this.dialog
    }
  }
}
</script>
