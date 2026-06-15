import {
  selectSvgElement
} from "./chunk-XLMMRE3P.js";
import {
  JSON_SCHEMA,
  load
} from "./chunk-Q7IHJWEC.js";
import {
  registerLayoutLoaders
} from "./chunk-7EQXZG5R.js";
import "./chunk-2NGVPPWW.js";
import "./chunk-U2GIFXGU.js";
import "./chunk-NCT2D5NX.js";
import "./chunk-GPCA6OCZ.js";
import "./chunk-VJANIWTC.js";
import "./chunk-N62K7G3P.js";
import {
  dedent,
  registerIconPacks
} from "./chunk-UYNKLJBW.js";
import {
  cleanAndMerge,
  decodeEntities,
  encodeEntities,
  isDetailedError,
  isEmpty,
  removeDirectives,
  utils_default
} from "./chunk-EMSN73UT.js";
import "./chunk-E6KK2CXR.js";
import {
  UnknownDiagramError,
  addDirective,
  assignWithDepth_default,
  configureSvgSize,
  cssStyleSheetToString,
  defaultConfig,
  detectType,
  detectors,
  evaluate,
  frontMatterRegex,
  getConfig,
  getDiagram,
  getDiagramLoader,
  getEffectiveHtmlLabels,
  getSiteConfig,
  purify,
  registerDiagram,
  registerLazyLoadedDiagrams,
  reset,
  sanitizeCss,
  saveConfigFromInitialize,
  setConfig,
  setSiteConfig,
  styles_default,
  themes_default,
  updateSiteConfig
} from "./chunk-YSJPXA4Q.js";
import {
  __name,
  log,
  select_default,
  setLogLevel
} from "./chunk-2E2CXWMY.js";
import "./chunk-BRLQHRXV.js";
import {
  Fragment,
  computed,
  createBaseVNode,
  createCommentVNode,
  createElementBlock,
  createVNode,
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  normalizeClass,
  normalizeStyle,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  render,
  toDisplayString,
  unref,
  watch
} from "./chunk-B4XSCRZZ.js";
import {
  __publicField
} from "./chunk-EQCVQC35.js";

// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Enum.js
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var MEDIA = "@media";
var IMPORT = "@import";
var SUPPORTS = "@supports";
var NAMESPACE = "@namespace";
var KEYFRAMES = "@keyframes";
var LAYER = "@layer";
var SCOPE = "@scope";

// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Utility.js
var abs = Math.abs;
var from = String.fromCharCode;
function trim(value) {
  return value.trim();
}
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement);
}
function charat(value, index) {
  return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
  return value.slice(begin, end);
}
function strlen(value) {
  return value.length;
}
function sizeof(value) {
  return value.length;
}
function append(value, array) {
  return array.push(value), value;
}

// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Tokenizer.js
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
function node(value, root, parent, type, props, children, length2, siblings) {
  return { value, root, parent, type, props, children, line, column, length: length2, return: "", siblings };
}
function char() {
  return character;
}
function prev() {
  character = position > 0 ? charat(characters, --position) : 0;
  if (column--, character === 10)
    column = 1, line--;
  return character;
}
function next() {
  character = position < length ? charat(characters, position++) : 0;
  if (column++, character === 10)
    column = 1, line++;
  return character;
}
function peek() {
  return charat(characters, position);
}
function caret() {
  return position;
}
function slice(begin, end) {
  return substr(characters, begin, end);
}
function token(type) {
  switch (type) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function alloc(value) {
  return line = column = 1, length = strlen(characters = value), position = 0, [];
}
function dealloc(value) {
  return characters = "", value;
}
function delimit(type) {
  return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function whitespace(type) {
  while (character = peek())
    if (character < 33)
      next();
    else
      break;
  return token(type) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(index, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
  while (next())
    switch (character) {
      case type:
        return position;
      case 34:
      case 39:
        if (type !== 34 && type !== 39)
          delimiter(character);
        break;
      case 40:
        if (type === 41)
          delimiter(type);
        break;
      case 92:
        next();
        break;
    }
  return position;
}
function commenter(type, index) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index) {
  while (!token(peek()))
    next();
  return slice(index, position);
}

// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Parser.js
function compile(value) {
  return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index = 0;
  var offset = 0;
  var length2 = pseudo;
  var atrule = 0;
  var property = 0;
  var previous = 0;
  var variable = 1;
  var scanning = 1;
  var ampersand = 1;
  var parens = 0;
  var character2 = 0;
  var type = "";
  var props = rules;
  var children = rulesets;
  var reference = rule;
  var characters2 = type;
  while (scanning)
    switch (previous = character2, character2 = next()) {
      case 40:
        if (previous != 108 && charat(characters2, length2 - 1) == 58) parens++, characters2 += "(";
        else characters2 += delimit(character2);
        break;
      case 41:
        parens--, characters2 += ")";
        break;
      case 34:
      case 39:
      case 91:
        characters2 += delimit(character2);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        if (parens > 0) {
          characters2 += from(character2);
          break;
        }
        characters2 += whitespace(previous);
        break;
      case 92:
        characters2 += escaping(caret() - 1, 7);
        continue;
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
            if ((token(previous || 1) == 5 || token(peek() || 1) == 5) && strlen(characters2) && substr(characters2, -1, void 0) !== " ") characters2 += " ";
            break;
          default:
            characters2 += "/";
        }
        break;
      case 123 * variable:
        points[index++] = strlen(characters2) * ampersand;
      case 125 * variable:
      case 59:
      case 0:
        if (parens > 0 && character2) {
          characters2 += from(character2);
          break;
        }
        switch (character2) {
          case 0:
          case 125:
            scanning = 0;
          case 59 + offset:
            if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
            if (property > 0 && (strlen(characters2) - length2 || variable === 0))
              append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1, declarations) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2, declarations), declarations);
            break;
          case 59:
            characters2 += ";";
          default:
            append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2, rulesets), rulesets);
            if (character2 === 123)
              if (offset === 0)
                parse(characters2, root, reference, reference, props, rulesets, length2, points, children);
              else {
                switch (atrule) {
                  case 99:
                    if (charat(characters2, 3) === 110) break;
                  case 108:
                    if (charat(characters2, 2) === 97) break;
                  default:
                    offset = 0;
                  case 100:
                  case 109:
                  case 115:
                }
                if (offset) parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2, children), children), rules, children, length2, points, rule ? props : children);
                else parse(characters2, reference, reference, reference, [""], children, 0, points, children);
              }
        }
        index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
        break;
      case 58:
        length2 = 1 + strlen(characters2), property = previous;
      default:
        if (variable < 1) {
          if (character2 == 123)
            --variable;
          else if (character2 == 125 && variable++ == 0 && prev() == 125)
            continue;
        }
        switch (characters2 += from(character2), character2 * variable) {
          case 38:
            ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
            break;
          case 44:
            if (parens > 0) break;
            points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
            break;
          case 64:
            if (peek() === 45)
              characters2 += delimit(next());
            atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
            break;
          case 45:
            if (previous === 45 && strlen(characters2) == 2)
              variable = 0;
        }
    }
  return rulesets;
}
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2, siblings) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size = sizeof(rule);
  for (var i = 0, j2 = 0, k2 = 0; i < index; ++i)
    for (var x = 0, y = substr(value, post + 1, post = abs(j2 = points[i])), z2 = value; x < size; ++x)
      if (z2 = trim(j2 > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x])))
        props[k2++] = z2;
  return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2, siblings);
}
function comment(value, root, parent, siblings) {
  return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
}
function declaration(value, root, parent, length2, siblings) {
  return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2, siblings);
}

// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Serializer.js
function serialize(children, callback) {
  var output = "";
  for (var i = 0; i < children.length; i++)
    output += callback(children[i], i, children, callback) || "";
  return output;
}
function stringify(element, index, children, callback) {
  switch (element.type) {
    case LAYER:
      if (element.children.length) break;
    case IMPORT:
    case NAMESPACE:
    case DECLARATION:
      return element.return = element.return || element.value;
    case COMMENT:
      return "";
    case KEYFRAMES:
      return element.return = element.value + "{" + serialize(element.children, callback) + "}";
    case RULESET:
      if (!strlen(element.value = element.props.join(","))) return "";
  }
  return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}

// ../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Middleware.js
function middleware(collection) {
  var length2 = sizeof(collection);
  return function(element, index, children, callback) {
    var output = "";
    for (var i = 0; i < length2; i++)
      output += collection[i](element, index, children, callback) || "";
    return output;
  };
}

// ../../node_modules/.pnpm/mermaid@11.15.0/node_modules/mermaid/dist/mermaid.core.mjs
var id = "c4";
var detector = __name((txt) => {
  return /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(txt);
}, "detector");
var loader = __name(async () => {
  const { diagram: diagram2 } = await import("./c4Diagram-AAUBKEIU-VHLJ4AD3.js");
  return { id, diagram: diagram2 };
}, "loader");
var plugin = {
  id,
  detector,
  loader
};
var c4Detector_default = plugin;
var id2 = "flowchart";
var detector2 = __name((txt, config) => {
  var _a3, _b;
  if (((_a3 = config == null ? void 0 : config.flowchart) == null ? void 0 : _a3.defaultRenderer) === "dagre-wrapper" || ((_b = config == null ? void 0 : config.flowchart) == null ? void 0 : _b.defaultRenderer) === "elk") {
    return false;
  }
  return /^\s*graph/.test(txt);
}, "detector");
var loader2 = __name(async () => {
  const { diagram: diagram2 } = await import("./flowDiagram-I6XJVG4X-NOV5I4EM.js");
  return { id: id2, diagram: diagram2 };
}, "loader");
var plugin2 = {
  id: id2,
  detector: detector2,
  loader: loader2
};
var flowDetector_default = plugin2;
var id3 = "flowchart-v2";
var detector3 = __name((txt, config) => {
  var _a3, _b, _c;
  if (((_a3 = config == null ? void 0 : config.flowchart) == null ? void 0 : _a3.defaultRenderer) === "dagre-d3") {
    return false;
  }
  if (((_b = config == null ? void 0 : config.flowchart) == null ? void 0 : _b.defaultRenderer) === "elk") {
    config.layout = "elk";
  }
  if (/^\s*graph/.test(txt) && ((_c = config == null ? void 0 : config.flowchart) == null ? void 0 : _c.defaultRenderer) === "dagre-wrapper") {
    return true;
  }
  return /^\s*flowchart/.test(txt);
}, "detector");
var loader3 = __name(async () => {
  const { diagram: diagram2 } = await import("./flowDiagram-I6XJVG4X-NOV5I4EM.js");
  return { id: id3, diagram: diagram2 };
}, "loader");
var plugin3 = {
  id: id3,
  detector: detector3,
  loader: loader3
};
var flowDetector_v2_default = plugin3;
var id4 = "er";
var detector4 = __name((txt) => {
  return /^\s*erDiagram/.test(txt);
}, "detector");
var loader4 = __name(async () => {
  const { diagram: diagram2 } = await import("./erDiagram-TEJ5UH35-HMXHTYBS.js");
  return { id: id4, diagram: diagram2 };
}, "loader");
var plugin4 = {
  id: id4,
  detector: detector4,
  loader: loader4
};
var erDetector_default = plugin4;
var id5 = "gitGraph";
var detector5 = __name((txt) => {
  return /^\s*gitGraph/.test(txt);
}, "detector");
var loader5 = __name(async () => {
  const { diagram: diagram2 } = await import("./gitGraphDiagram-PVQCEYII-5HIANTLL.js");
  return { id: id5, diagram: diagram2 };
}, "loader");
var plugin5 = {
  id: id5,
  detector: detector5,
  loader: loader5
};
var gitGraphDetector_default = plugin5;
var id6 = "gantt";
var detector6 = __name((txt) => {
  return /^\s*gantt/.test(txt);
}, "detector");
var loader6 = __name(async () => {
  const { diagram: diagram2 } = await import("./ganttDiagram-6RSMTGT7-C4IOVOXN.js");
  return { id: id6, diagram: diagram2 };
}, "loader");
var plugin6 = {
  id: id6,
  detector: detector6,
  loader: loader6
};
var ganttDetector_default = plugin6;
var id7 = "info";
var detector7 = __name((txt) => {
  return /^\s*info/.test(txt);
}, "detector");
var loader7 = __name(async () => {
  const { diagram: diagram2 } = await import("./infoDiagram-5YYISTIA-XEJCCOTW.js");
  return { id: id7, diagram: diagram2 };
}, "loader");
var info = {
  id: id7,
  detector: detector7,
  loader: loader7
};
var id8 = "pie";
var detector8 = __name((txt) => {
  return /^\s*pie/.test(txt);
}, "detector");
var loader8 = __name(async () => {
  const { diagram: diagram2 } = await import("./pieDiagram-4H26LBE5-3WGQDMKM.js");
  return { id: id8, diagram: diagram2 };
}, "loader");
var pie = {
  id: id8,
  detector: detector8,
  loader: loader8
};
var id9 = "quadrantChart";
var detector9 = __name((txt) => {
  return /^\s*quadrantChart/.test(txt);
}, "detector");
var loader9 = __name(async () => {
  const { diagram: diagram2 } = await import("./quadrantDiagram-W4KKPZXB-O36LMHLP.js");
  return { id: id9, diagram: diagram2 };
}, "loader");
var plugin7 = {
  id: id9,
  detector: detector9,
  loader: loader9
};
var quadrantDetector_default = plugin7;
var id10 = "xychart";
var detector10 = __name((txt) => {
  return /^\s*xychart(-beta)?/.test(txt);
}, "detector");
var loader10 = __name(async () => {
  const { diagram: diagram2 } = await import("./xychartDiagram-2RQKCTM6-ARNBPHDW.js");
  return { id: id10, diagram: diagram2 };
}, "loader");
var plugin8 = {
  id: id10,
  detector: detector10,
  loader: loader10
};
var xychartDetector_default = plugin8;
var id11 = "requirement";
var detector11 = __name((txt) => {
  return /^\s*requirement(Diagram)?/.test(txt);
}, "detector");
var loader11 = __name(async () => {
  const { diagram: diagram2 } = await import("./requirementDiagram-4Y6WPE33-42RPKDVF.js");
  return { id: id11, diagram: diagram2 };
}, "loader");
var plugin9 = {
  id: id11,
  detector: detector11,
  loader: loader11
};
var requirementDetector_default = plugin9;
var id12 = "sequence";
var detector12 = __name((txt) => {
  return /^\s*sequenceDiagram/.test(txt);
}, "detector");
var loader12 = __name(async () => {
  const { diagram: diagram2 } = await import("./sequenceDiagram-3UESZ5HK-QS4Y7O4O.js");
  return { id: id12, diagram: diagram2 };
}, "loader");
var plugin10 = {
  id: id12,
  detector: detector12,
  loader: loader12
};
var sequenceDetector_default = plugin10;
var id13 = "class";
var detector13 = __name((txt, config) => {
  var _a3;
  if (((_a3 = config == null ? void 0 : config.class) == null ? void 0 : _a3.defaultRenderer) === "dagre-wrapper") {
    return false;
  }
  return /^\s*classDiagram/.test(txt);
}, "detector");
var loader13 = __name(async () => {
  const { diagram: diagram2 } = await import("./classDiagram-4FO5ZUOK-M5AS6APN.js");
  return { id: id13, diagram: diagram2 };
}, "loader");
var plugin11 = {
  id: id13,
  detector: detector13,
  loader: loader13
};
var classDetector_default = plugin11;
var id14 = "classDiagram";
var detector14 = __name((txt, config) => {
  var _a3;
  if (/^\s*classDiagram/.test(txt) && ((_a3 = config == null ? void 0 : config.class) == null ? void 0 : _a3.defaultRenderer) === "dagre-wrapper") {
    return true;
  }
  return /^\s*classDiagram-v2/.test(txt);
}, "detector");
var loader14 = __name(async () => {
  const { diagram: diagram2 } = await import("./classDiagram-v2-Q7XG4LA2-AC4JUGUQ.js");
  return { id: id14, diagram: diagram2 };
}, "loader");
var plugin12 = {
  id: id14,
  detector: detector14,
  loader: loader14
};
var classDetector_V2_default = plugin12;
var id15 = "state";
var detector15 = __name((txt, config) => {
  var _a3;
  if (((_a3 = config == null ? void 0 : config.state) == null ? void 0 : _a3.defaultRenderer) === "dagre-wrapper") {
    return false;
  }
  return /^\s*stateDiagram/.test(txt);
}, "detector");
var loader15 = __name(async () => {
  const { diagram: diagram2 } = await import("./stateDiagram-AJRCARHV-HCJHXN4E.js");
  return { id: id15, diagram: diagram2 };
}, "loader");
var plugin13 = {
  id: id15,
  detector: detector15,
  loader: loader15
};
var stateDetector_default = plugin13;
var id16 = "stateDiagram";
var detector16 = __name((txt, config) => {
  var _a3;
  if (/^\s*stateDiagram-v2/.test(txt)) {
    return true;
  }
  if (/^\s*stateDiagram/.test(txt) && ((_a3 = config == null ? void 0 : config.state) == null ? void 0 : _a3.defaultRenderer) === "dagre-wrapper") {
    return true;
  }
  return false;
}, "detector");
var loader16 = __name(async () => {
  const { diagram: diagram2 } = await import("./stateDiagram-v2-BHNVJYJU-BMVISX3D.js");
  return { id: id16, diagram: diagram2 };
}, "loader");
var plugin14 = {
  id: id16,
  detector: detector16,
  loader: loader16
};
var stateDetector_V2_default = plugin14;
var id17 = "journey";
var detector17 = __name((txt) => {
  return /^\s*journey/.test(txt);
}, "detector");
var loader17 = __name(async () => {
  const { diagram: diagram2 } = await import("./journeyDiagram-JHISSGLW-56YMORCZ.js");
  return { id: id17, diagram: diagram2 };
}, "loader");
var plugin15 = {
  id: id17,
  detector: detector17,
  loader: loader17
};
var journeyDetector_default = plugin15;
var draw = __name((_text, id33, version) => {
  log.debug("rendering svg for syntax error\n");
  const svg = selectSvgElement(id33);
  const g = svg.append("g");
  svg.attr("viewBox", "0 0 2412 512");
  configureSvgSize(svg, 100, 512, true);
  g.append("path").attr("class", "error-icon").attr(
    "d",
    "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"
  );
  g.append("path").attr("class", "error-icon").attr(
    "d",
    "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"
  );
  g.append("path").attr("class", "error-icon").attr(
    "d",
    "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"
  );
  g.append("path").attr("class", "error-icon").attr(
    "d",
    "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"
  );
  g.append("path").attr("class", "error-icon").attr(
    "d",
    "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"
  );
  g.append("path").attr("class", "error-icon").attr(
    "d",
    "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"
  );
  g.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text");
  g.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${version}`);
}, "draw");
var renderer = { draw };
var errorRenderer_default = renderer;
var diagram = {
  db: {},
  renderer,
  parser: {
    parse: __name(() => {
      return;
    }, "parse")
  }
};
var errorDiagram_default = diagram;
var id18 = "flowchart-elk";
var detector18 = __name((txt, config = {}) => {
  var _a3;
  if (
    // If diagram explicitly states flowchart-elk
    /^\s*flowchart-elk/.test(txt) || // If a flowchart/graph diagram has their default renderer set to elk
    /^\s*(flowchart|graph)/.test(txt) && ((_a3 = config == null ? void 0 : config.flowchart) == null ? void 0 : _a3.defaultRenderer) === "elk"
  ) {
    config.layout = "elk";
    return true;
  }
  return false;
}, "detector");
var loader18 = __name(async () => {
  const { diagram: diagram2 } = await import("./flowDiagram-I6XJVG4X-NOV5I4EM.js");
  return { id: id18, diagram: diagram2 };
}, "loader");
var plugin16 = {
  id: id18,
  detector: detector18,
  loader: loader18
};
var detector_default = plugin16;
var id19 = "timeline";
var detector19 = __name((txt) => {
  return /^\s*timeline/.test(txt);
}, "detector");
var loader19 = __name(async () => {
  const { diagram: diagram2 } = await import("./timeline-definition-PNZ67QCA-JY2C7HXE.js");
  return { id: id19, diagram: diagram2 };
}, "loader");
var plugin17 = {
  id: id19,
  detector: detector19,
  loader: loader19
};
var detector_default2 = plugin17;
var id20 = "mindmap";
var detector20 = __name((txt) => {
  return /^\s*mindmap/.test(txt);
}, "detector");
var loader20 = __name(async () => {
  const { diagram: diagram2 } = await import("./mindmap-definition-RKZ34NQL-JTHHVV5P.js");
  return { id: id20, diagram: diagram2 };
}, "loader");
var plugin18 = {
  id: id20,
  detector: detector20,
  loader: loader20
};
var detector_default3 = plugin18;
var id21 = "kanban";
var detector21 = __name((txt) => {
  return /^\s*kanban/.test(txt);
}, "detector");
var loader21 = __name(async () => {
  const { diagram: diagram2 } = await import("./kanban-definition-UN3LZRKU-KANQYEPX.js");
  return { id: id21, diagram: diagram2 };
}, "loader");
var plugin19 = {
  id: id21,
  detector: detector21,
  loader: loader21
};
var detector_default4 = plugin19;
var id22 = "sankey";
var detector22 = __name((txt) => {
  return /^\s*sankey(-beta)?/.test(txt);
}, "detector");
var loader22 = __name(async () => {
  const { diagram: diagram2 } = await import("./sankeyDiagram-5OEKKPKP-RHUZFXW5.js");
  return { id: id22, diagram: diagram2 };
}, "loader");
var plugin20 = {
  id: id22,
  detector: detector22,
  loader: loader22
};
var sankeyDetector_default = plugin20;
var id23 = "packet";
var detector23 = __name((txt) => {
  return /^\s*packet(-beta)?/.test(txt);
}, "detector");
var loader23 = __name(async () => {
  const { diagram: diagram2 } = await import("./diagram-LMA3HP47-SRC4CXNI.js");
  return { id: id23, diagram: diagram2 };
}, "loader");
var packet = {
  id: id23,
  detector: detector23,
  loader: loader23
};
var id24 = "radar";
var detector24 = __name((txt) => {
  return /^\s*radar-beta/.test(txt);
}, "detector");
var loader24 = __name(async () => {
  const { diagram: diagram2 } = await import("./diagram-2AECGRRQ-CM3I7ZXN.js");
  return { id: id24, diagram: diagram2 };
}, "loader");
var radar = {
  id: id24,
  detector: detector24,
  loader: loader24
};
var id25 = "block";
var detector25 = __name((txt) => {
  return /^\s*block(-beta)?/.test(txt);
}, "detector");
var loader25 = __name(async () => {
  const { diagram: diagram2 } = await import("./blockDiagram-GPEHLZMM-FCZ3GMHX.js");
  return { id: id25, diagram: diagram2 };
}, "loader");
var plugin21 = {
  id: id25,
  detector: detector25,
  loader: loader25
};
var blockDetector_default = plugin21;
var id26 = "treeView";
var detector26 = __name((txt) => {
  return /^\s*treeView-beta/.test(txt);
}, "detector");
var loader26 = __name(async () => {
  const { diagram: diagram2 } = await import("./diagram-5GNKFQAL-YZUARBUE.js");
  return { id: id26, diagram: diagram2 };
}, "loader");
var plugin22 = {
  id: id26,
  detector: detector26,
  loader: loader26
};
var detector_default5 = plugin22;
var id27 = "architecture";
var detector27 = __name((txt) => {
  return /^\s*architecture/.test(txt);
}, "detector");
var loader27 = __name(async () => {
  const { diagram: diagram2 } = await import("./architectureDiagram-3BPJPVTR-WT63V3AB.js");
  return { id: id27, diagram: diagram2 };
}, "loader");
var architecture = {
  id: id27,
  detector: detector27,
  loader: loader27
};
var architectureDetector_default = architecture;
var id28 = "eventmodeling";
var detector28 = __name((txt) => {
  return /^\s*eventmodeling/.test(txt);
}, "detector");
var loader28 = __name(async () => {
  const { diagram: diagram2 } = await import("./diagram-KO2AKTUF-MBJWVDFH.js");
  return { id: id28, diagram: diagram2 };
}, "loader");
var plugin23 = {
  id: id28,
  detector: detector28,
  loader: loader28
};
var detector_default6 = plugin23;
var id29 = "ishikawa";
var detector29 = __name((txt) => {
  return /^\s*ishikawa(-beta)?\b/i.test(txt);
}, "detector");
var loader29 = __name(async () => {
  const { diagram: diagram2 } = await import("./ishikawaDiagram-YF4QCWOH-ZUPCWGEN.js");
  return { id: id29, diagram: diagram2 };
}, "loader");
var ishikawa = {
  id: id29,
  detector: detector29,
  loader: loader29
};
var id30 = "venn";
var detector30 = __name((txt) => {
  return /^\s*venn-beta/.test(txt);
}, "detector");
var loader30 = __name(async () => {
  const { diagram: diagram2 } = await import("./vennDiagram-CIIHVFJN-E5BAUA7J.js");
  return { id: id30, diagram: diagram2 };
}, "loader");
var plugin24 = {
  id: id30,
  detector: detector30,
  loader: loader30
};
var vennDetector_default = plugin24;
var id31 = "treemap";
var detector31 = __name((txt) => {
  return /^\s*treemap/.test(txt);
}, "detector");
var loader31 = __name(async () => {
  const { diagram: diagram2 } = await import("./diagram-OG6HWLK6-6ANEWXAB.js");
  return { id: id31, diagram: diagram2 };
}, "loader");
var treemap = {
  id: id31,
  detector: detector31,
  loader: loader31
};
var id32 = "wardley-beta";
var detector32 = __name((text) => {
  return /^\s*wardley-beta/i.test(text);
}, "detector");
var loader32 = __name(async () => {
  const { diagram: diagram2 } = await import("./wardleyDiagram-YWT4CUSO-BSWMHU2H.js");
  return { id: id32, diagram: diagram2 };
}, "loader");
var plugin25 = {
  id: id32,
  detector: detector32,
  loader: loader32
};
var wardleyDetector_default = plugin25;
var hasLoadedDiagrams = false;
var addDiagrams = __name(() => {
  if (hasLoadedDiagrams) {
    return;
  }
  hasLoadedDiagrams = true;
  registerDiagram("error", errorDiagram_default, (text) => {
    return text.toLowerCase().trim() === "error";
  });
  registerDiagram(
    "---",
    // --- diagram type may appear if YAML front-matter is not parsed correctly
    {
      db: {
        clear: __name(() => {
        }, "clear")
      },
      styles: {},
      // should never be used
      renderer: {
        draw: __name(() => {
        }, "draw")
      },
      parser: {
        parse: __name(() => {
          throw new Error(
            "Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks"
          );
        }, "parse")
      },
      init: __name(() => null, "init")
      // no op
    },
    (text) => {
      return text.toLowerCase().trimStart().startsWith("---");
    }
  );
  if (true) {
    registerLazyLoadedDiagrams(detector_default, detector_default3, architectureDetector_default);
  }
  registerLazyLoadedDiagrams(
    c4Detector_default,
    detector_default4,
    classDetector_V2_default,
    classDetector_default,
    erDetector_default,
    ganttDetector_default,
    info,
    pie,
    requirementDetector_default,
    sequenceDetector_default,
    flowDetector_v2_default,
    flowDetector_default,
    detector_default2,
    gitGraphDetector_default,
    stateDetector_V2_default,
    stateDetector_default,
    journeyDetector_default,
    quadrantDetector_default,
    sankeyDetector_default,
    packet,
    xychartDetector_default,
    blockDetector_default,
    detector_default6,
    detector_default5,
    radar,
    ishikawa,
    treemap,
    vennDetector_default,
    wardleyDetector_default
  );
}, "addDiagrams");
var loadRegisteredDiagrams = __name(async () => {
  log.debug(`Loading registered diagrams`);
  const results = await Promise.allSettled(
    Object.entries(detectors).map(async ([key, { detector: detector33, loader: loader33 }]) => {
      if (!loader33) {
        return;
      }
      try {
        getDiagram(key);
      } catch {
        try {
          const { diagram: diagram2, id: id33 } = await loader33();
          registerDiagram(id33, diagram2, detector33);
        } catch (err) {
          log.error(`Failed to load external diagram with key ${key}. Removing from detectors.`);
          delete detectors[key];
          throw err;
        }
      }
    })
  );
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length > 0) {
    log.error(`Failed to load ${failed.length} external diagrams`);
    for (const res of failed) {
      log.error(res);
    }
    throw new Error(`Failed to load ${failed.length} external diagrams`);
  }
}, "loadRegisteredDiagrams");
var SVG_ROLE = "graphics-document document";
function setA11yDiagramInfo(svg, diagramType) {
  svg.attr("role", SVG_ROLE);
  if (diagramType !== "") {
    svg.attr("aria-roledescription", diagramType);
  }
}
__name(setA11yDiagramInfo, "setA11yDiagramInfo");
function addSVGa11yTitleDescription(svg, a11yTitle, a11yDesc, baseId) {
  if (svg.insert === void 0) {
    return;
  }
  if (a11yDesc) {
    const descId = `chart-desc-${baseId}`;
    svg.attr("aria-describedby", descId);
    svg.insert("desc", ":first-child").attr("id", descId).text(a11yDesc);
  }
  if (a11yTitle) {
    const titleId = `chart-title-${baseId}`;
    svg.attr("aria-labelledby", titleId);
    svg.insert("title", ":first-child").attr("id", titleId).text(a11yTitle);
  }
}
__name(addSVGa11yTitleDescription, "addSVGa11yTitleDescription");
var _a;
var Diagram = (_a = class {
  constructor(type, text, db, parser, renderer2) {
    this.type = type;
    this.text = text;
    this.db = db;
    this.parser = parser;
    this.renderer = renderer2;
  }
  static async fromText(text, metadata = {}) {
    var _a3, _b;
    const config = getConfig();
    const type = detectType(text, config);
    text = encodeEntities(text) + "\n";
    try {
      getDiagram(type);
    } catch {
      const loader33 = getDiagramLoader(type);
      if (!loader33) {
        throw new UnknownDiagramError(`Diagram ${type} not found.`);
      }
      const { id: id33, diagram: diagram2 } = await loader33();
      registerDiagram(id33, diagram2);
    }
    const { db, parser, renderer: renderer2, init: init2 } = getDiagram(type);
    if (parser.parser) {
      parser.parser.yy = db;
    }
    (_a3 = db.clear) == null ? void 0 : _a3.call(db);
    init2 == null ? void 0 : init2(config);
    if (metadata.title) {
      (_b = db.setDiagramTitle) == null ? void 0 : _b.call(db, metadata.title);
    }
    await parser.parse(text);
    return new _a(type, text, db, parser, renderer2);
  }
  async render(id33, version) {
    await this.renderer.draw(this.text, id33, version, this);
  }
  getParser() {
    return this.parser;
  }
  getType() {
    return this.type;
  }
}, __name(_a, "Diagram"), _a);
var interactionFunctions = [];
var attachFunctions = __name(() => {
  interactionFunctions.forEach((f) => {
    f();
  });
  interactionFunctions = [];
}, "attachFunctions");
var cleanupComments = __name((text) => {
  return text.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart();
}, "cleanupComments");
function extractFrontMatter(text) {
  const matches = text.match(frontMatterRegex);
  if (!matches) {
    return {
      text,
      metadata: {}
    };
  }
  let parsed = load(matches[1], {
    // To support config, we need JSON schema.
    // https://www.yaml.org/spec/1.2/spec.html#id2803231
    schema: JSON_SCHEMA
  }) ?? {};
  parsed = typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const metadata = {};
  if (parsed.displayMode) {
    metadata.displayMode = parsed.displayMode.toString();
  }
  if (parsed.title) {
    metadata.title = parsed.title.toString();
  }
  if (parsed.config) {
    metadata.config = parsed.config;
  }
  return {
    text: text.slice(matches[0].length),
    metadata
  };
}
__name(extractFrontMatter, "extractFrontMatter");
var cleanupText = __name((code) => {
  return code.replace(/\r\n?/g, "\n").replace(
    /<(\w+)([^>]*)>/g,
    (match2, tag, attributes) => "<" + tag + attributes.replace(/="([^"]*)"/g, "='$1'") + ">"
  );
}, "cleanupText");
var processFrontmatter = __name((code) => {
  const { text, metadata } = extractFrontMatter(code);
  const { displayMode, title, config = {} } = metadata;
  if (displayMode) {
    if (!config.gantt) {
      config.gantt = {};
    }
    config.gantt.displayMode = displayMode;
  }
  return { title, config, text };
}, "processFrontmatter");
var processDirectives = __name((code) => {
  const initDirective = utils_default.detectInit(code) ?? {};
  const wrapDirectives = utils_default.detectDirective(code, "wrap");
  if (Array.isArray(wrapDirectives)) {
    initDirective.wrap = wrapDirectives.some(({ type }) => type === "wrap");
  } else if ((wrapDirectives == null ? void 0 : wrapDirectives.type) === "wrap") {
    initDirective.wrap = true;
  }
  return {
    text: removeDirectives(code),
    directive: initDirective
  };
}, "processDirectives");
function preprocessDiagram(code) {
  const cleanedCode = cleanupText(code);
  const frontMatterResult = processFrontmatter(cleanedCode);
  const directiveResult = processDirectives(frontMatterResult.text);
  const config = cleanAndMerge(frontMatterResult.config, directiveResult.directive);
  code = cleanupComments(directiveResult.text);
  return {
    code,
    title: frontMatterResult.title,
    config
  };
}
__name(preprocessDiagram, "preprocessDiagram");
function toBase64(str) {
  const utf8Bytes = new TextEncoder().encode(str);
  const utf8Str = Array.from(utf8Bytes, (byte) => String.fromCodePoint(byte)).join("");
  return btoa(utf8Str);
}
__name(toBase64, "toBase64");
var MAX_TEXTLENGTH = 5e4;
var MAX_TEXTLENGTH_EXCEEDED_MSG = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa";
var SECURITY_LVL_SANDBOX = "sandbox";
var SECURITY_LVL_LOOSE = "loose";
var XMLNS_SVG_STD = "http://www.w3.org/2000/svg";
var XMLNS_XLINK_STD = "http://www.w3.org/1999/xlink";
var XMLNS_XHTML_STD = "http://www.w3.org/1999/xhtml";
var IFRAME_WIDTH = "100%";
var IFRAME_HEIGHT = "100%";
var IFRAME_STYLES = "border:0;margin:0;";
var IFRAME_BODY_STYLE = "margin:0";
var IFRAME_SANDBOX_OPTS = "allow-top-navigation-by-user-activation allow-popups";
var IFRAME_NOT_SUPPORTED_MSG = 'The "iframe" tag is not supported by your browser.';
var DOMPURIFY_TAGS = ["foreignobject"];
var DOMPURIFY_ATTR = ["dominant-baseline"];
function processAndSetConfigs(text) {
  const processed = preprocessDiagram(text);
  reset();
  addDirective(processed.config ?? {});
  return processed;
}
__name(processAndSetConfigs, "processAndSetConfigs");
async function parse2(text, parseOptions) {
  addDiagrams();
  try {
    const { code, config } = processAndSetConfigs(text);
    const diagram2 = await getDiagramFromText(code);
    return { diagramType: diagram2.type, config };
  } catch (error) {
    if (parseOptions == null ? void 0 : parseOptions.suppressErrors) {
      return false;
    }
    throw error;
  }
}
__name(parse2, "parse");
var cssImportantStyles = __name((cssClass, element, cssClasses = []) => {
  const declarationBlock = sanitizeCss(`{ ${cssClasses.join(" !important; ")} !important; }`);
  return `.${cssClass} ${element} ${declarationBlock}`;
}, "cssImportantStyles");
var createCssStyles = __name((config, classDefs = /* @__PURE__ */ new Map()) => {
  const cssStyles = new CSSStyleSheet();
  if (config.fontFamily !== void 0) {
    cssStyles.insertRule(
      `:root { --mermaid-font-family: ${config.fontFamily}}`,
      cssStyles.cssRules.length
    );
  }
  if (config.altFontFamily !== void 0) {
    cssStyles.insertRule(
      `:root { --mermaid-alt-font-family: ${config.altFontFamily}}`,
      cssStyles.cssRules.length
    );
  }
  if (classDefs instanceof Map) {
    const htmlLabels = getEffectiveHtmlLabels(config);
    const cssHtmlElements = ["> *", "span"];
    const cssShapeElements = ["rect", "polygon", "ellipse", "circle", "path"];
    const cssElements = htmlLabels ? cssHtmlElements : cssShapeElements;
    classDefs.forEach((styleClassDef) => {
      if (!isEmpty(styleClassDef.styles)) {
        cssElements.forEach((cssElement) => {
          cssStyles.insertRule(
            cssImportantStyles(styleClassDef.id, cssElement, styleClassDef.styles),
            cssStyles.cssRules.length
          );
        });
      }
      if (!isEmpty(styleClassDef.textStyles)) {
        cssStyles.insertRule(
          cssImportantStyles(
            styleClassDef.id,
            "tspan",
            ((styleClassDef == null ? void 0 : styleClassDef.textStyles) || []).map((s) => s.replace("color", "fill"))
          ),
          cssStyles.cssRules.length
        );
      }
    });
  }
  let cssString = "";
  if (config.themeCSS !== void 0) {
    if (typeof cssStyles.replaceSync === "function") {
      const themeCssStyleSheet = new CSSStyleSheet();
      themeCssStyleSheet.replaceSync(config.themeCSS);
      cssString = cssStyleSheetToString(themeCssStyleSheet) + "\n";
    } else {
      cssString += `${config.themeCSS}
`;
    }
  }
  return cssString + cssStyleSheetToString(cssStyles);
}, "createCssStyles");
var compileCSS = __name((namespace, css) => {
  return serialize(
    compile(`${namespace}{${css}}`),
    middleware([
      __name(function addNamespace(element, _index, _children, _callback) {
        if (element.type === "rule" && Array.isArray(element.props)) {
          if (element.parent && element.parent.type === KEYFRAMES) {
            return;
          }
          element.props = element.props.map((prop) => {
            if (!prop.startsWith(namespace)) {
              return `${namespace} ${prop}`;
            }
            return prop;
          });
        } else if (element.type.startsWith("@")) {
          const nestedAtRules = [
            MEDIA,
            SUPPORTS,
            LAYER,
            SCOPE,
            "@container",
            "@starting-style"
          ];
          const allowedAtRules = [
            ...nestedAtRules,
            KEYFRAMES
            // needed for Mermaid's animation feature
          ];
          if (!allowedAtRules.includes(element.type)) {
            log.warn(`Removing unsupported at-rule ${element.type} from CSS`);
            element.type = COMMENT;
          }
        }
      }, "addNamespace"),
      stringify
    ])
  );
}, "compileCSS");
var createUserStyles = __name((config, graphType, classDefs, svgId) => {
  const userCSSstyles = createCssStyles(config, classDefs);
  const allStyles = styles_default(
    graphType,
    userCSSstyles,
    { ...config.themeVariables, theme: config.theme, look: config.look },
    svgId
  );
  return compileCSS(svgId, allStyles);
}, "createUserStyles");
var cleanUpSvgCode = __name((svgCode = "", inSandboxMode, useArrowMarkerUrls) => {
  let cleanedUpSvg = svgCode;
  if (!useArrowMarkerUrls && !inSandboxMode) {
    cleanedUpSvg = cleanedUpSvg.replace(
      /marker-end="url\([\d+./:=?A-Za-z-]*?#/g,
      'marker-end="url(#'
    );
  }
  cleanedUpSvg = decodeEntities(cleanedUpSvg);
  cleanedUpSvg = cleanedUpSvg.replace(/<br>/g, "<br/>");
  return cleanedUpSvg;
}, "cleanUpSvgCode");
var putIntoIFrame = __name((svgCode = "", svgElement) => {
  var _a3, _b;
  const height = ((_b = (_a3 = svgElement == null ? void 0 : svgElement.viewBox) == null ? void 0 : _a3.baseVal) == null ? void 0 : _b.height) ? svgElement.viewBox.baseVal.height + "px" : IFRAME_HEIGHT;
  const base64encodedSrc = toBase64(`<body style="${IFRAME_BODY_STYLE}">${svgCode}</body>`);
  return `<iframe style="width:${IFRAME_WIDTH};height:${height};${IFRAME_STYLES}" src="data:text/html;charset=UTF-8;base64,${base64encodedSrc}" sandbox="${IFRAME_SANDBOX_OPTS}">
  ${IFRAME_NOT_SUPPORTED_MSG}
</iframe>`;
}, "putIntoIFrame");
var appendDivSvgG = __name((parentRoot, id33, enclosingDivId, divStyle, svgXlink) => {
  const enclosingDiv = parentRoot.append("div");
  enclosingDiv.attr("id", enclosingDivId);
  if (divStyle) {
    enclosingDiv.attr("style", divStyle);
  }
  const svgNode = enclosingDiv.append("svg").attr("id", id33).attr("width", "100%").attr("xmlns", XMLNS_SVG_STD);
  if (svgXlink) {
    svgNode.attr("xmlns:xlink", svgXlink);
  }
  svgNode.append("g");
  return parentRoot;
}, "appendDivSvgG");
function sandboxedIframe(parentNode, iFrameId) {
  return parentNode.append("iframe").attr("id", iFrameId).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
__name(sandboxedIframe, "sandboxedIframe");
var removeExistingElements = __name((doc, id33, divId, iFrameId) => {
  var _a3, _b, _c;
  (_a3 = doc.getElementById(id33)) == null ? void 0 : _a3.remove();
  (_b = doc.getElementById(divId)) == null ? void 0 : _b.remove();
  (_c = doc.getElementById(iFrameId)) == null ? void 0 : _c.remove();
}, "removeExistingElements");
var render2 = __name(async function(id33, text, svgContainingElement) {
  var _a3, _b, _c, _d, _e, _f;
  addDiagrams();
  const processed = processAndSetConfigs(text);
  text = processed.code;
  const config = getConfig();
  log.debug(config);
  if (text.length > ((config == null ? void 0 : config.maxTextSize) ?? MAX_TEXTLENGTH)) {
    text = MAX_TEXTLENGTH_EXCEEDED_MSG;
  }
  const idSelector = `#${id33}`;
  const iFrameID = "i" + id33;
  const iFrameID_selector = "#" + iFrameID;
  const enclosingDivID = "d" + id33;
  const enclosingDivID_selector = "#" + enclosingDivID;
  const removeTempElements = __name(() => {
    const tmpElementSelector = isSandboxed ? iFrameID_selector : enclosingDivID_selector;
    const node2 = select_default(tmpElementSelector).node();
    if (node2 && "remove" in node2) {
      node2.remove();
    }
  }, "removeTempElements");
  let root = select_default(document.body);
  const isSandboxed = config.securityLevel === SECURITY_LVL_SANDBOX;
  const isLooseSecurityLevel = config.securityLevel === SECURITY_LVL_LOOSE;
  const fontFamily = config.fontFamily;
  if (svgContainingElement !== void 0) {
    if (svgContainingElement) {
      svgContainingElement.innerHTML = "";
    }
    if (isSandboxed) {
      const iframe = sandboxedIframe(select_default(svgContainingElement), iFrameID);
      root = select_default(iframe.nodes()[0].contentDocument.body);
      root.node().style.margin = "0";
    } else {
      root = select_default(svgContainingElement);
    }
    appendDivSvgG(root, id33, enclosingDivID, `font-family: ${fontFamily}`, XMLNS_XLINK_STD);
  } else {
    removeExistingElements(document, id33, enclosingDivID, iFrameID);
    if (isSandboxed) {
      const iframe = sandboxedIframe(select_default(document.body), iFrameID);
      root = select_default(iframe.nodes()[0].contentDocument.body);
      root.node().style.margin = "0";
    } else {
      root = select_default("body");
    }
    appendDivSvgG(root, id33, enclosingDivID);
  }
  let diag;
  let parseEncounteredException;
  try {
    diag = await Diagram.fromText(text, { title: processed.title });
  } catch (error) {
    if (config.suppressErrorRendering) {
      removeTempElements();
      throw error;
    }
    diag = await Diagram.fromText("error");
    parseEncounteredException = error;
  }
  const element = root.select(enclosingDivID_selector).node();
  const diagramType = diag.type;
  const svg = element.firstChild;
  const firstChild = svg.firstChild;
  const diagramClassDefs = (_b = (_a3 = diag.renderer).getClasses) == null ? void 0 : _b.call(_a3, text, diag);
  const rules = createUserStyles(config, diagramType, diagramClassDefs, idSelector);
  const style1 = document.createElement("style");
  style1.innerHTML = rules;
  svg.insertBefore(style1, firstChild);
  try {
    await diag.renderer.draw(text, id33, "11.15.0", diag);
  } catch (e2) {
    if (config.suppressErrorRendering) {
      removeTempElements();
    } else {
      errorRenderer_default.draw(text, id33, "11.15.0");
    }
    throw e2;
  }
  const svgNode = root.select(`${enclosingDivID_selector} svg`);
  const a11yTitle = (_d = (_c = diag.db).getAccTitle) == null ? void 0 : _d.call(_c);
  const a11yDescr = (_f = (_e = diag.db).getAccDescription) == null ? void 0 : _f.call(_e);
  addA11yInfo(diagramType, svgNode, a11yTitle, a11yDescr);
  root.select(`[id="${id33}"]`).selectAll("foreignobject > *").attr("xmlns", XMLNS_XHTML_STD);
  let svgCode = root.select(enclosingDivID_selector).node().innerHTML;
  log.debug("config.arrowMarkerAbsolute", config.arrowMarkerAbsolute);
  svgCode = cleanUpSvgCode(svgCode, isSandboxed, evaluate(config.arrowMarkerAbsolute));
  if (isSandboxed) {
    const svgEl = root.select(enclosingDivID_selector + " svg").node();
    svgCode = putIntoIFrame(svgCode, svgEl);
  } else if (!isLooseSecurityLevel) {
    svgCode = purify.sanitize(svgCode, {
      ADD_TAGS: DOMPURIFY_TAGS,
      ADD_ATTR: DOMPURIFY_ATTR,
      HTML_INTEGRATION_POINTS: { foreignobject: true }
    });
  }
  attachFunctions();
  if (parseEncounteredException) {
    throw parseEncounteredException;
  }
  removeTempElements();
  return {
    diagramType,
    svg: svgCode,
    bindFunctions: diag.db.bindFunctions
  };
}, "render");
function initialize(userOptions = {}) {
  var _a3;
  const options = assignWithDepth_default({}, userOptions);
  if ((options == null ? void 0 : options.fontFamily) && !((_a3 = options.themeVariables) == null ? void 0 : _a3.fontFamily)) {
    if (!options.themeVariables) {
      options.themeVariables = {};
    }
    options.themeVariables.fontFamily = options.fontFamily;
  }
  saveConfigFromInitialize(options);
  if ((options == null ? void 0 : options.theme) && options.theme in themes_default) {
    options.themeVariables = themes_default[options.theme].getThemeVariables(
      options.themeVariables
    );
  } else if (options) {
    options.themeVariables = themes_default.default.getThemeVariables(options.themeVariables);
  }
  const config = typeof options === "object" ? setSiteConfig(options) : getSiteConfig();
  setLogLevel(config.logLevel);
  addDiagrams();
}
__name(initialize, "initialize");
var getDiagramFromText = __name((text, metadata = {}) => {
  const { code } = preprocessDiagram(text);
  return Diagram.fromText(code, metadata);
}, "getDiagramFromText");
function addA11yInfo(diagramType, svgNode, a11yTitle, a11yDescr) {
  setA11yDiagramInfo(svgNode, diagramType);
  addSVGa11yTitleDescription(svgNode, a11yTitle, a11yDescr, svgNode.attr("id"));
}
__name(addA11yInfo, "addA11yInfo");
var mermaidAPI = Object.freeze({
  render: render2,
  parse: parse2,
  getDiagramFromText,
  initialize,
  getConfig,
  setConfig,
  getSiteConfig,
  updateSiteConfig,
  reset: __name(() => {
    reset();
  }, "reset"),
  globalReset: __name(() => {
    reset(defaultConfig);
  }, "globalReset"),
  defaultConfig
});
setLogLevel(getConfig().logLevel);
reset(getConfig());
var handleError = __name((error, errors, parseError) => {
  log.warn(error);
  if (isDetailedError(error)) {
    if (parseError) {
      parseError(error.str, error.hash);
    }
    errors.push({ ...error, message: error.str, error });
  } else {
    if (parseError) {
      parseError(error);
    }
    if (error instanceof Error) {
      errors.push({
        str: error.message,
        message: error.message,
        hash: error.name,
        error
      });
    }
  }
}, "handleError");
var run = __name(async function(options = {
  querySelector: ".mermaid"
}) {
  try {
    await runThrowsErrors(options);
  } catch (e2) {
    if (isDetailedError(e2)) {
      log.error(e2.str);
    }
    if (mermaid.parseError) {
      mermaid.parseError(e2);
    }
    if (!options.suppressErrors) {
      log.error("Use the suppressErrors option to suppress these errors");
      throw e2;
    }
  }
}, "run");
var runThrowsErrors = __name(async function({ postRenderCallback, querySelector, nodes } = {
  querySelector: ".mermaid"
}) {
  const conf = mermaidAPI.getConfig();
  log.debug(`${!postRenderCallback ? "No " : ""}Callback function found`);
  let nodesToProcess;
  if (nodes) {
    nodesToProcess = nodes;
  } else if (querySelector) {
    nodesToProcess = document.querySelectorAll(querySelector);
  } else {
    throw new Error("Nodes and querySelector are both undefined");
  }
  log.debug(`Found ${nodesToProcess.length} diagrams`);
  if ((conf == null ? void 0 : conf.startOnLoad) !== void 0) {
    log.debug("Start On Load: " + (conf == null ? void 0 : conf.startOnLoad));
    mermaidAPI.updateSiteConfig({ startOnLoad: conf == null ? void 0 : conf.startOnLoad });
  }
  const idGenerator = new utils_default.InitIDGenerator(conf.deterministicIds, conf.deterministicIDSeed);
  let txt;
  const errors = [];
  for (const element of Array.from(nodesToProcess)) {
    log.info("Rendering diagram: " + element.id);
    if (element.getAttribute("data-processed")) {
      continue;
    }
    element.setAttribute("data-processed", "true");
    const id33 = `mermaid-${idGenerator.next()}`;
    txt = element.innerHTML;
    txt = dedent(utils_default.entityDecode(txt)).trim().replace(/<br\s*\/?>/gi, "<br/>");
    const init2 = utils_default.detectInit(txt);
    if (init2) {
      log.debug("Detected early reinit: ", init2);
    }
    try {
      const { svg, bindFunctions } = await render22(id33, txt, element);
      element.innerHTML = svg;
      if (postRenderCallback) {
        await postRenderCallback(id33);
      }
      if (bindFunctions) {
        bindFunctions(element);
      }
    } catch (error) {
      handleError(error, errors, mermaid.parseError);
    }
  }
  if (errors.length > 0) {
    throw errors[0];
  }
}, "runThrowsErrors");
var initialize2 = __name(function(config) {
  mermaidAPI.initialize(config);
}, "initialize");
var init = __name(async function(config, nodes, callback) {
  log.warn("mermaid.init is deprecated. Please use run instead.");
  if (config) {
    initialize2(config);
  }
  const runOptions = { postRenderCallback: callback, querySelector: ".mermaid" };
  if (typeof nodes === "string") {
    runOptions.querySelector = nodes;
  } else if (nodes) {
    if (nodes instanceof HTMLElement) {
      runOptions.nodes = [nodes];
    } else {
      runOptions.nodes = nodes;
    }
  }
  await run(runOptions);
}, "init");
var registerExternalDiagrams = __name(async (diagrams, {
  lazyLoad = true
} = {}) => {
  addDiagrams();
  registerLazyLoadedDiagrams(...diagrams);
  if (lazyLoad === false) {
    await loadRegisteredDiagrams();
  }
}, "registerExternalDiagrams");
var contentLoaded = __name(function() {
  if (mermaid.startOnLoad) {
    const { startOnLoad } = mermaidAPI.getConfig();
    if (startOnLoad) {
      mermaid.run().catch((err) => log.error("Mermaid failed to initialize", err));
    }
  }
}, "contentLoaded");
if (typeof document !== "undefined") {
  window.addEventListener("load", contentLoaded, false);
}
var setParseErrorHandler = __name(function(parseErrorHandler) {
  mermaid.parseError = parseErrorHandler;
}, "setParseErrorHandler");
var executionQueue = [];
var executionQueueRunning = false;
var executeQueue = __name(async () => {
  if (executionQueueRunning) {
    return;
  }
  executionQueueRunning = true;
  while (executionQueue.length > 0) {
    const f = executionQueue.shift();
    if (f) {
      try {
        await f();
      } catch (e2) {
        log.error("Error executing queue", e2);
      }
    }
  }
  executionQueueRunning = false;
}, "executeQueue");
var parse22 = __name(async (text, parseOptions) => {
  return new Promise((resolve, reject) => {
    const performCall = __name(() => new Promise((res, rej) => {
      mermaidAPI.parse(text, parseOptions).then(
        (r) => {
          res(r);
          resolve(r);
        },
        (e2) => {
          var _a3;
          log.error("Error parsing", e2);
          (_a3 = mermaid.parseError) == null ? void 0 : _a3.call(mermaid, e2);
          rej(e2);
          reject(e2);
        }
      );
    }), "performCall");
    executionQueue.push(performCall);
    executeQueue().catch(reject);
  });
}, "parse");
var render22 = __name((id33, text, container) => {
  return new Promise((resolve, reject) => {
    const performCall = __name(() => new Promise((res, rej) => {
      mermaidAPI.render(id33, text, container).then(
        (r) => {
          res(r);
          resolve(r);
        },
        (e2) => {
          var _a3;
          log.error("Error parsing", e2);
          (_a3 = mermaid.parseError) == null ? void 0 : _a3.call(mermaid, e2);
          rej(e2);
          reject(e2);
        }
      );
    }), "performCall");
    executionQueue.push(performCall);
    executeQueue().catch(reject);
  });
}, "render");
var getRegisteredDiagramsMetadata = __name(() => {
  return Object.keys(detectors).map((id33) => ({
    id: id33
  }));
}, "getRegisteredDiagramsMetadata");
var mermaid = {
  startOnLoad: true,
  mermaidAPI,
  parse: parse22,
  render: render22,
  init,
  run,
  registerExternalDiagrams,
  registerLayoutLoaders,
  initialize: initialize2,
  parseError: void 0,
  contentLoaded,
  setParseErrorHandler,
  detectType,
  registerIconPacks,
  getRegisteredDiagramsMetadata
};
var mermaid_default = mermaid;

// ../../node_modules/.pnpm/vitepress-mermaid-renderer@1.1.26_mermaid@11.15.0_vue@3.5.35_typescript@6.0.3_/node_modules/vitepress-mermaid-renderer/dist/vitepress-mermaid-renderer.js
function e() {
  for (const t of ne) try {
    t();
  } catch (e2) {
  }
}
var k = ["title", "aria-label"];
var M = ["innerHTML"];
var C = { key: 1, class: "zoom-level" };
var z = ["title", "aria-label"];
var T = ["innerHTML"];
var L = ["title", "aria-label"];
var F = ["innerHTML"];
var D = ["title", "aria-label"];
var H = ["innerHTML"];
var I = { key: 0, class: "copied-notification" };
var O = ["title", "aria-label"];
var A = ["innerHTML"];
var P = ["title", "aria-label"];
var E = ["innerHTML"];
var R = { class: "mobile-utility-controls" };
var V = ["title", "aria-label"];
var B = ["innerHTML"];
var j = { key: 1, class: "zoom-level mobile-zoom-level" };
var W = ["title", "aria-label"];
var Y = ["innerHTML"];
var U = ["title", "aria-label"];
var q = ["innerHTML"];
var S = ["title", "aria-label"];
var $ = ["innerHTML"];
var _ = { key: 0, class: "copied-notification" };
var N = ["title", "aria-label"];
var X = ["innerHTML"];
var Z = ["title", "aria-label"];
var G = ["innerHTML"];
var K = defineComponent({ t: "MermaidControls", props: { scale: {}, code: {}, isFullscreen: { type: Boolean }, toolbar: {} }, emits: ["zoomIn", "zoomOut", "resetView", "toggleFullscreen", "panUp", "panDown", "panLeft", "panRight", "download"], setup(e2, { expose: t, emit: a }) {
  const l = '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line>', s = '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line>', d = '<path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.9 3.2L21 8"></path><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.9-3.2L3 16"></path>', c = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>', u = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>', p = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>', h2 = e2, b = () => h2.isFullscreen ? h2.toolbar.fullscreen : h2.toolbar.desktop, v = () => h2.isFullscreen ? h2.toolbar.fullscreen : h2.toolbar.mobile, y = (e3) => "enabled" === b().buttons[e3], x = (e3) => "enabled" === v().buttons[e3], K2 = (e3) => h2.toolbar.i18n.tooltips[e3], Q2 = computed(() => h2.toolbar.i18n.tooltips.copyCodeCopied ?? "Copied"), J2 = a, ee2 = ref(null), te2 = ref(null), re2 = ref(false), oe2 = (e3) => [`toolbar-vertical-${e3.vertical}`, `toolbar-horizontal-${e3.horizontal}`], ne2 = computed(() => {
    const e3 = b().positions;
    return oe2(e3);
  }), ie2 = computed(() => {
    const e3 = v().positions;
    return oe2(e3);
  }), ae2 = (e3) => Object.values(e3).some((e4) => "enabled" === e4), le2 = computed(() => "enabled" === b().zoomLevel), se2 = computed(() => "enabled" === v().zoomLevel), de2 = computed(() => ae2(b().buttons) || le2.value), ce2 = computed(() => ae2(v().buttons) || se2.value), me2 = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API not available in this browser.");
      await navigator.clipboard.writeText(h2.code);
      re2.value = true;
      setTimeout(() => {
        re2.value = false;
      }, 1e3);
    } catch (e3) {
      alert("Failed to copy to clipboard. Your browser might not support this feature.");
    }
  }, ue2 = () => {
    J2("download", h2.toolbar.downloadFormat);
  };
  t({ updateFullscreenControls: () => {
    try {
      if (h2.isFullscreen) {
        ee2.value && ee2.value.classList.add("force-show");
        te2.value && te2.value.classList.add("force-show");
      } else {
        ee2.value && ee2.value.classList.remove("force-show");
        te2.value && te2.value.classList.remove("force-show");
      }
    } catch (e3) {
    }
  } });
  return (t2, r) => (openBlock(), createElementBlock("div", null, [de2.value ? (openBlock(), createElementBlock("div", { key: 0, class: normalizeClass(["desktop-controls controls visible-controls", ne2.value]), ref_key: "controls", ref: ee2 }, [y("zoomIn") ? (openBlock(), createElementBlock("button", { key: 0, onClick: r[0] || (r[0] = (e3) => t2.$emit("zoomIn")), title: K2("zoomIn"), "aria-label": K2("zoomIn"), "data-mermaid-control": "zoomIn" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: l }, null, 8, M))], 8, k)) : createCommentVNode("", true), le2.value ? (openBlock(), createElementBlock("span", C, toDisplayString(Math.round(100 * e2.scale)) + "% ", 1)) : createCommentVNode("", true), y("zoomOut") ? (openBlock(), createElementBlock("button", { key: 2, onClick: r[1] || (r[1] = (e3) => t2.$emit("zoomOut")), title: K2("zoomOut"), "aria-label": K2("zoomOut"), "data-mermaid-control": "zoomOut" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: s }, null, 8, T))], 8, z)) : createCommentVNode("", true), y("resetView") ? (openBlock(), createElementBlock("button", { key: 3, onClick: r[2] || (r[2] = (e3) => t2.$emit("resetView")), title: K2("resetView"), "aria-label": K2("resetView"), "data-mermaid-control": "resetView" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: d }, null, 8, F))], 8, L)) : createCommentVNode("", true), y("copyCode") ? (openBlock(), createElementBlock("button", { key: 4, onClick: me2, title: K2("copyCode"), "aria-label": K2("copyCode"), "data-mermaid-control": "copyCode" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: c }, null, 8, H)), re2.value ? (openBlock(), createElementBlock("span", I, toDisplayString(Q2.value), 1)) : createCommentVNode("", true)], 8, D)) : createCommentVNode("", true), y("download") ? (openBlock(), createElementBlock("button", { key: 5, onClick: ue2, title: K2("download"), "aria-label": K2("download"), "data-mermaid-control": "download" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: u }, null, 8, A))], 8, O)) : createCommentVNode("", true), y("toggleFullscreen") ? (openBlock(), createElementBlock("button", { key: 6, onClick: r[3] || (r[3] = (e3) => t2.$emit("toggleFullscreen")), title: K2("toggleFullscreen"), "aria-label": K2("toggleFullscreen"), "data-mermaid-control": "toggleFullscreen" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: p }, null, 8, E))], 8, P)) : createCommentVNode("", true)], 2)) : createCommentVNode("", true), ce2.value ? (openBlock(), createElementBlock("div", { key: 1, class: normalizeClass(["mobile-controls controls visible-controls", ie2.value]), ref_key: "mobileControls", ref: te2 }, [createBaseVNode("div", R, [x("zoomIn") ? (openBlock(), createElementBlock("button", { key: 0, onClick: r[4] || (r[4] = (e3) => t2.$emit("zoomIn")), title: K2("zoomIn"), "aria-label": K2("zoomIn"), "data-mermaid-control": "zoomIn" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: l }, null, 8, B))], 8, V)) : createCommentVNode("", true), se2.value ? (openBlock(), createElementBlock("span", j, toDisplayString(Math.round(100 * e2.scale)) + "% ", 1)) : createCommentVNode("", true), x("zoomOut") ? (openBlock(), createElementBlock("button", { key: 2, onClick: r[5] || (r[5] = (e3) => t2.$emit("zoomOut")), title: K2("zoomOut"), "aria-label": K2("zoomOut"), "data-mermaid-control": "zoomOut" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: s }, null, 8, Y))], 8, W)) : createCommentVNode("", true), x("resetView") ? (openBlock(), createElementBlock("button", { key: 3, onClick: r[6] || (r[6] = (e3) => t2.$emit("resetView")), title: K2("resetView"), "aria-label": K2("resetView"), "data-mermaid-control": "resetView" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: d }, null, 8, q))], 8, U)) : createCommentVNode("", true), x("copyCode") ? (openBlock(), createElementBlock("button", { key: 4, onClick: me2, title: K2("copyCode"), "aria-label": K2("copyCode"), "data-mermaid-control": "copyCode" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: c }, null, 8, $)), re2.value ? (openBlock(), createElementBlock("span", _, toDisplayString(Q2.value), 1)) : createCommentVNode("", true)], 8, S)) : createCommentVNode("", true), x("download") ? (openBlock(), createElementBlock("button", { key: 5, onClick: ue2, title: K2("download"), "aria-label": K2("download"), "data-mermaid-control": "download" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: u }, null, 8, X))], 8, N)) : createCommentVNode("", true), x("toggleFullscreen") ? (openBlock(), createElementBlock("button", { key: 6, onClick: r[7] || (r[7] = (e3) => t2.$emit("toggleFullscreen")), title: K2("toggleFullscreen"), "aria-label": K2("toggleFullscreen"), "data-mermaid-control": "toggleFullscreen" }, [(openBlock(), createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", innerHTML: p }, null, 8, G))], 8, Z)) : createCommentVNode("", true)])], 2)) : createCommentVNode("", true)]));
} });
var Q = { key: 0, class: "diagram-error", role: "alert" };
var J = { class: "error-message" };
var ee = { key: 0, class: "error-details" };
var te = ((e2) => {
  const t = e2.o || e2;
  for (const [r, o] of [["__scopeId", "data-v-87a9d038"]]) t[r] = o;
  return t;
})(defineComponent({ t: "MermaidError", props: { renderError: { type: Boolean }, renderErrorDetails: {}, errorText: {}, showDetailsText: {}, hideDetailsText: {} }, setup(e2) {
  const t = e2, r = ref(false), a = () => {
    r.value = !r.value;
  };
  return (l, s) => e2.renderError ? (openBlock(), createElementBlock("div", Q, [createBaseVNode("div", J, [s[0] || (s[0] = createBaseVNode("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor" }, [createBaseVNode("circle", { cx: "12", cy: "12", r: "10" }), createBaseVNode("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), createBaseVNode("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })], -1)), createBaseVNode("span", null, toDisplayString(t.errorText || "Failed to render diagram"), 1), createBaseVNode("button", { onClick: a, class: "error-toggle-button" }, toDisplayString(r.value ? t.hideDetailsText || "Hide Details" : t.showDetailsText || "Show Details"), 1)]), r.value ? (openBlock(), createElementBlock("pre", ee, toDisplayString(e2.renderErrorDetails), 1)) : createCommentVNode("", true)])) : createCommentVNode("", true);
} }));
var re = Promise.resolve();
var oe = () => new Promise((e2) => requestAnimationFrame(() => e2()));
var ne = /* @__PURE__ */ new Set();
var ie = false;
var ae = { buttons: { zoomIn: "enabled", zoomOut: "enabled", resetView: "enabled", copyCode: "enabled", toggleFullscreen: "enabled", download: "disabled" }, positions: { vertical: "bottom", horizontal: "right" }, zoomLevel: "enabled" };
var le = { buttons: { zoomIn: "disabled", zoomOut: "disabled", resetView: "enabled", copyCode: "enabled", toggleFullscreen: "enabled", download: "disabled" }, positions: { vertical: "bottom", horizontal: "right" }, zoomLevel: "enabled" };
var se = { buttons: { zoomIn: "disabled", zoomOut: "disabled", resetView: "disabled", copyCode: "disabled", toggleFullscreen: "enabled", download: "disabled" }, positions: { vertical: "bottom", horizontal: "right" }, zoomLevel: "enabled" };
var de = { zoomIn: "Zoom In", zoomOut: "Zoom Out", resetView: "Reset View", copyCode: "Copy Code", copyCodeCopied: "Copied", download: "Download Diagram", toggleFullscreen: "Toggle Fullscreen", renderErrorText: "Failed to render diagram", toggleErrorDetailsText: "Show Details", toggleErrorDetailsHideText: "Hide Details" };
var ce = (e2, t) => ({ vertical: (t == null ? void 0 : t.vertical) ?? e2.vertical, horizontal: (t == null ? void 0 : t.horizontal) ?? e2.horizontal });
var me = (e2) => "enabled" === e2 || "disabled" === e2;
var ue = (e2, t) => {
  if (!t) return { ...e2 };
  const r = { ...e2 };
  Object.keys(t).forEach((e3) => {
    if ("positions" === e3 || "zoomLevel" === e3) return;
    const o = e3, n = t[o];
    me(n) && (r[o] = n);
  });
  return r;
};
var pe = (e2, t) => ({ buttons: ue(e2.buttons, t), positions: ce(e2.positions, t == null ? void 0 : t.positions), zoomLevel: (t == null ? void 0 : t.zoomLevel) && me(t.zoomLevel) ? t.zoomLevel : e2.zoomLevel });
var he = (e2) => "string" == typeof e2 && e2.length > 0;
var ge = (e2) => {
  var _a3, _b;
  const t = he(e2 == null ? void 0 : e2.localeIndex) ? e2.localeIndex : "root", r = (_b = (_a3 = e2 == null ? void 0 : e2.locales) == null ? void 0 : _a3[t]) == null ? void 0 : _b.tooltips, o = e2 == null ? void 0 : e2.tooltips, n = de;
  return { localeIndex: t, tooltips: ["zoomIn", "zoomOut", "resetView", "copyCode", "copyCodeCopied", "toggleFullscreen", "download", "renderErrorText", "toggleErrorDetailsText", "toggleErrorDetailsHideText"].reduce((e3, t2) => {
    e3[t2] = ((e4, ...t3) => {
      for (const r2 of t3) {
        const t4 = r2 == null ? void 0 : r2[e4];
        if (he(t4)) return t4;
      }
    })(t2, r, o) ?? n[t2];
    return e3;
  }, {}) };
};
var fe = (e2) => {
  const t = (e2 == null ? void 0 : e2.showLanguageLabel) ?? true, r = (e2 == null ? void 0 : e2.downloadFormat) ?? "svg", o = (e2 == null ? void 0 : e2.fullscreenMode) ?? "browser";
  return { desktop: pe(ae, e2 == null ? void 0 : e2.desktop), mobile: pe(le, e2 == null ? void 0 : e2.mobile), fullscreen: pe(se, e2 == null ? void 0 : e2.fullscreen), showLanguageLabel: t, downloadFormat: r, fullscreenMode: o, i18n: ge(e2 == null ? void 0 : e2.i18n) };
};
var be = ["aria-label"];
var we = { role: "status", "aria-live": "polite", class: "sr-only" };
var ve = ["aria-label"];
var ye = defineComponent({ t: "MermaidDiagram", props: { code: {}, config: {}, toolbar: {} }, emits: ["renderComplete"], setup(l, { emit: d }) {
  var _a3;
  const b = d, k2 = l, M2 = (e2) => {
    return e2 && (t = e2, Boolean(t && t.desktop && "object" == typeof t.desktop && "buttons" in t.desktop && "positions" in t.desktop && "zoomLevel" in t.desktop && "boolean" == typeof t.showLanguageLabel && "string" == typeof t.downloadFormat && "string" == typeof t.fullscreenMode && !!t.i18n && "object" == typeof t.i18n && "string" == typeof t.i18n.localeIndex && !!t.i18n.tooltips && "object" == typeof t.i18n.tooltips)) ? e2 : fe(e2);
    var t;
  }, C2 = ref(M2(k2.toolbar)), z2 = function(e2 = {}) {
    const t = e2.minScale ?? 0.2, r = e2.maxScale ?? 10, o = e2.zoomStep ?? 1.2, n = ref(1), i = ref(0), a = ref(0), l2 = ref(false), s = ref(false), d2 = ref(0), c = ref(0), m = ref(0), u = ref(false), p = ref(0), h2 = ref(0), g = ref(null), b2 = () => "undefined" != typeof window && window.matchMedia("(max-width: 768px)").matches && !s.value;
    watch(s, (e3) => {
      e3 ? g.value = { scale: n.value, translateX: i.value, translateY: a.value } : (() => {
        if (g.value) {
          n.value = g.value.scale;
          i.value = g.value.translateX;
          a.value = g.value.translateY;
          l2.value = false;
          u.value = false;
          m.value = 0;
          g.value = null;
        }
      })();
    }, { flush: "sync" });
    return { scale: n, translateX: i, translateY: a, isPanning: l2, isFullscreen: s, zoomIn: () => {
      n.value = n.value * o;
    }, zoomOut: () => {
      n.value > t && (n.value = n.value / o);
    }, resetView: () => {
      n.value = 1;
      i.value = 0;
      a.value = 0;
    }, toggleFullscreen: (e3, t2 = "browser") => {
      try {
        if ("dialog" === t2) {
          s.value = !s.value;
          return;
        }
        if (document.fullscreenElement) {
          document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen();
          s.value = false;
        } else {
          if (e3 == null ? void 0 : e3.requestFullscreen) e3.requestFullscreen();
          else if (e3 == null ? void 0 : e3.webkitRequestFullscreen) e3.webkitRequestFullscreen();
          else if (e3 == null ? void 0 : e3.mozRequestFullScreen) e3.mozRequestFullScreen();
          else {
            if (!(e3 == null ? void 0 : e3.msRequestFullscreen)) throw new Error("Fullscreen API not available");
            e3.msRequestFullscreen();
          }
          s.value = true;
        }
      } catch (r2) {
        alert("Fullscreen mode is not supported in this browser.");
      }
    }, startPan: (e3) => {
      l2.value = true;
      d2.value = e3.clientX;
      c.value = e3.clientY;
    }, pan: (e3) => {
      if (!l2.value) return;
      const t2 = e3.clientY - c.value;
      i.value += (e3.clientX - d2.value) / n.value;
      a.value += t2 / n.value;
      d2.value = e3.clientX;
      c.value = e3.clientY;
    }, endPan: () => {
      l2.value = false;
    }, handleWheel: (e3) => {
      if (!e3.ctrlKey && !s.value) return;
      e3.preventDefault();
      const o2 = 0.1 * -Math.sign(e3.deltaY), i2 = n.value * (1 + o2);
      i2 >= t && i2 <= r && (n.value = i2);
    }, handleTouchStart: (e3) => {
      if (b2()) {
        if (2 === e3.touches.length) {
          e3.preventDefault();
          u.value = false;
          const t2 = e3.touches[0], r2 = e3.touches[1];
          m.value = Math.hypot(r2.clientX - t2.clientX, r2.clientY - t2.clientY);
          p.value = (t2.clientX + r2.clientX) / 2;
          h2.value = (t2.clientY + r2.clientY) / 2;
        }
      } else if (1 === e3.touches.length) {
        u.value = true;
        p.value = e3.touches[0].clientX;
        h2.value = e3.touches[0].clientY;
      } else if (2 === e3.touches.length) {
        u.value = false;
        const t2 = e3.touches[0], r2 = e3.touches[1];
        m.value = Math.hypot(r2.clientX - t2.clientX, r2.clientY - t2.clientY);
      }
    }, handleTouchMove: (e3) => {
      if (b2()) {
        if (1 === e3.touches.length) return;
        if (2 === e3.touches.length) {
          e3.preventDefault();
          const o2 = e3.touches[0], l3 = e3.touches[1], s2 = Math.hypot(l3.clientX - o2.clientX, l3.clientY - o2.clientY);
          if (m.value > 0) {
            const e4 = n.value * (1 + 0.2 * (s2 / m.value - 1));
            e4 >= t && e4 <= r && (n.value = e4);
            m.value = s2;
          }
          const d3 = (o2.clientX + l3.clientX) / 2, c2 = (o2.clientY + l3.clientY) / 2;
          i.value += (d3 - p.value) / n.value;
          a.value += (c2 - h2.value) / n.value;
          p.value = d3;
          h2.value = c2;
        }
      } else {
        e3.preventDefault();
        if (u.value && 1 === e3.touches.length) {
          const t2 = e3.touches[0], r2 = t2.clientY - h2.value;
          i.value += (t2.clientX - p.value) / n.value;
          a.value += r2 / n.value;
          p.value = t2.clientX;
          h2.value = t2.clientY;
        } else if (2 === e3.touches.length) {
          const o2 = e3.touches[0], i2 = e3.touches[1], a2 = Math.hypot(i2.clientX - o2.clientX, i2.clientY - o2.clientY);
          if (m.value > 0) {
            const e4 = n.value * (1 + 0.2 * (a2 / m.value - 1));
            e4 >= t && e4 <= r && (n.value = e4);
            m.value = a2;
          }
        }
      }
    }, handleTouchEnd: () => {
      u.value = false;
      m.value = 0;
    }, panUp: () => {
      a.value -= 50 / n.value;
    }, panDown: () => {
      a.value += 50 / n.value;
    }, panLeft: () => {
      i.value -= 50 / n.value;
    }, panRight: () => {
      i.value += 50 / n.value;
    }, updateFullscreenControls: (e3) => {
      try {
        if (document.fullscreenElement) {
          s.value = true;
          e3.controls && e3.controls.classList.add("force-show");
          e3.mobileControls && e3.mobileControls.classList.add("force-show");
        } else {
          s.value = false;
          e3.controls && e3.controls.classList.remove("force-show");
          e3.mobileControls && e3.mobileControls.classList.remove("force-show");
        }
      } catch (t2) {
      }
    } };
  }(), T2 = function(e2 = {}) {
    const t = ref(false), r = ref(false), o = ref(false), n = ref(""), i = ref({ width: 0, height: 0 }), a = ref(null);
    let l2 = null;
    const s = { theme: "default", securityLevel: "strict", startOnLoad: false, flowchart: { useMaxWidth: false, htmlLabels: true }, sequence: { diagramMarginX: 50, diagramMarginY: 10, actorMargin: 50, width: 150, height: 65, boxMargin: 10, boxTextMargin: 5, noteMargin: 10, messageMargin: 35, mirrorActors: true, bottomMarginAdj: 1, useMaxWidth: false, rightAngles: false, showSequenceNumbers: false }, gantt: { useMaxWidth: false, topPadding: 50, leftPadding: 50, rightPadding: 50, gridLineStartPadding: 35, barHeight: 50, barGap: 40, displayMode: "compact", axisFormat: "%Y-%m-%d", topAxis: false, tickInterval: "day", useWidth: 2048 }, class: { arrowMarkerAbsolute: false, useMaxWidth: false }, journey: { useMaxWidth: false }, pie: {}, c4: { useMaxWidth: false, diagramMarginX: 20, diagramMarginY: 20 }, gitGraph: { useMaxWidth: false, rotateCommitLabel: false, showBranches: true, showCommitLabel: true, mainBranchName: "main" } }, d2 = (t2) => {
      mermaid_default.initialize({ ...s, ...e2.config, ...t2 });
    }, m = (e3) => {
      d2(e3.detail);
      const t2 = a.value;
      if (t2) {
        r.value = false;
        nextTick(() => {
          g(t2.id, t2.code);
        });
      }
    }, u = (e3) => {
      const t2 = e3.trim().toLowerCase();
      return t2.startsWith("c4context") || t2.startsWith("c4container") || t2.startsWith("c4component") || t2.startsWith("c4dynamic") || t2.startsWith("c4deployment") ? "c4" : t2.startsWith("gitgraph") || t2.includes("gitgraph:") ? "gitgraph" : t2.startsWith("flowchart") || t2.startsWith("graph") ? "flowchart" : t2.startsWith("sequencediagram") || t2.startsWith("sequenceDiagram") ? "sequence" : t2.startsWith("gantt") ? "gantt" : "unknown";
    }, g = async (t2, s2, d3 = 0, c = 3) => {
      var _a4;
      try {
        let m2 = document.getElementById(t2);
        if (!m2) {
          if (d3 < c) {
            const e3 = 100 * Math.pow(2, d3);
            await new Promise((t3) => setTimeout(t3, e3));
            return g(t2, s2, d3 + 1, c);
          }
          throw new Error("Failed to find diagram container element");
        }
        a.value = { id: t2, code: s2 };
        m2.textContent = s2;
        m2.removeAttribute("data-processed");
        o.value = false;
        n.value = "";
        r.value = false;
        m2.classList.add("mermaid-rendering");
        await (() => {
          const a2 = re.catch(() => {
          }).then(() => (async () => {
            var _a5, _b, _c;
            try {
              await mermaid_default.run({ nodes: [m2], suppressErrors: false });
              await oe();
              if (m2.firstElementChild) {
                const e3 = m2.querySelector("svg");
                if (e3) {
                  await oe();
                  if ((_a5 = m2.parentElement) == null ? void 0 : _a5.querySelector(".diagram-wrapper")) {
                    const t3 = u(s2);
                    m2.classList.add(`mermaid-${t3}`);
                    if ("c4" === t3 || "gitgraph" === t3) {
                      e3.style.width = "100%";
                      e3.style.height = "auto";
                      e3.style.maxWidth = "100%";
                      e3.style.display = "block";
                      e3.removeAttribute("width");
                      e3.removeAttribute("height");
                      if (!e3.getAttribute("viewBox")) try {
                        const t4 = e3.getBBox();
                        if (t4.width && t4.height) {
                          e3.setAttribute("viewBox", `0 0 ${t4.width} ${t4.height}`);
                          e3.setAttribute("preserveAspectRatio", "xMidYMid meet");
                        }
                      } catch (a3) {
                      }
                      e3.style.display = "none";
                      e3.style.display = "block";
                    }
                  }
                  i.value = { width: e3.getBoundingClientRect().width, height: e3.getBoundingClientRect().height };
                }
              }
              r.value = true;
              o.value = false;
              (_b = e2.onRenderComplete) == null ? void 0 : _b.call(e2, { id: t2, success: true });
            } catch (a3) {
              o.value = true;
              n.value = a3 instanceof Error ? a3.toString() : "Unknown error rendering diagram";
              r.value = true;
              (_c = e2.onRenderComplete) == null ? void 0 : _c.call(e2, { id: t2, success: false, error: a3 });
              "undefined" != typeof window && 0 === d3 && (l2 = setTimeout(() => {
                l2 = null;
                g(t2, s2, d3 + 1, c);
              }, 1e3));
            } finally {
              m2.classList.remove("mermaid-rendering");
            }
          })());
          re = a2.catch(() => {
          });
          return a2;
        })();
      } catch (m2) {
        o.value = true;
        n.value = m2 instanceof Error ? m2.toString() : "Unknown error initializing component";
        (_a4 = e2.onRenderComplete) == null ? void 0 : _a4.call(e2, { id: t2, success: false, error: m2 });
      }
    };
    onMounted(() => {
      t.value = true;
      d2();
      document.addEventListener("vitepress-mermaid:config-updated", m);
    });
    onUnmounted(() => {
      if (l2) {
        clearTimeout(l2);
        l2 = null;
      }
      document.removeEventListener("vitepress-mermaid:config-updated", m);
    });
    return { mounted: t, isRendered: r, renderError: o, renderErrorDetails: n, originalDiagramSize: i, renderMermaidDiagram: g, detectDiagramType: u };
  }({ config: k2.config, onRenderComplete: (e2) => b("renderComplete", e2) }), { scale: L2, translateX: F2, translateY: D2, isPanning: H2, isFullscreen: I2, zoomIn: O2, zoomOut: A2, resetView: P2, toggleFullscreen: E2, startPan: R2, pan: V2, endPan: B2, handleWheel: j2, handleTouchStart: W2, handleTouchMove: Y2, handleTouchEnd: U2, panUp: q2, panDown: S2, panLeft: $2, panRight: _2, updateFullscreenControls: N2 } = z2, { mounted: X2, isRendered: Z2, renderError: G2, renderErrorDetails: Q2, renderMermaidDiagram: J2 } = T2, ee2 = ref(null), ae2 = ref(null), le2 = `mermaid-${((_a3 = getCurrentInstance()) == null ? void 0 : _a3.uid) ?? Math.random().toString(36).slice(2)}`, { handleDownload: se2 } = (ke2 = { diagramId: le2 }, { handleDownload: async (e2) => {
    var _a4;
    const t = (_a4 = document.getElementById(ke2.diagramId)) == null ? void 0 : _a4.querySelector("svg");
    if (!t) return;
    const r = t.cloneNode(true);
    "svg" !== e2 && (r.style.backgroundColor = "white");
    ((e3) => {
      e3.querySelectorAll('script, iframe, object, embed, link[rel="stylesheet"]').forEach((e4) => e4.remove());
      e3.querySelectorAll("*").forEach((e4) => {
        Array.from(e4.attributes).forEach((t2) => {
          t2.name.startsWith("on") && t2.name.length > 2 && e4.removeAttribute(t2.name);
        });
      });
    })(r);
    const o = new XMLSerializer().serializeToString(r), n = new Blob([o], { type: "image/svg+xml;charset=utf-8" }), i = URL.createObjectURL(n), a = document.createElement("a");
    a.download = `diagram.${e2}`;
    if ("svg" === e2) {
      a.href = i;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(i);
      return;
    }
    const l2 = new Image();
    l2.onload = () => {
      const r2 = document.createElement("canvas"), o2 = t.viewBox.baseVal;
      let n2 = o2 == null ? void 0 : o2.width, s = o2 == null ? void 0 : o2.height;
      if (!n2 || !s) {
        const e3 = t.getBoundingClientRect();
        n2 = e3.width;
        s = e3.height;
      }
      r2.width = n2;
      r2.height = s;
      const d2 = r2.getContext("2d");
      if (d2) {
        d2.fillStyle = "white";
        d2.fillRect(0, 0, n2, s);
        d2.drawImage(l2, 0, 0);
        a.href = r2.toDataURL("png" === e2 ? "image/png" : "image/jpeg");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(i);
    };
    l2.onerror = (e3) => {
      URL.revokeObjectURL(i);
    };
    l2.src = i;
  } }), de2 = computed(() => C2.value.fullscreenMode), ce2 = computed(() => I2.value && "dialog" === de2.value), me2 = (e2) => {
    C2.value = M2(e2.detail);
  }, ue2 = () => {
    E2(ae2.value, de2.value);
  }, pe2 = (e2) => R2(e2), he2 = () => B2(), ge2 = () => B2(), ye2 = (e2) => W2(e2), xe2 = () => U2();
  var ke2;
  let Me2 = false, Ce2 = false, ze2 = null, Te2 = null;
  const Le = (e2) => {
    ze2 = e2;
    if (!Me2) {
      Me2 = true;
      requestAnimationFrame(() => {
        Me2 = false;
        if (ze2) {
          j2(ze2);
          ze2 = null;
        }
      });
    }
  }, Fe = (e2) => {
    if (H2.value) {
      Te2 = e2;
      if (!Ce2) {
        Ce2 = true;
        requestAnimationFrame(() => {
          Ce2 = false;
          if (Te2) {
            V2(Te2);
            Te2 = null;
          }
        });
      }
    }
  }, De = (e2) => Y2(e2), He = (e2) => {
    switch (e2.key) {
      case "+":
      case "=":
        O2();
        e2.preventDefault();
        break;
      case "-":
        A2();
        e2.preventDefault();
        break;
      case "0":
        P2();
        e2.preventDefault();
        break;
      case "ArrowUp":
        q2();
        e2.preventDefault();
        break;
      case "ArrowDown":
        S2();
        e2.preventDefault();
        break;
      case "ArrowLeft":
        $2();
        e2.preventDefault();
        break;
      case "ArrowRight":
        _2();
        e2.preventDefault();
        break;
      case "f":
        ue2();
        e2.preventDefault();
    }
  }, Ie = () => {
    var _a4, _b;
    N2({ controls: (_a4 = ee2.value) == null ? void 0 : _a4.$refs.controls, mobileControls: (_b = ee2.value) == null ? void 0 : _b.$refs.mobileControls });
  };
  onMounted(async () => {
    try {
      await nextTick();
      await J2(le2, k2.code);
      !function(t) {
        !function() {
          if (!ie && "undefined" != typeof document) {
            document.addEventListener("fullscreenchange", e);
            document.addEventListener("webkitfullscreenchange", e);
            document.addEventListener("mozfullscreenchange", e);
            document.addEventListener("MSFullscreenChange", e);
            ie = true;
          }
        }();
        ne.add(t);
      }(Ie);
      document.addEventListener("vitepress-mermaid:toolbar-updated", me2);
    } catch (t) {
    }
  });
  watch(ce2, (e2) => {
    "undefined" != typeof document && document.body.classList.toggle("mermaid-dialog-open", e2);
  });
  onUnmounted(() => {
    "undefined" != typeof document && document.body.classList.remove("mermaid-dialog-open");
    !function(t) {
      ne.delete(t);
      if (0 === ne.size && ie && "undefined" != typeof document) {
        document.removeEventListener("fullscreenchange", e);
        document.removeEventListener("webkitfullscreenchange", e);
        document.removeEventListener("mozfullscreenchange", e);
        document.removeEventListener("MSFullscreenChange", e);
        ie = false;
      }
    }(Ie);
    document.removeEventListener("vitepress-mermaid:toolbar-updated", me2);
  });
  return (e2, r) => (openBlock(), createElementBlock(Fragment, null, [unref(X2) && ce2.value ? (openBlock(), createElementBlock("div", { key: 0, class: "mermaid-dialog-backdrop", onClick: ue2, "aria-hidden": "true" })) : createCommentVNode("", true), unref(X2) ? (openBlock(), createElementBlock("div", { key: 1, ref_key: "fullscreenWrapper", ref: ae2, class: normalizeClass(["mermaid-container", { "dialog-fullscreen-active": ce2.value }]), "data-fullscreen-wrapper": "" }, [createVNode(K, { ref_key: "controlsRef", ref: ee2, scale: unref(L2), code: l.code, "is-fullscreen": unref(I2), toolbar: C2.value, onZoomIn: unref(O2), onZoomOut: unref(A2), onResetView: unref(P2), onToggleFullscreen: ue2, onPanUp: unref(q2), onPanDown: unref(S2), onPanLeft: unref($2), onPanRight: unref(_2), onDownload: unref(se2) }, null, 8, ["scale", "code", "is-fullscreen", "toolbar", "onZoomIn", "onZoomOut", "onResetView", "onPanUp", "onPanDown", "onPanLeft", "onPanRight", "onDownload"]), createVNode(te, { "render-error": unref(G2), "render-error-details": unref(Q2), "error-text": C2.value.i18n.tooltips.renderErrorText, "show-details-text": C2.value.i18n.tooltips.toggleErrorDetailsText, "hide-details-text": C2.value.i18n.tooltips.toggleErrorDetailsHideText }, null, 8, ["render-error", "render-error-details", "error-text", "show-details-text", "hide-details-text"]), createBaseVNode("div", { class: "diagram-wrapper", tabindex: "0", role: "img", "aria-label": unref(G2) ? "Diagram rendering failed" : "Interactive Mermaid diagram", onKeydown: He, onMousedown: pe2, onMousemove: Fe, onMouseup: he2, onMouseleave: ge2, onWheel: Le, onTouchstart: ye2, onTouchmove: De, onTouchend: xe2 }, [createBaseVNode("span", we, toDisplayString(unref(Z2) ? "Diagram loaded" : "Loading diagram…"), 1), createBaseVNode("div", { id: le2, class: "mermaid", "aria-label": `Mermaid diagram: ${l.code.slice(0, 80)}`, style: normalizeStyle({ opacity: unref(Z2) ? 1 : 0, transform: `scale(${unref(L2)}) translate(${unref(F2)}px, ${unref(D2)}px)`, cursor: unref(H2) ? "grabbing" : "grab" }) }, toDisplayString(l.code), 13, ve)], 40, be)], 2)) : createCommentVNode("", true)], 64));
} });
var _a2;
var xe = (_a2 = class {
  constructor(e2) {
    __publicField(this, "config");
    __publicField(this, "toolbarConfig");
    __publicField(this, "initialized", false);
    __publicField(this, "renderAttempts", 0);
    __publicField(this, "maxRenderAttempts", 5);
    __publicField(this, "retryTimeout", null);
    __publicField(this, "renderQueue", []);
    __publicField(this, "isRendering", false);
    __publicField(this, "initialPageRenderComplete", false);
    __publicField(this, "hydrationComplete", false);
    __publicField(this, "mutationObserver", null);
    __publicField(this, "lazyObserver", null);
    __publicField(this, "boundRouteChangeHandler", null);
    this.config = e2 ? this.deepMerge({}, e2) : {};
    this.toolbarConfig = fe();
    this.initialize();
  }
  static getInstance(t) {
    _a2.instance ? t && _a2.instance.setConfig(t) : _a2.instance = new _a2(t);
    return _a2.instance;
  }
  static resetInstance() {
    if (_a2.instance) {
      _a2.instance.destroy();
      _a2.instance = void 0;
    }
  }
  destroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    if (this.lazyObserver) {
      this.lazyObserver.disconnect();
      this.lazyObserver = null;
    }
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    if (this.boundRouteChangeHandler) {
      window.removeEventListener("popstate", this.boundRouteChangeHandler);
      document.removeEventListener("vitepress:routeChanged", this.boundRouteChangeHandler);
      this.boundRouteChangeHandler = null;
    }
  }
  deepMerge(e2, t) {
    const r = { ...e2 };
    for (const o of Object.keys(t)) {
      const n = t[o], i = e2[o];
      r[o] = n && "object" == typeof n && !Array.isArray(n) && i && "object" == typeof i && !Array.isArray(i) ? this.deepMerge(i, n) : n;
    }
    return r;
  }
  setConfig(e2) {
    this.config = this.deepMerge(this.config, e2);
    this.dispatchConfigUpdate();
  }
  setToolbar(e2) {
    this.toolbarConfig = fe(e2);
    this.dispatchToolbarUpdate();
  }
  dispatchToolbarUpdate() {
    try {
      if ("undefined" == typeof document) return;
      document.dispatchEvent(new CustomEvent("vitepress-mermaid:toolbar-updated", { detail: this.toolbarConfig }));
    } catch (e2) {
    }
  }
  dispatchConfigUpdate() {
    try {
      document.dispatchEvent(new CustomEvent("vitepress-mermaid:config-updated", { detail: { ...this.config } }));
    } catch (e2) {
    }
  }
  cleanupMermaidWrapper(e2) {
    const t = e2.getElementsByClassName("copy");
    Array.from(t).forEach((e3) => e3.remove());
    if (!this.toolbarConfig.showLanguageLabel) {
      const t2 = e2.getElementsByClassName("lang");
      Array.from(t2).forEach((e3) => e3.remove());
    }
    const r = e2.getElementsByClassName("line-numbers-wrapper");
    Array.from(r).forEach((e3) => e3.remove());
    const o = e2.getElementsByClassName("line-number");
    Array.from(o).forEach((e3) => e3.remove());
    e2.classList.remove("line-numbers-mode");
    e2.classList.remove("has-line-numbers");
    const n = e2.getElementsByClassName("line-numbers-mode");
    Array.from(n).forEach((e3) => {
      e3.classList.remove("line-numbers-mode");
    });
  }
  createMermaidWrapper(e2) {
    try {
      const e3 = document.createElement("div");
      e3.id = `mermaid-wrapper-${Math.random().toString(36).slice(2)}`;
      e3.className = "mermaid-wrapper";
      return e3;
    } catch (t) {
      return null;
    }
  }
  async renderNextDiagram() {
    if (0 === this.renderQueue.length || this.isRendering) return;
    this.isRendering = true;
    const e2 = this.renderQueue.shift();
    if (e2) try {
      await this.renderMermaidDiagram(e2);
    } catch (t) {
    }
    this.isRendering = false;
    if (this.renderQueue.length > 0) await this.renderNextDiagram();
    else if (!this.initialPageRenderComplete) {
      this.initialPageRenderComplete = true;
      this.hydrationComplete = true;
    }
  }
  async renderMermaidDiagram(e2) {
    var _a3;
    try {
      if (!e2 || !e2.parentNode) return;
      const t = ((_a3 = e2.textContent) == null ? void 0 : _a3.trim()) || "", r = this.createMermaidWrapper(t);
      if (!r) return;
      e2.parentNode.replaceChild(r, e2);
      render(h(ye, { code: t, config: this.config, toolbar: this.toolbarConfig }), r);
      await new Promise((e3) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => e3());
        });
      });
    } catch (t) {
    }
  }
  initialize() {
    if (!this.initialized) try {
      const e2 = () => {
        document && document.body && Promise.resolve().then(() => {
          requestAnimationFrame(() => {
            try {
              this.setupDomMutationObserver();
              this.initializeRenderer();
            } catch (e3) {
            }
          });
        });
      };
      "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", e2, { once: true }) : e2();
      const t = () => {
        try {
          this.handleRouteChange();
        } catch (e3) {
        }
      };
      this.boundRouteChangeHandler = t;
      window.addEventListener("popstate", t);
      document.addEventListener("vitepress:routeChanged", t);
      document.addEventListener("vitepress:ready", () => {
        this.renderWithRetry();
      }, { once: true });
      "undefined" != typeof window && setTimeout(() => {
        this.renderWithRetry();
      }, 500);
      this.initialized = true;
    } catch (e2) {
      throw e2;
    }
  }
  setupDomMutationObserver() {
    if ("undefined" == typeof window || "undefined" == typeof MutationObserver || "undefined" == typeof document) return;
    const e2 = document.getElementById("app") || document.querySelector(".Layout") || document.body;
    if (!e2) return;
    this.mutationObserver && this.mutationObserver.disconnect();
    let t = false;
    this.mutationObserver = new MutationObserver((e3) => {
      if (this.hasNewMermaidNodes(e3) && !t) {
        t = true;
        requestAnimationFrame(() => {
          t = false;
          this.handleRouteChange();
        });
      }
    });
    try {
      this.mutationObserver.observe(e2, { childList: true, subtree: true, attributes: false });
    } catch (r) {
    }
  }
  hasNewMermaidNodes(e2) {
    return e2.some((e3) => Array.from(e3.addedNodes).some((e4) => this.nodeContainsMermaidCode(e4)));
  }
  nodeContainsMermaidCode(e2) {
    var _a3;
    if (!e2) return false;
    if (e2.nodeType === Node.ELEMENT_NODE) {
      const t = e2;
      if (t.closest(".mermaid-wrapper")) return false;
      if (t.classList.contains("language-mermaid") || ((_a3 = t.matches) == null ? void 0 : _a3.call(t, "code.mermaid"))) return true;
      if (t.querySelector(".language-mermaid, pre.language-mermaid, code.language-mermaid, code.mermaid")) return true;
    }
    return !(e2.nodeType !== Node.DOCUMENT_FRAGMENT_NODE || !e2.hasChildNodes()) && Array.from(e2.childNodes).some((e3) => this.nodeContainsMermaidCode(e3));
  }
  initializeRenderer() {
    this.renderAttempts = 0;
    this.initialPageRenderComplete = false;
    this.renderWithRetry();
  }
  handleRouteChange() {
    this.renderAttempts = 0;
    this.initialPageRenderComplete = false;
    re = Promise.resolve();
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    if (this.lazyObserver) {
      this.lazyObserver.disconnect();
      this.lazyObserver = null;
    }
    this.renderWithRetry();
  }
  renderWithRetry() {
    if (!this.renderMermaidDiagrams() && !this.mutationObserver && this.renderAttempts < this.maxRenderAttempts) {
      const e2 = Math.min(300 * Math.pow(1.4, this.renderAttempts), 1e4);
      this.retryTimeout && clearTimeout(this.retryTimeout);
      this.retryTimeout = setTimeout(() => {
        this.renderAttempts++;
        this.renderWithRetry();
      }, e2);
    }
  }
  renderMermaidDiagrams() {
    try {
      const e2 = [], t = /* @__PURE__ */ new Set();
      document.querySelectorAll("pre > code.mermaid, pre > code.language-mermaid").forEach((r2) => {
        const o2 = r2.parentElement;
        if (o2 && o2 instanceof HTMLPreElement && !t.has(o2) && !o2.hasAttribute("data-mermaid-processed")) {
          t.add(o2);
          e2.push(o2);
          o2.setAttribute("data-mermaid-processed", "");
        }
      });
      const r = document.getElementsByClassName("language-mermaid");
      Array.from(r).forEach((r2) => {
        if ("code" === r2.tagName.toLowerCase()) return;
        const o2 = r2.querySelector("pre");
        if (o2 && o2 instanceof HTMLPreElement && !t.has(o2) && !o2.hasAttribute("data-mermaid-processed")) {
          t.add(o2);
          e2.push(o2);
          o2.setAttribute("data-mermaid-processed", "");
        }
        if (r2 instanceof HTMLPreElement && !t.has(r2) && !r2.hasAttribute("data-mermaid-processed")) {
          t.add(r2);
          e2.push(r2);
          r2.setAttribute("data-mermaid-processed", "");
        }
      });
      if (0 === e2.length) return false;
      e2.forEach((e3) => {
        const t2 = e3.closest(".language-mermaid");
        t2 && this.cleanupMermaidWrapper(t2);
      });
      const o = [], n = [], i = "undefined" != typeof IntersectionObserver;
      for (const a of e2) {
        if (a.closest(".mermaid-wrapper")) continue;
        if (!i) {
          o.push(a);
          continue;
        }
        const e3 = a.getBoundingClientRect();
        0 !== window.innerWidth && 0 !== window.innerHeight ? 0 === e3.width && 0 === e3.height || e3.top < window.innerHeight && e3.bottom > 0 && e3.left < window.innerWidth && e3.right > 0 ? o.push(a) : n.push(a) : o.push(a);
      }
      if (o.length > 0) {
        this.renderQueue.push(...o);
        this.isRendering || this.renderNextDiagram();
      }
      n.length > 0 && this.observeOffscreenElements(n);
      return o.length > 0 || n.length > 0;
    } catch (e2) {
      return false;
    }
  }
  observeOffscreenElements(e2) {
    this.lazyObserver || (this.lazyObserver = new IntersectionObserver((e3) => {
      const t = [];
      for (const r of e3) if (r.isIntersecting) {
        const e4 = r.target;
        this.lazyObserver.unobserve(e4);
        t.push(e4);
      }
      if (t.length > 0) {
        this.renderQueue.push(...t);
        this.isRendering || this.renderNextDiagram();
      }
    }, { rootMargin: "200px 0px", threshold: 0 }));
    for (const t of e2) this.lazyObserver.observe(t);
  }
}, __publicField(_a2, "instance"), _a2);
var ke = "vitepress-mermaid-renderer-styles";
var Me = false;
var Ce = "undefined" != typeof window && "undefined" != typeof document;
var ze = { setToolbar: () => {
}, resetInstance: () => {
} };
Ce && (() => {
  if (Me || "undefined" == typeof document) return;
  if (document.getElementById(ke)) {
    Me = true;
    return;
  }
  const e2 = document.createElement("style");
  e2.id = ke;
  e2.textContent = '.mermaid-container{--mermaid-control-bg:var(--vp-c-bg);--mermaid-control-text:var(--vp-c-text-1);--mermaid-control-border:var(--vp-c-border);--mermaid-control-shadow:0 2px 4px #0000001a;--mermaid-control-radius:.375rem;--mermaid-control-padding:.375rem;--mermaid-control-gap:.25rem;--mermaid-spinner-duration:.8s;--mermaid-notification-duration:2s;--mermaid-error-bg:var(--vp-c-bg-soft);--mermaid-error-border:var(--vp-c-border);--mermaid-error-text:var(--vp-c-danger);width:100%;min-height:20rem;max-height:50vh;position:relative;overflow:hidden!important}.mermaid-container.dialog-fullscreen-active{z-index:1002;border:1px solid var(--vp-c-border);background:var(--vp-c-bg);border-radius:.75rem;width:min(94vw,1200px);height:min(90vh,860px);max-height:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 24px 60px #00000040}.mermaid-dialog-backdrop{z-index:1001;backdrop-filter:blur(4px)saturate(115%);background:#00000080;position:fixed;inset:0}@supports (backdrop-filter:blur(1px)){.mermaid-dialog-backdrop{background:color-mix(in srgb, var(--vp-c-bg) 40%, transparent)}}body.mermaid-dialog-open{overflow:hidden}.controls{z-index:20;padding:var(--mermaid-control-padding);border-radius:var(--mermaid-control-radius);box-shadow:var(--mermaid-control-shadow);opacity:1;visibility:visible;pointer-events:auto;background:var(--mermaid-control-bg);transition:all .2s;position:absolute;inset:auto .75rem .75rem auto}.controls.toolbar-vertical-top{top:.75rem;bottom:auto}.controls.toolbar-vertical-bottom{top:auto;bottom:.75rem}.controls.toolbar-horizontal-left{left:.75rem;right:auto}.controls.toolbar-horizontal-right{left:auto;right:.75rem}.desktop-controls{align-items:center;gap:.375rem;display:inline-flex}.desktop-controls button{background:var(--mermaid-control-bg);cursor:pointer;color:var(--mermaid-control-text);border:none;border-radius:.25rem;place-items:center;padding:.375rem;transition:all .2s;display:grid;position:relative}.desktop-controls button:hover{background:var(--vp-c-bg-soft);color:var(--vp-c-brand);transform:translateY(-1px)}.desktop-controls button:active{transform:translateY(0)}.desktop-controls button svg{width:18px;height:18px;transition:transform .2s}.desktop-controls button:hover svg{transform:scale(1.1)}.mobile-controls{z-index:8;flex-direction:row;justify-content:center;gap:.5rem;width:auto;padding:.75rem;display:none}.mobile-utility-controls{justify-content:center;align-items:center;gap:.5rem;display:flex}.mobile-controls button{background:var(--mermaid-control-bg);border:1px solid var(--mermaid-control-border);cursor:pointer;border-radius:.25rem;justify-content:center;align-items:center;width:40px;height:40px;transition:background .2s,transform .2s;display:flex;position:relative}.mobile-controls button:hover{background:var(--vp-c-bg-soft);transform:translateY(-1px)}.mobile-controls button:active{transform:translateY(0)}.mobile-controls button svg{width:20px;height:20px;stroke:var(--vp-c-text-1)}.zoom-level{text-align:center;min-width:3.25rem;color:var(--vp-c-text-2);user-select:none;background:var(--mermaid-control-bg);border-radius:.25rem;padding:.25rem .375rem;font-size:.75rem;font-weight:500}.mobile-controls .zoom-level{min-width:3rem;margin-right:.5rem}.mobile-controls .mobile-zoom-level{order:-1}@media (width<=768px){.desktop-controls{display:none}.mobile-controls{display:flex}}@media (width>=769px){.mobile-controls{display:none}.desktop-controls{display:inline-flex}}.mermaid-container:hover .controls:not(.force-show){opacity:1;transform:translateY(0)}.mermaid-container:fullscreen .controls,.mermaid-container.dialog-fullscreen-active .controls{opacity:1!important;transform:translateY(0)!important}.diagram-wrapper{z-index:1;width:100%;height:100%;min-height:20rem;position:relative;overflow:hidden}.mermaid-container:fullscreen .diagram-wrapper{background:var(--vp-c-bg);color:var(--vp-c-text-1);touch-action:none;justify-content:center;align-items:center;max-height:none;padding:20px;display:flex}.mermaid-container:fullscreen::backdrop{background:var(--vp-c-bg-soft)}.mermaid-container.dialog-fullscreen-active .diagram-wrapper{background:var(--vp-c-bg);color:var(--vp-c-text-1);touch-action:none;justify-content:center;align-items:center;min-height:100%;max-height:none;padding:20px;display:flex}@media (width<=768px){.mermaid-container.dialog-fullscreen-active{border-radius:.5rem;width:96vw;height:88vh}}.mermaid{transform-origin:50%;transition:opacity .3s ease-in-out;display:inline-block}.mermaid-rendering{opacity:.5;position:relative}.mermaid-rendering:after{content:"";border:3px solid var(--vp-c-brand);width:30px;height:30px;animation:mermaid-spinner var(--mermaid-spinner-duration) linear infinite;border-top-color:#0000;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}@keyframes mermaid-spinner{to{transform:translate(-50%,-50%)rotate(360deg)}}.copied-notification{background:var(--vp-c-bg);color:var(--vp-c-text-1);border-radius:var(--mermaid-control-radius);white-space:nowrap;opacity:0;animation:fadeInOut var(--mermaid-notification-duration) ease-in-out;box-shadow:var(--mermaid-control-shadow);margin-block-end:.5rem;padding:.375rem .75rem;font-size:.75rem;font-weight:500;position:absolute;bottom:100%;left:50%;transform:translate(-50%)}@keyframes fadeInOut{0%{opacity:0;transform:translate(-50%,.5rem)}10%{opacity:1;transform:translate(-50%)}90%{opacity:1;transform:translate(-50%)}to{opacity:0;transform:translate(-50%,-.5rem)}}.visible-controls{opacity:1!important;visibility:visible!important;pointer-events:auto!important}.mobile-only{display:none!important}@media (width<=768px){.mobile-only{display:grid!important}.controls{flex-direction:column;align-items:stretch}.zoom-level{text-align:center}}.diagram-error{background:var(--mermaid-error-bg);border:1px solid var(--mermaid-error-border);z-index:10;border-radius:.5rem;width:max-content;max-width:90%;padding:1rem;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 4px 8px #0000001a}.error-message{color:var(--mermaid-error-text);align-items:center;gap:.75rem;font-weight:500;display:flex}.diagram-error .error-message svg{stroke:var(--vp-c-danger);flex-shrink:0}.error-toggle-button{background:var(--vp-c-bg);border:1px solid var(--vp-c-border);cursor:pointer;border-radius:.25rem;margin-left:auto;padding:.25rem .5rem;font-size:.75rem;transition:all .2s}.error-toggle-button:hover{background:var(--vp-c-bg-mute);transform:translateY(-1px)}.error-details{background:var(--vp-c-bg);white-space:pre-wrap;color:var(--vp-c-text-2);border:1px solid var(--vp-c-border);border-radius:.25rem;max-height:200px;margin-top:1rem;padding:1rem;font-family:monospace;font-size:.85rem;overflow:auto}.language-mermaid .line-numbers-wrapper,.language-mermaid .line-number,.language-mermaid.line-numbers-mode .line-numbers-wrapper,.language-mermaid.line-numbers-mode>pre{display:none!important}.sr-only{clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}@media (prefers-reduced-motion:reduce){.mermaid{transition:none!important}.mermaid-rendering:after{animation:none!important}.copied-notification{opacity:1;animation:none!important}.controls,.desktop-controls button,.mobile-controls button{transition:none!important}}';
  document.head.appendChild(e2);
  Me = true;
})();
var Te = (e2) => Ce ? xe.getInstance(e2) : ze;
export {
  xe as MermaidRenderer,
  Te as createMermaidRenderer
};
/*! Bundled license information:

mermaid/dist/mermaid.core.mjs:
  (*! Check if previously processed *)
  (*!
   * Wait for document loaded before starting the execution
   *)
*/
//# sourceMappingURL=vitepress-mermaid-renderer.js.map
