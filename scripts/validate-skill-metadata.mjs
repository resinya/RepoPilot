#!/usr/bin/env node
/**
 * 校验 skill 元数据，供 CI 调用（node scripts/validate-skill-metadata.mjs）。
 *
 * 四条检查：
 *   1. skills/ 下每个顶层目录都必须含 SKILL.md
 *   2. SKILL.md 的 YAML frontmatter 必须有 name 与 description
 *   3. frontmatter 的 name 必须与目录名完全一致 —— 不一致时 --skill 参数会失效
 *   4. skills/ 之外不得出现 SKILL.md —— CLI 在标准位置找不到 skill 时会递归
 *      全仓库搜索，文档站里的示例文件会被误当成第二个 skill 装进用户机器
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SKILLS_DIR = join(ROOT, 'skills')
const IGNORE = new Set(['node_modules', '.git', '.next', 'out', '.turbo', '.workbuddy'])
const errors = []

/** 递归收集文件路径，跳过忽略目录 */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE.has(entry)) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

/** 抽取 --- 包裹的 frontmatter，返回原始文本 */
function readFrontmatter(file) {
  const text = readFileSync(file, 'utf8').replace(/\r\n?/g, '\n')
  if (!text.startsWith('---')) return null
  const end = text.indexOf('\n---', 3)
  return end === -1 ? null : text.slice(3, end)
}

/** 从 frontmatter 取顶层字段，支持 >- 折叠的多行 description */
function getField(fm, key) {
  const lines = fm.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(new RegExp(`^${key}:\\s*(.*)$`))
    if (!m) continue
    if (m[1] === '>-' || m[1] === '>' || m[1] === '') {
      const buf = []
      for (let j = i + 1; j < lines.length; j++) {
        if (/^\S/.test(lines[j])) break
        buf.push(lines[j].trim())
      }
      return buf.join(' ').trim()
    }
    return m[1].trim()
  }
  return null
}

// ---- 检查 1/2/3：skills/ 下的每个顶层目录 ----
let skillCount = 0
for (const entry of readdirSync(SKILLS_DIR)) {
  const dir = join(SKILLS_DIR, entry)
  if (!statSync(dir).isDirectory()) continue
  const skillFile = join(dir, 'SKILL.md')
  skillCount++

  let text
  try {
    text = readFileSync(skillFile, 'utf8')
  } catch {
    errors.push(`skills/${entry} 缺少 SKILL.md`)
    continue
  }

  const fm = readFrontmatter(skillFile)
  if (!fm) {
    errors.push(`skills/${entry}/SKILL.md 缺少 YAML frontmatter`)
    continue
  }

  const name = getField(fm, 'name')
  const description = getField(fm, 'description')

  if (!name) errors.push(`skills/${entry}/SKILL.md frontmatter 缺 name`)
  if (!description) errors.push(`skills/${entry}/SKILL.md frontmatter 缺 description`)

  if (name && (name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name))) {
    errors.push(`skills/${entry} 的 name 必须为 1–64 字符的小写连字符名称`)
  }
  if (description && description.length > 1024) {
    errors.push(`skills/${entry} 的 description 超过 1024 字符`)
  }

  // name 决定 --skill 参数的值，必须与目录名一致
  if (name && name !== entry) {
    errors.push(`skills/${entry} 目录名与 frontmatter name 不一致（name=${name}）`)
  }

  // description 过短会导致语义匹配永远不命中
  if (description && description.length < 40) {
    errors.push(`skills/${entry} 的 description 过短（${description.length} 字符），难以被触发`)
  }
}

// ---- 检查 4：skills/ 之外的游离 SKILL.md ----
for (const file of walk(ROOT)) {
  if (!file.endsWith(`${sep}SKILL.md`) && !file.endsWith('/SKILL.md')) continue
  const rel = relative(ROOT, file).split(sep).join('/')
  if (rel.startsWith('skills/')) continue
  errors.push(`发现游离 SKILL.md：${rel} —— 会被 CLI 递归扫描误识别，请改用 .mdx 或代码块展示`)
}

// ---- 输出 ----
if (skillCount === 0) errors.push('skills/ 下没有找到任何 skill 目录')

if (errors.length) {
  console.error(`✗ skill 元数据校验失败（${errors.length} 项）：`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log(`✓ skill 元数据校验通过（${skillCount} 个 skill）`)
