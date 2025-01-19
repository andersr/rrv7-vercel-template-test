import { useSearchParams } from "react-router";
import type { Route } from "./+types/games.$id";

export async function loader({ params, request }: Route.LoaderArgs) {
  console.log("params: ", params);
  const url = new URL(request.url);
  const foo = url.searchParams.get("foo");
  console.log("foo: ", foo);

  return {
    id: params?.id,
  };
}

export default function GameDetails({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log("loaderData: ", loaderData);

  function handleParams() {
    const params = {
      foo: "bar",
    };
    setSearchParams(params);
  }

  return (
    <div>
      <h1>Details</h1>
      <div>
        <button onClick={handleParams}>Set test</button>
      </div>
    </div>
  );
}
