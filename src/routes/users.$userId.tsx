import { apiClient } from "@/utils/apiClient";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params: { userId } }) => {
    return await apiClient
      .get(`/users/${userId}`)
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        throw new Error("Failed to fetch user");
      });
  },
  component: UserComponent,
});

function UserComponent() {
  const user = Route.useLoaderData().data;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
