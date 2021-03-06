<template>
  <div class="button-text" :class="[type, { noMargin }, bgColorClass]" @click="onClick">
    <div v-show="disabled" class="button-text-disabled" />
    <button
      class="button-text-item"
      :class="[{disabled, leftArrowActive, rightArrowActive, iconActive: !!icon}, type]"
      :style="{ backgroundColor: bgColor }"
    >
      <span v-if="!!icon">
        <IconLinkExternal v-if="icon === ICONS.LINK_EXTERNAL" class="button-text-item-icon" />
      </span>
      <IconArrowLeft v-if="leftArrowActive" class="button-text-item-arrow" />
      <span class="button-text-item-text">{{ text }}</span>
      <IconArrowRight v-if="rightArrowActive" class="button-text-item-arrow" />
    </button>
  </div>
</template>

<script>
const TYPES = {
  BLUE: 'BLUE',
  BLUE_BORDER: 'BLUE_BORDER',
  GREY: 'GREY',
  GREY_DELETE: 'GREY_DELETE',
  CUSTOM: 'CUSTOM'
}

const ARROWS = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
}

const ICONS = {
  LINK_EXTERNAL: 'LINK_EXTERNAL'
}

export default {
  name: 'ButtonText',
  props: {
    text: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: TYPES.BLUE,
      validator: value => Object.keys(TYPES).includes(value)
    },
    arrow: {
      type: String,
      default: null,
      validator: value => Object.keys(ARROWS).includes(value)
    },
    icon: {
      type: String,
      default: null,
      validator: value => Object.keys(ICONS).includes(value)
    },
    noMargin: {
      type: Boolean,
      default: false
    },
    bgColorClass: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      TYPES,
      ARROWS,
      ICONS
    }
  },
  computed: {
    leftArrowActive() {
      return this.arrow && this.arrow === ARROWS.LEFT
    },
    rightArrowActive() {
      return this.arrow && this.arrow === ARROWS.RIGHT
    }
  },
  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('click')
      } else {
        this.$emit('disabledClick')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "ButtonText";
</style>
