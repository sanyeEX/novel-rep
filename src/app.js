const puppeteer = require('puppeteer');

const login = require('./login');
const novelUrl = require('./novelUrl');
const novelInfo = require('./novelInfo');
const novelRoll = require('./novelRoll');
const novelChapter = require('./novelChapter');
const createNovel = require('./createNovel');

let start = null;

(async () => {

  const browser = await puppeteer.launch({
    timeout: 99999999,
    headless: false,
  });
  const pages = await browser.pages();
  const page = pages[0]; // 创建第一个分页
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en'
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36')
  let index = 2 // 分页索引
  await page.setDefaultNavigationTimeout(0);

  // 爬取函数
  start = async (isLogin) => {
    await page.goto(`https://www.wenku8.net/modules/article/articlelist.php?page=${index}`, {
      timeout: 0
    });
    // 下一页索引
    index++
    // 判断需要进行登录不
    if (isLogin) {
      await login(page)
    }

    // 获取当前页小说列表
    const novelUrlList = await novelUrl(page)

    const newPage = await browser.newPage() // 创建小说详情页面
    await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36')
    const rollPage = await browser.newPage() // 创建小说目录页面
    await rollPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36')
    const chapterPage = await browser.newPage() // 创建小说章节页面
    await chapterPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36')

    // 循环处理获取过来的小说链接
    for (const item of novelUrlList) {
      const { novelData, directoryUrl } = await novelInfo(newPage, `https://www.wenku8.net/${item}`) // 获取小说基本信息
      const novelRollList =  await novelRoll(rollPage, `https://www.wenku8.net${directoryUrl}`) // 获取小说目录
      const novelContent = await novelChapter(chapterPage, novelRollList, novelData.id) // 获取小说章节

      await createNovel(novelData, novelRollList, novelContent, index - 1) // 创建小说 添加进入数据库
    }
    // 关闭三个页面
    await newPage.close()
    await rollPage.close()
    await chapterPage.close()

    // 下一页
    await start(false)
  }
  // 开始爬取
  await start(true)
})();