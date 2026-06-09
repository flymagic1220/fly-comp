import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dest, parallel, series, src } from 'gulp'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import * as dartSass from 'sass'
import postcss from 'postcss'
import cssnano from 'cssnano'
import { Transform } from 'stream'
import consola from 'consola'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distFolder = path.resolve(__dirname, 'dist')

/**
 * 清理 dist 目录
 */
function cleanDist(done) {
  if (fs.existsSync(distFolder)) {
    fs.rmSync(distFolder, { recursive: true, force: true })
    consola.info(chalk.yellow('dist 目录已清理'))
  }
  done()
}

/**
 * 编译 SCSS 为 CSS
 */
function buildSass() {
  const sass = gulpSass(dartSass)
  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(dest(distFolder))
}

/**
 * 复制 src 下所有 scss 源文件到 dist
 */
function copyScssSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(
    dest(path.resolve(distFolder, 'src'))
  )
}

/**
 * 使用 cssnano 压缩 CSS
 */
function compressCss() {
  const processor = postcss([
    cssnano({
      preset: [
        'default',
        {
          colormin: false,
          minifyFontValues: false,
        },
      ],
    }),
  ])
  return new Transform({
    objectMode: true,
    transform(chunk, _encoding, callback) {
      if (chunk.isNull()) {
        callback(null, chunk)
        return
      }
      if (chunk.isStream()) {
        callback(new Error('Streaming not supported'))
        return
      }
      const cssString = chunk.contents.toString()
      processor.process(cssString, { from: chunk.path }).then((result) => {
        const originalSize = cssString.length
        const compressedSize = result.css.length
        const name = path.basename(chunk.path)
        consola.success(
          `${chalk.cyan(name)}: ${chalk.yellow((originalSize / 1000).toFixed(2))} KB -> ${chalk.green((compressedSize / 1000).toFixed(2))} KB`
        )
        chunk.contents = Buffer.from(result.css)
        callback(null, chunk)
      })
    },
  })
}

/**
 * 压缩 dist 下的 CSS 文件
 */
function minifyCss() {
  return src(path.resolve(distFolder, '*.css'))
    .pipe(compressCss())
    .pipe(dest(distFolder))
}

/**
 * 完整构建：
 * 1. 编译 SCSS -> CSS
 * 2. 压缩 CSS
 * 3. 复制 SCSS 源文件供下游引用
 */
export const build = series(
  cleanDist,
  buildSass,
  minifyCss,
  parallel(copyScssSource)
)

export default build
