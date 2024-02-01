// 加载db orm
const Sequelize = require('sequelize');
// 加载 env，用于获取数据库连接信息
require('dotenv').config();
// JWT token
const jwt = require('jsonwebtoken');
// sha1
const crypto = require('crypto');
class Database {
    constructor() {
        this.createDb();
    }
    async createDb() {
        //lunch local sqlite3 db
        // const sequelize = new Sequelize({
        //     dialect: 'sqlite',
        //     storage: './db.sqlite3'
        // });
        console.log(process.env.DB_HOST);
        // lunch mysql db, ssl_monitor 
        const sequelize = new Sequelize({
            // lunch mysql db
            dialect: 'mysql',
            // host env DB_HOST
            host: process.env.DB_HOST,
            port: 3306,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        })



        //定义表结构，网站表，网站名，网站url，网站ssl到期时间，描述
        const Website = sequelize.define('website', {
            name: Sequelize.STRING,
            host: {
                type: Sequelize.STRING,
                unique: true
            },
            ssl: Sequelize.DATE,
            desc: Sequelize.STRING
        });


        //定义模型
        this.Website = Website;
        // 定义用户表，用户名，密码
        const User = sequelize.define('user', {
            username: Sequelize.STRING,
            password: Sequelize.STRING
        });
        // 同步表结构
        await sequelize.sync()
        // 定义模型
        this.User = User;

        // 插入默认用户
        this.User.findOrCreate({
            where: {
                username: 'admin',
                // sha1 process.env.ADMIN_PASS
                password: crypto.createHash('sha1').update(process.env.ADMIN_PASS).digest('hex')
            }
        });
    }

    // 添加网站
    addWebsite(name, host, ssl, desc = null) {
        return this.Website.create({
            name: name,
            host: host,
            ssl: ssl,
            desc: desc
        });
    }

    // 删除网站
    deleteWebsite(id) {
        return this.Website.destroy({
            where: {
                id: id
            }
        });
    }

    // 更新网站
    updateWebsite(id, data) {
        return this.Website.update(data, {
            where: {
                id: id
            }
        });
    }

    // 查询网站
    queryWebsite(id) {
        return this.Website.findAll({
            where: {
                id: id
            }
        });
    }

    // 查询所有网站
    queryAllWebsite() {
        return this.Website.findAll();
    }

    // 查询所有网站
    queryAllWebsiteByPage(page, pageSize) {
        return this.Website.findAll({
            offset: (page - 1) * pageSize,
            limit: pageSize
        });
    }

    // login
    async login(username, password) {
        // username 和 password 不能为空
        if (!username || !password) {
            return null;
        }
        // password sha1
        let pwd = crypto.createHash('sha1').update(password).digest('hex')
        let user = await this.User.findOne({
            where: {
                username: username,
                password: pwd
            }
        });
        // console.log(user);
        if (user) {
            return jwt.sign({
                username: user.username,
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
        }
        return null
    }

    // verify token
    getUserInfo(token) {
        // remove Bearer
        if (!token) {
            return null;
        }
        token = token.replace('Bearer ', '');
        console.log(token);
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

exports.Database = Database;