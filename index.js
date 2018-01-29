const koa = require('koa')
const Router = require('koa-router')
const axios = require('axios')

const router = new Router()

const app = new koa()

let get_jingweidu = function (ctx, address) {
    return axios.get('http://restapi.amap.com/v3/geocode/geo', {
        params: {
            key: '4a13ad6baab524a6b6b341f0ffeede8e',
            address: address
        }
    })
}

router.get('/geocode/', async function (ctx,next) {
    await get_jingweidu(ctx, ctx.query.address||'').then(result => {
        console.log(result)
        let data=result.data;
        if(data.status==='1'){
            let geocode=data.geocodes[0].location.split(',')
            ctx.response.body = {
                code: 1,
                data:{
                    latitude:geocode[0],
                    longitude:geocode[1]
                } ,
                msg: 'ok',
            }
        }
        else{
            ctx.response.body = {
                code: -1,
                data: [],
                msg: '请求数据失败'
            }
        }
        
    }).catch((error) => {
        console.log('error', error)
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

app.use(router.routes()).use(router.allowedMethods())

app.listen(18787, () => {
    console.log('新建服务成功')
})