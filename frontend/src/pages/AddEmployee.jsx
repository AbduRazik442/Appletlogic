import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { createEmployee } from "../services/employeeApi";

const initialForm = {
  name: "",
  email: "",
  department: "",
  salary: "",
};

export default function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const departments = [
    "Engineering",
    "Human Resources",
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
    "IT",
    "Administration",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Employee name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.department) {
      newErrors.department = "Select a department";
    }

    if (
      form.salary.trim() === "" ||
      !Number.isFinite(Number(form.salary)) ||
      Number(form.salary) <= 0
    ) {
      newErrors.salary = "Salary must be greater than zero";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || !validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        department: form.department,
        salary: Number(form.salary),
      };

      await createEmployee(payload);

      navigate("/employees", {
        replace: true,
        state: {
          success: "Employee added successfully!",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee-page">
      <Link to="/employees" className="back-link">
        <ArrowLeft size={17} />
        Back to Employees
      </Link>

      <div className="page-heading">
        <div>
          <p className="eyebrow">EMPLOYEE MANAGEMENT</p>
          <h1>Add New Employee</h1>
          <p>
            Fill in the details below to create a new employee.
          </p>
        </div>
      </div>

      <div className="employee-form-card">
        <div className="form-card-header">
          <div className="form-header-icon">
            <UserPlus size={22} />
          </div>

          <div>
            <h2>Employee Information</h2>
            <p>All fields are required.</p>
          </div>
        </div>

        {error && (
          <div className="form-alert" role="alert">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="employee-form-grid">
            <div className="form-field">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <span className="field-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="employee@example.com"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span className="field-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                aria-invalid={!!errors.department}
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              {errors.department && (
                <span className="field-error">
                  {errors.department}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="salary">Monthly Salary (₹) *</label>
              <input
                id="salary"
                name="salary"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter salary"
                value={form.salary}
                onChange={handleChange}
                aria-invalid={!!errors.salary}
              />

              {errors.salary && (
                <span className="field-error">
                  {errors.salary}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <Link to="/employees" className="cancel-button">
              Cancel
            </Link>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
