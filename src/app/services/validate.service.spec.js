"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var validate_service_1 = require("./validate.service");
describe('ValidateService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [validate_service_1.ValidateService]
        });
    });
    it('should be created', testing_1.inject([validate_service_1.ValidateService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=validate.service.spec.js.map