import { useLoaderData, Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees ORDER BY full_name');
  return { employees };
}

import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary") || null;

  // Validation côté serveur
  if (!employee_id || !start_time || !end_time) {
    return { error: "Tous les champs obligatoires doivent être remplis" };
  }

  // Validation : start_time doit être avant end_time (Bonus 9)
  const startDate = new Date(start_time as string);
  const endDate = new Date(end_time as string);
  
  if (startDate >= endDate) {
    return { error: "L'heure de fin doit être après l'heure de début" };
  }

  const db = await getDB();
  
  try {
    await db.run(
      'INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)',
      [employee_id, start_time, end_time, summary]
    );
    
    return redirect("/timesheets");
  } catch (error) {
    return { error: "Erreur lors de la création de la feuille de temps" };
  }
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData();

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Créer une nouvelle feuille de temps</h1>

      <Form method="post">
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
          
          {/* Dropdown employés (Requirement 9) */}
          <div>
            <label htmlFor="employee_id" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Employé <span style={{ color: "red" }}>*</span>
            </label>
            <select
              name="employee_id"
              id="employee_id"
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            >
              <option value="">Sélectionner un employé</option>
              {employees.map((employee: any) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Heure de début (Requirement 8) */}
          <div>
            <label htmlFor="start_time" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Heure de début <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="datetime-local"
              name="start_time"
              id="start_time"
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
          </div>

          {/* Heure de fin (Requirement 8) */}
          <div>
            <label htmlFor="end_time" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Heure de fin <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="datetime-local"
              name="end_time"
              id="end_time"
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
          </div>

          {/* Résumé du travail (Bonus 10) */}
          <div>
            <label htmlFor="summary" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Résumé du travail
            </label>
            <textarea
              name="summary"
              id="summary"
              rows={4}
              placeholder="Décrivez le travail effectué..."
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
          </div>
        </div>

        {/* Note de champs obligatoires */}
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>
          <span style={{ color: "red" }}>*</span> Champs obligatoires
        </p>

        {/* Boutons d'action */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 30px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Créer la feuille de temps
          </button>
          
          <a
            href="/timesheets"
            style={{
              padding: "10px 30px",
              backgroundColor: "#6c757d",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "14px",
              display: "inline-block",
              fontWeight: "500"
            }}
          >
            Annuler
          </a>
        </div>
      </Form>

      <hr style={{ margin: "30px 0" }} />

      {/* Navigation (Requirement 10) */}
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