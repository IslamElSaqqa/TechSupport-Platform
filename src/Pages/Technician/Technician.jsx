import { useState, useEffect } from 'react';
import styles from './App.module.css';
import { useGetTechnicianProfile } from '../../Hooks/Technician/useGetTechnicianData';
import { useTechnicianContext } from '../../Hooks/Technician/useTechnicianContext';
import { usePaginatedFetch} from "../../Hooks/Technician/useTechnicianFetchReq"
const Technician = () => {
    const [page, setPage] = useState(1);
    // const { data, pagination } = usePaginatedFetch('/api/helpSession', page);
    const { data, pagination } = usePaginatedFetch('/api/helpSession', page)
    const { getTechnician, error, isLoading } = useGetTechnicianProfile()
    const { technician } = useTechnicianContext()
    
    // Technician states
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [specialization, setSpecialization] = useState('')
    const [techImage, setTechImage] = useState('')

    // Requests States
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");
    const [showNotePopup, setShowNotePopup] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [selectedType, setSelectedType] = useState(null);

    // we need to ensure technician data is fetched only once!
    const [profileFetched, setProfileFetched] = useState(false);

    useEffect(() => { 
    if (!technician?.token || !technician?._id || profileFetched) {
        return;
        }

            // fetch profile data
    const fetchTechProfile = async () => {

        const profile = await getTechnician(); 

        if (profile) {
            setName(profile.name || '');
            setEmail(profile.email || '');
            setPhone(profile.phone_number || '');
            setTechImage(profile.image_url || 'https://i.pinimg.com/736x/69/72/31/697231a4de0d35e182ca377a448d8da5.jpg')
            setSpecialization(profile.specialization || '')
            // setInitialData({
            //     name: profile.name || '',
            //     email: profile.email || '',
            //     phone: profile.phone_number || '',
            //     image_url: profile.image_url || 'https://i.pinimg.com/736x/69/72/31/697231a4de0d35e182ca377a448d8da5.jpg',
            //     specialization: profile.specialization
            // });
        setProfileFetched(true);  
    }
    };

    fetchTechProfile(); 
}, [technician, profileFetched, getTechnician]);

    
    useEffect(() => {
        if (data && data.length) {
            setFilteredData(data);
        }
    }, [data]);

    const filterData = (status) => {
        setActiveFilter(status);
        if (status === "All") {
            setFilteredData(data);
        } else {
            const filtered = data.filter((row) => row.status === status.toLowerCase());
            setFilteredData(filtered);
        }
        setShowDropdown(false);
    };

    const handleStatusChange = (requestId, newStatus) => {
        const updatedData = data.map(request =>
            request._id === requestId ? { ...request, status: newStatus } : request
        );
        setFilteredData(
            activeFilter === "All" ? updatedData : updatedData.filter(row => row.status === activeFilter.toLowerCase())
        );
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.pages) {
            setPage(newPage);
        }
    };

    const handleRowClick = (request) => setSelectedRequest(request);
    const handleBack = () => setSelectedRequest(null);
    const handleAddNote = () => setShowNotePopup(true);

    const handleNoteSubmit = () => {
        if (!newNote.trim()) return;
        const updatedData = data.map((request) =>
            request._id === selectedRequest._id
                ? {
                    ...request,
                    notes: [...(request.notes || []), {
                        id: Date.now(),
                        text: newNote,
                        date: new Date().toISOString().split('T')[0]
                    }]
                }
                : request
        );
        setFilteredData(updatedData);
        setSelectedRequest(updatedData.find(r => r._id === selectedRequest._id));
        setNewNote("");
        setShowNotePopup(false);
    };

    return (
        <div className={styles.container}>
        <div className={styles.topSection}>
            <div className={styles.textContent}>
            <h1>Technician Profile</h1>
            <div className={styles.imageContent}>
                <img
                    src={techImage || "https://i.pinimg.com/736x/69/72/31/697231a4de0d35e182ca377a448d8da5.jpg"}
                alt="Technician Avatar"
                />
            </div>
            </div>
            <div>
            <h2 className={styles.Name}>Name</h2>
                    <p>{ name}</p>
            <h2 className={styles.Department}>Department</h2>
                    <p>{ specialization}</p>
            </div>
            <div>
            <h2 className={styles.Phone}>Phone</h2>
                    <p>{ phone}</p>
            <h2 className={styles.Email}>Email</h2>
                    <p>{ email}</p>
            </div>
        </div>

        <div className={styles.bottomSection}>
            <h2 className={styles.customerRequestsHeading}>Customer Requests</h2>
            
            {!selectedRequest ? (
            <>
                <div className={styles.filters}>
                <button 
                    onClick={() => filterData("All")}
                    className={`${styles.filtersButton} ${activeFilter === "All" ? styles.activeFilter : ""}`}
                >
                    All Requests
                </button>
                <div className={styles.dropdown}>
                    <button 
                    className={`${styles.dropdownToggle} ${activeFilter !== "All" ? styles.activeFilter : ""}`}
                    onClick={() => setShowDropdown(!showDropdown)}
                    >
                    {activeFilter === "All" ? "Filter by Status" : activeFilter + " Requests"}
                    </button>
                    {showDropdown && (
                    <div className={styles.dropdownMenu}>
                        <button className={styles.dropdownMenuButton} onClick={() => filterData("Pending")}>Pending</button>
                        <button className={styles.dropdownMenuButton} onClick={() => filterData("Accepted")}>Accepted</button>
                        <button className={styles.dropdownMenuButton} onClick={() => filterData("Rejected")}>Rejected</button>
                    </div>
                    )}
                </div>
                </div>

                <div className={styles.tableContainer}>
                <table className={styles.fullWidthTable}>
                    <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableHeaderCell}>Request ID</th>
                        <th className={styles.tableHeaderCell}>Description</th>
                        <th className={styles.tableHeaderCell}>Request Date</th>
                        <th className={styles.tableHeaderCell}>Reference ID</th>
                        <th className={styles.tableHeaderCell}>Status</th>
                        <th className={styles.tableHeaderCell}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((row) => (
                        <tr key={row._id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{row._id}</td>
                        <td className={styles.tableCell}>
                            <a href="#" className={styles.detailLink} onClick={(e) => { e.preventDefault(); handleRowClick(row); }}>
                            View Details
                            </a>
                        </td>
                        <td className={styles.tableCell}>{new Date(row.createdAt).toLocaleDateString()}</td>
                        <td className={styles.tableCell}>{row.instapay_reference || "N/A"}</td>
                        <td className={styles.tableCell}>
                            <span className={`${styles.statusBadge} ${
                            row.status.toLowerCase() === 'pending' ? styles.statusBadgePending :
                            row.status.toLowerCase() === 'accepted' ? styles.statusBadgeAccepted :
                            styles.statusBadgeRejected
                            }`}>
                            {row.status}
                            </span>
                        </td>
                        <td className={styles.tableCell}>
                            {row.status === "pending" ? (
                            <div className={styles.actionButtons}>
                                <button className={styles.acceptButton} onClick={() => handleStatusChange(row._id, "accepted")}>Accept</button>
                                <button className={styles.rejectButton} onClick={() => handleStatusChange(row._id, "rejected")}>Reject</button>
                            </div>
                            ) : (
                            <button className={styles.resetButton} onClick={() => handleStatusChange(row._id, "pending")}>Reset</button>
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                {pagination && (
                <div className={styles.paginationControls}>
                    <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    >
                    Previous
                    </button>
                    <span>Page {page} of {pagination.pages}</span>
                    <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.pages}
                    >
                    Next
                    </button>
                </div>
                )}
            </>
            ) : (
            <div className={styles.requestDetails}>
                <div className={styles.detailActionsTop}>
                <button onClick={handleBack} className={styles.backButton}>Back to Table</button>
                <button onClick={handleAddNote} className={styles.addNoteButton}>Add Note</button>
                </div>
                <h3>Request Details</h3>
                <div className={styles.detailItem}><strong>ID:</strong> {selectedRequest._id}</div>
            <div className={styles.detailItem}>
    <strong>Type:</strong> 
    {selectedType ? (
        <div className={styles.typeButtonsContainer}>
        <span className={styles.selectedType}>{selectedType}</span>
        <button 
            className={styles.resetTypeButton}
            onClick={() => setSelectedType(null)}
        >
            Reset
        </button>
        </div>
    ) : (
        <div className={styles.typeOptions}>
        <button 
            className={styles.typeButton}
            onClick={() => setSelectedType('long')}
        >
            Long
        </button>
        <button 
            className={styles.typeButton}
            onClick={() => setSelectedType('short')}
        >
            Short
        </button>
        </div>
    )}
    </div>

                <div className={styles.detailItem}><strong>Title:</strong> {selectedRequest.title}</div>
                <div className={styles.detailItem}><strong>Description:</strong> {selectedRequest.description}</div>
                <div className={styles.detailItem}><strong>Date:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</div>
                <div className={styles.detailItem}><strong>Status:</strong> {selectedRequest.status}</div>

                {selectedRequest.notes?.length > 0 && (
                <div className={styles.detailItem}>
                    <strong>Notes:</strong>
                    <ul className={styles.notesContainer}>
                    {selectedRequest.notes.map(note => (
                        <li key={note.id} className={styles.noteItem}>
                        <div className={styles.noteDate}>{note.date}</div>
                        <div className={styles.noteText}>{note.text}</div>
                        </li>
                    ))}
                    </ul>
                </div>
                )}

                {selectedRequest.status === "pending" && (
                <div className={styles.detailActions}>
                    <button className={styles.acceptButton} onClick={() => { handleStatusChange(selectedRequest._id, "accepted"); handleBack(); }}>Accept</button>
                    <button className={styles.rejectButton} onClick={() => { handleStatusChange(selectedRequest._id, "rejected"); handleBack(); }}>Reject</button>
                </div>
                )}
            </div>
            )}

            {showNotePopup && (
            <div className={styles.notePopupOverlay}>
                <div className={styles.notePopup}>
                <h3>Add Note</h3>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note here..."
                />
                <div className={styles.notePopupButtons}>
                    <button onClick={handleNoteSubmit} className={styles.submitNoteButton}>Submit</button>
                    <button
                    onClick={() => {
                        setNewNote("");
                        setShowNotePopup(false);
                    }}
                    className={styles.cancelNoteButton}
                    >
                    Cancel
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
};

export default Technician;