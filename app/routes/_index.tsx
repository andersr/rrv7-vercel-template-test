import { redirect } from "react-router";
import { getHostUrl } from "~/.server/utils/getHostUrl";
import { ERROR_PARAM } from "~/shared/params";
import NewGameForm from "~/ui/NewGameForm";
import type { Route } from "./+types/_index";

const title = "Structured Output Demo";

export function meta({}: Route.MetaArgs) {
  return [{ title }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const error = url.searchParams.get(ERROR_PARAM);

  return {
    errorMessage: error ? "Sorry, something went wrong. Please try again." : "",
  };
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const res = await fetch(`${getHostUrl(request)}/api/games/new`);
    const data = await res.json();

    if (!data?.id) {
      throw new Error("No game id returned");
    }

    return redirect(`/games/${data.id}`);
  } catch (error) {
    console.error("error: ", error);
    return {
      errorMessage: "Sorry, something went wrong.",
    };
  }
}
export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="text-center">
      {loaderData.errorMessage && (
        <div className="py-4 text-red-500">{loaderData.errorMessage}</div>
      )}
      <h1>{title}</h1>
      <NewGameForm />
    </div>
  );
}
