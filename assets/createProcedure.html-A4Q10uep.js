import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as d,c as l,o as a,a as e,e as t,f as i,b as c,d as r}from"./app-CaxZhZIt.js";const o={},v=e("p",null,"项目搭建配置",-1),u=i(`<h1 id="项目搭建" tabindex="-1"><a class="header-anchor" href="#项目搭建" aria-hidden="true">#</a> 项目搭建</h1><h2 id="_1-英文名称校验cspell" tabindex="-1"><a class="header-anchor" href="#_1-英文名称校验cspell" aria-hidden="true">#</a> 1. 英文名称校验cspell</h2><h3 id="_1-1安装" tabindex="-1"><a class="header-anchor" href="#_1-1安装" aria-hidden="true">#</a> 1.1安装</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 安装
pnpm add cspell --save-dev
// package.json配置
&quot;scripts&quot;: {
  &quot;spellcheck&quot;: &quot;cspell lint --dot --gitignore --color --cache --show-suggestions \\&quot;src/**/*.@(html|js|cjs|mjs|ts|tsx|css|scss|md|vue)\\&quot;&quot;
}
&quot;devDependencies&quot;: {
  &quot;cspell&quot;: &quot;6.31.2&quot; //可以直接打这个版本，或者安装最近的
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-配置" tabindex="-1"><a class="header-anchor" href="#_1-2-配置" aria-hidden="true">#</a> 1.2 配置</h3><p>配置 cspell，需要在项目根目录创建 <code>cspell.json</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>{
  &quot;import&quot;: [&quot;@cspell/dict-lorem-ipsum/cspell-ext.json&quot;],
  &quot;caseSensitive&quot;: false, // 是否区分大小写
  &quot;dictionaries&quot;: [&quot;custom-words&quot;], // 单词文件名
  &quot;dictionaryDefinitions&quot;: [
    {
      &quot;name&quot;: &quot;custom-words&quot;,
      &quot;path&quot;: &quot;./.cspell/custom-words.txt&quot;,
      &quot;addWords&quot;: true
    }
  ],
  &quot;ignorePaths&quot;: [&quot;**/node_modules/**&quot;, &quot;**/dist/**&quot;, &quot;**/lib/**&quot;, &quot;**/docs/**&quot;, &quot;**/stats.html&quot;]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>并在项目根目录创建 .cspell/custom-words.txt，把那些你主观认为是对的的单词放进去，比如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>behaviour
Byelide
commitlint
conventionalcommits
optimizelegibility
pinia
tiptap
vuedraggable
vuejs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意：有时候配置好后，校验仍不通过是因为有缓存，把.cspellcache文件删除再重新运行</strong></p><h2 id="_2-css样式校验stylelint" tabindex="-1"><a class="header-anchor" href="#_2-css样式校验stylelint" aria-hidden="true">#</a> 2. css样式校验Stylelint</h2><h3 id="_2-1-安装" tabindex="-1"><a class="header-anchor" href="#_2-1-安装" aria-hidden="true">#</a> 2.1 安装</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 第一步
npm init stylelint
pnpm create stylelint 
// 第二步
pnpm add stylelint-config-prettier stylelint-config-html  --save-dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// package.json
&quot;script&quot;: {
    &quot;lint:style&quot;: &quot;stylelint **/*.{vue,css} --fix&quot;,
},
&quot;devDependencies&quot;: {
    &quot;stylelint&quot;: &quot;15.10.2&quot;,
    &quot;stylelint-config-standard&quot;: &quot;34.0.0&quot;,
    &quot;stylelint-config-prettier&quot;: &quot;9.0.5&quot;,
    &quot;stylelint-config-html&quot;: &quot;1.1.0&quot;,
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-配置stylelint-config-js-或者-stylelintrc-json" tabindex="-1"><a class="header-anchor" href="#_2-2-配置stylelint-config-js-或者-stylelintrc-json" aria-hidden="true">#</a> 2.2 配置stylelint.config.js，或者.stylelintrc.json</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/* eslint-env node */
module.exports = {
  extends: [&#39;stylelint-config-standard&#39;, &#39;stylelint-config-prettier&#39;, &#39;stylelint-config-html/vue&#39;]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-配置统一命令" tabindex="-1"><a class="header-anchor" href="#_3-配置统一命令" aria-hidden="true">#</a> 3. 配置统一命令</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;scripts&quot;: {
    &quot;check&quot;: &quot;run-p type-check lint lint:style spellcheck --&quot;
},
// run-p 可以并行执行后续的命令
// 但是后面配置了commitizen后使用run-p会报错，改成pnpm或者npm原始命令
// Unknown option: &#39;byelide-action:commitizen_path&#39;

&quot;scripts&quot;: {
    &quot;check&quot;: &quot;pnpm type-check &amp;&amp; pnpm lint &amp;&amp; pnpm lint:style &amp;&amp; pnpm spellcheck --&quot;
},


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-提交前执行校验husky" tabindex="-1"><a class="header-anchor" href="#_4-提交前执行校验husky" aria-hidden="true">#</a> 4. 提交前执行校验husky</h2><p><strong>注意：可以用git commit -m &#39;init&#39; -n跳过git hook校验这一步，-n，可以git commit -h查看-n指令</strong></p><p>脚本安装</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// pnpm
pnpm dlx husky-init &amp;&amp; pnpm install
// npm
npx husky-init &amp;&amp; npm install
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>It will:</strong></p><ol><li>**Add **<code>prepare</code> script to <code>package.json</code></li><li>**Create a sample **<code>pre-commit</code> hook that you can edit (by default, <code>npm test</code> will run when you commit)</li><li><strong>Configure Git hooks path</strong></li></ol><p>**To add another hook use **<code>husky add</code>. For example:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>npx husky add .husky/commit-msg &#39;npx --no -- commitlint --edit &quot;$1&quot;&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>可以在.husky/pre-commit中添加校验配置</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#!/usr/bin/env sh
. &quot;$(dirname -- &quot;$0&quot;)/_/husky.sh&quot;

echo &quot;Running pre-commit hook&quot; // echo 在命令行输出指定字符串

pnpm check // 这一行是自己加的，git commit -m的时候执行这一行
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-配置提交信息校验commitlint" tabindex="-1"><a class="header-anchor" href="#_5-配置提交信息校验commitlint" aria-hidden="true">#</a> 5. 配置提交信息校验commitlint</h2><h3 id="_5-1-安装" tabindex="-1"><a class="header-anchor" href="#_5-1-安装" aria-hidden="true">#</a> 5.1 安装</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># Install and configure if needed
npm install --save-dev @commitlint/{cli,config-conventional,cz-commitlint}
# For Windows:
npm install --save-dev @commitlint/config-conventional @commitlint/cli @commitlint/cz-commitlint

# Configure commitlint to use conventional config
echo &quot;module.exports = { extends: [&#39;@commitlint/config-conventional&#39;] };&quot; &gt; commitlint.config.js
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-安装commitizen" tabindex="-1"><a class="header-anchor" href="#_5-2-安装commitizen" aria-hidden="true">#</a> 5.2 安装commitizen</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>pnpm add commitizen
npm install commitizen
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-配置commitlint-config-js" tabindex="-1"><a class="header-anchor" href="#_5-3-配置commitlint-config-js" aria-hidden="true">#</a> 5.3 配置commitlint.config.js</h3>`,35),m=e("strong",null,"参考地址：",-1),b={href:"https://blog.csdn.net/qq_21197033/article/details/128609033",target:"_blank",rel:"noopener noreferrer"},p=i(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// module.exports = { extends: [&#39;@commitlint/config-conventional&#39;] }

// eslint-disable-next-line no-undef
module.exports = {
  extends: [&#39;@commitlint/config-conventional&#39;], // extends can be nested
  parserPreset: &#39;conventional-changelog-conventionalcommits&#39;,
  prompt: {
    settings: {},
    messages: {
      skip: &#39;:skip&#39;,
      max: &#39;upper %d chars&#39;,
      min: &#39;%d chars at least&#39;,
      emptyWarning: &#39;can not be empty&#39;,
      upperLimitWarning: &#39;over limit&#39;,
      lowerLimitWarning: &#39;below limit&#39;
    },
    types: [
      { value: &#39;feat&#39;, name: &#39;feat:     ✨  A new feature&#39;, emoji: &#39;✨ &#39; },
      { value: &#39;fix&#39;, name: &#39;fix:      🐛  A bug fix&#39;, emoji: &#39;🐛 &#39; },
      { value: &#39;docs&#39;, name: &#39;docs:     📝  Documentation only changes&#39;, emoji: &#39;📝 &#39; },
      {
        value: &#39;style&#39;,
        name: &#39;style:    💄  Changes that do not affect the meaning of the code&#39;,
        emoji: &#39;💄 &#39;
      },
      {
        value: &#39;refactor&#39;,
        name: &#39;refactor: 📦️   A code change that neither fixes a bug nor adds a feature&#39;,
        emoji: &#39;📦️ &#39;
      },
      {
        value: &#39;perf&#39;,
        name: &#39;perf:     🚀  A code change that improves performance&#39;,
        emoji: &#39;🚀 &#39;
      },
      {
        value: &#39;test&#39;,
        name: &#39;test:     🚨  Adding missing tests or correcting existing tests&#39;,
        emoji: &#39;🚨 &#39;
      },
      {
        value: &#39;build&#39;,
        name: &#39;build:    🛠   Changes that affect the build system or external dependencies&#39;,
        emoji: &#39;🛠 &#39;
      },
      {
        value: &#39;ci&#39;,
        name: &#39;ci:       🎡  Changes to our CI configuration files and scripts&#39;,
        emoji: &#39;🎡 &#39;
      },
      {
        value: &#39;chore&#39;,
        name: &quot;chore:    🔨  Other changes that don&#39;t modify src or test files&quot;,
        emoji: &#39;🔨 &#39;
      },
      { value: &#39;revert&#39;, name: &#39;revert:   ⏪️  Reverts a previous commit&#39;, emoji: &#39;:rewind:&#39; }
    ],
    useEmoji: true,
    confirmColorize: true,
    emojiAlign: &#39;center&#39;,
    questions: {
      scope: {
        description: &#39;What is the scope of this change (e.g. component or file name)&#39;
      },
      subject: {
        description: &#39;Write a short, imperative tense description of the change&#39;
      },
      body: {
        description: &#39;Provide a longer description of the change&#39;
      },
      isBreaking: {
        description: &#39;Are there any breaking changes?&#39;
      },
      breakingBody: {
        description:
          &#39;A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself&#39;
      },
      breaking: {
        description: &#39;Describe the breaking changes&#39;
      },
      isIssueAffected: {
        description: &#39;Does this change affect any open issues?&#39;
      },
      issuesBody: {
        description:
          &#39;If issues are closed, the commit requires a body. Please enter a longer description of the commit itself&#39;
      },
      issues: {
        description: &#39;Add issue references (e.g. &quot;fix #123&quot;, &quot;re #123&quot;.)&#39;
      }
    }
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-安装git-cz" tabindex="-1"><a class="header-anchor" href="#_5-4-安装git-cz" aria-hidden="true">#</a> 5.4 安装git-cz</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>pnpm add git-cz --save-dev
npn i git-cz --save-dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-5-package-json配置" tabindex="-1"><a class="header-anchor" href="#_5-5-package-json配置" aria-hidden="true">#</a> 5.5 package.json配置</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;scripts&quot;: {
    &quot;commit&quot;: &quot;git-cz&quot;
  },
&quot;config&quot;: {
    &quot;commitizen&quot;: {
      &quot;path&quot;: &quot;git-cz&quot; // 指定路径
    }
  },
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-6-提交命令" tabindex="-1"><a class="header-anchor" href="#_5-6-提交命令" aria-hidden="true">#</a> 5.6 提交命令</h3><p><strong>后续提交步骤</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git add .
pnpm run commit
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,8);function h(g,q){const n=d("ExternalLinkIcon");return a(),l("div",null,[v,t(" more "),u,e("p",null,[m,e("a",b,[c("https://blog.csdn.net/qq_21197033/article/details/128609033"),r(n)])]),p])}const _=s(o,[["render",h],["__file","createProcedure.html.vue"]]);export{_ as default};
