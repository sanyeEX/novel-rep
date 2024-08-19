module.exports = async (page) => {
  // 登录用户名密码
  const userInfo = {
    username: '',
    password: ''
  }

  // 需要使用的元素
  const loginClass = {
    name: "#content > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > input",
    pwd: "#content > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > input",
    click: "#content > form > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > input",
    a: "#msgboard > div > div.blockcontent > a"
  }

  await page.type(loginClass.name, userInfo.username) // 自动输入用户名
  await page.type(loginClass.pwd, userInfo.password) // 自动输入密码

  await page.click(loginClass.click) // 按下登录按钮
  await page.waitForSelector(loginClass.a, { timeout: 3000 }) // 等待出现自动跳转按钮
  await page.click(loginClass.a) // 点击跳转
  console.log('登录成功')
}
