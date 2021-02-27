<template>
  <div>
    <h5 class="text-h5">
      Alertas
    </h5>
    <v-row justify="center" align="center">
      <v-col v-for="(alert, ilt) in alerts" :key="ilt" cols="12">
        <v-card classdark>
          <v-card-title class="headline">
            {{ alert.alert }}
          </v-card-title>
          <v-card-subtitle>
            {{ alert.uid }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  layout: 'dashboard',

  data () {
    return {
      dialog: false,
      form: {
        thought: ''
      },
      formTitle: 'Agregar pensamiento'

    }
  },

  computed: {
    alerts () {
      return this.$store.state.alerts
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getAlerts', { uid: authUser.uid })
    }
  }
}
</script>
