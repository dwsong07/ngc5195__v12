import { Database } from "sqlite";

declare global {
    namespace NodeJS {
        interface Global {
            db: Database;
        }
    }
}
