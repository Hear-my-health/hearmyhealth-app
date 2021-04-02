<template>
  <div>
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in tabs" :key="item.slug" :to="`#${item.slug}`">
        {{ item.slug }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="grey lighten-5">
      <v-tab-item value="dashboard">
        <Dashboard :my-uid="uid" class="mt-3" />
      </v-tab-item>
      <v-tab-item value="data">
        <Data :my-uid="uid" class="mt-3" />
      </v-tab-item>
      <v-tab-item value="devices" class="mt-3">
        <Device :my-uid="uid" />
      </v-tab-item>
      <v-tab-item value="pensamientos">
        <h5 class="text-h5">
          Pensamientos
        </h5>
        <v-timeline dense>
          <v-timeline-item v-for="(thought, ith) in thoughts" :key="ith">
            <v-card class="elevation-1">
              <v-card-title class="headline">
                {{ thought.thought }}
              </v-card-title>
              <v-card-text style="font-size: 1.2rem">
                {{
                  "Fecha: " +
                  formatDateTable(thought.date) +
                  "  Hora: " +
                  formatDateHour(thought.date)

                }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-tab-item>
      <v-tab-item value="alertas">
        <h5 class="text-h5">Alertas</h5>
        <Alert :my-uid="uid" />
        <!--         <v-btn elevation="0" outlined raised @click="dialog = !dialog">

          Agregar alerta
        </v-btn>
        <v-row justify="center" align="center">
          <v-col v-for="(alert, ilt) in alerts" :key="ilt" cols="12">
            <v-card classdark>
              <v-card-title class="headline">
                {{ alert.alert }}
              </v-card-title>
              <v-card-text style="font-size: 1.2rem">
                {{ formatDateTable(alert.date) }}
              </v-card-text>
            </v-card>
            <v-spacer />
          </v-col>
        </v-row> -->
      </v-tab-item>
      <v-tab-item value="profile">
        <Profile :my-uid="uid" class="mt-3" />
      </v-tab-item>
    </v-tabs-items>

    <!--     <v-dialog v-model="dialog" max-width="500px" elevation="0">
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
    </v-dialog> -->
  </div>
</template>
<script>
import Data from "~/components/uid/Data";
import Device from "~/components/uid/Device";
import Dashboard from "~/components/uid/Dashboard";
import Profile from "~/components/uid/Profile";
import Alert from "~/components/uid/Alert";

export default {
  components: {
    Data,
    Device,
    Dashboard,
    Profile,
    Alert,
  },
  layout: "back",
  asyncData({ params }) {
    const { uid } = params;

    return { uid };
  },

  data: (vm) => ({
    dialog: false,
    isEditing: true,
    form: {
      alert: "",
      type: "Alta",
    },
    /*     profile: {
      name: "",
      dni: "",
      clinic_history: "",
      age: "",
      weight: "",
      height: "",
    }, */
    formTitle: "Agregar alerta",
    tab: null,
    tabs: [
      {
        name: "Dashboard",
        slug: "dashboard",
        value: "dashboard",
      },
      {

        name: 'Datos',
        slug: 'datos',
        value: 'datos'
      },
      {
        name: 'Dispositivos',
        slug: 'dispositivos',
        value: 'dispositivos'
      },
      {
        name: 'Pensamientos',
        slug: 'pensamientos',
        value: 'pensamientos'
      },
      {
        name: 'Alertas',
        slug: 'alertas',
        value: 'alertas'
      },
      {
        name: 'Información',
        slug: 'perfil paciente',
        value: 'perfil paciente'
      }
    ],
    text: "loremos",
  }),

  async fetch({ store }) {
    try {
      await store.dispatch("getAlerts", { uid: this.uid });
      await store.dispatch("getThoughts", { uid: this.uid });
      /* await store.dispatch("getDataSet", { uid: this.uid }); */
      await store.dispatch("getDevices", { uid: this.uid });
      /*       await store.dispatch("getUser", { uid: this.uid }); */
    } catch (e) {
      return "error";
    }
  },

  computed: {
    alerts() {
      return this.$store.state.alerts;
    },
    thoughts() {
      return this.$store.state.thoughts;
    },
    /*     user() {
      return this.$store.state.user;
    }, */
  },

  watch: {
    user() {
      this.profile.name = this.user.name;
      this.profile.dni = this.user.dni;
      this.profile.clinic_history = this.user.clinic_history;
      this.profile.age = this.user.age;
      this.profile.weight = this.user.weight;
      this.profile.height = this.user.height;
    },
  },

  mounted() {
    const { authUser } = this.$store.state;
    if (!authUser) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("getAlerts", { uid: this.uid });
      this.$store.dispatch("getThoughts", { uid: this.uid });
      /* this.$store.dispatch("getDataSet", { uid: this.uid }); */
      this.$store.dispatch("getDevices", { uid: this.uid });
      this.$store.dispatch("getUser", { uid: this.uid });
      if (this.user) {
        this.profile.name = this.user.name;
        this.profile.dni = this.user.dni;
        this.profile.clinic_history = this.user.clinic_history;
        this.profile.age = this.user.age;
        this.profile.weight = this.user.weight;
        this.profile.height = this.user.height;
      }
    }
  },

  methods: {
    close() {
      this.dialog = !this.dialog;
    },

    async createAlert() {
      try {
        const { uid } = this.uid;
        const { alert, type } = this.form;
        const date = new Date().getTime();

        await this.$fire.firestore.collection("alerts").doc().set({
          date,
          alert,
          type,
          uid,
          createdBy: this.$store.state.authUser,
        });

        this.close();
      } catch (error) {
        console.log("error", error);
      }
    },

    formatDateTable(item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10);
      return ss;
    },
    formatDateHour(item) {
      const ss = new Date(Number(item)).toISOString().substr(11, 5);
      return ss;
    },
    async updatePatientInfo() {
      try {
        // eslint-disable-next-line camelcase
        const { clinic_history, weight, height } = this.profile;
        await this.$fire.firestore.collection("users").doc(this.uid).update({
          clinic_history,
          weight,
          height,
        });
        this.isEditing = true;
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
</script>
