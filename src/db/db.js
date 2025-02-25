import Database from "better-sqlite3";
import path from "path";

// Get absolute path to the database file
const dbPath = path.join(process.cwd(), "src/db/cis_data.db");

// Initialize the database with the correct path
const db = new Database(dbPath, { verbose: console.log });

export default db;
