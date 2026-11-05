import { serve } from "inngest/next";
import { inngest, functions } from "@/src/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
