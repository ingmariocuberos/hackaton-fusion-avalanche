/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { avaxCurrencyConversion } from './avax-currency-conversion/avaxCurrencyConversion';
import { groqPdf } from './groq/groqPdf';
import { getFilesFromStorage } from './get-files-from-storage/getFilesFromStorage';


initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export { avaxCurrencyConversion, groqPdf, getFilesFromStorage };
