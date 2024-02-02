// 启动 koa 服务器

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');

const { Database } = require('./db');
const getSSLCertificateExpirationDate = require('./ssl');

// console.log(Database);
let db = new Database();

// mail
const { Mail } = require('./mail');
// 跨域
app.use(cors());

// 解析请求体
app.use(bodyParser());

// 首页
router.get('/', async (ctx, next) => {
    ctx.body = 'Hello World';
});

// 查询网站
router.get('/website', async (ctx, next) => {
    const websites = await db.queryAllWebsite();
    ctx.body = websites;
});

// rest website
router.post('/website', async (ctx, next) => {
    let { name, host, ssl, desc } = ctx.request.body;
    // name url 不能为空
    if (!name || !host) {
        ctx.status = 400;
        ctx.body = {
            message: 'name and url cannot be empty'
        };
        return;
    }
    const website = await db.addWebsite(name, host, ssl, desc);
    ctx.body = website;
});

// 查询单个网站
router.get('/website/:id', async (ctx, next) => {
    const website = await db.queryWebsite(ctx.params.id);
    ctx.body = website;
});

// 更新网站
router.post('/website/:id', async (ctx, next) => {
    const website = await db.updateWebsite(ctx.params.id, ctx.request.body);
    ctx.body = website;
});

// 删除网站
router.post('/website/delete/:id', async (ctx, next) => {
    const website = await db.deleteWebsite(ctx.params.id);
    ctx.body = website;
});

// login
router.post('/login', async (ctx, next) => {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    // console.log(username, password);
    const token = await db.login(username, password);
    ctx.body = {
        token: token
    };
});

// 用户信息
router.post('/user', async (ctx, next) => {
    ctx.body = ctx.user;
});

// 手动更新网站
router.post('/update', async (ctx, next) => {
    await update_all()
    ctx.body = {
        message: 'update success'
    };
});

// 中间件检查 token
app.use(async (ctx, next) => {
    // 排除 login
    if (ctx.url === '/login') {
        await next();
        return;
    }
    const token = ctx.request.headers.authorization;
    const user = await db.getUserInfo(token);
    // 赋值
    ctx.user = user;
    // if user is null, return 401
    if (!user) {
        ctx.status = 401;
        return;
    }
    await next();
});

// 注册路由
app.use(router.routes());

// 监听服务器5555
app.listen(5555, () => {
    console.log('Server running on http://localhost:5555');
});


let update_all = async () => {
    // 查询所有网站
    const websites = await db.queryAllWebsite();
    // 遍历
    for (let website of websites) {
        // 查询网站的证书
        try {
            const result = await getSSLCertificateExpirationDate(website.host);
            // 更新数据库

            await db.updateWebsite(website.id, {
                ssl: result.expirationDate
            });


            let ssl_expired = result.expirationDate
            // 证书过期时间
            const ssl = new Date(ssl_expired);
            // 距离过期还有多少天
            const days = Math.floor((ssl - new Date()) / 1000 / 60 / 60 / 24);
            // 如果小于30天
            console.log(days, website.name);
            if (days < 10) {
                // 发送邮件
                let mail = new Mail();
                await mail.sendWebsiteMail(website);
            }
        } catch (e) {
            console.log("error", e);
            continue
        }
    }
}

// app 起一个定时任务
// 5分钟检查一次
setInterval(async () => {
    await update_all()
}, 1000 * 60 * 3600);