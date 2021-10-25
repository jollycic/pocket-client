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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi90eXBlcy5kLnRzXCIgLz5cblxuaW1wb3J0IHsgSW5jb21pbmdNZXNzYWdlIH0gZnJvbSAnaHR0cCdcbmltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdodHRwcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ja2V0Q2xpZW50IGltcGxlbWVudHMgUG9ja2V0QVBJIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IFBvY2tldCAoaHR0cHM6Ly9nZXRjb20pIEFQSSBjbGllbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoeyBjb25zdW1lcl9rZXksIHRva2VuLCBsb2dnZXIgfSA6IFBvY2tldEFQSUNvbmZpZykge1xuXG4gICAgICAgIHRoaXMuY29uc3VtZXJfa2V5ID0gY29uc3VtZXJfa2V5XG4gICAgICAgIFxuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMuYWNjZXNzX3Rva2VuID0gdG9rZW4uYWNjZXNzX3Rva2VuXG4gICAgICAgICAgICB0aGlzLnVzZXJuYW1lID0gdG9rZW4udXNlcm5hbWVcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyID8/IGNvbnNvbGVcbiAgICB9XG5cbiAgICBnZXQgaG9zdCAoKSB7IHJldHVybiAnZ2V0cG9ja2V0LmNvbScgfVxuICAgIFxuICAgIGNvbnN1bWVyX2tleTogc3RyaW5nXG4gICAgYWNjZXNzX3Rva2VuOiBzdHJpbmdcbiAgICB1c2VybmFtZTogc3RyaW5nXG4gICAgcmVxdWVzdFRva2VuOiBQb2NrZXRSZXF1ZXN0VG9rZW5cbiAgICBsb2dnZXI6IENvbnNvbGVcblxuICAgIHJlcXVlc3RBdXRoZW50aWNhdGlvbiAocmVkaXJlY3RfdXJpOiBzdHJpbmcpIDogUHJvbWlzZTxVUkw+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHBheWxvYWQgfSA9IHRoaXMuI2J1aWxkUmVxdWVzdCgnL3YzL29hdXRoL3JlcXVlc3QnLCB7IHJlZGlyZWN0X3VyaSB9KVxuXG4gICAgICAgICAgICBjb25zdCByZXEgPSByZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0VG9rZW4gPSBKU09OLnBhcnNlKGRhdGEpIGFzIFBvY2tldFJlcXVlc3RUb2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBjb2RlIH0gPSB0aGlzLnJlcXVlc3RUb2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgVVJMKGBodHRwczovLyR7dGhpcy5ob3N0fS9hdXRoL2F1dGhvcml6ZT9yZXF1ZXN0X3Rva2VuPSR7Y29kZX0mcmVkaXJlY3RfdXJpPSR7cmVkaXJlY3RfdXJpfWApKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jbG9nUG9ja2V0RXJyb3IocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS53cml0ZShwYXlsb2FkKVxuXG4gICAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycilcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEuZW5kKClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhdXRob3JpemUgKCkgOiBQcm9taXNlPFBvY2tldEFjY2Vzc1Rva2VuPiB7XG4gICAgICAgIGNvbnN0IHsgY29kZSB9ID0gdGhpcy5yZXF1ZXN0VG9rZW5cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucywgcGF5bG9hZCB9ID0gdGhpcy4jYnVpbGRSZXF1ZXN0KCcvdjMvb2F1dGgvYXV0aG9yaXplJywgeyBjb2RlIH0pXG4gICAgICAgICAgICBjb25zdCByZXEgPSByZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBKU09OLnBhcnNlKGRhdGEpIGFzIFBvY2tldEFjY2Vzc1Rva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuLmFjY2Vzc190b2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IGFjY2Vzc1Rva2VuLnVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFjY2Vzc1Rva2VuKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jbG9nUG9ja2V0RXJyb3IocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyKVxuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHJlcS53cml0ZShwYXlsb2FkKVxuXG4gICAgICAgICAgICByZXEuZW5kKClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGQgKGFydGljbGU6IFBvY2tldEFkZGFibGUpIDogUHJvbWlzZTxQb2NrZXRMaXN0SXRlbT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgb3B0aW9ucywgcGF5bG9hZCB9ID0gdGhpcy4jYnVpbGRSZXF1ZXN0KCcvdjMvYWRkJywgYXJ0aWNsZSlcbiAgICAgICAgICAgIGxldCBjb250ZW50cyA9ICcnXG4gICAgICAgICAgICBjb25zdCByZXEgPSByZXF1ZXN0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICByZXMub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudHMgKz0gZGF0YVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jbG9nUG9ja2V0RXJyb3IocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXMub24oJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBpdGVtIH0gPSBKU09OLnBhcnNlKGNvbnRlbnRzKVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGl0ZW0gYXMgUG9ja2V0TGlzdEl0ZW0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgXG4gICAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycilcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEud3JpdGUocGF5bG9hZClcbiAgICBcbiAgICAgICAgICAgIHJlcS5lbmQoKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIFBSSVZBVEUgTUVUSE9EUyAvL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGUgQnVpbGRzIHRoZSBvcHRpb25zIGFuZCB0aGUgcGF5bG9hZCB0byBwZXJmb3JtIGEgdmFsaWQgSlNPTiByZXF1ZXN0XG4gICAgICogdG8gdGhlIFBvY2tldCBBUElcbiAgICAgKiBAcGFyYW0gcGF0aCBQb2NrZXQgQVBJIGVuZHBvaW50XG4gICAgICogQHBhcmFtIGRhdGEgUGF5bG9hZCB0byBQT1NUXG4gICAgICogQHJldHVybnMgb3B0aW9ucyBhbmQgcGF5bG9hZCBmb3IgdGhlIEFQSSBSZXF1ZXN0XG4gICAgICogXG4gICAgICovXG4gICAgICNidWlsZFJlcXVlc3QgKHBhdGg6IHN0cmluZywgZGF0YTogYW55KSA6IFBvY2tldFJlcXVlc3REYXRhIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmNvbnN1bWVyX2tleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGEuY29uc3VtZXJfa2V5ID0gdGhpcy5jb25zdW1lcl9rZXlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5hY2Nlc3NfdG9rZW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhLmFjY2Vzc190b2tlbiA9IHRoaXMuYWNjZXNzX3Rva2VuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBob3N0OiB0aGlzLmhvc3QsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHBvcnQ6IDQ0MyxcbiAgICAgICAgICAgIGpzb246IHRydWUsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04JyxcbiAgICAgICAgICAgICAgICAnWC1BY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXRoOiBwYXRoLnN0YXJ0c1dpdGgoJy8nKSA/IHBhdGggOiAnLycgKyBwYXRoLFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG5cbiAgICAgICAgcmV0dXJuIHsgb3B0aW9ucywgcGF5bG9hZCB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGUgTG9ncyB0aGUgcmVsZXZhbnQgaW5mb3JtYXRpb24gYWJvdXQgYW4gZXJyb3IgZnJvbSB0aGUgaGVhZGVycyBcbiAgICAgKiBpbiB0aGUgcmVzcG9uc2UgbWVzc2FnZSBmcm9tIHRoZSBQb2NrZXQgQVBJLiBTZWUgaHR0cHM6Ly9nZXRjb20vZGV2ZWxvcGVyL2RvY3MvZXJyb3JzXG4gICAgICogQHBhcmFtIHJlc3BvbnNlIEhUVFBTIHJlc3BvbnNlIG1lc3NhZ2UgZnJvbSB0aGUgUG9ja2V0IEFQSVxuICAgICAqL1xuICAgICNsb2dQb2NrZXRFcnJvciAocmVzcG9uc2U6IEluY29taW5nTWVzc2FnZSkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoYCR7cmVzcG9uc2UuaGVhZGVycy5zdGF0dXN9XG4gICAgICAgIFBvY2tldCBFcnJvciAke3Jlc3BvbnNlLmhlYWRlcnNbJ3gtZXJyb3ItY29k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
