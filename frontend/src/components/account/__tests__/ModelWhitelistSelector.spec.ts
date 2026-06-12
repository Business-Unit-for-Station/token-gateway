import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ModelWhitelistSelector from '../ModelWhitelistSelector.vue'

const syncUpstreamSupportedModels = vi.fn()

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({
    showError: vi.fn(),
    showSuccess: vi.fn(),
    showInfo: vi.fn(),
  }),
}))

vi.mock('@/api/admin/accounts', () => ({
  accountsAPI: {
    syncUpstreamSupportedModels: (...args: unknown[]) => syncUpstreamSupportedModels(...args),
  },
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

describe('ModelWhitelistSelector', () => {
  it('allows DeepSeek upstream model sync and shows DeepSeek presets', async () => {
    const wrapper = mount(ModelWhitelistSelector, {
      props: {
        modelValue: [],
        platform: 'deepseek',
        accountId: 42,
      },
      global: {
        stubs: {
          Icon: true,
          ModelIcon: true,
        },
      },
    })

    expect(wrapper.text()).toContain('admin.accounts.syncUpstreamModels')

    await wrapper.find('div.cursor-pointer').trigger('click')

    expect(wrapper.text()).toContain('deepseek-chat')
    expect(wrapper.text()).toContain('deepseek-reasoner')
  })
})
