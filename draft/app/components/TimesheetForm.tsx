import { Form } from "react-router";

interface TimesheetFormProps {
  timesheet?: any;
  employees: any[];
  actionText: string;
  cancelUrl: string;
}

export default function TimesheetForm({ timesheet, employees, actionText, cancelUrl }: TimesheetFormProps) {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const startTime = form.start_time.value;
    const endTime = form.end_time.value;
    
    // Validation start_time < end_time (Bonus 9)
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (start >= end) {
        e.preventDefault();
        alert("L'heure de fin doit être après l'heure de début");
        return false;
      }
    }
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
        
        {/* Dropdown employés */}
        <div>
          <label htmlFor="employee_id" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Employé <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="employee_id"
            id="employee_id"
            required
            defaultValue={timesheet?.employee_id || ""}
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

        {/* Heure de début */}
        <div>
          <label htmlFor="start_time" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Heure de début <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="datetime-local"
            name="start_time"
            id="start_time"
            required
            defaultValue={timesheet?.start_time?.replace(' ', 'T') || ""}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Heure de fin */}
        <div>
          <label htmlFor="end_time" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Heure de fin <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="datetime-local"
            name="end_time"
            id="end_time"
            required
            defaultValue={timesheet?.end_time?.replace(' ', 'T') || ""}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
          <small style={{ color: "#666", fontSize: "12px" }}>
            Doit être après l'heure de début
          </small>
        </div>

        {/* Résumé du travail */}
        <div>
          <label htmlFor="summary" style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
            Résumé du travail
          </label>
          <textarea
            name="summary"
            id="summary"
            rows={4}
            placeholder="Décrivez le travail effectué..."
            defaultValue={timesheet?.summary || ""}
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