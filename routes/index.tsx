import { useSignal } from "@preact/signals";
import { Handlers } from "$fresh/server.ts";
export const handler: Handlers = {
   GET(req, ctx) {
    const headers = new Headers();
    headers.set("location", "/feeds");
    return new Response(null, { status: 303, headers });
  },
};
export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      
    </div>
  );
}
