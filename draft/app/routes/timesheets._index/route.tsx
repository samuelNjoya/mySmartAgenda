import { useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name FROM timesheets JOIN employees ON timesheets.employee_id = employees.id ORDER BY timesheets.start_time DESC"
  );
  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [isTableView, setIsTableView] = useState(true);
  const [calendarLoaded, setCalendarLoaded] = useState(false);
  const [calendarError, setCalendarError] = useState(null);

  // Charger le calendrier uniquement côté client
  useEffect(() => {
    if (!isTableView && !calendarLoaded) {
      let isMounted = true;

      const loadCalendar = async () => {
        try {
          console.log("Début du chargement du calendrier...");
          
          const [calendarModule, reactModule] = await Promise.all([
            import('@schedule-x/calendar'),
            import('@schedule-x/react')
          ]);

          // Import du CSS séparément
          await import('@schedule-x/theme-default/dist/index.css');

          if (!isMounted) return;

          console.log("Modules chargés, création du calendrier...");

          const { createCalendar, createViewWeek, createViewMonthGrid } = calendarModule;
          const { ScheduleXCalendar } = reactModule;

          // Créer les événements
          const calendarEvents = timesheetsAndEmployees.map((timesheet) => ({
            id: String(timesheet.id),
            title: `${timesheet.full_name}${timesheet.summary ? ' - ' + timesheet.summary : ''}`,
            start: timesheet.start_time.replace(' ', 'T'),
            end: timesheet.end_time.replace(' ', 'T'),
          }));

          console.log("Événements créés:", calendarEvents.length);

          // Créer le calendrier
          const calendar = createCalendar({
            views: [createViewWeek(), createViewMonthGrid()],
            events: calendarEvents,
            defaultView: 'week',
          });

          console.log("Calendrier créé avec succès");

          // Attacher le calendrier au DOM
          const calendarContainer = document.getElementById('calendar-container');
          if (calendarContainer) {
            calendar.render(calendarContainer);
            setCalendarLoaded(true);
            console.log("Calendrier rendu dans le DOM");
          } else {
            console.error("Container du calendrier non trouvé");
          }
        } catch (error) {
          console.error("Erreur lors du chargement du calendrier:", error);
          setCalendarError(error.message);
        }
      };

      loadCalendar();

      return () => {
        isMounted = false;
      };
    }
  }, [isTableView, calendarLoaded, timesheetsAndEmployees]);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Feuilles de temps</h1>

      {/* Toggle buttons */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setIsTableView(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: isTableView ? "#007bff" : "#e0e0e0",
            color: isTableView ? "white" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Vue Tableau
        </button>
        <button
          onClick={() => setIsTableView(false)}
          style={{
            padding: "10px 20px",
            backgroundColor: !isTableView ? "#007bff" : "#e0e0e0",
            color: !isTableView ? "white" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Vue Calendrier
        </button>
      </div>

      {isTableView ? (
        /* Vue Tableau */
        <div>
          <div style={{ marginBottom: "10px", color: "#666" }}>
            {timesheetsAndEmployees.length} feuille(s) de temps
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd"
                  }}>
                    Employé
                  </th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd"
                  }}>
                    Début
                  </th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd"
                  }}>
                    Fin
                  </th>
                  <th style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd"
                  }}>
                    Résumé
                  </th>
                  <th style={{
                    padding: "12px",
                    textAlign: "center",
                    borderBottom: "2px solid #ddd"
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {timesheetsAndEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                      Aucune feuille de temps trouvée
                    </td>
                  </tr>
                ) : (
                  timesheetsAndEmployees.map((timesheet: any) => (
                    <tr key={timesheet.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px" }}>{timesheet.full_name}</td>
                      <td style={{ padding: "12px" }}>{timesheet.start_time}</td>
                      <td style={{ padding: "12px" }}>{timesheet.end_time}</td>
                      <td style={{ padding: "12px" }}>{timesheet.summary || "-"}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <a
                          href={`/timesheets/${timesheet.id}`}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#007bff",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "3px",
                            fontSize: "12px"
                          }}
                        >
                          Voir
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Vue Calendrier */
        <div>
          {calendarError ? (
            <div style={{
              padding: "20px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              border: "1px solid #f5c6cb",
              borderRadius: "4px"
            }}>
              <strong>Erreur:</strong> {calendarError}
              <br />
              <button
                onClick={() => {
                  setCalendarError(null);
                  setCalendarLoaded(false);
                }}
                style={{
                  marginTop: "10px",
                  padding: "5px 15px",
                  backgroundColor: "#721c24",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer"
                }}
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div
              id="calendar-container"
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                overflow: "hidden",
                minHeight: "600px"
              }}
            >
              {!calendarLoaded && (
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "600px",
                  color: "#666",
                  fontSize: "16px"
                }}>
                  Chargement du calendrier...
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      <ul style={{ listStyle: "none", padding: 0, display: "flex", gap: "20px" }}>
        <li>
          <a
            href="/timesheets/new"
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block"
            }}
          >
            Nouvelle feuille de temps
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