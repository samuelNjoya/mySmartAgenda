import { useLoaderData } from "react-router"
import { getDB } from "~/db/getDB"
import { useState, useMemo } from "react"

export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")
  return { employees }
}

export default function EmployeesPage() {
  const { employees } = useLoaderData()
  
  // États pour la recherche, tri, filtre et pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState("full_name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Obtenir les départements uniques pour le filtre
  const departments = useMemo(() => {
    const depts = [...new Set(employees.map((e: any) => e.department))]
    return depts.sort()
  }, [employees])

  // Filtrer et trier les employés
  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees]

    // Recherche
    if (searchTerm) {
      result = result.filter((emp: any) =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.job_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par département
    if (filterDepartment !== "all") {
      result = result.filter((emp: any) => emp.department === filterDepartment)
    }

    // Tri
    result.sort((a: any, b: any) => {
      let aVal = a[sortColumn]
      let bVal = b[sortColumn]

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [employees, searchTerm, sortColumn, sortDirection, filterDepartment])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEmployees = filteredAndSortedEmployees.slice(startIndex, startIndex + itemsPerPage)

  // Fonction pour changer le tri
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Réinitialiser la page quand on filtre/recherche
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleFilter = (value: string) => {
    setFilterDepartment(value)
    setCurrentPage(1)
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Liste des Employés</h1>

      {/* Barre de recherche et filtre */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Rechercher (nom, email, poste)..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            flex: "1",
            minWidth: "200px"
          }}
        />
        
        <select
          value={filterDepartment}
          onChange={(e) => handleFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            minWidth: "150px"
          }}
        >
          <option value="all">Tous les départements</option>
          {departments.map((dept: string) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Compteur */}
      <div style={{ marginBottom: "10px", color: "#666" }}>
        {filteredAndSortedEmployees.length} employé(s) trouvé(s)
      </div>

      {/* Tableau */}
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd"
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th
                onClick={() => handleSort("full_name")}
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                Nom {sortColumn === "full_name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("email")}
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                Email {sortColumn === "email" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("job_title")}
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                Poste {sortColumn === "job_title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("department")}
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                Département {sortColumn === "department" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("start_date")}
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                Date de début {sortColumn === "start_date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  borderBottom: "2px solid #ddd"
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                  Aucun employé trouvé
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((employee: any) => (
                <tr key={employee.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{employee.full_name}</td>
                  <td style={{ padding: "12px" }}>{employee.email}</td>
                  <td style={{ padding: "12px" }}>{employee.job_title}</td>
                  <td style={{ padding: "12px" }}>{employee.department}</td>
                  <td style={{ padding: "12px" }}>{employee.start_date}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                      <a
                        href={`/employees/${employee.id}`}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#007bff",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "3px",
                          fontSize: "12px"
                        }}
                      >
                        Voir plus
                      </a>
                     
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px"
        }}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: currentPage === 1 ? "#f5f5f5" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer"
            }}
          >
            Précédent
          </button>
          
          <span style={{ color: "#666" }}>
            Page {currentPage} sur {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: currentPage === totalPages ? "#f5f5f5" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer"
            }}
          >
            Suivant
          </button>
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />
      
      {/* Navigation */}
      <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "20px" }}>
        <li>
          <a 
            href="/employees/new"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block"
            }}
          >
            Nouvel employé
          </a>
        </li>
        <li>
          <a 
            href="/timesheets/"
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
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
  )
}