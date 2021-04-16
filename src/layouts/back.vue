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
    <v-app-bar style="height: 52px" :clipped-left="clipped" fixed app class="elevation-0 lighten">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
    </v-app-bar>
    <v-main class="grey lighten-5" style="padding: 40px 0px 0px; height: 34px">
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: true,
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
          title: 'Mi Perfil',
          to: '/account'
        }
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
