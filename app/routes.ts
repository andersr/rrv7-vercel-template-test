import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// export default [
//   index("routes/home.tsx"),
//   route("foo", "routes/foo.tsx"),
// ] satisfies RouteConfig;

export default flatRoutes() satisfies RouteConfig;
