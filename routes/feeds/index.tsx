import { Handlers, PageProps } from "$fresh/server.ts";
import { parseFeed } from "https://deno.land/x/rss/mod.ts";

import { getAdminPocketBase } from "../../pb_helper.ts";
import ColoredButton from "../../components/Button.tsx";
import Input from "../../components/Input.tsx";
import Header from "../../components/Header.tsx";

interface FeedData {
  url: string;
  title: string;
  site_url: string;
}

interface PageData {
  error: string;
}

const pb = await getAdminPocketBase();
export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();

    try {
      // TODO: first fetch and parse feed, then get details based on feed
      const feed_url = form.get("feed_url")?.toString() ?? "";
      const title = form.get("title")?.toString();
      const url_obj = new URL(feed_url);
      const site_url = `${url_obj.protocol}//${url_obj.hostname}`;
      console.log("creating new feed...", { feed_url, title, site_url });
      await pb?.collection("feeds").create({ url: feed_url, site_url, title });
    } catch (err) {
      console.error(err);

      const headers = new Headers();
      headers.set("location", "/feeds?error=bad_url");
      return new Response(null, { status: 303, headers });
    }

    return ctx.render({ something: "sdvda" });
  },
};

export default async function Feeds(props: PageProps<PageData>) {
  const { data } = props;

  if (!pb) {
    return (
      <div>
        <h1>Oops, feeds didn't load 😓</h1>
      </div>
    );
  }

  const records = await pb.collection("feeds").getFullList<FeedData>({
    sort: "-created",
  });

  const feed_data = await (await fetch(records[0].url)).text();
  const parsedFeed = await parseFeed(feed_data);
  console.log(parsedFeed.title);

  return (
    <div>
      <Header active="home" />
      {new URL(props.url).searchParams?.get("error") === "bad_url" && (
        <div class={"text-red"}>Bad URL :(</div>
      )}
      {records.map((f) => (
        <div>
          <a href={f.site_url}>{f.title || "Whoops"}</a>
        </div>
      ))}

      {/* <form method="post">
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
      </form> */}
    </div>
  );
}
