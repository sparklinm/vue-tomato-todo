import component, { instances } from './component/vue-router-cache-animate'

import { findRouter } from './util'

function getRoutes (tree) {
  function doThis (tree) {
    const obj = {}

    for (let i = 0; i < tree.length; i++) {
      if (tree[i].name) {
        obj[tree[i].name] = 1
      }
      if (tree[i].children && tree[i].children.length) {
        obj[tree[i].name] = doThis(tree[i].children)
      }
    }
    return obj
  }

  return doThis(tree)
}

export default {
  install (vue, { router, options }) {
    const routes = getRoutes(router.options.routes)
    let cacheAfter = null
    const NO_CACHE_FLAG = '_none_'
    let STATUS = 'forward'
    const SESSION_KEY = '_history_pageKeys_'
    let visitHistory = false
    const pageKeys = sessionStorage.getItem(SESSION_KEY)
      ? JSON.parse(sessionStorage.getItem(SESSION_KEY))
      : []
    let pageIndex = -1

    const findInstance = function (from) {
      return from.instances.default.$parent

      // const parentIns = from.instances.default

      // for (const ins of instances) {
      //   if (ins.$parent === parentIns) {
      //     return ins
      //   }
      // }
    }

    function findChangedRouters (from, to) {
      let router = {}

      to.matched.some((match, index) => {
        if (!match.instances.default) {
          router = {
            from: from.matched[index],
            to: match
          }
          return true
        }
      })

      if (!router.from) {
        to.matched.some((match, index) => {
          if (match !== from.matched[index]) {
            router = {
              from: from.matched[index],
              to: match
            }
            return true
          }
        })
      }

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

    const resolveCaches = function (caches, from, to) {
      console.log(from)
      let include = []
      let exclude = []

      caches.forEach((cache) => {
        // toRouter.matched 包含 cachedOn 中任意一个
        // 或者 fromRouter.matched 包含 cachedOn 中任意一个 且 toRouter.name 等于 被缓存路由组件名字
        let canCache = canMatch(
          cache.cachedOn.include,
          cache.cachedOn.exclude,
          to.name
        )

        if (canCache) {
          cache.names.include && (include = include.concat(cache.names.include))
          cache.names.exclude && (exclude = exclude.concat(cache.names.exclude))
          return
        }

        canCache =
          canMatch(cache.cachedOn.include, cache.cachedOn.exclude, from.name) &&
          canMatch(cache.names.include, cache.names.exclude, to.name)

        if (canCache) {
          include.push(to.name)
        }
      })

      let router = from
      const keys = []


      while (router) {
        keys.push(router.name)
        router = router.parent
      }
      console.log(keys)
      console.log(routes)
      let routesNames = []

      if (keys.length === 1) {
        routesNames = routes[keys[0]]
      } else {
        for (let i = keys.length - 1; i > 0; i--) {
          routesNames = routes[keys[i]]
        }
      }

      routesNames = Object.keys(routesNames)
      console.log(routesNames)

      if (include.length && exclude.length) {
        exclude = new Set(exclude)
        include.forEach((item) => {
          exclude.has(item) && exclude.delete(item)
        })

        return {
          exclude: [...exclude]
        }
      }

      if (!include.length && !exclude.length) {
        return {
          include: [NO_CACHE_FLAG],
          exclude: undefined
        }
      }

      return {
        exclude: exclude.length ? [...new Set(exclude)] : undefined,
        include: include.length ? [...new Set(include)] : undefined
      }
    }

    // 路由对应组件的name
    const findRouterCompoentName = function (router) {
      return (
        router &&
        router.matched[router.matched.length - 1].components.default.name
      )
    }

    router.afterEach(() => {
      if (!visitHistory) {
        const key = history.state && history.state.key

        pageKeys.length = pageIndex + 1
        pageKeys.push(key)
        pageIndex = pageKeys.length - 1
      }

      if (cacheAfter) {
        cacheAfter.ins.include = cacheAfter.include
        cacheAfter.ins.exclude = cacheAfter.exclude
        cacheAfter = null
      }
      console.log(STATUS)
    })

    window.addEventListener('popstate', (e) => {
      // 无法判断是前进还是后退
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
      const now = performance.now()

      const changedRouters = findChangedRouters(from, to)

      console.log(changedRouters)
      console.log(from)
      console.log(to)

      if (!changedRouters.from) {
        next()
        return
      }

      const ins = findInstance(changedRouters.from)

      // 后退前进时，一定会得到index
      if (!visitHistory) {
        if (pageIndex === -1) {
          pageIndex = 0
          STATUS = 'refresh'
        } else {
          STATUS = 'forward'
        }
      }

      visitHistory = false

      if (!ins) {
        next()
        return
      }

      if (ins.noCacheOnBack && STATUS === 'back') {
        const name = findRouterCompoentName(from)

        if (name) {
          console.log(name)
          ins.include = undefined
          ins.exclude = ins.exclude || []
          ins.exclude.push(name)
        }
        console.log(performance.now() - now)
        next()
        setTimeout(() => {
          ins.exclude = []
          STATUS = 'forward'
        })

        return
      }

      const { include, exclude } = resolveCaches(
        ins.caches,
        changedRouters.from,
        changedRouters.to
      )

      // 如果已经被缓存，要销毁必须在 next() 之后
      // 如果没有被缓存，要缓存必须在 next() 之前
      if (
        (include && include.includes(changedRouters.from.name)) ||
        (exclude && !exclude.includes(changedRouters.from.name))
      ) {
        ins.exclude = exclude
        ins.include = include
        console.log(performance.now() - now)
        next()
        return
      }

      cacheAfter = {
        ins,
        include,
        exclude
      }
      console.log(performance.now() - now)
      next()
    })

    vue.component('vue-router-cache-animate', component)
  }
}
