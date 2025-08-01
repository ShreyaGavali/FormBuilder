import React, { useEffect, useState } from 'react';
import './PublishPopup.css';
import vectorImg from '../../assets/Vector.png';
import axios from 'axios';

const PublishPopup = ({ onClose, formId, onShowLinkPopup }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [showDropdown, setShowDropdown] = useState(false);
    const [accessType, setAccessType] = useState('Anyone');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [sharedEmails, setSharedEmails] = useState([]);
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [emailActions, setEmailActions] = useState([]);

    useEffect(() => {
        const fetchOwnerEmail = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/forms/${formId}/owner-email`);
                setOwnerEmail(res.data.email);
            } catch (error) {
                console.error('Error fetching owner email:', error);
            }
        };

        if (formId) fetchOwnerEmail();
    }, [formId]);

    const handleAccessChange = (type) => {
        setAccessType(type);
        setShowDropdown(false);
    };

    const handleAddEmail = () => {
        if (newEmail.trim()) {
            setSharedEmails([...sharedEmails, newEmail.trim()]);
            setEmailActions([...emailActions, 'edit']);
            setNewEmail('');
            setShowEmailInput(false);
        }
    };

    const handlePublish = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        if (accessType === 'Restricted' && sharedEmails.length > 0) {
            try {
                const sharesPayload = sharedEmails.map((email, idx) => ({
                    email,
                    access: emailActions[idx] || 'view'
                }));

                await axios.post(
                    `${backendUrl}/api/forms/form/${formId}/share`,
                    { formId, shares: sharesPayload },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert('Form shared successfully!');
                onClose();
            } catch (error) {
                console.error('Error sharing form:', error);
                alert('Failed to share form. Please try again.');
            }
        } else if (accessType === 'Anyone') {
            onClose(); // hide publish popup
            setTimeout(() => {
                onShowLinkPopup(); // then show link popup
            }, 200);
        }
    };

    return (
        <div className="publish-popup-overlay">
            <div className="publish-popup">
                <div className="publish-header">
                    <div className="publish-div">
                        <img src={vectorImg} alt="" />
                        <span>Publish</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="publish-section">
                    <label>Save to</label>
                    <div className="publish-row">
                        <span>Project</span>
                        <button className="blue-link">Change</button>
                    </div>
                </div>

                <div className="publish-section">
                    <label>Responders</label>
                    <div className="publish-row">
                        <span>{accessType} with the Link</span>
                        <div className="dropdown-wrapper">
                            <button className="blue-link" onClick={() => setShowDropdown(!showDropdown)}>Manage</button>
                            {showDropdown && (
                                <div className="access-dropdown">
                                    <div onClick={() => handleAccessChange('Anyone')}>Anyone</div>
                                    <div onClick={() => handleAccessChange('Restricted')}>Restricted</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {accessType === 'Restricted' && (
                    <div className="publish-section">
                        <label>Share</label>

                        <div className="email-row">
                            <div className="mail-circle"></div>
                            <span>{ownerEmail || 'Loading...'}</span>
                            <span className="badge">Owner</span>
                        </div>

                        {sharedEmails.map((email, idx) => (
                            <div key={idx} className="email-row">
                                <div className="mail-circle"></div>
                                <span>{email}</span>
                                <div className="dropdown-wrapper">
                                    <button
                                        className="edit-link"
                                        onClick={() =>
                                            setDropdownIndex(dropdownIndex === idx ? null : idx)
                                        }
                                    >
                                        {emailActions[idx] === 'share'
                                            ? 'Share'
                                            : emailActions[idx] === 'view'
                                                ? 'View'
                                                : 'Edit'}
                                    </button>
                                    {dropdownIndex === idx && (
                                        <div className="access-dropdown small">
                                            <div
                                                onClick={() => {
                                                    const updated = [...emailActions];
                                                    updated[idx] = 'edit';
                                                    setEmailActions(updated);
                                                    setDropdownIndex(null);
                                                }}
                                            >
                                                Edit
                                            </div>
                                            <div
                                                onClick={() => {
                                                    const updated = [...emailActions];
                                                    updated[idx] = 'share';
                                                    setEmailActions(updated);
                                                    setDropdownIndex(null);
                                                }}
                                            >
                                                Share
                                            </div>
                                            <div
                                                onClick={() => {
                                                    const updated = [...emailActions];
                                                    updated[idx] = 'view';
                                                    setEmailActions(updated);
                                                    setDropdownIndex(null);
                                                }}
                                            >
                                                View
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {showEmailInput ? (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="email-input"
                                />
                                <button className="blue-link" onClick={handleAddEmail}>Add</button>
                            </div>
                        ) : (
                            <button
                                className="add-mails-btn"
                                onClick={() => setShowEmailInput(true)}
                            >
                                + Add Mails
                            </button>
                        )}
                    </div>
                )}

                <button className="publish-btn" onClick={handlePublish}>Publish</button>
            </div>
        </div>
    );
};

export default PublishPopup;
