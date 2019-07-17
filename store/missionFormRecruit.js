import { MISSIONS, MISSION_RECRUIT_STUDY_TYPES } from '../components/constants'

const COMPANY_LOCATION_ID = 'COMPANY'

const defaultState = {
  studyType: MISSION_RECRUIT_STUDY_TYPES.USER_INTERVIEW,
  duration: null,
  location: null,
  locationId: null,
  locationFormOpened: false,
  sessions: [],
  activeCalendarDay: null,
  sessionErrorPopup: false,
  submittedPopup: false,
  pricing: null
}

export const state = () => (defaultState)

export const getters = {
  pricingChecksum: state => ({ missionForm, missionFormPersona }) => {
    const { duration } = state
    const { participants } = missionForm
    const { minAge, maxAge, genders, countries, languages, deviceSkills, specialCriteria } = missionFormPersona
    return JSON.stringify({
      participants,
      duration,
      minAge,
      maxAge,
      genders,
      countries,
      languages,
      deviceSkills,
      specialCriteria: specialCriteria.length
    })
  }
}

export const mutations = {
  init(state, { company, missionType }) {
    for (const key in defaultState) {
      state[key] = defaultState[key]
    }
    if (missionType === MISSIONS.IN_HOUSE) {
      state.duration = 45
    } else if (missionType === MISSIONS.REMOTE) {
      state.duration = 30
    }
    const { name, street, houseNumber, addressDescription, zipCode, city, country } = company
    state.location = { name, street, houseNumber, addressDescription, zipCode, city, country }
    state.locationId = COMPANY_LOCATION_ID
  },
  setStudyType(state, studyType) {
    state.studyType = studyType
  },
  setDuration(state, duration) {
    state.duration = duration
  },
  setLocation(state, location) {
    state.locationId = location.id ? location.id : COMPANY_LOCATION_ID
    state.location = location
  },
  openLocationForm(state) {
    state.locationFormOpened = true
  },
  closeLocationForm(state) {
    state.locationFormOpened = false
  },
  addSession(state, session) {
    const sessions = state.sessions.slice()
    sessions.push(session)
    state.sessions = sessions
  },
  changeSession(state, changedSession) {
    const sessions = state.sessions.slice()
    const toChange = sessions.filter(s => s.id === changedSession.id)[0]
    const { start, end } = changedSession
    toChange.start = start
    toChange.end = end
    state.sessions = sessions
  },
  removeSession(state, sessionId) {
    state.sessions = state.sessions.filter(s => s.id !== sessionId)
  },
  resetSessions(state) {
    state.sessions = []
  },
  setActiveCalendarDay(state, date) {
    state.activeCalendarDay = date
  },
  showSessionErrorPopup(state) {
    state.sessionErrorPopup = true
  },
  hideSessionErrorPopup(state) {
    state.sessionErrorPopup = false
  },
  showSubmittedPopup(state) {
    state.submittedPopup = true
  },
  hideSubmittedPopup(state) {
    state.submittedPopup = false
  },
  setPricing(state, pricing) {
    state.pricing = pricing
  }
}

export const actions = {
  fetchPricing({ state, commit }, { globalGetters, missionForm, missionFormPersona }) {
    if (globalGetters['missionForm/participantsError']) {
      return
    }
    return new Promise((resolve, reject) => {
      const url = missionForm.type === MISSIONS.IN_HOUSE
        ? '/pricing/inhouse'
        : '/pricing/remote'
      const { duration } = state
      const { participants } = missionForm
      const { minAge, maxAge, languages, genders, countries, deviceSkills, specialCriteria } = missionFormPersona

      this.$axios({
        method: 'post',
        url,
        data: {
          demographicData: {
            minAge,
            maxAge,
            languages,
            genders,
            countries,
            deviceSkills
          },
          specialCriteria: specialCriteria.map(sc => sc.value),
          duration,
          participants: parseInt(participants)
        }
      })
        .then(({ data }) => {
          commit('setPricing', data)
          resolve()
        })
        .catch(reject)
    })
  }
}