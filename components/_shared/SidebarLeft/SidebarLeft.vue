<template>
  <div class="sidebar-left">
    <div
      :data-aos="!disableAnimation ? 'fade-right' : null"
      data-aos-duration="800"
      data-aos-once="true"
      data-aos-delay="400"
    >
      <div class="sidebar-left-cancel">
        <nuxt-link :to="cancelPath">
          <ButtonCircle type="ARROW_LEFT" />
        </nuxt-link>
      </div>
      <div class="sidebar-left-head">
        <p class="sidebar-left-headline text-overflow-ellipsis" @click="editHead">
          {{ title }}
        </p>
        <div class="sidebar-left-head-edit">
          <IconPencil v-if="!disableEditHead" @click="editHead" />
        </div>
        <div class="sidebar-left-head-description" @click="editHead">
          <pre>{{ description }}</pre>
        </div>
      </div>
      <div class="sidebar-left-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonCircle from '../../_shared/ButtonCircle/ButtonCircle'
export default {
  name: 'SidebarLeft',
  components: { ButtonCircle },
  props: {
    cancelPath: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    disableEditHead: {
      type: Boolean,
      default: false
    },
    disableAnimation: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    editHead() {
      if (!this.disableEditHead) {
        this.$emit('editHead')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "SidebarLeft";
</style>
