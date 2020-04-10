# falsework-3.0

> 项目脚手架-3.0

## 编辑工具

-   使用 `VSCode`
-   安装 `Prettier - Code formatter` `Vetur` 插件 用于格式化代码
-   安装 `EditorConfig for VS Code` 插件 应用`.editorconfig`文件

## 安装项目依赖项

```
npm install
```

### 本地运行

```
npm run serve
```

### 打包到测试环境

```
npm run build-test
```

### 打包到正式环境

```
npm run build
```

### 项目 alias 配置

-   `@` => `src`
-   `@config` => `src、config`
-   `@api` => `src/api`
-   `@assets` => `src/assets`
-   `@common` => `src/common`
-   `@com` => `src/components`
-   `@filters` => `src/filters`
-   `@router` => `src/router`
-   `@store` => `src/store`
-   `@store-m` => `src/store/modules`
-   `@utils` => `src/utils`
-   `@views` => `src/views`

### 仓库管理

-   所有提交均需书写提交内容具体事项（重要）

### 开发注意事项

-   脚手架配置不得修改，修改脚手架需通过内部钉钉群向脚手架管理人员提 issues 由管理人员修订
-   `vuex` 一律按模块创建文件夹 内含有 `index.js` 及 `mutation-types.js`
-   `vuex` 模块内需添加 `namespaced: true` 参数使其成为带命名空间的模块
-   `vuex` 非异步处理使用 `mutations` 异步处理使用`action`
-   `api`需按模块分类创建文件夹
-   `api`必填字段需经过 api 工具内的验证函数 `checkPrams` 验证

### 打包注意事项

-   api 地址保存在 `src/config/config.api.js` 文件内
