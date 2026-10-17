(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/common/constants.js
  var STORAGE_KEYS, DEFAULT_SETTINGS, SPEED_PRESETS, MESSAGE_TYPES, PLAYER_ACTIONS, PLAYBACK_STATUS;
  var init_constants = __esm({
    "src/common/constants.js"() {
      STORAGE_KEYS = {
        SETTINGS: "simple_aloud_settings"
      };
      DEFAULT_SETTINGS = {
        voiceId: "en-US-female",
        speedRate: 1,
        autoScroll: true,
        highlightColor: "#fef08a",
        sessionBuffering: true
      };
      SPEED_PRESETS = [0.75, 1, 1.25, 1.5, 1.75, 2];
      MESSAGE_TYPES = {
        READER_START: "READER_START",
        ARTICLE_PARSED: "ARTICLE_PARSED",
        PARAGRAPH_CLICKED: "PARAGRAPH_CLICKED",
        PLAYER_COMMAND: "PLAYER_COMMAND",
        STATE_CHANGED: "STATE_CHANGED",
        SENTENCE_PROGRESS: "SENTENCE_PROGRESS",
        SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
        GET_STATE: "GET_STATE",
        GET_SETTINGS: "GET_SETTINGS",
        UPDATE_SETTINGS: "UPDATE_SETTINGS"
      };
      PLAYER_ACTIONS = {
        PLAY: "play",
        PAUSE: "pause",
        RESUME: "resume",
        STOP: "stop",
        SKIP_FORWARD: "skip_forward",
        SKIP_BACKWARD: "skip_backward",
        SET_SPEED: "set_speed",
        SET_VOICE: "set_voice"
      };
      PLAYBACK_STATUS = {
        IDLE: "idle",
        EXTRACTING: "extracting",
        BUFFERING: "buffering",
        PLAYING: "playing",
        PAUSED: "paused",
        STOPPED: "stopped",
        ERROR: "error"
      };
    }
  });

  // node_modules/@mozilla/readability/Readability.js
  var require_Readability = __commonJS({
    "node_modules/@mozilla/readability/Readability.js"(exports, module) {
      function Readability2(doc, options) {
        if (options && options.documentElement) {
          doc = options;
          options = arguments[2];
        } else if (!doc || !doc.documentElement) {
          throw new Error("First argument to Readability constructor should be a document object.");
        }
        options = options || {};
        this._doc = doc;
        this._docJSDOMParser = this._doc.firstChild.__JSDOMParser__;
        this._articleTitle = null;
        this._articleByline = null;
        this._articleDir = null;
        this._articleSiteName = null;
        this._attempts = [];
        this._debug = !!options.debug;
        this._maxElemsToParse = options.maxElemsToParse || this.DEFAULT_MAX_ELEMS_TO_PARSE;
        this._nbTopCandidates = options.nbTopCandidates || this.DEFAULT_N_TOP_CANDIDATES;
        this._charThreshold = options.charThreshold || this.DEFAULT_CHAR_THRESHOLD;
        this._classesToPreserve = this.CLASSES_TO_PRESERVE.concat(options.classesToPreserve || []);
        this._keepClasses = !!options.keepClasses;
        this._serializer = options.serializer || function(el) {
          return el.innerHTML;
        };
        this._disableJSONLD = !!options.disableJSONLD;
        this._allowedVideoRegex = options.allowedVideoRegex || this.REGEXPS.videos;
        this._flags = this.FLAG_STRIP_UNLIKELYS | this.FLAG_WEIGHT_CLASSES | this.FLAG_CLEAN_CONDITIONALLY;
        if (this._debug) {
          let logNode = function(node) {
            if (node.nodeType == node.TEXT_NODE) {
              return `${node.nodeName} ("${node.textContent}")`;
            }
            let attrPairs = Array.from(node.attributes || [], function(attr) {
              return `${attr.name}="${attr.value}"`;
            }).join(" ");
            return `<${node.localName} ${attrPairs}>`;
          };
          this.log = function() {
            if (typeof console !== "undefined") {
              let args = Array.from(arguments, (arg) => {
                if (arg && arg.nodeType == this.ELEMENT_NODE) {
                  return logNode(arg);
                }
                return arg;
              });
              args.unshift("Reader: (Readability)");
              console.log.apply(console, args);
            } else if (typeof dump !== "undefined") {
              var msg = Array.prototype.map.call(arguments, function(x) {
                return x && x.nodeName ? logNode(x) : x;
              }).join(" ");
              dump("Reader: (Readability) " + msg + "\n");
            }
          };
        } else {
          this.log = function() {
          };
        }
      }
      Readability2.prototype = {
        FLAG_STRIP_UNLIKELYS: 1,
        FLAG_WEIGHT_CLASSES: 2,
        FLAG_CLEAN_CONDITIONALLY: 4,
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        ELEMENT_NODE: 1,
        TEXT_NODE: 3,
        // Max number of nodes supported by this parser. Default: 0 (no limit)
        DEFAULT_MAX_ELEMS_TO_PARSE: 0,
        // The number of top candidates to consider when analysing how
        // tight the competition is among candidates.
        DEFAULT_N_TOP_CANDIDATES: 5,
        // Element tags to score by default.
        DEFAULT_TAGS_TO_SCORE: "section,h2,h3,h4,h5,h6,p,td,pre".toUpperCase().split(","),
        // The default number of chars an article must have in order to return a result
        DEFAULT_CHAR_THRESHOLD: 500,
        // All of the regular expressions in use within readability.
        // Defined up here so we don't instantiate them repeatedly in loops.
        REGEXPS: {
          // NOTE: These two regular expressions are duplicated in
          // Readability-readerable.js. Please keep both copies in sync.
          unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
          okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i,
          positive: /article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i,
          negative: /-ad-|hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|foot|footer|footnote|gdpr|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|tool|widget/i,
          extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single|utility/i,
          byline: /byline|author|dateline|writtenby|p-author/i,
          replaceFonts: /<(\/?)font[^>]*>/gi,
          normalize: /\s{2,}/g,
          videos: /\/\/(www\.)?((dailymotion|youtube|youtube-nocookie|player\.vimeo|v\.qq)\.com|(archive|upload\.wikimedia)\.org|player\.twitch\.tv)/i,
          shareElements: /(\b|_)(share|sharedaddy)(\b|_)/i,
          nextLink: /(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i,
          prevLink: /(prev|earl|old|new|<|«)/i,
          tokenize: /\W+/g,
          whitespace: /^\s*$/,
          hasContent: /\S$/,
          hashUrl: /^#.+/,
          srcsetUrl: /(\S+)(\s+[\d.]+[xw])?(\s*(?:,|$))/g,
          b64DataUrl: /^data:\s*([^\s;,]+)\s*;\s*base64\s*,/i,
          // Commas as used in Latin, Sindhi, Chinese and various other scripts.
          // see: https://en.wikipedia.org/wiki/Comma#Comma_variants
          commas: /\u002C|\u060C|\uFE50|\uFE10|\uFE11|\u2E41|\u2E34|\u2E32|\uFF0C/g,
          // See: https://schema.org/Article
          jsonLdArticleTypes: /^Article|AdvertiserContentArticle|NewsArticle|AnalysisNewsArticle|AskPublicNewsArticle|BackgroundNewsArticle|OpinionNewsArticle|ReportageNewsArticle|ReviewNewsArticle|Report|SatiricalArticle|ScholarlyArticle|MedicalScholarlyArticle|SocialMediaPosting|BlogPosting|LiveBlogPosting|DiscussionForumPosting|TechArticle|APIReference$/
        },
        UNLIKELY_ROLES: ["menu", "menubar", "complementary", "navigation", "alert", "alertdialog", "dialog"],
        DIV_TO_P_ELEMS: /* @__PURE__ */ new Set(["BLOCKQUOTE", "DL", "DIV", "IMG", "OL", "P", "PRE", "TABLE", "UL"]),
        ALTER_TO_DIV_EXCEPTIONS: ["DIV", "ARTICLE", "SECTION", "P"],
        PRESENTATIONAL_ATTRIBUTES: ["align", "background", "bgcolor", "border", "cellpadding", "cellspacing", "frame", "hspace", "rules", "style", "valign", "vspace"],
        DEPRECATED_SIZE_ATTRIBUTE_ELEMS: ["TABLE", "TH", "TD", "HR", "PRE"],
        // The commented out elements qualify as phrasing content but tend to be
        // removed by readability when put into paragraphs, so we ignore them here.
        PHRASING_ELEMS: [
          // "CANVAS", "IFRAME", "SVG", "VIDEO",
          "ABBR",
          "AUDIO",
          "B",
          "BDO",
          "BR",
          "BUTTON",
          "CITE",
          "CODE",
          "DATA",
          "DATALIST",
          "DFN",
          "EM",
          "EMBED",
          "I",
          "IMG",
          "INPUT",
          "KBD",
          "LABEL",
          "MARK",
          "MATH",
          "METER",
          "NOSCRIPT",
          "OBJECT",
          "OUTPUT",
          "PROGRESS",
          "Q",
          "RUBY",
          "SAMP",
          "SCRIPT",
          "SELECT",
          "SMALL",
          "SPAN",
          "STRONG",
          "SUB",
          "SUP",
          "TEXTAREA",
          "TIME",
          "VAR",
          "WBR"
        ],
        // These are the classes that readability sets itself.
        CLASSES_TO_PRESERVE: ["page"],
        // These are the list of HTML entities that need to be escaped.
        HTML_ESCAPE_MAP: {
          "lt": "<",
          "gt": ">",
          "amp": "&",
          "quot": '"',
          "apos": "'"
        },
        /**
         * Run any post-process modifications to article content as necessary.
         *
         * @param Element
         * @return void
        **/
        _postProcessContent: function(articleContent) {
          this._fixRelativeUris(articleContent);
          this._simplifyNestedElements(articleContent);
          if (!this._keepClasses) {
            this._cleanClasses(articleContent);
          }
        },
        /**
         * Iterates over a NodeList, calls `filterFn` for each node and removes node
         * if function returned `true`.
         *
         * If function is not passed, removes all the nodes in node list.
         *
         * @param NodeList nodeList The nodes to operate on
         * @param Function filterFn the function to use as a filter
         * @return void
         */
        _removeNodes: function(nodeList, filterFn) {
          if (this._docJSDOMParser && nodeList._isLiveNodeList) {
            throw new Error("Do not pass live node lists to _removeNodes");
          }
          for (var i = nodeList.length - 1; i >= 0; i--) {
            var node = nodeList[i];
            var parentNode = node.parentNode;
            if (parentNode) {
              if (!filterFn || filterFn.call(this, node, i, nodeList)) {
                parentNode.removeChild(node);
              }
            }
          }
        },
        /**
         * Iterates over a NodeList, and calls _setNodeTag for each node.
         *
         * @param NodeList nodeList The nodes to operate on
         * @param String newTagName the new tag name to use
         * @return void
         */
        _replaceNodeTags: function(nodeList, newTagName) {
          if (this._docJSDOMParser && nodeList._isLiveNodeList) {
            throw new Error("Do not pass live node lists to _replaceNodeTags");
          }
          for (const node of nodeList) {
            this._setNodeTag(node, newTagName);
          }
        },
        /**
         * Iterate over a NodeList, which doesn't natively fully implement the Array
         * interface.
         *
         * For convenience, the current object context is applied to the provided
         * iterate function.
         *
         * @param  NodeList nodeList The NodeList.
         * @param  Function fn       The iterate function.
         * @return void
         */
        _forEachNode: function(nodeList, fn) {
          Array.prototype.forEach.call(nodeList, fn, this);
        },
        /**
         * Iterate over a NodeList, and return the first node that passes
         * the supplied test function
         *
         * For convenience, the current object context is applied to the provided
         * test function.
         *
         * @param  NodeList nodeList The NodeList.
         * @param  Function fn       The test function.
         * @return void
         */
        _findNode: function(nodeList, fn) {
          return Array.prototype.find.call(nodeList, fn, this);
        },
        /**
         * Iterate over a NodeList, return true if any of the provided iterate
         * function calls returns true, false otherwise.
         *
         * For convenience, the current object context is applied to the
         * provided iterate function.
         *
         * @param  NodeList nodeList The NodeList.
         * @param  Function fn       The iterate function.
         * @return Boolean
         */
        _someNode: function(nodeList, fn) {
          return Array.prototype.some.call(nodeList, fn, this);
        },
        /**
         * Iterate over a NodeList, return true if all of the provided iterate
         * function calls return true, false otherwise.
         *
         * For convenience, the current object context is applied to the
         * provided iterate function.
         *
         * @param  NodeList nodeList The NodeList.
         * @param  Function fn       The iterate function.
         * @return Boolean
         */
        _everyNode: function(nodeList, fn) {
          return Array.prototype.every.call(nodeList, fn, this);
        },
        /**
         * Concat all nodelists passed as arguments.
         *
         * @return ...NodeList
         * @return Array
         */
        _concatNodeLists: function() {
          var slice = Array.prototype.slice;
          var args = slice.call(arguments);
          var nodeLists = args.map(function(list) {
            return slice.call(list);
          });
          return Array.prototype.concat.apply([], nodeLists);
        },
        _getAllNodesWithTag: function(node, tagNames) {
          if (node.querySelectorAll) {
            return node.querySelectorAll(tagNames.join(","));
          }
          return [].concat.apply([], tagNames.map(function(tag) {
            var collection = node.getElementsByTagName(tag);
            return Array.isArray(collection) ? collection : Array.from(collection);
          }));
        },
        /**
         * Removes the class="" attribute from every element in the given
         * subtree, except those that match CLASSES_TO_PRESERVE and
         * the classesToPreserve array from the options object.
         *
         * @param Element
         * @return void
         */
        _cleanClasses: function(node) {
          var classesToPreserve = this._classesToPreserve;
          var className = (node.getAttribute("class") || "").split(/\s+/).filter(function(cls) {
            return classesToPreserve.indexOf(cls) != -1;
          }).join(" ");
          if (className) {
            node.setAttribute("class", className);
          } else {
            node.removeAttribute("class");
          }
          for (node = node.firstElementChild; node; node = node.nextElementSibling) {
            this._cleanClasses(node);
          }
        },
        /**
         * Converts each <a> and <img> uri in the given element to an absolute URI,
         * ignoring #ref URIs.
         *
         * @param Element
         * @return void
         */
        _fixRelativeUris: function(articleContent) {
          var baseURI = this._doc.baseURI;
          var documentURI = this._doc.documentURI;
          function toAbsoluteURI(uri) {
            if (baseURI == documentURI && uri.charAt(0) == "#") {
              return uri;
            }
            try {
              return new URL(uri, baseURI).href;
            } catch (ex) {
            }
            return uri;
          }
          var links = this._getAllNodesWithTag(articleContent, ["a"]);
          this._forEachNode(links, function(link) {
            var href = link.getAttribute("href");
            if (href) {
              if (href.indexOf("javascript:") === 0) {
                if (link.childNodes.length === 1 && link.childNodes[0].nodeType === this.TEXT_NODE) {
                  var text = this._doc.createTextNode(link.textContent);
                  link.parentNode.replaceChild(text, link);
                } else {
                  var container = this._doc.createElement("span");
                  while (link.firstChild) {
                    container.appendChild(link.firstChild);
                  }
                  link.parentNode.replaceChild(container, link);
                }
              } else {
                link.setAttribute("href", toAbsoluteURI(href));
              }
            }
          });
          var medias = this._getAllNodesWithTag(articleContent, [
            "img",
            "picture",
            "figure",
            "video",
            "audio",
            "source"
          ]);
          this._forEachNode(medias, function(media) {
            var src = media.getAttribute("src");
            var poster = media.getAttribute("poster");
            var srcset = media.getAttribute("srcset");
            if (src) {
              media.setAttribute("src", toAbsoluteURI(src));
            }
            if (poster) {
              media.setAttribute("poster", toAbsoluteURI(poster));
            }
            if (srcset) {
              var newSrcset = srcset.replace(this.REGEXPS.srcsetUrl, function(_, p1, p2, p3) {
                return toAbsoluteURI(p1) + (p2 || "") + p3;
              });
              media.setAttribute("srcset", newSrcset);
            }
          });
        },
        _simplifyNestedElements: function(articleContent) {
          var node = articleContent;
          while (node) {
            if (node.parentNode && ["DIV", "SECTION"].includes(node.tagName) && !(node.id && node.id.startsWith("readability"))) {
              if (this._isElementWithoutContent(node)) {
                node = this._removeAndGetNext(node);
                continue;
              } else if (this._hasSingleTagInsideElement(node, "DIV") || this._hasSingleTagInsideElement(node, "SECTION")) {
                var child = node.children[0];
                for (var i = 0; i < node.attributes.length; i++) {
                  child.setAttribute(node.attributes[i].name, node.attributes[i].value);
                }
                node.parentNode.replaceChild(child, node);
                node = child;
                continue;
              }
            }
            node = this._getNextNode(node);
          }
        },
        /**
         * Get the article title as an H1.
         *
         * @return string
         **/
        _getArticleTitle: function() {
          var doc = this._doc;
          var curTitle = "";
          var origTitle = "";
          try {
            curTitle = origTitle = doc.title.trim();
            if (typeof curTitle !== "string")
              curTitle = origTitle = this._getInnerText(doc.getElementsByTagName("title")[0]);
          } catch (e) {
          }
          var titleHadHierarchicalSeparators = false;
          function wordCount(str) {
            return str.split(/\s+/).length;
          }
          if (/ [\|\-\\\/>»] /.test(curTitle)) {
            titleHadHierarchicalSeparators = / [\\\/>»] /.test(curTitle);
            curTitle = origTitle.replace(/(.*)[\|\-\\\/>»] .*/gi, "$1");
            if (wordCount(curTitle) < 3)
              curTitle = origTitle.replace(/[^\|\-\\\/>»]*[\|\-\\\/>»](.*)/gi, "$1");
          } else if (curTitle.indexOf(": ") !== -1) {
            var headings = this._concatNodeLists(
              doc.getElementsByTagName("h1"),
              doc.getElementsByTagName("h2")
            );
            var trimmedTitle = curTitle.trim();
            var match = this._someNode(headings, function(heading) {
              return heading.textContent.trim() === trimmedTitle;
            });
            if (!match) {
              curTitle = origTitle.substring(origTitle.lastIndexOf(":") + 1);
              if (wordCount(curTitle) < 3) {
                curTitle = origTitle.substring(origTitle.indexOf(":") + 1);
              } else if (wordCount(origTitle.substr(0, origTitle.indexOf(":"))) > 5) {
                curTitle = origTitle;
              }
            }
          } else if (curTitle.length > 150 || curTitle.length < 15) {
            var hOnes = doc.getElementsByTagName("h1");
            if (hOnes.length === 1)
              curTitle = this._getInnerText(hOnes[0]);
          }
          curTitle = curTitle.trim().replace(this.REGEXPS.normalize, " ");
          var curTitleWordCount = wordCount(curTitle);
          if (curTitleWordCount <= 4 && (!titleHadHierarchicalSeparators || curTitleWordCount != wordCount(origTitle.replace(/[\|\-\\\/>»]+/g, "")) - 1)) {
            curTitle = origTitle;
          }
          return curTitle;
        },
        /**
         * Prepare the HTML document for readability to scrape it.
         * This includes things like stripping javascript, CSS, and handling terrible markup.
         *
         * @return void
         **/
        _prepDocument: function() {
          var doc = this._doc;
          this._removeNodes(this._getAllNodesWithTag(doc, ["style"]));
          if (doc.body) {
            this._replaceBrs(doc.body);
          }
          this._replaceNodeTags(this._getAllNodesWithTag(doc, ["font"]), "SPAN");
        },
        /**
         * Finds the next node, starting from the given node, and ignoring
         * whitespace in between. If the given node is an element, the same node is
         * returned.
         */
        _nextNode: function(node) {
          var next = node;
          while (next && next.nodeType != this.ELEMENT_NODE && this.REGEXPS.whitespace.test(next.textContent)) {
            next = next.nextSibling;
          }
          return next;
        },
        /**
         * Replaces 2 or more successive <br> elements with a single <p>.
         * Whitespace between <br> elements are ignored. For example:
         *   <div>foo<br>bar<br> <br><br>abc</div>
         * will become:
         *   <div>foo<br>bar<p>abc</p></div>
         */
        _replaceBrs: function(elem) {
          this._forEachNode(this._getAllNodesWithTag(elem, ["br"]), function(br) {
            var next = br.nextSibling;
            var replaced = false;
            while ((next = this._nextNode(next)) && next.tagName == "BR") {
              replaced = true;
              var brSibling = next.nextSibling;
              next.parentNode.removeChild(next);
              next = brSibling;
            }
            if (replaced) {
              var p = this._doc.createElement("p");
              br.parentNode.replaceChild(p, br);
              next = p.nextSibling;
              while (next) {
                if (next.tagName == "BR") {
                  var nextElem = this._nextNode(next.nextSibling);
                  if (nextElem && nextElem.tagName == "BR")
                    break;
                }
                if (!this._isPhrasingContent(next))
                  break;
                var sibling = next.nextSibling;
                p.appendChild(next);
                next = sibling;
              }
              while (p.lastChild && this._isWhitespace(p.lastChild)) {
                p.removeChild(p.lastChild);
              }
              if (p.parentNode.tagName === "P")
                this._setNodeTag(p.parentNode, "DIV");
            }
          });
        },
        _setNodeTag: function(node, tag) {
          this.log("_setNodeTag", node, tag);
          if (this._docJSDOMParser) {
            node.localName = tag.toLowerCase();
            node.tagName = tag.toUpperCase();
            return node;
          }
          var replacement = node.ownerDocument.createElement(tag);
          while (node.firstChild) {
            replacement.appendChild(node.firstChild);
          }
          node.parentNode.replaceChild(replacement, node);
          if (node.readability)
            replacement.readability = node.readability;
          for (var i = 0; i < node.attributes.length; i++) {
            try {
              replacement.setAttribute(node.attributes[i].name, node.attributes[i].value);
            } catch (ex) {
            }
          }
          return replacement;
        },
        /**
         * Prepare the article node for display. Clean out any inline styles,
         * iframes, forms, strip extraneous <p> tags, etc.
         *
         * @param Element
         * @return void
         **/
        _prepArticle: function(articleContent) {
          this._cleanStyles(articleContent);
          this._markDataTables(articleContent);
          this._fixLazyImages(articleContent);
          this._cleanConditionally(articleContent, "form");
          this._cleanConditionally(articleContent, "fieldset");
          this._clean(articleContent, "object");
          this._clean(articleContent, "embed");
          this._clean(articleContent, "footer");
          this._clean(articleContent, "link");
          this._clean(articleContent, "aside");
          var shareElementThreshold = this.DEFAULT_CHAR_THRESHOLD;
          this._forEachNode(articleContent.children, function(topCandidate) {
            this._cleanMatchedNodes(topCandidate, function(node, matchString) {
              return this.REGEXPS.shareElements.test(matchString) && node.textContent.length < shareElementThreshold;
            });
          });
          this._clean(articleContent, "iframe");
          this._clean(articleContent, "input");
          this._clean(articleContent, "textarea");
          this._clean(articleContent, "select");
          this._clean(articleContent, "button");
          this._cleanHeaders(articleContent);
          this._cleanConditionally(articleContent, "table");
          this._cleanConditionally(articleContent, "ul");
          this._cleanConditionally(articleContent, "div");
          this._replaceNodeTags(this._getAllNodesWithTag(articleContent, ["h1"]), "h2");
          this._removeNodes(this._getAllNodesWithTag(articleContent, ["p"]), function(paragraph) {
            var imgCount = paragraph.getElementsByTagName("img").length;
            var embedCount = paragraph.getElementsByTagName("embed").length;
            var objectCount = paragraph.getElementsByTagName("object").length;
            var iframeCount = paragraph.getElementsByTagName("iframe").length;
            var totalCount = imgCount + embedCount + objectCount + iframeCount;
            return totalCount === 0 && !this._getInnerText(paragraph, false);
          });
          this._forEachNode(this._getAllNodesWithTag(articleContent, ["br"]), function(br) {
            var next = this._nextNode(br.nextSibling);
            if (next && next.tagName == "P")
              br.parentNode.removeChild(br);
          });
          this._forEachNode(this._getAllNodesWithTag(articleContent, ["table"]), function(table) {
            var tbody = this._hasSingleTagInsideElement(table, "TBODY") ? table.firstElementChild : table;
            if (this._hasSingleTagInsideElement(tbody, "TR")) {
              var row = tbody.firstElementChild;
              if (this._hasSingleTagInsideElement(row, "TD")) {
                var cell = row.firstElementChild;
                cell = this._setNodeTag(cell, this._everyNode(cell.childNodes, this._isPhrasingContent) ? "P" : "DIV");
                table.parentNode.replaceChild(cell, table);
              }
            }
          });
        },
        /**
         * Initialize a node with the readability object. Also checks the
         * className/id for special names to add to its score.
         *
         * @param Element
         * @return void
        **/
        _initializeNode: function(node) {
          node.readability = { "contentScore": 0 };
          switch (node.tagName) {
            case "DIV":
              node.readability.contentScore += 5;
              break;
            case "PRE":
            case "TD":
            case "BLOCKQUOTE":
              node.readability.contentScore += 3;
              break;
            case "ADDRESS":
            case "OL":
            case "UL":
            case "DL":
            case "DD":
            case "DT":
            case "LI":
            case "FORM":
              node.readability.contentScore -= 3;
              break;
            case "H1":
            case "H2":
            case "H3":
            case "H4":
            case "H5":
            case "H6":
            case "TH":
              node.readability.contentScore -= 5;
              break;
          }
          node.readability.contentScore += this._getClassWeight(node);
        },
        _removeAndGetNext: function(node) {
          var nextNode = this._getNextNode(node, true);
          node.parentNode.removeChild(node);
          return nextNode;
        },
        /**
         * Traverse the DOM from node to node, starting at the node passed in.
         * Pass true for the second parameter to indicate this node itself
         * (and its kids) are going away, and we want the next node over.
         *
         * Calling this in a loop will traverse the DOM depth-first.
         */
        _getNextNode: function(node, ignoreSelfAndKids) {
          if (!ignoreSelfAndKids && node.firstElementChild) {
            return node.firstElementChild;
          }
          if (node.nextElementSibling) {
            return node.nextElementSibling;
          }
          do {
            node = node.parentNode;
          } while (node && !node.nextElementSibling);
          return node && node.nextElementSibling;
        },
        // compares second text to first one
        // 1 = same text, 0 = completely different text
        // works the way that it splits both texts into words and then finds words that are unique in second text
        // the result is given by the lower length of unique parts
        _textSimilarity: function(textA, textB) {
          var tokensA = textA.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);
          var tokensB = textB.toLowerCase().split(this.REGEXPS.tokenize).filter(Boolean);
          if (!tokensA.length || !tokensB.length) {
            return 0;
          }
          var uniqTokensB = tokensB.filter((token) => !tokensA.includes(token));
          var distanceB = uniqTokensB.join(" ").length / tokensB.join(" ").length;
          return 1 - distanceB;
        },
        _checkByline: function(node, matchString) {
          if (this._articleByline) {
            return false;
          }
          if (node.getAttribute !== void 0) {
            var rel = node.getAttribute("rel");
            var itemprop = node.getAttribute("itemprop");
          }
          if ((rel === "author" || itemprop && itemprop.indexOf("author") !== -1 || this.REGEXPS.byline.test(matchString)) && this._isValidByline(node.textContent)) {
            this._articleByline = node.textContent.trim();
            return true;
          }
          return false;
        },
        _getNodeAncestors: function(node, maxDepth) {
          maxDepth = maxDepth || 0;
          var i = 0, ancestors = [];
          while (node.parentNode) {
            ancestors.push(node.parentNode);
            if (maxDepth && ++i === maxDepth)
              break;
            node = node.parentNode;
          }
          return ancestors;
        },
        /***
         * grabArticle - Using a variety of metrics (content score, classname, element types), find the content that is
         *         most likely to be the stuff a user wants to read. Then return it wrapped up in a div.
         *
         * @param page a document to run upon. Needs to be a full document, complete with body.
         * @return Element
        **/
        _grabArticle: function(page) {
          this.log("**** grabArticle ****");
          var doc = this._doc;
          var isPaging = page !== null;
          page = page ? page : this._doc.body;
          if (!page) {
            this.log("No body found in document. Abort.");
            return null;
          }
          var pageCacheHtml = page.innerHTML;
          while (true) {
            this.log("Starting grabArticle loop");
            var stripUnlikelyCandidates = this._flagIsActive(this.FLAG_STRIP_UNLIKELYS);
            var elementsToScore = [];
            var node = this._doc.documentElement;
            let shouldRemoveTitleHeader = true;
            while (node) {
              if (node.tagName === "HTML") {
                this._articleLang = node.getAttribute("lang");
              }
              var matchString = node.className + " " + node.id;
              if (!this._isProbablyVisible(node)) {
                this.log("Removing hidden node - " + matchString);
                node = this._removeAndGetNext(node);
                continue;
              }
              if (node.getAttribute("aria-modal") == "true" && node.getAttribute("role") == "dialog") {
                node = this._removeAndGetNext(node);
                continue;
              }
              if (this._checkByline(node, matchString)) {
                node = this._removeAndGetNext(node);
                continue;
              }
              if (shouldRemoveTitleHeader && this._headerDuplicatesTitle(node)) {
                this.log("Removing header: ", node.textContent.trim(), this._articleTitle.trim());
                shouldRemoveTitleHeader = false;
                node = this._removeAndGetNext(node);
                continue;
              }
              if (stripUnlikelyCandidates) {
                if (this.REGEXPS.unlikelyCandidates.test(matchString) && !this.REGEXPS.okMaybeItsACandidate.test(matchString) && !this._hasAncestorTag(node, "table") && !this._hasAncestorTag(node, "code") && node.tagName !== "BODY" && node.tagName !== "A") {
                  this.log("Removing unlikely candidate - " + matchString);
                  node = this._removeAndGetNext(node);
                  continue;
                }
                if (this.UNLIKELY_ROLES.includes(node.getAttribute("role"))) {
                  this.log("Removing content with role " + node.getAttribute("role") + " - " + matchString);
                  node = this._removeAndGetNext(node);
                  continue;
                }
              }
              if ((node.tagName === "DIV" || node.tagName === "SECTION" || node.tagName === "HEADER" || node.tagName === "H1" || node.tagName === "H2" || node.tagName === "H3" || node.tagName === "H4" || node.tagName === "H5" || node.tagName === "H6") && this._isElementWithoutContent(node)) {
                node = this._removeAndGetNext(node);
                continue;
              }
              if (this.DEFAULT_TAGS_TO_SCORE.indexOf(node.tagName) !== -1) {
                elementsToScore.push(node);
              }
              if (node.tagName === "DIV") {
                var p = null;
                var childNode = node.firstChild;
                while (childNode) {
                  var nextSibling = childNode.nextSibling;
                  if (this._isPhrasingContent(childNode)) {
                    if (p !== null) {
                      p.appendChild(childNode);
                    } else if (!this._isWhitespace(childNode)) {
                      p = doc.createElement("p");
                      node.replaceChild(p, childNode);
                      p.appendChild(childNode);
                    }
                  } else if (p !== null) {
                    while (p.lastChild && this._isWhitespace(p.lastChild)) {
                      p.removeChild(p.lastChild);
                    }
                    p = null;
                  }
                  childNode = nextSibling;
                }
                if (this._hasSingleTagInsideElement(node, "P") && this._getLinkDensity(node) < 0.25) {
                  var newNode = node.children[0];
                  node.parentNode.replaceChild(newNode, node);
                  node = newNode;
                  elementsToScore.push(node);
                } else if (!this._hasChildBlockElement(node)) {
                  node = this._setNodeTag(node, "P");
                  elementsToScore.push(node);
                }
              }
              node = this._getNextNode(node);
            }
            var candidates = [];
            this._forEachNode(elementsToScore, function(elementToScore) {
              if (!elementToScore.parentNode || typeof elementToScore.parentNode.tagName === "undefined")
                return;
              var innerText = this._getInnerText(elementToScore);
              if (innerText.length < 25)
                return;
              var ancestors2 = this._getNodeAncestors(elementToScore, 5);
              if (ancestors2.length === 0)
                return;
              var contentScore = 0;
              contentScore += 1;
              contentScore += innerText.split(this.REGEXPS.commas).length;
              contentScore += Math.min(Math.floor(innerText.length / 100), 3);
              this._forEachNode(ancestors2, function(ancestor, level) {
                if (!ancestor.tagName || !ancestor.parentNode || typeof ancestor.parentNode.tagName === "undefined")
                  return;
                if (typeof ancestor.readability === "undefined") {
                  this._initializeNode(ancestor);
                  candidates.push(ancestor);
                }
                if (level === 0)
                  var scoreDivider = 1;
                else if (level === 1)
                  scoreDivider = 2;
                else
                  scoreDivider = level * 3;
                ancestor.readability.contentScore += contentScore / scoreDivider;
              });
            });
            var topCandidates = [];
            for (var c = 0, cl = candidates.length; c < cl; c += 1) {
              var candidate = candidates[c];
              var candidateScore = candidate.readability.contentScore * (1 - this._getLinkDensity(candidate));
              candidate.readability.contentScore = candidateScore;
              this.log("Candidate:", candidate, "with score " + candidateScore);
              for (var t = 0; t < this._nbTopCandidates; t++) {
                var aTopCandidate = topCandidates[t];
                if (!aTopCandidate || candidateScore > aTopCandidate.readability.contentScore) {
                  topCandidates.splice(t, 0, candidate);
                  if (topCandidates.length > this._nbTopCandidates)
                    topCandidates.pop();
                  break;
                }
              }
            }
            var topCandidate = topCandidates[0] || null;
            var neededToCreateTopCandidate = false;
            var parentOfTopCandidate;
            if (topCandidate === null || topCandidate.tagName === "BODY") {
              topCandidate = doc.createElement("DIV");
              neededToCreateTopCandidate = true;
              while (page.firstChild) {
                this.log("Moving child out:", page.firstChild);
                topCandidate.appendChild(page.firstChild);
              }
              page.appendChild(topCandidate);
              this._initializeNode(topCandidate);
            } else if (topCandidate) {
              var alternativeCandidateAncestors = [];
              for (var i = 1; i < topCandidates.length; i++) {
                if (topCandidates[i].readability.contentScore / topCandidate.readability.contentScore >= 0.75) {
                  alternativeCandidateAncestors.push(this._getNodeAncestors(topCandidates[i]));
                }
              }
              var MINIMUM_TOPCANDIDATES = 3;
              if (alternativeCandidateAncestors.length >= MINIMUM_TOPCANDIDATES) {
                parentOfTopCandidate = topCandidate.parentNode;
                while (parentOfTopCandidate.tagName !== "BODY") {
                  var listsContainingThisAncestor = 0;
                  for (var ancestorIndex = 0; ancestorIndex < alternativeCandidateAncestors.length && listsContainingThisAncestor < MINIMUM_TOPCANDIDATES; ancestorIndex++) {
                    listsContainingThisAncestor += Number(alternativeCandidateAncestors[ancestorIndex].includes(parentOfTopCandidate));
                  }
                  if (listsContainingThisAncestor >= MINIMUM_TOPCANDIDATES) {
                    topCandidate = parentOfTopCandidate;
                    break;
                  }
                  parentOfTopCandidate = parentOfTopCandidate.parentNode;
                }
              }
              if (!topCandidate.readability) {
                this._initializeNode(topCandidate);
              }
              parentOfTopCandidate = topCandidate.parentNode;
              var lastScore = topCandidate.readability.contentScore;
              var scoreThreshold = lastScore / 3;
              while (parentOfTopCandidate.tagName !== "BODY") {
                if (!parentOfTopCandidate.readability) {
                  parentOfTopCandidate = parentOfTopCandidate.parentNode;
                  continue;
                }
                var parentScore = parentOfTopCandidate.readability.contentScore;
                if (parentScore < scoreThreshold)
                  break;
                if (parentScore > lastScore) {
                  topCandidate = parentOfTopCandidate;
                  break;
                }
                lastScore = parentOfTopCandidate.readability.contentScore;
                parentOfTopCandidate = parentOfTopCandidate.parentNode;
              }
              parentOfTopCandidate = topCandidate.parentNode;
              while (parentOfTopCandidate.tagName != "BODY" && parentOfTopCandidate.children.length == 1) {
                topCandidate = parentOfTopCandidate;
                parentOfTopCandidate = topCandidate.parentNode;
              }
              if (!topCandidate.readability) {
                this._initializeNode(topCandidate);
              }
            }
            var articleContent = doc.createElement("DIV");
            if (isPaging)
              articleContent.id = "readability-content";
            var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2);
            parentOfTopCandidate = topCandidate.parentNode;
            var siblings = parentOfTopCandidate.children;
            for (var s = 0, sl = siblings.length; s < sl; s++) {
              var sibling = siblings[s];
              var append = false;
              this.log("Looking at sibling node:", sibling, sibling.readability ? "with score " + sibling.readability.contentScore : "");
              this.log("Sibling has score", sibling.readability ? sibling.readability.contentScore : "Unknown");
              if (sibling === topCandidate) {
                append = true;
              } else {
                var contentBonus = 0;
                if (sibling.className === topCandidate.className && topCandidate.className !== "")
                  contentBonus += topCandidate.readability.contentScore * 0.2;
                if (sibling.readability && sibling.readability.contentScore + contentBonus >= siblingScoreThreshold) {
                  append = true;
                } else if (sibling.nodeName === "P") {
                  var linkDensity = this._getLinkDensity(sibling);
                  var nodeContent = this._getInnerText(sibling);
                  var nodeLength = nodeContent.length;
                  if (nodeLength > 80 && linkDensity < 0.25) {
                    append = true;
                  } else if (nodeLength < 80 && nodeLength > 0 && linkDensity === 0 && nodeContent.search(/\.( |$)/) !== -1) {
                    append = true;
                  }
                }
              }
              if (append) {
                this.log("Appending node:", sibling);
                if (this.ALTER_TO_DIV_EXCEPTIONS.indexOf(sibling.nodeName) === -1) {
                  this.log("Altering sibling:", sibling, "to div.");
                  sibling = this._setNodeTag(sibling, "DIV");
                }
                articleContent.appendChild(sibling);
                siblings = parentOfTopCandidate.children;
                s -= 1;
                sl -= 1;
              }
            }
            if (this._debug)
              this.log("Article content pre-prep: " + articleContent.innerHTML);
            this._prepArticle(articleContent);
            if (this._debug)
              this.log("Article content post-prep: " + articleContent.innerHTML);
            if (neededToCreateTopCandidate) {
              topCandidate.id = "readability-page-1";
              topCandidate.className = "page";
            } else {
              var div = doc.createElement("DIV");
              div.id = "readability-page-1";
              div.className = "page";
              while (articleContent.firstChild) {
                div.appendChild(articleContent.firstChild);
              }
              articleContent.appendChild(div);
            }
            if (this._debug)
              this.log("Article content after paging: " + articleContent.innerHTML);
            var parseSuccessful = true;
            var textLength = this._getInnerText(articleContent, true).length;
            if (textLength < this._charThreshold) {
              parseSuccessful = false;
              page.innerHTML = pageCacheHtml;
              if (this._flagIsActive(this.FLAG_STRIP_UNLIKELYS)) {
                this._removeFlag(this.FLAG_STRIP_UNLIKELYS);
                this._attempts.push({ articleContent, textLength });
              } else if (this._flagIsActive(this.FLAG_WEIGHT_CLASSES)) {
                this._removeFlag(this.FLAG_WEIGHT_CLASSES);
                this._attempts.push({ articleContent, textLength });
              } else if (this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY)) {
                this._removeFlag(this.FLAG_CLEAN_CONDITIONALLY);
                this._attempts.push({ articleContent, textLength });
              } else {
                this._attempts.push({ articleContent, textLength });
                this._attempts.sort(function(a, b) {
                  return b.textLength - a.textLength;
                });
                if (!this._attempts[0].textLength) {
                  return null;
                }
                articleContent = this._attempts[0].articleContent;
                parseSuccessful = true;
              }
            }
            if (parseSuccessful) {
              var ancestors = [parentOfTopCandidate, topCandidate].concat(this._getNodeAncestors(parentOfTopCandidate));
              this._someNode(ancestors, function(ancestor) {
                if (!ancestor.tagName)
                  return false;
                var articleDir = ancestor.getAttribute("dir");
                if (articleDir) {
                  this._articleDir = articleDir;
                  return true;
                }
                return false;
              });
              return articleContent;
            }
          }
        },
        /**
         * Check whether the input string could be a byline.
         * This verifies that the input is a string, and that the length
         * is less than 100 chars.
         *
         * @param possibleByline {string} - a string to check whether its a byline.
         * @return Boolean - whether the input string is a byline.
         */
        _isValidByline: function(byline) {
          if (typeof byline == "string" || byline instanceof String) {
            byline = byline.trim();
            return byline.length > 0 && byline.length < 100;
          }
          return false;
        },
        /**
         * Converts some of the common HTML entities in string to their corresponding characters.
         *
         * @param str {string} - a string to unescape.
         * @return string without HTML entity.
         */
        _unescapeHtmlEntities: function(str) {
          if (!str) {
            return str;
          }
          var htmlEscapeMap = this.HTML_ESCAPE_MAP;
          return str.replace(/&(quot|amp|apos|lt|gt);/g, function(_, tag) {
            return htmlEscapeMap[tag];
          }).replace(/&#(?:x([0-9a-z]{1,4})|([0-9]{1,4}));/gi, function(_, hex, numStr) {
            var num = parseInt(hex || numStr, hex ? 16 : 10);
            return String.fromCharCode(num);
          });
        },
        /**
         * Try to extract metadata from JSON-LD object.
         * For now, only Schema.org objects of type Article or its subtypes are supported.
         * @return Object with any metadata that could be extracted (possibly none)
         */
        _getJSONLD: function(doc) {
          var scripts = this._getAllNodesWithTag(doc, ["script"]);
          var metadata;
          this._forEachNode(scripts, function(jsonLdElement) {
            if (!metadata && jsonLdElement.getAttribute("type") === "application/ld+json") {
              try {
                var content = jsonLdElement.textContent.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, "");
                var parsed = JSON.parse(content);
                if (!parsed["@context"] || !parsed["@context"].match(/^https?\:\/\/schema\.org$/)) {
                  return;
                }
                if (!parsed["@type"] && Array.isArray(parsed["@graph"])) {
                  parsed = parsed["@graph"].find(function(it) {
                    return (it["@type"] || "").match(
                      this.REGEXPS.jsonLdArticleTypes
                    );
                  });
                }
                if (!parsed || !parsed["@type"] || !parsed["@type"].match(this.REGEXPS.jsonLdArticleTypes)) {
                  return;
                }
                metadata = {};
                if (typeof parsed.name === "string" && typeof parsed.headline === "string" && parsed.name !== parsed.headline) {
                  var title = this._getArticleTitle();
                  var nameMatches = this._textSimilarity(parsed.name, title) > 0.75;
                  var headlineMatches = this._textSimilarity(parsed.headline, title) > 0.75;
                  if (headlineMatches && !nameMatches) {
                    metadata.title = parsed.headline;
                  } else {
                    metadata.title = parsed.name;
                  }
                } else if (typeof parsed.name === "string") {
                  metadata.title = parsed.name.trim();
                } else if (typeof parsed.headline === "string") {
                  metadata.title = parsed.headline.trim();
                }
                if (parsed.author) {
                  if (typeof parsed.author.name === "string") {
                    metadata.byline = parsed.author.name.trim();
                  } else if (Array.isArray(parsed.author) && parsed.author[0] && typeof parsed.author[0].name === "string") {
                    metadata.byline = parsed.author.filter(function(author) {
                      return author && typeof author.name === "string";
                    }).map(function(author) {
                      return author.name.trim();
                    }).join(", ");
                  }
                }
                if (typeof parsed.description === "string") {
                  metadata.excerpt = parsed.description.trim();
                }
                if (parsed.publisher && typeof parsed.publisher.name === "string") {
                  metadata.siteName = parsed.publisher.name.trim();
                }
                if (typeof parsed.datePublished === "string") {
                  metadata.datePublished = parsed.datePublished.trim();
                }
                return;
              } catch (err) {
                this.log(err.message);
              }
            }
          });
          return metadata ? metadata : {};
        },
        /**
         * Attempts to get excerpt and byline metadata for the article.
         *
         * @param {Object} jsonld — object containing any metadata that
         * could be extracted from JSON-LD object.
         *
         * @return Object with optional "excerpt" and "byline" properties
         */
        _getArticleMetadata: function(jsonld) {
          var metadata = {};
          var values = {};
          var metaElements = this._doc.getElementsByTagName("meta");
          var propertyPattern = /\s*(article|dc|dcterm|og|twitter)\s*:\s*(author|creator|description|published_time|title|site_name)\s*/gi;
          var namePattern = /^\s*(?:(dc|dcterm|og|twitter|weibo:(article|webpage))\s*[\.:]\s*)?(author|creator|description|title|site_name)\s*$/i;
          this._forEachNode(metaElements, function(element) {
            var elementName = element.getAttribute("name");
            var elementProperty = element.getAttribute("property");
            var content = element.getAttribute("content");
            if (!content) {
              return;
            }
            var matches = null;
            var name = null;
            if (elementProperty) {
              matches = elementProperty.match(propertyPattern);
              if (matches) {
                name = matches[0].toLowerCase().replace(/\s/g, "");
                values[name] = content.trim();
              }
            }
            if (!matches && elementName && namePattern.test(elementName)) {
              name = elementName;
              if (content) {
                name = name.toLowerCase().replace(/\s/g, "").replace(/\./g, ":");
                values[name] = content.trim();
              }
            }
          });
          metadata.title = jsonld.title || values["dc:title"] || values["dcterm:title"] || values["og:title"] || values["weibo:article:title"] || values["weibo:webpage:title"] || values["title"] || values["twitter:title"];
          if (!metadata.title) {
            metadata.title = this._getArticleTitle();
          }
          metadata.byline = jsonld.byline || values["dc:creator"] || values["dcterm:creator"] || values["author"];
          metadata.excerpt = jsonld.excerpt || values["dc:description"] || values["dcterm:description"] || values["og:description"] || values["weibo:article:description"] || values["weibo:webpage:description"] || values["description"] || values["twitter:description"];
          metadata.siteName = jsonld.siteName || values["og:site_name"];
          metadata.publishedTime = jsonld.datePublished || values["article:published_time"] || null;
          metadata.title = this._unescapeHtmlEntities(metadata.title);
          metadata.byline = this._unescapeHtmlEntities(metadata.byline);
          metadata.excerpt = this._unescapeHtmlEntities(metadata.excerpt);
          metadata.siteName = this._unescapeHtmlEntities(metadata.siteName);
          metadata.publishedTime = this._unescapeHtmlEntities(metadata.publishedTime);
          return metadata;
        },
        /**
         * Check if node is image, or if node contains exactly only one image
         * whether as a direct child or as its descendants.
         *
         * @param Element
        **/
        _isSingleImage: function(node) {
          if (node.tagName === "IMG") {
            return true;
          }
          if (node.children.length !== 1 || node.textContent.trim() !== "") {
            return false;
          }
          return this._isSingleImage(node.children[0]);
        },
        /**
         * Find all <noscript> that are located after <img> nodes, and which contain only one
         * <img> element. Replace the first image with the image from inside the <noscript> tag,
         * and remove the <noscript> tag. This improves the quality of the images we use on
         * some sites (e.g. Medium).
         *
         * @param Element
        **/
        _unwrapNoscriptImages: function(doc) {
          var imgs = Array.from(doc.getElementsByTagName("img"));
          this._forEachNode(imgs, function(img) {
            for (var i = 0; i < img.attributes.length; i++) {
              var attr = img.attributes[i];
              switch (attr.name) {
                case "src":
                case "srcset":
                case "data-src":
                case "data-srcset":
                  return;
              }
              if (/\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
                return;
              }
            }
            img.parentNode.removeChild(img);
          });
          var noscripts = Array.from(doc.getElementsByTagName("noscript"));
          this._forEachNode(noscripts, function(noscript) {
            var tmp = doc.createElement("div");
            tmp.innerHTML = noscript.innerHTML;
            if (!this._isSingleImage(tmp)) {
              return;
            }
            var prevElement = noscript.previousElementSibling;
            if (prevElement && this._isSingleImage(prevElement)) {
              var prevImg = prevElement;
              if (prevImg.tagName !== "IMG") {
                prevImg = prevElement.getElementsByTagName("img")[0];
              }
              var newImg = tmp.getElementsByTagName("img")[0];
              for (var i = 0; i < prevImg.attributes.length; i++) {
                var attr = prevImg.attributes[i];
                if (attr.value === "") {
                  continue;
                }
                if (attr.name === "src" || attr.name === "srcset" || /\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
                  if (newImg.getAttribute(attr.name) === attr.value) {
                    continue;
                  }
                  var attrName = attr.name;
                  if (newImg.hasAttribute(attrName)) {
                    attrName = "data-old-" + attrName;
                  }
                  newImg.setAttribute(attrName, attr.value);
                }
              }
              noscript.parentNode.replaceChild(tmp.firstElementChild, prevElement);
            }
          });
        },
        /**
         * Removes script tags from the document.
         *
         * @param Element
        **/
        _removeScripts: function(doc) {
          this._removeNodes(this._getAllNodesWithTag(doc, ["script", "noscript"]));
        },
        /**
         * Check if this node has only whitespace and a single element with given tag
         * Returns false if the DIV node contains non-empty text nodes
         * or if it contains no element with given tag or more than 1 element.
         *
         * @param Element
         * @param string tag of child element
        **/
        _hasSingleTagInsideElement: function(element, tag) {
          if (element.children.length != 1 || element.children[0].tagName !== tag) {
            return false;
          }
          return !this._someNode(element.childNodes, function(node) {
            return node.nodeType === this.TEXT_NODE && this.REGEXPS.hasContent.test(node.textContent);
          });
        },
        _isElementWithoutContent: function(node) {
          return node.nodeType === this.ELEMENT_NODE && node.textContent.trim().length == 0 && (node.children.length == 0 || node.children.length == node.getElementsByTagName("br").length + node.getElementsByTagName("hr").length);
        },
        /**
         * Determine whether element has any children block level elements.
         *
         * @param Element
         */
        _hasChildBlockElement: function(element) {
          return this._someNode(element.childNodes, function(node) {
            return this.DIV_TO_P_ELEMS.has(node.tagName) || this._hasChildBlockElement(node);
          });
        },
        /***
         * Determine if a node qualifies as phrasing content.
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content
        **/
        _isPhrasingContent: function(node) {
          return node.nodeType === this.TEXT_NODE || this.PHRASING_ELEMS.indexOf(node.tagName) !== -1 || (node.tagName === "A" || node.tagName === "DEL" || node.tagName === "INS") && this._everyNode(node.childNodes, this._isPhrasingContent);
        },
        _isWhitespace: function(node) {
          return node.nodeType === this.TEXT_NODE && node.textContent.trim().length === 0 || node.nodeType === this.ELEMENT_NODE && node.tagName === "BR";
        },
        /**
         * Get the inner text of a node - cross browser compatibly.
         * This also strips out any excess whitespace to be found.
         *
         * @param Element
         * @param Boolean normalizeSpaces (default: true)
         * @return string
        **/
        _getInnerText: function(e, normalizeSpaces) {
          normalizeSpaces = typeof normalizeSpaces === "undefined" ? true : normalizeSpaces;
          var textContent = e.textContent.trim();
          if (normalizeSpaces) {
            return textContent.replace(this.REGEXPS.normalize, " ");
          }
          return textContent;
        },
        /**
         * Get the number of times a string s appears in the node e.
         *
         * @param Element
         * @param string - what to split on. Default is ","
         * @return number (integer)
        **/
        _getCharCount: function(e, s) {
          s = s || ",";
          return this._getInnerText(e).split(s).length - 1;
        },
        /**
         * Remove the style attribute on every e and under.
         * TODO: Test if getElementsByTagName(*) is faster.
         *
         * @param Element
         * @return void
        **/
        _cleanStyles: function(e) {
          if (!e || e.tagName.toLowerCase() === "svg")
            return;
          for (var i = 0; i < this.PRESENTATIONAL_ATTRIBUTES.length; i++) {
            e.removeAttribute(this.PRESENTATIONAL_ATTRIBUTES[i]);
          }
          if (this.DEPRECATED_SIZE_ATTRIBUTE_ELEMS.indexOf(e.tagName) !== -1) {
            e.removeAttribute("width");
            e.removeAttribute("height");
          }
          var cur = e.firstElementChild;
          while (cur !== null) {
            this._cleanStyles(cur);
            cur = cur.nextElementSibling;
          }
        },
        /**
         * Get the density of links as a percentage of the content
         * This is the amount of text that is inside a link divided by the total text in the node.
         *
         * @param Element
         * @return number (float)
        **/
        _getLinkDensity: function(element) {
          var textLength = this._getInnerText(element).length;
          if (textLength === 0)
            return 0;
          var linkLength = 0;
          this._forEachNode(element.getElementsByTagName("a"), function(linkNode) {
            var href = linkNode.getAttribute("href");
            var coefficient = href && this.REGEXPS.hashUrl.test(href) ? 0.3 : 1;
            linkLength += this._getInnerText(linkNode).length * coefficient;
          });
          return linkLength / textLength;
        },
        /**
         * Get an elements class/id weight. Uses regular expressions to tell if this
         * element looks good or bad.
         *
         * @param Element
         * @return number (Integer)
        **/
        _getClassWeight: function(e) {
          if (!this._flagIsActive(this.FLAG_WEIGHT_CLASSES))
            return 0;
          var weight = 0;
          if (typeof e.className === "string" && e.className !== "") {
            if (this.REGEXPS.negative.test(e.className))
              weight -= 25;
            if (this.REGEXPS.positive.test(e.className))
              weight += 25;
          }
          if (typeof e.id === "string" && e.id !== "") {
            if (this.REGEXPS.negative.test(e.id))
              weight -= 25;
            if (this.REGEXPS.positive.test(e.id))
              weight += 25;
          }
          return weight;
        },
        /**
         * Clean a node of all elements of type "tag".
         * (Unless it's a youtube/vimeo video. People love movies.)
         *
         * @param Element
         * @param string tag to clean
         * @return void
         **/
        _clean: function(e, tag) {
          var isEmbed = ["object", "embed", "iframe"].indexOf(tag) !== -1;
          this._removeNodes(this._getAllNodesWithTag(e, [tag]), function(element) {
            if (isEmbed) {
              for (var i = 0; i < element.attributes.length; i++) {
                if (this._allowedVideoRegex.test(element.attributes[i].value)) {
                  return false;
                }
              }
              if (element.tagName === "object" && this._allowedVideoRegex.test(element.innerHTML)) {
                return false;
              }
            }
            return true;
          });
        },
        /**
         * Check if a given node has one of its ancestor tag name matching the
         * provided one.
         * @param  HTMLElement node
         * @param  String      tagName
         * @param  Number      maxDepth
         * @param  Function    filterFn a filter to invoke to determine whether this node 'counts'
         * @return Boolean
         */
        _hasAncestorTag: function(node, tagName, maxDepth, filterFn) {
          maxDepth = maxDepth || 3;
          tagName = tagName.toUpperCase();
          var depth = 0;
          while (node.parentNode) {
            if (maxDepth > 0 && depth > maxDepth)
              return false;
            if (node.parentNode.tagName === tagName && (!filterFn || filterFn(node.parentNode)))
              return true;
            node = node.parentNode;
            depth++;
          }
          return false;
        },
        /**
         * Return an object indicating how many rows and columns this table has.
         */
        _getRowAndColumnCount: function(table) {
          var rows = 0;
          var columns = 0;
          var trs = table.getElementsByTagName("tr");
          for (var i = 0; i < trs.length; i++) {
            var rowspan = trs[i].getAttribute("rowspan") || 0;
            if (rowspan) {
              rowspan = parseInt(rowspan, 10);
            }
            rows += rowspan || 1;
            var columnsInThisRow = 0;
            var cells = trs[i].getElementsByTagName("td");
            for (var j = 0; j < cells.length; j++) {
              var colspan = cells[j].getAttribute("colspan") || 0;
              if (colspan) {
                colspan = parseInt(colspan, 10);
              }
              columnsInThisRow += colspan || 1;
            }
            columns = Math.max(columns, columnsInThisRow);
          }
          return { rows, columns };
        },
        /**
         * Look for 'data' (as opposed to 'layout') tables, for which we use
         * similar checks as
         * https://searchfox.org/mozilla-central/rev/f82d5c549f046cb64ce5602bfd894b7ae807c8f8/accessible/generic/TableAccessible.cpp#19
         */
        _markDataTables: function(root) {
          var tables = root.getElementsByTagName("table");
          for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            var role = table.getAttribute("role");
            if (role == "presentation") {
              table._readabilityDataTable = false;
              continue;
            }
            var datatable = table.getAttribute("datatable");
            if (datatable == "0") {
              table._readabilityDataTable = false;
              continue;
            }
            var summary = table.getAttribute("summary");
            if (summary) {
              table._readabilityDataTable = true;
              continue;
            }
            var caption = table.getElementsByTagName("caption")[0];
            if (caption && caption.childNodes.length > 0) {
              table._readabilityDataTable = true;
              continue;
            }
            var dataTableDescendants = ["col", "colgroup", "tfoot", "thead", "th"];
            var descendantExists = function(tag) {
              return !!table.getElementsByTagName(tag)[0];
            };
            if (dataTableDescendants.some(descendantExists)) {
              this.log("Data table because found data-y descendant");
              table._readabilityDataTable = true;
              continue;
            }
            if (table.getElementsByTagName("table")[0]) {
              table._readabilityDataTable = false;
              continue;
            }
            var sizeInfo = this._getRowAndColumnCount(table);
            if (sizeInfo.rows >= 10 || sizeInfo.columns > 4) {
              table._readabilityDataTable = true;
              continue;
            }
            table._readabilityDataTable = sizeInfo.rows * sizeInfo.columns > 10;
          }
        },
        /* convert images and figures that have properties like data-src into images that can be loaded without JS */
        _fixLazyImages: function(root) {
          this._forEachNode(this._getAllNodesWithTag(root, ["img", "picture", "figure"]), function(elem) {
            if (elem.src && this.REGEXPS.b64DataUrl.test(elem.src)) {
              var parts = this.REGEXPS.b64DataUrl.exec(elem.src);
              if (parts[1] === "image/svg+xml") {
                return;
              }
              var srcCouldBeRemoved = false;
              for (var i = 0; i < elem.attributes.length; i++) {
                var attr = elem.attributes[i];
                if (attr.name === "src") {
                  continue;
                }
                if (/\.(jpg|jpeg|png|webp)/i.test(attr.value)) {
                  srcCouldBeRemoved = true;
                  break;
                }
              }
              if (srcCouldBeRemoved) {
                var b64starts = elem.src.search(/base64\s*/i) + 7;
                var b64length = elem.src.length - b64starts;
                if (b64length < 133) {
                  elem.removeAttribute("src");
                }
              }
            }
            if ((elem.src || elem.srcset && elem.srcset != "null") && elem.className.toLowerCase().indexOf("lazy") === -1) {
              return;
            }
            for (var j = 0; j < elem.attributes.length; j++) {
              attr = elem.attributes[j];
              if (attr.name === "src" || attr.name === "srcset" || attr.name === "alt") {
                continue;
              }
              var copyTo = null;
              if (/\.(jpg|jpeg|png|webp)\s+\d/.test(attr.value)) {
                copyTo = "srcset";
              } else if (/^\s*\S+\.(jpg|jpeg|png|webp)\S*\s*$/.test(attr.value)) {
                copyTo = "src";
              }
              if (copyTo) {
                if (elem.tagName === "IMG" || elem.tagName === "PICTURE") {
                  elem.setAttribute(copyTo, attr.value);
                } else if (elem.tagName === "FIGURE" && !this._getAllNodesWithTag(elem, ["img", "picture"]).length) {
                  var img = this._doc.createElement("img");
                  img.setAttribute(copyTo, attr.value);
                  elem.appendChild(img);
                }
              }
            }
          });
        },
        _getTextDensity: function(e, tags) {
          var textLength = this._getInnerText(e, true).length;
          if (textLength === 0) {
            return 0;
          }
          var childrenLength = 0;
          var children = this._getAllNodesWithTag(e, tags);
          this._forEachNode(children, (child) => childrenLength += this._getInnerText(child, true).length);
          return childrenLength / textLength;
        },
        /**
         * Clean an element of all tags of type "tag" if they look fishy.
         * "Fishy" is an algorithm based on content length, classnames, link density, number of images & embeds, etc.
         *
         * @return void
         **/
        _cleanConditionally: function(e, tag) {
          if (!this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY))
            return;
          this._removeNodes(this._getAllNodesWithTag(e, [tag]), function(node) {
            var isDataTable = function(t) {
              return t._readabilityDataTable;
            };
            var isList = tag === "ul" || tag === "ol";
            if (!isList) {
              var listLength = 0;
              var listNodes = this._getAllNodesWithTag(node, ["ul", "ol"]);
              this._forEachNode(listNodes, (list) => listLength += this._getInnerText(list).length);
              isList = listLength / this._getInnerText(node).length > 0.9;
            }
            if (tag === "table" && isDataTable(node)) {
              return false;
            }
            if (this._hasAncestorTag(node, "table", -1, isDataTable)) {
              return false;
            }
            if (this._hasAncestorTag(node, "code")) {
              return false;
            }
            var weight = this._getClassWeight(node);
            this.log("Cleaning Conditionally", node);
            var contentScore = 0;
            if (weight + contentScore < 0) {
              return true;
            }
            if (this._getCharCount(node, ",") < 10) {
              var p = node.getElementsByTagName("p").length;
              var img = node.getElementsByTagName("img").length;
              var li = node.getElementsByTagName("li").length - 100;
              var input = node.getElementsByTagName("input").length;
              var headingDensity = this._getTextDensity(node, ["h1", "h2", "h3", "h4", "h5", "h6"]);
              var embedCount = 0;
              var embeds = this._getAllNodesWithTag(node, ["object", "embed", "iframe"]);
              for (var i = 0; i < embeds.length; i++) {
                for (var j = 0; j < embeds[i].attributes.length; j++) {
                  if (this._allowedVideoRegex.test(embeds[i].attributes[j].value)) {
                    return false;
                  }
                }
                if (embeds[i].tagName === "object" && this._allowedVideoRegex.test(embeds[i].innerHTML)) {
                  return false;
                }
                embedCount++;
              }
              var linkDensity = this._getLinkDensity(node);
              var contentLength = this._getInnerText(node).length;
              var haveToRemove = img > 1 && p / img < 0.5 && !this._hasAncestorTag(node, "figure") || !isList && li > p || input > Math.floor(p / 3) || !isList && headingDensity < 0.9 && contentLength < 25 && (img === 0 || img > 2) && !this._hasAncestorTag(node, "figure") || !isList && weight < 25 && linkDensity > 0.2 || weight >= 25 && linkDensity > 0.5 || (embedCount === 1 && contentLength < 75 || embedCount > 1);
              if (isList && haveToRemove) {
                for (var x = 0; x < node.children.length; x++) {
                  let child = node.children[x];
                  if (child.children.length > 1) {
                    return haveToRemove;
                  }
                }
                let li_count = node.getElementsByTagName("li").length;
                if (img == li_count) {
                  return false;
                }
              }
              return haveToRemove;
            }
            return false;
          });
        },
        /**
         * Clean out elements that match the specified conditions
         *
         * @param Element
         * @param Function determines whether a node should be removed
         * @return void
         **/
        _cleanMatchedNodes: function(e, filter) {
          var endOfSearchMarkerNode = this._getNextNode(e, true);
          var next = this._getNextNode(e);
          while (next && next != endOfSearchMarkerNode) {
            if (filter.call(this, next, next.className + " " + next.id)) {
              next = this._removeAndGetNext(next);
            } else {
              next = this._getNextNode(next);
            }
          }
        },
        /**
         * Clean out spurious headers from an Element.
         *
         * @param Element
         * @return void
        **/
        _cleanHeaders: function(e) {
          let headingNodes = this._getAllNodesWithTag(e, ["h1", "h2"]);
          this._removeNodes(headingNodes, function(node) {
            let shouldRemove = this._getClassWeight(node) < 0;
            if (shouldRemove) {
              this.log("Removing header with low class weight:", node);
            }
            return shouldRemove;
          });
        },
        /**
         * Check if this node is an H1 or H2 element whose content is mostly
         * the same as the article title.
         *
         * @param Element  the node to check.
         * @return boolean indicating whether this is a title-like header.
         */
        _headerDuplicatesTitle: function(node) {
          if (node.tagName != "H1" && node.tagName != "H2") {
            return false;
          }
          var heading = this._getInnerText(node, false);
          this.log("Evaluating similarity of header:", heading, this._articleTitle);
          return this._textSimilarity(this._articleTitle, heading) > 0.75;
        },
        _flagIsActive: function(flag) {
          return (this._flags & flag) > 0;
        },
        _removeFlag: function(flag) {
          this._flags = this._flags & ~flag;
        },
        _isProbablyVisible: function(node) {
          return (!node.style || node.style.display != "none") && (!node.style || node.style.visibility != "hidden") && !node.hasAttribute("hidden") && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || node.className && node.className.indexOf && node.className.indexOf("fallback-image") !== -1);
        },
        /**
         * Runs readability.
         *
         * Workflow:
         *  1. Prep the document by removing script tags, css, etc.
         *  2. Build readability's DOM tree.
         *  3. Grab the article content from the current dom tree.
         *  4. Replace the current DOM tree with the new one.
         *  5. Read peacefully.
         *
         * @return void
         **/
        parse: function() {
          if (this._maxElemsToParse > 0) {
            var numTags = this._doc.getElementsByTagName("*").length;
            if (numTags > this._maxElemsToParse) {
              throw new Error("Aborting parsing document; " + numTags + " elements found");
            }
          }
          this._unwrapNoscriptImages(this._doc);
          var jsonLd = this._disableJSONLD ? {} : this._getJSONLD(this._doc);
          this._removeScripts(this._doc);
          this._prepDocument();
          var metadata = this._getArticleMetadata(jsonLd);
          this._articleTitle = metadata.title;
          var articleContent = this._grabArticle();
          if (!articleContent)
            return null;
          this.log("Grabbed: " + articleContent.innerHTML);
          this._postProcessContent(articleContent);
          if (!metadata.excerpt) {
            var paragraphs = articleContent.getElementsByTagName("p");
            if (paragraphs.length > 0) {
              metadata.excerpt = paragraphs[0].textContent.trim();
            }
          }
          var textContent = articleContent.textContent;
          return {
            title: this._articleTitle,
            byline: metadata.byline || this._articleByline,
            dir: this._articleDir,
            lang: this._articleLang,
            content: this._serializer(articleContent),
            textContent,
            length: textContent.length,
            excerpt: metadata.excerpt,
            siteName: metadata.siteName || this._articleSiteName,
            publishedTime: metadata.publishedTime
          };
        }
      };
      if (typeof module === "object") {
        module.exports = Readability2;
      }
    }
  });

  // node_modules/@mozilla/readability/Readability-readerable.js
  var require_Readability_readerable = __commonJS({
    "node_modules/@mozilla/readability/Readability-readerable.js"(exports, module) {
      var REGEXPS = {
        // NOTE: These two regular expressions are duplicated in
        // Readability.js. Please keep both copies in sync.
        unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i,
        okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i
      };
      function isNodeVisible(node) {
        return (!node.style || node.style.display != "none") && !node.hasAttribute("hidden") && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || node.className && node.className.indexOf && node.className.indexOf("fallback-image") !== -1);
      }
      function isProbablyReaderable(doc, options = {}) {
        if (typeof options == "function") {
          options = { visibilityChecker: options };
        }
        var defaultOptions = { minScore: 20, minContentLength: 140, visibilityChecker: isNodeVisible };
        options = Object.assign(defaultOptions, options);
        var nodes = doc.querySelectorAll("p, pre, article");
        var brNodes = doc.querySelectorAll("div > br");
        if (brNodes.length) {
          var set = new Set(nodes);
          [].forEach.call(brNodes, function(node) {
            set.add(node.parentNode);
          });
          nodes = Array.from(set);
        }
        var score = 0;
        return [].some.call(nodes, function(node) {
          if (!options.visibilityChecker(node)) {
            return false;
          }
          var matchString = node.className + " " + node.id;
          if (REGEXPS.unlikelyCandidates.test(matchString) && !REGEXPS.okMaybeItsACandidate.test(matchString)) {
            return false;
          }
          if (node.matches("li p")) {
            return false;
          }
          var textContentLength = node.textContent.trim().length;
          if (textContentLength < options.minContentLength) {
            return false;
          }
          score += Math.sqrt(textContentLength - options.minContentLength);
          if (score > options.minScore) {
            return true;
          }
          return false;
        });
      }
      if (typeof module === "object") {
        module.exports = isProbablyReaderable;
      }
    }
  });

  // node_modules/@mozilla/readability/index.js
  var require_readability = __commonJS({
    "node_modules/@mozilla/readability/index.js"(exports, module) {
      var Readability2 = require_Readability();
      var isProbablyReaderable = require_Readability_readerable();
      module.exports = {
        Readability: Readability2,
        isProbablyReaderable
      };
    }
  });

  // src/common/storage.js
  var storage_exports = {};
  __export(storage_exports, {
    getStoredSettings: () => getStoredSettings,
    updateStoredSettings: () => updateStoredSettings
  });
  function getStorage() {
    if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
      return browser.storage.local;
    }
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      return chrome.storage.local;
    }
    if (!globalThis._mockStorage) {
      globalThis._mockStorage = {};
    }
    return {
      async get(keys) {
        if (typeof keys === "string") {
          return { [keys]: globalThis._mockStorage[keys] };
        }
        if (Array.isArray(keys)) {
          const res = {};
          for (const k of keys) res[k] = globalThis._mockStorage[k];
          return res;
        }
        return { ...globalThis._mockStorage };
      },
      async set(items) {
        Object.assign(globalThis._mockStorage, items);
      },
      async remove(keys) {
        const arr = Array.isArray(keys) ? keys : [keys];
        for (const k of arr) delete globalThis._mockStorage[k];
      },
      async clear() {
        globalThis._mockStorage = {};
      }
    };
  }
  async function getStoredSettings() {
    const storage = getStorage();
    try {
      const result = await storage.get(STORAGE_KEYS.SETTINGS);
      const saved = result && result[STORAGE_KEYS.SETTINGS];
      return { ...DEFAULT_SETTINGS, ...saved || {} };
    } catch (err) {
      console.error("[SimpleAloud] Failed to load settings from storage:", err);
      return { ...DEFAULT_SETTINGS };
    }
  }
  async function updateStoredSettings(newSettings) {
    const storage = getStorage();
    try {
      const current = await getStoredSettings();
      const updated = { ...current, ...newSettings };
      await storage.set({ [STORAGE_KEYS.SETTINGS]: updated });
      return updated;
    } catch (err) {
      console.error("[SimpleAloud] Failed to save settings to storage:", err);
      throw err;
    }
  }
  var init_storage = __esm({
    "src/common/storage.js"() {
      init_constants();
    }
  });

  // src/content/content-script.js
  init_constants();

  // src/common/messages.js
  function createMessage(type, payload = null, sender = void 0) {
    return {
      type,
      payload,
      sender,
      timestamp: Date.now()
    };
  }
  async function sendMessageToBackground(type, payload = null) {
    const msg = createMessage(type, payload);
    if (typeof browser !== "undefined" && browser.runtime && browser.runtime.sendMessage) {
      return browser.runtime.sendMessage(msg);
    }
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(msg, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    }
    console.warn("[SimpleAloud] No extension runtime available to send message to background");
    return null;
  }
  async function sendMessageToTab(tabId, type, payload = null) {
    const msg = createMessage(type, payload, "background");
    if (typeof browser !== "undefined" && browser.tabs && browser.tabs.sendMessage) {
      return browser.tabs.sendMessage(tabId, msg);
    }
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.sendMessage) {
      return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, msg, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    }
    return null;
  }
  function addMessageListener(handler) {
    if (typeof browser !== "undefined" && browser.runtime && browser.runtime.onMessage) {
      browser.runtime.onMessage.addListener(handler);
      return;
    }
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(handler);
      return;
    }
  }

  // src/content/extractor.js
  var import_readability = __toESM(require_readability(), 1);
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
  function extractParagraphsFromHTML(htmlContent) {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(htmlContent, "text/html");
    const blockElements = parsedDoc.querySelectorAll("p, li, blockquote");
    const paragraphs = [];
    for (const el of blockElements) {
      const text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (text.length >= 15) {
        paragraphs.push(text);
      }
    }
    if (paragraphs.length === 0 && parsedDoc.body) {
      const rawText = parsedDoc.body.textContent || "";
      const lines = rawText.split(/\n\s*\n/).map((l) => l.replace(/\s+/g, " ").trim());
      for (const line of lines) {
        if (line.length >= 15) {
          paragraphs.push(line);
        }
      }
    }
    return paragraphs;
  }
  function extractArticleContent(doc, options = {}) {
    const userSelection = options.selectedText !== void 0 ? options.selectedText : typeof window !== "undefined" && window.getSelection ? window.getSelection().toString().trim() : "";
    if (userSelection && userSelection.length >= 10) {
      const articleId2 = "sel_" + hashString(userSelection);
      return {
        success: true,
        isSelection: true,
        article: {
          id: articleId2,
          url: doc.location ? doc.location.href : "",
          title: "Selected Text",
          byline: null,
          excerpt: userSelection.substring(0, 120),
          paragraphs: [{ index: 0, text: userSelection, sentences: [] }],
          totalWords: userSelection.split(/\s+/).filter(Boolean).length,
          totalSentences: 1,
          extractedAt: Date.now()
        }
      };
    }
    const docClone = doc.cloneNode(true);
    const docH1 = doc.querySelector("h1")?.textContent?.trim();
    let parsed = null;
    try {
      const reader = new import_readability.Readability(docClone, {
        charThreshold: 60,
        keepClasses: false
      });
      parsed = reader.parse();
    } catch (err) {
      console.warn("[SimpleAloud] Readability parse failed:", err);
    }
    if (!parsed || !parsed.content || !parsed.textContent && parsed.content.length < 50) {
      return {
        success: false,
        errorMessage: "No readable article content found on this page."
      };
    }
    const rawParagraphs = extractParagraphsFromHTML(parsed.content);
    if (rawParagraphs.length === 0) {
      return {
        success: false,
        errorMessage: "Unable to extract article text paragraphs."
      };
    }
    const resolvedTitle = docH1 || parsed.title || doc.title || "Untitled Article";
    const bodyParagraphs = rawParagraphs.filter((p) => p.trim() !== resolvedTitle.trim());
    const finalParagraphs = bodyParagraphs.length > 0 ? bodyParagraphs : rawParagraphs;
    const structuredParagraphs = finalParagraphs.map((text, index) => ({
      index,
      text,
      sentences: []
    }));
    const fullText = finalParagraphs.join(" ");
    const totalWords = fullText.split(/\s+/).filter(Boolean).length;
    const articleId = "art_" + hashString((doc.location ? doc.location.href : "") + resolvedTitle);
    return {
      success: true,
      isSelection: false,
      article: {
        id: articleId,
        url: doc.location ? doc.location.href : "",
        title: resolvedTitle,
        byline: parsed.byline || null,
        excerpt: parsed.excerpt || finalParagraphs[0].substring(0, 150),
        paragraphs: structuredParagraphs,
        totalWords,
        totalSentences: 0,
        extractedAt: Date.now()
      }
    };
  }

  // src/content/segmenter.js
  var HONORIFIC_PREFIXES = /* @__PURE__ */ new Set([
    "dr",
    "mr",
    "mrs",
    "ms",
    "prof",
    "sr",
    "jr",
    "rev",
    "st"
  ]);
  function shouldMergeWithNext(text, nextText = "") {
    const trimmed = text.trim();
    const honorificMatch = trimmed.match(/\b([a-zA-Z]+)\.$/);
    if (honorificMatch) {
      const word = honorificMatch[1].toLowerCase();
      if (HONORIFIC_PREFIXES.has(word)) return true;
    }
    if (/\b[a-zA-Z]\.[a-zA-Z]\.$/.test(trimmed)) {
      if (nextText && /^[a-z]/.test(nextText.trim())) return true;
    }
    if (/\b(a\.m|p\.m)\.$/i.test(trimmed)) {
      if (nextText && /^[a-z]/.test(nextText.trim())) return true;
    }
    if (/\b[A-Z]\.$/.test(trimmed)) return true;
    return false;
  }
  function splitIntoSentences(text) {
    if (!text || typeof text !== "string") return [];
    const trimmed = text.trim();
    if (!trimmed) return [];
    let rawSegments = [];
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      try {
        const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
        const segments = Array.from(segmenter.segment(trimmed));
        rawSegments = segments.map((s) => s.segment.trim()).filter((s) => s.length > 0);
      } catch (e) {
        rawSegments = [];
      }
    }
    if (rawSegments.length === 0) {
      rawSegments = trimmed.split(/(?<=[.?!])\s+/).filter(Boolean);
    }
    const merged = [];
    for (let i = 0; i < rawSegments.length; i++) {
      const current = rawSegments[i];
      const next = rawSegments[i + 1] || "";
      if (merged.length > 0 && shouldMergeWithNext(merged[merged.length - 1], current)) {
        merged[merged.length - 1] += " " + current;
      } else {
        merged.push(current);
      }
    }
    return merged;
  }
  function segmentParagraphsIntoSentences(paragraphs) {
    let globalSentenceIndex = 0;
    return paragraphs.map((item, pIndex) => {
      const text = typeof item === "string" ? item : item.text;
      const sentenceStrings = splitIntoSentences(text);
      let charOffset = 0;
      const sentences = sentenceStrings.map((sText, sIndex) => {
        const offset = text.indexOf(sText, charOffset);
        const actualOffset = offset !== -1 ? offset : charOffset;
        charOffset = actualOffset + sText.length;
        const sentenceObj = {
          index: sIndex,
          globalIndex: globalSentenceIndex,
          text: sText,
          charOffset: actualOffset
        };
        globalSentenceIndex++;
        return sentenceObj;
      });
      return {
        index: pIndex,
        text,
        sentences
      };
    });
  }

  // src/content/highlighter.js
  var SentenceHighlighter = class {
    constructor(doc = document) {
      this.doc = doc;
      this.attachedSpans = [];
      this.currentActiveSpan = null;
      this.originalNodes = /* @__PURE__ */ new Map();
      this.autoScroll = true;
    }
    /**
     * Scans DOM for matching paragraph elements and wraps sentences in identifiable spans.
     * @param {any} article
     */
    attachToArticle(article) {
      this.clear();
      if (!article || !article.paragraphs) return;
      const allPElements = Array.from(this.doc.querySelectorAll("p, li, blockquote"));
      for (const pItem of article.paragraphs) {
        if (!pItem.sentences || pItem.sentences.length === 0) continue;
        const targetEl = allPElements.find((el) => {
          const text = (el.textContent || "").replace(/\s+/g, " ").trim();
          return text.length > 20 && (text.includes(pItem.sentences[0].text) || pItem.text.includes(text));
        });
        if (!targetEl) continue;
        const clonedChildren = Array.from(targetEl.childNodes).map((node) => node.cloneNode(true));
        this.originalNodes.set(targetEl, clonedChildren);
        targetEl.replaceChildren();
        for (let i = 0; i < pItem.sentences.length; i++) {
          const s = pItem.sentences[i];
          const span = this.doc.createElement("span");
          span.className = "simple-aloud-sentence";
          span.setAttribute("data-p-index", String(pItem.index));
          span.setAttribute("data-s-index", String(s.index));
          span.setAttribute("data-g-index", String(s.globalIndex));
          span.textContent = s.text;
          targetEl.appendChild(span);
          this.attachedSpans.push(span);
          if (i < pItem.sentences.length - 1) {
            targetEl.appendChild(this.doc.createTextNode(" "));
          }
        }
      }
      this.injectStyles();
    }
    injectStyles() {
      if (this.doc.getElementById("simple-aloud-highlighter-styles")) return;
      const style = this.doc.createElement("style");
      style.id = "simple-aloud-highlighter-styles";
      style.textContent = `
      .simple-aloud-sentence {
        transition: background-color 0.2s ease, border-radius 0.2s ease;
      }
      .simple-aloud-highlight-active {
        background-color: #fef08a !important;
        color: #0f172a !important;
        border-radius: 4px !important;
        box-shadow: 0 0 0 2px rgba(254, 240, 138, 0.6);
      }
    `;
      this.doc.head.appendChild(style);
    }
    /**
     * Highlights the target sentence and scrolls into view if autoScroll is enabled.
     * @param {number} pIndex
     * @param {number} sIndex
     */
    highlightSentence(pIndex, sIndex) {
      if (this.currentActiveSpan) {
        this.currentActiveSpan.classList.remove("simple-aloud-highlight-active");
        this.currentActiveSpan = null;
      }
      const targetSpan = this.attachedSpans.find(
        (span) => parseInt(span.getAttribute("data-p-index"), 10) === pIndex && parseInt(span.getAttribute("data-s-index"), 10) === sIndex
      );
      if (targetSpan) {
        targetSpan.classList.add("simple-aloud-highlight-active");
        this.currentActiveSpan = targetSpan;
        if (this.autoScroll && typeof targetSpan.scrollIntoView === "function") {
          targetSpan.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
    /**
     * Completely restores original DOM structure and removes all injected spans and styles.
     */
    clear() {
      if (this.currentActiveSpan) {
        this.currentActiveSpan.classList.remove("simple-aloud-highlight-active");
        this.currentActiveSpan = null;
      }
      for (const [el, originalChildren] of this.originalNodes.entries()) {
        if (el && el.isConnected) {
          el.replaceChildren(...originalChildren);
        }
      }
      this.originalNodes.clear();
      this.attachedSpans = [];
      const styleEl = this.doc.getElementById("simple-aloud-highlighter-styles");
      if (styleEl) {
        styleEl.remove();
      }
    }
  };

  // src/background/tts/voices.js
  var CURATED_VOICES = [
    {
      id: "en-US-female",
      displayName: "US - Sarah",
      dialect: "en-US",
      regionLabel: "United States",
      gender: "female",
      serviceVoiceName: "en-US-JennyNeural",
      deliveryTier: "neural",
      isAvailable: true
    },
    {
      id: "en-US-male",
      displayName: "US - Guy",
      dialect: "en-US",
      regionLabel: "United States",
      gender: "male",
      serviceVoiceName: "en-US-GuyNeural",
      deliveryTier: "neural",
      isAvailable: true
    },
    {
      id: "en-GB-female",
      displayName: "UK - Sonia",
      dialect: "en-GB",
      regionLabel: "United Kingdom",
      gender: "female",
      serviceVoiceName: "en-GB-SoniaNeural",
      deliveryTier: "neural",
      isAvailable: true
    },
    {
      id: "en-GB-male",
      displayName: "UK - Ryan",
      dialect: "en-GB",
      regionLabel: "United Kingdom",
      gender: "male",
      serviceVoiceName: "en-GB-RyanNeural",
      deliveryTier: "neural",
      isAvailable: true
    },
    {
      id: "en-IN-female",
      displayName: "India - Neerja",
      dialect: "en-IN",
      regionLabel: "India",
      gender: "female",
      serviceVoiceName: "en-IN-NeerjaNeural",
      deliveryTier: "neural",
      isAvailable: true
    },
    {
      id: "en-IN-male",
      displayName: "India - Prabhat",
      dialect: "en-IN",
      regionLabel: "India",
      gender: "male",
      serviceVoiceName: "en-IN-PrabhatNeural",
      deliveryTier: "neural",
      isAvailable: true
    }
  ];
  function getVoiceById(voiceId) {
    const found = CURATED_VOICES.find((v) => v.id === voiceId);
    return found ? { ...found } : { ...CURATED_VOICES[0] };
  }
  var ROBOTIC_VOICE_NAMES = [
    "albert",
    "bad news",
    "bahh",
    "bells",
    "boing",
    "bubbles",
    "cellos",
    "deranged",
    "good news",
    "hysterical",
    "jester",
    "junior",
    "kathy",
    "organ",
    "superstar",
    "trinoids",
    "whisper",
    "wobble",
    "zarvox",
    "fred",
    "ralph",
    "grandma",
    "grandpa"
  ];
  var PREFERRED_VOICE_NAMES = {
    "en-US-female": ["samantha", "ava", "allison", "susan", "zoe", "victoria", "flo", "shelley", "sandy", "jenny", "zira", "female"],
    "en-US-male": ["alex", "tom", "evan", "nathan", "reed", "eddy", "rocko", "guy", "david", "mark", "male"],
    "en-GB-female": ["serena", "kate", "stephanie", "fiona", "sonia", "hazel", "libby", "flo", "shelley", "female"],
    "en-GB-male": ["daniel", "oliver", "george", "ryan", "eddy", "reed", "rocko", "male"],
    "en-IN-female": ["veena", "neerja", "tara", "kavya", "ananya", "heera", "female"],
    "en-IN-male": ["rishi", "aman", "prabhat", "ravi", "kunal", "male"]
  };
  function matchLocalFallbackVoice(profile, localVoices = []) {
    if (!localVoices || localVoices.length === 0) return null;
    const targetLang = (profile.dialect || "en-US").toLowerCase().replace("_", "-");
    const targetBaseLang = targetLang.split("-")[0];
    const preferredList = PREFERRED_VOICE_NAMES[profile.id] || [];
    const naturalPool = localVoices.filter((v) => {
      const name = (v.name || "").toLowerCase();
      return !ROBOTIC_VOICE_NAMES.some((bad) => name.includes(bad));
    });
    const pool = naturalPool.length > 0 ? naturalPool : localVoices;
    let bestVoice = null;
    let bestScore = -Infinity;
    for (const voice of pool) {
      const vLang = (voice.lang || "").toLowerCase().replace("_", "-");
      const vName = (voice.name || "").toLowerCase();
      let score = 0;
      if (vLang === targetLang) {
        score += 50;
      } else if (vLang.startsWith(targetBaseLang)) {
        score += 20;
      } else {
        score -= 50;
      }
      if (vName.includes("enhanced")) score += 40;
      if (vName.includes("natural")) score += 30;
      if (vName.includes("premium")) score += 30;
      if (vName.includes("neural")) score += 30;
      for (let i = 0; i < preferredList.length; i++) {
        if (vName.includes(preferredList[i])) {
          score += 50 - i * 3;
          break;
        }
      }
      if (voice.localService) score += 5;
      if (score > bestScore) {
        bestScore = score;
        bestVoice = voice;
      }
    }
    return bestVoice || pool[0] || localVoices[0];
  }

  // src/content/ui/voice-selector.js
  function createVoiceSelector(activeVoiceId = "en-US-female", onVoiceChange = () => {
  }) {
    const select = document.createElement("select");
    select.className = "aloud-voice-select";
    select.title = "Select Voice & Dialect";
    const regions = [
      { label: "United States", dialect: "en-US" },
      { label: "United Kingdom", dialect: "en-GB" },
      { label: "India", dialect: "en-IN" }
    ];
    for (const reg of regions) {
      const group = document.createElement("optgroup");
      group.label = reg.label;
      const voices = CURATED_VOICES.filter((v) => v.dialect === reg.dialect);
      for (const v of voices) {
        const opt = document.createElement("option");
        opt.value = v.id;
        opt.textContent = `${v.displayName} (${v.gender})`;
        if (v.id === activeVoiceId) {
          opt.selected = true;
        }
        group.appendChild(opt);
      }
      select.appendChild(group);
    }
    select.addEventListener("change", (e) => {
      onVoiceChange(e.target.value);
    });
    return select;
  }

  // src/content/ui/speed-controller.js
  init_constants();
  function createSpeedController(activeSpeed = 1, onSpeedChange = () => {
  }) {
    const container = document.createElement("div");
    container.className = "aloud-speed-control";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "aloud-speed-btn";
    btn.title = "Adjust Reading Speed";
    btn.textContent = `${activeSpeed}x`;
    let currentRate = activeSpeed;
    btn.addEventListener("click", () => {
      const currentIndex = SPEED_PRESETS.indexOf(currentRate);
      const nextIndex = (currentIndex + 1) % SPEED_PRESETS.length;
      currentRate = SPEED_PRESETS[nextIndex];
      btn.textContent = `${currentRate}x`;
      onSpeedChange(currentRate);
    });
    container.appendChild(btn);
    container.setSpeed = (rate) => {
      currentRate = rate;
      btn.textContent = `${rate}x`;
    };
    return container;
  }

  // src/content/ui/player-bar.js
  init_constants();
  function createSvgIcon(pathD, size = 18, isStroke = false) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "0 0 24 24");
    if (isStroke) {
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2.5");
    } else {
      svg.setAttribute("fill", "currentColor");
    }
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    svg.appendChild(path);
    return svg;
  }
  var PlayerBar = class {
    constructor(options = {}) {
      this.onPlayPause = options.onPlayPause || (() => {
      });
      this.onSkipForward = options.onSkipForward || (() => {
      });
      this.onSkipBackward = options.onSkipBackward || (() => {
      });
      this.onVoiceChange = options.onVoiceChange || (() => {
      });
      this.onSpeedChange = options.onSpeedChange || (() => {
      });
      this.onClose = options.onClose || (() => {
      });
      this.host = null;
      this.shadow = null;
      this.btnPlay = null;
      this.speedCtrl = null;
      this.voiceSel = null;
      this.status = PLAYBACK_STATUS.IDLE;
    }
    mount(doc = document) {
      if (this.host) return;
      this.host = doc.createElement("div");
      this.host.id = "simple-aloud-player-root";
      this.shadow = this.host.attachShadow({ mode: "open" });
      const style = doc.createElement("style");
      style.textContent = `
      :host {
        all: initial;
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2147483647;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        user-select: none;
      }
      .aloud-player-container {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(15, 23, 42, 0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 9999px;
        padding: 8px 16px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(99, 102, 241, 0.25);
        color: #f8fafc;
      }
      .aloud-btn {
        background: transparent;
        border: none;
        color: #f8fafc;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        transition: all 0.15s ease;
      }
      .aloud-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        transform: scale(1.05);
      }
      .aloud-btn-play {
        background: linear-gradient(135deg, #6366f1, #818cf8);
        width: 42px;
        height: 42px;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }
      .aloud-btn-play:hover {
        background: linear-gradient(135deg, #4f46e5, #6366f1);
      }
      .aloud-voice-select {
        background: rgba(30, 41, 59, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #f8fafc;
        border-radius: 20px;
        padding: 6px 12px;
        font-size: 13px;
        cursor: pointer;
      }
      .aloud-speed-btn {
        background: rgba(30, 41, 59, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #6366f1;
        border-radius: 20px;
        padding: 6px 10px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }
      .aloud-btn-close {
        color: #94a3b8;
      }
      .aloud-btn-close:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.15);
      }
    `;
      this.shadow.appendChild(style);
      const container = doc.createElement("div");
      container.className = "aloud-player-container";
      const btnPrev = doc.createElement("button");
      btnPrev.type = "button";
      btnPrev.className = "aloud-btn";
      btnPrev.title = "Previous Sentence";
      btnPrev.appendChild(createSvgIcon("M6 6h2v12H6zm3.5 6l8.5 6V6z", 18));
      btnPrev.addEventListener("click", () => this.onSkipBackward());
      this.btnPlay = doc.createElement("button");
      this.btnPlay.type = "button";
      this.btnPlay.className = "aloud-btn aloud-btn-play";
      this.btnPlay.title = "Play / Pause";
      this.renderPlayIcon();
      this.btnPlay.addEventListener("click", () => this.onPlayPause());
      const btnNext = doc.createElement("button");
      btnNext.type = "button";
      btnNext.className = "aloud-btn";
      btnNext.title = "Next Sentence";
      btnNext.appendChild(createSvgIcon("M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z", 18));
      btnNext.addEventListener("click", () => this.onSkipForward());
      this.voiceSel = createVoiceSelector("en-US-female", (voiceId) => this.onVoiceChange(voiceId));
      this.speedCtrl = createSpeedController(1, (speed) => this.onSpeedChange(speed));
      const btnClose = doc.createElement("button");
      btnClose.type = "button";
      btnClose.className = "aloud-btn aloud-btn-close";
      btnClose.title = "Dismiss Player";
      btnClose.appendChild(createSvgIcon("M18 6L6 18M6 6l12 12", 16, true));
      btnClose.addEventListener("click", () => this.onClose());
      container.appendChild(btnPrev);
      container.appendChild(this.btnPlay);
      container.appendChild(btnNext);
      container.appendChild(this.voiceSel);
      container.appendChild(this.speedCtrl);
      container.appendChild(btnClose);
      this.shadow.appendChild(container);
      doc.body.appendChild(this.host);
    }
    renderPlayIcon() {
      if (!this.btnPlay) return;
      this.btnPlay.replaceChildren();
      if (this.status === PLAYBACK_STATUS.PLAYING) {
        this.btnPlay.appendChild(createSvgIcon("M6 19h4V5H6v14zm8-14v14h4V5h-4z", 22));
      } else {
        this.btnPlay.appendChild(createSvgIcon("M8 5v14l11-7z", 22));
      }
    }
    updateState(state = {}) {
      if (state.status) {
        this.status = state.status;
        this.renderPlayIcon();
      }
      if (state.speedRate && this.speedCtrl && this.speedCtrl.setSpeed) {
        this.speedCtrl.setSpeed(state.speedRate);
      }
      if (state.voiceId && this.voiceSel) {
        this.voiceSel.value = state.voiceId;
      }
    }
    destroy() {
      if (this.host && this.host.isConnected) {
        this.host.remove();
      }
      this.host = null;
      this.shadow = null;
    }
  };

  // src/background/audio-manager.js
  init_constants();

  // src/background/tts/neural-stream.js
  var TRUSTED_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
  var EDGE_WS_URL = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}`;
  function escapeXml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  function buildSsml(text, voiceName, rate = 1) {
    const percent = Math.round((rate - 1) * 100);
    const rateStr = percent >= 0 ? `+${percent}%` : `${percent}%`;
    return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voiceName}'><prosody rate='${rateStr}'>${escapeXml(text)}</prosody></voice></speak>`;
  }
  var NeuralStreamEngine = class {
    constructor() {
      this.audioElement = null;
      this.currentBlobUrl = null;
      this.isPlaying = false;
      this.isPaused = false;
      this.currentRate = 1;
      this.currentVoiceName = "en-US-JennyNeural";
      this.activeWs = null;
    }
    /**
     * Initializes audio element
     */
    async initialize() {
      if (typeof Audio !== "undefined") {
        this.audioElement = new Audio();
        this.audioElement.playbackRate = this.currentRate;
      }
    }
    /**
     * Generates Sec-MS-GEC DRM token for Edge TTS handshake.
     * @returns {Promise<string>}
     */
    async getSecMsGecToken() {
      try {
        const WIN_EPOCH = 11644473600n;
        let ticks = BigInt(Math.floor(Date.now() / 1e3)) + WIN_EPOCH;
        ticks = ticks - ticks % 300n;
        const ticks100ns = ticks * 10000000n;
        const strToHash = ticks100ns.toString() + TRUSTED_TOKEN;
        if (typeof crypto !== "undefined" && crypto.subtle) {
          const encoder = new TextEncoder();
          const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(strToHash));
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
        }
      } catch (e) {
      }
      return "";
    }
    /**
     * Fetches high-definition neural speech stream from Google Neural TTS.
     * @param {string} text
     * @param {string} dialect
     * @returns {Promise<Blob>}
     */
    async fetchGoogleTtsBlob(text, dialect = "en-US") {
      const tl = dialect.startsWith("en-IN") ? "en-IN" : dialect.startsWith("en-GB") ? "en-GB" : "en-US";
      const cleanText = text.slice(0, 200).trim();
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${tl}&q=${encodeURIComponent(cleanText)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Google TTS response status: ${res.status}`);
      const blob = await res.blob();
      if (!blob || blob.size === 0) throw new Error("Empty audio stream from Google TTS");
      return blob;
    }
    /**
     * Synthesizes text chunk into MP3 audio via Neural Stream or Edge WebSocket.
     * @param {string} text
     * @param {string} voiceName
     * @param {number} rate
     * @param {string} dialect
     * @returns {Promise<Blob>}
     */
    async synthesizeToBlob(text, voiceName, rate = 1, dialect = "en-US") {
      try {
        const blob = await this.fetchGoogleTtsBlob(text, dialect);
        if (blob && blob.size > 0) {
          return blob;
        }
      } catch (e) {
        console.warn("[SimpleAloud] Primary neural stream unavailable, attempting Edge WebSocket...", e);
      }
      return this.synthesizeEdgeWebSocket(text, voiceName, rate);
    }
    /**
     * Synthesizes text chunk into MP3 audio via Edge WebSocket.
     * @param {string} text
     * @param {string} voiceName
     * @param {number} rate
     * @returns {Promise<Blob>}
     */
    async synthesizeEdgeWebSocket(text, voiceName, rate = 1) {
      const gecToken = await this.getSecMsGecToken();
      const wsUrl = gecToken ? `${EDGE_WS_URL}&Sec-MS-GEC=${gecToken}&Sec-MS-GEC-Version=1-130.0.2849.68` : EDGE_WS_URL;
      return new Promise((resolve, reject) => {
        if (typeof WebSocket === "undefined") {
          return reject(new Error("WebSocket not available in this environment"));
        }
        let settled = false;
        const connectionTimeout = setTimeout(() => {
          if (!settled) {
            settled = true;
            if (ws) {
              try {
                ws.close();
              } catch (e) {
              }
            }
            reject(new Error("Neural TTS connection timeout"));
          }
        }, 4e3);
        const ws = new WebSocket(wsUrl);
        this.activeWs = ws;
        ws.binaryType = "arraybuffer";
        const audioChunks = [];
        const requestId = Math.random().toString(36).substring(2, 12);
        ws.onopen = () => {
          const configMessage = "Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n" + JSON.stringify({
            context: {
              synthesis: {
                audio: {
                  metadataoptions: {
                    sentenceBoundaryEnabled: "false",
                    wordBoundaryEnabled: "false"
                  },
                  outputFormat: "audio-24khz-48kbitrate-mono-mp3"
                }
              }
            }
          });
          ws.send(configMessage);
          const ssml = buildSsml(text, voiceName, rate);
          const ssmlMessage = `X-RequestId:${requestId}\r
Content-Type:application/ssml+xml\r
Path:ssml\r
\r
` + ssml;
          ws.send(ssmlMessage);
        };
        ws.onmessage = (event) => {
          if (typeof event.data === "string") {
            if (event.data.includes("Path:turn.end")) {
              if (!settled) {
                settled = true;
                clearTimeout(connectionTimeout);
                try {
                  ws.close();
                } catch (e) {
                }
                const fullBlob = new Blob(audioChunks, { type: "audio/mp3" });
                resolve(fullBlob);
              }
            }
          } else if (event.data instanceof ArrayBuffer) {
            const view = new DataView(event.data);
            const headerLength = view.getUint16(0);
            const audioData = event.data.slice(2 + headerLength);
            audioChunks.push(audioData);
          }
        };
        ws.onerror = (err) => {
          if (!settled) {
            settled = true;
            clearTimeout(connectionTimeout);
            reject(new Error("WebSocket error during neural TTS streaming"));
          }
        };
        ws.onclose = (event) => {
          if (!settled) {
            settled = true;
            clearTimeout(connectionTimeout);
            if (audioChunks.length > 0) {
              const fullBlob = new Blob(audioChunks, { type: "audio/mp3" });
              resolve(fullBlob);
            } else {
              reject(new Error(`Neural WebSocket closed without audio (code: ${event ? event.code : "unknown"})`));
            }
          }
        };
      });
    }
    /**
     * Speaks a chunk of text.
     * @param {string} text
     * @param {object} options
     */
    async speak(text, options = {}) {
      this.stop();
      const voiceName = options.serviceVoiceName || this.currentVoiceName;
      const rate = options.rate || this.currentRate;
      const dialect = options.dialect || options.profile?.dialect || "en-US";
      const blob = await this.synthesizeToBlob(text, voiceName, rate, dialect);
      if (!blob || blob.size === 0) {
        throw new Error("Empty audio stream received");
      }
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
      }
      this.currentBlobUrl = URL.createObjectURL(blob);
      if (!this.audioElement && typeof Audio !== "undefined") {
        this.audioElement = new Audio();
      }
      if (!this.audioElement) {
        if (options.onEnd) options.onEnd();
        return;
      }
      this.audioElement.src = this.currentBlobUrl;
      this.audioElement.playbackRate = rate;
      return new Promise((resolve, reject) => {
        this.audioElement.onended = () => {
          this.isPlaying = false;
          this.isPaused = false;
          if (options.onEnd) options.onEnd();
          resolve();
        };
        this.audioElement.onerror = (e) => {
          this.isPlaying = false;
          this.isPaused = false;
          if (options.onError) options.onError(e);
          reject(e);
        };
        this.audioElement.play().then(() => {
          this.isPlaying = true;
          this.isPaused = false;
        }).catch(reject);
      });
    }
    pause() {
      if (this.audioElement && this.isPlaying) {
        this.audioElement.pause();
        this.isPlaying = false;
        this.isPaused = true;
      }
    }
    resume() {
      if (this.audioElement && this.isPaused) {
        this.audioElement.play();
        this.isPlaying = true;
        this.isPaused = false;
      }
    }
    stop() {
      if (this.activeWs) {
        try {
          this.activeWs.close();
        } catch (e) {
        }
        this.activeWs = null;
      }
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      }
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
        this.currentBlobUrl = null;
      }
      this.isPlaying = false;
      this.isPaused = false;
    }
    setRate(rate) {
      this.currentRate = rate;
      if (this.audioElement) {
        this.audioElement.playbackRate = rate;
      }
    }
  };

  // src/background/tts/local-speech.js
  var LocalSpeechEngine = class {
    constructor() {
      this.synth = typeof window !== "undefined" && window.speechSynthesis || typeof globalThis !== "undefined" && globalThis.speechSynthesis || typeof self !== "undefined" && self.speechSynthesis || null;
      this.currentUtterance = null;
      this.availableVoices = [];
      this.currentRate = 1;
      this.isPlaying = false;
      this.isPaused = false;
    }
    /**
     * Initializes local voices
     */
    async initialize() {
      if (!this.synth) return [];
      return new Promise((resolve) => {
        const loadVoices = () => {
          try {
            const voices = this.synth.getVoices();
            if (voices && voices.length > 0) {
              this.availableVoices = voices;
              resolve(voices);
            }
          } catch (e) {
            resolve([]);
          }
        };
        loadVoices();
        if (this.synth.onvoiceschanged !== void 0) {
          this.synth.onvoiceschanged = () => loadVoices();
        }
        setTimeout(() => {
          try {
            this.availableVoices = this.synth.getVoices();
            resolve(this.availableVoices);
          } catch (e) {
            resolve([]);
          }
        }, 500);
      });
    }
    /**
     * Speaks a chunk using local SpeechSynthesisUtterance.
     * @param {string} text
     * @param {object} options
     */
    async speak(text, options = {}) {
      this.stop();
      if (!this.synth) {
        if (options.onEnd) options.onEnd();
        return;
      }
      try {
        if (this.synth.paused) {
          this.synth.resume();
        }
      } catch (e) {
      }
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      utterance.rate = options.rate || this.currentRate;
      if (options.profile) {
        if (!this.availableVoices || this.availableVoices.length === 0) {
          try {
            this.availableVoices = this.synth.getVoices();
          } catch (e) {
          }
        }
        const match = matchLocalFallbackVoice(options.profile, this.availableVoices);
        if (match) {
          utterance.voice = match;
          utterance.lang = match.lang;
        } else if (options.profile.locale) {
          utterance.lang = options.profile.locale;
        }
      }
      return new Promise((resolve, reject) => {
        let isDone = false;
        const finish = () => {
          if (isDone) return;
          isDone = true;
          this.isPlaying = false;
          this.isPaused = false;
          if (options.onEnd) options.onEnd();
          resolve();
        };
        utterance.onend = finish;
        utterance.onerror = (e) => {
          console.warn("[SimpleAloud] SpeechSynthesis error:", e);
          finish();
        };
        this.isPlaying = true;
        this.isPaused = false;
        try {
          this.synth.speak(utterance);
        } catch (e) {
          finish();
        }
      });
    }
    pause() {
      if (this.synth && this.isPlaying) {
        this.synth.pause();
        this.isPlaying = false;
        this.isPaused = true;
      }
    }
    resume() {
      if (this.synth && this.isPaused) {
        this.synth.resume();
        this.isPlaying = true;
        this.isPaused = false;
      }
    }
    stop() {
      if (this.synth) {
        this.synth.cancel();
      }
      this.currentUtterance = null;
      this.isPlaying = false;
      this.isPaused = false;
    }
    setRate(rate) {
      this.currentRate = rate;
    }
  };

  // src/background/tts/tts-factory.js
  var TtsFactory = class {
    constructor() {
      this.neuralEngine = new NeuralStreamEngine();
      this.localEngine = new LocalSpeechEngine();
      this.currentRate = 1;
      this.currentVoiceId = "en-US-female";
      this.isOfflineMode = false;
      this.activeEngine = null;
    }
    /**
     * Initializes both engines and preloads local voice lists.
     */
    async initialize() {
      await Promise.all([
        this.neuralEngine.initialize().catch(() => {
        }),
        this.localEngine.initialize().catch(() => {
        })
      ]);
      this.activeEngine = this.neuralEngine;
    }
    /**
     * Returns curated 6-voice profiles with runtime availability state.
     */
    getAvailableVoices() {
      return CURATED_VOICES.map((v) => ({
        ...v,
        isAvailable: true
      }));
    }
    /**
     * Speaks the text chunk using neural streaming, falling back to local synthesis on error.
     * @param {string} text
     * @param {object} options
     */
    async speak(text, options = {}) {
      const voiceId = options.voiceId || this.currentVoiceId;
      const profile = getVoiceById(voiceId);
      const rate = options.rate || this.currentRate;
      const isOffline = typeof navigator !== "undefined" && navigator.onLine === false;
      if (!isOffline && !this.isOfflineMode) {
        try {
          this.activeEngine = this.neuralEngine;
          await this.neuralEngine.speak(text, {
            serviceVoiceName: profile.serviceVoiceName,
            dialect: profile.dialect,
            profile,
            rate,
            onEnd: options.onEnd,
            onError: options.onError
          });
          return;
        } catch (err) {
          console.warn("[SimpleAloud] Neural TTS stream failed, falling back to local speech:", err);
          this.isOfflineMode = true;
        }
      }
      this.activeEngine = this.localEngine;
      await this.localEngine.speak(text, {
        profile,
        rate,
        onEnd: options.onEnd,
        onError: options.onError
      });
    }
    pause() {
      if (this.activeEngine) {
        this.activeEngine.pause();
      }
    }
    resume() {
      if (this.activeEngine) {
        this.activeEngine.resume();
      }
    }
    stop() {
      if (this.neuralEngine) this.neuralEngine.stop();
      if (this.localEngine) this.localEngine.stop();
    }
    setRate(rate) {
      this.currentRate = rate;
      this.neuralEngine.setRate(rate);
      this.localEngine.setRate(rate);
    }
    setVoice(voiceId) {
      this.currentVoiceId = voiceId;
    }
  };

  // src/background/audio-manager.js
  var AudioManager = class {
    constructor(options = {}) {
      this.ttsFactory = new TtsFactory();
      this.activeArticle = null;
      this.targetTabId = null;
      this.currentParagraphIndex = 0;
      this.currentSentenceIndex = 0;
      this.status = PLAYBACK_STATUS.IDLE;
      this.speedRate = 1;
      this.voiceId = "en-US-female";
      this.isInitialized = false;
      this.playbackToken = 0;
      this.onSentenceChange = options.onSentenceChange || null;
      this.onStateChange = options.onStateChange || null;
    }
    async initialize() {
      if (this.isInitialized) return;
      await this.ttsFactory.initialize();
      this.setupMediaSession();
      this.isInitialized = true;
    }
    setupMediaSession() {
      if (typeof navigator === "undefined" || !navigator.mediaSession) return;
      try {
        navigator.mediaSession.setActionHandler("play", () => this.resume());
        navigator.mediaSession.setActionHandler("pause", () => this.pause());
        navigator.mediaSession.setActionHandler("nexttrack", () => this.skipForward());
        navigator.mediaSession.setActionHandler("previoustrack", () => this.skipBackward());
        navigator.mediaSession.setActionHandler("stop", () => this.stop());
      } catch (e) {
        console.warn("[SimpleAloud] MediaSession action handlers not fully supported:", e);
      }
    }
    updateMediaSessionMetadata() {
      if (typeof navigator === "undefined" || !navigator.mediaSession || !this.activeArticle) return;
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.activeArticle.title || "Online Article",
          artist: this.activeArticle.byline || "Simple Aloud Reader",
          album: "Aloud Reading"
        });
      } catch (e) {
      }
    }
    /**
     * Loads a new article and begins playback.
     */
    async loadArticleAndPlay(tabId, article, settings = {}) {
      await this.initialize();
      this.stop();
      this.targetTabId = tabId;
      this.activeArticle = article;
      this.currentParagraphIndex = 0;
      this.currentSentenceIndex = 0;
      this.speedRate = settings.speedRate || this.speedRate;
      this.voiceId = settings.voiceId || this.voiceId;
      this.ttsFactory.setRate(this.speedRate);
      this.ttsFactory.setVoice(this.voiceId);
      this.updateMediaSessionMetadata();
      this.playCurrentSentence();
    }
    /**
     * Collects all sentences in article into a flat indexed list.
     */
    getAllSentences() {
      if (!this.activeArticle || !this.activeArticle.paragraphs) return [];
      const list = [];
      for (const p of this.activeArticle.paragraphs) {
        if (p.sentences) {
          for (const s of p.sentences) {
            list.push({ ...s, paragraphIndex: p.index });
          }
        }
      }
      return list;
    }
    async playCurrentSentence() {
      const allSentences = this.getAllSentences();
      if (this.currentSentenceIndex >= allSentences.length) {
        this.status = PLAYBACK_STATUS.STOPPED;
        this.broadcastState();
        return;
      }
      const currentItem = allSentences[this.currentSentenceIndex];
      this.currentParagraphIndex = currentItem.paragraphIndex;
      this.status = PLAYBACK_STATUS.PLAYING;
      this.broadcastState();
      if (this.onSentenceChange) {
        this.onSentenceChange(currentItem.paragraphIndex, currentItem.index, currentItem.globalIndex);
      }
      if (this.targetTabId) {
        sendMessageToTab(this.targetTabId, MESSAGE_TYPES.SENTENCE_PROGRESS, {
          paragraphIndex: currentItem.paragraphIndex,
          sentenceIndex: currentItem.index,
          globalIndex: currentItem.globalIndex
        }).catch(() => {
        });
      }
      const token = ++this.playbackToken;
      try {
        await this.ttsFactory.speak(currentItem.text, {
          voiceId: this.voiceId,
          rate: this.speedRate,
          onEnd: () => {
            if (token !== this.playbackToken) return;
            if (this.status === PLAYBACK_STATUS.PLAYING) {
              this.currentSentenceIndex++;
              this.playCurrentSentence();
            }
          },
          onError: (err) => {
            if (token !== this.playbackToken) return;
            console.error("[SimpleAloud] Speech error:", err);
          }
        });
      } catch (err) {
        if (token !== this.playbackToken) return;
        console.warn("[SimpleAloud] Sentence playback failed:", err);
      }
    }
    pause() {
      this.status = PLAYBACK_STATUS.PAUSED;
      this.ttsFactory.pause();
      this.broadcastState();
    }
    resume() {
      if (this.status === PLAYBACK_STATUS.PAUSED) {
        this.status = PLAYBACK_STATUS.PLAYING;
        this.ttsFactory.resume();
        this.broadcastState();
      } else if (this.status === PLAYBACK_STATUS.STOPPED || this.status === PLAYBACK_STATUS.IDLE) {
        this.playCurrentSentence();
      }
    }
    stop() {
      this.playbackToken++;
      this.status = PLAYBACK_STATUS.STOPPED;
      this.ttsFactory.stop();
      this.broadcastState();
    }
    seekToParagraph(paragraphIndex) {
      const allSentences = this.getAllSentences();
      const target = allSentences.find((s) => s.paragraphIndex === paragraphIndex);
      if (target) {
        this.currentSentenceIndex = target.globalIndex;
        this.currentParagraphIndex = paragraphIndex;
        this.ttsFactory.stop();
        this.playCurrentSentence();
      }
    }
    skipForward() {
      const allSentences = this.getAllSentences();
      if (this.currentSentenceIndex + 1 < allSentences.length) {
        this.currentSentenceIndex++;
        this.ttsFactory.stop();
        this.playCurrentSentence();
      }
    }
    skipBackward() {
      if (this.currentSentenceIndex > 0) {
        this.currentSentenceIndex--;
        this.ttsFactory.stop();
        this.playCurrentSentence();
      }
    }
    setSpeed(rate) {
      this.speedRate = rate;
      this.ttsFactory.setRate(rate);
      this.broadcastState();
      Promise.resolve().then(() => (init_storage(), storage_exports)).then(({ updateStoredSettings: updateStoredSettings2 }) => {
        updateStoredSettings2({ speedRate: rate }).catch(() => {
        });
      });
    }
    setVoice(voiceId) {
      this.voiceId = voiceId;
      this.ttsFactory.setVoice(voiceId);
      this.broadcastState();
      Promise.resolve().then(() => (init_storage(), storage_exports)).then(({ updateStoredSettings: updateStoredSettings2 }) => {
        updateStoredSettings2({ voiceId }).catch(() => {
        });
      });
      if (this.status === PLAYBACK_STATUS.PLAYING) {
        this.ttsFactory.stop();
        this.playCurrentSentence();
      }
    }
    getState() {
      return {
        status: this.status,
        currentParagraphIndex: this.currentParagraphIndex,
        currentSentenceIndex: this.currentSentenceIndex,
        speedRate: this.speedRate,
        voiceId: this.voiceId,
        articleTitle: this.activeArticle?.title || null
      };
    }
    broadcastState() {
      const state = this.getState();
      if (this.onStateChange) {
        this.onStateChange(state);
      }
      if (this.targetTabId) {
        sendMessageToTab(this.targetTabId, MESSAGE_TYPES.STATE_CHANGED, state).catch(() => {
        });
      }
    }
  };

  // src/content/content-script.js
  init_storage();
  console.log("[SimpleAloud] Content script active on:", window.location.href);
  var currentArticle = null;
  var highlighter = new SentenceHighlighter(document);
  var playerBar = null;
  var isDelegationAttached = false;
  var audioManager = new AudioManager({
    onSentenceChange: (paragraphIndex, sentenceIndex) => {
      highlighter.highlightSentence(paragraphIndex, sentenceIndex);
    },
    onStateChange: (state) => {
      if (playerBar) {
        playerBar.updateState(state);
      }
      sendMessageToBackground(MESSAGE_TYPES.STATE_CHANGED, state).catch(() => {
      });
    }
  });
  addMessageListener((message, sender, sendResponse) => {
    if (!message || !message.type) return;
    switch (message.type) {
      case MESSAGE_TYPES.READER_START:
        handleReaderStart();
        sendResponse({ received: true });
        return true;
      case MESSAGE_TYPES.PLAYER_COMMAND:
        if (message.payload) {
          handlePlayerCommand(message.payload);
        }
        sendResponse({ success: true });
        break;
      case MESSAGE_TYPES.PARAGRAPH_CLICKED:
        if (message.payload && typeof message.payload.paragraphIndex === "number") {
          audioManager.seekToParagraph(message.payload.paragraphIndex);
        }
        sendResponse({ success: true });
        break;
      case MESSAGE_TYPES.GET_STATE:
        sendResponse({ session: audioManager.getState() });
        break;
      default:
        break;
    }
  });
  function handlePlayerCommand(payload = {}) {
    const { action, value } = payload;
    switch (action) {
      case PLAYER_ACTIONS.PLAY:
      case PLAYER_ACTIONS.RESUME:
        audioManager.resume();
        break;
      case PLAYER_ACTIONS.PAUSE:
        audioManager.pause();
        break;
      case PLAYER_ACTIONS.STOP:
        audioManager.stop();
        highlighter.clear();
        if (playerBar) {
          playerBar.destroy();
          playerBar = null;
        }
        currentArticle = null;
        break;
      case PLAYER_ACTIONS.SKIP_FORWARD:
        audioManager.skipForward();
        break;
      case PLAYER_ACTIONS.SKIP_BACKWARD:
        audioManager.skipBackward();
        break;
      case PLAYER_ACTIONS.SET_SPEED:
        if (typeof value === "number") audioManager.setSpeed(value);
        break;
      case PLAYER_ACTIONS.SET_VOICE:
        if (typeof value === "string") audioManager.setVoice(value);
        break;
      default:
        break;
    }
  }
  function attachClickToSeek() {
    if (isDelegationAttached) return;
    isDelegationAttached = true;
    document.addEventListener("click", (e) => {
      if (!currentArticle) return;
      const targetSpan = e.target.closest(".simple-aloud-sentence");
      if (targetSpan) {
        const pIndex = parseInt(targetSpan.getAttribute("data-p-index"), 10);
        if (!isNaN(pIndex)) {
          audioManager.seekToParagraph(pIndex);
        }
      }
    });
  }
  async function handleReaderStart() {
    const result = extractArticleContent(document);
    if (!result.success || !result.article) {
      console.warn("[SimpleAloud] No article detected:", result.errorMessage);
      alert("Simple Aloud Reader: No readable article was detected on this page. Tip: Highlight text manually and click Read Aloud to narrate the selection.");
      return;
    }
    const segmentedParagraphs = segmentParagraphsIntoSentences(result.article.paragraphs);
    result.article.paragraphs = segmentedParagraphs;
    let totalSentences = 0;
    for (const p of segmentedParagraphs) {
      totalSentences += p.sentences ? p.sentences.length : 0;
    }
    result.article.totalSentences = totalSentences;
    currentArticle = result.article;
    if (!result.isSelection) {
      highlighter.attachToArticle(result.article);
      attachClickToSeek();
    }
    if (!playerBar) {
      playerBar = new PlayerBar({
        onPlayPause: () => {
          if (audioManager.status === PLAYBACK_STATUS.PLAYING) {
            audioManager.pause();
          } else {
            audioManager.resume();
          }
        },
        onSkipForward: () => {
          audioManager.skipForward();
        },
        onSkipBackward: () => {
          audioManager.skipBackward();
        },
        onVoiceChange: (voiceId) => {
          audioManager.setVoice(voiceId);
        },
        onSpeedChange: (speed) => {
          audioManager.setSpeed(speed);
        },
        onClose: () => {
          audioManager.stop();
          highlighter.clear();
          if (playerBar) {
            playerBar.destroy();
            playerBar = null;
          }
          currentArticle = null;
        }
      });
    }
    playerBar.mount(document);
    const settings = await getStoredSettings().catch(() => ({}));
    if (settings.voiceId && playerBar.voiceSel) {
      playerBar.voiceSel.value = settings.voiceId;
    }
    if (settings.speedRate && playerBar.speedCtrl) {
      playerBar.speedCtrl.textContent = `${settings.speedRate}x`;
    }
    await audioManager.loadArticleAndPlay(null, result.article, settings);
  }
})();
