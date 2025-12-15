// src/types/custom.d.ts
import { User } from '@supabase/supabase-js'; // Replace `User` if necessary

declare global {
    namespace Express {
        export interface Request {
            user?: User; // Use `any` if `User` type is unavailable or replace with the correct type
        }
    }
}