import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  ClipboardCheck,
  Plus
} from 'lucide-react';

import Modal from '../components/common/Modal';

import {
  inspectionChecks
} from '../data/operationsData';

import {
  OpsHeader,
  OpsMetric,
  OpsBadge
} from '../components/common/OperationsUI';

import './OperationsPages.css';


const today =
  new Date().toISOString().slice(0, 10);


export default function InspectionsPage() {

  // ========================================================
  // STATE
  // ========================================================

  const [rows, setRows] =
    useState([]);

  const [equipmentList, setEquipmentList] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [equipmentId, setEquipmentId] =
    useState('');

  const [inspector, setInspector] =
    useState('');

  const [type, setType] =
    useState('Pre-use');

  const [checks, setChecks] =
    useState({});

  const [message, setMessage] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // ========================================================
  // LOAD INSPECTIONS + EQUIPMENT
  // ========================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);

        const [
          inspectionsResponse,
          equipmentResponse
        ] = await Promise.all([

          fetch(
            'http://localhost/aeroground-api/inspections/get.php'
          ),

          fetch(
            'http://localhost/aeroground-api/equipment/get.php'
          )

        ]);


        const inspectionsResult =
          await inspectionsResponse.json();

        const equipmentResult =
          await equipmentResponse.json();


        if (!inspectionsResult.success) {

          throw new Error(
            inspectionsResult.message ||
            'Unable to load inspections.'
          );

        }


        if (!equipmentResult.success) {

          throw new Error(
            equipmentResult.message ||
            'Unable to load equipment.'
          );

        }


        setRows(
          inspectionsResult.data || []
        );


        setEquipmentList(
          equipmentResult.data || []
        );


      } catch (error) {

        console.error(
          'Inspection loading error:',
          error
        );

        setMessage(
          'Unable to load inspection data: ' +
          error.message
        );


      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, []);


  // ========================================================
  // METRICS
  // ========================================================

  const pending =
    useMemo(
      () =>
        rows.filter(
          row =>
            row.status === 'Pending'
        ).length,
      [rows]
    );


  const completedToday =
    useMemo(
      () =>
        rows.filter(
          row =>
            row.status === 'Completed' &&
            row.date === today
        ).length,
      [rows]
    );


  const failed =
    useMemo(
      () =>
        rows.filter(
          row =>
            row.result === 'Fail'
        ).length,
      [rows]
    );


  const overdue =
    useMemo(
      () =>
        rows.filter(
          row =>
            row.status === 'Pending' &&
            row.date < today
        ).length,
      [rows]
    );


  // ========================================================
  // OPEN NEW INSPECTION
  // ========================================================

  const start = () => {

    setEquipmentId('');
    setInspector('');
    setType('Pre-use');
    setChecks({});
    setMessage('');
    setOpen(true);

  };


  // ========================================================
  // CLOSE MODAL
  // ========================================================

  const close = () => {

    if (saving) {
      return;
    }

    setOpen(false);
    setEquipmentId('');
    setInspector('');
    setType('Pre-use');
    setChecks({});

  };


  // ========================================================
  // COMPLETE INSPECTION
  // ========================================================

  const finish = async event => {

    event.preventDefault();

    setMessage('');


    // Every checklist item must be completed

    if (
      Object.keys(checks).length !==
      inspectionChecks.length
    ) {

      setMessage(
        'Please complete every checklist item.'
      );

      return;
    }


    const results =
      Object.values(checks);


    let result = 'Pass';


    if (
      results.includes('Fail')
    ) {

      result = 'Fail';

    } else if (
      results.includes(
        'Needs Attention'
      )
    ) {

      result = 'Needs Attention';

    }


    const payload = {

      equipmentId,

      inspector:
        inspector.trim(),

      type,

      checks,

      result,

      status: 'Completed',

      date: today

    };


    try {

      setSaving(true);


      const response = await fetch(
        'http://localhost/aeroground-api/inspections/save.php',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(payload)
        }
      );


      const responseText =
        await response.text();


      let data;


      try {

        data =
          JSON.parse(responseText);

      } catch {

        throw new Error(
          'PHP returned an invalid response: ' +
          responseText
        );

      }


      if (!data.success) {

        throw new Error(
          data.message ||
          'Unable to save inspection.'
        );

      }


      const newInspection = {

        dbId:
          data.dbId,

        id:
          data.inspectionCode,

        equipmentId,

        inspector:
          inspector.trim(),

        type,

        checks,

        result,

        status:
          'Completed',

        date:
          today

      };


      setRows(current => [
        newInspection,
        ...current
      ]);


      setMessage(
        `${data.inspectionCode} completed successfully.`
      );


      setOpen(false);

      setEquipmentId('');
      setInspector('');
      setType('Pre-use');
      setChecks({});


    } catch (error) {

      console.error(
        'Inspection save error:',
        error
      );


      setMessage(
        'Unable to save inspection: ' +
        error.message
      );


    } finally {

      setSaving(false);

    }

  };


  // ========================================================
  // PAGE
  // ========================================================

  return (

    <div className="ops-page">

      {/* HEADER */}

      <OpsHeader
        title="Airside Quality & Safety Inspections"
        subtitle="Record equipment walkarounds and safety checks before dispatch."
        action={

          <button
            className="btn-primary"
            onClick={start}
          >

            <Plus size={15} />

            Start Inspection

          </button>

        }
      />


      {/* MESSAGE */}

      {message && (

        <div
          className="ops-toast"
          role="alert"
        >
          {message}
        </div>

      )}


      {/* METRICS */}

      <div className="ops-metrics">

        <OpsMetric
          label="Pending"
          value={pending}
        />

        <OpsMetric
          label="Completed today"
          value={completedToday}
        />

        <OpsMetric
          label="Failed"
          value={failed}
        />

        <OpsMetric
          label="Overdue"
          value={overdue}
        />

      </div>


      {/* REGISTER */}

      <section className="aeroground-card">

        <div className="ops-section-head ops-card">

          <h2>
            Inspection register
          </h2>

          <ClipboardCheck
            size={18}
            color="var(--primary)"
          />

        </div>


        {loading ? (

          <p
            className="ops-muted"
            style={{
              padding: '20px'
            }}
          >
            Loading inspections from MySQL...
          </p>

        ) : (

          <div className="ops-table-wrap">

            <table className="ops-table">

              <thead>

                <tr>

                  <th>
                    Inspection ID
                  </th>

                  <th>
                    Equipment
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Inspector
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Result
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {rows.length === 0 && (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign:
                          'center',
                        padding:
                          '30px'
                      }}
                    >

                      No inspections have been
                      recorded yet.

                    </td>

                  </tr>

                )}


                {rows.map(row => (

                  <tr key={row.id}>

                    <td>

                      <strong>
                        {row.id}
                      </strong>

                    </td>


                    <td>
                      {row.equipmentId}
                    </td>


                    <td>
                      {row.type}
                    </td>


                    <td>
                      {row.inspector}
                    </td>


                    <td>
                      {row.date}
                    </td>


                    <td>

                      <OpsBadge
                        text={row.result}
                      />

                    </td>


                    <td>

                      <OpsBadge
                        text={row.status}
                      />

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>


      <p className="ops-muted">

        Inspection records are stored in the
        AeroGround MySQL database. Failed or
        attention-required checks remain visible
        in the inspection register for safety
        review.

      </p>


      {/* ====================================================
          INSPECTION MODAL
      ===================================================== */}

      <Modal
        isOpen={open}
        onClose={close}
        title="Start equipment inspection"
        subtitle="All checklist items require a result"
        maxWidth="650px"
      >

        <form
          onSubmit={finish}
          className="ops-form"
        >


          {/* EQUIPMENT */}

          <label className="ops-field">

            Equipment

            <select
              className="form-input"
              required
              value={equipmentId}
              onChange={
                event =>
                  setEquipmentId(
                    event.target.value
                  )
              }
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

          </label>


          {/* TYPE */}

          <label className="ops-field">

            Inspection type

            <select
              className="form-input"
              value={type}
              onChange={
                event =>
                  setType(
                    event.target.value
                  )
              }
            >

              {[
                'Pre-use',
                'Periodic',
                'Safety',
                'Post-repair'
              ].map(item => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </label>


          {/* INSPECTOR */}

          <label className="ops-field full">

            Inspector

            <input
              className="form-input"
              required
              maxLength={80}
              value={inspector}
              onChange={
                event =>
                  setInspector(
                    event.target.value
                  )
              }
              placeholder="Name or employee ID"
            />

          </label>


          {/* CHECKLIST */}

          <div className="ops-field full">

            <span>

              Checklist
              {' ('}

              {
                Object.keys(checks)
                  .length
              }

              /

              {
                inspectionChecks.length
              }

              {')'}

            </span>


            <div className="ops-checklist">

              {inspectionChecks.map(
                item => (

                  <label
                    className="ops-check-row"
                    key={item}
                  >

                    {item}


                    <select
                      className="form-select"
                      required
                      value={
                        checks[item] ||
                        ''
                      }
                      onChange={
                        event =>
                          setChecks(
                            current => ({
                              ...current,

                              [item]:
                                event.target
                                  .value
                            })
                          )
                      }
                    >

                      <option value="">
                        Select result
                      </option>

                      <option value="Pass">
                        Pass
                      </option>

                      <option value="Needs Attention">
                        Needs Attention
                      </option>

                      <option value="Fail">
                        Fail
                      </option>

                    </select>

                  </label>

                )
              )}

            </div>

          </div>


          {/* BUTTONS */}

          <div className="ops-form-actions">

            <button
              type="button"
              className="btn-secondary"
              onClick={close}
              disabled={saving}
            >
              Cancel
            </button>


            <button
              className="btn-primary"
              type="submit"
              disabled={saving}
            >

              {
                saving
                  ? 'Saving...'
                  : 'Complete inspection'
              }

            </button>

          </div>

        </form>

      </Modal>

    </div>

  );

}