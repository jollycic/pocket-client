var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
__export(exports, {
  PocketClient: () => PocketClient
});
var import_https = __toModule(require("https"));
var _performBasicActions, performBasicActions_fn, _buildRequest, buildRequest_fn, _logPocketError, logPocketError_fn, _updateRateLimitStatus, updateRateLimitStatus_fn;
var PocketClient = class {
  constructor({ consumer_key, token, logger }) {
    __privateAdd(this, _performBasicActions);
    __privateAdd(this, _buildRequest);
    __privateAdd(this, _logPocketError);
    __privateAdd(this, _updateRateLimitStatus);
    this.consumer_key = consumer_key;
    if (token) {
      this.access_token = token.access_token;
      this.username = token.username;
    }
    this.logger = logger != null ? logger : console;
    this.applicationRates = {
      limit: void 0,
      remaining: void 0,
      secondsToReset: void 0
    };
  }
  get host() {
    return "getpocket.com";
  }
  requestAuthentication(redirect_uri) {
    return new Promise((resolve) => {
      const { options, payload } = __privateMethod(this, _buildRequest, buildRequest_fn).call(this, "/v3/oauth/request", { redirect_uri });
      const req = (0, import_https.request)(options, (res) => {
        res.on("data", (data) => {
          if (res.statusCode === 200) {
            this.requestToken = JSON.parse(data);
            const { code } = this.requestToken;
            resolve(new URL(`https://${this.host}/auth/authorize?request_token=${code}&redirect_uri=${redirect_uri}`));
          } else {
            __privateMethod(this, _logPocketError, logPocketError_fn).call(this, res);
            resolve(null);
          }
        });
      });
      req.write(payload);
      req.on("error", (err) => {
        this.logger.error(err);
        resolve(null);
      });
      req.end();
    });
  }
  authorize() {
    const { code } = this.requestToken;
    return new Promise((resolve) => {
      const { options, payload } = __privateMethod(this, _buildRequest, buildRequest_fn).call(this, "/v3/oauth/authorize", { code });
      const req = (0, import_https.request)(options, (res) => {
        res.on("data", (data) => {
          if (res.statusCode === 200) {
            const accessToken = JSON.parse(data);
            this.access_token = accessToken.access_token;
            this.username = accessToken.username;
            resolve(accessToken);
          } else {
            __privateMethod(this, _logPocketError, logPocketError_fn).call(this, res);
            resolve(null);
          }
        });
      });
      req.on("error", (err) => {
        this.logger.error(err);
        resolve(null);
      });
      req.write(payload);
      req.end();
    });
  }
  add(article) {
    return new Promise((resolve) => {
      const { options, payload } = __privateMethod(this, _buildRequest, buildRequest_fn).call(this, "/v3/add", article);
      let contents = "";
      const req = (0, import_https.request)(options, (res) => {
        res.on("data", (data) => {
          if (res.statusCode === 200) {
            contents += data;
            __privateMethod(this, _updateRateLimitStatus, updateRateLimitStatus_fn).call(this, res);
          } else {
            __privateMethod(this, _logPocketError, logPocketError_fn).call(this, res);
            resolve(null);
          }
        });
        res.on("end", () => {
          const { item } = JSON.parse(contents);
          resolve(item);
        });
      });
      req.on("error", (err) => {
        this.logger.error(err);
        resolve(null);
      });
      req.write(payload);
      req.end();
    });
  }
  get(params, listOptions) {
    const DEFAULT_PARAMS = { detailType: "simple" };
    return new Promise((resolve) => {
      const { options, payload } = __privateMethod(this, _buildRequest, buildRequest_fn).call(this, "/v3/get", Object.assign({}, DEFAULT_PARAMS, params, listOptions));
      let contents = "";
      const req = (0, import_https.request)(options, (res) => {
        res.on("data", (data) => {
          if (res.statusCode === 200) {
            __privateMethod(this, _updateRateLimitStatus, updateRateLimitStatus_fn).call(this, res);
            contents += data;
          } else {
            __privateMethod(this, _logPocketError, logPocketError_fn).call(this, res);
            resolve(null);
          }
        });
        res.on("end", () => {
          const { list } = JSON.parse(contents);
          resolve(Object.keys(list).map((key) => {
            return list[key];
          }));
        });
      });
      req.on("error", (err) => {
        this.logger.error(err);
        resolve(null);
      });
      req.write(payload);
      req.end();
    });
  }
  getFavorites(params, listOptions) {
    const override = { favorite: 1 };
    return this.get(Object.assign({}, params, override), listOptions);
  }
  getAll(params, listOptions) {
    const override = { state: "all" };
    return this.get(Object.assign({}, params, override), listOptions);
  }
  getUnread(params, listOptions) {
    const override = { state: "unread" };
    return this.get(Object.assign({}, params, override), listOptions);
  }
  getArchive(params, listOptions) {
    const override = { state: "archive" };
    return this.get(Object.assign({}, params, override), listOptions);
  }
  getArticles(params, listOptions) {
    const override = { contentType: "article" };
    return this.get(Object.assign({}, params, override), listOptions);
  }
  getVideos(params, listOptions) {
    const override = { contentType: "video" };
    return this.get(Object.assign({}, params, override), listOptions);
  }
  getImages(params, listOptions) {
    const override = { contentType: "image" };
    return this.get(Object.assign({}, params, override), listOptions);
  }
  archive(items) {
    return __async(this, null, function* () {
      return yield __privateMethod(this, _performBasicActions, performBasicActions_fn).call(this, items.map((item_id) => ({
        action: "archive",
        item_id,
        time: new Date().getTime()
      })));
    });
  }
  readd(items) {
    return __async(this, null, function* () {
      return yield __privateMethod(this, _performBasicActions, performBasicActions_fn).call(this, items.map((item_id) => ({
        action: "readd",
        item_id,
        time: new Date().getTime()
      })));
    });
  }
  favorite(items) {
    return __async(this, null, function* () {
      return yield __privateMethod(this, _performBasicActions, performBasicActions_fn).call(this, items.map((item_id) => ({
        action: "favorite",
        item_id,
        time: new Date().getTime()
      })));
    });
  }
  unfavorite(items) {
    return __async(this, null, function* () {
      return yield __privateMethod(this, _performBasicActions, performBasicActions_fn).call(this, items.map((item_id) => ({
        action: "unfavorite",
        item_id,
        time: new Date().getTime()
      })));
    });
  }
  delete(items) {
    return __async(this, null, function* () {
      return yield __privateMethod(this, _performBasicActions, performBasicActions_fn).call(this, items.map((item_id) => ({
        action: "delete",
        item_id,
        time: new Date().getTime()
      })));
    });
  }
};
_performBasicActions = new WeakSet();
performBasicActions_fn = function(actions) {
  return new Promise((resolve) => {
    const { options, payload } = __privateMethod(this, _buildRequest, buildRequest_fn).call(this, "/v3/send", Object.assign({}, { actions }));
    let contents = "";
    const req = (0, import_https.request)(options, (res) => {
      res.on("data", (data) => {
        if (res.statusCode === 200) {
          __privateMethod(this, _updateRateLimitStatus, updateRateLimitStatus_fn).call(this, res);
          contents += data;
        } else {
          __privateMethod(this, _logPocketError, logPocketError_fn).call(this, res);
          resolve(null);
        }
      });
      res.on("end", () => {
        const results = JSON.parse(contents);
        resolve(actions.map((action, index) => {
          return Object.assign({}, action, {
            success: results.action_results[index],
            error: results.action_errors[index]
          });
        }));
      });
    });
    req.on("error", (err) => {
      this.logger.error(err);
      resolve(null);
    });
    req.write(payload);
    req.end();
  });
};
_buildRequest = new WeakSet();
buildRequest_fn = function(path, data) {
  if (typeof this.consumer_key === "string") {
    data.consumer_key = this.consumer_key;
  }
  if (typeof this.access_token === "string") {
    data.access_token = this.access_token;
  }
  const options = {
    host: this.host,
    method: "POST",
    port: 443,
    json: true,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Accept": "application/json"
    },
    path: path.startsWith("/") ? path : "/" + path
  };
  const payload = JSON.stringify(data);
  return { options, payload };
};
_logPocketError = new WeakSet();
logPocketError_fn = function(response) {
  this.logger.error(`${response.headers.status}
        Pocket Error ${response.headers["x-error-code"]}: ${response.headers["x-error"]}`);
};
_updateRateLimitStatus = new WeakSet();
updateRateLimitStatus_fn = function(response) {
  this.applicationRates.limit = parseInt(response.headers["x-limit-key-limit"]);
  this.applicationRates.remaining = parseInt(response.headers["x-limit-key-remaining"]);
  this.applicationRates.secondsToReset = parseInt(response.headers["x-limit-key-reset"]);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PocketClient
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi90eXBlcy5kLnRzXCIgLz5cblxuaW1wb3J0IHsgSW5jb21pbmdNZXNzYWdlIH0gZnJvbSAnaHR0cCdcbmltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdodHRwcydcblxuZXhwb3J0IGNsYXNzIFBvY2tldENsaWVudCBpbXBsZW1lbnRzIFBvY2tldEFQSSB7XG4gICAgLyoqIENyZWF0ZXMgYSBuZXcgW1BvY2tldF0oaHR0cHM6Ly9nZXRwb2NrZXQuY29tKSBBUEkgY2xpZW50ICovXG4gICAgY29uc3RydWN0b3IgKHsgY29uc3VtZXJfa2V5LCB0b2tlbiwgbG9nZ2VyIH0gOiBQb2NrZXRBUElDb25maWcpIHtcblxuICAgICAgICB0aGlzLmNvbnN1bWVyX2tleSA9IGNvbnN1bWVyX2tleVxuICAgICAgICBcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc190b2tlbiA9IHRva2VuLmFjY2Vzc190b2tlblxuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IHRva2VuLnVzZXJuYW1lXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlciA/PyBjb25zb2xlXG5cbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvblJhdGVzID0ge1xuICAgICAgICAgICAgbGltaXQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHJlbWFpbmluZzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc2Vjb25kc1RvUmVzZXQ6IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGhvc3QgKCkgeyByZXR1cm4gJ2dldHBvY2tldC5jb20nIH1cbiAgICBcbiAgICBjb25zdW1lcl9rZXk6IHN0cmluZ1xuICAgIGFjY2Vzc190b2tlbjogc3RyaW5nXG4gICAgdXNlcm5hbWU6IHN0cmluZ1xuICAgIHJlcXVlc3RUb2tlbjogUG9ja2V0UmVxdWVzdFRva2VuXG4gICAgbG9nZ2VyOiBDb25zb2xlXG4gICAgYXBwbGljYXRpb25SYXRlczogUG9ja2V0Q29uc3VtZXJLZXlSYXRlTGltaXRzXG5cbiAgICAvLyNyZWdpb24gQXV0aGVudGljYXRpb24gYW5kIGF1dGhvcml6YXRpb25cblxuICAgIHJlcXVlc3RBdXRoZW50aWNhdGlvbiAocmVkaXJlY3RfdXJpOiBzdHJpbmcpIDogUHJvbWlzZTxVUkw+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHBheWxvYWQgfSA9IHRoaXMuI2J1aWxkUmVxdWVzdCgnL3YzL29hdXRoL3JlcXVlc3QnLCB7IHJlZGlyZWN0X3VyaSB9KVxuXG4gICAgICAgICAgICBjb25zdCByZXEgPSByZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0VG9rZW4gPSBKU09OLnBhcnNlKGRhdGEpIGFzIFBvY2tldFJlcXVlc3RUb2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBjb2RlIH0gPSB0aGlzLnJlcXVlc3RUb2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgVVJMKGBodHRwczovLyR7dGhpcy5ob3N0fS9hdXRoL2F1dGhvcml6ZT9yZXF1ZXN0X3Rva2VuPSR7Y29kZX0mcmVkaXJlY3RfdXJpPSR7cmVkaXJlY3RfdXJpfWApKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jbG9nUG9ja2V0RXJyb3IocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS53cml0ZShwYXlsb2FkKVxuXG4gICAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycilcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEuZW5kKClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhdXRob3JpemUgKCkgOiBQcm9taXNlPFBvY2tldEFjY2Vzc1Rva2VuPiB7XG4gICAgICAgIGNvbnN0IHsgY29kZSB9ID0gdGhpcy5yZXF1ZXN0VG9rZW5cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucywgcGF5bG9hZCB9ID0gdGhpcy4jYnVpbGRSZXF1ZXN0KCcvdjMvb2F1dGgvYXV0aG9yaXplJywgeyBjb2RlIH0pXG4gICAgICAgICAgICBjb25zdCByZXEgPSByZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBKU09OLnBhcnNlKGRhdGEpIGFzIFBvY2tldEFjY2Vzc1Rva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuLmFjY2Vzc190b2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IGFjY2Vzc1Rva2VuLnVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFjY2Vzc1Rva2VuKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jbG9nUG9ja2V0RXJyb3IocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS53cml0ZShwYXlsb2FkKVxuXG4gICAgICAgICAgICByZXEuZW5kKClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyNlbmRyZWdpb25cblxuICAgIC8vI3JlZ2lvbiBodHRwczovL2dldHBvY2tldC5jb20vdjMvYWRkXG5cbiAgICBhZGQgKGFydGljbGU6IFBvY2tldEl0ZW1Ub0FkZCkgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcHRpb25zLCBwYXlsb2FkIH0gPSB0aGlzLiNidWlsZFJlcXVlc3QoJy92My9hZGQnLCBhcnRpY2xlKVxuICAgICAgICAgICAgbGV0IGNvbnRlbnRzID0gJydcbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IHJlcXVlc3Qob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cyArPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiN1cGRhdGVSYXRlTGltaXRTdGF0dXMocmVzKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jbG9nUG9ja2V0RXJyb3IocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXMub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBpdGVtIH0gPSBKU09OLnBhcnNlKGNvbnRlbnRzKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGl0ZW0gYXMgUG9ja2V0TGlzdEl0ZW0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgXG4gICAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycilcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEud3JpdGUocGF5bG9hZClcbiAgICBcbiAgICAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vI2VuZHJlZ2lvblxuXG4gICAgLy8jcmVnaW9uIGh0dHBzOi8vZ2V0cG9ja2V0LmNvbS92My9nZXRcblxuICAgIGdldCAocGFyYW1zOiBQb2NrZXRHZXRQYXJhbXMsIGxpc3RPcHRpb25zPzogUG9ja2V0TGlzdE9wdGlvbnMpIDogUHJvbWlzZTxQb2NrZXRMaXN0SXRlbVtdPiB7XG4gICAgICAgIGNvbnN0IERFRkFVTFRfUEFSQU1TIDogUG9ja2V0R2V0UGFyYW1zID0geyBkZXRhaWxUeXBlOiAnc2ltcGxlJyB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHBheWxvYWQgfSA9IHRoaXMuI2J1aWxkUmVxdWVzdCgnL3YzL2dldCcsIE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfUEFSQU1TLCBwYXJhbXMsIGxpc3RPcHRpb25zKSlcbiAgICAgICAgICAgIGxldCBjb250ZW50cyA9ICcnXG4gICAgICAgICAgICBjb25zdCByZXEgPSByZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jdXBkYXRlUmF0ZUxpbWl0U3RhdHVzKHJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzICs9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2xvZ1BvY2tldEVycm9yKHJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICByZXMub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBsaXN0IH0gPSBKU09OLnBhcnNlKGNvbnRlbnRzKVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoT2JqZWN0LmtleXMobGlzdCkubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0W2tleV1cbiAgICAgICAgICAgICAgICAgICAgfSkgYXMgUG9ja2V0TGlzdEl0ZW1bXSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLndyaXRlKHBheWxvYWQpXG4gICAgXG4gICAgICAgICAgICByZXEuZW5kKClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBnZXRGYXZvcml0ZXMgKHBhcmFtczogUG9ja2V0R2V0UGFyYW1zLCBsaXN0T3B0aW9ucz86IFBvY2tldExpc3RPcHRpb25zKSA6IFByb21pc2UgPFBvY2tldExpc3RJdGVtW10+IHtcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGU6IFBvY2tldEdldFBhcmFtcyA9IHsgZmF2b3JpdGU6IDEgfSBcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KE9iamVjdC5hc3NpZ24oe30sIHBhcmFtcywgb3ZlcnJpZGUpLCBsaXN0T3B0aW9ucylcbiAgICB9XG5cbiAgICBnZXRBbGwgKHBhcmFtczogUG9ja2V0R2V0UGFyYW1zLCBsaXN0T3B0aW9uczogUG9ja2V0TGlzdE9wdGlvbnMpIDogUHJvbWlzZTxQb2NrZXRMaXN0SXRlbVtdPiB7XG4gICAgICAgIGNvbnN0IG92ZXJyaWRlOiBQb2NrZXRHZXRQYXJhbXMgPSB7IHN0YXRlOiAnYWxsJyB9IFxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zLCBvdmVycmlkZSksIGxpc3RPcHRpb25zKVxuICAgIH1cblxuICAgIGdldFVucmVhZCAocGFyYW1zOiBQb2NrZXRHZXRQYXJhbXMsIGxpc3RPcHRpb25zOiBQb2NrZXRMaXN0T3B0aW9ucykgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtW10+IHtcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGU6IFBvY2tldEdldFBhcmFtcyA9IHsgc3RhdGU6ICd1bnJlYWQnIH0gXG4gICAgICAgIHJldHVybiB0aGlzLmdldChPYmplY3QuYXNzaWduKHt9LCBwYXJhbXMsIG92ZXJyaWRlKSwgbGlzdE9wdGlvbnMpXG4gICAgfVxuXG4gICAgZ2V0QXJjaGl2ZSAocGFyYW1zOiBQb2NrZXRHZXRQYXJhbXMsIGxpc3RPcHRpb25zOiBQb2NrZXRMaXN0T3B0aW9ucykgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtW10+IHtcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGU6IFBvY2tldEdldFBhcmFtcyA9IHsgc3RhdGU6ICdhcmNoaXZlJyB9IFxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zLCBvdmVycmlkZSksIGxpc3RPcHRpb25zKVxuICAgIH1cblxuICAgIGdldEFydGljbGVzIChwYXJhbXM6IFBvY2tldEdldFBhcmFtcywgbGlzdE9wdGlvbnM6IFBvY2tldExpc3RPcHRpb25zKSA6IFByb21pc2U8UG9ja2V0TGlzdEl0ZW1bXT4ge1xuICAgICAgICBjb25zdCBvdmVycmlkZTogUG9ja2V0R2V0UGFyYW1zID0geyBjb250ZW50VHlwZTogJ2FydGljbGUnIH0gXG4gICAgICAgIHJldHVybiB0aGlzLmdldChPYmplY3QuYXNzaWduKHt9LCBwYXJhbXMsIG92ZXJyaWRlKSwgbGlzdE9wdGlvbnMpXG4gICAgfVxuXG4gICAgZ2V0VmlkZW9zIChwYXJhbXM6IFBvY2tldEdldFBhcmFtcywgbGlzdE9wdGlvbnM6IFBvY2tldExpc3RPcHRpb25zKSA6IFByb21pc2U8UG9ja2V0TGlzdEl0ZW1bXT4ge1xuICAgICAgICBjb25zdCBvdmVycmlkZTogUG9ja2V0R2V0UGFyYW1zID0geyBjb250ZW50VHlwZTogJ3ZpZGVvJyB9IFxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zLCBvdmVycmlkZSksIGxpc3RPcHRpb25zKVxuICAgIH1cblxuICAgIGdldEltYWdlcyAocGFyYW1zOiBQb2NrZXRHZXRQYXJhbXMsIGxpc3RPcHRpb25zOiBQb2NrZXRMaXN0T3B0aW9ucykgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtW10+IHtcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGU6IFBvY2tldEdldFBhcmFtcyA9IHsgY29udGVudFR5cGU6ICdpbWFnZScgfSBcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KE9iamVjdC5hc3NpZ24oe30sIHBhcmFtcywgb3ZlcnJpZGUpLCBsaXN0T3B0aW9ucylcbiAgICB9XG5cbiAgICAvLyNlbmRyZWdpb25cblxuICAgICNwZXJmb3JtQmFzaWNBY3Rpb25zIChhY3Rpb25zOiBvYmplY3RbXSkgOiBQcm9taXNlPFBvY2tldEJhc2ljQWN0aW9uUmVzdWx0W10+IHtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHBheWxvYWQgfSA9IHRoaXMuI2J1aWxkUmVxdWVzdCgnL3YzL3NlbmQnLCBPYmplY3QuYXNzaWduKHt9LCB7IGFjdGlvbnMgfSkpXG4gICAgICAgICAgICBsZXQgY29udGVudHMgPSAnJ1xuICAgICAgICAgICAgY29uc3QgcmVxID0gcmVxdWVzdChvcHRpb25zLCAocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI3VwZGF0ZVJhdGVMaW1pdFN0YXR1cyhyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cyArPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNsb2dQb2NrZXRFcnJvcihyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBKU09OLnBhcnNlKGNvbnRlbnRzKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFjdGlvbnMubWFwKChhY3Rpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYWN0aW9uLCB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlc3VsdHMuYWN0aW9uX3Jlc3VsdHNbaW5kZXhdLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogIHJlc3VsdHMuYWN0aW9uX2Vycm9yc1tpbmRleF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSBhcyBQb2NrZXRCYXNpY0FjdGlvblJlc3VsdFxuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLndyaXRlKHBheWxvYWQpXG4gICAgXG4gICAgICAgICAgICByZXEuZW5kKClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhc3luYyBhcmNoaXZlIChpdGVtczogbnVtYmVyW10pIDogUHJvbWlzZTxQb2NrZXRCYXNpY0FjdGlvblJlc3VsdFtdPiB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLiNwZXJmb3JtQmFzaWNBY3Rpb25zKGl0ZW1zLm1hcCgoaXRlbV9pZCkgPT4gKHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2FyY2hpdmUnLFxuICAgICAgICAgICAgaXRlbV9pZCxcbiAgICAgICAgICAgIHRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgICAgIH0pKSlcbiAgICB9XG5cbiAgICBhc3luYyByZWFkZCAoaXRlbXM6IG51bWJlcltdKSA6IFByb21pc2U8UG9ja2V0QmFzaWNBY3Rpb25SZXN1bHRbXT4ge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy4jcGVyZm9ybUJhc2ljQWN0aW9ucyhpdGVtcy5tYXAoKGl0ZW1faWQpID0+ICh7XG4gICAgICAgICAgICBhY3Rpb246ICdyZWFkZCcsXG4gICAgICAgICAgICBpdGVtX2lkLFxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgfSkpKVxuICAgIH1cblxuICAgIGFzeW5jIGZhdm9yaXRlIChpdGVtczogbnVtYmVyW10pIDogUHJvbWlzZTxQb2NrZXRCYXNpY0FjdGlvblJlc3VsdFtdPiB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLiNwZXJmb3JtQmFzaWNBY3Rpb25zKGl0ZW1zLm1hcCgoaXRlbV9pZCkgPT4gKHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2Zhdm9yaXRlJyxcbiAgICAgICAgICAgIGl0ZW1faWQsXG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICB9KSkpXG4gICAgfVxuXG4gICAgYXN5bmMgdW5mYXZvcml0ZSAoaXRlbXM6IG51bWJlcltdKSA6IFByb21pc2U8UG9ja2V0QmFzaWNBY3Rpb25SZXN1bHRbXT4ge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy4jcGVyZm9ybUJhc2ljQWN0aW9ucyhpdGVtcy5tYXAoKGl0ZW1faWQpID0+ICh7XG4gICAgICAgICAgICBhY3Rpb246ICd1bmZhdm9yaXRlJyxcbiAgICAgICAgICAgIGl0ZW1faWQsXG4gICAgICAgICAgICB0aW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICB9KSkpXG4gICAgfVxuXG4gICAgYXN5bmMgZGVsZXRlIChpdGVtczogbnVtYmVyW10pIDogUHJvbWlzZTxQb2NrZXRCYXNpY0FjdGlvblJlc3VsdFtdPiB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLiNwZXJmb3JtQmFzaWNBY3Rpb25zKGl0ZW1zLm1hcCgoaXRlbV9pZCkgPT4gKHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2RlbGV0ZScsXG4gICAgICAgICAgICBpdGVtX2lkLFxuICAgICAgICAgICAgdGltZTogbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgfSkpKVxuICAgIH1cbiAgICBcbiAgICAvLyNyZWdpb24gUHJpdmF0ZSBtZXRob2RzXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZSBCdWlsZHMgdGhlIG9wdGlvbnMgYW5kIHRoZSBzZXJpYWxpemVkIHBheWxvYWQgdG8gcGVyZm9ybSBhIHZhbGlkIEpTT04gcmVxdWVzdFxuICAgICAqIHRvIHRoZSBQb2NrZXQgQVBJXG4gICAgICogQHBhcmFtIHBhdGggUG9ja2V0IEFQSSBlbmRwb2ludFxuICAgICAqIEBwYXJhbSBkYXRhIFBheWxvYWQgdG8gUE9TVFxuICAgICAqIEByZXR1cm5zIG9wdGlvbnMgYW5kIHBheWxvYWQgZm9yIHRoZSBBUEkgUmVxdWVzdFxuICAgICAqIFxuICAgICAqL1xuICAgICAjYnVpbGRSZXF1ZXN0IChwYXRoOiBzdHJpbmcsIGRhdGE6IGFueSkgOiBQb2NrZXRSZXF1ZXN0RGF0YSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb25zdW1lcl9rZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhLmNvbnN1bWVyX2tleSA9IHRoaXMuY29uc3VtZXJfa2V5XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYWNjZXNzX3Rva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YS5hY2Nlc3NfdG9rZW4gPSB0aGlzLmFjY2Vzc190b2tlblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaG9zdDogdGhpcy5ob3N0LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCcsXG4gICAgICAgICAgICAgICAgJ1gtQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF0aDogcGF0aC5zdGFydHNXaXRoKCcvJykgPyBwYXRoIDogJy8nICsgcGF0aCxcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuXG4gICAgICAgIHJldHVybiB7IG9wdGlvbnMsIHBheWxvYWQgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlIExvZ3MgdGhlIHJlbGV2YW50IGluZm9ybWF0aW9uIGFib3V0IGFuIGVycm9yIGZyb20gdGhlIGhlYWRlcnMgXG4gICAgICogaW4gdGhlIHJlc3BvbnNlIG1lc3NhZ2UgZnJvbSB0aGUgUG9ja2V0IEFQSS4gU2VlIGh0dHBzOi8vZ2V0Y29tL2RldmVsb3Blci9kb2NzL2Vycm9yc1xuICAgICAqIEBwYXJhbSByZXNwb25zZSBIVFRQUyByZXNwb25zZSBtZXNzYWdlIGZyb20gdGhlIFBvY2tldCBBUElcbiAgICAgKi9cbiAgICAjbG9nUG9ja2V0RXJyb3IgKHJlc3BvbnNlOiBJbmNvbWluZ01lc3NhZ2UpIDogdm9pZCB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGAke3Jlc3BvbnNlLmhlYWRlcnMuc3RhdHVzfVxuICAgICAgICBQb2NrZXQgRXJyb3IgJHtyZXNwb25zZS5oZWFkZXJzWyd4LWVycm9yLWNvZGUnXX06ICR7cmVzcG9uc2UuaGVhZGVyc1sneC1lcnJvciddfWApXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGUgU3RvcmVzIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IFtyYXRlIGxpbWl0XShodHRwczovL2dldHBvY2tldC5jb20vZGV2ZWxvcGVyL2RvY3MvcmF0ZS1saW1pdHMpIFxuICAgICAqIG9mIHRoZSBhcHBsaWNhdGlvbiBmcm9tIHRoZSBoZWFkZXJzXG4gICAgICogQHBhcmFtIHJlc3BvbnNlIEhUVFBTIHJlc3BvbnNlIG1lc3NhZ2UgZnJvbSB0aGUgUG9ja2V0IEFQSVxuICAgICAqL1xuICAgICN1cGRhdGVSYXRlTGltaXRTdGF0dXMgKHJlc3BvbnNlOiBJbmNvbWluZ01lc3NhZ2UpIDogdm9pZCB7ICAgICAgIFxuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uUmF0ZXMubGltaXQgPSBwYXJzZUludChyZXNwb25zZS5oZWFkZXJzWyd4LWxpbWl0LWtleS1saW1pdCddIGFzIHN0cmluZylcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvblJhdGVzLnJlbWFpbmluZyA9IHBhcnNlSW50KHJlc3BvbnNlLmhlYWRlcnNbJ3gtbGltaXQta2V5LXJlbWFpbmluZyddIGFzIHN0cmluZylcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvblJhdGVzLnNlY29uZHNUb1Jlc2V0ID0gcGFyc2VJbnQocmVzcG9uc2UuaGVhZGVyc1sneC1saW1pdC1rZXktcmVzZXQnXSBhcyBzdHJpbmcpXG4gICAgfVxuICAgIC8vI2VuZHJlZ2lvblxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUdBLG1CQUF3QjtBQUh4QjtBQUtPLHlCQUF3QztBQUFBLEVBRTNDLFlBQWEsRUFBRSxjQUFjLE9BQU8sVUFBNEI7QUF5TWhFO0FBeUZDO0FBK0JEO0FBVUE7QUF6VUksU0FBSyxlQUFlO0FBRXBCLFFBQUksT0FBTztBQUNQLFdBQUssZUFBZSxNQUFNO0FBQzFCLFdBQUssV0FBVyxNQUFNO0FBQUE7QUFHMUIsU0FBSyxTQUFTLDBCQUFVO0FBRXhCLFNBQUssbUJBQW1CO0FBQUEs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
