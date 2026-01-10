import { useLoaderData, redirect, useNavigation } from "react-router";
import { getDB } from "~/db/getDB";
import TimesheetForm from "~/components/TimesheetForm";
import Spinner from "~/components/Spinner";
import type { ActionFunction } from "react-router";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees ORDER BY full_name');
  return { employees };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary") || null;

  const db = await getDB();
  
  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)',
    [employee_id, start_time, end_time, summary]
  );
  
  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {isSubmitting && <Spinner message="Création de la feuille de temps en cours..." />}

      <h1 style={{ marginBottom: "20px" }}>Créer une nouvelle feuille de temps</h1>

      <TimesheetForm 
        employees={employees}
        actionText="Créer la feuille de temps"
        cancelUrl="/timesheets"
      />

      <hr style={{ margin: "30px 0" }} />

      <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "20px" }}>
        <li>
          <a
            href="/timesheets"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block"
            }}
          >
            Feuilles de temps
          </a>
        </li>
        <li>
          <a
            href="/employees"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block"
            }}
          >
            Employés
          </a>
        </li>
      </ul>
    </div>
  );
}