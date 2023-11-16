import { type Signal, useSignal } from "@preact/signals";
import Input from "../components/Input.tsx";
import ColoredButton from "../components/Button.tsx";
import IconX from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/x.tsx"

export default function AddFeed() {
  const open = useSignal(false);
  return (
    <div class="flex gap-8 py-6">
      {
        /* <Button onClick={() => props.count.value -= 1}>-1</Button>
      <p class="text-3xl">{props.count}</p>
      <Button onClick={() => props.count.value += 1}>+1</Button> */
      }
      <ColoredButton onClick={() => open.value = !open.value}>Add Feed</ColoredButton>
      {open.value && (
        <div class={"absolute mt-12"}>
          <form method="post">
            <button onClick={() => open.value = false}><IconX /></button>
            <div class="flex flex-col w-1/2 gap-1">
              <Input
                disabled={false}
                type="text"
                name="title"
                value=""
                placeholder={"title"}
              />
              <Input
                disabled={false}
                type="text"
                name="feed_url"
                value=""
                placeholder={"url"}
              />
              <ColoredButton>Add New Feed</ColoredButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
