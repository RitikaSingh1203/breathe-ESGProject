import { useEffect, useState } from "react"
import axios from "axios"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { useNavigate } from "react-router-dom"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Dashboard() {
  const [records, setRecords] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")

  const [form, setForm] = useState({
    plant: "",
    fuel: "",
    quantity: "",
    unit: "",
    scope: ""
  })

  const navigate = useNavigate()

  const fetchData = async () => {
    const res = await axios.get("https://esg-backend-vocs.onrender.com/api/all/")
    setRecords(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("loggedIn")
    navigate("/")
  }

  const filtered = records
    .filter(r => filter === "ALL" ? true : r.status === filter)
    .filter(r =>
      r.fuel.toLowerCase().includes(search.toLowerCase()) ||
      r.plant.toLowerCase().includes(search.toLowerCase())
    )

  // ✅ ADD RECORD
  const addRecord = async () => {
    try {
      await axios.post("https://esg-backend-vocs.onrender.com/api/add/", form)

      setForm({
        plant: "",
        fuel: "",
        quantity: "",
        unit: "",
        scope: ""
      })

      fetchData()
    } catch (err) {
      alert("Error adding record")
    }
  }

  // ✅ APPROVE RECORD
  const approveRecord = async (id) => {
    try {
      await axios.post(`https://esg-backend-vocs.onrender.com/api/approve/${id}/`)
      fetchData()
    } catch (err) {
      alert("Approve failed")
    }
  }

  // ✅ REJECT RECORD
  const rejectRecord = async (id) => {
    try {
      await axios.post(`https://esg-backend-vocs.onrender.com/api/reject/${id}/`)
      fetchData()
    } catch (err) {
      alert("Reject failed")
    }
  }

  // EXPORT CSV
  const exportCSV = () => {
    const headers = "Plant,Fuel,Quantity,Unit,Scope,Status\n"

    const rows = filtered.map(r =>
      `${r.plant},${r.fuel},${r.quantity},${r.unit},${r.scope},${r.status}`
    ).join("\n")

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;"
    })

    saveAs(blob, "esg_report.csv")
  }

  // EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text("ESG Dashboard Report", 14, 15)

    doc.setFontSize(11)
    doc.text(`Total Records: ${records.length}`, 14, 25)

    autoTable(doc, {
      startY: 35,
      head: [["Plant", "Fuel", "Qty", "Unit", "Scope", "Status"]],
      body: filtered.map(r => [
        r.plant,
        r.fuel,
        r.quantity,
        r.unit,
        r.scope,
        r.status
      ])
    })

    doc.save("esg_report.pdf")
  }

  const total = records.length
  const approved = records.filter(r => r.status === "APPROVED").length
  const pending = records.filter(r => r.status === "PENDING").length
  const rejected = records.filter(r => r.status === "REJECTED").length

  const chartData = [
    { name: "Approved", value: approved },
    { name: "Pending", value: pending },
    { name: "Rejected", value: rejected }
  ]

  const COLORS = ["#34d399", "#fbbf24", "#f87171"]

  const getStatusStyle = (status) => ({
    padding: "5px 10px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "12px",
    color: "#fff",
    background:
      status === "APPROVED"
        ? "rgba(52, 211, 153, 0.8)"
        : status === "PENDING"
        ? "rgba(251, 191, 36, 0.8)"
        : "rgba(248, 113, 113, 0.8)"
  })

  const inputStyle = {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.1)",
    color: "white"
  }

  const thStyle = {
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#e2e8f0"
  }

  const tdStyle = {
    padding: "14px",
    color: "#f8fafc"
  }

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      minHeight: "100vh",
      color: "white"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#16a34a" }}>
          🌿 ESG Dashboard
        </h1>

        <button
          onClick={handleLogout}
          style={{
            background: "rgba(239,68,68,0.9)",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* CARDS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Card title="Total" value={total} />
        <Card title="Approved" value={approved} />
        <Card title="Pending" value={pending} />
        <Card title="Rejected" value={rejected} />
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginTop: "20px",
          padding: "10px",
          width: "280px",
          borderRadius: "10px",
          border: "none",
          background: "rgba(255,255,255,0.1)",
          color: "white"
        }}
      />

      {/* FILTER */}
      <div style={{ marginTop: "15px" }}>
        {["ALL", "APPROVED", "PENDING", "REJECTED"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              background: filter === type ? "#34d399" : "#1e293b",
              color: "white"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* EXPORT BUTTONS */}
      <div style={{ marginTop: "25px", display: "flex", gap: "12px" }}>
        <button onClick={exportCSV}>📁 CSV</button>
        <button onClick={exportPDF}>📄 PDF</button>
      </div>

      {/* CHART */}
      <PieChart width={380} height={280}>
        <Pie data={chartData} dataKey="value" outerRadius={90}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* ADD NEW RECORD */}
      <div style={{
        background: "#1e293b",
        padding: "15px",
        borderRadius: "12px",
        marginTop: "20px",
        marginBottom: "20px"
      }}>
        <h3 style={{ marginBottom: "10px" }}>➕ Add New Record</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

          <input
            placeholder="Plant"
            value={form.plant}
            onChange={(e) => setForm({ ...form, plant: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Fuel"
            value={form.fuel}
            onChange={(e) => setForm({ ...form, fuel: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Unit"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Scope"
            value={form.scope}
            onChange={(e) => setForm({ ...form, scope: e.target.value })}
            style={inputStyle}
          />

          <button
            onClick={addRecord}
            style={{
              padding: "10px 15px",
              border: "none",
              borderRadius: "8px",
              background: "linear-gradient(to right,#00c853,#64dd17)",
              color: "white",
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table style={{
        width: "100%",
        marginTop: "20px",
        borderCollapse: "collapse",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "12px",
        overflow: "hidden"
      }}>

        <thead>
          <tr style={{
            background: "rgba(255,255,255,0.06)"
          }}>
            <th style={thStyle}>Plant</th>
            <th style={thStyle}>Fuel</th>
            <th style={thStyle}>Qty</th>
            <th style={thStyle}>Unit</th>
            <th style={thStyle}>Scope</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(r => (
            <tr
              key={r.id}
              style={{
                textAlign: "center",
                borderBottom: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <td style={tdStyle}>{r.plant}</td>
              <td style={tdStyle}>{r.fuel}</td>
              <td style={tdStyle}>{r.quantity}</td>
              <td style={tdStyle}>{r.unit}</td>
              <td style={tdStyle}>{r.scope}</td>

              <td style={tdStyle}>
                <span style={getStatusStyle(r.status)}>
                  {r.status}
                </span>
              </td>

              <td style={tdStyle}>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px"
                }}>

                  <button
                    onClick={() => approveRecord(r.id)}
                    style={{
                      padding: "6px 10px",
                      border: "none",
                      borderRadius: "6px",
                      background: "#22c55e",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectRecord(r.id)}
                    style={{
                      padding: "6px 10px",
                      border: "none",
                      borderRadius: "6px",
                      background: "#ef4444",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Reject
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.08)",
      padding: "15px",
      borderRadius: "12px",
      minWidth: "140px",
      textAlign: "center"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  )
}

export default Dashboard