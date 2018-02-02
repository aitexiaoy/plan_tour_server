const mysql = require('mysql')
const logger = require('./log4.js').logger('mysqljs')
const mysql_config=require('./mysql_config').mysql_config


/******
 * mysql_config
 * 数据库连接配置
 * mysql_config={
 *   host: 'ip',
 *   user: 'user',
 *   password: 'password',
 *   database: 'table_name'
 * }
 * */



let connection = mysql.createConnection(mysql_config)

connection.connect(error => {
    if (error) {
        logger.error(`[mysql] [error] [message:::${error}] [数据库连接失败]`);
        return
    }
    logger.info(`[mysql] [success] [message:::数据库连接成功-${connection.threadId}]`);
})

// connection.end()

/****** 增加数据 */
exports.mysql_put = (options) => {
    return new Promise((resolve, reject) => {
        if (options.table_name != '') {
            connection.query(`desc ${options.table_name}`, function (err, table) {
                if (err) {
                    reject(err.message);
                }
                let table_value = [];
                let table_name = [];
                for (let index in table) {
                    table_name.push(table[index].Field);
                    if (table[index].Type.match('int')) {
                        table_value.push(parseFloat(mysql.escape(options.query[table[index].Field] || 0)));
                    } else {
                        table_value.push(mysql.escape(options.query[table[index].Field] || '').toString());
                    }
                }
                let sql = `INSERT INTO ${options.table_name}(${table_name.toString()}) VALUES(${table_value.toString()})`;
                connection.query(sql, function (err, result) {
                    if (err) {
                        logger.error(`[mysql] [error] [sql:::${sql}] [message:::${err.message}]`);
                        reject(err.message);
                    }
                    logger.info(`[mysql] [success] [sql:::${sql}]`);
                    resolve(result);
                });
            })
        } else {
            reject('请输入正确的接口地址');
        }
    })
}

/**** 查询数据 */
exports.mysql_query = (options) => {
    return new Promise((resolve, reject) => {
        if (options.table_name != '') {
            let query_term = '';
            let array = [];
            for (let index in options.query) {
                array.push(`${index}=${options.query[index]}`);
            }
            if (array.length > 0) {
                query_term = ` where ${array.toString().replace(/[',']/g,' and ')}`
            }
            let sql = `SELECT * FROM ${options.table_name}${query_term}`;
            connection.query(sql, function (err, result) {
                if (err) {
                    logger.error(`[mysql] [error] [sql:::${sql}] [message:::${err.message}]`);
                    reject(err.message);
                }
                logger.info(`[mysql] [success] [sql:::${sql}]`);
                resolve(result);
            });
        } else {
            reject('请输入正确的接口地址');
        }

    })
}

/*** 获取指定列表 */
exports.mysql_info = (options) => {
    return new Promise((resolve, reject) => {
        if (options.table_name != '') {
            if (options.query.id) {
                let sql = `SELECT * FROM  ${options.table_name} where id=${options.query.id}`;
                connection.query(sql, function (err, result) {
                    if (err) {
                        logger.error(`[mysql] [error] [sql:::${sql}] [message:::${err.message}]`);
                        reject(err.message);
                    }
                    logger.info(`[mysql] [success] [sql:::${sql}]`);
                    resolve(result);
                });
            } else {
                reject('请指定正确的id');
            }

        } else {
            reject('请输入正确的接口地址');
        }
    })
}

/*** 删除数据 */
exports.mysql_delete = (options) => {
    return new Promise((resolve, reject) => {
        if (options.table_name != '') {
            if (options.query.id) {
                let sql = `delete from ${options.table_name} where id=${options.query.id}`;
                connection.query(sql, function (err, result) {
                    if (err) {
                        logger.error(`[mysql] [error] [sql:::${sql}] [message:::${err.message}]`);
                        reject(err.message);
                    }
                    logger.info(`[mysql] [success] [sql:::${sql}]`);
                    resolve(reject);
                })
            } else {
                reject('请输入正确的参数id')
            }
        } else {
            reject('请输入正确的接口地址')
        }
    })
}

/*** 修改数据 */
exports.mysql_change = (options) => {
    return new Promise((resolve, reject) => {
        if (options.table_name != '') {
            if (options.query.id) {
                let query_value = [];
                for (let index in options.query) {
                    if (index != 'id') {
                        query_value.push(`${index}=${options.query[index]}`);
                    }
                }
                query_value = query_value.toString();
                let sql = `update ${options.table_name} set ${query_value} where id=${options.query.id};`;
                connection.query(sql, function (err, result) {
                    if (err) {
                        logger.error(`[mysql] [error] [sql:::${sql}] [message:::${err.message}]`);
                        reject(err.message);
                    }
                    logger.info(`[mysql] [success] [sql:::${sql}]`);
                    resolve(result);
                })
            } else {
                reject('请输入正确的参数id');
            }
        } else {
            reject('请输入正确的接口地址');
        }

    })
}
