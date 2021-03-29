<template>
  <v-row justify="center" align="center">
    <v-col v-if="isClient" cols="12" sm="8" md="6">
      <div v-if="auth">
        <v-avatar color="primary" size="64" class="mt-5 mb-7">
          <v-img :src="auth.photoURL" />
        </v-avatar>
        <!--         <div>
          <p class="mb-1">UID</p>
          <v-text-field
            v-model="auth.uid"
            placeholder="UID"
            color="black"
            outlined
            dense
            type="text"
            disabled
          />
        </div>
        <div>
          <p class="mb-1">Correo</p>
          <v-text-field
            v-model="auth.email"
            placeholder="Correo"
            outlined
            color="black"
            dense
            type="email"
            disabled
          />
        </div> -->

        <!-- <div>
            <p class="mb-1">Nombres</p>
            <v-text-field
              v-model="auth.providerData.displayName"
              placeholder="Nombres"
              color="black"
              outlined
              dense
              type="text"
              required
            />
          </div> -->
        <form @submit.prevent="updateInfo">
          <div>
            <p class="mb-1">Nombres</p>
            <v-text-field
              v-model="form.name"
              placeholder="Nombres"
              value="name"
              color="black"
              outlined
              dense
              type="text"
              :disabled="isEditing"
            />
          </div>
          <div v-if="user.role === 'user'">
            <div>
              <p class="mb-1">DNI</p>
              <v-text-field
                v-model="form.dni"
                placeholder="DNI"
                color="black"
                outlined
                dense
                type="text"
                :disabled="isEditing"
              />
            </div>
            <div>
              <v-row>
                <v-col>
                  <p class="mb-1">N° historia clínica</p>
                  <v-text-field
                    v-model="form.clinicHistory"
                    placeholder="N° historia clínica"
                    color="black"
                    outlined
                    dense
                    type="text"
                    :disabled="isEditing"
                  />
                </v-col>
                <v-col>
                  <p class="mb-1">Peso</p>
                  <v-text-field
                    v-model="form.weight"
                    placeholder="Peso"
                    color="black"
                    outlined
                    dense
                    type="text"
                    :disabled="isEditing"
                  />
                </v-col>
                <v-col>
                  <p class="mb-1">Altura</p>
                  <v-text-field
                    v-model="form.height"
                    placeholder="Altura"
                    color="black"
                    outlined
                    dense
                    type="text"
                    :disabled="isEditing"
                  />
                </v-col>
              </v-row>
            </div>
            <div>
              <v-row>
                <v-col>
                  <p class="mb-1">Fecha de nacimiento</p>
                  <v-text-field
                    v-model="form.dateOfBirth"
                    placeholder="Fecha de nacimiento"
                    color="black"
                    outlined
                    dense
                    type="text"
                    :disabled="isEditing"
                  />
                </v-col>
              </v-row>
            </div>
          </div>
          <v-row>
            <!--             <v-col>
              <v-btn
                v-if="isEditing === false"
                elevation="0"
                large
                outlined
                raised
                type="submit"
              >
                Actualizar
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                v-if="isEditing === false"
                elevation="0"
                large
                outlined
                raised
                @click="isEditing = !isEditing"
              >
                Cancelar
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                v-if="isEditing === true"
                elevation="0"
                large
                outlined
                raised
                type="button"
                @click="isEditing = !isEditing"
              >
                Editar
              </v-btn>
            </v-col> -->
            <v-col>
              <v-btn elevation="0" large outlined raised @click="signOut">
                Cerrar sesión
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  layout: "dashboard",
  middleware: "authenticated",

  data() {
    return {
      isClient: false,
      isEditing: true,
      form: {
        name: "",
        dni: "",
        clinicHistory: "",
        dateOfBirth: "",
        weight: "",
        height: "",
      },
    };
  },

  computed: {
    auth() {
      return this.$store.state.authUser || null;
    },
    user() {
      return this.$store.state.user || null;
    },
  },

  watch: {
    user() {
      this.form.name = this.user.name;
      this.form.dni = this.user.dni;
      this.form.clinicHistory = this.user.clinicHistory;
      this.form.dateOfBirth = this.user.dateOfBirth;
      this.form.weight = this.user.weight;
      this.form.height = this.user.height;
    },
  },

  mounted() {
    this.isClient = true;
    const { authUser } = this.$store.state;
    if (!authUser) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("getUser", { uid: authUser.uid });
    }
    if (this.user) {
      this.form.name = this.user.name;
      this.form.dni = this.user.dni;
      this.form.clinicHistory = this.user.clinicHistory;
      this.form.dateOfBirth = this.user.dateOfBirth;
      this.form.weight = this.user.weight;
      this.form.height = this.user.height;
    }
  },

  methods: {
    async signOut() {
      try {
        await this.$fireModule.auth().signOut();
        this.$router.push("/");
      } catch (error) {
        console.log("error", error);
      }
    },
    async updateInfo() {
      console.log(this.auth.uid);
      try {
        const { uid } = this.auth;
        const {
          name,
          dni,
          clinicHistory,
          dateOfBirth,
          weight,
          height,
        } = this.form;
        await this.$fire.firestore.collection("users").doc(uid).update({
          name: name,
          dni: dni,
          clinicHistory: clinicHistory,
          dateOfBirth: dateOfBirth,
          weight: weight,
          height: height,
        });
        this.isEditing = true;
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
</script>
