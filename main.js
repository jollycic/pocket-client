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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi90eXBlcy5kLnRzXCIgLz5cblxuaW1wb3J0IHsgSW5jb21pbmdNZXNzYWdlIH0gZnJvbSAnaHR0cCdcbmltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdodHRwcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ja2V0Q2xpZW50IGltcGxlbWVudHMgUG9ja2V0QVBJIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IFBvY2tldCAoaHR0cHM6Ly9nZXRwb2NrZXQuY29tKSBBUEkgY2xpZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHsgY29uc3VtZXJfa2V5LCB0b2tlbiwgbG9nZ2VyIH0gOiBQb2NrZXRBUElDb25maWcpIHtcblxuICAgICAgICB0aGlzLmNvbnN1bWVyX2tleSA9IGNvbnN1bWVyX2tleVxuICAgICAgICBcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICB0aGlzLmFjY2Vzc190b2tlbiA9IHRva2VuLmFjY2Vzc190b2tlblxuICAgICAgICAgICAgdGhpcy51c2VybmFtZSA9IHRva2VuLnVzZXJuYW1lXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlciA/PyBjb25zb2xlXG4gICAgfVxuXG4gICAgZ2V0IGhvc3QgKCkgeyByZXR1cm4gJ2dldHBvY2tldC5jb20nIH1cbiAgICBcbiAgICBjb25zdW1lcl9rZXk6IHN0cmluZ1xuICAgIGFjY2Vzc190b2tlbjogc3RyaW5nXG4gICAgdXNlcm5hbWU6IHN0cmluZ1xuICAgIHJlcXVlc3RUb2tlbjogUG9ja2V0UmVxdWVzdFRva2VuXG4gICAgbG9nZ2VyOiBDb25zb2xlXG5cbiAgICByZXF1ZXN0QXV0aGVudGljYXRpb24gKHJlZGlyZWN0X3VyaTogc3RyaW5nKSA6IFByb21pc2U8VVJMPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcHRpb25zLCBwYXlsb2FkIH0gPSB0aGlzLiNidWlsZFJlcXVlc3QoJy92My9vYXV0aC9yZXF1ZXN0JywgeyByZWRpcmVjdF91cmkgfSlcblxuICAgICAgICAgICAgY29uc3QgcmVxID0gcmVxdWVzdChvcHRpb25zLCAocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFRva2VuID0gSlNPTi5wYXJzZShkYXRhKSBhcyBQb2NrZXRSZXF1ZXN0VG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgY29kZSB9ID0gdGhpcy5yZXF1ZXN0VG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFVSTChgaHR0cHM6Ly8ke3RoaXMuaG9zdH0vYXV0aC9hdXRob3JpemU/cmVxdWVzdF90b2tlbj0ke2NvZGV9JnJlZGlyZWN0X3VyaT0ke3JlZGlyZWN0X3VyaX1gKSlcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2xvZ1BvY2tldEVycm9yKHJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEud3JpdGUocGF5bG9hZClcblxuICAgICAgICAgICAgcmVxLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLmVuZCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXV0aG9yaXplICgpIDogUHJvbWlzZTxQb2NrZXRBY2Nlc3NUb2tlbj4ge1xuICAgICAgICBjb25zdCB7IGNvZGUgfSA9IHRoaXMucmVxdWVzdFRva2VuXG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHBheWxvYWQgfSA9IHRoaXMuI2J1aWxkUmVxdWVzdCgnL3YzL29hdXRoL2F1dGhvcml6ZScsIHsgY29kZSB9KVxuICAgICAgICAgICAgY29uc3QgcmVxID0gcmVxdWVzdChvcHRpb25zLCAocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gSlNPTi5wYXJzZShkYXRhKSBhcyBQb2NrZXRBY2Nlc3NUb2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY2Nlc3NfdG9rZW4gPSBhY2Nlc3NUb2tlbi5hY2Nlc3NfdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcm5hbWUgPSBhY2Nlc3NUb2tlbi51c2VybmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhY2Nlc3NUb2tlbilcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2xvZ1BvY2tldEVycm9yKHJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycilcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICByZXEud3JpdGUocGF5bG9hZClcblxuICAgICAgICAgICAgcmVxLmVuZCgpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYWRkIChhcnRpY2xlOiBQb2NrZXRBZGRhYmxlKSA6IFByb21pc2U8UG9ja2V0TGlzdEl0ZW0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHBheWxvYWQgfSA9IHRoaXMuI2J1aWxkUmVxdWVzdCgnL3YzL2FkZCcsIGFydGljbGUpXG4gICAgICAgICAgICBsZXQgY29udGVudHMgPSAnJ1xuICAgICAgICAgICAgY29uc3QgcmVxID0gcmVxdWVzdChvcHRpb25zLCAocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzICs9IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuI2xvZ1BvY2tldEVycm9yKHJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgaXRlbSB9ID0gSlNPTi5wYXJzZShjb250ZW50cylcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShpdGVtIGFzIFBvY2tldExpc3RJdGVtKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgIFxuICAgICAgICAgICAgcmVxLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcihlcnIpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmVxLndyaXRlKHBheWxvYWQpXG4gICAgXG4gICAgICAgICAgICByZXEuZW5kKClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBQUklWQVRFIE1FVEhPRFMgLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlIEJ1aWxkcyB0aGUgb3B0aW9ucyBhbmQgdGhlIHBheWxvYWQgdG8gcGVyZm9ybSBhIHZhbGlkIEpTT04gcmVxdWVzdFxuICAgICAqIHRvIHRoZSBQb2NrZXQgQVBJXG4gICAgICogQHBhcmFtIHBhdGggUG9ja2V0IEFQSSBlbmRwb2ludFxuICAgICAqIEBwYXJhbSBkYXRhIFBheWxvYWQgdG8gUE9TVFxuICAgICAqIEByZXR1cm5zIG9wdGlvbnMgYW5kIHBheWxvYWQgZm9yIHRoZSBBUEkgUmVxdWVzdFxuICAgICAqIFxuICAgICAqL1xuICAgICAjYnVpbGRSZXF1ZXN0IChwYXRoOiBzdHJpbmcsIGRhdGE6IGFueSkgOiBQb2NrZXRSZXF1ZXN0RGF0YSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jb25zdW1lcl9rZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhLmNvbnN1bWVyX2tleSA9IHRoaXMuY29uc3VtZXJfa2V5XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYWNjZXNzX3Rva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YS5hY2Nlc3NfdG9rZW4gPSB0aGlzLmFjY2Vzc190b2tlblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgaG9zdDogdGhpcy5ob3N0LFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBwb3J0OiA0NDMsXG4gICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCcsXG4gICAgICAgICAgICAgICAgJ1gtQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF0aDogcGF0aC5zdGFydHNXaXRoKCcvJykgPyBwYXRoIDogJy8nICsgcGF0aCxcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuXG4gICAgICAgIHJldHVybiB7IG9wdGlvbnMsIHBheWxvYWQgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlIExvZ3MgdGhlIHJlbGV2YW50IGluZm9ybWF0aW9uIGFib3V0IGFuIGVycm9yIGZyb20gdGhlIGhlYWRlcnMgXG4gICAgICogaW4gdGhlIHJlc3BvbnNlIG1lc3NhZ2UgZnJvbSB0aGUgUG9ja2V0IEFQSS4gU2VlIGh0dHBzOi8vZ2V0Y29tL2RldmVsb3Blci9kb2NzL2Vycm9yc1xuICAgICAqIEBwYXJhbSByZXNwb25zZSBIVFRQUyByZXNwb25zZSBtZXNzYWdlIGZyb20gdGhlIFBvY2tldCBBUElcbiAgICAgKi9cbiAgICAjbG9nUG9ja2V0RXJyb3IgKHJlc3BvbnNlOiBJbmNvbWluZ01lc3NhZ2UpIDogdm9pZCB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGAke3Jlc3BvbnNlLmhlYWRlcnMuc3RhdHVzfVxuICAgICAgICBQb2NrZXQgRXJyb3IgJHtyZXNwb25zZS5oZWFkZXJzWyd4LWVycm9yLWNvZGUnXX06ICR7cmVzcG9uc2UuaGVhZGVyc1sneC1lcnJvciddfWApXG4gICAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFHQSxtQkFBd0I7QUFIeEI7QUFLQSx5QkFBdUQ7QUFBQSxFQUluRCxZQUFhLEVBQUUsY0FBYyxPQUFPLFVBQTRCO0FBeUgvRDtBQStCRDtBQXRKSSxTQUFLLGVBQWU7QUFFcEIsUUFBSSxPQUFPO0FBQ1AsV0FBSyxlQUFlLE1BQU07QUFDMUIsV0FBSyxXQUFXLE1BQU07QUFBQTtBQUcxQixTQUFLLFNBQVMsMEJBQVU7QUFBQTtBQUFBLE1BR3hCLE9BQVE7QUFBRSxXQUFPO0FBQUE7QUFBQSxFQVFyQixzQkFBdUIsY0FBcUM7QUFDeEQsV0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO0FBQzVCLFlBQU0sRUFBRSxTQUFTLFlBQVksc0JBQUssZ0NBQUwsV0FBbUIscUJBQXFCLEVBQUU7QUFFdkUsWUFBTSxNQUFNLDBCQUFRLFNBQVMsQ0FBQyxRQUFRO0FBQ2xDLFlBQUksR0FBRyxRQUFRLENBQUMsU0FBUztBQUNyQixjQUFJLElBQUksZUFBZSxLQUFLO0FBQ3hCLGlCQUFLLGVBQWUsS0FBSyxNQUFNO0FBQy9CLGtCQUFNLEVBQUUsU0FBUyxLQUFLO0FBQ3RCLG9CQUFRLElBQUksSUFBSSxXQUFXLEtBQUsscUNBQXFDLHFCQUFxQjtBQUFBLGlCQUN2RjtBQUNILGtDQUFLLG9DQUFMLFdBQXFCO0FBQ3JCLG9CQUFRO0FBQUE7QUFBQTtBQUFBO0FBS3BCLFVBQUksTUFBTTtBQUVWLFVBQUksR0FBRyxTQUFTLENBQUMsUUFBUTtBQUNyQixhQUFLLE9BQU8sTUFBTTtBQUNsQixnQkFBUTtBQUFBO0FBR1osVUFBSTtBQUFBO0FBQUE7QUFBQSxFQUlaLFlBQTBDO0FBQ3RDLFVBQU0sRUFBRSxTQUFTLEtBQUs7QUFFdEIsV0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO0FBQzVCLFlBQU0sRUFBRSxTQUFTLFlBQVksc0JBQUssZ0NBQUwsV0FBbUIsdUJBQXVCLEVBQUU7QUFDekUsWUFBTSxNQUFNLDBCQUFRLFNBQVMsQ0FBQyxRQUFRO0FBQ2xDLFlBQUksR0FBRyxRQUFRLENBQUMsU0FBUztBQUNyQixjQUFJLElBQUksZUFBZSxLQUFLO0FBQ3hCLGtCQUFNLGNBQWMsS0FBSyxNQUFNO0FBQy9CLGlCQUFLLGVBQWUsWUFBWTtBQUNoQyxpQkFBSyxXQUFXLFlBQVk7QUFDNUIsb0JBQVE7QUFBQSxpQkFDTDtBQUNILGtDQUFLLG9DQUFMLFdBQXFCO0FBQ3JCLG9CQUFRO0FBQUE7QUFBQTtBQUFBO0FBS3BCLFVBQUksR0FBRyxTQUFTLENBQUMsUUFBUTtBQUNyQixhQUFLLE9BQU8sTUFBTTtBQUNsQixnQkFBUTtBQUFBO0FBR1osVUFBSSxNQUFNO0FBRVYsVUFBSTtBQUFBO0FBQUE7QUFBQSxFQUlaLElBQUssU0FBa0Q7QUFDbkQsV0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO0FBQzVCLFlBQU0sRUFBRSxTQUFTLFlBQVksc0JBQUssZ0NBQUwsV0FBbUIsV0FBVztBQUMzRCxVQUFJLFdBQVc7QUFDZixZQUFNLE1BQU0sMEJBQVEsU0FBUyxDQUFDLFFBQVE7QUFDbEMsWUFBSSxHQUFHLFFBQVEsQ0FBQyxTQUFTO0FBQ3JCLGNBQUksSUFBSSxlQUFlLEtBQUs7QUFDeEIsd0JBQVk7QUFBQSxpQkFDVDtBQUNILGtDQUFLLG9DQUFMLFdBQXFCO0FBQ3JCLG9CQUFRO0FBQUE7QUFBQTtBQUloQixZQUFJLEdBQUcsT0FBTyxNQUFNO0FBQ2hCLGdCQUFNLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDNUIsa0JBQVE7QUFBQTtBQUFBO0FBSWhCLFVBQUksR0FBRyxTQUFTLENBQUMsUUFBUTtBQUNyQixhQUFLLE9BQU8sTUFBTTtBQUNsQixnQkFBUTtBQUFBO0FBR1osVUFBSSxNQUFNO0FBRVYsVUFBSTtBQUFBO0FBQUE7QUFBQTtBQWdCWDtBQUFBLGtCQUFjLFNBQUMsTUFBYyxNQUErQjtBQUN6RCxNQUFJLE9BQU8sS0FBSyxpQkFBaUIsVUFBVTtBQUN2QyxTQUFLLGVBQWUsS0FBSztBQUFBO0FBRzdCLE1BQUksT0FBTyxLQUFLLGlCQUFpQixVQUFVO0FBQ3ZDLFNBQUssZUFBZSxLQUFLO0FBQUE7QUFHN0IsUUFBTSxVQUFVO0FBQUEsSUFDWixNQUFNLEtBQUs7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNMLGdCQUFnQjtBQUFBLE1BQ2hCLFlBQVk7QUFBQTtBQUFBLElBRWhCLE1BQU0sS0FBSyxXQUFXLE9BQU8sT0FBTyxNQUFNO0FBQUE7QUFHOUMsUUFBTSxVQUFVLEtBQUssVUFBVTtBQUUvQixTQUFPLEVBQUUsU0FBUztBQUFBO0FBUXRCO0FBQUEsb0JBQWdCLFNBQUMsVUFBa0M7QUFDL0MsT0FBSyxPQUFPLE1BQU0sR0FBRyxTQUFTLFFBQVE7QUFBQSx1QkFDdkIsU0FBUyxRQUFRLG9CQUFvQixTQUFTLFFBQVE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
