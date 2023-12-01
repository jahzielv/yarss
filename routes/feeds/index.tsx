import { Handlers, PageProps } from "$fresh/server.ts";
import { parseFeed } from "https://deno.land/x/rss@0.5.8/mod.ts";

import { getAdminPocketBase } from "../../pb_helper.ts";
import ColoredButton from "../../components/Button.tsx";
import Input from "../../components/Input.tsx";
import Header from "../../components/Header.tsx";
import PocketBase from "pb";

interface FeedData {
  url: string;
  title: string;
  site_url: string;
  last_visited: Date;
  new_post_count: number;
}

interface PageData {
  error: string;
}

const pb: PocketBase = await getAdminPocketBase();
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

  const records: Array<FeedData> = await pb.collection("feeds").getFullList<
    FeedData
  >({
    sort: "-created",
  });

  if (records.length > 0) {
    const feed_data = await (await fetch(records[0].url)).text();
    const parsedFeed = await parseFeed(feed_data);
    await pb.collection("feeds")
    console.log(
      parsedFeed.title,
      parsedFeed.updateDate,
      parsedFeed.entries[0].published,
    );
    if (
      records[0].last_visited < (parsedFeed.entries[0].published ?? new Date())
    ) {
      console.log("gottem");
      records[0].new_post_count = (records[0].new_post_count ?? 0) + 1;
    }
  }

  return (
    <div class="overflow-hidden">
      <Header active="home" />
      {new URL(props.url).searchParams?.get("error") === "bad_url" && (
        <div class={"text-red"}>Bad URL :(</div>
      )}
      {records?.map((f: FeedData) => (
        <div class="p-10">
          <a href={f.site_url}>{f.title || "Whoops"}</a>
          {f.new_post_count && (<p>New posts: {f.new_post_count}</p>)}
        </div>
      ))}
    </div>
  );
}
