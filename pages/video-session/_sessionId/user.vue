<template>
  <Twilio />
</template>

<script>
import Twilio from '../../../components/Twilio/Twilio'
export default {
  name: 'VideoSession',
  head: {
    script: [
      { hid: 'crisp', innerHTML: '' }
    ]
  },
  components: { Twilio },
  layout: 'blank',
  validate({ params: { sessionId } }) {
    return !!sessionId
  },
  fetch({ app: { $fetch }, params: { sessionId } }) {
    return $fetch([{ name: 'VIDEO_SESSION_USER', id: sessionId }])
  }
}
</script>
