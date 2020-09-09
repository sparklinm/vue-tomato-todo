
const findRouter = function (name, router) {
  return router.matched.find((r) => r.name === name)
}


export { findRouter }