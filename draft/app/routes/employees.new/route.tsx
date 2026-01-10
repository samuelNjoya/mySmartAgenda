import { redirect, type ActionFunction, useNavigation, useActionData } from "react-router";
import { getDB } from "~/db/getDB";
import EmployeeForm from "~/components/EmployeeForm";
import Spinner from "~/components/Spinner";
import Toast from "~/components/Toast";
import { useState, useEffect } from "react";

export const action: ActionFunction = async ({ request }) => {
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
    `INSERT INTO employees 
     (full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date]
  );
  
  return redirect("/employees");
};

export default function NewEmployeePage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {isSubmitting && <Spinner message="Création de l'employé en cours..." />}

      <h1 style={{ marginBottom: "20px" }}>Créer un nouvel employé</h1>

      <EmployeeForm 
        actionText="Créer l'employé"
        cancelUrl="/employees"
      />

      <hr style={{ margin: "30px 0" }} />

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