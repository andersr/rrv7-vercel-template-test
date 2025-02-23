import { Form, useNavigation } from "react-router";
import { twMerge } from "tailwind-merge";

export default function NewGameForm() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <>
      <Form method="post">
        <button
          type="submit"
          disabled={isNavigating}
          className={twMerge("btn disabled:text-white")}
        >
          {isNavigating ? "Creating game..." : "New Trivia Game"}
        </button>
      </Form>
      {isNavigating && (
        <div role="alert" aria-busy="true" className="mt-4 text-sm">
          This might take a moment...
        </div>
      )}
    </>
  );
}
