# egg-sequelize-extends
sequelize plugin for Egg.js.

> NOTE: This plugin just for extends egg-sequelize, more documentation please visit https://github.com/eggjs/egg-sequelize.

# Install

```bash
$ npm i --save egg-sequelize-extends
```

## Usage & configuration

- `config.default.js`
配置文件和egg-sequelize一致，只是在它的基础上增加了日志的配置，可以自定义日志打印的级别和文件（egg-sequelize插件的默认打印的日志是info，而且不能调整，不能指定打印到其他文件里，只能关闭），默认打印的位置是appBaseDir/logs/sequelize-sql.log, 另外增加了comment参数支持（原egg-sequelize不支持）

```js
exports.sequelize = {
    logger: {
        level: 'DEBUG',
        dir: '/path/to/sql'
    },
};
```
or
```js
exports.sequelize = {
    logger: {
        level: 'DEBUG',
        file: '/path/to/sql.log'
    },
};
```

- `config/plugin.js`

``` js
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize-extends'
}
```

- 支持在model目录里按模块目录定义model，如下例子：

- `app/model/user/account.js`

``` js
module.exports = (app) => {
    return app.model.define('account', {...}, {
        tableName: 'account'
    });
}

```

- `controller or service`

```js
await this.ctx.model.Account.findById(100);
```

for examples, please visit https://github.com/eggjs/egg-sequelize.
