import { mount, shallow, createLocalVue } from '@vue/test-utils'
import VueMaterial from 'vue-material'

import HomePage from '@/pages/index.vue'
import { resolvePromises } from '../test-utils/resolvePromises'

// Create an extended 'Vue' constructor
const localVue = createLocalVue()

// Install plugins as normal
localVue.use(VueMaterial)

describe('HomePage', () => {
  // Before each test make sure we include the Vue Material lib
  let wrapper
  beforeEach(() => {
    wrapper = mount(HomePage, {
      localVue,
      mocks: {
        $axios: axios
      }
    })
  })

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('to match Snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  test('it renders newsAPI data', async () => {
    wrapper.vm.$options.asyncData({ app })
    await resolvePromises()

    expect(wrapper.html()).toContain(
      `<md-card-header><div><a>Hello</a></div></md-card-header>`
    )
  })
})
