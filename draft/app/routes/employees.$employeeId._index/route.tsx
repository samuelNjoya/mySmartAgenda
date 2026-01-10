import { useLoaderData } from "react-router"
import { getDB } from "~/db/getDB"

export async function loader({ params }: any) {
  const db = await getDB()
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [params.employeeId])
  
  if (!employee) {
    throw new Response("Employé non trouvé", { status: 404 })
  }
  
  return { employee }
}

export default function EmployeePage() {
  const { employee } = useLoaderData()

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <div>
        <h1 style={{ marginBottom: "20px" }}>Détails de l'employé</h1>

        {/* Affichage des informations */}
        <div style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "30px",
          marginBottom: "30px"
        }}>
          {/* En-tête avec nom */}
          <div style={{
            borderBottom: "2px solid #007bff",
            paddingBottom: "15px",
            marginBottom: "25px"
          }}>
            <h2 style={{ margin: 0, color: "#007bff" }}>{employee.full_name}</h2>
            <p style={{ margin: "5px 0 0 0", color: "#666" }}>{employee.job_title}</p>
          </div>

          {/* Informations en grille */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px"
          }}>
            {/* Colonne 1 - Informations personnelles */}
            <div>
              <h3 style={{
                fontSize: "16px",
                color: "#333",
                marginBottom: "15px",
                borderBottom: "2px solid #e0e0e0",
                paddingBottom: "8px"
              }}>
                Informations personnelles
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>Email</label>
                  <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>{employee.email}</p>
                </div>

                <div>
                  <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>Téléphone</label>
                  <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
                    {employee.phone_number || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>Date de naissance</label>
                  <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
                    {employee.date_of_birth || "Non renseignée"}
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne 2 - Informations professionnelles */}
            <div>
              <h3 style={{
                fontSize: "16px",
                color: "#333",
                marginBottom: "15px",
                borderBottom: "2px solid #e0e0e0",
                paddingBottom: "8px"
              }}>
                Informations professionnelles
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>Département</label>
                  <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>{employee.department}</p>
                </div>

                <div>
                  <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>Salaire</label>
                  <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
                    {new Intl.NumberFormat('fr-FR').format(employee.salary)} FCFA
                  </p>
                </div>

                <div>
                  <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>Date de début</label>
                  <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>{employee.start_date}</p>
                </div>

                <div>
                  <label style={{ fontWeight: "600", color: "#555", fontSize: "14px" }}>Date de fin</label>
                  <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
                    {employee.end_date || "En cours"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Badge de statut */}
          <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "1px solid #e0e0e0" }}>
            <span style={{
              display: "inline-block",
              padding: "6px 16px",
              backgroundColor: employee.end_date ? "#dc3545" : "#28a745",
              color: "white",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600"
            }}>
              {employee.end_date ? "Inactif" : "Actif"}
            </span>
          </div>
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "20px" }}>
        <li>
          <a href="/employees" style={{
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
        <li>
          <a href="/employees/new" style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block"
          }}>
            New Employee
          </a>
        </li>
        <li>
          <a href="/timesheets/" style={{
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
      </ul>
    </div>
  )
}