import { useLoaderData } from "react-router"
import { getDB } from "~/db/getDB"

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
  
  return { timesheet }
}

export default function TimesheetPage() {
  const { timesheet } = useLoaderData()

  // Calculer la durée
  const start = new Date(timesheet.start_time)
  const end = new Date(timesheet.end_time)
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Détails de la feuille de temps</h1>

      <div style={{
        backgroundColor: "#f8f9fa",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "30px",
        marginBottom: "30px"
      }}>
        {/* En-tête */}
        <div style={{
          borderBottom: "2px solid #007bff",
          paddingBottom: "15px",
          marginBottom: "25px"
        }}>
          <h2 style={{ margin: 0, color: "#007bff" }}>{timesheet.full_name}</h2>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>{timesheet.job_title}</p>
        </div>

        {/* Informations */}
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
            Timesheets
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
            New Timesheet
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
            Employees
          </a>
        </li>
      </ul>
    </div>
  )
}