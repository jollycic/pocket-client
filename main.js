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

// main.ts
__export(exports, {
  PocketClient: () => PocketClient
});
var import_https = __toModule(require("https"));
var _buildRequest, buildRequest_fn, _logPocketError, logPocketError_fn;
var PocketClient = class {
  constructor({ consumer_key, token, logger }) {
    __privateAdd(this, _buildRequest);
    __privateAdd(this, _logPocketError);
    this.consumer_key = consumer_key;
    if (token) {
      this.access_token = token.access_token;
      this.username = token.username;
    }
    this.logger = logger != null ? logger : console;
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
    const DEFAULT_PARAMS = {
      detailType: "simple"
    };
    return new Promise((resolve) => {
      const { options, payload } = __privateMethod(this, _buildRequest, buildRequest_fn).call(this, "/v3/get", Object.assign({}, DEFAULT_PARAMS, params, listOptions));
      let contents = "";
      const req = (0, import_https.request)(options, (res) => {
        res.on("data", (data) => {
          if (res.statusCode === 200) {
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
    const defaults = { favorite: 1 };
    return this.get(Object.assign({}, params, defaults), listOptions);
  }
  getUnread(params, listOptions) {
    const defaults = { state: "unread" };
    return this.get(Object.assign({}, params, defaults), listOptions);
  }
  getArchive(params, listOptions) {
    const defaults = { state: "archive" };
    return this.get(Object.assign({}, params, defaults), listOptions);
  }
  getArticles(params, listOptions) {
    const defaults = { contentType: "article" };
    return this.get(Object.assign({}, params, defaults), listOptions);
  }
  getVideos(params, listOptions) {
    const defaults = { contentType: "video" };
    return this.get(Object.assign({}, params, defaults), listOptions);
  }
  getImages(params, listOptions) {
    const defaults = { contentType: "image" };
    return this.get(Object.assign({}, params, defaults), listOptions);
  }
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PocketClient
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi90eXBlcy5kLnRzXCIgLz5cblxuaW1wb3J0IHsgSW5jb21pbmdNZXNzYWdlIH0gZnJvbSAnaHR0cCdcbmltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdodHRwcydcblxuZXhwb3J0IGNsYXNzIFBvY2tldENsaWVudCBpbXBsZW1lbnRzIFBvY2tldEFQSSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBQb2NrZXQgKGh0dHBzOi8vZ2V0cG9ja2V0LmNvbSkgQVBJIGNsaWVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh7IGNvbnN1bWVyX2tleSwgdG9rZW4sIGxvZ2dlciB9IDogUG9ja2V0QVBJQ29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy5jb25zdW1lcl9rZXkgPSBjb25zdW1lcl9rZXlcbiAgICAgICAgXG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NfdG9rZW4gPSB0b2tlbi5hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSB0b2tlbi51c2VybmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXIgPz8gY29uc29sZVxuICAgIH1cblxuICAgIGdldCBob3N0ICgpIHsgcmV0dXJuICdnZXRwb2NrZXQuY29tJyB9XG4gICAgXG4gICAgY29uc3VtZXJfa2V5OiBzdHJpbmdcbiAgICBhY2Nlc3NfdG9rZW46IHN0cmluZ1xuICAgIHVzZXJuYW1lOiBzdHJpbmdcbiAgICByZXF1ZXN0VG9rZW46IFBvY2tldFJlcXVlc3RUb2tlblxuICAgIGxvZ2dlcjogQ29uc29sZVxuXG4gICAgcmVxdWVzdEF1dGhlbnRpY2F0aW9uIChyZWRpcmVjdF91cmk6IHN0cmluZykgOiBQcm9taXNlPFVSTD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucywgcGF5bG9hZCB9ID0gdGhpcy4jYnVpbGRSZXF1ZXN0KCcvdjMvb2F1dGgvcmVxdWVzdCcsIHsgcmVkaXJlY3RfdXJpIH0pXG5cbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IHJlcXVlc3Qob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RUb2tlbiA9IEpTT04ucGFyc2UoZGF0YSkgYXMgUG9ja2V0UmVxdWVzdFRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGNvZGUgfSA9IHRoaXMucmVxdWVzdFRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBVUkwoYGh0dHBzOi8vJHt0aGlzLmhvc3R9L2F1dGgvYXV0aG9yaXplP3JlcXVlc3RfdG9rZW49JHtjb2RlfSZyZWRpcmVjdF91cmk9JHtyZWRpcmVjdF91cml9YCkpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNsb2dQb2NrZXRFcnJvcihyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLndyaXRlKHBheWxvYWQpXG5cbiAgICAgICAgICAgIHJlcS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGF1dGhvcml6ZSAoKSA6IFByb21pc2U8UG9ja2V0QWNjZXNzVG9rZW4+IHtcbiAgICAgICAgY29uc3QgeyBjb2RlIH0gPSB0aGlzLnJlcXVlc3RUb2tlblxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcHRpb25zLCBwYXlsb2FkIH0gPSB0aGlzLiNidWlsZFJlcXVlc3QoJy92My9vYXV0aC9hdXRob3JpemUnLCB7IGNvZGUgfSlcbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IHJlcXVlc3Qob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IEpTT04ucGFyc2UoZGF0YSkgYXMgUG9ja2V0QWNjZXNzVG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWNjZXNzX3Rva2VuID0gYWNjZXNzVG9rZW4uYWNjZXNzX3Rva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJuYW1lID0gYWNjZXNzVG9rZW4udXNlcm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYWNjZXNzVG9rZW4pXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNsb2dQb2NrZXRFcnJvcihyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLndyaXRlKHBheWxvYWQpXG5cbiAgICAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFkZCAoYXJ0aWNsZTogUG9ja2V0QWRkYWJsZSkgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcHRpb25zLCBwYXlsb2FkIH0gPSB0aGlzLiNidWlsZFJlcXVlc3QoJy92My9hZGQnLCBhcnRpY2xlKVxuICAgICAgICAgICAgbGV0IGNvbnRlbnRzID0gJydcbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IHJlcXVlc3Qob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cyArPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNsb2dQb2NrZXRFcnJvcihyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlcy5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGl0ZW0gfSA9IEpTT04ucGFyc2UoY29udGVudHMpXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaXRlbSBhcyBQb2NrZXRMaXN0SXRlbSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICBcbiAgICAgICAgICAgIHJlcS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS53cml0ZShwYXlsb2FkKVxuICAgIFxuICAgICAgICAgICAgcmVxLmVuZCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ2V0IChwYXJhbXM6IFBvY2tldEdldFBhcmFtcywgbGlzdE9wdGlvbnM/OiBQb2NrZXRMaXN0T3B0aW9ucykgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtW10+IHtcbiAgICAgICAgY29uc3QgREVGQVVMVF9QQVJBTVMgOiBQb2NrZXRHZXRQYXJhbXMgPSB7XG4gICAgICAgICAgICBkZXRhaWxUeXBlOiAnc2ltcGxlJ1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHBheWxvYWQgfSA9IHRoaXMuI2J1aWxkUmVxdWVzdCgnL3YzL2dldCcsIE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfUEFSQU1TLCBwYXJhbXMsIGxpc3RPcHRpb25zKSlcbiAgICAgICAgICAgIGxldCBjb250ZW50cyA9ICcnXG4gICAgICAgICAgICBjb25zdCByZXEgPSByZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudHMgKz0gZGF0YVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jbG9nUG9ja2V0RXJyb3IocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIHJlcy5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGxpc3QgfSA9IEpTT04ucGFyc2UoY29udGVudHMpXG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShPYmplY3Qua2V5cyhsaXN0KS5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3Rba2V5XVxuICAgICAgICAgICAgICAgICAgICB9KSBhcyBQb2NrZXRMaXN0SXRlbVtdKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycilcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEud3JpdGUocGF5bG9hZClcbiAgICBcbiAgICAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGdldEZhdm9yaXRlcyAocGFyYW1zOiBQb2NrZXRHZXRQYXJhbXMsIGxpc3RPcHRpb25zPzogUG9ja2V0TGlzdE9wdGlvbnMpIDogUHJvbWlzZSA8UG9ja2V0TGlzdEl0ZW1bXT4ge1xuICAgICAgICBjb25zdCBkZWZhdWx0czogUG9ja2V0R2V0UGFyYW1zID0geyBmYXZvcml0ZTogMSB9IFxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zLCBkZWZhdWx0cyksIGxpc3RPcHRpb25zKVxuICAgIH1cblxuICAgIGdldFVucmVhZCAocGFyYW1zOiBQb2NrZXRHZXRQYXJhbXMsIGxpc3RPcHRpb25zOiBQb2NrZXRMaXN0T3B0aW9ucykgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtW10+IHtcbiAgICAgICAgY29uc3QgZGVmYXVsdHM6IFBvY2tldEdldFBhcmFtcyA9IHsgc3RhdGU6ICd1bnJlYWQnIH0gXG4gICAgICAgIHJldHVybiB0aGlzLmdldChPYmplY3QuYXNzaWduKHt9LCBwYXJhbXMsIGRlZmF1bHRzKSwgbGlzdE9wdGlvbnMpXG4gICAgfVxuXG4gICAgZ2V0QXJjaGl2ZSAocGFyYW1zOiBQb2NrZXRHZXRQYXJhbXMsIGxpc3RPcHRpb25zOiBQb2NrZXRMaXN0T3B0aW9ucykgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtW10+IHtcbiAgICAgICAgY29uc3QgZGVmYXVsdHM6IFBvY2tldEdldFBhcmFtcyA9IHsgc3RhdGU6ICdhcmNoaXZlJyB9IFxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zLCBkZWZhdWx0cyksIGxpc3RPcHRpb25zKVxuICAgIH1cblxuICAgIGdldEFydGljbGVzIChwYXJhbXM6IFBvY2tldEdldFBhcmFtcywgbGlzdE9wdGlvbnM6IFBvY2tldExpc3RPcHRpb25zKSA6IFByb21pc2U8UG9ja2V0TGlzdEl0ZW1bXT4ge1xuICAgICAgICBjb25zdCBkZWZhdWx0czogUG9ja2V0R2V0UGFyYW1zID0geyBjb250ZW50VHlwZTogJ2FydGljbGUnIH0gXG4gICAgICAgIHJldHVybiB0aGlzLmdldChPYmplY3QuYXNzaWduKHt9LCBwYXJhbXMsIGRlZmF1bHRzKSwgbGlzdE9wdGlvbnMpXG4gICAgfVxuXG4gICAgZ2V0VmlkZW9zIChwYXJhbXM6IFBvY2tldEdldFBhcmFtcywgbGlzdE9wdGlvbnM6IFBvY2tldExpc3RPcHRpb25zKSA6IFByb21pc2U8UG9ja2V0TGlzdEl0ZW1bXT4ge1xuICAgICAgICBjb25zdCBkZWZhdWx0czogUG9ja2V0R2V0UGFyYW1zID0geyBjb250ZW50VHlwZTogJ3ZpZGVvJyB9IFxuICAgICAgICByZXR1cm4gdGhpcy5nZXQoT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zLCBkZWZhdWx0cyksIGxpc3RPcHRpb25zKVxuICAgIH1cblxuICAgIGdldEltYWdlcyAocGFyYW1zOiBQb2NrZXRHZXRQYXJhbXMsIGxpc3RPcHRpb25zOiBQb2NrZXRMaXN0T3B0aW9ucykgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtW10+IHtcbiAgICAgICAgY29uc3QgZGVmYXVsdHM6IFBvY2tldEdldFBhcmFtcyA9IHsgY29udGVudFR5cGU6ICdpbWFnZScgfSBcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KE9iamVjdC5hc3NpZ24oe30sIHBhcmFtcywgZGVmYXVsdHMpLCBsaXN0T3B0aW9ucylcbiAgICB9XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQUklWQVRFIE1FVEhPRFMgLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlIEJ1aWxkcyB0aGUgb3B0aW9ucyBhbmQgdGhlIHBheWxvYWQgdG8gcGVyZm9ybSBhIHZhbGlkIEpTT04gcmVxdWVzdFxuICAgICAqIHRvIHRoZSBQb2NrZXQgQVBJXG4gICAgICogQHBhcmFtIHBhdGggUG9ja2V0IEFQSSBlbmRwb2ludFxuICAgICAqIEBwYXJhbSBkYXRhIFBheWxvYWQgdG8gUE9TVFxuICAgICAqIEByZXR1cm5zIG9wdGlvbnMgYW5kIHBheWxvYWQgZm9yIHRoZSBBUEkgUmVxdWVzdFxuICAgICAqIFxuICAgICAqL1xuICAgICAjYnVpbGRSZXF1ZXN0IChwYXRoOiBzdHJpbmcsIGRhdGE6IGFueSkgOiBQb2NrZXRSZXF1ZXN0RGF0YSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb25zdW1lcl9rZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhLmNvbnN1bWVyX2tleSA9IHRoaXMuY29uc3VtZXJfa2V5XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYWNjZXNzX3Rva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YS5hY2Nlc3NfdG9rZW4gPSB0aGlzLmFjY2Vzc190b2tlblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaG9zdDogdGhpcy5ob3N0LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCcsXG4gICAgICAgICAgICAgICAgJ1gtQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF0aDogcGF0aC5zdGFydHNXaXRoKCcvJykgPyBwYXRoIDogJy8nICsgcGF0aCxcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuXG4gICAgICAgIHJldHVybiB7IG9wdGlvbnMsIHBheWxvYWQgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlIExvZ3MgdGhlIHJlbGV2YW50IGluZm9ybWF0aW9uIGFib3V0IGFuIGVycm9yIGZyb20gdGhlIGhlYWRlcnMgXG4gICAgICogaW4gdGhlIHJlc3BvbnNlIG1lc3NhZ2UgZnJvbSB0aGUgUG9ja2V0IEFQSS4gU2VlIGh0dHBzOi8vZ2V0Y29tL2RldmVsb3Blci9kb2NzL2Vycm9yc1xuICAgICAqIEBwYXJhbSByZXNwb25zZSBIVFRQUyByZXNwb25zZSBtZXNzYWdlIGZyb20gdGhlIFBvY2tldCBBUElcbiAgICAgKi9cbiAgICAjbG9nUG9ja2V0RXJyb3IgKHJlc3BvbnNlOiBJbmNvbWluZ01lc3NhZ2UpIDogdm9pZCB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGAke3Jlc3BvbnNlLmhlYWRlcnMuc3RhdHVzfVxuICAgICAgICBQb2NrZXQgRXJyb3IgJHtyZXNwb25zZS5oZWFkZXJzWyd4LWVycm9yLWNvZGUnXX06ICR7cmVzcG9uc2UuaGVhZGVyc1sneC1lcnJvciddfWApXG4gICAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBd0I7QUFIeEI7QUFLTyx5QkFBd0M7QUFBQSxFQUkzQyxZQUFhLEVBQUUsY0FBYyxPQUFPLFVBQTRCO0FBNkwvRDtBQStCRDtBQTFOSSxTQUFLLGVBQWU7QUFFcEIsUUFBSSxPQUFPO0FBQ1AsV0FBSyxlQUFlLE1BQU07QUFDMUIsV0FBSyxXQUFXLE1BQU07QUFBQTtBQUcxQixTQUFLLFNBQVMsMEJBQVU7QUFBQTtBQUFBLE1BR3hCLE9BQVE7QUFBRSxXQUFPO0FBQUE7QUFBQSxFQVFyQixzQkFBdUIsY0FBcUM7QUFDeEQsV0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO0FBQzVCLFlBQU0sRUFBRSxTQUFTLFlBQVksc0JBQUssZ0NBQUwsV0FBbUIscUJBQXFCLEVBQUU7QUFFdkUsWUFBTSxNQUFNLDBCQUFRLFNBQVMsQ0FBQyxRQUFRO0FBQ2xDLFlBQUksR0FBRyxRQUFRLENBQUMsU0FBUztBQUNyQixjQUFJLElBQUksZUFBZSxLQUFLO0FBQ3hCLGlCQUFLLGVBQWUsS0FBSyxNQUFNO0FBQy9CLGtCQUFNLEVBQUUsU0FBUyxLQUFLO0FBQ3RCLG9CQUFRLElBQUksSUFBSSxXQUFXLEtBQUsscUNBQXFDLHFCQUFxQjtBQUFBLGlCQUN2RjtBQUNILGtDQUFLLG9DQUFMLFdBQXFCO0FBQ3JCLG9CQUFRO0FBQUE7QUFBQTtBQUFBO0FBS3BCLFVBQUksTUFBTTtBQUVWLFVBQUksR0FBRyxTQUFTLENBQUMsUUFBUTtBQUNyQixhQUFLLE9BQU8sTUFBTTtBQUNsQixnQkFBUTtBQUFBO0FBR1osVUFBSTtBQUFBO0FBQUE7QUFBQSxFQUlaLFlB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
