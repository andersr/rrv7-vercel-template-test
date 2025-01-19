import { Link } from "react-router";

export function Welcome({ message }: { message: string }) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <Link to="/foo">FOO</Link>
    </main>
  );
}
