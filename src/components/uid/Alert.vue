<template>
  <v-container>
    <v-row justify="start" align="center"> Paciente: {{ user.name }} </v-row>
    <v-row>
      <v-btn elevation="0" outlined raised @click="open">
        Agregar alerta
      </v-btn>
    </v-row>
    <v-row justify="center" align="center">
      <v-col v-for="(alert, ilt) in alerts" :key="ilt" cols="12">
        <v-card classdark>
          <v-card-title class="headline">
            <v-row>
              <v-col>Nivel: {{ alert.type }} | {{ alert.alert }}</v-col>
            </v-row>
          </v-card-title>
          <v-card-text style="font-size: 1.2rem">
            Fecha: {{ formatDateTable(alert.date) }}
            <span v-if="alert.doctorName">
              | Doctor: {{ alert.doctorName }}</span>
            <span v-if="alert.doctorSpecialty">
              - {{ alert.doctorSpecialty }}</span>
          </v-card-text>
        </v-card>
        <v-spacer />
      </v-col>
    </v-row>
    <v-dialog
      v-if="dialog"
      v-model="dialog"
      max-width="500px"
      elevation="0"
      persistent
    >
      <form @submit.prevent="createAlert">
        <v-card>
          <v-card-title>
            <span class="headline">Agregar alerta</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="alert"
                    outlined
                    name="input-7-4"
                    label="Alerta"
                    required
                    :error-messages="alertErrors"
                    @input="$v.alert.$touch()"
                    @blur="$v.alert.$touch()"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-select
                    v-model="type"
                    outlined
                    :items="types"
                    required
                    label="Tipo de alerta"
                    :error-messages="typeErrors"
                    @input="$v.type.$touch()"
                    @blur="$v.type.$touch()"
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
            <v-btn elevation="0" outlined raised type="submit" @click="submit">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  props: ["myUid"],
  validations: {
    alert: { required, minLength: minLength(3) },
    type: { required },
  },
  data() {
    return {
      dialog: false,
      doctorSpecialty: this.$props.specialty,
      types: ["Alta", "Media", "Baja"],
      alert: "",
      type: null,
      uid: this.$props.myUid,
    };
  },
  async fetch({ store }) {
    try {
      await store.dispatch("getAlerts", { uid: this.uid });
      await store.dispatch("getUser", { uid: this.uid });
    } catch (e) {
      return "error";
    }
  },
  computed: {
    auth() {
      return this.$store.state.authUser || null;
    },
    alerts() {
      return this.$store.state.alerts;
    },
    user() {
      return this.$store.state.user || null;
    },
    alertErrors() {
      const errors = [];
      if (!this.$v.alert.$dirty) {
        return errors;
      }
      !this.$v.alert.minLength &&
        errors.push(
          "La mensaje de la alerta debe tener 3 caracteres como mínimo"
        );
      !this.$v.alert.required &&
        errors.push("El mensaje de la alerta es requerido");
      return errors;
    },
    typeErrors() {
      const errors = [];
      if (!this.$v.type.$dirty) {
        return errors;
      }
      !this.$v.type.required &&
        errors.push("El tipo de alerta es requerida, seleccione una");
      return errors;
    },
  },
  mounted() {
    const { authUser } = this.$store.state;
    if (!authUser) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("getAlerts", { uid: this.uid });
      this.$store.dispatch("getUser", { uid: this.uid });
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
    },
    close() {
      this.dialog = false;
    },
    cleanFields() {
      this.$v.$reset();
      this.alert = "";
      this.type = null;
    },
    closeAndClean() {
      this.dialog = false;
      this.$v.$reset();
      this.alert = "";
      this.type = null;
    },
    open() {
      this.dialog = true;
    },
    formatDateTable(item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10);
      return ss;
    },
    async createAlert() {
      try {
        const { alert, type } = this;
        if (!alert || !type || alert.length < 3) {
          this.dialog = true;
        } else {
          this.close();
          const date = new Date().getTime();
          await this.$fire.firestore.collection("alerts").add({
            date,
            alert,
            type,
            doctorName: localStorage.getItem("doctorName"),
            doctorSpecialty: localStorage.getItem("doctorSpecialty"),
            uid: this.uid,
            createdBy: this.$store.state.authUser.uid,
          });
          this.cleanFields();
        }
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
</script>
