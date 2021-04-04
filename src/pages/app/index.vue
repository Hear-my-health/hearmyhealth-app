<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" md="10">
        <v-toolbar flat class="grey lighten-5">
          <v-toolbar-title class="headline"> Diario </v-toolbar-title>
          <v-spacer />
          <v-btn elevation="0" outlined raised @click="dialog = !dialog">
            Nueva entrada
          </v-btn>
        </v-toolbar>
      </v-col>

      <v-col cols="12" md="10">
        <v-timeline dense>
          <v-timeline-item v-for="(thought, ith) in thoughts" :key="ith" small>
            <v-card class="elevation-0 blue-grey lighten-5">
              <v-card-title class="title font-weight-regular">
                <img
                  :src="`/images/${thought.name}.svg`"
                  alt="google-auth"
                  style="width: 32px; height: 32px"
                  class="mr-3"
                />
                {{ thought.thought }}
              </v-card-title>
              <v-card-text class="subtitle-1 font-weight-light">
                {{ formatDateT(thought.date) }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>

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
                    />
                  </v-card>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="form.thought"
                    outlined
                    name="input-7-4"
                    label="Escribe cómo te sientes"
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

            <v-btn elevation="0" outlined raised type="submit"> Guardar </v-btn>
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
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
export default {
  layout: "dashboard",
  mixins: [validationMixin],
  validations: {
    dni: { required, minLength: minLength(8), maxLength: maxLength(8) },
    dateOfBirth: { required },
  },
  data() {
    return {
      noData: false,
      dni: "",
      dateOfBirth: "",
      info: {
        dni: "",
        dateOfBirth: "",
      },
      dialog: false,
      form: {
        thought: "",
      },
      formTitle: "¿Cómo te va?",
      moods: [
        {
          id: 1,
          name: "sad",
          value: 0,
          select: false,
        },
        {
          id: 2,
          name: "sceptic",
          value: 0.5,
          select: false,
        },
        {
          id: 3,
          name: "happy",
          value: 1,
          select: false,
        },
      ],
    };
  },

  computed: {
    thoughts() {
      return this.$store.state.thoughts.filter((e) => !!e.thought);
    },

    auth() {
      return this.$store.state.authUser || null;
    },

    user() {
      return this.$store.state.user;
    },

    dniErrors() {
      const errors = [];
      if (!this.$v.dni.$dirty) {
        return errors;
      }
      (!this.$v.dni.maxLength || !this.$v.dni.minLength) &&
        errors.push("El DNI debe tener 8 caracteres");
      /* !this.$v.dni.minLength && errors.push("El DNI debe tener 8 caracteres");  */
      !this.$v.dni.required && errors.push("El DNI es requerido");
      return errors;
    },
    dateOfBirthErrors() {
      const errors = [];
      if (!this.$v.dateOfBirth.$dirty) {
        return errors;
      }
      !this.$v.dateOfBirth.required &&
        errors.push("La fecha de nacimiento es requerida");
      return errors;
    },
  },

  watch: {
    user() {
      if (!this.user.dni || !this.user.dateOfBirth) {
        this.noData = true;
      } else {
        this.noData = false;
      }
    },
  },

  mounted() {
    const { authUser } = this.$store.state;
    if (!authUser) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("getValues");
      this.$store.dispatch("getThoughts", { uid: authUser.uid });
      this.$store.dispatch("getUser", { uid: authUser.uid });
    }
  },

  methods: {
    submit() {
      this.$v.$touch();
    },
    async updateInfo() {
      try {
        const { uid } = this.$store.state.authUser;
        const { dni, dateOfBirth } = this;
        await this.$fire.firestore.collection("users").doc(uid).update({
          dni,
          dateOfBirth,
        });
        this.noData = false;
      } catch (error) {
        this.$store.dispatch("SET_MESSAGE", { message: error });
      }
    },
    formatDateT(item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10);
      return ss;
    },
    formatHour(item) {
      const ss = new Date(Number(item)).toISOString().substr(11, 5);
      return ss;
    },
    select(item) {
      const ss = this.moods.map((e) => {
        e.select = e.id === item.id;
        return e;
      });
      this.moods = ss;
    },

    getState(obj) {
      const { value } = obj;
      if (value >= 0) {
        const dd = this.$store.state.values.find(
          (v) => v.dataTypeName === obj.dataTypeName
        );
        if (value >= dd.minSalud && value <= dd.maxSalud) {
          return "green";
        }
        if (value >= dd.minAcept && value <= dd.maxAcept) {
          return "yellow";
        }
        return "red";
      } else {
        return "not";
      }
    },

    close() {
      this.dialog = !this.dialog;
    },

    async createThought() {
      const moodSelect = this.moods.filter((e) => e.select);
      if (moodSelect.length) {
        try {
          const item = moodSelect[0];
          const { uid } = this.$store.state.authUser;
          const { thought } = this.form;
          const date = new Date().getTime();

          await this.$fire.firestore
            .collection("thoughts")
            .doc()
            .set({
              date,
              thought,
              uid,
              ...item,
            });
          const obj = {
            dataSourceId: "",
            dataTypeName: "app.web.hear-my-health.mood.segment",
            endTimeMillis: date,
            endTimeNanos: "",
            originDataSourceId: "",
            point: item,
            startTimeMillis: date,
            startTimeNanos: "",

            value: item.value,

            name: item.name,
            modifiedTimeMillis: "",
            activityType: "",
          };
          const stateSleep = this.getState(obj);
          await this.$fire.firestore
            .collection("dataSet")
            .doc()
            .set({
              uid,
              ...obj,
              stateSleep,
            });
          this.close();
          this.form.thought = "";
          this.select("");
        } catch (error) {
          return error;
        }
      }
    },
  },
};
</script>
