import { useEffect, useState } from "react";
import {
    Users,
    Building2,
    Wallet,
    TrendingUp,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getEmployees } from "../services/employeeApi";

const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

export default function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await getEmployees();

                console.log("Dashboard API Response:", data);

                const employeeList = Array.isArray(data)
                    ? data
                    : Array.isArray(data.employees)
                        ? data.employees
                        : Array.isArray(data.data)
                            ? data.data
                            : null;

                if (!employeeList) {
                    throw new Error("Unexpected employee API response format");
                }

                setEmployees(employeeList);
            } catch (err) {
                console.error("Dashboard Error:", err);

                setEmployees([]);
                setError("Unable to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const total = employees.length;
    const departments = new Set(
        employees.map((e) => e.department.trim().toLowerCase())
    ).size;
    const payroll = employees.reduce(
        (sum, e) => sum + e.salary,
        0
    );

    const stats = [
        {
            label: "Total Employees",
            value: total,
            icon: Users,
        },
        {
            label: "Departments",
            value: departments,
            icon: Building2,
        },
        {
            label: "Total Payroll",
            value: currency(payroll),
            icon: Wallet,
        },
        {
            label: "Average Salary",
            value: currency(total ? payroll / total : 0),
            icon: TrendingUp,
        },
    ];

    return (
        <div className="page-stack">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">WORKSPACE OVERVIEW</p>
                    <h1>Dashboard</h1>
                    <p>Here's an overview of your workforce.</p>
                </div>

                <Link to="/employees/add" className="primary-button">
                    Add Employees <ArrowRight size={17} />
                </Link>
            </div>

            {error && <p role="alert" className="error-text">{error}</p>}

            {loading ? (
                <p>Loading dashboard...</p>
            ) : !error && (
                <>
                    <div className="stats-grid">
                        {stats.map(({ label, value, icon: Icon }) => (
                            <div className="stat-card" key={label}>
                                <div className="stat-icon">
                                    <Icon size={21} />
                                </div>
                                <p>{label}</p>
                                <h2>{value}</h2>
                            </div>
                        ))}
                    </div>

                    <section className="content-panel">
                        <div className="panel-heading">
                            <div>
                                <h2>Recent Employees</h2>
                                <p>Latest employee records</p>
                            </div>
                            <Link to="/employees">View all</Link>
                        </div>

                        {employees.length === 0 ? (
                            <p>No employees added yet.</p>
                        ) : (
                            <div className="table-scroll">
                                <table className="employee-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Department</th>
                                            <th>Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.slice(0, 5).map((e) => (
                                            <tr key={e._id}>
                                                <td>{e.name}</td>
                                                <td>{e.email}</td>
                                                <td>{e.department}</td>
                                                <td>{currency(e.salary)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}