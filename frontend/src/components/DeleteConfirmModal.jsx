import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({
  employee,
  loading,
  onCancel,
  onConfirm,
}) {
  if (!employee) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="delete-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top">
          <div className="delete-warning-icon">
            <AlertTriangle size={24} />
          </div>

          <button
            className="action-btn"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        <h2 id="delete-title">Delete Employee?</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{employee.name}</strong>?
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="danger-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}