<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      dark=""
      class="blue darken-4"
    >
      <v-list>
        <v-list-item class="py-5">
          <img
            src="~/assets/images/logo-white.svg"
            alt="logo-icon"
            height="24"
          >
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="`/back${item.to}`"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app class="elevation-0 white">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-btn icon to="/app/account">
        <v-list-item-avatar v-if="auth">
          <v-img :src="auth.photoURL" />
        </v-list-item-avatar>
      </v-btn>
    </v-app-bar>
    <v-main class="grey lighten-5">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-chart-bar',
          title: 'Pacientes',
          to: '/'
        },
        {
          icon: 'mdi-numeric',
          title: 'Valores',
          to: '/values'
        },
        {
          icon: 'mdi-account',
          title: 'Perfil',
          to: '/account'
        }
        /*         {
          icon: 'mdi-alert-circle',
          title: 'Alertas',
          to: '/alerts'
        },
        {
          icon: 'mdi-watch',
          title: 'Dispositivos',
          to: '/device'
        },
        {
          icon: 'mdi-brain',
          title: 'Pensamientos',
          to: '/thoughts'
        } */
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
    auth () {
      return this.$store.state.authUser || null
    }
  }
}
</script>
