<template>
  <div>
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from "~/components/uid/Dashboard";
export default {
  components: {
    Dashboard,
  },

  layout: "dashboard",

  mounted() {
    const { authUser } = this.$store.state;
    if (!authUser) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("getDataSet", { uid: authUser.uid });
    }
  },
};
</script>
