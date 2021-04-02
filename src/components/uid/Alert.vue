<template>
  <v-container>
    <v-row>
      <v-btn elevation="0" outlined raised @click="dialog = !dialog">
        Agregar alerta
      </v-btn>
    </v-row>
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
    </v-row>
    <v-dialog v-model="dialog" max-width="500px" elevation="0">
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
                    v-model="form.alert"
                    outlined
                    name="input-7-4"
                    label="Alerta"
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
  </v-container>
</template>

<script>
export default {
  props: ["myUid"],
  data() {
    return {
      dialog: false,
      form: {
        alert: "",
        type: "Alta",
      },
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
    close() {
      this.dialog = !this.dialog;
    },
    formatDateTable(item) {
      const ss = new Date(Number(item)).toISOString().substr(0, 10);
      return ss;
    },
    async createAlert() {
      try {
        const { alert, type } = this.form;
        const date = new Date().getTime();
        await this.$fire.firestore.collection("alerts").add({
          date: date,
          alert: alert,
          type: type,
          uid: this.uid,
          createdBy: this.$store.state.authUser.uid,
        });

        this.close();
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
</script>
