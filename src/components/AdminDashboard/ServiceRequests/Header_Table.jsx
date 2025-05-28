import React, { useState, useEffect } from "react";
import styles from "./Header_Table.module.css";
import sharedCss from "../Shared.module.css";
import { FaEdit } from "react-icons/fa";
import EditOverlay from "../EditOverlay/EditOverlay";
import Details from "../Details/Details";
import _ from "lodash";

const Header_Table = ({
  title = "Service Requests",
  profileName = "Admin",
}) => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [editData, setEditData] = useState(null);
  const [shopsTypeFilter, setShopsTypeFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [allShops, setAllShops] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState(null);

  const token = JSON.parse(sessionStorage.getItem("user"))?.token;
  const itemsPerPage = 6;

  const handleSelectAll = (e) => {
    setSelectedItems(e.target.checked ? requests.map((item) => item._id) : []);
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDetailsClick = (row) => {
    setDetailsData(row);
    setShowDetails(true);
  };

  const handleDelete = async () => {
    for (let id of selectedItems) {
      await fetch(`/api/helpSession/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setSelectedItems([]);
    fetchRequests();
  };

  const handleOverlaySubmit = async (data) => {
    const method = "PATCH";
    const url = `/api/helpSession/${editData._id}`;
    const payload = { ...data };

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    setShowOverlay(false);
    setEditData(null);
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, searchTerm, sortOrder, shopsTypeFilter]);

  const fetchRequests = async () => {
    try {
      let url = `/api/helpSession/getRequestsPaginated?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&sort=${sortOrder}`;
      if (shopsTypeFilter !== "") url += `&presence=${shopsTypeFilter}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await response.json();
      setRequests(json.requests);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch("/api/helpSession", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to download requests");
      }

      const header = [
        "User ID",
        "User Name",
        "User phone",
        "Specialist ID",
        "Specialist Name",
        "Specialization",
        "Specialist email",
        "Specialist Phone",
        "id",
        "status",
        "instaID",
        "note",
        "description",
        "image_URL",
        "steps",
        "createdAt",
        "UpdatedAt",
      ];
      const rows = json.data.map((request) => [
        request.user._id,
        request.user.username,
        request.user ? request.user.phone : "",
        request.specialist ? request.specialist._id : "",
        request.specialist ? request.specialist.specialist_name : "",
        request.specialist ? request.specialist.specialization : "",
        request.specialist ? request.specialist.email : "",
        request.specialist ? request.specialist.phone : "",
        request._id,
        request.status,
        request.instapay_reference,
        request.note.replace(/\n/g, "<br />"),
        request.description.replace(/\n/g, "<br />"),
        request.image_url,
        request.steps.replace(/\n/g, "<br />"),
        request.createdAt,
        request.updatedAt,
      ]);
      const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "all_requests.csv";
      a.click();
    } catch (err) {
      console.error("Download error:", err);
      alert("Could not export requests");
    }
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
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const openEditForm = (user) => {
    setEditData(user);
    setShowOverlay(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.profile}>
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z9LSe5IdzXb5OlG8/rectangl.png"
            alt="Profile"
            className={styles.profileImg}
          />
          <span className={styles.profileName}>{profileName}</span>
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z9LSe5IdzXb5OlG8/chevron.png"
            alt="Chevron"
            className={styles.chevron}
          />
        </div>
      </div>

      <div className={sharedCss.innerDivArea}>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search by tech name, username or instaID"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.downloadBtn} onClick={toggleSortOrder}>
            Sort: {sortOrder === "asc" ? "Oldest" : "Newest"}
          </button>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={selectedItems.length === 0}
          >
            <span>Delete</span>
            <img
              src="https://dashboard.codeparrot.ai/api/image/Z9LSe5IdzXb5OlG8/group-33-6.png"
              alt="Delete"
            />
          </button>
          <button className={styles.downloadBtn} onClick={downloadCSV}>
            <span>Download</span>
            <img
              src="https://dashboard.codeparrot.ai/api/image/Z9LSe5IdzXb5OlG8/group-33-5.png"
              alt="Download"
            />
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === requests.length}
                  />
                  <span>All</span>
                </th>
                <th>Tech name</th>
                <th>Date</th>
                <th>Request Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Phone number</th>
                <th>Status</th>
                <th>InstaID</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(request._id)}
                      onChange={() => handleSelectItem(request._id)}
                    />
                  </td>
                  <td>
                    {request.specialist
                      ? request.specialist.specialist_name
                      : ""}
                  </td>
                  <td>{request.createdAt}</td>
                  <td>{request._id}</td>
                  <td>{request.user ? request.user.username : ""}</td>
                  <td>{request.type || ""}</td>
                  <td>{request.user ? request.user.phone : ""}</td>
                  <td>
                    <span
                      onClick={() => handleDetailsClick(request)}
                      style={{ cursor: "pointer" }}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>{request.instapay_reference}</td>
                  <td>
                    <FaEdit
                      className={styles.editIcon}
                      onClick={() => openEditForm(request)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button
            className={styles.paginationBtn}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className={styles.pageNumbers}>
            <span
              onClick={() => {
                const neededPage = parseInt(
                  prompt("Please type the page you want to go to")
                );
                if (isNaN(neededPage)) {
                  alert("Please write a number");
                  return;
                }
                if (neededPage < 1 || neededPage > totalPages) {
                  alert(`Please keep the number between 1 and ${totalPages}`);
                  return;
                }
                setCurrentPage(parseInt(neededPage));
              }}
            >
              Page {currentPage} out of {totalPages}
            </span>
          </div>
          <button
            className={styles.paginationBtn}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {showOverlay && (
        <EditOverlay
          title="Edit Request"
          fieldsJson={{
            type: {
              type: "select",
              options: [
                { label: "Short Session", value: "short" },
                { label: "Long Session", value: "long" },
              ],
            },

            status: {
              type: "select",
              options: [
                { label: "Pending", value: "pending" },
                { label: "Active", value: "active" },
                { label: "Completed", value: "completed" },
                { label: "Canceled", value: "canceled" },
              ],
            },
            description: {
              type: "textarea",
              placeholder: "Enter description of the request",
            },
            note: {
              type: "textarea",
              placeholder: "Enter any additional notes",
            },
          }}
          initialValues={editData}
          onCancel={() => setShowOverlay(false)}
          onSubmit={handleOverlaySubmit}
        />
      )}

      {showDetails && (
        <Details
          fieldsJson={{
            description: "text",
            note: "text",
          }}
          initialValues={detailsData}
          onCancel={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default Header_Table;
