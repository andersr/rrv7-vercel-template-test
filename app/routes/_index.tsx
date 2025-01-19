import { Form, Link, redirect } from "react-router";
import { generateId } from "~/lib/generateId";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_VERCEL };
}

export async function action({ request }: Route.ActionArgs) {
  // let formData = await request.formData();
  // let title = formData.get("title");
  const id = generateId();
  // let project = await fakeDb.updateProject({ title });
  return redirect(`/games/${id}`);
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="p-4">
      <h1>Project</h1>
      <Form method="post">
        <button type="submit">Submit</button>
      </Form>
      <div>
        <Link to="/foo">FOO</Link>
      </div>
    </main>
  );
}
