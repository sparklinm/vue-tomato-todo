import component from './component/vue-router-cache-animate'

function getRoutes (tree) {
  function resolve (tree) {
    const obj = {}

    for (let i = 0; i < tree.length; i++) {
      if (tree[i].name) {
        obj[tree[i].name] = 1
      }
      if (tree[i].children && tree[i].children.length) {
        obj[tree[i].name] = resolve(tree[i].children)
      }
    }
    return obj
  }

  return resolve(tree)
}

// find vue-router-cache-animate component instance from router
function findInstance (from) {
  return from.instances.default.$parent
}

// find changed routers
function findChangedRouters (from, to) {
  let router = {}

  to.matched.some((match, index) => {
    if (match !== from.matched[index]) {
      router = {
        from: from.matched[index],
        to: match
      }
      return true
    }
  })

  return router
}

function isRegExp (reg) {
  return Object.prototype.toString.call(reg) === '[object RegExp]'
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.includes(name)
  }
  if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  }
  if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function canMatch (include, exclude, value) {
  if (!include && !exclude) {
    return true
  }

  return (
    (include && matches(include, value)) ||
    (exclude && !matches(exclude, value))
  )
}

// router component name
function findRouterCompoentName (router) {
  return (
    router && router.matched[router.matched.length - 1].components.default.name
  )
}

function getComponentName (component) {
  return component && component.$options._componentTag
}

function animate (ins, from, to) {
  ins.transitions.some((transition) => {
    let animation = ''

    // no 'to' and no 'from
    if (!transition.to && !transition.from) {
      animation = 'forward'
    } else if (
      !transition.to &&
      (transition.from.include || transition.from.exclude)
    ) {
      // no 'to' but has 'from'
      if (
        canMatch(transition.from.include, transition.from.exclude, from.name) &&
        !canMatch(transition.from.include, transition.from.exclude, to.name)
      ) {
        animation = 'forward'
      } else if (
        !canMatch(
          transition.from.include,
          transition.from.exclude,
          from.name
        ) &&
        canMatch(transition.from.include, transition.from.exclude, to.name)
      ) {
        animation = 'back'
      }
    } else {
      if (
        canMatch(transition.from.include, transition.from.exclude, from.name) &&
        canMatch(transition.to.include, transition.to.exclude, to.name)
      ) {
        animation = 'forward'
      } else if (
        canMatch(transition.from.include, transition.from.exclude, to.name) &&
        canMatch(transition.to.include, transition.to.exclude, from.name)
      ) {
        animation = 'back'
      }
    }

    if (animation === 'forward' && transition.name) {
      ins.transitionName = transition.name
      ins.css = true
    } else if (animation === 'back' && transition.reverseName) {
      ins.transitionName = transition.reverseName
      ins.css = true
    } else {
      ins.transitionName = ''
      ins.css = false
    }
  })
}

export default {
  install (vue, { router, options }) {
    const NO_CACHE_FLAG = '_none_'
    let STATUS = 'forward'
    const SESSION_KEY = '_history_pageKeys_'
    const routes = getRoutes(router.options.routes)
    let cacheAfterEnter = null
    let visitHistory = false
    const pageKeys = sessionStorage.getItem(SESSION_KEY)
      ? JSON.parse(sessionStorage.getItem(SESSION_KEY))
      : []
    let pageIndex = -1

    // resolve caches prop
    function resolveCaches (caches, from, to) {
      let include = []
      let exclude = []

      caches.some((cache) => {
        // to.name matches 'cache.cachedOn' list
        let canCache = canMatch(
          cache.cachedOn.include,
          cache.cachedOn.exclude,
          to.name
        )

        if (canCache) {
          if (!cache.names.include && !cache.names.exclude) {
            include = ['all']
            return true
          }
          cache.names.include && (include = include.concat(cache.names.include))
          cache.names.exclude && (exclude = exclude.concat(cache.names.exclude))
          return false
        }

        // from.name matches 'cache.cachedOn' list and to.name matches 'cache.names' list
        canCache =
          canMatch(cache.cachedOn.include, cache.cachedOn.exclude, from.name) &&
          canMatch(cache.names.include, cache.names.exclude, to.name)

        if (canCache) {
          include.push(to.name)
        }
      })

      // find all names at the same level as the current router
      let router = from
      const keys = []
      let routesNames = routes

      while (router) {
        keys.push(router.name)
        router = router.parent
      }
      for (let i = keys.length - 1; i > 0; i--) {
        routesNames = routes[keys[i]]
      }

      if (include && include[0] === 'all') {
        return Object.keys(routesNames)
      }

      if (exclude.length) {
        exclude = new Set(exclude)
        include.forEach((item) => {
          exclude.has(item) && exclude.delete(item)
        })
        for (const key in routesNames) {
          if (exclude.has(key)) {
            delete routesNames[key]
          }
        }
        return Object.keys(routesNames)
      }

      if (!include.length) {
        return [NO_CACHE_FLAG]
      }

      return include
    }

    window.addEventListener('popstate', (e) => {
      const key = e.state && e.state.key
      const index = pageKeys.lastIndexOf(key)

      if (index > -1) {
        if (pageIndex === -1) {
          STATUS = 'refresh'
        } else {
          if (index > pageIndex) {
            STATUS = 'forward'
          } else if (index < pageIndex) {
            STATUS = 'back'
          } else {
            STATUS = 'refresh'
          }
        }
        pageIndex = index
        visitHistory = true
      }
    })

    window.addEventListener('unload', () => {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(pageKeys))
    })

    router.beforeEach(function (to, from, next) {
      const changedRouters = findChangedRouters(from, to)

      if (!visitHistory) {
        if (pageIndex === -1) {
          pageIndex = 0
          STATUS = 'refresh'
        } else {
          STATUS = 'forward'
        }
      }

      if (!changedRouters.from) {
        next()
        return
      }

      const ins = findInstance(changedRouters.from)

      if (!ins || getComponentName(ins) !== 'vue-router-cache-animate') {
        next()
        return
      }

      animate(ins, changedRouters.from, changedRouters.to)

      if (ins.noCacheOnBack && STATUS === 'back') {
        const name = findRouterCompoentName(from)

        if (name) {
          const include = ins.include.concat()
          const index = include.indexOf(name)

          if (index > -1) {
            include.splice(index, 1)
            cacheAfterEnter = {
              ins,
              include
            }
          }
        }
        visitHistory = false
        next()
        return
      }

      const include = resolveCaches(
        ins.caches,
        changedRouters.from,
        changedRouters.to
      )

      // if the current router will be cached, component must be cached and then destroyed
      // otherwise, component must be destroyed and then remove from keep-alive caches
      if (include.length && include.includes(changedRouters.from.name)) {
        ins.include = include
        next()
      } else {
        cacheAfterEnter = {
          ins,
          include
        }
        next()
      }
    })

    router.afterEach(() => {
      if (!visitHistory) {
        const key = history.state && history.state.key

        pageKeys.length = pageIndex + 1
        pageKeys.push(key)
        pageIndex = pageKeys.length - 1
      }

      if (cacheAfterEnter) {
        cacheAfterEnter.ins.include = cacheAfterEnter.include
        cacheAfterEnter = null
      }
    })

    vue.component('vue-router-cache-animate', component)
  }
}
