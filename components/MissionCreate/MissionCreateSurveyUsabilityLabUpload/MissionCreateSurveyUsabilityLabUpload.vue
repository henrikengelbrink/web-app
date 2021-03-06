<template>
  <div class="mission-create-survey-usability-lab-upload">
    <div class="mission-create-survey-usability-lab-upload-head">
      <p class="mission-create-survey-usability-lab-upload-headline">
        {{ $t('missionCreate.survey.items.upload.headline', $store.state.locale) }}
      </p>
      <div v-if="item.deviceFrame" class="mission-create-survey-usability-lab-upload-select">
        <p class="mission-create-survey-usability-lab-upload-select-label">
          {{ $t('missionCreate.survey.items.upload.deviceFrameLabel', $store.state.locale) }}
        </p>
        <div class="mission-create-survey-usability-lab-upload-select-input">
          <Select
            title=""
            :options="deviceFrameOptions"
            :value="item.deviceFrame"
            @change="setDeviceFrame"
          />
        </div>
      </div>
    </div>
    <div class="mission-create-survey-usability-lab-upload-dropzone">
      <Dropzone
        :thumbnail-height="160"
        :multi-upload="multiUpload"
        :error="error"
        dispatch-error="missionForm/handleValidationError"
        :disable-error="!showError && !s.showErrors"
        :nav-align-left="!!item.deviceFrame"
        :already-uploaded-files="alreadyUploadedFiles"
        @change="dzChange"
      >
        <template slot="empty">
          <div class="mission-create-survey-usability-lab-upload-dropzone-empty">
            <div class="mission-create-survey-usability-lab-upload-dropzone-empty-icon">
              <IconFileImage />
            </div>
            <div class="mission-create-survey-usability-lab-upload-dropzone-empty-text">
              <p class="mission-create-survey-usability-lab-upload-dropzone-empty-text-title">
                {{
                  multiUpload
                    ? $t('missionCreate.survey.items.upload.emptyTitleMultiUpload', $store.state.locale)
                    : $t('missionCreate.survey.items.upload.emptyTitleSingleUpload', $store.state.locale)
                }}
              </p>
              <p class="mission-create-survey-usability-lab-upload-dropzone-empty-text-subtitle">
                {{
                  multiUpload
                    ? $t('missionCreate.survey.items.upload.emptySubtitleMultiUpload', $store.state.locale)
                    : $t('missionCreate.survey.items.upload.emptySubtitleSingleUpload', $store.state.locale)
                }}
              </p>
            </div>
          </div>
        </template>
        <template slot="custom-bg">
          <div class="mission-create-survey-usability-lab-upload-dropzone-button">
            <ButtonText type="CUSTOM" text="Browse files" :bg-color-class="item.type" />
          </div>
        </template>
      </Dropzone>
    </div>
  </div>
</template>

<script>
import {
  MISSION_SURVEY_USABILITY_LAB_ITEM_DEVICE_FRAMES,
  MISSION_SURVEY_USABILITY_LAB_ITEM_DEVICE_FRAME_LABELS
} from '../../constants'
import Dropzone from '../../_shared/Dropzone/Dropzone'
import ButtonText from '../../_shared/ButtonText/ButtonText'
import Select from '../../_shared/Select/Select'
export default {
  name: 'MissionCreateSurveyUsabilityLabUpload',
  components: { Select, ButtonText, Dropzone },
  props: {
    index: {
      type: Number,
      required: true
    },
    multiUpload: {
      type: Boolean,
      default: false
    },
    minUploads: {
      type: Number,
      default: 1
    }
  },
  data() {
    return { showError: false }
  },
  computed: {
    s() {
      return {
        ...this.$store.state.missionForm,
        survey: this.$store.state.missionFormSurvey
      }
    },
    item() {
      return this.s.survey.items[this.index]
    },
    error() {
      if (this.multiUpload) {
        return this.item.imageMediaIds.length >= this.minUploads ? null : `min ${this.minUploads} required`
      } else {
        return this.item.imageMediaId ? null : 'required'
      }
    },
    deviceFrameOptions() {
      return Object.keys(MISSION_SURVEY_USABILITY_LAB_ITEM_DEVICE_FRAMES)
        .map(deviceFrame => ({
          value: deviceFrame,
          label: MISSION_SURVEY_USABILITY_LAB_ITEM_DEVICE_FRAME_LABELS[deviceFrame]
        }))
    },
    alreadyUploadedFiles() {
      if (this.item.image) {
        return this.item.image
      }
      if (this.item.images) {
        return this.item.images
      }
      return null
    }
  },
  methods: {
    dzChange(value) {
      this.$mpAppHelper.trackMissionForm('uploadImageInteraction', this.$store)
      if (this.multiUpload) {
        this.$store.commit('missionFormSurvey/setItemImageMediaIds', {
          imageMediaIds: value,
          itemIndex: this.index
        })
      } else {
        this.$store.commit('missionFormSurvey/setItemImageMediaId', {
          imageMediaId: value,
          itemIndex: this.index
        })
      }
      if (this.error && !this.showError) {
        this.showError = true
      }
    },
    setDeviceFrame(deviceFrame) {
      this.$store.commit('missionFormSurvey/setItemDeviceFrame', {
        itemIndex: this.index,
        deviceFrame
      })
    }
  }
}
</script>

<style lang="scss">
  @import "MissionCreateSurveyUsabilityLabUpload";
</style>
