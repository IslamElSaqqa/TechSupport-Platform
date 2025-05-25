// Updated EditOverlay.jsx to support select dropdowns with labels
import React, { useState, useEffect } from 'react';
import styles from './EditOverlay.module.css';

const EditOverlay = ({ title = 'Edit Request', fieldsJson, onCancel, onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const base = Object.keys(fieldsJson).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setFormData({ ...base, ...initialValues });
  }, [fieldsJson, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const formatLabel = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {Object.entries(fieldsJson).map(([key, config]) => {
            if (typeof config === 'object' && config.type === 'select') {
              return (
                <div key={key} className={styles.formGroup}>
                  <label htmlFor={key} className={styles.label}>{formatLabel(key)}</label>
                  <select
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  >
                    <option value="">Select...</option>
                    {config.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              );
            }
            return (
              <div key={key} className={styles.formGroup}>
                <label htmlFor={key} className={styles.label}>{formatLabel(key)}</label>
                <input
                  type={config}
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            );
          })}
          <div className={styles.actions}>
            <button type="button" onClick={onCancel} className={`${styles.button} ${styles.cancelButton}`}>
              Cancel
            </button>
            <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOverlay;
