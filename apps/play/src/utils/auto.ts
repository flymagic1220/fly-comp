const pages = import.meta.glob('../views/**/*.vue')

const pagesName = Object.keys(pages).map((path) => {
  return path.split('/').pop()?.replace('.vue', '')
})

export { pages, pagesName }
