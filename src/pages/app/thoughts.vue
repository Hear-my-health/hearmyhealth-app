<template>
  <div>
    <v-btn
      elevation="0"
      outlined
      raised
      @click="dialog = !dialog"
    >
      Agregar pensamiento
    </v-btn>

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

    <v-dialog
      v-model="dialog"
      max-width="500px"
      elevation="0"
    >
      <form @submit.prevent="createDoctor">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  md="12"
                >
                  <v-textarea
                    v-model="form.thought"
                    outlined
                    name="input-7-4"
                    label="Pensmiento"
                    value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              elevation="0"
              raised
              @click="dialog = !dialog"
            >
              Cancelar
            </v-btn>

            <v-btn
              elevation="0"
              outlined
              raised
              type="submit"
            >
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
    thoughts () {
      return this.$store.state.thoughts
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getThoughts', { uid: authUser.uid })
    }
  },

  methods: {
    close () {
      this.dialog = !this.dialog
    },

    async createDoctor () {
      try {
        const { uid } = this.$store.state.authUser
        const { thought } = this.form
        const date = new Date().getTime()

        await this.$fire.firestore.collection('thoughts').doc().set({
          date,
          thought,
          uid
        })

        this.close()
      } catch (error) {
        console.log('error', error)
      }
    }
  }
}
</script>
