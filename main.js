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
  default: () => PocketClient
});
var import_https = __toModule(require("https"));
var _buildRequest, buildRequest_fn, _logPocketError, logPocketError_fn;
var PocketClient = class extends Pocket.API {
  constructor({ consumer_key, token, logger }) {
    super({ consumer_key, token, logger });
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
    return new Promise((resolve, reject) => {
      const { options, payload } = __privateMethod(this, _buildRequest, buildRequest_fn).call(this, "/v3/add", article);
      const req = (0, import_https.request)(options, (res) => {
        res.on("data", ({ item }) => {
          resolve(JSON.parse(item));
        });
      });
      req.on("error", (err) => {
        reject(err);
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
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi90eXBlcy5kLnRzXCIgLz5cblxuaW1wb3J0IHsgSW5jb21pbmdNZXNzYWdlIH0gZnJvbSAnaHR0cCdcbmltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdodHRwcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ja2V0Q2xpZW50IGV4dGVuZHMgUG9ja2V0LkFQSSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBQb2NrZXQgKGh0dHBzOi8vZ2V0cG9ja2V0LmNvbSkgQVBJIGNsaWVudFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh7IGNvbnN1bWVyX2tleSwgdG9rZW4sIGxvZ2dlciB9IDogUG9ja2V0LkFQSUNvbmZpZykge1xuICAgICAgICBzdXBlcih7IGNvbnN1bWVyX2tleSwgdG9rZW4sIGxvZ2dlciB9KVxuXG4gICAgICAgIHRoaXMuY29uc3VtZXJfa2V5ID0gY29uc3VtZXJfa2V5XG4gICAgICAgIFxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzX3Rva2VuID0gdG9rZW4uYWNjZXNzX3Rva2VuXG4gICAgICAgICAgICB0aGlzLnVzZXJuYW1lID0gdG9rZW4udXNlcm5hbWVcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyID8/IGNvbnNvbGVcbiAgICB9XG5cbiAgICBnZXQgaG9zdCAoKSB7IHJldHVybiAnZ2V0cG9ja2V0LmNvbScgfVxuICAgIFxuICAgIGNvbnN1bWVyX2tleTogc3RyaW5nXG4gICAgYWNjZXNzX3Rva2VuOiBzdHJpbmdcbiAgICB1c2VybmFtZTogc3RyaW5nXG4gICAgcmVxdWVzdFRva2VuOiBQb2NrZXQuUmVxdWVzdFRva2VuXG4gICAgbG9nZ2VyOiBDb25zb2xlXG5cbiAgICByZXF1ZXN0QXV0aGVudGljYXRpb24gKHJlZGlyZWN0X3VyaTogc3RyaW5nKSA6IFByb21pc2U8VVJMPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcHRpb25zLCBwYXlsb2FkIH0gPSB0aGlzLiNidWlsZFJlcXVlc3QoJy92My9vYXV0aC9yZXF1ZXN0JywgeyByZWRpcmVjdF91cmkgfSlcblxuICAgICAgICAgICAgY29uc3QgcmVxID0gcmVxdWVzdChvcHRpb25zLCAocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFRva2VuID0gSlNPTi5wYXJzZShkYXRhKSBhcyBQb2NrZXQuUmVxdWVzdFRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGNvZGUgfSA9IHRoaXMucmVxdWVzdFRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBVUkwoYGh0dHBzOi8vJHt0aGlzLmhvc3R9L2F1dGgvYXV0aG9yaXplP3JlcXVlc3RfdG9rZW49JHtjb2RlfSZyZWRpcmVjdF91cmk9JHtyZWRpcmVjdF91cml9YCkpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiNsb2dQb2NrZXRFcnJvcihyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLndyaXRlKHBheWxvYWQpXG5cbiAgICAgICAgICAgIHJlcS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGF1dGhvcml6ZSAoKSA6IFByb21pc2U8UG9ja2V0LkFjY2Vzc1Rva2VuPiB7XG4gICAgICAgIGNvbnN0IHsgY29kZSB9ID0gdGhpcy5yZXF1ZXN0VG9rZW5cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucywgcGF5bG9hZCB9ID0gdGhpcy4jYnVpbGRSZXF1ZXN0KCcvdjMvb2F1dGgvYXV0aG9yaXplJywgeyBjb2RlIH0pXG4gICAgICAgICAgICBjb25zdCByZXEgPSByZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBKU09OLnBhcnNlKGRhdGEpIGFzIFBvY2tldC5BY2Nlc3NUb2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY2Nlc3NfdG9rZW4gPSBhY2Nlc3NUb2tlbi5hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSBhY2Nlc3NUb2tlbi51c2VybmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhY2Nlc3NUb2tlbilcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2xvZ1BvY2tldEVycm9yKHJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycilcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEud3JpdGUocGF5bG9hZClcblxuICAgICAgICAgICAgcmVxLmVuZCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYWRkIChhcnRpY2xlOiBQb2NrZXQuQWRkYWJsZSkgOiBQcm9taXNlPFBvY2tldC5MaXN0SXRlbT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcHRpb25zLCBwYXlsb2FkIH0gPSB0aGlzLiNidWlsZFJlcXVlc3QoJy92My9hZGQnLCBhcnRpY2xlKVxuICAgICAgICAgICAgY29uc3QgcmVxID0gcmVxdWVzdChvcHRpb25zLCAocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLm9uKCdkYXRhJywgKHsgaXRlbSB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShpdGVtKSBhcyBQb2NrZXQuTGlzdEl0ZW0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgXG4gICAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEud3JpdGUocGF5bG9hZClcbiAgICBcbiAgICAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIFBSSVZBVEUgTUVUSE9EU1xuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGUgQnVpbGRzIHRoZSBvcHRpb25zIGFuZCB0aGUgcGF5bG9hZCB0byBwZXJmb3JtIGEgdmFsaWQgSlNPTiByZXF1ZXN0XG4gICAgICogdG8gdGhlIFBvY2tldCBBUElcbiAgICAgKiBAcGFyYW0gcGF0aCBQb2NrZXQgQVBJIGVuZHBvaW50XG4gICAgICogQHBhcmFtIGRhdGEgUGF5bG9hZCB0byBQT1NUXG4gICAgICogQHJldHVybnMgb3B0aW9ucyBhbmQgcGF5bG9hZCBmb3IgdGhlIEFQSSBSZXF1ZXN0XG4gICAgICogXG4gICAgICovXG4gICAgICNidWlsZFJlcXVlc3QgKHBhdGg6IHN0cmluZywgZGF0YTogYW55KSA6IFBvY2tldC5SZXF1ZXN0RGF0YSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb25zdW1lcl9rZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhLmNvbnN1bWVyX2tleSA9IHRoaXMuY29uc3VtZXJfa2V5XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYWNjZXNzX3Rva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YS5hY2Nlc3NfdG9rZW4gPSB0aGlzLmFjY2Vzc190b2tlblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaG9zdDogdGhpcy5ob3N0LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCcsXG4gICAgICAgICAgICAgICAgJ1gtQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF0aDogcGF0aC5zdGFydHNXaXRoKCcvJykgPyBwYXRoIDogJy8nICsgcGF0aCxcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuXG4gICAgICAgIHJldHVybiB7IG9wdGlvbnMsIHBheWxvYWQgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlIExvZ3MgdGhlIHJlbGV2YW50IGluZm9ybWF0aW9uIGFib3V0IGFuIGVycm9yIGZyb20gdGhlIGhlYWRlcnMgXG4gICAgICogaW4gdGhlIHJlc3BvbnNlIG1lc3NhZ2UgZnJvbSB0aGUgUG9ja2V0IEFQSS4gU2VlIGh0dHBzOi8vZ2V0cG9ja2V0LmNvbS9kZXZlbG9wZXIvZG9jcy9lcnJvcnNcbiAgICAgKiBAcGFyYW0gcmVzcG9uc2UgSFRUUFMgcmVzcG9uc2UgbWVzc2FnZSBmcm9tIHRoZSBQb2NrZXQgQVBJXG4gICAgICovXG4gICAgI2xvZ1BvY2tldEVycm9yIChyZXNwb25zZTogSW5jb21pbmdNZXNzYWdlKSA6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihgJHtyZXNwb25zZS5oZWFkZXJzLnN0YXR1c31cbiAgICAgICAgUG9ja2V0IEVycm9yICR7cmVzcG9uc2UuaGVhZGVyc1sneC1lcnJvci1jb2RlJ119OiAke3Jlc3BvbnNlLmhlYWRlcnNbJ3gtZXJyb3InXX1gKVxuICAgIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBR0EsbUJBQXdCO0FBSHhCO0FBS0EsaUNBQTBDLE9BQU8sSUFBSTtBQUFBLEVBSWpELFlBQWEsRUFBRSxjQUFjLE9BQU8sVUFBNkI7QUFDN0QsVUFBTSxFQUFFLGNBQWMsT0FBTztBQTJHaEM7QUErQkQ7QUF4SUksU0FBSyxlQUFlO0FBRXBCLFFBQUksT0FBTztBQUNQLFdBQUssZUFBZSxNQUFNO0FBQzFCLFdBQUssV0FBVyxNQUFNO0FBQUE7QUFHMUIsU0FBSyxTQUFTLDBCQUFVO0FBQUE7QUFBQSxNQUd4QixPQUFRO0FBQUUsV0FBTztBQUFBO0FBQUEsRUFRckIsc0JBQXVCLGNBQXFDO0FBQ3hELFdBQU8s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
