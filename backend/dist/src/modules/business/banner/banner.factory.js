"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBannerByTemplate = generateBannerByTemplate;
const corporate_template_1 = require("./templates/corporate.template");
async function generateBannerByTemplate(data, template = 'corporate') {
    switch (template) {
        case 'corporate':
            return (0, corporate_template_1.generateCorporateBanner)(data);
        case 'modern':
        case 'minimal':
        case 'festival':
            return (0, corporate_template_1.generateCorporateBanner)(data);
        default:
            throw new Error(`Unsupported banner template: ${String(template)}`);
    }
}
//# sourceMappingURL=banner.factory.js.map