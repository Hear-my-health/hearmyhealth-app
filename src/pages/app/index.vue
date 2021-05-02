<template>
  <div v-if="userType === 'user'">
    <v-row justify="center" align="center">
      <v-col cols="12" md="10">
        <v-toolbar flat class="grey lighten-5">
          <v-toolbar-title class="headline">
            Diario
          </v-toolbar-title>
          <v-spacer />
          <v-btn elevation="0" outlined raised @click="dialog = !dialog">
            Nueva entrada
          </v-btn>
        </v-toolbar>
      </v-col>

      <v-col cols="12" md="10">
        <v-timeline dense>
          <v-timeline-item v-for="(thoug, ith) in thoughts" :key="ith" small>
            <v-card class="elevation-0 blue-grey lighten-5">
              <v-card-title class="title font-weight-regular">
                <img
                  :src="`/images/${thoug.name}.svg`"
                  alt="google-auth"
                  style="width: 32px; height: 32px"
                  class="mr-3"
                >
                {{ thoug.thought }}
              </v-card-title>
              <v-card-text class="subtitle-1 font-weight-light">
                {{ formatDateT(thoug.date) }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px" elevation="0" persistent>
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
                  <p v-if="noMood" class="red--text">
                    Seleccione un estado de ánimo
                  </p>
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
            <v-btn elevation="0" raised @click="closeAndClean">
              Cancelar
            </v-btn>

            <v-btn
              elevation="0"
              outlined
              raised
              type="submit"
              @click="submitThought"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>

    <!-- AGE AND DNI VERIFICATION -->
    <v-dialog
      v-if="noData === true && user.role === 'user' && auth.uid === user.uid"
      v-model="info"
      max-width="500px"
      elevation="0"
    >
      <form @submit.prevent="updateInfo">
        <v-card>
          <v-card-title>
            <span class="headline">Actualice su DNI y Fecha de nacimiento</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="dni"
                    outlined
                    label="DNI"
                    required
                    :error-messages="dniErrors"
                    @input="$v.dni.$touch()"
                    @blur="$v.dni.$touch()"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="dateOfBirth"
                    type="date"
                    outlined
                    label="Fecha de nacimiento"
                    required
                    :error-messages="dateOfBirthErrors"
                    @input="$v.dateOfBirth.$touch()"
                    @blur="$v.dateOfBirth.$touch()"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn type="submit" elevation="0" outlined raised @click="submit">
              Actualizar
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  layout: 'dashboard',
  validations: {
    dni: { required, minLength: minLength(8), maxLength: maxLength(8) },
    dateOfBirth: { required },
    thought: { required, minLength: minLength(3) }
  },
  data () {
    return {
      userType: '',
      thought: '',
      noMood: false,
      noData: false,
      dni: '',
      dateOfBirth: '',
      info: {
        dni: '',
        dateOfBirth: ''
      },
      dialog: false,
      form: {
        thought: ''
      },
      formTitle: '¿Cómo te va?',
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
      return this.$store.state.thoughts.filter(e => !!e.thought)
    },

    auth () {
      return this.$store.state.authUser || null
    },

    user () {
      return this.$store.state.user
    },

    dniErrors () {
      const errors = []
      if (!this.$v.dni.$dirty) {
        return errors
      }
      (!this.$v.dni.maxLength || !this.$v.dni.minLength) &&
        errors.push('El DNI debe tener 8 caracteres')
      !this.$v.dni.required && errors.push('El DNI es requerido')
      return errors
    },
    dateOfBirthErrors () {
      const errors = []
      if (!this.$v.dateOfBirth.$dirty) {
        return errors
      }
      !this.$v.dateOfBirth.required &&
        errors.push('La fecha de nacimiento es requerida')
      return errors
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
    }
  },

  watch: {
    user () {
      localStorage.setItem('role', this.user.role)
      if (!this.user.dni || !this.user.dateOfBirth) {
        this.noData = true
      } else {
        this.noData = false
      }
    }
  },

  async mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      await this.$store.dispatch('getUser', { uid: authUser.uid })
      const { user } = this.$store.state
      if (user) {
        this.userType = user.role
        if (this.userType === 'admin') {
          this.$router.push('/back')
        } else {
          this.$store.dispatch('getValues')
          this.$store.dispatch('getThoughts', { uid: authUser.uid })
          this.$store.dispatch('getUser', { uid: authUser.uid })
        }
      } else {
        this.$router.push('/')
      }
    }
  },

  methods: {
    submitThought () {
      this.$v.$touch()
    },
    submit () {
      this.$v.$touch()
    },
    close () {
      this.dialog = false
    },
    clean () {
      this.$v.$reset()
      this.thought = ''
      this.select('')
      this.noMood = false
    },
    closeAndClean () {
      this.dialog = false
      this.$v.$reset()
      this.thought = ''
      this.select('')
      this.noMood = false
    },
    open () {
      this.dialog = true
    },
    async updateInfo () {
      try {
        const { uid } = this.$store.state.authUser
        const { dni, dateOfBirth } = this
        await this.$fire.firestore.collection('users').doc(uid).update({
          dni,
          dateOfBirth
        })
        this.noData = false
      } catch (error) {
        this.$store.dispatch('SET_MESSAGE', { message: error })
      }
    },
    formatDateT (item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10)
      return ss
    },
    formatHour (item) {
      const ss = new Date(Number(item)).toISOString().substr(11, 5)
      return ss
    },

    select (item) {
      const ss = this.moods.map((e) => {
        e.select = e.id === item.id
        return e
      })
      this.moods = ss
      this.noMood = false
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
      const moodSelect = this.moods.filter(e => e.select)
      if (moodSelect.length) {
        try {
          this.close()
          const item = moodSelect[0]
          const { uid } = this.$store.state.authUser
          const { thought } = this
          const date = new Date().getTime()
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
          }
          this.clean()
        } catch (error) {
          return error
        }
      } else {
        this.noMood = true
      }
    }
  }
}
</script>
