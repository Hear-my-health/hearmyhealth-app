<template>
  <v-container>
    <v-row justify="center" align="center" class="mt-3">
      <v-col cols="10" sm="8" md="4">
        <v-container v-if="!noAccount">
          <h1>Inicio de sesión - Especialista</h1>
          <form @submit.prevent="signInWithEmailAndPassword">
            <div>
              <p class="mb-1">Correo electrónico</p>
              <v-text-field
                v-model="acc.email"
                placeholder="Correo electrónico"
                color="black"
                outlined
                dense
                type="email"
              />
            </div>
            <div>
              <p class="mb-1">Contraseña</p>
              <v-text-field
                v-model="acc.password"
                placeholder="Contraseña"
                color="black"
                outlined
                dense
                type="password"
              />
            </div>
            <p v-if="errors" class="red--text">
              Usuario o contraseña no válido
            </p>
            <v-btn
              elevation="0"
              large
              outlined
              raised
              type="submit"
              :disabled="submitted"
            >
              Iniciar sesión
            </v-btn>
          </form>
        </v-container>
        <v-container v-if="noAccount">
          <h1>Registro de Usuario</h1>
          <form @submit.prevent="createWithEmailAndPassword">
            <div>
              <p class="mb-1">Nombres</p>
              <v-text-field
                v-model="name"
                placeholder="Nombres"
                color="black"
                outlined
                dense
                required
                type="text"
                :error-messages="nameErrors"
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
              />
            </div>
            <div>
              <p class="mb-1">Correo electrónico</p>
              <v-text-field
                v-model="email"
                placeholder="Correo electrónico"
                color="black"
                outlined
                dense
                required
                type="email"
                :error-messages="emailErrors"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              />
            </div>
            <div>
              <p class="mb-1">Contraseña</p>
              <v-text-field
                v-model="password"
                placeholder="Contraseña"
                color="black"
                outlined
                dense
                required
                type="password"
                :error-messages="passwordErrors"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
              />
            </div>
            <p v-if="errors" class="red--text">
              {{ error }}
            </p>
            <v-btn
              elevation="0"
              large
              outlined
              raised
              type="submit"
              @click="submit"
              :disabled="submitted"
            >
              Registrarse
            </v-btn>
          </form>
        </v-container>
        <p v-if="!noAccount">
          Puedes crear un cuenta aquí<span
            style="cursor: pointer"
            class="blue--text"
            @click="noAccount = !noAccount"
          >
            Registrarse</span
          >
        </p>
        <p v-if="noAccount">
          Inicia sesión aquí<span
            style="cursor: pointer"
            class="blue--text"
            @click="noAccount = !noAccount"
          >
            Iniciar sesión</span
          >
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";
export default {
  layout: "free",
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(6) },
    name: { required, minLength: minLength(2) },
  },
  data() {
    return {
      submitted: false,
      errors: false,
      error: "",
      email: "",
      password: "",
      name: "",
      acc: {
        email: "",
        password: "",
      },
      noAccount: false,
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) {
        return errors;
      }
      !this.$v.name.minLength &&
        errors.push("El nombre debe tener 2 caracteres como mínimo");
      !this.$v.name.required && errors.push("El nombre es requerido");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) {
        return errors;
      }
      !this.$v.email.email && errors.push("Ingrese un correo válido");
      !this.$v.email.required && errors.push("El correo es requerido");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) {
        return errors;
      }
      !this.$v.password.minLength &&
        errors.push("La contraseña debe tener 6 caracteres como mínimo");
      !this.$v.password.required && errors.push("La contraseña es requerida");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
    },
    reset() {
      this.$v.$reset();
      this.password = "";
    },
    createWithEmailAndPassword() {
      this.submitted = true;
      const date = new Date().getTime();
      if (
        !this.name ||
        !this.email ||
        !this.password ||
        this.name.length < 2 ||
        this.password.length < 6
      ) {
        this.errors = true;
        this.error = "Completa los campos de manera correcta";
        setTimeout(
          () => ((this.errors = false), (this.submitted = false)),
          4000
        );
      } else {
        try {
          this.$fire.auth
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((res) => {
              this.$fire.firestore
                .collection("users")
                .doc(res.user.uid)
                .set({
                  email: this.email,
                  name: this.name,
                  createDate: date,
                  uid: res.user.uid,
                  role: "admin",
                })
                .then((res) => {
                  this.$router.push("/back");
                })
                .catch((err) => {
                  this.submitted = false;

                  this.$store.dispatch("SET_MESSAGE", { message: err });
                });
            })
            .catch((err) => {
              console.log(err);
              if (err.code === "auth/email-already-in-use") {
                this.error =
                  "Este correo electrónico ya se encuentra registrado";
              }
              this.errors = true;
              setTimeout(
                () => ((this.errors = false), (this.submitted = false)),
                4000
              );
            });
        } catch (error) {
          this.$store.dispatch("SET_MESSAGE", { message: error });
        }
      }
    },

    signInWithEmailAndPassword() {
      this.submitted = true;
      try {
        this.$fire.auth
          .signInWithEmailAndPassword(this.acc.email, this.acc.password)
          .then((res) => {
            this.$router.push("/back");
          })
          .catch((err) => {
            this.submitted = false;
            this.errors = true;
            setTimeout(() => (this.errors = false), 5000);
            this.$store.dispatch("SET_MESSAGE", { message: err });
          });
      } catch (error) {
        this.$store.dispatch("SET_MESSAGE", { message: error });
      }
    },
  },
};
</script>
