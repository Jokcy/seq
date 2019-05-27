module.exports = seq

function seq(initialFns) {
  const flow = {}
  const fns = initialFns
    ? Array.isArray(initialFns)
      ? [...initialFns]
      : [initialFns]
    : []

  flow.add = add
  flow.run = run

  return flow

  function add(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected `fn` to be a function, not ' + fn)
    }

    fns.push(fn)

    // 方便链式调用
    return flow
  }

  function run(initialArg) {
    let index = -1

    let input = initialArg

    let finish
    let error

    return new Promise((resolve, reject) => {
      finish = () => resolve(input)
      error = err => reject(err)
      next()
    })

    function next(arg) {
      // 如果有新的参数，设置新的参数
      input = arg || input

      if (index === fns.length - 1) {
        finish()
        return
      }

      const fn = fns[++index]

      if (typeof fn !== 'function') {
        throw new Error('fn must be a function' + (index - 1))
      }

      const result = wrap(fn)(input)

      result.then(next, error)
    }
  }
}

function wrap(fn) {
  return function wrapped(...args) {
    return new Promise((resolve, reject) => {
      try {
        const result = fn(...args)

        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }
}
