 
const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;


///////////////////


module.exports = { session: process.env.SESSION_ID || 'Byte;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSUVOa29WYVNlbFlhbU5xREM3ajBZLzBhbnZOZ3BTak1BTGRvRFlRbTVVST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMEZobGdZa01iMS9abTlEdmszbjFJVHdYMEtIakFCVXE0K3IrVy9rMUloQT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0SFRRZnN1LzhRTmt2bmFGaERWSGhjN1RFbEQ3WjByWE1ZWVBGb3hNckdrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhSGtVWnRjaVYxZWNFRHpmOHQ0dWxKTFZDTlRWTVVlOG9IMk4vUUZhRlJJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdOeTdSV1hCWDd4cFU0NTE0QWRQL085RFNlYjB1TEIxVHBwS2h3R283a2M9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImhvRGxhaUNlSXRsR3gycXhnUDJRNVdINU1uODZVNWpQM2Q2L0EzaGNYa3c9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTUEwZm56ZytzSFhKRXdad3JyMUU3TnpobHZ5Y1VVOC96ZHlydXAzY3JtOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRXVVeVFNOXU4N2FnckFzdU8zdG5sMjBYbkZyL3hXRFExMlhCeTVDOXFTTT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJVVzN6TXptMklMazZENm15YS9TVUh2ZVNmMmExSm9XYjJOeE5uRHNzUjZnLzhxaDRRUE02VkZCV0MxVWhrRVhkTmtQdVZYM01PaStiQi91dHJsNWlRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTI5LCJhZHZTZWNyZXRLZXkiOiIrUTJsZ1VNS3RiMUVaUGFrL3lnT09zbDdwM3JUK3BrYWZIUHR3MFRoUy9vPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJacUdfdzBSRVI5R2lsWGJDRFhsdG9RIiwicGhvbmVJZCI6ImIzOTE0NDY2LTA0NTAtNDgzYS05NjAxLTlhZmE0MGYwYmZmMiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJIUG1FNml1OXVHN2Y0YVZSY3BOczBDQzNaY1E9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibzVrRzZZS2lLWVc0cld0dUFSUWxzNnlMYlJvPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjZRSEhERUpFIiwibWUiOnsiaWQiOiIyMzQ4MTEzOTAzNTg0OjFAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoicHJpbmNlX0FDVElWRSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSmpBbU5rR0VMMlgvYllHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiUW9KUTNqbWd1UUtOKzJoc3o0c2E0dWRvdCtHL1VvMDBLMDBXL1VHa1JpTT0iLCJhY2NvdW50U2lnbmF0dXJlIjoibmxoaCtWUFJycHdCVWh3Y3ltWjZMdlRzU1MwRTM1TFlIcTdYS3BFMnlscnJRSmJzU29iSStFRUJEcnRvNTNxR0JlVHluQjhrQzYvd2JrODJOR3N6RHc9PSIsImRldmljZVNpZ25hdHVyZSI6InhzMzNlcUhtN0NGNmdSR0c2dS9BQnY5VVF0MUhGbW5TMnVqcVFYV29TdHpacTU4Sk94V2hqaUpRRHcxUFdndGVyRGNLMlpHQUwzd3QrcU8zMXUxdGlBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0ODExMzkwMzU4NDoxQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlVLQ1VONDVvTGtDamZ0b2JNK0xHdUxuYUxmaHYxS05OQ3RORnYxQnBFWWoifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjU5MDk5NjN9',

////////////////////////////////



    PREFIXE: process.env.PREFIX || ".",



///////////////////////////
    A_REACT : process.env.AUTO_REACTION || 'on',
    CHATBOT: process.env.CHAT_BOT || "off",
    OWNER_NAME: process.env.OWNER_NAME || "TALKDROVE",
    NUMERO_OWNER : process.env.OWNER_NUMBER || "923072380380",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'BYTE-MD',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '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',
    URL : process.env.BOT_MENU_LINKS || 'https://raw.githubusercontent.com/HyHamza/HyHamza/main/Images/BYTE-MD-LITE.jpeg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Update ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
