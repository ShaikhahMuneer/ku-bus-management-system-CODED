import React, { useState } from "react";
import { Plus, Calendar } from "lucide-react";

function ReportsTab({ reports, addReport }) {
  const [showForm, setShowForm] = useState(false);
  const [route, setRoute] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!route || !description) { alert("Please fill all fields."); return; }
    addReport({ route, text: description });
    setRoute(""); setDescription(""); setShowForm(false);
  };
  return (
    <section className="section-card reports-page">
      <div className="reports-header"><div><h2>My Reports</h2><p>Track your submitted complaints and feedback</p></div><button className="submit-report-top-btn" onClick={() => setShowForm(true)}><Plus size={16} />Submit Report</button></div>
      {showForm && <form className="report-form-box" onSubmit={handleSubmit}>
        <h3>Submit New Report</h3><label>Select Route *</label>
        <select value={route} onChange={(e) => setRoute(e.target.value)}><option value="">Choose a route</option><option value="Shuwaikh → Al-Shadadiya">Shuwaikh → Al-Shadadiya</option><option value="Jabriya → Al-Shadadiya">Jabriya → Al-Shadadiya</option><option value="Adailiya → Al-Shadadiya">Adailiya → Al-Shadadiya</option><option value="North Campus → South Campus">North Campus → South Campus</option><option value="Hawalli City → Al-Shadadiya">Hawalli City → Al-Shadadiya</option></select>
        <label>Description *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue you experienced..." />
        <div className="report-form-actions"><button type="button" className="report-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="report-submit-btn">Submit Report</button></div>
      </form>}
      <div className="reports-list">{reports.map((report) => <div key={report.id} className="report-card"><div><h3>{report.route}</h3><div className="report-date"><Calendar size={15} /><span>{report.date}</span></div><p>{report.text}</p></div><span className={`report-status ${report.status === "Resolved" ? "status-resolved" : "status-progress"}`}>{report.status}</span></div>)}</div>
    </section>
  );
}
export default ReportsTab;
