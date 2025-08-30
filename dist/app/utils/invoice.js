"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs_1 = __importDefault(require("fs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const generatePdf = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({ size: "A4", margin: 40 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));
            // Fonts
            doc.registerFont("Helvetica-Bold", "Helvetica-Bold");
            doc.registerFont("Helvetica", "Helvetica");
            // Header with Logo and Title
            if (data.logoPath && fs_1.default.existsSync(data.logoPath)) {
                doc.image(data.logoPath, 40, 30, { width: 80, align: "center" });
            }
            else {
                doc
                    .font("Helvetica-Bold")
                    .fontSize(20)
                    .fillColor("#4CAF50")
                    .text("Parcel Delivery", 40, 40);
            }
            doc
                .font("Helvetica-Bold")
                .fontSize(18)
                .fillColor("#333333")
                .text("Invoice", 0, 40, { align: "center" })
                .moveDown(0.5);
            // Invoice Info
            doc
                .font("Helvetica")
                .fontSize(10)
                .fillColor("#555555")
                .text(`Invoice Number: ${data.invoiceNumber}`, 40, doc.y)
                .text(`Date: ${data.date}`, 0, doc.y, { align: "right" })
                .moveDown(1.5);
            // Sender & Receiver
            const senderReceiverY = doc.y;
            doc
                .font("Helvetica-Bold")
                .fontSize(12)
                .fillColor("#333333")
                .text("Sender", 40, senderReceiverY)
                .font("Helvetica")
                .fontSize(10)
                .fillColor("#555555")
                .text(data.sender.name, 40, doc.y + 5)
                .text(data.sender.email)
                .text(data.sender.phone)
                .text(data.sender.address, { width: 200 });
            doc
                .font("Helvetica-Bold")
                .fontSize(12)
                .fillColor("#333333")
                .text("Receiver", 320, senderReceiverY)
                .font("Helvetica")
                .fontSize(10)
                .fillColor("#555555")
                .text(data.receiver.name, 320, doc.y + 5)
                .text(data.receiver.email)
                .text(data.receiver.phone)
                .text(data.receiver.address, { width: 200 });
            doc.y = Math.max(senderReceiverY + 80, doc.y);
            doc.moveDown(1);
            // Parcel Details Table
            const tableTop = doc.y;
            const colX = [40, 200, 320, 460]; // Adjusted for larger Tracking ID
            const rowHeight = 30; // Increased for better readability
            const tableWidth = 500;
            const colWidths = [160, 120, 140, 80]; // Wider Tracking ID column
            // Table Header
            doc
                .rect(40, tableTop, tableWidth, rowHeight)
                .fillAndStroke("#4CAF50", "#4CAF50");
            doc
                .font("Helvetica-Bold")
                .fontSize(10)
                .fillColor("#FFFFFF")
                .text("Tracking ID", colX[0] + 5, tableTop + 10, {
                width: colWidths[0],
            })
                .text("Weight (kg)", colX[1] + 5, tableTop + 10, {
                width: colWidths[1],
            })
                .text("Delivery Area", colX[2] + 5, tableTop + 10, {
                width: colWidths[2],
            })
                .text("Price (BDT)", colX[3] + 5, tableTop + 10, {
                width: colWidths[3],
            });
            // Table Row with Alternating Color
            doc
                .rect(40, tableTop + rowHeight, tableWidth, rowHeight)
                .fillAndStroke("#F5F5F5", "#CCCCCC");
            doc
                .font("Helvetica")
                .fontSize(10)
                .fillColor("#333333")
                .text(data.parcel.trackingId, colX[0] + 5, tableTop + rowHeight + 10, {
                width: colWidths[0],
                align: "left",
            })
                .text(`${data.parcel.weight}`, colX[1] + 5, tableTop + rowHeight + 10, {
                width: colWidths[1],
                align: "left",
            })
                .text(data.parcel.deliveryArea, colX[2] + 5, tableTop + rowHeight + 10, {
                width: colWidths[2],
                align: "left",
            })
                .text(`${data.parcel.price}`, colX[3] + 5, tableTop + rowHeight + 10, {
                width: colWidths[3],
                align: "left",
            });
            // Table Borders
            doc
                .moveTo(40, tableTop)
                .lineTo(40, tableTop + 2 * rowHeight)
                .moveTo(40 + tableWidth, tableTop)
                .lineTo(40 + tableWidth, tableTop + 2 * rowHeight);
            for (let i = 0; i < colWidths.length; i++) {
                const x = colX[i] + (i < colWidths.length ? colWidths[i] : 0);
                doc
                    .moveTo(x, tableTop)
                    .lineTo(x, tableTop + 2 * rowHeight)
                    .stroke("#CCCCCC");
            }
            doc
                .moveTo(40, tableTop)
                .lineTo(40 + tableWidth, tableTop)
                .moveTo(40, tableTop + rowHeight)
                .lineTo(40 + tableWidth, tableTop + rowHeight)
                .moveTo(40, tableTop + 2 * rowHeight)
                .lineTo(40 + tableWidth, tableTop + 2 * rowHeight)
                .stroke("#CCCCCC");
            doc.moveDown(2);
            // Payment Information
            doc
                .font("Helvetica-Bold")
                .fontSize(12)
                .fillColor("#333333")
                .text("Payment Information", 40, doc.y, { underline: true })
                .font("Helvetica")
                .fontSize(10)
                .fillColor("#555555")
                .text(`Transaction ID: ${data.payment.transactionId}`, 40, doc.y + 5)
                .text(`Status: ${data.payment.status}`)
                .moveDown(2);
            // Footer
            doc
                .font("Helvetica")
                .fontSize(9)
                .fillColor("#888888")
                .text("Thank you for using Parcel Delivery Service!", 40, doc.page.height - 80, { align: "center" });
            doc.end();
        }
        catch (error) {
            console.log(error);
            throw new AppError_1.default(500, `PDF creation error: ${error.message}`);
        }
    });
});
exports.generatePdf = generatePdf;
