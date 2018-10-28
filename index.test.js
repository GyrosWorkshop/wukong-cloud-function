const source = require('./dst/index.js')
const process = source.process

test('http success', async () => {
  const result = await process({
    type: 'HTTP',
    key: 'abcd',
    msg: {
      uri: 'https://www.v2ex.com/api/nodes/show.json?name=python'
    }
  })
  expect(JSON.parse(result).name).toBe('python')
})

test('dns success', async () => {
  const result = await process({
    type: 'DNS',
    key: 'abcd',
    msg: 'www.baidu.com'
  })
  expect(result.length).toBeGreaterThanOrEqual(1)
})
