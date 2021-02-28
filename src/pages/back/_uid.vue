<template>
  <div>
    <v-row>
      <v-col cols="12" sm="10" md="8">
        <h5 class="text-h5">
          Alertas
        </h5>
        <v-btn elevation="0" outlined raised @click="dialog = !dialog">
          Agregar alerta
        </v-btn>
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

        <br>
        <h5 class="text-h5">
          Pensamientos
        </h5>
        <v-timeline dense>
          <v-timeline-item v-for="(thought, ith) in thoughts" :key="ith">
            <v-card class="elevation-1">
              <v-card-title class="headline">
                {{ thought.date }}
              </v-card-title>
              <v-card-text>
                {{ thought.thought }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
      <v-col cols="12" sm="10" md="4">
        <div>Información del usuario</div>
        <div>uid {{ uid }}</div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px" elevation="0">
      <form @submit.prevent="createAlert">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="form.alert"
                    outlined
                    name="input-7-4"
                    label="Alerta"
                    value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <v-select
                    v-model="type"
                    outlined
                    dense
                    :items="['Alta', 'Media', 'Baja']"
                    label="Items"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn elevation="0" raised @click="dialog = !dialog">
              Cancelar
            </v-btn>

            <v-btn elevation="0" outlined raised type="submit">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </div>
</template>
<script>
export default {
  layout: 'dashboard',

  asyncData ({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error
  }) {
    const { uid } = params

    return { uid }
  },

  data () {
    return {
      dialog: false,
      form: {
        alert: '',
        type: 'Alta'
      },
      formTitle: 'Agregar alerta'
    }
  },

  async fetch ({ store }) {
    try {
      await store.dispatch('getAlerts', { uid: this.uid })
      this.$store.dispatch('getThoughts', { uid: this.uid })
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

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getAlerts', { uid: this.uid })
      this.$store.dispatch('getThoughts', { uid: this.uid })
    }
  },

  methods: {
    close () {
      this.dialog = !this.dialog
    },

    async createAlert () {
      try {
        const { uid } = this.$store.state.authUser
        const { alert, type } = this.form
        const date = new Date().getTime()

        await this.$fire.firestore.collection('alerts').doc().set({
          date,
          alert,
          type,
          uid,
          createdBy: this.uid
        })

        this.close()
      } catch (error) {
        console.log('error', error)
      }
    }
  }
}
</script>
