"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCorporateBanner = generateCorporateBanner;
const canvas_1 = require("@napi-rs/canvas");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
try {
    const regularFontPath = path.join(process.cwd(), 'assets', 'fonts', 'Roboto-Regular.ttf');
    const boldFontPath = path.join(process.cwd(), 'assets', 'fonts', 'Roboto-Bold.ttf');
    if (fs.existsSync(regularFontPath)) {
        canvas_1.GlobalFonts.registerFromPath(regularFontPath, 'Roboto');
    }
    if (fs.existsSync(boldFontPath)) {
        canvas_1.GlobalFonts.registerFromPath(boldFontPath, 'Roboto');
    }
}
catch (e) {
    console.warn('Could not load fonts:', e);
}
const colors = {
    primary: '#0F4C81',
    secondary: '#2563EB',
    accent: '#10B981',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    muted: '#64748B',
    border: '#E2E8F0',
};
const layout = {
    width: 1080,
    height: 1080,
    margin: 60,
};
async function generateCorporateBanner(data) {
    const canvas = (0, canvas_1.createCanvas)(layout.width, layout.height);
    const ctx = canvas.getContext('2d');
    drawBackground(ctx);
    let currentY = layout.margin;
    currentY = await drawHeader(ctx, currentY);
    currentY += 60;
    await drawBusinessSection(ctx, data, currentY);
    const cardH = 260;
    const ownerStartY = layout.height - layout.margin - 50 - cardH;
    await drawOwnerCard(ctx, data, ownerStartY);
    drawFooter(ctx);
    return canvas.toBuffer('image/png');
}
function drawBackground(ctx) {
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, layout.width, layout.height);
    ctx.fillStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.arc(layout.width, 0, layout.width * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, layout.height - 400);
    ctx.quadraticCurveTo(500, layout.height - 300, 300, layout.height);
    ctx.lineTo(0, layout.height);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(layout.margin, layout.height - 70);
    ctx.lineTo(layout.width - layout.margin, layout.height - 70);
    ctx.stroke();
}
async function drawHeader(ctx, startY) {
    const topY = startY;
    ctx.fillStyle = '#F0FDF4';
    roundRect(ctx, layout.margin, topY, 230, 44, 22);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#BBF7D0';
    ctx.stroke();
    ctx.save();
    ctx.translate(layout.margin + 15, topY + 9);
    ctx.scale(1.1, 1.1);
    ctx.fillStyle = colors.accent;
    ctx.fill(new canvas_1.Path2D('M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'));
    ctx.restore();
    ctx.fillStyle = colors.accent;
    ctx.font = 'bold 18px Roboto';
    ctx.fillText('Verified Business', layout.margin + 45, topY + 28);
    const rightX = layout.width - layout.margin;
    let headerBottom = topY + 44;
    try {
        const logoPath = path.join(process.cwd(), '../frontend/public/24HR_logo.png');
        const platformLogo = await (0, canvas_1.loadImage)(logoPath);
        const logoH = 85;
        const aspect = platformLogo.width / platformLogo.height;
        const logoW = logoH * aspect;
        const logoY = topY + 15;
        ctx.fillStyle = colors.muted;
        ctx.font = '600 13px Roboto';
        ctx.textAlign = 'right';
        ctx.fillText('POWERED BY', rightX, topY + 5);
        ctx.drawImage(platformLogo, rightX - logoW, logoY, logoW, logoH);
        headerBottom = Math.max(headerBottom, logoY + logoH);
    }
    catch {
        ctx.fillStyle = colors.muted;
        ctx.font = '600 13px Roboto';
        ctx.textAlign = 'right';
        ctx.fillText('POWERED BY', rightX, topY + 5);
        ctx.fillStyle = colors.primary;
        ctx.font = 'bold 28px Roboto';
        ctx.fillText('24hourspromotion', rightX, topY + 35);
        headerBottom = Math.max(headerBottom, topY + 45);
    }
    ctx.textAlign = 'left';
    return headerBottom;
}
async function drawBusinessSection(ctx, data, startY) {
    const contentX = layout.margin;
    const contentW = layout.width - layout.margin * 2;
    let currentY = startY;
    const logoSize = 160;
    if (data.logoUrl) {
        try {
            const logo = await (0, canvas_1.loadImage)(data.logoUrl);
            ctx.save();
            roundRect(ctx, contentX, currentY, logoSize, logoSize, 32);
            ctx.clip();
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(contentX, currentY, logoSize, logoSize);
            ctx.drawImage(logo, contentX, currentY, logoSize, logoSize);
            ctx.restore();
            ctx.lineWidth = 1;
            ctx.strokeStyle = colors.border;
            roundRect(ctx, contentX, currentY, logoSize, logoSize, 32);
            ctx.stroke();
        }
        catch {
            drawPlaceholderLogo(ctx, contentX, currentY, logoSize);
        }
    }
    else {
        drawPlaceholderLogo(ctx, contentX, currentY, logoSize);
    }
    const textX = contentX + logoSize + 50;
    const textW = contentW - logoSize - 50;
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 64px Roboto';
    const nameLines = wrapTextLines(ctx, data.name || 'Your Business Name', textW);
    let nameY = currentY + 65;
    if (nameLines.length > 1) {
        nameY = currentY + 50;
    }
    ctx.fillText(nameLines[0], textX, nameY);
    if (nameLines.length > 1) {
        ctx.fillText(nameLines[1], textX, nameY + 75);
    }
    let tagsY = currentY + logoSize - 44;
    if (nameLines.length > 2) {
        tagsY = nameY + 75 * 2 + 20;
    }
    const category = data.category || 'Professional Services';
    ctx.font = 'bold 22px Roboto';
    const catWidth = ctx.measureText(category).width;
    ctx.fillStyle = '#EFF6FF';
    roundRect(ctx, textX, tagsY, catWidth + 40, 44, 22);
    ctx.fill();
    ctx.fillStyle = colors.secondary;
    ctx.fillText(category, textX + 20, tagsY + 29);
    const tagX = textX + catWidth + 60;
    if (data.yearsExperience) {
        const expText = `${data.yearsExperience}+ Years Excellence`;
        ctx.font = '600 20px Roboto';
        const expW = ctx.measureText(expText).width;
        ctx.fillStyle = '#F8FAFC';
        roundRect(ctx, tagX, tagsY, expW + 60, 44, 22);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = colors.border;
        ctx.stroke();
        ctx.save();
        ctx.translate(tagX + 15, tagsY + 12);
        ctx.scale(0.85, 0.85);
        ctx.fillStyle = '#EAB308';
        ctx.fill(new canvas_1.Path2D('M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'));
        ctx.restore();
        ctx.fillStyle = colors.text;
        ctx.fillText(expText, tagX + 45, tagsY + 29);
    }
    currentY = Math.max(currentY + logoSize, tagsY + 44) + 60;
    if (data.description) {
        ctx.fillStyle = colors.text;
        ctx.font = '28px Roboto';
        const lines = wrapTextLines(ctx, data.description, contentW);
        const maxLines = 4;
        for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
            let lineText = lines[i];
            if (i === maxLines - 1 && lines.length > maxLines) {
                lineText += '...';
            }
            ctx.fillText(lineText, contentX, currentY + i * 44);
        }
        currentY += Math.min(lines.length, maxLines) * 44 + 20;
    }
    return currentY;
}
function drawPlaceholderLogo(ctx, x, y, size) {
    ctx.fillStyle = '#F8FAFC';
    roundRect(ctx, x, y, size, size, 32);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.border;
    roundRect(ctx, x, y, size, size, 32);
    ctx.stroke();
}
async function drawOwnerCard(ctx, data, startY) {
    const contentX = layout.margin;
    const contentW = layout.width - layout.margin * 2;
    const cardH = 260;
    ctx.save();
    ctx.shadowColor = 'rgba(15, 76, 129, 0.08)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = colors.surface;
    roundRect(ctx, contentX, startY, contentW, cardH, 32);
    ctx.fill();
    ctx.restore();
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.border;
    roundRect(ctx, contentX, startY, contentW, cardH, 32);
    ctx.stroke();
    const pad = 40;
    const photoSize = 180;
    const innerX = contentX + pad;
    const innerY = startY + pad;
    if (data.ownerPhotoUrl) {
        try {
            const owner = await (0, canvas_1.loadImage)(data.ownerPhotoUrl);
            ctx.save();
            roundRect(ctx, innerX, innerY, photoSize, photoSize, 24);
            ctx.clip();
            const aspect = owner.width / owner.height;
            let drawW = photoSize, drawH = photoSize, drawX = innerX, drawY = innerY;
            if (aspect > 1) {
                drawW = photoSize * aspect;
                drawX = innerX - (drawW - photoSize) / 2;
            }
            else {
                drawH = photoSize / aspect;
                drawY = innerY - (drawH - photoSize) / 2;
            }
            ctx.drawImage(owner, drawX, drawY, drawW, drawH);
            ctx.restore();
        }
        catch {
            ctx.fillStyle = '#E2E8F0';
            roundRect(ctx, innerX, innerY, photoSize, photoSize, 24);
            ctx.fill();
        }
    }
    else {
        ctx.fillStyle = '#E2E8F0';
        roundRect(ctx, innerX, innerY, photoSize, photoSize, 24);
        ctx.fill();
    }
    const textX = innerX + photoSize + 50;
    let textY = innerY + 35;
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 36px Roboto';
    ctx.fillText(data.ownerName || 'Business Owner', textX, textY);
    textY += 35;
    ctx.fillStyle = colors.secondary;
    ctx.font = '24px Roboto';
    ctx.fillText('Owner / Founder', textX, textY);
    textY += 45;
    ctx.beginPath();
    ctx.moveTo(textX, textY);
    ctx.lineTo(contentX + contentW - pad, textY);
    ctx.strokeStyle = '#E2E8F0';
    ctx.stroke();
    textY += 40;
    const availableW = contentW - pad - photoSize - 50 - pad;
    const colW = availableW / 2;
    const rowH = 40;
    let currentX = textX;
    let currentY = textY;
    const items = [];
    if (data.whatsapp)
        items.push({ type: 'phone', text: data.whatsapp });
    if (data.email)
        items.push({ type: 'mail', text: data.email });
    if (data.website)
        items.push({
            type: 'globe',
            text: data.website.replace(/^https?:\/\/(www\.)?/, ''),
        });
    if (data.location)
        items.push({ type: 'location', text: data.location });
    items.forEach((item, idx) => {
        drawContactItem(ctx, item.type, item.text, currentX, currentY, colW);
        if (idx % 2 === 1) {
            currentX = textX;
            currentY += rowH;
        }
        else {
            currentX += colW;
        }
    });
    return startY + cardH;
}
function drawFooter(ctx) {
    const footerY = layout.height - 35;
    ctx.fillStyle = colors.muted;
    ctx.font = '18px Roboto';
    const textLeft = 'Generated by 24hourspromotion';
    const textRight = 'www.24hourspromotion.com';
    ctx.fillText(textLeft, layout.margin, footerY);
    const rightW = ctx.measureText(textRight).width;
    ctx.fillText(textRight, layout.width - layout.margin - rightW, footerY);
}
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
function wrapTextLines(ctx, text, maxWidth) {
    const lines = [];
    const paragraphs = text.split(/\r?\n/);
    for (const paragraph of paragraphs) {
        if (paragraph.trim() === '') {
            lines.push('');
            continue;
        }
        const words = paragraph.split(' ');
        let currentLine = '';
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word;
            }
            else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
    }
    return lines;
}
function drawContactItem(ctx, type, text, x, y, maxWidth) {
    ctx.save();
    ctx.translate(x, y - 18);
    ctx.scale(0.9, 0.9);
    ctx.fillStyle = colors.primary;
    if (type === 'phone') {
        ctx.fill(new canvas_1.Path2D('M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z'));
    }
    else if (type === 'location') {
        ctx.fill(new canvas_1.Path2D('M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'));
    }
    else if (type === 'globe') {
        ctx.fill(new canvas_1.Path2D('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'));
    }
    else if (type === 'mail') {
        ctx.fill(new canvas_1.Path2D('M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'));
    }
    ctx.restore();
    ctx.fillStyle = colors.muted;
    ctx.font = '20px Roboto';
    let renderText = text;
    const maxW = maxWidth ? maxWidth - 40 : 300;
    if (ctx.measureText(renderText).width > maxW) {
        while (renderText.length > 5 &&
            ctx.measureText(renderText + '...').width > maxW) {
            renderText = renderText.slice(0, -1);
        }
        renderText += '...';
    }
    ctx.fillText(renderText, x + 35, y);
}
//# sourceMappingURL=corporate.template.js.map