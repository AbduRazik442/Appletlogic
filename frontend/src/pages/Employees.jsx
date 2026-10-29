import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, RefreshCw } from "lucide-react";

import EmployeeTable from "../components/EmployeeTable";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

import {
    getEmployees,
    deleteEmployee,
} from "../services/employeeApi";

export default function Employees() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let active = true;

        const timer = setTimeout(async () => {
            try {
                if (active) {
                    setLoading(true);
                    setError("");
                }

                const { data } = await getEmployees(search);

                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.employees)
                        ? data.employees
                        : Array.isArray(data.data)
                            ? data.data
                            : null;

                if (!list) {
                    throw new Error("Invalid employee response");
                }

                if (active) setEmployees(list);
            } catch (err) {
                if (active) {
                    setEmployees([]);
                    setError(
                        err.response?.data?.message ||
                        "Failed to load employees."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }, search ? 300 : 0);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [search, refreshKey]);

    const handleDelete = async () => {
        if (!deleteTarget || deleting) return;

        setDeleting(true);
        setError("");

        try {
            await deleteEmployee(deleteTarget._id);

            setEmployees((previous) =>
                previous.filter(
                    (employee) => employee._id !== deleteTarget._id
                )
            );

            setSuccess("Employee deleted successfully!");
            setDeleteTarget(null);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete employee."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="page-stack">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">WORKSPACE / EMPLOYEES</p>
                    <h1>Employees</h1>
                    <p>Manage all your employee records.</p>
                </div>

                <Link
                    to="/employees/add"
                    className="primary-button"
                >
                    <Plus size={18} />
                    Add Employee
                </Link>
            </div>

            {error && (
                <div className="form-alert" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-alert" role="status">
                    {success}
                </div>
            )}

            <section className="content-panel">
                <div className="employee-toolbar">
                    <div className="employee-search">
                        <Search size={18} />

                        <input
                            type="search"
                            placeholder="Search employees by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button
                        className="refresh-button"
                        onClick={() => setRefreshKey((v) => v + 1)}
                        aria-label="Refresh employees"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                {loading ? (
                    <div className="employee-empty">
                        <p>Loading employees...</p>
                    </div>
                ) : (
                    <EmployeeTable
                        employees={employees}
                        onView={(id) => navigate(`/employees/${id}`)}
                        onEdit={(id) => navigate(`/employees/${id}/edit`)}
                        onDelete={(employee) => setDeleteTarget(employee)}
                    />
                )}
            </section>

            <DeleteConfirmModal
                employee={deleteTarget}
                loading={deleting}
                onCancel={() => {
                    if (!deleting) setDeleteTarget(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
}
