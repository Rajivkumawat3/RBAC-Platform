import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/schema.css";

export default function SchemaList({ userRole }) {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedSchemaDef, setSelectedSchemaDef] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editRecordId, setEditRecordId] = useState(null);

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const res = await API.get("/admin/models", { withCredentials: true });
        if (res.data.success && Array.isArray(res.data.models)) {
          setSchemas(res.data.models);
        }
      } catch (err) {
        console.error("❌ Failed to fetch schemas:", err);
        alert("Failed to load schema list");
      }
    };
    fetchSchemas();
  }, []);

  const fetchRecords = async (schemaName) => {
    if (!schemaName) return;
    setLoading(true);
    try {
      const { data } = await API.get(`/api/${schemaName.toLowerCase()}`, {
        withCredentials: true,
      });
      setRecords(data);
      const schemaDef = schemas.find(
        (s) => s.name.toLowerCase() === schemaName.toLowerCase()
      );
      setSelectedSchemaDef(schemaDef);
    } catch (err) {
      console.error(`❌ Failed to load records for ${schemaName}:`, err);
      alert(`Failed to load records for ${schemaName}`);
    } finally {
      setLoading(false);
    }
  };

  const getAllowedActions = () => {
    if (!selectedSchemaDef?.rbac) return [];
    const rbac = Object.fromEntries(
      Object.entries(selectedSchemaDef.rbac).map(([role, actions]) => [
        role.toLowerCase(),
        actions,
      ])
    );
    const role = userRole?.toLowerCase();
    let actions = rbac[role] || [];
    if (actions.includes("all")) actions = ["create", "read", "update", "delete"];
    return actions;
  };

  const allowedActions = getAllowedActions();

  const handleDelete = async (schemaName, id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await API.delete(`/api/${schemaName.toLowerCase()}/${id}`, {
        withCredentials: true,
      });
      alert("🗑️ Record deleted!");
      fetchRecords(schemaName);
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const schemaName = selectedSchema.toLowerCase();
      await API.post(`/api/${schemaName}`, formData, { withCredentials: true });
      alert("✅ Record created successfully!");
      setShowAddForm(false);
      setFormData({});
      fetchRecords(selectedSchema);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create record");
    }
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditRecordId(record.id);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const schemaName = selectedSchema.toLowerCase();
      await API.put(`/api/${schemaName}/${editRecordId}`, formData, {
        withCredentials: true,
      });
      alert("✏️ Record updated successfully!");
      setShowEditForm(false);
      fetchRecords(selectedSchema);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update record");
    }
  };

  return (
    <div className="schema-view">
      <h3>View Schemas</h3>

      <select
        value={selectedSchema}
        onChange={(e) => {
          const name = e.target.value;
          setSelectedSchema(name);
          fetchRecords(name);
        }}
      >
        <option value="">-- Select Schema --</option>
        {schemas.map((schema, i) => (
          <option key={i} value={schema.name.toLowerCase()}>
            {schema.name}
          </option>
        ))}
      </select>

      {selectedSchema && (
        <p className="permissions-info">
          As <b>{userRole}</b>, you can perform{" "}
          {allowedActions.length > 0 ? (
            <>
              <b>{allowedActions.join(", ")}</b> actions on <b>{selectedSchema}</b> schema.
            </>
          ) : (
            <b>no actions</b>
          )}
        </p>
      )}

      {selectedSchema &&
        allowedActions.includes("create") &&
        !showEditForm && (
          <button
            className="add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "❌ Cancel" : "➕ Add New Record"}
          </button>
        )}

      {showAddForm && selectedSchemaDef && (
        <form className="add-record-form" onSubmit={handleCreate}>
          <h4>Add New Record to {selectedSchemaDef.name}</h4>
          {selectedSchemaDef.fields.map((field, idx) => (
            <div key={idx} className="form-group">
              <label>
                {field.name} {field.required && <span className="required">*</span>}
              </label>
              <input
                type={
                  field.type === "boolean"
                    ? "checkbox"
                    : field.type === "number"
                    ? "number"
                    : "text"
                }
                name={field.name}
                value={
                  field.type === "boolean"
                    ? undefined
                    : formData[field.name] || ""
                }
                checked={
                  field.type === "boolean" ? !!formData[field.name] : undefined
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field.name]:
                      field.type === "boolean"
                        ? e.target.checked
                        : e.target.value,
                  })
                }
                required={field.required || false}
              />
            </div>
          ))}
          <button type="submit" className="submit-btn">
            ✅ Create Record
          </button>
        </form>
      )}


      {showEditForm && selectedSchemaDef && (
        <form className="add-record-form" onSubmit={handleUpdate}>
          <h4>Edit Record (ID: {editRecordId})</h4>
          {selectedSchemaDef.fields.map((field, idx) => (
            <div key={idx} className="form-group">
              <label>
                {field.name} {field.required && <span className="required">*</span>}
              </label>
              <input
                type={
                  field.type === "boolean"
                    ? "checkbox"
                    : field.type === "number"
                    ? "number"
                    : "text"
                }
                name={field.name}
                value={
                  field.type === "boolean"
                    ? undefined
                    : formData[field.name] || ""
                }
                checked={
                  field.type === "boolean" ? !!formData[field.name] : undefined
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field.name]:
                      field.type === "boolean"
                        ? e.target.checked
                        : e.target.value,
                  })
                }
                required={field.required || false}
              />
            </div>
          ))}
          <button type="submit" className="submit-btn">
            💾 Save Changes
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setShowEditForm(false);
              setFormData({});
            }}
          >
            ❌ Cancel
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading records...</p>
      ) : (
        selectedSchema &&
        !showAddForm &&
        !showEditForm && (
          <div className="table-container">
            {records.length === 0 ? (
              <p>No records found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    {Object.keys(records[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                    {allowedActions.includes("update") ||
                    allowedActions.includes("delete") ? (
                      <th>Actions</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {records.map((row) => (
                    <tr key={row.id}>
                      {Object.values(row).map((val, idx) => (
                        <td key={idx}>{String(val)}</td>
                      ))}
                      {(allowedActions.includes("update") ||
                        allowedActions.includes("delete")) && (
                        <td>
                          {allowedActions.includes("update") && (
                            <button onClick={() => handleEdit(row)}>📝</button>
                          )}
                          {allowedActions.includes("delete") && (
                            <button
                              onClick={() =>
                                handleDelete(selectedSchema, row.id)
                              }
                            >
                              🗑️
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )
      )}
    </div>
  );
}
