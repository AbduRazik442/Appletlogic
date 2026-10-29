import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Users } from "lucide-react";
import { getEmployees } from "../services/employeeApi";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function EmployeeTable({
  employees: providedEmployees,
  onView,
  onEdit,
  onDelete,
}) {
  const [fetchedEmployees, setFetchedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    if (Array.isArray(providedEmployees)) {
      setLoading(false);
      return;
    }

    let active = true;

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await getEmployees();

        console.log("EmployeeTable API Response:", data);

        const employeeList = Array.isArray(data)
          ? data
          : Array.isArray(data?.employees)
            ? data.employees
            : Array.isArray(data?.data)
              ? data.data
              : null;

        if (!employeeList) {
          throw new Error("Unexpected employee API response format");
        }

        if (active) {
          setFetchedEmployees(employeeList);
        }
      } catch (err) {
        console.error("EmployeeTable Error:", err);

        if (active) {
          setFetchedEmployees([]);
          setError(
            err.response?.data?.message ||
              "Unable to load employees."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEmployees();

    return () => {
      active = false;
    };
  }, [providedEmployees]);

  // Use parent data when supplied, otherwise use fetched data.
  const employees = Array.isArray(providedEmployees)
    ? providedEmployees
    : fetchedEmployees;

  if (loading && !Array.isArray(providedEmployees)) {
    return (
      <div className="employee-empty">
        <p>Loading employees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-empty">
        <p role="alert">{error}</p>
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className="employee-empty">
        <Users size={36} />
        <h3>No employees found</h3>
        <p>Try another search or add a new employee.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>
                <div className="employee-name-cell">
                  <div className="employee-avatar">
                    {employee.name?.charAt(0).toUpperCase()}
                  </div>

                  <strong>{employee.name}</strong>
                </div>
              </td>

              <td>{employee.email}</td>

              <td>
                <span className="department-badge">
                  {employee.department}
                </span>
              </td>

              <td className="salary-cell">
                {currency(employee.salary)}
              </td>

              <td>
                <div className="table-actions">
                  <button
                    className="action-btn"
                    title="View employee"
                    aria-label={`View ${employee.name}`}
                    onClick={() => onView?.(employee._id)}
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    className="action-btn edit"
                    title="Edit employee"
                    aria-label={`Edit ${employee.name}`}
                    onClick={() => onEdit?.(employee._id)}
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="action-btn delete"
                    title="Delete employee"
                    aria-label={`Delete ${employee.name}`}
                    onClick={() => onDelete?.(employee)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
