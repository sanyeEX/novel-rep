const cheerio = require('cheerio')

module.exports = async (page, url) => {
  const rollClass = [
    'body > table',
    'body',
    'table tbody tr td'
  ]
  await page.goto(url, {
    timeout: 0
  })
  await page.waitForSelector(rollClass[0], {
    timeout: 0
  }) // 等待页面加载

  const rollElement = await page.$eval(rollClass[1], element => element.innerHTML) // 获取目录的body Html
  const $ = cheerio.load(rollElement) // 获取目录HTML 使用cheerio操作dom

  let classIndex = 0 // 卷和章节的索引
  const rollUrl = page.url().replace('index.htm', '') // 获取当前链接
  const rollArr = [] // 卷和章节的集合

  // 获取卷中的目录即章节
  $(rollClass[2]).each((index, element) => {
    if ($(element).text().trim().length === 0) return // 判断是否存在空字符
    // 卷-章索引
    if ($(element).attr('class') === 'vcss') classIndex += 1
    // 卷, 章节, 章节链接的集合
    const rollInfo = {
      name: $(element).text(), // 章节或目录的名称其中一个
      rollIndex: classIndex, // 目录索引和章节进行绑定好区分
      url: "" // 每一章的链接
    }
    // 判断子元素是否存在url
    if ($(element).children('a').attr('href')) {
      rollInfo.url = rollUrl + $(element).children('a').attr('href') // 获取章节的链接
    }
    rollArr.push(rollInfo)
  })

  // 进行卷与章节的详细分类
  let newRollArr = []
  for (let i = 0; i < rollArr.length; i++) {
    //新建属性名
    if (Object.keys(newRollArr).indexOf('' + rollArr[i].rollIndex) === -1) {
      newRollArr[rollArr[i].rollIndex] = []
    }
    //对应插入属性值
    newRollArr[rollArr[i].rollIndex].push(rollArr[i])
  }
  newRollArr.splice(0, 1) // 默认删除第一个不然会出现 <1 empty item> 会导致出现问题
  return newRollArr
}