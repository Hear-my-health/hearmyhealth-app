<template>
  <v-app dark>
    <v-app-bar fixed app class="elevation-0 grey lighten-5" height="120px">
      <v-container>
        <nuxt-link to="/login">
          <img src="~/assets/images/logo-2.svg" height="36" alt="google-icon">
        </nuxt-link>
        <v-spacer />
      </v-container>
    </v-app-bar>
    <v-main class="grey lighten-5">
      <nuxt />
    </v-main>
  </v-app>
</template>
