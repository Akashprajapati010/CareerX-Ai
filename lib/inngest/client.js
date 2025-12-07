import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
     id: "carrerx", 
     name: "CareerX",
    credentials: {
        grmini: {
            apikey: process.env.GEMINI_API_KEY,
        },
    }, });