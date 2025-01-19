import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Foo Route" },
    { name: "description", content: "Welcome to FOO" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_VERCEL };
}

export default function FooRoute({ loaderData }: Route.ComponentProps) {
  return <div>FOO ROUTE</div>;
}
