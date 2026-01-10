import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  // Récupérer tous les champs
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone_number = formData.get("phone_number") || null;
  const date_of_birth = formData.get("date_of_birth") || null;
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = formData.get("salary");
  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date") || null;

  // Validation côté serveur
  if (!full_name || !email || !job_title || !department || !salary || !start_date) {
    return { error: "Tous les champs obligatoires doivent être remplis" };
  }

  // Validation email simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email as string)) {
    return { error: "Email invalide" };
  }

  const db = await getDB();
  
  try {
    await db.run(
      `INSERT INTO employees 
       (full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date]
    );
    
    return redirect("/employees");
  } catch (error: any) {
    // Gestion de l'erreur email unique
    if (error.message?.includes('UNIQUE constraint failed')) {
      return { error: "Cet email est déjà utilisé" };
    }
    return { error: "Erreur lors de la création de l'employé" };
  }
};

export default function NewEmployeePage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Créer un nouvel employé</h1>

      <Form method="post">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px"
        }}>
          {/* Colonne 1 - Informations personnelles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <h3 style={{ 
              marginBottom: "5px", 
              color: "#333", 
              fontSize: "16px",
              borderBottom: "2px solid #f5f5f5",
              paddingBottom: "5px"
            }}>
              Informations personnelles
            </h3>

            <div>
              <label htmlFor="full_name" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Nom complet <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
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

            <div>
              <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
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

            <div>
              <label htmlFor="phone_number" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Téléphone
              </label>
              <input
                type="tel"
                name="phone_number"
                id="phone_number"
                placeholder="+237 6 XX XX XX XX"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label htmlFor="date_of_birth" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Date de naissance
              </label>
              <input
                type="date"
                name="date_of_birth"
                id="date_of_birth"
                max={new Date().toISOString().split('T')[0]}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>

          {/* Colonne 2 - Informations professionnelles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <h3 style={{ 
              marginBottom: "5px", 
              color: "#333", 
              fontSize: "16px",
              borderBottom: "2px solid #f5f5f5",
              paddingBottom: "5px"
            }}>
              Informations professionnelles
            </h3>

            <div>
              <label htmlFor="job_title" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Poste <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="job_title"
                id="job_title"
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

            <div>
              <label htmlFor="department" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Département <span style={{ color: "red" }}>*</span>
              </label>
              <select
                name="department"
                id="department"
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              >
                <option value="">Sélectionner un département</option>
                <option value="IT">IT</option>
                <option value="Management">Management</option>
                <option value="Design">Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label htmlFor="salary" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Salaire (FCFA) <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="number"
                name="salary"
                id="salary"
                required
                min="0"
                step="0.01"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <label htmlFor="start_date" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Date de début <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                name="start_date"
                id="start_date"
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

            <div>
              <label htmlFor="end_date" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Date de fin (optionnel)
              </label>
              <input
                type="date"
                name="end_date"
                id="end_date"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>
          </div>
        </div>

        {/* Note de champs obligatoires */}
        <p style={{ 
          fontSize: "12px", 
          color: "#666", 
          marginBottom: "20px" 
        }}>
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
            Créer l'employé
          </button>
          
          <a
            href="/employees"
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

      {/* Navigation */}
      <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "20px" }}>
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
            Liste des employés
          </a>
        </li>
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
      </ul>
    </div>
  );
}