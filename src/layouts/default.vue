<template>
  <v-app light>
    <v-app-bar fixed app class="elevation-0 white">
      <nuxt-link to="/">
        <v-img
          class="mx-2"
          src="https://firebasestorage.googleapis.com/v0/b/mace-d54b3.appspot.com/o/logoapp.svg?alt=media&token=4fbf64de-c874-4025-a08c-3ad55412dfcd"
          max-height="40"
          max-width="40"
          contain
        />
      </nuxt-link><img src="~/assets/images/logo-2.svg" height="18" alt="google-icon">
      <v-spacer />
      <v-btn
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
  })
}
</script>
