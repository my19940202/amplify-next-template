import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TodosClient from "../todos-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-lg p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">My todos</h1>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700"
          >
            Sign out
          </button>
        </form>
      </div>

      <p className="mb-4 text-sm text-slate-500">Signed in as {user.email}</p>

      <TodosClient initialTodos={todos || []} />

      <p className="mt-8 text-center text-xs text-slate-400">
        Demo dashboard ·{" "}
        <a href="/map" className="text-brand-600 underline">
          Open map workspace
        </a>
      </p>
    </main>
  );
}
