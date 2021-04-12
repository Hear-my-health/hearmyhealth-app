<template>
  <div>
    <v-btn elevation="0" outlined raised @click="open">
      Agregar pensamiento
    </v-btn>

    <h5 class="text-h6">
      Pensamientos
    </h5>
    <v-timeline dense>
      <v-timeline-item v-for="(thought, ith) in thoughts" :key="ith">
        <v-card class="elevation-1">
          <div v-if="thought.name">
            <img
              :src="`/images/${thought.name}.svg`"
              alt="google-auth"
              style="width: 48px; height: 48px"
            >
          </div>
          <v-card-title class="headline">
            {{ thought.date }}
          </v-card-title>
          <v-card-text>
            {{ thought.thought }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>

    <v-dialog v-model="dialog" max-width="500px" elevation="0">
      <form @submit.prevent="createThought">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col v-for="(item, index) in moods" :key="index" cols="4">
                  <v-card
                    v-model="mood"
                    elevation="1"
                    class="justify-center text-center pt-2"
                    @click="select(item)"
                  >
                    <img
                      :src="`/images/${item.name}${
                        item.select ? '-select' : ''
                      }.svg`"
                      alt="google-auth"
                      style="width: 48px; height: 48px"
                    >
                  </v-card>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="thought"
                    outlined
                    name="input-7-4"
                    label="Pensamiento"
                    required
                    :error-messages="thoughtErrors"
                    @input="$v.thought.$touch()"
                    @blur="$v.thought.$touch()"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn elevation="0" raised @click="close">
              Cancelar
            </v-btn>

            <v-btn elevation="0" outlined raised type="submit" @click="submit">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  layout: 'dashboard',
  validations: {
    thought: { required, minLength: minLength(3) },
    mood: { required }
  },
  data () {
    return {
      dialog: false,
      thought: '',
      mood: null,
      form: {
        thought: ''
      },
      formTitle: 'Agregar pensamiento',
      moods: [
        {
          id: 1,
          name: 'sad',
          value: 0,
          select: false
        },
        {
          id: 2,
          name: 'sceptic',
          value: 0.5,
          select: false
        },
        {
          id: 3,
          name: 'happy',
          value: 1,
          select: false
        }
      ]
    }
  },

  computed: {
    thoughts () {
      return this.$store.state.thoughts
    },
    thoughtErrors () {
      const errors = []
      if (!this.$v.thought.$dirty) {
        return errors
      }
      !this.$v.thought.minLength &&
        errors.push(
          'La mensaje del pensamiento debe tener 3 caracteres como mínimo'
        )
      !this.$v.thought.required &&
        errors.push('El mensaje del pensamiento es requerido')
      return errors
    },
    moodErrors () {
      const errors = []
      if (!this.$v.mood.$dirty) {
        return errors
      }
      !this.$v.mood.required &&
        errors.push(
          'El estado de ánimo del pensamiento es requerido, seleccione uno'
        )
      return errors
    }
  },

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getValues')
      this.$store.dispatch('getThoughts', { uid: authUser.uid })
    }
  },

  methods: {
    submit () {
      this.$v.$touch()
    },
    close () {
      this.dialog = false
      this.$v.$reset()
      this.thought = ''
      this.mood = null
    },
    open () {
      this.dialog = true
    },

    select (item) {
      const ss = this.moods.map((e) => {
        e.select = e.id === item.id
        return e
      })
      this.moods = ss
    },

    async selectMood (item) {
      const { uid } = this.$store.state.authUser

      const obj = {
        dataSourceId: '',
        dataTypeName: 'app.web.hear-my-health.mood.segment',
        endTimeMillis: '',
        endTimeNanos: '',
        originDataSourceId: '',
        point: item,
        startTimeMillis: '',
        startTimeNanos: '',

        value: item.value,

        name: item.name,
        modifiedTimeMillis: '',
        activityType: ''
      }
      const stateSleep = this.getState(item)

      await this.$fire.firestore
        .collection('dataSet')
        .doc()
        .set({
          uid,
          ...obj,
          state: stateSleep
        })
    },

    getState (obj) {
      const { value } = obj
      if (value >= 0) {
        const dd = this.$store.state.values.find(
          v => v.dataTypeName === obj.dataTypeName
        )
        if (value >= dd.minSalud && value <= dd.maxSalud) {
          return 'green'
        }
        if (value >= dd.minAcept && value <= dd.maxAcept) {
          return 'yellow'
        }
        return 'red'
      } else {
        return 'not'
      }
    },

    async createThought () {
      console.log('gaaa')
      const ss = this.moods.filter(e => e.select)

      if (ss.length) {
        try {
          const item = ss[0]
          const { uid } = this.$store.state.authUser
          const { thought } = this
          const date = new Date().getTime()
          console.log('gaaa')
          if (!thought || thought.length < 3) {
            this.dialog = true
          } else {
            await this.$fire.firestore
              .collection('thoughts')
              .doc()
              .set({
                date,
                thought,
                uid,
                ...item
              })
            const obj = {
              dataSourceId: '',
              dataTypeName: 'app.web.hear-my-health.mood.segment',
              endTimeMillis: date,
              endTimeNanos: '',
              originDataSourceId: '',
              point: item,
              startTimeMillis: date,
              startTimeNanos: '',

              value: item.value,

              name: item.name,
              modifiedTimeMillis: '',
              activityType: ''
            }

            const stateSleep = this.getState(obj)
            await this.$fire.firestore
              .collection('dataSet')
              .doc()
              .set({
                uid,
                ...obj,
                state: stateSleep
              })
            console.log('gaaa')
            this.close()
          }
        } catch (error) {
          return error
        }
      }
    }
  }
}
</script>
