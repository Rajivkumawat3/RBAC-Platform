import React, { useEffect, useState } from "react";
import API from "../api";

export default function CreateSchemaForm() {
  const [modelName, setModelName] = useState("");
  const [fields, setFields] = useState([]);
  const [roles, setRoles] = useState([]); 
  const [rbac, setRbac] = useState({});

  const [newField, setNewField] = useState({
    name: "",
    type: "string",
    required: false,
    default: "",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await API.get("/admin/users", { withCredentials: true });
        const uniqueRoles = [...new Set(data.map((u) => u.role))];
        setRoles(uniqueRoles);

        const initialRBAC = {};
        uniqueRoles.forEach((r) => {
          initialRBAC[r] = [];
        });
        setRbac(initialRBAC);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, []);

  const addField = () => {
    if (!newField.name.trim()) return alert("Field name is required");
    setFields([...fields, newField]);
    setNewField({ name: "", type: "string", required: false, default: "" });
  };

  const togglePermission = (role, perm) => {
    setRbac((prev) => {
      const currentPerms = prev[role] || [];
      let updated;

      if (currentPerms.includes(perm)) {
        updated = currentPerms.filter((p) => p !== perm);
      } else {
        if (perm === "all") updated = ["all"];
        else updated = [...currentPerms.filter((p) => p !== "all"), perm];
      }

      return { ...prev, [role]: updated };
    });
  };

  const handlePublish = async () => {
    if (!modelName.trim()) return alert("Model name required");
    if (fields.length === 0) return alert("At least one field required");

    const schema = {
      name: modelName,
      fields,
      rbac,
    };

    try {
      const res = await API.post("/admin/models/publish", schema, {
        withCredentials: true,
      });
      alert(res.data.message || "✅ Schema published successfully!");
      setModelName("");
      setFields([]);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to publish schema");
    }
  };

  return (
    <div className="create-schema">
      <h3>🧩 Create New Schema</h3>

      <input
        type="text"
        placeholder="Model Name (e.g. Employee)"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
      />

      <div className="fields-section">
        <h4>Fields</h4>
        {fields.map((f, i) => (
          <div key={i} className="field-item">
            {f.name} ({f.type}) {f.required ? "⭐" : ""}
          </div>
        ))}

        <div className="field-form">
          <input
            placeholder="Field Name"
            value={newField.name}
            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
          />
          <select
            value={newField.type}
            onChange={(e) => setNewField({ ...newField, type: e.target.value })}
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="float">Float</option>
            <option value="boolean">Boolean</option>
            <option value="text">Text</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={newField.required}
              onChange={(e) =>
                setNewField({ ...newField, required: e.target.checked })
              }
            />
            Required
          </label>
          <input
            placeholder="Default Value"
            value={newField.default}
            onChange={(e) =>
              setNewField({ ...newField, default: e.target.value })
            }
          />
          <button onClick={addField}>➕ Add Field</button>
        </div>
      </div>

      <div className="rbac-section">
        <h4>Role-Based Access Control</h4>
        {roles.map((role, index) => (
          <div key={index} className="rbac-role">
            <strong>{role}</strong>
            {["all", "create", "read", "update", "delete"].map((perm) => (
              <label key={perm}>
                <input
                  type="checkbox"
                  checked={rbac[role]?.includes(perm)}
                  onChange={() => togglePermission(role, perm)}
                />
                {perm}
              </label>
            ))}
          </div>
        ))}
      </div>

      <button className="publish-btn" onClick={handlePublish}>
        🚀 Publish Schema
      </button>
    </div>
  );
}
