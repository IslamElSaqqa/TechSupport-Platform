import React, { useState, useEffect } from 'react';
import styles from './Header_Table.module.css';
import sharedCss from '../Shared.module.css';
import { FaEdit } from 'react-icons/fa';
import EditOverlay from '../EditOverlay/EditOverlay';
import _ from "lodash";

const Header_Table = ({  title = "Repair Shops", profileName = "Admin"  }) => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [editData, setEditData] = useState(null);
  const [shopsTypeFilter, setShopsTypeFilter] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [allShops, setAllShops] = useState([]);

  const token = JSON.parse(sessionStorage.getItem('user'))?.token;
  const itemsPerPage = 6;


  const handleSelectAll = (e) => {
    setSelectedItems(e.target.checked ? requests.map(item => item._id) : []);
  };

  const handleDelete = async () => {
    for (let id of selectedItems) {
      await fetch(`/api/serviceShops/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setSelectedItems([]);
    fetchShops();
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const openEditForm = (user) => {
    setEditData(user);
    setShowOverlay(true);
  };

  const downloadCSV = async () => {
    const header = ['Shop ID', 'name', 'area', 'gov', 'rating'];
    await fetchAllShops();
    console.log(allShops);
    console.log("YES ALL OF THEM ARE PULLED");
    if (_.isEqual(allShops, [])) {
      return;
    }
    const rows = allShops.map(shop => [shop._id, shop.name, shop.area, shop.gov, shop.rating]);
    const csv = [header, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shops.csv';
    a.click();
  };

  const fetchAllShops = async () => {
    try {
      let url = `/api/serviceShops/shops`;
      const response = await fetch(url);
      const json = await response.json();
      setAllShops(json.data);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    }
  }

  const fetchShops = async () => {
    try {
      let url = `/api/serviceShops/getShopsPaginated?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&sort=${sortOrder}`;
      if (shopsTypeFilter !== '') url += `&presence=${shopsTypeFilter}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await response.json();
      setRequests(json.shops || []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    }
  };

  const handleOverlaySubmit = async (data) => {
    const method = editData ? 'PATCH' : 'POST';
    const url = editData ? `/api/serviceShops/${editData._id}` : '/api/serviceShops/';
    const payload = {...data};

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    setShowOverlay(false);
    setEditData(null);
    fetchShops();
  };


  useEffect(() => { fetchShops(); }, [currentPage, searchTerm, sortOrder, shopsTypeFilter]);

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
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
          <div className={styles.addButton} onClick={() => { setEditData(null); setShowOverlay(true); }}>
            <span>Add</span>
                        <img className={styles.addImg} src="https://dashboard.codeparrot.ai/api/image/Z9MAtCppvFKitUEH/image-90.png" alt="add" />
                      
          </div>
          <input
            type="text"
            placeholder="Search by name, area or gov"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <th>Shop ID</th>
                <th>name</th>
                <th>area</th>
                <th>gov</th>
                <th>rating</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(shop => (
                <tr key={shop._id}>
                  <td className={styles.checkboxCell}>
                    <input type="checkbox" checked={selectedItems.includes(shop._id)} onChange={() => handleSelectItem(shop._id)} />
                  </td>
                  <td>{shop._id}</td>
                  <td>{shop.name}</td>
                  <td>{shop.area}</td>
                  <td>{shop.gov}</td>
                  <td>{shop.rating}</td>
                  <td>
                    <FaEdit className={styles.editIcon} onClick={() => openEditForm(shop)} />
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
          title={editData ? 'Edit Request' : 'Add Request'}
          fieldsJson={{
            name: 'text',
            area: 'text',
            gov: 'text',
            rating: 'Number',
            link: 'text'
          }}
          initialValues={editData}
          onCancel={() => setShowOverlay(false)}
          onSubmit={handleOverlaySubmit}
        />
      )}
    </div>
  );
};

export default Header_Table;