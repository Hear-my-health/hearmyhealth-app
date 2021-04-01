<template>
  <div>
    <Data />
  </div>
</template>

<script>
import Data from '~/components/uid/Data'
export default {
  components: {
    Data
  },

  layout: 'dashboard',

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getDataSet', { uid: authUser.uid })
    }
  }
}
</script>
