// Final Header_Table.jsx for managing Windows Errors with import/export support
import React, { useState, useEffect } from 'react';
import styles from './Header_Table.module.css';
import sharedCss from '../Shared.module.css';
import { FaEdit } from 'react-icons/fa';
import EditOverlay from '../EditOverlay/EditOverlay';

const Header_Table = ({ title = "All Windows Errors", profileName = "Admin" }) => {
  const [errors, setErrors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [editError, setEditError] = useState(null);
  const itemsPerPage = 10;
  const token = JSON.parse(sessionStorage.getItem('user'))?.token;

  const fetchErrors = async () => {
    try {
      const url = `/api/WindowsError?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&sort=asc`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      const allErrors = Array.isArray(json.error) ? json.error : [json.error];
      setErrors(allErrors);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch errors", err);
    }
  };

  useEffect(() => { fetchErrors(); }, [currentPage, searchTerm]);

  const handleSelectAll = (e) => {
    setSelectedItems(e.target.checked ? errors.map(item => item._id) : []);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleDelete = async () => {
    for (let id of selectedItems) {
      await fetch(`/api/WindowsError/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }
    setSelectedItems([]);
    fetchErrors();
  };

  const handleOverlaySubmit = async (data) => {
    const method = editError ? 'PATCH' : 'POST';
    const url = editError ? `/api/WindowsError/${editError._id}` : '/api/WindowsError';

    const payload = {
      error_code: data.error_code?.trim(),
      description: data.description?.trim(),
      solution: data.solution?.trim(),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        setShowOverlay(false);
        setEditError(null);
        fetchErrors();
      } else {
        alert(result.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit. Check network or required fields.");
    }
  };

  const openEditForm = (error) => {
    setEditError(error);
    setShowOverlay(true);
  };

  const downloadCSV = async () => {
  try {
    const res = await fetch(`/api/WindowsError/export/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    const allErrors = Array.isArray(json.errors) ? json.errors : [];

    const header = ['ID', 'Error Code', 'Description', 'Solution'];
    const rows = allErrors.map(e => [e._id, e.error_code, e.description, e.solution]);
    const csv = [header, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_windows_errors.csv';
    a.click();
  } catch (err) {
    alert("Failed to download all errors.");
    console.error("Download failed:", err);
  }
};


const handleImportCSV = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const lines = event.target.result.split('\n');
    const rows = lines.slice(1).filter(Boolean);

    let successCount = 0;
    for (let i = 0; i < rows.length; i++) {
      const line = rows[i].trim();
      const [id, code, desc, sol] = line.split(',');

      if (!code || !desc || !sol) {
        console.warn(`Skipped line ${i + 2}: Missing fields`);
        continue;
      }

      const res = await fetch('/api/WindowsError', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          error_code: code.trim(),
          description: desc.trim(),
          solution: sol.trim()
        })
      });

      if (res.ok) successCount++;
      else console.warn(`Line ${i + 2} failed:`, await res.text());
    }

    alert(`${successCount} rows imported successfully.`);
    fetchErrors();
  };

  reader.readAsText(file);
};


  const truncate = (text, length = 40) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.profile}>
          <img src="https://dashboard.codeparrot.ai/api/image/Z9LSe5IdzXb5OlG8/rectangl.png" alt="Profile" className={styles.profileImg} />
          <span className={styles.profileName}>{profileName}</span>
          <img src="https://dashboard.codeparrot.ai/api/image/Z9LSe5IdzXb5OlG8/chevron.png" alt="Chevron" className={styles.chevron} />
        </div>
      </div>

      <div className={sharedCss.innerDivArea}>
        <div className={styles.controls}>
          <div className={styles.addButton} onClick={() => { setEditError(null); setShowOverlay(true); }}>
            <span>Add</span>
            <img className={styles.addImg} src="https://dashboard.codeparrot.ai/api/image/Z9MAtCppvFKitUEH/image-90.png" alt="add" />
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            style={{ display: 'none' }}
            id="importCsv"
          />
          <label htmlFor="importCsv" className={styles.downloadBtn}>Import CSV</label>
          <input
            type="text"
            placeholder="Search by error code"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.deleteBtn} onClick={handleDelete} disabled={selectedItems.length === 0}>
            <span>Delete</span>
            <img src="https://dashboard.codeparrot.ai/api/image/Z9LSe5IdzXb5OlG8/group-33-6.png" alt="Delete" />
          </button>
          <button className={styles.downloadBtn} onClick={downloadCSV}>
            <span>Download</span>
            <img src="https://dashboard.codeparrot.ai/api/image/Z9LSe5IdzXb5OlG8/group-33-5.png" alt="Download" />
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCell}>
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === errors.length} />
                  <span>All</span>
                </th>
                <th>ID</th>
                <th>Error Code</th>
                <th>Description</th>
                <th>Solution</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {errors.map(error => (
                <tr key={error._id}>
                  <td className={styles.checkboxCell}>
                    <input type="checkbox" checked={selectedItems.includes(error._id)} onChange={() => handleSelectItem(error._id)} />
                  </td>
                  <td>{error._id}</td>
                  <td>{error.error_code}</td>
                  <td>{truncate(error.description)}</td>
                  <td>{truncate(error.solution)}</td>
                  <td>
                    <FaEdit className={styles.editIcon} onClick={() => openEditForm(error)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button className={styles.paginationBtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
          <div className={styles.pageNumbers}>
                      <span onClick={() => {
                        const neededPage = parseInt(prompt("Please type the page you want to go to"));
                        if (isNaN(neededPage)) {
                          alert("Please write a number");
                          return;
                        }
                        if (neededPage < 1 || neededPage > totalPages) {
                          alert(`Please keep the number between 1 and ${totalPages}`);
                          return;
                        }
                        setCurrentPage(neededPage);
                      }}>Page {currentPage} out of {totalPages}</span>
                    </div>
          <button className={styles.paginationBtn} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      {showOverlay && (
        <EditOverlay
          title={editError ? 'Edit Error' : 'Add Error'}
          fieldsJson={{
            error_code: 'text',
            description: 'text',
            solution: 'text'
          }}
          initialValues={{ error_code: '', description: '', solution: '', ...(editError || {}) }}
          onCancel={() => setShowOverlay(false)}
          onSubmit={handleOverlaySubmit}
        />
      )}
    </div>
  );
};

export default Header_Table;
