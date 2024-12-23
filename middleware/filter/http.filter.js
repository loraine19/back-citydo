"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExeptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExeptionFilter = class HttpExeptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = common_1.HttpStatus.NOT_FOUND;
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message
        });
    }
};
exports.HttpExeptionFilter = HttpExeptionFilter;
exports.HttpExeptionFilter = HttpExeptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExeptionFilter);
//# sourceMappingURL=http.filter.js.map