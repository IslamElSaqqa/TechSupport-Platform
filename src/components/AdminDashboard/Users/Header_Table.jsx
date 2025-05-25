// Final Header_Table.jsx with user_presence dropdown fix and password fields removed from Edit
import React, { useState, useEffect } from 'react';
import styles from './Header_Table.module.css';
import sharedCss from '../Shared.module.css';
import { FaEdit } from 'react-icons/fa';
import EditOverlay from '../EditOverlay/EditOverlay';

const Header_Table = ({ title = "All Users", profileName = "Admin" }) => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const token = JSON.parse(sessionStorage.getItem('user'))?.token;
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      let url = `/api/users?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&sort=${sortOrder}`;
      if (userTypeFilter !== '') url += `&presence=${userTypeFilter}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await response.json();
      setRequests(json.users || []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => { fetchUsers(); }, [currentPage, searchTerm, sortOrder, userTypeFilter]);

  const handleSelectAll = (e) => {
    setSelectedItems(e.target.checked ? requests.map(item => item._id) : []);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleDelete = async () => {
    for (let id of selectedItems) {
      await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setSelectedItems([]);
    fetchUsers();
  };


  const handleOverlaySubmit = async (data) => {
    const method = editUser ? 'PATCH' : 'POST';
    const url = editUser ? `/api/users/adminUpdate/${editUser._id}` : '/api/users/register';

    const payload = {
      ...data,
      user_presence: Number(data.user_presence),
      ...(editUser ? {} : { password_hash: data.password_hash || 'Default@123' })
    };

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    setShowOverlay(false);
    setEditUser(null);
    fetchUsers();
  };

  const openEditForm = (user) => {
    setEditUser(user);
    setShowOverlay(true);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const downloadCSV = () => {
    const header = ['User ID', 'Username', 'Email', 'Phone', 'User Type'];
    const rows = requests.map(user => [user._id, user.username, user.email, user.phone_number, user.user_presence === 1 ? 'Admin' : 'User']);
    const csv = [header, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'winerrors.csv';
    a.click();
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
          <div className={styles.addButton} onClick={() => { setEditUser(null); setShowOverlay(true); }}>
            <span>Add</span>
                        <img className={styles.addImg} src="https://dashboard.codeparrot.ai/api/image/Z9MAtCppvFKitUEH/image-90.png" alt="add" />
                      
          </div>
          <input
            type="text"
            placeholder="Search by username, email, or phone"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className={styles.selectWrapper} value={userTypeFilter} onChange={(e) => setUserTypeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="1">Admin</option>
            <option value="0">User</option>
          </select>
          <button className={styles.downloadBtn} onClick={toggleSortOrder}>
            Sort: {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
          </button>
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
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === requests.length} />
                  <span>All</span>
                </th>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>User Type</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(user => (
                <tr key={user._id}>
                  <td className={styles.checkboxCell}>
                    <input type="checkbox" checked={selectedItems.includes(user._id)} onChange={() => handleSelectItem(user._id)} />
                  </td>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number}</td>
                  <td>{user.user_presence === 1 ? 'Admin' : 'User'}</td>
                  <td>
                    <FaEdit className={styles.editIcon} onClick={() => openEditForm(user)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button className={styles.paginationBtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
          <div className={styles.pageNumbers}>
          <span onClick={ () => {
                const neededPage = parseInt(prompt("Please type the page you want to go to"));
                if (isNaN(neededPage)){
                    alert("Please write a number");
                    return;
                }
                if (neededPage < 1 || neededPage > totalPages){
                    alert(`Please keep the number between 1 and ${totalPages}`);
                    return;
                }
                setCurrentPage(parseInt(neededPage));
              }}>Page {currentPage} out of {totalPages}</span>
          </div>
          <button className={styles.paginationBtn} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      {showOverlay && (
        <EditOverlay
          title={editUser ? 'Edit Request' : 'Add Request'}
          fieldsJson={{
            username: 'text',
            email: 'email',
            phone_number: 'text',
            ...(editUser ? {} : { password_hash: 'password' }),
            user_presence: {
              type: 'select',
              options: [
                { label: 'User', value: 0 },
                { label: 'Admin', value: 1 }
              ]
            }
          }}
          initialValues={editUser || { user_presence: 0 }}
          onCancel={() => setShowOverlay(false)}
          onSubmit={handleOverlaySubmit}
        />
      )}
    </div>
  );
};

export default Header_Table;