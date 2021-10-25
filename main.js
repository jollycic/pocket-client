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
  get(config) {
    config = config != null ? config : {};
    return new Promise((resolve) => {
      const { options, payload } = __privateMethod(this, _buildRequest, buildRequest_fn).call(this, "/v3/get", config);
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
          resolve(list);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi90eXBlcy5kLnRzXCIgLz5cblxuaW1wb3J0IHsgSW5jb21pbmdNZXNzYWdlIH0gZnJvbSAnaHR0cCdcbmltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdodHRwcydcblxuZXhwb3J0IGNsYXNzIFBvY2tldENsaWVudCBpbXBsZW1lbnRzIFBvY2tldEFQSSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBQb2NrZXQgKGh0dHBzOi8vZ2V0cG9ja2V0LmNvbSkgQVBJIGNsaWVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh7IGNvbnN1bWVyX2tleSwgdG9rZW4sIGxvZ2dlciB9IDogUG9ja2V0QVBJQ29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy5jb25zdW1lcl9rZXkgPSBjb25zdW1lcl9rZXlcbiAgICAgICAgXG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgdGhpcy5hY2Nlc3NfdG9rZW4gPSB0b2tlbi5hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSB0b2tlbi51c2VybmFtZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXIgPz8gY29uc29sZVxuICAgIH1cblxuICAgIGdldCBob3N0ICgpIHsgcmV0dXJuICdnZXRwb2NrZXQuY29tJyB9XG4gICAgXG4gICAgY29uc3VtZXJfa2V5OiBzdHJpbmdcbiAgICBhY2Nlc3NfdG9rZW46IHN0cmluZ1xuICAgIHVzZXJuYW1lOiBzdHJpbmdcbiAgICByZXF1ZXN0VG9rZW46IFBvY2tldFJlcXVlc3RUb2tlblxuICAgIGxvZ2dlcjogQ29uc29sZVxuXG4gICAgcmVxdWVzdEF1dGhlbnRpY2F0aW9uIChyZWRpcmVjdF91cmk6IHN0cmluZykgOiBQcm9taXNlPFVSTD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucywgcGF5bG9hZCB9ID0gdGhpcy4jYnVpbGRSZXF1ZXN0KCcvdjMvb2F1dGgvcmVxdWVzdCcsIHsgcmVkaXJlY3RfdXJpIH0pXG5cbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IHJlcXVlc3Qob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RUb2tlbiA9IEpTT04ucGFyc2UoZGF0YSkgYXMgUG9ja2V0UmVxdWVzdFRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGNvZGUgfSA9IHRoaXMucmVxdWVzdFRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBVUkwoYGh0dHBzOi8vJHt0aGlzLmhvc3R9L2F1dGgvYXV0aG9yaXplP3JlcXVlc3RfdG9rZW49JHtjb2RlfSZyZWRpcmVjdF91cmk9JHtyZWRpcmVjdF91cml9YCkpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNsb2dQb2NrZXRFcnJvcihyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLndyaXRlKHBheWxvYWQpXG5cbiAgICAgICAgICAgIHJlcS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGF1dGhvcml6ZSAoKSA6IFByb21pc2U8UG9ja2V0QWNjZXNzVG9rZW4+IHtcbiAgICAgICAgY29uc3QgeyBjb2RlIH0gPSB0aGlzLnJlcXVlc3RUb2tlblxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcHRpb25zLCBwYXlsb2FkIH0gPSB0aGlzLiNidWlsZFJlcXVlc3QoJy92My9vYXV0aC9hdXRob3JpemUnLCB7IGNvZGUgfSlcbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IHJlcXVlc3Qob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IEpTT04ucGFyc2UoZGF0YSkgYXMgUG9ja2V0QWNjZXNzVG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWNjZXNzX3Rva2VuID0gYWNjZXNzVG9rZW4uYWNjZXNzX3Rva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJuYW1lID0gYWNjZXNzVG9rZW4udXNlcm5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYWNjZXNzVG9rZW4pXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNsb2dQb2NrZXRFcnJvcihyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLndyaXRlKHBheWxvYWQpXG5cbiAgICAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFkZCAoYXJ0aWNsZTogUG9ja2V0QWRkYWJsZSkgOiBQcm9taXNlPFBvY2tldExpc3RJdGVtPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcHRpb25zLCBwYXlsb2FkIH0gPSB0aGlzLiNidWlsZFJlcXVlc3QoJy92My9hZGQnLCBhcnRpY2xlKVxuICAgICAgICAgICAgbGV0IGNvbnRlbnRzID0gJydcbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IHJlcXVlc3Qob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cyArPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNsb2dQb2NrZXRFcnJvcihyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlcy5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGl0ZW0gfSA9IEpTT04ucGFyc2UoY29udGVudHMpXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaXRlbSBhcyBQb2NrZXRMaXN0SXRlbSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICBcbiAgICAgICAgICAgIHJlcS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS53cml0ZShwYXlsb2FkKVxuICAgIFxuICAgICAgICAgICAgcmVxLmVuZCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZ2V0IChjb25maWc6IFBvY2tldEdldE9wdGlvbnMpIDogUHJvbWlzZTxQb2NrZXRMaXN0PiB7XG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZyA/PyB7fVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucywgcGF5bG9hZCB9ID0gdGhpcy4jYnVpbGRSZXF1ZXN0KCcvdjMvZ2V0JywgY29uZmlnKVxuICAgICAgICAgICAgbGV0IGNvbnRlbnRzID0gJydcbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IHJlcXVlc3Qob3B0aW9ucywgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cyArPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNsb2dQb2NrZXRFcnJvcihyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbGlzdCB9ID0gSlNPTi5wYXJzZShjb250ZW50cylcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShsaXN0IGFzIFBvY2tldExpc3QpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS53cml0ZShwYXlsb2FkKVxuICAgIFxuICAgICAgICAgICAgcmVxLmVuZCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gUFJJVkFURSBNRVRIT0RTIC8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZSBCdWlsZHMgdGhlIG9wdGlvbnMgYW5kIHRoZSBwYXlsb2FkIHRvIHBlcmZvcm0gYSB2YWxpZCBKU09OIHJlcXVlc3RcbiAgICAgKiB0byB0aGUgUG9ja2V0IEFQSVxuICAgICAqIEBwYXJhbSBwYXRoIFBvY2tldCBBUEkgZW5kcG9pbnRcbiAgICAgKiBAcGFyYW0gZGF0YSBQYXlsb2FkIHRvIFBPU1RcbiAgICAgKiBAcmV0dXJucyBvcHRpb25zIGFuZCBwYXlsb2FkIGZvciB0aGUgQVBJIFJlcXVlc3RcbiAgICAgKiBcbiAgICAgKi9cbiAgICAgI2J1aWxkUmVxdWVzdCAocGF0aDogc3RyaW5nLCBkYXRhOiBhbnkpIDogUG9ja2V0UmVxdWVzdERhdGEge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuY29uc3VtZXJfa2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YS5jb25zdW1lcl9rZXkgPSB0aGlzLmNvbnN1bWVyX2tleVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmFjY2Vzc190b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGEuYWNjZXNzX3Rva2VuID0gdGhpcy5hY2Nlc3NfdG9rZW5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGhvc3Q6IHRoaXMuaG9zdCxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgcG9ydDogNDQzLFxuICAgICAgICAgICAganNvbjogdHJ1ZSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLTgnLFxuICAgICAgICAgICAgICAgICdYLUFjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhdGg6IHBhdGguc3RhcnRzV2l0aCgnLycpID8gcGF0aCA6ICcvJyArIHBhdGgsXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcblxuICAgICAgICByZXR1cm4geyBvcHRpb25zLCBwYXlsb2FkIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZSBMb2dzIHRoZSByZWxldmFudCBpbmZvcm1hdGlvbiBhYm91dCBhbiBlcnJvciBmcm9tIHRoZSBoZWFkZXJzIFxuICAgICAqIGluIHRoZSByZXNwb25zZSBtZXNzYWdlIGZyb20gdGhlIFBvY2tldCBBUEkuIFNlZSBodHRwczovL2dldGNvbS9kZXZlbG9wZXIvZG9jcy9lcnJvcnNcbiAgICAgKiBAcGFyYW0gcmVzcG9uc2UgSFRUUFMgcmVzcG9uc2UgbWVzc2FnZSBmcm9tIHRoZSBQb2NrZXQgQVBJXG4gICAgICovXG4gICAgI2xvZ1BvY2tldEVycm9yIChyZXNwb25zZTogSW5jb21pbmdNZXNzYWdlKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgJHtyZXNwb25zZS5oZWFkZXJzLnN0YXR1c31cbiAgICAgICAgUG9ja2V0IEVycm9yICR7cmVzcG9uc2UuaGVhZGVyc1sneC1lcnJvci1jb2RlJ119OiAke3Jlc3BvbnNlLmhlYWRlcnNbJ3gtZXJyb3InXX1gKVxuICAgIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQXdCO0FBSHhCO0FBS08seUJBQXdDO0FBQUEsRUFJM0MsWUFBYSxFQUFFLGNBQWMsT0FBTyxVQUE0QjtBQXlKL0Q7QUErQkQ7QUF0TEksU0FBSyxlQUFlO0FBRXBCLFFBQUksT0FBTztBQUNQLFdBQUssZUFBZSxNQUFNO0FBQzFCLFdBQUssV0FBVyxNQUFNO0FBQUE7QUFHMUIsU0FBSyxTQUFTLDBCQUFVO0FBQUE7QUFBQSxNQUd4QixPQUFRO0FBQUUsV0FBTztBQUFBO0FBQUEsRUFRckIsc0JBQXVCLGNBQXFDO0FBQ3hELFdBQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtBQUM1QixZQUFNLEVBQUUsU0FBUyxZQUFZLHNCQUFLLGdDQUFMLFdBQW1CLHFCQUFxQixFQUFFO0FBRXZFLFlBQU0sTUFBTSwwQkFBUSxTQUFTLENBQUMsUUFBUTtBQUNsQyxZQUFJLEdBQUcsUUFBUSxDQUFDLFNBQVM7QUFDckIsY0FBSSxJQUFJLGVBQWUsS0FBSztBQUN4QixpQkFBSyxlQUFlLEtBQUssTUFBTTtBQUMvQixrQkFBTSxFQUFFLFNBQVMsS0FBSztBQUN0QixvQkFBUSxJQUFJLElBQUksV0FBVyxLQUFLLHFDQUFxQyxxQkFBcUI7QUFBQSxpQkFDdkY7QUFDSCxrQ0FBSyxvQ0FBTCxXQUFxQjtBQUNyQixvQkFBUTtBQUFBO0FBQUE7QUFBQTtBQUtwQixVQUFJLE1BQU07QUFFVixVQUFJLEdBQUcsU0FBUyxDQUFDLFFBQVE7QUFDckIsYUFBSyxPQUFPLE1BQU07QUFDbEIsZ0JBQVE7QUFBQTtBQUdaLFVBQUk7QUFBQTtB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
