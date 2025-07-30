---
date: 2023-10-03
category:
  - 工程化
---
项目搭建配置

<!-- more -->

# 项目搭建

## 1. 英文名称校验cspell

### 1.1安装

```
// 安装
pnpm add cspell --save-dev
// package.json配置
"scripts": {
  "spellcheck": "cspell lint --dot --gitignore --color --cache --show-suggestions \"src/**/*.@(html|js|cjs|mjs|ts|tsx|css|scss|md|vue)\""
}
"devDependencies": {
  "cspell": "6.31.2" //可以直接打这个版本，或者安装最近的
}
```

### 1.2 配置

配置 cspell，需要在项目根目录创建 `cspell.json`

```
{
  "import": ["@cspell/dict-lorem-ipsum/cspell-ext.json"],
  "caseSensitive": false, // 是否区分大小写
  "dictionaries": ["custom-words"], // 单词文件名
  "dictionaryDefinitions": [
    {
      "name": "custom-words",
      "path": "./.cspell/custom-words.txt",
      "addWords": true
    }
  ],
  "ignorePaths": ["**/node_modules/**", "**/dist/**", "**/lib/**", "**/docs/**", "**/stats.html"]
}
```

并在项目根目录创建 .cspell/custom-words.txt，把那些你主观认为是对的的单词放进去，比如：

```
behaviour
Byelide
commitlint
conventionalcommits
optimizelegibility
pinia
tiptap
vuedraggable
vuejs
```

**注意：有时候配置好后，校验仍不通过是因为有缓存，把.cspellcache文件删除再重新运行**

## 2. css样式校验Stylelint

### 2.1 安装

```
// 第一步
npm init stylelint
pnpm create stylelint 
// 第二步
pnpm add stylelint-config-prettier stylelint-config-html  --save-dev
```

或者

```
// package.json
"script": {
    "lint:style": "stylelint **/*.{vue,css} --fix",
},
"devDependencies": {
    "stylelint": "15.10.2",
    "stylelint-config-standard": "34.0.0",
    "stylelint-config-prettier": "9.0.5",
    "stylelint-config-html": "1.1.0",
}
```

### 2.2 配置stylelint.config.js，或者.stylelintrc.json

```
/* eslint-env node */
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier', 'stylelint-config-html/vue']
}
```

## 3. 配置统一命令

```
"scripts": {
    "check": "run-p type-check lint lint:style spellcheck --"
},
// run-p 可以并行执行后续的命令
// 但是后面配置了commitizen后使用run-p会报错，改成pnpm或者npm原始命令
// Unknown option: 'byelide-action:commitizen_path'

"scripts": {
    "check": "pnpm type-check && pnpm lint && pnpm lint:style && pnpm spellcheck --"
},


```

## 4. 提交前执行校验husky

**注意：可以用git commit -m 'init' -n跳过git hook校验这一步，-n，可以git commit -h查看-n指令**

脚本安装

```
// pnpm
pnpm dlx husky-init && pnpm install
// npm
npx husky-init && npm install
```

**It will:**

1. **Add **`prepare` script to `package.json`
2. **Create a sample **`pre-commit` hook that you can edit (by default, `npm test` will run when you commit)
3. **Configure Git hooks path**

**To add another hook use **`husky add`. For example:

```
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

**可以在.husky/pre-commit中添加校验配置**

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "Running pre-commit hook" // echo 在命令行输出指定字符串

pnpm check // 这一行是自己加的，git commit -m的时候执行这一行
```

## 5. 配置提交信息校验commitlint

### 5.1 安装

```
# Install and configure if needed
npm install --save-dev @commitlint/{cli,config-conventional,cz-commitlint}
# For Windows:
npm install --save-dev @commitlint/config-conventional @commitlint/cli @commitlint/cz-commitlint

# Configure commitlint to use conventional config
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

### 5.2 安装commitizen

```
pnpm add commitizen
npm install commitizen
```

### 5.3 配置commitlint.config.js

**参考地址：**[https://blog.csdn.net/qq_21197033/article/details/128609033](https://blog.csdn.net/qq_21197033/article/details/128609033)

```
// module.exports = { extends: ['@commitlint/config-conventional'] }

// eslint-disable-next-line no-undef
module.exports = {
  extends: ['@commitlint/config-conventional'], // extends can be nested
  parserPreset: 'conventional-changelog-conventionalcommits',
  prompt: {
    settings: {},
    messages: {
      skip: ':skip',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'can not be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit'
    },
    types: [
      { value: 'feat', name: 'feat:     ✨  A new feature', emoji: '✨ ' },
      { value: 'fix', name: 'fix:      🐛  A bug fix', emoji: '🐛 ' },
      { value: 'docs', name: 'docs:     📝  Documentation only changes', emoji: '📝 ' },
      {
        value: 'style',
        name: 'style:    💄  Changes that do not affect the meaning of the code',
        emoji: '💄 '
      },
      {
        value: 'refactor',
        name: 'refactor: 📦️   A code change that neither fixes a bug nor adds a feature',
        emoji: '📦️ '
      },
      {
        value: 'perf',
        name: 'perf:     🚀  A code change that improves performance',
        emoji: '🚀 '
      },
      {
        value: 'test',
        name: 'test:     🚨  Adding missing tests or correcting existing tests',
        emoji: '🚨 '
      },
      {
        value: 'build',
        name: 'build:    🛠   Changes that affect the build system or external dependencies',
        emoji: '🛠 '
      },
      {
        value: 'ci',
        name: 'ci:       🎡  Changes to our CI configuration files and scripts',
        emoji: '🎡 '
      },
      {
        value: 'chore',
        name: "chore:    🔨  Other changes that don't modify src or test files",
        emoji: '🔨 '
      },
      { value: 'revert', name: 'revert:   ⏪️  Reverts a previous commit', emoji: ':rewind:' }
    ],
    useEmoji: true,
    confirmColorize: true,
    emojiAlign: 'center',
    questions: {
      scope: {
        description: 'What is the scope of this change (e.g. component or file name)'
      },
      subject: {
        description: 'Write a short, imperative tense description of the change'
      },
      body: {
        description: 'Provide a longer description of the change'
      },
      isBreaking: {
        description: 'Are there any breaking changes?'
      },
      breakingBody: {
        description:
          'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself'
      },
      breaking: {
        description: 'Describe the breaking changes'
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?'
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself'
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)'
      }
    }
  }
}
```

### 5.4 安装git-cz

```
pnpm add git-cz --save-dev
npn i git-cz --save-dev
```

### 5.5 package.json配置

```
"scripts": {
    "commit": "git-cz"
  },
"config": {
    "commitizen": {
      "path": "git-cz" // 指定路径
    }
  },
```

### 5.6 提交命令

**后续提交步骤**

```
git add .
pnpm run commit
```
