<template>
  <div>
    <Device />
  </div>
</template>
<script>
import Device from '~/components/uid/Device'

export default {

  components: {
    Device
  },

  layout: 'dashboard',

  mounted () {
    const { authUser } = this.$store.state
    if (!authUser) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('getDevices', { uid: authUser.uid })
    }
  }

}
</script>
