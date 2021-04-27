<template>
  <v-app light>
    <v-app-bar style="background-color: #0C314C" fixed app class="elevation-0">
      <v-img
        class="mx-2"
        src="https://firebasestorage.googleapis.com/v0/b/hear-my-health.appspot.com/o/LOGOS-DAVID-FINAL-mini.jpg?alt=media&token=0ccbe5a5-7e2b-4754-8b11-c43b0801006e"
        max-height="57"
        max-width="57"
        contain
      />
      <v-spacer />
      <v-btn
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
        depressed
        plain
        color="white"
      >
        {{ link.name }}
      </v-btn>

      <v-divider class="mx-4" vertical />
      <v-btn :to="'/login'" elevation="1" style="color: white" outlined>
        Documentación
      </v-btn>
    </v-app-bar>
    <v-main class="grey lighten-5">
      <nuxt />
    </v-main>
    <v-footer
      dark
      padless
    >
      <v-card
        class="flex"
        flat
        tile
      >
        <v-card-text class="py-2 white--text text-center">
          {{ new Date().getFullYear() }} — <strong>Hear my health </strong> — <a style="color: white; text-decoration: none" href="mailto:u201616577@upc.edu.pe" target="_blank"><v-icon>mdi-email</v-icon>
          </a>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    links: [
      { name: 'Inicio', to: '/' },
      { name: 'Producto', to: '#product' },
      { name: 'Contacto', to: '#contact' }
    ]
  }),
  methods: {
    isMobile () {
      return this.$vuetify.breakpoint.xsOnly
    }
  }
}
</script>
