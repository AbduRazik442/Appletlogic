import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { getEmployee } from "../services/employeeApi";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getEmployee(id)
      .then(({ data }) => {
        if (active) {
          setEmployee(data.employee || data.data || data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load employee."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p>Loading employee...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!employee) return <p>Employee not found.</p>;

  const fields = [
    ["Full Name", employee.name],
    ["Email Address", employee.email],
    ["Department", employee.department],
    [
      "Salary",
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(employee.salary),
    ],
    ["Employee ID", employee._id],
    [
      "Created At",
      employee.createdAt
        ? new Date(employee.createdAt).toLocaleString("en-IN")
        : "N/A",
    ],
    [
      "Last Updated",
      employee.updatedAt
        ? new Date(employee.updatedAt).toLocaleString("en-IN")
        : "N/A",
    ],
  ];

  return (
    <div className="add-employee-page">
      <Link to="/employees" className="back-link">
        <ArrowLeft size={17} />
        Back to Employees
      </Link>

      <div className="page-heading">
        <div>
          <p className="eyebrow">EMPLOYEE PROFILE</p>
          <h1>{employee.name}</h1>
          <p>Employee information and records</p>
        </div>

        <Link
          to={`/employees/${id}/edit`}
          className="primary-button"
        >
          <Pencil size={17} />
          Edit Employee
        </Link>
      </div>

      <section className="employee-form-card">
        <h2>Employee Details</h2>

        <div className="employee-details-grid">
          {fields.map(([label, value]) => (
            <div className="detail-field" key={label}>
              <span>{label}</span>
              <strong>{value || "N/A"}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}