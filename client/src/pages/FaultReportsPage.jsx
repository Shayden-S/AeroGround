import React, { useEffect, useMemo, useState } from 'react';
import { faultCategories, faultStages } from '../data/faultData';
import './FaultReportsPage.css';

export default function FaultReportsPage() {

  // =========================================================
  // STATE
  // =========================================================

  const [faults, setFaults] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [status, setStatus] = useState('All');

  const [note, setNote] = useState('');

  const emptyForm = {
    equipmentId: '',
    category: '',
    severity: 'Medium',
    description: '',
    location: '',
    reportedBy: '',
    grounded: false
  };

  const [form, setForm] = useState(emptyForm);


  // =========================================================
  // LOAD FAULT REPORTS FROM MYSQL
  // =========================================================

  useEffect(() => {

    const loadFaults = async () => {

      try {

        const response = await fetch(
          'http://localhost/aeroground-api/faults/get.php'
        );

        const result = await response.json();

        if (result.success) {
          setFaults(result.data);
        }

      } catch (error) {

        console.error(
          'Unable to load fault reports:',
          error
        );

      }
    };

    loadFaults();

  }, []);


  // =========================================================
  // LOAD EQUIPMENT FROM MYSQL
  // =========================================================

  useEffect(() => {

    const loadEquipment = async () => {

      try {

        const response = await fetch(
          'http://localhost/aeroground-api/equipment/get.php'
        );

        const result = await response.json();

        if (result.success) {
          setEquipmentList(result.data);
        }

      } catch (error) {

        console.error(
          'Unable to load equipment:',
          error
        );

      }
    };

    loadEquipment();

  }, []);


  // =========================================================
  // FILTER FAULT REPORTS
  // =========================================================

  const filtered = useMemo(() => {

    return faults.filter(fault => {

      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        fault.id?.toLowerCase().includes(searchText) ||
        fault.equipmentId?.toLowerCase().includes(searchText) ||
        fault.category?.toLowerCase().includes(searchText) ||
        fault.description?.toLowerCase().includes(searchText);

      const matchesSeverity =
        severity === 'All' ||
        fault.severity === severity;

      const matchesStatus =
        status === 'All' ||
        fault.status === status;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );

    });

  }, [faults, search, severity, status]);


  // =========================================================
  // SELECTED FAULT
  // =========================================================

  const selected = faults.find(
    fault => fault.id === selectedId
  );


  // =========================================================
  // UPDATE FAULT
  // =========================================================

  const update = async (id, changes) => {

    const existing = faults.find(
      fault => fault.id === id
    );

    if (!existing) return;

    const updated = {
      ...existing,
      ...changes
    };

    setFaults(current =>
      current.map(fault =>
        fault.id === id
          ? updated
          : fault
      )
    );

    try {

      const response = await fetch(
        'http://localhost/aeroground-api/faults/update.php',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(updated)
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

    } catch (error) {

      console.error(
        'Unable to update fault:',
        error
      );

    }
  };


  // =========================================================
  // OPEN / CLOSE NEW FAULT MODAL
  // =========================================================

  const openNew = () => {

    setForm(emptyForm);
    setIsNew(true);

  };


  const closeNew = () => {

    setIsNew(false);
    setForm(emptyForm);

  };


  // =========================================================
  // CREATE NEW FAULT
  // =========================================================

  const submit = async (event) => {

    event.preventDefault();

    try {

      const response = await fetch(
        'http://localhost/aeroground-api/faults/create.php',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            ...form,

            description:
              form.description.trim(),

            location:
              form.location.trim(),

            reportedBy:
              form.reportedBy.trim(),

            grounded:
              form.grounded ||
              form.severity === 'Critical'
          })
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      const newFault = {

        ...form,

        dbId: result.dbId,

        id: result.faultCode,

        description:
          form.description.trim(),

        location:
          form.location.trim(),

        reportedBy:
          form.reportedBy.trim(),

        status: 'Reported',

        reportedAt:
          new Date().toISOString(),

        notes: [],

        grounded:
          form.grounded ||
          form.severity === 'Critical'
      };

      setFaults(current => [
        newFault,
        ...current
      ]);

      closeNew();

    } catch (error) {

      console.error(error);

      alert(
        'Unable to create fault report: ' +
        error.message
      );

    }
  };


  // =========================================================
  // ADD NOTE
  // =========================================================

  const addNote = () => {

    if (!selected || !note.trim()) {
      return;
    }

    const newNote = {
      text: note.trim(),
      at: new Date().toISOString()
    };

    update(
      selected.id,
      {
        notes: [
          ...(selected.notes || []),
          newNote
        ]
      }
    );

    setNote('');
  };


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="fault-page">

      {/* HEADER */}

      <div className="fault-header">

        <div>

          <h1>Fault Reports</h1>

          <p>
            Report, track and manage ground support
            equipment faults.
          </p>

        </div>

        <button
          className="btn-danger"
          onClick={openNew}
        >
          + Report Fault
        </button>

      </div>


      {/* SUMMARY */}

      <div className="fault-summary">

        <SummaryCard
          title="Total Faults"
          value={faults.length}
        />

        <SummaryCard
          title="Critical"
          value={
            faults.filter(
              f => f.severity === 'Critical'
            ).length
          }
        />

        <SummaryCard
          title="Open"
          value={
            faults.filter(
              f => f.status !== 'Resolved'
            ).length
          }
        />

        <SummaryCard
          title="Safety Lockouts"
          value={
            faults.filter(
              f => f.grounded
            ).length
          }
        />

      </div>


      {/* FILTERS */}

      <div className="fault-toolbar">

        <input
          className="form-input"
          placeholder="Search fault reports..."
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
        />

        <select
          className="form-input"
          value={severity}
          onChange={e =>
            setSeverity(e.target.value)
          }
        >

          {[
            'All',
            'Low',
            'Medium',
            'High',
            'Critical'
          ].map(item => (

            <option
              key={item}
              value={item}
            >
              {
                item === 'All'
                  ? 'All severities'
                  : item
              }
            </option>

          ))}

        </select>

        <select
          className="form-input"
          value={status}
          onChange={e =>
            setStatus(e.target.value)
          }
        >

          <option value="All">
            All statuses
          </option>

          {faultStages.map(stage => (

            <option
              key={stage}
              value={stage}
            >
              {stage}
            </option>

          ))}

        </select>

      </div>


      {/* TABLE */}

      <div className="fault-table-scroll">

        <table className="fault-table">

          <thead>

            <tr>

              <th>Fault ID</th>
              <th>Equipment</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Description</th>
              <th>Location</th>
              <th>Status</th>
              <th>Safety</th>
              <th>Reported</th>

            </tr>

          </thead>

          <tbody>

            {filtered.length === 0 && (

              <tr>

                <td
                  colSpan="9"
                  style={{
                    textAlign: 'center',
                    padding: '30px'
                  }}
                >
                  No fault reports found.
                </td>

              </tr>

            )}

            {filtered.map(fault => {

              const equipment =
                equipmentList.find(
                  item =>
                    item.id ===
                    fault.equipmentId
                );

              return (

                <tr
                  key={fault.id}
                  onClick={() =>
                    setSelectedId(fault.id)
                  }
                  style={{
                    cursor: 'pointer'
                  }}
                >

                  <td>
                    <strong>
                      {fault.id}
                    </strong>
                  </td>

                  <td>

                    <strong>
                      {fault.equipmentId}
                    </strong>

                    <div>
                      <small>
                        {
                          equipment?.category ||
                          'Equipment'
                        }
                      </small>
                    </div>

                  </td>

                  <td>
                    {fault.category}
                  </td>

                  <td>

                    <Badge
                      value={fault.severity}
                    />

                  </td>

                  <td>
                    {fault.description}
                  </td>

                  <td>
                    {fault.location}
                  </td>

                  <td>

                    <Badge
                      value={fault.status}
                    />

                  </td>

                  <td>

                    {
                      fault.grounded
                        ? 'LOCKED OUT'
                        : 'Operational'
                    }

                  </td>

                  <td>

                    {
                      fault.reportedAt
                        ? new Date(
                            fault.reportedAt
                          ).toLocaleString()
                        : '-'
                    }

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          NEW FAULT MODAL
      ====================================================== */}

      <Modal
        isOpen={isNew}
        onClose={closeNew}
        title="Report equipment fault"
        subtitle="Log a defect for the ramp safety team"
        maxWidth="650px"
      >

        <form
          onSubmit={submit}
          className="fault-form"
        >

          <div className="fault-form-grid">

            <Field label="Equipment ID">

              <select
                className="form-input"
                required
                value={form.equipmentId}
                onChange={e => {

                  const item =
                    equipmentList.find(
                      x =>
                        x.id ===
                        e.target.value
                    );

                  setForm({
                    ...form,

                    equipmentId:
                      e.target.value,

                    location:
                      item?.location || ''
                  });

                }}
              >

                <option value="">
                  Select equipment
                </option>

                {equipmentList.map(
                  equipment => (

                    <option
                      key={equipment.id}
                      value={equipment.id}
                    >
                      {equipment.id}
                      {' — '}
                      {equipment.category}
                    </option>

                  )
                )}

              </select>

            </Field>


            <Field label="Fault category">

              <select
                className="form-input"
                required
                value={form.category}
                onChange={e =>
                  setForm({
                    ...form,
                    category:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select category
                </option>

                {faultCategories.map(
                  category => (

                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>

                  )
                )}

              </select>

            </Field>


            <Field label="Severity">

              <select
                className="form-input"
                value={form.severity}
                onChange={e =>
                  setForm({
                    ...form,

                    severity:
                      e.target.value,

                    grounded:
                      e.target.value ===
                      'Critical'
                        ? true
                        : form.grounded
                  })
                }
              >

                {[
                  'Low',
                  'Medium',
                  'High',
                  'Critical'
                ].map(item => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                ))}

              </select>

            </Field>


            <Field label="Location">

              <input
                className="form-input"
                required
                maxLength={100}
                value={form.location}
                onChange={e =>
                  setForm({
                    ...form,
                    location:
                      e.target.value
                  })
                }
              />

            </Field>


            <Field label="Reported by">

              <input
                className="form-input"
                required
                maxLength={80}
                placeholder="Your name or employee ID"
                value={form.reportedBy}
                onChange={e =>
                  setForm({
                    ...form,
                    reportedBy:
                      e.target.value
                  })
                }
              />

            </Field>

          </div>


          <Field label="Fault description">

            <textarea
              className="form-input fault-textarea"
              required
              minLength={10}
              maxLength={800}
              placeholder="Describe the symptoms and when they occurred"
              value={form.description}
              onChange={e =>
                setForm({
                  ...form,
                  description:
                    e.target.value
                })
              }
            />

          </Field>


          <label className="fault-check">

            <input
              type="checkbox"
              checked={
                form.grounded ||
                form.severity ===
                  'Critical'
              }
              disabled={
                form.severity ===
                'Critical'
              }
              onChange={e =>
                setForm({
                  ...form,
                  grounded:
                    e.target.checked
                })
              }
            />

            Ground equipment / apply safety lockout

          </label>


          {form.severity === 'Critical' && (

            <p className="fault-warning">
              Critical faults automatically
              require a safety lockout.
            </p>

          )}


          <div className="fault-actions">

            <button
              type="button"
              className="btn-secondary"
              onClick={closeNew}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-danger"
            >
              Submit fault report
            </button>

          </div>

        </form>

      </Modal>


      {/* =====================================================
          FAULT DETAILS MODAL
      ====================================================== */}

      <Modal
        isOpen={!!selected}
        onClose={() =>
          setSelectedId(null)
        }
        title={
          selected
            ? selected.id
            : 'Fault details'
        }
        subtitle={
          selected
            ? `${selected.equipmentId} — ${selected.category}`
            : ''
        }
        maxWidth="760px"
      >

        {selected && (

          <div className="fault-detail">

            <div className="fault-detail-grid">

              <Detail
                title="Equipment"
                value={
                  selected.equipmentId
                }
              />

              <Detail
                title="Category"
                value={
                  selected.category
                }
              />

              <Detail
                title="Severity"
                value={
                  selected.severity
                }
              />

              <Detail
                title="Location"
                value={
                  selected.location
                }
              />

              <Detail
                title="Reported by"
                value={
                  selected.reportedBy
                }
              />

              <Detail
                title="Reported at"
                value={
                  selected.reportedAt
                    ? new Date(
                        selected.reportedAt
                      ).toLocaleString()
                    : '-'
                }
              />

            </div>


            <div className="fault-description">

              <strong>
                Fault description
              </strong>

              <p>
                {selected.description}
              </p>

            </div>


            {/* WORKFLOW STATUS */}

            <Field label="Workflow status">

              <select
                className="form-input"
                value={selected.status}
                onChange={e =>
                  update(
                    selected.id,
                    {
                      status:
                        e.target.value
                    }
                  )
                }
              >

                {faultStages.map(stage => (

                  <option
                    key={stage}
                    value={stage}
                  >
                    {stage}
                  </option>

                ))}

              </select>

            </Field>


            {/* SAFETY LOCKOUT */}

            <label className="fault-check">

              <input
                type="checkbox"
                checked={
                  !!selected.grounded
                }
                onChange={e =>
                  update(
                    selected.id,
                    {
                      grounded:
                        e.target.checked
                    }
                  )
                }
              />

              Equipment safety lockout /
              grounded

            </label>


            {/* NOTES */}

            <div className="fault-notes">

              <h3>
                Response Notes
              </h3>

              {
                !selected.notes ||
                selected.notes.length === 0
                  ? (
                    <p>
                      No response notes yet.
                    </p>
                  )
                  : (
                    selected.notes.map(
                      (item, index) => (

                        <div
                          className="fault-note"
                          key={index}
                        >

                          <p>
                            {item.text}
                          </p>

                          <small>

                            {
                              item.at
                                ? new Date(
                                    item.at
                                  ).toLocaleString()
                                : ''
                            }

                          </small>

                        </div>

                      )
                    )
                  )
              }


              <textarea
                className="form-input fault-textarea"
                placeholder="Add response note..."
                value={note}
                onChange={e =>
                  setNote(
                    e.target.value
                  )
                }
              />


              <button
                type="button"
                className="btn-secondary"
                onClick={addNote}
              >
                Add note
              </button>

            </div>

          </div>

        )}

      </Modal>

    </div>
  );
}


// =========================================================
// FIELD COMPONENT
// =========================================================

function Field({
  label,
  children
}) {

  return (

    <label className="fault-field">

      <span>
        {label}
      </span>

      {children}

    </label>

  );
}


// =========================================================
// DETAIL COMPONENT
// =========================================================

function Detail({
  title,
  value
}) {

  return (

    <div>

      <dt>
        {title}
      </dt>

      <dd>
        {value || '-'}
      </dd>

    </div>

  );
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  title,
  value
}) {

  return (

    <div className="fault-summary-card">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );
}


// =========================================================
// BADGE
// =========================================================

function Badge({ value }) {

  const type =
    ['Critical', 'High'].includes(value)
      ? 'danger'
      : ['Medium', 'In Progress', 'Inspection'].includes(value)
        ? 'warning'
        : ['Resolved', 'Low'].includes(value)
          ? 'success'
          : 'blue';

  return (

    <span
      className={`fault-badge ${type}`}
    >
      {value}
    </span>

  );
}


// =========================================================
// MODAL
// =========================================================

function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '700px'
}) {

  if (!isOpen) {
    return null;
  }

  return (

    <div
      className="fault-modal-overlay"
      onMouseDown={onClose}
    >

      <div
        className="fault-modal"
        style={{ maxWidth }}
        onMouseDown={event =>
          event.stopPropagation()
        }
      >

        <div className="fault-modal-header">

          <div>

            <h2>
              {title}
            </h2>

            {
              subtitle && (
                <p>
                  {subtitle}
                </p>
              )
            }

          </div>

          <button
            type="button"
            className="fault-modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <div className="fault-modal-body">

          {children}

        </div>

      </div>

    </div>

  );
}