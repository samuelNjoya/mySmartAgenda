import { useLoaderData, type ActionFunction, useNavigation, Form } from "react-router"
import { getDB } from "~/db/getDB"
import EmployeeForm from "~/components/EmployeeForm";
import Spinner from "~/components/Spinner";
import Toast from "~/components/Toast";
import { useState, useEffect } from "react";

export async function loader({ params }: any) {
  const db = await getDB()
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [params.employeeId])
  
  if (!employee) {
    throw new Response("Employé non trouvé", { status: 404 })
  }
  
  return { employee }
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number") || null;
  const date_of_birth = formData.get("date_of_birth") || null;
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date") || null;

  const db = await getDB();
  
  await db.run(
    `UPDATE employees 
     SET full_name = ?, email = ?, phone_number = ?, date_of_birth = ?, 
         job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ?
     WHERE id = ?`,
    [full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date, params.employeeId]
  );
  
  // Recharger les données et retourner success
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [params.employeeId]);
  return { success: true, employee };
};

export default function EmployeePage() {
  const loaderData = useLoaderData();
  const employee = loaderData.employee;
  const [isEditing, setIsEditing] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Fix bug: Retour en mode vue après modification
  useEffect(() => {
    if (navigation.state === "idle" && isSubmitting === false && isEditing) {
      setIsEditing(false);
      setShowToast(true);
    }
  }, [navigation.state]);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      {isSubmitting && <Spinner message="Modification de l'employé en cours..." />}
      {showToast && (
        <Toast 
          message="Employé modifié avec succès !"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <h1 style={{ marginBottom: "20px" }}>
        {isEditing ? "Modifier l'employé" : "Détails de l'employé"}
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
              <h2 style={{ margin: 0, color: "#007bff" }}>{employee.full_name}</h2>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>{employee.job_title}</p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px"
            }}>
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
              Modifier cet employé
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Vue modification avec composant réutilisable */}
          <EmployeeForm 
            employee={employee}
            actionText="Enregistrer les modifications"
            cancelUrl={`/employees/${employee.id}`}
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
          <a href="/employees" style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block"
          }}>
            Liste des employés
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
            Nouvel employé
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
            Feuilles de temps
          </a>
        </li>
      </ul>
    </div>
  )
}