import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getEmployee,
  updateEmployee,
} from "../services/employeeApi";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadEmployee = async () => {
      try {
        const { data } = await getEmployee(id);
        const employee = data.employee || data.data || data;

        if (active) {
          setForm({
            name: employee.name ?? "",
            email: employee.email ?? "",
            department: employee.department ?? "",
            salary: String(employee.salary ?? ""),
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Failed to load employee."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEmployee();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    setError("");

    if (
      !form.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      !form.department.trim() ||
      form.salary.trim() === "" ||
      !Number.isFinite(Number(form.salary)) ||
      Number(form.salary) <= 0
    ) {
      setError("Please enter valid employee details.");
      return;
    }

    setSaving(true);

    try {
      await updateEmployee(id, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        department: form.department.trim(),
        salary: Number(form.salary),
      });

      navigate("/employees", {
        state: { success: "Employee updated successfully." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update employee."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading employee details...</p>;

  return (
    <div className="add-employee-page">
      <Link to="/employees" className="back-link">
        <ArrowLeft size={17} />
        Back to Employees
      </Link>

      <div className="page-heading">
        <div>
          <p className="eyebrow">EMPLOYEE MANAGEMENT</p>
          <h1>Edit Employee</h1>
          <p>Update employee information.</p>
        </div>
      </div>

      <div className="employee-form-card">
        {error && (
          <div className="form-alert" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="employee-form-grid">
            <div className="form-field">
              <label htmlFor="edit-name">Full Name</label>
              <input
                id="edit-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-department">Department</label>
              <input
                id="edit-department"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-salary">Salary</label>
              <input
                id="edit-salary"
                name="salary"
                type="number"
                min="0.01"
                step="0.01"
                value={form.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/employees" className="cancel-button">
              Cancel
            </Link>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              <Save size={17} />
              {saving ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
