const koa = require('koa')
const Router = require('koa-router')
const axios = require('axios')
const koaBody = require('koa-body');

const mysql=require('./mysql')

const router = new Router();
const app = new koa();
app.use(router.routes()).use(router.allowedMethods())

const logger = require('./log4.js').logger('index')

let get_jingweidu = function (ctx, address) {
    return axios.get('http://restapi.amap.com/v3/geocode/geo', {
        params: {
            key: '4a13ad6baab524a6b6b341f0ffeede8e',
            address: address
        }
    })
}

router.get('/geocode/', async function (ctx, next) {
    await get_jingweidu(ctx, ctx.query.address || '').then(result => {
        let data = result.data;
        if (data.status === '1') {
            let geocode = data.geocodes[0].location.split(',')
            ctx.response.body = {
                code: 1,
                data: {
                    latitude: geocode[1],
                    longitude: geocode[0]
                },
                msg: 'ok',
            }
        } else {
            ctx.response.body = {
                code: -1,
                data: [],
                msg: '请求数据失败'
            }
        }

    }).catch((error) => {
        ctx.response.body = {
            code: -1,
            data: error,
            msg: '请求数据错误'
        }
    })
    ctx.response.type = 'json'
    ctx.response.status = 200
    ctx.response.type = 'json'
})

/*****  获取数据库列表  */
router.get('/api/restful/list/:version/:table_name', async function (ctx, next) {
    let options = {
        table_name: ctx.params.table_name || '',
        query: ctx.query,
    }
    await mysql.mysql_query(options).then(result => {
        logger.debug(`[api] [success] [url:::${ctx.url}] [query:::${JSON.stringify(options.query)}]`);
        ctx.response.body = {
            code: 1,
            data: result,
            msg: 'ok'
        }
    }).catch(error => {
        logger.error(`[api] [error] [url:::${ctx.url}] [query:::${JSON.stringify(options.query)}] [message:::${error}]`);
        ctx.response.body = {
            code: -1,
            data: [],
            msg: error
        }
    });
    ctx.response.status = 200;
    ctx.response.type = 'json';
})

/*** 获取指定列表记录 */
router.get('/api/restful/info/:version/:table_name', async function (ctx, next) {
    let options = {
        table_name: ctx.params.table_name || '',
        query: ctx.query,
    }
    await mysql.mysql_info(options).then(result => {
        logger.debug(`[api] [success] [url:::${ctx.url}] [query:::${JSON.stringify(options.query)}]`);
        ctx.response.body = {
            code: 1,
            data: result[0],
            msg: 'ok'
        }
    }).catch(error => {
        logger.error(`[api] [error] [url:::${ctx.url}] [query:::${JSON.stringify(options.query)}] [message:::${error}]`);
        ctx.response.body = {
            code: -1,
            data: [],
            msg: error
        }
    });
    ctx.response.status = 200;
    ctx.response.type = 'json';
})

/****  更新某条记录 */
router.post('/api/restful/updata/:version/:table_name', koaBody(), async function (ctx, next) {
    let options = {
        table_name: ctx.params.table_name || '',
        query: ctx.request.body,
    }
    await mysql.mysql_change(options).then(result => {
        logger.debug(`[api] [success] [url:::${ctx.url}] [query:::${JSON.stringify(options.query)}]`);
        ctx.response.body = {
            code: 1,
            data: result,
            msg: 'ok'
        }
    }).catch(error => {
        logger.error(`[api] [error] [url:::${ctx.url}] [query:::${JSON.stringify(options.query)}] [message:::${error}]`);
        ctx.response.body = {
            code: -1,
            data: [],
            msg: error
        }
    });
    ctx.response.status = 200;
    ctx.response.type = 'json';
})

/*******   删除某条记录 */
router.get('/api/restful/delete/:version/:table_name',koaBody(), async function (ctx, next) {
    let options = {
        table_name: ctx.params.table_name || '',
        query: ctx.query
    }
    await mysql.mysql_delete(options).then(result => {
        logger.debug(`[api] [success] [url:::${ctx.url}] [query:::${JSON.stringify(options.query)}]`);
        ctx.response.body = {
            code: 1,
            data: [],
            msg: 'ok'
        }
    }).catch(error => {
        logger.error(`[api] [error] [url:::${ctx.url}] [query:::${JSON.stringify(options.query)}] [message:::${error}]`);
        ctx.response.body = {
            code: -1,
            data: [],
            msg: error
        }
    });
    ctx.response.status = 200;
    ctx.response.type = 'json';
})

/*******   新增  */
router.put('/api/restful/new/:version/:table_name', koaBody(), async function (ctx, next) {
    let options = {
        table_name: ctx.params.table_name || '',
        query: ctx.request.body,
    }
    await mysql.mysql_put(options).then(result => {
        ctx.response.body = {
            code: 1,
            data: {
                id: result.insertId
            },
            msg: 'ok'
        }
    }).catch(error => {
        logger.error(`[api] [error] [url:::${ctx.url}] [query:::${JSON.stringify(options.query)}] [message:::${error}]`);
        ctx.response.body = {
            code: -1,
            data: [],
            msg: error
        }
    });
    ctx.response.status = 200;
    ctx.response.type = 'json';
})

app.listen(18787, () => {
    logger.info(`[server] [success] [message:::新建服务成功-18787]`);
})