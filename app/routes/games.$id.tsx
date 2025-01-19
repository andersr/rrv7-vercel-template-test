import type { Route } from "./+types/games.$id";

export async function loader({ params }: Route.LoaderArgs) {
  console.log("params: ", params);

  return {
    id: params?.id,
  };
}

export default function GameDetails({ loaderData }: Route.ComponentProps) {
  console.log("loaderData: ", loaderData);

  return <div>DETAILS</div>;
  //        ^ string
}
