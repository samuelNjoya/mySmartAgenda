import { Form } from "react-router";

interface EmployeeFormProps {
  employee?: any;
  actionText: string;
  cancelUrl: string;
}

export default function EmployeeForm({ employee, actionText, cancelUrl }: EmployeeFormProps) {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const dateOfBirth = form.date_of_birth.value;
    const salary = parseFloat(form.salary.value);
    
    // Validation âge > 18 ans (Bonus 3)
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      if (age < 18) {
        e.preventDefault();
        alert("L'employé doit avoir au moins 18 ans");
        return false;
      }
    }
    
    // Validation salaire minimum (Bonus 3) - SMIG Cameroun ~36 000 FCFA
    const SALAIRE_MINIMUM = 36000;
    if (salary < SALAIRE_MINIMUM) {
      e.preventDefault();
      alert(`Le salaire doit être supérieur ou égal au salaire minimum (${SALAIRE_MINIMUM.toLocaleString('fr-FR')} FCFA)`);
      return false;
    }
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
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
              defaultValue={employee?.full_name || ""}
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
              defaultValue={employee?.email || ""}
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
              defaultValue={employee?.phone_number || ""}
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
              defaultValue={employee?.date_of_birth || ""}
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
              defaultValue={employee?.job_title || ""}
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
              defaultValue={employee?.department || ""}
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
              defaultValue={employee?.salary || ""}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            />
            <small style={{ color: "#666", fontSize: "12px" }}>
              Salaire minimum: 36 000 FCFA
            </small>
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
              defaultValue={employee?.start_date || ""}
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
              defaultValue={employee?.end_date || ""}
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

      <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>
        <span style={{ color: "red" }}>*</span> Champs obligatoires
      </p>

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
          {actionText}
        </button>
        
        <a
          href={cancelUrl}
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
  );
}