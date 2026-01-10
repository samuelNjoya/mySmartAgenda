import { useLoaderData, type ActionFunction, useNavigation } from "react-router"
import { getDB } from "~/db/getDB"
import TimesheetForm from "~/components/TimesheetForm";
import Spinner from "~/components/Spinner";
import Toast from "~/components/Toast";
import { useState, useEffect } from "react";

export async function loader({ params }: any) {
  const db = await getDB()
  
  const timesheet = await db.get(
    `SELECT timesheets.*, employees.full_name, employees.job_title 
     FROM timesheets 
     JOIN employees ON timesheets.employee_id = employees.id 
     WHERE timesheets.id = ?`,
    [params.timesheetId]
  )
  
  if (!timesheet) {
    throw new Response("Feuille de temps non trouvée", { status: 404 })
  }
  
  const employees = await db.all('SELECT id, full_name FROM employees ORDER BY full_name');
  
  return { timesheet, employees }
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary") || null;

  const db = await getDB();
  
  await db.run(
    `UPDATE timesheets 
     SET employee_id = ?, start_time = ?, end_time = ?, summary = ?
     WHERE id = ?`,
    [employee_id, start_time, end_time, summary, params.timesheetId]
  );
  
  // Recharger les données
  const timesheet = await db.get(
    `SELECT timesheets.*, employees.full_name, employees.job_title 
     FROM timesheets 
     JOIN employees ON timesheets.employee_id = employees.id 
     WHERE timesheets.id = ?`,
    [params.timesheetId]
  );
  const employees = await db.all('SELECT id, full_name FROM employees ORDER BY full_name');
  
  return { success: true, timesheet, employees };
};

export default function TimesheetPage() {
  const loaderData = useLoaderData();
  const timesheet = loaderData.timesheet;
  const employees = loaderData.employees;
  const [isEditing, setIsEditing] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Calculer la durée
  const start = new Date(timesheet.start_time)
  const end = new Date(timesheet.end_time)
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

  // Fix bug: Retour en mode vue après modification
  useEffect(() => {
    if (navigation.state === "idle" && isSubmitting === false && isEditing) {
      setIsEditing(false);
      setShowToast(true);
    }
  }, [navigation.state]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {isSubmitting && <Spinner message="Modification de la feuille de temps en cours..." />}
      {showToast && (
        <Toast 
          message="Feuille de temps modifiée avec succès !"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <h1 style={{ marginBottom: "20px" }}>
        {isEditing ? "Modifier la feuille de temps" : "Détails de la feuille de temps"}
      </h1>

      {!isEditing ? (
        <>
          {/* Vue détails */}
          <div style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "30px",
            marginBottom: "20px"
          }}>
            <div style={{
              borderBottom: "2px solid #007bff",
              paddingBottom: "15px",
              marginBottom: "25px"
            }}>
              <h2 style={{ margin: 0, color: "#007bff" }}>{timesheet.full_name}</h2>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>{timesheet.job_title}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>
                  Date et heure de début
                </label>
                <p style={{ margin: "4px 0 0 0", fontSize: "16px" }}>
                  {timesheet.start_time}
                </p>
              </div>

              <div>
                <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>
                  Date et heure de fin
                </label>
                <p style={{ margin: "4px 0 0 0", fontSize: "16px" }}>
                  {timesheet.end_time}
                </p>
              </div>

              <div>
                <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>
                  Durée
                </label>
                <p style={{ margin: "4px 0 0 0", fontSize: "16px" }}>
                  {durationHours.toFixed(1)} heure{durationHours > 1 ? 's' : ''}
                </p>
              </div>

              {timesheet.summary && (
                <div>
                  <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>
                    Résumé du travail
                  </label>
                  <p style={{ 
                    margin: "4px 0 0 0", 
                    fontSize: "14px",
                    padding: "10px",
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px"
                  }}>
                    {timesheet.summary}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: "10px 25px",
                backgroundColor: "#ffc107",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Modifier cette feuille de temps
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Vue modification avec composant réutilisable */}
          <TimesheetForm 
            timesheet={timesheet}
            employees={employees}
            actionText="Enregistrer les modifications"
            cancelUrl={`/timesheets/${timesheet.id}`}
          />

          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                padding: "10px 25px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Annuler la modification
            </button>
          </div>
        </>
      )}

      <hr style={{ margin: "30px 0" }} />

      <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "20px" }}>
        <li>
          <a href="/timesheets" style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block"
          }}>
            Feuilles de temps
          </a>
        </li>
        <li>
          <a href="/timesheets/new" style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block"
          }}>
            Nouvelle feuille de temps
          </a>
        </li>
        <li>
          <a href="/employees/" style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block"
          }}>
            Employés
          </a>
        </li>
      </ul>
    </div>
  )
}