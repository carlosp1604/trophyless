const button = document.getElementById('lang-button')
const options = document.getElementById('lang-options')

if (button && options) {
  button.addEventListener('click', () => {
    options.classList.toggle('hidden')
  })

  options.querySelectorAll('div[data-lang]').forEach(option => {
    option.addEventListener('click', () => {
      const lang = (option as HTMLDivElement).dataset.lang

      window.location.href = '/' + lang + window.location.pathname.replace(/^\/(en|es)/, '')
    })
  })

  document.addEventListener('click', (e) => {
    const target = e.target as Node

    if (!document.getElementById('lang-dropdown')?.contains(target)) {
      options.classList.add('hidden')
    }
  })
}