/**
 * jest use babel transform code
 * Hm... May be I should choose another test tool for node
 */
require('regenerator-runtime/runtime')
const seq = require('.')

describe('basic test', () => {
  test('basic seq properties', () => {
    const fns = seq()

    expect(typeof fns.add).toBe('function')
    expect(typeof fns.run).toBe('function')

    const fns1 = fns.add(() => {})

    expect(fns1).toBe(fns)

    const thenable = fns.run(1)

    expect(typeof thenable.then).toBe('function')
  })
})

describe('sync fns', () => {
  test('sync fns', () => {
    // expect(1).toBe(1)
    return seq([x => x + 1, x => x + 3])
      .run(1)
      .then(x => expect(x).toBe(5))
  })

  test('sync fns catch errors', () => {
    return seq([
      x => x + 1,
      x => {
        throw new Error(x)
      },
    ])
      .run(1)
      .catch(err => expect(err.message).toBe('2'))
  })
})

describe('async fns', () => {
  test('promises', () => {
    return seq([x => Promise.resolve(x + 1), x => Promise.resolve(x - 3)])
      .run(5)
      .then(x => expect(x).toBe(3))
  })

  test('async functions', () => {
    return seq([async x => x + 1, async x => x - 3])
      .run(5)
      .then(x => expect(x).toBe(3))
  })

  test('promises reject should be caughter', () => {
    return seq([x => Promise.resolve(x + 1), x => Promise.reject(x + 2)])
      .run(3)
      .then(() => {}, err => expect(err).toBe(6))
  })

  test('async throw error should be caughter', () => {
    return seq([
      async x => x + 1,
      async x => {
        throw x
      },
    ])
      .run(1)
      .catch(err => expect(err).toBe(2))
  })

  test('promise renturn promise', () => {
    return seq([
      x => Promise.resolve(x + 1),
      x => Promise.resolve(Promise.resolve(x - 3)),
    ])
      .run(5)
      .then(x => expect(x).toBe(3))
  })

  test('promise renturn promise which throw', () => {
    return seq([
      x => Promise.resolve(x + 1),
      x =>
        Promise.resolve(
          new Promise(() => {
            throw x - 3
          }),
        ),
    ])
      .run(5)
      .catch(err => expect(err).toBe(3))
  })
})

describe('async and sync', () => {
  test('normal working with sync and async funs', async () => {
    const result = await seq([x => x + 1, x => Promise.resolve(x + 2)]).run(1)
    expect(result).toBe(4)
  })

  test('sync function throws', async () => {
    try {
      await seq([
        x => {
          throw x + 1
        },
        x => Promise.resolve(x + 2),
      ]).run(1)
    } catch (err) {
      expect(err).toBe(2)
    }
  })

  test('sync function throws', async () => {
    try {
      await seq([x => x + 1, x => Promise.reject(x + 2)]).run(1)
    } catch (err) {
      expect(err).toBe(4)
    }
  })
})
