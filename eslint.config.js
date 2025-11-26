import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'ts/no-explicit-any': 'error',
  },
})
