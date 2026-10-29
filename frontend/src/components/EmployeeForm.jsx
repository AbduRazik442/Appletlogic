import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  department: "",
  salary: "",
};

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  saving,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(
      employee
        ? {
            name: employee.name,
            email: employee.email,
            department: employee.department,
            salary: employee.salary,
          }
        : initialForm
    );
  }, [employee]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSubmit({
      ...form,
      salary: Number(form.salary),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{employee ? "Edit Employee" : "Add Employee"}</h2>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="department"
        placeholder="Department"
        value={form.department}
        onChange={handleChange}
        required
      />

      <input
        name="salary"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Salary"
        value={form.salary}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : employee ? "Update" : "Add"}
      </button>

      {employee && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}