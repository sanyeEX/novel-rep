module.exports = async (page) => {
  const listClass = {
    list: '#centerm',
    item: '#content > table.grid > tbody > tr > td > div',
    hottext: 'div:nth-child(2) > .hottext',
    url: 'div:nth-child(1) > a'
  }

  await page.waitForSelector(listClass.list, {
    timeout: 0
  }) // 等待列表加载完成
  const novelList = await page.$$(listClass.item) // 获取小说列表

  if (novelList.length === 0) return console.log('当前页面小说为空') // 判断当前页小说是否存在

  const novelListUrl = [] // 筛选创建新的小说链接集合
  // 获取当前列表页 每部小说的链接
  for (const item of novelList) {
    // 判断是否下架
    if (!await item.$(listClass.hottext)) {
      const novelUrl = await item.$eval(listClass.url, element => {
        return element.getAttribute('href')
      })
      novelListUrl.push(novelUrl)
    }
  }
  console.log('获取小说列表成功')
  return novelListUrl
}