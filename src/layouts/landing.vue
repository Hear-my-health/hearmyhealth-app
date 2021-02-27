<template>
  <v-app light>
    <v-app-bar fixed app class="elevation-0 white">
      <nuxt-link to="/">
        <v-img
          class="mx-2"
          src="https://randomuser.me/api/portraits/women/85.jpg"
          max-height="40"
          max-width="40"
          contain
        />
      </nuxt-link>
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
  </v-app>
</template>
<script>
export default {
  data: () => ({
    links: [
      { name: 'Inicio', to: '/' },
      { name: 'Producto', to: '' },
      { name: 'Contacto', to: '' }
    ]
  })
}
</script>
